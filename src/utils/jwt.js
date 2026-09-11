const jwt = require('jsonwebtoken');
const env = require('../config/env');

exports.generateToken = (payload) => {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: '7d' });
};

exports.verifyToken = (token) => {
  return jwt.verify(token, env.jwtSecret);
};