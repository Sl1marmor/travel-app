// src/components/DestinationCard/DestinationCard.jsx
import { CATEGORIES, SORT_OPTIONS } from "../../data/constants";

function Card({ dest, isSaved, onSave, onBook }) {
  return (
    <div className="s-card">
      <div className="s-card-img-wrap">
        <img
          src={dest.img}
          alt={dest.name}
          className="s-card-img"
          loading="lazy"
        />
        <span className="s-card-tag">{dest.tag}</span>
        <button
          className={`s-save-btn${isSaved ? " saved" : ""}`}
          onClick={() => onSave(dest.id)}
          aria-label={isSaved ? "Видалити зі збережених" : "Зберегти"}
        >
          {isSaved ? "♥" : "♡"}
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
          <button className="s-btn-book" onClick={() => onBook(dest)}>
            Бронювати
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DestinationCards({
  destinations, loading, apiError,
  activeCat, sortBy, onSortChange,
  savedIds, onSave, onBook,
  onRetry,
}) {
  return (
    <section className="s-cards-section" id="destinations">
      <div className="s-container">
        <div className="s-section-header">
          <div>
            <h2 className="s-section-title">Популярні напрямки</h2>
            <p className="s-section-sub">
              {activeCat
                ? `${CATEGORIES.find((c) => c.type === activeCat)?.label} · ${
                    destinations.length
                  } варіант${
                    destinations.length === 1
                      ? ""
                      : destinations.length < 5
                      ? "и"
                      : "ів"
                  }`
                : "Найбільш заброньовані місця цього сезону"}
            </p>
          </div>
          <div className="s-sort-bar">
            <span className="s-sort-label">Сортувати:</span>
            <select
              className="s-sort-select"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="s-cards-grid">
          {loading && (
            <div className="s-no-results">⏳ Завантаження...</div>
          )}
          {!loading && apiError && (
            <div className="s-no-results">
              ⚠️ {apiError}
              <br />
              <button
                style={{ marginTop: 12, color: "var(--blue)", fontWeight: 600 }}
                onClick={onRetry}
              >
                Спробувати знову
              </button>
            </div>
          )}
          {!loading && !apiError && destinations.length === 0 && (
            <div className="s-no-results">
              😕 Нічого не знайдено. Спробуйте інший фільтр.
            </div>
          )}
          {!loading &&
            destinations.map((dest) => (
              <Card
                key={dest.id}
                dest={dest}
                isSaved={savedIds.has(dest.id)}
                onSave={onSave}
                onBook={onBook}
              />
            ))}
        </div>
      </div>
    </section>
  );
}
