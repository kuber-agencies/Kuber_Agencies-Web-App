'use strict';

const express = require('express');
const router  = express.Router();

// @route  GET /admin
// @desc   Admin panel placeholder
// @access Private (add auth middleware here when ready)
router.get('/', (_req, res) => {
  res.json({
    page    : 'Admin Panel',
    message : 'Kuber Agencies Admin — coming soon',
    status  : 'ok',
  });
});

module.exports = router;
