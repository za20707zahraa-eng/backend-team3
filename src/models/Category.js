const { pool } = require('../config/database');

exports.findAll = async ({ limit, offset }) => {
  const result = await pool.query(
    'SELECT id, name, description, created_at, updated_at FROM categories ORDER BY created_at DESC LIMIT $1 OFFSET $2',
    [limit, offset]
  );
  return result.rows;
};

exports.count = async () => {
  const result = await pool.query('SELECT COUNT(*)::int AS count FROM categories');
  return result.rows[0].count;
};

exports.findById = async (id) => {
  const result = await pool.query(
    'SELECT id, name, description, created_at, updated_at FROM categories WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

exports.findByName = async (name, excludeId) => {
  if (excludeId) {
    const result = await pool.query(
      'SELECT id FROM categories WHERE name = $1 AND id <> $2',
      [name, excludeId]
    );
    return result.rows[0];
  }

  const result = await pool.query('SELECT id FROM categories WHERE name = $1', [name]);
  return result.rows[0];
};

exports.create = async ({ name, description }) => {
  const result = await pool.query(
    `INSERT INTO categories (name, description)
     VALUES ($1, $2)
     RETURNING id, name, description, created_at, updated_at`,
    [name, description || null]
  );
  return result.rows[0];
};

exports.updateById = async (id, { name, description }) => {
  const result = await pool.query(
    `UPDATE categories
     SET name = $1,
         description = $2,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $3
     RETURNING id, name, description, created_at, updated_at`,
    [name, description, id]
  );
  return result.rows[0];
};

exports.deleteById = async (id) => {
  await pool.query('DELETE FROM categories WHERE id = $1', [id]);
};
