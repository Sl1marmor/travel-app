// src/components/Footer/Footer.jsx

const FOOTER_COLS = [
  { title: "Компанія",  links: ["Про нас", "Кар'єра", "Преса", "Блог"] },
  { title: "Підтримка", links: ["Довідковий центр", "Безпека", "Контакти", "Партнери"] },
  { title: "Правові",   links: ["Умови використання", "Конфіденційність", "Cookies"] },
];

export default function Footer({ onToast }) {
  return (
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
          {FOOTER_COLS.map((col) => (
            <div key={col.title} className="s-footer-col">
              <h4>{col.title}</h4>
              {col.links.map((l) => (
                <button key={l} onClick={() => onToast(`Розділ «${l}» — скоро!`)}>
                  {l}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="s-footer-bottom">© 2026 Stayra. Всі права захищені.</div>
    </footer>
  );
}
