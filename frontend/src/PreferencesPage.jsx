import { useState, useRef, useCallback, useEffect } from "react";
import { useSheetDrag } from "./useSheetDrag";
import "./AboutPage.css";
import "./PreferencesPage.css";
import MapComponent from "./MapComponent";
import LogoSrc from './Logo.png';
import NavSearchBar from "./NavSearchBar";
import FacilityDetailsModal from "./FacilityDetailsModal";

const NAV = [
  { key: "Home", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75" /></svg> },
  { key: "About", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg> },
  { key: "Preferences", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg> },
  { key: "Help", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg> },
];

const IconSettings = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.43l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;

const IconLocation = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="12" height="12"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>;

const IconExpand = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="11" height="11"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" /></svg>;

const IconClose = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="13" height="13"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;

const IconEdit = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="11" height="11"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" /></svg>;

const IconHome = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="12" height="12"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75" /></svg>;

// Lock icon for guest-gated tabs
const IconLock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="13" height="13">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
);

// Reverse geocode using Nominatim (free, no key needed)
async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      { headers: { "Accept-Language": "en" } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const a = data.address || {};
    const parts = [
      a.road || a.pedestrian || a.footway,
      a.suburb || a.neighbourhood || a.village,
      a.city || a.town || a.municipality,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : data.display_name?.split(",").slice(0, 3).join(",").trim() || null;
  } catch {
    return null;
  }
}

function coordLabel(lat, lng) {
  return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
}

const initialFacilities = [];

function formatViewedAt(iso) {
  const d = new Date(iso);
  const time = d.toLocaleTimeString("en-PH", { hour: "numeric", minute: "2-digit", hour12: true });
  return d.toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" }) + ` · ${time}`;
}

const DEFAULT_CENTER = [7.1907, 125.4553];

function loadPref(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v !== null ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}

function savePref(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

// ── Guest gate banner ─────────────────────────────────────────────────────────
function GuestGate({ label, onLogin }) {
  return (
    <div className="section-block" style={{ textAlign: "center", padding: "28px 16px" }}>
      <div style={{
        width: 44, height: 44,
        borderRadius: "50%",
        background: "var(--c-teal-lt)",
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 12px",
        color: "var(--c-teal-dk)",
      }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20" height="20">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--c-text)", marginBottom: 5 }}>
        Sign in to use {label}
      </div>
      <div style={{ fontSize: 11.5, color: "var(--c-text-mute)", lineHeight: 1.55, marginBottom: 16 }}>
        Create a free account to save your {label.toLowerCase()} and access them across devices.
      </div>
      <button className="prefs-save-btn" style={{ maxWidth: 180, margin: "0 auto" }} onClick={onLogin}>
        Log In or Sign Up
      </button>
    </div>
  );
}

export default function PreferencesPage({
  activePage,
  setActivePage,
  selectedFacility: propSelectedFacility,
  onFacilitySelect,
  isLoggedIn = false,
  activeLocation,
  homeLocation,
  setActiveLocation,
  setHomeLocation,
}) {
  const [tab, setTab]               = useState("Search");
  const [travel, setTravel]         = useState(() => loadPref("pp_travel", 20));
  const [wait, setWait]             = useState(() => loadPref("pp_wait", 60));
  const [facilities, setFacilities] = useState(() => loadPref("pp_facilities", initialFacilities));
  const [history, setHistory]       = useState(() => loadPref("pp_history", []));
  const [toast, setToast]           = useState("");
  const [showToast, setShowToast]   = useState(false);
  const toastTimer                  = useRef(null);
  const [modalFacility,     setModalFacility]     = useState(null);
  const [modalSkipHistory,  setModalSkipHistory]  = useState(false);
  const panelOpen = activePage === "Preferences";
  const { sheetHidden, setSheetHidden, sheetStyle, dragHandleProps } = useSheetDrag();

  // ── Persist to localStorage ───────────────────────────────────────────────
  useEffect(() => savePref("pp_travel", travel),          [travel]);
  useEffect(() => savePref("pp_wait", wait),              [wait]);
  useEffect(() => savePref("pp_facilities", facilities),  [facilities]);
  useEffect(() => savePref("pp_history", history),        [history]);

  const [isChangingLocation, setIsChangingLocation] = useState(false);
  const [mapExpanded, setMapExpanded] = useState(false);
  const [geocoding, setGeocoding]     = useState(false);

  const handleNavClick = (key) => {
    if (sheetHidden && key === activePage) { setSheetHidden(false); return; }
    setActivePage(activePage === key && key !== "Home" ? "Home" : key);
  };

  function handleFacilitySelect(facility) {
    if (facility) {
      setModalFacility(facility);
    }
    if (onFacilitySelect) {
      onFacilitySelect(facility);
    }
  }

  function handleCloseModal() {
    setModalFacility(null);
    setModalSkipHistory(false);
    if (propSelectedFacility && onFacilitySelect) {
      onFacilitySelect(null);
    }
  }

  // Keep facilities and history in sync when the modal writes to localStorage directly
  useEffect(() => {
    function onFavChange(e)  { setFacilities(e.detail); }
    function onHistChange(e) { setHistory(e.detail); }
    window.addEventListener("pp-favorites-changed",  onFavChange);
    window.addEventListener("pp-history-changed",    onHistChange);
    return () => {
      window.removeEventListener("pp-favorites-changed",  onFavChange);
      window.removeEventListener("pp-history-changed",    onHistChange);
    };
  }, []);

  const triggerToast = (msg) => {
    clearTimeout(toastTimer.current);
    setToast(msg);
    setShowToast(true);
    toastTimer.current = setTimeout(() => setShowToast(false), 2000);
  };

  const toggleFacility = (id) =>
    setFacilities((prev) => prev.map((f) => f.id === id ? { ...f, saved: !f.saved } : f));

  const deleteCheckedFavorites = () => {
    const checkedCount = facilities.filter(f => f.saved).length;
    if (checkedCount === 0) return;
    setFacilities((prev) => prev.filter((f) => !f.saved));
    triggerToast(`✓ Removed ${checkedCount} favorite${checkedCount > 1 ? "s" : ""}`);
  };

  const getFill = (value, min, max) => `${((value - min) / (max - min)) * 100}%`;

  // ── Use Current Location ─────────────────────────────────────────────────
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      triggerToast("Geolocation not supported");
      return;
    }
    triggerToast("Locating…");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        const address = await reverseGeocode(lat, lng);
        const label = address || coordLabel(lat, lng);
        setActiveLocation({ type: "current", coords: [lat, lng], label });
        setIsChangingLocation(false);
        triggerToast(`✓ Using current location`);
      },
      () => triggerToast("Could not get location")
    );
  };

  // ── Open "Set Home" map modal ────────────────────────────────────────────
  const handleOpenSetHome = () => {
    setMapExpanded("setHome");
    setIsChangingLocation(false);
  };

  // ── Handle map click in "setHome" mode ──────────────────────────────────
  const handleMapClick = useCallback(async (latlng) => {
    const { lat, lng } = latlng;
    setGeocoding(true);
    const address = await reverseGeocode(lat, lng);
    const label = address || coordLabel(lat, lng);
    const newHome = { coords: [lat, lng], label };
    setHomeLocation(newHome);
    setActiveLocation({ type: "home", coords: [lat, lng], label });
    setGeocoding(false);
    setMapExpanded(false);
    triggerToast(`✓ Home set to ${label}`);
  }, [setHomeLocation, setActiveLocation]);

  // ── Select home as active (if already set) ───────────────────────────────
  const handleSelectHome = () => {
    if (homeLocation) {
      setActiveLocation({ type: "home", ...homeLocation });
      setIsChangingLocation(false);
      triggerToast(`✓ Using home location`);
    } else {
      handleOpenSetHome();
    }
  };

  // Derived display values
  const displayCenter  = activeLocation?.coords ?? DEFAULT_CENTER;
  const displayLabel   = activeLocation?.label  ?? "No location set";
  const displayMarkers = activeLocation
    ? [{ position: activeLocation.coords, name: activeLocation.label, popupContent: `<strong>${activeLocation.label}</strong>` }]
    : [];

  const modalCenter = mapExpanded === "setHome"
    ? (homeLocation?.coords ?? activeLocation?.coords ?? DEFAULT_CENTER)
    : displayCenter;

  // ── Tab labels with lock icons for guests ────────────────────────────────
  const TABS = [
    { key: "Search",    label: "Search" },
    { key: "Favorites", label: "Favorites", gated: true },
    { key: "History",   label: "History",   gated: true },
  ];

  return (
    <div className="app-shell">
      <div className="map-full">
        <MapComponent
          center={DEFAULT_CENTER}
          zoom={12}
          markers={[{ position: DEFAULT_CENTER, name: "Davao City", popupContent: "<strong>Davao City</strong>" }]}
          onMarkerClick={(markerData) => {
            const facility = {
              id: markerData.id || markerData.name,
              hospitalName: markerData.name,
              facilityName: "Healthcare Facility",
              priceLow: 1000,
              priceHigh: 5000,
              distance: 5,
              waitTime: 30,
              services: ["General Care"],
              rating: 4.5,
              address: markerData.popupContent?.replace(/<[^>]*>/g, '') || "Address available upon request",
              phone: "",
              hours: "24/7"
            };
            handleFacilitySelect(facility);
          }}
        />
      </div>

      <nav className="side-nav">
        <div className="nav-logo">
          <img src={LogoSrc} alt="logo"
            onError={(e) => { e.target.style.display="none"; e.target.nextSibling.style.display="block"; }} />
          <span className="nav-logo-fallback">P+</span>
        </div>
        <NavSearchBar
          selectedFacility={propSelectedFacility}
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

      <div className={`panel ${panelOpen ? "open" : ""}`} style={sheetStyle}>
        <div className="panel-inner">

          <div className="panel-drag-handle" {...dragHandleProps}>
            <div className="panel-drag-pill" />
          </div>

          <div className="panel-header">
            <div className="panel-header-inner">
              <div className="panel-eyebrow">PASYENTE+</div>
              <div className="panel-title">Preferences</div>
              <div className="panel-subtitle">Customize how we find facilities for you</div>
            </div>
            <div className="panel-divider" />
          </div>

          <div className="panel-tabs">
            {TABS.map(({ key, label, gated }) => (
              <button key={key}
                className={`panel-tab ${tab === key ? "active" : ""}`}
                onClick={() => setTab(key)}
                title={gated && !isLoggedIn ? "Sign in to access" : undefined}
              >
                {label}
                {gated && !isLoggedIn && (
                  <span style={{ marginLeft: 4, opacity: 0.55, display: "inline-flex", verticalAlign: "middle" }}>
                    <IconLock />
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="panel-body">
            <div className="panel-body-inner">

              {/* ── Search tab ── */}
              {tab === "Search" && (
                <div className="section-block">
                <div className="prefs-search-split">

                  {/* LEFT: Default Location */}
                  <div className="prefs-split-col">
                    <div className="section-label" style={{ marginBottom: 10 }}>Default Location</div>

                    <div
                      className="prefs-mini-map"
                      onClick={() => setMapExpanded("view")}
                      title="Click to expand map"
                    >
                      <MapComponent
                        center={displayCenter}
                        zoom={13}
                        markers={displayMarkers}
                      />
                      <div className="prefs-mini-map-overlay">
                        <span className="prefs-mini-map-expand-icon"><IconExpand /></span>
                      </div>
                    </div>

                    <div className="prefs-location-current">
                      <span className="prefs-location-pin">
                        {activeLocation?.type === "home" ? <IconHome /> : <IconLocation />}
                      </span>
                      <span className="prefs-location-name">{displayLabel}</span>
                    </div>

                    {!isChangingLocation ? (
                      <button
                        className="prefs-change-loc-btn"
                        onClick={() => setIsChangingLocation(true)}
                      >
                        <IconEdit /> Change Location
                      </button>
                    ) : (
                      <div className="prefs-location-picker">
                        <div className="prefs-location-picker-header">
                          <span style={{ fontSize: 10.5, fontWeight: 700, color: "var(--c-text-mid)", letterSpacing: "0.03em" }}>SELECT LOCATION</span>
                          <button
                            className="prefs-clear-btn"
                            onClick={() => setIsChangingLocation(false)}
                          >
                            Cancel
                          </button>
                        </div>
                        <div className="prefs-location-options">
                          <button
                            className={`prefs-location-option ${activeLocation?.type === "current" ? "active" : ""}`}
                            onClick={handleUseCurrentLocation}
                          >
                            <span className="prefs-location-pin" style={{ marginRight: 5 }}><IconLocation /></span>
                            Use Current Location
                          </button>
                          <button
                            className={`prefs-location-option ${activeLocation?.type === "home" ? "active" : ""}`}
                            onClick={handleSelectHome}
                          >
                            <span className="prefs-location-pin" style={{ marginRight: 5 }}><IconHome /></span>
                            {homeLocation ? `Home — ${homeLocation.label}` : "Set Home on Map…"}
                          </button>
                        </div>

                        {homeLocation && (
                          <button
                            className="prefs-expand-map-btn"
                            onClick={handleOpenSetHome}
                            style={{ marginTop: 4 }}
                          >
                            <IconEdit /> Move Home Pin
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Vertical divider */}
                  <div className="prefs-split-divider" />

                  {/* RIGHT: Search Preferences */}
                  <div className="prefs-split-col">
                    <div className="section-label" style={{ marginBottom: 10 }}>Search Preferences</div>
                    <div className="prefs-slider-group">
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

                    {/* Search preferences auto-save to localStorage; button gives feedback */}
                    <button className="prefs-save-btn" onClick={() => triggerToast("✓ Preferences saved locally!")}>
                      Save Preferences
                    </button>
                  </div>
                </div>
                </div>
              )}

              {/* ── Favorites tab ── */}
              {tab === "Favorites" && (
                isLoggedIn ? (
                  <div className="section-block">
                    <div className="section-label">
                      Favorite Facilities
                      <span className="section-count">{facilities.filter(f => f.saved).length} saved</span>
                      {facilities.some(f => f.saved) && (
                        <button className="prefs-clear-btn" style={{ color: "#e05555" }}
                          onClick={deleteCheckedFavorites}>
                          Delete
                        </button>
                      )}
                    </div>
                    <div className="prefs-facility-list">
                      {facilities.map((f) => (
                        <div
                          key={f.id}
                          className="prefs-facility-card"
                          onClick={() => {
                            setModalSkipHistory(true);
                            handleFacilitySelect({
                              id: f.id,
                              name: f.name,
                              type: f.type,
                              hospitalName: f.name,
                              facilityName: f.type,
                              priceLow: f.budget,
                              priceHigh: (f.budget || 0) + 200,
                              distance: f.travel,
                              waitTime: 30,
                              services: ["General Care"],
                              rating: f.rating,
                              address: "Address available upon request",
                              phone: "",
                              hours: "24/7",
                            });
                          }}
                        >
                          <div className="prefs-facility-info">
                            <div className="prefs-facility-name">{f.name}</div>
                            <div className="prefs-facility-type">{f.type}</div>
                            <div className="prefs-facility-meta">
                              <span>₱{f.budget}</span>
                              <span>⏱ {f.travel}m</span>
                              <span>★ {f.rating}</span>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            className="prefs-checkbox"
                            checked={f.saved}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => {
                              e.stopPropagation();
                              toggleFacility(f.id);
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <GuestGate label="Favorites" onLogin={() => setActivePage("Auth")} />
                )
              )}

              {/* ── History tab ── */}
              {tab === "History" && (
                isLoggedIn ? (
                  <div className="section-block">
                    <div className="section-label">
                      Recently Viewed
                      {history.length > 0 && (
                        <button className="prefs-clear-btn"
                          onClick={() => { setHistory([]); triggerToast("History cleared"); }}>
                          Clear All
                        </button>
                      )}
                    </div>
                    {history.length === 0 ? (
                      <p className="section-text" style={{ textAlign: "center", padding: "16px 0", color: "var(--c-text-mute)" }}>
                        No recently viewed facilities yet.
                      </p>
                    ) : (
                      <div className="prefs-history-list">
                        {history.map((h) => (
                          <div
                            key={h.viewedAt}
                            className="prefs-history-item"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              setModalSkipHistory(true);
                              handleFacilitySelect({
                                id: h.facilityId,
                                name: h.name,
                                type: h.type,
                                hospitalName: h.name,
                                facilityName: h.type,
                                priceLow: h.budget,
                                priceHigh: (h.budget || 0) + 200,
                                distance: h.travel,
                                waitTime: 30,
                                services: [],
                                rating: h.rating,
                                address: "Address available upon request",
                                phone: "",
                                hours: "24/7",
                              });
                            }}
                          >
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div className="prefs-facility-name" style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{h.name}</div>
                              <div className="prefs-history-params">
                                {h.type}{h.budget ? ` · ₱${h.budget}` : ""}{h.travel ? ` · ${h.travel}m` : ""}{h.rating ? ` · ★ ${h.rating}` : ""}
                              </div>
                            </div>
                            <div className="prefs-history-date">{formatViewedAt(h.viewedAt)}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <GuestGate label="History" onLogin={() => setActivePage("Auth")} />
                )
              )}

            </div>
          </div>
        </div>
      </div>

      {/* Map modal — view or setHome */}
      {mapExpanded && (
        <div className="prefs-map-modal-backdrop" onClick={() => setMapExpanded(false)}>
          <div className="prefs-map-modal" onClick={(e) => e.stopPropagation()}>
            <div className="prefs-map-modal-header">
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--c-teal-dk)", display: "flex", alignItems: "center", gap: 5 }}>
                {mapExpanded === "setHome" ? (
                  <>
                    <IconHome />
                    {geocoding ? "Getting address…" : "Tap to set your home"}
                  </>
                ) : (
                  <>
                    <IconLocation /> {displayLabel}
                  </>
                )}
              </span>
              <button className="prefs-clear-btn" style={{ fontSize: 11, display: "flex", alignItems: "center", gap: 4 }} onClick={() => setMapExpanded(false)}>
                <IconClose /> Close
              </button>
            </div>

            {mapExpanded === "setHome" && (
              <div style={{ padding: "6px 16px", background: "var(--c-teal-lt)", borderBottom: "1px solid var(--c-border)" }}>
                <span style={{ fontSize: 10.5, color: "var(--c-teal-dk)", fontWeight: 600 }}>
                  Click anywhere on the map to drop your home pin
                </span>
              </div>
            )}

            <div className="prefs-map-modal-body">
              <MapComponent
                center={modalCenter}
                zoom={13}
                markers={
                  mapExpanded === "setHome" && homeLocation
                    ? [{ position: homeLocation.coords, name: homeLocation.label, popupContent: `<strong>${homeLocation.label}</strong>` }]
                    : displayMarkers
                }
                clickable={mapExpanded === "setHome"}
                onMapClick={mapExpanded === "setHome" ? handleMapClick : null}
              />
            </div>
          </div>
        </div>
      )}

      {/* Facility Details Modal */}
      {modalFacility && (
        <FacilityDetailsModal
          facility={modalFacility}
          onClose={handleCloseModal}
          skipHistoryRecord={modalSkipHistory}
          isLoggedIn={isLoggedIn}
          onLoginRequest={() => setActivePage("Auth")}
        />
      )}

      <div className={`prefs-toast ${showToast ? "show" : ""}`}>{toast}</div>
    </div>
  );
}