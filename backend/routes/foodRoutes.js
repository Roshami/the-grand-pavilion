const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { 
  getCategories, 
  getFoods, 
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
  toggleAvailability 
} = require('../controllers/foodController');

router.get('/categories', getCategories);
router.get('/', getFoods);
router.get('/:id', getFoodById);
router.post('/', protect, authorize('admin', 'staff'), createFood);
router.put('/:id', protect, authorize('admin', 'staff'), updateFood);
router.put('/:id/toggle', protect, authorize('admin', 'staff'), toggleAvailability);
router.delete('/:id', protect, authorize('admin'), deleteFood);

module.exports = router;