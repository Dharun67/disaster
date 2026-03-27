#!/usr/bin/env node

const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  bold: '\x1b[1m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  header: (msg) => console.log(`\n${colors.bold}${colors.blue}${msg}${colors.reset}\n`)
};

const tests = {
  passed: 0,
  failed: 0,
  warnings: 0
};

const verifyIntegration = async () => {
  log.header('🔍 GeoGuard Integration Verification');

  // Test 1: Environment Variables
  log.header('1️⃣  Environment Variables');
  try {
    const requiredVars = ['MONGODB_URI', 'FRONTEND_URL', 'JWT_SECRET'];
    let allPresent = true;
    
    requiredVars.forEach(varName => {
      if (process.env[varName]) {
        log.success(`${varName} is configured`);
        tests.passed++;
      } else {
        log.warn(`${varName} is not configured`);
        tests.warnings++;
        allPresent = false;
      }
    });
  } catch (err) {
    log.error(`Environment check failed: ${err.message}`);
    tests.failed++;
  }

  // Test 2: MongoDB Connection
  log.header('2️⃣  MongoDB Connection');
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/geoguard', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    log.success('MongoDB connected successfully');
    tests.passed++;

    // Check collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    log.info(`Found ${collections.length} collections`);
    collections.forEach(col => {
      log.info(`  - ${col.name}`);
    });

    await mongoose.connection.close();
  } catch (err) {
    log.error(`MongoDB connection failed: ${err.message}`);
    tests.failed++;
  }

  // Test 3: Backend API Health
  log.header('3️⃣  Backend API Health');
  try {
    const response = await axios.get('http://localhost:5000/api/health', {
      timeout: 5000
    });
    
    if (response.status === 200) {
      log.success('Backend API is running');
      tests.passed++;
      log.info(`Status: ${response.data.status}`);
      log.info(`Database: ${response.data.database}`);
      log.info(`Version: ${response.data.version}`);
    }
  } catch (err) {
    log.error(`Backend API health check failed: ${err.message}`);
    log.warn('Make sure backend is running on port 5000');
    tests.failed++;
  }

  // Test 4: Backend Endpoints
  log.header('4️⃣  Backend Endpoints');
  const endpoints = [
    { method: 'GET', path: '/api/flood-predictions', name: 'Flood Predictions' },
    { method: 'GET', path: '/api/shelters', name: 'Shelters' },
    { method: 'GET', path: '/api/rescue-teams', name: 'Rescue Teams' },
    { method: 'GET', path: '/api/zones', name: 'Zones' },
    { method: 'GET', path: '/api/police-stations', name: 'Police Stations' },
    { method: 'GET', path: '/api/ambulance-services', name: 'Ambulance Services' },
    { method: 'GET', path: '/api/hospitals', name: 'Hospitals' }
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await axios.get(`http://localhost:5000${endpoint.path}`, {
        timeout: 5000
      });
      
      if (response.status === 200) {
        const dataCount = Array.isArray(response.data) ? response.data.length : 1;
        log.success(`${endpoint.name}: ${dataCount} records`);
        tests.passed++;
      }
    } catch (err) {
      log.error(`${endpoint.name} endpoint failed`);
      tests.failed++;
    }
  }

  // Test 5: CORS Configuration
  log.header('5️⃣  CORS Configuration');
  try {
    const response = await axios.get('http://localhost:5000/api/health', {
      headers: {
        'Origin': 'http://localhost:3000'
      },
      timeout: 5000
    });
    
    if (response.headers['access-control-allow-origin']) {
      log.success('CORS is properly configured');
      tests.passed++;
      log.info(`Allowed origin: ${response.headers['access-control-allow-origin']}`);
    }
  } catch (err) {
    log.warn('CORS check inconclusive');
    tests.warnings++;
  }

  // Test 6: Authentication Flow
  log.header('6️⃣  Authentication Flow');
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'test@example.com'
    }, {
      timeout: 5000
    });
    
    if (response.status === 200 && response.data.success) {
      log.success('Authentication endpoint is working');
      tests.passed++;
      log.info(`OTP sent to: ${response.data.email}`);
    }
  } catch (err) {
    if (err.response?.status === 400) {
      log.success('Authentication endpoint is working (validation working)');
      tests.passed++;
    } else {
      log.error(`Authentication endpoint failed: ${err.message}`);
      tests.failed++;
    }
  }

  // Test 7: Data Integrity
  log.header('7️⃣  Data Integrity');
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/geoguard', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });

    const db = mongoose.connection.db;
    
    const collections = {
      'users': 'Users',
      'floodpredictions': 'Flood Predictions',
      'shelters': 'Shelters',
      'rescueteams': 'Rescue Teams',
      'zones': 'Zones'
    };

    for (const [collName, displayName] of Object.entries(collections)) {
      const count = await db.collection(collName).countDocuments();
      if (count > 0) {
        log.success(`${displayName}: ${count} documents`);
        tests.passed++;
      } else {
        log.warn(`${displayName}: No documents found`);
        tests.warnings++;
      }
    }

    await mongoose.connection.close();
  } catch (err) {
    log.error(`Data integrity check failed: ${err.message}`);
    tests.failed++;
  }

  // Test 8: Frontend Configuration
  log.header('8️⃣  Frontend Configuration');
  try {
    const fs = require('fs');
    const envPath = './frontend/.env';
    
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      if (envContent.includes('REACT_APP_API_URL')) {
        log.success('Frontend .env file exists and configured');
        tests.passed++;
      } else {
        log.warn('Frontend .env file exists but missing REACT_APP_API_URL');
        tests.warnings++;
      }
    } else {
      log.warn('Frontend .env file not found');
      tests.warnings++;
    }
  } catch (err) {
    log.warn(`Frontend configuration check: ${err.message}`);
    tests.warnings++;
  }

  // Summary
  log.header('📊 Verification Summary');
  console.log(`${colors.green}✓ Passed: ${tests.passed}${colors.reset}`);
  console.log(`${colors.red}✗ Failed: ${tests.failed}${colors.reset}`);
  console.log(`${colors.yellow}⚠ Warnings: ${tests.warnings}${colors.reset}`);

  const totalTests = tests.passed + tests.failed + tests.warnings;
  const passPercentage = Math.round((tests.passed / totalTests) * 100);

  console.log(`\n${colors.bold}Overall Status: ${passPercentage}% Complete${colors.reset}`);

  if (tests.failed === 0 && tests.warnings === 0) {
    log.success('\n🎉 All systems operational! GeoGuard is ready to use.\n');
    process.exit(0);
  } else if (tests.failed === 0) {
    log.warn('\n⚠️  System operational with some warnings. Check above for details.\n');
    process.exit(0);
  } else {
    log.error('\n❌ Some tests failed. Please check the errors above.\n');
    process.exit(1);
  }
};

verifyIntegration().catch(err => {
  log.error(`Verification failed: ${err.message}`);
  process.exit(1);
});
