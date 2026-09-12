const Property = require('../models/Property');
exports.createProperty = async (req, res) => { try { const imagePaths = req.files ? req.files.map(file => file.path) : [];
const property = new Property({
  ...req.body,
  images: imagePaths,
  agent_id: req.user ? req.user.id : req.body.agent_id
});

await property.save();
res.status(201).json({ success: true, data: property });
} catch (error) { res.status(400).json({ success: false, message: error.message }); } };
exports.getProperties = async (req, res) => { try { const { search, type, category, minPrice, maxPrice, status, page = 1, limit = 10 } = req.query;
let query = {};

if (search) {
  query.$or = [
    { title: { $regex: search, $options: 'i' } },
    { address: { $regex: search, $options: 'i' } }
  ];
}

if (type) query.type = type;
if (category) query.category = category;
if (status) query.status = status;

if (minPrice || maxPrice) {
  query.price = {};
  if (minPrice) query.price.$gte = Number(minPrice);
  if (maxPrice) query.price.$lte = Number(maxPrice);
}

const pageNum = Number(page);
const limitNum = Number(limit);
const skip = (pageNum - 1) * limitNum;
const total = await Property.countDocuments(query);

const properties = await Property.find(query)
  .populate('agent_id', 'name email')
  .skip(skip)
  .limit(limitNum)
  .sort({ createdAt: -1 });

res.status(200).json({
  success: true,
  count: properties.length,
  total,
  page: pageNum,
  pages: Math.ceil(total / limitNum),
  data: properties
});
} catch (error) { res.status(500).json({ success: false, message: error.message }); } };
exports.getPropertyById = async (req, res) => { try { const property = await Property.findById(req.params.id).populate('agent_id', 'name email'); if (!property) { return res.status(404).json({ success: false, message: 'Property not found' }); } res.status(200).json({ success: true, data: property }); } catch (error) { res.status(500).json({ success: false, message: error.message }); } };
exports.updateProperty = async (req, res) => { try { let updateData = { ...req.body };
if (req.files && req.files.length > 0) {
  updateData.images = req.files.map(file => file.path);
}

const property = await Property.findByIdAndUpdate(req.params.id, updateData, {
  new: true,
  runValidators: true
});

if (!property) {
  return res.status(404).json({ success: false, message: 'Property not found' });
}

res.status(200).json({ success: true, data: property });
} catch (error) { res.status(400).json({ success: false, message: error.message }); } };
exports.deleteProperty = async (req, res) => { try { const property = await Property.findByIdAndDelete(req.params.id); if (!property) { return res.status(404).json({ success: false, message: 'Property not found' }); } res.status(200).json({ success: true, message: 'Property deleted successfully' }); } catch (error) { res.status(500).json({ success: false, message: error.message }); } };
