// src/components/modals/AuthModal.jsx
import { useState } from "react";
import { apiFetch, token } from "../../api/apiFetch";

export default function AuthModal({ mode: initMode, onClose, onSuccess }) {
  const [mode, setMode]       = useState(initMode);
  const [form, setForm]       = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const submit = async () => {
    if (!form.email || !form.password) { setError("Заповніть всі поля"); return; }
    setLoading(true); setError("");
    try {
      const data = mode === "login"
        ? await apiFetch("/auth/login",    { method: "POST", body: JSON.stringify({ email: form.email, password: form.password }) })
        : await apiFetch("/auth/register", { method: "POST", body: JSON.stringify(form) });
      token.value = data.token;
      localStorage.setItem("token", data.token);
      onSuccess(
        mode === "login"
          ? `Ласкаво просимо, ${data.user.name}!`
          : `Акаунт створено, ${data.user.name}!`,
        data.user
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="s-modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="s-modal">
        <div className="s-modal-header">
          <button className="s-modal-close" onClick={onClose}>✕</button>
          <h2>{mode === "login" ? "Увійти" : "Реєстрація"}</h2>
          <p className="s-modal-sub">
            {mode === "login" ? "Раді бачити вас знову!" : "Створіть безкоштовний акаунт"}
          </p>
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

        {error && (
          <p style={{ color: "#ef4444", fontSize: 13, marginBottom: 12 }}>⚠ {error}</p>
        )}

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
