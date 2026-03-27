import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function DrainageOverflowAlerts() {
  const [rainfall, setRainfall] = useState(50);
  const [drainageCapacity, setDrainageCapacity] = useState(100);
  const [zone, setZone] = useState('Velachery');
  const [language, setLanguage] = useState('en');
  const [predictions, setPredictions] = useState([]);
  const [alerts, setAlerts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [rainfall, drainageCapacity, zone, language]);

  const fetchData = async () => {
    try {
      const [overflowRes, alertRes] = await Promise.all([
        axios.post('http://localhost:5001/api/all-zones-overflow', {
          rainfall,
          drainage_capacity: drainageCapacity
        }),
        axios.post('http://localhost:5001/api/multi-language-alerts', {
          zone,
          rainfall,
          drainage_capacity: drainageCapacity
        })
      ]);
      setPredictions(overflowRes.data);
      setAlerts(alertRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk) => {
    const colors = { Low: '#10b981', Moderate: '#f59e0b', High: '#f97316', Critical: '#ef4444' };
    return colors[risk] || '#6b7280';
  };

  const languageNames = { en: '🇬🇧 English', ta: '🇮🇳 Tamil', hi: '🇮🇳 Hindi' };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-white">
      <div className="backdrop-blur-md bg-slate-900/80 border-b border-slate-700/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">💧 Drainage Overflow Prediction & Multi-Language Alerts</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Controls */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 p-6 mb-8 shadow-xl">
          <h2 className="text-xl font-bold mb-6 text-cyan-400">Drainage Parameters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">Rainfall (mm/hour)</label>
              <input type="range" min="0" max="200" value={rainfall} onChange={(e) => setRainfall(Number(e.target.value))} className="w-full" />
              <p className="text-cyan-400 font-bold mt-2">{rainfall}mm</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">Drainage Capacity (%)</label>
              <input type="range" min="0" max="200" value={drainageCapacity} onChange={(e) => setDrainageCapacity(Number(e.target.value))} className="w-full" />
              <p className="text-cyan-400 font-bold mt-2">{drainageCapacity}%</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">Zone</label>
              <select value={zone} onChange={(e) => setZone(e.target.value)} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
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

        {/* Multi-Language Alerts */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 p-6 mb-8 shadow-xl">
          <h2 className="text-xl font-bold mb-6 text-cyan-400">🌍 Multi-Language Alerts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['en', 'ta', 'hi'].map(lang => {
              const alert = alerts[lang];
              if (!alert) return null;
              
              const isWarning = alert.alert_level === 'Warning';
              const isCritical = alert.alert_level === 'Critical';
              
              return (
                <motion.div
                  key={lang}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-6 rounded-lg border-2 ${isCritical ? 'border-red-600 bg-red-900/30' : isWarning ? 'border-orange-600 bg-orange-900/30' : 'border-green-600 bg-green-900/30'}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-lg">{languageNames[lang]}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${isCritical ? 'bg-red-600' : isWarning ? 'bg-orange-600' : 'bg-green-600'}`}>
                      {alert.alert_level}
                    </span>
                  </div>
                  <p className="text-lg font-bold mb-3">{alert.message}</p>
                  {alert.overflow_risk && (
                    <>
                      <p className="text-sm text-gray-300 mb-2">⏱️ {alert.time_to_overflow.toFixed(1)} minutes</p>
                      <p className="text-sm text-gray-300">{alert.evacuation_message}</p>
                    </>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* All Zones Overflow Risk */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 p-6 shadow-xl">
          <h2 className="text-xl font-bold mb-6 text-cyan-400">💧 All Zones Drainage Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {predictions.map((pred, idx) => (
              <motion.div
                key={pred.zone}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-4 rounded-lg bg-slate-700/50 border border-slate-600 hover:border-slate-500 transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-gray-300">{pred.zone}</h3>
                  {pred.overflow_risk && (
                    <span className="px-2 py-1 rounded text-xs font-bold" style={{ background: getRiskColor(pred.risk_level), color: 'white' }}>
                      {pred.risk_level}
                    </span>
                  )}
                </div>
                
                {pred.overflow_risk ? (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Overflow in</span>
                      <span className="font-bold text-orange-400">{pred.time_to_overflow_minutes}m</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Level</span>
                      <span className="font-bold">{pred.drainage_level}/{pred.capacity}</span>
                    </div>
                    <div className="w-full bg-slate-600 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(pred.drainage_level / pred.capacity) * 100}%` }}
                        transition={{ duration: 0.8 }}
                        className="h-full"
                        style={{ background: getRiskColor(pred.risk_level) }}
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-green-400">✓ No overflow risk</p>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
