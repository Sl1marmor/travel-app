/**
 * server/index.js
 * Головний файл Express сервера
 *
 * ВСТАНОВЛЕННЯ (у папці server/):
 *   npm install express pg cors dotenv bcryptjs jsonwebtoken
 *
 * ЗАПУСК:
 *   node index.js
 *   або з авто-перезавантаженням:
 *   npx nodemon index.js
 */

require("dotenv").config();
const express = require("express");
const cors    = require("cors");

const destinationsRouter = require("./routes/destinations");
const authRouter         = require("./routes/auth");
const bookingsRouter     = require("./routes/bookings");

const app  = express();
const PORT = process.env.PORT || 4000;

/* ── Middleware ── */
app.use(cors({ origin: "http://localhost:3000" })); // дозволяємо запити з React
app.use(express.json());

/* ── Маршрути ── */
app.use("/api/destinations", destinationsRouter);
app.use("/api/auth",         authRouter);
app.use("/api/bookings",     bookingsRouter);

/* ── Перевірка що сервер живий ── */
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

/* ── Обробка помилок ── */
app.use((err, req, res, next) => {
  console.error("Помилка сервера:", err.message);
  res.status(500).json({ error: "Внутрішня помилка сервера" });
});

app.listen(PORT, () => {
  console.log(`✅ Сервер запущено на http://localhost:${PORT}`);
});
