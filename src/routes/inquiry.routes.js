const express = require('express');
const router = express.Router();
const inquiryController = require('../controllers/inquiry.controller');
const { createInquiryValidator, updateInquiryStatusValidator } = require('../validators/inquiry.validator');
const validate = require('../middlewares/validate.middleware');

router.post('/properties/:id/inquire', createInquiryValidator, validate, inquiryController.createInquiry);
router.get('/agent/inquiries', inquiryController.getAgentInquiries);
router.patch('/inquiries/:id/status', updateInquiryStatusValidator, validate, inquiryController.updateInquiryStatus);

module.exports = router;