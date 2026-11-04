const express = require('express');
const router = express.Router();
const {
  getDestinations,
  getFeaturedDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination
} = require('../controllers/destinationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getDestinations);
router.get('/featured', getFeaturedDestinations);
router.get('/:id', getDestinationById);

// Admin-protected routes
router.post('/', protect, authorize('admin'), createDestination);
router.put('/:id', protect, authorize('admin'), updateDestination);
router.delete('/:id', protect, authorize('admin'), deleteDestination);

module.exports = router;