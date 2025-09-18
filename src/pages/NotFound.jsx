// export default function NotFound() {
//   return <h1>404 - Page Not Found</h1>;
// }

import { useNavigate } from "react-router-dom";
import { CircleX } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <main className="notfound-content " style={{ textAlign: "center", padding: "6rem" }} tabIndex={-1} aria-labelledby="notfound-title">
      <a href="#main-content" className="skip-link visually-hidden">
        Aller au contenu principal
      </a>

      <div id="main-content" tabIndex={-1}>
      <div className="notfound-icon">
        <CircleX size={75} color="var(--inactive)" />
      </div>

      <h1 style={{ color: "var(--inactive)", fontSize: "3rem", marginBottom: "1rem" }}>
        Erreur 404
      </h1>

      <p style={{ fontSize: "1.25rem", marginBottom: "0.5rem", color: "var(--primary-light)" }}>
        Oups ! Votre capteur semble s'être égaré...
      </p>

      <p style={{ fontSize: "1rem", marginBottom: "1.5rem", color: "var(--primary-light)" }}>
        Cette page n'est pas disponible.
      </p>

      <button className="btn" onClick={() => navigate("/dashboard")}>
        Retour au Dashboard
      </button>
      </div>
    </main>
  );
}
