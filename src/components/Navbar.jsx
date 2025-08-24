import { Link } from "react-router-dom";

export default function Navbar({ isLoggedIn = false, isAdmin = false }) {
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

      <div className="navbar-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/salles">Salles</Link>
        <Link to="/alertes">Alertes</Link>
        <Link to="/ressources">Ressources</Link>
        {isAdmin && isLoggedIn && <Link to="/admin">Admin</Link>}
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
