// src/models/Cart.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    static associate(models) {
      Cart.belongsTo(models.User, { foreignKey: 'id_usuario' });
      Cart.hasMany(models.CartItem, { foreignKey: 'id_carrito', as: 'items' });
    }
  }
  
  Cart.init({
    id_carrito: {
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
    estado: {
      type: DataTypes.ENUM('activo', 'completado', 'abandonado'),
      defaultValue: 'activo'
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00
    }
  }, {
    sequelize,
    modelName: 'Cart',
    tableName: 'carritos',
    timestamps: true,
    createdAt: 'creado_en',
    updatedAt: 'actualizado_en'
  });

  return Cart;
};