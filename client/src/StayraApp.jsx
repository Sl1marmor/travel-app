/**
 * StayraApp.jsx
 *
 * ВСТАНОВЛЕННЯ:
 * 1. Скопіюй цей файл у папку src/ свого React проєкту
 * 2. У src/index.js або src/main.jsx заміни:
 *    import App from './App';  →  import App from './StayraApp';
 * 3. Запусти сервер: cd server && npm run dev
 * 4. Запусти React: cd client && npm start
 */

import React, { useState, useEffect, useRef, useCallback } from "react";

/* ─────────────────────────────────────────────────────────
   API
───────────────────────────────────────────────────────── */
const API = "http://localhost:4000/api";

// Зберігаємо JWT токен між запитами
const token = { value: localStorage.getItem("token") || null };

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Помилка запиту");
  return data;
}

const CATEGORIES = [
  { icon: "🏨", label: "Готелі",      type: "hotel" },
  { icon: "🏠", label: "Апартаменти", type: "apart" },
  { icon: "🏕️", label: "Курорти",     type: "resort" },
  { icon: "🛥️", label: "Яхти",        type: "yacht" },
  { icon: "🏡", label: "Котеджі",     type: "cottage" },
  { icon: "🌿", label: "Глемпінг",    type: "glamping" },
];

const SORT_OPTIONS = [
  { value: "rating",    label: "За рейтингом" },
  { value: "price_asc", label: "Ціна: від низької" },
  { value: "price_desc",label: "Ціна: від високої" },
];

/* ─────────────────────────────────────────────────────────
   СТИЛІ (повністю вбудовані)
───────────────────────────────────────────────────────── */
const FONT_URL = "https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,400&display=swap";

const CSS = `
  @import url('${FONT_URL}');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: 'DM Sans', sans-serif; background: #fafaf7; color: #111827; -webkit-font-smoothing: antialiased; }
  a { text-decoration: none; color: inherit; }
  button { cursor: pointer; border: none; background: none; font-family: inherit; }
  input, select { font-family: inherit; border: none; outline: none; background: none; }

  :root {
    --navy:    #0a1628;
    --blue:    #1a56db;
    --blue-lt: #3b82f6;
    --cyan:    #06b6d4;
    --gold:    #f59e0b;
    --cream:   #fafaf7;
    --gray-1:  #f3f4f6;
    --gray-2:  #e5e7eb;
    --gray-3:  #9ca3af;
    --white:   #ffffff;
    --radius:  14px;
    --sh:      0 4px 24px rgba(0,0,0,.08);
    --sh-lg:   0 16px 48px rgba(0,0,0,.15);
  }

  /* NAVBAR */
  .s-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 200;
    background: rgba(10,22,40,.93);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(255,255,255,.06);
    transition: box-shadow .3s;
  }
  .s-nav.scrolled { box-shadow: 0 4px 32px rgba(0,0,0,.3); }
  .s-nav-inner {
    max-width: 1200px; margin: 0 auto; padding: 0 24px;
    display: flex; align-items: center; justify-content: space-between;
    height: 64px;
  }
  .s-logo { display: flex; align-items: center; gap: 8px; cursor: pointer; }
  .s-logo-icon { color: var(--gold); font-size: 18px; }
  .s-logo-text { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 22px; color: #fff; letter-spacing: -.5px; }
  .s-nav-links { display: flex; align-items: center; gap: 12px; }
  .s-nav-link { color: rgba(255,255,255,.65); font-size: 14px; transition: color .2s; background: none; padding: 6px 10px; border-radius: 8px; }
  .s-nav-link:hover { color: #fff; background: rgba(255,255,255,.08); }
  .s-btn-reg { padding: 8px 18px; border-radius: 8px; font-size: 14px; font-weight: 500; color: #fff; border: 1px solid rgba(255,255,255,.25); transition: all .2s; }
  .s-btn-reg:hover { background: rgba(255,255,255,.1); }
  .s-btn-login { padding: 8px 18px; border-radius: 8px; font-size: 14px; font-weight: 600; background: var(--blue); color: #fff; transition: all .2s; }
  .s-btn-login:hover { background: var(--blue-lt); transform: translateY(-1px); }

  /* HERO */
  .s-hero {
    position: relative; min-height: 100vh;
    display: flex; align-items: center; overflow: hidden;
  }
  .s-hero-bg {
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 80% 60% at 65% 40%, rgba(6,182,212,.2) 0%, transparent 55%),
      radial-gradient(ellipse 50% 40% at 15% 80%, rgba(26,86,219,.25) 0%, transparent 50%),
      linear-gradient(160deg, #0a1628 0%, #0d1f3c 60%, #0a1628 100%);
  }
  .s-hero-bg::after {
    content: ''; position: absolute; inset: 0;
    background-image: radial-gradient(circle, rgba(255,255,255,.035) 1px, transparent 1px);
    background-size: 40px 40px;
  }
  .s-hero-content {
    position: relative; z-index: 2;
    max-width: 1200px; margin: 0 auto;
    padding: 120px 24px 80px; width: 100%;
  }
  .s-eyebrow { font-size: 12px; letter-spacing: 3px; text-transform: uppercase; color: var(--cyan); font-weight: 600; margin-bottom: 20px; }
  .s-hero-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(42px, 7vw, 80px); font-weight: 800;
    line-height: 1.0; color: #fff; margin-bottom: 20px; letter-spacing: -2px;
  }
  .s-hero-accent {
    background: linear-gradient(90deg, var(--cyan), var(--blue-lt));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .s-hero-sub { color: rgba(255,255,255,.5); font-size: 17px; margin-bottom: 40px; }

  /* TABS */
  .s-tabs { display: flex; gap: 4px; margin-bottom: 0; flex-wrap: wrap; }
  .s-tab {
    padding: 10px 20px; border-radius: 10px 10px 0 0;
    font-size: 14px; font-weight: 500; color: rgba(255,255,255,.55);
    transition: all .2s;
  }
  .s-tab:hover { color: #fff; background: rgba(255,255,255,.07); }
  .s-tab.active { background: #fff; color: #111827; font-weight: 600; }

  /* SEARCH BOX */
  .s-search {
    display: flex; align-items: stretch;
    background: #fff; border-radius: 0 16px 16px 16px;
    box-shadow: var(--sh-lg); max-width: 940px; overflow: visible;
    position: relative;
  }
  .s-field { display: flex; flex-direction: column; justify-content: center; padding: 18px 24px; flex: 1; min-width: 0; }
  .s-field label { font-size: 11px; font-weight: 700; letter-spacing: .6px; text-transform: uppercase; color: var(--gray-3); margin-bottom: 4px; cursor: pointer; }
  .s-field input { font-size: 15px; font-weight: 500; color: #111827; width: 100%; }
  .s-field input::placeholder { color: var(--gray-3); font-weight: 400; }
  .s-field input[type="date"]::-webkit-calendar-picker-indicator { opacity: .4; cursor: pointer; }
  .s-divider { width: 1px; height: 44px; background: var(--gray-2); flex-shrink: 0; align-self: center; }
  .s-guests-ctrl { display: flex; align-items: center; gap: 10px; }
  .s-guests-ctrl button {
    width: 28px; height: 28px; border-radius: 50%;
    border: 1.5px solid var(--gray-2); font-size: 16px; line-height: 1;
    color: var(--blue); font-weight: 700; transition: all .2s; flex-shrink: 0;
  }
  .s-guests-ctrl button:hover { border-color: var(--blue); background: var(--blue); color: #fff; }
  .s-guests-ctrl button:active { transform: scale(.92); }
  .s-guests-val { font-size: 15px; font-weight: 500; min-width: 90px; }
  .s-search-btn {
    display: flex; align-items: center; gap: 8px;
    background: linear-gradient(135deg, var(--blue), var(--cyan));
    color: #fff; font-size: 15px; font-weight: 700;
    padding: 0 36px; border-radius: 0 16px 16px 0;
    transition: opacity .2s, transform .1s; flex-shrink: 0;
    white-space: nowrap; min-height: 82px;
  }
  .s-search-btn:hover { opacity: .88; }
  .s-search-btn:active { transform: scale(.97); }

  /* SUGGESTIONS DROPDOWN */
  .s-suggestions {
    position: absolute; top: calc(100% + 8px); left: 0;
    background: #fff; border-radius: 12px; box-shadow: var(--sh-lg);
    min-width: 280px; overflow: hidden; z-index: 300;
  }
  .s-sug-item { display: flex; align-items: center; gap: 12px; padding: 12px 18px; cursor: pointer; transition: background .15s; }
  .s-sug-item:hover { background: var(--gray-1); }
  .s-sug-icon { font-size: 20px; flex-shrink: 0; }
  .s-sug-name { font-size: 14px; font-weight: 600; color: #111827; }
  .s-sug-country { font-size: 12px; color: var(--gray-3); }

  /* STATS */
  .s-stats { display: flex; gap: 40px; margin-top: 36px; }
  .s-stat-num { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; color: #fff; }
  .s-stat-lbl { font-size: 12px; color: rgba(255,255,255,.45); margin-top: 2px; }

  /* CATEGORIES */
  .s-cats-section { background: #fff; padding: 72px 0; }
  .s-section-title { font-family: 'Syne', sans-serif; font-size: 30px; font-weight: 700; color: var(--navy); margin-bottom: 8px; letter-spacing: -.5px; }
  .s-section-sub { color: var(--gray-3); font-size: 15px; }
  .s-cats-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 16px; margin-top: 32px; }
  .s-cat-btn {
    display: flex; flex-direction: column; align-items: center; gap: 10px;
    padding: 22px 12px; border: 1.5px solid var(--gray-2); border-radius: var(--radius);
    transition: all .2s; background: #fff;
  }
  .s-cat-btn:hover, .s-cat-btn.active {
    border-color: var(--blue); box-shadow: 0 0 0 4px rgba(26,86,219,.08);
    transform: translateY(-2px);
  }
  .s-cat-btn.active { background: #eef3ff; }
  .s-cat-icon { font-size: 28px; }
  .s-cat-label { font-size: 13px; font-weight: 600; color: var(--navy); }

  /* CARDS SECTION */
  .s-cards-section { padding: 72px 0; background: var(--cream); }
  .s-section-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 28px; flex-wrap: wrap; gap: 16px; }
  .s-sort-bar { display: flex; align-items: center; gap: 12px; }
  .s-sort-label { font-size: 13px; color: var(--gray-3); }
  .s-sort-select {
    appearance: none; padding: 8px 32px 8px 14px; border-radius: 8px;
    border: 1.5px solid var(--gray-2); font-size: 13px; font-weight: 500;
    color: #111827; background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%239ca3af' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E") no-repeat right 12px center;
    cursor: pointer; transition: border-color .2s; outline: none;
  }
  .s-sort-select:hover { border-color: var(--blue); }
  .s-filter-count { font-size: 13px; color: var(--gray-3); }
  .s-cards-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
  .s-no-results { grid-column: 1 / -1; text-align: center; padding: 60px 0; color: var(--gray-3); font-size: 16px; }

  /* CARD */
  .s-card { border-radius: 18px; overflow: hidden; background: #fff; box-shadow: var(--sh); transition: transform .3s, box-shadow .3s; }
  .s-card:hover { transform: translateY(-6px); box-shadow: var(--sh-lg); }
  .s-card-img-wrap { position: relative; overflow: hidden; height: 200px; }
  .s-card-img { width: 100%; height: 100%; object-fit: cover; transition: transform .5s; }
  .s-card:hover .s-card-img { transform: scale(1.06); }
  .s-card-tag { position: absolute; top: 14px; left: 14px; background: var(--navy); color: #fff; font-size: 11px; font-weight: 700; letter-spacing: .5px; text-transform: uppercase; padding: 4px 10px; border-radius: 6px; }
  .s-save-btn { position: absolute; top: 12px; right: 14px; font-size: 22px; color: #fff; filter: drop-shadow(0 1px 4px rgba(0,0,0,.35)); transition: transform .2s, color .2s; line-height: 1; }
  .s-save-btn:hover { transform: scale(1.25); }
  .s-save-btn.saved { color: #ef4444; }
  .s-card-body { padding: 18px 20px; }
  .s-card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; }
  .s-card-name { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700; color: var(--navy); margin-bottom: 3px; }
  .s-card-country { font-size: 13px; color: var(--gray-3); }
  .s-rating { background: var(--navy); color: #fff; font-size: 13px; font-weight: 700; padding: 5px 10px; border-radius: 8px; white-space: nowrap; }
  .s-card-footer { display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--gray-1); padding-top: 14px; }
  .s-card-price { font-size: 14px; font-weight: 600; color: #111827; }
  .s-card-price span { font-size: 12px; color: var(--gray-3); font-weight: 400; }
  .s-btn-book { background: var(--blue); color: #fff; font-size: 13px; font-weight: 600; padding: 8px 18px; border-radius: 8px; transition: background .2s, transform .1s; }
  .s-btn-book:hover { background: var(--blue-lt); }
  .s-btn-book:active { transform: scale(.96); }

  /* PROMO */
  .s-promo { padding: 0 0 72px; }
  .s-promo-card {
    background: linear-gradient(135deg, var(--navy) 0%, #0d2557 100%);
    border-radius: 24px; padding: 64px; display: flex;
    align-items: center; justify-content: space-between; overflow: hidden; position: relative;
  }
  .s-promo-eyebrow { font-size: 12px; letter-spacing: 3px; text-transform: uppercase; color: var(--cyan); margin-bottom: 16px; font-weight: 600; }
  .s-promo-title { font-family: 'Syne', sans-serif; font-size: clamp(26px, 3.5vw, 40px); font-weight: 800; color: #fff; line-height: 1.15; margin-bottom: 14px; letter-spacing: -1px; }
  .s-promo-desc { color: rgba(255,255,255,.5); font-size: 15px; margin-bottom: 28px; max-width: 420px; }
  .s-btn-promo { background: linear-gradient(90deg, var(--gold), #fbbf24); color: var(--navy); font-size: 15px; font-weight: 700; padding: 14px 32px; border-radius: 10px; transition: transform .2s, box-shadow .2s; }
  .s-btn-promo:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(245,158,11,.4); }
  .s-btn-promo:active { transform: scale(.97); }
  .s-promo-visual { position: relative; width: 200px; height: 200px; flex-shrink: 0; }
  .s-circle { position: absolute; border-radius: 50%; }
  .s-c1 { width: 180px; height: 180px; top: 10px; right: 10px; border: 2px solid rgba(6,182,212,.3); animation: pulse 4s ease-in-out infinite; }
  .s-c2 { width: 120px; height: 120px; top: 40px; right: 40px; border: 2px solid rgba(26,86,219,.5); animation: pulse 4s ease-in-out infinite .8s; }
  .s-promo-emoji { position: absolute; top: 50%; right: 35%; transform: translate(50%,-50%); font-size: 64px; animation: float 3s ease-in-out infinite; }

  /* FOOTER */
  .s-footer { background: var(--navy); border-top: 1px solid rgba(255,255,255,.06); }
  .s-footer-inner { display: flex; justify-content: space-between; padding: 56px 24px 40px; gap: 40px; max-width: 1200px; margin: 0 auto; }
  .s-footer-brand .s-logo-text { font-size: 20px; }
  .s-footer-tagline { color: rgba(255,255,255,.35); font-size: 13px; margin-top: 12px; line-height: 1.6; max-width: 200px; }
  .s-footer-links { display: flex; gap: 56px; }
  .s-footer-col { display: flex; flex-direction: column; gap: 10px; }
  .s-footer-col h4 { font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 700; color: #fff; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 6px; }
  .s-footer-col button { color: rgba(255,255,255,.4); font-size: 14px; text-align: left; transition: color .2s; padding: 2px 0; }
  .s-footer-col button:hover { color: #fff; }
  .s-footer-bottom { border-top: 1px solid rgba(255,255,255,.06); text-align: center; padding: 20px 24px; color: rgba(255,255,255,.22); font-size: 13px; }

  /* MODAL */
  .s-modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,.6);
    display: flex; align-items: center; justify-content: center;
    z-index: 500; padding: 20px; backdrop-filter: blur(4px);
    animation: fadeIn .2s ease;
  }
  .s-modal {
    background: #fff; border-radius: 20px; padding: 36px;
    max-width: 480px; width: 100%; box-shadow: var(--sh-lg);
    animation: slideUp .25s ease;
    max-height: 90vh; overflow-y: auto;
  }
  .s-modal h2 { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 800; color: var(--navy); margin-bottom: 6px; }
  .s-modal-sub { color: var(--gray-3); font-size: 14px; margin-bottom: 28px; }
  .s-modal-close { position: absolute; top: 16px; right: 20px; font-size: 22px; color: var(--gray-3); transition: color .2s; }
  .s-modal-close:hover { color: var(--navy); }
  .s-modal-header { position: relative; }
  .s-form-group { margin-bottom: 18px; }
  .s-form-label { display: block; font-size: 12px; font-weight: 700; letter-spacing: .5px; text-transform: uppercase; color: var(--gray-3); margin-bottom: 6px; }
  .s-form-input {
    width: 100%; padding: 12px 16px; border: 1.5px solid var(--gray-2);
    border-radius: 10px; font-size: 15px; color: #111827; font-family: inherit;
    transition: border-color .2s; outline: none;
  }
  .s-form-input:focus { border-color: var(--blue); }
  .s-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .s-btn-full { width: 100%; padding: 14px; background: var(--blue); color: #fff; font-size: 15px; font-weight: 700; border-radius: 10px; margin-top: 8px; transition: background .2s, transform .1s; }
  .s-btn-full:hover { background: var(--blue-lt); }
  .s-btn-full:active { transform: scale(.98); }
  .s-modal-divider { text-align: center; color: var(--gray-3); font-size: 13px; margin: 16px 0; position: relative; }
  .s-modal-divider::before, .s-modal-divider::after { content: ''; position: absolute; top: 50%; width: 42%; height: 1px; background: var(--gray-2); }
  .s-modal-divider::before { left: 0; }
  .s-modal-divider::after { right: 0; }
  .s-btn-outline { width: 100%; padding: 12px; border: 1.5px solid var(--gray-2); border-radius: 10px; font-size: 14px; font-weight: 600; color: #111827; transition: all .2s; }
  .s-btn-outline:hover { border-color: var(--blue); color: var(--blue); }
  .s-modal-switch { text-align: center; margin-top: 18px; font-size: 13px; color: var(--gray-3); }
  .s-modal-switch button { color: var(--blue); font-weight: 600; margin-left: 4px; }

  /* BOOKING MODAL */
  .s-book-dest-img { width: 100%; height: 160px; object-fit: cover; border-radius: 12px; margin-bottom: 20px; }
  .s-book-info { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
  .s-book-name { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 700; color: var(--navy); }
  .s-book-country { font-size: 13px; color: var(--gray-3); margin-top: 2px; }
  .s-price-calc { background: var(--gray-1); border-radius: 12px; padding: 16px; margin-bottom: 20px; }
  .s-price-row { display: flex; justify-content: space-between; font-size: 14px; color: #111827; padding: 4px 0; }
  .s-price-row.total { font-weight: 700; font-size: 16px; border-top: 1px solid var(--gray-2); margin-top: 8px; padding-top: 12px; }
  .s-success { text-align: center; padding: 20px 0; }
  .s-success-icon { font-size: 56px; margin-bottom: 16px; }
  .s-success h3 { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; color: var(--navy); margin-bottom: 8px; }
  .s-success p { color: var(--gray-3); font-size: 14px; }
  .s-toast {
    position: fixed; bottom: 28px; right: 28px; z-index: 999;
    background: var(--navy); color: #fff; padding: 14px 22px;
    border-radius: 12px; font-size: 14px; font-weight: 500;
    box-shadow: var(--sh-lg); animation: slideUp .3s ease;
    display: flex; align-items: center; gap: 10px;
  }

  /* CONTAINER */
  .s-container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }

  /* ANIMATIONS */
  @keyframes pulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.08);opacity:.6} }
  @keyframes float { 0%,100%{transform:translate(50%,-50%)} 50%{transform:translate(50%,calc(-50% - 12px))} }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

  /* RESPONSIVE */
  @media (max-width: 900px) {
    .s-cards-grid { grid-template-columns: repeat(2, 1fr); }
    .s-cats-grid { grid-template-columns: repeat(3, 1fr); }
    .s-search { flex-direction: column; border-radius: 0 16px 16px 16px; }
    .s-divider { width: 100%; height: 1px; align-self: auto; }
    .s-search-btn { border-radius: 0 0 16px 16px; justify-content: center; min-height: 56px; }
    .s-promo-card { flex-direction: column; }
    .s-promo-visual { display: none; }
    .s-footer-inner { flex-direction: column; }
    .s-stats { gap: 24px; }
  }
  @media (max-width: 600px) {
    .s-cards-grid { grid-template-columns: 1fr; }
    .s-cats-grid { grid-template-columns: repeat(2, 1fr); }
    .s-section-header { flex-direction: column; align-items: flex-start; }
    .s-form-row { grid-template-columns: 1fr; }
    .s-footer-links { flex-direction: column; gap: 28px; }
    .s-nav-links .s-nav-link { display: none; }
    .s-stats { flex-wrap: wrap; gap: 20px; }
  }
`;

/* ─────────────────────────────────────────────────────────
   ДОПОМІЖНІ КОМПОНЕНТИ
───────────────────────────────────────────────────────── */
function Toast({ msg, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return <div className="s-toast">✓ {msg}</div>;
}

/* ─────────────────────────────────────────────────────────
   МОДАЛКА: ЛОГІН / РЕЄСТРАЦІЯ
───────────────────────────────────────────────────────── */
function AuthModal({ mode: initMode, onClose, onSuccess }) {
  const [mode, setMode] = useState(initMode);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const submit = async () => {
    if (!form.email || !form.password) { setError("Заповніть всі поля"); return; }
    setLoading(true); setError("");
    try {
      const data = mode === "login"
        ? await apiFetch("/auth/login",    { method: "POST", body: JSON.stringify({ email: form.email, password: form.password }) })
        : await apiFetch("/auth/register", { method: "POST", body: JSON.stringify(form) });
      token.value = data.token;
      localStorage.setItem("token", data.token);
      onSuccess(mode === "login" ? `Ласкаво просимо, ${data.user.name}!` : `Акаунт створено, ${data.user.name}!`, data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="s-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="s-modal">
        <div className="s-modal-header">
          <button className="s-modal-close" onClick={onClose}>✕</button>
          <h2>{mode === "login" ? "Увійти" : "Реєстрація"}</h2>
          <p className="s-modal-sub">{mode === "login" ? "Раді бачити вас знову!" : "Створіть безкоштовний акаунт"}</p>
        </div>
        {mode === "register" && (
          <div className="s-form-group">
            <label className="s-form-label">Ім'я</label>
            <input className="s-form-input" placeholder="Ваше ім'я" value={form.name} onChange={set("name")} />
          </div>
        )}
        <div className="s-form-group">
          <label className="s-form-label">Email</label>
          <input className="s-form-input" type="email" placeholder="example@email.com" value={form.email} onChange={set("email")} />
        </div>
        <div className="s-form-group">
          <label className="s-form-label">Пароль</label>
          <input className="s-form-input" type="password" placeholder="••••••••" value={form.password} onChange={set("password")} />
        </div>
        {error && <p style={{ color: "#ef4444", fontSize: 13, marginBottom: 12 }}>⚠ {error}</p>}
        <button className="s-btn-full" onClick={submit} disabled={loading}>
          {loading ? "Завантаження..." : mode === "login" ? "Увійти →" : "Створити акаунт →"}
        </button>
        <div className="s-modal-divider">або</div>
        <button className="s-btn-outline" onClick={() => onSuccess("Увійшли через Google!")}>
          🇬 Продовжити з Google
        </button>
        <div className="s-modal-switch">
          {mode === "login" ? "Ще немає акаунту?" : "Вже є акаунт?"}
          <button onClick={() => setMode(mode === "login" ? "register" : "login")}>
            {mode === "login" ? "Зареєструватись" : "Увійти"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   МОДАЛКА: БРОНЮВАННЯ
───────────────────────────────────────────────────────── */
function BookingModal({ dest, checkIn, checkOut, guests, onClose, onSuccess }) {
  const [step, setStep]   = useState(1);
  const [form, setForm]   = useState({ name: "", phone: "", card: "", exp: "", cvv: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const submitBooking = async () => {
    if (!form.name || !form.phone) { setError("Введіть ім'я і телефон"); return; }
    setLoading(true); setError("");
    try {
      await apiFetch("/bookings", {
        method: "POST",
        body: JSON.stringify({
          destination_id: dest.id,
          check_in:  checkIn  || new Date().toISOString().split("T")[0],
          check_out: checkOut || new Date(Date.now() + 86400000).toISOString().split("T")[0],
          guests,
          name:  form.name,
          phone: form.phone,
        }),
      });
      setStep(3);
    } catch (err) {
      // якщо не авторизований — показуємо помилку
      setError(err.message.includes("Токен") ? "Увійдіть в акаунт щоб бронювати" : err.message);
    } finally {
      setLoading(false);
    }
  };

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const nights = (() => {
    if (!checkIn || !checkOut) return 1;
    const d = (new Date(checkOut) - new Date(checkIn)) / 86400000;
    return d > 0 ? d : 1;
  })();
  const total = dest.price * nights;

  return (
    <div className="s-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="s-modal">
        <div className="s-modal-header">
          <button className="s-modal-close" onClick={onClose}>✕</button>
        </div>
        {step === 3 ? (
          <div className="s-success">
            <div className="s-success-icon">🎉</div>
            <h3>Заброньовано!</h3>
            <p>Підтвердження надіслано на ваш email.<br />Гарної подорожі до {dest.name}!</p>
            <button className="s-btn-full" style={{ marginTop: 24 }} onClick={onSuccess}>Закрити</button>
          </div>
        ) : (
          <>
            <img src={dest.img} alt={dest.name} className="s-book-dest-img" />
            <div className="s-book-info">
              <div>
                <div className="s-book-name">{dest.name}</div>
                <div className="s-book-country">{dest.country}</div>
              </div>
              <div className="s-rating">{dest.rating}</div>
            </div>
            <div className="s-price-calc">
              <div className="s-price-row"><span>₴{dest.price.toLocaleString()} × {nights} ніч{nights === 1 ? "" : nights < 5 ? "і" : "ей"}</span><span>₴{(dest.price * nights).toLocaleString()}</span></div>
              <div className="s-price-row"><span>Сервісний збір</span><span>₴{Math.round(total * 0.08).toLocaleString()}</span></div>
              <div className="s-price-row total"><span>Разом</span><span>₴{Math.round(total * 1.08).toLocaleString()}</span></div>
            </div>
            {step === 1 && (
              <>
                <h2 style={{ marginBottom: 20 }}>Ваші дані</h2>
                <div className="s-form-group">
                  <label className="s-form-label">Повне ім'я</label>
                  <input className="s-form-input" placeholder="Іван Петренко" value={form.name} onChange={set("name")} />
                </div>
                <div className="s-form-group">
                  <label className="s-form-label">Телефон</label>
                  <input className="s-form-input" placeholder="+380 xx xxx xx xx" value={form.phone} onChange={set("phone")} />
                </div>
                {error && <p style={{ color: "#ef4444", fontSize: 13, marginBottom: 8 }}>⚠ {error}</p>}
                <button className="s-btn-full" onClick={() => { if (!form.name || !form.phone) { setError("Введіть ім'я і телефон"); return; } setError(""); setStep(2); }}>Далі: Оплата →</button>
              </>
            )}
            {step === 2 && (
              <>
                <h2 style={{ marginBottom: 20 }}>Оплата</h2>
                <div className="s-form-group">
                  <label className="s-form-label">Номер картки</label>
                  <input className="s-form-input" placeholder="0000 0000 0000 0000" value={form.card} onChange={set("card")} maxLength={19} />
                </div>
                <div className="s-form-row">
                  <div className="s-form-group">
                    <label className="s-form-label">Термін дії</label>
                    <input className="s-form-input" placeholder="MM/YY" value={form.exp} onChange={set("exp")} maxLength={5} />
                  </div>
                  <div className="s-form-group">
                    <label className="s-form-label">CVV</label>
                    <input className="s-form-input" placeholder="•••" value={form.cvv} onChange={set("cvv")} maxLength={3} type="password" />
                  </div>
                </div>
                {error && <p style={{ color: "#ef4444", fontSize: 13, marginBottom: 8 }}>⚠ {error}</p>}
                <button className="s-btn-full" onClick={submitBooking} disabled={loading}>
                  {loading ? "Обробка..." : `💳 Оплатити ₴${Math.round(total * 1.08).toLocaleString()}`}
                </button>
                <button className="s-btn-outline" style={{ marginTop: 10 }} onClick={() => setStep(1)}>← Назад</button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   ГОЛОВНИЙ КОМПОНЕНТ
───────────────────────────────────────────────────────── */
export default function StayraApp() {
  /* стан */
  const [scrolled, setScrolled]       = useState(false);
  const [activeTab, setActiveTab]      = useState("stays");
  const [destination, setDestination]  = useState("");
  const [checkIn, setCheckIn]          = useState("");
  const [checkOut, setCheckOut]        = useState("");
  const [guests, setGuests]            = useState(2);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [savedIds, setSavedIds]        = useState(new Set());
  const [activeCat, setActiveCat]      = useState(null);
  const [sortBy, setSortBy]            = useState("rating");
  const [modal, setModal]              = useState(null);
  const [bookingDest, setBookingDest]  = useState(null);
  const [toast, setToast]              = useState(null);

  // ── нові стани для API ──
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [apiError, setApiError]         = useState(null);
  const [user, setUser]                 = useState(() => {
    // відновлюємо юзера з localStorage якщо він раніше входив
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const destRef = useRef(null);

  /* скрол */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── завантаження напрямків з сервера ── */
  const fetchDestinations = useCallback(async () => {
    setLoading(true); setApiError(null);
    try {
      const params = new URLSearchParams();
      if (activeCat)   params.set("type",  activeCat);
      if (sortBy)      params.set("sort",  sortBy);
      if (destination) params.set("search", destination);
      const data = await apiFetch(`/destinations?${params}`);
      setDestinations(data);
    } catch (err) {
      setApiError("Не вдалося завантажити напрямки. Перевірте що сервер запущено.");
      // fallback — показуємо хоч щось
      setDestinations([]);
    } finally {
      setLoading(false);
    }
  }, [activeCat, sortBy]);

  useEffect(() => { fetchDestinations(); }, [fetchDestinations]);

  /* закрити suggestions при кліку поза */
  useEffect(() => {
    const onClick = (e) => {
      if (destRef.current && !destRef.current.contains(e.target)) setShowSuggestions(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  /* suggestions — з даних що вже завантажені */
  const suggestions = destination.trim().length >= 1
    ? destinations.filter((d) =>
        d.name.toLowerCase().includes(destination.toLowerCase()) ||
        d.country.toLowerCase().includes(destination.toLowerCase())
      ).slice(0, 5)
    : [];

  /* filtered — вже прийшли відфільтровані з сервера */
  const filtered = destinations;

  const toggleSave = (id) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); showToast("Видалено зі збережених"); }
      else               { next.add(id);    showToast("Додано до збережених ♥"); }
      return next;
    });
  };

  const showToast = (msg) => { setToast(msg); };

  const handleSearch = () => {
    setShowSuggestions(false);
    fetchDestinations();
    const section = document.getElementById("destinations");
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  const handleBook = (dest) => {
    if (!user) { setModal("login"); showToast("Увійдіть щоб бронювати"); return; }
    setBookingDest(dest);
  };

  const handleAuthSuccess = (msg, userData) => {
    setModal(null);
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    showToast(msg);
  };

  const handleLogout = () => {
    token.value = null;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    showToast("Ви вийшли з акаунту");
  };

  const TABS = [
    { key: "stays",   label: "🏨 Житло" },
    { key: "flights", label: "✈️ Авіа" },
    { key: "cars",    label: "🚗 Авто" },
    { key: "tours",   label: "🗺️ Тури" },
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* ── NAVBAR ── */}
      <nav className={`s-nav${scrolled ? " scrolled" : ""}`}>
        <div className="s-nav-inner">
          <div className="s-logo" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <span className="s-logo-icon">◆</span>
            <span className="s-logo-text">stayra</span>
          </div>
          <div className="s-nav-links">
            <button className="s-nav-link" onClick={() => showToast("Розділ «Партнери» — скоро!")}>Стати партнером</button>
            <button className="s-nav-link" onClick={() => showToast("Підтримка: support@stayra.com")}>Підтримка</button>
            {user ? (
              <>
                <span style={{ color: "rgba(255,255,255,.7)", fontSize: 14 }}>👋 {user.name}</span>
                <button className="s-btn-reg" onClick={handleLogout}>Вийти</button>
              </>
            ) : (
              <>
                <button className="s-btn-reg" onClick={() => setModal("register")}>Реєстрація</button>
                <button className="s-btn-login" onClick={() => setModal("login")}>Увійти</button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="s-hero">
        <div className="s-hero-bg" />
        <div className="s-hero-content">
          <p className="s-eyebrow">Мандруй без меж</p>
          <h1 className="s-hero-title">
            Знайди своє<br />
            <span className="s-hero-accent">ідеальне місце</span>
          </h1>
          <p className="s-hero-sub">Понад 2 мільйони варіантів у 200+ країнах світу</p>

          {/* tabs */}
          <div className="s-tabs">
            {TABS.map((t) => (
              <button key={t.key} className={`s-tab${activeTab === t.key ? " active" : ""}`} onClick={() => setActiveTab(t.key)}>
                {t.label}
              </button>
            ))}
          </div>

          {/* search box */}
          <div className="s-search">
            {/* destination */}
            <div className="s-field" style={{ position: "relative", flex: "1.4" }} ref={destRef}>
              <label htmlFor="dest-input">Куди їдемо?</label>
              <input
                id="dest-input"
                type="text"
                placeholder="Місто, готель або район"
                value={destination}
                onChange={(e) => { setDestination(e.target.value); setShowSuggestions(true); }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                autoComplete="off"
              />
              {showSuggestions && suggestions.length > 0 && (
                <div className="s-suggestions">
                  {suggestions.map((d) => (
                    <div key={d.id} className="s-sug-item" onClick={() => { setDestination(d.name); setShowSuggestions(false); }}>
                      <span className="s-sug-icon">📍</span>
                      <div>
                        <div className="s-sug-name">{d.name}</div>
                        <div className="s-sug-country">{d.country}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="s-divider" />

            {/* check-in */}
            <div className="s-field">
              <label htmlFor="checkin">Заїзд</label>
              <input id="checkin" type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} min={new Date().toISOString().split("T")[0]} />
            </div>

            <div className="s-divider" />

            {/* check-out */}
            <div className="s-field">
              <label htmlFor="checkout">Виїзд</label>
              <input id="checkout" type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} min={checkIn || new Date().toISOString().split("T")[0]} />
            </div>

            <div className="s-divider" />

            {/* guests */}
            <div className="s-field" style={{ flex: "0 0 auto", minWidth: 170 }}>
              <label>Гості</label>
              <div className="s-guests-ctrl">
                <button onClick={() => setGuests((g) => Math.max(1, g - 1))} aria-label="Зменшити">−</button>
                <span className="s-guests-val">{guests} {guests === 1 ? "гість" : guests < 5 ? "гості" : "гостей"}</span>
                <button onClick={() => setGuests((g) => Math.min(20, g + 1))} aria-label="Збільшити">+</button>
              </div>
            </div>

            <button className="s-search-btn" onClick={handleSearch}>
              <span>Шукати</span>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden>
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>
          </div>

          {/* stats */}
          <div className="s-stats">
            {[["2M+", "Об'єктів"],["200+", "Країн"],["18M+", "Відгуків"],["4.9★", "Рейтинг"]].map(([n, l]) => (
              <div key={l}>
                <div className="s-stat-num">{n}</div>
                <div className="s-stat-lbl">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="s-cats-section">
        <div className="s-container">
          <h2 className="s-section-title">Що шукаєте?</h2>
          <p className="s-section-sub">Оберіть тип житла</p>
          <div className="s-cats-grid">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.type}
                className={`s-cat-btn${activeCat === cat.type ? " active" : ""}`}
                onClick={() => setActiveCat((prev) => prev === cat.type ? null : cat.type)}
              >
                <span className="s-cat-icon">{cat.icon}</span>
                <span className="s-cat-label">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── DESTINATION CARDS ── */}
      <section className="s-cards-section" id="destinations">
        <div className="s-container">
          <div className="s-section-header">
            <div>
              <h2 className="s-section-title">Популярні напрямки</h2>
              <p className="s-section-sub">
                {activeCat
                  ? `${CATEGORIES.find((c) => c.type === activeCat)?.label} · ${filtered.length} варіант${filtered.length === 1 ? "" : filtered.length < 5 ? "и" : "ів"}`
                  : "Найбільш заброньовані місця цього сезону"}
              </p>
            </div>
            <div className="s-sort-bar">
              <span className="s-sort-label">Сортувати:</span>
              <select className="s-sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          <div className="s-cards-grid">
            {loading && (
              <div className="s-no-results">⏳ Завантаження...</div>
            )}
            {!loading && apiError && (
              <div className="s-no-results">
                ⚠️ {apiError}<br/>
                <button style={{ marginTop: 12, color: "var(--blue)", fontWeight: 600 }} onClick={fetchDestinations}>Спробувати знову</button>
              </div>
            )}
            {!loading && !apiError && filtered.length === 0 && (
              <div className="s-no-results">😕 Нічого не знайдено. Спробуйте інший фільтр.</div>
            )}
            {!loading && filtered.map((dest) => (
              <div key={dest.id} className="s-card">
                <div className="s-card-img-wrap">
                  <img src={dest.img} alt={dest.name} className="s-card-img" loading="lazy" />
                  <span className="s-card-tag">{dest.tag}</span>
                  <button
                    className={`s-save-btn${savedIds.has(dest.id) ? " saved" : ""}`}
                    onClick={() => toggleSave(dest.id)}
                    aria-label={savedIds.has(dest.id) ? "Видалити зі збережених" : "Зберегти"}
                  >
                    {savedIds.has(dest.id) ? "♥" : "♡"}
                  </button>
                </div>
                <div className="s-card-body">
                  <div className="s-card-top">
                    <div>
                      <div className="s-card-name">{dest.name}</div>
                      <div className="s-card-country">{dest.country}</div>
                    </div>
                    <div className="s-rating">{dest.rating}</div>
                  </div>
                  <div className="s-card-footer">
                    <div className="s-card-price">
                      від ₴{dest.price.toLocaleString()} <span>/ ніч</span>
                    </div>
                    <button className="s-btn-book" onClick={() => handleBook(dest)}>
                      Бронювати
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROMO ── */}
      <section className="s-promo">
        <div className="s-container">
          <div className="s-promo-card">
            <div>
              <p className="s-promo-eyebrow">Спеціальна пропозиція</p>
              <h2 className="s-promo-title">Знижка до 30%<br />для нових користувачів</h2>
              <p className="s-promo-desc">Зареєструйтесь зараз та отримайте ексклюзивний промокод на першу подорож.</p>
              <button className="s-btn-promo" onClick={() => setModal("register")}>Отримати знижку →</button>
            </div>
            <div className="s-promo-visual">
              <div className="s-circle s-c1" />
              <div className="s-circle s-c2" />
              <div className="s-promo-emoji">🌍</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="s-footer">
        <div className="s-footer-inner">
          <div className="s-footer-brand">
            <div className="s-logo">
              <span className="s-logo-icon">◆</span>
              <span className="s-logo-text">stayra</span>
            </div>
            <p className="s-footer-tagline">Кожна подорож — нова історія</p>
          </div>
          <div className="s-footer-links">
            {[
              { title: "Компанія",   links: ["Про нас", "Кар'єра", "Преса", "Блог"] },
              { title: "Підтримка",  links: ["Довідковий центр", "Безпека", "Контакти", "Партнери"] },
              { title: "Правові",    links: ["Умови використання", "Конфіденційність", "Cookies"] },
            ].map((col) => (
              <div key={col.title} className="s-footer-col">
                <h4>{col.title}</h4>
                {col.links.map((l) => (
                  <button key={l} onClick={() => showToast(`Розділ «${l}» — скоро!`)}>{l}</button>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="s-footer-bottom">© 2026 Stayra. Всі права захищені.</div>
      </footer>

      {/* ── AUTH MODAL ── */}
      {(modal === "login" || modal === "register") && (
        <AuthModal
          mode={modal}
          onClose={() => setModal(null)}
          onSuccess={handleAuthSuccess}
        />
      )}

      {bookingDest && (
        <BookingModal
          dest={bookingDest}
          checkIn={checkIn}
          checkOut={checkOut}
          guests={guests}
          onClose={() => setBookingDest(null)}
          onSuccess={() => { setBookingDest(null); showToast(`Бронювання ${bookingDest.name} підтверджено! 🎉`); }}
        />
      )}

      {/* ── TOAST ── */}
      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}
    </>
  );
}
