import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function DefaultLayout() {
  const isLoggedIn = false;
  const isAdmin = false;

  return (
    <div>
      <header>
        <Navbar isLoggedIn={isLoggedIn} isAdmin={isAdmin} />
      </header>

      <main style={{ padding: "1rem" }}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
