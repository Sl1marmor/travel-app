// src/components/Categories/Categories.jsx
import { CATEGORIES } from "../../data/constants";

export default function Categories({ activeCat, onCatChange }) {
  return (
    <section className="s-cats-section">
      <div className="s-container">
        <h2 className="s-section-title">Що шукаєте?</h2>
        <p className="s-section-sub">Оберіть тип житла</p>
        <div className="s-cats-grid">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.type}
              className={`s-cat-btn${activeCat === cat.type ? " active" : ""}`}
              onClick={() =>
                onCatChange(activeCat === cat.type ? null : cat.type)
              }
            >
              <span className="s-cat-icon">{cat.icon}</span>
              <span className="s-cat-label">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
