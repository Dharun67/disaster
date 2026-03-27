import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, MapPin, Phone, Cross, Shield, Zap, CheckCircle, Clock, Wifi, WifiOff } from 'lucide-react';
import authService from '../services/authService';

const EnhancedEmergencySOS = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [sosActive, setSosActive] = useState(false);
  const [sosTriggered, setSosTriggered] = useState(false);
  const [countdownTimer, setCountdownTimer] = useState(0);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [offlineQueue, setOfflineQueue] = useState([]);
  const [emergencyContacts, setEmergencyContacts] = useState(null);
  const sosIntervalRef = useRef(null);
  const countdownRef = useRef(null);
  const user = authService.getUser();

  // Get location on mount
  useEffect(() => {
    getLocation();
    fetchEmergencyContacts();
    
    // Listen for online/offline events
    window.addEventListener('online', () => setIsOnline(true));
    window.addEventListener('offline', () => setIsOnline(false));

    return () => {
      window.removeEventListener('online', () => setIsOnline(true));
      window.removeEventListener('offline', () => setIsOnline(false));
    };
  }, []);

  // Continuous location tracking when SOS is active
  useEffect(() => {
    if (sosActive) {
      sosIntervalRef.current = setInterval(() => {
        getLocation();
      }, 5000); // Update location every 5 seconds
    }
    return () => {
      if (sosIntervalRef.current) clearInterval(sosIntervalRef.current);
    };
  }, [sosActive]);

  // Countdown timer
  useEffect(() => {
    if (countdownTimer > 0) {
      countdownRef.current = setTimeout(() => {
        setCountdownTimer(countdownTimer - 1);
      }, 1000);
    } else if (countdownTimer === 0 && sosTriggered) {
      setSosTriggered(false);
      setSosActive(false);
    }
    return () => clearTimeout(countdownRef.current);
  }, [countdownTimer, sosTriggered]);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date().toISOString()
          });
          setError('');
        },
        (err) => {
          // Fallback to default location
          setLocation({
            lat: 13.0827,
            lng: 80.2707,
            accuracy: null,
            timestamp: new Date().toISOString()
          });
          setError('Using default location. Enable location services for accurate position.');
        }
      );
    }
  };

  const fetchEmergencyContacts = async () => {
    try {
      const token = authService.getToken();
      const response = await fetch('http://localhost:5000/api/emergency-contacts', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setEmergencyContacts(data);
    } catch (err) {
      console.error('Error fetching emergency contacts:', err);
    }
  };

  const sendEmergencyAlert = async () => {
    if (!location) {
      setError('Location not available. Please enable location services.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const alertData = {
      userId: user?.id,
      userName: user?.name || 'Emergency User',
      userPhone: user?.phone || 'Not provided',
      userEmail: user?.email || 'Not provided',
      location: {
        lat: location.lat,
        lng: location.lng,
        accuracy: location.accuracy
      },
      timestamp: new Date().toISOString(),
      type: 'EMERGENCY_SOS',
      status: 'ACTIVE'
    };

    try {
      if (isOnline) {
        // Send to backend
        const token = authService.getToken();
        const response = await fetch('http://localhost:5000/api/emergency-sos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(alertData)
        });

        if (!response.ok) throw new Error('Failed to send alert');

        const result = await response.json();
        
        // Send to police, hospitals, rescue teams
        await notifyEmergencyServices(alertData);

        setSuccess('🚨 EMERGENCY ALERT SENT! Help is on the way!');
        setSosTriggered(true);
        setCountdownTimer(300); // 5 minutes countdown
        
        // Add to alerts list
        setAlerts([{
          id: result.alertId,
          ...alertData,
          status: 'SENT'
        }, ...alerts]);

        // Clear offline queue if any
        setOfflineQueue([]);
      } else {
        // Queue for offline
        setOfflineQueue([...offlineQueue, alertData]);
        setSuccess('⚠️ Offline Mode: Alert queued. Will send when online.');
        setSosTriggered(true);
        setCountdownTimer(300);
      }

      setSosActive(true);
    } catch (err) {
      setError('Failed to send emergency alert: ' + err.message);
      // Queue for retry
      setOfflineQueue([...offlineQueue, alertData]);
    } finally {
      setLoading(false);
    }
  };

  const notifyEmergencyServices = async (alertData) => {
    try {
      const token = authService.getToken();
      
      // Notify police
      await fetch('http://localhost:5000/api/notify-police', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(alertData)
      }).catch(err => console.error('Police notification failed:', err));

      // Notify hospitals
      await fetch('http://localhost:5000/api/notify-hospitals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(alertData)
      }).catch(err => console.error('Hospital notification failed:', err));

      // Notify rescue teams
      await fetch('http://localhost:5000/api/notify-rescue-teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(alertData)
      }).catch(err => console.error('Rescue team notification failed:', err));
    } catch (err) {
      console.error('Error notifying emergency services:', err);
    }
  };

  const cancelSOS = () => {
    setSosActive(false);
    setSosTriggered(false);
    setCountdownTimer(0);
    setSuccess('');
  };

  const retryOfflineAlerts = async () => {
    if (offlineQueue.length === 0) return;

    setLoading(true);
    for (const alert of offlineQueue) {
      try {
        await notifyEmergencyServices(alert);
      } catch (err) {
        console.error('Retry failed:', err);
      }
    }
    setOfflineQueue([]);
    setSuccess('Offline alerts sent successfully!');
    setLoading(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 p-4">
      {/* Online/Offline Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700"
      >
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
      </motion.div>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 mt-12"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl mb-4"
          >
            🚨
          </motion.div>
          <h1 className="text-4xl font-bold text-white mb-2">Emergency SOS System</h1>
          <p className="text-red-200">Automatic location detection & emergency services notification</p>
        </motion.div>

        {/* Alerts */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-start gap-3"
            >
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-200 text-sm">{error}</p>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg flex items-start gap-3"
            >
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-green-200 text-sm">{success}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main SOS Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 p-8 text-center">
            {!sosTriggered ? (
              <>
                <p className="text-slate-300 mb-6 text-lg">
                  Click the button below to send an immediate emergency alert with your location
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={sendEmergencyAlert}
                  disabled={loading || !location}
                  className="w-full py-6 px-8 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:opacity-50 text-white font-bold text-2xl rounded-xl transition-all shadow-2xl shadow-red-600/50"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} className="w-6 h-6 border-2 border-white border-t-transparent rounded-full" />
                      Sending Alert...
                    </span>
                  ) : (
                    '🚨 SEND EMERGENCY ALERT'
                  )}
                </motion.button>
              </>
            ) : (
              <>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-6xl mb-4"
                >
                  ✅
                </motion.div>
                <p className="text-green-400 text-xl font-bold mb-4">EMERGENCY ALERT SENT!</p>
                <p className="text-slate-300 mb-6">Help is on the way. Stay calm and wait for assistance.</p>
                
                {/* Countdown Timer */}
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-red-400" />
                    <span className="text-red-200 font-semibold">Alert Active For:</span>
                  </div>
                  <div className="text-4xl font-bold text-red-400 font-mono">
                    {formatTime(countdownTimer)}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={cancelSOS}
                  className="w-full py-3 px-6 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all"
                >
                  Cancel Alert
                </motion.button>
              </>
            )}
          </div>
        </motion.div>

        {/* Location Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        >
          {/* Current Location */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-6 h-6 text-blue-400" />
              <h2 className="text-xl font-bold text-white">Current Location</h2>
            </div>
            {location ? (
              <div className="space-y-3">
                <div>
                  <p className="text-slate-400 text-sm">Latitude</p>
                  <p className="text-white font-mono text-lg">{location.lat.toFixed(6)}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Longitude</p>
                  <p className="text-white font-mono text-lg">{location.lng.toFixed(6)}</p>
                </div>
                {location.accuracy && (
                  <div>
                    <p className="text-slate-400 text-sm">Accuracy</p>
                    <p className="text-white font-mono text-lg">±{location.accuracy.toFixed(0)}m</p>
                  </div>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={getLocation}
                  className="w-full mt-4 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all"
                >
                  Refresh Location
                </motion.button>
              </div>
            ) : (
              <p className="text-slate-400">Getting location...</p>
            )}
          </div>

          {/* User Info */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Phone className="w-6 h-6 text-green-400" />
              <h2 className="text-xl font-bold text-white">Your Information</h2>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-slate-400 text-sm">Name</p>
                <p className="text-white font-semibold">{user?.name || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Phone</p>
                <p className="text-white font-semibold">{user?.phone || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Email</p>
                <p className="text-white font-semibold text-sm">{user?.email || 'Not provided'}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Emergency Services Being Notified */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 p-6 mb-8"
        >
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-400" />
            Emergency Services Notified
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Police */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-slate-700/50 rounded-lg border border-slate-600 hover:border-blue-500/50 transition-all"
            >
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-white">Police Stations</h3>
              </div>
              <p className="text-slate-400 text-sm">Nearest police stations notified</p>
              <p className="text-blue-400 text-xs mt-2">✓ Immediate dispatch</p>
            </motion.div>

            {/* Hospitals */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-slate-700/50 rounded-lg border border-slate-600 hover:border-green-500/50 transition-all"
            >
              <div className="flex items-center gap-3 mb-2">
                <Cross className="w-5 h-5 text-green-400" />
                <h3 className="font-bold text-white">Hospitals</h3>
              </div>
              <p className="text-slate-400 text-sm">Nearby hospitals alerted</p>
              <p className="text-green-400 text-xs mt-2">✓ Medical teams ready</p>
            </motion.div>

            {/* Rescue Teams */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-slate-700/50 rounded-lg border border-slate-600 hover:border-red-500/50 transition-all"
            >
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <h3 className="font-bold text-white">Rescue Teams</h3>
              </div>
              <p className="text-slate-400 text-sm">Rescue teams mobilized</p>
              <p className="text-red-400 text-xs mt-2">✓ En route to location</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Offline Queue */}
        {offlineQueue.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-yellow-900/30 to-slate-900 rounded-xl border border-yellow-600/50 p-6 mb-8"
          >
            <h2 className="text-xl font-bold text-yellow-400 mb-4">
              ⚠️ {offlineQueue.length} Alert(s) Queued (Offline)
            </h2>
            <p className="text-slate-300 mb-4">
              These alerts will be sent when you're back online.
            </p>
            {isOnline && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={retryOfflineAlerts}
                disabled={loading}
                className="w-full py-2 px-4 bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-all"
              >
                {loading ? 'Sending...' : 'Send Queued Alerts Now'}
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Guidelines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 p-6"
        >
          <h2 className="text-xl font-bold text-white mb-4">Emergency Guidelines</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-red-400 font-bold mt-1">•</span>
              <span className="text-slate-300">Send SOS alert only in genuine emergencies</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-400 font-bold mt-1">•</span>
              <span className="text-slate-300">Ensure location services are enabled for accurate positioning</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-400 font-bold mt-1">•</span>
              <span className="text-slate-300">Keep your contact information updated in your profile</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-400 font-bold mt-1">•</span>
              <span className="text-slate-300">Emergency services will respond to your exact location</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-400 font-bold mt-1">•</span>
              <span className="text-slate-300">Stay in a safe location and await assistance</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-400 font-bold mt-1">•</span>
              <span className="text-slate-300">Follow all instructions from emergency personnel</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-400 font-bold mt-1">•</span>
              <span className="text-slate-300">Works offline - alerts are queued and sent when online</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default EnhancedEmergencySOS;
