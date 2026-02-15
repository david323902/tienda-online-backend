const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orderController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { body } = require('express-validator');

// Validaciones
const createOrderValidation = [
  body('direccion_envio').isObject().withMessage('Dirección de envío requerida'),
  body('datos_facturacion').optional().isObject(),
  body('metodo_pago').optional().isString(),
  body('notas').optional().isString()
];

const updateShippingValidation = [
  body('direccion_envio').isObject().withMessage('Dirección de envío requerida')
];

const updateOrderStatusValidation = [
  body('estado').isIn([
    'pendiente', 
    'confirmado', 
    'procesando', 
    'enviado', 
    'entregado', 
    'cancelado', 
    'reembolsado'
  ]).withMessage('Estado inválido'),
  body('notas').optional().isString()
];

// Rutas para usuarios autenticados
router.use(authenticateToken);

// POST /api/orders - Crear pedido desde el carrito
router.post('/', createOrderValidation, OrderController.createOrder);

// GET /api/orders - Obtener pedidos del usuario
router.get('/', OrderController.getUserOrders);

// GET /api/orders/stats - Estadísticas de pedidos
router.get('/stats', OrderController.getOrderStats);

// GET /api/orders/:id - Obtener detalle de pedido
router.get('/:id', OrderController.getOrderDetail);

// PUT /api/orders/:id/cancel - Cancelar pedido
router.put('/:id/cancel', 
  body('motivo').optional().isString(),
  OrderController.cancelOrder
);

// PUT /api/orders/:id/shipping - Actualizar dirección de envío
router.put('/:id/shipping', updateShippingValidation, OrderController.updateShippingAddress);

// ============================================
// RUTAS DE ADMINISTRADOR
// ============================================

// GET /api/orders/admin/all - Obtener todos los pedidos (admin)
router.get('/admin/all', 
  authorizeRoles('admin'), 
  OrderController.getAllOrders
);

// PUT /api/orders/admin/:id/status - Actualizar estado de pedido (admin)
router.put('/admin/:id/status', 
  authorizeRoles('admin'),
  updateOrderStatusValidation,
  OrderController.updateOrderStatus
);

module.exports = router;