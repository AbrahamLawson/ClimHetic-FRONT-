export const OWM_KEY = import.meta.env.VITE_OWM_API_KEY;
export const OWM_WEATHER = "https://api.openweathermap.org/data/2.5/weather";
export const OWM_GEO_DIRECT = "https://api.openweathermap.org/geo/1.0/direct";
export const OWM_GEO_REVERSE = "https://api.openweathermap.org/geo/1.0/reverse";

export const COOKIE_NAME = "preferredLocation";
export const POLL_MS = 10 * 60 * 1000; // 10 minutes
export const TEMP_DELTA = 1;           // ±1°C