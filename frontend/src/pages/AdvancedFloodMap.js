import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import { AlertCircle, Zap, Droplets, Wind, Eye, Download, Share2, Filter, Layers } from 'lucide-react';
import '../theme.css';

export default function AdvancedFloodMap() {
  const [mapCenter, setMapCenter] = useState([13.0827, 80.2707]); // Chennai
  const [zoomLevel, setZoomLevel] = useState(12);
  const [selectedZone, setSelectedZone] = useState(null);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showPredictions, setShowPredictions] = useState(true);
  const [showAlerts, setShowAlerts] = useState(true);
  const [timeRange, setTimeRange] = useState('24h');
  const [mapStyle, setMapStyle] = useState('satellite');
  const [loading, setLoading] = useState(false);
  const mapRef = useRef(null);

  // Mock flood zones with real-time data
  const floodZones = [
    {
      id: 1,
      name: 'Velachery Zone',
      lat: 13.0050,
      lng: 80.2170,
      riskScore: 78,
      riskLevel: 'Critical',
      rainfall: 45,
      waterLevel: 82,
      elevation: 5,
      population: 125000,
      alerts: 12,
      status: 'Active',
      color: '#ef4444'
    },
    {
      id: 2,
      name: 'Tambaram Zone',
      lat: 12.9250,
      lng: 80.1270,
      riskScore: 62,
      riskLevel: 'High',
      rainfall: 32,
      waterLevel: 68,
      elevation: 8,
      population: 98000,
      alerts: 8,
      status: 'Active',
      color: '#f97316'
    },
    {
      id: 3,
      name: 'Guindy Zone',
      lat: 13.0033,
      lng: 80.2270,
      riskScore: 45,
      riskLevel: 'Moderate',
      rainfall: 22,
      waterLevel: 52,
      elevation: 12,
      population: 87000,
      alerts: 4,
      status: 'Monitoring',
      color: '#f59e0b'
    },
    {
      id: 4,
      name: 'Adyar Zone',
      lat: 13.0050,
      lng: 80.2570,
      riskScore: 35,
      riskLevel: 'Low',
      rainfall: 15,
      waterLevel: 38,
      elevation: 15,
      population: 76000,
      alerts: 1,
      status: 'Safe',
      color: '#10b981'
    }
  ];

  // Rescue teams locations
  const rescueTeams = [
    { id: 1, name: 'Team Alpha', lat: 13.0827, lng: 80.2707, status: 'Active', personnel: 12 },
    { id: 2, name: 'Team Beta', lat: 12.9716, lng: 80.2355, status: 'Active', personnel: 10 },
    { id: 3, name: 'Team Gamma', lat: 13.0050, lng: 80.2170, status: 'Deployed', personnel: 15 }
  ];

  // Shelters
  const shelters = [
    { id: 1, name: 'Central Shelter', lat: 13.0827, lng: 80.2707, capacity: 500, occupied: 320 },
    { id: 2, name: 'North Shelter', lat: 13.1050, lng: 80.2500, capacity: 300, occupied: 180 },
    { id: 3, name: 'South Shelter', lat: 12.9500, lng: 80.2000, capacity: 400, occupied: 250 }
  ];

  const getRiskColor = (score) => {
    if (score < 30) return '#10b981';
    if (score < 55) return '#f59e0b';
    if (score < 75) return '#f97316';
    return '#ef4444';
  };

  const handleZoneClick = (zone) => {
    setSelectedZone(zone);
    setMapCenter([zone.lat, zone.lng]);
    setZoomLevel(14);
  };

  const handleDownloadReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      zones: floodZones,
      teams: rescueTeams,
      shelters: shelters
    };
    const element = document.createElement('a');
    element.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2));
    element.download = `flood-report-${Date.now()}.json`;
    element.click();
  };

  const handleShareMap = () => {
    const mapUrl = `${window.location.origin}?zone=${selectedZone?.id || 'all'}&zoom=${zoomLevel}`;
    navigator.clipboard.writeText(mapUrl);
    alert('Map link copied to clipboard!');
  };

  return (
    <div className="main-container">
      {/* Header */}
      <div className="page-header mb-4">
        <div className="flex-between">
          <div>
            <h1 className="page-title">Advanced Flood Risk Map</h1>
            <p className="page-subtitle">Real-time monitoring with AI predictions</p>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-primary" onClick={handleDownloadReport}>
              <Download className="w-4 h-4" />
              Download Report
            </button>
            <button className="btn btn-secondary" onClick={handleShareMap}>
              <Share2 className="w-4 h-4" />
              Share Map
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid-2">
        {/* Map Section */}
        <div className="card p-0" style={{ gridColumn: '1 / -1', minHeight: '600px' }}>
          <div className="relative" style={{ height: '600px' }}>
            {/* Map Controls */}
            <div className="absolute top-4 left-4 z-10 bg-slate-800/90 backdrop-blur rounded-lg p-4 border border-slate-700 w-80">
              <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Map Controls
              </h3>

              {/* Layer Toggle */}
              <div className="space-y-2 mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showHeatmap}
                    onChange={(e) => setShowHeatmap(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-slate-300">Show Heatmap</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showPredictions}
                    onChange={(e) => setShowPredictions(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-slate-300">Show Predictions</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showAlerts}
                    onChange={(e) => setShowAlerts(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-slate-300">Show Active Alerts</span>
                </label>
              </div>

              {/* Time Range */}
              <div className="mb-4">
                <label className="text-xs font-semibold text-slate-400 mb-2 block">Time Range</label>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm text-white"
                >
                  <option value="1h">Last 1 Hour</option>
                  <option value="6h">Last 6 Hours</option>
                  <option value="24h">Last 24 Hours</option>
                  <option value="7d">Last 7 Days</option>
                </select>
              </div>

              {/* Map Style */}
              <div className="mb-4">
                <label className="text-xs font-semibold text-slate-400 mb-2 block">Map Style</label>
                <select
                  value={mapStyle}
                  onChange={(e) => setMapStyle(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm text-white"
                >
                  <option value="satellite">Satellite</option>
                  <option value="street">Street</option>
                  <option value="terrain">Terrain</option>
                </select>
              </div>

              {/* Legend */}
              <div className="border-t border-slate-700 pt-3">
                <h4 className="text-xs font-semibold text-slate-400 mb-2">Risk Levels</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: '#10b981' }}></div>
                    <span className="text-slate-300">Low (&lt;30)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: '#f59e0b' }}></div>
                    <span className="text-slate-300">Moderate (30-55)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: '#f97316' }}></div>
                    <span className="text-slate-300">High (55-75)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: '#ef4444' }}></div>
                    <span className="text-slate-300">Critical (&gt;75)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder with Enhanced Visualization */}
            <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center relative overflow-hidden">
              {/* Animated Background */}
              <div className="absolute inset-0 opacity-20">
                <svg className="w-full h-full" viewBox="0 0 1000 600">
                  {/* Grid */}
                  {[...Array(10)].map((_, i) => (
                    <line key={`v${i}`} x1={i * 100} y1="0" x2={i * 100} y2="600" stroke="#0ea5e9" strokeWidth="0.5" />
                  ))}
                  {[...Array(6)].map((_, i) => (
                    <line key={`h${i}`} x1="0" y1={i * 100} x2="1000" y2={i * 100} stroke="#0ea5e9" strokeWidth="0.5" />
                  ))}
                </svg>
              </div>

              {/* Flood Zones Visualization */}
              <div className="absolute inset-0">
                {floodZones.map((zone) => (
                  <div
                    key={zone.id}
                    className="absolute cursor-pointer transition-all hover:scale-110"
                    style={{
                      left: `${20 + zone.id * 20}%`,
                      top: `${30 + zone.id * 15}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    onClick={() => handleZoneClick(zone)}
                  >
                    {/* Animated Ring */}
                    <div
                      className="absolute w-16 h-16 rounded-full animate-pulse"
                      style={{
                        background: `${zone.color}20`,
                        border: `2px solid ${zone.color}`,
                        left: '-32px',
                        top: '-32px'
                      }}
                    />
                    {/* Center Dot */}
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ background: zone.color }}
                    />
                  </div>
                ))}

                {/* Rescue Teams */}
                {rescueTeams.map((team) => (
                  <div
                    key={team.id}
                    className="absolute"
                    style={{
                      left: `${15 + team.id * 25}%`,
                      top: `${60 + team.id * 10}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <div className="text-2xl animate-bounce">🚁</div>
                    <div className="text-xs text-slate-300 mt-1 whitespace-nowrap">{team.name}</div>
                  </div>
                ))}

                {/* Shelters */}
                {shelters.map((shelter) => (
                  <div
                    key={shelter.id}
                    className="absolute"
                    style={{
                      left: `${25 + shelter.id * 20}%`,
                      top: `${20 + shelter.id * 15}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <div className="text-2xl">🏛️</div>
                    <div className="text-xs text-slate-300 mt-1 whitespace-nowrap">{shelter.name}</div>
                  </div>
                ))}
              </div>

              {/* Center Info */}
              <div className="relative z-10 text-center">
                <Eye className="w-12 h-12 text-slate-500 mx-auto mb-2" />
                <p className="text-slate-400">Interactive Flood Risk Map</p>
                <p className="text-xs text-slate-500 mt-1">Click on zones for details</p>
              </div>
            </div>

            {/* Top Right Stats */}
            <div className="absolute top-4 right-4 z-10 space-y-2">
              <div className="bg-slate-800/90 backdrop-blur rounded-lg p-3 border border-slate-700 text-sm">
                <div className="text-slate-400">Active Alerts</div>
                <div className="text-2xl font-bold text-red-400">
                  {floodZones.reduce((sum, z) => sum + z.alerts, 0)}
                </div>
              </div>
              <div className="bg-slate-800/90 backdrop-blur rounded-lg p-3 border border-slate-700 text-sm">
                <div className="text-slate-400">Critical Zones</div>
                <div className="text-2xl font-bold text-orange-400">
                  {floodZones.filter(z => z.riskScore > 75).length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Zones Panel */}
        <div className="space-y-3">
          <h2 className="section-title">Flood Risk Zones</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {floodZones.map((zone) => (
              <div
                key={zone.id}
                className="card cursor-pointer transition-all hover:border-primary"
                onClick={() => handleZoneClick(zone)}
                style={{ borderLeft: `4px solid ${zone.color}` }}
              >
                <div className="flex-between mb-2">
                  <h4 className="font-semibold text-white">{zone.name}</h4>
                  <span className="badge" style={{ background: zone.color, color: 'white', border: 'none' }}>
                    {zone.riskLevel}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                  <div>
                    <Droplets className="w-3 h-3 inline mr-1" />
                    Water: {zone.waterLevel}%
                  </div>
                  <div>
                    <Wind className="w-3 h-3 inline mr-1" />
                    Rain: {zone.rainfall}mm
                  </div>
                  <div>👥 Pop: {(zone.population / 1000).toFixed(0)}K</div>
                  <div>
                    <AlertCircle className="w-3 h-3 inline mr-1" />
                    Alerts: {zone.alerts}
                  </div>
                </div>
                <div className="mt-2 bg-slate-700/50 rounded h-1">
                  <div
                    className="h-full rounded transition-all"
                    style={{
                      width: `${zone.riskScore}%`,
                      background: zone.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resources Panel */}
        <div className="space-y-3">
          <h2 className="section-title">Emergency Resources</h2>

          {/* Rescue Teams */}
          <div className="card">
            <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
              <span className="text-lg">🚁</span>
              Rescue Teams ({rescueTeams.length})
            </h4>
            <div className="space-y-2">
              {rescueTeams.map((team) => (
                <div key={team.id} className="bg-slate-700/50 rounded p-2 text-sm">
                  <div className="flex-between">
                    <span className="text-slate-300">{team.name}</span>
                    <span className="badge badge-success">{team.status}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">👥 {team.personnel} personnel</div>
                </div>
              ))}
            </div>
          </div>

          {/* Shelters */}
          <div className="card">
            <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
              <span className="text-lg">🏛️</span>
              Shelters ({shelters.length})
            </h4>
            <div className="space-y-2">
              {shelters.map((shelter) => (
                <div key={shelter.id} className="bg-slate-700/50 rounded p-2 text-sm">
                  <div className="flex-between mb-1">
                    <span className="text-slate-300">{shelter.name}</span>
                    <span className="text-xs text-slate-400">
                      {shelter.occupied}/{shelter.capacity}
                    </span>
                  </div>
                  <div className="bg-slate-600 rounded h-1">
                    <div
                      className="h-full bg-blue-500 rounded transition-all"
                      style={{ width: `${(shelter.occupied / shelter.capacity) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Selected Zone Details */}
      {selectedZone && (
        <div className="section mt-4">
          <div className="flex-between mb-4">
            <h2 className="section-title" style={{ margin: 0 }}>
              {selectedZone.name} - Detailed Analysis
            </h2>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setSelectedZone(null)}
            >
              Close
            </button>
          </div>

          <div className="grid-4">
            <div className="card">
              <div className="text-sm text-slate-400 mb-1">Risk Score</div>
              <div className="text-3xl font-bold text-primary">{selectedZone.riskScore}</div>
              <div className="text-xs text-slate-500 mt-1">{selectedZone.riskLevel}</div>
            </div>
            <div className="card">
              <div className="text-sm text-slate-400 mb-1">Water Level</div>
              <div className="text-3xl font-bold text-blue-400">{selectedZone.waterLevel}%</div>
              <div className="text-xs text-slate-500 mt-1">Current</div>
            </div>
            <div className="card">
              <div className="text-sm text-slate-400 mb-1">Rainfall</div>
              <div className="text-3xl font-bold text-cyan-400">{selectedZone.rainfall}mm</div>
              <div className="text-xs text-slate-500 mt-1">24 hours</div>
            </div>
            <div className="card">
              <div className="text-sm text-slate-400 mb-1">Population</div>
              <div className="text-3xl font-bold text-orange-400">
                {(selectedZone.population / 1000).toFixed(0)}K
              </div>
              <div className="text-xs text-slate-500 mt-1">At risk</div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="card mt-4">
            <h3 className="font-semibold text-white mb-3">Recommended Actions</h3>
            <div className="space-y-2">
              {selectedZone.riskScore > 75 && (
                <div className="alert alert-danger">
                  🚨 Immediate evacuation recommended for critical zone
                </div>
              )}
              {selectedZone.riskScore > 55 && (
                <div className="alert alert-warning">
                  ⚠️ High alert status - Prepare evacuation routes
                </div>
              )}
              {selectedZone.riskScore > 30 && (
                <div className="alert alert-info">
                  ℹ️ Monitor situation closely - Increase surveillance
                </div>
              )}
              <div className="bg-slate-700/50 rounded p-3 text-sm text-slate-300">
                <strong>Next Steps:</strong>
                <ul className="mt-2 space-y-1 ml-4 list-disc">
                  <li>Deploy rescue teams to high-risk areas</li>
                  <li>Activate emergency shelters</li>
                  <li>Issue public alerts and warnings</li>
                  <li>Coordinate with local authorities</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
