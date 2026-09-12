const { body, param, query } = require('express-validator');

exports.userIdValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('معرف المستخدم غير صالح')
    .toInt(),
];

exports.getUsersValidator = [
  query('role')
    .optional()
    .isIn(['admin', 'agent', 'client'])
    .withMessage('الدور غير صالح'),
];

exports.createUserValidator = [
  body('name')
    .notEmpty()
    .withMessage('الاسم مطلوب')
    .isString()
    .trim(),
  body('email')
    .notEmpty()
    .withMessage('البريد الإلكتروني مطلوب')
    .isEmail()
    .withMessage('البريد الإلكتروني غير صالح')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('كلمة المرور مطلوبة')
    .isLength({ min: 6 })
    .withMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
  body('phone')
    .optional()
    .isString()
    .trim(),
  body('role')
    .optional()
    .isIn(['admin', 'agent', 'client'])
    .withMessage('الدور غير صالح'),
];

exports.updateUserValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('معرف المستخدم غير صالح')
    .toInt(),
  body('name')
    .optional()
    .notEmpty()
    .withMessage('الاسم لا يمكن أن يكون فارغاً')
    .isString()
    .trim(),
  body('email')
    .optional()
    .isEmail()
    .withMessage('البريد الإلكتروني غير صالح')
    .normalizeEmail(),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
  body('phone')
    .optional()
    .isString()
    .trim(),
  body('role')
    .optional()
    .isIn(['admin', 'agent', 'client'])
    .withMessage('الدور غير صالح'),
];
