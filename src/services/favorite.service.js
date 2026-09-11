const Favorite = require('../models/Favorite');

exports.toggleFavorite = async (userId, propertyId) => {
  const existingFavorite = await Favorite.findOne({ user_id: userId, property_id: propertyId });

  if (existingFavorite) {
    await Favorite.deleteOne({ _id: existingFavorite._id });
    return { isFavorited: false, message: 'تم إزالة العقار من المفضلة' };
  }

  await Favorite.create({ user_id: userId, property_id: propertyId });
  return { isFavorited: true, message: 'تم إضافة العقار إلى المفضلة' };
};

exports.getUserFavorites = async (userId) => {
  return await Favorite.find({ user_id: userId })
    .populate('property_id')
    .sort({ created_at: -1 });
};