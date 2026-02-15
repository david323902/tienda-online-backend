const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  'tienda_online',
  'postgres',
  '1234',
  {
    host: 'localhost',
    port: 5433,
    dialect: 'postgres'
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ CONEXIÓN EXITOSA A PostgreSQL');
  } catch (error) {
    console.error('❌ ERROR DE CONEXIÓN:', error.message);
  }
})();

