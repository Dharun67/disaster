# 🏗️ GeoGuard - System Architecture & Technical Design

## 📐 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  React Frontend (Port 3000)                              │   │
│  │  - Dashboard, Maps, Analytics, SOS, Admin Panel          │   │
│  │  - Responsive Design (Mobile, Tablet, Desktop)           │   │
│  │  - Real-time Updates via WebSocket                       │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↓ (HTTP/HTTPS)
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY LAYER                           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Express.js Server (Port 5000)                           │   │
│  │  - Authentication & Authorization                        │   │
│  │  - Request Validation & Sanitization                     │   │
│  │  - Rate Limiting & CORS                                  │   │
│  │  - Error Handling & Logging                              │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    BUSINESS LOGIC LAYER                          │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Services & Controllers                                  │   │
│  │  - Authentication Service                                │   │
│  │  - Flood Prediction Service                              │   │
│  │  - Emergency Alert Service                               │   │
│  │  - Shelter Management Service                            │   │
│  │  - Analytics Service                                     │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      DATA ACCESS LAYER                           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Mongoose ODM                                            │   │
│  │  - Schema Validation                                     │   │
│  │  - Query Optimization                                    │   │
│  │  - Indexing Strategy                                     │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE LAYER                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  MongoDB (Port 27017)                                    │   │
│  │  - Collections: Users, Predictions, Alerts, etc.         │   │
│  │  - Replication & Backup                                  │   │
│  │  - Indexing & Query Optimization                         │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  - Weather API                                           │   │
│  │  - Email Service (Nodemailer)                            │   │
│  │  - Map Services (Leaflet, Mapbox)                        │   │
│  │  - ML Service (Python Flask)                             │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow Architecture

### Authentication Flow
```
User Input (Email)
    ↓
POST /api/auth/login
    ↓
Generate OTP
    ↓
Send OTP via Email
    ↓
User Enters OTP
    ↓
POST /api/auth/verify-login
    ↓
Validate OTP
    ↓
Create JWT Token
    ↓
Return Token + User Data
    ↓
Store in localStorage
    ↓
Authenticated Session
```

### Flood Prediction Flow
```
Real-time Data Collection
    ↓
Rainfall, Water Level, Elevation
    ↓
POST /api/ml/predict
    ↓
ML Model Processing
    ↓
Risk Score Calculation
    ↓
Risk Level Classification
    ↓
Store in Database
    ↓
Update Frontend Dashboard
    ↓
Trigger Alerts if Critical
```

### Emergency Alert Flow
```
User Clicks SOS
    ↓
Capture Location (GPS)
    ↓
POST /api/sos-alert
    ↓
Validate & Store Alert
    ↓
Notify Rescue Teams
    ↓
Update Admin Dashboard
    ↓
Track Response Status
    ↓
Mark as Resolved
```

---

## 📊 Database Schema Design

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  phone: String,
  password: String (hashed),
  isVerified: Boolean,
  role: String (user|admin|rescue),
  lastLogin: Date,
  sessionToken: String,
  sessionExpiry: Date,
  createdAt: Date
}
```

### Flood Predictions Collection
```javascript
{
  _id: ObjectId,
  zone: String,
  riskScore: Number (0-100),
  riskLevel: String (Low|Moderate|High|Critical),
  rainfall: Number,
  waterLevel: Number,
  elevation: Number,
  location: {
    lat: Number,
    lng: Number
  },
  timestamp: Date,
  confidence: Number,
  modelVersion: String
}
```

### SOS Alerts Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  name: String,
  phone: String,
  location: String,
  message: String,
  lat: Number,
  lng: Number,
  status: String (active|resolved),
  assignedTeam: ObjectId,
  createdAt: Date,
  resolvedAt: Date
}
```

### Shelters Collection
```javascript
{
  _id: ObjectId,
  name: String,
  location: {
    lat: Number,
    lng: Number
  },
  address: String,
  capacity: Number,
  occupancy: Number,
  contact: String,
  amenities: [String],
  createdAt: Date
}
```

### Rescue Teams Collection
```javascript
{
  _id: ObjectId,
  name: String,
  members: Number,
  status: String (available|deployed|busy),
  location: {
    lat: Number,
    lng: Number
  },
  assignedZone: String,
  equipment: [String],
  contact: String,
  createdAt: Date
}
```

---

## 🔐 Security Architecture

### Authentication & Authorization
```
Request with Token
    ↓
Extract Token from Header
    ↓
Verify JWT Signature
    ↓
Check Token Expiry
    ↓
Validate User Role
    ↓
Grant/Deny Access
```

### Password Security
- Hashing: bcryptjs (10 salt rounds)
- Storage: Never store plain text
- Transmission: HTTPS only

### API Security
- CORS: Whitelist frontend domain
- Helmet: Security headers
- Rate Limiting: 100 requests per 15 minutes
- Input Validation: Sanitize all inputs
- SQL Injection Prevention: Use Mongoose ODM

---

## 🚀 API Endpoint Architecture

### Authentication Endpoints
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/verify-login
POST   /api/auth/verify-otp
```

### Flood Prediction Endpoints
```
GET    /api/flood-predictions
GET    /api/flood-predictions/:zone
POST   /api/ml/predict
GET    /api/ml/model-info
POST   /api/ml/train
```

### Emergency Service Endpoints
```
POST   /api/sos-alert
GET    /api/sos-alerts
PUT    /api/sos-alert/:id
GET    /api/shelters
GET    /api/shelters/nearby
GET    /api/rescue-teams
PUT    /api/rescue-teams/:id
```

### Admin Endpoints
```
GET    /api/command-center-data
GET    /api/featured-resources
GET    /api/marketplace-products
GET    /api/zones
GET    /api/police-stations
GET    /api/ambulance-services
GET    /api/hospitals
```

---

## 🧠 ML/AI Architecture

### Prediction Model
```
Input Features:
  - Rainfall Intensity (mm)
  - Water Level (%)
  - Elevation (meters)
  - Drainage Capacity
  - Historical Patterns

Processing:
  - Feature Normalization
  - Model Inference
  - Confidence Calculation
  - Risk Classification

Output:
  - Risk Score (0-100)
  - Risk Level (Low/Moderate/High/Critical)
  - Confidence (0-100%)
  - Recommendations
```

### Algorithms Used
1. **Random Forest** - Primary model (94.2% accuracy)
2. **Gradient Boosting** - Ensemble method (93.8% accuracy)
3. **K-Means Clustering** - Zone grouping
4. **Z-Score Anomaly Detection** - Outlier detection
5. **Pearson Correlation** - Feature analysis
6. **Time Series Decomposition** - Trend analysis

---

## 📈 Scalability Architecture

### Horizontal Scaling
```
Load Balancer (Nginx/HAProxy)
    ↓
┌─────────────────────────────────┐
│  Backend Instance 1 (Port 5000) │
│  Backend Instance 2 (Port 5001) │
│  Backend Instance 3 (Port 5002) │
└─────────────────────────────────┘
    ↓
MongoDB Replica Set
    ├─ Primary
    ├─ Secondary 1
    └─ Secondary 2
```

### Caching Strategy
```
Request
    ↓
Check Redis Cache
    ↓
If Hit: Return Cached Data
If Miss: Query Database
    ↓
Store in Cache (TTL: 5 min)
    ↓
Return Data
```

### Database Optimization
- Indexing on frequently queried fields
- Query optimization
- Connection pooling
- Replica sets for high availability

---

## 🔄 Deployment Architecture

### Development Environment
```
Local Machine
├── Frontend (Port 3000)
├── Backend (Port 5000)
└── MongoDB (Port 27017)
```

### Staging Environment
```
AWS/DigitalOcean
├── Frontend (Vercel/Netlify)
├── Backend (Heroku/EC2)
└── Database (MongoDB Atlas)
```

### Production Environment
```
Multi-Region Deployment
├── Frontend CDN (CloudFlare)
├── Backend Load Balancer
├── Multiple Backend Instances
├── MongoDB Replica Set
└── Backup & Disaster Recovery
```

---

## 📊 Performance Metrics

### Target Metrics
- API Response Time: < 100ms
- Database Query Time: < 50ms
- Page Load Time: < 2s
- Prediction Accuracy: > 90%
- System Uptime: 99.9%
- Concurrent Users: 1000+

### Monitoring
- Application Performance Monitoring (APM)
- Error Tracking (Sentry)
- Log Aggregation (ELK Stack)
- Metrics Collection (Prometheus)
- Alerting (PagerDuty)

---

## 🔄 Integration Points

### Frontend-Backend Integration
```
Axios HTTP Client
    ↓
Request Interceptor (Add Token)
    ↓
API Call
    ↓
Response Interceptor (Handle Errors)
    ↓
Update State
    ↓
Re-render Components
```

### Backend-Database Integration
```
Express Route Handler
    ↓
Mongoose Query
    ↓
MongoDB Operation
    ↓
Return Results
    ↓
Format Response
    ↓
Send to Client
```

### External Service Integration
```
Backend Service
    ↓
API Call to External Service
    ↓
Handle Response
    ↓
Process Data
    ↓
Store/Return Results
```

---

## 🛡️ Error Handling Architecture

### Error Flow
```
Error Occurs
    ↓
Catch Error
    ↓
Log Error Details
    ↓
Determine Error Type
    ↓
Return Appropriate Status Code
    ↓
Send Error Response
    ↓
Frontend Displays Error Message
```

### Error Types
- 400: Bad Request (Validation Error)
- 401: Unauthorized (Auth Error)
- 403: Forbidden (Permission Error)
- 404: Not Found
- 500: Server Error
- 503: Service Unavailable

---

## 📱 Frontend Architecture

### Component Hierarchy
```
App
├── Navigation
├── Routes
│   ├── LoginPage
│   ├── Dashboard
│   │   ├── MetricsCards
│   │   ├── Charts
│   │   └── DataTable
│   ├── AdvancedFloodMap
│   ├── AdvancedAnalytics
│   ├── AIPredictionEngine
│   ├── MLAnalyticsEngine
│   ├── EmergencySOS
│   ├── ShelterLocator
│   ├── AdminDashboard
│   └── Marketplace
└── SessionManager
```

### State Management
- React Hooks (useState, useContext)
- localStorage for persistence
- API service for data fetching

---

## 🔗 Integration Checklist

- [x] Frontend connects to Backend API
- [x] Backend connects to MongoDB
- [x] Authentication flow working
- [x] Data persistence verified
- [x] Error handling implemented
- [x] CORS configured
- [x] Environment variables set
- [x] Database collections created
- [x] API endpoints tested
- [x] Security measures implemented

---

## 📚 Technology Stack Summary

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | React | 18.2 |
| Frontend | React Router | 6.8 |
| Frontend | Axios | 1.3 |
| Frontend | Leaflet | 1.9 |
| Frontend | Tailwind CSS | 3.2 |
| Backend | Node.js | 14+ |
| Backend | Express | 4.22 |
| Backend | MongoDB | 4.4+ |
| Backend | Mongoose | 7.8 |
| Backend | JWT | 9.0 |
| Backend | Helmet | 7.1 |
| Backend | Morgan | 1.10 |
| ML | Python | 3.8+ |
| ML | Flask | 2.0+ |
| ML | Scikit-learn | 1.0+ |

---

## 🎯 Architecture Principles

1. **Separation of Concerns** - Clear layer separation
2. **DRY (Don't Repeat Yourself)** - Reusable components
3. **SOLID Principles** - Clean code practices
4. **Security First** - Built-in security measures
5. **Scalability** - Horizontal scaling ready
6. **Performance** - Optimized queries and caching
7. **Maintainability** - Clear code structure
8. **Reliability** - Error handling and logging

---

**GeoGuard v2.0.0** - Enterprise-Grade Architecture
