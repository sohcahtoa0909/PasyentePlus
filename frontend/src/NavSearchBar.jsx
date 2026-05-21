import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import "./NavSearchBar.css";

/* ── Icons ── */
const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);
const IconX = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const IconMapPin = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
);

export default function NavSearchBar({ onFacilitySelect, selectedFacility }) {
  const [open, setOpen]               = useState(false);
  const [query, setQuery]             = useState("");
  const [isDropOpen, setIsDropOpen]   = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const [dropStyle, setDropStyle]     = useState({});
  const [results, setResults]         = useState([]);
  const [loading, setLoading]         = useState(false);

  const navBtnRef  = useRef(null);
  const barRef     = useRef(null);
  const inputRef   = useRef(null);
  const debounceRef = useRef(null);

  /* Fetch all hospitals when dropdown opens; debounce 300ms when typing */
  useEffect(() => {
    if (!isDropOpen) return;
    clearTimeout(debounceRef.current);
    const trimmed = query.trim();
    setLoading(true);
    const delay = trimmed.length === 0 ? 0 : 300;
    debounceRef.current = setTimeout(async () => {
      try {
        const url = trimmed.length === 0
          ? `http://${process.env.REACT_APP_BACKEND_API_ENDPOINT}/hospitals/search`
          : `http://${process.env.REACT_APP_BACKEND_API_ENDPOINT}/hospitals/search?q=${encodeURIComponent(trimmed)}`;
        const res = await fetch(url);
        if (!res.ok) { setResults([]); return; }
        const data = await res.json();
        setResults(Array.isArray(data) ? data : []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, delay);
    return () => clearTimeout(debounceRef.current);
  }, [query, isDropOpen]);

  const filtered = results;

  function updateDropPos() {
    if (window.innerWidth <= 640) return;
    if (!barRef.current) return;
    const rect = barRef.current.getBoundingClientRect();
    setDropStyle({
      position: "fixed",
      top: rect.bottom + 6,
      left: rect.left,
      width: rect.width,
      zIndex: 9999,
    });
  }

  useEffect(() => { if (isDropOpen) updateDropPos(); }, [isDropOpen]);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 200);
      return () => clearTimeout(t);
    } else {
      setIsDropOpen(false);
      setQuery("");
      setHighlighted(-1);
    }
  }, [open]);

  useEffect(() => {
    function handleOutside(e) {
      if (navBtnRef.current?.contains(e.target)) return;
      if (barRef.current && !barRef.current.contains(e.target) &&
          !e.target.closest(".nsb-dropdown-portal")) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  function handleKeyDown(e) {
    if (!isDropOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") setIsDropOpen(true);
      return;
    }
    if (e.key === "ArrowDown")      { e.preventDefault(); setHighlighted(h => Math.min(h + 1, filtered.length - 1)); }
    else if (e.key === "ArrowUp")   { e.preventDefault(); setHighlighted(h => Math.max(h - 1, 0)); }
    else if (e.key === "Enter" && highlighted >= 0) selectHospital(filtered[highlighted]);
    else if (e.key === "Escape")    setOpen(false);
  }

  function selectHospital(hospital) {
    // Build a facility-compatible object from the hospital search result
    const facilityObj = {
      id: hospital.facilityId ?? hospital.id,
      hospitalName: hospital.hospitalName,
      name: hospital.hospitalName,
      facilityName: hospital.facilityTypes.join(" · ") || "Healthcare Facility",
      type: hospital.facilityTypes[0] || "Healthcare Facility",
      locLat: hospital.locLat,
      locLng: hospital.locLng,
      address: hospital.address,
      rating: hospital.avgRating,
      ratingCount: hospital.ratingCount,
      tags: hospital.facilityTypes,
    };
    onFacilitySelect(facilityObj);
    setQuery("");
    setResults([]);
    setIsDropOpen(false);
    setHighlighted(-1);
    setOpen(false);
  }

  function clearFacility() {
    onFacilitySelect(null);
    setQuery("");
    setResults([]);
    inputRef.current?.focus();
  }

  function typeLabel(types = []) {
    const first = (Array.isArray(types) ? types[0] : types) ?? "";
    if (first.toLowerCase().includes("dentis"))  return { letter: "D", color: "#00838f" };
    if (first.toLowerCase().includes("dialysis")) return { letter: "Di", color: "#1565c0" };
    return { letter: "H", color: "#007b8a" };
  }

  function FacilityItems() {
    if (loading) {
      return <div className="nsb-empty">Searching…</div>;
    }
    if (filtered.length === 0) {
      return <div className="nsb-empty">
        {query.trim().length === 0 ? "No hospitals found" : `No hospitals found for "${query}"`}
      </div>;
    }
    return filtered.map((h, idx) => {
      const tl = typeLabel(h.facilityTypes);
      return (
        <button
          key={h.id}
          className={`nsb-option${highlighted === idx ? " highlighted" : ""}`}
          onMouseEnter={() => setHighlighted(idx)}
          onMouseDown={e => { e.preventDefault(); selectHospital(h); }}
        >
          <span className="nsb-type-badge" style={{ background: tl.color }}>{tl.letter}</span>
          <span className="nsb-facility-info">
            <span className="nsb-name">{h.hospitalName}</span>
            <span className="nsb-type">{h.facilityTypes.join(" · ") || "Healthcare Facility"}</span>
          </span>
          {h.avgRating != null && (
            <span className="nsb-rating">★ {h.avgRating.toFixed(1)}</span>
          )}
        </button>
      );
    });
  }

  const tl = selectedFacility ? typeLabel(selectedFacility.tags ?? []) : null;

  /* Portal dropdown — desktop only, hidden on mobile via CSS */
  const portalDropdown = isDropOpen && !selectedFacility && createPortal(
    <div className="nsb-dropdown nsb-dropdown-portal" style={dropStyle}>
      <FacilityItems />
    </div>,
    document.body
  );

  return (
    <div className="nsb-root">
      <button
        ref={navBtnRef}
        className={`hp-nav-item${open ? " active" : ""}${selectedFacility ? " nsb-has-selection" : ""}`}
        title="Search Facilities"
        onClick={() => setOpen(v => !v)}
      >
        <IconSearch />
        {selectedFacility && <span className="nsb-dot" />}
      </button>

      <div ref={barRef} className={`nsb-bar${open ? " nsb-bar--open" : ""}`}>
        {/* Mobile-only page header */}
        <div className="nsb-bar-header">
          <div className="nsb-bar-header-text">
            <div className="nsb-bar-eyebrow">PASYENTE+</div>
            <div className="nsb-bar-title">Search Facilities</div>
          </div>
          <button className="nsb-bar-close" onClick={() => setOpen(false)} title="Close">
            <IconX />
          </button>
        </div>

        {/* Search input + results */}
        <div className="nsb-bar-content">
          {selectedFacility ? (
            <div className="nsb-selected">
              <span className="nsb-type-badge nsb-type-badge--lg" style={{ background: tl.color }}>
                {tl.letter}
              </span>
              <div className="nsb-selected-info">
                <span className="nsb-selected-name">{selectedFacility.hospitalName ?? selectedFacility.name}</span>
                <span className="nsb-selected-meta">
                  {selectedFacility.address
                    ? <><IconMapPin /> {selectedFacility.address}</>
                    : selectedFacility.rating != null
                      ? `★ ${selectedFacility.rating.toFixed(1)}`
                      : "No ratings yet"}
                </span>
              </div>
              <button className="nsb-clear" onClick={clearFacility} title="Clear"><IconX /></button>
            </div>
          ) : (
            <div className={`nsb-input-wrap${isDropOpen ? " nsb-input-wrap--open" : ""}`}>
              <span className="nsb-input-icon"><IconSearch /></span>
              <input
                ref={inputRef}
                className="nsb-input"
                placeholder="Search hospital or clinic…"
                value={query}
                onChange={e => { setQuery(e.target.value); setIsDropOpen(true); setHighlighted(-1); }}
                onFocus={() => setIsDropOpen(true)}
                onKeyDown={handleKeyDown}
                autoComplete="off"
              />
              {query && (
                <button className="nsb-input-clear" onClick={() => { setQuery(""); setHighlighted(-1); }}>
                  <IconX />
                </button>
              )}
            </div>
          )}

          {selectedFacility && selectedFacility.facilityName && (
            <div className="nsb-hint">{selectedFacility.facilityName}</div>
          )}

          {/* Inline results — mobile only, hidden on desktop via CSS */}
          {isDropOpen && !selectedFacility && (
            <div className="nsb-dropdown nsb-dropdown-inline">
              <FacilityItems />
            </div>
          )}
        </div>
      </div>

      {portalDropdown}
    </div>
  );
}
