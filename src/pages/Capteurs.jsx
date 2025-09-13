// export default function Capteurs() {
//   return <h1>Capteurs</h1>;
// }

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Tableau from "../components/Tableau";
import FormModal from "../components/form/FormModal";
import Filter from "../components/Filter";
import Searchbar from "../components/Searchbar";
import StatCard from "../components/StatCard";
import "../styles/searchbar.css";
import "../styles/salle.css";

export default function Capteurs() {
  const navigate = useNavigate();

  // Infos tableau à adapter en fonction de la BDD
  const columns = [
    { key: "id", label: "ID" },
    { key: "nom", label: "Nom du capteur" },
    { key: "batiment", label: "Bâtiment" },
    { key: "salle", label: "Salle" },
    { key: "temperature", label: "Température (°C)" },
    { key: "humidite", label: "Humidité (%)" },
    { key: "pression", label: "Pression (hPa)" },
  ];

  // Fake données des capteurs à remplacer avec celle dispo dans la bdd
  const [capteurs, setCapteurs] = useState([
    { id: 1, nom: "Température Salle 101", batiment: "A", salle: "Salle 101", temperature: 22, humidite: 50, pression: 3040, etat: "Success" },
    { id: 2, nom: "Humidité Salle 202", batiment: "B", salle: "Salle 202", temperature: 22, humidite: 50, pression: 3040, etat: "Warning" },
    { id: 3, nom: "CO2 Salle 202", batiment: "A", salle: "Salle 202", temperature: 22, humidite: 50, pression: 3040, etat: "Danger" },
  ]);

  // Champs du formulaire d'ajout de capteur
  const fields = [
    { name: "nom", label: "Nom du capteur", type: "text", placeholder: "Ex: Température Salle 101" },
    { name: "salle", label: "Salle associée", type: "text", placeholder: "Ex: Salle 101" },
  ];

  const handleAddCapteur = (values) => {
    const newCapteur = { id: capteurs.length + 1, ...values, etat: "Success" };
    setCapteurs([...capteurs, newCapteur]);
  };

  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState("");

  const categories = [
    {
      title: "Bâtiment",
      options: [
        { label: "A", value: "A" },
        { label: "B", value: "B" },
        { label: "C", value: "C" },
      ],
    },
  ];

  const capteursFiltres = useMemo(() => {
    return capteurs.filter((capteur) => {
      const matchSearch =
        capteur.nom.toLowerCase().includes(search.toLowerCase()) ||
        capteur.salle.toLowerCase().includes(search.toLowerCase());

      const matchType =
        !filters["Type"] || filters["Type"].length === 0
          ? true
          : filters["Type"].includes(capteur.type);

      const matchEtat =
        !filters["Statut"] || filters["Statut"].length === 0
          ? true
          : filters["Statut"].includes(capteur.etat);

      return matchSearch && matchType && matchEtat;
    });
  }, [capteurs, search, filters]);

  return (
    <div className="page-container page-wrapper">
      <h1 className="salle-title">Liste de Capteurs</h1>
      {/* A FAIRE : changer la value de statcard pour mettre le nb exact de capteur */}
      <div className="infos-pages">
      <StatCard value={capteurs.length} label="Capteurs" icon="circle-gauge" />

      <FormModal
        ctaLabel="+ Ajouter un capteur"
        fields={fields}
        onSubmit={handleAddCapteur}
        title="Ajouter un capteur"
        submitLabel="Créer"
        icon="circle-gauge"
      />
</div>
      <div className="search-wrapper" style={{ marginTop: "1.5rem" }}>
        <Searchbar placeholder="Rechercher un capteur ou une salle..." value={search} onChange={setSearch} />
      </div>

      <div className="filter-sticky">
        <Filter categories={categories} onChange={setFilters} />
      </div>

      <div className="table-container" style={{ marginTop: "2rem" }}>
        <Tableau columns={columns} data={capteursFiltres} />
      </div>
    </div>
  );
}