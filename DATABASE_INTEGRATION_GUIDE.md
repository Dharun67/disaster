# GeoGuard - Database Integration & API Guide

## Architecture Overview

```
Frontend (React)
    ↓
API Service (axios)
    ↓
Backend (Express + MongoDB)
    ↓
MongoDB Database
    ↑
AI Service (Python Flask)
```

## Data Flow

### 1. Flood Prediction Flow
```
Frontend Dashboard
  ↓
GET /api/flood-predictions
  ↓
Backend queries MongoDB
  ↓
Returns predictions with risk scores
  ↓
Frontend displays on map with colors
```

### 2. SOS Alert Flow
```
User clicks Emergency SOS
  ↓
POST /api/sos-alert (name, phone, location, lat, lng)
  ↓
Backend saves to MongoDB
  ↓
Admin sees in Command Center
  ↓
Rescue team assigned
  ↓
PUT /api/sos-alert/:id (status: resolved)
```

### 3. AI Prediction Flow
```
Frontend sends parameters
  ↓
POST /api/predict-flood (zone, rainfall, water_level, elevation)
  ↓
AI Service calculates risk
  ↓
Saves to MongoDB
  ↓
Returns prediction
  ↓
Frontend displays result
```

## Database Collections

### flood_predictions
```javascript
{
  _id: ObjectId,
  zone: String,
  riskScore: Number (0-100),
  riskLevel: String (Low/Moderate/High/Critical),
  rainfall: Number,
  waterLevel: Number,
  elevation: Number,
  location: { lat: Number, lng: Number },
  timestamp: Date
}
```

### sos_alerts
```javascript
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
```

### shelters
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

### rescue_teams
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

### user_reports
```javascript
{
  _id: ObjectId,
  type: String (flood/blocked_road/water_level/other),
  location: String,
  description: String,
  imageUrl: String,
  lat: Number,
  lng: Number,
  timestamp: Date
}
```

### command_center_data
```javascript
{
  _id: ObjectId,
  timestamp: Date,
  sos_alerts: Number,
  active_rescue_teams: Number,
  shelter_occupancy_percent: Number,
  high_risk_zones: Number,
  total_zones: Number,
  heatmap: Array,
  critical_zones: Array
}
```

## API Endpoints Reference

### Flood Predictions
```
GET /api/flood-predictions
Response: [{ zone, riskScore, riskLevel, ... }]

GET /api/flood-predictions/:zone
Response: { zone, riskScore, riskLevel, ... }

POST /api/flood-predictions
Body: { zone, riskScore, riskLevel, rainfall, waterLevel, elevation }
Response: { success: true, id: ObjectId }
```

### SOS Alerts
```
POST /api/sos-alert
Body: { name, phone, location, message, lat, lng }
Response: { success: true, alertId: ObjectId }

GET /api/sos-alerts
Response: [{ _id, name, phone, location, status, ... }]

PUT /api/sos-alert/:id
Body: { status: 'resolved' }
Response: { _id, status: 'resolved', ... }
```

### Shelters
```
GET /api/shelters
Response: [{ _id, name, location, capacity, occupancy, ... }]

GET /api/shelters/nearby?lat=X&lng=Y
Response: [{ _id, name, distance, ... }] (sorted by distance)

PUT /api/shelters/:id
Body: { occupancy, capacity }
Response: { _id, occupancy, capacity, ... }
```

### Rescue Teams
```
GET /api/rescue-teams
Response: [{ _id, name, status, location, assignedZone, ... }]

PUT /api/rescue-teams/:id
Body: { status, location, assignedZone }
Response: { _id, status, location, ... }
```

### Command Center
```
GET /api/command-center-data
Response: {
  timestamp,
  sos_alerts,
  active_rescue_teams,
  shelter_occupancy_percent,
  high_risk_zones,
  total_zones,
  heatmap: [{ zone, lat, lng, risk_score, color }],
  critical_zones: [{ zone, risk_score, risk_level }]
}
```

## Frontend Integration Examples

### Fetch Flood Predictions
```javascript
import { getFloodPredictions } from '../services/api';

const [predictions, setPredictions] = useState([]);

useEffect(() => {
  getFloodPredictions()
    .then(res => setPredictions(res.data))
    .catch(err => console.error(err));
}, []);
```

### Create SOS Alert
```javascript
import { createSOSAlert } from '../services/api';

const handleSOS = async () => {
  const data = {
    name: 'John Doe',
    phone: '9876543210',
    location: 'Velachery',
    message: 'Need help',
    lat: 12.9698,
    lng: 80.2405
  };
  
  try {
    const response = await createSOSAlert(data);
    console.log('Alert created:', response.data);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Get Command Center Data
```javascript
import { getCommandCenterData } from '../services/api';

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await getCommandCenterData();
      setData(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  fetchData();
  const interval = setInterval(fetchData, 5000); // Refresh every 5 seconds
  return () => clearInterval(interval);
}, []);
```

## Real-time Updates

### WebSocket Integration (Optional)
```javascript
const socket = io('http://localhost:5000');

socket.on('sos-alert', (alert) => {
  console.log('New SOS Alert:', alert);
  // Update UI
});

socket.on('flood-update', (prediction) => {
  console.log('Flood Update:', prediction);
  // Update map
});
```

## Error Handling

### Common Errors
```javascript
try {
  const response = await getFloodPredictions();
} catch (error) {
  if (error.response?.status === 404) {
    console.log('Data not found');
  } else if (error.response?.status === 500) {
    console.log('Server error');
  } else if (error.message === 'Network Error') {
    console.log('Backend not running');
  }
}
```

## Performance Tips

1. **Pagination**: Limit results for large datasets
```javascript
GET /api/flood-predictions?limit=10&skip=0
```

2. **Caching**: Cache predictions for 5 minutes
```javascript
const cache = new Map();
const getCachedPredictions = async () => {
  if (cache.has('predictions')) {
    return cache.get('predictions');
  }
  const data = await getFloodPredictions();
  cache.set('predictions', data);
  setTimeout(() => cache.delete('predictions'), 5 * 60 * 1000);
  return data;
};
```

3. **Lazy Loading**: Load data on demand
```javascript
const [predictions, setPredictions] = useState([]);
const [loading, setLoading] = useState(false);

const loadMore = async () => {
  setLoading(true);
  const data = await getFloodPredictions();
  setPredictions([...predictions, ...data]);
  setLoading(false);
};
```

## Testing APIs

### Using cURL
```bash
# Get all predictions
curl http://localhost:5000/api/flood-predictions

# Create SOS alert
curl -X POST http://localhost:5000/api/sos-alert \
  -H "Content-Type: application/json" \
  -d '{"name":"John","phone":"9876543210","location":"Velachery","message":"Help","lat":12.9698,"lng":80.2405}'

# Get command center data
curl http://localhost:5000/api/command-center-data
```

### Using Postman
1. Import collection from `postman-collection.json`
2. Set environment variables
3. Run requests

## Deployment Checklist

- [ ] MongoDB running and accessible
- [ ] Backend server started
- [ ] AI service running
- [ ] Frontend built and served
- [ ] All APIs responding
- [ ] Database collections created
- [ ] Sample data loaded
- [ ] CORS enabled
- [ ] Environment variables set
- [ ] Error logging configured

## Support & Debugging

### Check Backend Logs
```bash
tail -f backend/logs.txt
```

### Check MongoDB Connection
```bash
mongo
use geoguard
db.flood_predictions.find().limit(1)
```

### Test API Health
```bash
curl http://localhost:5000/api/health
curl http://localhost:5001/api/health
```

## Next Steps

1. Deploy to production
2. Set up monitoring
3. Configure backups
4. Enable authentication
5. Add rate limiting
6. Implement caching
7. Set up CI/CD pipeline
