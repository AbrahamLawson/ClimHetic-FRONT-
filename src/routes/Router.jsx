import { BrowserRouter, Routes, Route } from "react-router-dom";
import DefaultLayout from "../layouts/DefaultLayout";

function Page({ name }) {
  return <h1>{name} - en construction</h1>;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DefaultLayout />}>
          <Route path="/dashboard" element={<Page name="Dashboard" />} />
          <Route path="/salles" element={<Page name="Salles" />} />
          <Route path="/salle/:id" element={<Page name="Salle Détail" />} />
          <Route path="/alertes" element={<Page name="Alertes" />} />
          <Route path="/ressources" element={<Page name="Ressources" />} />
          <Route path="/admin" element={<Page name="Admin" />} />
          <Route path="/login" element={<Page name="Login" />} />
          <Route path="/comparaison" element={<Page name="Comparaison" />} />
          <Route path="/profil" element={<Page name="Profil" />} />
          <Route path="*" element={<Page name="404 Not Found" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
