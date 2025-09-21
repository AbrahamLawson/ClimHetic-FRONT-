// export default function Salles() {
//   return <h1>Salles</h1>;
// }

import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Tableau from "../components/Tableau";
import FormModal from "../components/form/FormModal";
import Filter from "../components/Filter";
import Searchbar from "../components/Searchbar";
import StatCard from "../components/StatCard";
import "../styles/searchbar.css";
import "../styles/salle.css";
import adminSalleService from "../services/AdminSalle";
import capteurService from "../services/capteurService";

export default function Salles() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();
  const userRole = !isAuthenticated ? "guest" : (isAdmin ? "admin" : "user");
  const isAdminRole = userRole === "admin";

  // --- État principal
  const [salles, setSalles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // --- util: map backend conformité -> statut UI
  const mapConformiteToUIStatus = (item) => {
    // item: { statut, details_verification: { score_conformite, niveau_conformite } ... }
    let status = "Confortable";
    const dv = item.details_verification;

    if (item.statut === "AUCUNE_DONNEE" || item.statut === "SEUILS_NON_DEFINIS") {
      status = "Attention";
    } else if (item.statut === "CONFORME") {
      status = "Confortable";
    } else if (item.statut === "NON_CONFORME") {
      if (dv) {
        const score = dv.score_conformite;
        const niveau = dv.niveau_conformite; // EXCELLENT/BON/MOYEN/MAUVAIS
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

  // --- Chargement API
  const load = async () => {
    setLoading(true); setErr("");
    try {
      // 1) Liste des salles (admin endpoint)
      const resp = await adminSalleService.list(); // GET /api/admin/salles/
      const rows = resp?.data ?? [];
      let base = rows.map(r => ({
        id: r.id,
        nom: r.nom,
        batiment: r.batiment,
        etage: r.etage,
        capacite: r.capacite,
        etat: r.etat,         // "active" | "inactive" (utile pour admin)
        confort: null,        // on le remplira pour non-admin
      }));

      // 2) Si non-admin, récupérer la conformité et calculer le confort par salle
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
        base = base.map(s => ({ ...s, confort: byId.get(s.id) || "Attention" })); // défaut prudent
      }

      setSalles(base);
    } catch (e) {
      setErr(e.message || "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, [isAdminRole]);

  // --- Création (FormModal Admin)
  const createFields = [
    { name: "nom", label: "Nom de la salle", type: "text", placeholder: "Ex: Salle 404", required: true },
    { name: "batiment", label: "Bâtiment", type: "text", placeholder: "Ex: A, B, C", required: true },
    { name: "etage", label: "Étage", type: "number", placeholder: "Ex: 1", required: true },
    { name: "capacite", label: "Capacité", type: "number", placeholder: "Ex: 24", required: true },
    { name: "etat", label: "État", type: "select", options: [
      { label: "active", value: "active" },
      { label: "inactive", value: "inactive" },
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
      return true;
    } catch (e) {
      if (String(e.message).includes("Network Error")) {
        console.warn("POST /admin/salles/ a probablement réussi, mais la réponse a échoué. On recharge la liste.");
        return true;
      }
      alert(e.message || "Erreur lors de la création");
      throw e;
    } finally {
      await load();
    }
  };

  // --- Actions Admin
  const handleDelete = async (row) => {
    if (!window.confirm(`Supprimer la salle "${row.nom}" ?`)) return;
    try {
      await adminSalleService.remove(row.id);
      setSalles(prev => prev.filter(s => s.id !== row.id));  // retrait optimiste
    } catch (e) {
      alert(e.message || "Erreur suppression");
      await load();
    }
  };

  const toggleEtat = async (row) => {
    const next = row.etat === "active" ? "inactive" : "active";
    try {
      await adminSalleService.patch(row.id, { etat: next });
      await load();
    } catch (e) {
      alert(e.message || "Erreur changement d'état");
    }
  };

  const editFields = (row) => ([
    { name: "nom", label: "Nom de la salle", type: "text", defaultValue: row.nom, required: true },
    { name: "batiment", label: "Bâtiment", type: "text", defaultValue: row.batiment, required: true },
    { name: "etage", label: "Étage", type: "number", defaultValue: row.etage, required: true },
    { name: "capacite", label: "Capacité", type: "number", defaultValue: row.capacite, required: true },
    { name: "etat", label: "État", type: "select", options: [
      { label: "active", value: "active" },
      { label: "inactive", value: "inactive" },
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
      await load();
      return true;
    } catch (e) {
      alert(e.message || "Erreur mise à jour");
      throw e;
    }
  };

  // --- Colonnes tableau
  const adminColumns = [
    { key: "id", label: "ID" },
    { key: "nom", label: "Salle" },
    { key: "batiment", label: "Bâtiment" },
    { key: "etage", label: "Étage" },
    { key: "capacite", label: "Capacité" },
    { key: "etat", label: "Statut", type: "status" }, // active/inactive
    {
      key: "_actions",
      label: "Actions",
      className: "actions-column",
      render: (value, row) => (
        <div
          className="actions-cell"
          onClick={(e) => e.stopPropagation()}
          style={{ display: "flex", gap: "0.4rem", flexWrap: "nowrap" }}
        >
          <span onClick={(e) => e.stopPropagation()}>
            <FormModal
              ctaLabel="Éditer"
              fields={editFields(row)}
              onSubmit={(vals) => handleEditSalle(row, vals)}
              title={`Modifier "${row.nom}"`}
              submitLabel="Enregistrer"
              icon="pen-to-square"
              buttonStyle={{ padding: "0.25rem 0.5rem", fontSize: "0.8rem", minWidth: "auto" }}
            />
          </span>

          <button
            type="button"
            className="btn"
            onClick={(e) => { e.stopPropagation(); toggleEtat(row); }}
            style={{ padding: "0.25rem 0.5rem", fontSize: "0.8rem" }}
          >
            {row.etat === "active" ? "Désactiver" : "Activer"}
          </button>

          <button
            type="button"
            className="btn btn-danger"
            onClick={(e) => { e.stopPropagation(); handleDelete(row); }}
            style={{ padding: "0.25rem 0.5rem", fontSize: "0.8rem", background: "#dc3545", color: "#fff", border: "1px solid #dc3545" }}
          >
            Supprimer
          </button>
        </div>
      ),
    },
  ];

  const userColumns = [
    { key: "id", label: "ID" },
    { key: "nom", label: "Salle" },
    { key: "batiment", label: "Bâtiment" },
    { key: "etage", label: "Étage" },
    { key: "capacite", label: "Capacité" },
    { key: "confort", label: "Confort", type: "status" }, // Confortable/Attention/Alerte/Danger
  ];

  const columnsToUse = isAdminRole ? adminColumns : userColumns;

  // --- Filtres & recherche (locaux)
  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState("");

  const categories = isAdminRole
    ? [
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
            { label: "active", value: "active" },
            { label: "inactive", value: "inactive" },
          ],
        },
      ]
    : [
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
            { label: "Confortable", value: "Confortable" },
            { label: "Attention",   value: "Attention" },
            { label: "Alerte",      value: "Alerte" },
            { label: "Danger",      value: "Danger" },
          ],
        },
      ];

  const sallesFiltrees = useMemo(() => {
    return salles.filter((s) => {
      const sterm = (search || "").toLowerCase();
      const matchSearch =
        (s.nom || "").toLowerCase().includes(sterm) ||
        (s.batiment || "").toLowerCase().includes(sterm);

      const matchBat =
        !filters["Bâtiment"]?.length ? true : filters["Bâtiment"].includes(s.batiment);

      // admin -> filtre sur etat ; non-admin -> filtre sur "confort"
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
        <a href="#main-content" className="skip-link visually-hidden">
          Aller au contenu principal
        </a>

        <h1 className="salle-title">Salles</h1>

        <div className="infos-pages" aria-label="Informations salles">
          <StatCard value={salles.length} label="Salles" icon="house-wifi" />

          {isAdminRole && (
            <FormModal
              ctaLabel="+ Ajouter une salle"
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
          <Searchbar
            placeholder="Rechercher une salle ou un bâtiment..."
            value={search}
            onChange={setSearch}
          />
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
