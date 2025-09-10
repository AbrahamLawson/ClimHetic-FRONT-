// export default function Salles() {
//   return <h1>Salles</h1>;
// }

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Tableau from "../components/Tableau";
import FormModal from "../components/form/FormModal";
import Filter from "../components/Filter";
import Searchbar from "../components/Searchbar";
import "../styles/searchbar.css";

export default function Salles({ userRole }) {
  // userRole peut être "admin", "user" ou "non-connecté"
  const navigate = useNavigate();

  // Colonnes pour les admins (+ capteurs)
  const adminColumns = [
    { key: "id", label: "ID" },
    { key: "nom", label: "Salle" },
    { key: "batiment", label: "Bâtiment" },
    { key: "capteurs", label: "Capteurs" },
    { key: "temperature", label: "Température (°C)" },
    { key: "humidite", label: "Humidité (%)" },
    { key: "pression", label: "Pression (hPa)" },
    { key: "etat", label: "Statut", type: "status" },
  ];

  // Colonnes pour user et non-connecté (sans capteurs)
  const userColumns = [
    { key: "id", label: "ID" },
    { key: "nom", label: "Salle" },
    { key: "batiment", label: "Bâtiment" },
    { key: "temperature", label: "Température (°C)" },
    { key: "humidite", label: "Humidité (%)" },
    { key: "pression", label: "Pression (hPa)" },
    { key: "etat", label: "Statut", type: "status" },
  ];

  // Fausses datas des salles à changer avec elle dispo dans la bdd
  const [salles, setSalles] = useState([
    {
      id: 1,
      nom: "Salle 101",
      batiment: "A",
      capteurs: ["Capteur Temp", "Capteur Humidité"],
      temperature: 22,
      humidite: 45,
      pression: 1015,
      etat: "Success",
    },
    {
      id: 2,
      nom: "Salle 202",
      batiment: "B",
      capteurs: ["Capteur Temp", "Capteur CO2"],
      temperature: 28,
      humidite: 60,
      pression: 1012,
      etat: "Warning",
    },
  ]);

  // Champs du formulaire pour add une nouvelle salle (voir ce qu'on inscrit dedans pour le back)
  const fields = [
    {
      name: "nom",
      label: "Nom de la salle",
      type: "text",
      placeholder: "Ex: Salle 404",
    },
    {
      name: "batiment",
      label: "Bâtiment",
      type: "text",
      placeholder: "Ex: A, B, C",
    },
    {
      name: "capteurs",
      label: "Capteurs",
      type: "array",
      placeholder: "Nom du capteur",
    },
  ];

  const handleAddSalle = (values) => {
    // A FAIRE: Envoyer la nouvelle salle au back quand on en add une (juste local pour l'instant)
    const newSalle = {
      id: salles.length + 1,
      ...values,
      etat: "Success",
    };
    setSalles([...salles, newSalle]);
  };

  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState("");


  // Filtre à changer si nécessaire avec sous catégories
  const categories = [
    {
      title: "Bâtiment",
      options: [
        { label: "A", value: "A" },
        { label: "B", value: "B" },
        { label: "C", value: "C" },
      ],
    },
    {
      title: "Statut",
      options: [
        { label: "Confortable", value: "Success" },
        { label: "Attention", value: "Warning" },
        { label: "Danger", value: "Danger" },
      ],
    },
    {
      title: "Température",
      options: [
        { label: "< 20°C", value: "low" },
        { label: "20-25°C", value: "normal" },
        { label: "> 25°C", value: "high" },
      ],
    },
  ];

  const sallesFiltrees = useMemo(() => {
    return salles.filter((salle) => {
      const matchSearch =
        salle.nom.toLowerCase().includes(search.toLowerCase()) ||
        salle.batiment.toLowerCase().includes(search.toLowerCase());

      const matchBatiment =
        !filters["Bâtiment"] || filters["Bâtiment"].length === 0
          ? true
          : filters["Bâtiment"].includes(salle.batiment);

      const matchEtat =
        !filters["Statut"] || filters["Statut"].length === 0
          ? true
          : filters["Statut"].includes(salle.etat);

      const matchTemp =
        !filters["Température"] || filters["Température"].length === 0
          ? true
          : filters["Température"].some((filter) => {
              if (filter === "low") return salle.temperature < 20;
              if (filter === "normal")
                return salle.temperature >= 20 && salle.temperature <= 25;
              if (filter === "high") return salle.temperature > 25;
              return true;
            });

      return matchSearch && matchBatiment && matchEtat && matchTemp;
    });
  }, [salles, search, filters]);

  return (
    <div className="page-container">
      {userRole === "admin" && (
        <FormModal
          ctaLabel="+ Ajouter une salle"
          fields={fields}
          onSubmit={handleAddSalle}
          title="Ajouter une salle"
          submitLabel="Créer"
          icon="circle-gauge"
        />
      )}

      <div className="search-wrapper" style={{ marginTop: "1.5rem" }}>
        <Searchbar
          placeholder="Rechercher une salle ou un bâtiment..."
          value={search}
          onChange={setSearch}
        />
      </div>

      <div style={{ marginTop: "1.5rem" }}>
        <Filter categories={categories} onChange={setFilters} />
      </div>

      <div className="table-container" style={{ marginTop: "2rem" }}>
        <Tableau
          columns={userRole === "admin" ? adminColumns : userColumns}
          data={sallesFiltrees}
          onRowClick={(salle) => {
            // A FAIRE: Recup infos de la salle via l'id après avoir click sur la ligne d'une salle
            navigate(`/salles/${salle.id}`);
          }}
        />
      </div>
    </div>
  );
}