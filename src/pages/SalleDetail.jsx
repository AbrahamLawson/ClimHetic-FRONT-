// export default function Salle() {
//   return <h1>Détail de salle</h1>;
// }

import { useParams } from "react-router-dom";
import Card from "../components/Card";
import Status from "../components/Status";
import SliderWrapper from "../components/SliderWrapper";
import Gauge from "../components/Gauge";
import Graphique from "../components/Graphique";
import "../styles/form.css";
import "../styles/global.css";
import "../styles/salle.css";
import "../styles/slider.css";

export default function SalleDetail() {
  const { id } = useParams();

  const salle = {
    id,
    nom: "Salle 101",
    batiment: "Bâtiment A",
    confort: "Success",
  };

  // Données historiques pour graphiques
  const historique = [
    { time: "10:00", temperature: 22, humidite: 45, pression: 1012 },
    { time: "11:00", temperature: 23, humidite: 50, pression: 1010 },
    { time: "12:00", temperature: 24, humidite: 55, pression: 1008 },
    { time: "13:00", temperature: 23, humidite: 52, pression: 1009 },
  ];

  // Valeurs actuelles (temps réel)
  const currentMetrics = {
    temperature: 23,
    humidite: 50,
    pression: 1010,
  };

  const alertZones = {
    temperature: { min: 18, max: 26 },
    humidite: { min: 30, max: 60 },
    pression: { min: 1000, max: 1020 },
  };

  return (
    <main className="page-wrapper" aria-labelledby="salle-detail-title" tabIndex={-1}>
      <div id="main-content" tabIndex={-1}>
      <a href="#main-content" className="skip-link visually-hidden">
        Aller au contenu principal
      </a>
      <h1 className="salle-detail-title">Détails de la salle</h1>

      <div className="salle-detail-container">
        <section className="info-section" aria-labelledby="info-title">
          <h2 id="info-title" className="visually-hidden">Informations générales</h2>
        <div className="salle-fiche" aria-label="Informations salle">
          <Card title="Informations" category="informations">
            <p><strong>Nom :</strong> {salle.nom}</p>
            <p><strong>Bâtiment :</strong> {salle.batiment}</p>
            <p><strong>État de confort :</strong> <Status value={salle.confort} /></p>
          </Card>
        </div>
        </section>


        <div className="salle-graphs" data-testid="chart-container" aria-label="Données de la salle">
          <section className="metrics-section" aria-labelledby="metrics-title">
          <h2 id="metrics-title" className="visually-hidden">Métriques et graphiques</h2>
          <SliderWrapper>
            <Card title="Température" category="graphiques">
              <Gauge metric="temperature" value={currentMetrics.temperature} aria-label="Gauge de la température"/>
            </Card>
            <Card title="Température" category="graphiques">
              <Graphique data={historique} metrics={["temperature"]} alertZone={alertZones.temperature} aria-label="Graphique des température"/>
            </Card>
          </SliderWrapper>

          <SliderWrapper>
            <Card title="Humidité" category="graphiques">
              <Gauge metric="humidite" value={currentMetrics.humidite} aria-label="Gauge de l'humidité"/>
            </Card>
            <Card title="Humidité" category="graphiques">
              <Graphique data={historique} metrics={["humidite"]} alertZone={alertZones.humidite} aria-label="Graphique de l'humidité"/>
            </Card>
          </SliderWrapper>

          <SliderWrapper>
            <Card title="Pression" category="graphiques">
              <Gauge metric="pressure" value={currentMetrics.pression} aria-label="Gauge de la pression"/>
            </Card>
            <Card title="Pression" category="graphiques">
              <Graphique data={historique} metrics={["pression"]} alertZone={alertZones.pression} aria-label="Graphique de la pression"/>
            </Card>
          </SliderWrapper>
        </section>
        </div>
      </div>
      </div>
    </main>
  );
}
