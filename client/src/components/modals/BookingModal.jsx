// src/components/modals/BookingModal.jsx
import { useState } from "react";
import { apiFetch } from "../../api/apiFetch";

export default function BookingModal({ dest, checkIn, checkOut, guests, onClose, onSuccess }) {
  const [step, setStep]       = useState(1);
  const [form, setForm]       = useState({ name: "", phone: "", card: "", exp: "", cvv: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const nights = (() => {
    if (!checkIn || !checkOut) return 1;
    const d = (new Date(checkOut) - new Date(checkIn)) / 86400000;
    return d > 0 ? d : 1;
  })();
  const total = dest.price * nights;

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
      setError(err.message.includes("Токен") ? "Увійдіть в акаунт щоб бронювати" : err.message);
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
        </div>

        {step === 3 ? (
          <div className="s-success">
            <div className="s-success-icon">🎉</div>
            <h3>Заброньовано!</h3>
            <p>
              Підтвердження надіслано на ваш email.<br />
              Гарної подорожі до {dest.name}!
            </p>
            <button className="s-btn-full" style={{ marginTop: 24 }} onClick={onSuccess}>
              Закрити
            </button>
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
              <div className="s-price-row">
                <span>₴{dest.price.toLocaleString()} × {nights} ніч{nights === 1 ? "" : nights < 5 ? "і" : "ей"}</span>
                <span>₴{(dest.price * nights).toLocaleString()}</span>
              </div>
              <div className="s-price-row">
                <span>Сервісний збір</span>
                <span>₴{Math.round(total * 0.08).toLocaleString()}</span>
              </div>
              <div className="s-price-row total">
                <span>Разом</span>
                <span>₴{Math.round(total * 1.08).toLocaleString()}</span>
              </div>
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
                <button
                  className="s-btn-full"
                  onClick={() => {
                    if (!form.name || !form.phone) { setError("Введіть ім'я і телефон"); return; }
                    setError(""); setStep(2);
                  }}
                >
                  Далі: Оплата →
                </button>
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
                <button className="s-btn-outline" style={{ marginTop: 10 }} onClick={() => setStep(1)}>
                  ← Назад
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
