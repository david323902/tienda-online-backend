const { sequelize } = require('./src/models');

async function fix() {
  try {
    await sequelize.query(`ALTER TABLE pagos DROP CONSTRAINT pagos_metodo_check`);
    await sequelize.query(`ALTER TABLE pagos ADD CONSTRAINT pagos_metodo_check CHECK (metodo IN ('PayPal', 'Tarjeta', 'Transferencia', 'paypal', 'tarjeta', 'transferencia', 'credit_card', 'pendiente', 'efectivo'))`);
    console.log('Restricción actualizada correctamente');
  } catch (e) {
    console.error(e.message);
  } finally {
    process.exit(0);
  }
}

fix();