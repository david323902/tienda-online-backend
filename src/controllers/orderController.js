const { Order, OrderItem, Cart, CartItem, Product, User, Payment } = require('../models');
const logger = require('../config/logger');

// --- Constantes y Reglas de Negocio ---
// Es una buena práctica externalizar estos valores a un archivo de configuración o variables de entorno
const ORDER_STATUS = {
  PENDING: 'pendiente',
  CONFIRMED: 'confirmado',
  PROCESSING: 'procesando',
  SHIPPED: 'enviado',
  DELIVERED: 'entregado',
  CANCELED: 'cancelado'
};
const TAX_RATE = parseFloat(process.env.TAX_RATE) || 0.16; // 16%
const SHIPPING_COST = parseFloat(process.env.SHIPPING_COST) || 50;
const FREE_SHIPPING_THRESHOLD = parseFloat(process.env.FREE_SHIPPING_THRESHOLD) || 500;

class OrderController {
  /**
   * Crear pedido desde el carrito
   */
  static async createOrder(req, res) {
    const transaction = await require('../models').sequelize.transaction();
    
    try {
      const userId = req.user.id_usuario;
      const { 
        direccion_envio, 
        datos_facturacion, 
        metodo_pago, 
        notas 
      } = req.body;

      // 1. Obtener carrito activo
      const cart = await Cart.findOne({
        where: { 
          id_usuario: userId,
          estado: 'activo'
        },
        include: [{
          model: CartItem,
          as: 'items',
          include: [Product]
        }],
        transaction
      });

      if (!cart || cart.items.length === 0) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          error: 'El carrito está vacío'
        });
      }

      // 2. Verificar stock y calcular total
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
            id_item: item.id_item,
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
          productos_sin_stock: productosSinStock,
          message: 'Actualiza las cantidades o elimina los productos sin stock'
        });
      }

      // 3. Calcular total con impuestos y envío
      const impuestos = subtotal * TAX_RATE;
      const envio = subtotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
      const total = subtotal + impuestos + envio;

      // 4. Crear pedido
      const order = await Order.create({
        id_usuario: userId,
        total: total,
        subtotal: subtotal,
        impuestos: impuestos,
        envio: envio,
        estado: ORDER_STATUS.PENDING,
        metodo_pago: metodo_pago || 'pendiente',
        direccion_envio: direccion_envio,
        datos_facturacion: datos_facturacion || direccion_envio,
        notas: notas
      }, { transaction });

      // 5. Crear items del pedido y actualizar stock
      for (const item of itemsDisponibles) {
        // Crear item del pedido
        await OrderItem.create({
          id_pedido: order.id_pedido,
          id_producto: item.id_producto,
          cantidad: item.cantidad,
          precio_unitario: item.precio_unitario,
          nombre_producto: item.nombre_producto,
          subtotal: item.subtotal
        }, { transaction });

        // Reducir stock del producto
        await Product.decrement('stock', {
          by: item.cantidad,
          where: { id_producto: item.id_producto },
          transaction
        });
      }

      // 6. Marcar carrito como completado
      cart.estado = 'completado'; // O usar una constante si aplica
      await cart.save({ transaction });

      // 7. Crear registro de pago (si el método de pago lo requiere)
      if (metodo_pago && metodo_pago !== 'pendiente') {
        await Payment.create({
          id_pedido: order.id_pedido,
          metodo: metodo_pago,
          estado: 'pendiente',
          monto: total
        }, { transaction });
      }

      // 8. Confirmar transacción
      await transaction.commit();

      // 9. Obtener pedido completo para respuesta
      const orderComplete = await Order.findByPk(order.id_pedido, {
        include: [{
          model: OrderItem,
          as: 'items'
        }]
      });

      logger.info(`Pedido creado: #${order.numero_pedido} para usuario ${userId}`);

      res.status(201).json({
        success: true,
        message: 'Pedido creado exitosamente',
        order: {
          id_pedido: orderComplete.id_pedido,
          numero_pedido: orderComplete.numero_pedido,
          estado: orderComplete.estado,
          total: orderComplete.total,
          subtotal: orderComplete.subtotal,
          impuestos: orderComplete.impuestos,
          envio: orderComplete.envio,
          metodo_pago: orderComplete.metodo_pago,
          creado_en: orderComplete.creado_en,
          items: orderComplete.items
        },
        summary: {
          productos: itemsDisponibles.length,
          items_totales: itemsDisponibles.reduce((sum, item) => sum + item.cantidad, 0),
          subtotal: subtotal,
          total: total
        }
      });

    } catch (error) {
      await transaction.rollback();
      logger.error(`Error creando pedido: ${error.message}`);
      res.status(500).json({
        success: false,
        error: 'Error al crear el pedido',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Obtener pedidos del usuario
   */
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
        include: [{
          model: OrderItem,
          as: 'items',
          limit: 3 // Solo mostrar primeros 3 items en la lista
        }],
        order: [['creado_en', 'DESC']]
      });

      res.json({
        success: true,
        total: count,
        page: parseInt(page),
        totalPages: Math.ceil(count / limit),
        orders: rows.map(order => ({
          id_pedido: order.id_pedido,
          numero_pedido: order.numero_pedido,
          estado: order.estado,
          total: order.total,
          creado_en: order.creado_en,
          itemCount: order.items ? order.items.length : 0,
          items: order.items
        }))
      });

    } catch (error) {
      logger.error(`Error obteniendo pedidos: ${error.message}`);
      res.status(500).json({
        success: false,
        error: 'Error al obtener pedidos'
      });
    }
  }

  /**
   * Obtener detalle de un pedido específico
   */
  static async getOrderDetail(req, res) {
    try {
      const userId = req.user.id_usuario;
      const { id } = req.params;

      const order = await Order.findOne({
        where: { 
          id_pedido: id,
          id_usuario: userId
        },
        include: [
          {
            model: OrderItem,
            as: 'items'
          },
          {
            model: Payment
          }
        ]
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          error: 'Pedido no encontrado'
        });
      }

      res.json({
        success: true,
        order: {
          id_pedido: order.id_pedido,
          numero_pedido: order.numero_pedido,
          estado: order.estado,
          total: order.total,
          subtotal: order.subtotal,
          impuestos: order.impuestos,
          envio: order.envio,
          metodo_pago: order.metodo_pago,
          direccion_envio: order.direccion_envio,
          datos_facturacion: order.datos_facturacion,
          notas: order.notas,
          creado_en: order.creado_en,
          actualizado_en: order.actualizado_en,
          items: order.items,
          pago: order.Payment
        }
      });

    } catch (error) {
      logger.error(`Error obteniendo detalle de pedido: ${error.message}`);
      res.status(500).json({
        success: false,
        error: 'Error al obtener detalle del pedido'
      });
    }
  }

  /**
   * Cancelar pedido (solo si está pendiente)
   */
  static async cancelOrder(req, res) {
    const transaction = await require('../models').sequelize.transaction();
    
    try {
      const userId = req.user.id_usuario;
      const { id } = req.params;
      const { motivo } = req.body;

      const order = await Order.findOne({
        where: { 
          id_pedido: id,
          id_usuario: userId,
          estado: 'pendiente' // Solo se pueden cancelar pedidos pendientes
        },
        include: [{
          model: OrderItem,
          as: 'items'
        }],
        transaction
      });

      if (!order) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          error: 'Pedido no encontrado o no se puede cancelar'
        });
      }

      // Devolver stock de productos
      for (const item of order.items) {
        await Product.increment('stock', {
          by: item.cantidad,
          where: { id_producto: item.id_producto },
          transaction
        });
      }

      // Actualizar estado del pedido
      order.estado = 'cancelado';
      if (motivo) order.notas = `${order.notas || ''}\nCancelado: ${motivo}`;
      await order.save({ transaction });

      // Si hay pago asociado, marcarlo como cancelado
      if (order.metodo_pago !== 'pendiente') {
        await Payment.update(
          { estado: 'cancelado' },
          { 
            where: { 
              id_pedido: order.id_pedido,
              estado: 'pendiente'
            },
            transaction
          }
        );
      }

      await transaction.commit();

      logger.info(`Pedido cancelado: #${order.numero_pedido} por usuario ${userId}`);

      res.json({
        success: true,
        message: 'Pedido cancelado exitosamente',
        order: {
          id_pedido: order.id_pedido,
          numero_pedido: order.numero_pedido,
          estado: order.estado
        }
      });

    } catch (error) {
      await transaction.rollback();
      logger.error(`Error cancelando pedido: ${error.message}`);
      res.status(500).json({
        success: false,
        error: 'Error al cancelar el pedido'
      });
    }
  }

  /**
   * Actualizar dirección de envío (solo pedidos pendientes)
   */
  static async updateShippingAddress(req, res) {
    try {
      const userId = req.user.id_usuario;
      const { id } = req.params;
      const { direccion_envio } = req.body;

      if (!direccion_envio) {
        return res.status(400).json({
          success: false,
          error: 'Dirección de envío requerida'
        });
      }

      const order = await Order.findOne({
        where: { 
          id_pedido: id,
          id_usuario: userId,
          estado: ['pendiente', 'confirmado'] // Solo se puede actualizar en estos estados
        }
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          error: 'Pedido no encontrado o no se puede actualizar'
        });
      }

      order.direccion_envio = direccion_envio;
      await order.save();

      res.json({
        success: true,
        message: 'Dirección de envío actualizada',
        order: {
          id_pedido: order.id_pedido,
          numero_pedido: order.numero_pedido,
          direccion_envio: order.direccion_envio
        }
      });

    } catch (error) {
      logger.error(`Error actualizando dirección: ${error.message}`);
      res.status(500).json({
        success: false,
        error: 'Error al actualizar dirección'
      });
    }
  }

  /**
   * Obtener estadísticas de pedidos del usuario
   */
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

      const totalPedidos = stats.reduce((sum, stat) => sum + parseInt(stat.dataValues.count), 0);
      const totalGastado = stats.reduce((sum, stat) => sum + parseFloat(stat.dataValues.total || 0), 0);

      res.json({
        success: true,
        stats: {
          total_pedidos: totalPedidos,
          total_gastado: parseFloat(totalGastado.toFixed(2)),
          por_estado: stats.map(stat => ({
            estado: stat.estado,
            cantidad: parseInt(stat.dataValues.count),
            total: parseFloat(stat.dataValues.total || 0)
          }))
        }
      });

    } catch (error) {
      logger.error(`Error obteniendo estadísticas: ${error.message}`);
      res.status(500).json({
        success: false,
        error: 'Error al obtener estadísticas'
      });
    }
  }

  /**
   * ADMIN: Obtener todos los pedidos
   */
  static async getAllOrders(req, res) {
    try {
      const { limit = 20, page = 1, estado, fecha_inicio, fecha_fin } = req.query;
      const offset = (page - 1) * limit;

      const where = {};
      if (estado) where.estado = estado;

      // Filtrar por fechas
      if (fecha_inicio || fecha_fin) {
        where.creado_en = {};
        if (fecha_inicio) where.creado_en[require('../models').sequelize.Op.gte] = new Date(fecha_inicio);
        if (fecha_fin) where.creado_en[require('../models').sequelize.Op.lte] = new Date(fecha_fin);
      }

      const { count, rows } = await Order.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        include: [
          {
            model: User,
            attributes: ['id_usuario', 'nombre', 'email']
          },
          {
            model: OrderItem,
            as: 'items',
            limit: 2
          }
        ],
        order: [['creado_en', 'DESC']]
      });

      res.json({
        success: true,
        total: count,
        page: parseInt(page),
        totalPages: Math.ceil(count / limit),
        orders: rows
      });

    } catch (error) {
      logger.error(`Error obteniendo todos los pedidos: ${error.message}`);
      res.status(500).json({
        success: false,
        error: 'Error al obtener pedidos'
      });
    }
  }

  /**
   * ADMIN: Actualizar estado del pedido
   */
  static async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { estado, notas } = req.body;

      const validStatus = ['pendiente', 'confirmado', 'procesando', 'enviado', 'entregado', 'cancelado', 'reembolsado'];
      if (!validStatus.includes(estado)) {
        return res.status(400).json({
          success: false,
          error: 'Estado inválido'
        });
      }

      const order = await Order.findByPk(id, {
        include: [{
          model: User,
          attributes: ['id_usuario', 'nombre', 'email']
        }]
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          error: 'Pedido no encontrado'
        });
      }

      const oldStatus = order.estado;
      order.estado = estado;
      if (notas) order.notas = `${order.notas || ''}\n${new Date().toISOString()}: ${notas}`;
      await order.save();

      logger.info(`Estado de pedido actualizado: #${order.numero_pedido} de "${oldStatus}" a "${estado}"`);

      res.json({
        success: true,
        message: `Estado del pedido actualizado a "${estado}"`,
        order: {
          id_pedido: order.id_pedido,
          numero_pedido: order.numero_pedido,
          estado: order.estado,
          usuario: order.User
        }
      });

    } catch (error) {
      logger.error(`Error actualizando estado de pedido: ${error.message}`);
      res.status(500).json({
        success: false,
        error: 'Error al actualizar estado del pedido'
      });
    }
  }
}

module.exports = OrderController;