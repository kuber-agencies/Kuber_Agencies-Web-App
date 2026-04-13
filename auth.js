const express = require('express');
const router = express.Router();
const { login, getMe, setup } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/login', authLimiter, login);
router.get('/me', protect, getMe);
router.post('/setup', setup); // Disable after first use

module.exports = router;
