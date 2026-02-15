// models/cookieconsent.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CookieConsent extends Model {
    static associate(models) {
      CookieConsent.belongsTo(models.User, { foreignKey: 'id_usuario' });
    }
  }
  
  CookieConsent.init({
    id_consent: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'usuarios',
        key: 'id_usuario'
      }
    },
    session_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    cookies_aceptadas: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    cookies_tecnicas: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    cookies_analiticas: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    cookies_marketing: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    ip_address: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    user_agent: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'CookieConsent',
    tableName: 'cookies_consent',
    timestamps: true,
    createdAt: 'creado_en',
    updatedAt: 'actualizado_en'
  });

  return CookieConsent;
};