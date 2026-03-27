import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { getCommandCenterData } from '../services/api';

const CommandCenter = () => {
  const [data, setData] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getCommandCenterData();
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching command center data:', error);
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="text-white text-center p-8">Loading Command Center...</div>;
  if (!data) return <div className="text-white text-center p-8">No data available</div>;

  const getRiskColor = (score) => {
    if (score < 30) return 'from-green-500 to-green-600';
    if (score < 55) return 'from-yellow-500 to-yellow-600';
    if (score < 75) return 'from-orange-500 to-orange-600';
    return 'from-red-500 to-red-600';
  };

  const getRiskBgColor = (score) => {
    if (score < 30) return 'bg-green-900/30 border-green-500';
    if (score < 55) return 'bg-yellow-900/30 border-yellow-500';
    if (score < 75) return 'bg-orange-900/30 border-orange-500';
    return 'bg-red-900/30 border-red-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            🛰️ AUTHORITY COMMAND CENTER
          </h1>
          <div className="text-sm text-cyan-400">
            {new Date(data.timestamp).toLocaleTimeString()}
          </div>
        </div>
        <div className="h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full"></div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'SOS ALERTS', value: data.sos_alerts, icon: '🚨', color: 'from-red-500 to-red-600' },
          { label: 'ACTIVE TEAMS', value: data.active_rescue_teams, icon: '👥', color: 'from-blue-500 to-blue-600' },
          { label: 'SHELTER OCCUPANCY', value: `${data.shelter_occupancy_percent}%`, icon: '🏠', color: 'from-green-500 to-green-600' },
          { label: 'HIGH RISK ZONES', value: data.high_risk_zones, icon: '⚠️', color: 'from-orange-500 to-orange-600' }
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className={`bg-gradient-to-br ${stat.color} p-6 rounded-lg border border-white/10 shadow-lg`}
          >
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-sm text-white/70">{stat.label}</div>
            <div className="text-3xl font-bold mt-2">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-slate-800/50 border border-cyan-500/30 rounded-lg p-6 shadow-xl"
        >
          <h2 className="text-xl font-bold mb-4 text-cyan-400">📍 FLOOD RISK HEATMAP</h2>
          <div className="h-96 rounded-lg overflow-hidden border border-cyan-500/20">
            <MapContainer center={[13.0827, 80.2707]} zoom={11} className="h-full w-full">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap'
              />
              {data.heatmap && data.heatmap.map((zone, idx) => (
                <CircleMarker
                  key={idx}
                  center={[zone.lat, zone.lng]}
                  radius={Math.max(8, zone.risk_score / 10)}
                  fillColor={zone.color}
                  color={zone.color}
                  weight={2}
                  opacity={0.8}
                  fillOpacity={0.6}
                  onClick={() => setSelectedZone(zone)}
                >
                  <Popup>
                    <div className="text-sm">
                      <strong>{zone.zone}</strong><br />
                      Risk: {zone.risk_score}/100<br />
                      Level: {zone.risk_level}
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-800/50 border border-red-500/30 rounded-lg p-6 shadow-xl"
        >
          <h2 className="text-xl font-bold mb-4 text-red-400">🔴 CRITICAL ZONES</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {data.critical_zones && data.critical_zones.length > 0 ? (
              data.critical_zones.map((zone, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-red-900/30 border border-red-500 rounded p-3 cursor-pointer hover:bg-red-900/50 transition"
                  onClick={() => setSelectedZone(zone)}
                >
                  <div className="font-bold text-red-300">{zone.zone}</div>
                  <div className="text-sm text-red-200">Risk: {zone.risk_score}/100</div>
                  <div className="text-xs text-red-100 mt-1">⚠️ Immediate Action Required</div>
                </motion.div>
              ))
            ) : (
              <div className="text-green-400 text-sm">✓ No critical zones</div>
            )}
          </div>
        </motion.div>
      </div>

      {selectedZone && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-gradient-to-br ${getRiskBgColor(selectedZone.risk_score)} border-2 rounded-lg p-6 shadow-xl`}
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-2xl font-bold">{selectedZone.zone}</h3>
            <button
              onClick={() => setSelectedZone(null)}
              className="text-white/50 hover:text-white text-2xl"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-white/70">Risk Score</div>
              <div className="text-2xl font-bold">{selectedZone.risk_score}/100</div>
            </div>
            <div>
              <div className="text-sm text-white/70">Risk Level</div>
              <div className="text-2xl font-bold">{selectedZone.risk_level}</div>
            </div>
            <div>
              <div className="text-sm text-white/70">Latitude</div>
              <div className="text-lg font-mono">{selectedZone.lat.toFixed(4)}</div>
            </div>
            <div>
              <div className="text-sm text-white/70">Longitude</div>
              <div className="text-lg font-mono">{selectedZone.lng.toFixed(4)}</div>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/50 border border-cyan-500/30 rounded-lg p-6 shadow-xl mt-8"
      >
        <h2 className="text-xl font-bold mb-4 text-cyan-400">📊 ALL ZONES STATUS</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cyan-500/30">
                <th className="text-left py-3 px-4 text-cyan-400">Zone</th>
                <th className="text-left py-3 px-4 text-cyan-400">Risk Score</th>
                <th className="text-left py-3 px-4 text-cyan-400">Risk Level</th>
                <th className="text-left py-3 px-4 text-cyan-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.heatmap && data.heatmap.map((zone, idx) => (
                <tr key={idx} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition">
                  <td className="py-3 px-4 font-semibold">{zone.zone}</td>
                  <td className="py-3 px-4">
                    <div className="w-32 bg-slate-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full bg-gradient-to-r ${getRiskColor(zone.risk_score)}`}
                        style={{ width: `${zone.risk_score}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      zone.risk_score < 30 ? 'bg-green-900 text-green-300' :
                      zone.risk_score < 55 ? 'bg-yellow-900 text-yellow-300' :
                      zone.risk_score < 75 ? 'bg-orange-900 text-orange-300' :
                      'bg-red-900 text-red-300'
                    }`}>
                      {zone.risk_level}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {zone.risk_score > 75 ? '🚨 Critical' : zone.risk_score > 55 ? '⚠️ Warning' : '✓ Safe'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default CommandCenter;
