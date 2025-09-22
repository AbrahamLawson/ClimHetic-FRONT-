import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createUser, getAllUsers } from "../auth";
import Tableau from "../components/Tableau";
import FormModal from "../components/form/FormModal";
import Filter from "../components/Filter";
import Searchbar from "../components/Searchbar";
import StatCard from "../components/StatCard";
import "../styles/searchbar.css";
import "../styles/salle.css";
import { UserRoundPlus } from "lucide-react";

export default function Admin() {
  const navigate = useNavigate();

  // Colonnes du tableau
  const columns = [
    { key: "id", label: "ID" },
    { key: "nom", label: "Nom" },
    { key: "email", label: "Email" },
    { key: "role", label: "Rôle" },
  ];

  // Données utilisateurs depuis Firestore
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const fields = [
    { name: "nom", label: "Nom", type: "text", placeholder: "Ex: Sira", required: true },
    { name: "email", label: "Email", type: "email", placeholder: "Ex: sira@climhetic.fr", required: true },
    { name: "password", label: "Mot de passe", type: "password", placeholder: "Minimum 6 caractères", required: true },
    { name: "role", label: "Rôle", type: "select", options: ["user", "admin"], required: true },
  ];

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { users: firestoreUsers, error } = await getAllUsers();
        if (!error && firestoreUsers) {
          const formattedUsers = firestoreUsers.map((user, index) => ({
            id: index + 1,
            uid: user.uid,
            nom: user.displayName || 'Non défini',
            email: user.email,
            role: user.role || 'user'
          }));
          setUsers(formattedUsers);
        } else {
          console.error('Erreur lors du chargement des utilisateurs:', error);
          setMessage({ 
            type: 'error', 
            text: 'Impossible de charger les utilisateurs depuis Firestore' 
          });
        }
      } catch (error) {
        console.error('Erreur:', error);
        setMessage({ 
          type: 'error', 
          text: 'Erreur lors du chargement des utilisateurs' 
        });
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  const handleAddUser = async (values) => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      const result = await createUser(values.email, values.password, values.nom, values.role);
      
      if (result.error) {
        setMessage({ 
          type: 'error', 
          text: `Erreur lors de la création: ${result.error}` 
        });
      } else {
        const { users: firestoreUsers, error: fetchError } = await getAllUsers();
        if (!fetchError && firestoreUsers) {
          const formattedUsers = firestoreUsers.map((user, index) => ({
            id: index + 1,
            uid: user.uid,
            nom: user.displayName || 'Non défini',
            email: user.email,
            role: user.role || 'user'
          }));
          setUsers(formattedUsers);
        }
        
        if (result.needsReauth) {
          setMessage({ 
            type: 'warning', 
            text: 'Utilisateur créé avec succès ! Vous devez vous reconnecter pour continuer à administrer.' 
          });
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        } else {
          setMessage({ 
            type: 'success', 
            text: 'Utilisateur créé avec succès !' 
          });
        }
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: `Erreur inattendue: ${error.message}` 
      });
    } finally {
      setLoading(false);
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 5000);
    }
  };

  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState("");

  const categories = [
    {
      title: "Rôle",
      options: [
        { label: "Admin", value: "admin" },
        { label: "User", value: "user" },
      ],
    },
  ];

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchSearch =
        user.nom.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());

      const matchRole =
        !filters["Rôle"] || filters["Rôle"].length === 0
          ? true
          : filters["Rôle"].includes(user.role);

      return matchSearch && matchRole;
    });
  }, [users, search, filters]);

  return (
    <main className="page-container page-wrapper" tabIndex={-1}>
    
      <a href="#main-content" className="skip-link visually-hidden">
        Aller au contenu principal
      </a>
      <div id="main-content" tabIndex={-1}>
      <h1 className="salle-title">Gestion des utilisateurs</h1>

      {message.text && (
        <div
          role="alert"
          aria-live="polite" 
          className={`notification ${message.type}`}
          style={{
            padding: '1rem',
            marginBottom: '1rem',
            borderRadius: '6px',
            backgroundColor: 
              message.type === 'success' ? 'var(--bg-success)' :
              message.type === 'error' ? 'var(--bg-danger)' :
              message.type === 'warning' ? 'var(--bg-warning)' : '#e2e3e5',
            color: 
              message.type === 'success' ? 'var(--success)' :
              message.type === 'error' ? 'var(--danger)' :
              message.type === 'warning' ? 'var(--warning)' : '#383d41',
            border: `1px solid ${
              message.type === 'success' ? 'var(--success)' :
              message.type === 'error' ? 'var(--danger)' :
              message.type === 'warning' ? 'var(--warning)' : '#d1ecf1'
            }`
          }}
        >
          {message.text}
        </div>
      )}

      <section aria-labelledby="stats-section">
        <h2 id="stats-section" className="visually-hidden">Statistiques et actions</h2>
        <div className="infos-pages" >
        <StatCard value={users.length} label="Utilisateurs" icon="user" />

        <FormModal
          ctaLabel={<><UserRoundPlus size={16} /> Ajouter un utilisateur</>}
          fields={fields}
          onSubmit={handleAddUser}
          title="Ajouter un utilisateur"
          submitLabel={loading ? "Création..." : "Créer"}
          icon="user-plus"
          disabled={loading}
        />
        </div>
      </section>
      <section aria-labelledby="search-section">
        <h2 id="search-section" className="visually-hidden">Recherche et filtres</h2>
        <div className="search-wrapper" style={{ marginTop: "1.5rem" }} aria-label="Recherche utilisateur">
          <Searchbar
            aria-label="Rechercher un utilisateur"
            placeholder="Rechercher un utilisateur ou un email..."
            value={search}
            onChange={setSearch}
          />
        </div>

        <div className="filter-sticky" aria-label="Filtre caractéristiques utilisateurs">
          <Filter categories={categories} onChange={setFilters} />
        </div>
      </section>
      <section aria-labelledby="table-section">
        <h2 id="table-section" className="visually-hidden">Liste des utilisateurs</h2>
      <div className="table-container" style={{ marginTop: "2rem" }}>
        {loadingUsers ? (
          <div className="loading-container">
            <p>Chargement des utilisateurs...</p>
          </div>
        ) : (
          <Tableau aria-label="Tableau utilisateurs" columns={columns} data={filteredUsers} />
        )}
      </div>
      </section>
      </div>
    </main>
  );
}
