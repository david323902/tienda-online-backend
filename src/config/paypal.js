// src/config/paypal.js
const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');

// Configurar entorno de PayPal
const configureEnvironment = () => {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (process.env.PAYPAL_ENVIRONMENT === 'production') {
    return new checkoutNodeJssdk.core.LiveEnvironment(clientId, clientSecret);
  } else {
    return new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret);
  }
};

// Crear cliente de PayPal
const client = () => {
  return new checkoutNodeJssdk.core.PayPalHttpClient(configureEnvironment());
};

module.exports = { client };