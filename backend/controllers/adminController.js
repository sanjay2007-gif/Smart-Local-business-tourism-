const User = require('../models/User');
const Business = require('../models/Business');
const Destination = require('../models/Destination');
const Booking = require('../models/Booking');

// @desc    Get platform metrics and statistics for Admin Dashboard
// @route   GET /api/admin/stats
// @access  Private (Admin)
exports.getPlatformStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTourists = await User.countDocuments({ role: 'tourist' });
    const totalOwners = await User.countDocuments({ role: 'business_owner' });

    const totalBusinesses = await Business.countDocuments();
    const verifiedBusinesses = await Business.countDocuments({ isVerified: true });
    const pendingBusinesses = await Business.countDocuments({ isVerified: false });

    const totalDestinations = await Destination.countDocuments();

    const totalBookings = await Booking.countDocuments();
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });

    // Aggregate total revenue
    const revenueAgg = await Booking.aggregate([
      { $match: { status: { $in: ['confirmed', 'completed'] } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

    res.status(200).json({
      success: true,
      stats: {
        users: { total: totalUsers, tourists: totalTourists, owners: totalOwners },
        businesses: { total: totalBusinesses, verified: verifiedBusinesses, pending: pendingBusinesses },
        destinations: { total: totalDestinations },
        bookings: {
          total: totalBookings,
          confirmed: confirmedBookings,
          pending: pendingBookings,
          completed: completedBookings,
          totalRevenue
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve platform analytics.'
    });
  }
};

// @desc    Get all registered users
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve users.'
    });
  }
};

// @desc    Update user role or status
// @route   PUT /api/admin/users/:id/role
// @access  Private (Admin)
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['tourist', 'business_owner', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user role.'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: `User role updated to ${role}.`,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update user role.'
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own admin account.'
      });
    }

    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: 'User removed from platform.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete user.'
    });
  }
};

// @desc    Toggle business verification status
// @route   PUT /api/admin/businesses/:id/verify
// @access  Private (Admin)
exports.toggleBusinessVerification = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found.'
      });
    }

    business.isVerified = !business.isVerified;
    await business.save();

    res.status(200).json({
      success: true,
      message: `Business is now ${business.isVerified ? 'Verified & Active' : 'Unverified / Suspended'}.`,
      data: business
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update verification status.'
    });
  }
};

// @desc    Get all platform bookings for Admin
// @route   GET /api/admin/bookings
// @access  Private (Admin)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('tourist', 'name email phone avatar')
      .populate({
        path: 'business',
        select: 'name category destination pricePerUnit',
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
      message: 'Failed to retrieve platform bookings.'
    });
  }
};