export interface Weather {
  temp: number;
  humidity: number;
  wind: number;
  rain: number;
}

export const LOCATIONS = ['Mysore, India', 'Mandya, India', 'Hassan, India', 'Bengaluru, India', 'Coorg, India'];

// Demonstration data only - not live weather.
export const WEATHER: Record<string, Weather> = {
  'Mysore, India': { temp: 31, humidity: 68, wind: 12, rain: 10 },
  'Mandya, India': { temp: 33, humidity: 62, wind: 10, rain: 5 },
  'Hassan, India': { temp: 27, humidity: 75, wind: 9, rain: 30 },
  'Bengaluru, India': { temp: 28, humidity: 70, wind: 14, rain: 20 },
  'Coorg, India': { temp: 24, humidity: 82, wind: 8, rain: 60 },
};

export const TIPS = [
  'Check leaf undersides for early signs of pests and maintain proper field drainage to keep crops healthy',
  'Water crops early in the morning so leaves dry quickly and fungal disease has less chance to spread',
  'Add compost or farmyard manure before sowing to keep the soil rich and hold moisture longer',
  'Rotate crops each season. Growing the same crop in one plot again and again invites pests and disease',
  'Sell when demand is high: check the price trend before you take produce to the market',
];
