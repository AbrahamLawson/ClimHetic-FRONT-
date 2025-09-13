import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import DefaultLayout from "../layouts/DefaultLayout";
import ProtectedRoute from "../components/auth/ProtectedRoute";

import Dashboard from "../pages/Dashboard";
import Salles from "../pages/Salles";
import SalleDetail from "../pages/SalleDetail";
import Alertes from "../pages/Alertes";
import Capteurs from "../pages/Capteurs";
import Admin from "../pages/Admin";
import Ressources from "../pages/Ressources";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";

export default function AppRouter() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Routes publiques */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DefaultLayout><Dashboard /></DefaultLayout>} />
          
          {/* Routes protégées */}
          <Route element={<ProtectedRoute><DefaultLayout /></ProtectedRoute>}>
            <Route path="/salles" element={<Salles />} />
            <Route path="/salles/:id" element={<SalleDetail />} />
            <Route path="/alertes" element={<Alertes />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/capteurs" element={<Capteurs />} />
            <Route path="/ressources" element={<Ressources />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
