const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  'tienda_online',
  'postgres',
  '1234',
  {
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
    logging: console.log
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL conectado correctamente');
  } catch (error) {
    console.error('❌ Error conectando a PostgreSQL:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
