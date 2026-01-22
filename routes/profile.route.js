const router = require('express').Router();
const auth = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const ctrl = require('../controllers/profile.controller');

router.get('/', ctrl.get);

router.post(
  '/',
  auth,
  upload.uploadHeadmaster,
  ctrl.createOrUpdate
);

module.exports = router;
