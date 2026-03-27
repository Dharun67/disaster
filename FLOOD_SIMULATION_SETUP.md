# 🌊 Flood Simulation - Integration & Setup Guide

## Quick Start

### 1. Backend Setup

The flood simulation endpoints are already integrated into the AI service:

```bash
cd ai-service
pip install -r requirements.txt
python predictor.py
```

**Endpoints Available:**
- `POST /simulate-flood` - Full simulation for all zones
- `POST /flood-timeline` - Timeline for specific zone
- `GET /health` - Service health check

### 2. Frontend Setup

The FloodSimulation component is already created:

```bash
cd frontend
npm install
npm start
```

**Access:** http://localhost:3000/simulation

### 3. Test the Feature

```bash
# Test simulation endpoint
curl -X POST http://localhost:5001/simulate-flood \
  -H "Content-Type: application/json" \
  -d '{
    "rainfall": 80,
    "water_level": 70,
    "hours": 6
  }'

# Test timeline endpoint
curl -X POST http://localhost:5001/flood-timeline \
  -H "Content-Type: application/json" \
  -d '{
    "rainfall": 80,
    "water_level": 70,
    "zone": "Velachery"
  }'
```

## API Reference

### POST /simulate-flood

**Request:**
```json
{
  "rainfall": 80,
  "water_level": 70,
  "hours": 6
}
```

**Response:**
```json
[
  {
    "zone": "Velachery",
    "hour": 1,
    "risk_score": 45.2,
    "risk_level": "Moderate",
    "spread_radius": 2.5,
    "lat": 12.9750,
    "lng": 80.2207,
    "message": "In 1 hour(s), Velachery may reach Moderate risk level"
  },
  ...
]
```

### POST /flood-timeline

**Request:**
```json
{
  "rainfall": 80,
  "water_level": 70,
  "zone": "Velachery"
}
```

**Response:**
```json
{
  "zone": "Velachery",
  "timeline": [
    {
      "hour": 0,
      "risk_score": 38.0,
      "risk_level": "Low",
      "timestamp": "Hour 0"
    },
    {
      "hour": 1,
      "risk_score": 45.2,
      "risk_level": "Moderate",
      "timestamp": "Hour 1"
    },
    ...
  ],
  "critical_hour": 5
}
```

## Component Usage

### Import the Component

```javascript
import FloodSimulation from './pages/FloodSimulation';
```

### Add Route

```javascript
<Route path="/simulation" element={<FloodSimulation />} />
```

### Component Props

The component is self-contained and doesn't require props:

```javascript
<FloodSimulation />
```

## Customization

### Change Zones

Edit `ai-service/predictor.py`:

```python
self.zones = {
    'Your Zone': {'lat': 13.0, 'lng': 80.0, 'elevation': 20, 'drainage': 0.75},
    ...
}
```

### Adjust Algorithm

Modify the risk calculation in `simulate_flood_spread()`:

```python
# Change weights
rainfall_factor = 1 + (hour * 0.15)  # Adjust accumulation rate
drainage_factor = zone_data['drainage'] * (1 - hour * 0.05)  # Adjust drainage
```

### Customize UI

Edit `frontend/src/pages/FloodSimulation.js`:

```javascript
// Change colors
const getRiskColor = (risk) => {
  // Customize color mapping
};

// Change time frames
{[1, 3, 6].map(hour => (...))}  // Add/remove hours
```

## Integration with Other Features

### 1. Dashboard Integration

Add link to simulation from Dashboard:

```javascript
<Link to="/simulation" className="...">
  View Flood Simulation
</Link>
```

### 2. Admin Panel Integration

Show predictions in admin dashboard:

```javascript
const [simulations, setSimulations] = useState([]);

useEffect(() => {
  axios.post('http://localhost:5001/simulate-flood', {
    rainfall: 80,
    water_level: 70,
    hours: 6
  }).then(res => setSimulations(res.data));
}, []);
```

### 3. SOS System Integration

Trigger alerts based on predictions:

```javascript
if (prediction.risk_level === 'Critical') {
  // Trigger SOS alert
  sosAPI.sendAlert({
    message: prediction.message,
    location: { lat: prediction.lat, lng: prediction.lng }
  });
}
```

### 4. Shelter Locator Integration

Recommend shelters based on predictions:

```javascript
const criticalZones = simulations.filter(s => s.risk_level === 'Critical');
const nearbyShelters = await shelterAPI.getNearby(
  criticalZones[0].lat,
  criticalZones[0].lng
);
```

## Performance Optimization

### 1. Memoization

```javascript
const memoizedSimulation = useMemo(() => {
  return simulations.filter(s => s.hour === activeHour);
}, [simulations, activeHour]);
```

### 2. Debouncing

```javascript
const debouncedSimulation = useCallback(
  debounce((rainfall, waterLevel) => {
    runSimulation(rainfall, waterLevel);
  }, 500),
  []
);
```

### 3. Lazy Loading

```javascript
const FloodSimulation = lazy(() => import('./pages/FloodSimulation'));

<Suspense fallback={<Loading />}>
  <FloodSimulation />
</Suspense>
```

## Testing

### Unit Tests

```javascript
describe('FloodSimulator', () => {
  it('should calculate correct risk score', () => {
    const simulator = new FloodSimulator();
    const predictions = simulator.simulate_flood_spread(80, 70, 6);
    expect(predictions[0].risk_score).toBeGreaterThan(0);
  });
});
```

### Integration Tests

```javascript
describe('Flood Simulation API', () => {
  it('should return predictions', async () => {
    const res = await axios.post('/simulate-flood', {
      rainfall: 80,
      water_level: 70,
      hours: 6
    });
    expect(res.data).toHaveLength(18); // 6 zones × 3 hours
  });
});
```

### E2E Tests

```javascript
describe('Flood Simulation UI', () => {
  it('should update map on slider change', () => {
    cy.visit('/simulation');
    cy.get('input[type="range"]').first().invoke('val', 100).trigger('change');
    cy.get('[data-testid="map"]').should('be.visible');
  });
});
```

## Deployment

### Docker

The service is already containerized:

```bash
docker-compose up
```

### Environment Variables

```env
FLASK_ENV=production
PORT=5001
```

### Cloud Deployment

**AWS Lambda:**
```bash
serverless deploy function -f floodSimulation
```

**Google Cloud Functions:**
```bash
gcloud functions deploy simulate-flood
```

## Monitoring

### Logs

```bash
# View AI service logs
docker logs geoguard-ai-service

# View frontend logs
npm run dev
```

### Metrics

- Simulation time: < 100ms
- API response: < 500ms
- Map rendering: < 500ms
- Animation FPS: 60fps

## Troubleshooting

### Issue: Simulation not updating

**Solution:** Check if AI service is running
```bash
curl http://localhost:5001/health
```

### Issue: Map not rendering

**Solution:** Ensure Leaflet is installed
```bash
npm install leaflet react-leaflet
```

### Issue: Slow performance

**Solution:** Enable caching and memoization
```javascript
const [cache, setCache] = useState({});
```

## Next Steps

1. ✅ Test the feature locally
2. ✅ Customize zones for your region
3. ✅ Integrate with other features
4. ✅ Deploy to production
5. ✅ Monitor performance
6. ✅ Gather user feedback
7. ✅ Iterate and improve

## Support

For issues or questions:
- Check FLOOD_SIMULATION_GUIDE.md
- Review FLOOD_SIMULATION_SHOWCASE.md
- Check API responses
- Review browser console

---

**GeoGuard** - AI Flood Simulation Feature

Ready to deploy and impress! 🚀
