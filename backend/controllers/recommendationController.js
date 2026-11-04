const Business = require('../models/Business');
const User = require('../models/User');

// Haversine formula to compute great-circle distance in kilometers
function getHaversineDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// @desc    Get smart personalized recommendations based on tourist interests
// @route   GET /api/recommendations/personalized
// @access  Public (Optional auth)
exports.getPersonalizedRecommendations = async (req, res) => {
  try {
    let userInterests = [];

    if (req.user && req.user.interests && req.user.interests.length > 0) {
      userInterests = req.user.interests;
    } else if (req.query.interests) {
      userInterests = req.query.interests.split(',').map(s => s.trim().toLowerCase());
    } else {
      userInterests = ['heritage', 'culinary', 'trekking'];
    }

    const allBusinesses = await Business.find({ isVerified: true })
      .populate('destination', 'name state category');

    // Score businesses based on interest matches, ratings, and reviews
    const scoredBusinesses = allBusinesses.map(biz => {
      let matchCount = 0;
      const matchedTags = [];

      biz.tags.forEach(tag => {
        if (userInterests.includes(tag.toLowerCase())) {
          matchCount += 1;
          matchedTags.push(tag);
        }
      });

      // Composite scoring formula
      const score = (matchCount * 10) + (biz.ratingAverage * 2) + Math.min(biz.reviewCount * 0.2, 5);

      return {
        ...biz.toObject(),
        matchScore: Math.round(score * 10) / 10,
        matchedInterests: matchedTags,
        recommendationReason: matchedTags.length > 0
          ? `Recommended for your love of ${matchedTags.join(', ')}`
          : 'Popular high-rated local experience'
      };
    });

    // Sort descending by score
    scoredBusinesses.sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json({
      success: true,
      userInterests,
      count: scoredBusinesses.length,
      data: scoredBusinesses.slice(0, 8)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to compute recommendations.'
    });
  }
};

// @desc    Discover nearby local businesses using GPS coordinates (Haversine distance)
// @route   GET /api/recommendations/nearby
// @access  Public
exports.getNearbyBusinesses = async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);
    const radiusKm = parseFloat(req.query.radiusKm) || 100;

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({
        success: false,
        message: 'Valid latitude (lat) and longitude (lng) coordinates are required.'
      });
    }

    const businesses = await Business.find({ isVerified: true })
      .populate('destination', 'name state category');

    const nearby = businesses
      .map(biz => {
        const distance = getHaversineDistanceKm(lat, lng, biz.location.lat, biz.location.lng);
        return {
          ...biz.toObject(),
          distanceKm: distance
        };
      })
      .filter(item => item.distanceKm <= radiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);

    res.status(200).json({
      success: true,
      origin: { lat, lng },
      radiusKm,
      count: nearby.length,
      data: nearby
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to discover nearby businesses.'
    });
  }
};