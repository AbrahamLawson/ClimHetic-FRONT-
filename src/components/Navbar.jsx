import { Link } from "react-router-dom";
import { useAuth, logout } from "../auth";
import { User, LogOut } from "lucide-react";
import { useContext } from "react";
import { PreferencesContext } from "../contexts/PreferencesContext";

export default function Navbar() {
  const { user } = useAuth();
  const { darkMode, highContrast } = useContext(PreferencesContext);

  const handleLogout = async () => {
    await logout();
  };

  const isLoggedIn = !!user;

  const logoSrc = highContrast
    ? "/assets/climhetic-complet_high-contrast.png"
    : darkMode
    ? "/assets/climhetic-complet_dark-mode.png"
    : "/assets/climhetic-complet.png";

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img
            src={logoSrc}
            alt="Clim'Hetic logo"
            className="logo-img"
          />
        </Link>
      </div>

      <div className="navbar-cta">
        {isLoggedIn ? (
          <>
            <span className="user-chip">
              <span className="user-icon">
                <User size={16} aria-hidden="true" />
              </span>
              <span className="user-chip-email">{user?.email}</span>
            </span>
            <button onClick={handleLogout} className="logout-button">
              <LogOut size={16} aria-hidden="true" />
              <span>Déconnexion</span>
            </button>
          </>
        ) : (
          <Link to="/login">Connexion</Link>
        )}
      </div>
    </nav>
  );
}
