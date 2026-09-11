const express = require('express');
const cors = require('cors');

const favoriteRoutes = require('./routes/favorite.routes');
const inquiryRoutes = require('./routes/inquiry.routes');
const analyticsRoutes = require('./routes/analytics.routes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Dummy Auth Middleware لتمرير المستخدم حتى تكتمل المهمة الأولى
app.use((req, res, next) => {
  req.user = { id: '650000000000000000000001', role: 'agent' };
  next();
});

// Routes Registration
app.use('/api', favoriteRoutes);
app.use('/api', inquiryRoutes);
app.use('/api', analyticsRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'خطأ غير متوقع في السيرفر',
  });
});

module.exports = app;