const router = require('express').Router();
const auth = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const ctrl = require('../controllers/gallery.controller');

// public
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);

// admin
router.post(
  '/',
  auth,
  upload.uploadGallery,
  ctrl.create
);

router.delete('/:id', auth, ctrl.remove);

module.exports = router;
