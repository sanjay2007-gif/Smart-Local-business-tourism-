const Destination = require('../models/Destination');
const Business = require('../models/Business');

// @desc    Get all destinations with optional search and category filters
// @route   GET /api/destinations
// @access  Public
exports.getDestinations = async (req, res) => {
  try {
    const { category, search, state } = req.query;
    let query = {};

    if (category && category !== 'all') {
      query.category = category;
    }
    if (state) {
      query.state = new RegExp(state, 'i');
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { highlights: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const destinations = await Destination.find(query).sort({ featured: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: destinations.length,
      data: destinations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve destinations.'
    });
  }
};

// @desc    Get featured destinations for homepage
// @route   GET /api/destinations/featured
// @access  Public
exports.getFeaturedDestinations = async (req, res) => {
  try {
    const featured = await Destination.find({ featured: true }).limit(6);
    res.status(200).json({
      success: true,
      count: featured.length,
      data: featured
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve featured destinations.'
    });
  }
};

// @desc    Get single destination by ID + linked businesses
// @route   GET /api/destinations/:id
// @access  Public
exports.getDestinationById = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found.'
      });
    }

    // Also fetch businesses registered at this destination
    const businesses = await Business.find({
      destination: destination._id,
      isVerified: true
    }).populate('owner', 'name avatar');

    res.status(200).json({
      success: true,
      data: {
        destination,
        businesses
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve destination details.'
    });
  }
};

// @desc    Create new destination
// @route   POST /api/destinations
// @access  Private (Admin)
exports.createDestination = async (req, res) => {
  try {
    const destination = await Destination.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Destination created successfully.',
      data: destination
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create destination.'
    });
  }
};

// @desc    Update destination
// @route   PUT /api/destinations/:id
// @access  Private (Admin)
exports.updateDestination = async (req, res) => {
  try {
    const destination = await Destination.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found.'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Destination updated successfully.',
      data: destination
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update destination.'
    });
  }
};

// @desc    Delete destination
// @route   DELETE /api/destinations/:id
// @access  Private (Admin)
exports.deleteDestination = async (req, res) => {
  try {
    const destination = await Destination.findByIdAndDelete(req.params.id);
    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found.'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Destination deleted successfully.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete destination.'
    });
  }
};