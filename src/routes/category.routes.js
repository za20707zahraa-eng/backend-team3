const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const {
  categoryIdValidator,
  createCategoryValidator,
  updateCategoryValidator,
} = require('../validators/category.validator');
const validate = require('../middlewares/validate.middleware');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

router.get('/categories', categoryController.getCategories);
router.get('/categories/:id', categoryIdValidator, validate, categoryController.getCategoryById);

router.post(
  '/categories',
  authenticate,
  authorize('admin'),
  createCategoryValidator,
  validate,
  categoryController.createCategory
);

router.patch(
  '/categories/:id',
  authenticate,
  authorize('admin'),
  updateCategoryValidator,
  validate,
  categoryController.updateCategory
);

router.delete(
  '/categories/:id',
  authenticate,
  authorize('admin'),
  categoryIdValidator,
  validate,
  categoryController.deleteCategory
);

module.exports = router;
