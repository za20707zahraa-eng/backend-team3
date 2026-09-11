const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');

router.get('/agent/analytics', analyticsController.getAnalytics);

module.exports = router;