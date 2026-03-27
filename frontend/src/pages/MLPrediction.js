import React, { useState, useEffect } from 'react';
import { mlAPI } from '../services/api';
import '../styles.css';

export default function MLPrediction() {
  const [rainfall, setRainfall] = useState(50);
  const [waterLevel, setWaterLevel] = useState(40);
  const [elevation, setElevation] = useState(100);
  const [prediction, setPrediction] = useState(null);
  const [modelInfo, setModelInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [trainingStatus, setTrainingStatus] = useState('');

  useEffect(() => {
    loadModelInfo();
  }, []);

  const loadModelInfo = async () => {
    try {
      const res = await mlAPI.getModelInfo();
      setModelInfo(res.data);
    } catch (err) {
      console.error('Failed to load model info:', err);
    }
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await mlAPI.predict(rainfall, waterLevel, elevation);
      setPrediction(res.data.prediction);
    } catch (err) {
      setError('Failed to generate prediction');
    } finally {
      setLoading(false);
    }
  };

  const handleTrain = async () => {
    setLoading(true);
    setTrainingStatus('Training model...');

    try {
      const res = await mlAPI.train();
      setTrainingStatus('Model trained successfully');
      setModelInfo(res.data.info);
      setTimeout(() => setTrainingStatus(''), 3000);
    } catch (err) {
      setTrainingStatus('Training failed');
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
    if (score < 30) return 'Low Risk';
    if (score < 55) return 'Moderate Risk';
    if (score < 75) return 'High Risk';
    return 'Critical Risk';
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>ML Flood Risk Predictor</h1>
        <p style={styles.subtitle}>Advanced machine learning model for flood prediction</p>
      </div>

      {error && <div style={styles.alert}>{error}</div>}
      {trainingStatus && <div style={styles.success}>{trainingStatus}</div>}

      <div style={styles.grid}>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Model Information</h2>
          {modelInfo ? (
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Training Data Points</span>
                <span style={styles.infoValue}>{modelInfo.trainingDataPoints}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Model Type</span>
                <span style={styles.infoValue}>{modelInfo.modelType}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Version</span>
                <span style={styles.infoValue}>{modelInfo.version}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Rainfall Weight</span>
                <span style={styles.infoValue}>{(modelInfo.weights.rainfall * 100).toFixed(0)}%</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Water Level Weight</span>
                <span style={styles.infoValue}>{(modelInfo.weights.waterLevel * 100).toFixed(0)}%</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Elevation Weight</span>
                <span style={styles.infoValue}>{(modelInfo.weights.elevation * 100).toFixed(0)}%</span>
              </div>
            </div>
          ) : (
            <p style={styles.loading}>Loading model info...</p>
          )}
          <button
            onClick={handleTrain}
            disabled={loading}
            style={styles.trainBtn}
          >
            {loading ? 'Training...' : 'Retrain Model'}
          </button>
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Prediction Input</h2>
          <form onSubmit={handlePredict} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Rainfall (mm)</label>
              <input
                type="range"
                min="0"
                max="500"
                value={rainfall}
                onChange={(e) => setRainfall(Number(e.target.value))}
                style={styles.slider}
              />
              <div style={styles.sliderValue}>{rainfall}mm</div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Water Level (%)</label>
              <input
                type="range"
                min="0"
                max="100"
                value={waterLevel}
                onChange={(e) => setWaterLevel(Number(e.target.value))}
                style={styles.slider}
              />
              <div style={styles.sliderValue}>{waterLevel}%</div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Elevation (m)</label>
              <input
                type="range"
                min="0"
                max="1000"
                value={elevation}
                onChange={(e) => setElevation(Number(e.target.value))}
                style={styles.slider}
              />
              <div style={styles.sliderValue}>{elevation}m</div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={styles.predictBtn}
            >
              {loading ? 'Predicting...' : 'Generate Prediction'}
            </button>
          </form>
        </div>

        {prediction && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Prediction Result</h2>
            <div style={{
              ...styles.resultBox,
              borderLeft: `4px solid ${getRiskColor(prediction.riskScore)}`
            }}>
              <div style={styles.resultScore}>
                <span style={styles.scoreLabel}>Risk Score</span>
                <span style={{
                  ...styles.scoreValue,
                  color: getRiskColor(prediction.riskScore)
                }}>
                  {prediction.riskScore}
                </span>
              </div>
              <div style={{
                ...styles.resultBadge,
                background: getRiskColor(prediction.riskScore)
              }}>
                {getRiskLabel(prediction.riskScore)}
              </div>
              <div style={styles.resultConfidence}>
                Confidence: {(prediction.confidence * 100).toFixed(0)}%
              </div>
              <div style={styles.resultDetails}>
                <p>Input Parameters:</p>
                <ul style={styles.detailsList}>
                  <li>Rainfall: {rainfall}mm</li>
                  <li>Water Level: {waterLevel}%</li>
                  <li>Elevation: {elevation}m</li>
                </ul>
              </div>
            </div>
          </div>
        )}
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
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '20px'
  },
  card: {
    background: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1a3a52',
    marginBottom: '15px'
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '15px',
    marginBottom: '15px'
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column'
  },
  infoLabel: {
    fontSize: '12px',
    color: '#999',
    marginBottom: '5px'
  },
  infoValue: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#1a3a52'
  },
  trainBtn: {
    width: '100%',
    padding: '10px',
    background: '#00a8e8',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1a3a52',
    marginBottom: '8px'
  },
  slider: {
    width: '100%',
    height: '6px',
    borderRadius: '3px',
    background: '#ddd',
    outline: 'none',
    cursor: 'pointer'
  },
  sliderValue: {
    fontSize: '14px',
    color: '#666',
    marginTop: '8px',
    textAlign: 'center'
  },
  predictBtn: {
    padding: '10px',
    background: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600'
  },
  resultBox: {
    padding: '15px',
    background: '#f9f9f9',
    borderRadius: '6px'
  },
  resultScore: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px'
  },
  scoreLabel: {
    fontSize: '14px',
    color: '#666'
  },
  scoreValue: {
    fontSize: '32px',
    fontWeight: 'bold'
  },
  resultBadge: {
    display: 'inline-block',
    padding: '8px 16px',
    borderRadius: '4px',
    color: 'white',
    fontWeight: 'bold',
    marginBottom: '15px'
  },
  resultConfidence: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '15px'
  },
  resultDetails: {
    fontSize: '14px',
    color: '#666'
  },
  detailsList: {
    margin: '10px 0 0 20px',
    padding: '0'
  },
  loading: {
    color: '#999',
    fontSize: '14px'
  }
};
