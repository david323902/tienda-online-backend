const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Order, Product } = require('../models');
const logger = require('../config/logger');

class StripeController {

    // Create PaymentIntent for the shopping cart checkout
    static async createPaymentIntent(req, res) {
        try {
            const { amount, currency = 'eur' } = req.body;

            if (!amount || amount <= 0) {
                return res.status(400).json({ success: false, error: 'Monto inválido' });
            }

            // Create a PaymentIntent with the order amount and currency
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(amount) > 999999 ? Math.round(amount) : Math.round(amount * 100), // Stripe uses smallest currency unit (cents)
                currency: currency,
                automatic_payment_methods: {
                    enabled: true, // This enables Apple Pay, Google Pay, Cards based on Dashboard config
                },
            });

            res.json({
                success: true,
                clientSecret: paymentIntent.client_secret,
            });

        } catch (error) {
            logger.error(`Error creando PaymentIntent: ${error.message}`);
            res.status(500).json({ success: false, error: 'Error al procesar pago' });
        }
    }

    // Create Checkout Session for the Landing Page "Contratar" buttons
    static async createCheckoutSession(req, res) {
        try {
            const { serviceName, price } = req.body;

            if (!serviceName || !price) {
                return res.status(400).json({ success: false, error: 'Faltan datos del servicio' });
            }

            const domainURL = process.env.CLIENT_URL || 'http://localhost:5173';

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                    {
                        price_data: {
                            currency: 'eur',
                            product_data: {
                                name: serviceName,
                            },
                            unit_amount: Math.round(price * 100), // convert to cents
                        },
                        quantity: 1,
                    },
                ],
                mode: 'payment',
                success_url: `${domainURL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${domainURL}/`,
            });

            res.json({
                success: true,
                url: session.url
            });
        } catch (error) {
            logger.error(`Error creando Checkout Session: ${error.message}`);
            res.status(500).json({ success: false, error: 'Error al iniciar checkout' });
        }
    }
}

module.exports = StripeController;
