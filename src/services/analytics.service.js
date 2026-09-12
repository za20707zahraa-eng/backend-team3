const Property = require('../models/Property');
const Inquiry = require('../models/Inquiry');

exports.getAgentAnalytics = async (agentId) => {
  const agentProperties = await Property.findByAgentId(agentId);
  const propertyIds = agentProperties.map(p => p.id);

  const totalProperties = agentProperties.length;
  const totalInquiries = propertyIds.length
    ? await Inquiry.countByPropertyIds(propertyIds)
    : 0;

  const propertyStatusSummary = {
    available: agentProperties.filter(p => p.status === 'available').length,
    pending: agentProperties.filter(p => p.status === 'pending').length,
    sold: agentProperties.filter(p => p.status === 'sold').length,
  };

  const inquiryStatusCounts = propertyIds.length
    ? await Inquiry.countByStatusForPropertyIds(propertyIds)
    : [];

  const inquiryStatusSummary = {
    pending: 0,
    replied: 0,
    closed: 0,
  };

  inquiryStatusCounts.forEach(item => {
    inquiryStatusSummary[item.status] = parseInt(item.count, 10);
  });

  return {
    totalProperties,
    totalInquiries,
    propertyStatusSummary,
    inquiryStatusSummary,
  };
};
