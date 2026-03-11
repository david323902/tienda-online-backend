const express = require('express');
const router = express.Router();
const stripeController = require('../controllers/stripeController');
const { authenticateToken } = require('../middleware/auth');

// This requires auth because carts are linked to users
router.post('/create-payment-intent', authenticateToken, stripeController.createPaymentIntent);

// This does not strictly require auth if it's just from the landing page
router.post('/create-checkout-session', stripeController.createCheckoutSession);

module.exports = router;
