const router = require('express').Router();
const auth = require('../middlewares/auth');
const ctrl = require('../controllers/auth.controller');

// REGISTER (sementara public / internal)
router.post('/register', ctrl.register);

// LOGIN
router.post('/login', ctrl.login);

// SESSION
router.get('/me', auth, ctrl.me);

// LOGOUT
router.post('/logout', ctrl.logout);

module.exports = router;
