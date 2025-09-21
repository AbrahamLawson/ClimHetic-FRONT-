// export default function Salle() {
//   return <h1>Détail de salle</h1>;
// }

import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Status from "../components/Status";
import SliderWrapper from "../components/SliderWrapper";
import Gauge from "../components/Gauge";
import Graphique from "../components/Graphique";

import adminSalleService from "../services/AdminSalle";
import capteurService from "../services/capteurService";
import apiClient from "../services/apiClient"; 

import "../styles/form.css";
import "../styles/global.css";
import "../styles/salle.css";
import "../styles/slider.css";

//  Normaliser les réponses API
const toArray = (resp) => {
  const d = resp?.data;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.data)) return d.data;
  if (Array.isArray(d?.items)) return d.items;
  if (Array.isArray(resp)) return resp;
  return [];
};
// Gère la data
const toObject = (resp) => {
  if (resp?.data?.data && typeof resp.data.data === "object") return resp.data.data;
  if (resp?.data && typeof resp.data === "object") return resp.data;
  if (resp && typeof resp === "object") return resp;
  return null;
};


function mapBackendToUIStatus(item) {
  let status = "Confortable";
  const dv = item?.details_verification;

  if (item?.statut === "AUCUNE_DONNEE" || item?.statut === "SEUILS_NON_DEFINIS") {
    status = "Attention";
  } else if (item?.statut === "CONFORME") {
    status = "Confortable";
  } else if (item?.statut === "NON_CONFORME") {
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
}

function statusToPillValue(uiStatus) {
  if (uiStatus === "Confortable") return "Success";
  if (uiStatus === "Danger") return "Danger";
  return "Warning";
}

export default function SalleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [salle, setSalle] = useState(null);
  const [confort, setConfort] = useState(null); 
  const [moyennes, setMoyennes] = useState(null);
  const [historique, setHistorique] = useState([]); 

  const alertZones = {
    temperature: { min: 20, max: 25 },
    humidite: { min: 40, max: 60 },
    pression: { min: 1005, max: 1020 },
  };

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const [salleResp, moyResp] = await Promise.all([
        adminSalleService.getById(id),            
        capteurService.getMoyennesBySalle(id, 10), 
      ]);

      setSalle(toObject(salleResp));
      setMoyennes(toObject(moyResp) || null);

      //filtre sur l'id de salle
      try {
        const confAll = await capteurService.getConformiteSalles(10);
        const confObj = toObject(confAll);
        const arr = Array.isArray(confObj?.salles) ? confObj.salles : toArray(confAll);
        const found = arr.find((it) => (it?.salle?.id ?? it?.salle_id) == id);
        setConfort(found ? mapBackendToUIStatus(found) : "Attention");
      } catch {
        setConfort("Attention");
      }

      // Historique des 3 métriques
      const [tResp, hResp, pResp] = await Promise.all([
        apiClient.get(`/capteurs/salles/${id}/temperature?limit=24`),
        apiClient.get(`/capteurs/salles/${id}/humidite?limit=24`),
        apiClient.get(`/capteurs/salles/${id}/pression?limit=24`),
      ]);

      const tArr = toArray(tResp).map((d) => ({
        t: new Date(d.date_update),
        temperature: Number(d.valeur),
      }));
      const hArr = toArray(hResp).map((d) => ({
        t: new Date(d.date_update),
        humidite: Number(d.valeur),
      }));
      const pArr = toArray(pResp).map((d) => ({
        t: new Date(d.date_update),
        pression: Number(d.valeur),
      }));

      // Fusion par timestamp arrondi à la minute 
      const bucket = new Map();
      const pushItem = (arr, key) => {
        arr.forEach(({ t, [key]: val }) => {
          const label =
            t instanceof Date && !isNaN(t)
              ? t.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
              : "";
          if (!bucket.has(label)) bucket.set(label, { time: label });
          bucket.get(label)[key] = val;
        });
      };
      pushItem(tArr, "temperature");
      pushItem(hArr, "humidite");
      pushItem(pArr, "pression");

      const merged = Array.from(bucket.values())
        .filter((x) => x.time)
        .sort((a, b) => a.time.localeCompare(b.time));

      setHistorique(merged);
    } catch (e) {
      console.error(e);
      setErr(e.message || "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const currentMetrics = useMemo(() => {
    return {
      temperature:
        moyennes?.moyenne_temperature != null
          ? Math.round(moyennes.moyenne_temperature * 10) / 10
          : null,
      humidite:
        moyennes?.moyenne_humidite != null
          ? Math.round(moyennes.moyenne_humidite * 10) / 10
          : null,
      pression:
        moyennes?.moyenne_pression != null
          ? Math.round(moyennes.moyenne_pression * 10) / 10
          : null,
    };
  }, [moyennes]);

  return (
    <main className="page-wrapper" aria-labelledby="salle-detail-title" tabIndex={-1}>
      <div id="main-content" tabIndex={-1}>
        <a href="#main-content" className="skip-link visually-hidden">
          Aller au contenu principal
        </a>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <button className="btn" onClick={() => navigate(-1)}>← Retour</button>
          <h1 id="salle-detail-title" className="salle-detail-title" style={{ margin: 0 }}>
            {salle ? `Salle ${salle.nom}` : "Détails de la salle"}
          </h1>
          {confort && (
            <div style={{ marginLeft: "auto" }}>
              <Status value={statusToPillValue(confort)} />
            </div>
          )}
        </div>

        {err && (
          <div className="mt-3 text-red-600" role="alert">
            Erreur : {err}
          </div>
        )}

        {salle && (
          <section className="info-section" aria-labelledby="info-title" style={{ marginTop: "1rem" }}>
            <h2 id="info-title" className="visually-hidden">Informations générales</h2>
            <div className="salle-fiche" aria-label="Informations salle">
              <Card title="Informations" category="informations">
                <p><strong>Nom :</strong> {salle.nom}</p>
                <p><strong>Bâtiment :</strong> {salle.batiment ?? "—"}</p>
                {"etage" in salle && <p><strong>Étage :</strong> {salle.etage}</p>}
                {"capacite" in salle && <p><strong>Capacité :</strong> {salle.capacite}</p>}
                {"etat" in salle && <p><strong>Statut :</strong> {salle.etat}</p>}
                {confort && <p><strong>État de confort :</strong> {confort}</p>}
              </Card>
            </div>
          </section>
        )}

        {loading ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>Chargement…</div>
        ) : (
          <div className="salle-graphs" data-testid="chart-container" aria-label="Données de la salle">
            <section className="metrics-section" aria-labelledby="metrics-title">
              <h2 id="metrics-title" className="visually-hidden">Métriques et graphiques</h2>

              <SliderWrapper>
                <Card title="Température" category="graphiques">
                  <Gauge metric="temperature" value={currentMetrics.temperature ?? 0} aria-label="Gauge de la température" />
                </Card>
                <Card title="Température" category="graphiques">
                  <Graphique
                    data={historique}
                    metrics={["temperature"]}
                    alertZone={alertZones.temperature}
                    aria-label="Graphique de la température"
                  />
                </Card>
              </SliderWrapper>

              <SliderWrapper>
                <Card title="Humidité" category="graphiques">
                  <Gauge metric="humidite" value={currentMetrics.humidite ?? 0} aria-label="Gauge de l'humidité" />
                </Card>
                <Card title="Humidité" category="graphiques">
                  <Graphique
                    data={historique}
                    metrics={["humidite"]}
                    alertZone={alertZones.humidite}
                    aria-label="Graphique de l'humidité"
                  />
                </Card>
              </SliderWrapper>

              <SliderWrapper>
                <Card title="Pression" category="graphiques">
                  <Gauge metric="pressure" value={currentMetrics.pression ?? 0} aria-label="Gauge de la pression" />
                </Card>
                <Card title="Pression" category="graphiques">
                  <Graphique
                    data={historique}
                    metrics={["pression"]}
                    alertZone={alertZones.pression}
                    aria-label="Graphique de la pression"
                  />
                </Card>
              </SliderWrapper>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
