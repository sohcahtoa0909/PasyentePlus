import React, { useState, useEffect, useRef } from 'react';
import './FacilityDetails.css';
import LogoSrc from './Logo.png';

/* ── Icons ─────────────────────────────────── */
const IconHome = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
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

const IconArrowLeft = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

const IconMapPin = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
);

const IconClock = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconDollar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconPhone = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round"
      strokeLinejoin="round"
      d="M22 16.92v3a2 2 0 0 1-2.18 2
         19.79 19.79 0 0 1-8.63-3.07
         19.5 19.5 0 0 1-6-6
         19.79 19.79 0 0 1-3.07-8.67
         A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72
         12.84 12.84 0 0 0 .7 2.81
         2 2 0 0 1-.45 2.11L8.09 9.91
         a16 16 0 0 0 6 6l1.27-1.27
         a2 2 0 0 1 2.11-.45
         12.84 12.84 0 0 0 2.81.7
         A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const IconStar = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
  </svg>
);

const IconHeart = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const IconNavigation = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M13 5l7 7m0 0l-7 7m7-7H6" />
  </svg>
);

const IconBuilding = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
);

const NAV = [
  { key: "Home", icon: <IconHome /> },
  { key: "About", icon: <IconInfo /> },
  { key: "Preferences", icon: <IconSliders /> },
  { key: "Help", icon: <IconHelp /> },
];

const FacilityDetails = ({ facility, setActivePage, overlay = false }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const panelBodyRef = useRef(null);
  const panelOpen = true;

  useEffect(() => {
    setIsExpanded(false);
  }, [facility?.id]);

  useEffect(() => {
    const panelBody = panelBodyRef.current;
    if (!panelBody) return;

    const handleScroll = () => {
      if (panelBody.scrollTop > 30) {
        setIsExpanded(true);
      } else if (panelBody.scrollTop <= 20) {
        setIsExpanded(false);
      }
    };

    panelBody.addEventListener('scroll', handleScroll);
    return () => panelBody.removeEventListener('scroll', handleScroll);
  }, [panelBodyRef]);

  const handleNavClick = (key) => {
    setActivePage(key === "Home" ? "Home" : key);
  };

  if (!facility) {
    return (
      <div className="fd-shell">
        <nav className="fd-side-nav">
          <div className="fd-nav-logo">
            <img src={LogoSrc} alt="logo" />
          </div>
          <div className="fd-nav-divider" />
          {NAV.map(n => (
            <button
              key={n.key}
              className="fd-nav-item"
              onClick={() => handleNavClick(n.key)}
              title={n.key}
            >
              {n.icon}
            </button>
          ))}
          <div className="fd-nav-spacer" />
          <div className="fd-nav-divider" />
          <button className="fd-nav-item" onClick={() => handleNavClick("Settings")} title="Settings">
            <IconSettings />
          </button>
        </nav>

        <div className={`fd-panel${panelOpen ? " open" : ""}${isExpanded ? " expanded" : ""}`}>
          <div className="fd-empty">
            <IconBuilding />
            <h2>Facility Not Found</h2>
            <p>The facility you're looking for doesn't exist.</p>
            <button onClick={() => setActivePage("Home")}>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (overlay) {
    return (
      <div className="fd-panel-overlay-wrapper">
        <div className={`fd-panel overlay${panelOpen ? " open" : ""}${isExpanded ? " expanded" : ""}`}>
          <div className="fd-panel-header">
            <button className="fd-back-btn" onClick={() => setActivePage("Home")}> 
              <IconArrowLeft />
              <span>Back</span>
            </button>

            <div className="fd-header-top">
              <div className="fd-header-content">
                <h1>{facility.name}</h1>
                <p>{facility.type}</p>
              </div>
              <button
                className="fd-favorite-btn"
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <IconHeart style={{ fill: isFavorite ? 'currentColor' : 'none' }} />
              </button>
            </div>

            <div className="fd-rating">
              <div className="fd-stars">
                {[...Array(5)].map((_, i) => (
                  <IconStar
                    key={i}
                    fill={i < Math.round(facility.rating) ? '#f59e0b' : 'none'}
                    stroke="#f59e0b"
                  />
                ))}
              </div>
              <span>{facility.rating} / 5</span>
            </div>
          </div>

          <div ref={panelBodyRef} className="fd-panel-body">
            <div className="fd-info-grid">
              <div className="fd-info-card">
                <div className="fd-info-card-label">
                  <IconDollar />
                  Cost
                </div>
                <div className="fd-info-card-value">₱{facility.budget}</div>
              </div>

              <div className="fd-info-card">
                <div className="fd-info-card-label">
                  <IconMapPin />
                  Travel
                </div>
                <div className="fd-info-card-value">{facility.travel}m</div>
              </div>

              <div className="fd-info-card">
                <div className="fd-info-card-label">
                  <IconClock />
                  Wait
                </div>
                <div className="fd-info-card-value">{facility.wait}m</div>
              </div>

              <div className="fd-info-card">
                <div className="fd-info-card-label">
                  <IconStar />
                  Rating
                </div>
                <div className="fd-info-card-value">{facility.rating}</div>
              </div>
            </div>

            <div className="fd-section">
              <h2 className="fd-section-title">
                <IconPhone />
                Contact Information
              </h2>
              <div className="fd-contact-item">
                <IconMapPin className="fd-contact-icon" />
                <div className="fd-contact-content">
                  <p>Address</p>
                  <p>{facility.address}</p>
                </div>
              </div>
              <div className="fd-contact-item">
                <IconPhone className="fd-contact-icon" />
                <div className="fd-contact-content">
                  <p>Phone</p>
                  <p>{facility.phone}</p>
                </div>
              </div>
            </div>

            <div className="fd-section">
              <h2 className="fd-section-title">
                <IconStar />
                Services Offered
              </h2>
              <div className="fd-services">
                {facility.services && facility.services.map((service, index) => (
                  <span key={index} className="fd-service-badge">
                    {service}
                  </span>
                ))}
              </div>
            </div>

            <div className="fd-section">
              <h2 className="fd-section-title">About This Facility</h2>
              <p className="fd-about-text">
                {facility.name} is a {facility.type.toLowerCase()} located in Davao City,
                providing quality healthcare services to the community. With an average rating of{' '}
                {facility.rating} stars, patients have consistently reported positive experiences
                with the medical staff and facilities.
              </p>
            </div>
          </div>

          <div className="fd-panel-footer">
            <button className="fd-action-btn primary">
              <IconNavigation />
              Get Directions
            </button>
            <button className="fd-action-btn secondary">
              <IconPhone />
              Call Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fd-shell">
      <nav className="fd-side-nav">
        <div className="fd-nav-logo">
          <img src={LogoSrc} alt="logo" />
        </div>
        <div className="fd-nav-divider" />
        {NAV.map(n => (
          <button
            key={n.key}
            className="fd-nav-item"
            onClick={() => handleNavClick(n.key)}
            title={n.key}
          >
            {n.icon}
          </button>
        ))}
        <div className="fd-nav-spacer" />
        <div className="fd-nav-divider" />
        <button className="fd-nav-item" onClick={() => handleNavClick("Settings")} title="Settings">
          <IconSettings />
        </button>
      </nav>

      {/* Panel */}
      <div className={`fd-panel${panelOpen ? " open" : ""}${isExpanded ? " expanded" : ""}`}>
        
        {/* Header */}
        <div className="fd-panel-header">
          <button className="fd-back-btn" onClick={() => setActivePage("Home")}>
            <IconArrowLeft />
            <span>Back</span>
          </button>

          <div className="fd-header-top">
            <div className="fd-header-content">
              <h1>{facility.name}</h1>
              <p>{facility.type}</p>
            </div>
            <button
              className="fd-favorite-btn"
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <IconHeart style={{ fill: isFavorite ? 'currentColor' : 'none' }} />
            </button>
          </div>

          <div className="fd-rating">
            <div className="fd-stars">
              {[...Array(5)].map((_, i) => (
                <IconStar
                  key={i}
                  fill={i < Math.round(facility.rating) ? '#f59e0b' : 'none'}
                  stroke="#f59e0b"
                />
              ))}
            </div>
            <span>{facility.rating} / 5</span>
          </div>
        </div>

        {/* Body */}
        <div ref={panelBodyRef} className="fd-panel-body">
          {/* Info Cards */}
          <div className="fd-info-grid">
            <div className="fd-info-card">
              <div className="fd-info-card-label">
                <IconDollar />
                Cost
              </div>
              <div className="fd-info-card-value">₱{facility.budget}</div>
            </div>

            <div className="fd-info-card">
              <div className="fd-info-card-label">
                <IconMapPin />
                Travel
              </div>
              <div className="fd-info-card-value">{facility.travel}m</div>
            </div>

            <div className="fd-info-card">
              <div className="fd-info-card-label">
                <IconClock />
                Wait
              </div>
              <div className="fd-info-card-value">{facility.wait}m</div>
            </div>

            <div className="fd-info-card">
              <div className="fd-info-card-label">
                <IconStar />
                Rating
              </div>
              <div className="fd-info-card-value">{facility.rating}</div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="fd-section">
            <h2 className="fd-section-title">
              <IconPhone />
              Contact Information
            </h2>
            <div className="fd-contact-item">
              <IconMapPin className="fd-contact-icon" />
              <div className="fd-contact-content">
                <p>Address</p>
                <p>{facility.address}</p>
              </div>
            </div>
            <div className="fd-contact-item">
              <IconPhone className="fd-contact-icon" />
              <div className="fd-contact-content">
                <p>Phone</p>
                <p>{facility.phone}</p>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="fd-section">
            <h2 className="fd-section-title">
              <IconStar />
              Services Offered
            </h2>
            <div className="fd-services">
              {facility.services && facility.services.map((service, index) => (
                <span key={index} className="fd-service-badge">
                  {service}
                </span>
              ))}
            </div>
          </div>

          {/* About */}
          <div className="fd-section">
            <h2 className="fd-section-title">About This Facility</h2>
            <p className="fd-about-text">
              {facility.name} is a {facility.type.toLowerCase()} located in Davao City,
              providing quality healthcare services to the community. With an average rating of{' '}
              {facility.rating} stars, patients have consistently reported positive experiences
              with the medical staff and facilities.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="fd-panel-footer">
          <button className="fd-action-btn primary">
            <IconNavigation />
            Get Directions
          </button>
          <button className="fd-action-btn secondary">
            <IconPhone />
            Call Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default FacilityDetails;