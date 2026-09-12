const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { registerValidator, loginValidator } = require('../validators/auth.validator');
const validate = require('../middlewares/validate.middleware');
const { authenticate } = require('../middlewares/auth.middleware');

router.post('/auth/register', registerValidator, validate, authController.register);
router.post('/auth/login', loginValidator, validate, authController.login);
router.get('/auth/me', authenticate, authController.getMe);

module.exports = router;
