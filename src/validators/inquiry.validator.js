const { body, param } = require('express-validator');

exports.createInquiryValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('معرف العقار غير صالح')
    .toInt(),
  body('message')
    .notEmpty()
    .withMessage('الرسالة مطلوبة')
    .isString()
    .trim(),
];

exports.updateInquiryStatusValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('معرف الاستفسار غير صالح')
    .toInt(),
  body('status')
    .isIn(['pending', 'replied', 'closed'])
    .withMessage('حالة الاستفسار غير صالحة'),
];