/**
 * ISO 3166-1 Numeric to Alpha-2 mapping
 * world-atlas@2 countries-110m.json uses numeric IDs (UN M49 codes).
 * Our ewasteData uses Alpha-2 codes.
 */
export const numericToAlpha2 = {
  '840': 'US', '156': 'CN', '356': 'IN', '276': 'DE', '826': 'GB',
  '392': 'JP', '076': 'BR', '250': 'FR', '643': 'RU', '410': 'KR',
  '380': 'IT', '036': 'AU', '124': 'CA', '484': 'MX', '360': 'ID',
  '792': 'TR', '682': 'SA', '710': 'ZA', '566': 'NG', '818': 'EG',
  '724': 'ES', '616': 'PL', '528': 'NL', '752': 'SE', '578': 'NO',
  '756': 'CH', '040': 'AT', '056': 'BE', '208': 'DK', '246': 'FI',
  '586': 'PK', '050': 'BD', '764': 'TH', '704': 'VN', '608': 'PH',
  '458': 'MY', '702': 'SG', '784': 'AE', '376': 'IL', '032': 'AR',
  '170': 'CO', '152': 'CL', '604': 'PE', '404': 'KE', '288': 'GH',
  '231': 'ET', '504': 'MA', '804': 'UA', '642': 'RO', '203': 'CZ',
  '554': 'NZ', '372': 'IE', '620': 'PT', '300': 'GR', '348': 'HU',
};

// Also keep alpha-3 fallback mapping for TopoJSON sources that use ISO_A3
export const alpha3ToAlpha2 = {
  USA: 'US', CHN: 'CN', IND: 'IN', DEU: 'DE', GBR: 'GB', JPN: 'JP',
  BRA: 'BR', FRA: 'FR', RUS: 'RU', KOR: 'KR', ITA: 'IT', AUS: 'AU',
  CAN: 'CA', MEX: 'MX', IDN: 'ID', TUR: 'TR', SAU: 'SA', ZAF: 'ZA',
  NGA: 'NG', EGY: 'EG', ESP: 'ES', POL: 'PL', NLD: 'NL', SWE: 'SE',
  NOR: 'NO', CHE: 'CH', AUT: 'AT', BEL: 'BE', DNK: 'DK', FIN: 'FI',
  PAK: 'PK', BGD: 'BD', THA: 'TH', VNM: 'VN', PHL: 'PH', MYS: 'MY',
  SGP: 'SG', ARE: 'AE', ISR: 'IL', ARG: 'AR', COL: 'CO', CHL: 'CL',
  PER: 'PE', KEN: 'KE', GHA: 'GH', ETH: 'ET', MAR: 'MA', UKR: 'UA',
  ROU: 'RO', CZE: 'CZ', NZL: 'NZ', IRL: 'IE', PRT: 'PT', GRC: 'GR',
  HUN: 'HU',
};

/**
 * Resolve a Geography object's country to an alpha-2 code.
 * Tries multiple strategies: ISO_A3 property, numeric ID, name property.
 */
export const resolveAlpha2 = (geo) => {
  // Strategy 1: ISO_A3 in properties (Natural Earth featured geojson)
  if (geo.properties?.ISO_A3 && alpha3ToAlpha2[geo.properties.ISO_A3]) {
    return alpha3ToAlpha2[geo.properties.ISO_A3];
  }
  
  // Strategy 2: Numeric ID (world-atlas@2)
  if (geo.id !== undefined && geo.id !== null) {
    const numericStr = String(geo.id).padStart(3, '0');
    if (numericToAlpha2[numericStr]) {
      return numericToAlpha2[numericStr];
    }
  }
  
  // Strategy 3: Try the id as alpha-3 directly
  if (geo.id && alpha3ToAlpha2[geo.id]) {
    return alpha3ToAlpha2[geo.id];
  }
  return null;
};
