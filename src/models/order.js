// src/models/order.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.User, { foreignKey: 'id_usuario' });
      Order.hasMany(models.OrderItem, { foreignKey: 'id_pedido' });
      Order.hasMany(models.Payment, { foreignKey: 'id_pedido' });
    }
  }
  
  Order.init({
    id_pedido: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id_usuario'
      }
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    estado: {
      type: DataTypes.ENUM('pendiente', 'pagado', 'enviado', 'completado', 'cancelado'),
      defaultValue: 'pendiente'
    },
    fecha_pedido: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    direccion_envio: {
      type: DataTypes.TEXT
    },
    ciudad: {
      type: DataTypes.STRING(100)
    },
    codigo_postal: {
      type: DataTypes.STRING(20)
    }
  }, {
    sequelize,
    modelName: 'Order',
    tableName: 'pedidos',
    timestamps: true,
    createdAt: 'creado_en',
    updatedAt: 'actualizado_en'
  });

  return Order;
};