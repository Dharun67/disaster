const mongoose = require('mongoose');
require('dotenv').config();

async function diagnoseConnection() {
  console.log('\n🔍 GeoGuard MongoDB Connection Diagnostic\n');
  console.log('=' .repeat(70));
  
  const uri = process.env.MONGODB_URI;
  
  // Check 1: Connection String Exists
  console.log('\n✓ Check 1: Connection String Exists');
  if (!uri) {
    console.log('  ❌ MONGODB_URI not found in .env file');
    process.exit(1);
  }
  console.log('  ✅ Connection string found');
  console.log(`     ${uri}`);
  
  // Check 2: Determine Connection Type
  console.log('\n✓ Check 2: Determine Connection Type');
  let connectionType = 'Unknown';
  if (uri.includes('mongodb+srv://')) {
    connectionType = 'MongoDB Atlas (Cloud)';
  } else if (uri.includes('localhost') || uri.includes('127.0.0.1')) {
    connectionType = 'Local MongoDB';
  }
  console.log(`  ✅ Connection Type: ${connectionType}`);
  
  // Check 3: Parse Connection String
  console.log('\n✓ Check 3: Parse Connection String');
  try {
    const url = new URL(uri);
    console.log(`  ✅ Valid URI format`);
    console.log(`     Protocol: ${url.protocol}`);
    console.log(`     Hostname: ${url.hostname}`);
    console.log(`     Port: ${url.port || 'default'}`);
    console.log(`     Database: ${url.pathname}`);
  } catch (err) {
    console.log(`  ❌ Invalid URI format: ${err.message}`);
    process.exit(1);
  }
  
  // Check 4: Test Network Connectivity
  console.log('\n✓ Check 4: Test Network Connectivity');
  console.log('  Attempting to connect to MongoDB...');
  console.log('  (This may take 10-15 seconds)');
  
  try {
    const connection = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 15000
    });
    
    console.log('  ✅ Successfully connected to MongoDB!');
    
    // Check 5: Verify Database
    console.log('\n✓ Check 5: Verify Database');
    const db = mongoose.connection.db;
    
    try {
      const adminDb = db.admin();
      const status = await adminDb.ping();
      console.log('  ✅ Database ping successful');
    } catch (err) {
      console.log(`  ⚠️  Database ping failed: ${err.message}`);
    }
    
    // Check 6: List Collections
    console.log('\n✓ Check 6: List Collections');
    const collections = await db.listCollections().toArray();
    console.log(`  ✅ Found ${collections.length} collections:`);
    if (collections.length > 0) {
      collections.forEach(col => {
        console.log(`     • ${col.name}`);
      });
    } else {
      console.log('     (Database is empty - ready for initialization)');
    }
    
    console.log('\n' + '='.repeat(70));
    console.log('✅ ALL CHECKS PASSED! Connection is working correctly.');
    console.log('='.repeat(70) + '\n');
    
    console.log('🚀 Next Steps:');
    console.log('   1. Run: node init-db.js');
    console.log('   2. Run: npm start');
    console.log('   3. Open: http://localhost:3000\n');
    
    process.exit(0);
    
  } catch (error) {
    console.log(`  ❌ Connection failed!`);
    console.log(`\n📌 Error Details:`);
    console.log(`   ${error.message}`);
    
    console.log('\n' + '='.repeat(70));
    console.log('❌ CONNECTION FAILED - TROUBLESHOOTING');
    console.log('='.repeat(70));
    
    console.log('\n🔧 Troubleshooting Steps:');
    
    if (uri.includes('localhost') || uri.includes('127.0.0.1')) {
      console.log('\n📍 Local MongoDB Connection Issue:');
      console.log('\n1. Check if MongoDB Service is Running:');
      console.log('   • Run: net start MongoDB');
      console.log('   • Or check Services (services.msc)');
      
      console.log('\n2. Check if MongoDB is Installed:');
      console.log('   • Run: mongosh --version');
      console.log('   • If not installed, download from:');
      console.log('     https://www.mongodb.com/try/download/community');
      
      console.log('\n3. Check if Port 27017 is Available:');
      console.log('   • Run: netstat -ano | findstr :27017');
      console.log('   • If nothing shows, MongoDB is not running');
      
      console.log('\n4. Try Starting MongoDB Manually:');
      console.log('   • Run: mongod');
      console.log('   • Keep this window open');
      console.log('   • Open new terminal and try again');
    } else {
      console.log('\n📍 MongoDB Atlas Connection Issue:');
      console.log('\n1. Check IP Whitelist:');
      console.log('   • Go to: https://cloud.mongodb.com');
      console.log('   • Network Access → Add your IP');
      console.log('   • Wait 2-3 minutes');
      
      console.log('\n2. Check Cluster Status:');
      console.log('   • Go to: https://cloud.mongodb.com');
      console.log('   • Databases → Check if cluster is running');
      console.log('   • If paused, click Resume');
      
      console.log('\n3. Verify Credentials:');
      console.log('   • Username: dharun143');
      console.log('   • Password: dbpass');
      console.log('   • Go to Database Access to verify');
    }
    
    console.log('\n📋 Your Connection String:');
    console.log(`   ${uri}`);
    
    console.log('\n' + '='.repeat(70) + '\n');
    
    process.exit(1);
  }
}

diagnoseConnection();
