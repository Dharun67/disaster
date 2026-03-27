import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { getCommandCenterData } from '../services/api';

const CommandCenterPro = () => {
  const [data, setData] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getCommandCenterData();
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-cyan-400 text-2xl font-bold animate-pulse">⚡ INITIALIZING COMMAND CENTER...</div>
    </div>
  );

  const getRiskColor = (score) => {
    if (score < 30) return { bg: 'bg-green-900/40', border: 'border-green-500', text: 'text-green-300', glow: 'shadow-green-500/50' };
    if (score < 55) return { bg: 'bg-yellow-900/40', border: 'border-yellow-500', text: 'text-yellow-300', glow: 'shadow-yellow-500/50' };
    if (score < 75) return { bg: 'bg-orange-900/40', border: 'border-orange-500', text: 'text-orange-300', glow: 'shadow-orange-500/50' };
    return { bg: 'bg-red-900/40', border: 'border-red-500', text: 'text-red-300', glow: 'shadow-red-500/50' };
  };

  const getRiskLabel = (score) => {
    if (score < 30) return '🟢 LOW';
    if (score < 55) return '🟡 MODERATE';
    if (score < 75) return '🟠 HIGH';
    return '🔴 CRITICAL';
  };

  const StatCard = ({ icon, label, value, color, trend }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${color.bg} border-2 ${color.border} rounded-lg p-4 backdrop-blur-sm`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-white/60 uppercase tracking-wider">{label}</div>
          <div className={`text-3xl font-bold ${color.text} mt-2`}>{value}</div>
          {trend && <div className="text-xs text-white/40 mt-1">{trend}</div>}
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Animated Background Grid */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20"></div>
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 border-b border-cyan-500/30 bg-slate-900/80 backdrop-blur-md p-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center font-bold text-xl">🛰️</div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  AUTHORITY COMMAND CENTER
                </h1>
                <p className="text-cyan-400/70 text-sm mt-1">Real-time Disaster Management System</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-cyan-400 font-mono text-sm">STATUS: ACTIVE</div>
              <div className="text-white/60 font-mono text-xs mt-1">{new Date().toLocaleTimeString()}</div>
            </div>
          </div>
          <div className="h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full"></div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto p-6 space-y-6">
        {/* Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            icon="🚨"
            label="Active SOS"
            value={data?.sos_alerts || 0}
            color={getRiskColor(75)}
            trend="Immediate Response"
          />
          <StatCard
            icon="👥"
            label="Rescue Teams"
            value={data?.active_rescue_teams || 0}
            color={getRiskColor(45)}
            trend="Deployed & Ready"
          />
          <StatCard
            icon="🏠"
            label="Shelter Capacity"
            value={`${data?.shelter_occupancy_percent || 0}%`}
            color={getRiskColor(data?.shelter_occupancy_percent || 0)}
            trend="Occupancy Rate"
          />
          <StatCard
            icon="⚠️"
            label="High Risk Zones"
            value={data?.high_risk_zones || 0}
            color={getRiskColor(65)}
            trend="Requires Attention"
          />
          <StatCard
            icon="📊"
            label="Total Zones"
            value={data?.total_zones || 0}
            color={getRiskColor(30)}
            trend="Under Monitoring"
          />
        </div>

        {/* Main Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Heatmap */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-slate-900/60 border-2 border-cyan-500/40 rounded-xl p-6 backdrop-blur-sm shadow-2xl shadow-cyan-500/20"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-cyan-400">📍 FLOOD RISK HEATMAP</h2>
              <div className="flex gap-2">
                {[
                  { color: '#10b981', label: 'Safe' },
                  { color: '#f59e0b', label: 'Moderate' },
                  { color: '#f97316', label: 'High' },
                  { color: '#ef4444', label: 'Critical' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-xs text-white/60">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="h-96 rounded-lg overflow-hidden border border-cyan-500/20">
              <MapContainer center={[13.0827, 80.2707]} zoom={11} className="h-full w-full">
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap'
                />
                {data?.heatmap?.map((zone, idx) => (
                  <CircleMarker
                    key={idx}
                    center={[zone.lat, zone.lng]}
                    radius={Math.max(10, zone.risk_score / 8)}
                    fillColor={zone.color}
                    color={zone.color}
                    weight={3}
                    opacity={0.9}
                    fillOpacity={0.7}
                    onClick={() => setSelectedZone(zone)}
                  >
                    <Popup>
                      <div className="text-sm font-bold">{zone.zone}</div>
                      <div>Risk: {zone.risk_score}/100</div>
                      <div>{getRiskLabel(zone.risk_score)}</div>
                    </Popup>
                  </CircleMarker>
                ))}
              </MapContainer>
            </div>
          </motion.div>

          {/* Critical Zones Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-900/60 border-2 border-red-500/40 rounded-xl p-6 backdrop-blur-sm shadow-2xl shadow-red-500/20"
          >
            <h2 className="text-2xl font-bold text-red-400 mb-4">🔴 CRITICAL ZONES</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {data?.critical_zones?.length > 0 ? (
                data.critical_zones.map((zone, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => setSelectedZone(zone)}
                    className="bg-red-900/30 border-2 border-red-500 rounded-lg p-4 cursor-pointer hover:bg-red-900/50 transition-all hover:shadow-lg hover:shadow-red-500/30"
                  >
                    <div className="font-bold text-red-300 text-lg">{zone.zone}</div>
                    <div className="flex justify-between items-center mt-2">
                      <div className="text-sm text-red-200">Risk Score: {zone.risk_score}/100</div>
                      <div className="text-xs bg-red-600 px-2 py-1 rounded">ALERT</div>
                    </div>
                    <div className="w-full bg-red-900/50 rounded-full h-2 mt-2">
                      <div
                        className="h-2 bg-gradient-to-r from-red-500 to-red-600 rounded-full"
                        style={{ width: `${zone.risk_score}%` }}
                      ></div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-green-400 text-center py-8">✓ No Critical Zones</div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Zone Details */}
        {selectedZone && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${getRiskColor(selectedZone.risk_score).bg} border-2 ${getRiskColor(selectedZone.risk_score).border} rounded-xl p-6 backdrop-blur-sm`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-3xl font-bold">{selectedZone.zone}</h3>
                <p className="text-white/60 mt-1">{getRiskLabel(selectedZone.risk_score)}</p>
              </div>
              <button
                onClick={() => setSelectedZone(null)}
                className="text-white/50 hover:text-white text-3xl"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="text-sm text-white/60">Risk Score</div>
                <div className={`text-3xl font-bold ${getRiskColor(selectedZone.risk_score).text} mt-2`}>
                  {selectedZone.risk_score}/100
                </div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="text-sm text-white/60">Risk Level</div>
                <div className={`text-2xl font-bold ${getRiskColor(selectedZone.risk_score).text} mt-2`}>
                  {getRiskLabel(selectedZone.risk_score)}
                </div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="text-sm text-white/60">Latitude</div>
                <div className="text-lg font-mono text-cyan-300 mt-2">{selectedZone.lat?.toFixed(4)}</div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="text-sm text-white/60">Longitude</div>
                <div className="text-lg font-mono text-cyan-300 mt-2">{selectedZone.lng?.toFixed(4)}</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* All Zones Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/60 border-2 border-cyan-500/40 rounded-xl p-6 backdrop-blur-sm shadow-2xl shadow-cyan-500/20"
        >
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">📊 ZONE STATUS MATRIX</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-cyan-500/30">
                  <th className="text-left py-4 px-4 text-cyan-400 font-bold">ZONE</th>
                  <th className="text-left py-4 px-4 text-cyan-400 font-bold">RISK SCORE</th>
                  <th className="text-left py-4 px-4 text-cyan-400 font-bold">LEVEL</th>
                  <th className="text-left py-4 px-4 text-cyan-400 font-bold">STATUS</th>
                  <th className="text-left py-4 px-4 text-cyan-400 font-bold">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {data?.heatmap?.map((zone, idx) => (
                  <tr key={idx} className="border-b border-slate-700/50 hover:bg-slate-800/50 transition">
                    <td className="py-4 px-4 font-semibold text-white">{zone.zone}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-40 bg-slate-700 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                            style={{ width: `${zone.risk_score}%` }}
                          ></div>
                        </div>
                        <span className="font-bold text-cyan-300">{zone.risk_score}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        zone.risk_score < 30 ? 'bg-green-900 text-green-300' :
                        zone.risk_score < 55 ? 'bg-yellow-900 text-yellow-300' :
                        zone.risk_score < 75 ? 'bg-orange-900 text-orange-300' :
                        'bg-red-900 text-red-300'
                      }`}>
                        {getRiskLabel(zone.risk_score)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {zone.risk_score > 75 ? '🚨 CRITICAL' : zone.risk_score > 55 ? '⚠️ WARNING' : '✓ SAFE'}
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => setSelectedZone(zone)}
                        className="px-3 py-1 bg-cyan-600 hover:bg-cyan-700 rounded text-xs font-bold transition"
                      >
                        VIEW
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CommandCenterPro;
