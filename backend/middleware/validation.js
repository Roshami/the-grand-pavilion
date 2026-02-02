const { body, validationResult } = require('express-validator');

// Validation middleware
const validate = (validations) => {
  return async (req, res, next) => {
    for (let validation of validations) {
      const result = await validation.run(req);
      if (!result.isEmpty()) {
        break;
      }
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  };
};

// User registration validation
const validateRegister = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .trim()
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .matches(/^07[01245678]\d{7}$/).withMessage('Please provide a valid Sri Lankan phone number')
];

// Login validation
const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .trim()
    .notEmpty().withMessage('Password is required')
];

// Booking validation
const validateBooking = [
  body('type')
    .trim()
    .notEmpty().withMessage('Booking type is required')
    .isIn(['table', 'hall', 'package']).withMessage('Invalid booking type'),
  
  body('facility')
    .trim()
    .notEmpty().withMessage('Facility ID is required')
    .isMongoId().withMessage('Invalid facility ID'),
  
  body('date')
    .trim()
    .notEmpty().withMessage('Date is required')
    .isISO8601().withMessage('Invalid date format')
    .custom((value) => {
      const bookingDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (bookingDate < today) {
        throw new Error('Cannot book for past dates');
      }
      
      const maxDays = parseInt(process.env.MAX_BOOKING_DAYS_IN_ADVANCE) || 90;
      const maxDate = new Date();
      maxDate.setDate(maxDate.getDate() + maxDays);
      
      if (bookingDate > maxDate) {
        throw new Error(`Cannot book more than ${maxDays} days in advance`);
      }
      
      return true;
    }),
  
  body('timeSlot.start')
    .trim()
    .notEmpty().withMessage('Start time is required')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid time format (HH:mm)'),
  
  body('timeSlot.end')
    .trim()
    .notEmpty().withMessage('End time is required')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid time format (HH:mm)')
    .custom((value, { req }) => {
      if (req.body.timeSlot && value <= req.body.timeSlot.start) {
        throw new Error('End time must be after start time');
      }
      return true;
    }),
  
  body('guestCount')
    .notEmpty().withMessage('Guest count is required')
    .isInt({ min: 1, max: 200 }).withMessage('Guest count must be between 1 and 200')
];

module.exports = {
  validate,
  validateRegister,
  validateLogin,
  validateBooking
};