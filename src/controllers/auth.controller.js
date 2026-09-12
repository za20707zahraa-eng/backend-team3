const authService = require('../services/auth.service');
const { successResponse } = require('../utils/response');

exports.register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    return successResponse(res, 'تم إنشاء الحساب بنجاح', result, 201);
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    return successResponse(res, 'تم تسجيل الدخول بنجاح', result);
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user.id);
    return successResponse(res, 'تم جلب بيانات المستخدم بنجاح', user);
  } catch (error) {
    next(error);
  }
};
