const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { 
  getPackages, 
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage 
} = require('../controllers/packageController');

router.get('/', getPackages);
router.get('/:id', getPackageById);
router.post('/', protect, authorize('admin', 'staff'), createPackage);
router.put('/:id', protect, authorize('admin', 'staff'), updatePackage);
router.delete('/:id', protect, authorize('admin'), deletePackage);

module.exports = router;