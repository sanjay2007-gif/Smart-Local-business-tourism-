const express = require('express');
const router = express.Router();
const {
  getPersonalizedRecommendations,
  getNearbyBusinesses
} = require('../controllers/recommendationController');
const { optionalAuth } = require('../middleware/authMiddleware');

router.get('/personalized', optionalAuth, getPersonalizedRecommendations);
router.get('/nearby', getNearbyBusinesses);

module.exports = router;