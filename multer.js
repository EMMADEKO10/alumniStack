const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Le fichier doit être une image'), false);
    }
  }
});

module.exports = upload;


// // Configure Cloudinary
// cloudinary.config({
//   cloud_name:'sotradonsAPI',
//   api_key:'774968294321134',
//   api_secret: '3M2Ak3_5IPmYHdqlCTulI8G-gmE'
// });