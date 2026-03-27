// Initialize GeoGuard Database with All Chennai Data

// Create Collections
db.createCollection('zones');
db.createCollection('policeStations');
db.createCollection('ambulanceServices');
db.createCollection('hospitals');
db.createCollection('rescueTeams');
db.createCollection('shelters');
db.createCollection('disasterAlerts');
db.createCollection('floodPredictions');
db.createCollection('sosAlerts');
db.createCollection('userReports');

// Insert Zones (20 zones across 5 areas)
db.zones.insertMany([
  // North Chennai
  { name: "Tondiarpet", area: "North", lat: 13.1667, lng: 80.3167, rainfall: 45, waterLevel: 50, elevation: 8, riskScore: 35, riskLevel: "Low", timestamp: new Date() },
  { name: "Royapuram", area: "North", lat: 13.1500, lng: 80.3333, rainfall: 50, waterLevel: 55, elevation: 7, riskScore: 40, riskLevel: "Moderate", timestamp: new Date() },
  { name: "Kolathur", area: "North", lat: 13.1333, lng: 80.2500, rainfall: 40, waterLevel: 45, elevation: 10, riskScore: 30, riskLevel: "Low", timestamp: new Date() },
  { name: "Perambur", area: "North", lat: 13.1167, lng: 80.2833, rainfall: 55, waterLevel: 60, elevation: 6, riskScore: 45, riskLevel: "Moderate", timestamp: new Date() },
  
  // Central Chennai
  { name: "Velachery", area: "Central", lat: 12.9750, lng: 80.2207, rainfall: 75, waterLevel: 85, elevation: 5, riskScore: 82, riskLevel: "Critical", timestamp: new Date() },
  { name: "T Nagar", area: "Central", lat: 13.0418, lng: 80.2341, rainfall: 40, waterLevel: 45, elevation: 8, riskScore: 45, riskLevel: "Moderate", timestamp: new Date() },
  { name: "Adyar", area: "Central", lat: 13.0067, lng: 80.2570, rainfall: 60, waterLevel: 70, elevation: 6, riskScore: 65, riskLevel: "High", timestamp: new Date() },
  { name: "Anna Nagar", area: "Central", lat: 13.0850, lng: 80.2101, rainfall: 15, waterLevel: 20, elevation: 12, riskScore: 20, riskLevel: "Low", timestamp: new Date() },
  { name: "Mylapore", area: "Central", lat: 13.0339, lng: 80.2707, rainfall: 50, waterLevel: 60, elevation: 7, riskScore: 55, riskLevel: "Moderate", timestamp: new Date() },
  { name: "Teynampet", area: "Central", lat: 13.0333, lng: 80.2500, rainfall: 45, waterLevel: 50, elevation: 8, riskScore: 40, riskLevel: "Moderate", timestamp: new Date() },
  { name: "Guindy", area: "Central", lat: 13.0000, lng: 80.1667, rainfall: 35, waterLevel: 40, elevation: 9, riskScore: 35, riskLevel: "Low", timestamp: new Date() },
  
  // South Chennai
  { name: "Tambaram", area: "South", lat: 12.9229, lng: 80.1275, rainfall: 30, waterLevel: 35, elevation: 10, riskScore: 35, riskLevel: "Low", timestamp: new Date() },
  { name: "Pallavaram", area: "South", lat: 12.9667, lng: 80.1500, rainfall: 35, waterLevel: 40, elevation: 11, riskScore: 38, riskLevel: "Moderate", timestamp: new Date() },
  { name: "Chromepet", area: "South", lat: 12.9833, lng: 80.1667, rainfall: 40, waterLevel: 45, elevation: 9, riskScore: 42, riskLevel: "Moderate", timestamp: new Date() },
  { name: "Madipakkam", area: "South", lat: 12.9500, lng: 80.1833, rainfall: 38, waterLevel: 42, elevation: 10, riskScore: 40, riskLevel: "Moderate", timestamp: new Date() },
  
  // East Chennai
  { name: "Besant Nagar", area: "East", lat: 13.0167, lng: 80.2667, rainfall: 55, waterLevel: 65, elevation: 6, riskScore: 60, riskLevel: "High", timestamp: new Date() },
  { name: "Thiruvanmiyur", area: "East", lat: 12.9833, lng: 80.2667, rainfall: 50, waterLevel: 60, elevation: 7, riskScore: 55, riskLevel: "Moderate", timestamp: new Date() },
  { name: "Kottivakkam", area: "East", lat: 12.9667, lng: 80.2833, rainfall: 48, waterLevel: 58, elevation: 8, riskScore: 52, riskLevel: "Moderate", timestamp: new Date() },
  
  // West Chennai
  { name: "Saidapet", area: "West", lat: 13.0167, lng: 80.1833, rainfall: 35, waterLevel: 40, elevation: 9, riskScore: 35, riskLevel: "Low", timestamp: new Date() },
  { name: "Nungambakkam", area: "West", lat: 13.0500, lng: 80.2167, rainfall: 40, waterLevel: 45, elevation: 8, riskScore: 40, riskLevel: "Moderate", timestamp: new Date() }
]);

// Insert Police Stations
db.policeStations.insertMany([
  { name: "North Chennai Police", area: "North", lat: 13.1667, lng: 80.3167, phone: "100", address: "Tondiarpet, Chennai" },
  { name: "Central Chennai Police", area: "Central", lat: 13.0418, lng: 80.2341, phone: "100", address: "T Nagar, Chennai" },
  { name: "South Chennai Police", area: "South", lat: 12.9229, lng: 80.1275, phone: "100", address: "Tambaram, Chennai" },
  { name: "East Chennai Police", area: "East", lat: 13.0167, lng: 80.2667, phone: "100", address: "Besant Nagar, Chennai" },
  { name: "West Chennai Police", area: "West", lat: 13.0000, lng: 80.1667, phone: "100", address: "Guindy, Chennai" }
]);

// Insert Ambulance Services
db.ambulanceServices.insertMany([
  { name: "108 Ambulance - North", area: "North", lat: 13.1667, lng: 80.3167, phone: "108", status: "available" },
  { name: "108 Ambulance - Central", area: "Central", lat: 13.0418, lng: 80.2341, phone: "108", status: "available" },
  { name: "108 Ambulance - South", area: "South", lat: 12.9229, lng: 80.1275, phone: "108", status: "available" },
  { name: "108 Ambulance - East", area: "East", lat: 13.0167, lng: 80.2667, phone: "108", status: "available" },
  { name: "108 Ambulance - West", area: "West", lat: 13.0000, lng: 80.1667, phone: "108", status: "available" }
]);

// Insert Hospitals
db.hospitals.insertMany([
  { name: "Stanley Medical College", area: "North", lat: 13.1500, lng: 80.3000, phone: "044-2535-0000", beds: 1200, occupiedBeds: 450, address: "North Chennai" },
  { name: "Rajiv Gandhi Government Hospital", area: "Central", lat: 13.0500, lng: 80.2500, phone: "044-2536-0000", beds: 1500, occupiedBeds: 600, address: "Central Chennai" },
  { name: "Government General Hospital", area: "Central", lat: 13.0667, lng: 80.2667, phone: "044-2532-0000", beds: 2000, occupiedBeds: 800, address: "Central Chennai" },
  { name: "Kilpauk Medical College", area: "Central", lat: 13.0833, lng: 80.2333, phone: "044-2531-0000", beds: 1000, occupiedBeds: 400, address: "Central Chennai" },
  { name: "Madras Medical College", area: "East", lat: 13.0667, lng: 80.2833, phone: "044-2530-0000", beds: 1800, occupiedBeds: 700, address: "East Chennai" },
  { name: "Sri Ramachandra Medical College", area: "South", lat: 12.9833, lng: 80.2333, phone: "044-2476-0000", beds: 1200, occupiedBeds: 500, address: "South Chennai" },
  { name: "Apollo Hospitals", area: "West", lat: 13.0667, lng: 80.1667, phone: "044-2829-0000", beds: 800, occupiedBeds: 300, address: "West Chennai" },
  { name: "Fortis Malar Hospital", area: "Central", lat: 13.0500, lng: 80.2500, phone: "044-4000-0000", beds: 600, occupiedBeds: 250, address: "Central Chennai" }
]);

// Insert Rescue Teams
db.rescueTeams.insertMany([
  { name: "NDRF - North Chennai", area: "North", assignedZone: "North", lat: 13.1667, lng: 80.3167, members: 50, status: "available", equipment: ["Boat", "Rope", "Life Jacket"], phone: "011-2671-0000" },
  { name: "NDRF - Central Chennai", area: "Central", assignedZone: "Central", lat: 13.0418, lng: 80.2341, members: 60, status: "available", equipment: ["Boat", "Rope", "Life Jacket"], phone: "011-2671-0000" },
  { name: "NDRF - South Chennai", area: "South", assignedZone: "South", lat: 12.9229, lng: 80.1275, members: 45, status: "available", equipment: ["Boat", "Rope", "Life Jacket"], phone: "011-2671-0000" },
  { name: "Fire & Rescue - East", area: "East", assignedZone: "East", lat: 13.0167, lng: 80.2667, members: 40, status: "available", equipment: ["Boat", "Rope", "Life Jacket"], phone: "101" },
  { name: "Fire & Rescue - West", area: "West", assignedZone: "West", lat: 13.0000, lng: 80.1667, members: 35, status: "available", equipment: ["Boat", "Rope", "Life Jacket"], phone: "101" }
]);

// Insert Shelters
db.shelters.insertMany([
  { name: "Velachery Community Center", location: { lat: 12.9750, lng: 80.2207 }, address: "Velachery, Chennai", capacity: 500, occupancy: 150, contact: "9876543210", amenities: ["Food", "Water", "Medical", "Bedding"] },
  { name: "Adyar Sports Complex", location: { lat: 13.0089, lng: 80.2707 }, address: "Adyar, Chennai", capacity: 800, occupancy: 320, contact: "9876543211", amenities: ["Food", "Water", "Medical", "Bedding", "Sanitation"] },
  { name: "Anna Nagar School", location: { lat: 13.0827, lng: 80.2108 }, address: "Anna Nagar, Chennai", capacity: 400, occupancy: 80, contact: "9876543212", amenities: ["Food", "Water", "Bedding"] },
  { name: "T Nagar Relief Center", location: { lat: 13.0349, lng: 80.2348 }, address: "T Nagar, Chennai", capacity: 600, occupancy: 200, contact: "9876543213", amenities: ["Food", "Water", "Medical", "Bedding"] }
]);

// Insert Flood Predictions
db.floodPredictions.insertMany([
  { zone: "Velachery", riskScore: 82, riskLevel: "Critical", rainfall: 75, waterLevel: 85, elevation: 5, location: { lat: 12.9750, lng: 80.2207 }, timestamp: new Date() },
  { zone: "Adyar", riskScore: 65, riskLevel: "High", rainfall: 60, waterLevel: 70, elevation: 6, location: { lat: 13.0089, lng: 80.2707 }, timestamp: new Date() },
  { zone: "T Nagar", riskScore: 45, riskLevel: "Moderate", rainfall: 40, waterLevel: 45, elevation: 8, location: { lat: 13.0349, lng: 80.2348 }, timestamp: new Date() },
  { zone: "Anna Nagar", riskScore: 20, riskLevel: "Low", rainfall: 15, waterLevel: 20, elevation: 12, location: { lat: 13.0827, lng: 80.2108 }, timestamp: new Date() },
  { zone: "Mylapore", riskScore: 55, riskLevel: "Moderate", rainfall: 50, waterLevel: 60, elevation: 7, location: { lat: 13.0339, lng: 80.2711 }, timestamp: new Date() },
  { zone: "Tambaram", riskScore: 35, riskLevel: "Low", rainfall: 30, waterLevel: 35, elevation: 10, location: { lat: 12.9229, lng: 80.1275 }, timestamp: new Date() }
]);

print('✅ GeoGuard Database Initialized Successfully!');
print('📊 Data Inserted:');
print('   - 20 Zones');
print('   - 5 Police Stations');
print('   - 5 Ambulance Services');
print('   - 8 Hospitals');
print('   - 5 Rescue Teams');
print('   - 4 Shelters');
print('   - 6 Flood Predictions');
