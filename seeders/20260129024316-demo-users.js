'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    const passwordHash = await bcrypt.hash('admin123', 10);
    
    await queryInterface.bulkInsert('usuarios', [
      {
        nombre: 'Administrador',
        email: 'admin@tienda.com',
        password_hash: passwordHash,
        rol: 'admin',
        fecha_registro: new Date(),
        creado_en: new Date(),
        actualizado_en: new Date()
      },
      {
        nombre: 'Cliente Demo',
        email: 'cliente@tienda.com',
        password_hash: passwordHash,
        rol: 'cliente',
        fecha_registro: new Date(),
        creado_en: new Date(),
        actualizado_en: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('usuarios', {
      email: ['admin@tienda.com', 'cliente@tienda.com']
    }, {});
  }
};