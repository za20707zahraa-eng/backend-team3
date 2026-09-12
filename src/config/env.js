const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.evn') });

module.exports = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'default_secret',
  databaseUrl: process.env.DATABASE_URL,
  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 5432,
    name: process.env.DB_NAME || 'real_estate_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
  },
};
