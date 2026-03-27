const axios = require('axios');

console.log('🔍 Testing GeoGuard Services...\n');

async function testServices() {
  const tests = [
    {
      name: 'Backend Health',
      url: 'http://localhost:5000/api/health',
      expected: 'GeoGuard Backend Running'
    },
    {
      name: 'AI Service Health',
      url: 'http://localhost:5001/api/health',
      expected: 'AI Service Running'
    }
  ];

  for (const test of tests) {
    try {
      const response = await axios.get(test.url, { timeout: 5000 });
      if (response.data.status && response.data.status.includes(test.expected)) {
        console.log(`✅ ${test.name}: PASSED`);
      } else {
        console.log(`⚠️  ${test.name}: RUNNING (unexpected response)`);
      }
    } catch (error) {
      console.log(`❌ ${test.name}: FAILED (${error.message})`);
      console.log(`   Make sure service is running on ${test.url}`);
    }
  }

  console.log('\n📊 Test Summary:');
  console.log('If all tests passed, your GeoGuard platform is ready!');
  console.log('Open http://localhost:3000 in your browser\n');
}

testServices();
