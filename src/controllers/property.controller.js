const propertyService = require('../services/property.service');

exports.createProperty = async (req, res, next) => {
  try {
    const property = await propertyService.createProperty({
      body: req.body,
      files: req.files,
      user: req.user,
    });
    return res.status(201).json({ success: true, data: property });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getProperties = async (req, res, next) => {
  try {
    const result = await propertyService.getProperties(req.query);
    return res.status(200).json({
      success: true,
      count: result.count,
      total: result.total,
      page: result.page,
      pages: result.pages,
      data: result.data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getPropertyById = async (req, res, next) => {
  try {
    const property = await propertyService.getPropertyById(req.params.id);
    return res.status(200).json({ success: true, data: property });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateProperty = async (req, res, next) => {
  try {
    const property = await propertyService.updateProperty(req.params.id, {
      body: req.body,
      files: req.files,
    });
    return res.status(200).json({ success: true, data: property });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteProperty = async (req, res, next) => {
  try {
    await propertyService.deleteProperty(req.params.id);
    return res.status(200).json({ success: true, message: 'Property deleted successfully' });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};
