export const norms = {
  temperature: {
    min: -10,
    max: 40,
    stops: [-10, 0, 15, 25, 35, 40], 
    colors: [
      'var(--danger)',      
      'var(--warning)',     
      'var(--success)',     
      'var(--warning)',     
      'var(--danger)'       
    ],
    unit: '°C'
  },
  humidite: {
    min: 0,
    max: 100,
    stops: [0, 30, 60, 100], 
    colors: [
      'var(--danger)',      
      'var(--success)',     
      'var(--warning)'     
    ],
    unit: '%'
  },
  pressure: {
    min: 950,
    max: 1050,
    stops: [950, 980, 1020, 1050], 
    colors: [
      'var(--danger)',      
      'var(--success)',     
      'var(--warning)'      
    ],
    unit: 'hPa'
  }
};
