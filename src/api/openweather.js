import { OWM_KEY, OWM_WEATHER, OWM_GEO_DIRECT, OWM_GEO_REVERSE } from "../constants";

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function weatherByCoords(lat, lon) {
  if (!OWM_KEY) throw new Error("VITE_OWM_API_KEY manquante");
  const url = new URL(OWM_WEATHER);
  url.searchParams.set("lat", lat);
  url.searchParams.set("lon", lon);
  url.searchParams.set("units", "metric");
  url.searchParams.set("lang", "fr");
  url.searchParams.set("appid", OWM_KEY);

  const raw = await fetchJSON(url);
  return {
    coords: { lat: raw?.coord?.lat, lon: raw?.coord?.lon },
    location: { city: raw?.name, country: raw?.sys?.country },
    weather: {
      temp: raw?.main?.temp,
      feelsLike: raw?.main?.feels_like,
      humidity: raw?.main?.humidity,
      pressure: raw?.main?.pressure,
      windSpeed: raw?.wind?.speed,
      description: raw?.weather?.[0]?.description,
      icon: raw?.weather?.[0]?.icon,
    },
    timestamp: raw?.dt ? raw.dt * 1000 : Date.now(),
  };
}

export async function reverseGeocode(lat, lon) {
  if (!OWM_KEY) throw new Error("VITE_OWM_API_KEY manquante");
  const url = new URL(OWM_GEO_REVERSE);
  url.searchParams.set("lat", lat);
  url.searchParams.set("lon", lon);
  url.searchParams.set("limit", "1");
  url.searchParams.set("appid", OWM_KEY);

  const data = await fetchJSON(url);
  const best = Array.isArray(data) && data[0] ? data[0] : null;
  return best
    ? { lat: best.lat, lon: best.lon, label: [best.name, best.state, best.country].filter(Boolean).join(", ") }
    : { lat, lon, label: "Position détectée" };
}

export async function directGeocode(query, limit = 5) {
  if (!OWM_KEY) throw new Error("VITE_OWM_API_KEY manquante");
  const url = new URL(OWM_GEO_DIRECT);
  url.searchParams.set("q", query);
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("appid", OWM_KEY);

  const data = await fetchJSON(url);
  return (Array.isArray(data) ? data : []).map((it) => ({
    lat: it.lat,
    lon: it.lon,
    label: [it.name, it.state, it.country].filter(Boolean).join(", "),
  }));
}
