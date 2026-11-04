const Review = require('../models/Review');
const Business = require('../models/Business');
const Favorite = require('../models/Favorite');

// @desc    Add review for a business
// @route   POST /api/reviews
// @access  Private (Tourist)
exports.addReview = async (req, res) => {
  try {
    const { businessId, rating, comment } = req.body;

    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found.'
      });
    }

    // Check if user already reviewed
    const existing = await Review.findOne({
      business: businessId,
      tourist: req.user.id
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a review for this business.'
      });
    }

    const review = await Review.create({
      business: businessId,
      tourist: req.user.id,
      rating: Number(rating),
      comment
    });

    await review.populate('tourist', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Review posted successfully!',
      data: review
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to submit review.'
    });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private (Owner, Admin)
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found.'
      });
    }

    if (review.tourist.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review.'
      });
    }

    await Review.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete review.'
    });
  }
};

// @desc    Toggle favorite on a business
// @route   POST /api/reviews/favorite/:businessId
// @access  Private (Tourist)
exports.toggleFavorite = async (req, res) => {
  try {
    const { businessId } = req.params;

    const existing = await Favorite.findOne({
      tourist: req.user.id,
      business: businessId
    });

    if (existing) {
      await Favorite.findByIdAndDelete(existing._id);
      return res.status(200).json({
        success: true,
        isFavorited: false,
        message: 'Removed from saved favorites.'
      });
    } else {
      await Favorite.create({
        tourist: req.user.id,
        business: businessId
      });
      return res.status(201).json({
        success: true,
        isFavorited: true,
        message: 'Saved to favorites!'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to toggle favorite.'
    });
  }
};

// @desc    Get user's favorites
// @route   GET /api/reviews/favorites
// @access  Private (Tourist)
exports.getMyFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ tourist: req.user.id })
      .populate({
        path: 'business',
        populate: { path: 'destination', select: 'name state' }
      })
      .sort({ createdAt: -1 });

    const businessList = favorites
      .filter(fav => fav.business)
      .map(fav => fav.business);

    res.status(200).json({
      success: true,
      count: businessList.length,
      data: businessList
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve favorites.'
    });
  }
};