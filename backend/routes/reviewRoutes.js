const express = require('express');
const router = express.Router();
const {
  addReview,
  deleteReview,
  toggleFavorite,
  getMyFavorites
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, addReview);
router.delete('/:id', protect, deleteReview);

router.post('/favorite/:businessId', protect, toggleFavorite);
router.get('/favorites', protect, getMyFavorites);

module.exports = router;