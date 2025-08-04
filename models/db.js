const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:vGLdIIzujWSHlohlqGQavOONmVdKlIrG@shortline.proxy.rlwy.net:48453/railway",
  ssl: {
    rejectUnauthorized: false, // Required for Railway SSL
  },
});

module.exports = pool;