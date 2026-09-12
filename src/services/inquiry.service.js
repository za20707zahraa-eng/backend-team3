const Inquiry = require('../models/Inquiry');
const Property = require('../models/Property').default;

exports.createInquiry = async (clientId, propertyId, message) => {
  const property = await Property.findById(propertyId);
  if (!property) throw new Error('العقار غير موجود');

  return await Inquiry.create({
    client_id: clientId,
    property_id: propertyId,
    message,
  });
};

exports.getAgentInquiries = async (agentId) => {
  const agentProperties = await Property.find({ agent_id: agentId }).select('_id');
  const propertyIds = agentProperties.map(p => p._id);

  return await Inquiry.find({ property_id: { $in: propertyIds } })
    .populate('client_id', 'name email phone')
    .populate('property_id', 'title address price')
    .sort({ created_at: -1 });
};

exports.updateStatus = async (inquiryId, agentId, status) => {
  const inquiry = await Inquiry.findById(inquiryId).populate('property_id');
  if (!inquiry) throw new Error('الاستفسار غير موجود');

  if (inquiry.property_id.agent_id.toString() !== agentId.toString()) {
    throw new Error('غير مصرح لك بتعديل هذا الاستفسار');
  }

  inquiry.status = status;
  await inquiry.save();
  return inquiry;
};