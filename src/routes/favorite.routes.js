const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favorite.controller');
const { toggleFavoriteValidator } = require('../validators/favorite.validator');
const validate = require('../middlewares/validate.middleware');

router.post('/properties/:id/favorite', toggleFavoriteValidator, validate, favoriteController.toggleFavorite);
router.get('/favorites', favoriteController.getFavorites);

module.exports = router;