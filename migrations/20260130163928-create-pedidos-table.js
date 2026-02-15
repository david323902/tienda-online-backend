'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pedidos', {
      id_pedido: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_usuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id_usuario'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      numero_pedido: {
        type: Sequelize.STRING(50),
        unique: true
      },
      total: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      subtotal: {
        type: Sequelize.DECIMAL(10, 2)
      },
      impuestos: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.00
      },
      envio: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.00
      },
      estado: {
        type: Sequelize.ENUM(
          'pendiente',
          'confirmado',
          'procesando',
          'enviado',
          'entregado',
          'cancelado',
          'reembolsado'
        ),
        defaultValue: 'pendiente'
      },
      metodo_pago: {
        type: Sequelize.STRING(50)
      },
      direccion_envio: {
        type: Sequelize.JSON
      },
      datos_facturacion: {
        type: Sequelize.JSON
      },
      notas: {
        type: Sequelize.TEXT
      },
      creado_en: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      actualizado_en: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.addIndex('pedidos', ['id_usuario']);
    await queryInterface.addIndex('pedidos', ['numero_pedido']);
    await queryInterface.addIndex('pedidos', ['estado']);
    await queryInterface.addIndex('pedidos', ['creado_en']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('pedidos');
  }
};
