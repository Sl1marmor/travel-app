/**
 * server/db.js
 * Підключення до PostgreSQL
 */

const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes("render.com")
    ? { rejectUnauthorized: false }
    : false,
});

// Перевірка підключення при старті
pool.connect((err, client, release) => {
  if (err) {
    console.error("❌ Помилка підключення до PostgreSQL:", err.message);
  } else {
    console.log("✅ PostgreSQL підключено успішно");
    release();
  }
});

module.exports = pool;
