const inquiryService = require('../services/inquiry.service');
const { successResponse } = require('../utils/response');

exports.createInquiry = async (req, res, next) => {
  try {
    const inquiry = await inquiryService.createInquiry(req.user.id, req.params.id, req.body.message);
    return successResponse(res, 'تم إرسال الاستفسار بنجاح', inquiry, 201);
  } catch (error) {
    next(error);
  }
};

exports.getAgentInquiries = async (req, res, next) => {
  try {
    const inquiries = await inquiryService.getAgentInquiries(req.user.id);
    return successResponse(res, 'تم جلب استفسارات الوكيل بنجاح', inquiries);
  } catch (error) {
    next(error);
  }
};

exports.updateInquiryStatus = async (req, res, next) => {
  try {
    const updated = await inquiryService.updateStatus(req.params.id, req.user.id, req.body.status);
    return successResponse(res, 'تم تحديث حالة الاستفسار بنجاح', updated);
  } catch (error) {
    next(error);
  }
};