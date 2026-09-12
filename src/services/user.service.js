const User = require('../models/User');
const { hashPassword } = require('../utils/bcrypt');
const { getPagination } = require('../utils/pagination');

const createHttpError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const sanitizeUser = (user) => {
  const userObject = { ...user };
  delete userObject.password;
  return userObject;
};

exports.getUsers = async (query) => {
  const { page, limit, skip } = getPagination(query.page, query.limit);
  const role = query.role || null;

  const [users, total] = await Promise.all([
    User.findAll({ role, limit, offset: skip }),
    User.count(role),
  ]);

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

exports.getUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw createHttpError('المستخدم غير موجود', 404);
  }
  return user;
};

exports.createUser = async ({ name, email, phone, password, role }) => {
  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = await User.findByEmail(normalizedEmail);
  if (existingUser) {
    throw createHttpError('البريد الإلكتروني مستخدم مسبقاً', 400);
  }

  const hashedPassword = await hashPassword(password);
  const user = await User.create({
    name,
    email: normalizedEmail,
    phone,
    password: hashedPassword,
    role: role || 'client',
  });

  return sanitizeUser(user);
};

exports.updateUser = async (userId, payload, requester) => {
  const user = await User.findById(userId);
  if (!user) {
    throw createHttpError('المستخدم غير موجود', 404);
  }

  const updates = {};
  if (payload.name !== undefined) updates.name = payload.name;
  if (payload.email !== undefined) updates.email = payload.email.toLowerCase().trim();
  if (payload.phone !== undefined) updates.phone = payload.phone;

  if (payload.password) {
    updates.password = await hashPassword(payload.password);
  }

  if (payload.role !== undefined) {
    if (requester.role !== 'admin') {
      throw createHttpError('ليست لديك صلاحية لتغيير الدور', 403);
    }
    updates.role = payload.role;
  }

  if (updates.email && updates.email !== user.email) {
    const existingUser = await User.emailExists(updates.email, userId);
    if (existingUser) {
      throw createHttpError('البريد الإلكتروني مستخدم مسبقاً', 400);
    }
  }

  if (Object.keys(updates).length === 0) {
    return user;
  }

  return await User.updateById(userId, updates);
};

exports.deleteUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw createHttpError('المستخدم غير موجود', 404);
  }

  await User.deleteById(userId);
  return true;
};
