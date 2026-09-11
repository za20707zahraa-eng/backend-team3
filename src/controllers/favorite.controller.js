const favoriteService = require('../services/favorite.service');
const { successResponse } = require('../utils/response');

exports.toggleFavorite = async (req, res, next) => {
  try {
    const result = await favoriteService.toggleFavorite(req.user.id, req.params.id);
    return successResponse(res, result.message, { isFavorited: result.isFavorited });
  } catch (error) {
    next(error);
  }
};

exports.getFavorites = async (req, res, next) => {
  try {
    const favorites = await favoriteService.getUserFavorites(req.user.id);
    return successResponse(res, 'تم جلب المفضلة بنجاح', favorites);
  } catch (error) {
    next(error);
  }
};