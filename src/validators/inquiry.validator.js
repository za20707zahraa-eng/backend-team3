const { body, param } = require('express-validator');

exports.createInquiryValidator = [
  param('id')
    .isMongoId()
    .withMessage('معرف العقار غير صالح'),
  body('message')
    .notEmpty()
    .withMessage('الرسالة مطلوبة')
    .isString()
    .trim(),
];

exports.updateInquiryStatusValidator = [
  param('id')
    .isMongoId()
    .withMessage('معرف الاستفسار غير صالح'),
  body('status')
    .isIn(['pending', 'replied', 'closed'])
    .withMessage('حالة الاستفسار غير صالحة'),
];