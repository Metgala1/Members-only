const pool = require("./db");

const createUser = async ({ username, hashedPassword, first_name, last_name, email }) => {
  const result = await pool.query(
    `INSERT INTO users (username, password, first_name, last_name, email)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [username, hashedPassword, first_name, last_name, email]
  );
  return result.rows[0];
};

const findUserByUsername = async (username) => {
  const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
  return result.rows[0];
};

const findUserById = async (id) => {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0];
};

module.exports = {
  createUser,
  findUserByUsername,
  findUserById,
};

