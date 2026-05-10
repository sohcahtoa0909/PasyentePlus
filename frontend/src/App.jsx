import { useState } from "react";
import AboutPage from "./AboutPage";
import HelpPage from "./HelpPage";
import PreferencesPage from "./PreferencesPage";
import HomePage from "./HomePage";
import AuthPage from "./AuthPage";

export default function App() {
  const [activePage, setActivePage] = useState("Home");

  const renderPage = () => {
    switch (activePage) {
      case "Home":        return <HomePage        activePage={activePage} setActivePage={setActivePage} />;
      case "About": return <AboutPage activePage={activePage} setActivePage={setActivePage} />;
      case "Help":  return <HelpPage  activePage={activePage} setActivePage={setActivePage} />;
      case "Preferences": return <PreferencesPage activePage={activePage} setActivePage={setActivePage} />;
      case "Auth": return <AuthPage activePage={activePage} setActivePage={setActivePage} />;
      default:      return <AboutPage activePage={activePage} setActivePage={setActivePage} />;
    }
  };

  return <>{renderPage()}</>;
}