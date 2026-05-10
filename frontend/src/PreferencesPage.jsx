import { useState, useRef } from "react";
import "./AboutPage.css";
import "./PreferencesPage.css";
import MapComponent from "./MapComponent";
import LogoSrc from './Logo.png';
import NavSearchBar from "./NavSearchBar";

const NAV = [
  { key: "Home", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75" /></svg> },
  { key: "About", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg> },
  { key: "Preferences", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg> },
  { key: "Help", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg> },
];

const IconSettings = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.43l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;

const initialFacilities = [
  { id: 1, name: "Lorem Ipsum Medical Center", type: "Hospital", budget: 800,  travel: 15, rating: 4.5, saved: false },
  { id: 2, name: "Dolor Sit Hospital",          type: "Hospital", budget: 900,  travel: 12, rating: 4.5, saved: false },
  { id: 3, name: "Consectetur Clinic",          type: "Clinic",   budget: 1000, travel: 9,  rating: 4.5, saved: false },
];

const initialHistory = [
  { id: 1, date: "2026-04-20", budget: 1200, travel: 15, wait: 45, results: 5 },
  { id: 2, date: "2026-04-18", budget: 1500, travel: 20, wait: 60, results: 7 },
  { id: 3, date: "2026-04-15", budget: 1000, travel: 10, wait: 30, results: 3 },
];


export default function PreferencesPage({ activePage, setActivePage }) {
  const [tab, setTab]               = useState("Search");
  const [budget, setBudget]         = useState(1500);
  const [travel, setTravel]         = useState(20);
  const [wait, setWait]             = useState(60);
  const [facilities, setFacilities] = useState(initialFacilities);
  const [history, setHistory]       = useState(initialHistory);
  const [toast, setToast]           = useState("");
  const [showToast, setShowToast]   = useState(false);
  const toastTimer                  = useRef(null);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const panelOpen = activePage === "Preferences";

  const handleNavClick = (key) => {
    setActivePage(activePage === key && key !== "Home" ? "Home" : key);
  };

  function handleFacilitySelect(facility) {
    setSelectedFacility(facility);
  }

  const triggerToast = (msg) => {
    clearTimeout(toastTimer.current);
    setToast(msg);
    setShowToast(true);
    toastTimer.current = setTimeout(() => setShowToast(false), 2000);
  };

  const toggleFacility = (id) =>
    setFacilities((prev) => prev.map((f) => f.id === id ? { ...f, saved: !f.saved } : f));

  const getFill = (value, min, max) => `${((value - min) / (max - min)) * 100}%`;

  return (
    <div className="app-shell">
      <div className="map-full">
        <MapComponent 
          center={[7.1907, 125.4553]}
          zoom={12}
          markers={[
            {
              position: [7.1907, 125.4553],
              name: "Davao City",
              popupContent: "<strong>Davao City</strong>"
            }
          ]}
        />
      </div>

      <nav className="side-nav">
        <div className="nav-logo">
          <img src={LogoSrc} alt="logo"
            onError={(e) => { e.target.style.display="none"; e.target.nextSibling.style.display="block"; }} />
          <span className="nav-logo-fallback">P+</span>
        </div>
        <NavSearchBar
          selectedFacility={selectedFacility}
          onFacilitySelect={handleFacilitySelect}
        />
        <div className="nav-divider" />
        {NAV.map((n) => (
          <button key={n.key}
            className={`nav-item ${activePage === n.key ? "active" : ""}`}
            onClick={() => handleNavClick(n.key)} title={n.key}>
            {n.icon}
          </button>
        ))}
        <div className="nav-spacer" />
        <div className="nav-divider" />
        <button className="nav-item" onClick={() => setActivePage("Settings")} title="Settings"><IconSettings /></button>
      </nav>

      <div className={`panel ${panelOpen ? "open" : ""}`}>
        <div className="panel-inner">

          <div className="panel-header">
            <div className="panel-header-inner">
              <div className="panel-eyebrow">PASYENTE+</div>
              <div className="panel-title">Preferences</div>
              <div className="panel-subtitle">Customize how we find facilities for you</div>
            </div>
            <div className="panel-divider" />
          </div>

          <div className="panel-tabs">
            {["Search", "Favorites", "History"].map((t) => (
              <button key={t}
                className={`panel-tab ${tab === t ? "active" : ""}`}
                onClick={() => setTab(t)}>{t}
              </button>
            ))}
          </div>

          <div className="panel-body">
            <div className="panel-body-inner">

              {tab === "Search" && (
                <div className="section-block">
                  <div className="section-label">Default Search Preferences</div>
                  <div className="prefs-slider-group">
                    <div className="prefs-slider-item">
                      <div className="prefs-slider-label">
                        Budget <span>₱{budget.toLocaleString()}</span>
                      </div>
                      <input type="range" min={500} max={5000} step={100}
                        value={budget}
                        style={{ "--fill": getFill(budget, 500, 5000) }}
                        onChange={(e) => setBudget(Number(e.target.value))} />
                    </div>
                    <div className="prefs-slider-item">
                      <div className="prefs-slider-label">
                        Max Travel Time <span>{travel} mins</span>
                      </div>
                      <input type="range" min={5} max={120} step={5}
                        value={travel}
                        style={{ "--fill": getFill(travel, 5, 120) }}
                        onChange={(e) => setTravel(Number(e.target.value))} />
                    </div>
                    <div className="prefs-slider-item">
                      <div className="prefs-slider-label">
                        Max Waiting Time <span>{wait} mins</span>
                      </div>
                      <input type="range" min={10} max={180} step={5}
                        value={wait}
                        style={{ "--fill": getFill(wait, 10, 180) }}
                        onChange={(e) => setWait(Number(e.target.value))} />
                    </div>
                  </div>
                  <button className="prefs-save-btn" onClick={() => triggerToast("✓ Preferences saved!")}>
                    Save Preferences
                  </button>
                </div>
              )}

              {tab === "Favorites" && (
                <div className="section-block">
                  <div className="section-label">
                    Favorite Facilities
                    <span className="section-count">{facilities.filter(f => f.saved).length} saved</span>
                  </div>
                  <div className="prefs-facility-list">
                    {facilities.map((f) => (
                      <div key={f.id} className="prefs-facility-card">
                        <div className="prefs-facility-info">
                          <div className="prefs-facility-name">{f.name}</div>
                          <div className="prefs-facility-type">{f.type}</div>
                          <div className="prefs-facility-meta">
                            <span>₱{f.budget}</span>
                            <span>⏱ {f.travel}m</span>
                            <span>★ {f.rating}</span>
                          </div>
                        </div>
                        <input type="checkbox" className="prefs-checkbox"
                          checked={f.saved}
                          onChange={() => toggleFacility(f.id)} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tab === "History" && (
                <div className="section-block">
                  <div className="section-label">
                    Search History
                    {history.length > 0 && (
                      <button className="prefs-clear-btn"
                        onClick={() => { setHistory([]); triggerToast("History cleared"); }}>
                        Clear All
                      </button>
                    )}
                  </div>
                  {history.length === 0 ? (
                    <p className="section-text" style={{ textAlign: "center", padding: "16px 0", color: "var(--c-text-mute)" }}>
                      No search history yet.
                    </p>
                  ) : (
                    <div className="prefs-history-list">
                      {history.map((h) => (
                        <div key={h.id} className="prefs-history-item">
                          <div>
                            <div className="prefs-history-date">{h.date}</div>
                            <div className="prefs-history-params">
                              Budget: ₱{h.budget} · Travel: {h.travel}m · Wait: {h.wait}m
                            </div>
                          </div>
                          <div className="prefs-history-results">{h.results} results</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      <div className={`prefs-toast ${showToast ? "show" : ""}`}>{toast}</div>
    </div>
  );
}