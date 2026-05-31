/**
 * server/seed.js
 * Створює таблиці і заповнює початковими даними
 *
 * ЗАПУСК (один раз):
 *   node seed.js
 */

require("dotenv").config();
const db = require("./db");

async function seed() {
  console.log("🌱 Починаємо заповнення бази даних...\n");

  /* ── Створення таблиць ── */
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id         SERIAL PRIMARY KEY,
      name       VARCHAR(100) NOT NULL,
      email      VARCHAR(150) UNIQUE NOT NULL,
      password   VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
  console.log("✅ Таблиця users створена");

  await db.query(`
    CREATE TABLE IF NOT EXISTS destinations (
      id      SERIAL PRIMARY KEY,
      name    VARCHAR(100) NOT NULL,
      country VARCHAR(100) NOT NULL,
      price   INTEGER NOT NULL,
      rating  NUMERIC(3,1) NOT NULL,
      tag     VARCHAR(50),
      img     TEXT,
      type    VARCHAR(50) DEFAULT 'hotel',
      beds    INTEGER DEFAULT 2
    );
  `);
  console.log("✅ Таблиця destinations створена");

  await db.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id             SERIAL PRIMARY KEY,
      user_id        INTEGER REFERENCES users(id) ON DELETE CASCADE,
      destination_id INTEGER REFERENCES destinations(id) ON DELETE CASCADE,
      check_in       DATE NOT NULL,
      check_out      DATE NOT NULL,
      guests         INTEGER NOT NULL DEFAULT 1,
      guest_name     VARCHAR(100),
      guest_phone    VARCHAR(30),
      total_price    INTEGER NOT NULL,
      status         VARCHAR(20) DEFAULT 'confirmed',
      created_at     TIMESTAMP DEFAULT NOW()
    );
  `);
  console.log("✅ Таблиця bookings створена");

  /* ── Початкові дані ── */
  // Очищаємо перед вставкою (щоб не дублювати)
  await db.query("DELETE FROM destinations");
  await db.query("SELECT setval('destinations_id_seq', 1, false)");

  const destinations = [
    ["Барселона",  "Іспанія",    3200, 9.2, "Популярне",  "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&q=80", "hotel",   2],
    ["Відень",     "Австрія",    4100, 9.4, "Топ вибір",  "https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=600&q=80", "apart",   1],
    ["Амстердам",  "Нідерланди", 3800, 8.9, "Знижка 20%", "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=600&q=80", "hotel",   3],
    ["Прага",      "Чехія",      2600, 9.1, "Бестселер",  "https://images.unsplash.com/photo-1541849546-216549ae216d?w=600&q=80", "cottage", 2],
    ["Дубровник",  "Хорватія",   5200, 9.6, "Люкс",       "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", "resort",  4],
    ["Лісабон",    "Португалія", 2900, 9.0, "Нове",       "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&q=80", "apart",   2],
    ["Рим",        "Італія",     3500, 9.3, "Популярне",  "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80", "hotel",   2],
    ["Париж",      "Франція",    4800, 9.5, "Топ вибір",  "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80", "apart",   1],
    ["Будапешт",   "Угорщина",   2200, 8.8, "Знижка 15%", "https://images.unsplash.com/photo-1551867633-194f125bddfa?w=600&q=80", "hotel",   3],
  ];

  for (const d of destinations) {
    await db.query(
      "INSERT INTO destinations (name, country, price, rating, tag, img, type, beds) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)",
      d
    );
  }
  console.log(`✅ Додано ${destinations.length} напрямків`);

  console.log("\n🎉 База даних готова!\n");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Помилка seed:", err.message);
  process.exit(1);
});
