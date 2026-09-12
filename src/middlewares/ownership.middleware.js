const Property = require('../models/Property');
const { errorResponse } = require('../utils/response');

exports.checkUserOwnership = (req, res, next) => {
  if (req.user.role === 'admin' || String(req.user.id) === String(req.params.id)) {
    return next();
  }

  return errorResponse(res, 'غير مصرح لك بالوصول إلى هذه البيانات', 403);
};

exports.checkPropertyOwnership = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return errorResponse(res, 'العقار غير موجود', 404);
    }

    const isOwner = property.agent_id && String(property.agent_id) === String(req.user.id);
    if (req.user.role === 'admin' || isOwner) {
      req.property = property;
      return next();
    }

    return errorResponse(res, 'غير مصرح لك بالوصول إلى هذا العقار', 403);
  } catch (error) {
    next(error);
  }
};
