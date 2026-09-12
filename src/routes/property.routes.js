const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload.middleware');
const {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
} = require('../controllers/property.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { checkPropertyOwnership } = require('../middlewares/ownership.middleware');

router.post('/', authenticate, upload.array('images', 5), createProperty);
router.get('/', getProperties);
router.get('/:id', getPropertyById);
router.put('/:id', authenticate, checkPropertyOwnership, upload.array('images', 5), updateProperty);
router.delete('/:id', authenticate, checkPropertyOwnership, deleteProperty);

module.exports = router;
