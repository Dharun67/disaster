db.createCollection('flood_predictions');
db.createCollection('sos_alerts');
db.createCollection('user_reports');
db.createCollection('shelters');
db.createCollection('rescue_teams');
db.createCollection('command_center_data');
db.createCollection('drainage_overflow');
db.createCollection('alerts');

// Flood Predictions
db.flood_predictions.insertMany([
  {
    zone: 'Velachery',
    riskScore: 82,
    riskLevel: 'High',
    rainfall: 75,
    waterLevel: 85,
    elevation: 5,
    location: { lat: 12.9698, lng: 80.2405 },
    timestamp: new Date()
  },
  {
    zone: 'T Nagar',
    riskScore: 45,
    riskLevel: 'Moderate',
    rainfall: 40,
    waterLevel: 45,
    elevation: 8,
    location: { lat: 13.0349, lng: 80.2348 },
    timestamp: new Date()
  },
  {
    zone: 'Adyar',
    riskScore: 65,
    riskLevel: 'Moderate',
    rainfall: 60,
    waterLevel: 70,
    elevation: 6,
    location: { lat: 13.0089, lng: 80.2707 },
    timestamp: new Date()
  },
  {
    zone: 'Anna Nagar',
    riskScore: 20,
    riskLevel: 'Low',
    rainfall: 15,
    waterLevel: 20,
    elevation: 12,
    location: { lat: 13.0827, lng: 80.2108 },
    timestamp: new Date()
  },
  {
    zone: 'Mylapore',
    riskScore: 55,
    riskLevel: 'Moderate',
    rainfall: 50,
    waterLevel: 60,
    elevation: 7,
    location: { lat: 13.0329, lng: 80.2711 },
    timestamp: new Date()
  },
  {
    zone: 'Tambaram',
    riskScore: 35,
    riskLevel: 'Low',
    rainfall: 30,
    waterLevel: 35,
    elevation: 10,
    location: { lat: 12.9250, lng: 80.1269 },
    timestamp: new Date()
  }
]);

// Shelters
db.shelters.insertMany([
  {
    name: 'Velachery Community Center',
    location: { lat: 12.9698, lng: 80.2405 },
    address: 'Velachery, Chennai',
    capacity: 500,
    occupancy: 150,
    contact: '9876543210',
    amenities: ['Food', 'Water', 'Medical', 'Bedding'],
    createdAt: new Date()
  },
  {
    name: 'Adyar Sports Complex',
    location: { lat: 13.0089, lng: 80.2707 },
    address: 'Adyar, Chennai',
    capacity: 800,
    occupancy: 320,
    contact: '9876543211',
    amenities: ['Food', 'Water', 'Medical', 'Bedding', 'Sanitation'],
    createdAt: new Date()
  },
  {
    name: 'Anna Nagar School',
    location: { lat: 13.0827, lng: 80.2108 },
    address: 'Anna Nagar, Chennai',
    capacity: 400,
    occupancy: 80,
    contact: '9876543212',
    amenities: ['Food', 'Water', 'Bedding'],
    createdAt: new Date()
  },
  {
    name: 'T Nagar Relief Center',
    location: { lat: 13.0349, lng: 80.2348 },
    address: 'T Nagar, Chennai',
    capacity: 600,
    occupancy: 200,
    contact: '9876543213',
    amenities: ['Food', 'Water', 'Medical', 'Bedding'],
    createdAt: new Date()
  }
]);

// Rescue Teams
db.rescue_teams.insertMany([
  {
    name: 'Team Alpha',
    members: 8,
    status: 'available',
    location: { lat: 12.9698, lng: 80.2405 },
    assignedZone: 'Velachery',
    equipment: ['Boat', 'Rope', 'Life Jacket', 'First Aid'],
    contact: '9876543220',
    createdAt: new Date()
  },
  {
    name: 'Team Beta',
    members: 6,
    status: 'deployed',
    location: { lat: 13.0089, lng: 80.2707 },
    assignedZone: 'Adyar',
    equipment: ['Boat', 'Rope', 'Life Jacket', 'First Aid'],
    contact: '9876543221',
    createdAt: new Date()
  },
  {
    name: 'Team Gamma',
    members: 7,
    status: 'available',
    location: { lat: 13.0827, lng: 80.2108 },
    assignedZone: 'Anna Nagar',
    equipment: ['Boat', 'Rope', 'Life Jacket', 'First Aid'],
    contact: '9876543222',
    createdAt: new Date()
  }
]);

// SOS Alerts
db.sos_alerts.insertMany([
  {
    name: 'John Doe',
    phone: '9876543230',
    location: 'Velachery Main Road',
    message: 'Stuck in flooded area, need immediate help',
    lat: 12.9698,
    lng: 80.2405,
    status: 'active',
    createdAt: new Date()
  },
  {
    name: 'Jane Smith',
    phone: '9876543231',
    location: 'Adyar Bypass',
    message: 'Family trapped on roof',
    lat: 13.0089,
    lng: 80.2707,
    status: 'active',
    createdAt: new Date()
  }
]);

// User Reports
db.user_reports.insertMany([
  {
    type: 'flood',
    location: 'Velachery Junction',
    description: 'Water level rising rapidly',
    imageUrl: 'https://via.placeholder.com/300',
    lat: 12.9698,
    lng: 80.2405,
    timestamp: new Date()
  },
  {
    type: 'blocked_road',
    location: 'Adyar Bridge',
    description: 'Road completely submerged',
    imageUrl: 'https://via.placeholder.com/300',
    lat: 13.0089,
    lng: 80.2707,
    timestamp: new Date()
  }
]);

print('Sample data initialized successfully!');
