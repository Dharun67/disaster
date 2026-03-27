# GeoGuard - Complete Setup & Verification Guide

## 🚀 Quick Start (3 Steps)

### Step 1: Initialize Database
```bash
cd backend
npm install
node init-db.js
```

### Step 2: Start Backend
```bash
cd backend
npm start
```
Backend will run on: http://localhost:5000

### Step 3: Start Frontend
```bash
cd frontend
npm install
npm start
```
Frontend will run on: http://localhost:3000

---

## ✅ Verification Checklist

### 1. Database Connection
- [ ] MongoDB Atlas connected successfully
- [ ] Check: http://localhost:5000/api/db-status
- [ ] Should show all 11 collections with document counts

### 2. Backend Health
- [ ] Backend running on port 5000
- [ ] Check: http://localhost:5000/api/health
- [ ] Response should show: `{ status: "GeoGuard Backend Running", database: "Connected" }`

### 3. Frontend Pages (All 14 Pages)
- [ ] Landing Page: http://localhost:3000/
- [ ] Live Dashboard: http://localhost:3000/dashboard
- [ ] Emergency SOS: http://localhost:3000/sos
- [ ] Shelter Locator: http://localhost:3000/shelters
- [ ] Admin Dashboard: http://localhost:3000/admin
- [ ] Command Center: http://localhost:3000/command-center-pro
- [ ] Emergency Contacts: http://localhost:3000/emergency-contacts
- [ ] Flood Detection: http://localhost:3000/flood-detection
- [ ] Flood Simulation: http://localhost:3000/flood-simulation
- [ ] Digital Twin: http://localhost:3000/digital-twin
- [ ] Digital Twin Pro: http://localhost:3000/digital-twin-pro
- [ ] Drainage Overflow: http://localhost:3000/drainage-overflow
- [ ] Hyperlocal Dashboard: http://localhost:3000/hyperlocal-dashboard
- [ ] Command Center: http://localhost:3000/command-center

---

## 📊 Database Collections (11 Total)

After running `init-db.js`, you should have:

1. **zones** - 5 zones with risk data
2. **flood_predictions** - 5 flood predictions
3. **shelters** - 5 relief centers
4. **rescue_teams** - 4 rescue teams
5. **police_stations** - 4 police stations
6. **ambulance_services** - 4 ambulance services
7. **hospitals** - 4 hospitals
8. **sos_alerts** - 2 sample SOS alerts
9. **user_reports** - 2 sample user reports
10. **disaster_alerts** - 2 sample disaster alerts
11. **users** - User accounts (empty initially)

---

## 🔌 API Endpoints (30+)

### Flood Predictions
```
GET  /api/flood-predictions          - Get all predictions
GET  /api/flood-predictions/:zone    - Get prediction for specific zone
POST /api/flood-predictions          - Create new prediction
```

### SOS Alerts
```
POST /api/sos-alert                  - Send SOS alert
GET  /api/sos-alerts                 - Get active SOS alerts
PUT  /api/sos-alert/:id              - Resolve SOS alert
```

### User Reports
```
POST /api/user-report                - Create user report
GET  /api/user-reports               - Get all user reports
```

### Shelters
```
GET  /api/shelters                   - Get all shelters
GET  /api/shelters/nearby?lat=X&lng=Y - Get nearby shelters
PUT  /api/shelters/:id               - Update shelter
```

### Rescue Teams
```
GET  /api/rescue-teams               - Get all rescue teams
PUT  /api/rescue-teams/:id           - Update rescue team
```

### Zones
```
GET  /api/zones                      - Get all zones
POST /api/zones                      - Create new zone
```

### Emergency Services
```
GET  /api/police-stations            - Get all police stations
GET  /api/police-stations/:area      - Get police by area
POST /api/police-stations            - Create police station

GET  /api/ambulance-services         - Get all ambulances
GET  /api/ambulance-services/:area   - Get ambulances by area
POST /api/ambulance-services         - Create ambulance service

GET  /api/hospitals                  - Get all hospitals
GET  /api/hospitals/:area            - Get hospitals by area
POST /api/hospitals                  - Create hospital
PUT  /api/hospitals/:id              - Update hospital
```

### Disaster Alerts
```
POST /api/disaster-alert             - Create disaster alert
GET  /api/disaster-alerts            - Get active disaster alerts
PUT  /api/disaster-alert/:id         - Resolve disaster alert
```

### Emergency Contacts
```
GET  /api/emergency-contacts/:zone   - Get emergency contacts for zone
```

### Command Center
```
GET  /api/command-center-data        - Get command center dashboard data
```

### System
```
GET  /api/health                     - Health check
GET  /api/db-status                  - Database status
```

---

## 🎯 Feature Testing

### 1. Live Dashboard
- [ ] Map loads with zones
- [ ] Click zone to see details
- [ ] Risk levels color-coded correctly
- [ ] Stats cards show correct data
- [ ] Refresh button works

### 2. Emergency SOS
- [ ] Form validation works
- [ ] Location capture works
- [ ] Alert sent successfully
- [ ] Success message displays
- [ ] Data saved to database

### 3. Shelter Locator
- [ ] All shelters display on map
- [ ] Capacity bars show correctly
- [ ] Distance calculation works
- [ ] Sort by distance works
- [ ] Sort by capacity works

### 4. Admin Dashboard
- [ ] All tabs load correctly
- [ ] SOS alerts display
- [ ] User reports display
- [ ] Rescue teams display
- [ ] Shelters display
- [ ] Zones display with risk levels

### 5. Command Center
- [ ] Stats cards show correct data
- [ ] Heatmap displays
- [ ] Critical zones highlighted
- [ ] Real-time updates work

---

## 🔧 Troubleshooting

### Backend Won't Start
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000

# Kill process using port 5000
taskkill /PID <PID> /F

# Try starting again
npm start
```

### Frontend Won't Start
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rmdir /s /q node_modules
npm install
npm start
```

### Database Connection Error
```bash
# Verify MongoDB Atlas connection string in .env
# Format: mongodb+srv://username:password@cluster.mongodb.net/database

# Test connection
node -e "const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI).then(() => console.log('Connected')).catch(e => console.log('Error:', e.message))"
```

### API Not Responding
```bash
# Check backend health
curl http://localhost:5000/api/health

# Check database status
curl http://localhost:5000/api/db-status
```

---

## 📱 Browser Compatibility

- ✓ Chrome 90+
- ✓ Firefox 88+
- ✓ Safari 14+
- ✓ Edge 90+

---

## 🔐 Environment Variables

Create `.env` file in backend directory:

```env
MONGODB_URI=mongodb+srv://db_username:dharun@456@cluster0.mxw8xkj.mongodb.net/geoguard?retryWrites=true&w=majority
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
WEATHER_API_KEY=your_weather_api_key_here
NODE_ENV=development
```

---

## 📈 Performance Tips

1. **Database Indexing**: Indexes are created on location fields for faster queries
2. **Caching**: API responses are cached on frontend for 30 seconds
3. **Lazy Loading**: Pages load data on demand
4. **Responsive Design**: Optimized for mobile, tablet, and desktop

---

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel deploy
```

### Backend (Heroku)
```bash
cd backend
heroku create geoguard-backend
git push heroku main
```

### Database (MongoDB Atlas)
- Already configured with cloud connection string

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Verify all environment variables are set correctly
3. Ensure MongoDB Atlas connection is active
4. Check browser console for errors
5. Review backend logs for API errors

---

## ✨ Key Features Implemented

✓ Real-time flood risk prediction
✓ Interactive disaster map
✓ Emergency SOS system
✓ Shelter locator with capacity tracking
✓ Admin command center
✓ Rescue team coordination
✓ Emergency services integration
✓ Crowdsourced reporting
✓ Professional UI/UX
✓ Responsive design
✓ Database integration
✓ API endpoints
✓ Error handling
✓ Data validation

---

**GeoGuard** - Transforming Disaster Alerts into Actionable Intelligence
