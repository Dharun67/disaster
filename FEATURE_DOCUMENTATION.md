GeoGuard - Complete Feature Documentation
==========================================

TABLE OF CONTENTS
=================
1. Authentication System
2. Machine Learning Module
3. Dashboard Features
4. Emergency SOS System
5. Shelter Management
6. Admin Command Center
7. API Reference
8. Database Schema

1. AUTHENTICATION SYSTEM
========================

OTP-Based Registration:
- User enters email
- System generates 6-digit OTP
- OTP sent via Gmail
- User enters OTP (10-minute validity)
- User creates account with name, phone, password
- Account stored in MongoDB
- Session token generated (JWT, 30-day validity)

OTP-Based Login:
- User enters email
- System generates OTP
- OTP sent via email
- User enters OTP
- Session token created
- No password required for login
- User remains logged in for 30 days

Session Management:
- Token stored in localStorage
- Auto-attached to all API requests
- Verified on each request
- Auto-logout on expiry
- Refresh capability

Security Features:
- OTP expires after 10 minutes
- Maximum 3 OTP attempts
- Password hashing with bcryptjs
- JWT token validation
- CORS protection

2. MACHINE LEARNING MODULE
===========================

Flood Risk Prediction Model:
- Type: Weighted Linear Regression
- Inputs: Rainfall, Water Level, Elevation
- Output: Risk Score (0-100), Risk Level, Confidence

Risk Calculation Formula:
Risk = (Rainfall × 0.4) + (Water Level × 0.4) + ((100 - Elevation) × 0.2)

Risk Levels:
- Low (0-30): Safe, no action needed
- Moderate (30-55): Caution advised, monitor situation
- High (55-75): Evacuation recommended
- Critical (75-100): Immediate evacuation required

Model Training:
- Automatic scaling of input parameters
- Learning from historical flood data
- Adjustable weights for different regions
- Confidence score: 85%

Batch Prediction:
- Process multiple zones simultaneously
- Efficient data processing
- Real-time updates

Model Information:
- Training data points count
- Current weights
- Scaling factors
- Model version
- Retraining capability

3. DASHBOARD FEATURES
=====================

Real-Time Statistics:
- Active SOS Alerts count
- Available Rescue Teams
- Shelter Occupancy Percentage
- High Risk Zones count

Zone Risk Visualization:
- Color-coded risk levels
- Risk score display
- Rainfall and water level data
- Interactive zone cards

Zone Details Modal:
- Comprehensive zone information
- Risk score and level
- Rainfall, water level, elevation
- Last update timestamp
- Location coordinates

Data Refresh:
- Auto-refresh every 30 seconds
- Manual refresh option
- Real-time updates

4. EMERGENCY SOS SYSTEM
=======================

Location Tracking:
- Automatic GPS location capture
- Latitude and longitude display
- Location refresh capability
- Fallback to default location if unavailable

Emergency Alert:
- One-click alert button
- Sends user information
- Includes current location
- Timestamp recorded
- Status tracking

User Information:
- Name display
- Email address
- Phone number
- User role

Emergency Guidelines:
- Use only in genuine emergencies
- Enable location services
- Keep contact info updated
- Follow emergency personnel instructions
- Stay in safe location

Alert Management:
- Alert ID generation
- Status tracking (active/resolved)
- Admin notification
- Response tracking

5. SHELTER MANAGEMENT
=====================

Shelter Information:
- Name and address
- Location coordinates
- Contact information
- Amenities list

Capacity Tracking:
- Total capacity
- Current occupancy
- Available beds
- Occupancy percentage
- Visual occupancy bar

Shelter Search:
- Filter by area or address
- Real-time search
- Multiple shelter display

Shelter Details:
- Comprehensive information modal
- Capacity breakdown
- Amenities list
- Contact details
- Location coordinates

Occupancy Status:
- Color-coded status
- Green: Low occupancy (< 50%)
- Yellow: Moderate occupancy (50-75%)
- Red: High occupancy (> 75%)

6. ADMIN COMMAND CENTER
=======================

Dashboard Overview:
- System statistics
- Active alerts count
- Team availability
- Shelter occupancy
- Risk zone count

Risk Heatmap:
- Visual zone representation
- Color-coded risk levels
- Risk score display
- Zone identification

Active Alerts Management:
- List of all SOS alerts
- Alert details (name, phone, location, time)
- Resolve alert functionality
- Alert history

Rescue Team Management:
- Team information display
- Current status (available/deployed/busy)
- Member count
- Assigned zone
- Status update capability

Shelter Monitoring:
- All shelters overview
- Occupancy visualization
- Capacity tracking
- Address information

Tab Navigation:
- Overview tab
- Alerts tab
- Teams tab
- Shelters tab

7. API REFERENCE
================

Authentication Endpoints:

POST /api/auth/register
- Request: { email, name, phone }
- Response: { success, message, email, expiresIn }
- Sends OTP to email

POST /api/auth/verify-otp
- Request: { email, otp, name, phone, password }
- Response: { success, token, user }
- Creates account and session

POST /api/auth/login
- Request: { email }
- Response: { success, message, email, expiresIn }
- Sends OTP for login

POST /api/auth/verify-login
- Request: { email, otp }
- Response: { success, token, user }
- Creates session for login

ML Endpoints:

POST /api/ml/train
- Request: (no body)
- Response: { success, message, info }
- Trains model with historical data

POST /api/ml/predict
- Request: { rainfall, waterLevel, elevation }
- Response: { success, prediction }
- Generates flood risk prediction

GET /api/ml/model-info
- Response: { trainingDataPoints, weights, scalingFactors, modelType, version }
- Returns model information

Flood Data Endpoints:

GET /api/flood-predictions
- Response: Array of predictions
- Returns all zone predictions

GET /api/zones
- Response: Array of zones
- Returns all zones with data

Emergency Endpoints:

POST /api/sos-alert
- Request: { name, phone, location, lat, lng, message }
- Response: { success, alertId }
- Sends emergency alert

GET /api/sos-alerts
- Response: Array of active alerts
- Returns all active SOS alerts

PUT /api/sos-alert/:id
- Request: { status }
- Response: Updated alert
- Updates alert status

Shelter Endpoints:

GET /api/shelters
- Response: Array of shelters
- Returns all shelters

GET /api/shelters/nearby
- Query: { lat, lng }
- Response: Array of nearby shelters
- Returns 5 nearest shelters

PUT /api/shelters/:id
- Request: Shelter data
- Response: Updated shelter
- Updates shelter information

Rescue Team Endpoints:

GET /api/rescue-teams
- Response: Array of teams
- Returns all rescue teams

PUT /api/rescue-teams/:id
- Request: { status }
- Response: Updated team
- Updates team status

Admin Endpoints:

GET /api/command-center-data
- Response: { timestamp, sos_alerts, active_rescue_teams, shelter_occupancy_percent, high_risk_zones, total_zones, heatmap, critical_zones }
- Returns dashboard data

Health Check:

GET /api/health
- Response: { status, database, timestamp, version }
- Returns system health

8. DATABASE SCHEMA
==================

User Collection:
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  phone: String,
  password: String (hashed),
  otp: String,
  otpExpiry: Date,
  isVerified: Boolean,
  role: String (user/admin/rescue),
  lastLogin: Date,
  sessionToken: String,
  sessionExpiry: Date,
  createdAt: Date
}

OTPSession Collection:
{
  _id: ObjectId,
  email: String,
  otp: String,
  otpExpiry: Date,
  attempts: Number,
  createdAt: Date (expires after 600 seconds)
}

FloodPrediction Collection:
{
  _id: ObjectId,
  zone: String,
  riskScore: Number,
  riskLevel: String,
  rainfall: Number,
  waterLevel: Number,
  elevation: Number,
  location: { lat: Number, lng: Number },
  timestamp: Date
}

SOSAlert Collection:
{
  _id: ObjectId,
  name: String,
  phone: String,
  location: String,
  message: String,
  lat: Number,
  lng: Number,
  status: String (active/resolved),
  createdAt: Date
}

Shelter Collection:
{
  _id: ObjectId,
  name: String,
  location: { lat: Number, lng: Number },
  address: String,
  capacity: Number,
  occupancy: Number,
  contact: String,
  amenities: [String],
  createdAt: Date
}

RescueTeam Collection:
{
  _id: ObjectId,
  name: String,
  members: Number,
  status: String (available/deployed/busy),
  location: { lat: Number, lng: Number },
  assignedZone: String,
  equipment: [String],
  contact: String,
  createdAt: Date
}

Zone Collection:
{
  _id: ObjectId,
  name: String,
  area: String,
  lat: Number,
  lng: Number,
  rainfall: Number,
  waterLevel: Number,
  elevation: Number,
  riskScore: Number,
  riskLevel: String,
  timestamp: Date
}

USAGE EXAMPLES
==============

1. Register New User:
   POST /api/auth/register
   { "email": "user@example.com", "name": "John Doe", "phone": "9876543210" }

2. Verify OTP and Create Account:
   POST /api/auth/verify-otp
   { "email": "user@example.com", "otp": "123456", "name": "John Doe", "phone": "9876543210", "password": "secure123" }

3. Generate Flood Prediction:
   POST /api/ml/predict
   { "rainfall": 50, "waterLevel": 40, "elevation": 100 }

4. Send Emergency Alert:
   POST /api/sos-alert
   { "name": "John Doe", "phone": "9876543210", "location": "13.0827, 80.2707", "lat": 13.0827, "lng": 80.2707, "message": "Emergency SOS Alert" }

5. Get All Shelters:
   GET /api/shelters

6. Update Rescue Team Status:
   PUT /api/rescue-teams/team_id
   { "status": "deployed" }

---

GeoGuard - Transforming Disaster Alerts into Actionable Intelligence
