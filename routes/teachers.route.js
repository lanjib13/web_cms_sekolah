const router = require('express').Router();
const auth = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const ctrl = require('../controllers/teachers.controller');

// public
router.get('/', ctrl.getAll);

// admin
router.post(
  '/',
  auth,
  upload.uploadTeachers,
  ctrl.create
);

router.put(
  '/:id',
  auth,
  upload.uploadTeachers,
  ctrl.update
);

router.delete('/:id', auth, ctrl.remove);

module.exports = router;
