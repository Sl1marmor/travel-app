// src/components/Hero/Hero.jsx
import SearchBox from "../SearchBox/SearchBox";

const STATS = [
  ["2M+",  "Об'єктів"],
  ["200+", "Країн"],
  ["18M+", "Відгуків"],
  ["4.9★", "Рейтинг"],
];

export default function Hero({
  activeTab, onTabChange,
  destination, onDestinationChange,
  checkIn, onCheckInChange,
  checkOut, onCheckOutChange,
  guests, onGuestsChange,
  suggestions, showSuggestions,
  onSuggestionSelect, onSearch,
  onShowSuggestions,
}) {
  return (
    <section className="s-hero">
      <div className="s-hero-bg" />
      <div className="s-hero-content">
        <p className="s-eyebrow">Мандруй без меж</p>
        <h1 className="s-hero-title">
          Знайди своє<br />
          <span className="s-hero-accent">ідеальне місце</span>
        </h1>
        <p className="s-hero-sub">
          Понад 2 мільйони варіантів у 200+ країнах світу
        </p>

        <SearchBox
          activeTab={activeTab}
          onTabChange={onTabChange}
          destination={destination}
          onDestinationChange={onDestinationChange}
          checkIn={checkIn}
          onCheckInChange={onCheckInChange}
          checkOut={checkOut}
          onCheckOutChange={onCheckOutChange}
          guests={guests}
          onGuestsChange={onGuestsChange}
          suggestions={suggestions}
          showSuggestions={showSuggestions}
          onSuggestionSelect={onSuggestionSelect}
          onSearch={onSearch}
          onShowSuggestions={onShowSuggestions}
        />

        <div className="s-stats">
          {STATS.map(([num, lbl]) => (
            <div key={lbl}>
              <div className="s-stat-num">{num}</div>
              <div className="s-stat-lbl">{lbl}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
