import { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import "./HomePage.css";
import MapComponent from "./MapComponent";
import LogoSrc from './Logo.png';
import NavSearchBar from "./NavSearchBar";
import { getHospitalMarkers, transformFacilityData } from "./util/helper";
import { IconHome, IconInfo, IconSliders, IconHelp, IconSettings, IconSearch, IconMapPin, IconClock, IconX } from "./icons/Icons";

const SERVICE_MISC_LOOKUP = {
  "dentist-extract":        { suggestedBudget: 2500, emoji: "🦷" },
  "dentist-cleaning":       { suggestedBudget: 1000, emoji: "🫧" },
  "dialysis-hemodialysis":  { suggestedBudget: 4500, emoji: "🫘" },
  "dialysis-hemofiltration":  { suggestedBudget: 5500, emoji: "🫘" },
};

const CATEGORY_ORDER = ["Dentistry", "Renal Dialysis"];

/* ── Other Data ─────────────────────────────────────── */
const NAV = [
  { key: "Home",        icon: <IconHome /> },
  { key: "About",       icon: <IconInfo /> },
  { key: "Preferences", icon: <IconSliders /> },
  { key: "Help",        icon: <IconHelp /> },
];

const FILTER_TABS = ["All", "Hospital", "Clinic", "Government"];

/* ── ServiceSearch Component ────────────────────────── */
function ServiceSearch({ onServiceSelect, selectedService, handleQueryFacilities }) {

  const [loading, setLoading] = useState(true);
  const [SERVICES, setServices] = useState([]);  

  useEffect(() => {    
    const fillInServices = async () => {
      try {
        const response = await fetch(`http://${process.env.REACT_APP_BACKEND_API_ENDPOINT}/getsearchfilters`);
        const json = await response.json();

        const mapped = json.map((f) => {
          return {
            name: f.displayName,
            emoji: SERVICE_MISC_LOOKUP[f.name].emoji,
            category: f.facilityType.displayName,
            suggestedBudget: SERVICE_MISC_LOOKUP[f.name].suggestedBudget,
            facilityType: f.facilityType.name,
            serviceType: f.name
          };
        });
        
        setServices(mapped);              
      } catch (error) {
        console.error("The exact error is:", error);
        alert("Error: " + error.message);
      } finally {
        setLoading(false);
      }
    }

    fillInServices();
  }, []);

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

  async function queryHospitals(svc) {
    try {      
      const response = await fetch(`http://${process.env.REACT_APP_BACKEND_API_ENDPOINT}/search2?${
        new URLSearchParams({ facility_type: svc.facilityType, service: svc.serviceType })
      }`);
      const json = await response.json();

      const mapped = transformFacilityData(json);
      handleQueryFacilities(mapped);
    } catch(err) {
      console.log("An error occured! " + err);
    } finally {

    }
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

  if(loading) return <div>Loading...</div>;
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
    >
      <div className="hp-card-accent" />
      {/* {facility.best && (
        <div className="hp-best-badge">★ Best Match</div>
      )} */}
      <div className="hp-card-name">{facility.hospitalName}</div>
      <div className="hp-card-type">{facility.facilityName}</div>
      <div className="hp-card-stats">
        <span className="hp-stat budget">₱{facility.priceLow}-₱{facility.priceHigh}</span>
        <span className="hp-stat"><IconMapPin />{facility.distance}km</span>
        <span className="hp-stat"><IconClock />{facility.waitTime}m wait</span>
      </div>
      <div className="hp-card-bottom">
        <Stars rating="5" />
        <div className="hp-tags">
          {/* {facility.tags.slice(0, 2).map(tag => (
            <span key={tag} className="hp-tag">{tag}</span>
          ))} */}
          {facility.services.map(s => (
            <span key={s} className="hp-tag">{s}</span>
          ))
          }
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ─────────────────────────────────── */
export default function HomePage({ activePage = "Home", setActivePage = () => {} }) {
  const [budget,          setBudget]          = useState(1500);
  const [travel,          setTravel]          = useState(20);
  const [waiting,         setWaiting]         = useState(60);
  const [selectedId,      setSelectedId]      = useState(1);
  const [filterTab,       setFilterTab]       = useState("All");
  const [selectedService, setSelectedService] = useState(null);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [dynamicFacilities, setDynamicFacilities] = useState([]);

  const markers = useMemo(() => 
    getHospitalMarkers(dynamicFacilities)
  , [dynamicFacilities]);

  const panelOpen = activePage === "Home";

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

  return (
    <div className="hp-shell">

      {/* Map background */}
      <div className="map-full">
        <MapComponent
          center={[7.1907, 125.4553]}
          zoom={12}
          markers={markers}
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
                handleQueryFacilities={(facis) => {setDynamicFacilities(facis)}}
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
                  <span className="hp-count-badge">{dynamicFacilities.length}</span>
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