const express = require('express');
const router = express.Router();
const { createRFQ, getRFQs, updateRFQStatus, deleteRFQ } = require('../controllers/rfqController');
const { protect } = require('../middleware/auth');
const { rfqLimiter } = require('../middleware/rateLimiter');

router.post('/', rfqLimiter, createRFQ);
router.get('/', protect, getRFQs);
router.patch('/:id/status', protect, updateRFQStatus);
router.delete('/:id', protect, deleteRFQ);

module.exports = router;
