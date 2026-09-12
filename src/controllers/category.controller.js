const categoryService = require('../services/category.service');
const { successResponse } = require('../utils/response');

exports.getCategories = async (req, res, next) => {
  try {
    const result = await categoryService.getCategories(req.query);
    return successResponse(res, 'تم جلب التصنيفات بنجاح', result);
  } catch (error) {
    next(error);
  }
};

exports.getCategoryById = async (req, res, next) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    return successResponse(res, 'تم جلب التصنيف بنجاح', category);
  } catch (error) {
    next(error);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const category = await categoryService.createCategory(req.body);
    return successResponse(res, 'تم إنشاء التصنيف بنجاح', category, 201);
  } catch (error) {
    next(error);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const category = await categoryService.updateCategory(req.params.id, req.body);
    return successResponse(res, 'تم تحديث التصنيف بنجاح', category);
  } catch (error) {
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    await categoryService.deleteCategory(req.params.id);
    return successResponse(res, 'تم حذف التصنيف بنجاح');
  } catch (error) {
    next(error);
  }
};
