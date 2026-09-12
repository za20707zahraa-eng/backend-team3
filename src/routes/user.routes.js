const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const {
  userIdValidator,
  getUsersValidator,
  createUserValidator,
  updateUserValidator,
} = require('../validators/user.validator');
const validate = require('../middlewares/validate.middleware');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { checkUserOwnership } = require('../middlewares/ownership.middleware');

router.get(
  '/users',
  authenticate,
  authorize('admin'),
  getUsersValidator,
  validate,
  userController.getUsers
);

router.post(
  '/users',
  authenticate,
  authorize('admin'),
  createUserValidator,
  validate,
  userController.createUser
);

router.get(
  '/users/:id',
  authenticate,
  userIdValidator,
  validate,
  checkUserOwnership,
  userController.getUserById
);

router.patch(
  '/users/:id',
  authenticate,
  updateUserValidator,
  validate,
  checkUserOwnership,
  userController.updateUser
);

router.delete(
  '/users/:id',
  authenticate,
  authorize('admin'),
  userIdValidator,
  validate,
  userController.deleteUser
);

module.exports = router;
