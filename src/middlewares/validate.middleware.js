const { validationResult } = require('express-validator');
const { errorResponse } = require('../utils/response');

module.exports = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, 'خطأ في البيانات المدخلة', 400, errors.array());
  }
  next();
};