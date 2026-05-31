/**
 * server/db.js
 * Підключення до PostgreSQL
 */

const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // або можна вказати окремо:
  // host:     process.env.DB_HOST     || "localhost",
  // port:     process.env.DB_PORT     || 5432,
  // database: process.env.DB_NAME     || "travel_app",
  // user:     process.env.DB_USER     || "postgres",
  // password: process.env.DB_PASSWORD || "password",
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
