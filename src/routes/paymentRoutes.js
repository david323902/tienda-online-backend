const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/paymentController');
const { authenticateToken } = require('../middleware/auth');
const { body } = require('express-validator');

const createPaymentValidation = [
  body('orderId').isInt().withMessage('ID de pedido inválido')
];

router.use(authenticateToken);

router.post('/paypal/create', createPaymentValidation, PaymentController.createPayPalOrder);
router.post('/paypal/capture', 
  body('orderId').notEmpty().withMessage('Order ID de PayPal requerido'),
  PaymentController.capturePayPalPayment
);

module.exports = router;