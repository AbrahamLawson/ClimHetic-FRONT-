import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "./auth";
import { PreferencesProvider } from "./contexts/PreferencesContext"; 
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

