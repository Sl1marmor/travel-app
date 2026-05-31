/**
 * server/routes/destinations.js
 * Маршрути для напрямків/готелів
 *
 * GET  /api/destinations          - всі напрямки (з фільтрами)
 * GET  /api/destinations/:id      - один напрямок
 */

const express = require("express");
const router  = express.Router();
const db      = require("../db");

/* ── GET /api/destinations ── */
// Підтримує query параметри:
// ?type=hotel&sort=rating&search=Барселона&min=1000&max=5000
router.get("/", async (req, res) => {
  try {
    const { type, sort, search, min, max } = req.query;

    let query  = "SELECT * FROM destinations WHERE 1=1";
    const params = [];
    let i = 1;

    // фільтр по типу
    if (type) {
      query += ` AND type = $${i++}`;
      params.push(type);
    }

    // пошук по назві або країні
    if (search) {
      query += ` AND (name ILIKE $${i} OR country ILIKE $${i})`;
      params.push(`%${search}%`);
      i++;
    }

    // фільтр по ціні
    if (min) {
      query += ` AND price >= $${i++}`;
      params.push(Number(min));
    }
    if (max) {
      query += ` AND price <= $${i++}`;
      params.push(Number(max));
    }

    // сортування
    if (sort === "price_asc")  query += " ORDER BY price ASC";
    else if (sort === "price_desc") query += " ORDER BY price DESC";
    else query += " ORDER BY rating DESC"; // за замовчуванням

    const { rows } = await db.query(query, params);
    res.json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Не вдалося отримати напрямки" });
  }
});

/* ── GET /api/destinations/:id ── */
router.get("/:id", async (req, res) => {
  try {
    const { rows } = await db.query(
      "SELECT * FROM destinations WHERE id = $1",
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Напрямок не знайдено" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Не вдалося отримати напрямок" });
  }
});

module.exports = router;
