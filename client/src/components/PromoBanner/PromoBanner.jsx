// src/components/PromoBanner/PromoBanner.jsx

export default function PromoBanner({ onRegister }) {
  return (
    <section className="s-promo">
      <div className="s-container">
        <div className="s-promo-card">
          <div>
            <p className="s-promo-eyebrow">Спеціальна пропозиція</p>
            <h2 className="s-promo-title">
              Знижка до 30%<br />для нових користувачів
            </h2>
            <p className="s-promo-desc">
              Зареєструйтесь зараз та отримайте ексклюзивний промокод
              на першу подорож.
            </p>
            <button className="s-btn-promo" onClick={onRegister}>
              Отримати знижку →
            </button>
          </div>
          <div className="s-promo-visual">
            <div className="s-circle s-c1" />
            <div className="s-circle s-c2" />
            <div className="s-promo-emoji">🌍</div>
          </div>
        </div>
      </div>
    </section>
  );
}
