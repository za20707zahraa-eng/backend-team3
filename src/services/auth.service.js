const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/bcrypt');
const { generateToken } = require('../utils/jwt');

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

exports.register = async ({ name, email, phone, password, role }) => {
  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = await User.findByEmail(normalizedEmail);
  if (existingUser) {
    throw createHttpError('البريد الإلكتروني مستخدم مسبقاً', 400);
  }

  const userCount = await User.count();
  let assignedRole = 'client';
  if (role === 'agent') assignedRole = 'agent';
  if (userCount === 0) assignedRole = 'admin';

  const hashedPassword = await hashPassword(password);
  const user = await User.create({
    name,
    email: normalizedEmail,
    phone,
    password: hashedPassword,
    role: assignedRole,
  });

  const token = generateToken({ id: user.id, role: user.role });
  return { user: sanitizeUser(user), token };
};

exports.login = async ({ email, password }) => {
  const user = await User.findByEmail(email.toLowerCase().trim(), { withPassword: true });
  if (!user) {
    throw createHttpError('بيانات الدخول غير صحيحة', 401);
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw createHttpError('بيانات الدخول غير صحيحة', 401);
  }

  const token = generateToken({ id: user.id, role: user.role });
  return { user: sanitizeUser(user), token };
};

exports.getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw createHttpError('المستخدم غير موجود', 404);
  }
  return user;
};
