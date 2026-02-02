const RestaurantInfo = require('../models/RestaurantInfo');
const Facility = require('../models/Facility');
const FoodCategory = require('../models/FoodCategory');
const FoodItem = require('../models/FoodItem');

// @desc    POST restaurant information
// @route   POST /api/restaurant/info
// @access  Private/Admin
exports.saveRestaurantInfo = async (req, res) => {
  try {
    const { data } = req.body;

    // createOrUpdate static method භාවිතා කරන්න
    const restaurantInfo = await RestaurantInfo.createOrUpdate(data);

    res.status(200).json({
      success: true,
      message: 'Restaurant information saved successfully',
      data: restaurantInfo
    });
  } catch (error) {
    console.error('Error saving restaurant info:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save restaurant information',
      error: error.message
    });
  }
};



// @desc    Get restaurant information
// @route   GET /api/restaurant/info
// @access  Public
exports.getRestaurantInfo = async (req, res) => {
  try {
    const restaurantInfo = await RestaurantInfo.findOne();
    
    if (!restaurantInfo) {
      return res.status(404).json({ 
        success: false, 
        message: 'Restaurant information not found' 
      });
    }

    res.status(200).json({
      success: true,
       restaurantInfo
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Update restaurant information
// @route   PUT /api/restaurant/info
// @access  Private/Admin
exports.updateRestaurantInfo = async (req, res) => {
  try {
    const restaurantInfo = await RestaurantInfo.createOrUpdate(req.body);

    res.status(200).json({
      success: true,
       restaurantInfo
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get all facilities
// @route   GET /api/restaurant/facilities
// @access  Public
exports.getFacilities = async (req, res) => {
  try {
    const { type, capacity, available } = req.query;

    let query = {};

    if (type) {
      query.type = type;
    }

    if (capacity) {
      query.capacity = { $gte: parseInt(capacity) };
    }

    if (available === 'true') {
      query.isAvailable = true;
      query.isMaintenance = false;
    }

    const facilities = await Facility.find(query).sort({ type: 1, capacity: 1 });

    res.status(200).json({
      success: true,
      count: facilities.length,
       facilities
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get food menu
// @route   GET /api/restaurant/menu
// @access  Public
exports.getFoodMenu = async (req, res) => {
  try {
    const { category, type, available } = req.query;

    // Get all categories
    const categories = await FoodCategory.find({ isActive: true }).sort({ order: 1 });

    // Build menu with items
    const menu = [];

    for (const category of categories) {
      let itemQuery = { 
        category: category._id,
        isAvailable: available !== 'false'
      };

      if (type) {
        itemQuery.type = type;
      }

      const items = await FoodItem.find(itemQuery).sort({ name: 1 });

      if (items.length > 0) {
        menu.push({
          category: category.name,
          description: category.description,
          items: items.map(item => ({
            _id: item._id,
            name: item.name,
            description: item.description,
            price: item.pricing.isOnOffer ? item.pricing.offerPrice : item.pricing.price,
            originalPrice: item.pricing.price,
            isOnOffer: item.pricing.isOnOffer,
            type: item.type,
            spiceLevel: item.spiceLevel,
            isPopular: item.isPopular,
            isRecommended: item.isRecommended,
            ingredients: item.ingredients,
            dietaryInfo: item.dietaryInfo,
            preparationTime: item.preparationTime,
            images: item.images,
            tags: item.tags
          }))
        });
      }
    }

    res.status(200).json({
      success: true,
       menu
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};