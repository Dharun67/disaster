import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const EmergencyContacts = () => {
  const [selectedZone, setSelectedZone] = useState('Velachery');
  const [selectedArea, setSelectedArea] = useState('Central');
  const [contacts, setContacts] = useState(null);
  const [allServices, setAllServices] = useState(null);
  const [loading, setLoading] = useState(true);
  const [disasterType, setDisasterType] = useState('flood');
  const [severity, setSeverity] = useState('high');

  const areas = ['North', 'Central', 'South', 'East', 'West'];
  const disasterTypes = ['flood', 'earthquake', 'landslide', 'cyclone', 'fire'];

  useEffect(() => {
    fetchEmergencyContacts();
    fetchAllServices();
  }, [selectedZone]);

  const fetchEmergencyContacts = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/emergency-contacts/${selectedZone}`);
      setContacts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setLoading(false);
    }
  };

  const fetchAllServices = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/all-emergency-services');
      setAllServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const triggerDisasterAlert = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/disaster-alert', {
        zone: selectedZone,
        type: disasterType,
        severity: severity
      });
      alert(`🚨 ALERT TRIGGERED!\n\nZone: ${response.data.zone}\nType: ${response.data.disaster_type}\n\nEmergency services notified!`);
    } catch (error) {
      console.error('Error triggering alert:', error);
    }
  };

  const ServiceCard = ({ icon, title, services }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 border-2 border-cyan-500/40 rounded-lg p-4"
    >
      <h3 className="text-lg font-bold text-cyan-400 mb-3 flex items-center gap-2">
        <span className="text-2xl">{icon}</span>
        {title}
      </h3>
      <div className="space-y-2">
        {services && services.map((service, idx) => (
          <div key={idx} className="bg-slate-900/50 rounded p-2 text-sm">
            <div className="font-semibold text-white">{service.name}</div>
            <div className="text-cyan-300">📞 {service.phone}</div>
            {service.beds && <div className="text-yellow-300">🛏️ {service.beds} beds</div>}
            {service.members && <div className="text-green-300">👥 {service.members} members</div>}
          </div>
        ))}
      </div>
    </motion.div>
  );

  if (loading) return <div className="text-white text-center p-8">Loading emergency contacts...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent mb-2">
          🚨 EMERGENCY CONTACTS & DISASTER ALERT
        </h1>
        <p className="text-red-300">Immediate access to Police, Ambulance, Hospitals & Rescue Teams across Chennai</p>
      </motion.div>

      {/* Disaster Alert Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-r from-red-900/40 to-orange-900/40 border-2 border-red-500 rounded-lg p-6 mb-8"
      >
        <h2 className="text-2xl font-bold text-red-400 mb-4">🚨 TRIGGER DISASTER ALERT</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="text-sm text-white/70">Select Zone</label>
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="w-full bg-slate-800 border border-cyan-500 rounded p-2 text-white mt-1"
            >
              {allServices?.services.police.map(p => (
                <option key={p.name} value={p.name.split(' - ')[1] || 'Velachery'}>
                  {p.name.split(' - ')[1] || 'Velachery'}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-white/70">Disaster Type</label>
            <select
              value={disasterType}
              onChange={(e) => setDisasterType(e.target.value)}
              className="w-full bg-slate-800 border border-cyan-500 rounded p-2 text-white mt-1"
            >
              {disasterTypes.map(type => (
                <option key={type} value={type}>{type.toUpperCase()}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-white/70">Severity</label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="w-full bg-slate-800 border border-cyan-500 rounded p-2 text-white mt-1"
            >
              <option value="low">LOW</option>
              <option value="medium">MEDIUM</option>
              <option value="high">HIGH</option>
              <option value="critical">CRITICAL</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={triggerDisasterAlert}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-2 px-4 rounded transition shadow-lg shadow-red-500/50"
            >
              🚨 TRIGGER ALERT
            </button>
          </div>
        </div>
      </motion.div>

      {/* Zone Selection */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-cyan-400 mb-4">📍 Select Zone</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {allServices?.services.police.map((police, idx) => {
            const zone = police.name.split(' - ')[1] || 'Zone';
            return (
              <button
                key={idx}
                onClick={() => setSelectedZone(zone)}
                className={`p-2 rounded font-semibold transition ${
                  selectedZone === zone
                    ? 'bg-cyan-600 text-white'
                    : 'bg-slate-800 text-cyan-300 hover:bg-slate-700'
                }`}
              >
                {zone}
              </button>
            );
          })}
        </div>
      </div>

      {/* Emergency Contacts Grid */}
      {contacts && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <ServiceCard
            icon="🚔"
            title="POLICE"
            services={contacts.emergency_services.police}
          />
          <ServiceCard
            icon="🚑"
            title="AMBULANCE"
            services={contacts.emergency_services.ambulance}
          />
          <ServiceCard
            icon="🏥"
            title="HOSPITALS"
            services={contacts.emergency_services.hospitals}
          />
          <ServiceCard
            icon="👥"
            title="RESCUE TEAMS"
            services={contacts.emergency_services.rescue_teams}
          />
        </div>
      )}

      {/* Quick Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/50 border-2 border-cyan-500/40 rounded-lg p-6 mb-8"
      >
        <h2 className="text-2xl font-bold text-cyan-400 mb-4">⚡ QUICK ACTIONS</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-4 rounded transition shadow-lg">
            📞 CALL POLICE (100)
          </button>
          <button className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-bold py-3 px-4 rounded transition shadow-lg">
            🚑 CALL AMBULANCE (108)
          </button>
          <button className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white font-bold py-3 px-4 rounded transition shadow-lg">
            🚒 CALL FIRE & RESCUE (101)
          </button>
          <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-4 rounded transition shadow-lg">
            📍 SHARE LOCATION
          </button>
        </div>
      </motion.div>

      {/* Area Coverage */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/50 border-2 border-cyan-500/40 rounded-lg p-6"
      >
        <h2 className="text-2xl font-bold text-cyan-400 mb-4">🗺️ COVERAGE BY AREA</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {areas.map(area => (
            <div key={area} className="bg-slate-900/50 rounded p-4 border border-cyan-500/20">
              <h3 className="font-bold text-cyan-300 mb-2">{area} Chennai</h3>
              <div className="text-sm space-y-1 text-white/70">
                <div>🚔 Police: 1</div>
                <div>🚑 Ambulance: 1</div>
                <div>🏥 Hospitals: {allServices?.services.hospitals.filter(h => h.area === area).length || 0}</div>
                <div>👥 Rescue: {allServices?.services.rescue_teams.filter(r => r.area === area).length || 0}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Emergency Numbers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 bg-gradient-to-r from-red-900/30 to-orange-900/30 border-2 border-red-500/50 rounded-lg p-6"
      >
        <h2 className="text-2xl font-bold text-red-400 mb-4">📞 EMERGENCY NUMBERS</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/50 rounded p-4 text-center">
            <div className="text-3xl font-bold text-red-400">100</div>
            <div className="text-sm text-white/70">Police</div>
          </div>
          <div className="bg-slate-900/50 rounded p-4 text-center">
            <div className="text-3xl font-bold text-orange-400">108</div>
            <div className="text-sm text-white/70">Ambulance</div>
          </div>
          <div className="bg-slate-900/50 rounded p-4 text-center">
            <div className="text-3xl font-bold text-yellow-400">101</div>
            <div className="text-sm text-white/70">Fire & Rescue</div>
          </div>
          <div className="bg-slate-900/50 rounded p-4 text-center">
            <div className="text-3xl font-bold text-blue-400">1077</div>
            <div className="text-sm text-white/70">Disaster Mgmt</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EmergencyContacts;
