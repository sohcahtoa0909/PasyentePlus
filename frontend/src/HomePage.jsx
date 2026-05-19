import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import "./HomePage.css";
import MapComponent from "./MapComponent";
import { FACILITIES } from "./facilityData";
import LogoSrc from './Logo.png';
import NavSearchBar from "./NavSearchBar";


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
const IconX = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

/* ── Service Data ───────────────────────────────────── */
// Each service has: name, category emoji, suggested budget, and a hint label
const SERVICES = [
  // Emergency
  { name: "Emergency / ER Visit",         emoji: "🚨", category: "Emergency",     suggestedBudget: 2500 },
  { name: "Ambulance Transport",           emoji: "🚑", category: "Emergency",     suggestedBudget: 1800 },
  // Consultations
  { name: "General Consultation (GP)",     emoji: "🩺", category: "Consultation",  suggestedBudget: 500  },
  { name: "Pediatrics Consultation",       emoji: "👶", category: "Consultation",  suggestedBudget: 600  },
  { name: "OB-GYN Consultation",           emoji: "🤰", category: "Consultation",  suggestedBudget: 700  },
  { name: "Cardiology Consultation",       emoji: "❤️", category: "Consultation",  suggestedBudget: 1200 },
  { name: "Orthopedics Consultation",      emoji: "🦴", category: "Consultation",  suggestedBudget: 900  },
  { name: "Dermatology Consultation",      emoji: "🧴", category: "Consultation",  suggestedBudget: 800  },
  { name: "Neurology Consultation",        emoji: "🧠", category: "Consultation",  suggestedBudget: 1500 },
  { name: "Psychiatry / Mental Health",    emoji: "🧘", category: "Consultation",  suggestedBudget: 1000 },
  { name: "ENT Consultation",              emoji: "👂", category: "Consultation",  suggestedBudget: 700  },
  { name: "Ophthalmology / Eye Check",     emoji: "👁️", category: "Consultation",  suggestedBudget: 750  },
  { name: "Dental Check-up & Cleaning",    emoji: "🦷", category: "Dental",        suggestedBudget: 400  },
  { name: "Tooth Extraction",              emoji: "🦷", category: "Dental",        suggestedBudget: 600  },
  { name: "Dental Braces / Orthodontics",  emoji: "😬", category: "Dental",        suggestedBudget: 2800 },
  // Diagnostics
  { name: "Blood Test / CBC",              emoji: "🩸", category: "Diagnostics",   suggestedBudget: 400  },
  { name: "Urinalysis",                    emoji: "🧪", category: "Diagnostics",   suggestedBudget: 200  },
  { name: "X-Ray",                         emoji: "🔬", category: "Diagnostics",   suggestedBudget: 500  },
  { name: "Ultrasound",                    emoji: "📡", category: "Diagnostics",   suggestedBudget: 900  },
  { name: "MRI Scan",                      emoji: "🧲", category: "Diagnostics",   suggestedBudget: 2500 },
  { name: "CT Scan",                       emoji: "💻", category: "Diagnostics",   suggestedBudget: 2200 },
  { name: "ECG / EKG",                     emoji: "📈", category: "Diagnostics",   suggestedBudget: 600  },
  // Preventive
  { name: "Annual Physical Exam (APE)",    emoji: "📋", category: "Preventive",    suggestedBudget: 800  },
  { name: "Vaccination / Immunization",    emoji: "💉", category: "Preventive",    suggestedBudget: 500  },
  { name: "Prenatal Check-up",             emoji: "🤱", category: "Preventive",    suggestedBudget: 700  },
  { name: "Family Planning",              emoji: "👨‍👩‍👧", category: "Preventive",  suggestedBudget: 600  },
  // Therapy
  { name: "Physical Therapy / Rehab",      emoji: "🏋️", category: "Therapy",       suggestedBudget: 900  },
  { name: "Speech Therapy",                emoji: "🗣️", category: "Therapy",       suggestedBudget: 1000 },
  // Surgical
  { name: "Minor Surgical Procedure",      emoji: "🔪", category: "Surgical",      suggestedBudget: 2000 },
  { name: "Circumcision",                  emoji: "⚕️", category: "Surgical",      suggestedBudget: 1000 },
];

const CATEGORY_ORDER = ["Emergency", "Consultation", "Dental", "Diagnostics", "Preventive", "Therapy", "Surgical"];

/* ── Other Data ─────────────────────────────────────── */
const NAV = [
  { key: "Home",        icon: <IconHome /> },
  { key: "About",       icon: <IconInfo /> },
  { key: "Preferences", icon: <IconSliders /> },
  { key: "Help",        icon: <IconHelp /> },
];

// In a real app, this would come from the backend and be based on the user's query and preferences. For this prototype, it's hardcoded.

const FILTER_TABS = ["All", "Hospital", "Clinic", "Government"];

/* ── ServiceSearch Component ────────────────────────── */
function ServiceSearch({ onServiceSelect, selectedService }) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const [dropdownStyle, setDropdownStyle] = useState({});
  const inputRef = useRef(null);
  const wrapRef = useRef(null);

  const filtered = query.trim().length === 0
    ? SERVICES
    : SERVICES.filter(s =>
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.category.toLowerCase().includes(query.toLowerCase())
      );

  const grouped = CATEGORY_ORDER.reduce((acc, cat) => {
    const items = filtered.filter(s => s.category === cat);
    if (items.length) acc[cat] = items;
    return acc;
  }, {});

  const flatList = Object.values(grouped).flat();

  // Reposition dropdown to match input's screen coordinates
  function updateDropdownPos() {
    if (!wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    setDropdownStyle({
      position: "fixed",
      top: rect.bottom + 6,
      left: rect.left,
      width: rect.width,
      zIndex: 9999,
    });
  }

  useEffect(() => {
    if (isOpen) updateDropdownPos();
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        wrapRef.current && !wrapRef.current.contains(e.target) &&
        !e.target.closest(".hp-service-dropdown-portal")
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reposition on scroll (panel body scrolls)
  useEffect(() => {
    if (!isOpen) return;
    const panel = document.querySelector(".hp-panel-body");
    const onScroll = () => updateDropdownPos();
    panel?.addEventListener("scroll", onScroll);
    return () => panel?.removeEventListener("scroll", onScroll);
  }, [isOpen]);

  function handleKeyDown(e) {
    if (!isOpen) { if (e.key === "ArrowDown" || e.key === "Enter") setIsOpen(true); return; }
    if (e.key === "ArrowDown") { e.preventDefault(); setHighlighted(h => Math.min(h + 1, flatList.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setHighlighted(h => Math.max(h - 1, 0)); }
    else if (e.key === "Enter" && highlighted >= 0) { selectService(flatList[highlighted]); }
    else if (e.key === "Escape") { setIsOpen(false); }
  }

  function selectService(svc) {
    onServiceSelect(svc);
    setQuery("");
    setIsOpen(false);
    setHighlighted(-1);
  }

  function clearService() {
    onServiceSelect(null);
    setQuery("");
    inputRef.current?.focus();
  }

  const dropdown = isOpen && !selectedService && createPortal(
    <div className="hp-service-dropdown hp-service-dropdown-portal" style={dropdownStyle}>
      {flatList.length === 0 ? (
        <div className="hp-service-empty">No services found for "{query}"</div>
      ) : (
        Object.entries(grouped).map(([cat, items]) => (
          <div key={cat} className="hp-service-group">
            <div className="hp-service-group-label">{cat}</div>
            {items.map(svc => {
              const idx = flatList.indexOf(svc);
              return (
                <button
                  key={svc.name}
                  className={`hp-service-option${highlighted === idx ? " highlighted" : ""}`}
                  onMouseEnter={() => setHighlighted(idx)}
                  onMouseDown={e => { e.preventDefault(); selectService(svc); }}
                >
                  <span className="hp-svc-emoji">{svc.emoji}</span>
                  <span className="hp-svc-name">{svc.name}</span>
                  <span className="hp-svc-price">~₱{svc.suggestedBudget.toLocaleString()}</span>
                </button>
              );
            })}
          </div>
        ))
      )}
    </div>,
    document.body
  );

  return (
    <div className="hp-service-search">
      <div className="hp-section-label">I'm Looking For</div>

      {selectedService ? (
        <div className="hp-service-selected">
          <span className="hp-service-selected-emoji">{selectedService.emoji}</span>
          <span className="hp-service-selected-name">{selectedService.name}</span>
          <span className="hp-service-selected-cat">{selectedService.category}</span>
          <button className="hp-service-clear" onClick={clearService} title="Clear">
            <IconX />
          </button>
        </div>
      ) : (
        <div ref={wrapRef} className={`hp-service-input-wrap${isOpen ? " open" : ""}`}>
          <span className="hp-service-input-icon"><IconSearch /></span>
          <input
            ref={inputRef}
            className="hp-service-input"
            placeholder="Search service or condition…"
            value={query}
            onChange={e => { setQuery(e.target.value); setIsOpen(true); setHighlighted(-1); }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
          />
          {query && (
            <button className="hp-service-input-clear" onClick={() => { setQuery(""); setHighlighted(-1); }}>
              <IconX />
            </button>
          )}
        </div>
      )}

      {dropdown}

      {selectedService && (
        <div className="hp-service-hint">
          Typical cost around <strong>₱{selectedService.suggestedBudget.toLocaleString()}</strong> — budget slider adjusted.
        </div>
      )}
    </div>
  );
}

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
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
    >
      <div className="hp-card-accent" />
      {facility.best && (
        <div className="hp-best-badge">★ Best Match</div>
      )}
      <div className="hp-card-name">{facility.name}</div>
      <div className="hp-card-type">{facility.type}</div>
      <div className="hp-card-stats">
        <span className="hp-stat budget">₱{facility.budget}</span>
        <span className="hp-stat"><IconMapPin />{facility.travel}m</span>
        <span className="hp-stat"><IconClock />{facility.wait}m wait</span>
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
export default function HomePage({ activePage = "Home", setActivePage = () => {}, selectedFacilityData = null, setSelectedFacilityData = () => {} }) {
  const [budget,          setBudget]          = useState(1500);
  const [travel,          setTravel]          = useState(20);
  const [waiting,         setWaiting]         = useState(60);
  const [selectedId,      setSelectedId]      = useState(1);
  const [filterTab,       setFilterTab]       = useState("All");
  const [selectedService, setSelectedService] = useState(null);
  const [selectedFacility, setSelectedFacility] = useState(null);

  const panelOpen = activePage === "Home" || activePage === "FacilityDetails";

  const handleNavClick = (key) => {
    setActivePage(activePage === key && key !== "Home" ? "Home" : key);
  };

  // When a service is selected, nudge the budget slider to its suggested value
  function handleServiceSelect(svc) {
    setSelectedService(svc);
    if (svc) setBudget(Math.min(3000, Math.max(300, svc.suggestedBudget)));
  }

  // When a facility is picked from the nav search, highlight it in the list
  function handleFacilitySelect(facility) {
    setSelectedFacility(facility);
    if (facility) setSelectedId(facility.id);
  }

  // Navigate to facility details page
  function handleFacilityCardClick(facility) {
    setSelectedId(facility.id);
    setSelectedFacilityData(facility);
    setActivePage("FacilityDetails");
  }

  const filtered = FACILITIES.filter(f => {
    const matchPref = f.budget <= budget && f.travel <= travel && f.wait <= waiting;
    const matchTab  =
      filterTab === "All"        ? true :
      filterTab === "Hospital"   ? f.type.includes("Hospital") :
      filterTab === "Clinic"     ? f.type.includes("Clinic") :
      filterTab === "Government" ? f.type.includes("Government") : true;
    return matchPref && matchTab;
  });

  const mapMarkers = filtered.length > 0
    ? filtered.map(facility => ({
        position: facility.position,
        id: facility.id,
        name: facility.name,
        popupContent: `<strong>${facility.name}</strong><br/>${facility.type}`,
        onClick: () => handleFacilityCardClick(facility),
      }))
    : [
        {
          position: [7.1907, 125.4553],
          name: "Davao City",
          popupContent: "<strong>Davao City</strong><br/>Healthcare Hub",
        },
      ];

  return (
    <div className="hp-shell">

      {/* Map background */}
      <div className="map-full">
        <MapComponent
          center={filtered.length > 0 ? filtered[0].position : [7.1907, 125.4553]}
          zoom={12}
          markers={mapMarkers}
          selectedId={selectedFacilityData?.id}
          selectedPosition={selectedFacilityData?.position}
          selectedZoom={18}
        />
      </div>

      {/* ── Side Nav ── */}
      <nav className="hp-side-nav">
        <div className="hp-nav-logo">
          <img src={LogoSrc} alt="logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        </div>

        <NavSearchBar
          selectedFacility={selectedFacility}
          onFacilitySelect={handleFacilitySelect}
        />
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

      {/* ── Panel ── */}
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

            {/* Service search block — sits above preferences */}
            <div className="hp-section-block">
              <ServiceSearch
                selectedService={selectedService}
                onServiceSelect={handleServiceSelect}
              />
            </div>

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
                      onClick={() => handleFacilityCardClick(f)}
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