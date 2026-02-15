const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

async function testAllEndpoints() {
  console.log('🧪 TEST FINAL - TODOS LOS ENDPOINTS\n');
  
  const tests = [
    { name: 'Health Check', method: 'GET', url: `${BASE_URL}/health`, expected: 200 },
    { name: 'WhatsApp Contact Info', method: 'GET', url: `${BASE_URL}/whatsapp/contact-info`, expected: 200 },
    { name: 'Listar Productos', method: 'GET', url: `${BASE_URL}/products`, expected: 200 },
    { name: 'Login (sin credenciales)', method: 'POST', url: `${BASE_URL}/auth/login`, expected: 400 },
    { name: 'Ruta raíz', method: 'GET', url: 'http://localhost:3000', expected: 200 },
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      const response = await axios({
        method: test.method,
        url: test.url,
        validateStatus: () => true
      });
      
      const success = response.status === test.expected;
      
      if (success) {
        console.log(`✅ ${test.name}`);
        console.log(`   Status: ${response.status} (esperado: ${test.expected})`);
        passed++;
      } else {
        console.log(`❌ ${test.name}`);
        console.log(`   Status: ${response.status} (esperado: ${test.expected})`);
        console.log(`   Respuesta: ${JSON.stringify(response.data).substring(0, 100)}...`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${test.name} - ERROR: ${error.message}`);
      failed++;
    }
    console.log('');
  }

  console.log('📊 RESUMEN:');
  console.log(`   ✅ Pasados: ${passed}`);
  console.log(`   ❌ Fallados: ${failed}`);
  console.log(`   📈 Tasa de éxito: ${((passed/(passed+failed))*100).toFixed(1)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 ¡TODO FUNCIONA PERFECTAMENTE!');
    console.log('🚀 Tu backend está listo para producción.');
  }
}

testAllEndpoints();