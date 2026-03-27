GeoGuard - Enhanced Flood Risk Prediction System
================================================

FEATURES IMPLEMENTED
====================

1. OTP-Based Authentication
   - Email verification with OTP
   - 10-minute OTP expiry
   - 3 attempt limit before OTP reset
   - Secure session tokens (30-day validity)
   - No frequent login required after initial authentication

2. Machine Learning Flood Prediction
   - Weighted linear regression model
   - Real-time risk scoring (0-100)
   - Risk levels: Low, Moderate, High, Critical
   - Model training with historical data
   - Batch prediction capabilities
   - Configurable weights for rainfall, water level, elevation

3. Professional UI (No Emojis)
   - Clean, modern design
   - Professional color scheme (#1a3a52, #00a8e8)
   - Responsive grid layouts
   - Proper information hierarchy
   - Inline styles for consistency

4. Complete Feature Set
   - Dashboard with real-time predictions
   - ML prediction interface
   - Emergency SOS system with location tracking
   - Shelter locator with capacity tracking
   - Admin command center
   - Rescue team management
   - Hospital and ambulance services

BACKEND SETUP
=============

1. Install Dependencies:
   cd backend
   npm install

2. Environment Variables (.env):
   MONGODB_URI=mongodb+srv://dharun143:dbpass@cluster0.mxw8xkj.mongodb.net/geoguard?retryWrites=true&w=majority
   PORT=5000
   JWT_SECRET=your_jwt_secret_key_here
   EMAIL_USER=your_gmail@gmail.com
   EMAIL_PASSWORD=your_app_password

3. Gmail Setup for OTP:
   - Enable 2-Factor Authentication on Gmail
   - Generate App Password (16 characters)
   - Use App Password in EMAIL_PASSWORD

4. Start Backend:
   npm start
   Server runs on http://localhost:5000

FRONTEND SETUP
==============

1. Install Dependencies:
   cd frontend
   npm install

2. Environment Variables (.env):
   REACT_APP_API_URL=http://localhost:5000

3. Start Frontend:
   npm start
   App runs on http://localhost:3000

DATABASE INITIALIZATION
=======================

1. Run initialization script:
   node backend/init-db-enhanced.js

2. This creates:
   - 15 flood prediction zones
   - 10 shelters with capacity tracking
   - 8 rescue teams
   - 8 police stations
   - 8 ambulance services
   - 8 hospitals
   - Sample SOS alerts and reports

API ENDPOINTS
=============

Authentication:
- POST /api/auth/register - Register new user
- POST /api/auth/verify-otp - Verify OTP and create account
- POST /api/auth/login - Request OTP for login
- POST /api/auth/verify-login - Verify login OTP

ML Prediction:
- POST /api/ml/train - Train model with historical data
- POST /api/ml/predict - Generate flood risk prediction
- GET /api/ml/model-info - Get model information

Flood Data:
- GET /api/flood-predictions - Get all predictions
- GET /api/zones - Get all zones

Emergency:
- POST /api/sos-alert - Send SOS alert
- GET /api/sos-alerts - Get active alerts
- GET /api/shelters - Get all shelters
- GET /api/rescue-teams - Get rescue teams

Admin:
- GET /api/command-center-data - Get dashboard data
- PUT /api/sos-alert/:id - Update alert status
- PUT /api/rescue-teams/:id - Update team status

AUTHENTICATION FLOW
===================

1. User Registration:
   - Enter email
   - System sends OTP to email
   - User enters OTP
   - User creates account with name, phone, password
   - Session token created (30-day validity)

2. User Login:
   - Enter email
   - System sends OTP to email
   - User enters OTP
   - Session token created
   - No password needed for login

3. Session Management:
   - Token stored in localStorage
   - Auto-attached to all API requests
   - 30-day expiry
   - Auto-logout on token expiry

ML MODEL DETAILS
================

Risk Score Calculation:
Risk = (Rainfall × 0.4) + (Water Level × 0.4) + ((100 - Elevation) × 0.2)

Risk Levels:
- Low: 0-30
- Moderate: 30-55
- High: 55-75
- Critical: 75-100

Model Training:
- Automatically scales input parameters
- Learns from historical flood data
- Adjustable weights for different regions
- Confidence score: 0.85 (85%)

PAGES OVERVIEW
==============

1. Login Page
   - OTP-based authentication
   - Registration and login modes
   - Email verification
   - Professional design

2. Dashboard
   - Real-time flood predictions
   - Zone risk visualization
   - Statistics cards
   - Zone details modal

3. ML Prediction
   - Interactive sliders for inputs
   - Real-time prediction
   - Model information display
   - Model retraining

4. Emergency SOS
   - Location tracking
   - One-click alert
   - User information display
   - Emergency guidelines

5. Shelter Locator
   - Shelter search and filter
   - Capacity tracking
   - Amenities display
   - Detailed shelter information

6. Admin Dashboard
   - Overview statistics
   - Active alerts management
   - Rescue team status
   - Shelter monitoring
   - Risk heatmap

DEPLOYMENT
==========

Docker Deployment:
1. Build images:
   docker build -t geoguard-backend ./backend
   docker build -t geoguard-frontend ./frontend

2. Run containers:
   docker run -p 5000:5000 geoguard-backend
   docker run -p 3000:3000 geoguard-frontend

Cloud Deployment:
- Backend: Heroku, AWS EC2, Google Cloud Run
- Frontend: Vercel, Netlify, AWS S3 + CloudFront
- Database: MongoDB Atlas (already configured)

SECURITY FEATURES
=================

1. Authentication:
   - OTP-based (no password stored for login)
   - JWT tokens with 30-day expiry
   - Session management

2. Data Protection:
   - Password hashing with bcryptjs
   - CORS enabled
   - Input validation
   - Environment variables for secrets

3. Email Security:
   - Gmail App Password (not main password)
   - OTP expiry (10 minutes)
   - Attempt limiting (3 tries)

TROUBLESHOOTING
===============

1. MongoDB Connection Error:
   - Check MONGODB_URI in .env
   - Verify IP whitelist in MongoDB Atlas
   - Ensure network access is enabled

2. Email Not Sending:
   - Verify Gmail App Password
   - Check EMAIL_USER and EMAIL_PASSWORD
   - Enable "Less secure app access" if needed

3. Frontend Not Connecting:
   - Check REACT_APP_API_URL
   - Verify backend is running
   - Check CORS settings

4. ML Prediction Not Working:
   - Ensure training data exists
   - Check model info endpoint
   - Verify input parameters are valid

TESTING
=======

1. Test OTP Authentication:
   - Go to http://localhost:3000/login
   - Enter test email
   - Check email for OTP
   - Enter OTP and create account

2. Test ML Prediction:
   - Go to Dashboard
   - Navigate to ML Prediction
   - Adjust sliders and generate prediction
   - Check risk score and level

3. Test Emergency SOS:
   - Go to Emergency SOS
   - Click "Send Emergency Alert"
   - Verify alert in Admin Dashboard

4. Test Shelters:
   - Go to Shelter Locator
   - View all shelters
   - Check capacity and amenities

PERFORMANCE OPTIMIZATION
========================

1. Database:
   - Indexes on location fields
   - Pagination for large datasets
   - Connection pooling

2. Frontend:
   - React lazy loading
   - Component memoization
   - Efficient state management

3. Backend:
   - Request caching
   - Batch operations
   - Async processing

MONITORING
==========

1. Health Check:
   GET /api/health

2. Database Status:
   GET /api/db-status

3. Model Info:
   GET /api/ml/model-info

SUPPORT
=======

For issues or questions:
1. Check logs in backend console
2. Verify environment variables
3. Check MongoDB Atlas connection
4. Review API responses in browser console

---

GeoGuard - Transforming Disaster Alerts into Actionable Intelligence
