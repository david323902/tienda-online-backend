const { sequelize, User, Product } = require('./src/models');

async function seed() {
  try {
    console.log('🌱 Verificando datos para pruebas...');

    // 1. Crear Usuario para el test
    const [user, created] = await User.findOrCreate({
      where: { email: 'cliente@tienda.com' },
      defaults: {
        nombre: 'Cliente Test',
        password_hash: 'cliente123', // El hook del modelo lo encriptará
        rol: 'cliente',
        telefono: '555-1234'
      }
    });
    console.log(created ? '✅ Usuario creado: cliente@tienda.com' : 'ℹ️ Usuario ya existe');

    // 2. Crear Productos (IDs 1 y 2 son requeridos por test-cart-orders.js)
    const products = [
      { id: 1, nombre: 'Laptop Gamer', precio: 1500.00, stock: 10 },
      { id: 2, nombre: 'Mouse Wireless', precio: 25.00, stock: 50 }
    ];

    for (const p of products) {
      // Intentamos buscar o crear. Nota: Si la BD es nueva, los IDs serán 1 y 2.
      const [prod, pCreated] = await Product.findOrCreate({
        where: { nombre: p.nombre }, // Buscamos por nombre para no duplicar
        defaults: {
          precio: p.precio,
          stock: p.stock,
          descripcion: 'Producto de prueba generado automáticamente'
        }
      });
      
      console.log(pCreated ? `✅ Producto creado: ${prod.nombre} (ID: ${prod.id_producto})` : `ℹ️ Producto ya existe: ${prod.nombre} (ID: ${prod.id_producto})`);

      if (prod.id_producto !== p.id) {
        console.warn(`⚠️  ATENCIÓN: El ID del producto es ${prod.id_producto}, pero el test espera ${p.id}.`);
        console.warn(`    Si el test falla, edita test-cart-orders.js cambiando id_producto: ${p.id} por ${prod.id_producto}`);
      }
    }

    console.log('\n✨ Datos listos. Ahora puedes ejecutar el test.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seed();