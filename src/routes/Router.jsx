import { BrowserRouter, Routes, Route } from "react-router-dom";
import DefaultLayout from "../layouts/DefaultLayout";

import Dashboard from "../pages/Dashboard";
import Salles from "../pages/Salles";
import Alertes from "../pages/Alertes";
import Ressources from "../pages/Ressources";
import NotFound from "../pages/NotFound";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DefaultLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/salles" element={<Salles />} />
          <Route path="/alertes" element={<Alertes />} />
          <Route path="/ressources" element={<Ressources />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
