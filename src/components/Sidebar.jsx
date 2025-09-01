import { NavLink } from "react-router-dom";
import { LayoutDashboard, HouseWifi, Siren, UserStar, BookOpenText } from "lucide-react";

export default function Sidebar({ isLoggedIn = false, isAdmin = false }) {
  const links = [
    { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { to: "/salles", label: "Salles", icon: <HouseWifi size={18} /> },
    { to: "/alertes", label: "Alertes", icon: <Siren size={18} /> },
    ...(isAdmin && isLoggedIn ? [{ to: "/admin", label: "Admin", icon: <UserStar size={18} /> }] : []),
    { separator: true },
    { to: "/ressources", label: "Ressources", icon: <BookOpenText size={18} /> },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-links">
        {links.map((link, idx) =>
          link.separator ? (
            <div key={idx} className="sidebar-separator" />
          ) : (
            <NavLink
              key={idx}
              to={link.to}
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              <span className="sidebar-icon">{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          )
        )}
      </div>
    </aside>
  );
}