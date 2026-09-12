const Favorite = require('../models/Favorite');

exports.toggleFavorite = async (userId, propertyId) => {
  const existingFavorite = await Favorite.findOne(userId, propertyId);

  if (existingFavorite) {
    await Favorite.deleteById(existingFavorite.id);
    return { isFavorited: false, message: 'تم إزالة العقار من المفضلة' };
  }

  await Favorite.create({ user_id: userId, property_id: propertyId });
  return { isFavorited: true, message: 'تم إضافة العقار إلى المفضلة' };
};

exports.getUserFavorites = async (userId) => {
  return await Favorite.findByUserIdWithProperty(userId);
};
