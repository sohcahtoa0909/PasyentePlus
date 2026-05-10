import { useState } from "react";
import "./AboutPage.css";
import "./HelpPage.css";
import MapComponent from "./MapComponent";
import LogoSrc from './Logo.png';
import NavSearchBar from "./NavSearchBar";

const NAV = [
  { key: "Home", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75" /></svg> },
  { key: "About", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg> },
  { key: "Preferences", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg> },
  { key: "Help", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg> },
];

const IconSettings = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.43l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;

const steps = [
  {title: "Set Your Preferences", desc: "Tell us what matters — location, services, insurance, and more." },
  {title: "Browse Results",        desc: "Explore a curated list of facilities ranked by your preferences." },
  {title: "View Details",           desc: "Dive into full facility profiles: hours, contacts, services." },
  {title: "Take Action",            desc: "Call, get directions, or save a facility directly from the app." },
];

const faqs = [
  { q: "What is PASYENTE+ and who is it for?",   a: "PASYENTE+ is a healthcare facility finder designed for Filipinos. It helps patients locate, compare, and choose hospitals and clinics based on their personal needs, location, and preferences." },
  { q: "Is PASYENTE+ free to use?",              a: "Yes, completely free for all users. No hidden charges or subscription fees are required to search and view healthcare facilities." },
  { q: "How are facilities ranked in results?",  a: "Facilities are ranked based on your preferences, proximity, available services, and user ratings. Adjust preferences anytime to refine rankings." },
  { q: "Can I save or bookmark facilities?",     a: "Yes! Tap the bookmark icon on any facility card. Saved facilities are accessible anytime from the Preferences tab." },
  { q: "How do I update my preferences?",        a: "Go to the Preferences tab. From there update your location, healthcare priorities, insurance type, and other filters at any time." },
];

const contacts = [
  { icon: "✉️", label: "Email Us",  value: "help@pasyente.com" },
  { icon: "📞", label: "Call Us",   value: "(082) 123-4567" },
  { icon: "💬", label: "Live Chat", value: "Mon–Fri, 8AM–5PM" },
];


export default function HelpPage({ activePage, setActivePage }) {
  const [tab, setTab] = useState("How To");
  const [openFaq, setOpenFaq] = useState(null);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const panelOpen = activePage === "Help";

  const handleNavClick = (key) => {
    setActivePage(activePage === key && key !== "Home" ? "Home" : key);
  };

  function handleFacilitySelect(facility) {
    setSelectedFacility(facility);
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
        />
      </div>

      <nav className="side-nav">
        <div className="nav-logo">
          <img src={LogoSrc} alt="logo"
            onError={(e) => { e.target.style.display="none"; e.target.nextSibling.style.display="block"; }} />
          <span className="nav-logo-fallback">P+</span>
        </div>
        <NavSearchBar
          selectedFacility={selectedFacility}
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

      <div className={`panel ${panelOpen ? "open" : ""}`}>
        <div className="panel-inner">

          <div className="panel-header">
            <div className="panel-header-inner">
              <div className="panel-eyebrow">PASYENTE+</div>
              <div className="panel-title">Help</div>
              <div className="panel-subtitle">Guides, FAQs &amp; how to reach us</div>
            </div>
            <div className="panel-divider" />
          </div>

          <div className="panel-tabs">
            {["How To", "FAQ", "Contact"].map((t) => (
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

              {(tab === "Contact") && (
                <div className="section-block">
                  <div className="section-label">Still Need Help?</div>
                  <p className="section-text" style={{ marginBottom: 14 }}>
                    Our support team is ready to assist you with any questions or issues.
                  </p>
                  <div className="contact-grid">
                    {contacts.map((c, i) => (
                      <div key={i} className="contact-card">
                        <div className="contact-icon">{c.icon}</div>
                        <div className="contact-label">{c.label}</div>
                        <div className="contact-value">{c.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}