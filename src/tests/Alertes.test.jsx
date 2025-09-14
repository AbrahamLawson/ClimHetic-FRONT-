// Objectif : tester la page Alertes, stat card + le tableau des alertes avec filtre et modale

import { render, screen, fireEvent } from "@testing-library/react";
import Alertes from "../pages/Alertes";

describe("Page Alertes", () => {
  test("affiche le titre et la stat card", () => {
  render(<Alertes />);

  expect(screen.getByRole("heading", { level: 1, name: "Alertes" })).toBeInTheDocument();
  expect(screen.getByText("3")).toBeInTheDocument();
  expect(screen.getByText("Alertes", { selector: ".stat-label" })).toBeInTheDocument();
});


  test("affiche la liste complète des alertes au chargement", () => {
    render(<Alertes />);

    expect(screen.getByText("Salle 101")).toBeInTheDocument();
    expect(screen.getByText("Salle 202")).toBeInTheDocument();
    expect(screen.getByText("Salle 303")).toBeInTheDocument();
  });

  test("filtre par état Danger", () => {
    render(<Alertes />);

    fireEvent.click(screen.getByText("État"));
    fireEvent.click(screen.getByLabelText("Danger"));

    // seule Salle 202 doit rester
    expect(screen.getByText("Salle 202")).toBeInTheDocument();
    expect(screen.queryByText("Salle 101")).not.toBeInTheDocument();
    expect(screen.queryByText("Salle 303")).not.toBeInTheDocument();
  });

  test("filtre par état Warning", () => {
    render(<Alertes />);

    fireEvent.click(screen.getByText("État"));
    fireEvent.click(screen.getByLabelText("Attention"));

    // seules Salle 101 et Salle 303 doivent rester
    expect(screen.getByText("Salle 101")).toBeInTheDocument();
    expect(screen.getByText("Salle 303")).toBeInTheDocument();
    expect(screen.queryByText("Salle 202")).not.toBeInTheDocument();
  });

  test("réinitialise le filtre", () => {
    render(<Alertes />);

    fireEvent.click(screen.getByText("État"));
    fireEvent.click(screen.getByLabelText("Danger"));

    // seule Salle 202 reste
    expect(screen.getByText("Salle 202")).toBeInTheDocument();
    expect(screen.queryByText("Salle 101")).not.toBeInTheDocument();
    expect(screen.queryByText("Salle 303")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Réinitialiser"));

    // toutes les salles reviennent
    expect(screen.getByText("Salle 101")).toBeInTheDocument();
    expect(screen.getByText("Salle 202")).toBeInTheDocument();
    expect(screen.getByText("Salle 303")).toBeInTheDocument();
  });

  test("ouvre et ferme la modal d’une alerte", () => {
    render(<Alertes />);

    fireEvent.click(screen.getByText("Salle 101"));

    expect(screen.getByText("Éteignez le chauffage et ouvrez les fenêtres")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Fermer"));
    expect(screen.queryByText("Éteignez le chauffage et ouvrez les fenêtres")).not.toBeInTheDocument();
  });
});
