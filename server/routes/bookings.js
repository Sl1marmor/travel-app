/**
 * server/routes/bookings.js
 * Маршрути для бронювань
 *
 * POST /api/bookings           - створити бронювання
 * GET  /api/bookings/my        - мої бронювання (захищений)
 * DELETE /api/bookings/:id     - скасувати бронювання
 */

const express = require("express");
const router  = express.Router();
const db      = require("../db");
const { authMiddleware } = require("./auth");

/* ── POST /api/bookings ── */
router.post("/", authMiddleware, async (req, res) => {
  const { destination_id, check_in, check_out, guests, name, phone } = req.body;

  if (!destination_id || !check_in || !check_out || !guests) {
    return res.status(400).json({ error: "Заповніть всі поля бронювання" });
  }

  try {
    // отримуємо ціну з БД
    const dest = await db.query("SELECT price FROM destinations WHERE id = $1", [destination_id]);
    if (dest.rows.length === 0) {
      return res.status(404).json({ error: "Напрямок не знайдено" });
    }

    const price_per_night = dest.rows[0].price;
    const nights = Math.ceil(
      (new Date(check_out) - new Date(check_in)) / (1000 * 60 * 60 * 24)
    );
    const total_price = Math.round(price_per_night * nights * 1.08); // +8% збір

    const { rows } = await db.query(
      `INSERT INTO bookings
        (user_id, destination_id, check_in, check_out, guests, guest_name, guest_phone, total_price, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'confirmed')
       RETURNING *`,
      [req.user.id, destination_id, check_in, check_out, guests, name, phone, total_price]
    );

    res.status(201).json(rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Помилка створення бронювання" });
  }
});

/* ── GET /api/bookings/my ── */
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT b.*, d.name AS dest_name, d.country, d.img, d.rating
       FROM bookings b
       JOIN destinations d ON b.destination_id = d.id
       WHERE b.user_id = $1
       ORDER BY b.created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Помилка отримання бронювань" });
  }
});

/* ── DELETE /api/bookings/:id ── */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { rows } = await db.query(
      "UPDATE bookings SET status = 'cancelled' WHERE id = $1 AND user_id = $2 RETURNING *",
      [req.params.id, req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Бронювання не знайдено" });
    }

    res.json({ message: "Бронювання скасовано", booking: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Помилка скасування" });
  }
});

module.exports = router;
