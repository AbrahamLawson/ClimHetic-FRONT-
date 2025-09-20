import { useEffect, useRef, useState } from "react";
import { COOKIE_NAME, POLL_MS, TEMP_DELTA } from "../constants";
import { setCookie, getCookie, delCookie } from "../utils/cookies";
import { weatherByCoords, reverseGeocode, directGeocode } from "../api/openweather";

export function useWeather() {
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);
  const [data, setData]     = useState(null);
  const [place, setPlace]   = useState(() => getCookie(COOKIE_NAME));
  const [askConfirm, setAskConfirm] = useState(false);
  const [accuracyInfo, setAccuracyInfo] = useState(null);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);

  const pollRef = useRef(null);

  const locLabel =
    place?.label ||
    (data?.location?.city
      ? `${data.location.city}${data.location.country ? `, ${data.location.country}` : ""}`
      : "Position détectée");

  const startPolling = (lat, lon) => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    fetchWeather(lat, lon, true);
    pollRef.current = setInterval(() => {
      if (document.hidden) return;
      fetchWeather(lat, lon, false);
    }, POLL_MS);
  };

  async function fetchWeather(lat, lon, force) {
    try {
      const fresh = await weatherByCoords(lat, lon);
      const prev = data;
      const prevT = prev?.weather?.temp;
      const nextT = fresh?.weather?.temp;

      const iconChanged = prev?.weather?.icon !== fresh?.weather?.icon;
      const descChanged = prev?.weather?.description !== fresh?.weather?.description;
      const tempChanged = force || !Number.isFinite(prevT) || !Number.isFinite(nextT)
        ? true
        : Math.abs(nextT - prevT) >= TEMP_DELTA;

      if (tempChanged || iconChanged || descChanged) {
        setData(fresh);
        setLastUpdated(new Date());
      }
      setError(null);
    } catch (e) {
      if (!data) setError("Impossible de récupérer la météo");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const fromCookie = place?.lat && place?.lon;
    if (fromCookie) {
      setLoading(false);
      startPolling(place.lat, place.lon);
      return;
    }

    if (!("geolocation" in navigator)) {
      setLoading(false);
      setError("La géolocalisation n'est pas supportée.");
      setIsSearchOpen(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        setAccuracyInfo(Math.round(coords.accuracy));
        const lat = coords.latitude, lon = coords.longitude;
        try {
          const rev = await reverseGeocode(lat, lon);
          setPlace(rev);
          setAskConfirm(coords.accuracy > 1000);
        } catch {
          setPlace({ lat, lon, label: "Position détectée" });
        } finally {
          setLoading(false);
          startPolling(lat, lon);
        }
      },
      () => {
        setLoading(false);
        setError("Permission de localisation refusée.");
        setIsSearchOpen(true);
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 }
    );

    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, []);

  async function runSearch(query) {
    if (!query?.trim()) return [];
    const results = await directGeocode(query.trim(), 5);
    setSearchResults(results);
    return results;
  }

  function confirmPlace(p) {
    const chosen = p ?? place;
    if (!chosen?.lat || !chosen?.lon) { setError("Coordonnées invalides"); return; }
    setPlace(chosen);
    setCookie(COOKIE_NAME, chosen, 180);
    setAskConfirm(false);
    setIsSearchOpen(false);
    startPolling(chosen.lat, chosen.lon);
  }

  function clearPlace() {
    delCookie(COOKIE_NAME);
    setPlace(null);
    setAskConfirm(false);
    setSearchResults([]);
    setIsSearchOpen(true);
    setData(null);
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
  }

  return {
    loading, error, data, weather: data?.weather, lastUpdated,
    place, locLabel, askConfirm, accuracyInfo,
    isSearchOpen, searchResults,
    openSearch: () => setIsSearchOpen(true),
    closeSearch: () => setIsSearchOpen(false),
    runSearch, confirmPlace, clearPlace,
  };
}