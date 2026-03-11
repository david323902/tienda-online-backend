const { sequelize } = require('./src/models');

async function check() {
  try {
    const result = await sequelize.query(
      "SELECT pg_get_constraintdef(oid) as def FROM pg_constraint WHERE conname = 'pagos_metodo_check'"
    );
    console.log(JSON.stringify(result[0], null, 2));
  } catch (e) {
    console.error(e.message);
  } finally {
    process.exit(0);
  }
}

check();