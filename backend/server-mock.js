const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Mock data
const mockData = {
  zones: [
    { _id: '1', name: 'Velachery', lat: 12.9750, lng: 80.2207, area: 'Central', riskScore: 82, riskLevel: 'Critical', rainfall: 85, waterLevel: 92, elevation: 5 },
    { _id: '2', name: 'Adyar', lat: 13.0089, lng: 80.2707, area: 'Central', riskScore: 65, riskLevel: 'High', rainfall: 65, waterLevel: 72, elevation: 8 },
    { _id: '3', name: 'Anna Nagar', lat: 13.0827, lng: 80.2108, area: 'North', riskScore: 20, riskLevel: 'Low', rainfall: 15, waterLevel: 25, elevation: 12 },
    { _id: '4', name: 'Mylapore', lat: 13.0329, lng: 80.2588, area: 'South', riskScore: 45, riskLevel: 'Moderate', rainfall: 45, waterLevel: 48, elevation: 10 },
    { _id: '5', name: 'Besant Nagar', lat: 13.0047, lng: 80.2707, area: 'South', riskScore: 55, riskLevel: 'High', rainfall: 55, waterLevel: 58, elevation: 7 }
  ],
  shelters: [
    { _id: '1', name: 'Velachery Relief Center', location: { lat: 12.9750, lng: 80.2207 }, address: 'Velachery, Chennai', capacity: 500, occupancy: 150, contact: '044-2445-1234', amenities: ['Food', 'Water', 'Medical', 'Bedding'] },
    { _id: '2', name: 'Adyar Community Complex', location: { lat: 13.0089, lng: 80.2707 }, address: 'Adyar, Chennai', capacity: 800, occupancy: 320, contact: '044-2445-5678', amenities: ['Food', 'Water', 'Medical', 'Bedding', 'WiFi'] },
    { _id: '3', name: 'Anna Nagar School', location: { lat: 13.0827, lng: 80.2108 }, address: 'Anna Nagar, Chennai', capacity: 300, occupancy: 45, contact: '044-2445-9012', amenities: ['Food', 'Water', 'Bedding'] },
    { _id: '4', name: 'Mylapore Temple Hall', location: { lat: 13.0329, lng: 80.2588 }, address: 'Mylapore, Chennai', capacity: 400, occupancy: 120, contact: '044-2445-3456', amenities: ['Food', 'Water', 'Medical'] },
    { _id: '5', name: 'Besant Nagar Sports Complex', location: { lat: 13.0047, lng: 80.2707 }, address: 'Besant Nagar, Chennai', capacity: 600, occupancy: 200, contact: '044-2445-7890', amenities: ['Food', 'Water', 'Medical', 'Bedding', 'WiFi'] }
  ],
  rescueTeams: [
    { _id: '1', name: 'Alpha Rescue Team', members: 12, status: 'available', location: { lat: 12.9750, lng: 80.2207 }, assignedZone: 'Velachery', equipment: ['Boat', 'Rope', 'First Aid', 'Radio'], contact: '9876543210' },
    { _id: '2', name: 'Beta Rescue Team', members: 10, status: 'deployed', location: { lat: 13.0089, lng: 80.2707 }, assignedZone: 'Adyar', equipment: ['Boat', 'Rope', 'First Aid', 'Radio', 'Stretcher'], contact: '9876543211' },
    { _id: '3', name: 'Gamma Rescue Team', members: 8, status: 'available', location: { lat: 13.0827, lng: 80.2108 }, assignedZone: 'Anna Nagar', equipment: ['Rope', 'First Aid', 'Radio'], contact: '9876543212' },
    { _id: '4', name: 'Delta Rescue Team', members: 15, status: 'busy', location: { lat: 13.0329, lng: 80.2588 }, assignedZone: 'Mylapore', equipment: ['Boat', 'Rope', 'First Aid', 'Radio', 'Stretcher', 'Oxygen'], contact: '9876543213' }
  ],
  sosAlerts: [],
  userReports: [],
  disasterAlerts: []
};

// API Endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'GeoGuard Backend Running (Mock Mode)', database: 'Mock Data', timestamp: new Date().toISOString() });
});

app.get('/api/flood-predictions', (req, res) => {
  res.json(mockData.zones);
});

app.get('/api/flood-predictions/:zone', (req, res) => {
  const zone = mockData.zones.find(z => z.name === req.params.zone);
  res.json(zone || mockData.zones[0]);
});

app.get('/api/shelters', (req, res) => {
  res.json(mockData.shelters);
});

app.get('/api/shelters/nearby', (req, res) => {
  res.json(mockData.shelters);
});

app.get('/api/rescue-teams', (req, res) => {
  res.json(mockData.rescueTeams);
});

app.get('/api/zones', (req, res) => {
  res.json(mockData.zones);
});

app.post('/api/sos-alert', (req, res) => {
  const alert = { _id: Date.now().toString(), ...req.body, status: 'active', createdAt: new Date() };
  mockData.sosAlerts.push(alert);
  res.json({ success: true, alertId: alert._id });
});

app.get('/api/sos-alerts', (req, res) => {
  res.json(mockData.sosAlerts.filter(a => a.status === 'active'));
});

app.post('/api/user-report', (req, res) => {
  const report = { _id: Date.now().toString(), ...req.body, timestamp: new Date() };
  mockData.userReports.push(report);
  res.json({ success: true, reportId: report._id });
});

app.get('/api/user-reports', (req, res) => {
  res.json(mockData.userReports);
});

app.get('/api/command-center-data', (req, res) => {
  res.json({
    timestamp: new Date().toISOString(),
    sos_alerts: mockData.sosAlerts.filter(a => a.status === 'active').length,
    active_rescue_teams: mockData.rescueTeams.filter(t => t.status === 'available').length,
    shelter_occupancy_percent: 35,
    high_risk_zones: mockData.zones.filter(z => z.riskScore > 55).length,
    total_zones: mockData.zones.length,
    heatmap: mockData.zones.map(z => ({
      zone: z.name,
      lat: z.lat,
      lng: z.lng,
      risk_score: z.riskScore,
      risk_level: z.riskLevel,
      color: z.riskScore < 30 ? '#10b981' : z.riskScore < 55 ? '#f59e0b' : z.riskScore < 75 ? '#f97316' : '#ef4444'
    })),
    critical_zones: mockData.zones.filter(z => z.riskScore > 75)
  });
});

app.get('/api/emergency-contacts/:zone', (req, res) => {
  res.json({
    zone: req.params.zone,
    area: 'Central',
    emergency_services: {
      police: [{ name: 'Police Station', phone: '100', address: 'Central' }],
      ambulance: [{ name: 'Ambulance', phone: '108', address: 'Central' }],
      hospitals: [{ name: 'Hospital', phone: '044-1234', beds: 500, occupiedBeds: 250 }],
      rescue_teams: mockData.rescueTeams.slice(0, 2)
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('\n✅ GeoGuard Backend Running (Mock Mode)');
  console.log(`📍 Server: http://localhost:${PORT}`);
  console.log('📊 Using Mock Data (Not Connected to MongoDB)\n');
});
