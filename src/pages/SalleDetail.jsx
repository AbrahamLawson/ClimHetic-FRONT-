// export default function Salle() {
//   return <h1>Détail de salle</h1>;
// }

import { useParams } from "react-router-dom";
import Graphique from "../components/Graphique";
import Card from "../components/Card";
import Status from "../components/Status";
import "../styles/form.css";
import "../styles/global.css";
import "../styles/salle.css"; 

export default function SalleDetail() {
  const { id } = useParams();

  // infos de la salle à remplacer avec celle dispo dans la bdd I
  const salle = {
    id,
    nom: "Salle 101",
    batiment: "Bâtiment A",
    confort: "Success",
  };

  // fake données pour les graphiques à remplacer avec celle dispo dans la bdd
  const data = [
    { time: "10:00", temperature: 22, humidite: 45, pression: 1012 },
    { time: "11:00", temperature: 23, humidite: 50, pression: 1010 },
    { time: "12:00", temperature: 24, humidite: 55, pression: 1008 },
    { time: "13:00", temperature: 23, humidite: 52, pression: 1009 },
  ];

  return (
    <div className="page-wrapper">
      <h1 className="salle-detail-title">Détails de la salle</h1>

      <div className="salle-detail-container">
        <div className="salle-fiche">
          <Card title="Informations" category="informations">
            <p><strong>Nom :</strong> {salle.nom}</p>
            <p><strong>Bâtiment :</strong> {salle.batiment}</p>
            <p>
              <strong>État de confort :</strong> <Status value={salle.confort} />
            </p>
          </Card>
        </div>

        <div className="salle-graphs" data-testid="chart-container">
          <Card title="Température" category="graphiques" fullWidth>
            <Graphique data={data} metrics={["temperature"]} alertZone={{ min: 18, max: 26 }} />
          </Card>

          <Card title="Humidité" category="graphiques" fullWidth>
            <Graphique data={data} metrics={["humidite"]} alertZone={{ min: 30, max: 60 }} />
          </Card>

          <Card title="Pression" category="graphiques" fullWidth>
            <Graphique data={data} metrics={["pression"]} alertZone={{ min: 1000, max: 1020 }} />
          </Card>
        </div>
      </div>
    </div>
  );
}