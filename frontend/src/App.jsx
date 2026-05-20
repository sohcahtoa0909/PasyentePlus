import { useState, useEffect } from "react";
import AboutPage from "./AboutPage";
import HelpPage from "./HelpPage";
import PreferencesPage from "./PreferencesPage";
import HomePage from "./HomePage";
import AuthPage from "./AuthPage";
import SettingsPage from "./SettingsPage";

function loadLocationPref(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v !== null ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}

function saveLocationPref(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

export default function App() {
  const [activePage, setActivePage] = useState("Home");
  const [selectedFacility, setSelectedFacility] = useState(null);

  // ── Location state ────────────────────────────────────────────────────────
  const [activeLocation, setActiveLocationState] = useState(() => loadLocationPref("pp_active_location", null));
  const [homeLocation,   setHomeLocationState]   = useState(() => loadLocationPref("pp_home_location",   null));

  function setActiveLocation(loc) {
    setActiveLocationState(loc);
    saveLocationPref("pp_active_location", loc);
  }

  function setHomeLocation(loc) {
    setHomeLocationState(loc);
    saveLocationPref("pp_home_location", loc);
  }

  // ── Auth state ────────────────────────────────────────────────────────────
  const [isLoggedIn,  setIsLoggedIn]  = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  // currentUser shape: { displayName, username, email, token }

  // On mount: restore session and dark mode before first render
  useEffect(() => {
    // Apply dark mode immediately so there's no flash of light mode
    const savedDark = localStorage.getItem("darkMode") === "true";
    if (savedDark) document.documentElement.classList.add("dark");

    const savedToken = localStorage.getItem("token");
    const savedUser  = localStorage.getItem("user");
    if (savedToken && savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setIsLoggedIn(true);
        setCurrentUser(user);
        // User's saved preference overrides localStorage
        if (user.darkMode !== undefined) {
          document.documentElement.classList.toggle("dark", user.darkMode);
        }
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, []);

  /** Called by AuthPage after a successful login response */
  function handleLoginSuccess(user) {
    setIsLoggedIn(true);
    setCurrentUser(user);
    localStorage.setItem("token", user.token);
    localStorage.setItem("user",  JSON.stringify(user));
    setActivePage("Home");
  }

  /** Called by SettingsPage when the user saves profile changes */
  function handleUserUpdate(updatedUser) {
    setCurrentUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  }

  /** Wraps setActivePage — intercepts "Auth" when logged in to mean Log Out */
  function handleSetActivePage(page) {
    if (page === "Auth" && isLoggedIn) {
      // Logging out — clear everything then send to Home as guest
      setIsLoggedIn(false);
      setCurrentUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("darkMode");
      document.documentElement.classList.remove("dark");
      setActivePage("Home");
    } else {
      setActivePage(page);
    }
  }

  // ── Page rendering ────────────────────────────────────────────────────────
  const renderPage = () => {
    switch (activePage) {
      case "Home":
        return (
          <HomePage
            activePage={activePage}
            setActivePage={handleSetActivePage}
            selectedFacility={selectedFacility}
            onFacilitySelect={setSelectedFacility}
            activeLocation={activeLocation}
          />
        );
      case "About":
        return (
          <AboutPage
            activePage={activePage}
            setActivePage={handleSetActivePage}
            selectedFacility={selectedFacility}
            onFacilitySelect={setSelectedFacility}
          />
        );
      case "Help":
        return (
          <HelpPage
            activePage={activePage}
            setActivePage={handleSetActivePage}
            selectedFacility={selectedFacility}
            onFacilitySelect={setSelectedFacility}
          />
        );
      case "Preferences":
        return (
          <PreferencesPage
            activePage={activePage}
            setActivePage={handleSetActivePage}
            selectedFacility={selectedFacility}
            onFacilitySelect={setSelectedFacility}
            isLoggedIn={isLoggedIn}
            currentUser={currentUser}
            activeLocation={activeLocation}
            homeLocation={homeLocation}
            setActiveLocation={setActiveLocation}
            setHomeLocation={setHomeLocation}
          />
        );
      case "Auth":
        return (
          <AuthPage
            activePage={activePage}
            setActivePage={handleSetActivePage}
            onLoginSuccess={handleLoginSuccess}
          />
        );
      case "Settings":
        return (
          <SettingsPage
            activePage={activePage}
            setActivePage={handleSetActivePage}
            selectedFacility={selectedFacility}
            onFacilitySelect={setSelectedFacility}
            isLoggedIn={isLoggedIn}
            currentUser={currentUser}
            onUserUpdate={handleUserUpdate}
          />
        );
      default:
        return (
          <AboutPage
            activePage={activePage}
            setActivePage={handleSetActivePage}
            selectedFacility={selectedFacility}
            onFacilitySelect={setSelectedFacility}
          />
        );
    }
  };

  return <>{renderPage()}</>;
}