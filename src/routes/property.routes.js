const express = require('express');
const router = express.Router();
const upload = require('./middlewares/upload.middleware');
const {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty
} = require('./controllers/property.controller.js');

router.post('/', upload.array('images', 5), createProperty);
router.get('/', getProperties);
router.get('/:id', getPropertyById);
router.put('/:id', upload.array('images', 5), updateProperty);
router.delete('/:id', deleteProperty);

module.exports = router;