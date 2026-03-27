// frontend/src/pages/DisasterPredictionModule.js
// Disaster Prediction Module - Frontend Component

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../services/api';

const DisasterPredictionModule = () => {
  const [predictions, setPredictions] = useState({});
  const [zones, setZones] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDisaster, setSelectedDisaster] = useState('flood');
  const [inputData, setInputData] = useState({
    rainfall: 50,
    waterLevel: 60,
    elevation: 10,
    slopeAngle: 30,
    soilType: 'clay',
    seaSurfaceTemp: 28,
    atmosphericPressure: 1013,
    seismicActivity: 5
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [zonesRes, timelineRes, statsRes] = await Promise.all([
        api.get('/api/disaster-prediction/map/zones'),
        api.get('/api/disaster-prediction/map/timeline'),
        api.get('/api/disaster-prediction/map/statistics')
      ]);

      setZones(zonesRes.data);
      setTimeline(timelineRes.data);
      setStatistics(statsRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const generatePredictions = async () => {
    try {
      setLoading(true);
      const response = await api.post('/api/disaster-prediction/predict/all', inputData);
      setPredictions(response.data.predictions);
    } catch (err) {
      console.error('Error generating predictions:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (riskScore) => {
    if (riskScore < 30) return '#10b981';
    if (riskScore < 55) return '#f59e0b';
    if (riskScore < 75) return '#f97316';
    return '#ef4444';
  };

  const getRiskLevelBg = (level) => {
    switch (level) {
      case 'Low':
        return 'bg-green-100 border-green-500';
      case 'Medium':
        return 'bg-yellow-100 border-yellow-500';
      case 'High':
        return 'bg-orange-100 border-orange-500';
      case 'Critical':
        return 'bg-red-100 border-red-500';
      default:
        return 'bg-gray-100 border-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🌍 Disaster Prediction Module</h1>
          <p className="text-slate-400">AI-Powered Early Warning System for Natural Disasters</p>
        </div>

        {/* Input Controls */}
        <div className="bg-slate-800 rounded-lg p-6 mb-6 border border-slate-700">
          <h2 className="text-xl font-bold text-white mb-4">📊 Prediction Parameters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Rainfall (mm)</label>
              <input
                type="number"
                value={inputData.rainfall}
                onChange={(e) => setInputData({ ...inputData, rainfall: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Water Level (%)</label>
              <input
                type="number"
                value={inputData.waterLevel}
                onChange={(e) => setInputData({ ...inputData, waterLevel: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Elevation (m)</label>
              <input
                type="number"
                value={inputData.elevation}
                onChange={(e) => setInputData({ ...inputData, elevation: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Slope Angle (°)</label>
              <input
                type="number"
                value={inputData.slopeAngle}
                onChange={(e) => setInputData({ ...inputData, slopeAngle: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
              />
            </div>
          </div>
          <button
            onClick={generatePredictions}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {loading ? 'Generating...' : '🚀 Generate Predictions'}
          </button>
        </div>

        {/* Predictions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {Object.entries(predictions).map(([type, pred]) => (
            <div key={type} className={`rounded-lg p-4 border-2 ${getRiskLevelBg(pred.riskLevel)}`}>
              <h3 className="text-lg font-bold capitalize mb-2">{type}</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Risk Score:</span>
                  <span className="font-bold">{pred.riskScore}/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Level:</span>
                  <span className="font-bold">{pred.riskLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Confidence:</span>
                  <span className="font-bold">{pred.confidence}%</span>
                </div>
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs font-semibold mb-2">Recommendations:</p>
                  <ul className="text-xs space-y-1">
                    {pred.recommendations?.slice(0, 2).map((rec, idx) => (
                      <li key={idx}>• {rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Map and Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Map */}
          <div className="lg:col-span-2 bg-slate-800 rounded-lg p-4 border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4">🗺️ Risk Zone Map</h2>
            <MapContainer center={[13.0827, 80.2707]} zoom={11} style={{ height: '400px', borderRadius: '8px' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
              />
              {zones.map((zone) => (
                <CircleMarker
                  key={zone.id}
                  center={[zone.lat, zone.lng]}
                  radius={Math.sqrt(zone.riskScore) * 2}
                  fillColor={zone.color}
                  color={zone.color}
                  weight={2}
                  opacity={0.8}
                  fillOpacity={0.6}
                >
                  <Popup>
                    <div className="text-sm">
                      <p className="font-bold">{zone.name}</p>
                      <p>Risk: {zone.riskScore}/100</p>
                      <p>Level: {zone.riskLevel}</p>
                      <p>Type: {zone.disasterType}</p>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>

          {/* Statistics */}
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4">📈 Statistics</h2>
            {statistics && (
              <div className="space-y-3">
                <div className="bg-slate-700 p-3 rounded">
                  <p className="text-slate-400 text-sm">Total Zones</p>
                  <p className="text-2xl font-bold text-white">{statistics.totalZones}</p>
                </div>
                <div className="bg-red-900 p-3 rounded">
                  <p className="text-slate-400 text-sm">Critical Zones</p>
                  <p className="text-2xl font-bold text-red-300">{statistics.criticalZones}</p>
                </div>
                <div className="bg-orange-900 p-3 rounded">
                  <p className="text-slate-400 text-sm">High Risk Zones</p>
                  <p className="text-2xl font-bold text-orange-300">{statistics.highRiskZones}</p>
                </div>
                <div className="bg-blue-900 p-3 rounded">
                  <p className="text-slate-400 text-sm">Population at Risk</p>
                  <p className="text-2xl font-bold text-blue-300">{(statistics.populationAtRisk / 1000).toFixed(0)}K</p>
                </div>
                <div className="bg-green-900 p-3 rounded">
                  <p className="text-slate-400 text-sm">Lives Protected</p>
                  <p className="text-2xl font-bold text-green-300">{(statistics.livesProtected / 1000).toFixed(0)}K</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Timeline Chart */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">📅 Disaster Timeline (7 Days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
              <Legend />
              <Line type="monotone" dataKey="events" stroke="#3b82f6" strokeWidth={2} name="Events" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Disaster Distribution */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="text-xl font-bold text-white mb-4">📊 Disaster Distribution</h2>
          {statistics && (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={Object.entries(statistics.disastersByType).map(([type, count]) => ({
                name: type,
                count
              }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                <Bar dataKey="count" fill="#3b82f6" name="Count" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default DisasterPredictionModule;
