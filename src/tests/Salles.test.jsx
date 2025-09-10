// Objectif : Tester la page Salle avec ces composants et vérifier si l'affichage des infos s'adapte en fonction du rôle de l'utilisateur (admin, user, non connecté)


import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Salles from "../pages/Salles";

describe("Composant Salles", () => {
  afterEach(() => cleanup()); 

  test("afficher le bouton d'ajout uniquement pour admin", () => {
    render(
      <MemoryRouter>
        <Salles userRole="user" />
      </MemoryRouter>
    );
    expect(screen.queryByText("+ Ajouter une salle")).toBeNull();

    cleanup();

    render(
      <MemoryRouter>
        <Salles userRole="non-connecté" />
      </MemoryRouter>
    );
    expect(screen.queryByText("+ Ajouter une salle")).toBeNull();

    cleanup();

    render(
      <MemoryRouter>
        <Salles userRole="admin" />
      </MemoryRouter>
    );
    expect(screen.getByText("+ Ajouter une salle")).toBeInTheDocument();
  });

  test("afficher le tableau avec les colonnes correctes selon le rôle", () => {
    // Admin → colonnes w capteurs
    render(
      <MemoryRouter>
        <Salles userRole="admin" />
      </MemoryRouter>
    );
    expect(screen.getByText("Capteurs")).toBeInTheDocument();

    cleanup();

    // User → colonnes w/o capteurs
    render(
      <MemoryRouter>
        <Salles userRole="user" />
      </MemoryRouter>
    );
    expect(screen.queryByText("Capteurs")).toBeNull();
  });

  test("la recherche filtre les salles par nom ou bâtiment", () => {
    render(
      <MemoryRouter>
        <Salles userRole="admin" />
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText(
      "Rechercher une salle ou un bâtiment..."
    );

    // Recherche "Salle 101"
    fireEvent.change(searchInput, { target: { value: "Salle 101" } });
    expect(screen.getByText("Salle 101")).toBeInTheDocument();
    expect(screen.queryByText("Salle 202")).toBeNull();

    // Recherche par bâtiment "B"
    fireEvent.change(searchInput, { target: { value: "B" } });
    expect(screen.getByText("Salle 202")).toBeInTheDocument();
    expect(screen.queryByText("Salle 101")).toBeNull();
  });
});
