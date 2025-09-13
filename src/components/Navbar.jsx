import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { logout } from "../services/auth";
import { User, LogOut } from "lucide-react";

export default function Navbar() {
  const { user } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const isLoggedIn = !!user;

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img
            src="/assets/climhetic-complet.png"
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
