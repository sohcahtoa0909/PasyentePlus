import { useState } from "react";
import { useSheetDrag } from "./useSheetDrag";
import "./AboutPage.css";
import "./HelpPage.css";
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

const steps = [
  { title: "Set Your Location",            desc: "In the Preferences tab, tap the map to pin your home location. This is used as your starting point for calculating travel times and getting directions." },
  { title: "Adjust Your Preferences",      desc: "Use the Max Travel Time and Max Waiting Time sliders in Preferences to set what works for you. PASYENTE+ uses these to rank facilities." },
  { title: "Browse Recommended Facilities", desc: "The Home page shows facilities ranked by how well they match your preferences. The best-matching facility is highlighted at the top." },
  { title: "View Facility Details",        desc: "Tap any facility card to see its full profile: services, estimated wait time, budget range, location on the map, and community ratings." },
  { title: "Get Directions",               desc: "Inside a facility's details, tap Get Directions to see a driving route drawn on the map from your home location to the facility." },
];

const faqs = [
  {
    q: "What is PASYENTE+ and who is it for?",
    a: "PASYENTE+ is a healthcare facility finder designed for patients in Davao City. It helps you locate, compare, and choose hospitals and clinics based on your location, budget, and time preferences.",
  },
  {
    q: "Is PASYENTE+ free to use?",
    a: "Yes, completely free for all users. No hidden charges or subscription fees are required to search and view healthcare facilities.",
  },
  {
    q: "How does PASYENTE+ recommend healthcare facilities?",
    a: "PASYENTE+ uses your preferences — budget, max travel time, and max waiting time — to calculate a match score for each facility. The facility that best balances all three factors is marked as the best match.",
  },
  {
    q: "How are facilities ranked in results?",
    a: "Facilities are ranked by how closely they match your set preferences. You can update your travel time and wait time sliders in the Preferences tab at any time to refine the rankings.",
  },
  {
    q: "Is the cost information accurate?",
    a: "We strive to provide the most up-to-date cost information for each facility. However, prices may vary depending on the services you need. We recommend confirming costs directly with the facility before your visit.",
  },
  {
    q: "How is waiting time estimated?",
    a: "Wait times are estimated from community reports submitted by users. These are averages — actual wait times may vary by day, time, and patient volume.",
  },
  {
    q: "Can I book an appointment through PASYENTE+?",
    a: "No, PASYENTE+ does not offer direct appointment booking. The app helps you find and compare facilities; you will need to contact the facility directly to schedule an appointment.",
  },
  {
    q: "Can I save facilities?",
    a: "Yes. Open any facility's details and it will automatically appear in your History in the Preferences tab. You can also check the checkbox next to a facility in Preferences to mark it as saved.",
  },
  {
    q: "How do I update my preferences?",
    a: "Go to the Preferences tab. From there you can update your home location and adjust your Max Travel Time and Max Waiting Time sliders.",
  },
  {
    q: "What if no facilities match my criteria?",
    a: "Try loosening your preferences — increase your Max Travel Time or Max Waiting Time sliders in the Preferences tab to allow more facilities to appear in your results.",
  },
  {
    q: "Are all Davao City healthcare facilities listed?",
    a: "We aim to include as many healthcare facilities in Davao City as possible, but some may not yet be listed. We are continuously working to expand our database.",
  },
];

export default function HelpPage({
  activePage,
  setActivePage,
  selectedFacility: propSelectedFacility,
  onFacilitySelect,
  isLoggedIn = false,
}) {
  const [tab, setTab] = useState("How To");
  const [openFaq, setOpenFaq] = useState(null);
  const [modalFacility, setModalFacility] = useState(null);
  const panelOpen = activePage === "Help";
  const { sheetHidden, setSheetHidden, sheetStyle, dragHandleProps } = useSheetDrag();

  const handleNavClick = (key) => {
    if (sheetHidden && key === activePage) { setSheetHidden(false); return; }
    setActivePage(activePage === key && key !== "Home" ? "Home" : key);
  };

  // Handle facility selection and open modal
  function handleFacilitySelect(facility) {
    if (facility) {
      setModalFacility(facility);
    }
    if (onFacilitySelect) {
      onFacilitySelect(facility);
    }
  }

  // Close modal handler
  function handleCloseModal() {
    setModalFacility(null);
    if (propSelectedFacility && onFacilitySelect) {
      onFacilitySelect(null);
    }
  }

  return (
    <div className="app-shell">
      <div className="map-full">
        <MapComponent 
          center={[7.1907, 125.4553]}
          zoom={12}
          markers={[
            {
              position: [7.1907, 125.4553],
              name: "Davao City",
              popupContent: "<strong>Davao City</strong>"
            }
          ]}
          onMarkerClick={(markerData) => {
            // Convert marker to facility format
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
              <div className="panel-title">Help</div>
              <div className="panel-subtitle">Guides &amp; frequently asked questions</div>
            </div>
            <div className="panel-divider" />
          </div>

          <div className="panel-tabs">
            {["How To", "FAQ"].map((t) => (
              <button key={t}
                className={`panel-tab ${tab === t ? "active" : ""}`}
                onClick={() => setTab(t)}>{t}
              </button>
            ))}
          </div>

          <div className="panel-body">
            <div className="panel-body-inner">

              {(tab === "How To") && (
                <div className="section-block">
                  <div className="section-label">How to use PASYENTE+</div>
                  <div className="help-steps">
                    {steps.map((s, i) => (
                      <div key={i} className="help-step">
                        <div className="help-step-num">{i + 1}</div>
                        <div className="help-step-icon">{s.icon}</div>
                        <div>
                          <div className="help-step-title">{s.title}</div>
                          <div className="help-step-desc">{s.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(tab === "FAQ") && (
                <div className="section-block">
                  <div className="section-label">Frequently Asked Questions</div>
                  <div className="faq-list">
                    {faqs.map((f, i) => (
                      <div key={i} className={`faq-item ${openFaq === i ? "open" : ""}`}>
                        <button className="faq-trigger" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                          <span className="faq-question">{f.q}</span>
                          <span className="faq-chevron">{openFaq === i ? "−" : "+"}</span>
                        </button>
                        {openFaq === i && (
                          <div className="faq-answer">{f.a}</div>
                        )}
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
          isLoggedIn={isLoggedIn}
          onLoginRequest={() => setActivePage("Auth")}
        />
      )}
    </div>
  );
}