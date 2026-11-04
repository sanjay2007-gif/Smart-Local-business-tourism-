const express = require('express');
const router = express.Router();
const {
  generateItinerary,
  saveItinerary,
  getMyItineraries,
  deleteItinerary
} = require('../controllers/itineraryController');
const { protect } = require('../middleware/authMiddleware');

router.post('/generate', generateItinerary);
router.post('/', protect, saveItinerary);
router.get('/my-itineraries', protect, getMyItineraries);
router.delete('/:id', protect, deleteItinerary);

module.exports = router;