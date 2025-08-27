import { Link } from "react-router-dom";

export default function Navbar({ isLoggedIn = false }) {
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
            <Link to="/profil">Profil</Link>
            <Link to="/logout">Déconnexion</Link>
          </>
        ) : (
          <Link to="/login">Connexion</Link>
        )}
      </div>
    </nav>
  );
}
