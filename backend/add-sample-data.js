const mongoose = require('mongoose');
require('dotenv').config();

const { FloodPrediction, Shelter, RescueTeam, SOSAlert } = require('./models/schemas');

const addSampleData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/geoguard', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Clear existing data
    await FloodPrediction.deleteMany({});
    await Shelter.deleteMany({});
    await RescueTeam.deleteMany({});
    await SOSAlert.deleteMany({});

    // Add flood predictions
    const predictions = [
      {
        zone: 'T. Nagar',
        riskScore: 75,
        riskLevel: 'High',
        rainfall: 45,
        waterLevel: 80,
        elevation: 15,
        location: { lat: 13.0418, lng: 80.2341 },
        timestamp: new Date()
      },
      {
        zone: 'Velachery',
        riskScore: 25,
        riskLevel: 'Low',
        rainfall: 10,
        waterLevel: 30,
        elevation: 25,
        location: { lat: 12.9756, lng: 80.2207 },
        timestamp: new Date()
      },
      {
        zone: 'Anna Nagar',
        riskScore: 55,
        riskLevel: 'Moderate',
        rainfall: 25,
        waterLevel: 60,
        elevation: 20,
        location: { lat: 13.0850, lng: 80.2101 },
        timestamp: new Date()
      },
      {
        zone: 'Adyar',
        riskScore: 85,
        riskLevel: 'Critical',
        rainfall: 60,
        waterLevel: 90,
        elevation: 10,
        location: { lat: 13.0067, lng: 80.2206 },
        timestamp: new Date()
      },
      {
        zone: 'Mylapore',
        riskScore: 40,
        riskLevel: 'Moderate',
        rainfall: 20,
        waterLevel: 50,
        elevation: 18,
        location: { lat: 13.0339, lng: 80.2619 },
        timestamp: new Date()
      }
    ];

    await FloodPrediction.insertMany(predictions);

    // Add shelters
    const shelters = [
      {
        name: 'Anna Nagar Community Center',
        location: { lat: 13.0850, lng: 80.2101 },
        address: 'Anna Nagar West, Chennai',
        capacity: 500,
        occupancy: 120,
        amenities: ['Food', 'Medical', 'Water', 'Electricity'],
        contact: '+91 9876543210',
        status: 'active'
      },
      {
        name: 'Velachery Relief Center',
        location: { lat: 12.9756, lng: 80.2207 },
        address: 'Velachery Main Road, Chennai',
        capacity: 300,
        occupancy: 80,
        amenities: ['Food', 'Water', 'Medical'],
        contact: '+91 9876543211',
        status: 'active'
      }
    ];

    await Shelter.insertMany(shelters);

    // Add rescue teams
    const teams = [
      {
        name: 'Alpha Rescue Team',
        location: { lat: 13.0827, lng: 80.2707 },
        members: 12,
        equipment: ['Boats', 'Medical Kit', 'Communication'],
        status: 'available',
        contact: '+91 9876543212'
      },
      {
        name: 'Beta Emergency Response',
        location: { lat: 13.0418, lng: 80.2341 },
        members: 8,
        equipment: ['Rescue Gear', 'First Aid', 'Vehicles'],
        status: 'deployed',
        contact: '+91 9876543213'
      }
    ];

    await RescueTeam.insertMany(teams);

    // Add sample SOS alerts
    const alerts = [
      {
        name: 'Emergency Caller',
        phone: '+91 9876543214',
        location: 'T. Nagar, Chennai',
        message: 'Trapped in building, water level rising',
        lat: 13.0418,
        lng: 80.2341,
        status: 'active'
      }
    ];

    await SOSAlert.insertMany(alerts);

    console.log('✓ Sample data added successfully');
    console.log(`- ${predictions.length} flood predictions`);
    console.log(`- ${shelters.length} shelters`);
    console.log(`- ${teams.length} rescue teams`);
    console.log(`- ${alerts.length} SOS alerts`);
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};

addSampleData();