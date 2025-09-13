// Objectif : Tester la page Admin pour s'assurer que les fonctionnalités principales fonctionnent correctement

import { render, screen, fireEvent, cleanup, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Admin from "../pages/Admin";

describe("Page Admin", () => {
  afterEach(() => cleanup());

  test("affiche le titre de la page", () => {
    render(
      <MemoryRouter>
        <Admin />
      </MemoryRouter>
    );
    expect(screen.getByRole("heading", { name: /Gestion des utilisateurs/i })).toBeInTheDocument();
  });

  test("affiche le nombre correct d'utilisateurs dans la StatCard", () => {
    render(
      <MemoryRouter>
        <Admin />
      </MemoryRouter>
    );

    const statCard = screen.getByText("Utilisateurs").closest(".stat-card");
    const statValue = within(statCard).getByText("5");
    expect(statValue).toBeInTheDocument();
  });

  test("affiche les utilisateurs dans le tableau avec toutes les colonnes", () => {
    render(
      <MemoryRouter>
        <Admin />
      </MemoryRouter>
    );

    const table = screen.getByRole("table");

    const headers = within(table).getAllByRole("columnheader");
    const headerTexts = headers.map((h) => h.textContent);

    expect(headerTexts).toContain("ID");
    expect(headerTexts).toContain("Nom");
    expect(headerTexts).toContain("Email");
    expect(headerTexts).toContain("Rôle");

    const rows = within(table).getAllByRole("row").slice(1);

    expect(within(rows[0]).getByText("Sira")).toBeInTheDocument();
    expect(within(rows[1]).getByText("Luka")).toBeInTheDocument();
    expect(within(rows[2]).getByText("Leo")).toBeInTheDocument();
    expect(within(rows[3]).getByText("Hemmy")).toBeInTheDocument();
    expect(within(rows[4]).getByText("Abraham")).toBeInTheDocument();
  });

  test("filtre les utilisateurs via la barre de recherche", () => {
    render(
      <MemoryRouter>
        <Admin />
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText(/Rechercher un utilisateur ou un email/i);

    // Recherche "Sira"
    fireEvent.change(searchInput, { target: { value: "Sira" } });
    let table = screen.getByRole("table");
    let rows = within(table).getAllByRole("row").slice(1);
    expect(within(rows[0]).getByText("Sira")).toBeInTheDocument();
    expect(rows.length).toBe(1);

    // Recherche "luka@climhetic.fr"
    fireEvent.change(searchInput, { target: { value: "luka@climhetic.fr" } });
    table = screen.getByRole("table");
    rows = within(table).getAllByRole("row").slice(1);
    expect(within(rows[0]).getByText("Luka")).toBeInTheDocument();
    expect(rows.length).toBe(1);
  });
});
