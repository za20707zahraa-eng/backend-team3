const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favorite.controller');
const { toggleFavoriteValidator } = require('../validators/favorite.validator');
const validate = require('../middlewares/validate.middleware');
const { authenticate } = require('../middlewares/auth.middleware');

router.post('/properties/:id/favorite', authenticate, toggleFavoriteValidator, validate, favoriteController.toggleFavorite);
router.get('/favorites', authenticate, favoriteController.getFavorites);

module.exports = router;