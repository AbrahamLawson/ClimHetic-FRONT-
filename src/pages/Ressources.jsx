import { useAuth } from "../auth";
import Card from "../components/Card";
import '../styles/ressources.css';

export default function Ressources() {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <main className="page-wrapper fade-in" tabIndex={-1}>
      <a href="#main-content" className="skip-link visually-hidden">
        Aller au contenu principal
      </a>

      <div id="main-content" tabIndex={-1} aria-labelledby="page-title">
        <h1 id="page-title">Ressources</h1>

        <div className="resources-grid">
          <Card title="Sources de données" category="data">
            <p>
              Les données utilisées dans l’application proviennent de services publics
              et d’APIs fiables :
            </p>
            <ul>
              <li>
                <a
                  className="external-link" 
                  href="https://openweathermap.org/api" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  OpenWeatherMap API (prévisions météo)
                </a>
              </li>
              <li>
                <a 
                  className="external-link"
                  href="https://www.data.gouv.fr/fr/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  data.gouv.fr (données publiques françaises)
                </a>
              </li>
            </ul>
          </Card>

          <Card title="Références officielles" category="docs">
            <p>
              Pour la partie méthodologie et réglementation, nous nous appuyons sur
              des sources reconnues :
            </p>
            <ul>
              <li>
                <a 
                  className="external-link"
                  href="https://www.ademe.fr/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  ADEME – Agence de la transition écologique
                </a>
              </li>
              <li>
                <a 
                  className="external-link"
                  href="https://www.ecologie.gouv.fr/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Ministère de la Transition écologique
                </a>
              </li>
              <li>
                <a 
                  className="external-link"
                  href="https://www.inrs.fr/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  INRS – Prévention des risques professionnels
                </a>
              </li>
              <li>
                <a 
                  className="external-link"
                  href="https://www.legifrance.gouv.fr/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Legifrance – Code du travail & Règlementation ERP
                </a>
              </li>
            </ul>
          </Card>

          <Card title="À propos de l’application" category="about" fullWidth>
            <p>
              Cette application vise à faciliter la gestion des normes de sécurité
              dans les établissements. Les sources listées ci-dessus permettent
              de garantir la transparence et la fiabilité des informations
              utilisées dans nos calculs et vérifications.
            </p>
            {isAuthenticated && (
              <p>
                En tant qu’utilisateur connecté, vous pouvez aussi consulter vos{" "}
                <a className="basic_link" href="/alertes">alertes</a>.
              </p>
            )}
          </Card>
        </div>
      </div>
    </main>
  );
}
