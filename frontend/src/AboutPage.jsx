import { useState } from "react";
import "./AboutPage.css";
import MapComponent from "./MapComponent";
import LogoSrc from './Logo.png';
import NavSearchBar from "./NavSearchBar";
import FacilityDetailsModal from "./FacilityDetailsModal";

/* ── Icons ─────────────────────────────────── */
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

const NAV = [
  { key: "Home",        icon: <IconHome /> },
  { key: "About",       icon: <IconInfo /> },
  { key: "Preferences", icon: <IconSliders /> },
  { key: "Help",        icon: <IconHelp /> },
];

const solutions = [
  { icon: "🔍", title: "Filter Facilities", desc: "By budget, distance & services" },
  { icon: "🏆", title: "Ranked Results",    desc: "Sorted by your priorities" },
  { icon: "📍", title: "Live Map View",     desc: "Pins around your location" },
  { icon: "📋", title: "Full Profiles",     desc: "Hours, contacts & ratings" },
];

const problems = [
  "Whether a facility is affordable within their budget",
  "How far it is from their current location",
  "Expected waiting time at each facility",
];

/* ── Component ──────────────────────────────── */
export default function AboutPage({ 
  activePage, 
  setActivePage,
  selectedFacility: propSelectedFacility,  // Renamed prop to avoid conflict
  onFacilitySelect 
}) {
  const [tab, setTab] = useState("Overview");
  const [modalFacility, setModalFacility] = useState(null);  // Separate state for modal
  const panelOpen = activePage === "About";

  const handleNavClick = (key) => {
    setActivePage(activePage === key && key !== "Home" ? "Home" : key);
  };

  // Handle facility selection and open modal
  function handleFacilitySelect(facility) {
    if (facility) {
      setModalFacility(facility);  // Open modal with the facility
    }
    if (onFacilitySelect) {
      onFacilitySelect(facility);   // Pass up to parent if needed
    }
  }

  // Close modal handler
  function handleCloseModal() {
    setModalFacility(null);
    if (propSelectedFacility && onFacilitySelect) {
      onFacilitySelect(null);  // Clear selection in parent if needed
    }
  }

  return (
    <div className="app-shell">

      {/* Map */}
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
          onMarkerClick={(markerData) => {
            // Convert marker to facility format if needed
            const facility = {
              id: markerData.id || markerData.name,
              hospitalName: markerData.name,
              facilityName: markerData.type || "Healthcare Facility",
              priceLow: 1000,
              priceHigh: 5000,
              distance: markerData.distance || 5,
              waitTime: markerData.waitTime || 30,
              services: ["General Care"],
              rating: 4.5,
              address: markerData.popupContent?.replace(/<[^>]*>/g, '') || "Address available upon request",
              phone: markerData.phone || "",
              hours: markerData.hours || "24/7"
            };
            handleFacilitySelect(facility);
          }}
        />
      </div>

      {/* Side Nav */}
      <nav className="side-nav">
        <div className="nav-logo">
          <img
            src={LogoSrc}
            alt="logo"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "block";
            }}
          />
          <span className="nav-logo-fallback">P+</span>
        </div>

        <NavSearchBar
          selectedFacility={propSelectedFacility}
          onFacilitySelect={handleFacilitySelect}
        />

        <div className="nav-divider" />

        {NAV.map((n) => (
          <button
            key={n.key}
            className={`nav-item ${activePage === n.key ? "active" : ""}`}
            onClick={() => handleNavClick(n.key)}
            title={n.key}
          >
            {n.icon}
          </button>
        ))}

        <div className="nav-spacer" />
        <div className="nav-divider" />

        <button className="nav-item" onClick={() => setActivePage("Settings")} title="Settings">
          <IconSettings />
        </button>
      </nav>

      {/* Panel */}
      <div className={`panel ${panelOpen ? "open" : ""}`}>
        <div className="panel-inner">

          <div className="panel-header">
            <div className="panel-header-inner">
              <div className="panel-eyebrow">PASYENTE+</div>
              <div className="panel-title">About</div>
              <div className="panel-subtitle">Mission, problems &amp; our solution</div>
            </div>
            <div className="panel-divider" />
          </div>

          <div className="panel-tabs">
            {["Overview"].map((t) => (
              <button
                key={t}
                className={`panel-tab ${tab === t ? "active" : ""}`}
                onClick={() => setTab(t)}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="panel-body">
            <div className="panel-body-inner">

              {(tab === "Overview") && (
                <div className="section-block">
                  <div className="section-label">Our Mission</div>
                  <p className="section-text">
                    PASYENTE+ bridges the gap between Filipino patients and healthcare
                    facilities. We believe reliable medical information is a right —
                    not a privilege. Our platform empowers every Filipino to make
                    informed decisions with confidence.
                  </p>
                  <div className="tags-row">
                    <span className="tag tag-teal">Patient-first</span>
                    <span className="tag tag-blue">Philippines</span>
                    <span className="tag tag-green">Free Access</span>
                  </div>
                </div>
              )}

              {(tab === "Overview") && (
                <div className="section-block">
                  <div className="section-label">The Problem We Solve</div>
                  <p className="section-text">
                    Although healthcare facilities may already be known to the public, patients still have difficulty deciding which facility best fits their needs. The decision is not based on one factor alone, so patients need to consider:
                  </p>
                  <ul className="bullet-list">
                    {problems.map((p, i) => (
                      <li key={i} className="bullet-item">
                        <span className="bullet-dot" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                  <br></br>
                  <p className="section-text">
                    Without a unified system, this decision-making process becomes inefficient and may depend on guesswork or incomplete information. Patients deserve a better way to find the care they need, when they need it.
                  </p>
                </div>
              )}

              {(tab === "Overview") && (
                <div className="section-block">
                  <div className="section-label">Our Solution</div>
                  <p className="section-text">
                    A smart, preference-driven finder with real-time map integration.
                  </p>
                  <div className="solution-grid">
                    {solutions.map((s, i) => (
                      <div key={i} className="sol-card">
                        <div className="sol-card-icon">{s.icon}</div>
                        <div className="sol-card-title">{s.title}</div>
                        <div className="sol-card-desc">{s.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>

      {/* Facility Details Modal */}
      {modalFacility && (
        <FacilityDetailsModal
          facility={modalFacility}
          onClose={handleCloseModal}
        />
      )}

    </div>
  );
}