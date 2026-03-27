import React, { useState, useEffect } from 'react';
import { sosAPI, emergencyAPI } from '../services/api';
import '../styles.css';

export default function EmergencySOS() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [emergencyContacts, setEmergencyContacts] = useState(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (err) => {
          setError('Unable to get location. Please enable location services.');
          setLocation({ lat: 13.0827, lng: 80.2707 });
        }
      );
    }
  };

  const handleEmergencyAlert = async () => {
    if (!location) {
      setError('Location not available');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const alertData = {
        name: user.name || 'Emergency User',
        phone: user.phone || 'Not provided',
        location: `${location.lat}, ${location.lng}`,
        lat: location.lat,
        lng: location.lng,
        message: 'Emergency SOS Alert - Flood Risk',
        status: 'active'
      };

      const res = await sosAPI.sendAlert(alertData);

      if (res.data.success) {
        setMessage('Emergency alert sent successfully. Help is on the way.');
        setTimeout(() => setMessage(''), 5000);
      }
    } catch (err) {
      setError('Failed to send emergency alert');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Emergency SOS System</h1>
        <p style={styles.subtitle}>Send immediate distress alert</p>
      </div>

      {error && <div style={styles.alert}>{error}</div>}
      {message && <div style={styles.success}>{message}</div>}

      <div style={styles.mainCard}>
        <div style={styles.locationInfo}>
          <h2 style={styles.infoTitle}>Current Location</h2>
          {location ? (
            <div style={styles.locationDetails}>
              <p style={styles.locationText}>Latitude: {location.lat.toFixed(4)}</p>
              <p style={styles.locationText}>Longitude: {location.lng.toFixed(4)}</p>
              <button
                onClick={getLocation}
                style={styles.refreshBtn}
              >
                Refresh Location
              </button>
            </div>
          ) : (
            <p style={styles.loading}>Getting location...</p>
          )}
        </div>

        <div style={styles.sosSection}>
          <h2 style={styles.sosTitle}>Send Emergency Alert</h2>
          <p style={styles.sosDescription}>
            Click the button below to send an immediate SOS alert with your current location.
            Emergency services will be notified instantly.
          </p>
          <button
            onClick={handleEmergencyAlert}
            disabled={loading || !location}
            style={{
              ...styles.sosButton,
              opacity: loading || !location ? 0.6 : 1,
              cursor: loading || !location ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Sending Alert...' : 'SEND EMERGENCY ALERT'}
          </button>
        </div>

        <div style={styles.userInfo}>
          <h2 style={styles.infoTitle}>Your Information</h2>
          <div style={styles.infoGrid}>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Name</span>
              <span style={styles.infoValue}>{user.name || 'Not provided'}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Email</span>
              <span style={styles.infoValue}>{user.email || 'Not provided'}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Phone</span>
              <span style={styles.infoValue}>{user.phone || 'Not provided'}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Role</span>
              <span style={styles.infoValue}>{user.role || 'User'}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.guidelinesCard}>
        <h2 style={styles.guidelinesTitle}>Emergency Guidelines</h2>
        <ul style={styles.guidelinesList}>
          <li>Send SOS alert only in genuine emergencies</li>
          <li>Ensure your location services are enabled</li>
          <li>Keep your contact information updated</li>
          <li>Emergency services will respond to your location</li>
          <li>Stay in a safe location and await assistance</li>
          <li>Follow instructions from emergency personnel</li>
        </ul>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    background: '#f5f5f5',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    background: 'white',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1a3a52',
    margin: '0 0 5px 0'
  },
  subtitle: {
    fontSize: '14px',
    color: '#666',
    margin: '0'
  },
  alert: {
    background: '#fee',
    border: '1px solid #fcc',
    color: '#c33',
    padding: '12px 15px',
    borderRadius: '6px',
    marginBottom: '20px'
  },
  success: {
    background: '#efe',
    border: '1px solid #cfc',
    color: '#3c3',
    padding: '12px 15px',
    borderRadius: '6px',
    marginBottom: '20px'
  },
  mainCard: {
    background: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '20px'
  },
  locationInfo: {
    marginBottom: '30px',
    paddingBottom: '30px',
    borderBottom: '1px solid #eee'
  },
  infoTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1a3a52',
    marginBottom: '15px'
  },
  locationDetails: {
    background: '#f9f9f9',
    padding: '15px',
    borderRadius: '6px'
  },
  locationText: {
    fontSize: '14px',
    color: '#666',
    margin: '8px 0'
  },
  refreshBtn: {
    marginTop: '10px',
    padding: '8px 16px',
    background: '#00a8e8',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  sosSection: {
    textAlign: 'center',
    marginBottom: '30px',
    paddingBottom: '30px',
    borderBottom: '1px solid #eee'
  },
  sosTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#1a3a52',
    marginBottom: '15px'
  },
  sosDescription: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '20px',
    lineHeight: '1.6'
  },
  sosButton: {
    padding: '20px 40px',
    background: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background 0.3s',
    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
  },
  userInfo: {
    marginBottom: '20px'
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px'
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    background: '#f9f9f9',
    padding: '15px',
    borderRadius: '6px'
  },
  infoLabel: {
    fontSize: '12px',
    color: '#999',
    marginBottom: '5px'
  },
  infoValue: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#1a3a52'
  },
  loading: {
    color: '#999',
    fontSize: '14px'
  },
  guidelinesCard: {
    background: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  guidelinesTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1a3a52',
    marginBottom: '15px'
  },
  guidelinesList: {
    margin: '0',
    paddingLeft: '20px',
    fontSize: '14px',
    color: '#666',
    lineHeight: '1.8'
  }
};
