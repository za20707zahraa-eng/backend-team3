const analyticsService = require('../services/analytics.service');
const { successResponse } = require('../utils/response');

exports.getAnalytics = async (req, res, next) => {
  try {
    const analytics = await analyticsService.getAgentAnalytics(req.user.id);
    return successResponse(res, 'تم جلب الإحصائيات بنجاح', analytics);
  } catch (error) {
    next(error);
  }
};