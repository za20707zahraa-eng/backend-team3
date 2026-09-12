const Category = require('../models/Category');
const { getPagination } = require('../utils/pagination');

const createHttpError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

exports.getCategories = async (query) => {
  const { page, limit, skip } = getPagination(query.page, query.limit);

  const [categories, total] = await Promise.all([
    Category.findAll({ limit, offset: skip }),
    Category.count(),
  ]);

  return {
    categories,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

exports.getCategoryById = async (categoryId) => {
  const category = await Category.findById(categoryId);
  if (!category) {
    throw createHttpError('التصنيف غير موجود', 404);
  }
  return category;
};

exports.createCategory = async ({ name, description }) => {
  const existingCategory = await Category.findByName(name);
  if (existingCategory) {
    throw createHttpError('اسم التصنيف مستخدم مسبقاً', 400);
  }

  return await Category.create({ name, description });
};

exports.updateCategory = async (categoryId, { name, description }) => {
  const category = await Category.findById(categoryId);
  if (!category) {
    throw createHttpError('التصنيف غير موجود', 404);
  }

  let nextName = category.name;
  let nextDescription = category.description;

  if (name && name !== category.name) {
    const existingCategory = await Category.findByName(name, categoryId);
    if (existingCategory) {
      throw createHttpError('اسم التصنيف مستخدم مسبقاً', 400);
    }
    nextName = name;
  }

  if (description !== undefined) {
    nextDescription = description;
  }

  return await Category.updateById(categoryId, {
    name: nextName,
    description: nextDescription,
  });
};

exports.deleteCategory = async (categoryId) => {
  const category = await Category.findById(categoryId);
  if (!category) {
    throw createHttpError('التصنيف غير موجود', 404);
  }

  await Category.deleteById(categoryId);
  return true;
};
