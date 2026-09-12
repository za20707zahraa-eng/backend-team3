const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');
const { errorResponse } = require('../utils/response');

exports.authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'يجب تسجيل الدخول للوصول إلى هذا المورد', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);

    if (!user) {
      return errorResponse(res, 'المستخدم غير موجود أو التوكن غير صالح', 401);
    }

    req.user = { id: user.id, role: user.role };
    next();
  } catch (error) {
    return errorResponse(res, 'التوكن غير صالح أو منتهي الصلاحية', 401);
  }
};

exports.authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return errorResponse(res, 'ليست لديك صلاحية لتنفيذ هذه العملية', 403);
  }
  next();
};
