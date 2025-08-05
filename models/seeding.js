const pool = require("./db");
const bcrypt = require("bcryptjs");

const dropTables = `
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS users;
`;

const createUsersTable = `
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(30) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  email VARCHAR(100) UNIQUE,
  is_member BOOLEAN DEFAULT FALSE,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

const createMessagesTable = `
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

const dummyUsers = [
  {
    username: "adminUser",
    password: "adminpass",
    first_name: "Admin",
    last_name: "User",
    email: "admin@example.com",
    is_member: true,
    is_admin: true,
  },
  {
    username: "memberUser",
    password: "memberpass",
    first_name: "Member",
    last_name: "User",
    email: "member@example.com",
    is_member: true,
    is_admin: false,
  },
  {
    username: "guestUser",
    password: "guestpass",
    first_name: "Guest",
    last_name: "User",
    email: "guest@example.com",
    is_member: false,
    is_admin: false,
  },
];

const dummyMessages = [
  {
    title: "Welcome!",
    content: "This is the first message from the admin.",
    username: "adminUser",
  },
  {
    title: "Hello World",
    content: "Happy to be a member here!",
    username: "memberUser",
  },
];

async function createDatabaseAndSeed() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query(dropTables);
    await client.query(createUsersTable);
    await client.query(createMessagesTable);

    const userIds = {};

    for (const user of dummyUsers) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const result = await client.query(
        `INSERT INTO users (username, password, first_name, last_name, email, is_member, is_admin)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id`,
        [
          user.username,
          hashedPassword,
          user.first_name,
          user.last_name,
          user.email,
          user.is_member,
          user.is_admin,
        ]
      );
      userIds[user.username] = result.rows[0].id;
    }

    for (const msg of dummyMessages) {
      const userId = userIds[msg.username];
      await client.query(
        `INSERT INTO messages (title, content, user_id)
         VALUES ($1, $2, $3)`,
        [msg.title, msg.content, userId]
      );
    }

    await client.query("COMMIT");
    console.log("Database seeded successfully ✅");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error creating database:", err);
  } finally {
    client.release();
  }
}

createDatabaseAndSeed();
