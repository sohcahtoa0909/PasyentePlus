import { useState } from "react";
import AboutPage from "./AboutPage";
import HelpPage from "./HelpPage";
import PreferencesPage from "./PreferencesPage";

export default function App() {
  const [activePage, setActivePage] = useState("About");

  const renderPage = () => {
    switch (activePage) {
      case "About": return <AboutPage activePage={activePage} setActivePage={setActivePage} />;
      case "Help":  return <HelpPage  activePage={activePage} setActivePage={setActivePage} />;
      case "Preferences": return <PreferencesPage activePage={activePage} setActivePage={setActivePage} />;
      default:      return <AboutPage activePage={activePage} setActivePage={setActivePage} />;
    }
  };

  return <>{renderPage()}</>;
}