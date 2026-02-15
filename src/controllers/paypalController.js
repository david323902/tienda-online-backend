// src/controllers/paypalController.js
const paypal = require('@paypal/checkout-server-sdk');
const { Order, Payment, User } = require('../models');

class PayPalController {
  // Crear orden de PayPal
  static async createOrder(req, res) {
    try {
      const { orderId, returnUrl, cancelUrl } = req.body;
      const userId = req.user.id_usuario;

      // Verificar pedido
      const order = await Order.findOne({
        where: {
          id_pedido: orderId,
          id_usuario: userId,
          estado: 'pendiente'
        },
        include: [{ model: User, attributes: ['nombre', 'email'] }]
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          error: 'Pedido no encontrado o ya procesado'
        });
      }

      // Configurar entorno de PayPal
      const environment = process.env.PAYPAL_ENVIRONMENT === 'production'
        ? new paypal.core.LiveEnvironment(
            process.env.PAYPAL_CLIENT_ID,
            process.env.PAYPAL_CLIENT_SECRET
          )
        : new paypal.core.SandboxEnvironment(
            process.env.PAYPAL_CLIENT_ID,
            process.env.PAYPAL_CLIENT_SECRET
          );

      const client = new paypal.core.PayPalHttpClient(environment);

      // Crear solicitud de orden
      const request = new paypal.orders.OrdersCreateRequest();
      request.prefer('return=representation');
      request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [{
          reference_id: order.id_pedido.toString(),
          description: `Pedido #${order.id_pedido} - Tienda Online`,
          amount: {
            currency_code: 'USD',
            value: order.total.toString(),
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: order.total.toString()
              }
            }
          }
        }],
        application_context: {
          brand_name: 'Tienda Online',
          landing_page: 'BILLING',
          user_action: 'PAY_NOW',
          return_url: returnUrl || `${process.env.FRONTEND_URL}/payment/success`,
          cancel_url: cancelUrl || `${process.env.FRONTEND_URL}/payment/cancel`
        }
      });

      // Ejecutar solicitud
      const response = await client.execute(request);
      const paypalOrder = response.result;

      // Guardar información del pago en la base de datos
      await Payment.create({
        id_pedido: order.id_pedido,
        metodo: 'PayPal',
        estado: 'pendiente',
        transaction_id: paypalOrder.id,
        monto: order.total,
        detalles: paypalOrder
      });

      console.log(`✅ Orden PayPal creada: ${paypalOrder.id} para pedido ${order.id_pedido}`);

      // Encontrar enlace de aprobación
      const approveLink = paypalOrder.links.find(link => link.rel === 'approve');

      res.json({
        success: true,
        orderId: paypalOrder.id,
        approvalUrl: approveLink?.href,
        status: paypalOrder.status
      });

    } catch (error) {
      console.error('❌ Error creando orden PayPal:', error.message);

      // En producción, nunca se debe caer en modo simulación. Si las credenciales faltan, es un error de configuración.
      if (process.env.NODE_ENV === 'production' && !process.env.PAYPAL_CLIENT_ID) {
        const prodError = 'La configuración de PayPal está incompleta para el entorno de producción.';
        console.error(`🔥 ERROR CRÍTICO: ${prodError}`);
        return res.status(500).json({
          success: false,
          error: 'Error de configuración del servidor de pagos.'
        });
      }

      res.status(500).json({
        success: false,
        error: 'Error procesando pago con PayPal',
        details: process.env.NODE_ENV !== 'production' ? error.message : 'Ocurrió un error interno.'
      });
    }
  }

  // Capturar pago de PayPal
  static async captureOrder(req, res) {
    try {
      const { orderId } = req.body;

      // Verificar pago en nuestra base de datos
      const payment = await Payment.findOne({
        where: { transaction_id: orderId },
        include: [{ model: Order }]
      });

      if (!payment) {
        return res.status(404).json({
          success: false,
          error: 'Pago no encontrado'
        });
      }

      if (payment.estado === 'completado') {
        return res.status(400).json({
          success: false,
          error: 'El pago ya fue capturado anteriormente'
        });
      }

      // En producción, no se deben procesar órdenes simuladas.
      const isSimulation = !process.env.PAYPAL_CLIENT_ID || orderId.startsWith('sim-');
      if (isSimulation && process.env.NODE_ENV === 'production') {
        const prodError = `Intento de capturar una orden simulada ('${orderId}') en producción.`;
        console.error(`🔥 ERROR DE SEGURIDAD: ${prodError}`);
        return res.status(400).json({
          success: false,
          error: 'Transacción inválida.'
        });
      }

      if (isSimulation) {
        console.log('📦 [SIMULACIÓN] Capturando pago PayPal simulado');
        
        // Actualizar pago en nuestra base de datos
        payment.estado = 'completado';
        payment.fecha_pago = new Date();
        payment.detalles = { ...payment.detalles, simulated: true };
        await payment.save();

        // Actualizar estado del pedido
        if (payment.Order) {
          payment.Order.estado = 'pagado';
          await payment.Order.save();
        }

        return res.json({
          success: true,
          message: 'Pago completado exitosamente (simulación)',
          simulated: true,
          captureId: `sim-capture-${Date.now()}`,
          status: 'COMPLETED',
          payment: {
            id: payment.id_pago,
            orderId: payment.id_pedido,
            amount: payment.monto,
            method: payment.metodo,
            status: payment.estado,
            date: payment.fecha_pago
          }
        });
      }

      // Capturar pago real en PayPal
      const environment = process.env.PAYPAL_ENVIRONMENT === 'production'
        ? new paypal.core.LiveEnvironment(
            process.env.PAYPAL_CLIENT_ID,
            process.env.PAYPAL_CLIENT_SECRET
          )
        : new paypal.core.SandboxEnvironment(
            process.env.PAYPAL_CLIENT_ID,
            process.env.PAYPAL_CLIENT_SECRET
          );

      const client = new paypal.core.PayPalHttpClient(environment);

      const request = new paypal.orders.OrdersCaptureRequest(orderId);
      request.requestBody({});

      const response = await client.execute(request);
      const capture = response.result;

      // Actualizar pago en nuestra base de datos
      payment.estado = 'completado';
      payment.fecha_pago = new Date();
      payment.detalles = { ...payment.detalles, capture };
      await payment.save();

      // Actualizar estado del pedido
      if (payment.Order) {
        payment.Order.estado = 'pagado';
        await payment.Order.save();
      }

      console.log(`✅ Pago PayPal capturado: ${orderId} - ${capture.status}`);

      res.json({
        success: true,
        message: 'Pago completado exitosamente',
        captureId: capture.id,
        status: capture.status,
        payment: {
          id: payment.id_pago,
          orderId: payment.id_pedido,
          amount: payment.monto,
          method: payment.metodo,
          status: payment.estado,
          date: payment.fecha_pago
        }
      });

    } catch (error) {
      console.error('❌ Error capturando pago PayPal:', error.message);

      // Actualizar estado a fallido
      await Payment.update(
        { estado: 'fallido', detalles: { error: error.message } },
        { where: { transaction_id: orderId } }
      );

      res.status(500).json({
        success: false,
        error: 'Error capturando pago',
        details: error.message
      });
    }
  }

  // Obtener detalles de una orden PayPal
  static async getOrderDetails(req, res) {
    try {
      const { orderId } = req.params;

      // Modo simulación
      if (!process.env.PAYPAL_CLIENT_ID || orderId.startsWith('sim-')) {
        return res.json({
          success: true,
          order: {
            id: orderId,
            status: 'APPROVED',
            create_time: new Date().toISOString(),
            purchase_units: [{
              amount: {
                currency_code: 'USD',
                value: '99.99'
              }
            }],
            simulated: true
          }
        });
      }

      const environment = process.env.PAYPAL_ENVIRONMENT === 'production'
        ? new paypal.core.LiveEnvironment(
            process.env.PAYPAL_CLIENT_ID,
            process.env.PAYPAL_CLIENT_SECRET
          )
        : new paypal.core.SandboxEnvironment(
            process.env.PAYPAL_CLIENT_ID,
            process.env.PAYPAL_CLIENT_SECRET
          );

      const client = new paypal.core.PayPalHttpClient(environment);

      const request = new paypal.orders.OrdersGetRequest(orderId);
      const response = await client.execute(request);

      res.json({
        success: true,
        order: response.result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Webhook para notificaciones de PayPal
  static async webhook(req, res) {
    try {
      const event = req.body;
      
      // Procesar eventos importantes
      switch (event.event_type) {
        case 'PAYMENT.CAPTURE.COMPLETED':
          await this.handleCaptureCompleted(event);
          break;
        
        case 'PAYMENT.CAPTURE.DENIED':
        case 'PAYMENT.CAPTURE.FAILED':
          await this.handleCaptureFailed(event);
          break;
        
        case 'PAYMENT.CAPTURE.REFUNDED':
          await this.handleCaptureRefunded(event);
          break;
        
        default:
          console.log(`ℹ️ Evento PayPal no procesado: ${event.event_type}`);
      }

      res.status(200).json({ received: true });
    } catch (error) {
      console.error('❌ Error en webhook PayPal:', error);
      res.status(500).json({ error: error.message });
    }
  }

  // Manejador para captura completada
  static async handleCaptureCompleted(event) {
    const transactionId = event.resource.id;
    
    const payment = await Payment.findOne({
      where: { transaction_id: transactionId }
    });

    if (payment && payment.estado === 'pendiente') {
      payment.estado = 'completado';
      payment.fecha_pago = new Date();
      payment.detalles = { ...payment.detalles, webhook: event };
      await payment.save();

      const order = await Order.findByPk(payment.id_pedido);
      if (order) {
        order.estado = 'pagado';
        await order.save();
      }

      console.log(`✅ Pago completado vía webhook: ${transactionId}`);
    }
  }

  // Manejador para captura fallida
  static async handleCaptureFailed(event) {
    const transactionId = event.resource.id;
    
    await Payment.update(
      { estado: 'fallido', detalles: { webhook: event } },
      { where: { transaction_id: transactionId } }
    );

    console.warn(`⚠️ Pago fallido vía webhook: ${transactionId}`);
  }

  // Obtener historial de pagos
  static async getPaymentHistory(req, res) {
    try {
      const { page = 1, limit = 20, status } = req.query;
      const offset = (page - 1) * limit;

      const where = {};
      if (status) where.estado = status;

      // Si no es admin, solo mostrar pagos del usuario
      if (req.user.rol !== 'admin') {
        where['$Order.id_usuario$'] = req.user.id_usuario;
      }

      const { count, rows } = await Payment.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        include: [{
          model: Order,
          include: [User]
        }],
        order: [['fecha_pago', 'DESC']]
      });

      res.json({
        success: true,
        total: count,
        page: parseInt(page),
        totalPages: Math.ceil(count / limit),
        payments: rows
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = PayPalController;