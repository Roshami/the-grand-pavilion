const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { 
  getFacilities, 
  getFacilityById, 
  createFacility, 
  updateFacility, 
  deleteFacility,
  checkAvailability 
} = require('../controllers/facilityController');

router.get('/', getFacilities);
router.get('/availability', checkAvailability);
router.get('/:id', getFacilityById);
router.post('/', protect, authorize('admin', 'staff'), createFacility);
router.put('/:id', protect, authorize('admin', 'staff'), updateFacility);
router.delete('/:id', protect, authorize('admin'), deleteFacility);

module.exports = router;