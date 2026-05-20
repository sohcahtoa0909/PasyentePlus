
import { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import "./HomePage.css";
import MapComponent from "./MapComponent";
import LogoSrc from './Logo.png';
import NavSearchBar from "./NavSearchBar";
import FacilityDetailsModal from "./FacilityDetailsModal";
import { formatDynamicWaitTime, getHospitalMarkers, transformFacilityData } from "./util/helper";
import { IconHome, IconInfo, IconSliders, IconHelp, IconSettings, IconSearch, IconMapPin, IconClock, IconX } from "./icons/Icons";

const SERVICE_MISC_LOOKUP = {
  "dentist-extract":          { suggestedBudget: 2500, emoji: "🦷" },
  "dentist-cleaning":         { suggestedBudget: 1000, emoji: "🫧" },
  "dialysis-hemodialysis":    { suggestedBudget: 4500, emoji: "🫘" },
  "dialysis-hemofiltration":  { suggestedBudget: 5500, emoji: "🫘" },
};

const CATEGORY_ORDER = ["Dentistry", "Renal Dialysis"];

const NAV = [
  { key: "Home",        icon: <IconHome /> },
  { key: "About",       icon: <IconInfo /> },
  { key: "Preferences", icon: <IconSliders /> },
  { key: "Help",        icon: <IconHelp /> },
];

const FILTER_TABS = ["All", "Hospital", "Clinic", "Government"];

/* ── ServiceSearch ────────────────────────── */
function ServiceSearch({ onServiceSelect, selectedService, handleQueryFacilities }) {
  const [loading, setLoading] = useState(true);
  const [SERVICES, setServices] = useState([]);

  useEffect(() => {
    const fillInServices = async () => {
      try {
        const response = await fetch(`http://${process.env.REACT_APP_BACKEND_API_ENDPOINT}/getsearchfilters`);
        const json = await response.json();
        const mapped = json.map((f) => ({
          name: f.displayName,
          emoji: SERVICE_MISC_LOOKUP[f.name].emoji,
          category: f.facilityType.displayName,
          suggestedBudget: SERVICE_MISC_LOOKUP[f.name].suggestedBudget,
          facilityType: f.facilityType.name,
          serviceType: f.name
        }));
        setServices(mapped);
      } catch (error) {
        console.error("The exact error is:", error);        
      } finally {
        setLoading(false);
      }
    };
    fillInServices();
  }, []);

  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const [dropdownStyle, setDropdownStyle] = useState({});
  const inputRef = useRef(null);
  const wrapRef  = useRef(null);

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

  function updateDropdownPos() {
    if (!wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    setDropdownStyle({ position: "fixed", top: rect.bottom + 6, left: rect.left, width: rect.width, zIndex: 9999 });
  }

  async function queryHospitals(svc) {
    try {
      const response = await fetch(`http://${process.env.REACT_APP_BACKEND_API_ENDPOINT}/search?${
        new URLSearchParams({ facility_type: svc.facilityType, service: svc.serviceType })
      }`);
      const json = await response.json();
      handleQueryFacilities(transformFacilityData(json));
    } catch (err) {
      console.log("An error occurred! " + err);
    }
  }

  useEffect(() => { if (isOpen) updateDropdownPos(); }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target) &&
          !e.target.closest(".hp-service-dropdown-portal")) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const panel   = document.querySelector(".hp-panel-body");
    const onScroll = () => updateDropdownPos();
    panel?.addEventListener("scroll", onScroll);
    return () => panel?.removeEventListener("scroll", onScroll);
  }, [isOpen]);

  function handleKeyDown(e) {
    if (!isOpen) { if (e.key === "ArrowDown" || e.key === "Enter") setIsOpen(true); return; }
    if      (e.key === "ArrowDown")                    { e.preventDefault(); setHighlighted(h => Math.min(h + 1, flatList.length - 1)); }
    else if (e.key === "ArrowUp")                      { e.preventDefault(); setHighlighted(h => Math.max(h - 1, 0)); }
    else if (e.key === "Enter" && highlighted >= 0)    { selectService(flatList[highlighted]); }
    else if (e.key === "Escape")                       { setIsOpen(false); }
  }

  function selectService(svc) {
    onServiceSelect(svc);
    setQuery("");
    setIsOpen(false);
    setHighlighted(-1);
    queryHospitals(svc);
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

  if (loading) return <div>Loading...</div>;
  return (
    <div className="hp-service-search">
      <div className="hp-section-label">I'm Looking For</div>
      {selectedService ? (
        <div className="hp-service-selected">
          <span className="hp-service-selected-emoji">{selectedService.emoji}</span>
          <span className="hp-service-selected-name">{selectedService.name}</span>
          <span className="hp-service-selected-cat">{selectedService.category}</span>
          <button className="hp-service-clear" onClick={clearService} title="Clear"><IconX /></button>
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
      {selectedService && (
        <div className="hp-service-hint">
          Suggested budget: <strong>~₱{selectedService.suggestedBudget.toLocaleString()}</strong>
        </div>
      )}
      {dropdown}
    </div>
  );
}

/* ── PrefSlider ── */
function PrefSlider({ label, value, min, max, prefix = "", unit = "", onChange }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="hp-pref-row">
      <div className="hp-pref-labels">
        <span className="hp-pref-label">{label}</span>
        <span className="hp-pref-value">{prefix}{value}{unit}</span>
      </div>
      <div className="hp-slider-track">
        <div className="hp-slider-fill" style={{ width: `${pct}%` }} />
        <div className="hp-slider-thumb" style={{ left: `${pct}%` }} />
        <input className="hp-slider-input" type="range" min={min} max={max} value={value}
          onChange={e => onChange(Number(e.target.value))} />
      </div>
    </div>
  );
}

/* ── Stars ── */
function Stars({ rating, ratingCount }) {
  return (
    <span className="hp-stars">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={`hp-star${parseFloat(rating) >= i ? " on" : ""}`}>★</span>
      ))}
      <span className="hp-stars-score">{parseFloat(rating).toFixed(1)} ({ratingCount})</span>
    </span>
  );
}

/* ── FacilityCard ── */
function FacilityCard({ facility, selected, onClick, onOpenDetails, animDelay }) {
  return (
    <div
      className={`hp-card${selected ? " selected" : ""}`}
      style={{ animationDelay: `${animDelay}s` }}
      onClick={() => {
        onClick();
        onOpenDetails(facility);
      }}
    >
      <div className="hp-card-accent" />
      <div className="hp-card-name">{facility.hospitalName}</div>
      <div className="hp-card-type">{facility.facilityName}</div>
      <div className="hp-card-stats">
        {facility.priceLow &&
          <span className="hp-stat budget">₱{facility.priceLow}-₱{facility.priceHigh}</span>
        }        
        <span className="hp-stat"><IconMapPin />{facility.distance}km</span>
        {facility.waitTime &&
          <span className="hp-stat"><IconClock />{formatDynamicWaitTime(facility.waitTime)} wait</span>
        }        
      </div>
      <div className="hp-card-bottom">
        {facility.rating ?
          <Stars rating={facility.rating} ratingCount={facility.ratingCount}/> :
          <span className="hp-stat">No ratings yet.</span>
        }        
        <div className="hp-tags">
          {facility.services.map(s => (
            <span key={s} className="hp-tag">{s}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function loadPref(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v !== null ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}

/* ══════════════════════════════════════════════════════
   Main Component
   ══════════════════════════════════════════════════════ */
const DEFAULT_CENTER = [7.1907, 125.4553];

export default function HomePage({
  activePage = "Home",
  setActivePage = () => {},
  selectedFacility,       // ← lifted from App
  onFacilitySelect,       // ← lifted from App
  activeLocation,
}) {
  const [budget,            setBudget]            = useState(1500);
  const [travel,            setTravel]            = useState(() => loadPref("pp_travel", 20));
  const [waiting,           setWaiting]           = useState(() => loadPref("pp_wait",   60));

  const [selectedId,        setSelectedId]        = useState(1);
  const [filterTab,         setFilterTab]         = useState("All");
  const [selectedService,   setSelectedService]   = useState(null);
  const [dynamicFacilities, setDynamicFacilities] = useState([]);
  const [modalFacility,     setModalFacility]     = useState(null);

  const markers = useMemo(() => {
    const facilityMarkers = getHospitalMarkers(dynamicFacilities);
    if (!activeLocation) return facilityMarkers;
    const locationPin = {
      position: activeLocation.coords,
      name: activeLocation.label,
      popupContent: `<strong>📍 ${activeLocation.label}</strong>`,
    };
    return [locationPin, ...facilityMarkers];
  }, [dynamicFacilities, activeLocation]);

  const panelOpen = activePage === "Home";

  const handleNavClick = (key) => {
    setActivePage(activePage === key && key !== "Home" ? "Home" : key);
  };

  function handleServiceSelect(svc) {
    setSelectedService(svc);
    if (svc) setBudget(Math.min(3000, Math.max(300, svc.suggestedBudget)));
  }

  // Wraps the App-level setter so we can also update local selectedId + open modal
  function handleFacilitySelect(facility) {
    onFacilitySelect(facility);
    if (facility) {
      setSelectedId(facility.id);
      setModalFacility(facility);
    }
  }

  function handleMarkerClick(markerData) {
    const full = dynamicFacilities.find(f => f.id === markerData.id) ?? markerData;
    setModalFacility(full);
  }

  return (
    <div className="hp-shell">

      {/* Map background */}
      <div className="map-full">
        <MapComponent
          center={activeLocation?.coords ?? DEFAULT_CENTER}
          zoom={12}
          markers={markers}
          onMarkerClick={handleMarkerClick}
        />
      </div>

      {/* ── Side Nav ── */}
      <nav className="hp-side-nav">
        <div className="hp-nav-logo">
          <img src={LogoSrc} alt="logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        </div>

        {/* Pass App-level state down to NavSearchBar */}
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
          title="Settings"
        >
          <IconSettings />
        </button>
      </nav>

      {/* ── Panel ── */}
      <div className={`hp-panel${panelOpen ? " open" : ""}`}>
        <div className="hp-panel-inner">

          <div className="hp-panel-header">
            <div className="hp-eyebrow">PASYENTE+</div>
            <div className="hp-panel-title">Find a Facility</div>
            <div className="hp-panel-subtitle">Near {activeLocation?.label ?? "Davao City"}</div>
            <div className="hp-panel-divider" />
          </div>

          <div className="hp-panel-body">

            <div className="hp-section-block">
              <ServiceSearch
                selectedService={selectedService}
                onServiceSelect={handleServiceSelect}
                handleQueryFacilities={(facis) => setDynamicFacilities(facis)}
              />
            </div>

            <div className="hp-section-block">
              <div className="hp-section-label">Your Preferences</div>
              <PrefSlider label="Budget"           value={budget}  min={300}  max={3000} prefix="₱"    onChange={setBudget}  />
              <PrefSlider label="Max Travel Time"  value={travel}  min={5}    max={120}   unit=" mins"  onChange={setTravel}  />
              <PrefSlider label="Max Waiting Time" value={waiting} min={10}   max={180}  unit=" mins"  onChange={setWaiting} />
            </div>

            <div className="hp-section-block grow">
              <div className="hp-facilities-header">
                <div className="hp-facilities-title-row">
                  <div className="hp-section-label" style={{ marginBottom: 0 }}>Recommended Facilities</div>
                  <span className="hp-count-badge">{dynamicFacilities.length}</span>
                </div>
                <div className="hp-filter-tabs">
                  {FILTER_TABS.map(t => (
                    <button
                      key={t}
                      className={`hp-filter-tab${filterTab === t ? " active" : ""}`}
                      onClick={() => setFilterTab(t)}
                    >{t}</button>
                  ))}
                </div>
              </div>

              <div className="hp-facility-list">
                {dynamicFacilities.length === 0 ? (
                  <div className="hp-empty">
                    No facilities match your filters.<br />
                    <span>Try adjusting your preferences above.</span>
                  </div>
                ) : (
                  dynamicFacilities.map((f, i) => (
                    <FacilityCard
                      key={f.id}
                      facility={f}
                      selected={selectedId === f.id}
                      onClick={() => setSelectedId(f.id)}
                      onOpenDetails={setModalFacility}
                      animDelay={i * 0.055 + 0.05}
                    />
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Facility Details Modal ── */}
      {modalFacility && (
        <FacilityDetailsModal
          facility={modalFacility}
          onClose={() => {
            setModalFacility(null);
            if (selectedFacility) {
              onFacilitySelect(null);
            }
          }}
        />
      )}

    </div>
  );
}