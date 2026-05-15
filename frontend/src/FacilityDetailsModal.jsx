import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import "./FacilityDetailsModal.css";

/* ── Icons ── */
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
const IconPhone = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
  </svg>
);
const IconClock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const IconStar = ({ filled, half }) => (
  <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
    {half ? (
      <>
        <defs>
          <linearGradient id="halfGrad">
            <stop offset="50%" stopColor="currentColor" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <path
          fill="url(#halfGrad)"
          d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
        />
      </>
    ) : (
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    )}
  </svg>
);
const IconChevronLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);
const IconChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);
const IconDirections = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M9 6.75V15m0-8.25L6 9.75M9 6.75L12 9.75M15 17.25V9m0 8.25l3-2.25M15 17.25l-3-2.25" />
  </svg>
);

/* ── Placeholder images (gradient tiles as stand-ins) ── */
const PLACEHOLDER_PHOTOS = [
  { id: 1, label: "Main Entrance", gradient: "linear-gradient(135deg,#a2dff7 0%,#007b8a 100%)" },
  { id: 2, label: "Emergency Wing", gradient: "linear-gradient(135deg,#c6f135 0%,#3a9ad9 100%)" },
  { id: 3, label: "Reception Area", gradient: "linear-gradient(135deg,#f0fafb 0%,#a2dff7 100%)" },
  { id: 4, label: "Patient Rooms",  gradient: "linear-gradient(135deg,#005f6b 0%,#3a9ad9 100%)" },
];

/* ── Type badge helper (mirrors NavSearchBar) ── */
function typeLabel(type = "") {
  if (type.includes("Government")) return { letter: "G", color: "#2e7d32" };
  if (type.includes("Private"))    return { letter: "P", color: "#1565c0" };
  if (type.includes("Mission"))    return { letter: "M", color: "#6a1b9a" };
  return                                  { letter: "C", color: "#00838f" };
}

/* ── Star Rating Display ── */
function StarDisplay({ rating, size = "md" }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const filled = rating >= i;
    const half   = !filled && rating >= i - 0.5;
    stars.push(
      <span key={i} className={`fdm-star fdm-star--${size}${filled || half ? " fdm-star--on" : ""}`}>
        <IconStar filled={filled} half={half} />
      </span>
    );
  }
  return <span className="fdm-stars">{stars}</span>;
}

/* ── Interactive Star Rating ── */
function StarRater({ value, onChange, locked }) {
  const [hover, setHover] = useState(0);

  return (
    <div className={`fdm-rater${locked ? " fdm-rater--locked" : ""}`}>
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          className={`fdm-rater-star${(hover || value) >= n ? " on" : ""}`}
          onMouseEnter={() => !locked && setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => !locked && onChange(n)}
          disabled={locked}
          title={`Rate ${n} star${n > 1 ? "s" : ""}`}
        >
          <IconStar filled={(hover || value) >= n} />
        </button>
      ))}
    </div>
  );
}

/* ── Photo Gallery ── */
function PhotoGallery({ photos }) {
  const [active, setActive] = useState(0);

  function prev() { setActive(a => (a - 1 + photos.length) % photos.length); }
  function next() { setActive(a => (a + 1) % photos.length); }

  return (
    <div className="fdm-gallery">
      <div className="fdm-gallery-main" style={{ background: photos[active].gradient }}>
        <div className="fdm-gallery-label">{photos[active].label}</div>
        {photos.length > 1 && (
          <>
            <button className="fdm-gallery-nav fdm-gallery-nav--prev" onClick={prev}>
              <IconChevronLeft />
            </button>
            <button className="fdm-gallery-nav fdm-gallery-nav--next" onClick={next}>
              <IconChevronRight />
            </button>
          </>
        )}
        <div className="fdm-gallery-dots">
          {photos.map((_, i) => (
            <button
              key={i}
              className={`fdm-gallery-dot${i === active ? " active" : ""}`}
              onClick={() => setActive(i)}
            />
          ))}
        </div>
      </div>
      <div className="fdm-gallery-thumbs">
        {photos.map((p, i) => (
          <button
            key={p.id}
            className={`fdm-gallery-thumb${i === active ? " active" : ""}`}
            style={{ background: p.gradient }}
            onClick={() => setActive(i)}
            title={p.label}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Stat Card ── */
function StatCard({ label, value, sub }) {
  return (
    <div className="fdm-stat-card">
      <div className="fdm-stat-label">{label}</div>
      <div className="fdm-stat-value">{value}</div>
      {sub && <div className="fdm-stat-sub">{sub}</div>}
    </div>
  );
}

/* ══════════════════════════════════════════
   Main Modal Component
   ══════════════════════════════════════════ */
/**
 * FacilityDetailsModal
 *
 * Props:
 *   facility  — facility object (same shape as FACILITIES in NavSearchBar / FacilityCard)
 *   onClose   — () => void
 *
 * The component renders via a React portal so it floats above everything.
 */
export default function FacilityDetailsModal({ facility, onClose }) {
  const [userRating,  setUserRating]  = useState(0);
  const [ratingLocked, setRatingLocked] = useState(false);
  const [ratingMsg, setRatingMsg]     = useState("");
  const overlayRef = useRef(null);

  /* Restore saved rating from localStorage keyed by facility id */
  useEffect(() => {
    if (!facility) return;
    const saved = localStorage.getItem(`fdm-rating-${facility.id}`);
    if (saved) {
      setUserRating(Number(saved));
      setRatingLocked(true);
      setRatingMsg("You've already rated this facility. You can update your rating.");
    } else {
      setUserRating(0);
      setRatingLocked(false);
      setRatingMsg("");
    }
  }, [facility]);

  /* Close on Escape */
  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  /* Prevent body scroll while modal is open */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  if (!facility) return null;

  const tl = typeLabel(facility.type || facility.facilityName || "");

  /* Stat values — support both data shapes */
  const costDisplay   = facility.budget
    ? `₱${facility.budget}`
    : facility.priceLow != null
      ? `₱${facility.priceLow}–₱${facility.priceHigh}`
      : "—";
  const travelDisplay = facility.travel   != null ? `${facility.travel} min`  : facility.distance != null ? `${facility.distance} km` : "—";
  const waitDisplay   = facility.wait     != null ? `${facility.wait} min`    : facility.waitTime  != null ? `${facility.waitTime} min` : "—";
  const ratingDisplay = facility.rating   != null ? facility.rating.toFixed(1) : "—";

  const services = facility.tags || facility.services || [];
  const facilityName = facility.name || facility.hospitalName || "Facility";
  const facilityType = facility.type || facility.facilityName || "Healthcare Facility";

  function handleRating(n) {
    setUserRating(n);
    localStorage.setItem(`fdm-rating-${facility.id}`, String(n));
    setRatingLocked(true);
    setRatingMsg(`Thanks! You rated this facility ${n} star${n !== 1 ? "s" : ""}.`);
  }

  function handleChangeRating() {
    setRatingLocked(false);
    setRatingMsg("Select a new rating below.");
  }

  const modal = (
    <div
      className="fdm-overlay"
      ref={overlayRef}
      onMouseDown={e => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="fdm-modal" role="dialog" aria-modal="true" aria-label={facilityName}>

        {/* ── Header ── */}
        <div className="fdm-header">
          <div className="fdm-header-top">
            <span className="fdm-type-badge" style={{ background: tl.color }}>{tl.letter}</span>
            <div className="fdm-header-text">
              <div className="fdm-eyebrow">PASYENTE+ · FACILITY DETAILS</div>
              <h2 className="fdm-title">{facilityName}</h2>
              <div className="fdm-subtitle">{facilityType}</div>
            </div>
            <button className="fdm-close" onClick={onClose} title="Close"><IconX /></button>
          </div>
          <div className="fdm-header-rating">
            <StarDisplay rating={parseFloat(ratingDisplay) || 0} size="sm" />
            <span className="fdm-rating-score">{ratingDisplay}</span>
            <span className="fdm-rating-count">community rating</span>
          </div>
        </div>

        {/* ── Scrollable body ── */}
        <div className="fdm-body">

          {/* Photo Gallery */}
          <div className="fdm-section">
            <div className="fdm-section-label">Photos</div>
            <PhotoGallery photos={PLACEHOLDER_PHOTOS} />
          </div>

          {/* Stats row */}
          <div className="fdm-section">
            <div className="fdm-section-label">At a Glance</div>
            <div className="fdm-stats-grid">
              <StatCard label="Cost" value={costDisplay} sub="estimated" />
              <StatCard label="Travel Time" value={travelDisplay} />
              <StatCard label="Wait Time" value={waitDisplay} />
              <StatCard label="Rating" value={ratingDisplay} sub="/ 5.0" />
            </div>
          </div>

          {/* Contact Information */}
          <div className="fdm-section">
            <div className="fdm-section-label">Contact Information</div>
            <div className="fdm-info-block">
              <div className="fdm-info-row">
                <span className="fdm-info-icon"><IconMapPin /></span>
                <div className="fdm-info-content">
                  <div className="fdm-info-field">Address</div>
                  <div className="fdm-info-value">
                    {facility.address || "Davao City, Davao del Sur, Philippines"}
                  </div>
                </div>
              </div>
              <div className="fdm-info-row">
                <span className="fdm-info-icon"><IconPhone /></span>
                <div className="fdm-info-content">
                  <div className="fdm-info-field">Phone</div>
                  <div className="fdm-info-value">
                    {facility.phone || "(082) 123-4567"}
                  </div>
                </div>
              </div>
              <div className="fdm-info-row">
                <span className="fdm-info-icon"><IconClock /></span>
                <div className="fdm-info-content">
                  <div className="fdm-info-field">Hours</div>
                  <div className="fdm-info-value">
                    {facility.hours || "Open 24 hours · Emergency services available"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Services Offered */}
          {services.length > 0 && (
            <div className="fdm-section">
              <div className="fdm-section-label">Services Offered</div>
              <div className="fdm-tags">
                {services.map(s => (
                  <span key={s} className="fdm-tag">{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* User Rating */}
          <div className="fdm-section fdm-section--rating">
            <div className="fdm-section-label">Rate This Facility</div>
            <div className="fdm-rate-wrap">
              <StarRater value={userRating} onChange={handleRating} locked={ratingLocked} />
              {ratingMsg && (
                <div className="fdm-rate-msg">
                  {ratingMsg}
                  {ratingLocked && (
                    <button className="fdm-rate-change" onClick={handleChangeRating}>
                      Change rating
                    </button>
                  )}
                </div>
              )}
              {!ratingLocked && !ratingMsg && (
                <div className="fdm-rate-hint">Tap a star to submit your rating.</div>
              )}
            </div>
          </div>

        </div>

        {/* ── Footer actions ── */}
        <div className="fdm-footer">
          <button
            className="fdm-btn fdm-btn--primary"
            onClick={() => {
              const q = encodeURIComponent(facilityName + " Davao City");
              window.open(`https://www.google.com/maps/search/${q}`, "_blank");
            }}
          >
            <IconDirections />
            Get Directions
          </button>
          <button
            className="fdm-btn fdm-btn--secondary"
            onClick={() => {
              const num = (facility.phone || "+63821234567").replace(/\D/g, "");
              window.open(`tel:${num}`);
            }}
          >
            <IconPhone />
            Call Now
          </button>
        </div>

      </div>
    </div>
  );

  return createPortal(modal, document.body);
}