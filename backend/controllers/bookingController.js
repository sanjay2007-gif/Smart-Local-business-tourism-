const Booking = require('../models/Booking');
const Business = require('../models/Business');

// Helper to generate human-readable unique booking ID
const generateBookingId = () => {
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  return `SLT-2026-${randomSuffix}`;
};

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (Tourist)
exports.createBooking = async (req, res) => {
  try {
    const { businessId, startDate, endDate, guestsCount, specialRequests, contactPhone } = req.body;

    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'The requested business was not found.'
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    let calculatedTotal = 0;
    if (business.pricingUnit === 'per_night') {
      calculatedTotal = business.pricePerUnit * diffDays;
    } else if (business.pricingUnit === 'per_person') {
      calculatedTotal = business.pricePerUnit * (Number(guestsCount) || 1);
    } else {
      calculatedTotal = business.pricePerUnit;
    }

    const booking = await Booking.create({
      bookingId: generateBookingId(),
      tourist: req.user.id,
      business: businessId,
      startDate: start,
      endDate: end,
      guestsCount: Number(guestsCount) || 1,
      totalAmount: calculatedTotal,
      status: 'pending',
      specialRequests: specialRequests || '',
      contactPhone: contactPhone || req.user.phone || ''
    });

    await booking.populate([
      { path: 'business', select: 'name category address images pricePerUnit pricingUnit destination', populate: { path: 'destination', select: 'name state' } },
      { path: 'tourist', select: 'name email phone avatar' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Booking request placed successfully! Booking ID: ' + booking.bookingId,
      data: booking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create booking.'
    });
  }
};

// @desc    Get current tourist bookings
// @route   GET /api/bookings/my-bookings
// @access  Private (Tourist)
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ tourist: req.user.id })
      .populate({
        path: 'business',
        select: 'name category address images pricePerUnit destination contactPhone contactEmail',
        populate: { path: 'destination', select: 'name state' }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve your bookings.'
    });
  }
};

// @desc    Get bookings for business owner listings
// @route   GET /api/bookings/owner-bookings
// @access  Private (business_owner, admin)
exports.getOwnerBookings = async (req, res) => {
  try {
    const ownerBusinesses = await Business.find({ owner: req.user.id }).select('_id');
    const businessIds = ownerBusinesses.map(b => b._id);

    const bookings = await Booking.find({ business: { $in: businessIds } })
      .populate('tourist', 'name email phone avatar')
      .populate({
        path: 'business',
        select: 'name category destination',
        populate: { path: 'destination', select: 'name state' }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve business bookings.'
    });
  }
};

// @desc    Update booking status (Confirm, Cancel, Complete)
// @route   PUT /api/bookings/:id/status
// @access  Private
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking status.'
      });
    }

    const booking = await Booking.findById(req.params.id).populate('business');
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.'
      });
    }

    const isOwner = booking.business.owner.toString() === req.user.id;
    const isTourist = booking.tourist.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    // Tourists can only cancel their own pending/confirmed bookings
    if (isTourist && !isOwner && !isAdmin) {
      if (status !== 'cancelled') {
        return res.status(403).json({
          success: false,
          message: 'Tourists can only cancel bookings.'
        });
      }
    } else if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to manage this booking.'
      });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({
      success: true,
      message: `Booking has been marked as ${status}.`,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update booking status.'
    });
  }
};