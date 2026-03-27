import React, { useState, useEffect } from 'react';
import { floodAPI, mlAPI, commandCenterAPI } from '../services/api';
import '../theme.css';

export default function Dashboard() {
  const [predictions, setPredictions] = useState([]);
  const [commandData, setCommandData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedZone, setSelectedZone] = useState(null);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [predRes, cmdRes] = await Promise.all([
        floodAPI.getPredictions(),
        commandCenterAPI.getData()
      ]);
      setPredictions(predRes.data);
      setCommandData(cmdRes.data);
      setError('');
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (score) => {
    if (score < 30) return '#10b981';
    if (score < 55) return '#f59e0b';
    if (score < 75) return '#f97316';
    return '#ef4444';
  };

  const getRiskLabel = (score) => {
    if (score < 30) return 'Low';
    if (score < 55) return 'Moderate';
    if (score < 75) return 'High';
    return 'Critical';
  };

  return (
    <div className="main-container">
      <div className="page-header">
        <h1 className="page-title">Flood Risk Dashboard</h1>
        <p className="page-subtitle">Real-time monitoring and predictions</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="flex-center" style={{ padding: '60px 20px' }}>
          <div className="spinner"></div>
        </div>
      ) : (
        <>
          <div className="grid-4">
            <div className="stat-card">
              <div className="stat-label">Active SOS Alerts</div>
              <div className="stat-number">{commandData?.sos_alerts || 0}</div>
            </div>
            <div className="stat-card success">
              <div className="stat-label">Available Rescue Teams</div>
              <div className="stat-number">{commandData?.active_rescue_teams || 0}</div>
            </div>
            <div className="stat-card warning">
              <div className="stat-label">Shelter Occupancy</div>
              <div className="stat-number">{commandData?.shelter_occupancy_percent || 0}%</div>
            </div>
            <div className="stat-card danger">
              <div className="stat-label">High Risk Zones</div>
              <div className="stat-number">{commandData?.high_risk_zones || 0}</div>
            </div>
          </div>

          <div className="section">
            <h2 className="section-title">Zone Risk Predictions</h2>
            <div className="grid-3">
              {predictions.map((pred) => (
                <div
                  key={pred._id}
                  className="card cursor-pointer"
                  style={{
                    borderLeft: `4px solid ${getRiskColor(pred.riskScore)}`
                  }}
                  onClick={() => setSelectedZone(pred)}
                >
                  <div className="card-title">{pred.zone}</div>
                  <div className="mb-2">
                    <span className="badge" style={{
                      background: getRiskColor(pred.riskScore),
                      color: 'white',
                      border: 'none'
                    }}>
                      {getRiskLabel(pred.riskScore)}
                    </span>
                  </div>
                  <div className="text-sm text-muted mb-2">Score: <span className="text-primary font-semibold">{pred.riskScore}</span></div>
                  <div className="text-sm text-muted">
                    <div>🌧️ Rainfall: {pred.rainfall}mm</div>
                    <div>💧 Water Level: {pred.waterLevel}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedZone && (
            <div className="modal-overlay" onClick={() => setSelectedZone(null)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setSelectedZone(null)}
                  className="btn btn-secondary"
                  style={{ position: 'absolute', top: '15px', right: '15px' }}
                >
                  ✕
                </button>
                <h2 className="card-title mb-4">{selectedZone.zone} - Detailed Analysis</h2>
                <div className="grid-2">
                  <div>
                    <div className="text-sm text-muted mb-1">Risk Score</div>
                    <div className="text-xl font-bold text-primary">{selectedZone.riskScore}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted mb-1">Risk Level</div>
                    <div className="text-xl font-bold text-primary">{selectedZone.riskLevel}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted mb-1">Rainfall</div>
                    <div className="text-xl font-bold text-primary">{selectedZone.rainfall}mm</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted mb-1">Water Level</div>
                    <div className="text-xl font-bold text-primary">{selectedZone.waterLevel}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted mb-1">Elevation</div>
                    <div className="text-xl font-bold text-primary">{selectedZone.elevation}m</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted mb-1">Last Updated</div>
                    <div className="text-xl font-bold text-primary">
                      {new Date(selectedZone.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        
        .modal-content {
          background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%);
          border: 1px solid rgba(14, 165, 233, 0.2);
          border-radius: 12px;
          padding: 30px;
          max-width: 600px;
          width: 90%;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
          position: relative;
        }
      `}</style>
    </div>
  );
}
