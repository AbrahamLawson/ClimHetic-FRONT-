import { useAuth } from "../contexts/AuthContext";

export default function Ressources() {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <main className="page-wrapper" tabIndex={-1}>
      <a href="#main-content" className="skip-link visually-hidden">
        Aller au contenu principal
      </a>
      <div id="main-content" tabIndex={-1}>
      <h1>Ressources</h1>
      
      <div className="resources-content">
        <div className="resource-section">
          <h2>Documentation</h2>
          <ul>
            <li><a href="#" target="_blank">Guide utilisateur ClimHetic</a></li>
            <li><a href="#" target="_blank">FAQ - Questions fréquentes</a></li>
            <li><a href="#" target="_blank">Tutoriels vidéo</a></li>
          </ul>
        </div>

        <div className="resource-section">
          <h2>Contacts</h2>
          <div className="contact-info">
            <p><strong>Support technique :</strong> support@climhetic.fr</p>
            <p><strong>Téléphone :</strong> +33 1 23 45 67 89</p>
            <p><strong>Horaires :</strong> Lun-Ven 9h-18h</p>
          </div>
        </div>

        {isAuthenticated && (
          <div className="resource-section">
            <h2>Ressources utilisateur</h2>
            <ul>
              <li><a href="#" target="_blank">Rapports personnalisés</a></li>
              <li><a href="#" target="_blank">Historique des données</a></li>
              <li><a href="#" target="_blank">Paramètres de notification</a></li>
            </ul>
          </div>
        )}

        {isAdmin && (
          <div className="resource-section">
            <h2>Ressources administrateur</h2>
            <ul>
              <li><a href="#" target="_blank">Guide d'administration</a></li>
              <li><a href="#" target="_blank">Configuration système</a></li>
              <li><a href="#" target="_blank">Logs système</a></li>
              <li><a href="#" target="_blank">Sauvegarde et restauration</a></li>
            </ul>
          </div>
        )}
      </div>
      </div>
    </main>
  );
}