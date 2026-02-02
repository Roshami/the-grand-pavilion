const mongoose = require('mongoose');

const facilitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Facility name is required']
  },
  type: {
    type: String,
    enum: ['table', 'hall', 'room', 'outdoor'],
    required: true
  },
  tableNumber: String, // For tables only
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  hallType: {
    type: String,
    enum: ['wedding_hall', 'birthday_hall', 'conference_room', 'private_room', 'garden_area']
  },
  dimensions: {
    length: Number,
    width: Number,
    area: Number
  },
  position: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    width: { type: Number, default: 50 },
    height: { type: Number, default: 50 },
    floor: { type: Number, default: 1 }
  },
  features: [String],
  amenities: [String],
  basePrice: {
    type: Number,
    default: 0
  },
  pricePerPerson: {
    type: Number,
    default: 0
  },
  minBookingHours: {
    type: Number,
    default: 1
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  isMaintenance: {
    type: Boolean,
    default: false
  },
  maxCapacity: Number,
  images: [String],
  description: String
}, {
  timestamps: true
});

// Check if facility is available for a specific date/time
facilitySchema.statics.isAvailable = async function(facilityId, date, timeSlot) {
  const bookingExists = await mongoose.model('Booking').findOne({
    facility: facilityId,
    date: new Date(date),
    'timeSlot.start': { $lt: timeSlot.end },
    'timeSlot.end': { $gt: timeSlot.start },
    status: { $in: ['pending', 'confirmed'] }
  });
  return !bookingExists;
};

module.exports = mongoose.model('Facility', facilitySchema);