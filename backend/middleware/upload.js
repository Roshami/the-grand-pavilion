const multer = require('multer');
const path = require('path');
const { ErrorResponse } = require('./errorHandler');

// Set storage engine
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Check file type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif|webp/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new ErrorResponse('Error: Images Only!', 400));
  }
}

// Init upload
const upload = multer({
  storage: storage,
  limits: { fileSize: process.env.MAX_FILE_SIZE || 5242880 }, // 5MB default
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
});

// Single file upload middleware
const uploadSingle = (fieldName = 'image') => {
  return upload.single(fieldName);
};

// Multiple files upload middleware
const uploadMultiple = (fieldName = 'images', maxCount = 10) => {
  return upload.array(fieldName, maxCount);
};

module.exports = { uploadSingle, uploadMultiple };