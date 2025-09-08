import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {LayoutDashboard, HouseWifi, Siren, UserStar, BookOpenText, CircleGauge,} from "lucide-react";

export default function Sidebar() {
  const { user } = useAuth();
  const role = user?.role;
  const isLoggedIn = !!user;
  const isAdmin = role === "admin";

  const baseLinks = [
    { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { to: "/salles", label: "Salles", icon: <HouseWifi size={18} /> },
  ];

  const userLinks = [
    { to: "/alertes", label: "Alertes", icon: <Siren size={18} /> },
  ];

  const adminLinks = [
    { to: "/alertes", label: "Alertes", icon: <Siren size={18} /> },
    { to: "/capteurs", label: "Capteurs", icon: <CircleGauge size={18} /> },
    { to: "/admin", label: "Admin", icon: <UserStar size={18} /> },
  ];

  const links = [
    ...baseLinks,
    ...(isAdmin ? adminLinks : isLoggedIn ? userLinks : []),
    { to: "/ressources", label: "Ressources", icon: <BookOpenText size={18} /> },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-links">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            <span className="sidebar-icon">{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </div>
    </aside>
  );
}