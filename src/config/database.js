const { Pool } = require('pg');
const env = require('./env');

const pool = new Pool({
  user: env.db.user,
  password: env.db.password,
  database: env.db.name,
  host: env.db.host,
  port: env.db.port,
});

const connectDB = async () => {
  try {
    await pool.query('SELECT NOW()');
    console.log('✅ PostgreSQL connected successfully');
  } catch (error) {
    console.error('❌ PostgreSQL connection error:', error.message);
    process.exit(1);
  }
};

module.exports = { pool, connectDB };
