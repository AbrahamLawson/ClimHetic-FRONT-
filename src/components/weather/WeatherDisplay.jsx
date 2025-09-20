export default function WeatherDisplay({ locLabel, weather, lastUpdated }) {
    if (!weather) return null;
    const icon = weather?.icon ? `https://openweathermap.org/img/wn/${weather.icon}@2x.png` : null;
  
    return (
      <>
        <p style={{ marginTop: 0, marginBottom: 8 }}>{locLabel}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
          {icon && <img src={icon} alt={weather?.description || "icone meteo"} width={48} height={48} />}
          <div>
            <div style={{ fontSize: 28, fontWeight: 800 }}>{Math.round(weather?.temp)}°C</div>
            <div style={{ opacity: 0.75 }}>Ressenti {Math.round(weather?.feelsLike)}°C • {weather?.description}</div>
            {lastUpdated && (
              <div style={{ opacity: 0.6, fontSize: 12, marginTop: 2 }}>
                MAJ {lastUpdated.toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>
      </>
    );
  }
  