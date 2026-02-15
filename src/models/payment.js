'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    static associate(models) {
      Payment.belongsTo(models.Order, { foreignKey: 'id_pedido' });
    }
  }
  
  Payment.init({
    id_pago: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_pedido: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'pedidos',
        key: 'id_pedido'
      }
    },
    metodo: {
      type: DataTypes.ENUM('PayPal', 'Tarjeta', 'Transferencia'),
      allowNull: false
    },
    estado: {
      type: DataTypes.ENUM('pendiente', 'completado', 'fallido', 'reembolsado'),
      defaultValue: 'pendiente'
    },
    transaction_id: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    monto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    fecha_pago: {
      type: DataTypes.DATE,
      allowNull: true
    },
    detalles: {
      type: DataTypes.JSONB,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Payment',
    tableName: 'pagos',
    timestamps: true,
    createdAt: 'creado_en',
    updatedAt: 'actualizado_en'
  });

  return Payment;
};