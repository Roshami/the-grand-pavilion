const express = require('express');
const router = express.Router();
const { getRestaurantInfo, updateRestaurantInfo, getFacilities, getFoodMenu, saveRestaurantInfo } = require('../controllers/restaurantController');

router.post('/info', saveRestaurantInfo);
router.get('/info', getRestaurantInfo);
router.put('/info', updateRestaurantInfo);
router.get('/facilities', getFacilities);
router.get('/menu', getFoodMenu);

module.exports = router;