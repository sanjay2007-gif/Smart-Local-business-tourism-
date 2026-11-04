const Business = require('../models/Business');
const Destination = require('../models/Destination');
const Review = require('../models/Review');

// @desc    Get all businesses with advanced search, filter, and sorting
// @route   GET /api/businesses
// @access  Public
exports.getBusinesses = async (req, res) => {
  try {
    const {
      category,
      destination,
      search,
      minPrice,
      maxPrice,
      minRating,
      sort,
      availability
    } = req.query;

    let query = { isVerified: true };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (destination && destination !== 'all') {
      query.destination = destination;
    }

    if (availability) {
      query.availabilityStatus = availability;
    }

    if (minPrice || maxPrice) {
      query.pricePerUnit = {};
      if (minPrice) query.pricePerUnit.$gte = Number(minPrice);
      if (maxPrice) query.pricePerUnit.$lte = Number(maxPrice);
    }

    if (minRating) {
      query.ratingAverage = { $gte: Number(minRating) };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
        { amenities: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    let sortOption = { ratingAverage: -1 };
    if (sort === 'price_asc') sortOption = { pricePerUnit: 1 };
    if (sort === 'price_desc') sortOption = { pricePerUnit: -1 };
    if (sort === 'rating') sortOption = { ratingAverage: -1 };
    if (sort === 'newest') sortOption = { createdAt: -1 };

    const businesses = await Business.find(query)
      .populate('destination', 'name state category')
      .populate('owner', 'name avatar')
      .sort(sortOption);

    res.status(200).json({
      success: true,
      count: businesses.length,
      data: businesses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve businesses.'
    });
  }
};

// @desc    Get top rated & featured businesses for homepage
// @route   GET /api/businesses/popular
// @access  Public
exports.getPopularBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find({ isVerified: true })
      .populate('destination', 'name state')
      .sort({ ratingAverage: -1, reviewCount: -1 })
      .limit(6);

    res.status(200).json({
      success: true,
      count: businesses.length,
      data: businesses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve popular businesses.'
    });
  }
};

// @desc    Get all businesses formatted specifically for Leaflet map
// @route   GET /api/businesses/map
// @access  Public
exports.getBusinessesForMap = async (req, res) => {
  try {
    const { category, destination } = req.query;
    let query = { isVerified: true };
    if (category && category !== 'all') query.category = category;
    if (destination && destination !== 'all') query.destination = destination;

    const businesses = await Business.find(query)
      .select('name category location pricePerUnit pricingUnit images ratingAverage address destination')
      .populate('destination', 'name state');

    res.status(200).json({
      success: true,
      count: businesses.length,
      data: businesses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve map markers.'
    });
  }
};

// @desc    Get single business by ID + reviews
// @route   GET /api/businesses/:id
// @access  Public
exports.getBusinessById = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id)
      .populate('destination')
      .populate('owner', 'name email phone avatar');

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found.'
      });
    }

    const reviews = await Review.find({ business: business._id })
      .populate('tourist', 'name avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        business,
        reviews
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve business details.'
    });
  }
};

// @desc    Create new business listing
// @route   POST /api/businesses
// @access  Private (business_owner, admin)
exports.createBusiness = async (req, res) => {
  try {
    const businessData = {
      ...req.body,
      owner: req.user.id,
      // Default to verified if admin, or false for moderation
      isVerified: req.user.role === 'admin' ? true : true // set true for demo simplicity, admin can toggle
    };

    const business = await Business.create(businessData);
    await business.populate('destination', 'name state');

    res.status(201).json({
      success: true,
      message: 'Business listing created successfully.',
      data: business
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create business listing.'
    });
  }
};

// @desc    Update business listing
// @route   PUT /api/businesses/:id
// @access  Private (Owner, Admin)
exports.updateBusiness = async (req, res) => {
  try {
    let business = await Business.findById(req.params.id);
    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found.'
      });
    }

    // Check ownership
    if (business.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this business.'
      });
    }

    business = await Business.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('destination');

    res.status(200).json({
      success: true,
      message: 'Business listing updated successfully.',
      data: business
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update business.'
    });
  }
};

// @desc    Delete business listing
// @route   DELETE /api/businesses/:id
// @access  Private (Owner, Admin)
exports.deleteBusiness = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found.'
      });
    }

    if (business.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this business.'
      });
    }

    await Business.findByIdAndDelete(req.params.id);
    await Review.deleteMany({ business: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Business listing deleted successfully.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete business listing.'
    });
  }
};

// @desc    Get businesses owned by current logged in user
// @route   GET /api/businesses/owner/my-listings
// @access  Private (business_owner, admin)
exports.getMyListings = async (req, res) => {
  try {
    const businesses = await Business.find({ owner: req.user.id })
      .populate('destination', 'name state')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: businesses.length,
      data: businesses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve your listings.'
    });
  }
};