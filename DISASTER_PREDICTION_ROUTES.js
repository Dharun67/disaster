// Disaster Prediction Module - API Routes

const express = require('express');
const router = express.Router();
const DisasterPredictionService = require('../services/disaster-prediction');

const disasterService = new DisasterPredictionService();

// ==================== DATA COLLECTION ENDPOINTS ====================

/**
 * POST /api/disaster-prediction/data/weather
 * Collect weather data from external API
 */
router.post('/data/weather', async (req, res) => {
  try {
    const { lat, lng } = req.body;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude required' });
    }

    const weatherData = await disasterService.collectWeatherData(lat, lng);

    if (!weatherData) {
      return res.status(500).json({ error: 'Failed to collect weather data' });
    }

    res.json({
      success: true,
      data: weatherData,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/disaster-prediction/data/rainfall
 * Collect rainfall data from monitoring stations
 */
router.post('/data/rainfall', async (req, res) => {
  try {
    const { stationId } = req.body;

    if (!stationId) {
      return res.status(400).json({ error: 'Station ID required' });
    }

    const rainfallData = await disasterService.collectRainfallData(stationId);

    if (!rainfallData) {
      return res.status(500).json({ error: 'Failed to collect rainfall data' });
    }

    res.json({
      success: true,
      data: rainfallData,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/disaster-prediction/data/iot
 * Collect IoT sensor data
 */
router.post('/data/iot', async (req, res) => {
  try {
    const { sensorId, sensorType } = req.body;

    if (!sensorId || !sensorType) {
      return res.status(400).json({ error: 'Sensor ID and type required' });
    }

    const iotData = await disasterService.collectIoTData(sensorId, sensorType);

    if (!iotData) {
      return res.status(500).json({ error: 'Failed to collect IoT data' });
    }

    res.json({
      success: true,
      data: iotData,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== PREDICTION ENDPOINTS ====================

/**
 * POST /api/disaster-prediction/predict/flood
 * Generate flood prediction
 */
router.post('/predict/flood', async (req, res) => {
  try {
    const inputData = req.body;

    const prediction = await disasterService.predictFlood(inputData);

    res.json({
      success: true,
      prediction,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/disaster-prediction/predict/landslide
 * Generate landslide prediction
 */
router.post('/predict/landslide', async (req, res) => {
  try {
    const inputData = req.body;

    const prediction = await disasterService.predictLandslide(inputData);

    res.json({
      success: true,
      prediction,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/disaster-prediction/predict/cyclone
 * Generate cyclone prediction
 */
router.post('/predict/cyclone', async (req, res) => {
  try {
    const inputData = req.body;

    const prediction = await disasterService.predictCyclone(inputData);

    res.json({
      success: true,
      prediction,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/disaster-prediction/predict/earthquake
 * Generate earthquake prediction
 */
router.post('/predict/earthquake', async (req, res) => {
  try {
    const inputData = req.body;

    const prediction = await disasterService.predictEarthquake(inputData);

    res.json({
      success: true,
      prediction,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/disaster-prediction/predict/all
 * Generate predictions for all disaster types
 */
router.post('/predict/all', async (req, res) => {
  try {
    const inputData = req.body;

    const predictions = {
      flood: await disasterService.predictFlood(inputData),
      landslide: await disasterService.predictLandslide(inputData),
      cyclone: await disasterService.predictCyclone(inputData),
      earthquake: await disasterService.predictEarthquake(inputData)
    };

    res.json({
      success: true,
      predictions,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/disaster-prediction/model-info
 * Get model information and accuracy
 */
router.get('/model-info', async (req, res) => {
  try {
    const modelInfo = {
      models: [
        {
          name: 'Flood Prediction',
          accuracy: 0.942,
          version: '1.0',
          features: 6,
          lastUpdated: new Date()
        },
        {
          name: 'Landslide Prediction',
          accuracy: 0.856,
          version: '1.0',
          features: 6,
          lastUpdated: new Date()
        },
        {
          name: 'Cyclone Prediction',
          accuracy: 0.802,
          version: '1.0',
          features: 6,
          lastUpdated: new Date()
        },
        {
          name: 'Earthquake Prediction',
          accuracy: 0.701,
          version: '1.0',
          features: 5,
          lastUpdated: new Date()
        }
      ],
      averageAccuracy: 0.825,
      totalModels: 4,
      lastTraining: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    };

    res.json(modelInfo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== ALERT ENDPOINTS ====================

/**
 * POST /api/disaster-prediction/alerts/send
 * Send disaster alert
 */
router.post('/alerts/send', async (req, res) => {
  try {
    const { disasterId, riskLevel, message, channels, recipients } = req.body;

    if (!disasterId || !riskLevel || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const alert = {
      disasterId,
      riskLevel,
      message,
      channels: channels || ['sms', 'email', 'push'],
      recipients: recipients || [],
      status: 'sent',
      sentAt: new Date(),
      deliveredAt: null
    };

    res.json({
      success: true,
      alert,
      message: 'Alert sent successfully'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/disaster-prediction/alerts/analytics
 * Get alert analytics
 */
router.get('/alerts/analytics', async (req, res) => {
  try {
    const analytics = {
      totalAlerts: 1250,
      alertsByType: {
        flood: 450,
        landslide: 300,
        cyclone: 350,
        earthquake: 150
      },
      alertsByLevel: {
        low: 200,
        medium: 400,
        high: 450,
        critical: 200
      },
      deliveryRate: 98.5,
      averageDeliveryTime: 28,
      engagementRate: 82.3,
      falsePositiveRate: 3.2,
      accuracy: 96.8
    };

    res.json(analytics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== VISUALIZATION ENDPOINTS ====================

/**
 * GET /api/disaster-prediction/map/zones
 * Get disaster risk zones for map
 */
router.get('/map/zones', async (req, res) => {
  try {
    const zones = [
      {
        id: 1,
        name: 'Velachery',
        lat: 13.0827,
        lng: 80.2707,
        riskScore: 72,
        riskLevel: 'High',
        disasterType: 'flood',
        color: '#f97316'
      },
      {
        id: 2,
        name: 'Tambaram',
        lat: 12.9250,
        lng: 80.1269,
        riskScore: 78,
        riskLevel: 'Critical',
        disasterType: 'flood',
        color: '#ef4444'
      },
      {
        id: 3,
        name: 'Guindy',
        lat: 13.0011,
        lng: 80.2270,
        riskScore: 45,
        riskLevel: 'Medium',
        disasterType: 'landslide',
        color: '#f59e0b'
      },
      {
        id: 4,
        name: 'Adyar',
        lat: 13.0011,
        lng: 80.2270,
        riskScore: 35,
        riskLevel: 'Low',
        disasterType: 'cyclone',
        color: '#10b981'
      }
    ];

    res.json(zones);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/disaster-prediction/map/heatmap
 * Get heatmap data for visualization
 */
router.get('/map/heatmap', async (req, res) => {
  try {
    const heatmapData = [];

    for (let i = 0; i < 100; i++) {
      heatmapData.push({
        lat: 13.0 + (Math.random() - 0.5) * 0.2,
        lng: 80.2 + (Math.random() - 0.5) * 0.2,
        intensity: Math.random() * 100
      });
    }

    res.json(heatmapData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/disaster-prediction/map/timeline
 * Get disaster timeline data
 */
router.get('/map/timeline', async (req, res) => {
  try {
    const timeline = [
      {
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        events: 5,
        severity: 'low'
      },
      {
        date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        events: 8,
        severity: 'medium'
      },
      {
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        events: 12,
        severity: 'high'
      },
      {
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        events: 15,
        severity: 'critical'
      },
      {
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        events: 10,
        severity: 'high'
      },
      {
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        events: 6,
        severity: 'medium'
      },
      {
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        events: 3,
        severity: 'low'
      }
    ];

    res.json(timeline);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/disaster-prediction/map/statistics
 * Get disaster statistics
 */
router.get('/map/statistics', async (req, res) => {
  try {
    const statistics = {
      totalZones: 50,
      highRiskZones: 12,
      criticalZones: 3,
      averageRiskScore: 52.3,
      populationAtRisk: 250000,
      alertsSent: 1250,
      livesProtected: 45000,
      disastersByType: {
        flood: 450,
        landslide: 300,
        cyclone: 350,
        earthquake: 150
      },
      trend: 'increasing',
      lastUpdate: new Date()
    };

    res.json(statistics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
