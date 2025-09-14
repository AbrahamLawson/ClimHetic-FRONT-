// Objectif : tester la page Dashboard, StatCards, tableau des alertes + le graphique

import { render, screen } from "@testing-library/react";
import Dashboard from "../pages/Dashboard";
import { vi } from "vitest";
import "@testing-library/jest-dom";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe("Dashboard", () => {
  test("affiche le titre principal", () => {
    render(<Dashboard role="guest" />);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  test("affiche les StatCards de base pour un guest", () => {
    render(<Dashboard role="guest" />);
    // si StatCard "Salles" présent
    expect(screen.getByText("Salles")).toBeInTheDocument();
    // si StatCard "Alertes" NE PAS être présente pour un guest
    expect(screen.queryByText("Alertes")).not.toBeInTheDocument();
  });

  test("n'affiche pas les alertes pour un guest", () => {
    render(<Dashboard role="guest" />);
    expect(screen.queryByText(/température haute/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/humidité critique/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/ventilation faible/i)).not.toBeInTheDocument();
  });

  test("affiche les stats spécifiques à l’admin si role=admin", () => {
    render(<Dashboard role="admin" />);
    expect(screen.getByText("Utilisateurs")).toBeInTheDocument();
    expect(screen.getByText("Capteurs")).toBeInTheDocument();
    expect(screen.getByText("Alertes")).toBeInTheDocument(); 
  });

  test("rend le tableau des salles avec les bonnes colonnes", () => {
    render(<Dashboard role="guest" />);
    const columnHeaders = [
      "ID",
      "Salle",
      "Température (°C)",
      "Humidité (%)",
      "Pression (hPa)",
      "Accéléromètre",
      "Etat",
    ];
    columnHeaders.forEach((header) => {
      expect(screen.getByText(header)).toBeInTheDocument();
    });
  });

  test("affiche le graphique de température", () => {
    render(<Dashboard role="guest" />);
    expect(screen.getByText(/Température moyenne par bâtiment/i)).toBeInTheDocument();
  });
});
