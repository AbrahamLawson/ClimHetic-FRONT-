import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../services/auth";
import Tableau from "../components/Tableau";
import FormModal from "../components/form/FormModal";
import Filter from "../components/Filter";
import Searchbar from "../components/Searchbar";
import StatCard from "../components/StatCard";
import "../styles/searchbar.css";
import "../styles/salle.css";

export default function Admin() {
  const navigate = useNavigate();

  // Colonnes du tableau
  const columns = [
    { key: "id", label: "ID" },
    { key: "nom", label: "Nom" },
    { key: "email", label: "Email" },
    { key: "role", label: "Rôle" },
  ];

  // Fake données utilisateurs (à remplacer par la BDD)
  const [users, setUsers] = useState([
    { id: 1, nom: "Sira", email: "sira@climhetic.fr", role: "user" },
    { id: 2, nom: "Luka", email: "luka@climhetic.fr", role: "user" },
    { id: 3, nom: "Leo", email: "leo@climhetic.fr", role: "admin" },
    { id: 4, nom: "Hemmy", email: "hemmy@climhetic.fr", role: "user" },
    { id: 5, nom: "Abraham", email: "abraham@climhetic.fr", role: "user" },
  ]);

  const fields = [
    { name: "nom", label: "Nom", type: "text", placeholder: "Ex: Sira", required: true },
    { name: "email", label: "Email", type: "email", placeholder: "Ex: sira@climhetic.fr", required: true },
    { name: "password", label: "Mot de passe", type: "password", placeholder: "Minimum 6 caractères", required: true },
    { name: "role", label: "Rôle", type: "select", options: ["user", "admin"], required: true },
  ];

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleAddUser = async (values) => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      // Créer l'utilisateur dans Firebase avec le rôle spécifié
      const result = await createUser(values.email, values.password, values.nom, values.role);
      
      if (result.error) {
        setMessage({ 
          type: 'error', 
          text: `Erreur lors de la création: ${result.error}` 
        });
      } else {
        // Ajouter l'utilisateur à la liste locale
        const newUser = { 
          id: users.length + 1, 
          nom: values.nom,
          email: values.email,
          role: values.role,
          uid: result.user.uid
        };
        setUsers([...users, newUser]);
        
        if (result.needsReauth) {
          setMessage({ 
            type: 'warning', 
            text: 'Utilisateur créé avec succès ! Vous devez vous reconnecter pour continuer à administrer.' 
          });
          // Rediriger vers la page de connexion après 3 secondes
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
      // Effacer le message après 5 secondes
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

  const usersFiltres = useMemo(() => {
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
    <div className="page-container page-wrapper">
      <h1 className="salle-title">Gestion des utilisateurs</h1>

      {/* Messages de notification */}
      {message.text && (
        <div 
          className={`notification ${message.type}`}
          style={{
            padding: '1rem',
            marginBottom: '1rem',
            borderRadius: '6px',
            backgroundColor: 
              message.type === 'success' ? '#d4edda' :
              message.type === 'error' ? '#f8d7da' :
              message.type === 'warning' ? '#fff3cd' : '#e2e3e5',
            color: 
              message.type === 'success' ? '#155724' :
              message.type === 'error' ? '#721c24' :
              message.type === 'warning' ? '#856404' : '#383d41',
            border: `1px solid ${
              message.type === 'success' ? '#c3e6cb' :
              message.type === 'error' ? '#f5c6cb' :
              message.type === 'warning' ? '#ffeaa7' : '#d1ecf1'
            }`
          }}
        >
          {message.text}
        </div>
      )}

      <div className="infos-pages">
        <StatCard value={users.length} label="Utilisateurs" icon="user" />

        <FormModal
          ctaLabel="+ Ajouter un utilisateur"
          fields={fields}
          onSubmit={handleAddUser}
          title="Ajouter un utilisateur"
          submitLabel={loading ? "Création..." : "Créer"}
          icon="user-plus"
          disabled={loading}
        />
      </div>

      <div className="search-wrapper" style={{ marginTop: "1.5rem" }}>
        <Searchbar
          placeholder="Rechercher un utilisateur ou un email..."
          value={search}
          onChange={setSearch}
        />
      </div>

      <div className="filter-sticky">
        <Filter categories={categories} onChange={setFilters} />
      </div>

      <div className="table-container" style={{ marginTop: "2rem" }}>
        <Tableau columns={columns} data={usersFiltres} />
      </div>
    </div>
  );
}
