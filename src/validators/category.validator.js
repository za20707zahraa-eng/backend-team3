const { body, param } = require('express-validator');

exports.categoryIdValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('معرف التصنيف غير صالح')
    .toInt(),
];

exports.createCategoryValidator = [
  body('name')
    .notEmpty()
    .withMessage('اسم التصنيف مطلوب')
    .isString()
    .trim(),
  body('description')
    .optional()
    .isString()
    .trim(),
];

exports.updateCategoryValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('معرف التصنيف غير صالح')
    .toInt(),
  body('name')
    .optional()
    .notEmpty()
    .withMessage('اسم التصنيف لا يمكن أن يكون فارغاً')
    .isString()
    .trim(),
  body('description')
    .optional()
    .isString()
    .trim(),
];
