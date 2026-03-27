const mongoose = require('mongoose');
require('dotenv').config();

const {
  User, FloodPrediction, SOSAlert, UserReport, Shelter, RescueTeam,
  PoliceStation, AmbulanceService, Hospital, Zone
} = require('./models/schemas');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/geoguard', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✓ MongoDB connected');
  } catch (err) {
    console.error('✗ MongoDB connection error:', err.message);
    process.exit(1);
  }
};

const initializeDatabase = async () => {
  try {
    console.log('\n🔄 Initializing GeoGuard Database...\n');

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
      Zone.deleteMany({})
    ]);
    console.log('✓ Cleared existing data');

    // Create Users
    const users = await User.insertMany([
      {
        name: 'Admin User',
        email: 'admin@geoguard.com',
        phone: '9876543210',
        password: 'hashed_password',
        isVerified: true,
        role: 'admin',
        lastLogin: new Date()
      },
      {
        name: 'Test User',
        email: 'test@example.com',
        phone: '9876543211',
        password: 'hashed_password',
        isVerified: true,
        role: 'user',
        lastLogin: new Date()
      },
      {
        name: 'Rescue Team Lead',
        email: 'rescue@geoguard.com',
        phone: '9876543212',
        password: 'hashed_password',
        isVerified: true,
        role: 'rescue',
        lastLogin: new Date()
      }
    ]);
    console.log(`✓ Created ${users.length} users`);

    // Create Zones
    const zones = await Zone.insertMany([
      {
        name: 'Velachery',
        area: 'South Chennai',
        lat: 13.0827,
        lng: 80.2707,
        rainfall: 45,
        waterLevel: 65,
        elevation: 5,
        riskScore: 72,
        riskLevel: 'High'
      },
      {
        name: 'Tambaram',
        area: 'South Chennai',
        lat: 12.9250,
        lng: 80.1269,
        rainfall: 52,
        waterLevel: 72,
        elevation: 3,
        riskScore: 78,
        riskLevel: 'Critical'
      },
      {
        name: 'Guindy',
        area: 'Central Chennai',
        lat: 13.0011,
        lng: 80.2270,
        rainfall: 35,
        waterLevel: 45,
        elevation: 8,
        riskScore: 45,
        riskLevel: 'Moderate'
      },
      {
        name: 'Adyar',
        area: 'East Chennai',
        lat: 13.0011,
        lng: 80.2270,
        rainfall: 25,
        waterLevel: 35,
        elevation: 12,
        riskScore: 35,
        riskLevel: 'Low'
      },
      {
        name: 'Besant Nagar',
        area: 'East Chennai',
        lat: 13.0011,
        lng: 80.2270,
        rainfall: 40,
        waterLevel: 55,
        elevation: 7,
        riskScore: 58,
        riskLevel: 'High'
      }
    ]);
    console.log(`✓ Created ${zones.length} zones`);

    // Create Flood Predictions
    const predictions = await FloodPrediction.insertMany([
      {
        zone: 'Velachery',
        riskScore: 72,
        riskLevel: 'High',
        rainfall: 45,
        waterLevel: 65,
        elevation: 5,
        location: { lat: 13.0827, lng: 80.2707 },
        timestamp: new Date()
      },
      {
        zone: 'Tambaram',
        riskScore: 78,
        riskLevel: 'Critical',
        rainfall: 52,
        waterLevel: 72,
        elevation: 3,
        location: { lat: 12.9250, lng: 80.1269 },
        timestamp: new Date()
      },
      {
        zone: 'Guindy',
        riskScore: 45,
        riskLevel: 'Moderate',
        rainfall: 35,
        waterLevel: 45,
        elevation: 8,
        location: { lat: 13.0011, lng: 80.2270 },
        timestamp: new Date()
      },
      {
        zone: 'Adyar',
        riskScore: 35,
        riskLevel: 'Low',
        rainfall: 25,
        waterLevel: 35,
        elevation: 12,
        location: { lat: 13.0011, lng: 80.2270 },
        timestamp: new Date()
      },
      {
        zone: 'Besant Nagar',
        riskScore: 58,
        riskLevel: 'High',
        rainfall: 40,
        waterLevel: 55,
        elevation: 7,
        location: { lat: 13.0011, lng: 80.2270 },
        timestamp: new Date()
      }
    ]);
    console.log(`✓ Created ${predictions.length} flood predictions`);

    // Create Shelters
    const shelters = await Shelter.insertMany([
      {
        name: 'Chennai Relief Center - Velachery',
        location: { lat: 13.0827, lng: 80.2707 },
        address: 'Velachery, Chennai',
        capacity: 500,
        occupancy: 120,
        contact: '9876543210',
        amenities: ['Medical', 'Food', 'Water', 'Bedding', 'Sanitation']
      },
      {
        name: 'Tambaram Community Shelter',
        location: { lat: 12.9250, lng: 80.1269 },
        address: 'Tambaram, Chennai',
        capacity: 800,
        occupancy: 250,
        contact: '9876543211',
        amenities: ['Medical', 'Food', 'Water', 'Bedding', 'Sanitation', 'Power']
      },
      {
        name: 'Guindy Emergency Shelter',
        location: { lat: 13.0011, lng: 80.2270 },
        address: 'Guindy, Chennai',
        capacity: 600,
        occupancy: 180,
        contact: '9876543212',
        amenities: ['Medical', 'Food', 'Water', 'Bedding']
      },
      {
        name: 'Adyar Safe Haven',
        location: { lat: 13.0011, lng: 80.2270 },
        address: 'Adyar, Chennai',
        capacity: 400,
        occupancy: 50,
        contact: '9876543213',
        amenities: ['Food', 'Water', 'Bedding']
      },
      {
        name: 'Besant Nagar Relief Hub',
        location: { lat: 13.0011, lng: 80.2270 },
        address: 'Besant Nagar, Chennai',
        capacity: 700,
        occupancy: 200,
        contact: '9876543214',
        amenities: ['Medical', 'Food', 'Water', 'Bedding', 'Sanitation', 'Power']
      }
    ]);
    console.log(`✓ Created ${shelters.length} shelters`);

    // Create Rescue Teams
    const rescueTeams = await RescueTeam.insertMany([
      {
        name: 'Alpha Rescue Team',
        members: 15,
        status: 'available',
        location: { lat: 13.0827, lng: 80.2707 },
        assignedZone: 'Velachery',
        equipment: ['Boats', 'Ropes', 'Life Jackets', 'Medical Kit', 'Communication Device'],
        contact: '9876543210'
      },
      {
        name: 'Beta Rescue Team',
        members: 12,
        status: 'deployed',
        location: { lat: 12.9250, lng: 80.1269 },
        assignedZone: 'Tambaram',
        equipment: ['Boats', 'Ropes', 'Life Jackets', 'Medical Kit', 'Helicopter'],
        contact: '9876543211'
      },
      {
        name: 'Gamma Rescue Team',
        members: 10,
        status: 'available',
        location: { lat: 13.0011, lng: 80.2270 },
        assignedZone: 'Guindy',
        equipment: ['Boats', 'Ropes', 'Life Jackets', 'Medical Kit'],
        contact: '9876543212'
      },
      {
        name: 'Delta Rescue Team',
        members: 8,
        status: 'busy',
        location: { lat: 13.0011, lng: 80.2270 },
        assignedZone: 'Adyar',
        equipment: ['Boats', 'Ropes', 'Life Jackets'],
        contact: '9876543213'
      },
      {
        name: 'Echo Rescue Team',
        members: 14,
        status: 'available',
        location: { lat: 13.0011, lng: 80.2270 },
        assignedZone: 'Besant Nagar',
        equipment: ['Boats', 'Ropes', 'Life Jackets', 'Medical Kit', 'Drones'],
        contact: '9876543214'
      }
    ]);
    console.log(`✓ Created ${rescueTeams.length} rescue teams`);

    // Create Police Stations
    const policeStations = await PoliceStation.insertMany([
      {
        name: 'Velachery Police Station',
        area: 'Velachery',
        lat: 13.0827,
        lng: 80.2707,
        phone: '9876543210',
        address: 'Velachery, Chennai'
      },
      {
        name: 'Tambaram Police Station',
        area: 'Tambaram',
        lat: 12.9250,
        lng: 80.1269,
        phone: '9876543211',
        address: 'Tambaram, Chennai'
      },
      {
        name: 'Guindy Police Station',
        area: 'Guindy',
        lat: 13.0011,
        lng: 80.2270,
        phone: '9876543212',
        address: 'Guindy, Chennai'
      }
    ]);
    console.log(`✓ Created ${policeStations.length} police stations`);

    // Create Ambulance Services
    const ambulances = await AmbulanceService.insertMany([
      {
        name: 'Emergency Ambulance - Velachery',
        area: 'Velachery',
        lat: 13.0827,
        lng: 80.2707,
        phone: '9876543210',
        status: 'available'
      },
      {
        name: 'Emergency Ambulance - Tambaram',
        area: 'Tambaram',
        lat: 12.9250,
        lng: 80.1269,
        phone: '9876543211',
        status: 'available'
      },
      {
        name: 'Emergency Ambulance - Guindy',
        area: 'Guindy',
        lat: 13.0011,
        lng: 80.2270,
        phone: '9876543212',
        status: 'busy'
      }
    ]);
    console.log(`✓ Created ${ambulances.length} ambulance services`);

    // Create Hospitals
    const hospitals = await Hospital.insertMany([
      {
        name: 'Apollo Hospital Chennai',
        area: 'Velachery',
        lat: 13.0827,
        lng: 80.2707,
        phone: '9876543210',
        beds: 500,
        occupiedBeds: 350,
        address: 'Velachery, Chennai'
      },
      {
        name: 'Fortis Hospital Tambaram',
        area: 'Tambaram',
        lat: 12.9250,
        lng: 80.1269,
        phone: '9876543211',
        beds: 400,
        occupiedBeds: 280,
        address: 'Tambaram, Chennai'
      },
      {
        name: 'Government Hospital Guindy',
        area: 'Guindy',
        lat: 13.0011,
        lng: 80.2270,
        phone: '9876543212',
        beds: 300,
        occupiedBeds: 200,
        address: 'Guindy, Chennai'
      }
    ]);
    console.log(`✓ Created ${hospitals.length} hospitals`);

    console.log('\n✅ Database initialization completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Zones: ${zones.length}`);
    console.log(`   - Flood Predictions: ${predictions.length}`);
    console.log(`   - Shelters: ${shelters.length}`);
    console.log(`   - Rescue Teams: ${rescueTeams.length}`);
    console.log(`   - Police Stations: ${policeStations.length}`);
    console.log(`   - Ambulance Services: ${ambulances.length}`);
    console.log(`   - Hospitals: ${hospitals.length}`);
    console.log('\n🚀 Ready to start the backend server!\n');

    process.exit(0);
  } catch (err) {
    console.error('✗ Error initializing database:', err.message);
    process.exit(1);
  }
};

connectDB().then(() => initializeDatabase());
