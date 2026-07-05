import React, { useState, memo, useCallback } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from 'react-simple-maps';
import { Search, X, Globe, TrendingUp, TrendingDown, Recycle, Users, BarChart3, Info, ArrowRight, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { ewasteByCountry, getHeatColor, getTopCountries, getRegionTotals, DATA_YEAR, DATA_SOURCE, LAST_UPDATED } from '../data/ewasteData';
import { resolveAlpha2 } from '../data/countryCodes';

// Natural Earth TopoJSON — free, lightweight, production-quality world map
// Use the Natural Earth featured GeoJSON (includes ISO_A3 properties for reliable matching)
const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const EWasteMap = () => {
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [activeView, setActiveView] = useState('total');
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState([20, 10]);

  const topCountries = getTopCountries(10);
  const regionTotals = getRegionTotals();

  // Global stats
  const totalGlobalEwaste = Object.values(ewasteByCountry).reduce((s, c) => s + c.ewasteKt, 0);
  const avgGlobalPerCapita = +(
    Object.values(ewasteByCountry).reduce((s, c) => s + c.perCapitaKg, 0) /
    Object.keys(ewasteByCountry).length
  ).toFixed(1);

  // Search filtering
  const searchResults = searchQuery.trim()
    ? Object.entries(ewasteByCountry)
        .filter(([, data]) => data.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 8)
    : [];

  const handleCountryClick = useCallback((alpha2Code) => {
    if (ewasteByCountry[alpha2Code]) {
      setSelectedCountry(alpha2Code);
    }
  }, []);

  const handleSearchSelect = (code) => {
    setSelectedCountry(code);
    setSearchQuery('');
  };

  const getCountryFillByAlpha2 = useCallback(
    (alpha2) => {
      if (!alpha2 || !ewasteByCountry[alpha2]) return '#1e293b';

      const data = ewasteByCountry[alpha2];
      if (activeView === 'perCapita') {
        const kg = data.perCapitaKg;
        if (kg < 3) return '#0d9488';
        if (kg < 6) return '#14b8a6';
        if (kg < 10) return '#22c55e';
        if (kg < 15) return '#84cc16';
        if (kg < 20) return '#eab308';
        if (kg < 25) return '#f59e0b';
        return '#f97316';
      }
      return getHeatColor(data.ewasteKt);
    },
    [activeView]
  );

  const handleZoomIn = () => setZoom((z) => Math.min(z * 1.5, 8));
  const handleZoomOut = () => setZoom((z) => Math.max(z / 1.5, 1));
  const handleReset = () => {
    setZoom(1);
    setCenter([20, 10]);
  };

  const countryData = selectedCountry ? ewasteByCountry[selectedCountry] : null;

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-emerald-500/5 blur-[150px]"></div>
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-cyan-500/5 blur-[120px]"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold text-cyan-400">
            <Globe className="h-3.5 w-3.5" />
            <span>Interactive Global E-Waste Tracker</span>
          </div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Global E-Waste <span className="text-gradient-primary">Heat Map</span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm text-slate-400">
            Explore country-wise annual electronic waste generation. Data from the{' '}
            <span className="text-cyan-400 font-medium">{DATA_SOURCE}</span>.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 animate-fade-in-up delay-200">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 text-center hover-glow">
            <p className="text-lg font-extrabold text-emerald-400 font-display animate-count-up">
              {(totalGlobalEwaste / 1000).toFixed(1)}M
            </p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">
              Tons Tracked ({DATA_YEAR})
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 text-center hover-glow">
            <p className="text-lg font-extrabold text-cyan-400 font-display animate-count-up delay-100">
              {Object.keys(ewasteByCountry).length}
            </p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">
              Countries Covered
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 text-center hover-glow">
            <p className="text-lg font-extrabold text-amber-400 font-display animate-count-up delay-200">
              {avgGlobalPerCapita} kg
            </p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">
              Avg Per Capita
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 text-center hover-glow">
            <p className="text-lg font-extrabold text-violet-400 font-display animate-count-up delay-300">
              +3.2%
            </p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">
              Avg Annual Growth
            </p>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6 animate-fade-in-up delay-300">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search country..."
              className="block w-full rounded-xl border border-slate-800 bg-slate-900/60 py-2.5 pl-10 pr-3 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
            />
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 rounded-xl border border-slate-800 bg-slate-900 p-1 shadow-2xl z-50 max-h-60 overflow-y-auto">
                {searchResults.map(([code, data]) => (
                  <button
                    key={code}
                    onClick={() => handleSearchSelect(code)}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs hover:bg-slate-800 transition-colors"
                  >
                    <span className="font-medium text-slate-200">{data.name}</span>
                    <span className="text-emerald-400 font-bold">{data.ewasteKt} kt</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* View Toggle */}
          <div className="flex items-center rounded-xl border border-slate-800 bg-slate-900/60 p-1">
            <button
              onClick={() => setActiveView('total')}
              className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                activeView === 'total'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              Total (kt)
            </button>
            <button
              onClick={() => setActiveView('perCapita')}
              className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                activeView === 'perCapita'
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              Per Capita (kg)
            </button>
          </div>
        </div>

        {/* Map + Detail Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Map Container */}
          <div className="lg:col-span-8 relative rounded-2xl border border-slate-800 bg-slate-900/30 overflow-hidden animate-fade-in-up delay-400">
            {/* Zoom Controls */}
            <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5">
              <button
                onClick={handleZoomIn}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-900/90 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors backdrop-blur-sm"
                title="Zoom In"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={handleZoomOut}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-900/90 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors backdrop-blur-sm"
                title="Zoom Out"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={handleReset}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-900/90 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors backdrop-blur-sm"
                title="Reset View"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Tooltip */}
            {hoveredCountry && (
              <div
                className="absolute z-30 rounded-xl border border-slate-700 bg-slate-900/95 px-4 py-3 shadow-2xl backdrop-blur-md pointer-events-none"
                style={{
                  left: Math.min(tooltipPos.x + 15, window.innerWidth - 240),
                  top: tooltipPos.y - 10,
                  maxWidth: '220px',
                }}
              >
                <p className="text-xs font-bold text-white mb-1.5">
                  {ewasteByCountry[hoveredCountry]?.name || hoveredCountry}
                </p>
                {ewasteByCountry[hoveredCountry] ? (
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-[10px] text-slate-500">Annual</p>
                      <p className="text-xs font-bold text-emerald-400">
                        {ewasteByCountry[hoveredCountry].ewasteKt.toLocaleString()} kt
                      </p>
                    </div>
                    <div className="h-6 w-px bg-slate-800"></div>
                    <div>
                      <p className="text-[10px] text-slate-500">Per Capita</p>
                      <p className="text-xs font-bold text-cyan-400">
                        {ewasteByCountry[hoveredCountry].perCapitaKg} kg
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-[10px] text-slate-500">No data available</p>
                )}
              </div>
            )}

            {/* Real World Map */}
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{
                scale: 130,
                center: [0, 30],
              }}
              style={{ width: '100%', height: 'auto' }}
            >
              <ZoomableGroup
                zoom={zoom}
                center={center}
                onMoveEnd={({ coordinates, zoom: z }) => {
                  setCenter(coordinates);
                  setZoom(z);
                }}
                minZoom={1}
                maxZoom={8}
              >
                <Geographies geography={GEO_URL}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const alpha2 = resolveAlpha2(geo);
                      const hasData = alpha2 && !!ewasteByCountry[alpha2];
                      const isSelected = selectedCountry === alpha2;
                      const isHovered = hoveredCountry === alpha2;

                      return (
                        <Geography
                          key={geo.rsmKey || geo.id}
                          geography={geo}
                          fill={getCountryFillByAlpha2(alpha2)}
                          stroke={
                            isSelected
                              ? '#22c55e'
                              : isHovered && hasData
                              ? 'rgba(34, 197, 94, 0.5)'
                              : 'rgba(148, 163, 184, 0.12)'
                          }
                          strokeWidth={isSelected ? 1.5 : isHovered ? 1 : 0.4}
                          style={{
                            default: {
                              outline: 'none',
                              opacity: hasData ? 0.9 : 0.3,
                              transition: 'all 250ms ease',
                            },
                            hover: {
                              outline: 'none',
                              opacity: 1,
                              filter: hasData
                                ? 'brightness(1.35) drop-shadow(0 0 6px rgba(34,197,94,0.25))'
                                : 'brightness(1.1)',
                              cursor: hasData ? 'pointer' : 'default',
                            },
                            pressed: {
                              outline: 'none',
                              opacity: 1,
                            },
                          }}
                          onMouseEnter={(e) => {
                            setHoveredCountry(alpha2 || null);
                            const rect = e.target.ownerSVGElement?.getBoundingClientRect();
                            if (rect) {
                              setTooltipPos({
                                x: e.clientX - rect.left,
                                y: e.clientY - rect.top,
                              });
                            }
                          }}
                          onMouseMove={(e) => {
                            const rect = e.target.ownerSVGElement?.getBoundingClientRect();
                            if (rect) {
                              setTooltipPos({
                                x: e.clientX - rect.left,
                                y: e.clientY - rect.top,
                              });
                            }
                          }}
                          onMouseLeave={() => {
                            setHoveredCountry(null);
                          }}
                          onClick={() => {
                            if (alpha2 && hasData) {
                              handleCountryClick(alpha2);
                            }
                          }}
                        />
                      );
                    })
                  }
                </Geographies>
              </ZoomableGroup>
            </ComposableMap>

            {/* Legend */}
            <div className="px-4 pb-4 pt-2 flex flex-wrap items-center justify-center gap-2">
              <span className="text-[10px] text-slate-500 font-semibold mr-2">
                {activeView === 'total' ? 'E-Waste (kt):' : 'Per Capita (kg):'}
              </span>
              {activeView === 'total'
                ? [
                    { color: '#0d9488', label: '< 100' },
                    { color: '#22c55e', label: '100–500' },
                    { color: '#84cc16', label: '500–1k' },
                    { color: '#eab308', label: '1k–3k' },
                    { color: '#f59e0b', label: '3k–7k' },
                    { color: '#f97316', label: '7k–10k' },
                    { color: '#ef4444', label: '> 10k' },
                  ].map((l) => (
                    <div key={l.label} className="flex items-center gap-1">
                      <div className="h-2.5 w-5 rounded-sm" style={{ backgroundColor: l.color }}></div>
                      <span className="text-[9px] text-slate-400">{l.label}</span>
                    </div>
                  ))
                : [
                    { color: '#0d9488', label: '< 3' },
                    { color: '#14b8a6', label: '3–6' },
                    { color: '#22c55e', label: '6–10' },
                    { color: '#84cc16', label: '10–15' },
                    { color: '#eab308', label: '15–20' },
                    { color: '#f59e0b', label: '20–25' },
                    { color: '#f97316', label: '> 25' },
                  ].map((l) => (
                    <div key={l.label} className="flex items-center gap-1">
                      <div className="h-2.5 w-5 rounded-sm" style={{ backgroundColor: l.color }}></div>
                      <span className="text-[9px] text-slate-400">{l.label}</span>
                    </div>
                  ))}
              <div className="flex items-center gap-1 ml-2">
                <div className="h-2.5 w-5 rounded-sm bg-slate-800 border border-slate-700"></div>
                <span className="text-[9px] text-slate-500">No Data</span>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-4 space-y-4">
            {/* Country Detail Panel */}
            {countryData ? (
              <div className="rounded-2xl border border-emerald-500/20 bg-slate-900/50 p-5 animate-fade-in-up glow-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white">{countryData.name}</h3>
                  <button
                    onClick={() => setSelectedCountry(null)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="rounded-xl bg-slate-950/60 p-3 text-center">
                    <p className="text-lg font-extrabold text-emerald-400 font-display">
                      {countryData.ewasteKt.toLocaleString()}
                    </p>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">kt / year</p>
                  </div>
                  <div className="rounded-xl bg-slate-950/60 p-3 text-center">
                    <p className="text-lg font-extrabold text-cyan-400 font-display">
                      {countryData.perCapitaKg}
                    </p>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">kg per capita</p>
                  </div>
                </div>

                {/* Collection Rate */}
                <div className="mb-4 space-y-2">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-semibold text-slate-400 flex items-center gap-1.5">
                      <Recycle className="h-3 w-3 text-emerald-400" />
                      Collection & Recycling Rate
                    </span>
                    <span className="font-bold text-emerald-400">{countryData.collectionRate}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700"
                      style={{ width: `${Math.min(countryData.collectionRate, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Growth Trend */}
                <div className="flex items-center justify-between rounded-xl bg-slate-950/40 p-3 mb-3">
                  <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1.5">
                    {countryData.yoyGrowth > 0 ? (
                      <TrendingUp className="h-3 w-3 text-amber-400" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-emerald-400" />
                    )}
                    YoY Growth
                  </span>
                  <span
                    className={`text-xs font-bold ${
                      countryData.yoyGrowth > 3
                        ? 'text-red-400'
                        : countryData.yoyGrowth > 1.5
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    +{countryData.yoyGrowth}%
                  </span>
                </div>

                {/* Population */}
                <div className="flex items-center justify-between rounded-xl bg-slate-950/40 p-3 mb-4">
                  <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1.5">
                    <Users className="h-3 w-3 text-violet-400" />
                    Population
                  </span>
                  <span className="text-xs font-bold text-slate-200">{countryData.population}M</span>
                </div>

                {/* Top Categories */}
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Top E-Waste Categories
                  </p>
                  {countryData.topCategories.map((cat, i) => (
                    <div key={cat} className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-600">{i + 1}.</span>
                      <span className="text-[11px] text-slate-300">{cat}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-800 px-3 py-1 text-[10px] font-semibold text-slate-300">
                    <Globe className="h-3 w-3 text-cyan-400" />
                    {countryData.region}
                  </span>
                </div>
              </div>
            ) : (
              /* Top 10 Leaderboard */
              <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-5 animate-fade-in-up delay-500">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="h-4 w-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">Top 10 E-Waste Producers</h3>
                </div>
                <div className="space-y-2.5">
                  {topCountries.map((c, i) => {
                    const maxKt = topCountries[0].ewasteKt;
                    const barWidth = (c.ewasteKt / maxKt) * 100;
                    return (
                      <button
                        key={c.code}
                        onClick={() => setSelectedCountry(c.code)}
                        className="w-full group"
                      >
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] font-bold text-slate-600 w-4">{i + 1}</span>
                          <span className="text-[11px] font-medium text-slate-300 group-hover:text-emerald-400 transition-colors flex-1 text-left">
                            {c.name}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-400">
                            {c.ewasteKt.toLocaleString()} kt
                          </span>
                        </div>
                        <div className="ml-6 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700 group-hover:brightness-125"
                            style={{
                              width: `${barWidth}%`,
                              background: `linear-gradient(90deg, ${getHeatColor(c.ewasteKt)}, ${getHeatColor(
                                c.ewasteKt
                              )}88)`,
                            }}
                          ></div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Regional Breakdown */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-5 animate-fade-in-up delay-600">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Globe className="h-4 w-4 text-cyan-400" />
                Regional Breakdown
              </h3>
              <div className="space-y-3">
                {Object.entries(regionTotals)
                  .sort((a, b) => b[1].totalKt - a[1].totalKt)
                  .map(([region, data]) => (
                    <div key={region} className="flex items-center justify-between">
                      <div>
                        <p className="text-[11px] font-semibold text-slate-300">{region}</p>
                        <p className="text-[9px] text-slate-500">
                          {data.countries} countries · avg {data.avgPerCapita} kg/cap
                        </p>
                      </div>
                      <span className="text-xs font-bold text-emerald-400">
                        {(data.totalKt / 1000).toFixed(1)}M t
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Data Source */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-4 animate-fade-in-up delay-700">
              <div className="flex items-start gap-2">
                <Info className="h-3.5 w-3.5 text-slate-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    Data: <span className="text-slate-400 font-medium">{DATA_SOURCE}</span>
                  </p>
                  <p className="text-[10px] text-slate-600 mt-0.5">
                    Data Year: {DATA_YEAR} · Last Updated: {LAST_UPDATED}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Click instruction */}
        <div className="text-center mt-6 animate-fade-in-up delay-700">
          <p className="text-[11px] text-slate-600 flex items-center justify-center gap-1.5">
            <ChevronRight className="h-3 w-3" />
            Click on any highlighted country to view detailed e-waste statistics · Scroll to zoom · Drag to pan
          </p>
        </div>
      </div>
    </div>
  );
};

export default EWasteMap;
