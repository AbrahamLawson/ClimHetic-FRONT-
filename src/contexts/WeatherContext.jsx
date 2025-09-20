import { createContext, useContext } from "react";
import { useWeather } from "../hooks/useWeather";

const WeatherCtx = createContext(null);

export function WeatherProvider({ children }) {
  const value = useWeather();
  return <WeatherCtx.Provider value={value}>{children}</WeatherCtx.Provider>;
}

export function useWeatherContext() {
  const ctx = useContext(WeatherCtx);
  if (!ctx) throw new Error("useWeatherContext must be used inside <WeatherProvider>");
  return ctx;
}
