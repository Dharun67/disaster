const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  console.log('\n🧪 Testing MongoDB Atlas Connection\n');
  console.log('=' .repeat(60));
  
  const uri = process.env.MONGODB_URI;
  
  console.log('\n📋 Connection String:');
  console.log(uri.substring(0, 50) + '...');
  
  console.log('\n🔍 Checking Connection String Format:');
  
  if (!uri) {
    console.log('❌ MONGODB_URI not found in .env');
    process.exit(1);
  }
  
  if (!uri.startsWith('mongodb+srv://')) {
    console.log('❌ Connection string must start with: mongodb+srv://');
    process.exit(1);
  }
  
  if (!uri.includes('@')) {
    console.log('❌ Connection string must include: @');
    process.exit(1);
  }
  
  if (!uri.includes('.mongodb.net')) {
    console.log('❌ Connection string must include: .mongodb.net');
    process.exit(1);
  }
  
  if (!uri.includes('/geoguard')) {
    console.log('❌ Connection string must include: /geoguard (database name)');
    process.exit(1);
  }
  
  console.log('✓ Connection string format looks correct');
  
  console.log('\n🔗 Attempting to connect...');
  
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    
    console.log('✅ Successfully connected to MongoDB Atlas!');
    
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log(`\n📊 Found ${collections.length} collections:`);
    collections.forEach(col => {
      console.log(`   • ${col.name}`);
    });
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ Connection test PASSED!');
    console.log('='.repeat(60) + '\n');
    
    process.exit(0);
    
  } catch (error) {
    console.log('\n❌ Connection FAILED!');
    console.log('\n📌 Error Details:');
    console.log(error.message);
    
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check if username and password are correct');
    console.log('2. Check if special characters are URL encoded');
    console.log('3. Check if cluster name is correct');
    console.log('4. Check if /geoguard is in the connection string');
    console.log('5. Check if your IP is whitelisted in MongoDB Atlas');
    console.log('6. Check if cluster is running (not paused)');
    
    console.log('\n📝 Your Connection String:');
    console.log(uri);
    
    console.log('\n' + '='.repeat(60) + '\n');
    
    process.exit(1);
  }
}

testConnection();
