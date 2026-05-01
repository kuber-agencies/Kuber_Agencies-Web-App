'use strict';

const express = require('express');
const router  = express.Router();

// @route  GET /api
// @desc   API status
// @access Public
router.get('/', (_req, res) => {
  res.json({ message: 'Kuber Agencies API v1' });
});

module.exports = router;
