import { useState, useEffect } from "react";
import "./AboutPage.css";
import "./SettingsPage.css";
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

// ── helpers ──────────────────────────────────────────────────────────────────
function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

// ── component ────────────────────────────────────────────────────────────────
export default function SettingsPage({ 
  activePage, 
  setActivePage,
  selectedFacility: propSelectedFacility,
  onFacilitySelect,
  isLoggedIn = false,
  currentUser = null,
  onUserUpdate = null,
}) {
  const panelOpen = activePage === "Settings";

  const [tab, setTab] = useState("Profile");
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  // Profile state — seeded from currentUser when logged in
  const [profile, setProfile] = useState({
    displayName: currentUser?.displayName ?? "",
    username:    currentUser?.userName    ?? "",
    email:       currentUser?.email       ?? "",
  });
  // Track whether the user has manually typed in the username field
  const [usernameEdited, setUsernameEdited] = useState(false);
  const [profileFeedback, setProfileFeedback] = useState({ msg: "", type: "" });

  // Sync profile whenever currentUser changes (e.g. right after login)
  useEffect(() => {
    if (currentUser) {
      setProfile({
        displayName: currentUser.displayName ?? "",
        username:    currentUser.userName    ?? "",
        email:       currentUser.email       ?? "",
      });
      setUsernameEdited(false);
    }
  }, [currentUser]);

  // Password state
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [pwFeedback, setPwFeedback] = useState({ msg: "", type: "" });

  // Dark mode — seeded from: logged-in user preference, then localStorage, then false
  const [darkMode, setDarkMode] = useState(() => {
    if (currentUser?.darkMode !== undefined) return currentUser.darkMode;
    return localStorage.getItem("darkMode") === "true";
  });

  // Apply dark class to <html> whenever darkMode changes
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    // Always keep localStorage in sync (works for guests too)
    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);

  // When the logged-in user object changes (e.g. after login), sync dark mode
  useEffect(() => {
    if (currentUser?.darkMode !== undefined) {
      setDarkMode(currentUser.darkMode);
    }
  }, [currentUser]);

  // Save dark mode preference to backend (logged-in) or just localStorage (guest)
  const handleDarkModeToggle = async (value) => {
    setDarkMode(value);
    if (!isLoggedIn) return; // localStorage already updated by the effect above

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `http://${process.env.REACT_APP_BACKEND_API_ENDPOINT}/auth/profile`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ darkMode: value }),
        }
      );
      if (res.ok && onUserUpdate) {
        const updatedUser = { ...currentUser, darkMode: value };
        onUserUpdate(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    } catch {
      // Silent fail — the UI already toggled, localStorage is updated
    }
  };

  // Logout modal
  const [showLogout, setShowLogout] = useState(false);

  // Modal state
  const [modalFacility, setModalFacility] = useState(null);

  const handleNavClick = (key) => {
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

  // Profile save — calls backend if username was changed
  const handleProfileSave = async () => {
    const newUsername = usernameEdited ? profile.username.trim() : (currentUser?.userName ?? "");

    if (!newUsername) {
      setProfileFeedback({ msg: "Username cannot be empty.", type: "error" });
      return;
    }

    const token = localStorage.getItem("token");
    const endpoint = `http://${process.env.REACT_APP_BACKEND_API_ENDPOINT}/auth/profile`;

    console.log("[ProfileSave] endpoint:", endpoint);
    console.log("[ProfileSave] token:", token ? "present" : "MISSING");
    console.log("[ProfileSave] payload:", { userName: newUsername });

    try {
      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ userName: newUsername }),
      });

      console.log("[ProfileSave] status:", res.status);
      const data = await res.json().catch(() => ({}));
      console.log("[ProfileSave] response body:", data);

      if (res.ok) {
        setProfile(p => ({ ...p, username: newUsername }));
        setUsernameEdited(false);
        setProfileFeedback({ msg: "Profile updated successfully.", type: "success" });
        // Update App-level state and localStorage so refresh doesn't revert
        if (onUserUpdate) {
          const updatedUser = { ...currentUser, userName: newUsername };
          onUserUpdate(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      } else {
        setProfileFeedback({ msg: data.message ?? `Error ${res.status}`, type: "error" });
      }
    } catch (err) {
      console.error("[ProfileSave] fetch error:", err);
      setProfileFeedback({ msg: "Network error. Please try again.", type: "error" });
    }

    setTimeout(() => setProfileFeedback({ msg: "", type: "" }), 3000);
  };

  // Password save — validates locally then calls backend
  const handlePasswordSave = async () => {
    if (!passwords.current) {
      setPwFeedback({ msg: "Please enter your current password.", type: "error" });
      return;
    }
    if (passwords.next.length < 8) {
      setPwFeedback({ msg: "New password must be at least 8 characters.", type: "error" });
      return;
    }
    if (passwords.next !== passwords.confirm) {
      setPwFeedback({ msg: "Passwords do not match.", type: "error" });
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `http://${process.env.REACT_APP_BACKEND_API_ENDPOINT}/auth/password`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword: passwords.current,
            newPassword:     passwords.next,
          }),
        }
      );

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setPasswords({ current: "", next: "", confirm: "" });
        setPwFeedback({ msg: "Password changed successfully.", type: "success" });
      } else {
        setPwFeedback({ msg: data.message ?? `Error ${res.status}`, type: "error" });
      }
    } catch {
      setPwFeedback({ msg: "Network error. Please try again.", type: "error" });
    }

    setTimeout(() => setPwFeedback({ msg: "", type: "" }), 3000);
  };

  return (
    <div className="app-shell">
      <div className="map-full">
        <MapComponent
          center={[7.1907, 125.4553]}
          zoom={12}
          markers={[
            { position: [7.1907, 125.4553], name: "Davao City", popupContent: "<strong>Davao City</strong>" },
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

      {/* ── Side nav ── */}
      <nav className="side-nav">
        <div className="nav-logo">
          <img src={LogoSrc} alt="logo"
            onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "block"; }} />
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
        <button
          className={`nav-item ${activePage === "Settings" ? "active" : ""}`}
          onClick={() => handleNavClick("Settings")} title="Settings">
          <IconSettings />
        </button>
      </nav>

      {/* ── Panel ── */}
      <div className={`panel ${panelOpen ? "open" : ""}`}>
        <div className="panel-inner">

          <div className="panel-header">
            <div className="panel-header-inner">
              <div className="panel-eyebrow">PASYENTE+</div>
              <div className="panel-title">Settings</div>
              <div className="panel-subtitle">Manage your account &amp; preferences</div>
            </div>
            <div className="panel-divider" />
          </div>

          <div className="panel-tabs">
            {["Profile", "Preferences"].map((t) => (
              <button key={t}
                className={`panel-tab ${tab === t ? "active" : ""}`}
                onClick={() => { setTab(t); setShowPasswordForm(false); }}>{t}
              </button>
            ))}
          </div>

          <div className="panel-body">
            <div className="panel-body-inner">

              {/* ── Profile tab ── */}
              {tab === "Profile" && !showPasswordForm && (
                <>
                  <div className="section-block">
                    <div className="section-label">Profile Information</div>

                    {isLoggedIn ? (
                      /* ── Logged-in: full editable profile ── */
                      <>
                        <div className="settings-profile-header">
                          <div className="settings-avatar">{getInitials(profile.username || "?")}</div>
                          <div style={{ flex: 1 }}>
                            <div className="settings-profile-name">{profile.username || "—"}</div>
                            <div className="settings-profile-email">{profile.email}</div>
                          </div>
                          <button
                            className="settings-btn"
                            style={{ width: "auto", border: "1px solid var(--c-border)", whiteSpace: "nowrap" }}
                            onClick={() => { setShowPasswordForm(true); setPwFeedback({ msg: "", type: "" }); setPasswords({ current: "", next: "", confirm: "" }); }}>
                            Change Password
                          </button>
                        </div>

                        <div className="settings-section">
                          <div className="settings-field">
                            <div className="settings-field-label">Username</div>
                            <input
                              type="text"
                              value={profile.username}
                              placeholder={profile.displayName || "Enter your username"}
                              onChange={(e) => {
                                setUsernameEdited(true);
                                setProfile({ ...profile, username: e.target.value });
                              }}
                            />
                          </div>
                          {profileFeedback.msg && (
                            <div className={`settings-feedback show ${profileFeedback.type}`}>
                              {profileFeedback.msg}
                            </div>
                          )}
                          <button className="settings-btn settings-btn-primary" onClick={handleProfileSave}>
                            Save Changes
                          </button>
                        </div>
                      </>
                    ) : (
                      /* ── Guest: read-only placeholder ── */
                      <div className="settings-profile-header">
                        <div className="settings-avatar" style={{ background: "var(--c-text-mute)" }}>G</div>
                        <div style={{ flex: 1 }}>
                          <div className="settings-profile-name">Guest</div>
                          <div className="settings-profile-email">Not signed in</div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="settings-divider" />

                  <div className="section-block">
                    <div className="section-label">Session</div>
                    {isLoggedIn ? (
                      <button className="settings-btn settings-btn-danger" onClick={() => setShowLogout(true)}>
                        Log Out
                      </button>
                    ) : (
                      <button
                        className="settings-btn settings-btn-primary"
                        onClick={() => setActivePage("Auth")}>
                        Log In
                      </button>
                    )}
                  </div>
                </>
              )}

              {/* ── Change Password (inline slide-in) — logged-in only ── */}
              {tab === "Profile" && showPasswordForm && isLoggedIn && (
                <div className="section-block">
                  <button className="settings-back-btn" onClick={() => setShowPasswordForm(false)}>
                    ← Back to Profile
                  </button>
                  <div className="section-label" style={{ marginTop: 10 }}>Change Password</div>
                  <div className="settings-section">
                    <div className="settings-field">
                      <div className="settings-field-label">Current Password</div>
                      <input
                        type="password"
                        value={passwords.current}
                        onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                        placeholder="Enter current password"
                      />
                    </div>
                    <div className="settings-field">
                      <div className="settings-field-label">New Password</div>
                      <input
                        type="password"
                        value={passwords.next}
                        onChange={(e) => setPasswords({ ...passwords, next: e.target.value })}
                        placeholder="At least 8 characters"
                      />
                    </div>
                    <div className="settings-field">
                      <div className="settings-field-label">Confirm New Password</div>
                      <input
                        type="password"
                        value={passwords.confirm}
                        onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                        placeholder="Re-enter new password"
                      />
                    </div>

                    {pwFeedback.msg && (
                      <div className={`settings-feedback show ${pwFeedback.type}`}>
                        {pwFeedback.msg}
                      </div>
                    )}

                    <button className="settings-btn settings-btn-primary" onClick={handlePasswordSave}>
                      Update Password
                    </button>
                  </div>
                </div>
              )}

              {/* ── Preferences tab ── */}
              {tab === "Preferences" && (
                <div className="section-block">
                  <div className="section-label">App Preferences</div>
                  <div className="settings-section">
                    <div className="settings-toggle-row">
                      <div className="settings-toggle-info">
                        <div className="settings-toggle-title">Dark Mode</div>
                        <div className="settings-toggle-desc">
                          {darkMode ? "Dark theme is on" : "Light theme is on"}
                        </div>
                      </div>
                      <label className="toggle-pill">
                        <input
                          type="checkbox"
                          checked={darkMode}
                          onChange={(e) => handleDarkModeToggle(e.target.checked)}
                        />
                        <span className="toggle-track" />
                      </label>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* ── Logout confirmation modal ── */}
      {showLogout && (
        <div className="settings-modal-backdrop" onClick={() => setShowLogout(false)}>
          <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
            <div className="settings-modal-title">Log out of PASYENTE+?</div>
            <div className="settings-modal-body">
              You will be returned to the login screen. Any unsaved changes will be lost.
            </div>
            <div className="settings-modal-actions">
              <button
                className="settings-btn settings-btn-danger"
                style={{ flex: 1 }}
                onClick={() => {
                  setShowLogout(false);
                  document.documentElement.classList.remove("dark");
                  setActivePage("Auth");
                }}>
                Log Out
              </button>
              <button
                className="settings-btn"
                style={{ flex: 1, border: "1px solid var(--c-border)" }}
                onClick={() => setShowLogout(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Facility Details Modal ── */}
      {modalFacility && (
        <FacilityDetailsModal
          facility={modalFacility}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}