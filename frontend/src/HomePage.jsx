import { useState } from "react";
import "./HomePage.css";
import MapComponent from "./MapComponent";
import LogoSrc from './Logo.png';


/* ── Icons ─────────────────────────────────────────── */
const IconHome = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75" />
  </svg>
);
const IconInfo = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
  </svg>
);
const IconSliders = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
  </svg>
);
const IconHelp = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
  </svg>
);
const IconSettings = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.43l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);
const IconMapPin = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
);
const IconClock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

/* ── Data ───────────────────────────────────────────── */
const NAV = [
  { key: "Home",        icon: <IconHome /> },
  { key: "About",       icon: <IconInfo /> },
  { key: "Preferences", icon: <IconSliders /> },
  { key: "Help",        icon: <IconHelp /> },
];

const FACILITIES = [
  { id: 1, best: true,  name: "Southern Philippines Medical Center", type: "Government Hospital", budget: 800,  travel: 15, wait: 45, rating: 4.5, tags: ["PhilHealth", "ER"] },
  { id: 2, best: false, name: "San Pedro Hospital",                  type: "Private Hospital",   budget: 900,  travel: 14, wait: 40, rating: 4.5, tags: ["Pediatrics", "OB-GYN"] },
  { id: 3, best: false, name: "Davao Doctors Hospital",              type: "Private Hospital",   budget: 1000, travel: 13, wait: 35, rating: 4.5, tags: ["Cardiology"] },
  { id: 4, best: false, name: "Brokenshire Memorial Hospital",       type: "Mission Hospital",   budget: 1100, travel: 12, wait: 30, rating: 4.5, tags: ["Rehab"] },
  { id: 5, best: false, name: "Davao Regional Medical Center",       type: "Government Hospital",budget: 600,  travel: 22, wait: 60, rating: 4.2, tags: ["PhilHealth"] },
  { id: 6, best: false, name: "Metro Davao Medical Center",          type: "Private Hospital",   budget: 1200, travel: 10, wait: 25, rating: 4.7, tags: ["Cancer Care"] },
  { id: 7, best: false, name: "Mindanao Sanitarium Hospital",        type: "Private Hospital",   budget: 950,  travel: 18, wait: 50, rating: 4.3, tags: ["General"] },
  { id: 8, best: false, name: "Davao Central Clinic",                type: "Clinic",             budget: 500,  travel: 8,  wait: 20, rating: 4.1, tags: ["GP", "Checkup"] },
];

const FILTER_TABS = ["All", "Hospital", "Clinic", "Government"];

/* ── Sub-components ─────────────────────────────────── */

function Stars({ rating }) {
  return (
    <div className="hp-stars">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} viewBox="0 0 24 24"
          fill={i <= Math.round(rating) ? "#f59e0b" : "none"}
          stroke="#f59e0b" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      ))}
      <span className="hp-stars-score">{rating}</span>
    </div>
  );
}

function PrefSlider({ label, value, min, max, unit = "", prefix = "", onChange }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="hp-pref-row">
      <div className="hp-pref-labels">
        <span className="hp-pref-label">{label}:</span>
        <span className="hp-pref-value">{prefix}{value}{unit}</span>
      </div>
      <div className="hp-slider-track">
        <div className="hp-slider-fill" style={{ width: `${pct}%` }} />
        <div className="hp-slider-thumb" style={{ left: `${pct}%` }} />
        <input
          className="hp-slider-input"
          type="range" min={min} max={max} value={value}
          onChange={e => onChange(Number(e.target.value))}
        />
      </div>
    </div>
  );
}

function FacilityCard({ facility, selected, onClick, animDelay }) {
  return (
    <div
      className={`hp-card${selected ? " selected" : ""}`}
      style={{ animationDelay: `${animDelay}s` }}
      onClick={onClick}
    >
      <div className="hp-card-accent" />

      {facility.best && (
        <div className="hp-best-badge">★ Best Match</div>
      )}

      <div className="hp-card-name">{facility.name}</div>
      <div className="hp-card-type">{facility.type}</div>

      <div className="hp-card-stats">
        <span className="hp-stat budget">₱{facility.budget}</span>
        <span className="hp-stat">
          <IconMapPin />{facility.travel}m
        </span>
        <span className="hp-stat">
          <IconClock />{facility.wait}m wait
        </span>
      </div>

      <div className="hp-card-bottom">
        <Stars rating={facility.rating} />
        <div className="hp-tags">
          {facility.tags.slice(0, 2).map(tag => (
            <span key={tag} className="hp-tag">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ─────────────────────────────────── */
export default function HomePage({ activePage = "Home", setActivePage = () => {} }) {
  const [budget,     setBudget]     = useState(1500);
  const [travel,     setTravel]     = useState(20);
  const [waiting,    setWaiting]    = useState(60);
  const [selectedId, setSelectedId] = useState(1);
  const [filterTab,  setFilterTab]  = useState("All");

  const panelOpen = activePage === "Home";

  const handleNavClick = (key) => {
    setActivePage(activePage === key && key !== "Home" ? "Home" : key);
  };

  const filtered = FACILITIES.filter(f => {
    const matchPref = f.budget <= budget && f.travel <= travel && f.wait <= waiting;
    const matchTab  =
      filterTab === "All"        ? true :
      filterTab === "Hospital"   ? f.type.includes("Hospital") :
      filterTab === "Clinic"     ? f.type.includes("Clinic") :
      filterTab === "Government" ? f.type.includes("Government") : true;
    return matchPref && matchTab;
  });

  return (
    <div className="hp-shell">

      {/* Map grid background */}
        <div className="map-full">
        <MapComponent 
            center={[7.1907, 125.4553]}
            zoom={12}
            markers={[
            {
                position: [7.1907, 125.4553],
                name: "Davao City",
                popupContent: "<strong>Davao City</strong><br/>Healthcare Hub"
            },
            {
                position: [7.0833, 125.6],
                name: "San Pedro Hospital",
                popupContent: "<strong>San Pedro Hospital</strong><br/>📞 (082) 123-4567"
            },
            {
                position: [7.1167, 125.6167],
                name: "Davao Medical Center",
                popupContent: "<strong>Davao Medical Center</strong><br/>Southern Philippines Medical Center"
            }
            ]}
        />
        </div>

      {/* ── Side Nav ── */}
      <nav className="hp-side-nav">
        <div className="hp-nav-logo">
          <img src={LogoSrc} alt="logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        </div>

        <button className="hp-nav-item" title="Search">
          <IconSearch />
        </button>
        <div className="hp-nav-divider" />

        {NAV.map(n => (
          <button
            key={n.key}
            className={`hp-nav-item${activePage === n.key ? " active" : ""}`}
            onClick={() => handleNavClick(n.key)}
            title={n.key}
          >
            {n.icon}
          </button>
        ))}

        <div className="hp-nav-spacer" />
        <div className="hp-nav-divider" />

        <button
          className={`nav-item ${activePage === "Settings" ? "active" : ""}`}
          onClick={() => handleNavClick("Settings")}
          title="Settings">
          <IconSettings />
        </button>
      </nav>

      {/* ── Panel (1/3 width) ── */}
      <div className={`hp-panel${panelOpen ? " open" : ""}`}>
        <div className="hp-panel-inner">

          {/* Header */}
          <div className="hp-panel-header">
            <div className="hp-eyebrow">PASYENTE+</div>
            <div className="hp-panel-title">Find a Facility</div>
            <div className="hp-panel-subtitle">Personalized healthcare near Davao City</div>
            <div className="hp-panel-divider" />
          </div>

          {/* Body */}
          <div className="hp-panel-body">

            {/* Preferences block */}
            <div className="hp-section-block">
              <div className="hp-section-label">Your Preferences</div>
              <PrefSlider
                label="Budget"
                value={budget} min={300} max={3000}
                prefix="₱"
                onChange={setBudget}
              />
              <PrefSlider
                label="Max Travel Time"
                value={travel} min={5} max={60}
                unit=" mins"
                onChange={setTravel}
              />
              <PrefSlider
                label="Max Waiting Time"
                value={waiting} min={10} max={120}
                unit=" mins"
                onChange={setWaiting}
              />
            </div>

            {/* Facilities block */}
            <div className="hp-section-block grow">

              {/* Block header */}
              <div className="hp-facilities-header">
                <div className="hp-facilities-title-row">
                  <div className="hp-section-label" style={{ marginBottom: 0 }}>
                    Recommended Facilities
                  </div>
                  <span className="hp-count-badge">{filtered.length}</span>
                </div>

                <div className="hp-filter-tabs">
                  {FILTER_TABS.map(t => (
                    <button
                      key={t}
                      className={`hp-filter-tab${filterTab === t ? " active" : ""}`}
                      onClick={() => setFilterTab(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scrollable list */}
              <div className="hp-facility-list">
                {filtered.length === 0 ? (
                  <div className="hp-empty">
                    No facilities match your filters.<br />
                    <span>Try adjusting your preferences above.</span>
                  </div>
                ) : (
                  filtered.map((f, i) => (
                    <FacilityCard
                      key={f.id}
                      facility={f}
                      selected={selectedId === f.id}
                      onClick={() => setSelectedId(f.id)}
                      animDelay={i * 0.055 + 0.05}
                    />
                  ))
                )}
              </div>

            </div>

          </div>
        </div>
      </div>

    </div>
  );
}