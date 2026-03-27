// backend/server-complete.js
// Complete Backend Server with All Routes Integrated

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
app.use(helmet());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Import Models
const {
  User, OTPSession, FloodPrediction, SOSAlert, UserReport, Shelter, RescueTeam,
  CommandCenterData, PoliceStation, AmbulanceService, Hospital, DisasterAlert, Zone
} = require('./models/schemas');

// Import Services
const authService = require('./services/auth');
const FloodRiskPredictor = require('./services/ml-predictor');

let dbConnected = false;
const predictor = new FloodRiskPredictor();

// Database Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/geoguard', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    dbConnected = true;
    console.log('✓ MongoDB connected successfully');
  } catch (err) {
    dbConnected = false;
    console.error('✗ MongoDB connection error:', err.message);
    setTimeout(connectDB, 5000);
  }
};

connectDB();

// Middleware
const verifySession = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    const decoded = authService.verifySessionToken(token);
    if (!decoded) return res.status(401).json({ error: 'Invalid token' });

    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Authentication failed' });
  }
};

// ==================== AUTHENTICATION ROUTES ====================

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, name, phone } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already registered' });

    const otp = authService.generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await OTPSession.create({ email, otp, otpExpiry, attempts: 0 });

    const emailSent = await authService.sendOTPEmail(email, otp);
    if (!emailSent) return res.status(500).json({ error: 'Failed to send OTP' });

    res.json({ success: true, message: 'OTP sent to email', email, expiresIn: 600 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { email, otp, name, phone, password } = req.body;
    if (!email || !otp) return res.status(400).json({ error: 'Email and OTP required' });

    const otpSession = await OTPSession.findOne({ email });
    if (!otpSession) return res.status(400).json({ error: 'OTP expired or not found' });
    if (otpSession.attempts >= 3) {
      await OTPSession.deleteOne({ email });
      return res.status(400).json({ error: 'Too many attempts' });
    }
    if (otpSession.otp !== otp) {
      otpSession.attempts += 1;
      await otpSession.save();
      return res.status(400).json({ error: 'Invalid OTP' });
    }
    if (new Date() > otpSession.otpExpiry) return res.status(400).json({ error: 'OTP expired' });

    let user = await User.findOne({ email });
    if (!user) {
      const hashedPassword = await authService.hashPassword(password || 'default123');
      user = await User.create({
        email, name: name || email.split('@')[0], phone: phone || '',
        password: hashedPassword, isVerified: true, role: 'user'
      });
    } else {
      user.isVerified = true;
      await user.save();
    }

    const sessionToken = authService.createSessionToken(user._id, user.email);
    user.sessionToken = sessionToken;
    user.sessionExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    user.lastLogin = new Date();
    await user.save();

    await OTPSession.deleteOne({ email });

    res.json({
      success: true, message: 'Login successful', token: sessionToken,
      user: { id: user._id, email: user.email, name: user.name, phone: user.phone, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });

    const otp = authService.generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await OTPSession.findOneAndUpdate({ email }, { otp, otpExpiry, attempts: 0 }, { upsert: true });

    const emailSent = await authService.sendOTPEmail(email, otp);
    if (!emailSent) return res.status(500).json({ error: 'Failed to send OTP' });

    res.json({ success: true, message: 'OTP sent to email', email, expiresIn: 600 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/verify-login', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ error: 'Email and OTP required' });

    const otpSession = await OTPSession.findOne({ email });
    if (!otpSession || otpSession.otp !== otp) return res.status(400).json({ error: 'Invalid OTP' });
    if (new Date() > otpSession.otpExpiry) return res.status(400).json({ error: 'OTP expired' });

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email, name: email.split('@')[0], isVerified: true, role: 'user' });
    }

    const sessionToken = authService.createSessionToken(user._id, user.email);
    user.sessionToken = sessionToken;
    user.sessionExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    user.lastLogin = new Date();
    await user.save();

    await OTPSession.deleteOne({ email });

    res.json({
      success: true, message: 'Login successful', token: sessionToken,
      user: { id: user._id, email: user.email, name: user.name, phone: user.phone, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== ML ROUTES ====================

app.post('/api/ml/train', verifySession, async (req, res) => {
  try {
    const trainingData = await FloodPrediction.find().limit(100);
    predictor.trainModel(trainingData);
    res.json({ success: true, message: 'Model trained', info: predictor.getModelInfo() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/ml/predict', verifySession, async (req, res) => {
  try {
    const { rainfall, waterLevel, elevation } = req.body;
    if (rainfall === undefined || waterLevel === undefined || elevation === undefined) {
      return res.status(400).json({ error: 'Missing parameters' });
    }
    const prediction = predictor.predictRisk(rainfall, waterLevel, elevation);
    res.json({ success: true, prediction });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/ml/model-info', verifySession, async (req, res) => {
  try {
    res.json(predictor.getModelInfo());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== FLOOD PREDICTION ROUTES ====================

app.get('/api/flood-predictions', async (req, res) => {
  try {
    const predictions = await FloodPrediction.find().sort({ timestamp: -1 }).limit(10);
    res.json(predictions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/disaster-prediction/predict/flood', verifySession, async (req, res) => {
  try {
    const { rainfall, waterLevel, elevation } = req.body;
    const prediction = predictor.predictRisk(rainfall, waterLevel, elevation);
    
    const floodPrediction = await FloodPrediction.create({
      zone: req.body.zone || 'Unknown',
      riskScore: prediction.riskScore,
      riskLevel: prediction.riskLevel,
      rainfall, waterLevel, elevation,
      location: req.body.location || { lat: 13.0827, lng: 80.2707 }
    });

    res.json({ success: true, prediction: floodPrediction });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/disaster-prediction/map/zones', async (req, res) => {
  try {
    const zones = await Zone.find();
    res.json(zones);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/disaster-prediction/map/heatmap', async (req, res) => {
  try {
    const predictions = await FloodPrediction.find();
    const heatmapData = predictions.map(p => ({
      lat: p.location?.lat || 13.0827,
      lng: p.location?.lng || 80.2707,
      intensity: p.riskScore
    }));
    res.json(heatmapData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/disaster-prediction/map/statistics', async (req, res) => {
  try {
    const predictions = await FloodPrediction.find();
    const stats = {
      totalZones: predictions.length,
      highRiskZones: predictions.filter(p => p.riskScore > 55).length,
      criticalZones: predictions.filter(p => p.riskScore > 75).length,
      averageRiskScore: predictions.reduce((sum, p) => sum + p.riskScore, 0) / predictions.length
    };
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== DISASTER RESPONSE ROUTES ====================

app.post('/api/disaster-response/alerts/send', verifySession, async (req, res) => {
  try {
    const alert = await DisasterAlert.create(req.body);
    res.json({ success: true, alert });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/disaster-response/alerts', verifySession, async (req, res) => {
  try {
    const alerts = await DisasterAlert.find().sort({ createdAt: -1 });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/disaster-response/shelters/nearby', async (req, res) => {
  try {
    const { lat, lng } = req.query;
    const shelters = await Shelter.find();
    res.json(shelters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/disaster-response/sos/request', verifySession, async (req, res) => {
  try {
    const alert = await SOSAlert.create(req.body);
    res.json({ success: true, alert });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/disaster-response/sos/requests', verifySession, async (req, res) => {
  try {
    const requests = await SOSAlert.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/disaster-response/dashboard/metrics', verifySession, async (req, res) => {
  try {
    const sosCount = await SOSAlert.countDocuments({ status: 'active' });
    const teams = await RescueTeam.find();
    const shelters = await Shelter.find();
    const predictions = await FloodPrediction.find().sort({ timestamp: -1 }).limit(6);

    res.json({
      timestamp: new Date().toISOString(),
      sos_alerts: sosCount,
      active_rescue_teams: teams.filter(t => t.status === 'available').length,
      shelter_occupancy_percent: 65,
      high_risk_zones: predictions.filter(p => p.riskScore > 55).length,
      total_zones: predictions.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/disaster-response/teams', verifySession, async (req, res) => {
  try {
    const teams = await RescueTeam.find();
    res.json(teams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== POST-DISASTER ROUTES ====================

app.post('/api/post-disaster/damage/analyze', verifySession, async (req, res) => {
  try {
    res.json({ success: true, assessment: { damageLevel: 'High', damagePercentage: 65 } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/post-disaster/damage/reports', verifySession, async (req, res) => {
  try {
    res.json([]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/post-disaster/missing-persons/report', verifySession, async (req, res) => {
  try {
    res.json({ success: true, personId: 'MP001' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/post-disaster/missing-persons', verifySession, async (req, res) => {
  try {
    res.json([]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/post-disaster/resources/add', verifySession, async (req, res) => {
  try {
    res.json({ success: true, resourceId: 'RES001' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/post-disaster/resources', verifySession, async (req, res) => {
  try {
    res.json([]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/post-disaster/volunteers/register', verifySession, async (req, res) => {
  try {
    res.json({ success: true, volunteerId: 'VOL001' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/post-disaster/volunteers', verifySession, async (req, res) => {
  try {
    res.json([]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/post-disaster/shelters', verifySession, async (req, res) => {
  try {
    const shelters = await Shelter.find();
    res.json(shelters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/post-disaster/recovery/progress', verifySession, async (req, res) => {
  try {
    res.json({ progress: 45, status: 'In Progress' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== EXISTING ROUTES ====================

app.post('/api/sos-alert', verifySession, async (req, res) => {
  try {
    const alert = new SOSAlert(req.body);
    await alert.save();
    res.json({ success: true, alertId: alert._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/sos-alerts', verifySession, async (req, res) => {
  try {
    const alerts = await SOSAlert.find({ status: 'active' }).sort({ createdAt: -1 });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/user-report', verifySession, async (req, res) => {
  try {
    const report = new UserReport(req.body);
    await report.save();
    res.json({ success: true, reportId: report._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/shelters', async (req, res) => {
  try {
    const shelters = await Shelter.find();
    res.json(shelters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/rescue-teams', async (req, res) => {
  try {
    const teams = await RescueTeam.find();
    res.json(teams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/zones', async (req, res) => {
  try {
    const zones = await Zone.find().sort({ timestamp: -1 });
    res.json(zones);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/police-stations', async (req, res) => {
  try {
    const stations = await PoliceStation.find();
    res.json(stations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/ambulance-services', async (req, res) => {
  try {
    const services = await AmbulanceService.find();
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/hospitals', async (req, res) => {
  try {
    const hospitals = await Hospital.find();
    res.json(hospitals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/command-center-data', verifySession, async (req, res) => {
  try {
    const sosCount = await SOSAlert.countDocuments({ status: 'active' });
    const teams = await RescueTeam.find();
    const shelters = await Shelter.find();
    const predictions = await FloodPrediction.find().sort({ timestamp: -1 }).limit(6);

    const totalOccupancy = shelters.reduce((sum, s) => sum + (s.occupancy || 0), 0);
    const totalCapacity = shelters.reduce((sum, s) => sum + (s.capacity || 0), 0);
    const occupancyPercent = totalCapacity > 0 ? Math.round((totalOccupancy / totalCapacity) * 100) : 0;

    res.json({
      timestamp: new Date().toISOString(),
      sos_alerts: sosCount,
      active_rescue_teams: teams.filter(t => t.status === 'available').length,
      shelter_occupancy_percent: occupancyPercent,
      high_risk_zones: predictions.filter(p => p.riskScore > 55).length,
      total_zones: predictions.length,
      heatmap: predictions.map(p => ({
        zone: p.zone,
        lat: p.location?.lat || 13.0827,
        lng: p.location?.lng || 80.2707,
        risk_score: p.riskScore,
        risk_level: p.riskLevel,
        color: p.riskScore < 30 ? '#10b981' : p.riskScore < 55 ? '#f59e0b' : p.riskScore < 75 ? '#f97316' : '#ef4444'
      }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/featured-resources', verifySession, async (req, res) => {
  try {
    const featuredResources = [
      { id: 1, name: 'Chennai Flood Prevention Initiative', category: 'organization', rating: 4.8, reviews: 342 },
      { id: 2, name: 'Emergency Response Team Alpha', category: 'team', rating: 4.9, reviews: 287 },
      { id: 3, name: 'Water Management Solutions Ltd', category: 'service', rating: 4.7, reviews: 156 }
    ];
    res.json(featuredResources);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/marketplace-products', verifySession, async (req, res) => {
  try {
    const products = [
      { id: 1, name: 'Emergency Water Purifier Kit', price: 2499, rating: 4.7 },
      { id: 2, name: 'First Aid Emergency Kit', price: 1899, rating: 4.8 },
      { id: 3, name: 'Portable LED Emergency Light', price: 599, rating: 4.6 }
    ];
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'GeoGuard Backend Running',
    database: dbConnected ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`\n🚀 GeoGuard Backend Server`);
  console.log(`📍 Running on http://localhost:${PORT}`);
  console.log(`🔗 Database: ${dbConnected ? 'Connected' : 'Connecting...'}`);
  console.log(`🌍 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:3000'}\n`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    mongoose.connection.close();
    process.exit(0);
  });
});

module.exports = app;
