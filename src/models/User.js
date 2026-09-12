const { pool } = require('../config/database');

const PUBLIC_USER_FIELDS = 'id, name, email, phone, role, created_at, updated_at';

exports.findByEmail = async (email, { withPassword = false } = {}) => {
  const columns = withPassword ? '*' : PUBLIC_USER_FIELDS;
  const result = await pool.query(
    `SELECT ${columns} FROM users WHERE email = $1`,
    [email]
  );
  return result.rows[0];
};

exports.findById = async (id) => {
  const result = await pool.query(
    `SELECT ${PUBLIC_USER_FIELDS} FROM users WHERE id = $1`,
    [id]
  );
  return result.rows[0];
};

exports.count = async (role) => {
  if (role) {
    const result = await pool.query('SELECT COUNT(*)::int AS count FROM users WHERE role = $1', [role]);
    return result.rows[0].count;
  }
  const result = await pool.query('SELECT COUNT(*)::int AS count FROM users');
  return result.rows[0].count;
};

exports.findAll = async ({ role, limit, offset }) => {
  if (role) {
    const result = await pool.query(
      `SELECT ${PUBLIC_USER_FIELDS} FROM users WHERE role = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
      [role, limit, offset]
    );
    return result.rows;
  }

  const result = await pool.query(
    `SELECT ${PUBLIC_USER_FIELDS} FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return result.rows;
};

exports.create = async ({ name, email, phone, password, role }) => {
  const result = await pool.query(
    `INSERT INTO users (name, email, phone, password, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING ${PUBLIC_USER_FIELDS}`,
    [name, email, phone || null, password, role]
  );
  return result.rows[0];
};

exports.emailExists = async (email, excludeId) => {
  const result = await pool.query(
    'SELECT id FROM users WHERE email = $1 AND id <> $2',
    [email, excludeId]
  );
  return result.rows[0];
};

const ALLOWED_UPDATES = ['name', 'email', 'phone', 'password', 'role'];

exports.updateById = async (id, updates) => {
  const fields = [];
  const values = [];
  let index = 1;

  Object.entries(updates).forEach(([key, value]) => {
    if (!ALLOWED_UPDATES.includes(key)) return;
    fields.push(`${key} = $${index}`);
    values.push(value);
    index += 1;
  });

  if (fields.length === 0) {
    return exports.findById(id);
  }

  fields.push('updated_at = CURRENT_TIMESTAMP');
  values.push(id);

  const result = await pool.query(
    `UPDATE users SET ${fields.join(', ')} WHERE id = $${index} RETURNING ${PUBLIC_USER_FIELDS}`,
    values
  );
  return result.rows[0];
};

exports.deleteById = async (id) => {
  await pool.query('DELETE FROM users WHERE id = $1', [id]);
};
