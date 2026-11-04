const express = require('express');
const router = express.Router();
const {
  getPlatformStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  toggleBusinessVerification,
  getAllBookings
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All admin routes strictly require admin role
router.use(protect, authorize('admin'));

router.get('/stats', getPlatformStats);
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

router.put('/businesses/:id/verify', toggleBusinessVerification);
router.get('/bookings', getAllBookings);

module.exports = router;