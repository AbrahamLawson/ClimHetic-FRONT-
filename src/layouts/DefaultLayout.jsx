import { Outlet } from "react-router-dom";
import { useAuth } from "../auth";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import AccessibilityButton from "../components/AccessibilityButton";

export default function DefaultLayout() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const isLoggedIn = isAuthenticated;

  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const toggleSidebar = () => setMobileSidebarOpen(prev => !prev);
  const closeSidebar = () => setMobileSidebarOpen(false);

  return (
    <div className="layout">
      <Navbar isLoggedIn={isLoggedIn} isAdmin={isAdmin} user={user} onBurgerClick={toggleSidebar} />

      <div className="content-wrapper">
        <Sidebar isLoggedIn={isLoggedIn} isAdmin={isAdmin} isMobile={isMobileSidebarOpen} onClose={closeSidebar}/>

        <main className="main-content">
          <Outlet />
        </main>
      </div>
        <AccessibilityButton />
      <Footer />
    </div>
  );
}
