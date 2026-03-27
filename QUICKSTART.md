# GeoGuard - Quick Start Verification

## Step 1: Start MongoDB
```bash
mongod
```

## Step 2: Initialize Database
```bash
mongo < sample-data.js
```

## Step 3: Start Backend
```bash
cd backend
npm install
npm start
```
Expected: Server running on port 5000

## Step 4: Start AI Service
```bash
cd ai-service
pip install -r requirements.txt
python predictor.py
```
Expected: Flask running on port 5001

## Step 5: Start Frontend
```bash
cd frontend
npm install
npm start
```
Expected: React running on port 3000

## Step 6: Verify All Services

### Test Backend
```bash
curl http://localhost:5000/api/health
# Expected: {"status":"GeoGuard Backend Running"}

curl http://localhost:5000/api/flood-predictions
# Expected: Array of flood predictions from MongoDB
```

### Test AI Service
```bash
curl http://localhost:5001/api/health
# Expected: {"status":"AI Service Running"}
```

### Test Frontend
Open http://localhost:3000 in browser

## Step 7: Test Key Features

### Create SOS Alert
```bash
curl -X POST http://localhost:5000/api/sos-alert \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Test User",
    "phone":"9876543210",
    "location":"Velachery",
    "message":"Test alert",
    "lat":12.9698,
    "lng":80.2405
  }'
```

### Get Command Center Data
```bash
curl http://localhost:5000/api/command-center-data
```

### Predict Flood
```bash
curl -X POST http://localhost:5001/api/predict-flood \
  -H "Content-Type: application/json" \
  -d '{
    "zone":"Velachery",
    "rainfall":50,
    "water_level":50,
    "elevation":5
  }'
```

## Troubleshooting

### MongoDB Connection Failed
- Ensure MongoDB is running: `mongod`
- Check connection string in backend/.env
- Verify port 27017 is accessible

### Backend Port 5000 Already in Use
```bash
# Find and kill process
lsof -i :5000
kill -9 <PID>
```

### Frontend Not Loading
- Clear browser cache
- Check console for errors
- Verify backend is running

### AI Service Not Responding
- Check Python installation
- Verify all dependencies installed
- Check port 5001 is free

## Database Verification

### Check Collections
```bash
mongo
use geoguard
show collections
db.flood_predictions.count()
db.sos_alerts.count()
db.shelters.count()
db.rescue_teams.count()
```

### View Sample Data
```bash
db.flood_predictions.find().pretty()
db.shelters.find().pretty()
db.rescue_teams.find().pretty()
```

## Access Points

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- AI Service: http://localhost:5001/api
- MongoDB: localhost:27017

## Features to Test

1. **Dashboard** - View live flood risk map
2. **SOS Panel** - Create emergency alert
3. **Shelter Locator** - Find nearby shelters
4. **Command Center** - View authority dashboard
5. **Digital Twin** - See 3D city flood model
6. **Flood Simulation** - Predict future flooding
7. **Flood Detection** - AI satellite detection

## Success Indicators

✅ All services running without errors
✅ MongoDB collections populated
✅ APIs responding with data
✅ Frontend loads without errors
✅ Map displays with zones
✅ SOS alerts can be created
✅ Command center shows real data
✅ 3D model renders correctly

## Next Steps

1. Deploy to production
2. Configure SSL/HTTPS
3. Set up monitoring
4. Enable authentication
5. Configure backups
6. Set up CI/CD

## Support

For issues:
1. Check logs in each service
2. Verify all ports are accessible
3. Ensure MongoDB is running
4. Check environment variables
5. Review API documentation
