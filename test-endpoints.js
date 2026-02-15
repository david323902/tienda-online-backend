// test-endpoints.js
const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

async function testEndpoints() {
  console.log('🧪 Probando endpoints críticos...\n');
  
  const tests = [
    { name: 'Health Check', method: 'GET', url: `${BASE_URL}/health`, expected: 200 },
    { name: 'Listar Productos', method: 'GET', url: `${BASE_URL}/products`, expected: 200 },
    { name: 'Login (debería fallar sin credenciales)', method: 'POST', url: `${BASE_URL}/auth/login`, expected: 400 },
  ];

  for (const test of tests) {
    try {
      const response = await axios({
        method: test.method,
        url: test.url,
        validateStatus: () => true // Aceptar cualquier status
      });
      
      const passed = response.status === test.expected;
      console.log(`${passed ? '✅' : '❌'} ${test.name}`);
      console.log(`   Status: ${response.status} (esperado: ${test.expected})`);
      
      if (!passed && response.data) {
        console.log(`   Respuesta: ${JSON.stringify(response.data).substring(0, 100)}...`);
      }
    } catch (error) {
      console.log(`❌ ${test.name} - ERROR: ${error.message}`);
    }
    console.log('');
  }
}

testEndpoints();