const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cartController');
const { authenticateToken } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Middleware para manejar errores de validación
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

// Validaciones
const addToCartValidation = [
  body('productId').isInt({ min: 1 }).withMessage('El campo productId debe ser un entero válido.'),
  body('quantity').optional().isInt({ min: 1 }).withMessage('La cantidad debe ser al menos 1.')
];

const updateCartValidation = [
  body('cantidad').isInt({ min: 1 }).withMessage('Cantidad debe ser al menos 1')
];

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// GET /api/cart - Obtener carrito
router.get('/', CartController.getCart);

// POST /api/cart - Agregar producto al carrito
router.post('/', addToCartValidation, handleValidationErrors, CartController.addToCart);

// PUT /api/cart/item/:id_item - Actualizar cantidad
router.put('/item/:id_item', updateCartValidation, CartController.updateCartItem);

// DELETE /api/cart/item/:id_item - Eliminar item del carrito
router.delete('/item/:id_item', CartController.removeCartItem);

// DELETE /api/cart/clear - Vaciar carrito
router.delete('/clear', CartController.clearCart);

// GET /api/cart/check-stock - Verificar disponibilidad
router.get('/check-stock', CartController.checkStock);

// GET /api/cart/summary - Obtener resumen para checkout
router.get('/summary', CartController.getCartSummary);

module.exports = router;