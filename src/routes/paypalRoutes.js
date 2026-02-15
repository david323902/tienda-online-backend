// src/routes/paypalRoutes.js
const express = require('express');
const router = express.Router();
const PayPalController = require('../controllers/paypalController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { body } = require('express-validator');

// Validaciones
const createOrderValidation = [
  body('orderId').isInt().withMessage('ID de pedido inválido'),
  body('returnUrl').optional().isURL(),
  body('cancelUrl').optional().isURL()
];

const captureOrderValidation = [
  body('orderId').notEmpty().withMessage('Order ID de PayPal requerido')
];

// Webhook público (para notificaciones de PayPal)
router.post('/webhook', PayPalController.webhook);

// Rutas protegidas
router.use(authenticateToken);

// Crear orden de PayPal
router.post('/create-order', 
  createOrderValidation, 
  PayPalController.createOrder
);

// Capturar pago de PayPal
router.post('/capture-order', 
  captureOrderValidation, 
  PayPalController.captureOrder
);

// Obtener detalles de orden PayPal
router.get('/order/:orderId', 
  PayPalController.getOrderDetails
);

// Obtener historial de pagos
router.get('/history', 
  PayPalController.getPaymentHistory
);

// Rutas de administrador
router.get('/admin/stats', 
  authorizeRoles('admin'), 
  (req, res) => {
    res.json({
      success: true,
      stats: {
        totalPayments: 0,
        completed: 0,
        pending: 0,
        failed: 0,
        totalAmount: 0
      }
    });
  }
);

module.exports = router;