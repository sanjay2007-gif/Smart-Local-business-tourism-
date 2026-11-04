const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getOwnerBookings,
  updateBookingStatus
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.get('/owner-bookings', protect, authorize('business_owner', 'admin'), getOwnerBookings);
router.put('/:id/status', protect, updateBookingStatus);

module.exports = router;