const multer = require('multer');
const path = require('path');
const fs = require('fs');

const ensureDir = dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const imageFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/jpg'];
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error('Only JPG & PNG allowed'), false);
  }
  cb(null, true);
};

const storage = folder => {
  const uploadPath = path.join('uploads', folder);
  ensureDir(uploadPath);

  return multer.diskStorage({
    destination: (_, __, cb) => cb(null, uploadPath),
    filename: (_, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, Date.now() + ext);
    }
  });
};

/* =========================
   FINAL EXPORTS (FIELD FIXED)
========================= */

// PROFILE (headmaster_photo)
exports.uploadHeadmaster = multer({
  storage: storage('headmaster'),
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
}).single('headmaster_photo');

// GALLERY (photo)
exports.uploadGallery = multer({
  storage: storage('gallery'),
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
}).single('photo');

// TEACHERS (photo)
exports.uploadTeachers = multer({
  storage: storage('teachers'),
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
}).single('photo');

// NEWS (photo)
exports.uploadNews = multer({
  storage: storage('news'),
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
}).single('photo');
