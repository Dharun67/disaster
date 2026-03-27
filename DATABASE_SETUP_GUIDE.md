# GeoGuard - Database Setup Guide

## 🗄️ MongoDB Database Connection

### Step 1: Install MongoDB

**Windows:**
```bash
choco install mongodb-community
```

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
```

**Linux:**
```bash
sudo apt-get install -y mongodb
```

### Step 2: Start MongoDB

**Windows:**
```bash
mongod
```

**macOS/Linux:**
```bash
brew services start mongodb-community
# or
mongod
```

### Step 3: Verify Connection

```bash
mongo
# Should show: MongoDB shell version
```

---

## 📊 Database Collections

### 1. **zones** (20 documents)
- All Chennai zones with risk data
- Fields: name, area, lat, lng, rainfall, waterLevel, elevation, riskScore, riskLevel

### 2. **policeStations** (5 documents)
- Police stations across 5 areas
- Fields: name, area, lat, lng, phone, address

### 3. **ambulanceServices** (5 documents)
- Ambulance services across 5 areas
- Fields: name, area, lat, lng, phone, status

### 4. **hospitals** (8 documents)
- Major hospitals across Chennai
- Fields: name, area, lat, lng, phone, beds, occupiedBeds, address

### 5. **rescueTeams** (5 documents)
- Rescue teams across 5 areas
- Fields: name, area, assignedZone, lat, lng, members, status, equipment, phone

### 6. **shelters** (4 documents)
- Relief centers
- Fields: name, location, address, capacity, occupancy, contact, amenities

### 7. **floodPredictions** (6+ documents)
- Zone-wise flood predictions
- Fields: zone, riskScore, riskLevel, rainfall, waterLevel, elevation, location, timestamp

### 8. **sosAlerts** (dynamic)
- Emergency SOS alerts
- Fields: name, phone, location, message, lat, lng, status, createdAt

### 9. **userReports** (dynamic)
- Crowdsourced reports
- Fields: type, location, description, imageUrl, lat, lng, timestamp

### 10. **disasterAlerts** (dynamic)
- Disaster alerts
- Fields: alertId, zone, area, disasterType, severity, lat, lng, status, createdAt

---

## 🚀 Initialize Database

### Option 1: Using MongoDB Shell

```bash
# Start MongoDB
mongod

# In another terminal, initialize database
mongo < init-db.js
```

### Option 2: Using MongoDB Compass

1. Open MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. Create database: `geoguard`
4. Import collections from `init-db.js`

### Option 3: Using Docker

```bash
docker-compose up
# Database initializes automatically
```

---

## 📝 Database Schema

### Zones Collection
```javascript
{
  name: "Velachery",
  area: "Central",
  lat: 12.9750,
  lng: 80.2207,
  rainfall: 75,
  waterLevel: 85,
  elevation: 5,
  riskScore: 82,
  riskLevel: "Critical",
  timestamp: ISODate("2024-01-15T10:30:00Z")
}
```

### Police Stations Collection
```javascript
{
  name: "Central Chennai Police",
  area: "Central",
  lat: 13.0418,
  lng: 80.2341,
  phone: "100",
  address: "T Nagar, Chennai"
}
```

### Ambulance Services Collection
```javascript
{
  name: "108 Ambulance - Central",
  area: "Central",
  lat: 13.0418,
  lng: 80.2341,
  phone: "108",
  status: "available"
}
```

### Hospitals Collection
```javascript
{
  name: "Government General Hospital",
  area: "Central",
  lat: 13.0667,
  lng: 80.2667,
  phone: "044-2532-0000",
  beds: 2000,
  occupiedBeds: 800,
  address: "Central Chennai"
}
```

### Rescue Teams Collection
```javascript
{
  name: "NDRF - Central Chennai",
  area: "Central",
  assignedZone: "Central",
  lat: 13.0418,
  lng: 80.2341,
  members: 60,
  status: "available",
  equipment: ["Boat", "Rope", "Life Jacket"],
  phone: "011-2671-0000"
}
```

---

## 🔌 API Endpoints

### Zones
```
GET /api/zones - Get all zones
POST /api/zones - Create zone
```

### Police Stations
```
GET /api/police-stations - Get all stations
GET /api/police-stations/:area - Get by area
POST /api/police-stations - Create station
```

### Ambulance Services
```
GET /api/ambulance-services - Get all services
GET /api/ambulance-services/:area - Get by area
POST /api/ambulance-services - Create service
```

### Hospitals
```
GET /api/hospitals - Get all hospitals
GET /api/hospitals/:area - Get by area
POST /api/hospitals - Create hospital
PUT /api/hospitals/:id - Update hospital
```

### Rescue Teams
```
GET /api/rescue-teams - Get all teams
PUT /api/rescue-teams/:id - Update team
```

### Emergency Contacts
```
GET /api/emergency-contacts/:zone - Get contacts for zone
```

### Disaster Alerts
```
POST /api/disaster-alert - Create alert
GET /api/disaster-alerts - Get active alerts
PUT /api/disaster-alert/:id - Resolve alert
```

---

## 🧪 Test Database Connection

### Test with curl

```bash
# Get all zones
curl http://localhost:5000/api/zones

# Get police stations
curl http://localhost:5000/api/police-stations

# Get hospitals
curl http://localhost:5000/api/hospitals

# Get emergency contacts for zone
curl http://localhost:5000/api/emergency-contacts/Velachery

# Create disaster alert
curl -X POST http://localhost:5000/api/disaster-alert \
  -H "Content-Type: application/json" \
  -d '{
    "zone": "Velachery",
    "area": "Central",
    "disasterType": "flood",
    "severity": "high",
    "lat": 12.9750,
    "lng": 80.2207
  }'
```

### Test with MongoDB Shell

```bash
mongo

# Switch to geoguard database
use geoguard

# Check collections
show collections

# Count documents
db.zones.count()
db.policeStations.count()
db.hospitals.count()

# Find specific zone
db.zones.findOne({ name: "Velachery" })

# Find hospitals in area
db.hospitals.find({ area: "Central" })
```

---

## 📊 Data Statistics

### Zones
- Total: 20
- North: 4
- Central: 7
- South: 4
- East: 3
- West: 2

### Emergency Services
- Police Stations: 5
- Ambulance Services: 5
- Hospitals: 8
- Rescue Teams: 5

### Hospital Capacity
- Total Beds: 10,700
- Total Occupied: 4,000
- Occupancy Rate: 37%

### Rescue Team Strength
- Total Members: 230
- NDRF: 155
- Fire & Rescue: 75

---

## 🔄 Database Backup

### Backup MongoDB

```bash
# Backup database
mongodump --db geoguard --out ./backup

# Restore database
mongorestore --db geoguard ./backup/geoguard
```

---

## 🔒 Security

### Create Admin User

```bash
mongo

use geoguard

db.users.insertOne({
  name: "Admin",
  email: "admin@geoguard.com",
  phone: "9876543210",
  password: "hashed_password",
  role: "admin",
  createdAt: new Date()
})
```

### Enable Authentication

```bash
# Edit mongod.conf
security:
  authorization: enabled

# Restart MongoDB
mongod --config /etc/mongod.conf
```

---

## 🚀 Quick Start

### 1. Start MongoDB
```bash
mongod
```

### 2. Initialize Database
```bash
mongo < init-db.js
```

### 3. Start Backend
```bash
cd backend
npm install
npm start
```

### 4. Test APIs
```bash
curl http://localhost:5000/api/zones
```

---

## 📱 Frontend Integration

### API Service (services/api.js)

```javascript
// Get zones
export const getZones = () => axios.get(`${API_BASE}/zones`);

// Get emergency contacts
export const getEmergencyContacts = (zone) => 
  axios.get(`${API_BASE}/emergency-contacts/${zone}`);

// Create disaster alert
export const createDisasterAlert = (data) => 
  axios.post(`${API_BASE}/disaster-alert`, data);

// Get hospitals
export const getHospitals = () => axios.get(`${API_BASE}/hospitals`);

// Get police stations
export const getPoliceStations = () => 
  axios.get(`${API_BASE}/police-stations`);
```

---

## ✅ Verification Checklist

- [ ] MongoDB installed
- [ ] MongoDB running
- [ ] Database initialized
- [ ] Collections created
- [ ] Data inserted
- [ ] Backend connected
- [ ] APIs responding
- [ ] Frontend loading data
- [ ] Emergency contacts working
- [ ] Disaster alerts functional

---

## 🆘 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017

Solution: Start MongoDB with: mongod
```

### Database Not Found
```
Error: database not found

Solution: Initialize with: mongo < init-db.js
```

### Collection Not Found
```
Error: collection not found

Solution: Check collection name in MongoDB shell
```

### API Not Responding
```
Error: Cannot GET /api/zones

Solution: 
1. Check backend is running
2. Check MongoDB is connected
3. Check port 5000 is free
```

---

## 📞 Support

For database issues:
1. Check MongoDB is running
2. Verify connection string
3. Check collections exist
4. Review API endpoints
5. Check backend logs

---

**GeoGuard Database Setup Complete!** ✅

Status: Ready for production
Collections: 10
Documents: 50+
Emergency Services: 23
Coverage: All of Chennai
