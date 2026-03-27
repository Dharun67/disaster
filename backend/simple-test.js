const mongoose = require('mongoose');
require('dotenv').config();

console.log('\n🔗 Testing MongoDB Connection...\n');

const uri = process.env.MONGODB_URI;
console.log('Connection String:', uri.substring(0, 60) + '...\n');

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
})
.then(() => {
  console.log('✅ MongoDB Connected Successfully!\n');
  console.log('Database:', mongoose.connection.name);
  console.log('Host:', mongoose.connection.host);
  console.log('Port:', mongoose.connection.port);
  console.log('\n✅ Connection is working!\n');
  process.exit(0);
})
.catch(err => {
  console.log('❌ Connection Failed!\n');
  console.log('Error:', err.message);
  console.log('\n⚠️  Make sure:');
  console.log('1. Your IP is whitelisted in MongoDB Atlas');
  console.log('2. Cluster is RUNNING (not paused)');
  console.log('3. Username and password are correct');
  console.log('4. Database name is correct\n');
  process.exit(1);
});
