const express = require('express');
const router = express.Router();
const inquiryController = require('../controllers/inquiry.controller');
const { createInquiryValidator, updateInquiryStatusValidator } = require('../validators/inquiry.validator');
const validate = require('../middlewares/validate.middleware');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

router.post('/properties/:id/inquire', authenticate, createInquiryValidator, validate, inquiryController.createInquiry);
router.get('/agent/inquiries', authenticate, authorize('agent'), inquiryController.getAgentInquiries);
router.patch('/inquiries/:id/status', authenticate, authorize('agent'), updateInquiryStatusValidator, validate, inquiryController.updateInquiryStatus);

module.exports = router;