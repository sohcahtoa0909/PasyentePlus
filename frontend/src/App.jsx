import { useState } from "react";
import AboutPage from "./AboutPage";
import HelpPage from "./HelpPage";
import PreferencesPage from "./PreferencesPage";
import HomePage from "./HomePage";
import AuthPage from "./AuthPage";
import SettingsPage from "./SettingsPage";

export default function App() {
  const [activePage, setActivePage] = useState("Home");
  const [selectedFacility, setSelectedFacility] = useState(null); // ← moved inside

  const renderPage = () => {
    switch (activePage) {
      case "Home":
        return (
          <HomePage
            activePage={activePage}
            setActivePage={setActivePage}
            selectedFacility={selectedFacility}
            onFacilitySelect={setSelectedFacility}
          />
        );
      case "About":
        return (
          <AboutPage
            activePage={activePage}
            setActivePage={setActivePage}
            selectedFacility={selectedFacility}
            onFacilitySelect={setSelectedFacility}
          />
        );
      case "Help":
        return (
          <HelpPage
            activePage={activePage}
            setActivePage={setActivePage}
            selectedFacility={selectedFacility}
            onFacilitySelect={setSelectedFacility}
          />
        );
      case "Preferences":
        return (
          <PreferencesPage
            activePage={activePage}
            setActivePage={setActivePage}
            selectedFacility={selectedFacility}
            onFacilitySelect={setSelectedFacility}
          />
        );
      case "Auth":
        return (
          <AuthPage
            activePage={activePage}
            setActivePage={setActivePage}
          />
        );
      case "Settings":
        return (
          <SettingsPage
            activePage={activePage}
            setActivePage={setActivePage}
          />
        );
      default:
        return (
          <AboutPage
            activePage={activePage}
            setActivePage={setActivePage}
            selectedFacility={selectedFacility}
            onFacilitySelect={setSelectedFacility}
          />
        );
    }
  };

  return <>{renderPage()}</>;
}