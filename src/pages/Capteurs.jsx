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
    { key: "is_active", label: "Statut", render: (value) => Boolean(value) ? "Actif" : "Inactif" },
    { key: "derniere_mesure", label: "Dernière mesure" },
    { 
      key: "actions", 
      label: "Actions", 
      className: "actions-column",
      render: (value, capteur) => (
        <div style={{ 
          display: 'flex', 
          gap: '0.25rem', 
          flexWrap: 'nowrap', 
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%'
        }}>
          {capteur && (
            <>
              {/* Boutons pour capteurs actifs seulement */}
              {Boolean(capteur.is_active) && (
                <>
                  <FormModal
                    ctaLabel="Changer"
                    fields={[
                      { 
                        name: "nouvelle_salle_id", 
                        label: "Nouvelle salle", 
                        type: "select",
                        options: salles
                          .filter(salle => salle.id !== capteur?.id_salle)
                          .map(salle => ({ value: salle.id, label: salle.nom })),
                        required: true
                      }
                    ]}
                    onSubmit={async (values) => {
                      try {
                        setError(null);
                        const response = await capteurService.changerSalleCapteur(
                          capteur.id, 
                          parseInt(values.nouvelle_salle_id)
                        );
                        
                        if (response.success) {
                          await chargerDonnees();
                          const nouvelleSalle = salles.find(s => s.id === parseInt(values.nouvelle_salle_id));
                          afficherMessageSucces(`Changement de salle effectué ! Le capteur "${capteur.nom}" a été déplacé vers "${nouvelleSalle?.nom}".`);
                          return true;
                        }
                      } catch (err) {
                        setError(err.message);
                        console.error('Erreur lors du changement de salle:', err);
                        throw err;
                      }
                    }}
                    title={`Changer la salle du capteur "${capteur.nom}"`}
                    submitLabel="Changer de salle"
                    icon="house-wifi"
                    buttonStyle={{
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.75rem',
                      minWidth: 'auto'
                    }}
                  />
                  
                  {capteur.id_salle && (
                    <FormModal
                      ctaLabel="Désaffecter"
                      fields={[]}
                      onSubmit={async () => {
                        try {
                          setError(null);
                          const response = await capteurService.dissocierCapteur(capteur.id);
                          
                          if (response.success) {
                            await chargerDonnees();
                            afficherMessageSucces(`Dissociation effectuée ! Le capteur "${capteur.nom}" n'est plus associé à aucune salle.`);
                            return true;
                          }
                        } catch (err) {
                          setError(err.message);
                          console.error('Erreur lors de la dissociation:', err);
                          throw err;
                        }
                      }}
                      title={`Désaffecter le capteur "${capteur.nom}" de sa salle`}
                      submitLabel="Désaffecter"
                      icon="user-plus"
                      buttonStyle={{
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.75rem',
                        minWidth: 'auto'
                      }}
                    />
                  )}
                </>
              )}
              
              {/* Bouton Activer/Désactiver - toujours visible */}
              <FormModal
                ctaLabel={Boolean(capteur.is_active) ? "Désactiver" : "Activer"}
                fields={[]}
                onSubmit={async () => {
                  try {
                    setError(null);
                    const isActive = Boolean(capteur.is_active);
                    const response = isActive 
                      ? await capteurService.desactiverCapteur(capteur.id)
                      : await capteurService.reactiverCapteur(capteur.id);
                    
                    if (response.success) {
                      await chargerDonnees();
                      const action = isActive ? "désactivé" : "réactivé";
                      afficherMessageSucces(`Capteur "${capteur.nom}" ${action} avec succès !`);
                      return true;
                    }
                  } catch (err) {
                    setError(err.message);
                    console.error('Erreur lors du changement de statut:', err);
                    throw err;
                  }
                }}
                title={`${Boolean(capteur.is_active) ? "Désactiver" : "Activer"} le capteur "${capteur.nom}"`}
                submitLabel={Boolean(capteur.is_active) ? "Désactiver" : "Activer"}
                icon="circle-gauge"
                buttonStyle={{
                padding: '0.25rem 0.5rem',
                fontSize: '0.75rem',
                  minWidth: 'auto'
                }}
              />
              
              {/* Bouton Supprimer - toujours visible */}
              <FormModal
                ctaLabel="Supprimer"
                fields={[]}
                onSubmit={async () => {
                  try {
                    setError(null);
                    const response = await capteurService.supprimerCapteur(capteur.id);
                    
                    if (response.success) {
                      await chargerDonnees();
                      afficherMessageSucces(`Capteur "${capteur.nom}" supprimé définitivement avec succès !`);
                      return true;
                    }
                  } catch (err) {
                    setError(err.message);
                    console.error('Erreur lors de la suppression:', err);
                    throw err;
                  }
                }}
                title={`Supprimer définitivement le capteur "${capteur.nom}"`}
                submitLabel="Supprimer définitivement"
                icon="trash"
                buttonStyle={{
                  padding: '0.25rem 0.5rem',
                  fontSize: '0.75rem',
                  minWidth: 'auto',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: '1px solid #dc3545'
                }}
                modalStyle={{
                  content: {
                    borderColor: '#dc3545'
                  }
                }}
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
    <div className="page-container page-wrapper">
      <h1 className="salle-title">Gestion des Capteurs</h1>
      
      {/* Affichage des erreurs */}
      {error && (
        <div style={{ 
          background: '#fee', 
          border: '1px solid #fcc', 
          padding: '1rem', 
          borderRadius: '4px',
          marginBottom: '1rem',
          color: '#c33'
        }}>
          <strong>Erreur:</strong> {error}
          <button 
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
          background: '#d4edda', 
          border: '1px solid #c3e6cb', 
          padding: '1rem', 
          borderRadius: '4px',
          marginBottom: '1rem',
          color: '#155724'
        }}>
          <strong>Succès:</strong> {successMessage}
        </div>
      )}

      <div className="infos-pages">
        <StatCard 
          value={statistiques.total} 
          label="Capteurs" 
          icon="circle-gauge" 
        />
        <StatCard 
          value={statistiques.actifs} 
          label="Actifs" 
          icon="toggle-right" 
        />
        <StatCard 
          value={statistiques.inactifs} 
          label="Inactifs" 
          icon="toggle-left" 
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

      <div className="search-wrapper" style={{ marginTop: "1.5rem" }}>
        <Searchbar 
          placeholder="Rechercher un capteur ou une salle..." 
          value={search} 
          onChange={setSearch} 
        />
      </div>

      <div className="filter-sticky">
        <Filter categories={categories} onChange={setFilters} />
      </div>

      <div className="table-container" style={{ marginTop: "2rem" }}>
        {capteursFiltres.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            {capteurs.length === 0 ? 
              'Aucun capteur trouvé. Ajoutez-en un nouveau !' : 
              'Aucun capteur ne correspond à vos critères de recherche.'
            }
          </div>
        ) : (
          <Tableau columns={columns} data={capteursFiltres} />
        )}
      </div>

    </div>
  );
}