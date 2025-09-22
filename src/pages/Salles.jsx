// export default function Salles() {
//   return <h1>Salles</h1>;
// }

import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth";
import Tableau from "../components/Tableau";
import FormModal from "../components/form/FormModal";
import Filter from "../components/Filter";
import Searchbar from "../components/Searchbar";
import StatCard from "../components/StatCard";
import { Pencil, Trash2, CirclePower, Plus, HousePlus } from "lucide-react";
import "../styles/searchbar.css";
import "../styles/salle.css";
import adminSalleService from "../services/AdminSalle";
import capteurService from "../services/capteurService";

export default function Salles() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();
  const userRole = !isAuthenticated ? "guest" : (isAdmin ? "admin" : "user");
  const isAdminRole = userRole === "admin";

  const [salles, setSalles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");


  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const afficherMessageSucces = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  const afficherMessageErreur = (message) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(null), 3000);
  };

  // map backend conformité -> statut UI
  const mapConformiteToUIStatus = (item) => {
    // { statut, details_verification: { score_conformite, niveau_conformite }

    let status = "Confortable";
    const dv = item.details_verification;

    if (item.statut === "AUCUNE_DONNEE" || item.statut === "SEUILS_NON_DEFINIS") {
      status = "Attention";
    } else if (item.statut === "CONFORME") {
      status = "Confortable";
    } else if (item.statut === "NON_CONFORME") {
      if (dv) {
        const score = dv.score_conformite;
        const niveau = dv.niveau_conformite; 

        if (niveau === "EXCELLENT" || score === 1)      status = "Confortable";
        else if (niveau === "BON" || score === 2)       status = "Attention";
        else if (niveau === "MOYEN" || score === 3)     status = "Alerte";
        else if (niveau === "MAUVAIS" || score === 4)   status = "Danger";
      } else {
        status = "Attention";
      }
    }
    return status;
  };

 
  const load = async () => {
    setLoading(true); setErr("");
    try {

      //Liste des salles
      const resp = await adminSalleService.list(); 
      const rows = resp?.data ?? [];
      let base = rows.map(r => ({
        id: r.id,
        nom: r.nom,
        batiment: r.batiment,
        etage: r.etage,
        capacite: r.capacite,
        etat: r.etat,        
        confort: null,       
      }));

      //Cotès utilisateur récupére la conformité et calculer le confort par salle

      if (!isAdminRole) {
        base = base.filter(s => s.etat === "active");
        const conf = await capteurService.getConformiteSalles(10);
        const items = conf?.data?.salles || [];
        const byId = new Map();
        for (const it of items) {
          const salleId = it?.salle?.id ?? it?.salle_id;
          if (salleId != null) {
            byId.set(salleId, mapConformiteToUIStatus(it));
          }
        }
        base = base.map(s => ({ ...s, confort: byId.get(s.id) || "Attention" }));
      }

      setSalles(base);
    } catch (e) {
      setErr(e.message || "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [isAdminRole]);

  //Création Form Admin
  const createFields = [
    { name: "nom", label: "Nom de la salle", type: "text", placeholder: "Ex: Salle 404", required: true },
    { name: "batiment", label: "Bâtiment", type: "text", placeholder: "Ex: A, B, C", required: true },
    { name: "etage", label: "Étage", type: "number", placeholder: "Ex: 1", required: true },
    { name: "capacite", label: "Capacité", type: "number", placeholder: "Ex: 24", required: true },
    { name: "etat", label: "État", type: "select", options: [
      { label: "Actif", value: "active" },
      { label: "Inactif", value: "inactive" },
    ], required: true },
  ];

  const handleAddSalle = async (values) => {
    try {
      await adminSalleService.create({
        nom: values.nom?.trim(),
        batiment: values.batiment?.trim(),
        etage: Number(values.etage ?? 0),
        capacite: Number(values.capacite ?? 0),
        etat: values.etat || "active",
      });
      afficherMessageSucces(`Salle "${values.nom}" créée avec succès !`);
      return true;
    } catch (e) {
      if (String(e.message).includes("Network Error")) {
        console.warn("POST /admin/salles/ a probablement réussi, mais la réponse a échoué. On recharge la liste.");
        afficherMessageSucces(`Salle "${values.nom}" créée (réponse réseau manquante).`);
        return true;
      }
      afficherMessageErreur(e.message || "Erreur lors de la création");
      throw e;
    } finally {
      await load();
    }
  };

  // Actions cotés Admin
  const handleDelete = async (row) => {
    if (!window.confirm(`Supprimer la salle "${row.nom}" ?`)) return;
    try {
      await adminSalleService.remove(row.id);
      afficherMessageSucces(`Salle "${row.nom}" supprimée avec succès !`);
      setSalles(prev => prev.filter(s => s.id !== row.id));  

    } catch (e) {
      afficherMessageErreur(e.message || "Erreur lors de la suppression");
      await load();
    }
  };

  const toggleEtat = async (row) => {
    const next = row.etat === "active" ? "inactive" : "active";
    try {
      await adminSalleService.patch(row.id, { etat: next });
      afficherMessageSucces(`Salle "${row.nom}" ${next === "active" ? "activée" : "désactivée"} avec succès !`);
      await load();
    } catch (e) {
      afficherMessageErreur(e.message || "Erreur changement d'état");
    }
  };

  const editFields = (row) => ([
    { name: "nom", label: "Nom de la salle", type: "text", defaultValue: row.nom, required: true },
    { name: "batiment", label: "Bâtiment", type: "text", defaultValue: row.batiment, required: true },
    { name: "etage", label: "Étage", type: "number", defaultValue: row.etage, required: true },
    { name: "capacite", label: "Capacité", type: "number", defaultValue: row.capacite, required: true },
    { name: "etat", label: "État", type: "select", options: [
      { label: "Actif", value: "active" },
      { label: "Inactif", value: "inactive" },
    ], defaultValue: row.etat, required: true },
  ]);

  const handleEditSalle = async (row, values) => {
    const payload = {
      nom: values.nom?.trim(),
      batiment: values.batiment?.trim(),
      etage: Number(values.etage ?? row.etage),
      capacite: Number(values.capacite ?? row.capacite),
      etat: values.etat || row.etat,
    };
    try {
      await adminSalleService.patch(row.id, payload);
      afficherMessageSucces(`Salle "${payload.nom}" mise à jour avec succès !`);
      await load();
      return true;
    } catch (e) {
      afficherMessageErreur(e.message || "Erreur lors de la mise à jour");
      throw e;
    }
  };

  // Colonnes tableau
  const adminColumns = [
    { key: "id", label: "ID" },
    { key: "nom", label: "Salle" },
    { key: "batiment", label: "Bâtiment" },
    { key: "etage", label: "Étage" },
    { key: "capacite", label: "Capacité" },
    {
      key: "etat",
      label: "Statut",
      type: "status",
      render: (value) => (value === "active" ? "Active" : "Inactive"),
    },

    {
      key: "_actions",
      label: "Actions",
      className: "actions-column",
      render: (value, row) => (
        <div
          className="actions-cell"
          onClick={(e) => e.stopPropagation()}
          style={{ display: "flex", gap: "0.25rem", flexWrap: "nowrap", justifyContent: "space-around", alignItems: "center", width: "100%" }}
        >
          {row && (
            <>
              <FormModal
                ctaLabel={<Pencil size={16} title={`Modifier la salle "${row.nom}"`} />}
                fields={editFields(row)}
                onSubmit={(vals) => handleEditSalle(row, vals)}
                title={`Modifier "${row.nom}"`}
                submitLabel="Enregistrer"
              />

              <FormModal
                buttonStyle={{
                  backgroundColor: row.etat === "active" ? 'var(--success)' : 'var(--bg-danger-life)',
                  color: row.etat === "active" ? 'white' : 'var(--danger-life)',
                }}
                ctaLabel={<CirclePower size={16} title={`${row.etat === "active" ? "Désactiver" : "Activer"} ${row.nom}`} />}
                fields={[]}
                onSubmit={async () => toggleEtat(row)}
                title={`${row.etat === "active" ? "Désactiver" : "Activer"} "${row.nom}"`}
                submitLabel={row.etat === "active" ? "Désactiver" : "Activer"}
              />

              <FormModal
                buttonStyle={{
                  backgroundColor: 'var(--danger)',
                  color: 'white',
                }}
                ctaLabel={<Trash2 size={16} title={`Supprimer ${row.nom}`} />}
                fields={[]}
                onSubmit={async () => handleDelete(row)}
                title={`Supprimer "${row.nom}"`}
                submitLabel="Supprimer définitivement"
              />
            </>
          )}
        </div>
      ),
    }
  ];

  const userColumns = [
    { key: "id", label: "ID" },
    { key: "nom", label: "Salle" },
    { key: "batiment", label: "Bâtiment" },
    { key: "etage", label: "Étage" },
    { key: "capacite", label: "Capacité" },

    {
      key: "confort",
      label: "Confort",
      type: "status",
      render: (value) => {
        if (!value) return value;
        const mapping = {
          confortable: "Success",
          alerte: "Alerte",
          danger: "Danger",
          critique: "Critical",
          attention: "Warning",
        };
        return mapping[value.toLowerCase()] || value;
      },
    }
  ];

  const columnsToUse = isAdminRole ? adminColumns : userColumns;


  // Filtres & recherche 

  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState("");

  const categories = isAdminRole
    ? [
        { title: "Bâtiment", options: [{ label: "A", value: "A" }, { label: "B", value: "B" }, { label: "C", value: "C" }] },
        { title: "Statut", options: [{ label: "Actif", value: "active" }, { label: "Inactif", value: "inactive" }] },
      ]
    : [
        { title: "Bâtiment", options: [{ label: "A", value: "A" }, { label: "B", value: "B" }, { label: "C", value: "C" }] },
        { title: "Statut", options: [
            { label: "Confortable", value: "Confortable" },
            { label: "Attention", value: "Attention" },
            { label: "Alerte", value: "Alerte" },
            { label: "Danger", value: "Danger" },
          ]
        },
      ];

  const sallesFiltrees = useMemo(() => {
    return salles.filter((s) => {
      const sterm = (search || "").toLowerCase();
      const matchSearch = (s.nom || "").toLowerCase().includes(sterm) || (s.batiment || "").toLowerCase().includes(sterm);
      const matchBat = !filters["Bâtiment"]?.length ? true : filters["Bâtiment"].includes(s.batiment);
      const statutVals = filters["Statut"] || [];
      const matchStatut = statutVals.length === 0
        ? true
        : (isAdminRole ? statutVals.includes(s.etat) : statutVals.includes(s.confort));
      return matchSearch && matchBat && matchStatut;
    });
  }, [salles, search, filters, isAdminRole]);

  return (
    <main className="page-container page-wrapper" tabIndex={-1}>
      <div id="main-content" tabIndex={-1}>
        <a href="#main-content" className="skip-link visually-hidden">Aller au contenu principal</a>

        <h1 className="salle-title">Salles</h1>

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

        {errorMessage && (
          <div style={{
            background: 'var(--bg-danger)',
            border: '1px solid var(--danger)',
            padding: '1rem',
            borderRadius: '4px',
            marginBottom: '1rem',
            color: 'var(--danger)'
          }}>
            <strong>Erreur:</strong> {errorMessage}
          </div>
        )}

        <div className="infos-pages" aria-label="Informations salles">
          <StatCard aria-label="Nombre total de salles" value={salles.length} label="Salles" icon="house-wifi" />
          <StatCard aria-label="Nombre de salles actifs" value={salles.filter(s => s.etat === "active").length} label="Actifs" icon="circle-check" />
          <StatCard aria-label="Nombre de salles inactifs" value={salles.filter(s => s.etat === "inactive").length} label="Inactifs" icon="circle-x" />

          {isAdminRole && (
            <FormModal
              ctaLabel={<><HousePlus size={16} /> Ajouter une salle</>}
              fields={createFields}
              onSubmit={handleAddSalle}
              title="Ajouter une salle"
              submitLabel="Créer"
              icon="house-wifi"
            />
          )}
        </div>

        {err && <div className="mt-3 text-red-600">Erreur : {err}</div>}

        <div className="search-wrapper" style={{ marginTop: "1.5rem" }}>
          <Searchbar placeholder="Rechercher une salle ou un bâtiment..." value={search} onChange={setSearch} />
        </div>

        <div className="filter-sticky">
          <Filter categories={categories} onChange={setFilters} />
        </div>

        <div className="table-container" style={{ marginTop: "2rem" }}>
          <Tableau
            columns={columnsToUse}
            data={loading ? [] : sallesFiltrees}
            loading={loading}
            onRowClick={(row) => navigate(`/salles/${row.id}`)}
          />
        </div>
      </div>
    </main>
  );
}
