const multer = require('multer');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'public/img')
  },
  filename(req, file, cb) {
    cb(null, `${new Date().toISOString().replace(/:/g, '-')}-${file.originalname}`)
  }
});

const allowedTypes = ['application/pdf', 'application/msword', 'text/*'];

const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Only pdf, msword or text'))
  }
};

module.exports = multer({
  storage, fileFilter, limits: {
    fileSize: 10 * 1024 * 1024
  }
});
