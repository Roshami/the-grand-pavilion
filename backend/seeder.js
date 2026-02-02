const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');

// Load env vars
dotenv.config({ path: './.env' });

// Import models
const connectDB = require('./config/database');
const User = require('./models/User');
const RestaurantInfo = require('./models/RestaurantInfo');
const Facility = require('./models/Facility');
const FoodCategory = require('./models/FoodCategory');
const FoodItem = require('./models/FoodItem');
const EventPackage = require('./models/EventPackage');

// Connect to DB
connectDB();

// Sample data
const users = [
  {
    name: 'Admin User',
    email: process.env.ADMIN_EMAIL || 'admin@grandpavilion.lk',
    password: process.env.ADMIN_PASSWORD || 'Admin@123456',
    phone: process.env.ADMIN_PHONE || '0771234567',
    role: 'admin'
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    phone: '0771111111',
    role: 'customer'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    phone: '0772222222',
    role: 'customer'
  }
];

const restaurantInfo = {
  name: "The Grand Pavilion",
  tagline: "Where Every Moment Becomes a Celebration",
  contact: {
    phone: "+94 11 234 5678",
    email: "info@grandpavilion.lk",
    website: "www.grandpavilion.lk"
  },
  address: {
    street: "123 Main Street",
    city: "Colombo",
    postalCode: "00100",
    coordinates: {
      lat: 6.9271,
      lng: 79.8612
    }
  },
  openingHours: {
    monday: { open: "10:00", close: "22:00" },
    tuesday: { open: "10:00", close: "22:00" },
    wednesday: { open: "10:00", close: "22:00" },
    thursday: { open: "10:00", close: "22:00" },
    friday: { open: "10:00", close: "23:00" },
    saturday: { open: "10:00", close: "23:00" },
    sunday: { open: "10:00", close: "22:00" }
  },
  mealTimings: {
    breakfast: { start: "07:00", end: "10:00" },
    lunch: { start: "12:00", end: "15:00" },
    dinner: { start: "18:00", end: "22:00" }
  },
  about: "The Grand Pavilion is an elegant dining destination and event space offering exceptional cuisine and unforgettable celebrations for weddings, birthdays, corporate events, and intimate gatherings.",
  images: [],
  coverImage: "",
  socialMedia: {
    facebook: "https://facebook.com/grandpavilion",
    instagram: "https://instagram.com/grandpavilion",
    whatsapp: "+94771234567"
  }
};

const facilities = [
  // Tables
  { name: "Table 1", type: "table", tableNumber: "T1", capacity: 4, position: { x: 50, y: 100, width: 60, height: 60 }, isAvailable: true, features: ["Window View"] },
  { name: "Table 2", type: "table", tableNumber: "T2", capacity: 6, position: { x: 150, y: 100, width: 80, height: 80 }, isAvailable: true, features: ["Booth"] },
  { name: "Table 3", type: "table", tableNumber: "T3", capacity: 8, position: { x: 250, y: 100, width: 100, height: 100 }, isAvailable: true },
  { name: "Table 4", type: "table", tableNumber: "T4", capacity: 4, position: { x: 50, y: 250, width: 60, height: 60 }, isAvailable: true },
  { name: "Table 5", type: "table", tableNumber: "T5", capacity: 6, position: { x: 150, y: 250, width: 80, height: 80 }, isAvailable: true },
  
  // Halls
  { name: "Grand Hall", type: "hall", hallType: "wedding_hall", capacity: 150, dimensions: { length: 50, width: 30, area: 1500 }, basePrice: 250000, pricePerPerson: 2000, isAvailable: true, features: ["Stage", "Dance Floor", "AC", "Sound System"] },
  { name: "Garden Area", type: "outdoor", hallType: "garden_area", capacity: 80, dimensions: { length: 40, width: 20, area: 800 }, basePrice: 100000, pricePerPerson: 1500, isAvailable: true, features: ["Outdoor Seating", "Lights", "Sound System"] },
  { name: "Conference Room", type: "room", hallType: "conference_room", capacity: 30, dimensions: { length: 20, width: 15, area: 300 }, basePrice: 50000, pricePerPerson: 1000, isAvailable: true, features: ["Projector", "WiFi", "AC"] },
  { name: "Private Room 1", type: "room", hallType: "private_room", capacity: 12, dimensions: { length: 15, width: 10, area: 150 }, basePrice: 30000, pricePerPerson: 800, isAvailable: true, features: ["Privacy", "AC"] },
  { name: "Private Room 2", type: "room", hallType: "private_room", capacity: 10, dimensions: { length: 12, width: 10, area: 120 }, basePrice: 25000, pricePerPerson: 800, isAvailable: true, features: ["Privacy", "AC"] }
];

const foodCategories = [
  { name: "Starters", description: "Appetizing starters to begin your meal", order: 1, isActive: true },
  { name: "Soups", description: "Warm and comforting soups", order: 2, isActive: true },
  { name: "Main Course", description: "Delicious main dishes", order: 3, isActive: true },
  { name: "Pizzas", description: "Freshly baked pizzas", order: 4, isActive: true },
  { name: "Pasta", description: "Italian pasta dishes", order: 5, isActive: true },
  { name: "Desserts", description: "Sweet treats to end your meal", order: 6, isActive: true },
  { name: "Beverages", description: "Refreshing drinks", order: 7, isActive: true }
];

const foodItems = [
  // Starters
  { name: "Garlic Bread", category: null, description: "Toasted bread with garlic butter", pricing: { price: 350 }, type: "veg", isAvailable: true, isPopular: false },
  { name: "Chicken Wings", category: null, description: "Spicy chicken wings (6 pcs)", pricing: { price: 650 }, type: "non_veg", spiceLevel: "medium", isAvailable: true, isPopular: true },
  { name: "Spring Rolls", category: null, description: "Crispy vegetable spring rolls (4 pcs)", pricing: { price: 450 }, type: "veg", isAvailable: true, isPopular: false },
  
  // Main Course
  { name: "Butter Chicken", category: null, description: "Creamy tomato-based curry with tender chicken", pricing: { price: 850 }, type: "non_veg", spiceLevel: "medium", isAvailable: true, isPopular: true },
  { name: "Paneer Butter Masala", category: null, description: "Cottage cheese in rich tomato gravy", pricing: { price: 650 }, type: "veg", spiceLevel: "medium", isAvailable: true, isPopular: true },
  { name: "Fish Curry", category: null, description: "Traditional Sri Lankan fish curry", pricing: { price: 750 }, type: "non_veg", spiceLevel: "spicy", isAvailable: true, isPopular: false },
  { name: "Vegetable Biryani", category: null, description: "Fragrant rice with mixed vegetables", pricing: { price: 550 }, type: "veg", isAvailable: true, isPopular: false },
  
  // Desserts
  { name: "Chocolate Brownie", category: null, description: "Warm chocolate brownie with ice cream", pricing: { price: 450 }, type: "veg", isAvailable: true, isPopular: true },
  { name: "Vanilla Ice Cream", category: null, description: "Classic vanilla ice cream", pricing: { price: 300 }, type: "veg", isAvailable: true, isPopular: false },
  
  // Beverages
  { name: "Fresh Orange Juice", category: null, description: "Freshly squeezed orange juice", pricing: { price: 250 }, type: "veg", isAvailable: true, isPopular: false },
  { name: "Coffee", category: null, description: "Hot brewed coffee", pricing: { price: 200 }, type: "veg", isAvailable: true, isPopular: false }
];

const eventPackages = [
  {
    name: "Royal Wedding Package",
    eventType: "wedding",
    description: "The perfect wedding celebration with all essentials included",
    basePrice: 250000,
    pricePerPerson: 2000,
    minGuests: 100,
    maxGuests: 200,
    duration: 8,
    inclusions: {
      venue: { facility: null, hours: 8 },
      tables: 20,
      chairs: 200,
      basicDecoration: true,
      stageSetup: true,
      soundSystem: true,
      lighting: true,
      catering: { included: true, courses: 5, menuType: "buffet" },
      staff: { waiters: 15, chefs: 5, security: 4 },
      parking: true,
      valetService: false
    },
    menuOptions: {
      starters: [],
      mainCourse: [],
      desserts: [],
      beverages: []
    },
    addons: [
      { name: "Premium Decoration", description: "Crystal chandeliers and premium drapes", price: 50000, category: "decoration" },
      { name: "DJ Service", description: "Professional DJ with equipment", price: 35000, category: "entertainment" },
      { name: "Photography Package", description: "2 photographers + 1 videographer", price: 75000, category: "photography" }
    ],
    isActive: true,
    isFeatured: true
  },
  {
    name: "Birthday Celebration Package",
    eventType: "birthday",
    description: "Fun-filled birthday party package for all ages",
    basePrice: 80000,
    pricePerPerson: 1000,
    minGuests: 30,
    maxGuests: 80,
    duration: 4,
    inclusions: {
      venue: { facility: null, hours: 4 },
      tables: 8,
      chairs: 80,
      basicDecoration: true,
      stageSetup: false,
      soundSystem: true,
      lighting: true,
      catering: { included: true, courses: 3, menuType: "buffet" },
      staff: { waiters: 5, chefs: 2, security: 2 },
      parking: true,
      valetService: false
    },
    addons: [
      { name: "Character Theme Decoration", description: "Mickey Mouse, Frozen, etc.", price: 15000, category: "decoration" },
      { name: "Magic Show", description: "45-minute professional magic show", price: 12000, category: "entertainment" },
      { name: "Photo Booth", description: "With props and instant prints", price: 10000, category: "photography" }
    ],
    isActive: true,
    isFeatured: true
  },
  {
    name: "Corporate Event Package",
    eventType: "corporate",
    description: "Professional setup for business meetings and conferences",
    basePrice: 120000,
    pricePerPerson: 1500,
    minGuests: 20,
    maxGuests: 100,
    duration: 6,
    inclusions: {
      venue: { facility: null, hours: 6 },
      tables: 10,
      chairs: 100,
      basicDecoration: false,
      stageSetup: true,
      soundSystem: true,
      lighting: true,
      catering: { included: true, courses: 2, menuType: "buffet" },
      staff: { waiters: 8, chefs: 3, security: 2 },
      parking: true,
      valetService: true
    },
    addons: [
      { name: "Video Conferencing", description: "Zoom/Teams integration with camera", price: 20000, category: "technology" },
      { name: "Professional Photography", description: "Event coverage and edited photos", price: 15000, category: "photography" },
      { name: "Team Building Activities", description: "Ice breakers and workshops", price: 25000, category: "entertainment" }
    ],
    isActive: true,
    isFeatured: false
  }
];

// Seed functions
const seedUsers = async () => {
  try {
    await User.deleteMany();
    await User.insertMany(users);
    console.log('✅ Users seeded'.green);
  } catch (error) {
    console.error('❌ Error seeding users:', error.message);
  }
};

const seedRestaurantInfo = async () => {
  try {
    await RestaurantInfo.deleteMany();
    await RestaurantInfo.create(restaurantInfo);
    console.log('✅ Restaurant info seeded'.green);
  } catch (error) {
    console.error('❌ Error seeding restaurant info:', error.message);
  }
};

const seedFacilities = async () => {
  try {
    await Facility.deleteMany();
    await Facility.insertMany(facilities);
    console.log('✅ Facilities seeded'.green);
  } catch (error) {
    console.error('❌ Error seeding facilities:', error.message);
  }
};

const seedFoodCategories = async () => {
  try {
    await FoodCategory.deleteMany();
    const categories = await FoodCategory.insertMany(foodCategories);
    
    // Update food items with category IDs
    foodItems.forEach(item => {
      if (item.name.includes("Bread") || item.name.includes("Wings") || item.name.includes("Rolls")) {
        item.category = categories.find(c => c.name === "Starters")._id;
      } else if (item.name.includes("Soup")) {
        item.category = categories.find(c => c.name === "Soups")._id;
      } else if (item.name.includes("Chicken") || item.name.includes("Paneer") || item.name.includes("Fish") || item.name.includes("Biryani")) {
        item.category = categories.find(c => c.name === "Main Course")._id;
      } else if (item.name.includes("Brownie") || item.name.includes("Ice Cream")) {
        item.category = categories.find(c => c.name === "Desserts")._id;
      } else if (item.name.includes("Juice") || item.name.includes("Coffee")) {
        item.category = categories.find(c => c.name === "Beverages")._id;
      }
    });
    
    console.log('✅ Food categories seeded'.green);
  } catch (error) {
    console.error('❌ Error seeding food categories:', error.message);
  }
};

const seedFoodItems = async () => {
  try {
    await FoodItem.deleteMany();
    await FoodItem.insertMany(foodItems);
    console.log('✅ Food items seeded'.green);
  } catch (error) {
    console.error('❌ Error seeding food items:', error.message);
  }
};

const seedEventPackages = async () => {
  try {
    await EventPackage.deleteMany();
    
    // Get facility IDs
    const grandHall = await Facility.findOne({ name: "Grand Hall" });
    const gardenArea = await Facility.findOne({ name: "Garden Area" });
    const conferenceRoom = await Facility.findOne({ name: "Conference Room" });
    
    // Update package venues
    eventPackages[0].inclusions.venue.facility = grandHall._id; // Wedding package
    eventPackages[1].inclusions.venue.facility = gardenArea._id; // Birthday package
    eventPackages[2].inclusions.venue.facility = conferenceRoom._id; // Corporate package
    
    await EventPackage.insertMany(eventPackages);
    console.log('✅ Event packages seeded'.green);
  } catch (error) {
    console.error('❌ Error seeding event packages:', error.message);
  }
};

// Run seeder
const runSeeder = async () => {
  try {
    console.log('🌱 Starting database seeding...\n'.yellow);
    
    await seedUsers();
    await seedRestaurantInfo();
    await seedFacilities();
    await seedFoodCategories();
    await seedFoodItems();
    await seedEventPackages();
    
    console.log('\n✅ Database seeding completed successfully!'.green.bold);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeder error:', error.message);
    process.exit(1);
  }
};

// Clear database only
const clearDatabase = async () => {
  try {
    await User.deleteMany();
    await RestaurantInfo.deleteMany();
    await Facility.deleteMany();
    await FoodCategory.deleteMany();
    await FoodItem.deleteMany();
    await EventPackage.deleteMany();
    
    console.log('✅ Database cleared successfully!'.green);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing database:', error.message);
    process.exit(1);
  }
};

// Run based on command
if (process.argv[2] === '-clear') {
  clearDatabase();
} else {
  runSeeder();
}