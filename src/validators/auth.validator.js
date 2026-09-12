const { body } = require('express-validator');

exports.registerValidator = [
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
    .isIn(['client', 'agent'])
    .withMessage('الدور غير صالح'),
];

exports.loginValidator = [
  body('email')
    .notEmpty()
    .withMessage('البريد الإلكتروني مطلوب')
    .isEmail()
    .withMessage('البريد الإلكتروني غير صالح'),
  body('password')
    .notEmpty()
    .withMessage('كلمة المرور مطلوبة'),
];
