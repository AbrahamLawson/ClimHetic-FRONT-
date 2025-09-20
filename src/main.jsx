import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "./contexts/AuthContext";
import { PreferencesProvider } from "../src/contexts/PreferencesContext"; 
import AppRouter from "./routes/Router";
import './styles/global.css';
import './styles/auth.css';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <PreferencesProvider>  
        <AppRouter />
      </PreferencesProvider>
    </AuthProvider>
  </React.StrictMode>
);

