import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";

export default function DefaultLayout() {
  const isLoggedIn = false;
  const isAdmin = false;

  return (
    <div className="layout">
      <Navbar isLoggedIn={isLoggedIn} isAdmin={isAdmin} />

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
