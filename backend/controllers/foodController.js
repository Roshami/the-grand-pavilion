const FoodCategory = require('../models/FoodCategory');
const FoodItem = require('../models/FoodItem');

// @desc    Get all food categories
// @route   GET /api/food/categories
// @access  Public
exports.getCategories = async (req, res) => {
  try {
    const categories = await FoodCategory.find({ isActive: true }).sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: categories.length,
       categories
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get all food items
// @route   GET /api/food
// @access  Public
exports.getFoods = async (req, res) => {
  try {
    const { category, type, available, popular } = req.query;

    let query = {};

    if (category) {
      query.category = category;
    }

    if (type) {
      query.type = type;
    }

    if (available === 'true') {
      query.isAvailable = true;
    }

    if (popular === 'true') {
      query.isPopular = true;
    }

    const foods = await FoodItem.find(query)
      .populate('category', 'name')
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: foods.length,
       foods
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get food item by ID
// @route   GET /api/food/:id
// @access  Public
exports.getFoodById = async (req, res) => {
  try {
    const food = await FoodItem.findById(req.params.id).populate('category', 'name');

    if (!food) {
      return res.status(404).json({ 
        success: false, 
        message: 'Food item not found' 
      });
    }

    res.status(200).json({
      success: true,
       food
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Create food item
// @route   POST /api/food
// @access  Private/Admin/Staff
exports.createFood = async (req, res) => {
  try {
    const food = await FoodItem.create(req.body);

    res.status(201).json({
      success: true,
       food
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Update food item
// @route   PUT /api/food/:id
// @access  Private/Admin/Staff
exports.updateFood = async (req, res) => {
  try {
    const food = await FoodItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!food) {
      return res.status(404).json({ 
        success: false, 
        message: 'Food item not found' 
      });
    }

    res.status(200).json({
      success: true,
       food
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Toggle food availability
// @route   PUT /api/food/:id/toggle
// @access  Private/Admin/Staff
exports.toggleAvailability = async (req, res) => {
  try {
    const food = await FoodItem.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ 
        success: false, 
        message: 'Food item not found' 
      });
    }

    food.isAvailable = !food.isAvailable;
    await food.save();

    res.status(200).json({
      success: true,
      message: `Food item ${food.isAvailable ? 'activated' : 'deactivated'} successfully`,
       food
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Delete food item
// @route   DELETE /api/food/:id
// @access  Private/Admin
exports.deleteFood = async (req, res) => {
  try {
    const food = await FoodItem.findByIdAndDelete(req.params.id);

    if (!food) {
      return res.status(404).json({ 
        success: false, 
        message: 'Food item not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Food item deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};