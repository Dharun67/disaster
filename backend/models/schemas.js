const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, sparse: true },
  phone: String,
  password: String,
  otp: String,
  otpExpiry: Date,
  isVerified: { type: Boolean, default: false },
  role: { type: String, enum: ['user', 'admin', 'rescue'], default: 'user' },
  lastLogin: Date,
  sessionToken: String,
  sessionExpiry: Date,
  createdAt: { type: Date, default: Date.now }
});

const OTPSessionSchema = new mongoose.Schema({
  email: String,
  otp: String,
  otpExpiry: Date,
  attempts: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now, expires: 600 }
});

const FloodPredictionSchema = new mongoose.Schema({
  zone: String,
  riskScore: Number,
  riskLevel: { type: String, enum: ['Low', 'Moderate', 'High', 'Critical'] },
  rainfall: Number,
  waterLevel: Number,
  elevation: Number,
  location: {
    lat: Number,
    lng: Number
  },
  timestamp: { type: Date, default: Date.now }
});

const SOSAlertSchema = new mongoose.Schema({
  name: String,
  phone: String,
  location: String,
  message: String,
  lat: Number,
  lng: Number,
  status: { type: String, enum: ['active', 'resolved'], default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

const UserReportSchema = new mongoose.Schema({
  type: { type: String, enum: ['flood', 'blocked_road', 'water_level', 'other'] },
  location: String,
  description: String,
  imageUrl: String,
  lat: Number,
  lng: Number,
  timestamp: { type: Date, default: Date.now }
});

const ShelterSchema = new mongoose.Schema({
  name: String,
  location: {
    lat: Number,
    lng: Number
  },
  address: String,
  capacity: Number,
  occupancy: { type: Number, default: 0 },
  contact: String,
  amenities: [String],
  createdAt: { type: Date, default: Date.now }
});

const RescueTeamSchema = new mongoose.Schema({
  name: String,
  members: Number,
  status: { type: String, enum: ['available', 'deployed', 'busy'], default: 'available' },
  location: {
    lat: Number,
    lng: Number
  },
  assignedZone: String,
  equipment: [String],
  contact: String,
  createdAt: { type: Date, default: Date.now }
});

const CommandCenterDataSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  sos_alerts: Number,
  active_rescue_teams: Number,
  shelter_occupancy_percent: Number,
  high_risk_zones: Number,
  total_zones: Number,
  heatmap: Array,
  critical_zones: Array
});

const PoliceStationSchema = new mongoose.Schema({
  name: String,
  area: String,
  lat: Number,
  lng: Number,
  phone: String,
  address: String,
  createdAt: { type: Date, default: Date.now }
});

const AmbulanceServiceSchema = new mongoose.Schema({
  name: String,
  area: String,
  lat: Number,
  lng: Number,
  phone: String,
  status: { type: String, enum: ['available', 'busy'], default: 'available' },
  createdAt: { type: Date, default: Date.now }
});

const HospitalSchema = new mongoose.Schema({
  name: String,
  area: String,
  lat: Number,
  lng: Number,
  phone: String,
  beds: Number,
  occupiedBeds: { type: Number, default: 0 },
  address: String,
  createdAt: { type: Date, default: Date.now }
});

const DisasterAlertSchema = new mongoose.Schema({
  alertId: String,
  zone: String,
  area: String,
  disasterType: String,
  severity: String,
  lat: Number,
  lng: Number,
  status: { type: String, enum: ['active', 'resolved'], default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

const ZoneSchema = new mongoose.Schema({
  name: String,
  area: String,
  lat: Number,
  lng: Number,
  rainfall: Number,
  waterLevel: Number,
  elevation: Number,
  riskScore: Number,
  riskLevel: String,
  timestamp: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const OTPSession = mongoose.model('OTPSession', OTPSessionSchema);
const FloodPrediction = mongoose.model('FloodPrediction', FloodPredictionSchema);
const SOSAlert = mongoose.model('SOSAlert', SOSAlertSchema);
const UserReport = mongoose.model('UserReport', UserReportSchema);
const Shelter = mongoose.model('Shelter', ShelterSchema);
const RescueTeam = mongoose.model('RescueTeam', RescueTeamSchema);
const CommandCenterData = mongoose.model('CommandCenterData', CommandCenterDataSchema);
const PoliceStation = mongoose.model('PoliceStation', PoliceStationSchema);
const AmbulanceService = mongoose.model('AmbulanceService', AmbulanceServiceSchema);
const Hospital = mongoose.model('Hospital', HospitalSchema);
const DisasterAlert = mongoose.model('DisasterAlert', DisasterAlertSchema);
const Zone = mongoose.model('Zone', ZoneSchema);

module.exports = {
  User,
  OTPSession,
  FloodPrediction,
  SOSAlert,
  UserReport,
  Shelter,
  RescueTeam,
  CommandCenterData,
  PoliceStation,
  AmbulanceService,
  Hospital,
  DisasterAlert,
  Zone
};
