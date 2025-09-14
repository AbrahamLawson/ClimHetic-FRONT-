import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DefaultLayout from "../layouts/DefaultLayout";
import Dashboard from "../pages/Dashboard";
import Salles from "../pages/Salles";
import Ressources from "../pages/Ressources";
import Alertes from "../pages/Alertes";
import Capteurs from "../pages/Capteurs";
import Admin from "../pages/Admin";
import Login from "../pages/Login";
import ProtectedRoute from "../components/ProtectedRoute";

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
      }
    ]
  }
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
