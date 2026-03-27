import React, { useState, useEffect } from 'react';
import { healthCheck } from '../services/api';

export default function LandingPage() {
  const [systemStatus, setSystemStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSystemStatus();
  }, []);

  const checkSystemStatus = async () => {
    try {
      const status = await healthCheck();
      setSystemStatus(status);
    } catch (err) {
      console.error('Status check error:', err);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: '🗺️',
      title: 'Live Disaster Dashboard',
      description: 'Real-time interactive map with color-coded flood risk levels for all zones'
    },
    {
      icon: '🚨',
      title: 'Emergency SOS System',
      description: 'One-click distress alerts with automatic location tracking and emergency services notification'
    },
    {
      icon: '🏠',
      title: 'Shelter Locator',
      description: 'Find nearby relief centers with real-time capacity tracking and amenities information'
    },
    {
      icon: '👥',
      title: 'Rescue Team Coordination',
      description: 'Track available rescue teams and assign zones for efficient emergency response'
    },
    {
      icon: '📊',
      title: 'Admin Command Center',
      description: 'Monitor all alerts, reports, and rescue operations from a centralized dashboard'
    },
    {
      icon: '📱',
      title: 'Crowdsourced Reports',
      description: 'Users can report floods, blocked roads, and water levels in real-time'
    }
  ];

  const pages = [
    { path: '/dashboard', name: 'Live Dashboard', icon: '🗺️' },
    { path: '/sos', name: 'Emergency SOS', icon: '🚨' },
    { path: '/shelters', name: 'Shelter Locator', icon: '🏠' },
    { path: '/admin', name: 'Admin Dashboard', icon: '👨‍💼' },
    { path: '/command-center-pro', name: 'Command Center', icon: '📊' },
    { path: '/emergency-contacts', name: 'Emergency Contacts', icon: '📞' },
    { path: '/flood-detection', name: 'Flood Detection', icon: '🌊' },
    { path: '/flood-simulation', name: 'Flood Simulation', icon: '💧' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🌍</div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">GeoGuard</h1>
              <p className="text-xs text-gray-600">Hyperlocal Flood Risk Prediction</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {!loading && systemStatus && (
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${systemStatus.database === 'Connected' ? 'bg-green-600' : 'bg-red-600'}`} />
                <span className="text-sm font-medium text-gray-700">
                  {systemStatus.database === 'Connected' ? 'System Online' : 'System Offline'}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-blue-100 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              AI-Powered Hyperlocal Flood Risk Prediction
            </h2>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Real-time disaster intelligence platform that predicts flood risk at hyperlocal levels, provides emergency guidance, and enables coordinated rescue operations.
            </p>
            <div className="flex gap-4 justify-center">
              <a
                href="/dashboard"
                className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Live Dashboard
              </a>
              <a
                href="/sos"
                className="px-8 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors"
              >
                Emergency SOS
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">Core Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Risk Categories Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">Risk Categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg border border-green-200 p-6 text-center">
              <div className="text-4xl mb-3">🟢</div>
              <h4 className="font-bold text-green-700 mb-2">Low Risk</h4>
              <p className="text-sm text-gray-600">Score &lt; 30</p>
              <p className="text-xs text-gray-500 mt-2">Safe conditions</p>
            </div>
            <div className="bg-white rounded-lg border border-amber-200 p-6 text-center">
              <div className="text-4xl mb-3">🟡</div>
              <h4 className="font-bold text-amber-700 mb-2">Moderate Risk</h4>
              <p className="text-sm text-gray-600">Score 30-55</p>
              <p className="text-xs text-gray-500 mt-2">Caution advised</p>
            </div>
            <div className="bg-white rounded-lg border border-orange-200 p-6 text-center">
              <div className="text-4xl mb-3">🟠</div>
              <h4 className="font-bold text-orange-700 mb-2">High Risk</h4>
              <p className="text-sm text-gray-600">Score 55-75</p>
              <p className="text-xs text-gray-500 mt-2">Evacuation recommended</p>
            </div>
            <div className="bg-white rounded-lg border border-red-200 p-6 text-center">
              <div className="text-4xl mb-3">🔴</div>
              <h4 className="font-bold text-red-700 mb-2">Critical Risk</h4>
              <p className="text-sm text-gray-600">Score &gt; 75</p>
              <p className="text-xs text-gray-500 mt-2">Immediate evacuation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pages Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">Available Pages</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {pages.map((page, idx) => (
              <a
                key={idx}
                href={page.path}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all text-center"
              >
                <div className="text-3xl mb-3">{page.icon}</div>
                <p className="font-bold text-gray-900">{page.name}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* AI Model Section */}
      <section className="bg-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">AI Prediction Model</h3>
          <div className="bg-white rounded-lg border border-gray-200 p-8 max-w-2xl mx-auto">
            <p className="text-center text-gray-700 mb-6">
              Our advanced AI model calculates flood risk using a weighted formula:
            </p>
            <div className="bg-gray-50 rounded-lg p-6 font-mono text-sm mb-6">
              <p className="text-center text-gray-900">
                Risk Score = (Rainfall × 0.4) + (Water Level × 0.4) + ((100 - Elevation) × 0.2)
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="font-bold text-gray-900">Rainfall</p>
                <p className="text-sm text-gray-600">40% weight</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-gray-900">Water Level</p>
                <p className="text-sm text-gray-600">40% weight</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-gray-900">Elevation</p>
                <p className="text-sm text-gray-600">20% weight</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">Technology Stack</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h4 className="font-bold text-gray-900 mb-4">Frontend</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ React.js 18</li>
                <li>✓ Tailwind CSS</li>
                <li>✓ Leaflet Maps</li>
                <li>✓ Axios HTTP Client</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h4 className="font-bold text-gray-900 mb-4">Backend</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ Node.js + Express</li>
                <li>✓ MongoDB Atlas</li>
                <li>✓ JWT Authentication</li>
                <li>✓ CORS Enabled</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h4 className="font-bold text-gray-900 mb-4">AI/ML</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ Python Flask</li>
                <li>✓ Numpy Calculations</li>
                <li>✓ Risk Prediction</li>
                <li>✓ Real-time Analysis</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-400">
            GeoGuard © 2024 - AI-Powered Hyperlocal Flood Risk Prediction System
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Transforming Disaster Alerts into Actionable Intelligence
          </p>
        </div>
      </footer>
    </div>
  );
}
