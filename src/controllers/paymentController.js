const { Payment, Order } = require('../models');
const paypal = require('@paypal/checkout-server-sdk');

class PaymentController {
  static getClient() {
    const environment = process.env.PAYPAL_MODE === 'live'
      ? new paypal.core.LiveEnvironment(
          process.env.PAYPAL_CLIENT_ID,
          process.env.PAYPAL_CLIENT_SECRET
        )
      : new paypal.core.SandboxEnvironment(
          process.env.PAYPAL_CLIENT_ID,
          process.env.PAYPAL_CLIENT_SECRET
        );

    return new paypal.core.PayPalHttpClient(environment);
  }

  static async createPayPalOrder(req, res) {
    try {
      const { orderId, returnUrl, cancelUrl } = req.body;
      const userId = req.user.id_usuario;

      const order = await Order.findOne({
        where: {
          id_pedido: orderId,
          id_usuario: userId,
          estado: 'pendiente'
        }
      });

      if (!order) {
        return res.status(404).json({
          error: 'Pedido no encontrado o ya procesado'
        });
      }

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
          },
          items: order.items ? order.items.map(item => ({
            name: item.nombre_producto || 'Producto',
            unit_amount: {
              currency_code: 'USD',
              value: item.precio_unitario.toString()
            },
            quantity: item.cantidad.toString(),
            sku: item.id_producto?.toString() || 'SKU'
          })) : []
        }],
        application_context: {
          brand_name: 'Tienda Online',
          landing_page: 'BILLING',
          user_action: 'PAY_NOW',
          return_url: returnUrl || `${process.env.FRONTEND_URL}/payment/success`,
          cancel_url: cancelUrl || `${process.env.FRONTEND_URL}/payment/cancel`,
          shipping_preference: 'NO_SHIPPING'
        }
      });

      const client = this.getClient();
      const response = await client.execute(request);
      const paypalOrder = response.result;

      await Payment.create({
        id_pedido: order.id_pedido,
        metodo: 'PayPal',
        estado: 'pendiente',
        transaction_id: paypalOrder.id,
        monto: order.total,
        detalles: paypalOrder
      });

      const approveLink = paypalOrder.links.find(link => link.rel === 'approve');

      res.json({
        success: true,
        orderId: paypalOrder.id,
        approvalUrl: approveLink?.href,
        status: paypalOrder.status,
        links: paypalOrder.links
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error procesando pago',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  static async capturePayPalPayment(req, res) {
    try {
      const { orderId } = req.body;

      const payment = await Payment.findOne({
        where: { transaction_id: orderId },
        include: [{ model: Order }]
      });

      if (!payment) {
        return res.status(404).json({
          error: 'Pago no encontrado'
        });
      }

      if (payment.estado === 'completado') {
        return res.status(400).json({
          error: 'El pago ya fue capturado anteriormente'
        });
      }

      const request = new paypal.orders.OrdersCaptureRequest(orderId);
      request.requestBody({});

      const client = this.getClient();
      const response = await client.execute(request);
      const capture = response.result;

      payment.estado = 'completado';
      payment.fecha_pago = new Date();
      payment.detalles = { ...payment.detalles, capture };
      await payment.save();

      if (payment.Order) {
        payment.Order.estado = 'pagado';
        await payment.Order.save();
      }

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
      await Payment.update(
        { estado: 'fallido', detalles: { error: error.message } },
        { where: { transaction_id: orderId } }
      );

      res.status(500).json({
        success: false,
        error: 'Error capturando pago',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = PaymentController;