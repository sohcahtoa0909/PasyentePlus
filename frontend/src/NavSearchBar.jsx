import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import "./NavSearchBar.css";
import { FACILITIES } from "./facilityData";

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
  const [open, setOpen]             = useState(false);
  const [query, setQuery]           = useState("");
  const [isDropOpen, setIsDropOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const [dropStyle, setDropStyle]   = useState({});

  const navBtnRef = useRef(null);
  const barRef    = useRef(null);
  const inputRef  = useRef(null);

  /* Filter by name, type, or tags */
  const filtered = query.trim().length === 0
    ? FACILITIES
    : FACILITIES.filter(f =>
        f.name.toLowerCase().includes(query.toLowerCase()) ||
        f.type.toLowerCase().includes(query.toLowerCase()) ||
        f.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
      );

  function updateDropPos() {
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
    else if (e.key === "Enter" && highlighted >= 0) selectFacility(filtered[highlighted]);
    else if (e.key === "Escape")    setOpen(false);
  }

  function selectFacility(facility) {
    onFacilitySelect(facility);
    setQuery("");
    setIsDropOpen(false);
    setHighlighted(-1);
    setOpen(false);
  }

  function clearFacility() {
    onFacilitySelect(null);
    setQuery("");
    inputRef.current?.focus();
  }

  function typeLabel(type) {
    if (type.includes("Government")) return { letter: "G", color: "#2e7d32" };
    if (type.includes("Private"))    return { letter: "P", color: "#1565c0" };
    if (type.includes("Mission"))    return { letter: "M", color: "#6a1b9a" };
    return                                  { letter: "C", color: "#00838f" };
  }

  const dropdown = isDropOpen && !selectedFacility && createPortal(
    <div className="nsb-dropdown nsb-dropdown-portal" style={dropStyle}>
      {filtered.length === 0 ? (
        <div className="nsb-empty">No facilities found for "{query}"</div>
      ) : (
        filtered.map((f, idx) => {
          const tl = typeLabel(f.type);
          return (
            <button
              key={f.id}
              className={`nsb-option${highlighted === idx ? " highlighted" : ""}`}
              onMouseEnter={() => setHighlighted(idx)}
              onMouseDown={e => { e.preventDefault(); selectFacility(f); }}
            >
              <span className="nsb-type-badge" style={{ background: tl.color }}>{tl.letter}</span>
              <span className="nsb-facility-info">
                <span className="nsb-name">{f.name}</span>
                <span className="nsb-type">{f.type}</span>
              </span>
              <span className="nsb-rating">★ {f.rating}</span>
            </button>
          );
        })
      )}
    </div>,
    document.body
  );

  const tl = selectedFacility ? typeLabel(selectedFacility.type) : null;

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
        {selectedFacility ? (
          <div className="nsb-selected">
            <span className="nsb-type-badge nsb-type-badge--lg" style={{ background: tl.color }}>
              {tl.letter}
            </span>
            <div className="nsb-selected-info">
              <span className="nsb-selected-name">{selectedFacility.name}</span>
              <span className="nsb-selected-meta">
                <IconMapPin /> {selectedFacility.travel} min away · ★ {selectedFacility.rating}
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

        {selectedFacility && (
          <div className="nsb-hint">
            Budget ~<strong>₱{selectedFacility.budget}</strong> · Wait ~<strong>{selectedFacility.wait} min</strong>
          </div>
        )}
      </div>

      {dropdown}
    </div>
  );
}