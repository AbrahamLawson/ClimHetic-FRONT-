import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DefaultLayout from "../layouts/DefaultLayout";
import Dashboard from "../pages/Dashboard";
import Salles from "../pages/Salles";
import SalleDetail from "../pages/SalleDetail";
import Ressources from "../pages/Ressources";
import Alertes from "../pages/Alertes";
import Capteurs from "../pages/Capteurs";
import Parametres from "../pages/Parametres";
import Admin from "../pages/Admin";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import { ProtectedRoute } from "../auth";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />
      },
      {
        path: "dashboard",
        element: <Dashboard />
      },
      {
        path: "salles",
        element: <Salles />
      },
      {
        path: "salles/:id",
        element: <SalleDetail />
      },
      {
        path: "ressources",
        element: <Ressources />
      },
      {
        path: "alertes",
        element: (
          <ProtectedRoute>
            <Alertes />
          </ProtectedRoute>
        )
      },
      {
        path: "capteurs",
        element: (
          <ProtectedRoute requiredRole="admin">
            <Capteurs />
          </ProtectedRoute>
        )
      },
      {
        path: "admin",
        element: (
          <ProtectedRoute requiredRole="admin">
            <Admin />
          </ProtectedRoute>
        )
      },
      {
        path: "parametres",
        element: (
          <ProtectedRoute requiredRole="admin">
            <Parametres />
          </ProtectedRoute>
        )
      },
      {
        path: "*",
        element: <NotFound />
      }
    ]
  }
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
