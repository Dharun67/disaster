import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function HyperlocalDashboard() {
  const [rainfall, setRainfall] = useState(50);
  const [waterLevel, setWaterLevel] = useState(60);
  const [zones, setZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);
  const [zoneDetails, setZoneDetails] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, [rainfall, waterLevel]);

  const fetchAllData = async () => {
    try {
      const [zonesRes, compRes] = await Promise.all([
        axios.post('http://localhost:5001/api/all-zones-risk', { rainfall, water_level: waterLevel }),
        axios.post('http://localhost:5001/api/zone-comparison', { rainfall, water_level: waterLevel })
      ]);
      setZones(zonesRes.data);
      setComparison(compRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchZoneDetails = async (zoneName) => {
    try {
      const res = await axios.get(`http://localhost:5001/api/zone-details/${zoneName}`);
      setZoneDetails(res.data);
      setSelectedZone(zoneName);
    } catch (err) {
      console.error('Error fetching zone details:', err);
    }
  };

  const getRiskColor = (risk) => {
    const colors = { Low: '#10b981', Moderate: '#f59e0b', High: '#f97316', Critical: '#ef4444' };
    return colors[risk] || '#6b7280';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-white">
      <div className="backdrop-blur-md bg-slate-900/80 border-b border-slate-700/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">🎯 Hyperlocal Flood Risk Prediction</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Controls */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 p-6 mb-8 shadow-xl">
          <h2 className="text-xl font-bold mb-6 text-cyan-400">Environmental Parameters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">Rainfall (mm)</label>
              <input type="range" min="0" max="200" value={rainfall} onChange={(e) => setRainfall(Number(e.target.value))} className="w-full" />
              <p className="text-cyan-400 font-bold mt-2">{rainfall}mm</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">Water Level (%)</label>
              <input type="range" min="0" max="100" value={waterLevel} onChange={(e) => setWaterLevel(Number(e.target.value))} className="w-full" />
              <p className="text-cyan-400 font-bold mt-2">{waterLevel}%</p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        {comparison && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-lg bg-gradient-to-br from-red-900 to-red-800 border border-red-700">
              <p className="text-gray-300 text-sm">Highest Risk</p>
              <p className="text-2xl font-bold text-red-300 mt-2">{comparison.highest_risk.zone}</p>
              <p className="text-sm text-gray-400 mt-1">{comparison.highest_risk.risk_score}</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-4 rounded-lg bg-gradient-to-br from-green-900 to-green-800 border border-green-700">
              <p className="text-gray-300 text-sm">Lowest Risk</p>
              <p className="text-2xl font-bold text-green-300 mt-2">{comparison.lowest_risk.zone}</p>
              <p className="text-sm text-gray-400 mt-1">{comparison.lowest_risk.risk_score}</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-4 rounded-lg bg-gradient-to-br from-blue-900 to-blue-800 border border-blue-700">
              <p className="text-gray-300 text-sm">Average Risk</p>
              <p className="text-2xl font-bold text-blue-300 mt-2">{comparison.average_risk}</p>
              <p className="text-sm text-gray-400 mt-1">All zones</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="p-4 rounded-lg bg-gradient-to-br from-orange-900 to-orange-800 border border-orange-700">
              <p className="text-gray-300 text-sm">Critical Zones</p>
              <p className="text-2xl font-bold text-orange-300 mt-2">{comparison.critical_zones}</p>
              <p className="text-sm text-gray-400 mt-1">+ {comparison.high_risk_zones} High</p>
            </motion.div>
          </div>
        )}

        {/* Map and Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl overflow-hidden border border-slate-700 shadow-2xl shadow-blue-500/10">
              <MapContainer center={[13.0827, 80.2707]} zoom={11} style={{ height: '500px' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {zones.map(zone => (
                  <Circle
                    key={zone.zone}
                    center={[zone.lat, zone.lng]}
                    radius={5000}
                    fillColor={zone.color}
                    color={zone.color}
                    weight={2}
                    opacity={0.8}
                    fillOpacity={0.5}
                    eventHandlers={{ click: () => fetchZoneDetails(zone.zone) }}
                  >
                    <Popup>
                      <div className="text-sm">
                        <p className="font-bold">{zone.zone}</p>
                        <p>Risk: {zone.risk_level}</p>
                        <p>Score: {zone.risk_score}</p>
                      </div>
                    </Popup>
                  </Circle>
                ))}
              </MapContainer>
            </motion.div>
          </div>

          {/* Zone Details */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="rounded-xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 p-6 shadow-xl h-fit">
            <h2 className="text-xl font-bold mb-4 text-cyan-400">Zone Details</h2>
            {zoneDetails ? (
              <div className="space-y-3">
                <div className="p-3 bg-slate-700/50 rounded-lg">
                  <p className="text-sm text-gray-400">Zone</p>
                  <p className="font-bold text-cyan-400">{zoneDetails.zone}</p>
                </div>
                <div className="p-3 bg-slate-700/50 rounded-lg">
                  <p className="text-sm text-gray-400">Population</p>
                  <p className="font-bold">{zoneDetails.population.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-slate-700/50 rounded-lg">
                  <p className="text-sm text-gray-400">Area</p>
                  <p className="font-bold">{zoneDetails.area} km²</p>
                </div>
                <div className="p-3 bg-slate-700/50 rounded-lg">
                  <p className="text-sm text-gray-400">Elevation</p>
                  <p className="font-bold">{zoneDetails.elevation}m</p>
                </div>
                <div className="p-3 bg-slate-700/50 rounded-lg">
                  <p className="text-sm text-gray-400">Drainage</p>
                  <p className="font-bold">{(zoneDetails.drainage * 100).toFixed(0)}%</p>
                </div>
                <div className="p-3 bg-slate-700/50 rounded-lg">
                  <p className="text-sm text-gray-400">Soil Type</p>
                  <p className="font-bold capitalize">{zoneDetails.soil_type}</p>
                </div>
                <div className="p-3 bg-slate-700/50 rounded-lg">
                  <p className="text-sm text-gray-400">Flood History</p>
                  <p className="font-bold">{zoneDetails.flood_frequency} times</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">Click a zone to view details</p>
            )}
          </motion.div>
        </div>

        {/* All Zones Risk */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 p-6 shadow-xl">
          <h2 className="text-xl font-bold mb-4 text-cyan-400">All Zones Risk Assessment</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {zones.map((zone, idx) => (
              <motion.div
                key={zone.zone}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -5 }}
                onClick={() => fetchZoneDetails(zone.zone)}
                className="cursor-pointer p-4 rounded-lg bg-slate-700/50 border border-slate-600 hover:border-slate-500 transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-gray-300">{zone.zone}</h3>
                  <span className="px-2 py-1 rounded text-xs font-bold" style={{ background: zone.color, color: 'white' }}>
                    {zone.risk_level}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Risk Score</span>
                    <span className="font-bold text-cyan-400">{zone.risk_score}</span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${zone.risk_score}%` }}
                      transition={{ duration: 0.8 }}
                      className="h-full"
                      style={{ background: zone.color }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-2">
                    <span>Elevation: {zone.elevation}m</span>
                    <span>Drainage: {(zone.drainage * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
