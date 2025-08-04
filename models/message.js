const pool = require("../models/db");

async function createMessage({ title, content, user_id }) {
  const result = await pool.query(
    "INSERT INTO messages (title, content, user_id) VALUES ($1, $2, $3) RETURNING *",
    [title, content, user_id]
  );
  return result.rows[0];
}

async function getAllMessages() {
  const result = await pool.query(
    `SELECT messages.*, users.username
     FROM messages
     JOIN users ON messages.user_id = users.id
     ORDER BY created_at`
  );
  return result.rows;
}

module.exports = { createMessage, getAllMessages };