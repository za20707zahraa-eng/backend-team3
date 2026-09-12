const express = require('express');
const cors = require('cors');
const path = require('path');

const favoriteRoutes = require('./routes/favorite.routes');
const inquiryRoutes = require('./routes/inquiry.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const propertyRoutes = require('./routes/property.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use((req,res , next) => {
  req.user = { id: '650000000000000000000001', role: 'agent' };
  next();
});

app.use('/api', favoriteRoutes);
app.use('/api', inquiryRoutes);
app.use('/api', analyticsRoutes);
app.use('/api/properties', propertyRoutes);

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'خطأ غير متوقع في السيرفر'
  });
});

module.exports = app;