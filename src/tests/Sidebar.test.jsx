// Objectif : Ajouter des tests unitaires pour le composant Sidebar afin de vérifier l'affichage correct des liens de navigation en fonction du rôle de l'utilisateur (non connecté, utilisateur connecté, administrateur)


import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { vi } from "vitest"; 

vi.mock("../contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from "../auth";

describe("Sidebar - affichage selon rôle", () => {
  const renderSidebarWithUser = (user) => {
    useAuth.mockReturnValue({
      user,
      loading: false,
      isAuthenticated: !!user,
    });

    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );
  };

  it("Non connecté: affiche Dashboard, Salles, Ressources", () => {
    renderSidebarWithUser(null);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Salles")).toBeInTheDocument();
    expect(screen.getByText("Ressources")).toBeInTheDocument();

    expect(screen.queryByText("Alertes")).not.toBeInTheDocument();
    expect(screen.queryByText("Capteurs")).not.toBeInTheDocument();
    expect(screen.queryByText("Admin")).not.toBeInTheDocument();
  });

  it("Utilisateur connecté: affiche Dashboard, Salles, Alertes, Ressources", () => {
    renderSidebarWithUser({ role: "user", email: "user@test.com" });
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Salles")).toBeInTheDocument();
    expect(screen.getByText("Alertes")).toBeInTheDocument();
    expect(screen.getByText("Ressources")).toBeInTheDocument();

    expect(screen.queryByText("Capteurs")).not.toBeInTheDocument();
    expect(screen.queryByText("Admin")).not.toBeInTheDocument();
  });

  it("Admin connecté: affiche Dashboard, Salles, Alertes, Capteurs, Admin, Ressources", () => {
    renderSidebarWithUser({ role: "admin", email: "admin@test.com" });
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Salles")).toBeInTheDocument();
    expect(screen.getByText("Alertes")).toBeInTheDocument();
    expect(screen.getByText("Capteurs")).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();
    expect(screen.getByText("Ressources")).toBeInTheDocument();
  });
});