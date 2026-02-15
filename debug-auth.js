const { User, sequelize } = require('./src/models');
const bcrypt = require('bcrypt');
const axios = require('axios');

async function debugAuth() {
  try {
    console.log('🔍 DIAGNÓSTICO DE AUTENTICACIÓN\n');

    // 1. Verificar Usuario en BD
    console.log('1. Verificando usuario en Base de Datos...');
    const email = 'cliente@tienda.com';
    const password = 'cliente123';

    const user = await User.findOne({ where: { email } });

    if (!user) {
      console.log('❌ El usuario no existe en la base de datos.');
      console.log('   Solución: Ejecuta "node seed-data.js"');
      return;
    }

    console.log(`✅ Usuario encontrado: ${user.email} (ID: ${user.id_usuario})`);
    console.log(`   Hash almacenado: ${user.password_hash.substring(0, 10)}...`);

    // 2. Verificar Contraseña (Bcrypt)
    console.log('\n2. Verificando contraseña con bcrypt...');
    const isMatch = await bcrypt.compare(password, user.password_hash);
    
    if (isMatch) {
      console.log('✅ La contraseña coincide con el hash en la BD.');
    } else {
      console.log('❌ La contraseña NO coincide con el hash.');
      console.log('   Posible causa: El usuario se creó anteriormente con una contraseña diferente o sin encriptar.');
      
      // Intento de arreglo automático
      console.log('   🛠️ Intentando arreglar contraseña automáticamente...');
      user.password_hash = password; // El hook beforeUpdate lo encriptará
      await user.save();
      console.log('   ✅ Contraseña actualizada y re-encriptada. Intenta el login de nuevo.');
    }

    // 3. Probar Endpoint
    console.log('\n3. Probando Endpoint HTTP (http://localhost:3000/api/auth/login)...');
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        email,
        password
      });
      console.log('✅ Endpoint responde correctamente:');
      console.log('   Status:', response.status);
      console.log('   Token recibido:', response.data.token ? 'SÍ' : 'NO');
    } catch (apiError) {
      console.log('❌ Error en el endpoint:');
      if (apiError.response) {
        console.log('   Status:', apiError.response.status);
        console.log('   Mensaje:', apiError.response.data);
      } else {
        console.log('   Error de conexión:', apiError.message);
        console.log('   ¿El servidor está corriendo en el puerto 3000?');
      }
    }

  } catch (error) {
    console.error('❌ Error inesperado:', error);
  } finally {
    // Cerrar conexión para terminar el script limpiamente
    if (sequelize) await sequelize.close();
  }
}

debugAuth();