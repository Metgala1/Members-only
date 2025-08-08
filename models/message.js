const pool = require("./db");

async function createMessage({ title, content, user_id }) {
  const result = await pool.query(
    "INSERT INTO messages (title, content, user_id) VALUES ($1, $2, $3) RETURNING *",
    [title, content, user_id]
  );
  return result.rows[0];
}

async function getAllMessages() {
  try {
    const result = await pool.query(
      `SELECT messages.*, users.username
       FROM messages
       JOIN users ON messages.user_id = users.id
       ORDER BY created_at DESC`
    );
    return result.rows;
  } catch (err) {
    console.error('Error fetching messages:', err);
    throw err;
  }
}


module.exports = { createMessage, getAllMessages };