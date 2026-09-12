const Property = require('../models/Property').default;
const Inquiry = require('../models/Inquiry');

exports.getAgentAnalytics = async (agentId) => {
  const agentProperties = await Property.find({ agent_id: agentId });
  const propertyIds = agentProperties.map(p => p._id);

  const totalProperties = agentProperties.length;
  const totalInquiries = await Inquiry.countDocuments({ property_id: { $in: propertyIds } });

  const propertyStatusSummary = {
    available: agentProperties.filter(p => p.status === 'available').length,
    pending: agentProperties.filter(p => p.status === 'pending').length,
    sold: agentProperties.filter(p => p.status === 'sold').length,
  };

  const inquiryStatusCounts = await Inquiry.aggregate([
    { $match: { property_id: { $in: propertyIds } } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const inquiryStatusSummary = {
    pending: 0,
    replied: 0,
    closed: 0,
  };

  inquiryStatusCounts.forEach(item => {
    inquiryStatusSummary[item._id] = item.count;
  });

  return {
    totalProperties,
    totalInquiries,
    propertyStatusSummary,
    inquiryStatusSummary,
  };
};