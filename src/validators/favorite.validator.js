const { param } = require('express-validator');

exports.toggleFavoriteValidator = [
  param('id')
    .isMongoId()
    .withMessage('معرف العقار غير صالح'),
];