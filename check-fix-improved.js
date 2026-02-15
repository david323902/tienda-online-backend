const fs = require('fs');
const path = require('path');

console.log('🔧 VERIFICANDO PROYECTO PARA PRODUCCIÓN\n');

const requiredFiles = [
  'src/models/index.js',
  'src/models/user.js',
  'src/models/product.js',
  'src/models/cart.js',
  'src/models/cartitem.js',
  'src/models/order.js',
  'src/models/orderitem.js',
  'src/models/payment.js',
  'src/server.js',
  '.env'
];

const optionalFiles = [
  'src/controllers/whatsappController.js',
  'src/routes/whatsappRoutes.js'
];

let missingRequired = [];
let missingOptional = [];

// Verificar archivos requeridos
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - NO EXISTE`);
    missingRequired.push(file);
  }
});

// Verificar archivos opcionales
optionalFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`⚠️  ${file} - Opcional`);
    missingOptional.push(file);
  }
});

console.log('\n📋 RESUMEN:');
if (missingRequired.length === 0) {
  console.log('✅ Todos los archivos requeridos existen');
} else {
  console.log(`❌ Faltan ${missingRequired.length} archivos requeridos:`);
  missingRequired.forEach(file => console.log(`   - ${file}`));
}

// Verificar variables de entorno críticas
console.log('\n🔐 VARIABLES DE ENTORNO:');
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const requiredVars = ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD', 'JWT_SECRET'];
  
  requiredVars.forEach(varName => {
    if (envContent.includes(`${varName}=`)) {
      console.log(`✅ ${varName}`);
    } else {
      console.log(`❌ ${varName} - No configurada`);
    }
  });
}

console.log('\n🚀 COMANDOS PARA PRODUCCIÓN:');
console.log('   1. npm ci --only=production');
console.log('   2. npx sequelize-cli db:migrate');
console.log('   3. pm2 start src/server.js --name "tienda-backend"');
console.log('   4. pm2 save');
console.log('   5. pm2 startup');