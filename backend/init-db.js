const mongoose = require('mongoose');
require('dotenv').config();

const {
  User, FloodPrediction, SOSAlert, UserReport, Shelter, RescueTeam,
  PoliceStation, AmbulanceService, Hospital, DisasterAlert, Zone
} = require('./models/schemas');

async function initializeDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/geoguard', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✓ MongoDB Connected');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      FloodPrediction.deleteMany({}),
      SOSAlert.deleteMany({}),
      UserReport.deleteMany({}),
      Shelter.deleteMany({}),
      RescueTeam.deleteMany({}),
      PoliceStation.deleteMany({}),
      AmbulanceService.deleteMany({}),
      Hospital.deleteMany({}),
      DisasterAlert.deleteMany({}),
      Zone.deleteMany({})
    ]);
    console.log('✓ Cleared existing data');

    // Create Zones
    const zones = await Zone.insertMany([
      { name: 'Velachery', area: 'Central', lat: 12.9750, lng: 80.2207, rainfall: 85, waterLevel: 92, elevation: 5, riskScore: 82, riskLevel: 'Critical' },
      { name: 'Adyar', area: 'Central', lat: 13.0089, lng: 80.2707, rainfall: 65, waterLevel: 72, elevation: 8, riskScore: 65, riskLevel: 'High' },
      { name: 'Anna Nagar', area: 'North', lat: 13.0827, lng: 80.2108, rainfall: 15, waterLevel: 25, elevation: 12, riskScore: 20, riskLevel: 'Low' },
      { name: 'Mylapore', area: 'South', lat: 13.0329, lng: 80.2588, rainfall: 45, waterLevel: 48, elevation: 10, riskScore: 45, riskLevel: 'Moderate' },
      { name: 'Besant Nagar', area: 'South', lat: 13.0047, lng: 80.2707, rainfall: 55, waterLevel: 58, elevation: 7, riskScore: 55, riskLevel: 'High' }
    ]);
    console.log('✓ Created 5 zones');

    // Create Flood Predictions
    await FloodPrediction.insertMany([
      { zone: 'Velachery', riskScore: 82, riskLevel: 'Critical', rainfall: 85, waterLevel: 92, elevation: 5, location: { lat: 12.9750, lng: 80.2207 } },
      { zone: 'Adyar', riskScore: 65, riskLevel: 'High', rainfall: 65, waterLevel: 72, elevation: 8, location: { lat: 13.0089, lng: 80.2707 } },
      { zone: 'Anna Nagar', riskScore: 20, riskLevel: 'Low', rainfall: 15, waterLevel: 25, elevation: 12, location: { lat: 13.0827, lng: 80.2108 } },
      { zone: 'Mylapore', riskScore: 45, riskLevel: 'Moderate', rainfall: 45, waterLevel: 48, elevation: 10, location: { lat: 13.0329, lng: 80.2588 } },
      { zone: 'Besant Nagar', riskScore: 55, riskLevel: 'High', rainfall: 55, waterLevel: 58, elevation: 7, location: { lat: 13.0047, lng: 80.2707 } }
    ]);
    console.log('✓ Created flood predictions');

    // Create Shelters
    await Shelter.insertMany([
      { name: 'Velachery Relief Center', location: { lat: 12.9750, lng: 80.2207 }, address: 'Velachery, Chennai', capacity: 500, occupancy: 150, contact: '044-2445-1234', amenities: ['Food', 'Water', 'Medical', 'Bedding'] },
      { name: 'Adyar Community Complex', location: { lat: 13.0089, lng: 80.2707 }, address: 'Adyar, Chennai', capacity: 800, occupancy: 320, contact: '044-2445-5678', amenities: ['Food', 'Water', 'Medical', 'Bedding', 'WiFi'] },
      { name: 'Anna Nagar School', location: { lat: 13.0827, lng: 80.2108 }, address: 'Anna Nagar, Chennai', capacity: 300, occupancy: 45, contact: '044-2445-9012', amenities: ['Food', 'Water', 'Bedding'] },
      { name: 'Mylapore Temple Hall', location: { lat: 13.0329, lng: 80.2588 }, address: 'Mylapore, Chennai', capacity: 400, occupancy: 120, contact: '044-2445-3456', amenities: ['Food', 'Water', 'Medical'] },
      { name: 'Besant Nagar Sports Complex', location: { lat: 13.0047, lng: 80.2707 }, address: 'Besant Nagar, Chennai', capacity: 600, occupancy: 200, contact: '044-2445-7890', amenities: ['Food', 'Water', 'Medical', 'Bedding', 'WiFi'] }
    ]);
    console.log('✓ Created 5 shelters');

    // Create Rescue Teams
    await RescueTeam.insertMany([
      { name: 'Alpha Rescue Team', members: 12, status: 'available', location: { lat: 12.9750, lng: 80.2207 }, assignedZone: 'Velachery', equipment: ['Boat', 'Rope', 'First Aid', 'Radio'], contact: '9876543210' },
      { name: 'Beta Rescue Team', members: 10, status: 'deployed', location: { lat: 13.0089, lng: 80.2707 }, assignedZone: 'Adyar', equipment: ['Boat', 'Rope', 'First Aid', 'Radio', 'Stretcher'], contact: '9876543211' },
      { name: 'Gamma Rescue Team', members: 8, status: 'available', location: { lat: 13.0827, lng: 80.2108 }, assignedZone: 'Anna Nagar', equipment: ['Rope', 'First Aid', 'Radio'], contact: '9876543212' },
      { name: 'Delta Rescue Team', members: 15, status: 'busy', location: { lat: 13.0329, lng: 80.2588 }, assignedZone: 'Mylapore', equipment: ['Boat', 'Rope', 'First Aid', 'Radio', 'Stretcher', 'Oxygen'], contact: '9876543213' }
    ]);
    console.log('✓ Created 4 rescue teams');

    // Create Police Stations
    await PoliceStation.insertMany([
      { name: 'Velachery Police Station', area: 'Central', lat: 12.9750, lng: 80.2207, phone: '044-2445-0100', address: 'Velachery, Chennai' },
      { name: 'Adyar Police Station', area: 'Central', lat: 13.0089, lng: 80.2707, phone: '044-2445-0101', address: 'Adyar, Chennai' },
      { name: 'Anna Nagar Police Station', area: 'North', lat: 13.0827, lng: 80.2108, phone: '044-2445-0102', address: 'Anna Nagar, Chennai' },
      { name: 'Mylapore Police Station', area: 'South', lat: 13.0329, lng: 80.2588, phone: '044-2445-0103', address: 'Mylapore, Chennai' }
    ]);
    console.log('✓ Created 4 police stations');

    // Create Ambulance Services
    await AmbulanceService.insertMany([
      { name: 'Emergency Ambulance 1', area: 'Central', lat: 12.9750, lng: 80.2207, phone: '108', status: 'available' },
      { name: 'Emergency Ambulance 2', area: 'Central', lat: 13.0089, lng: 80.2707, phone: '108', status: 'busy' },
      { name: 'Emergency Ambulance 3', area: 'North', lat: 13.0827, lng: 80.2108, phone: '108', status: 'available' },
      { name: 'Emergency Ambulance 4', area: 'South', lat: 13.0329, lng: 80.2588, phone: '108', status: 'available' }
    ]);
    console.log('✓ Created 4 ambulance services');

    // Create Hospitals
    await Hospital.insertMany([
      { name: 'Apollo Hospital', area: 'Central', lat: 12.9750, lng: 80.2207, phone: '044-2871-1111', beds: 500, occupiedBeds: 250, address: 'Velachery, Chennai' },
      { name: 'Fortis Hospital', area: 'Central', lat: 13.0089, lng: 80.2707, phone: '044-6611-1111', beds: 400, occupiedBeds: 180, address: 'Adyar, Chennai' },
      { name: 'Government Hospital', area: 'North', lat: 13.0827, lng: 80.2108, phone: '044-2621-1111', beds: 300, occupiedBeds: 150, address: 'Anna Nagar, Chennai' },
      { name: 'Vijaya Hospital', area: 'South', lat: 13.0329, lng: 80.2588, phone: '044-2493-1111', beds: 350, occupiedBeds: 140, address: 'Mylapore, Chennai' }
    ]);
    console.log('✓ Created 4 hospitals');

    // Create SOS Alerts (sample)
    await SOSAlert.insertMany([
      { name: 'John Doe', phone: '9876543210', location: 'Velachery', message: 'Stuck in flooded area', lat: 12.9750, lng: 80.2207, status: 'active' },
      { name: 'Jane Smith', phone: '9876543211', location: 'Adyar', message: 'Need immediate rescue', lat: 13.0089, lng: 80.2707, status: 'resolved' }
    ]);
    console.log('✓ Created sample SOS alerts');

    // Create User Reports (sample)
    await UserReport.insertMany([
      { type: 'flood', location: 'Velachery Main Road', description: 'Water level rising rapidly', lat: 12.9750, lng: 80.2207 },
      { type: 'blocked_road', location: 'Adyar Bridge', description: 'Road blocked due to debris', lat: 13.0089, lng: 80.2707 }
    ]);
    console.log('✓ Created sample user reports');

    // Create Disaster Alerts (sample)
    await DisasterAlert.insertMany([
      { alertId: 'ALERT-001', zone: 'Velachery', area: 'Central', disasterType: 'Flood', severity: 'Critical', lat: 12.9750, lng: 80.2207, status: 'active' },
      { alertId: 'ALERT-002', zone: 'Adyar', area: 'Central', disasterType: 'Flood', severity: 'High', lat: 13.0089, lng: 80.2707, status: 'active' }
    ]);
    console.log('✓ Created sample disaster alerts');

    console.log('\n✅ Database initialization complete!');
    console.log('📊 Summary:');
    console.log('   - 5 Zones');
    console.log('   - 5 Flood Predictions');
    console.log('   - 5 Shelters');
    console.log('   - 4 Rescue Teams');
    console.log('   - 4 Police Stations');
    console.log('   - 4 Ambulance Services');
    console.log('   - 4 Hospitals');
    console.log('   - 2 SOS Alerts');
    console.log('   - 2 User Reports');
    console.log('   - 2 Disaster Alerts');

    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
    process.exit(1);
  }
}

initializeDatabase();
