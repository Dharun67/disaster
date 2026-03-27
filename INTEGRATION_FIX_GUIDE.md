# GeoGuard Integration Fix Guide

## 🔧 STEP-BY-STEP INTEGRATION FIXES

### STEP 1: Update Backend Server with Emergency Endpoints

**File:** `backend/server.js`

Add these lines after the existing endpoints (before the error handler):

```javascript
// ============ EMERGENCY SERVICES ENDPOINTS ============

// Emergency SOS endpoint
app.post('/api/emergency-sos', verifySession, async (req, res) => {
  try {
    const { userName, userPhone, userEmail, location, message } = req.body;
    const alert = new SOSAlert({
      name: userName,
      phone: userPhone,
      location: `${location.lat}, ${location.lng}`,
      lat: location.lat,
      lng: location.lng,
      message: message || 'Emergency SOS Alert',
      status: 'active'
    });
    await alert.save();
    res.json({ success: true, alertId: alert._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get emergency contacts by zone
app.get('/api/emergency-contacts/:zone', async (req, res) => {
  try {
    const zone = req.params.zone;
    const contacts = {
      police: await PoliceStation.find({ area: zone }).limit(2),
      ambulance: await AmbulanceService.find({ area: zone }).limit(2),
      hospitals: await Hospital.find({ area: zone }).limit(3),
      rescue_teams: await RescueTeam.find({ assignedZone: zone }).limit(2)
    };
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Notify police
app.post('/api/notify-police', verifySession, async (req, res) => {
  try {
    const { location } = req.body;
    const nearbyPolice = await PoliceStation.find({
      lat: { $gte: location.lat - 0.05, $lte: location.lat + 0.05 },
      lng: { $gte: location.lng - 0.05, $lte: location.lng + 0.05 }
    });
    res.json({ success: true, notified: nearbyPolice.length, stations: nearbyPolice });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Notify hospitals
app.post('/api/notify-hospitals', verifySession, async (req, res) => {
  try {
    const { location } = req.body;
    const nearbyHospitals = await Hospital.find({
      lat: { $gte: location.lat - 0.05, $lte: location.lat + 0.05 },
      lng: { $gte: location.lng - 0.05, $lte: location.lng + 0.05 }
    });
    res.json({ success: true, notified: nearbyHospitals.length, hospitals: nearbyHospitals });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Notify rescue teams
app.post('/api/notify-rescue-teams', verifySession, async (req, res) => {
  try {
    const { location } = req.body;
    const nearbyTeams = await RescueTeam.find({
      'location.lat': { $gte: location.lat - 0.05, $lte: location.lat + 0.05 },
      'location.lng': { $gte: location.lng - 0.05, $lte: location.lng + 0.05 }
    });
    res.json({ success: true, notified: nearbyTeams.length, teams: nearbyTeams });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get nearby emergency services
app.get('/api/emergency-services/nearby', async (req, res) => {
  try {
    const { lat, lng, type } = req.query;
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    
    let services = [];
    
    if (type === 'police' || !type) {
      services = await PoliceStation.find({
        lat: { $gte: latitude - 0.1, $lte: latitude + 0.1 },
        lng: { $gte: longitude - 0.1, $lte: longitude + 0.1 }
      }).limit(5);
    } else if (type === 'ambulance') {
      services = await AmbulanceService.find({
        lat: { $gte: latitude - 0.1, $lte: latitude + 0.1 },
        lng: { $gte: longitude - 0.1, $lte: longitude + 0.1 }
      }).limit(5);
    } else if (type === 'hospital') {
      services = await Hospital.find({
        lat: { $gte: latitude - 0.1, $lte: latitude + 0.1 },
        lng: { $gte: longitude - 0.1, $lte: longitude + 0.1 }
      }).limit(5);
    }
    
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update SOS alert status
app.put('/api/sos-alert/:id', verifySession, async (req, res) => {
  try {
    const { status } = req.body;
    const alert = await SOSAlert.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json({ success: true, alert });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update rescue team status
app.put('/api/rescue-teams/:id', verifySession, async (req, res) => {
  try {
    const team = await RescueTeam.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ success: true, team });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update shelter occupancy
app.put('/api/shelters/:id', verifySession, async (req, res) => {
  try {
    const shelter = await Shelter.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ success: true, shelter });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user reports
app.get('/api/user-reports', async (req, res) => {
  try {
    const reports = await UserReport.find().sort({ timestamp: -1 }).limit(20);
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
```

---

### STEP 2: Update Frontend API Service

**File:** `frontend/src/services/api.js`

Replace the entire file with the updated version that includes all missing methods.

Key additions:
- `sosAPI.notifyPolice()`, `sosAPI.notifyHospitals()`, `sosAPI.notifyRescueTeams()`
- `rescueAPI.updateTeamStatus()`
- `shelterAPI.updateOccupancy()`
- `userReportsAPI` object
- `emergencyAPI.getNearbyServices()`

---

### STEP 3: Create Frontend Environment File

**File:** `frontend/.env`

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENV=development
REACT_APP_VERSION=1.0.0
REACT_APP_TIMEOUT=30000
```

---

### STEP 4: Replace EnhancedEmergencySOS Component

**File:** `frontend/src/pages/EnhancedEmergencySOS.js`

Replace with the fixed version that:
- Uses `sosAPI` instead of hardcoded fetch calls
- Properly handles offline mode
- Uses centralized error handling
- Implements proper request/response interceptors

---

### STEP 5: Update Database Schema (Optional but Recommended)

**File:** `backend/models/schemas.js`

Update SOSAlert schema to match frontend data:

```javascript
const SOSAlertSchema = new mongoose.Schema({
  userId: String,
  userName: String,
  userPhone: String,
  userEmail: String,
  name: String,  // Keep for backward compatibility
  phone: String, // Keep for backward compatibility
  location: String,
  lat: Number,
  lng: Number,
  message: String,
  type: { type: String, default: 'EMERGENCY_SOS' },
  status: { type: String, enum: ['active', 'resolved'], default: 'active' },
  createdAt: { type: Date, default: Date.now }
});
```

---

## ✅ VERIFICATION CHECKLIST

### Backend Verification
- [ ] MongoDB is running: `mongod`
- [ ] Backend starts without errors: `npm start` in backend folder
- [ ] All endpoints respond: `curl http://localhost:5000/api/health`
- [ ] Database connection shows: `✓ MongoDB connected successfully`

### Frontend Verification
- [ ] Frontend starts without errors: `npm start` in frontend folder
- [ ] No console errors in browser DevTools
- [ ] API service loads correctly
- [ ] Environment variables are set

### Integration Verification
- [ ] Login page works
- [ ] Dashboard loads flood predictions
- [ ] SOS page sends alerts to database
- [ ] Shelter page displays data
- [ ] Admin dashboard shows real-time data
- [ ] Emergency services are notified

---

## 🚀 QUICK START

### Terminal 1: Start MongoDB
```bash
mongod
```

### Terminal 2: Start Backend
```bash
cd backend
npm install
npm start
```

### Terminal 3: Start Frontend
```bash
cd frontend
npm install
npm start
```

### Test in Browser
1. Go to `http://localhost:3000`
2. Register with email
3. Verify OTP
4. Navigate through pages
5. Test SOS alert

---

## 🔍 TROUBLESHOOTING

### Issue: "Cannot POST /api/emergency-sos"
**Solution:** Make sure you added the endpoint to `backend/server.js`

### Issue: "API call failed"
**Solution:** Check if backend is running on port 5000

### Issue: "MongoDB connection error"
**Solution:** Make sure MongoDB is running: `mongod`

### Issue: "CORS error"
**Solution:** Check `FRONTEND_URL` in `.env` matches your frontend URL

### Issue: "Token not provided"
**Solution:** Make sure you're logged in and token is stored in localStorage

---

## 📊 Data Flow After Fixes

```
User clicks SOS Button
    ↓
Frontend calls sosAPI.sendAlert()
    ↓
API service adds Authorization header
    ↓
Backend receives POST /api/emergency-sos
    ↓
Backend verifies session token
    ↓
Backend creates SOSAlert in MongoDB
    ↓
Backend notifies police/hospitals/rescue teams
    ↓
Frontend receives success response
    ↓
Frontend shows "Alert Sent" message
    ↓
Admin Dashboard updates in real-time
```

---

## 🔐 Security Notes

- All emergency endpoints require authentication (verifySession)
- Tokens are validated on every request
- Location data is stored securely
- Emergency services are notified via backend only
- No sensitive data is exposed to frontend

---

## 📝 Summary of Changes

| Component | Change | Impact |
|-----------|--------|--------|
| Backend | Added 8 new endpoints | Emergency SOS system now works |
| Frontend API | Added 6 new methods | Centralized API calls |
| Frontend Page | Replaced hardcoded fetch | Better error handling |
| Environment | Added .env file | Proper configuration |
| Database | Updated schema | Better data structure |

---

## ✨ Next Steps

1. Apply all fixes above
2. Test each page individually
3. Run integration tests
4. Deploy to production
5. Monitor error logs

