const { sequelize } = require('./src/models');

async function fix() {
  try {
    await sequelize.query(`ALTER TABLE usuarios ALTER COLUMN rol DROP DEFAULT`);
    await sequelize.query(`ALTER TABLE usuarios ALTER COLUMN rol TYPE varchar(20)`);
    await sequelize.query(`DROP TYPE IF EXISTS "enum_usuarios_rol"`);
    await sequelize.query(`ALTER TABLE usuarios ALTER COLUMN rol SET DEFAULT 'cliente'`);
    console.log('Rol arreglado');

    // Crear tablas faltantes manualmente
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS carrito_items (
        id_detalle SERIAL PRIMARY KEY,
        id_carrito INTEGER REFERENCES carritos(id_carrito),
        id_producto INTEGER REFERENCES productos(id_producto),
        cantidad INTEGER NOT NULL,
        precio_unitario DECIMAL(10,2) NOT NULL,
        creado_en TIMESTAMP DEFAULT NOW(),
        actualizado_en TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('Tabla carrito_items creada');

    console.log('Todo listo');
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    process.exit(0);
  }
}

fix();