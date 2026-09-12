const { param } = require('express-validator');

exports.toggleFavoriteValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('معرف العقار غير صالح')
    .toInt(),
];