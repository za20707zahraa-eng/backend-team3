const Inquiry = require('../models/Inquiry');
const Property = require('../models/Property');

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
  const agentProperties = await Property.findIdsByAgentId(agentId);
  const propertyIds = agentProperties.map(p => p.id);

  if (propertyIds.length === 0) {
    return [];
  }

  return await Inquiry.findByPropertyIds(propertyIds);
};

exports.updateStatus = async (inquiryId, agentId, status) => {
  const inquiry = await Inquiry.findByIdWithProperty(inquiryId);
  if (!inquiry) throw new Error('الاستفسار غير موجود');

  if (!inquiry.property_id || String(inquiry.property_id.agent_id) !== String(agentId)) {
    throw new Error('غير مصرح لك بتعديل هذا الاستفسار');
  }

  await Inquiry.updateStatus(inquiryId, status);
  return await Inquiry.findByIdWithProperty(inquiryId);
};
