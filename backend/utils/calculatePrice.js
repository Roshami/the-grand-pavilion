const EventPackage = require('../models/EventPackage');
const FoodItem = require('../models/FoodItem');

const calculatePrice = async (options) => {
  try {
    const { type, facility, packageId, guestCount, foodItems, selectedAddons } = options;
    
    let pricing = {
      facilityCharge: 0,
      foodTotal: 0,
      addonTotal: 0,
      tax: 0,
      discount: 0,
      total: 0,
      advancePaid: 0,
      balanceDue: 0
    };

    // Calculate facility charge
    if (type === 'table') {
      pricing.facilityCharge = 0; // Tables are free
    } else if (type === 'hall') {
      pricing.facilityCharge = facility.basePrice || 0;
    } else if (type === 'package' && packageId) {
      const eventPackage = await EventPackage.findById(packageId);
      if (eventPackage) {
        pricing.facilityCharge = eventPackage.basePrice || 0;
        // Add per person charge
        pricing.facilityCharge += (eventPackage.pricePerPerson || 0) * guestCount;
      }
    }

    // Calculate food total
    if (foodItems && foodItems.length > 0) {
      for (const item of foodItems) {
        const food = await FoodItem.findById(item.foodItem);
        if (food) {
          const price = food.pricing.isOnOffer ? food.pricing.offerPrice : food.pricing.price;
          pricing.foodTotal += price * item.quantity;
        }
      }
    }

    // Calculate addon total
    if (selectedAddons && selectedAddons.length > 0) {
      pricing.addonTotal = selectedAddons.reduce((sum, addon) => sum + (addon.price || 0), 0);
    }

    // Calculate subtotal
    const subtotal = pricing.facilityCharge + pricing.foodTotal + pricing.addonTotal;

    // Calculate tax (15%)
    pricing.tax = subtotal * 0.15;

    // Calculate total
    pricing.total = subtotal + pricing.tax;

    // Calculate advance payment (30% for events)
    if (type === 'package' || type === 'hall') {
      pricing.advancePaid = pricing.total * 0.3;
      pricing.balanceDue = pricing.total - pricing.advancePaid;
    } else {
      pricing.advancePaid = pricing.total; // Full payment for tables
      pricing.balanceDue = 0;
    }

    return pricing;
  } catch (error) {
    console.error('Error calculating price:', error);
    throw error;
  }
};

module.exports = calculatePrice;