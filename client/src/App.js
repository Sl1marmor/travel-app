// src/App.js
import { useState, useEffect, useCallback } from "react";

import "./styles/global.css";

import { apiFetch, token } from "./api/apiFetch";

import Navbar           from "./components/Navbar/Navbar";
import Hero             from "./components/Hero/Hero";
import Categories       from "./components/Categories/Categories";
import DestinationCards from "./components/DestinationCard/DestinationCard";
import PromoBanner      from "./components/PromoBanner/PromoBanner";
import Footer           from "./components/Footer/Footer";
import AuthModal        from "./components/modals/AuthModal";
import BookingModal     from "./components/modals/BookingModal";
import Toast            from "./components/Toast/Toast";

export default function App() {
  // ── пошук ──
  const [activeTab,       setActiveTab]       = useState("stays");
  const [destination,     setDestination]     = useState("");
  const [checkIn,         setCheckIn]         = useState("");
  const [checkOut,        setCheckOut]        = useState("");
  const [guests,          setGuests]          = useState(2);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // ── фільтри ──
  const [activeCat, setActiveCat] = useState(null);
  const [sortBy,    setSortBy]    = useState("rating");

  // ── дані ──
  const [destinations, setDestinations] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [apiError,     setApiError]     = useState(null);

  // ── збережені ──
  const [savedIds, setSavedIds] = useState(new Set());

  // ── модалки ──
  const [modal,       setModal]       = useState(null);
  const [bookingDest, setBookingDest] = useState(null);

  // ── toast ──
  const [toast, setToast] = useState(null);

  // ── користувач ──
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  // ── завантаження напрямків ──
  const fetchDestinations = useCallback(async () => {
    setLoading(true); setApiError(null);
    try {
      const params = new URLSearchParams();
      if (activeCat)   params.set("type",   activeCat);
      if (sortBy)      params.set("sort",   sortBy);
      if (destination) params.set("search", destination);
      const data = await apiFetch(`/destinations?${params}`);
      setDestinations(data);
    } catch {
      setApiError("Не вдалося завантажити напрямки. Перевірте що сервер запущено.");
      setDestinations([]);
    } finally {
      setLoading(false);
    }
  }, [activeCat, sortBy]);

  useEffect(() => { fetchDestinations(); }, [fetchDestinations]);

  // ── suggestions ──
  const suggestions = destination.trim().length >= 1
    ? destinations.filter((d) =>
        d.name.toLowerCase().includes(destination.toLowerCase()) ||
        d.country.toLowerCase().includes(destination.toLowerCase())
      ).slice(0, 5)
    : [];

  // ── handlers ──
  const showToast = (msg) => setToast(msg);

  const handleSearch = () => {
    setShowSuggestions(false);
    fetchDestinations();
    document.getElementById("destinations")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSave = (id) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); showToast("Видалено зі збережених"); }
      else               { next.add(id);    showToast("Додано до збережених ♥"); }
      return next;
    });
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

  return (
    <>
      <Navbar
        user={user}
        onLogin={() => setModal("login")}
        onRegister={() => setModal("register")}
        onLogout={handleLogout}
        onToast={showToast}
      />

      <Hero
        activeTab={activeTab}        onTabChange={setActiveTab}
        destination={destination}    onDestinationChange={setDestination}
        checkIn={checkIn}            onCheckInChange={setCheckIn}
        checkOut={checkOut}          onCheckOutChange={setCheckOut}
        guests={guests}              onGuestsChange={setGuests}
        suggestions={suggestions}    showSuggestions={showSuggestions}
        onSuggestionSelect={(name) => { setDestination(name); setShowSuggestions(false); }}
        onSearch={handleSearch}
        onShowSuggestions={setShowSuggestions}
      />

      <Categories activeCat={activeCat} onCatChange={setActiveCat} />

      <DestinationCards
        destinations={destinations}
        loading={loading}
        apiError={apiError}
        activeCat={activeCat}
        sortBy={sortBy}
        onSortChange={setSortBy}
        savedIds={savedIds}
        onSave={handleSave}
        onBook={handleBook}
        onRetry={fetchDestinations}
      />

      <PromoBanner onRegister={() => setModal("register")} />

      <Footer onToast={showToast} />

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
          onSuccess={() => {
            setBookingDest(null);
            showToast(`Бронювання ${bookingDest.name} підтверджено! 🎉`);
          }}
        />
      )}

      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}
    </>
  );
}
