const { pool } = require('../config/database');

exports.findOne = async (userId, propertyId) => {
  const result = await pool.query(
    'SELECT id, user_id, property_id, created_at FROM favorites WHERE user_id = $1 AND property_id = $2',
    [userId, propertyId]
  );
  return result.rows[0];
};

exports.create = async ({ user_id, property_id }) => {
  const result = await pool.query(
    `INSERT INTO favorites (user_id, property_id)
     VALUES ($1, $2)
     RETURNING id, user_id, property_id, created_at`,
    [user_id, property_id]
  );
  return result.rows[0];
};

exports.deleteById = async (id) => {
  await pool.query('DELETE FROM favorites WHERE id = $1', [id]);
};

exports.findByUserIdWithProperty = async (userId) => {
  const result = await pool.query(
    `SELECT
       f.id, f.user_id, f.created_at,
       p.id AS p_id, p.title, p.address, p.price, p.type, p.category, p.status,
       p.agent_id, p.images, p.created_at AS p_created_at, p.updated_at AS p_updated_at
     FROM favorites f
     LEFT JOIN properties p ON p.id = f.property_id
     WHERE f.user_id = $1
     ORDER BY f.created_at DESC`,
    [userId]
  );

  return result.rows.map((row) => ({
    id: row.id,
    user_id: row.user_id,
    created_at: row.created_at,
    property_id: row.p_id
      ? {
        id: row.p_id,
        title: row.title,
        address: row.address,
        price: row.price,
        type: row.type,
        category: row.category,
        status: row.status,
        agent_id: row.agent_id,
        images: row.images || [],
        created_at: row.p_created_at,
        updated_at: row.p_updated_at,
      }
      : null,
  }));
};
