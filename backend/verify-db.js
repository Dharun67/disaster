const mongoose = require('mongoose');
require('dotenv').config();

async function verifyDatabaseConnection() {
  console.log('\n🔍 GeoGuard Database Connection Verification\n');
  console.log('=' .repeat(50));

  try {
    // Step 1: Check environment variables
    console.log('\n1️⃣  Checking Environment Variables...');
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('❌ MONGODB_URI not found in .env file');
      process.exit(1);
    }
    console.log('✓ MONGODB_URI found');
    console.log(`   Connection: ${mongoUri.substring(0, 50)}...`);

    // Step 2: Connect to MongoDB
    console.log('\n2️⃣  Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✓ Connected to MongoDB Atlas');

    // Step 3: Check database
    console.log('\n3️⃣  Checking Database...');
    const db = mongoose.connection.db;
    const adminDb = db.admin();
    const status = await adminDb.ping();
    console.log('✓ Database ping successful');

    // Step 4: List collections
    console.log('\n4️⃣  Listing Collections...');
    const collections = await db.listCollections().toArray();
    console.log(`✓ Found ${collections.length} collections:`);
    
    const collectionStats = {};
    for (const collection of collections) {
      const count = await db.collection(collection.name).countDocuments();
      collectionStats[collection.name] = count;
      console.log(`   • ${collection.name}: ${count} documents`);
    }

    // Step 5: Verify required collections
    console.log('\n5️⃣  Verifying Required Collections...');
    const requiredCollections = [
      'zones',
      'flood_predictions',
      'shelters',
      'rescue_teams',
      'police_stations',
      'ambulance_services',
      'hospitals',
      'sos_alerts',
      'user_reports',
      'disaster_alerts'
    ];

    let allPresent = true;
    for (const collection of requiredCollections) {
      if (collectionStats[collection] !== undefined) {
        console.log(`✓ ${collection}: ${collectionStats[collection]} documents`);
      } else {
        console.log(`⚠ ${collection}: NOT FOUND`);
        allPresent = false;
      }
    }

    // Step 6: Summary
    console.log('\n' + '='.repeat(50));
    console.log('\n📊 Connection Summary:');
    console.log(`   Database: ${mongoUri.split('/')[3]}`);
    console.log(`   Collections: ${collections.length}`);
    console.log(`   Total Documents: ${Object.values(collectionStats).reduce((a, b) => a + b, 0)}`);
    
    if (allPresent) {
      console.log('\n✅ All required collections present!');
      console.log('✅ Database is ready for use!');
    } else {
      console.log('\n⚠️  Some collections are missing.');
      console.log('   Run: node init-db.js to initialize database');
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Step 7: Test API endpoints
    console.log('6️⃣  Testing API Endpoints...');
    const testEndpoints = [
      { method: 'GET', path: '/api/health', description: 'Health Check' },
      { method: 'GET', path: '/api/db-status', description: 'Database Status' },
      { method: 'GET', path: '/api/zones', description: 'Get Zones' },
      { method: 'GET', path: '/api/shelters', description: 'Get Shelters' },
      { method: 'GET', path: '/api/rescue-teams', description: 'Get Rescue Teams' }
    ];

    console.log('\n   To test endpoints, start the backend server:');
    console.log('   cd backend && npm start');
    console.log('\n   Then test with:');
    testEndpoints.forEach(endpoint => {
      console.log(`   curl http://localhost:5000${endpoint.path}`);
    });

    console.log('\n✅ Database verification complete!\n');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Connection Error:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Verify MongoDB Atlas connection string in .env');
    console.error('2. Check if MongoDB Atlas cluster is active');
    console.error('3. Verify IP whitelist in MongoDB Atlas');
    console.error('4. Check internet connection');
    console.error('5. Ensure credentials are correct\n');
    process.exit(1);
  }
}

verifyDatabaseConnection();
