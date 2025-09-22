// Main exports for ClimHetic application

// Authentication module
export * from './auth';

// Contexts
export { PreferencesProvider, PreferencesContext } from './contexts/PreferencesContext';
export { WeatherProvider, WeatherContext } from './contexts/WeatherContext';

// Services
export { default as alertService } from './services/alertService';
export { default as capteurService } from './services/capteurService';
export { default as adminSalleService } from './services/AdminSalle';

// Components
export { default as Card } from './components/Card';
export { default as Filter } from './components/Filter';
export { default as Footer } from './components/Footer';
export { default as Gauge } from './components/Gauge';
export { default as Graphique } from './components/Graphique';
export { default as Navbar } from './components/Navbar';
export { default as Searchbar } from './components/Searchbar';
export { default as Sidebar } from './components/Sidebar';
export { default as StatCard } from './components/StatCard';
export { default as Status } from './components/Status';
export { default as Tableau } from './components/Tableau';

// Form components
export { default as Form } from './components/form/Form';
export { default as FormModal } from './components/form/FormModal';

// Alert components
export { default as AlertItem } from './components/alerts/AlertItem';
export { default as AlertList } from './components/alerts/AlertList';
export { default as AlertModal } from './components/alerts/AlertModal';

// Weather components
export { default as WeatherCard } from './components/weather/WeatherCard';
export { default as WeatherControls } from './components/weather/WeatherControls';
export { default as WeatherDisplay } from './components/weather/WeatherDisplay';

// Layouts
export { default as DefaultLayout } from './layouts/DefaultLayout';

// Pages
export { default as Dashboard } from './pages/Dashboard';
export { default as Salles } from './pages/Salles';
export { default as SalleDetail } from './pages/SalleDetail';
export { default as Ressources } from './pages/Ressources';
export { default as Alertes } from './pages/Alertes';
export { default as Capteurs } from './pages/Capteurs';
export { default as Parametres } from './pages/Parametres';
export { default as Admin } from './pages/Admin';
export { default as Login } from './pages/Login';
export { default as NotFound } from './pages/NotFound';
