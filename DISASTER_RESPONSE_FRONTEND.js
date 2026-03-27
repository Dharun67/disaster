// Disaster Response Module - Frontend Component

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Marker, Popup } from 'react-leaflet';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../services/api';

const DisasterResponseModule = () => {
  const [activeTab, setActiveTab] = useState('alerts');
  const [alerts, setAlerts] = useState([]);
  const [sosRequests, setSosRequests] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [teams, setTeams] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [mapData, setMapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState({ lat: 13.0827, lng: 80.2707 });
  const [showSOSModal, setShowSOSModal] = useState(false);
  const [sosData, setSosData] = useState({
    sosLevel: 'help',
    peopleCount: 1,
    specialRequirements: ''
  });

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 5000); // Real-time updates every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [alertsRes, sosRes, sheltersRes, teamsRes, metricsRes, mapRes] = await Promise.all([
        api.get('/api/disaster-response/alerts'),
        api.get('/api/disaster-response/sos/requests'),
        api.get('/api/disaster-response/shelters'),
        api.get('/api/disaster-response/teams'),
        api.get('/api/disaster-response/dashboard/metrics'),
        api.get('/api/disaster-response/dashboard/map-data')
      ]);

      setAlerts(alertsRes.data.alerts || []);
      setSosRequests(sosRes.data.sosRequests || []);
      setShelters(sheltersRes.data.shelters || []);
      setTeams(teamsRes.data.teams || []);
      setMetrics(metricsRes.data.metrics);
      setMapData(mapRes.data.mapData);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSOSRequest = async () => {
    try {
      const response = await api.post('/api/disaster-response/sos/request', {
        userId: 'current-user',
        location: userLocation,
        userInfo: {
          name: 'User Name',
          phone: '9876543210',
          emergencyContacts: [],
          medicalInfo: ''
        },
        ...sosData
      });

      alert('SOS request sent! Help is on the way.');
      setShowSOSModal(false);
      fetchAllData();
    } catch (err) {
      alert('Error sending SOS request');
    }
  };

  const handleFindShelter = async () => {
    try {
      const response = await api.get('/api/disaster-response/shelters/nearby', {
        params: {
          lat: userLocation.lat,
          lng: userLocation.lng,
          radius: 5
        }
      });
      setShelters(response.data.shelters);
    } catch (err) {
      console.error('Error finding shelters:', err);
    }
  };

  const getSeverityBadge = (severity) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };
    return colors[severity] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      assigned: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-orange-100 text-orange-800',
      resolved: 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🚨 Disaster Response Module</h1>
          <p className="text-slate-400">Real-Time Emergency Response & Coordination System</p>
        </div>

        {/* Emergency SOS Button */}
        <div className="mb-6 flex gap-4">
          <button
            onClick={() => setShowSOSModal(true)}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg text-lg flex items-center gap-2"
          >
            🆘 EMERGENCY SOS
          </button>
          <button
            onClick={handleFindShelter}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg flex items-center gap-2"
          >
            🏛️ Find Shelter
          </button>
        </div>

        {/* SOS Modal */}
        {showSOSModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-lg p-8 max-w-md w-full border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-4">Emergency SOS Request</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">SOS Level</label>
                  <select
                    value={sosData.sosLevel}
                    onChange={(e) => setSosData({ ...sosData, sosLevel: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                  >
                    <option value="help">Help Needed</option>
                    <option value="urgent">Urgent</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Number of People</label>
                  <input
                    type="number"
                    value={sosData.peopleCount}
                    onChange={(e) => setSosData({ ...sosData, peopleCount: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Special Requirements</label>
                  <textarea
                    value={sosData.specialRequirements}
                    onChange={(e) => setSosData({ ...sosData, specialRequirements: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                    rows="3"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleSOSRequest}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Send SOS
                  </button>
                  <button
                    onClick={() => setShowSOSModal(false)}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-slate-700">
          {['alerts', 'sos', 'shelters', 'dashboard'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-semibold capitalize ${
                activeTab === tab
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              {tab === 'sos' ? '🆘 SOS Requests' : tab === 'shelters' ? '🏛️ Shelters' : tab === 'dashboard' ? '📊 Dashboard' : '🚨 Alerts'}
            </button>
          ))}
        </div>

        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-4">Active Alerts ({alerts.length})</h2>
            {alerts.length === 0 ? (
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 text-center text-slate-400">
                No active alerts
              </div>
            ) : (
              alerts.map((alert) => (
                <div key={alert.id} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-white capitalize">{alert.alertType}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getSeverityBadge(alert.severity)}`}>
                      {alert.severity.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-slate-300 mb-2">{alert.message}</p>
                  <div className="grid grid-cols-2 gap-2 text-sm text-slate-400">
                    <div>📍 Location: {alert.location.area}</div>
                    <div>⏰ Sent: {new Date(alert.sentAt).toLocaleTimeString()}</div>
                  </div>
                  {alert.safetyInstructions.length > 0 && (
                    <div className="mt-3 p-3 bg-slate-700 rounded">
                      <p className="text-sm font-semibold text-yellow-300 mb-2">Safety Instructions:</p>
                      <ul className="text-sm text-slate-300 space-y-1">
                        {alert.safetyInstructions.map((instruction, idx) => (
                          <li key={idx}>• {instruction}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* SOS Requests Tab */}
        {activeTab === 'sos' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-4">Active SOS Requests ({sosRequests.length})</h2>
            {sosRequests.length === 0 ? (
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 text-center text-slate-400">
                No active SOS requests
              </div>
            ) : (
              sosRequests.map((sos) => (
                <div key={sos.id} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-white">{sos.userInfo.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(sos.status)}`}>
                      {sos.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-slate-400 mb-2">
                    <div>📞 {sos.userInfo.phone}</div>
                    <div>👥 {sos.peopleCount} people</div>
                    <div>📍 Lat: {sos.location.lat.toFixed(4)}</div>
                    <div>📍 Lng: {sos.location.lng.toFixed(4)}</div>
                  </div>
                  {sos.assignedTeam && (
                    <div className="mt-2 p-2 bg-blue-900 rounded text-sm text-blue-300">
                      ✓ Assigned to rescue team
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Shelters Tab */}
        {activeTab === 'shelters' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-4">Available Shelters ({shelters.length})</h2>
            {shelters.length === 0 ? (
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 text-center text-slate-400">
                No shelters found
              </div>
            ) : (
              shelters.map((shelter) => (
                <div key={shelter.id} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                  <h3 className="text-lg font-bold text-white mb-2">{shelter.name}</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm text-slate-400 mb-3">
                    <div>📍 {shelter.address}</div>
                    <div>📞 {shelter.contact}</div>
                    <div>🛏️ Capacity: {shelter.capacity}</div>
                    <div>👥 Occupancy: {shelter.occupancy}</div>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(shelter.occupancy / shelter.capacity) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 mb-2">
                    {((shelter.occupancy / shelter.capacity) * 100).toFixed(0)}% Occupied
                  </p>
                  {shelter.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {shelter.amenities.map((amenity, idx) => (
                        <span key={idx} className="bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && metrics && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Authority Dashboard</h2>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <p className="text-slate-400 text-sm">Total Alerts</p>
                <p className="text-3xl font-bold text-red-400">{metrics.alerts.total}</p>
              </div>
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <p className="text-slate-400 text-sm">Active SOS</p>
                <p className="text-3xl font-bold text-orange-400">{metrics.sos.total}</p>
              </div>
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <p className="text-slate-400 text-sm">Rescue Teams</p>
                <p className="text-3xl font-bold text-blue-400">{metrics.rescueTeams.available}/{metrics.rescueTeams.total}</p>
              </div>
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <p className="text-slate-400 text-sm">Shelter Occupancy</p>
                <p className="text-3xl font-bold text-green-400">{metrics.shelters.occupancyPercent.toFixed(0)}%</p>
              </div>
            </div>

            {/* Map */}
            {mapData && (
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-4">Live Incident Map</h3>
                <MapContainer center={[13.0827, 80.2707]} zoom={11} style={{ height: '400px', borderRadius: '8px' }}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                  />
                  {mapData.alerts.map((alert) => (
                    <CircleMarker
                      key={alert.id}
                      center={[alert.lat, alert.lng]}
                      radius={8}
                      fillColor={alert.color}
                      color={alert.color}
                      weight={2}
                      opacity={0.8}
                      fillOpacity={0.6}
                    >
                      <Popup>Alert: {alert.severity}</Popup>
                    </CircleMarker>
                  ))}
                </MapContainer>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DisasterResponseModule;
