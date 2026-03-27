const mongoose = require('mongoose');
require('dotenv').config();

const {
  User, FloodPrediction, SOSAlert, UserReport, Shelter, RescueTeam,
  PoliceStation, AmbulanceService, Hospital, DisasterAlert, Zone
} = require('./models/schemas');

async function initializeDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✓ MongoDB connected');

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

    // Create 15 Zones with detailed data
    const zones = await Zone.insertMany([
      { name: 'Velachery', area: 'Central', lat: 12.9750, lng: 80.2207, rainfall: 85, waterLevel: 92, elevation: 5, riskScore: 82, riskLevel: 'Critical' },
      { name: 'Adyar', area: 'Central', lat: 13.0089, lng: 80.2707, rainfall: 65, waterLevel: 72, elevation: 8, riskScore: 65, riskLevel: 'High' },
      { name: 'Anna Nagar', area: 'North', lat: 13.0827, lng: 80.2108, rainfall: 15, waterLevel: 25, elevation: 12, riskScore: 20, riskLevel: 'Low' },
      { name: 'Mylapore', area: 'South', lat: 13.0329, lng: 80.2588, rainfall: 45, waterLevel: 48, elevation: 10, riskScore: 45, riskLevel: 'Moderate' },
      { name: 'Besant Nagar', area: 'South', lat: 13.0047, lng: 80.2707, rainfall: 55, waterLevel: 58, elevation: 7, riskScore: 55, riskLevel: 'High' },
      { name: 'T. Nagar', area: 'West', lat: 13.0349, lng: 80.2407, rainfall: 35, waterLevel: 42, elevation: 9, riskScore: 38, riskLevel: 'Moderate' },
      { name: 'Nungambakkam', area: 'West', lat: 13.0469, lng: 80.2307, rainfall: 25, waterLevel: 32, elevation: 11, riskScore: 28, riskLevel: 'Low' },
      { name: 'Chetpet', area: 'Central', lat: 13.0569, lng: 80.2407, rainfall: 48, waterLevel: 55, elevation: 6, riskScore: 50, riskLevel: 'Moderate' },
      { name: 'Egmore', area: 'Central', lat: 13.0669, lng: 80.2507, rainfall: 72, waterLevel: 78, elevation: 4, riskScore: 72, riskLevel: 'High' },
      { name: 'Purasawalkam', area: 'North', lat: 13.0769, lng: 80.2607, rainfall: 38, waterLevel: 45, elevation: 8, riskScore: 42, riskLevel: 'Moderate' },
      { name: 'Washermanpet', area: 'North', lat: 13.0869, lng: 80.2707, rainfall: 62, waterLevel: 68, elevation: 5, riskScore: 62, riskLevel: 'High' },
      { name: 'Royapuram', area: 'North', lat: 13.0969, lng: 80.2807, rainfall: 78, waterLevel: 85, elevation: 3, riskScore: 78, riskLevel: 'Critical' },
      { name: 'Perambur', area: 'East', lat: 13.0569, lng: 80.3107, rainfall: 42, waterLevel: 50, elevation: 7, riskScore: 46, riskLevel: 'Moderate' },
      { name: 'Kolathur', area: 'East', lat: 13.0669, lng: 80.3207, rainfall: 35, waterLevel: 40, elevation: 9, riskScore: 38, riskLevel: 'Moderate' },
      { name: 'Thiruvallur', area: 'North', lat: 13.1269, lng: 80.1407, rainfall: 55, waterLevel: 62, elevation: 6, riskScore: 58, riskLevel: 'High' }
    ]);
    console.log('✓ Created 15 zones');

    // Create 15 Flood Predictions
    await FloodPrediction.insertMany([
      { zone: 'Velachery', riskScore: 82, riskLevel: 'Critical', rainfall: 85, waterLevel: 92, elevation: 5, location: { lat: 12.9750, lng: 80.2207 } },
      { zone: 'Adyar', riskScore: 65, riskLevel: 'High', rainfall: 65, waterLevel: 72, elevation: 8, location: { lat: 13.0089, lng: 80.2707 } },
      { zone: 'Anna Nagar', riskScore: 20, riskLevel: 'Low', rainfall: 15, waterLevel: 25, elevation: 12, location: { lat: 13.0827, lng: 80.2108 } },
      { zone: 'Mylapore', riskScore: 45, riskLevel: 'Moderate', rainfall: 45, waterLevel: 48, elevation: 10, location: { lat: 13.0329, lng: 80.2588 } },
      { zone: 'Besant Nagar', riskScore: 55, riskLevel: 'High', rainfall: 55, waterLevel: 58, elevation: 7, location: { lat: 13.0047, lng: 80.2707 } },
      { zone: 'T. Nagar', riskScore: 38, riskLevel: 'Moderate', rainfall: 35, waterLevel: 42, elevation: 9, location: { lat: 13.0349, lng: 80.2407 } },
      { zone: 'Nungambakkam', riskScore: 28, riskLevel: 'Low', rainfall: 25, waterLevel: 32, elevation: 11, location: { lat: 13.0469, lng: 80.2307 } },
      { zone: 'Chetpet', riskScore: 50, riskLevel: 'Moderate', rainfall: 48, waterLevel: 55, elevation: 6, location: { lat: 13.0569, lng: 80.2407 } },
      { zone: 'Egmore', riskScore: 72, riskLevel: 'High', rainfall: 72, waterLevel: 78, elevation: 4, location: { lat: 13.0669, lng: 80.2507 } },
      { zone: 'Purasawalkam', riskScore: 42, riskLevel: 'Moderate', rainfall: 38, waterLevel: 45, elevation: 8, location: { lat: 13.0769, lng: 80.2607 } },
      { zone: 'Washermanpet', riskScore: 62, riskLevel: 'High', rainfall: 62, waterLevel: 68, elevation: 5, location: { lat: 13.0869, lng: 80.2707 } },
      { zone: 'Royapuram', riskScore: 78, riskLevel: 'Critical', rainfall: 78, waterLevel: 85, elevation: 3, location: { lat: 13.0969, lng: 80.2807 } },
      { zone: 'Perambur', riskScore: 46, riskLevel: 'Moderate', rainfall: 42, waterLevel: 50, elevation: 7, location: { lat: 13.0569, lng: 80.3107 } },
      { zone: 'Kolathur', riskScore: 38, riskLevel: 'Moderate', rainfall: 35, waterLevel: 40, elevation: 9, location: { lat: 13.0669, lng: 80.3207 } },
      { zone: 'Thiruvallur', riskScore: 58, riskLevel: 'High', rainfall: 55, waterLevel: 62, elevation: 6, location: { lat: 13.1269, lng: 80.1407 } }
    ]);
    console.log('✓ Created 15 flood predictions');

    // Create 10 Shelters
    await Shelter.insertMany([
      { name: 'Velachery Relief Center', location: { lat: 12.9750, lng: 80.2207 }, address: 'Velachery Main Road, Chennai', capacity: 500, occupancy: 150, contact: '044-2445-1234', amenities: ['Food', 'Water', 'Medical', 'Bedding', 'WiFi'] },
      { name: 'Adyar Community Complex', location: { lat: 13.0089, lng: 80.2707 }, address: 'Adyar, Chennai', capacity: 800, occupancy: 320, contact: '044-2445-5678', amenities: ['Food', 'Water', 'Medical', 'Bedding', 'WiFi', 'Electricity'] },
      { name: 'Anna Nagar School', location: { lat: 13.0827, lng: 80.2108 }, address: 'Anna Nagar, Chennai', capacity: 300, occupancy: 45, contact: '044-2445-9012', amenities: ['Food', 'Water', 'Bedding', 'WiFi'] },
      { name: 'Mylapore Temple Hall', location: { lat: 13.0329, lng: 80.2588 }, address: 'Mylapore, Chennai', capacity: 400, occupancy: 120, contact: '044-2445-3456', amenities: ['Food', 'Water', 'Medical', 'Bedding'] },
      { name: 'Besant Nagar Sports Complex', location: { lat: 13.0047, lng: 80.2707 }, address: 'Besant Nagar, Chennai', capacity: 600, occupancy: 200, contact: '044-2445-7890', amenities: ['Food', 'Water', 'Medical', 'Bedding', 'WiFi', 'Electricity'] },
      { name: 'T. Nagar Community Hall', location: { lat: 13.0349, lng: 80.2407 }, address: 'T. Nagar, Chennai', capacity: 350, occupancy: 80, contact: '044-2445-1111', amenities: ['Food', 'Water', 'Bedding', 'WiFi'] },
      { name: 'Nungambakkam Convention Center', location: { lat: 13.0469, lng: 80.2307 }, address: 'Nungambakkam, Chennai', capacity: 700, occupancy: 250, contact: '044-2445-2222', amenities: ['Food', 'Water', 'Medical', 'Bedding', 'WiFi', 'Electricity', 'Sanitation'] },
      { name: 'Chetpet Government School', location: { lat: 13.0569, lng: 80.2407 }, address: 'Chetpet, Chennai', capacity: 280, occupancy: 60, contact: '044-2445-3333', amenities: ['Food', 'Water', 'Bedding'] },
      { name: 'Egmore Railway Station Hall', location: { lat: 13.0669, lng: 80.2507 }, address: 'Egmore, Chennai', capacity: 450, occupancy: 180, contact: '044-2445-4444', amenities: ['Food', 'Water', 'Medical', 'Bedding', 'WiFi'] },
      { name: 'Royapuram Port Authority Hall', location: { lat: 13.0969, lng: 80.2807 }, address: 'Royapuram, Chennai', capacity: 550, occupancy: 280, contact: '044-2445-5555', amenities: ['Food', 'Water', 'Medical', 'Bedding', 'WiFi', 'Electricity'] }
    ]);
    console.log('✓ Created 10 shelters');

    // Create 8 Rescue Teams
    await RescueTeam.insertMany([
      { name: 'Alpha Rescue Team', members: 12, status: 'available', location: { lat: 12.9750, lng: 80.2207 }, assignedZone: 'Velachery', equipment: ['Boat', 'Rope', 'First Aid', 'Radio', 'Stretcher'], contact: '9876543210' },
      { name: 'Beta Rescue Team', members: 10, status: 'deployed', location: { lat: 13.0089, lng: 80.2707 }, assignedZone: 'Adyar', equipment: ['Boat', 'Rope', 'First Aid', 'Radio', 'Stretcher', 'Oxygen'], contact: '9876543211' },
      { name: 'Gamma Rescue Team', members: 8, status: 'available', location: { lat: 13.0827, lng: 80.2108 }, assignedZone: 'Anna Nagar', equipment: ['Rope', 'First Aid', 'Radio', 'Stretcher'], contact: '9876543212' },
      { name: 'Delta Rescue Team', members: 15, status: 'busy', location: { lat: 13.0329, lng: 80.2588 }, assignedZone: 'Mylapore', equipment: ['Boat', 'Rope', 'First Aid', 'Radio', 'Stretcher', 'Oxygen', 'Pump'], contact: '9876543213' },
      { name: 'Epsilon Rescue Team', members: 11, status: 'available', location: { lat: 13.0047, lng: 80.2707 }, assignedZone: 'Besant Nagar', equipment: ['Boat', 'Rope', 'First Aid', 'Radio'], contact: '9876543214' },
      { name: 'Zeta Rescue Team', members: 9, status: 'available', location: { lat: 13.0349, lng: 80.2407 }, assignedZone: 'T. Nagar', equipment: ['Rope', 'First Aid', 'Radio', 'Stretcher'], contact: '9876543215' },
      { name: 'Eta Rescue Team', members: 13, status: 'deployed', location: { lat: 13.0469, lng: 80.2307 }, assignedZone: 'Nungambakkam', equipment: ['Boat', 'Rope', 'First Aid', 'Radio', 'Oxygen'], contact: '9876543216' },
      { name: 'Theta Rescue Team', members: 10, status: 'available', location: { lat: 13.0969, lng: 80.2807 }, assignedZone: 'Royapuram', equipment: ['Boat', 'Rope', 'First Aid', 'Radio', 'Stretcher', 'Pump'], contact: '9876543217' }
    ]);
    console.log('✓ Created 8 rescue teams');

    // Create 8 Police Stations
    await PoliceStation.insertMany([
      { name: 'Velachery Police Station', area: 'Central', lat: 12.9750, lng: 80.2207, phone: '100', address: 'Velachery, Chennai' },
      { name: 'Adyar Police Station', area: 'Central', lat: 13.0089, lng: 80.2707, phone: '100', address: 'Adyar, Chennai' },
      { name: 'Anna Nagar Police Station', area: 'North', lat: 13.0827, lng: 80.2108, phone: '100', address: 'Anna Nagar, Chennai' },
      { name: 'Mylapore Police Station', area: 'South', lat: 13.0329, lng: 80.2588, phone: '100', address: 'Mylapore, Chennai' },
      { name: 'T. Nagar Police Station', area: 'West', lat: 13.0349, lng: 80.2407, phone: '100', address: 'T. Nagar, Chennai' },
      { name: 'Egmore Police Station', area: 'Central', lat: 13.0669, lng: 80.2507, phone: '100', address: 'Egmore, Chennai' },
      { name: 'Washermanpet Police Station', area: 'North', lat: 13.0869, lng: 80.2707, phone: '100', address: 'Washermanpet, Chennai' },
      { name: 'Royapuram Police Station', area: 'North', lat: 13.0969, lng: 80.2807, phone: '100', address: 'Royapuram, Chennai' }
    ]);
    console.log('✓ Created 8 police stations');

    // Create 8 Ambulance Services
    await AmbulanceService.insertMany([
      { name: 'Emergency Ambulance 1', area: 'Central', lat: 12.9750, lng: 80.2207, phone: '108', status: 'available' },
      { name: 'Emergency Ambulance 2', area: 'Central', lat: 13.0089, lng: 80.2707, phone: '108', status: 'busy' },
      { name: 'Emergency Ambulance 3', area: 'North', lat: 13.0827, lng: 80.2108, phone: '108', status: 'available' },
      { name: 'Emergency Ambulance 4', area: 'South', lat: 13.0329, lng: 80.2588, phone: '108', status: 'available' },
      { name: 'Emergency Ambulance 5', area: 'West', lat: 13.0349, lng: 80.2407, phone: '108', status: 'available' },
      { name: 'Emergency Ambulance 6', area: 'Central', lat: 13.0669, lng: 80.2507, phone: '108', status: 'busy' },
      { name: 'Emergency Ambulance 7', area: 'North', lat: 13.0869, lng: 80.2707, phone: '108', status: 'available' },
      { name: 'Emergency Ambulance 8', area: 'North', lat: 13.0969, lng: 80.2807, phone: '108', status: 'available' }
    ]);
    console.log('✓ Created 8 ambulance services');

    // Create 8 Hospitals
    await Hospital.insertMany([
      { name: 'Apollo Hospital', area: 'Central', lat: 12.9750, lng: 80.2207, phone: '044-2871-1111', beds: 500, occupiedBeds: 250, address: 'Velachery, Chennai' },
      { name: 'Fortis Hospital', area: 'Central', lat: 13.0089, lng: 80.2707, phone: '044-6611-1111', beds: 400, occupiedBeds: 180, address: 'Adyar, Chennai' },
      { name: 'Government Hospital', area: 'North', lat: 13.0827, lng: 80.2108, phone: '044-2621-1111', beds: 300, occupiedBeds: 150, address: 'Anna Nagar, Chennai' },
      { name: 'Vijaya Hospital', area: 'South', lat: 13.0329, lng: 80.2588, phone: '044-2493-1111', beds: 350, occupiedBeds: 140, address: 'Mylapore, Chennai' },
      { name: 'Kauvery Hospital', area: 'West', lat: 13.0349, lng: 80.2407, phone: '044-4000-1111', beds: 280, occupiedBeds: 120, address: 'T. Nagar, Chennai' },
      { name: 'Billroth Hospital', area: 'Central', lat: 13.0669, lng: 80.2507, phone: '044-2819-1111', beds: 320, occupiedBeds: 160, address: 'Egmore, Chennai' },
      { name: 'Chettinad Hospital', area: 'North', lat: 13.0869, lng: 80.2707, phone: '044-2642-1111', beds: 380, occupiedBeds: 190, address: 'Washermanpet, Chennai' },
      { name: 'Gleneagles Hospital', area: 'North', lat: 13.0969, lng: 80.2807, phone: '044-4000-2222', beds: 450, occupiedBeds: 220, address: 'Royapuram, Chennai' }
    ]);
    console.log('✓ Created 8 hospitals');

    // Create 10 SOS Alerts
    await SOSAlert.insertMany([
      { name: 'Rajesh Kumar', phone: '9876543210', location: 'Velachery Main Road', message: 'Stuck in flooded area, need immediate help', lat: 12.9750, lng: 80.2207, status: 'active' },
      { name: 'Priya Singh', phone: '9876543211', location: 'Adyar Bridge', message: 'Family trapped on roof, water level rising', lat: 13.0089, lng: 80.2707, status: 'active' },
      { name: 'Amit Patel', phone: '9876543212', location: 'Anna Nagar', message: 'Car submerged in water', lat: 13.0827, lng: 80.2108, status: 'resolved' },
      { name: 'Sneha Desai', phone: '9876543213', location: 'Mylapore', message: 'Elderly person needs medical help', lat: 13.0329, lng: 80.2588, status: 'active' },
      { name: 'Vikram Reddy', phone: '9876543214', location: 'Besant Nagar', message: 'Children stranded at school', lat: 13.0047, lng: 80.2707, status: 'resolved' },
      { name: 'Anjali Sharma', phone: '9876543215', location: 'T. Nagar', message: 'House flooded, need evacuation', lat: 13.0349, lng: 80.2407, status: 'active' },
      { name: 'Rohan Gupta', phone: '9876543216', location: 'Nungambakkam', message: 'Severe water logging on street', lat: 13.0469, lng: 80.2307, status: 'active' },
      { name: 'Divya Nair', phone: '9876543217', location: 'Chetpet', message: 'Need food and water supplies', lat: 13.0569, lng: 80.2407, status: 'resolved' },
      { name: 'Suresh Iyer', phone: '9876543218', location: 'Egmore', message: 'Drainage overflow, health hazard', lat: 13.0669, lng: 80.2507, status: 'active' },
      { name: 'Meera Krishnan', phone: '9876543219', location: 'Royapuram', message: 'Critical flood situation, immediate help needed', lat: 13.0969, lng: 80.2807, status: 'active' }
    ]);
    console.log('✓ Created 10 SOS alerts');

    // Create 10 User Reports
    await UserReport.insertMany([
      { type: 'flood', location: 'Velachery Main Road', description: 'Water level rising rapidly, 3 feet high', lat: 12.9750, lng: 80.2207 },
      { type: 'blocked_road', location: 'Adyar Bridge', description: 'Road completely blocked by debris and water', lat: 13.0089, lng: 80.2707 },
      { type: 'water_level', location: 'Anna Nagar', description: 'Water level at 2.5 feet and rising', lat: 13.0827, lng: 80.2108 },
      { type: 'flood', location: 'Mylapore', description: 'Severe flooding in residential area', lat: 13.0329, lng: 80.2588 },
      { type: 'blocked_road', location: 'Besant Nagar', description: 'Main road blocked, traffic diverted', lat: 13.0047, lng: 80.2707 },
      { type: 'water_level', location: 'T. Nagar', description: 'Water level at 1.8 feet', lat: 13.0349, lng: 80.2407 },
      { type: 'flood', location: 'Nungambakkam', description: 'Severe water logging in low-lying areas', lat: 13.0469, lng: 80.2307 },
      { type: 'other', location: 'Chetpet', description: 'Drainage system overflowing', lat: 13.0569, lng: 80.2407 },
      { type: 'flood', location: 'Egmore', description: 'Flash flood warning issued', lat: 13.0669, lng: 80.2507 },
      { type: 'water_level', location: 'Royapuram', description: 'Critical water level, evacuation recommended', lat: 13.0969, lng: 80.2807 }
    ]);
    console.log('✓ Created 10 user reports');

    // Create 10 Disaster Alerts
    await DisasterAlert.insertMany([
      { alertId: 'ALERT-001', zone: 'Velachery', area: 'Central', disasterType: 'Flood', severity: 'Critical', lat: 12.9750, lng: 80.2207, status: 'active' },
      { alertId: 'ALERT-002', zone: 'Adyar', area: 'Central', disasterType: 'Flood', severity: 'High', lat: 13.0089, lng: 80.2707, status: 'active' },
      { alertId: 'ALERT-003', zone: 'Anna Nagar', area: 'North', disasterType: 'Flood', severity: 'Low', lat: 13.0827, lng: 80.2108, status: 'resolved' },
      { alertId: 'ALERT-004', zone: 'Mylapore', area: 'South', disasterType: 'Flood', severity: 'High', lat: 13.0329, lng: 80.2588, status: 'active' },
      { alertId: 'ALERT-005', zone: 'Besant Nagar', area: 'South', disasterType: 'Flood', severity: 'High', lat: 13.0047, lng: 80.2707, status: 'active' },
      { alertId: 'ALERT-006', zone: 'T. Nagar', area: 'West', disasterType: 'Flood', severity: 'Moderate', lat: 13.0349, lng: 80.2407, status: 'active' },
      { alertId: 'ALERT-007', zone: 'Nungambakkam', area: 'West', disasterType: 'Flood', severity: 'High', lat: 13.0469, lng: 80.2307, status: 'active' },
      { alertId: 'ALERT-008', zone: 'Egmore', area: 'Central', disasterType: 'Flood', severity: 'High', lat: 13.0669, lng: 80.2507, status: 'active' },
      { alertId: 'ALERT-009', zone: 'Washermanpet', area: 'North', disasterType: 'Flood', severity: 'High', lat: 13.0869, lng: 80.2707, status: 'active' },
      { alertId: 'ALERT-010', zone: 'Royapuram', area: 'North', disasterType: 'Flood', severity: 'Critical', lat: 13.0969, lng: 80.2807, status: 'active' }
    ]);
    console.log('✓ Created 10 disaster alerts');

    console.log('\n✅ Database initialization complete!');
    console.log('\n📊 Summary:');
    console.log('   ✓ 15 Zones');
    console.log('   ✓ 15 Flood Predictions');
    console.log('   ✓ 10 Shelters');
    console.log('   ✓ 8 Rescue Teams');
    console.log('   ✓ 8 Police Stations');
    console.log('   ✓ 8 Ambulance Services');
    console.log('   ✓ 8 Hospitals');
    console.log('   ✓ 10 SOS Alerts');
    console.log('   ✓ 10 User Reports');
    console.log('   ✓ 10 Disaster Alerts');
    console.log('   ✓ Total: 96 Records\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
    process.exit(1);
  }
}

initializeDatabase();
