// src/components/Navbar/Navbar.jsx
import { useEffect, useState } from "react";

export default function Navbar({ user, onLogin, onRegister, onLogout, onToast }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`s-nav${scrolled ? " scrolled" : ""}`}>
      <div className="s-nav-inner">
        <div
          className="s-logo"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <span className="s-logo-icon">◆</span>
          <span className="s-logo-text">stayra</span>
        </div>

        <div className="s-nav-links">
          <button
            className="s-nav-link"
            onClick={() => onToast("Розділ «Партнери» — скоро!")}
          >
            Стати партнером
          </button>
          <button
            className="s-nav-link"
            onClick={() => onToast("Підтримка: support@stayra.com")}
          >
            Підтримка
          </button>

          {user ? (
            <>
              <span style={{ color: "rgba(255,255,255,.7)", fontSize: 14 }}>
                👋 {user.name}
              </span>
              <button className="s-btn-reg" onClick={onLogout}>
                Вийти
              </button>
            </>
          ) : (
            <>
              <button className="s-btn-reg" onClick={onRegister}>
                Реєстрація
              </button>
              <button className="s-btn-login" onClick={onLogin}>
                Увійти
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
