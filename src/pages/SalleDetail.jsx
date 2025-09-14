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
    <div className="page-wrapper">
      <h1 className="salle-detail-title">Détails de la salle</h1>

      <div className="salle-detail-container">
        <div className="salle-fiche">
          <Card title="Informations" category="informations">
            <p><strong>Nom :</strong> {salle.nom}</p>
            <p><strong>Bâtiment :</strong> {salle.batiment}</p>
            <p><strong>État de confort :</strong> <Status value={salle.confort} /></p>
          </Card>
        </div>

        <div className="salle-graphs" data-testid="chart-container">

          <SliderWrapper>
            <Card title="Température" category="graphiques">
              <Gauge metric="temperature" value={currentMetrics.temperature} />
            </Card>
            <Card title="Température" category="graphiques">
              <Graphique data={historique} metrics={["temperature"]} alertZone={alertZones.temperature} />
            </Card>
          </SliderWrapper>

          <SliderWrapper>
            <Card title="Humidité" category="graphiques">
              <Gauge metric="humidite" value={currentMetrics.humidite} />
            </Card>
            <Card title="Humidité" category="graphiques">
              <Graphique data={historique} metrics={["humidite"]} alertZone={alertZones.humidite} />
            </Card>
          </SliderWrapper>

          <SliderWrapper>
            <Card title="Pression" category="graphiques">
              <Gauge metric="pressure" value={currentMetrics.pression} />
            </Card>
            <Card title="Pression" category="graphiques">
              <Graphique data={historique} metrics={["pression"]} alertZone={alertZones.pression} />
            </Card>
          </SliderWrapper>

        </div>
      </div>
    </div>
  );
}
