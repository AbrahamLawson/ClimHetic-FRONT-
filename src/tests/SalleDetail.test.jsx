// Objectif : Tester le rendu de la page SalleDetail + présence des éléments clés

import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import SalleDetail from "../pages/SalleDetail";

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserver;


const renderWithRouter = (id) => {
  render(
    <MemoryRouter initialEntries={[`/salles/${id}`]}>
      <Routes>
        <Route path="/salles/:id" element={<SalleDetail />} />
      </Routes>
    </MemoryRouter>
  );
};

describe("Page SalleDetail", () => {
  beforeEach(() => {
    renderWithRouter("101"); 
  });

  test("affiche le titre de la page", () => {
    expect(screen.getByText(/Détails de la salle/i)).toBeInTheDocument();
  });

  test("affiche les informations de la salle", () => {
    expect(screen.getByText(/Salle 101/i)).toBeInTheDocument();

    expect(screen.getByText(/Bâtiment A/i)).toBeInTheDocument();

    expect(screen.getByText(/Confortable/i)).toBeInTheDocument();
  });

  test("affiche les trois graphiques", () => {
    const graphs = screen.getByTestId("chart-container");
    expect(graphs.children.length).toBe(3);
  });
});
