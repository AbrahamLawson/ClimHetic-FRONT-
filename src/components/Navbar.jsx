import { Link } from "react-router-dom";
import { logout } from "../services/auth";

export default function Navbar({ isLoggedIn = false, user = null }) {
  const handleLogout = async () => {
    await logout();
  };

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
            <span className="user-email">{user?.email}</span>
            <button onClick={handleLogout} className="logout-button">
              Déconnexion
            </button>
          </>
        ) : (
          <Link to="/login">Connexion</Link>
        )}
      </div>
    </nav>
  );
}
