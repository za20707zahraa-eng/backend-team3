const Property = require('../models/Property');

const createHttpError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const ALLOWED_TYPES = ['sale', 'rent'];
const ALLOWED_CATEGORIES = ['apartment', 'house', 'villa', 'land'];
const ALLOWED_STATUSES = ['available', 'pending', 'sold'];

exports.createProperty = async ({ body, files, user }) => {
  const { title, address, price, type, category, status } = body;

  if (!title || !address || price === undefined || !type || !category) {
    throw createHttpError('البيانات المطلوبة للعقار غير مكتملة', 400);
  }

  if (!ALLOWED_TYPES.includes(type)) {
    throw createHttpError('نوع العقار غير صالح', 400);
  }

  if (!ALLOWED_CATEGORIES.includes(category)) {
    throw createHttpError('تصنيف العقار غير صالح', 400);
  }

  if (status && !ALLOWED_STATUSES.includes(status)) {
    throw createHttpError('حالة العقار غير صالحة', 400);
  }

  const images = files ? files.map((file) => file.path) : [];

  return await Property.create({
    title,
    address,
    price,
    type,
    category,
    status,
    agent_id: user ? user.id : body.agent_id,
    images,
  });
};

exports.getProperties = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const offset = (page - 1) * limit;

  const { properties, total } = await Property.findAll({
    search: query.search,
    type: query.type,
    category: query.category,
    minPrice: query.minPrice,
    maxPrice: query.maxPrice,
    status: query.status,
    limit,
    offset,
  });

  return {
    count: properties.length,
    total,
    page,
    pages: Math.ceil(total / limit) || 1,
    data: properties,
  };
};

exports.getPropertyById = async (id) => {
  const property = await Property.findByIdWithAgent(id);
  if (!property) {
    throw createHttpError('Property not found', 404);
  }
  return property;
};

exports.updateProperty = async (id, { body, files }) => {
  const existing = await Property.findById(id);
  if (!existing) {
    throw createHttpError('Property not found', 404);
  }

  const updates = {};
  if (body.title !== undefined) updates.title = body.title;
  if (body.address !== undefined) updates.address = body.address;
  if (body.price !== undefined) updates.price = body.price;
  if (body.status !== undefined) {
    if (!ALLOWED_STATUSES.includes(body.status)) {
      throw createHttpError('حالة العقار غير صالحة', 400);
    }
    updates.status = body.status;
  }
  if (body.type !== undefined) {
    if (!ALLOWED_TYPES.includes(body.type)) {
      throw createHttpError('نوع العقار غير صالح', 400);
    }
    updates.type = body.type;
  }
  if (body.category !== undefined) {
    if (!ALLOWED_CATEGORIES.includes(body.category)) {
      throw createHttpError('تصنيف العقار غير صالح', 400);
    }
    updates.category = body.category;
  }

  if (files && files.length > 0) {
    updates.images = files.map((file) => file.path);
  }

  return await Property.updateById(id, updates);
};

exports.deleteProperty = async (id) => {
  const deleted = await Property.deleteById(id);
  if (!deleted) {
    throw createHttpError('Property not found', 404);
  }
  return true;
};
