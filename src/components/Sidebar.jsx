import { NavLink } from "react-router-dom";

export default function Sidebar({ isLoggedIn = false, isAdmin = false }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-links">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? "active-link" : ""}>
          Dashboard
        </NavLink>
        <NavLink to="/salles" className={({ isActive }) => isActive ? "active-link" : ""}>
          Salles
        </NavLink>
        <NavLink to="/alertes" className={({ isActive }) => isActive ? "active-link" : ""}>
          Alertes
        </NavLink>

        {isAdmin && isLoggedIn && (
          <NavLink to="/admin" className={({ isActive }) => isActive ? "active-link" : ""}>
            Admin
          </NavLink>
        )}
        <div className="sidebar-separator"></div>

        <NavLink to="/ressources" className={({ isActive }) => isActive ? "active-link" : ""}>
          Ressources
        </NavLink>

      </div>
    </aside>
  );
}
