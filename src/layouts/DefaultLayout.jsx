import { Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";

export default function DefaultLayout() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const isLoggedIn = isAuthenticated;

  return (
    <div className="layout">
      <Navbar isLoggedIn={isLoggedIn} isAdmin={isAdmin} user={user} />

      <div className="content-wrapper">
        <Sidebar isLoggedIn={isLoggedIn} isAdmin={isAdmin} />

        <main className="main-content">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
}
