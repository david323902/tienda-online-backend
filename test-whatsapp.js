const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

async function testWhatsAppEndpoint() {
  console.log('🧪 Probando Endpoint de WhatsApp...\n');

  const url = `${BASE_URL}/whatsapp/contact-info`;

  try {
    console.log(`1. Realizando petición GET a: ${url}`);
    const response = await axios.get(url);

    // Verificación 1: Estado de la respuesta
    if (response.status === 200) {
      console.log(`   ✅ Estado de la respuesta: ${response.status} (OK)`);
    } else {
      throw new Error(`Estado de respuesta inesperado: ${response.status}`);
    }

    const data = response.data;

    // Verificación 2: Estructura de la respuesta
    if (data && data.success === true && data.data) {
      console.log('   ✅ La respuesta tiene la estructura correcta (success: true, data: {...})');
    } else {
      throw new Error(`La estructura de la respuesta es incorrecta: ${JSON.stringify(data)}`);
    }

    // Verificación 3: Contenido de los datos
    const { phoneNumber, defaultMessage, whatsappLink } = data.data;
    console.log('   ✅ Verificando contenido de los datos...');

    if (typeof phoneNumber === 'string' && phoneNumber.length > 0) {
      console.log(`      - phoneNumber: OK ("${phoneNumber}")`);
    } else {
      throw new Error(`phoneNumber es inválido: ${phoneNumber}`);
    }

    if (typeof defaultMessage === 'string' && defaultMessage.length > 0) {
      console.log(`      - defaultMessage: OK ("${defaultMessage}")`);
    } else {
      throw new Error(`defaultMessage es inválido: ${defaultMessage}`);
    }

    if (typeof whatsappLink === 'string' && whatsappLink.startsWith('https://wa.me/')) {
      console.log(`      - whatsappLink: OK ("${whatsappLink}")`);
    } else {
      throw new Error(`whatsappLink es inválido: ${whatsappLink}`);
    }

    console.log('\n🎉 ¡Prueba del endpoint de WhatsApp completada con éxito!');

  } catch (error) {
    console.error('\n❌ ERROR DURANTE LA PRUEBA DE WHATSAPP:');
    console.error(`   - Mensaje: ${error.message}`);
    console.log('\n🔥 La prueba falló.');
  }
}

testWhatsAppEndpoint();