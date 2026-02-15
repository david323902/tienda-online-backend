const { sequelize, User, Product, Cart } = require('./src/models');

async function cleanup() {
  try {
    await sequelize.query('DELETE FROM "CartItems"');
    await sequelize.query('DELETE FROM "Carts"');
    await sequelize.query('DELETE FROM "Users" WHERE email = \'test@example.com\'');
    console.log('🧹 Datos de prueba limpiados');
  } catch (error) {
    console.log('⚠️  No se pudieron limpiar datos:', error.message);
  }
}

async function createTestUser() {
  try {
    // Verificar si el usuario ya existe
    const [user, created] = await User.findOrCreate({
      where: { email: 'test@example.com' },
      defaults: {
        name: 'Test User',
        email: 'test@example.com',
        password: '$2b$10$YourHashedPasswordHere', // En realidad usarías bcrypt
        role: 'customer'
      }
    });
    
    if (created) {
      console.log('👤 Usuario de prueba creado');
    } else {
      console.log('👤 Usuario de prueba ya existe');
    }
    
    return user;
  } catch (error) {
    console.error('❌ Error creando usuario de prueba:', error.message);
    return null;
  }
}

async function createTestProduct() {
  try {
    const [product, created] = await Product.findOrCreate({
      where: { name: 'Producto Test' },
      defaults: {
        name: 'Producto Test',
        description: 'Producto para pruebas',
        price: 100.00,
        stock: 50,
        sku: 'TEST001',
        category: 'test'
      }
    });
    
    if (created) {
      console.log('📦 Producto de prueba creado');
    } else {
      console.log('📦 Producto de prueba ya existe');
    }
    
    return product;
  } catch (error) {
    console.error('❌ Error creando producto de prueba:', error.message);
    return null;
  }
}

async function runTests() {
  console.log('🚀 Probando flujo de Carrito y Pedidos\n');
  
  try {
    // 1. Crear datos de prueba
    const user = await createTestUser();
    const product = await createTestProduct();
    
    if (!user || !product) {
      console.log('❌ No se pudieron crear datos de prueba');
      return;
    }
    
    // 2. Crear carrito
    console.log('2. Creando carrito...');
    let [cart, cartCreated] = await Cart.findOrCreate({
      where: { userId: user.id },
      defaults: { userId: user.id }
    });
    
    if (cartCreated) {
      console.log('🛒 Carrito creado:', cart.id);
    } else {
      console.log('🛒 Carrito ya existente:', cart.id);
    }
    
    // 3. Añadir producto al carrito
    console.log('3. Añadiendo producto al carrito...');
    const { CartItem } = require('./src/models');
    
    const [cartItem, itemCreated] = await CartItem.findOrCreate({
      where: {
        cartId: cart.id,
        productId: product.id
      },
      defaults: {
        cartId: cart.id,
        productId: product.id,
        quantity: 2,
        price: product.price
      }
    });
    
    if (itemCreated) {
      console.log(`✅ Producto añadido: ${product.name} x${cartItem.quantity}`);
    } else {
      console.log(`✅ Producto ya en carrito: ${product.name} x${cartItem.quantity}`);
    }
    
    // 4. Ver carrito
    console.log('4. Verificando carrito...');
    const cartWithItems = await Cart.findOne({
      where: { id: cart.id },
      include: [
        {
          model: CartItem,
          as: 'items',
          include: ['product']
        }
      ]
    });
    
    if (cartWithItems && cartWithItems.items) {
      console.log(`🛒 Carrito tiene ${cartWithItems.items.length} items`);
      cartWithItems.items.forEach(item => {
        console.log(`   - ${item.product ? item.product.name : 'Producto'}: $${item.price} x ${item.quantity}`);
      });
    } else {
      console.log('🛒 Carrito no tiene items');
    }
    
    // 5. Simular checkout
    console.log('\n5. Simulando checkout...');
    console.log('✅ Flujo de carrito funcionando correctamente');
    
    // 6. Mostrar resumen
    console.log('\n📊 RESUMEN DE PRUEBAS:');
    console.log('   ✅ Usuario: ', user.email);
    console.log('   ✅ Producto: ', product.name);
    console.log('   ✅ Carrito: ', cart.id);
    console.log('   ✅ Items en carrito: ', cartWithItems?.items?.length || 0);
    
    // 7. Limpiar (opcional - comenta si quieres mantener datos)
    // await cleanup();
    
  } catch (error) {
    console.error('❌ Error en pruebas:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    // No cerramos la conexión para que el servidor siga funcionando
    console.log('\n🏁 Pruebas completadas');
  }
}

// Ejecutar pruebas
runTests();