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
const IconHeart = ({ filled }) => (
  <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);

const PLACEHOLDER_PHOTOS = [
  { id: 1, label: "Main Entrance", gradient: "linear-gradient(135deg,#a2dff7 0%,#007b8a 100%)" },
  { id: 2, label: "Emergency Wing", gradient: "linear-gradient(135deg,#c6f135 0%,#3a9ad9 100%)" },
  { id: 3, label: "Reception Area", gradient: "linear-gradient(135deg,#f0fafb 0%,#a2dff7 100%)" },
  { id: 4, label: "Patient Rooms",  gradient: "linear-gradient(135deg,#005f6b 0%,#3a9ad9 100%)" },
];

const STAR_LABELS = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

function typeLabel(type = "") {
  if (type.includes("Government")) return { letter: "G", color: "#2e7d32" };
  if (type.includes("Private"))    return { letter: "P", color: "#1565c0" };
  if (type.includes("Mission"))    return { letter: "M", color: "#6a1b9a" };
  return                                  { letter: "C", color: "#00838f" };
}

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

function StarRater({ value, onChange, locked, size = "md" }) {
  const [hover, setHover] = useState(0);
  return (
    <div className={`fdm-rater fdm-rater--${size}${locked ? " fdm-rater--locked" : ""}`}>
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

function PhotoGallery({ photos }) {
  const [active, setActive] = useState(0);

  // If there are no photos provided yet, return a fallback layout
  if (!photos || photos.length === 0) {
    return (
      <div className="fdm-gallery">
        <div className="fdm-gallery-main" style={{ background: "linear-gradient(135deg, #f0fafb 0%, #a2dff7 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "#007b8a", fontWeight: "600" }}>
          No Photos Available
        </div>
      </div>
    );
  }

  function prev() { setActive(a => (a - 1 + photos.length) % photos.length); }
  function next() { setActive(a => (a + 1) % photos.length); }

  return (
    <div className="fdm-gallery">
      <div className="fdm-gallery-main" style={{ background: "#f3f4f6" }}>
        <img
          src={photos[active].src}
          alt={photos[active].label}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={(e) => {
            // Broken image link fallback so your UI stays beautiful
            e.currentTarget.src = "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80";
          }}
        />
        <div className="fdm-gallery-label">{photos[active].label}</div>

        {photos.length > 1 && (
          <>
            <button className="fdm-gallery-nav fdm-gallery-nav--prev" onClick={prev}><IconChevronLeft /></button>
            <button className="fdm-gallery-nav fdm-gallery-nav--next" onClick={next}><IconChevronRight /></button>
          </>
        )}

        {photos.length > 1 && (
          <div className="fdm-gallery-dots">
            {photos.map((_, i) => (
              <button key={i} className={`fdm-gallery-dot${i === active ? " active" : ""}`} onClick={() => setActive(i)} />
            ))}
          </div>
        )}
      </div>

      {photos.length > 1 && (
        <div className="fdm-gallery-thumbs">
          {photos.map((p, i) => (
            <button
              key={p.id}
              className={`fdm-gallery-thumb${i === active ? " active" : ""}`}
              onClick={() => setActive(i)}
              title={p.label}
              style={{ padding: 0, overflow: "hidden" }}
            >
              <img src={p.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

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
function readFavs() {
  try { return JSON.parse(localStorage.getItem("pp_facilities") || "[]"); } catch { return []; }
}
function writeFavs(favs) {
  try {
    localStorage.setItem("pp_facilities", JSON.stringify(favs));
    window.dispatchEvent(new CustomEvent("pp-favorites-changed", { detail: favs }));
  } catch {}
}

export default function FacilityDetailsModal({ facility, onClose, skipHistoryRecord = false }) {
  const [userRating,    setUserRating]    = useState(0);
  const [isFavorited,   setIsFavorited]   = useState(() => {
    const id = facility?.id;
    return id != null && readFavs().some(f => String(f.id) === String(id));
  });

  /* Review panel status */
  const [reviewPanelOpen,  setReviewPanelOpen]  = useState(false);
  const [pendingStars,     setPendingStars]     = useState(0);
  const [visitDate,        setVisitDate]        = useState("");
  const [timeIn,           setTimeIn]           = useState("");
  const [timeOut,          setTimeOut]          = useState("");
  const [serviceAvailed,   setServiceAvailed]   = useState("");
  const [amountSpent,      setAmountSpent]      = useState("");
  const [reviewComment,    setReviewComment]    = useState("");
  
  /* For facility photos */
  const [facilityPhotos, setFacilityPhotos] = useState([]);

  /* Submission State: "idle" | "submitting" | "success" | "error" */
  const [submitStatus,     setSubmitStatus]     = useState("idle");
  const [errorMessage,     setErrorMessage]     = useState("");

  const overlayRef = useRef(null);

  useEffect(() => {
    if (!facility?.id) return;

    const backendBaseUrl = `http://${process.env.REACT_APP_BACKEND_API_ENDPOINT}`;

    async function fetchPhotos() {
      try {
        const res = await fetch(`${backendBaseUrl}/std/getPhotos?facilityId=${facility.id}`);
        if (!res.ok) throw new Error("Failed to load images");

        const data = await res.json();

        if (data.urls && data.urls.length > 0) {
          // Map the flat strings into objects matching our new PhotoGallery properties
          const loadedPhotos = data.urls.map((url, index) => {
            // Clean up double-slashes securely: /static//facilities -> /static/facilities
            const sanitizedUrl = url.replace(/\/+/g, '/');

            return {
              id: `live-${index}`,
              label: index === 0 ? "Main View" : `Photo ${index + 1}`,
              src: `${backendBaseUrl}${sanitizedUrl}`
            };
          });
          setFacilityPhotos(loadedPhotos);
        } else {
          // Fall back to gradients if array is explicitly empty
          setFacilityPhotos(PLACEHOLDER_PHOTOS.map(p => ({ ...p, src: "" })));
        }
      } catch (err) {
        console.error("Error retrieving facility images:", err);
        // Fallback gracefully on network failure
        setFacilityPhotos([]);
      }
    }

    fetchPhotos();
  }, [facility]);

  useEffect(() => {
    if (!facility) return;

    // Record this view to history (skip when re-opening from history/favorites)
    if (!skipHistoryRecord) try {
      const entry = {
        facilityId: facility.id,
        name:   facility.hospitalName || facility.name  || "Facility",
        type:   facility.facilityName || facility.type  || "Healthcare Facility",
        budget: facility.priceLow     || facility.budget || 0,
        travel: facility.distance     || facility.travel || 0,
        rating: facility.rating       || 0,
        viewedAt: new Date().toISOString(),
      };
      const prev    = JSON.parse(localStorage.getItem("pp_history") || "[]");
      const deduped = prev.filter(h => String(h.facilityId) !== String(facility.id));
      const next    = [entry, ...deduped].slice(0, 20);
      localStorage.setItem("pp_history", JSON.stringify(next));
      window.dispatchEvent(new CustomEvent("pp-history-changed", { detail: next }));
    } catch {}

    const reviews = JSON.parse(localStorage.getItem(`fdm-reviews-${facility.id}`) || "[]");
    if (reviews.length > 0) {
      setUserRating(reviews[reviews.length - 1].stars);
    } else {
      setUserRating(0);
    }
    setReviewPanelOpen(false);
    setPendingStars(0);
    setTimeIn(""); setTimeOut(""); setServiceAvailed("");
    setAmountSpent(""); setReviewComment("");
    setReviewSubmitted(false);
    setSubmitStatus("idle");
    setErrorMessage("");
    setVisitDate("");
  }, [facility, skipHistoryRecord]);

  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  if (!facility) return null;

  const tl = typeLabel(facility.type || facility.facilityName || "");

  const costDisplay   = facility.budget
    ? `₱${facility.budget}`
    : facility.priceLow != null
      ? `₱${facility.priceLow}–₱${facility.priceHigh}`
      : "—";
  const travelDisplay = facility.travel   != null ? `${facility.travel} min`  : facility.distance != null ? `${facility.distance} km` : "—";
  const waitDisplay   = facility.waitTime  != null ? `${parseInt(facility.waitTime)} min` : "—";
  const ratingDisplay = facility.rating   != null ? facility.rating.toFixed(1) : "—";

  const services     = facility.tags || facility.services || [];
  const facilityName = facility.name || facility.hospitalName || "Facility";
  const facilityType = facility.type || facility.facilityName || "Healthcare Facility";

  function openReviewPanel(n) {
    setPendingStars(n);
    setSubmitStatus("idle");
    setErrorMessage("");
    setReviewPanelOpen(true);
  }

  // Modified to use async/await and return a resolution status to the wrapper
  async function postReview() {
    const jsonTimeIn = new Date(`${visitDate}T${timeIn}`);
    const jsonTimeOut = new Date(`${visitDate}T${timeOut}`);

    const requestJson = {
      facilityId: facility.id,
      rating: pendingStars,
      timeIn: jsonTimeIn,
      timeOut: jsonTimeOut
    };    

    if (reviewComment && reviewComment.trim() !== "") {
      requestJson.textComment = reviewComment;
    }

    if (amountSpent !== undefined && amountSpent !== null && amountSpent !== "") {
      requestJson.moneySpent = Number(amountSpent);
    }

    try {
      const res = await fetch(`http://${process.env.REACT_APP_BACKEND_API_ENDPOINT}/report/writeReport`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(requestJson),
      });

      const data = await res.json();

      if (res.status === 200 || res.ok) {
        return { success: true };
      }

      // Route custom API error strings based on status code fallbacks
      switch(res.status) {
        case 403:
          return { success: false, message: "Not logged in! Please log in to leave a review." };
        case 401:
          return { success: false, message: data.message || "Unauthorized access." };
        case 429:
          return { success: false, message: "You have submitted a review too recently! Please try again later." };
        default:
          return { success: false, message: data.message || `Server error occurred (Status ${res.status}).` };
      }
    } catch (err) {
      return { success: false, message: "Network connection failure. Check your internet connection." };
    }
  }

  async function handleSubmitReview() {
    if (pendingStars === 0 || submitStatus === "submitting") return;
    
    setSubmitStatus("submitting");
    setErrorMessage("");

    const result = await postReview();

    if (result.success) {
      const key = `fdm-reviews-${facility.id}`;
      const prev = JSON.parse(localStorage.getItem(key) || "[]");
      prev.push({
        stars: pendingStars,
        visitDate, timeIn, timeOut,
        service: serviceAvailed,
        amount: amountSpent,
        comment: reviewComment,
        date: new Date().toISOString(),
      });
      localStorage.setItem(key, JSON.stringify(prev));
      setUserRating(pendingStars);
      setSubmitStatus("success");
    } else {
      setSubmitStatus("error");
      setErrorMessage(result.message);
    }
  }

  function handleRateAgain() {
    setPendingStars(0);
    setVisitDate(""); setTimeIn(""); setTimeOut(""); setServiceAvailed("");
    setAmountSpent(""); setReviewComment("");
    setSubmitStatus("idle");
    setErrorMessage("");
  }

  function handleClosePanel() {
    setReviewPanelOpen(false);
  }

  const modal = (
    <div
      className="fdm-overlay"
      ref={overlayRef}
      onMouseDown={e => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className={`fdm-shell${reviewPanelOpen ? " fdm-shell--expanded" : ""}`}>

        {/* ── Main modal ── */}
        <div className="fdm-modal" role="dialog" aria-modal="true" aria-label={facilityName}>

          <div className="fdm-header">
            <div className="fdm-header-top">
              <span className="fdm-type-badge" style={{ background: tl.color }}>{tl.letter}</span>
              <div className="fdm-header-text">
                <div className="fdm-eyebrow">PASYENTE+ · FACILITY DETAILS</div>
                <h2 className="fdm-title">{facilityName}</h2>
                <div className="fdm-subtitle">{facilityType}</div>
              </div>
              <button
                className={`fdm-fav-btn${isFavorited ? " fdm-fav-btn--active" : ""}`}
                onClick={() => {
                  const id = facility.id;
                  const favs = readFavs();
                  const exists = favs.some(f => String(f.id) === String(id));
                  const next = exists
                    ? favs.filter(f => String(f.id) !== String(id))
                    : [...favs, {
                        id,
                        name: facility.hospitalName || facility.name || "Facility",
                        type: facility.facilityName || facility.type || "Healthcare Facility",
                        budget: facility.priceLow || facility.budget || 0,
                        travel: facility.distance || facility.travel || 0,
                        rating: facility.rating || 0,
                        saved: false,
                      }];
                  writeFavs(next);
                  setIsFavorited(!exists);
                }}
                title={isFavorited ? "Remove from favorites" : "Add to favorites"}
              >
                <IconHeart filled={isFavorited} />
              </button>
              <button className="fdm-close" onClick={onClose} title="Close"><IconX /></button>
            </div>
            <div className="fdm-header-rating">
              <StarDisplay rating={parseFloat(ratingDisplay) || 0} size="sm" />
              <span className="fdm-rating-score">{ratingDisplay}</span>
              <span className="fdm-rating-count">community rating</span>
            </div>
          </div>

          <div className="fdm-body">

            <div className="fdm-section">
              <div className="fdm-section-label">Photos</div>
              <PhotoGallery photos={facilityPhotos} />
            </div>

            <div className="fdm-section">
              <div className="fdm-section-label">At a Glance</div>
              <div className="fdm-stats-grid">
                <StatCard label="Cost" value={costDisplay} sub="estimated" />
                <StatCard label="Travel Time" value={travelDisplay} />
                <StatCard label="Wait Time" value={waitDisplay} />
                <StatCard label="Rating" value={ratingDisplay} sub="/ 5.0" />
              </div>
            </div>

            <div className="fdm-section">
              <div className="fdm-section-label">Contact Information</div>
              <div className="fdm-info-block">
                <div className="fdm-info-row">
                  <span className="fdm-info-icon"><IconMapPin /></span>
                  <div className="fdm-info-content">
                    <div className="fdm-info-field">Address</div>
                    <div className="fdm-info-value">{facility.address || "Davao City, Davao del Sur, Philippines"}</div>
                  </div>
                </div>
                <div className="fdm-info-row">
                  <span className="fdm-info-icon"><IconPhone /></span>
                  <div className="fdm-info-content">
                    <div className="fdm-info-field">Phone</div>
                    <div className="fdm-info-value">{facility.phone || "(082) 123-4567"}</div>
                  </div>
                </div>
                <div className="fdm-info-row">
                  <span className="fdm-info-icon"><IconClock /></span>
                  <div className="fdm-info-content">
                    <div className="fdm-info-field">Hours</div>
                    <div className="fdm-info-value">{facility.hours || "Open 24 hours · Emergency services available"}</div>
                  </div>
                </div>
              </div>
            </div>

            {services.length > 0 && (
              <div className="fdm-section">
                <div className="fdm-section-label">Services Offered</div>
                <div className="fdm-tags">
                  {services.map(s => <span key={s} className="fdm-tag">{s}</span>)}
                </div>
              </div>
            )}

            {/* Rate This Facility */}
            <div className="fdm-section fdm-section--rating">
              <div className="fdm-section-label">Rate This Facility</div>
              <div className="fdm-rate-wrap">
                <StarRater
                  value={reviewPanelOpen ? pendingStars : userRating}
                  onChange={openReviewPanel}
                  locked={false}
                />
                {userRating > 0 ? (
                  <div className="fdm-rate-msg">
                    Your last rating: {userRating} star{userRating !== 1 ? "s" : ""}.
                    <button className="fdm-rate-change" onClick={() => openReviewPanel(userRating)}>
                      Rate again
                    </button>
                  </div>
                ) : (
                  <div className="fdm-rate-hint">Tap a star to write a review.</div>
                )}
              </div>
            </div>

          </div>

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

        {/* ── Review Panel ── */}
        {reviewPanelOpen && (
          <div className="fdm-review-panel">

            <div className="fdm-review-header">
              <div className="fdm-review-panel-title">Write a Review</div>
              <button className="fdm-close" onClick={handleClosePanel} title="Close review"><IconX /></button>
            </div>

            <div className="fdm-review-body">
              {submitStatus === "success" && (
                <div className="fdm-review-success">
                  <div className="fdm-review-success-icon">✓</div>
                  <p className="fdm-review-success-msg">Review submitted!</p>
                  <StarDisplay rating={userRating} size="md" />
                  <div className="fdm-review-success-actions">
                    <button className="fdm-btn fdm-btn--primary fdm-review-action-btn" onClick={handleRateAgain}>
                      Rate Again
                    </button>
                    <button className="fdm-btn fdm-btn--secondary fdm-review-action-btn" onClick={handleClosePanel}>
                      Done
                    </button>
                  </div>
                </div>
              )}

              {submitStatus === "error" && (
                <div className="fdm-review-success fdm-review-error">
                  <div className="fdm-review-success-icon" style={{ backgroundColor: "#ef5350" }}>✕</div>
                  <p className="fdm-review-success-msg" style={{ color: "#c62828" }}>Submission Failed</p>
                  <p className="fdm-review-error-text" style={{ margin: "8px 0 20px", fontSize: "14px", color: "#555" }}>
                    {errorMessage}
                  </p>
                  <div className="fdm-review-success-actions">
                    <button className="fdm-btn fdm-btn--primary fdm-review-action-btn" onClick={() => setSubmitStatus("idle")}>
                      Try Again
                    </button>
                    <button className="fdm-btn fdm-btn--secondary fdm-review-action-btn" onClick={handleClosePanel}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {(submitStatus === "idle" || submitStatus === "submitting") && (
                <>
                  {/* Star rating */}
                  <div className="fdm-review-field">
                    <div className="fdm-review-label">Your Rating</div>
                    <StarRater value={pendingStars} onChange={setPendingStars} locked={submitStatus === "submitting"} size="lg" />
                    {pendingStars > 0 && (
                      <div className="fdm-review-stars-hint">{STAR_LABELS[pendingStars]}</div>
                    )}
                  </div>

                  {/* Time Spent */}
                  <div className="fdm-review-field">
                    <div className="fdm-review-label">Time Spent</div>
                    <input
                      type="date"
                      disabled={submitStatus === "submitting"}
                      value={visitDate}
                      onChange={e => setVisitDate(e.target.value)}
                      className="fdm-review-input"
                      style={{ marginBottom: "8px", width: "100%" }}
                    />
                    <div className="fdm-review-time-row">
                      <div className="fdm-review-time-slot">
                        <span className="fdm-review-time-label">Time In</span>
                        <input
                          type="time"
                          disabled={submitStatus === "submitting"}
                          value={timeIn}
                          onChange={e => setTimeIn(e.target.value)}
                          className="fdm-review-input"
                        />
                      </div>
                      <span className="fdm-review-time-sep">→</span>
                      <div className="fdm-review-time-slot">
                        <span className="fdm-review-time-label">Time Out</span>
                        <input
                          type="time"
                          disabled={submitStatus === "submitting"}
                          value={timeOut}
                          onChange={e => setTimeOut(e.target.value)}
                          className="fdm-review-input"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Service Availed */}
                  <div className="fdm-review-field">
                    <div className="fdm-review-label">Service Availed</div>
                    <select
                      value={serviceAvailed}
                      disabled={submitStatus === "submitting"}
                      onChange={e => setServiceAvailed(e.target.value)}
                      className="fdm-review-select"
                    >
                      <option value="">Select a service…</option>
                      {services.length > 0
                        ? services.map(s => <option key={s} value={s}>{s}</option>)
                        : <option disabled>No services listed</option>
                      }
                    </select>
                  </div>

                  {/* Amount Spent */}
                  <div className="fdm-review-field">
                    <div className="fdm-review-label">Amount Spent</div>
                    <span className="fdm-review-optional"> (optional)</span>
                    <div className="fdm-review-peso-wrap">
                      <span className="fdm-review-peso">₱</span>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        disabled={submitStatus === "submitting"}
                        value={amountSpent}
                        onChange={e => setAmountSpent(e.target.value)}
                        className="fdm-review-input fdm-review-input--amount"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  {/* Comments */}
                  <div className="fdm-review-field">
                    <div className="fdm-review-label">
                      Comments
                      <span className="fdm-review-optional"> (optional)</span>
                    </div>
                    <textarea
                      value={reviewComment}
                      disabled={submitStatus === "submitting"}
                      onChange={e => setReviewComment(e.target.value)}
                      className="fdm-review-textarea"
                      placeholder="Share your experience…"
                      rows={4}
                    />
                  </div>
                </>
              )}
            </div>

            {(submitStatus === "idle" || submitStatus === "submitting") && (
              <div className="fdm-review-footer">
                <button
                  className="fdm-btn fdm-btn--primary"
                  onClick={handleSubmitReview}
                  disabled={pendingStars === 0 || submitStatus === "submitting"}
                  style={pendingStars === 0 || submitStatus === "submitting" ? { opacity: 0.45, cursor: "not-allowed" } : {}}
                >
                  {submitStatus === "submitting" ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );

  return createPortal(modal, document.body);
}