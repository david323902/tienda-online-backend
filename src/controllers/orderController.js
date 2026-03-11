const { Order, OrderItem, Cart, CartItem, Product, User, Payment } = require('../models');
const logger = require('../config/logger');

const ORDER_STATUS = {
  PENDING: 'pendiente',
  CONFIRMED: 'confirmado',
  PROCESSING: 'procesando',
  SHIPPED: 'enviado',
  DELIVERED: 'entregado',
  CANCELED: 'cancelado'
};
const TAX_RATE = parseFloat(process.env.TAX_RATE) || 0.16;
const SHIPPING_COST = parseFloat(process.env.SHIPPING_COST) || 50;
const FREE_SHIPPING_THRESHOLD = parseFloat(process.env.FREE_SHIPPING_THRESHOLD) || 500;

class OrderController {

  static async createOrder(req, res) {
    const transaction = await require('../models').sequelize.transaction();
    try {
      const userId = req.user.id_usuario;
      const { direccion_envio, datos_facturacion, metodo_pago, notas } = req.body;

      const cart = await Cart.findOne({
        where: { id_usuario: userId, estado: 'activo' },
        include: [{ model: CartItem, as: 'items', include: [Product] }],
        transaction
      });

      if (!cart || cart.items.length === 0) {
        await transaction.rollback();
        return res.status(400).json({ success: false, error: 'El carrito está vacío' });
      }

      let subtotal = 0;
      const itemsDisponibles = [];
      const productosSinStock = [];

      for (const item of cart.items) {
        const producto = item.Product;
        if (producto.stock < item.cantidad) {
          productosSinStock.push({
            id_producto: producto.id_producto,
            nombre: producto.nombre,
            cantidad_solicitada: item.cantidad,
            stock_disponible: producto.stock
          });
        } else {
          const itemSubtotal = item.cantidad * item.precio_unitario;
          subtotal += itemSubtotal;
          itemsDisponibles.push({
            id_producto: producto.id_producto,
            nombre_producto: producto.nombre,
            cantidad: item.cantidad,
            precio_unitario: item.precio_unitario,
            subtotal: itemSubtotal
          });
        }
      }

      if (productosSinStock.length > 0) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          error: 'Algunos productos no tienen stock suficiente',
          productos_sin_stock: productosSinStock
        });
      }

      const impuestos = subtotal * TAX_RATE;
      const envio = subtotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
      const total = subtotal + impuestos + envio;

      const direccionStr = typeof direccion_envio === 'object'
        ? JSON.stringify(direccion_envio)
        : direccion_envio;

      const order = await Order.create({
        id_usuario: userId,
        total,
        subtotal,
        impuestos,
        envio,
        estado: ORDER_STATUS.PENDING,
        metodo_pago: metodo_pago || 'pendiente',
        direccion_envio: direccionStr,
        datos_facturacion: datos_facturacion || direccionStr,
        notas
      }, { transaction });

      for (const item of itemsDisponibles) {
        await OrderItem.create({
          id_pedido: order.id_pedido,
          id_producto: item.id_producto,
          cantidad: item.cantidad,
          precio_unitario: item.precio_unitario,
          nombre_producto: item.nombre_producto,
          subtotal: item.subtotal
        }, { transaction });

        await Product.decrement('stock', {
          by: item.cantidad,
          where: { id_producto: item.id_producto },
          transaction
        });
      }

      cart.estado = 'completado';
      await cart.save({ transaction });

      if (metodo_pago && metodo_pago !== 'pendiente') {
        await Payment.create({
          id_pedido: order.id_pedido,
          metodo: metodo_pago,
          estado: 'pendiente',
          monto: total
        }, { transaction });
      }

      await transaction.commit();

      logger.info(`Pedido creado: #${order.id_pedido} para usuario ${userId}`);

      res.status(201).json({
        success: true,
        message: 'Pedido creado exitosamente',
        order: {
          id_pedido: order.id_pedido,
          estado: order.estado,
          total: order.total,
          subtotal: order.subtotal,
          impuestos: order.impuestos,
          envio: order.envio,
          metodo_pago: order.metodo_pago,
          creado_en: order.creado_en,
          items: itemsDisponibles
        },
        summary: {
          productos: itemsDisponibles.length,
          subtotal,
          total
        }
      });

    } catch (error) {
      try { if (!transaction.finished) await transaction.rollback(); } catch (e) { }
      logger.error(`Error creando pedido: ${error.message}`);
      res.status(500).json({ success: false, error: 'Error al crear el pedido', details: error.message });
    }
  }

  static async getUserOrders(req, res) {
    try {
      const userId = req.user.id_usuario;
      const { limit = 10, page = 1, estado } = req.query;
      const offset = (page - 1) * limit;

      const where = { id_usuario: userId };
      if (estado) where.estado = estado;

      const { count, rows } = await Order.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        include: [{ model: OrderItem, as: 'OrderItems', limit: 3 }],
        order: [['creado_en', 'DESC']]
      });

      res.json({
        success: true,
        total: count,
        page: parseInt(page),
        totalPages: Math.ceil(count / limit),
        orders: rows.map(order => ({
          id_pedido: order.id_pedido,
          estado: order.estado,
          total: order.total,
          creado_en: order.creado_en,
          items: order.OrderItems
        }))
      });

    } catch (error) {
      logger.error(`Error obteniendo pedidos: ${error.message}`);
      res.status(500).json({ success: false, error: 'Error al obtener pedidos' });
    }
  }

  static async getOrderDetail(req, res) {
    try {
      const userId = req.user.id_usuario;
      const { id } = req.params;

      const order = await Order.findOne({
        where: { id_pedido: id, id_usuario: userId },
        include: [
          { model: OrderItem, as: 'OrderItems' },
          { model: Payment }
        ]
      });

      if (!order) {
        return res.status(404).json({ success: false, error: 'Pedido no encontrado' });
      }

      res.json({
        success: true,
        order: {
          id_pedido: order.id_pedido,
          estado: order.estado,
          total: order.total,
          subtotal: order.subtotal,
          impuestos: order.impuestos,
          envio: order.envio,
          metodo_pago: order.metodo_pago,
          direccion_envio: order.direccion_envio,
          notas: order.notas,
          creado_en: order.creado_en,
          items: order.OrderItems,
          pago: order.Payment
        }
      });

    } catch (error) {
      logger.error(`Error obteniendo detalle de pedido: ${error.message}`);
      res.status(500).json({ success: false, error: 'Error al obtener detalle del pedido' });
    }
  }

  static async cancelOrder(req, res) {
    const transaction = await require('../models').sequelize.transaction();
    try {
      const userId = req.user.id_usuario;
      const { id } = req.params;
      const { motivo } = req.body;

      const order = await Order.findOne({
        where: { id_pedido: id, id_usuario: userId, estado: 'pendiente' },
        include: [{ model: OrderItem, as: 'OrderItems' }],
        transaction
      });

      if (!order) {
        await transaction.rollback();
        return res.status(404).json({ success: false, error: 'Pedido no encontrado o no se puede cancelar' });
      }

      for (const item of order.OrderItems) {
        await Product.increment('stock', {
          by: item.cantidad,
          where: { id_producto: item.id_producto },
          transaction
        });
      }

      order.estado = 'cancelado';
      if (motivo) order.notas = `${order.notas || ''}\nCancelado: ${motivo}`;
      await order.save({ transaction });

      await transaction.commit();

      res.json({
        success: true,
        message: 'Pedido cancelado exitosamente',
        order: { id_pedido: order.id_pedido, estado: order.estado }
      });

    } catch (error) {
      try { if (!transaction.finished) await transaction.rollback(); } catch (e) { }
      logger.error(`Error cancelando pedido: ${error.message}`);
      res.status(500).json({ success: false, error: 'Error al cancelar el pedido' });
    }
  }

  static async getOrderStats(req, res) {
    try {
      const userId = req.user.id_usuario;

      const stats = await Order.findAll({
        where: { id_usuario: userId },
        attributes: [
          'estado',
          [require('../models').sequelize.fn('COUNT', '*'), 'count'],
          [require('../models').sequelize.fn('SUM', require('../models').sequelize.col('total')), 'total']
        ],
        group: ['estado']
      });

      const totalPedidos = stats.reduce((sum, s) => sum + parseInt(s.dataValues.count), 0);
      const totalGastado = stats.reduce((sum, s) => sum + parseFloat(s.dataValues.total || 0), 0);

      res.json({
        success: true,
        stats: {
          total_pedidos: totalPedidos,
          total_gastado: parseFloat(totalGastado.toFixed(2)),
          por_estado: stats.map(s => ({
            estado: s.estado,
            cantidad: parseInt(s.dataValues.count),
            total: parseFloat(s.dataValues.total || 0)
          }))
        }
      });

    } catch (error) {
      logger.error(`Error obteniendo estadísticas: ${error.message}`);
      res.status(500).json({ success: false, error: 'Error al obtener estadísticas' });
    }
  }

  static async getAllOrders(req, res) {
    try {
      const { limit = 20, page = 1, estado } = req.query;
      const offset = (page - 1) * limit;
      const where = {};
      if (estado) where.estado = estado;

      const { count, rows } = await Order.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        include: [
          { model: User, attributes: ['id_usuario', 'nombre', 'email'] },
          { model: OrderItem, as: 'OrderItems', limit: 2 }
        ],
        order: [['creado_en', 'DESC']]
      });

      res.json({ success: true, total: count, page: parseInt(page), orders: rows });

    } catch (error) {
      logger.error(`Error obteniendo todos los pedidos: ${error.message}`);
      res.status(500).json({ success: false, error: 'Error al obtener pedidos' });
    }
  }

  static async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { estado, notas } = req.body;

      const validStatus = ['pendiente', 'confirmado', 'procesando', 'enviado', 'entregado', 'cancelado', 'reembolsado'];
      if (!validStatus.includes(estado)) {
        return res.status(400).json({ success: false, error: 'Estado inválido' });
      }

      const order = await Order.findByPk(id, {
        include: [{ model: User, attributes: ['id_usuario', 'nombre', 'email'] }]
      });

      if (!order) {
        return res.status(404).json({ success: false, error: 'Pedido no encontrado' });
      }

      order.estado = estado;
      if (notas) order.notas = `${order.notas || ''}\n${new Date().toISOString()}: ${notas}`;
      await order.save();

      res.json({
        success: true,
        message: `Estado del pedido actualizado a "${estado}"`,
        order: { id_pedido: order.id_pedido, estado: order.estado }
      });

    } catch (error) {
      logger.error(`Error actualizando estado de pedido: ${error.message}`);
      res.status(500).json({ success: false, error: 'Error al actualizar estado del pedido' });
    }
  }

  static async updateShippingAddress(req, res) {
    try {
      const userId = req.user.id_usuario;
      const { id } = req.params;
      const { direccion_envio } = req.body;

      const order = await Order.findOne({
        where: { id_pedido: id, id_usuario: userId, estado: ['pendiente', 'confirmado'] }
      });

      if (!order) {
        return res.status(404).json({ success: false, error: 'Pedido no encontrado o no se puede actualizar' });
      }

      order.direccion_envio = typeof direccion_envio === 'object'
        ? JSON.stringify(direccion_envio)
        : direccion_envio;
      await order.save();

      res.json({ success: true, message: 'Dirección de envío actualizada', order: { id_pedido: order.id_pedido, direccion_envio: order.direccion_envio } });

    } catch (error) {
      logger.error(`Error actualizando dirección: ${error.message}`);
      res.status(500).json({ success: false, error: 'Error al actualizar dirección' });
    }
  }
}

module.exports = OrderController;