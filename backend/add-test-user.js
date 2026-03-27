const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const { User } = require('./models/schemas');

const addTestUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/geoguard', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const hashedPassword = await bcrypt.hash('test123', 10);
    
    const existingUser = await User.findOne({ email: 'test@geoguard.com' });
    if (existingUser) {
      console.log('Test user already exists');
      process.exit(0);
    }

    const user = await User.create({
      email: 'test@geoguard.com',
      name: 'Test User',
      phone: '+91 9876543210',
      password: hashedPassword,
      isVerified: true,
      role: 'user'
    });

    console.log('✓ Test user created successfully');
    console.log('Email: test@geoguard.com');
    console.log('Password: test123');
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};

addTestUser();
