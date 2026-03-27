# GeoGuard System Architecture & Integration Map

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │   Login      │  │  Dashboard   │  │  Emergency   │           │
│  │   Page       │  │              │  │  SOS         │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │  Shelter     │  │   Admin      │  │  Featured    │           │
│  │  Locator     │  │  Dashboard   │  │  Resources   │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │  Marketplace │  │   ML         │  │  Smart       │           │
│  │              │  │  Prediction  │  │  Routing     │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│                                                                   │
│                    ↓ (API Service Layer)                         │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Centralized API Service (axios)                        │   │
│  │  - Request/Response Interceptors                        │   │
│  │  - Token Management                                     │   │
│  │  - Error Handling                                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓ HTTP/HTTPS
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Express.js)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Authentication Routes                                   │  │
│  │  - POST /api/auth/register                              │  │
│  │  - POST /api/auth/verify-otp                            │  │
│  │  - POST /api/auth/login                                 │  │
│  │  - POST /api/auth/verify-login                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Flood Prediction Routes                                 │  │
│  │  - GET /api/flood-predictions                           │  │
│  │  - GET /api/zones                                       │  │
│  │  - POST /api/ml/predict                                 │  │
│  │  - POST /api/ml/train                                   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Emergency SOS Routes (NEW)                              │  │
│  │  - POST /api/emergency-sos                              │  │
│  │  - POST /api/notify-police                              │  │
│  │  - POST /api/notify-hospitals                           │  │
│  │  - POST /api/notify-rescue-teams                        │  │
│  │  - GET /api/emergency-contacts/:zone                    │  │
│  │  - GET /api/emergency-services/nearby                   │  │
│  │  - PUT /api/sos-alert/:id                               │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Shelter Routes                                          │  │
│  │  - GET /api/shelters                                    │  │
│  │  - PUT /api/shelters/:id                                │  │
│  │  - GET /api/shelters/nearby                             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Rescue Team Routes                                      │  │
│  │  - GET /api/rescue-teams                                │  │
│  │  - PUT /api/rescue-teams/:id                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Admin Routes                                            │  │
│  │  - GET /api/command-center-data                         │  │
│  │  - GET /api/featured-resources                          │  │
│  │  - GET /api/marketplace-products                        │  │
│  │  - GET /api/user-reports                                │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Middleware                                              │  │
│  │  - CORS Protection                                       │  │
│  │  - JWT Verification                                      │  │
│  │  - Error Handling                                        │  │
│  │  - Request Logging                                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓ Mongoose ODM
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE (MongoDB)                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Collections:                                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │   users      │  │   zones      │  │  shelters    │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │ sosalerts    │  │ userreports  │  │ rescueteams  │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │ flood        │  │ police       │  │ ambulance    │           │
│  │ predictions  │  │ stations     │  │ services     │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐                             │
│  │  hospitals   │  │  otpsessions │                             │
│  └──────────────┘  └──────────────┘                             │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow Diagrams

### 1. Authentication Flow
```
User Input (Email)
    ↓
POST /api/auth/register
    ↓
Generate OTP
    ↓
Send OTP Email
    ↓
User Enters OTP
    ↓
POST /api/auth/verify-otp
    ↓
Create User in DB
    ↓
Generate JWT Token
    ↓
Return Token to Frontend
    ↓
Store in localStorage
    ↓
Redirect to Dashboard
```

### 2. Emergency SOS Flow
```
User Clicks SOS Button
    ↓
Get Current Location
    ↓
Collect User Info
    ↓
POST /api/emergency-sos
    ↓
Save to SOSAlert Collection
    ↓
POST /api/notify-police
    ↓
Find Nearby Police Stations
    ↓
POST /api/notify-hospitals
    ↓
Find Nearby Hospitals
    ↓
POST /api/notify-rescue-teams
    ↓
Find Nearby Rescue Teams
    ↓
Return Success Response
    ↓
Show Confirmation to User
    ↓
Admin Dashboard Updates
```

### 3. Shelter Locator Flow
```
User Navigates to Shelters
    ↓
GET /api/shelters
    ↓
Fetch All Shelters from DB
    ↓
Display in Grid
    ↓
User Clicks Shelter
    ↓
Show Modal with Details
    ↓
User Can Filter by Area
    ↓
GET /api/shelters (filtered)
    ↓
Update Display
```

### 4. Admin Dashboard Flow
```
Admin Logs In
    ↓
GET /api/command-center-data
    ↓
Fetch Multiple Collections:
  - Count SOS Alerts
  - Get Rescue Teams
  - Get Shelters
  - Get Flood Predictions
    ↓
Calculate Statistics
    ↓
Generate Heatmap
    ↓
Display Dashboard
    ↓
Auto-refresh every 15 seconds
```

---

## 🔄 API Endpoint Map

### Authentication (4 endpoints)
```
POST   /api/auth/register          → Create OTP session
POST   /api/auth/verify-otp        → Create user & token
POST   /api/auth/login             → Send OTP
POST   /api/auth/verify-login      → Verify & create token
```

### Flood Predictions (4 endpoints)
```
GET    /api/flood-predictions      → Get all predictions
GET    /api/zones                  → Get all zones
POST   /api/ml/predict             → ML prediction
POST   /api/ml/train               → Train ML model
```

### Emergency SOS (7 endpoints) ⭐ NEW
```
POST   /api/emergency-sos          → Save SOS alert
POST   /api/notify-police          → Notify police
POST   /api/notify-hospitals       → Notify hospitals
POST   /api/notify-rescue-teams    → Notify rescue teams
GET    /api/emergency-contacts/:zone → Get contacts
GET    /api/emergency-services/nearby → Get nearby services
PUT    /api/sos-alert/:id          → Update alert status
```

### Shelters (3 endpoints)
```
GET    /api/shelters               → Get all shelters
GET    /api/shelters/nearby        → Get nearby shelters
PUT    /api/shelters/:id           → Update shelter
```

### Rescue Teams (2 endpoints)
```
GET    /api/rescue-teams           → Get all teams
PUT    /api/rescue-teams/:id       → Update team status
```

### Emergency Services (4 endpoints)
```
GET    /api/police-stations        → Get police stations
GET    /api/ambulance-services     → Get ambulances
GET    /api/hospitals              → Get hospitals
GET    /api/emergency-contacts/:zone → Get emergency contacts
```

### Admin (4 endpoints)
```
GET    /api/command-center-data    → Dashboard data
GET    /api/featured-resources     → Featured resources
GET    /api/marketplace-products   → Marketplace products
GET    /api/user-reports           → User reports
```

### Utility (1 endpoint)
```
GET    /api/health                 → Health check
```

**Total: 32 Endpoints**

---

## 🗄️ Database Schema Map

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  phone: String,
  password: String (hashed),
  isVerified: Boolean,
  role: String (user/admin/rescue),
  lastLogin: Date,
  sessionToken: String,
  sessionExpiry: Date,
  createdAt: Date
}
```

### SOSAlerts Collection
```javascript
{
  _id: ObjectId,
  name: String,
  phone: String,
  location: String,
  lat: Number,
  lng: Number,
  message: String,
  status: String (active/resolved),
  createdAt: Date
}
```

### Shelters Collection
```javascript
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
```

### RescueTeams Collection
```javascript
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
```

### FloodPredictions Collection
```javascript
{
  _id: ObjectId,
  zone: String,
  riskScore: Number,
  riskLevel: String (Low/Moderate/High/Critical),
  rainfall: Number,
  waterLevel: Number,
  elevation: Number,
  location: { lat: Number, lng: Number },
  timestamp: Date
}
```

### Zones Collection
```javascript
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
```

---

## 🔐 Security Architecture

```
┌─────────────────────────────────────────┐
│         Frontend (React)                 │
│  - Stores JWT in localStorage            │
│  - Sends token in Authorization header   │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│    CORS Middleware                       │
│  - Validates origin                      │
│  - Allows credentials                    │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│    JWT Verification Middleware           │
│  - Extracts token from header            │
│  - Verifies signature                    │
│  - Checks expiration                     │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│    Route Handler                         │
│  - Processes request                     │
│  - Validates input                       │
│  - Queries database                      │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│    Response                              │
│  - Returns data                          │
│  - Sets security headers                 │
└─────────────────────────────────────────┘
```

---

## 📈 Performance Optimization

### Frontend Optimization
- ✅ Centralized API service (single point of configuration)
- ✅ Request/response interceptors (automatic token refresh)
- ✅ Error handling (consistent error messages)
- ✅ Caching support (reduce API calls)
- ✅ Lazy loading (load pages on demand)

### Backend Optimization
- ✅ Database indexing (faster queries)
- ✅ Connection pooling (reuse connections)
- ✅ Response compression (reduce payload)
- ✅ Caching headers (browser caching)
- ✅ Query optimization (select only needed fields)

### Database Optimization
- ✅ Indexes on frequently queried fields
- ✅ Proper data types (reduce storage)
- ✅ Relationships (avoid data duplication)
- ✅ TTL indexes (auto-delete expired data)

---

## 🚀 Deployment Architecture

```
┌──────────────────────────────────────────────────┐
│              Production Environment               │
├──────────────────────────────────────────────────┤
│                                                   │
│  ┌────────────────────────────────────────────┐ │
│  │  Frontend (Vercel/Netlify)                 │ │
│  │  - React app                               │ │
│  │  - CDN distribution                        │ │
│  │  - SSL/TLS encryption                      │ │
│  └────────────────────────────────────────────┘ │
│                                                   │
│  ┌────────────────────────────────────────────┐ │
│  │  Backend (Heroku/AWS/GCP)                  │ │
│  │  - Express server                          │ │
│  │  - Auto-scaling                            │ │
│  │  - Load balancing                          │ │
│  │  - SSL/TLS encryption                      │ │
│  └────────────────────────────────────────────┘ │
│                                                   │
│  ┌────────────────────────────────────────────┐ │
│  │  Database (MongoDB Atlas)                  │ │
│  │  - Managed MongoDB                         │ │
│  │  - Automatic backups                       │ │
│  │  - Replication                             │ │
│  │  - Encryption at rest                      │ │
│  └────────────────────────────────────────────┘ │
│                                                   │
│  ┌────────────────────────────────────────────┐ │
│  │  Monitoring & Logging                      │ │
│  │  - Error tracking (Sentry)                 │ │
│  │  - Performance monitoring (New Relic)      │ │
│  │  - Log aggregation (ELK Stack)             │ │
│  └────────────────────────────────────────────┘ │
│                                                   │
└──────────────────────────────────────────────────┘
```

---

## ✅ Integration Checklist

- [x] Frontend pages created
- [x] Backend routes defined
- [x] Database schemas designed
- [x] Authentication implemented
- [ ] Emergency endpoints added (PENDING)
- [ ] API service methods added (PENDING)
- [ ] Frontend environment configured (PENDING)
- [ ] Emergency SOS page fixed (PENDING)
- [ ] Integration tested (PENDING)
- [ ] Security audit completed (PENDING)
- [ ] Performance optimized (PENDING)
- [ ] Documentation completed (PENDING)

---

## 📞 Quick Reference

**Frontend Port:** 3000  
**Backend Port:** 5000  
**Database Port:** 27017  
**API Base URL:** http://localhost:5000  

**Frontend Start:** `cd frontend && npm start`  
**Backend Start:** `cd backend && npm start`  
**Database Start:** `mongod`  

**Frontend Env:** `frontend/.env`  
**Backend Env:** `backend/.env`  

---

## 🎯 Status Summary

| Component | Status | Notes |
|-----------|--------|-------|
| Frontend Pages | ✅ Complete | 8 pages working |
| Backend Routes | ⚠️ Partial | Missing 8 emergency endpoints |
| Database | ✅ Complete | 11 collections ready |
| Authentication | ✅ Complete | OTP-based login |
| API Service | ⚠️ Partial | Missing 6 methods |
| Emergency SOS | ❌ Broken | Needs fixes |
| Admin Dashboard | ✅ Complete | Real-time updates |
| Shelter Locator | ✅ Complete | Full functionality |

**Overall Status:** ⚠️ NEEDS FIXES (45 minutes estimated)

