// export default function Capteurs() {
//   return <h1>Capteurs</h1>;
// }

import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Tableau from "../components/Tableau";
import FormModal from "../components/form/FormModal";
import Filter from "../components/Filter";
import Searchbar from "../components/Searchbar";
import StatCard from "../components/StatCard";
import capteurService from "../services/capteurService";
import "../styles/searchbar.css";
import "../styles/salle.css";

export default function Capteurs() {
  const navigate = useNavigate();

  // Infos tableau pour affichage des capteurs
  const columns = [
    { key: "id", label: "ID" },
    { key: "nom", label: "Nom du capteur" },
    { key: "type_capteur", label: "Type" },
    { key: "salle_nom", label: "Salle" },
    { key: "is_active", label: "Statut", render: (value) => value ? "Actif" : "Inactif" },
    { key: "derniere_mesure", label: "Dernière mesure" },
  ];

  // États pour les données et le chargement
  const [capteurs, setCapteurs] = useState([]);
  const [salles, setSalles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statistiques, setStatistiques] = useState({ total: 0, actifs: 0, inactifs: 0 });

  // Champs du formulaire d'ajout de capteur (mis à jour selon l'API)
  const fields = [
    { name: "nom", label: "Nom du capteur", type: "text", placeholder: "Ex: Capteur Température 101", required: true },
    { 
      name: "type_capteur", 
      label: "Type de capteur", 
      type: "select",
      options: [
        { value: "temperature", label: "Température" },
        { value: "humidite", label: "Humidité" },
        { value: "pression", label: "Pression" }
      ],
      required: true
    },
    { 
      name: "id_salle", 
      label: "Salle", 
      type: "select",
      options: salles.map(salle => ({ value: salle.id, label: salle.nom })),
      required: true
    }
  ];

  // Fonction pour charger les données depuis l'API
  const chargerDonnees = async () => {
    try {
      setLoading(true);
      setError(null);

      // Charger les capteurs et les salles en parallèle
      const [capteursResponse, sallesResponse] = await Promise.all([
        capteurService.getAllCapteurs(),
        capteurService.getSalles()
      ]);

      if (capteursResponse.success) {
        setCapteurs(capteursResponse.data.capteurs || []);
        setStatistiques(capteursResponse.data.statistiques || { total: 0, actifs: 0, inactifs: 0 });
      }

      if (sallesResponse.success) {
        setSalles(sallesResponse.data || []);
      }

    } catch (err) {
      setError(err.message);
      console.error('Erreur lors du chargement des données:', err);
    } finally {
      setLoading(false);
    }
  };

  // Charger les données au montage du composant
  useEffect(() => {
    chargerDonnees();
  }, []);

  // Fonction pour ajouter un capteur
  const handleAddCapteur = async (values) => {
    try {
      setError(null);
      console.log('Données envoyées pour ajout capteur:', values);
      const response = await capteurService.ajouterCapteur(values);
      
      if (response.success) {
        // Recharger les données pour avoir la liste à jour
        await chargerDonnees();
        return true; // Indique le succès au modal
      }
    } catch (err) {
      setError(err.message);
      console.error('Erreur lors de l\'ajout du capteur:', err);
      throw err; // Relancer l'erreur pour le modal
    }
  };

  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState("");

  // Catégories de filtres mises à jour
  const categories = [
    {
      title: "Type",
      options: [
        { label: "Température", value: "temperature" },
        { label: "Humidité", value: "humidite" },
        { label: "Pression", value: "pression" },
      ],
    },
    {
      title: "Statut",
      options: [
        { label: "Actif", value: true },
        { label: "Inactif", value: false },
      ],
    },
  ];

  // Fonction de filtrage mise à jour pour les vraies données
  const capteursFiltres = useMemo(() => {
    return capteurs.filter((capteur) => {
      const matchSearch =
        capteur.nom?.toLowerCase().includes(search.toLowerCase()) ||
        capteur.salle_nom?.toLowerCase().includes(search.toLowerCase());

      const matchType =
        !filters["Type"] || filters["Type"].length === 0
          ? true
          : filters["Type"].includes(capteur.type_capteur);

      const matchStatut =
        !filters["Statut"] || filters["Statut"].length === 0
          ? true
          : filters["Statut"].includes(capteur.is_active);

      return matchSearch && matchType && matchStatut;
    });
  }, [capteurs, search, filters]);

  // Affichage conditionnel selon l'état de chargement
  if (loading) {
    return (
      <div className="page-container page-wrapper">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Chargement des capteurs...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="page-container page-wrapper" tabIndex={-1}>
      <a href="#main-content" className="skip-link visually-hidden">
        Aller au contenu principal
      </a>
      <div id="main-content" tabIndex={-1}>
      <h1 className="salle-title">Gestion des capteurs</h1>
      
      {/* Affichage des erreurs */}
      {error && (
        <div 
        role="alert"
        aria-live="polite" 
        style={{ 
          background: 'var(--bg-danger)', 
          border: '1px solid var(--danger)', 
          padding: '1rem', 
          borderRadius: '4px',
          marginBottom: '1rem',
          color: 'var(--danger)'
        }}>
          <strong>Erreur:</strong> {error}
          <button 
          className="btn btn-secondary"
            onClick={chargerDonnees}
            style={{ marginLeft: '1rem', padding: '0.5rem 1rem' }}
          >
            Réessayer
          </button>
        </div>
      )}
    <section className="statistics-section" aria-labelledby="stats-title">
      <h2 id="stats-title" className="visually-hidden">Statistiques</h2>
      <div className="infos-pages" >
        <StatCard
          aria-label="Nombre de capteurs" 
          value={statistiques.total} 
          label="Capteurs" 
          icon="circle-gauge" 
        />
        <StatCard
          aria-label="Nombre de capteurs actifs" 
          value={statistiques.actifs} 
          label="Actifs" 
          icon="circle-check" 
        />
        <StatCard
          aria-label="Nombre de capteurs inactifs" 
          value={statistiques.inactifs} 
          label="Inactifs" 
          icon="circle-x" 
        />

        <FormModal
          ctaLabel="+ Ajouter un capteur"
          fields={fields}
          onSubmit={handleAddCapteur}
          title="Ajouter un capteur"
          submitLabel="Créer"
          icon="circle-gauge"
        />
      </div>
    </section>
    <section className="search-section" aria-labelledby="search-title">
      <h2 id="search-title" className="visually-hidden">Recherche et filtres</h2>
      <div className="search-wrapper" style={{ marginTop: "1.5rem" }} aria-label="Recherches capteurs">
        <Searchbar 
          placeholder="Rechercher un capteur..." 
          value={search} 
          onChange={setSearch}
          aria-label="Rechercher un capteur" 
        />
      </div>

      <div className="filter-sticky">
        <Filter categories={categories} onChange={setFilters} />
      </div>
    </section>

    <section className="data-section" aria-labelledby="data-title">
      <h2 id="data-title" className="visually-hidden">Liste des capteurs</h2>
      <div className="table-container" style={{ marginTop: "2rem" }}>
        {capteursFiltres.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            {capteurs.length === 0 ? 
              'Aucun capteur trouvé. Ajoutez-en un nouveau !' : 
              'Aucun capteur ne correspond à vos critères de recherche.'
            }
          </div>
        ) : (
          <Tableau columns={columns} data={capteursFiltres} aria-label="Tableau des capteurs"/>
        )}
      </div>
      </section>
      </div>
    </main>
  );
}