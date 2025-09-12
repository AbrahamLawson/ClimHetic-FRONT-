// Objectif : tester la page Capteurs, filtrage + l'affichage des capteurs dans le tableau

import { render, screen, fireEvent, cleanup, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Capteurs from "../pages/Capteurs";

describe("Page Capteurs", () => {
  afterEach(() => cleanup());

  test("affiche le titre de la page", () => {
    render(
      <MemoryRouter>
        <Capteurs />
      </MemoryRouter>
    );
    expect(screen.getByRole("heading", { name: /Liste de Capteurs/i })).toBeInTheDocument();
  });

test("affiche le nombre correct de capteurs dans la StatCard", () => {
  render(
    <MemoryRouter>
      <Capteurs />
    </MemoryRouter>
  );

  const statCard = screen.getByText("Capteurs").closest(".stat-card");

  const statValue = within(statCard).getByText("3");
  expect(statValue).toBeInTheDocument();
});


  test("affiche les capteurs dans le tableau avec toutes les colonnes", () => {
    render(
      <MemoryRouter>
        <Capteurs />
      </MemoryRouter>
    );

    const table = screen.getByRole("table");

    const headers = within(table).getAllByRole("columnheader");
    const headerTexts = headers.map((h) => h.textContent);

    expect(headerTexts).toContain("ID");
    expect(headerTexts).toContain("Nom du capteur");
    expect(headerTexts).toContain("Bâtiment");
    expect(headerTexts).toContain("Salle");
    expect(headerTexts).toContain("Température (°C)");
    expect(headerTexts).toContain("Humidité (%)");
    expect(headerTexts).toContain("Pression (hPa)");

    const rows = within(table).getAllByRole("row");
    const dataRows = rows.slice(1);

    expect(within(dataRows[0]).getByText("Température Salle 101")).toBeInTheDocument();
    expect(within(dataRows[1]).getByText("Humidité Salle 202")).toBeInTheDocument();
    expect(within(dataRows[2]).getByText("CO2 Salle 202")).toBeInTheDocument();
  });

  test("filtre les capteurs via la barre de recherche", () => {
    render(
      <MemoryRouter>
        <Capteurs />
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText(/Rechercher un capteur ou une salle/i);

    // Recherche "Salle 101"
    fireEvent.change(searchInput, { target: { value: "Salle 101" } });
    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row").slice(1);
    expect(within(rows[0]).getByText("Température Salle 101")).toBeInTheDocument();
    expect(rows.length).toBe(1);

    // Recherche "Salle 202"
    fireEvent.change(searchInput, { target: { value: "Salle 202" } });
    const rows2 = within(table).getAllByRole("row").slice(1);
    const rowTexts = rows2.map(r => r.textContent);
    expect(rowTexts.some(text => text.includes("Humidité Salle 202"))).toBe(true);
    expect(rowTexts.some(text => text.includes("CO2 Salle 202"))).toBe(true);
  });
});