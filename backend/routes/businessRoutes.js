const express = require('express');
const router = express.Router();
const {
  getBusinesses,
  getPopularBusinesses,
  getBusinessesForMap,
  getBusinessById,
  createBusiness,
  updateBusiness,
  deleteBusiness,
  getMyListings
} = require('../controllers/businessController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getBusinesses);
router.get('/popular', getPopularBusinesses);
router.get('/map', getBusinessesForMap);
router.get('/owner/my-listings', protect, authorize('business_owner', 'admin'), getMyListings);
router.get('/:id', getBusinessById);

router.post('/', protect, authorize('business_owner', 'admin'), createBusiness);
router.put('/:id', protect, authorize('business_owner', 'admin'), updateBusiness);
router.delete('/:id', protect, authorize('business_owner', 'admin'), deleteBusiness);

module.exports = router;