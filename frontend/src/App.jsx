import { useState } from "react";
import AboutPage from "./AboutPage";
import HelpPage from "./HelpPage";
import PreferencesPage from "./PreferencesPage";
import HomePage from "./HomePage";
import AuthPage from "./AuthPage";
import SettingsPage from "./SettingsPage";
import FacilityDetails from "./FacilityDetailsPage";

export default function App() {
  const [activePage, setActivePage] = useState("Auth");
  const [selectedFacilityData, setSelectedFacilityData] = useState(null);

  const handleSetActivePage = (page) => setActivePage(page);

  const renderPage = () => {
    switch (activePage) {
      case "Home":
        return (
          <HomePage
            activePage={activePage}
            setActivePage={handleSetActivePage}
            selectedFacilityData={selectedFacilityData}
            setSelectedFacilityData={setSelectedFacilityData}
          />
        );
      case "About":
        return <AboutPage activePage={activePage} setActivePage={handleSetActivePage} />;
      case "Help":
        return <HelpPage activePage={activePage} setActivePage={handleSetActivePage} />;
      case "Preferences":
        return <PreferencesPage activePage={activePage} setActivePage={handleSetActivePage} />;
      case "Auth":
        return <AuthPage activePage={activePage} setActivePage={handleSetActivePage} />;
      case "Settings":
        return <SettingsPage activePage={activePage} setActivePage={handleSetActivePage} />;
      default:
        return <AboutPage activePage={activePage} setActivePage={handleSetActivePage} />;
    }
  };

  if (activePage === "FacilityDetails") {
    return (
      <>
        <HomePage
          activePage={activePage}
          setActivePage={handleSetActivePage}
          selectedFacilityData={selectedFacilityData}
          setSelectedFacilityData={setSelectedFacilityData}
        />
        <FacilityDetails
          facility={selectedFacilityData}
          setActivePage={handleSetActivePage}
          overlay
        />
      </>
    );
  }

  return <>{renderPage()}</>;
}