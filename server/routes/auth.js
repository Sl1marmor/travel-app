/**
 * server/routes/auth.js
 * Маршрути для авторизації
 *
 * POST /api/auth/register  - реєстрація
 * POST /api/auth/login     - вхід
 * GET  /api/auth/me        - поточний користувач (захищений)
 */

const express   = require("express");
const router    = express.Router();
const bcrypt    = require("bcryptjs");
const jwt       = require("jsonwebtoken");
const db        = require("../db");

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key_change_in_production";

/* ── Middleware: перевірка токена ── */
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
  if (!token) return res.status(401).json({ error: "Токен відсутній" });

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Недійсний токен" });
  }
}

/* ── POST /api/auth/register ── */
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Заповніть всі поля" });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "Пароль мінімум 6 символів" });
  }

  try {
    // перевіряємо чи email вже існує
    const exists = await db.query("SELECT id FROM users WHERE email = $1", [email]);
    if (exists.rows.length > 0) {
      return res.status(409).json({ error: "Email вже зареєстрований" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { rows } = await db.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hashedPassword]
    );

    const user  = rows[0];
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({ user, token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Помилка реєстрації" });
  }
});

/* ── POST /api/auth/login ── */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Введіть email і пароль" });
  }

  try {
    const { rows } = await db.query("SELECT * FROM users WHERE email = $1", [email]);

    if (rows.length === 0) {
      return res.status(401).json({ error: "Невірний email або пароль" });
    }

    const user  = rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ error: "Невірний email або пароль" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      user:  { id: user.id, name: user.name, email: user.email },
      token,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Помилка входу" });
  }
});

/* ── GET /api/auth/me ── (захищений маршрут) */
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const { rows } = await db.query(
      "SELECT id, name, email, created_at FROM users WHERE id = $1",
      [req.user.id]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Помилка отримання профілю" });
  }
});

module.exports = router;
module.exports.authMiddleware = authMiddleware;
