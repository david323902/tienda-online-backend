// models/cartdetail.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CartDetail extends Model {
    static associate(models) {
      CartDetail.belongsTo(models.Cart, { foreignKey: 'id_carrito' });
      CartDetail.belongsTo(models.Product, { foreignKey: 'id_producto' });
    }
  }
  
  CartDetail.init({
    id_detalle: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_carrito: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'carrito',
        key: 'id_carrito'
      }
    },
    id_producto: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'productos',
        key: 'id_producto'
      }
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1
      }
    },
    precio_unitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    }
  }, {
    sequelize,
    modelName: 'CartDetail',
    tableName: 'carrito_detalle',
    timestamps: true,
    createdAt: 'creado_en',
    updatedAt: 'actualizado_en'
  });

  return CartDetail;
};