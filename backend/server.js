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

const {
  User, OTPSession, FloodPrediction, SOSAlert, UserReport, Shelter, RescueTeam,
  CommandCenterData, PoliceStation, AmbulanceService, Hospital, DisasterAlert, Zone
} = require('./models/schemas');

const authService = require('./services/auth');
const FloodRiskPredictor = require('./services/ml-predictor');

let dbConnected = false;
const predictor = new FloodRiskPredictor();

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

app.post('/api/auth/register-simple', async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await authService.hashPassword(password);
    const user = await User.create({
      email,
      name,
      phone: phone || '',
      password: hashedPassword,
      isVerified: true,
      role: 'user'
    });

    const sessionToken = authService.createSessionToken(user._id, user.email);
    user.sessionToken = sessionToken;
    user.sessionExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    user.lastLogin = new Date();
    await user.save();

    res.json({
      success: true,
      message: 'Registration successful',
      token: sessionToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login-simple', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await authService.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const sessionToken = authService.createSessionToken(user._id, user.email);
    user.sessionToken = sessionToken;
    user.sessionExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    user.lastLogin = new Date();
    await user.save();

    res.json({
      success: true,
      message: 'Login successful',
      token: sessionToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



app.post('/api/ml/train', verifySession, async (req, res) => {
  try {
    const trainingData = await FloodPrediction.find().limit(100);
    predictor.trainModel(trainingData);

    res.json({
      success: true,
      message: 'Model trained',
      info: predictor.getModelInfo()
    });
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

    res.json({
      success: true,
      prediction
    });
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

app.get('/api/flood-predictions', async (req, res) => {
  try {
    const predictions = await FloodPrediction.find().sort({ timestamp: -1 }).limit(10);
    res.json(predictions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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
      {
        id: 1,
        name: 'Chennai Flood Prevention Initiative',
        category: 'organization',
        rating: 4.8,
        reviews: 342,
        location: 'Chennai, Tamil Nadu',
        description: 'Leading disaster preparedness organization with 15+ years of experience',
        impact: '50,000+ lives protected',
        members: 1200,
        verified: true,
        image: '🏢',
        tags: ['Flood Prevention', 'Training', 'Community']
      },
      {
        id: 2,
        name: 'Emergency Response Team Alpha',
        category: 'team',
        rating: 4.9,
        reviews: 287,
        location: 'Velachery, Chennai',
        description: 'Rapid response team with advanced rescue equipment',
        impact: '2,500+ rescues completed',
        members: 45,
        verified: true,
        image: '🚁',
        tags: ['Rescue', 'Medical', 'Equipment']
      },
      {
        id: 3,
        name: 'Water Management Solutions Ltd',
        category: 'service',
        rating: 4.7,
        reviews: 156,
        location: 'Guindy, Chennai',
        description: 'Advanced drainage and water level monitoring systems',
        impact: '30+ installations',
        members: 85,
        verified: true,
        image: '💧',
        tags: ['Technology', 'Monitoring', 'Infrastructure']
      },
      {
        id: 4,
        name: 'Community Shelter Network',
        category: 'shelter',
        rating: 4.6,
        reviews: 198,
        location: 'Multiple locations',
        description: 'Network of 25 verified shelters with 5,000+ capacity',
        impact: '5,000+ capacity',
        members: 320,
        verified: true,
        image: '🏛️',
        tags: ['Shelter', 'Relief', 'Community']
      },
      {
        id: 5,
        name: 'Medical Emergency Coordination',
        category: 'medical',
        rating: 4.8,
        reviews: 412,
        location: 'Across Chennai',
        description: 'Coordinated medical response during disasters',
        impact: '15 hospitals connected',
        members: 200,
        verified: true,
        image: '🏥',
        tags: ['Medical', 'Hospitals', 'Emergency']
      },
      {
        id: 6,
        name: 'Disaster Risk Reduction Academy',
        category: 'training',
        rating: 4.9,
        reviews: 523,
        location: 'Online & Offline',
        description: 'Certified training programs for disaster management',
        impact: '10,000+ trained',
        members: 450,
        verified: true,
        image: '📚',
        tags: ['Training', 'Certification', 'Education']
      }
    ];
    res.json(featuredResources);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/marketplace-products', verifySession, async (req, res) => {
  try {
    const products = [
      {
        id: 1,
        name: 'Emergency Water Purifier Kit',
        category: 'water',
        price: 2499,
        originalPrice: 3499,
        rating: 4.7,
        reviews: 234,
        image: '💧',
        seller: 'SafeWater Solutions',
        location: 'Chennai',
        inStock: true,
        quantity: 150,
        description: 'Portable water purification system for emergency situations',
        features: ['Filters 1000L', 'Portable', 'Long shelf life'],
        delivery: '2-3 days',
        verified: true
      },
      {
        id: 2,
        name: 'First Aid Emergency Kit',
        category: 'medical',
        price: 1899,
        originalPrice: 2499,
        rating: 4.8,
        reviews: 512,
        image: '🏥',
        seller: 'MediCare Plus',
        location: 'Chennai',
        inStock: true,
        quantity: 300,
        description: 'Comprehensive first aid kit with 50+ medical supplies',
        features: ['50+ items', 'WHO certified', 'Waterproof case'],
        delivery: '1-2 days',
        verified: true
      },
      {
        id: 3,
        name: 'Portable LED Emergency Light',
        category: 'lighting',
        price: 599,
        originalPrice: 899,
        rating: 4.6,
        reviews: 189,
        image: '💡',
        seller: 'BrightTech India',
        location: 'Bangalore',
        inStock: true,
        quantity: 500,
        description: '10-hour battery life, 500 lumens brightness',
        features: ['10-hour battery', 'USB rechargeable', 'Waterproof'],
        delivery: '1-2 days',
        verified: true
      },
      {
        id: 4,
        name: 'Disaster Survival Backpack',
        category: 'survival',
        price: 3499,
        originalPrice: 4999,
        rating: 4.9,
        reviews: 421,
        image: '🎒',
        seller: 'SurvivalGear Co',
        location: 'Delhi',
        inStock: true,
        quantity: 80,
        description: 'Complete survival kit with 30+ essential items',
        features: ['30+ items', 'Weather resistant', 'Ergonomic design'],
        delivery: '2-3 days',
        verified: true
      },
      {
        id: 5,
        name: 'Portable Water Tank (50L)',
        category: 'water',
        price: 1299,
        originalPrice: 1799,
        rating: 4.5,
        reviews: 156,
        image: '🛢️',
        seller: 'AquaStore',
        location: 'Chennai',
        inStock: true,
        quantity: 120,
        description: 'Food-grade plastic water storage tank',
        features: ['50L capacity', 'Stackable', 'Durable'],
        delivery: '3-4 days',
        verified: true
      },
      {
        id: 6,
        name: 'Emergency Communication Device',
        category: 'communication',
        price: 4999,
        originalPrice: 6999,
        rating: 4.8,
        reviews: 267,
        image: '📡',
        seller: 'CommTech Solutions',
        location: 'Hyderabad',
        inStock: true,
        quantity: 45,
        description: 'Satellite communicator for disaster zones',
        features: ['Satellite enabled', 'GPS tracking', '72-hour battery'],
        delivery: '2-3 days',
        verified: true
      },
      {
        id: 7,
        name: 'Rescue Rope & Harness Set',
        category: 'rescue',
        price: 2199,
        originalPrice: 3299,
        rating: 4.7,
        reviews: 198,
        image: '🪢',
        seller: 'RescueGear Pro',
        location: 'Mumbai',
        inStock: true,
        quantity: 60,
        description: 'Professional-grade rescue equipment',
        features: ['50m rope', 'Safety harness', 'Carabiners included'],
        delivery: '2-3 days',
        verified: true
      },
      {
        id: 8,
        name: 'Portable Air Purifier',
        category: 'air',
        price: 3999,
        originalPrice: 5499,
        rating: 4.6,
        reviews: 234,
        image: '🌬️',
        seller: 'AirClean Tech',
        location: 'Pune',
        inStock: true,
        quantity: 90,
        description: 'HEPA filter air purifier for emergency shelters',
        features: ['HEPA filter', 'Portable', 'Quiet operation'],
        delivery: '2-3 days',
        verified: true
      },
      {
        id: 9,
        name: 'Emergency Food Rations (30 days)',
        category: 'food',
        price: 2899,
        originalPrice: 3999,
        rating: 4.8,
        reviews: 445,
        image: '🍲',
        seller: 'NutriSafe Foods',
        location: 'Chennai',
        inStock: true,
        quantity: 200,
        description: 'High-calorie emergency food with 5-year shelf life',
        features: ['30-day supply', '5-year shelf life', 'Balanced nutrition'],
        delivery: '1-2 days',
        verified: true
      }
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
