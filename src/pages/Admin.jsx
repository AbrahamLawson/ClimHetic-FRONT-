import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
    { id: 1, nom: "Sira", email: "sira@climhetic.fr", role: "admin" },
    { id: 2, nom: "Luka", email: "luka@climhetic.fr", role: "user" },
    { id: 3, nom: "Leo", email: "leo@climhetic.fr", role: "admin" },
    { id: 4, nom: "Hemmy", email: "hemmy@climhetic.fr", role: "user" },
    { id: 5, nom: "Abraham", email: "abraham@climhetic.fr", role: "user" },
  ]);

  const fields = [
    { name: "nom", label: "Nom", type: "text", placeholder: "Ex: Sira" },
    { name: "email", label: "Email", type: "email", placeholder: "Ex: sira@climhetic.fr" },
    { name: "role", label: "Rôle", type: "select", options: ["user", "admin"] },
  ];

  const handleAddUser = (values) => {
    const newUser = { id: users.length + 1, ...values };
    setUsers([...users, newUser]);
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

      <div className="infos-pages">
        <StatCard value={users.length} label="Utilisateurs" icon="user" />

        <FormModal
          ctaLabel="+ Ajouter un utilisateur"
          fields={fields}
          onSubmit={handleAddUser}
          title="Ajouter un utilisateur"
          submitLabel="Créer"
          icon="user-plus"
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
