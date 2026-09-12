const { pool } = require('../config/database');

exports.create = async ({ property_id, client_id, message }) => {
  const result = await pool.query(
    `INSERT INTO inquiries (property_id, client_id, message)
     VALUES ($1, $2, $3)
     RETURNING id, property_id, client_id, message, status, created_at, updated_at`,
    [property_id, client_id, message]
  );
  return result.rows[0];
};

exports.findByIdWithProperty = async (id) => {
  const result = await pool.query(
    `SELECT
       i.id, i.property_id, i.client_id, i.message, i.status, i.created_at, i.updated_at,
       p.id AS p_id, p.title, p.address, p.price, p.status AS p_status, p.agent_id
     FROM inquiries i
     LEFT JOIN properties p ON p.id = i.property_id
     WHERE i.id = $1`,
    [id]
  );

  const row = result.rows[0];
  if (!row) return null;

  return {
    id: row.id,
    property_id: row.p_id
      ? {
        id: row.p_id,
        title: row.title,
        address: row.address,
        price: row.price,
        status: row.p_status,
        agent_id: row.agent_id,
      }
      : null,
    client_id: row.client_id,
    message: row.message,
    status: row.status,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
};

exports.findByPropertyIds = async (propertyIds) => {
  const result = await pool.query(
    `SELECT
       i.id, i.message, i.status, i.created_at, i.updated_at,
       u.id AS client_id, u.name AS client_name, u.email AS client_email, u.phone AS client_phone,
       p.id AS p_id, p.title, p.address, p.price
     FROM inquiries i
     LEFT JOIN users u ON u.id = i.client_id
     LEFT JOIN properties p ON p.id = i.property_id
     WHERE i.property_id = ANY($1::int[])
     ORDER BY i.created_at DESC`,
    [propertyIds]
  );

  return result.rows.map((row) => ({
    id: row.id,
    message: row.message,
    status: row.status,
    created_at: row.created_at,
    updated_at: row.updated_at,
    client_id: row.client_id
      ? {
        id: row.client_id,
        name: row.client_name,
        email: row.client_email,
        phone: row.client_phone,
      }
      : null,
    property_id: row.p_id
      ? {
        id: row.p_id,
        title: row.title,
        address: row.address,
        price: row.price,
      }
      : null,
  }));
};

exports.updateStatus = async (id, status) => {
  const result = await pool.query(
    `UPDATE inquiries
     SET status = $1, updated_at = CURRENT_TIMESTAMP
     WHERE id = $2
     RETURNING id, property_id, client_id, message, status, created_at, updated_at`,
    [status, id]
  );
  return result.rows[0];
};

exports.countByPropertyIds = async (propertyIds) => {
  const result = await pool.query(
    'SELECT COUNT(*)::int AS count FROM inquiries WHERE property_id = ANY($1::int[])',
    [propertyIds]
  );
  return result.rows[0].count;
};

exports.countByStatusForPropertyIds = async (propertyIds) => {
  const result = await pool.query(
    `SELECT status, COUNT(*)::int AS count
     FROM inquiries
     WHERE property_id = ANY($1::int[])
     GROUP BY status`,
    [propertyIds]
  );
  return result.rows;
};
