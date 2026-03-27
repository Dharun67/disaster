import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, AlertTriangle, Shield, Zap, Clock, Download, Share2, Wifi, WifiOff } from 'lucide-react';
import OfflineRoutingService from '../services/routingService';

const SmartRoutingMap = () => {
  const canvasRef = useRef(null);
  const [routingService] = useState(new OfflineRoutingService());
  const [startLocation, setStartLocation] = useState('Villivakkam');
  const [endLocation, setEndLocation] = useState('Mylapore');
  const [route, setRoute] = useState(null);
  const [nearestSafeZone, setNearestSafeZone] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showRoute, setShowRoute] = useState(false);
  const [routeDetails, setRouteDetails] = useState(null);
  const [allLocations, setAllLocations] = useState([]);

  useEffect(() => {
    setAllLocations(routingService.getAllLocations());
    window.addEventListener('online', () => setIsOnline(true));
    window.addEventListener('offline', () => setIsOnline(false));
    return () => {
      window.removeEventListener('online', () => setIsOnline(true));
      window.removeEventListener('offline', () => setIsOnline(false));
    };
  }, [routingService]);

  const findRoute = () => {
    const result = routingService.findShortestPath(startLocation, endLocation, true);
    
    if (result.valid) {
      setRoute(result);
      setShowRoute(true);
      
      // Calculate route details
      const details = {
        distance: result.distance.toFixed(2),
        estimatedTime: Math.ceil(result.distance / 40 * 60), // Assuming 40 km/h average
        stops: result.path.length,
        safetyScore: calculateSafetyScore(result.path)
      };
      setRouteDetails(details);

      // Find nearest safe zone
      const safeZone = routingService.findNearestSafeZone({
        lat: 13.0827,
        lng: 80.2707
      });
      setNearestSafeZone(safeZone);
    }
  };

  const calculateSafetyScore = (path) => {
    let score = 100;
    for (let location of path) {
      if (routingService.isFloodedArea(location)) {
        score -= 20;
      }
    }
    return Math.max(0, score);
  };

  const drawMap = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = '#f0f9ff';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = '#e0e7ff';
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    for (let i = 0; i < height; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }

    // Draw roads
    const roadNetwork = routingService.getRoadNetwork();
    const nodePositions = generateNodePositions(allLocations, width, height);

    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    const drawnEdges = new Set();

    for (let [from, neighbors] of roadNetwork) {
      const fromPos = nodePositions[from];
      if (!fromPos) continue;

      for (let neighbor of neighbors) {
        const toPos = nodePositions[neighbor.node];
        if (!toPos) continue;

        const edgeKey = [from, neighbor.node].sort().join('-');
        if (drawnEdges.has(edgeKey)) continue;
        drawnEdges.add(edgeKey);

        // Draw road
        ctx.beginPath();
        ctx.moveTo(fromPos.x, fromPos.y);
        ctx.lineTo(toPos.x, toPos.y);
        ctx.stroke();

        // Draw distance label
        const midX = (fromPos.x + toPos.x) / 2;
        const midY = (fromPos.y + toPos.y) / 2;
        ctx.fillStyle = '#64748b';
        ctx.font = '10px Arial';
        ctx.fillText(`${neighbor.distance}km`, midX, midY);
      }
    }

    // Draw flood risk areas
    const floodAreas = routingService.getFloodRiskAreas();
    ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    for (let area of floodAreas) {
      const pos = nodePositions[area.location];
      if (pos) {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 30, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
      }
    }

    // Draw safety zones
    const safetyZones = routingService.getSafetyZones();
    ctx.fillStyle = 'rgba(34, 197, 94, 0.2)';
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2;
    for (let zone of safetyZones) {
      const pos = nodePositions[zone.location];
      if (pos) {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 25, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
      }
    }

    // Draw nodes
    for (let [location, pos] of Object.entries(nodePositions)) {
      const isStart = location === startLocation;
      const isEnd = location === endLocation;
      const isInRoute = route && route.path.includes(location);

      if (isStart) {
        ctx.fillStyle = '#3b82f6';
      } else if (isEnd) {
        ctx.fillStyle = '#ef4444';
      } else if (isInRoute) {
        ctx.fillStyle = '#10b981';
      } else {
        ctx.fillStyle = '#6b7280';
      }

      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 8, 0, 2 * Math.PI);
      ctx.fill();

      // Draw label
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 11px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(location.substring(0, 3), pos.x, pos.y + 20);
    }

    // Draw route if available
    if (route && showRoute) {
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);

      for (let i = 0; i < route.path.length - 1; i++) {
        const fromPos = nodePositions[route.path[i]];
        const toPos = nodePositions[route.path[i + 1]];

        if (fromPos && toPos) {
          ctx.beginPath();
          ctx.moveTo(fromPos.x, fromPos.y);
          ctx.lineTo(toPos.x, toPos.y);
          ctx.stroke();
        }
      }

      ctx.setLineDash([]);
    }
  };

  const generateNodePositions = (locations, width, height) => {
    const positions = {};
    const cols = Math.ceil(Math.sqrt(locations.length));
    const cellWidth = width / cols;
    const cellHeight = height / Math.ceil(locations.length / cols);

    locations.forEach((location, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      positions[location] = {
        x: col * cellWidth + cellWidth / 2,
        y: row * cellHeight + cellHeight / 2
      };
    });

    return positions;
  };

  useEffect(() => {
    drawMap();
  }, [route, showRoute, startLocation, endLocation, allLocations]);

  const downloadRoute = () => {
    if (!route) return;
    const routeData = {
      start: startLocation,
      end: endLocation,
      path: route.path,
      distance: routeDetails.distance,
      estimatedTime: routeDetails.estimatedTime,
      timestamp: new Date().toISOString()
    };
    const dataStr = JSON.stringify(routeData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `route-${Date.now()}.json`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Navigation className="w-8 h-8 text-blue-400" />
              <h1 className="text-4xl font-bold text-white">Smart Routing System</h1>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700">
              {isOnline ? (
                <>
                  <Wifi className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 text-sm font-semibold">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-400 text-sm font-semibold">Offline Mode</span>
                </>
              )}
            </div>
          </div>
          <p className="text-slate-300">Find shortest paths without traffic • Works offline • Avoids flood zones</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Control Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-4"
          >
            {/* Start Location */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 p-4">
              <label className="block text-sm font-semibold text-slate-300 mb-2">Start Location</label>
              <select
                value={startLocation}
                onChange={(e) => setStartLocation(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                {allLocations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* End Location */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 p-4">
              <label className="block text-sm font-semibold text-slate-300 mb-2">End Location</label>
              <select
                value={endLocation}
                onChange={(e) => setEndLocation(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                {allLocations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* Find Route Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={findRoute}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-lg transition-all"
            >
              <Navigation className="w-4 h-4 inline mr-2" />
              Find Route
            </motion.button>

            {/* Route Details */}
            {routeDetails && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-green-900/30 to-slate-900 rounded-xl border border-green-600/50 p-4 space-y-3"
              >
                <div>
                  <p className="text-slate-400 text-xs">Distance</p>
                  <p className="text-green-400 font-bold text-lg">{routeDetails.distance} km</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Est. Time</p>
                  <p className="text-green-400 font-bold text-lg">{routeDetails.estimatedTime} min</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Safety Score</p>
                  <div className="w-full bg-slate-700 rounded-full h-2 mt-1">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${routeDetails.safetyScore}%` }}
                    />
                  </div>
                  <p className="text-green-400 font-bold text-sm mt-1">{routeDetails.safetyScore}%</p>
                </div>
                <div className="flex gap-2 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={downloadRoute}
                    className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-1"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="flex-1 py-2 px-3 bg-slate-700 hover:bg-slate-600 text-white text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-1"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Nearest Safe Zone */}
            {nearestSafeZone && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-green-900/30 to-slate-900 rounded-xl border border-green-600/50 p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-green-400" />
                  <h3 className="font-bold text-white">Nearest Safe Zone</h3>
                </div>
                <p className="text-slate-300 text-sm">{nearestSafeZone.name}</p>
                <p className="text-slate-400 text-xs">{nearestSafeZone.location}</p>
              </motion.div>
            )}
          </motion.div>

          {/* Map Canvas */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-3"
          >
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 p-4 shadow-2xl">
              <canvas
                ref={canvasRef}
                width={800}
                height={600}
                className="w-full border border-slate-600 rounded-lg bg-blue-50"
              />
              
              {/* Legend */}
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-slate-300">Start</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-slate-300">End</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-slate-300">Route</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 opacity-50" />
                  <span className="text-slate-300">Flood Zone</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Route Path Display */}
        {route && showRoute && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 p-6"
          >
            <h2 className="text-xl font-bold text-white mb-4">Route Path</h2>
            <div className="flex flex-wrap gap-2">
              {route.path.map((location, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <div className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-semibold">
                    {location}
                  </div>
                  {index < route.path.length - 1 && (
                    <span className="text-slate-400">→</span>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SmartRoutingMap;
