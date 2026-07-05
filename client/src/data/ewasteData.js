/**
 * Global E-Waste Data by Country
 * Source: UN Global E-Waste Monitor 2024 (data year: 2022)
 * Published: March 2024 by ITU / UNITAR
 * 
 * Fields:
 *   name          — Country name
 *   ewasteKt      — Annual e-waste generated (kilotons)
 *   perCapitaKg   — Per-capita e-waste (kg/inhabitant)
 *   collectionRate — Documented formal collection & recycling rate (%)
 *   yoyGrowth     — Year-over-year growth in e-waste generation (%)
 *   topCategories  — Top 3 e-waste categories by volume
 *   population    — Approximate population (millions)
 *   region        — UN region grouping
 */

export const DATA_YEAR = 2022;
export const DATA_SOURCE = 'UN Global E-Waste Monitor 2024 (ITU / UNITAR)';
export const LAST_UPDATED = '2024-03-20';

export const ewasteByCountry = {
  US: {
    name: 'United States',
    ewasteKt: 7200,
    perCapitaKg: 21.6,
    collectionRate: 15,
    yoyGrowth: 2.1,
    topCategories: ['Small Equipment', 'Screens & Monitors', 'Large Equipment'],
    population: 333,
    region: 'Americas',
  },
  CN: {
    name: 'China',
    ewasteKt: 10800,
    perCapitaKg: 7.6,
    collectionRate: 22,
    yoyGrowth: 3.5,
    topCategories: ['Large Equipment', 'Small Equipment', 'Temperature Equipment'],
    population: 1412,
    region: 'Asia',
  },
  IN: {
    name: 'India',
    ewasteKt: 4200,
    perCapitaKg: 3.0,
    collectionRate: 5,
    yoyGrowth: 4.2,
    topCategories: ['Small Equipment', 'Screens & Monitors', 'Small IT'],
    population: 1408,
    region: 'Asia',
  },
  DE: {
    name: 'Germany',
    ewasteKt: 1850,
    perCapitaKg: 22.2,
    collectionRate: 44,
    yoyGrowth: 1.2,
    topCategories: ['Large Equipment', 'Small Equipment', 'Temperature Equipment'],
    population: 83,
    region: 'Europe',
  },
  GB: {
    name: 'United Kingdom',
    ewasteKt: 1550,
    perCapitaKg: 23.0,
    collectionRate: 40,
    yoyGrowth: 1.5,
    topCategories: ['Small Equipment', 'Large Equipment', 'Small IT'],
    population: 67,
    region: 'Europe',
  },
  JP: {
    name: 'Japan',
    ewasteKt: 2600,
    perCapitaKg: 20.7,
    collectionRate: 32,
    yoyGrowth: 0.8,
    topCategories: ['Large Equipment', 'Small Equipment', 'Temperature Equipment'],
    population: 125,
    region: 'Asia',
  },
  BR: {
    name: 'Brazil',
    ewasteKt: 2300,
    perCapitaKg: 10.8,
    collectionRate: 3,
    yoyGrowth: 3.1,
    topCategories: ['Small Equipment', 'Large Equipment', 'Screens & Monitors'],
    population: 214,
    region: 'Americas',
  },
  FR: {
    name: 'France',
    ewasteKt: 1580,
    perCapitaKg: 23.1,
    collectionRate: 45,
    yoyGrowth: 1.4,
    topCategories: ['Large Equipment', 'Small Equipment', 'Temperature Equipment'],
    population: 68,
    region: 'Europe',
  },
  RU: {
    name: 'Russia',
    ewasteKt: 1800,
    perCapitaKg: 12.4,
    collectionRate: 5,
    yoyGrowth: 1.8,
    topCategories: ['Large Equipment', 'Small Equipment', 'Temperature Equipment'],
    population: 145,
    region: 'Europe',
  },
  KR: {
    name: 'South Korea',
    ewasteKt: 960,
    perCapitaKg: 18.6,
    collectionRate: 35,
    yoyGrowth: 2.0,
    topCategories: ['Small Equipment', 'Screens & Monitors', 'Small IT'],
    population: 52,
    region: 'Asia',
  },
  IT: {
    name: 'Italy',
    ewasteKt: 1220,
    perCapitaKg: 20.5,
    collectionRate: 38,
    yoyGrowth: 1.3,
    topCategories: ['Large Equipment', 'Small Equipment', 'Temperature Equipment'],
    population: 59,
    region: 'Europe',
  },
  AU: {
    name: 'Australia',
    ewasteKt: 640,
    perCapitaKg: 24.9,
    collectionRate: 18,
    yoyGrowth: 2.3,
    topCategories: ['Small Equipment', 'Large Equipment', 'Screens & Monitors'],
    population: 26,
    region: 'Oceania',
  },
  CA: {
    name: 'Canada',
    ewasteKt: 780,
    perCapitaKg: 20.2,
    collectionRate: 20,
    yoyGrowth: 1.9,
    topCategories: ['Small Equipment', 'Large Equipment', 'Small IT'],
    population: 39,
    region: 'Americas',
  },
  MX: {
    name: 'Mexico',
    ewasteKt: 1220,
    perCapitaKg: 9.4,
    collectionRate: 3,
    yoyGrowth: 3.2,
    topCategories: ['Small Equipment', 'Large Equipment', 'Screens & Monitors'],
    population: 130,
    region: 'Americas',
  },
  ID: {
    name: 'Indonesia',
    ewasteKt: 1830,
    perCapitaKg: 6.6,
    collectionRate: 2,
    yoyGrowth: 4.0,
    topCategories: ['Small Equipment', 'Large Equipment', 'Screens & Monitors'],
    population: 276,
    region: 'Asia',
  },
  TR: {
    name: 'Turkey',
    ewasteKt: 920,
    perCapitaKg: 10.8,
    collectionRate: 8,
    yoyGrowth: 2.5,
    topCategories: ['Large Equipment', 'Small Equipment', 'Temperature Equipment'],
    population: 85,
    region: 'Europe',
  },
  SA: {
    name: 'Saudi Arabia',
    ewasteKt: 590,
    perCapitaKg: 16.4,
    collectionRate: 2,
    yoyGrowth: 3.8,
    topCategories: ['Temperature Equipment', 'Large Equipment', 'Small Equipment'],
    population: 36,
    region: 'Asia',
  },
  ZA: {
    name: 'South Africa',
    ewasteKt: 520,
    perCapitaKg: 8.6,
    collectionRate: 6,
    yoyGrowth: 3.0,
    topCategories: ['Small Equipment', 'Small IT', 'Screens & Monitors'],
    population: 60,
    region: 'Africa',
  },
  NG: {
    name: 'Nigeria',
    ewasteKt: 850,
    perCapitaKg: 3.9,
    collectionRate: 1,
    yoyGrowth: 4.5,
    topCategories: ['Small Equipment', 'Screens & Monitors', 'Small IT'],
    population: 218,
    region: 'Africa',
  },
  EG: {
    name: 'Egypt',
    ewasteKt: 620,
    perCapitaKg: 5.9,
    collectionRate: 2,
    yoyGrowth: 3.6,
    topCategories: ['Small Equipment', 'Large Equipment', 'Screens & Monitors'],
    population: 105,
    region: 'Africa',
  },
  ES: {
    name: 'Spain',
    ewasteKt: 970,
    perCapitaKg: 20.5,
    collectionRate: 42,
    yoyGrowth: 1.2,
    topCategories: ['Large Equipment', 'Small Equipment', 'Temperature Equipment'],
    population: 47,
    region: 'Europe',
  },
  PL: {
    name: 'Poland',
    ewasteKt: 520,
    perCapitaKg: 13.7,
    collectionRate: 36,
    yoyGrowth: 1.6,
    topCategories: ['Large Equipment', 'Small Equipment', 'Temperature Equipment'],
    population: 38,
    region: 'Europe',
  },
  NL: {
    name: 'Netherlands',
    ewasteKt: 420,
    perCapitaKg: 24.0,
    collectionRate: 52,
    yoyGrowth: 1.1,
    topCategories: ['Small Equipment', 'Large Equipment', 'Temperature Equipment'],
    population: 17,
    region: 'Europe',
  },
  SE: {
    name: 'Sweden',
    ewasteKt: 260,
    perCapitaKg: 25.0,
    collectionRate: 55,
    yoyGrowth: 1.0,
    topCategories: ['Small Equipment', 'Large Equipment', 'Temperature Equipment'],
    population: 10,
    region: 'Europe',
  },
  NO: {
    name: 'Norway',
    ewasteKt: 150,
    perCapitaKg: 27.6,
    collectionRate: 58,
    yoyGrowth: 0.9,
    topCategories: ['Small Equipment', 'Large Equipment', 'Temperature Equipment'],
    population: 5,
    region: 'Europe',
  },
  CH: {
    name: 'Switzerland',
    ewasteKt: 230,
    perCapitaKg: 26.3,
    collectionRate: 59,
    yoyGrowth: 0.8,
    topCategories: ['Small Equipment', 'Large Equipment', 'Small IT'],
    population: 9,
    region: 'Europe',
  },
  AT: {
    name: 'Austria',
    ewasteKt: 230,
    perCapitaKg: 25.6,
    collectionRate: 50,
    yoyGrowth: 1.1,
    topCategories: ['Large Equipment', 'Small Equipment', 'Temperature Equipment'],
    population: 9,
    region: 'Europe',
  },
  BE: {
    name: 'Belgium',
    ewasteKt: 280,
    perCapitaKg: 24.2,
    collectionRate: 48,
    yoyGrowth: 1.0,
    topCategories: ['Small Equipment', 'Large Equipment', 'Temperature Equipment'],
    population: 12,
    region: 'Europe',
  },
  DK: {
    name: 'Denmark',
    ewasteKt: 160,
    perCapitaKg: 27.1,
    collectionRate: 53,
    yoyGrowth: 0.9,
    topCategories: ['Small Equipment', 'Large Equipment', 'Temperature Equipment'],
    population: 6,
    region: 'Europe',
  },
  FI: {
    name: 'Finland',
    ewasteKt: 140,
    perCapitaKg: 25.3,
    collectionRate: 47,
    yoyGrowth: 1.0,
    topCategories: ['Small Equipment', 'Large Equipment', 'Small IT'],
    population: 6,
    region: 'Europe',
  },
  PK: {
    name: 'Pakistan',
    ewasteKt: 800,
    perCapitaKg: 3.5,
    collectionRate: 1,
    yoyGrowth: 4.8,
    topCategories: ['Small Equipment', 'Screens & Monitors', 'Small IT'],
    population: 231,
    region: 'Asia',
  },
  BD: {
    name: 'Bangladesh',
    ewasteKt: 420,
    perCapitaKg: 2.5,
    collectionRate: 1,
    yoyGrowth: 5.0,
    topCategories: ['Small Equipment', 'Small IT', 'Screens & Monitors'],
    population: 170,
    region: 'Asia',
  },
  TH: {
    name: 'Thailand',
    ewasteKt: 620,
    perCapitaKg: 8.8,
    collectionRate: 5,
    yoyGrowth: 3.2,
    topCategories: ['Small Equipment', 'Large Equipment', 'Temperature Equipment'],
    population: 72,
    region: 'Asia',
  },
  VN: {
    name: 'Vietnam',
    ewasteKt: 680,
    perCapitaKg: 6.9,
    collectionRate: 3,
    yoyGrowth: 4.1,
    topCategories: ['Small Equipment', 'Screens & Monitors', 'Small IT'],
    population: 98,
    region: 'Asia',
  },
  PH: {
    name: 'Philippines',
    ewasteKt: 490,
    perCapitaKg: 4.3,
    collectionRate: 2,
    yoyGrowth: 3.9,
    topCategories: ['Small Equipment', 'Small IT', 'Screens & Monitors'],
    population: 114,
    region: 'Asia',
  },
  MY: {
    name: 'Malaysia',
    ewasteKt: 380,
    perCapitaKg: 11.5,
    collectionRate: 6,
    yoyGrowth: 3.0,
    topCategories: ['Small Equipment', 'Large Equipment', 'Temperature Equipment'],
    population: 33,
    region: 'Asia',
  },
  SG: {
    name: 'Singapore',
    ewasteKt: 150,
    perCapitaKg: 26.0,
    collectionRate: 25,
    yoyGrowth: 1.5,
    topCategories: ['Small Equipment', 'Small IT', 'Screens & Monitors'],
    population: 6,
    region: 'Asia',
  },
  AE: {
    name: 'UAE',
    ewasteKt: 230,
    perCapitaKg: 23.4,
    collectionRate: 5,
    yoyGrowth: 3.5,
    topCategories: ['Temperature Equipment', 'Small Equipment', 'Large Equipment'],
    population: 10,
    region: 'Asia',
  },
  IL: {
    name: 'Israel',
    ewasteKt: 200,
    perCapitaKg: 21.0,
    collectionRate: 30,
    yoyGrowth: 1.8,
    topCategories: ['Small Equipment', 'Small IT', 'Screens & Monitors'],
    population: 10,
    region: 'Asia',
  },
  AR: {
    name: 'Argentina',
    ewasteKt: 550,
    perCapitaKg: 12.0,
    collectionRate: 3,
    yoyGrowth: 2.8,
    topCategories: ['Small Equipment', 'Large Equipment', 'Temperature Equipment'],
    population: 46,
    region: 'Americas',
  },
  CO: {
    name: 'Colombia',
    ewasteKt: 400,
    perCapitaKg: 7.8,
    collectionRate: 4,
    yoyGrowth: 3.4,
    topCategories: ['Small Equipment', 'Large Equipment', 'Screens & Monitors'],
    population: 52,
    region: 'Americas',
  },
  CL: {
    name: 'Chile',
    ewasteKt: 210,
    perCapitaKg: 10.8,
    collectionRate: 5,
    yoyGrowth: 2.6,
    topCategories: ['Small Equipment', 'Large Equipment', 'Small IT'],
    population: 19,
    region: 'Americas',
  },
  PE: {
    name: 'Peru',
    ewasteKt: 240,
    perCapitaKg: 7.2,
    collectionRate: 2,
    yoyGrowth: 3.5,
    topCategories: ['Small Equipment', 'Large Equipment', 'Screens & Monitors'],
    population: 33,
    region: 'Americas',
  },
  KE: {
    name: 'Kenya',
    ewasteKt: 130,
    perCapitaKg: 2.4,
    collectionRate: 1,
    yoyGrowth: 4.6,
    topCategories: ['Small Equipment', 'Small IT', 'Screens & Monitors'],
    population: 55,
    region: 'Africa',
  },
  GH: {
    name: 'Ghana',
    ewasteKt: 80,
    perCapitaKg: 2.5,
    collectionRate: 1,
    yoyGrowth: 5.2,
    topCategories: ['Small Equipment', 'Screens & Monitors', 'Small IT'],
    population: 33,
    region: 'Africa',
  },
  ET: {
    name: 'Ethiopia',
    ewasteKt: 100,
    perCapitaKg: 0.8,
    collectionRate: 0.5,
    yoyGrowth: 5.5,
    topCategories: ['Small Equipment', 'Small IT', 'Screens & Monitors'],
    population: 120,
    region: 'Africa',
  },
  MA: {
    name: 'Morocco',
    ewasteKt: 160,
    perCapitaKg: 4.3,
    collectionRate: 2,
    yoyGrowth: 3.4,
    topCategories: ['Small Equipment', 'Large Equipment', 'Temperature Equipment'],
    population: 37,
    region: 'Africa',
  },
  UA: {
    name: 'Ukraine',
    ewasteKt: 380,
    perCapitaKg: 8.7,
    collectionRate: 7,
    yoyGrowth: 1.4,
    topCategories: ['Large Equipment', 'Small Equipment', 'Temperature Equipment'],
    population: 44,
    region: 'Europe',
  },
  RO: {
    name: 'Romania',
    ewasteKt: 210,
    perCapitaKg: 10.9,
    collectionRate: 22,
    yoyGrowth: 1.8,
    topCategories: ['Large Equipment', 'Small Equipment', 'Temperature Equipment'],
    population: 19,
    region: 'Europe',
  },
  CZ: {
    name: 'Czech Republic',
    ewasteKt: 200,
    perCapitaKg: 18.7,
    collectionRate: 40,
    yoyGrowth: 1.3,
    topCategories: ['Large Equipment', 'Small Equipment', 'Temperature Equipment'],
    population: 11,
    region: 'Europe',
  },
  NZ: {
    name: 'New Zealand',
    ewasteKt: 130,
    perCapitaKg: 25.5,
    collectionRate: 14,
    yoyGrowth: 2.0,
    topCategories: ['Small Equipment', 'Large Equipment', 'Screens & Monitors'],
    population: 5,
    region: 'Oceania',
  },
  IE: {
    name: 'Ireland',
    ewasteKt: 130,
    perCapitaKg: 26.0,
    collectionRate: 46,
    yoyGrowth: 1.2,
    topCategories: ['Small Equipment', 'Large Equipment', 'Small IT'],
    population: 5,
    region: 'Europe',
  },
  PT: {
    name: 'Portugal',
    ewasteKt: 210,
    perCapitaKg: 20.4,
    collectionRate: 38,
    yoyGrowth: 1.1,
    topCategories: ['Large Equipment', 'Small Equipment', 'Temperature Equipment'],
    population: 10,
    region: 'Europe',
  },
  GR: {
    name: 'Greece',
    ewasteKt: 180,
    perCapitaKg: 17.0,
    collectionRate: 30,
    yoyGrowth: 1.4,
    topCategories: ['Large Equipment', 'Small Equipment', 'Temperature Equipment'],
    population: 11,
    region: 'Europe',
  },
  HU: {
    name: 'Hungary',
    ewasteKt: 140,
    perCapitaKg: 14.3,
    collectionRate: 32,
    yoyGrowth: 1.5,
    topCategories: ['Large Equipment', 'Small Equipment', 'Temperature Equipment'],
    population: 10,
    region: 'Europe',
  },
};

// Regional aggregation helper
export const getRegionTotals = () => {
  const regions = {};
  Object.values(ewasteByCountry).forEach((c) => {
    if (!regions[c.region]) {
      regions[c.region] = { totalKt: 0, countries: 0, avgPerCapita: 0, perCapitaSum: 0 };
    }
    regions[c.region].totalKt += c.ewasteKt;
    regions[c.region].countries += 1;
    regions[c.region].perCapitaSum += c.perCapitaKg;
  });
  Object.keys(regions).forEach((r) => {
    regions[r].avgPerCapita = +(regions[r].perCapitaSum / regions[r].countries).toFixed(1);
    delete regions[r].perCapitaSum;
  });
  return regions;
};

// Get top N countries by e-waste generation
export const getTopCountries = (n = 10) => {
  return Object.entries(ewasteByCountry)
    .sort((a, b) => b[1].ewasteKt - a[1].ewasteKt)
    .slice(0, n)
    .map(([code, data]) => ({ code, ...data }));
};

// Heatmap color scale (0 = low/teal → 1 = high/red)
export const getHeatColor = (ewasteKt) => {
  const maxKt = 10800; // China
  const ratio = Math.min(ewasteKt / maxKt, 1);
  
  if (ratio < 0.05) return '#0d9488';       // teal-600
  if (ratio < 0.1) return '#14b8a6';        // teal-500
  if (ratio < 0.2) return '#22c55e';        // green-500
  if (ratio < 0.35) return '#84cc16';       // lime-500
  if (ratio < 0.5) return '#eab308';        // yellow-500
  if (ratio < 0.65) return '#f59e0b';       // amber-500
  if (ratio < 0.8) return '#f97316';        // orange-500
  return '#ef4444';                          // red-500
};

export const getPerCapitaColor = (kgPerCapita) => {
  if (kgPerCapita < 3) return '#0d9488';
  if (kgPerCapita < 6) return '#14b8a6';
  if (kgPerCapita < 10) return '#22c55e';
  if (kgPerCapita < 15) return '#84cc16';
  if (kgPerCapita < 20) return '#eab308';
  if (kgPerCapita < 25) return '#f59e0b';
  return '#f97316';
};
