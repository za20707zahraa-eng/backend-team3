const { pool } = require('../config/database');

const PROPERTY_COLUMNS = `
  p.id, p.title, p.address, p.price, p.type, p.category, p.status,
  p.agent_id, p.images, p.created_at, p.updated_at
`;

const mapProperty = (row, withAgent = false) => {
  if (!row) return null;

  const property = {
    id: row.id,
    title: row.title,
    address: row.address,
    price: row.price,
    type: row.type,
    category: row.category,
    status: row.status,
    agent_id: row.agent_id,
    images: row.images || [],
    created_at: row.created_at,
    updated_at: row.updated_at,
  };

  if (withAgent) {
    property.agent = row.agent_id
      ? { id: row.agent_id, name: row.agent_name, email: row.agent_email }
      : null;
  }

  return property;
};

exports.findById = async (id) => {
  const result = await pool.query(
    `SELECT ${PROPERTY_COLUMNS} FROM properties p WHERE p.id = $1`,
    [id]
  );
  return mapProperty(result.rows[0]);
};

exports.findByIdWithAgent = async (id) => {
  const result = await pool.query(
    `SELECT ${PROPERTY_COLUMNS}, u.name AS agent_name, u.email AS agent_email
     FROM properties p
     LEFT JOIN users u ON u.id = p.agent_id
     WHERE p.id = $1`,
    [id]
  );
  return mapProperty(result.rows[0], true);
};

exports.findByAgentId = async (agentId) => {
  const result = await pool.query(
    `SELECT ${PROPERTY_COLUMNS} FROM properties p WHERE p.agent_id = $1`,
    [agentId]
  );
  return result.rows.map((row) => mapProperty(row));
};

exports.findIdsByAgentId = async (agentId) => {
  const result = await pool.query(
    'SELECT id FROM properties WHERE agent_id = $1',
    [agentId]
  );
  return result.rows;
};

exports.findAll = async ({ search, type, category, minPrice, maxPrice, status, limit, offset }) => {
  const where = [];
  const values = [];
  let index = 1;

  if (search) {
    where.push(`(p.title ILIKE $${index} OR p.address ILIKE $${index})`);
    values.push(`%${search}%`);
    index += 1;
  }

  if (type) {
    where.push(`p.type = $${index}`);
    values.push(type);
    index += 1;
  }

  if (category) {
    where.push(`p.category = $${index}`);
    values.push(category);
    index += 1;
  }

  if (status) {
    where.push(`p.status = $${index}`);
    values.push(status);
    index += 1;
  }

  if (minPrice !== undefined && minPrice !== null && minPrice !== '') {
    where.push(`p.price >= $${index}`);
    values.push(Number(minPrice));
    index += 1;
  }

  if (maxPrice !== undefined && maxPrice !== null && maxPrice !== '') {
    where.push(`p.price <= $${index}`);
    values.push(Number(maxPrice));
    index += 1;
  }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS count FROM properties p ${whereSql}`,
    values
  );

  const listValues = [...values, limit, offset];
  const result = await pool.query(
    `SELECT ${PROPERTY_COLUMNS}, u.name AS agent_name, u.email AS agent_email
     FROM properties p
     LEFT JOIN users u ON u.id = p.agent_id
     ${whereSql}
     ORDER BY p.created_at DESC
     LIMIT $${index} OFFSET $${index + 1}`,
    listValues
  );

  return {
    properties: result.rows.map((row) => mapProperty(row, true)),
    total: countResult.rows[0].count,
  };
};

exports.create = async ({ title, address, price, type, category, status, agent_id, images }) => {
  const result = await pool.query(
    `INSERT INTO properties (title, address, price, type, category, status, agent_id, images)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING id, title, address, price, type, category, status, agent_id, images, created_at, updated_at`,
    [title, address, price, type, category, status || 'available', agent_id || null, images || []]
  );
  return mapProperty(result.rows[0]);
};

const ALLOWED_UPDATES = ['title', 'address', 'price', 'type', 'category', 'status', 'agent_id', 'images'];

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
    `UPDATE properties SET ${fields.join(', ')}
     WHERE id = $${index}
     RETURNING id, title, address, price, type, category, status, agent_id, images, created_at, updated_at`,
    values
  );
  return mapProperty(result.rows[0]);
};

exports.deleteById = async (id) => {
  const result = await pool.query(
    'DELETE FROM properties WHERE id = $1 RETURNING id',
    [id]
  );
  return result.rows[0];
};
