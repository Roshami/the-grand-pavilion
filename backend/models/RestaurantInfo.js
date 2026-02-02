const mongoose = require('mongoose');

const restaurantInfoSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "The Grand Pavilion"
  },
  tagline: {
    type: String,
    default: "Where Every Moment Becomes a Celebration"
  },
  contact: {
    phone: { type: String, required: true },
    email: { type: String, required: true },
    website: String
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  openingHours: {
    monday: { 
      open: { type: String, default: "10:00" }, 
      close: { type: String, default: "22:00" } 
    },
    tuesday: { 
      open: { type: String, default: "10:00" }, 
      close: { type: String, default: "22:00" } 
    },
    wednesday: { 
      open: { type: String, default: "10:00" }, 
      close: { type: String, default: "22:00" } 
    },
    thursday: { 
      open: { type: String, default: "10:00" }, 
      close: { type: String, default: "22:00" } 
    },
    friday: { 
      open: { type: String, default: "10:00" }, 
      close: { type: String, default: "23:00" } 
    },
    saturday: { 
      open: { type: String, default: "10:00" }, 
      close: { type: String, default: "23:00" } 
    },
    sunday: { 
      open: { type: String, default: "10:00" }, 
      close: { type: String, default: "22:00" } 
    }
  },
  mealTimings: {
    breakfast: { 
      start: { type: String, default: "07:00" }, 
      end: { type: String, default: "10:00" } 
    },
    lunch: { 
      start: { type: String, default: "12:00" }, 
      end: { type: String, default: "15:00" } 
    },
    dinner: { 
      start: { type: String, default: "18:00" }, 
      end: { type: String, default: "22:00" } 
    }
  },
  about: String,
  images: [String],
  coverImage: String,
  socialMedia: {
    facebook: String,
    instagram: String,
    whatsapp: String
  },
  settings: {
    maxAdvanceBookingDays: { type: Number, default: 90 },
    minPartySize: { type: Number, default: 2 },
    maxPartySize: { type: Number, default: 200 },
    depositPercentage: { type: Number, default: 30 }
  }
}, {
  timestamps: true
});

// Only one document allowed
restaurantInfoSchema.statics.createOrUpdate = async function(data) {
  const existing = await this.findOne();
  if (existing) {
    return await this.findByIdAndUpdate(existing._id, data, { new: true, runValidators: true });
  }
  return await this.create(data);
};

module.exports = mongoose.model('RestaurantInfo', restaurantInfoSchema);