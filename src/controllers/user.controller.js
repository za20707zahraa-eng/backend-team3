const userService = require('../services/user.service');
const { successResponse } = require('../utils/response');

exports.getUsers = async (req, res, next) => {
  try {
    const result = await userService.getUsers(req.query);
    return successResponse(res, 'تم جلب المستخدمين بنجاح', result);
  } catch (error) {
    next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    return successResponse(res, 'تم جلب المستخدم بنجاح', user);
  } catch (error) {
    next(error);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    return successResponse(res, 'تم إنشاء المستخدم بنجاح', user, 201);
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body, req.user);
    return successResponse(res, 'تم تحديث المستخدم بنجاح', user);
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    await userService.deleteUser(req.params.id);
    return successResponse(res, 'تم حذف المستخدم بنجاح');
  } catch (error) {
    next(error);
  }
};
