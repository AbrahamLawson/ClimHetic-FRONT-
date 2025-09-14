export const norms = {
  temperature: {
    min: -10,
    max: 40,
    stops: [-10, 0, 15, 25, 35, 40], 
    colors: ['#dc3545', '#ffc107', '#28a745', '#ffc107', '#dc3545'],
    unit: '°C'
  },
  humidite: {
    min: 0,
    max: 100,
    stops: [0, 30, 60, 100], 
    colors: ['#dc3545', '#28a745', '#ffc107'],
    unit: '%'
  },
  pressure: {
    min: 950,
    max: 1050,
    stops: [950, 980, 1020, 1050], 
    colors: ['#dc3545', '#28a745', '#ffc107'],
    unit: 'hPa'
  }
};
