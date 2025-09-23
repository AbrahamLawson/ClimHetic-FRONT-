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
import SectionLoader from "../components/SectionLoader";
import { Trash2, Pencil, DoorOpen, CirclePower, Plus } from "lucide-react";
import "../styles/searchbar.css";
import "../styles/salle.css";
import "../styles/global.css";

export default function Capteurs() {
  const navigate = useNavigate();

  // Infos tableau pour affichage des capteurs
  const columns = [
    { key: "id", label: "ID" },
    { key: "nom", label: "Nom du capteur" },
    { key: "type_capteur", label: "Type" },
    { key: "salle_nom", label: "Salle" },
    {
      key: "is_active",
      label: "Statut",
      type : "status",
      render: (value) => (Boolean(value) ? "Active" : "Inactive"),
    },
    { key: "derniere_mesure", label: "Dernière mesure" },
  {
    key: "actions",
    label: "Actions",
    className: "actions-column",
    render: (value, capteur) => (
      <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'nowrap', justifyContent: 'space-around', alignItems: 'center', width: '100%' }}>
        {capteur && (
          <>
            {Boolean(capteur.is_active) && (
              <>
                {/* Changer salle */}
                <FormModal
                  ctaLabel={<Pencil size={16} title={`Changer la salle du capteur "${capteur.nom}"`} />}
                  fields={[{
                    name: "nouvelle_salle_id",
                    label: "Nouvelle salle",
                    type: "select",
                    options: salles.filter(s => s.id !== capteur.id_salle).map(s => ({ value: s.id, label: s.nom })),
                    required: true
                  }]}
                  onSubmit={async (values) => {
                    try {
                      const response = await capteurService.changerSalleCapteur(capteur.id, parseInt(values.nouvelle_salle_id));
                      if (response.success) {
                        await chargerDonnees();
                        const nouvelleSalle = salles.find(s => s.id === parseInt(values.nouvelle_salle_id));
                        afficherMessageSucces(`Capteur "${capteur.nom}" déplacé vers "${nouvelleSalle?.nom}".`);
                        return true;
                      }
                    } catch (err) {
                      setError(err.message);
                      console.error(err);
                      throw err;
                    }
                  }}
                  title={`Changer la salle du capteur "${capteur.nom}"`}
                  submitLabel="Changer"
                />

                {/* Dissocier */}
                {capteur.id_salle && (
                  <FormModal
                    ctaLabel={<DoorOpen size={16} title={`Dissocier le capteur "${capteur.nom}"`} />}
                    fields={[]}
                    onSubmit={async () => {
                      try {
                        const response = await capteurService.dissocierCapteur(capteur.id);
                        if (response.success) {
                          await chargerDonnees();
                          afficherMessageSucces(`Capteur "${capteur.nom}" dissocié.`);
                          return true;
                        }
                      } catch (err) {
                        setError(err.message);
                        console.error(err);
                        throw err;
                      }
                    }}
                    title={`Dissocier le capteur "${capteur.nom}"`}
                    submitLabel="Dissocier"
                  />
                )}
              </>
            )}

            {/* Activer/Désactiver */}
            <FormModal
            buttonStyle={{
                    backgroundColor: capteur.is_active ? 'var(--success)' : 'var(--bg-danger-life)',
                    color: capteur.is_active ? 'white' : 'var(--danger-life)',
                  }}

              ctaLabel={<CirclePower size={16} title={`${capteur.is_active ? "Désactiver" : "Activer"} ${capteur.nom}`} />}
              fields={[]}
              onSubmit={async () => {
                try {
                  const response = capteur.is_active ? 
                    await capteurService.desactiverCapteur(capteur.id) :
                    await capteurService.reactiverCapteur(capteur.id);
                  if (response.success) {
                    await chargerDonnees();
                    afficherMessageSucces(`Capteur "${capteur.nom}" ${capteur.is_active ? "désactivé" : "réactivé"} !`);
                    return true;
                  }
                } catch (err) {
                  setError(err.message);
                  console.error(err);
                  throw err;
                }
              }}
              title={`${capteur.is_active ? "Désactiver" : "Activer"} le capteur "${capteur.nom}"`}
              submitLabel={capteur.is_active ? "Désactiver" : "Activer"}
            />

            {/* Supprimer */}
            <FormModal
            buttonStyle={{
                    backgroundColor: 'var(--danger)',
                    color: 'white',
                  }}
              ctaLabel={<Trash2 size={16} title={`Supprimer ${capteur.nom}`} />}
              fields={[]}
              onSubmit={async () => {
                try {
                  const response = await capteurService.supprimerCapteur(capteur.id);
                  if (response.success) {
                    await chargerDonnees();
                    afficherMessageSucces(`Capteur "${capteur.nom}" supprimé.`);
                    return true;
                  }
                } catch (err) {
                  setError(err.message);
                  console.error(err);
                  throw err;
                }
              }}
              title={`Supprimer le capteur "${capteur.nom}"`}
              submitLabel="Supprimer définitivement"
            />
          </>
        )}
      </div>
    )
  },
];


  // États pour les données et le chargement
  const [capteurs, setCapteurs] = useState([]);
  const [salles, setSalles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [statistiques, setStatistiques] = useState({ total: 0, actifs: 0, inactifs: 0 });
 
  // Fonction pour afficher un message de succès temporaire
  const afficherMessageSucces = (message) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000); // Masquer après 3 secondes
  };

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
  useEffect(() => {
    const interval = setInterval(() => {
      chargerDonnees();
    }, 5 * 60 * 1000); 
    return () => clearInterval(interval);
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
        const salle = salles.find(s => s.id === parseInt(values.id_salle));
        afficherMessageSucces(`Capteur "${values.nom}" créé avec succès dans la salle "${salle?.nom}" !`);

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
          : filters["Statut"].includes(Boolean(capteur.is_active));


      return matchSearch && matchType && matchStatut;
    });
  }, [capteurs, search, filters]);

  return (
    <main className="page-container page-wrapper fade-in" tabIndex={-1}>
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

      {/* Affichage des messages de succès */}
      {successMessage && (
        <div style={{
          background: 'var(--bg-success)',
          border: '1px solid var(--success)',
          padding: '1rem',
          borderRadius: '4px',
          marginBottom: '1rem',
          color: 'var(--success)'
        }}>
          <strong>Succès:</strong> {successMessage}
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
          ctaLabel={<><Plus size={16} /> Ajouter un capteur</>}
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
    {loading ? (
      <SectionLoader text="Chargement du tableau des capteurs..." />
    ) : capteursFiltres.length === 0 ? (
      <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
        {capteurs.length === 0
          ? 'Aucun capteur trouvé. Ajoutez-en un nouveau !'
          : 'Aucun capteur ne correspond à vos critères de recherche.'}
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