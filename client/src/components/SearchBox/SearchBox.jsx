// src/components/SearchBox/SearchBox.jsx
import { useRef, useEffect } from "react";
import { TABS } from "../../data/constants";

export default function SearchBox({
  activeTab, onTabChange,
  destination, onDestinationChange,
  checkIn, onCheckInChange,
  checkOut, onCheckOutChange,
  guests, onGuestsChange,
  suggestions, showSuggestions,
  onSuggestionSelect, onSearch,
  onShowSuggestions,
}) {
  const destRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (destRef.current && !destRef.current.contains(e.target)) {
        onShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [onShowSuggestions]);

  return (
    <>
      {/* Tabs */}
      <div className="s-tabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`s-tab${activeTab === t.key ? " active" : ""}`}
            onClick={() => onTabChange(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Search form */}
      <div className="s-search">
        {/* Destination */}
        <div
          className="s-field"
          style={{ position: "relative", flex: "1.4" }}
          ref={destRef}
        >
          <label htmlFor="dest-input">Куди їдемо?</label>
          <input
            id="dest-input"
            type="text"
            placeholder="Місто, готель або район"
            value={destination}
            autoComplete="off"
            onChange={(e) => {
              onDestinationChange(e.target.value);
              onShowSuggestions(true);
            }}
            onFocus={() => onShowSuggestions(true)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="s-suggestions">
              {suggestions.map((d) => (
                <div
                  key={d.id}
                  className="s-sug-item"
                  onClick={() => onSuggestionSelect(d.name)}
                >
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

        {/* Check-in */}
        <div className="s-field">
          <label htmlFor="checkin">Заїзд</label>
          <input
            id="checkin"
            type="date"
            value={checkIn}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => onCheckInChange(e.target.value)}
          />
        </div>

        <div className="s-divider" />

        {/* Check-out */}
        <div className="s-field">
          <label htmlFor="checkout">Виїзд</label>
          <input
            id="checkout"
            type="date"
            value={checkOut}
            min={checkIn || new Date().toISOString().split("T")[0]}
            onChange={(e) => onCheckOutChange(e.target.value)}
          />
        </div>

        <div className="s-divider" />

        {/* Guests */}
        <div className="s-field" style={{ flex: "0 0 auto", minWidth: 170 }}>
          <label>Гості</label>
          <div className="s-guests-ctrl">
            <button
              onClick={() => onGuestsChange(Math.max(1, guests - 1))}
              aria-label="Зменшити"
            >
              −
            </button>
            <span className="s-guests-val">
              {guests}{" "}
              {guests === 1 ? "гість" : guests < 5 ? "гості" : "гостей"}
            </span>
            <button
              onClick={() => onGuestsChange(Math.min(20, guests + 1))}
              aria-label="Збільшити"
            >
              +
            </button>
          </div>
        </div>

        <button className="s-search-btn" onClick={onSearch}>
          <span>Шукати</span>
          <svg
            width="18" height="18" fill="none"
            stroke="currentColor" strokeWidth="2.5"
            viewBox="0 0 24 24" aria-hidden
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </div>
    </>
  );
}
