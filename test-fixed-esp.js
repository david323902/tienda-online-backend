const { sequelize } = require('./src/models');

async function testDatabase() {
  console.log('🧪 Probando conexión y estructura de base de datos...\n');
  
  try {
    // 1. Verificar conexión
    await sequelize.authenticate();
    console.log('✅ Conexión a PostgreSQL exitosa');
    
    // 2. Verificar tablas existentes
    const [tables] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);
    
    console.log('\n📊 Tablas en la base de datos:');
    tables.forEach(table => {
      console.log(`   - ${table.table_name}`);
    });
    
    // 3. Verificar estructura de tabla 'usuarios'
    console.log('\n🔍 Estructura de tabla "usuarios":');
    const [userColumns] = await sequelize.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'usuarios'
      ORDER BY ordinal_position;
    `);
    
    userColumns.forEach(col => {
      console.log(`   ${col.column_name} (${col.data_type}) ${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });
    
    // 4. Verificar estructura de tabla 'productos'
    console.log('\n🔍 Estructura de tabla "productos":');
    const [productColumns] = await sequelize.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'productos'
      ORDER BY ordinal_position;
    `);
    
    productColumns.forEach(col => {
      console.log(`   ${col.column_name} (${col.data_type}) ${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });
    
    // 5. Insertar datos de prueba directamente con SQL
    console.log('\n🧪 Insertando datos de prueba...');
    
    // Insertar usuario si no existe
    const [userResult] = await sequelize.query(`
      INSERT INTO usuarios (nombre, email, password_hash, rol, activo)
      VALUES ('Usuario Test', 'test@example.com', '$2b$10$test', 'cliente', true)
      ON CONFLICT (email) DO NOTHING
      RETURNING id_usuario;
    `);
    
    if (userResult.length > 0) {
      console.log('✅ Usuario de prueba creado');
    } else {
      console.log('⚠️  Usuario de prueba ya existe');
    }
    
    // Insertar producto si no existe
    const [productResult] = await sequelize.query(`
      INSERT INTO productos (nombre, descripcion, precio, stock, categoria, activo)
      VALUES ('Producto Test', 'Descripción de prueba', 100.00, 50, 'test', true)
      ON CONFLICT (nombre) DO NOTHING
      RETURNING id_producto;
    `);
    
    if (productResult.length > 0) {
      console.log('✅ Producto de prueba creado');
    } else {
      console.log('⚠️  Producto de prueba ya existe');
    }
    
    // 6. Contar registros
    const [userCount] = await sequelize.query('SELECT COUNT(*) as count FROM usuarios');
    const [productCount] = await sequelize.query('SELECT COUNT(*) as count FROM productos');
    const [cartCount] = await sequelize.query('SELECT COUNT(*) as count FROM carts');
    
    console.log('\n📈 Conteo de registros:');
    console.log(`   👤 Usuarios: ${userCount[0].count}`);
    console.log(`   📦 Productos: ${productCount[0].count}`);
    console.log(`   🛒 Carritos: ${cartCount[0].count}`);
    
    console.log('\n✨ Pruebas completadas con éxito!');
    
  } catch (error) {
    console.error('❌ Error en pruebas:', error.message);
    console.error('Detalle:', error);
  }
}

testDatabase();