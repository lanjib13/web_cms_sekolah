const router = require('express').Router();
const auth = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const ctrl = require('../controllers/news.controller');

// public
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);

// admin
router.post(
  '/',
  auth,
  upload.uploadNews,
  ctrl.create
);

router.put(
  '/:id',
  auth,
  upload.uploadNews,
  ctrl.update
);

router.delete('/:id', auth, ctrl.remove);

module.exports = router;
