import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import DefaultLayout from "../layouts/DefaultLayout";
import ProtectedRoute from "../components/auth/ProtectedRoute";

import Dashboard from "../pages/Dashboard";
import Salles from "../pages/Salles";
import Alertes from "../pages/Alertes";
import Ressources from "../pages/Ressources";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";

export default function AppRouter() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Route publique */}
          <Route path="/login" element={<Login />} />
          
          {/* Routes protégées */}
          <Route element={<ProtectedRoute><DefaultLayout /></ProtectedRoute>}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/salles" element={<Salles />} />
            <Route path="/alertes" element={<Alertes />} />
            <Route path="/ressources" element={<Ressources />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
