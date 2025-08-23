import { Outlet, Link } from "react-router-dom";

export default function DefaultLayout() {
  return (
    <div>
      <header style={{ padding: "1rem", background: "#f4f4f4" }}>
        <nav>
          <Link to="/dashboard">Dashboard</Link> |{" "}
          <Link to="/salles">Salles</Link> |{" "}
          <Link to="/alertes">Alertes</Link>
        </nav>
      </header>
      <main style={{ padding: "1rem" }}>
        <Outlet />
      </main>
    </div>
  );
}
