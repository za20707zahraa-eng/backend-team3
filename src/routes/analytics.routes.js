const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

router.get('/agent/analytics', authenticate, authorize('agent'), analyticsController.getAnalytics);

module.exports = router;