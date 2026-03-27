import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function FloodSimulation() {
  const [rainfall, setRainfall] = useState(50);
  const [waterLevel, setWaterLevel] = useState(60);
  const [simulations, setSimulations] = useState([]);
  const [selectedZone, setSelectedZone] = useState('Velachery');
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeHour, setActiveHour] = useState(1);

  const runSimulation = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5001/simulate-flood', {
        rainfall,
        water_level: waterLevel,
        hours: 6
      });
      setSimulations(res.data);
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getZoneTimeline = async () => {
    try {
      const res = await axios.post('http://localhost:5001/flood-timeline', {
        rainfall,
        water_level: waterLevel,
        zone: selectedZone
      });
      setTimeline(res.data.timeline);
    } catch (err) {
      console.error('Timeline error:', err);
    }
  };

  useEffect(() => {
    runSimulation();
    getZoneTimeline();
  }, [rainfall, waterLevel, selectedZone]);

  const getRiskColor = (risk) => {
    const colors = { Low: '#10b981', Moderate: '#f59e0b', High: '#f97316', Critical: '#ef4444' };
    return colors[risk] || '#6b7280';
  };

  const currentHourData = simulations.filter(s => s.hour === activeHour);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-white">
      <div className="backdrop-blur-md bg-slate-900/80 border-b border-slate-700/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">🌊 Flood Simulation & Future Prediction</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Controls */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 p-6 mb-8 shadow-xl">
          <h2 className="text-xl font-bold mb-6 text-cyan-400">Simulation Parameters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">Select Zone</label>
              <select value={selectedZone} onChange={(e) => setSelectedZone(e.target.value)} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                <option>Velachery</option>
                <option>T Nagar</option>
                <option>Adyar</option>
                <option>Anna Nagar</option>
                <option>Mylapore</option>
                <option>Tambaram</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 p-6 mb-8 shadow-xl">
          <h2 className="text-xl font-bold mb-6 text-cyan-400">📊 {selectedZone} - Flood Risk Timeline</h2>
          <div className="space-y-3">
            {timeline.map((t, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} className="flex items-center gap-4 p-4 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-all cursor-pointer" onClick={() => setActiveHour(t.hour)}>
                <div className="w-16 h-16 rounded-lg flex items-center justify-center font-bold text-lg" style={{ background: getRiskColor(t.risk_level) }}>
                  {t.hour}h
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-300">{t.timestamp}</p>
                  <p className="text-sm text-gray-400">Risk: <span style={{ color: getRiskColor(t.risk_level) }} className="font-bold">{t.risk_level}</span></p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-cyan-400">{t.risk_score}</p>
                  <p className="text-xs text-gray-400">Risk Score</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Map Simulation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl overflow-hidden border border-slate-700 shadow-2xl shadow-blue-500/10">
              <MapContainer center={[13.0827, 80.2707]} zoom={11} style={{ height: '500px' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {currentHourData.map((sim, idx) => (
                  <motion.g key={idx} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: idx * 0.1 }}>
                    <Circle
                      center={[sim.lat, sim.lng]}
                      radius={sim.spread_radius * 1000}
                      fillColor={getRiskColor(sim.risk_level)}
                      color={getRiskColor(sim.risk_level)}
                      weight={2}
                      opacity={0.8}
                      fillOpacity={0.5}
                    >
                      <Popup>
                        <div className="text-sm">
                          <p className="font-bold">{sim.zone}</p>
                          <p>Hour: {sim.hour}</p>
                          <p>Risk: {sim.risk_level}</p>
                          <p>Score: {sim.risk_score}</p>
                        </div>
                      </Popup>
                    </Circle>
                  </motion.g>
                ))}
              </MapContainer>
            </motion.div>
            <p className="text-center text-gray-400 mt-4 text-sm">Showing flood spread at Hour {activeHour}</p>
          </div>

          {/* Predictions Panel */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="rounded-xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 p-6 shadow-xl h-fit">
            <h2 className="text-xl font-bold mb-4 text-orange-400">⚠️ Predictions</h2>
            <div className="space-y-3">
              {currentHourData.map((sim, idx) => (
                <motion.div key={idx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.05 }} className="p-3 rounded-lg bg-slate-700/50 border-l-4" style={{ borderColor: getRiskColor(sim.risk_level) }}>
                  <p className="font-bold text-sm text-gray-300">{sim.zone}</p>
                  <p className="text-xs text-gray-400 mt-1">{sim.message}</p>
                  <p className="text-xs text-cyan-400 mt-2">Spread: {sim.spread_radius}km</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Hour Selector */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-8 rounded-xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 p-6 shadow-xl">
          <h2 className="text-xl font-bold mb-4 text-cyan-400">Select Time Frame</h2>
          <div className="flex gap-4 flex-wrap">
            {[1, 3, 6].map(hour => (
              <motion.button
                key={hour}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveHour(hour)}
                className={`px-6 py-3 rounded-lg font-bold transition-all ${activeHour === hour ? 'bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg shadow-blue-500/50' : 'bg-slate-700 hover:bg-slate-600'}`}
              >
                After {hour} Hour{hour > 1 ? 's' : ''}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
