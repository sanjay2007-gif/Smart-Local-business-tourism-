const Itinerary = require('../models/Itinerary');
const Destination = require('../models/Destination');
const Business = require('../models/Business');

// @desc    Generate a smart day-wise itinerary for a destination
// @route   POST /api/itineraries/generate
// @access  Public
exports.generateItinerary = async (req, res) => {
  try {
    const { destinationId, daysCount = 3, title } = req.body;

    const destination = await Destination.findById(destinationId);
    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found.'
      });
    }

    const businesses = await Business.find({
      destination: destination._id,
      isVerified: true
    });

    const days = [];
    const count = Math.min(Math.max(1, Number(daysCount)), 7);

    // Filter businesses by type
    const homestays = businesses.filter(b => b.category === 'homestay' || b.category === 'hotel');
    const guides = businesses.filter(b => b.category === 'tour_guide' || b.category === 'cultural_activity');
    const artisans = businesses.filter(b => b.category === 'artisan');
    const food = businesses.filter(b => b.category === 'restaurant');

    for (let dayNum = 1; dayNum <= count; dayNum++) {
      const activities = [];

      // Morning slot
      if (dayNum === 1 && homestays.length > 0) {
        activities.push({
          timeSlot: 'Morning',
          title: `Check-in & Welcome at ${homestays[0].name}`,
          businessId: homestays[0]._id,
          notes: 'Unpack, refresh with local welcome drinks, and soak in initial views.',
          estimatedCost: homestays[0].pricePerUnit
        });
      } else if (guides.length > 0) {
        const guide = guides[(dayNum - 1) % guides.length];
        activities.push({
          timeSlot: 'Morning',
          title: `Morning Guided Adventure: ${guide.name}`,
          businessId: guide._id,
          notes: 'Early morning scenic trek or nature walk with local naturalists.',
          estimatedCost: guide.pricePerUnit
        });
      } else {
        activities.push({
          timeSlot: 'Morning',
          title: `Explore ${destination.name} Highlights`,
          notes: destination.highlights[0] || 'Scenic sunrise viewpoint.',
          estimatedCost: 200
        });
      }

      // Afternoon slot
      if (artisans.length > 0 && dayNum % 2 === 1) {
        const artisan = artisans[(dayNum - 1) % artisans.length];
        activities.push({
          timeSlot: 'Afternoon',
          title: `Cultural Workshop at ${artisan.name}`,
          businessId: artisan._id,
          notes: 'Hands-on indigenous craft workshop and artisan interaction.',
          estimatedCost: artisan.pricePerUnit
        });
      } else if (destination.highlights.length >= 2) {
        activities.push({
          timeSlot: 'Afternoon',
          title: `Visit ${destination.highlights[dayNum % destination.highlights.length]}`,
          notes: 'Sightseeing, photography, and exploring local landscape.',
          estimatedCost: 350
        });
      } else {
        activities.push({
          timeSlot: 'Afternoon',
          title: 'Regional Handicraft & Local Bazaar Trail',
          notes: 'Shop for native spices, textiles, and authentic souvenirs.',
          estimatedCost: 500
        });
      }

      // Evening slot
      if (food.length > 0) {
        const resto = food[(dayNum - 1) % food.length];
        activities.push({
          timeSlot: 'Evening',
          title: `Traditional Feast at ${resto.name}`,
          businessId: resto._id,
          notes: 'Authentic regional dinner with indigenous spices and recipes.',
          estimatedCost: resto.pricePerUnit
        });
      } else {
        activities.push({
          timeSlot: 'Evening',
          title: 'Campfire, Folklore & Stargazing',
          notes: 'Relax under starry skies and listen to local cultural stories.',
          estimatedCost: 300
        });
      }

      days.push({
        dayNumber: dayNum,
        theme: dayNum === 1 ? 'Arrival & Orientation' : dayNum === count ? 'Culture & Departure' : 'Active Discovery & Nature',
        activities
      });
    }

    res.status(200).json({
      success: true,
      data: {
        destination,
        title: title || `${count}-Day Curated ${destination.name} Journey`,
        daysCount: count,
        days
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate itinerary.'
    });
  }
};

// @desc    Save an itinerary
// @route   POST /api/itineraries
// @access  Private (Tourist)
exports.saveItinerary = async (req, res) => {
  try {
    const { destinationId, title, daysCount, days, startDate } = req.body;

    const itinerary = await Itinerary.create({
      tourist: req.user.id,
      destination: destinationId,
      title,
      daysCount: Number(daysCount) || days.length,
      startDate: startDate || new Date(),
      days
    });

    await itinerary.populate('destination', 'name state category images');

    res.status(201).json({
      success: true,
      message: 'Itinerary saved to your dashboard!',
      data: itinerary
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to save itinerary.'
    });
  }
};

// @desc    Get current user itineraries
// @route   GET /api/itineraries/my-itineraries
// @access  Private (Tourist)
exports.getMyItineraries = async (req, res) => {
  try {
    const itineraries = await Itinerary.find({ tourist: req.user.id })
      .populate('destination', 'name state category images')
      .populate('days.activities.businessId', 'name category pricePerUnit')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: itineraries.length,
      data: itineraries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve your itineraries.'
    });
  }
};

// @desc    Delete itinerary
// @route   DELETE /api/itineraries/:id
// @access  Private (Tourist, Admin)
exports.deleteItinerary = async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);
    if (!itinerary) {
      return res.status(404).json({
        success: false,
        message: 'Itinerary not found.'
      });
    }

    if (itinerary.tourist.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this itinerary.'
      });
    }

    await Itinerary.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Itinerary deleted successfully.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete itinerary.'
    });
  }
};