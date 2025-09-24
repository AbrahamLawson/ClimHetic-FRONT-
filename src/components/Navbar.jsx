import { Link } from "react-router-dom";
import { useAuth, logout } from "../auth";
import { User, LogOut, Menu } from "lucide-react";
import { useContext, useState } from "react";
import { PreferencesContext } from "../contexts/PreferencesContext";
import Sidebar from "./Sidebar";

export default function Navbar() {
  const { user } = useAuth();
  const { darkMode, highContrast } = useContext(PreferencesContext);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const isLoggedIn = !!user;

  function getLogo(darkMode, highContrast) {
    if (darkMode) return "/assets/climhetic-complet_dark-mode.png";
    if (highContrast) return "/assets/climhetic-complet_high-contrast.png";
    return "/assets/climhetic-complet.png";
  }

  const logoSrc = getLogo(darkMode, highContrast);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <button
            className="burger-button"
            onClick={() => setSidebarOpen(!isSidebarOpen)}
          >
            <Menu size={22} />
          </button>

          <div className="navbar-logo">
            <Link to="/">
              <img src={logoSrc} alt="Clim'Hetic logo" className="logo-img" />
            </Link>
          </div>
        </div>

        <div className="navbar-cta">
          {isLoggedIn ? (
            <>
              <span className="user-chip desktop-only">
                <span className="user-icon">
                  <User size={16} aria-hidden="true" />
                </span>
                <span className="user-chip-email">{user?.email}</span>
              </span>
              <button onClick={handleLogout} className="logout-button">
                <LogOut size={16} aria-hidden="true" />
                <span className="button-text">Déconnexion</span>
              </button>
            </>
          ) : (
            <Link to="/login" className="login-button btn">Connexion</Link>
          )}
        </div>
      </nav>

      {isSidebarOpen && (
        <div
          className="mobile-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="mobile-sidebar" onClick={(e) => e.stopPropagation()}>
            <Sidebar
              isMobile
              isLoggedIn={isLoggedIn}
              user={user}
              handleLogout={handleLogout}
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
