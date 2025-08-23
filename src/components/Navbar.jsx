import { Link } from "react-router-dom";

export default function Navbar({ isLoggedIn = false, isAdmin = false }) {
  return (
    <nav style={{ padding: "1rem", background: "#f4f4f4" }}>
      <Link to="/dashboard">Dashboard</Link> |{" "}
      <Link to="/salles">Salles</Link> |{" "}
      <Link to="/alertes">Alertes</Link> |{" "}
      <Link to="/ressources">Ressources</Link>

      {isLoggedIn ? (
        <>
          {" | "}
          {isAdmin && <Link to="/admin">Admin</Link>}
          {" | "}
          <Link to="/profil">Profil</Link> |{" "}
          <Link to="/logout">Déconnexion</Link>
        </>
      ) : (
        <>
          {" | "}
          <Link to="/login">Login</Link>
        </>
      )}
    </nav>
  );
}
