const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

// Configuración del usuario de prueba
const TEST_USER = {
  name: 'Test API User',
  email: 'test_api_user@example.com',
  password: 'password123',
  phone: '555-0100'
};

let authToken = null;

async function authenticate() {
  console.log('1. 🔐 Autenticando usuario...');
  try {
    // 1. Intentar Login
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: TEST_USER.email,
      password: TEST_USER.password
    });
    authToken = loginRes.data.token;
    console.log('   ✅ Login exitoso');
  } catch (error) {
    // 2. Si falla (401/404), intentar Registro
    if (error.response && (error.response.status === 401 || error.response.status === 404)) {
      console.log('   ⚠️ Usuario no encontrado o credenciales inválidas. Intentando registro...');
      try {
        const registerRes = await axios.post(`${BASE_URL}/auth/register`, TEST_USER);
        // Si el registro devuelve token, úsalo; si no, haz login
        authToken = registerRes.data.token;
        
        if (!authToken) {
           const loginAfterReg = await axios.post(`${BASE_URL}/auth/login`, {
             email: TEST_USER.email,
             password: TEST_USER.password
           });
           authToken = loginAfterReg.data.token;
        }
        console.log('   ✅ Registro exitoso y logueado');
      } catch (regError) {
        console.error('   ❌ Error en registro:', regError.response ? regError.response.data : regError.message);
        throw new Error('No se pudo autenticar');
      }
    } else {
      console.error('   ❌ Error en login:', error.response ? error.response.data : error.message);
      throw error;
    }
  }
}

async function getProduct() {
  console.log('2. 📦 Obteniendo productos...');
  try {
    const res = await axios.get(`${BASE_URL}/products`);
    const products = res.data;
    if (!Array.isArray(products) || products.length === 0) {
      throw new Error('No hay productos disponibles. Ejecuta "node seed-data.js" primero.');
    }
    const product = products[0];
    // Manejar posibles nombres de campos (id vs id_producto)
    const productId = product.id || product.id_producto;
    const productName = product.name || product.nombre;
    console.log(`   ✅ Producto seleccionado: ${productName} (ID: ${productId})`);
    return product;
  } catch (error) {
    console.error('   ❌ Error obteniendo productos:', error.message);
    throw error;
  }
}

async function addToCart(product) {
  console.log('3. 🛒 Añadiendo al carrito...');
  try {
    const productId = product.id || product.id_producto;
    const res = await axios.post(`${BASE_URL}/cart`, {
      productId: productId,
      quantity: 1
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('   ✅ Producto añadido al carrito');
  } catch (error) {
    console.error('   ❌ Error añadiendo al carrito:', error.response ? error.response.data : error.message);
    throw error;
  }
}

async function viewCart() {
  console.log('4. 📋 Verificando carrito...');
  try {
    const res = await axios.get(`${BASE_URL}/cart`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    const cart = res.data;
    const items = cart.items || cart.CartItems || [];
    console.log(`   ✅ Carrito recuperado con ${items.length} items`);
  } catch (error) {
    console.error('   ❌ Error viendo carrito:', error.message);
  }
}

async function checkout() {
  console.log('5. 💳 Realizando pedido (Checkout)...');
  try {
    const res = await axios.post(`${BASE_URL}/orders`, {}, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    const orderId = res.data.id || res.data.orderId || res.data.id_orden;
    console.log(`   ✅ Pedido creado exitosamente. ID: ${orderId}`);
  } catch (error) {
    console.error('   ❌ Error en checkout:', error.response ? error.response.data : error.message);
  }
}

async function runTests() {
  console.log('🚀 TEST DE INTEGRACIÓN: FLUJO DE COMPRA (Vía API)\n');
  
  try {
    // 1. Autenticación
    await authenticate();
    if (!authToken) return;

    // 2. Obtener producto
    const product = await getProduct();
    if (!product) return;

    // 3. Añadir al carrito
    await addToCart(product);

    // 4. Ver carrito
    await viewCart();

    // 5. Checkout
    await checkout();

    console.log('\n✨ Prueba de flujo completada');
    
  } catch (error) {
    console.error('\n❌ Prueba interrumpida por error.');
  }
}

runTests();