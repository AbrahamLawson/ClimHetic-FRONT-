import { NavLink } from "react-router-dom";
import { useAuth } from "../auth";
import {LayoutDashboard, HouseWifi, Siren, UserStar, BookOpenText, CircleGauge, Settings} from "lucide-react";

export default function Sidebar() {
  const { isAdmin } = useAuth();

  const publicLinks = [
    { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { to: "/salles", label: "Salles", icon: <HouseWifi size={18} /> },
  ];

  const adminLinks = [
    { to: "/alertes", label: "Alertes", icon: <Siren size={18} /> },
    { to: "/capteurs", label: "Capteurs", icon: <CircleGauge size={18} /> },
    {to: "parametres", label: "Paramètres", icon: <Settings size={18} /> },
    { to: "/admin", label: "Admin", icon: <UserStar size={18} /> },
  ];

  const otherLinks = [
    { to: "/ressources", label: "Ressources", icon: <BookOpenText size={18} /> },
  ];

  const renderLinks = (links) =>
    links.map((link) => (
      <NavLink
        key={link.to}
        to={link.to}
        className={({ isActive }) => (isActive ? "active-link" : "")}
        tabIndex={0}
      >
        <span className="sidebar-icon">{link.icon}</span>
        <span>{link.label}</span>
      </NavLink>
    ));

  return (
    <aside className="sidebar">
      <nav className="sidebar-links" role="navigation" aria-label="Entrées principales">
        {renderLinks(publicLinks)}
        {isAdmin && <hr className="sidebar-separator" />}
        {isAdmin && renderLinks(adminLinks)}
        
        <hr className="sidebar-separator" />
        {renderLinks(otherLinks)}
      </nav>
    </aside>
  );
}