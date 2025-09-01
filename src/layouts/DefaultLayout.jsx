import { Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";

export default function DefaultLayout() {
  const { user } = useAuth();
  const isLoggedIn = !!user;
  const isAdmin = user?.email?.includes('admin'); // Simple admin check

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
