# GeoGuard - Complete Testing Guide

## 🧪 AUTOMATED TESTING CHECKLIST

### Phase 1: Backend Verification

#### 1.1 Database Connection
```bash
# Check MongoDB is running
mongod

# In another terminal, test connection
cd backend
npm start

# Expected output:
# ✓ MongoDB connected successfully
# 🚀 GeoGuard Backend Server
# 📍 Running on http://localhost:5000
```

#### 1.2 Health Check Endpoint
```bash
curl http://localhost:5000/api/health

# Expected response:
{
  "status": "GeoGuard Backend Running",
  "database": "Connected",
  "timestamp": "2024-01-XX...",
  "version": "2.0.0",
  "environment": "development"
}
```

#### 1.3 Authentication Endpoints
```bash
# Test registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User","phone":"9876543210"}'

# Expected: OTP sent to email

# Test OTP verification
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","otp":"123456","name":"Test User","phone":"9876543210","password":"pass123"}'

# Expected: Login successful with token
```

#### 1.4 Flood Prediction Endpoints
```bash
curl http://localhost:5000/api/flood-predictions

# Expected: Array of flood predictions with risk scores
```

#### 1.5 Emergency Endpoints (NEW)
```bash
# Get emergency contacts
curl http://localhost:5000/api/emergency-contacts/Velachery

# Get nearby services
curl "http://localhost:5000/api/emergency-services/nearby?lat=13.0827&lng=80.2707&type=police"

# Get police stations
curl http://localhost:5000/api/police-stations

# Get hospitals
curl http://localhost:5000/api/hospitals

# Get rescue teams
curl http://localhost:5000/api/rescue-teams
```

---

### Phase 2: Frontend Verification

#### 2.1 Frontend Startup
```bash
cd frontend
npm install
npm start

# Expected:
# - No console errors
# - App loads on http://localhost:3000
# - Navigation menu visible
```

#### 2.2 Login Page Test
- [ ] Email input field works
- [ ] "Send OTP" button is clickable
- [ ] OTP input appears after sending
- [ ] "Verify OTP" button works
- [ ] Redirects to dashboard after login
- [ ] Token stored in localStorage

#### 2.3 Dashboard Page Test
- [ ] Page loads without errors
- [ ] Shows 4 stat cards (SOS Alerts, Teams, Occupancy, Risk Zones)
- [ ] Displays zone predictions in grid
- [ ] Click on zone shows modal with details
- [ ] Data updates every 30 seconds
- [ ] Error message displays if API fails

#### 2.4 Emergency SOS Page Test
- [ ] Page loads with SOS button
- [ ] Location is detected automatically
- [ ] Shows current location coordinates
- [ ] Shows user information
- [ ] "Send Emergency Alert" button works
- [ ] Shows success message after sending
- [ ] Countdown timer starts (5 minutes)
- [ ] "Cancel Alert" button works
- [ ] Offline mode queues alerts
- [ ] Retry button sends queued alerts

#### 2.5 Shelter Locator Page Test
- [ ] Page loads with shelter list
- [ ] Shows shelter cards with occupancy
- [ ] Filter by area works
- [ ] Click on shelter shows modal
- [ ] Modal displays all shelter details
- [ ] Occupancy bar shows correct percentage
- [ ] Amenities display correctly

#### 2.6 Admin Dashboard Test
- [ ] Page loads with overview tab
- [ ] Shows 4 stat cards with correct data
- [ ] Heatmap displays zones with colors
- [ ] "Alerts" tab shows active SOS alerts
- [ ] "Teams" tab shows rescue teams
- [ ] Team status can be updated
- [ ] "Shelters" tab shows shelter occupancy
- [ ] Data refreshes every 15 seconds

#### 2.7 Featured Resources Page Test
- [ ] Page loads with resource cards
- [ ] Shows 6 featured resources
- [ ] Each card displays rating and reviews
- [ ] Cards are clickable
- [ ] Verified badge shows correctly

#### 2.8 Marketplace Page Test
- [ ] Page loads with product grid
- [ ] Shows 9 products
- [ ] Each product has price, rating, reviews
- [ ] Filter by category works
- [ ] Search functionality works
- [ ] "Add to Cart" button is clickable

---

### Phase 3: Integration Testing

#### 3.1 End-to-End SOS Flow
```
1. Login to application
2. Navigate to Emergency SOS page
3. Click "Send Emergency Alert"
4. Verify alert appears in Admin Dashboard
5. Check database for SOSAlert record
6. Verify police/hospitals/rescue teams were notified
```

#### 3.2 End-to-End Shelter Flow
```
1. Login to application
2. Navigate to Shelter Locator
3. View all shelters
4. Click on a shelter
5. Verify modal shows correct data
6. Check database for Shelter record
```

#### 3.3 End-to-End Admin Flow
```
1. Login as admin
2. Navigate to Admin Dashboard
3. Verify all data loads
4. Update rescue team status
5. Verify change persists
6. Check database for updated record
```

---

### Phase 4: Database Verification

#### 4.1 Check Collections
```bash
# Connect to MongoDB
mongo

# Use geoguard database
use geoguard

# Check collections
show collections

# Expected collections:
# - users
# - otpsessions
# - floodpredictions
# - sosalerts
# - userreports
# - shelters
# - rescueteams
# - policestations
# - ambulanceservices
# - hospitals
# - zones
```

#### 4.2 Check Data
```bash
# Check users
db.users.find().pretty()

# Check SOS alerts
db.sosalerts.find().pretty()

# Check shelters
db.shelters.find().pretty()

# Check flood predictions
db.floodpredictions.find().pretty()
```

---

### Phase 5: API Testing with Postman

#### 5.1 Create Postman Collection

**Authentication Endpoints:**
- POST /api/auth/register
- POST /api/auth/verify-otp
- POST /api/auth/login
- POST /api/auth/verify-login

**Flood Prediction Endpoints:**
- GET /api/flood-predictions
- GET /api/zones

**SOS Alert Endpoints:**
- POST /api/emergency-sos (requires token)
- GET /api/sos-alerts (requires token)
- PUT /api/sos-alert/:id (requires token)
- POST /api/notify-police (requires token)
- POST /api/notify-hospitals (requires token)
- POST /api/notify-rescue-teams (requires token)

**Shelter Endpoints:**
- GET /api/shelters
- PUT /api/shelters/:id (requires token)

**Rescue Team Endpoints:**
- GET /api/rescue-teams
- PUT /api/rescue-teams/:id (requires token)

**Emergency Services Endpoints:**
- GET /api/emergency-contacts/:zone
- GET /api/emergency-services/nearby
- GET /api/police-stations
- GET /api/ambulance-services
- GET /api/hospitals

**Admin Endpoints:**
- GET /api/command-center-data (requires token)
- GET /api/featured-resources (requires token)
- GET /api/marketplace-products (requires token)

---

### Phase 6: Performance Testing

#### 6.1 Load Testing
```bash
# Test with multiple concurrent requests
ab -n 100 -c 10 http://localhost:5000/api/flood-predictions

# Expected: All requests succeed with <200ms response time
```

#### 6.2 Response Time Testing
```bash
# Measure response times
time curl http://localhost:5000/api/flood-predictions

# Expected: <100ms for simple queries
```

---

### Phase 7: Error Handling Testing

#### 7.1 Invalid Token
```bash
curl -H "Authorization: Bearer invalid_token" \
  http://localhost:5000/api/sos-alerts

# Expected: 401 Unauthorized
```

#### 7.2 Missing Required Fields
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{}'

# Expected: 400 Bad Request - Email required
```

#### 7.3 Database Connection Error
```bash
# Stop MongoDB
# Try to access API

# Expected: Error message about database connection
```

---

### Phase 8: Security Testing

#### 8.1 CORS Testing
```bash
# Test from different origin
curl -H "Origin: http://different-origin.com" \
  http://localhost:5000/api/health

# Expected: CORS headers present or error
```

#### 8.2 SQL Injection Testing
```bash
# Try SQL injection in email field
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com\"; DROP TABLE users; --","name":"Test"}'

# Expected: Safe handling, no database damage
```

#### 8.3 XSS Testing
```bash
# Try XSS in name field
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","name":"<script>alert(1)</script>"}'

# Expected: Script tags escaped or sanitized
```

---

## 📋 Manual Testing Scenarios

### Scenario 1: New User Registration
1. Open http://localhost:3000
2. Click "Register"
3. Enter email: `newuser@example.com`
4. Click "Send OTP"
5. Check email for OTP (or check backend logs)
6. Enter OTP
7. Enter name and phone
8. Click "Verify"
9. Should redirect to dashboard

### Scenario 2: Emergency Alert
1. Login to application
2. Navigate to Emergency SOS
3. Allow location access
4. Click "Send Emergency Alert"
5. Verify success message
6. Check Admin Dashboard for alert
7. Verify database has SOSAlert record

### Scenario 3: Shelter Search
1. Login to application
2. Navigate to Shelter Locator
3. View all shelters
4. Filter by area
5. Click on shelter
6. Verify modal shows details
7. Close modal

### Scenario 4: Admin Monitoring
1. Login as admin
2. Navigate to Admin Dashboard
3. View overview with stats
4. Check alerts tab
5. Update team status
6. Check shelters tab
7. Verify data updates

---

## ✅ Final Verification Checklist

- [ ] All 8 backend endpoints working
- [ ] All 8 frontend pages loading
- [ ] Database has all 11 collections
- [ ] Authentication working (register/login/OTP)
- [ ] SOS alerts saving to database
- [ ] Emergency services being notified
- [ ] Admin dashboard showing real-time data
- [ ] Shelter data displaying correctly
- [ ] Rescue teams can be updated
- [ ] Error handling working
- [ ] Offline mode queuing alerts
- [ ] CORS properly configured
- [ ] Tokens being validated
- [ ] No console errors
- [ ] No network errors
- [ ] Response times acceptable
- [ ] Database queries optimized
- [ ] Security measures in place

---

## 🚀 Deployment Readiness

Once all tests pass:
- [ ] Environment variables configured
- [ ] Database backups created
- [ ] Error logging enabled
- [ ] Performance monitoring set up
- [ ] Security audit completed
- [ ] Load testing passed
- [ ] Documentation updated
- [ ] Team trained on system

