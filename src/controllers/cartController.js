const { Cart, CartItem, Product } = require('../models');
const logger = require('../config/logger');

class CartController {
  /**
   * Obtener el carrito activo del usuario
   */
  static async getCart(req, res) {
    try {
      const userId = req.user.id_usuario;

      // Buscar o crear carrito activo
      let cart = await Cart.findOne({
        where: { 
          id_usuario: userId,
          estado: 'activo'
        },
        include: [{
          model: CartItem,
          as: 'items',
          include: [Product]
        }]
      });

      // Si no existe carrito activo, crear uno vacío
      if (!cart) {
        cart = await Cart.create({
          id_usuario: userId,
          estado: 'activo',
          total: 0.00
        });

        return res.json({
          success: true,
          message: 'Carrito creado',
          cart: {
            id_carrito: cart.id_carrito,
            estado: cart.estado,
            total: cart.total,
            items: [],
            itemCount: 0
          }
        });
      }

      // Calcular total y contar items
      let total = 0;
      let itemCount = 0;
      const formattedItems = [];

      for (const item of cart.items) {
        const itemTotal = item.cantidad * item.precio_unitario;
        total += itemTotal;
        itemCount += item.cantidad;

        formattedItems.push({
          id_item: item.id_item,
          producto: {
            id_producto: item.Product.id_producto,
            nombre: item.Product.nombre,
            precio: item.Product.precio,
            imagen: item.Product.imagen,
            stock: item.Product.stock
          },
          cantidad: item.cantidad,
          precio_unitario: item.precio_unitario,
          subtotal: itemTotal,
          disponible: item.Product.stock >= item.cantidad
        });
      }

      // Actualizar total del carrito si es diferente
      if (parseFloat(cart.total) !== total) {
        cart.total = total;
        await cart.save();
      }

      res.json({
        success: true,
        cart: {
          id_carrito: cart.id_carrito,
          estado: cart.estado,
          total: total,
          items: formattedItems,
          itemCount: itemCount
        }
      });

    } catch (error) {
      logger.error(`Error obteniendo carrito: ${error.message}`);
      res.status(500).json({
        success: false,
        error: 'Error al obtener el carrito'
      });
    }
  }

  /**
   * Agregar producto al carrito
   */
  static async addToCart(req, res) {
    try {
      const userId = req.user.id_usuario;
      const { productId, quantity = 1 } = req.body;

      // Verificar producto
      const product = await Product.findOne({
        where: { 
          id_producto: productId,
          activo: true 
        }
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          error: 'Producto no encontrado o no disponible'
        });
      }

      // Verificar stock
      if (product.stock < quantity) {
        return res.status(400).json({
          success: false,
          error: `Stock insuficiente para ${product.nombre}`,
          stock_disponible: product.stock,
          producto: product.nombre
        });
      }

      // Buscar o crear carrito activo
      let cart = await Cart.findOne({
        where: { 
          id_usuario: userId,
          estado: 'activo'
        }
      });

      if (!cart) {
        cart = await Cart.create({
          id_usuario: userId,
          estado: 'activo',
          total: 0.00
        });
      }

      // Verificar si el producto ya está en el carrito
      let cartItem = await CartItem.findOne({
        where: {
          id_carrito: cart.id_carrito,
          id_producto: productId
        }
      });

      if (cartItem) {
        // Actualizar cantidad existente
        const nuevaCantidad = cartItem.cantidad + quantity;
        
        // Verificar stock nuevamente con la nueva cantidad
        if (product.stock < nuevaCantidad) {
          return res.status(400).json({
            success: false,
            error: `Stock insuficiente para ${product.nombre} al intentar agregar más.`,
            stock_disponible: product.stock,
            cantidad_actual: cartItem.cantidad,
            cantidad_solicitada: cantidad
          });
        }

        cartItem.cantidad = nuevaCantidad;
        cartItem.subtotal = nuevaCantidad * cartItem.precio_unitario;
        await cartItem.save();
      } else {
        // Crear nuevo item en el carrito
        cartItem = await CartItem.create({
          id_carrito: cart.id_carrito,
          id_producto: productId,
          cantidad: quantity,
          precio_unitario: product.precio,
          subtotal: quantity * product.precio
        });
      }

      // Recalcular total del carrito
      await this.recalculateCartTotal(cart.id_carrito);

      // Obtener carrito actualizado
      const updatedCart = await Cart.findByPk(cart.id_carrito, {
        include: [{
          model: CartItem,
          as: 'items',
          include: [Product]
        }]
      });

      res.json({
        success: true,
        message: 'Producto agregado al carrito',
        cartItem: {
          id_item: cartItem.id_item,
          producto: {
            id_producto: product.id_producto,
            nombre: product.nombre,
            precio: product.precio
          },
          cantidad: cartItem.cantidad,
          precio_unitario: cartItem.precio_unitario,
          subtotal: cartItem.subtotal
        },
        cart: {
          id_carrito: updatedCart.id_carrito,
          total: updatedCart.total,
          itemCount: updatedCart.items.reduce((sum, item) => sum + item.cantidad, 0)
        }
      });

    } catch (error) {
      logger.error(`Error agregando al carrito: ${error.message}`);
      res.status(500).json({
        success: false,
        error: 'Error al agregar producto al carrito'
      });
    }
  }

  /**
   * Actualizar cantidad de un item en el carrito
   */
  static async updateCartItem(req, res) {
    try {
      const userId = req.user.id_usuario;
      const { id_item } = req.params;
      const { cantidad } = req.body;

      // Validar cantidad
      if (!cantidad || cantidad < 1) {
        return res.status(400).json({
          success: false,
          error: 'Cantidad inválida. Debe ser al menos 1'
        });
      }

      // Buscar el item del carrito
      const cartItem = await CartItem.findOne({
        where: { id_item: id_item },
        include: [
          {
            model: Cart,
            where: { id_usuario: userId, estado: 'activo' }
          },
          {
            model: Product
          }
        ]
      });

      if (!cartItem) {
        return res.status(404).json({
          success: false,
          error: 'Item no encontrado en el carrito'
        });
      }

      // Verificar stock
      if (cartItem.Product.stock < cantidad) {
        return res.status(400).json({
          success: false,
          error: 'Stock insuficiente',
          stock_disponible: cartItem.Product.stock,
          producto: cartItem.Product.nombre
        });
      }

      // Actualizar cantidad
      cartItem.cantidad = cantidad;
      cartItem.subtotal = cantidad * cartItem.precio_unitario;
      await cartItem.save();

      // Recalcular total del carrito
      await this.recalculateCartTotal(cartItem.Cart.id_carrito);

      res.json({
        success: true,
        message: 'Cantidad actualizada',
        cartItem: {
          id_item: cartItem.id_item,
          producto: {
            id_producto: cartItem.Product.id_producto,
            nombre: cartItem.Product.nombre
          },
          cantidad: cartItem.cantidad,
          precio_unitario: cartItem.precio_unitario,
          subtotal: cartItem.subtotal
        }
      });

    } catch (error) {
      logger.error(`Error actualizando item del carrito: ${error.message}`);
      res.status(500).json({
        success: false,
        error: 'Error al actualizar item del carrito'
      });
    }
  }

  /**
   * Eliminar item del carrito
   */
  static async removeCartItem(req, res) {
    try {
      const userId = req.user.id_usuario;
      const { id_item } = req.params;

      // Buscar el item del carrito
      const cartItem = await CartItem.findOne({
        where: { id_item: id_item },
        include: [{
          model: Cart,
          where: { id_usuario: userId, estado: 'activo' }
        }]
      });

      if (!cartItem) {
        return res.status(404).json({
          success: false,
          error: 'Item no encontrado en el carrito'
        });
      }

      const cartId = cartItem.id_carrito;
      await cartItem.destroy();

      // Recalcular total del carrito
      await this.recalculateCartTotal(cartId);

      res.json({
        success: true,
        message: 'Producto eliminado del carrito'
      });

    } catch (error) {
      logger.error(`Error eliminando item del carrito: ${error.message}`);
      res.status(500).json({
        success: false,
        error: 'Error al eliminar producto del carrito'
      });
    }
  }

  /**
   * Vaciar carrito completamente
   */
  static async clearCart(req, res) {
    try {
      const userId = req.user.id_usuario;

      const cart = await Cart.findOne({
        where: { 
          id_usuario: userId,
          estado: 'activo'
        }
      });

      if (cart) {
        // Eliminar todos los items del carrito
        await CartItem.destroy({
          where: { id_carrito: cart.id_carrito }
        });

        // Resetear total
        cart.total = 0.00;
        await cart.save();
      }

      res.json({
        success: true,
        message: 'Carrito vaciado'
      });

    } catch (error) {
      logger.error(`Error vaciando carrito: ${error.message}`);
      res.status(500).json({
        success: false,
        error: 'Error al vaciar carrito'
      });
    }
  }

  /**
   * Calcular total del carrito
   */
  static async recalculateCartTotal(cartId) {
    try {
      const items = await CartItem.findAll({
        where: { id_carrito: cartId }
      });

      const total = items.reduce((sum, item) => {
        return sum + parseFloat(item.subtotal);
      }, 0);

      await Cart.update(
        { total: total },
        { where: { id_carrito: cartId } }
      );

      return total;
    } catch (error) {
      logger.error(`Error recalculando total del carrito: ${error.message}`);
      throw error;
    }
  }

  /**
   * Verificar disponibilidad de stock en el carrito
   */
  static async checkStock(req, res) {
    try {
      const userId = req.user.id_usuario;

      const cart = await Cart.findOne({
        where: { 
          id_usuario: userId,
          estado: 'activo'
        },
        include: [{
          model: CartItem,
          as: 'items',
          include: [Product]
        }]
      });

      if (!cart || cart.items.length === 0) {
        return res.json({
          success: true,
          message: 'Carrito vacío',
          items: [],
          allAvailable: true
        });
      }

      const stockCheck = [];
      let allAvailable = true;

      for (const item of cart.items) {
        const disponible = item.Product.stock >= item.cantidad;
        if (!disponible) allAvailable = false;

        stockCheck.push({
          id_item: item.id_item,
          producto: {
            id_producto: item.Product.id_producto,
            nombre: item.Product.nombre
          },
          cantidad_solicitada: item.cantidad,
          stock_disponible: item.Product.stock,
          disponible: disponible
        });
      }

      res.json({
        success: true,
        items: stockCheck,
        allAvailable: allAvailable,
        message: allAvailable 
          ? 'Todos los productos están disponibles' 
          : 'Algunos productos no tienen stock suficiente'
      });

    } catch (error) {
      logger.error(`Error verificando stock: ${error.message}`);
      res.status(500).json({
        success: false,
        error: 'Error al verificar disponibilidad'
      });
    }
  }

  /**
   * Obtener resumen del carrito (para checkout)
   */
  static async getCartSummary(req, res) {
    try {
      const userId = req.user.id_usuario;

      const cart = await Cart.findOne({
        where: { 
          id_usuario: userId,
          estado: 'activo'
        },
        include: [{
          model: CartItem,
          as: 'items',
          include: [Product]
        }]
      });

      if (!cart || cart.items.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'El carrito está vacío'
        });
      }

      // Calcular subtotal
      const subtotal = cart.items.reduce((sum, item) => {
        return sum + parseFloat(item.subtotal);
      }, 0);

      // Calcular impuestos (ejemplo: 16% IVA)
      const taxRate = 0.16;
      const impuestos = subtotal * taxRate;

      // Calcular envío (ejemplo: gratuito para compras mayores a $500)
      const envio = subtotal > 500 ? 0 : 50;

      // Calcular total
      const total = subtotal + impuestos + envio;

      // Verificar disponibilidad
      const availability = cart.items.map(item => ({
        id_producto: item.Product.id_producto,
        nombre: item.Product.nombre,
        cantidad: item.cantidad,
        stock: item.Product.stock,
        disponible: item.Product.stock >= item.cantidad
      }));

      const allAvailable = availability.every(item => item.disponible);

      res.json({
        success: true,
        summary: {
          subtotal: parseFloat(subtotal.toFixed(2)),
          impuestos: parseFloat(impuestos.toFixed(2)),
          envio: parseFloat(envio.toFixed(2)),
          total: parseFloat(total.toFixed(2)),
          itemCount: cart.items.reduce((sum, item) => sum + item.cantidad, 0),
          productCount: cart.items.length
        },
        availability: {
          items: availability,
          allAvailable: allAvailable
        },
        carrito: {
          id_carrito: cart.id_carrito,
          items: cart.items.map(item => ({
            id_item: item.id_item,
            producto: {
              id_producto: item.Product.id_producto,
              nombre: item.Product.nombre,
              precio: item.Product.precio,
              imagen: item.Product.imagen
            },
            cantidad: item.cantidad,
            precio_unitario: item.precio_unitario,
            subtotal: item.subtotal
          }))
        }
      });

    } catch (error) {
      logger.error(`Error obteniendo resumen del carrito: ${error.message}`);
      res.status(500).json({
        success: false,
        error: 'Error al obtener resumen del carrito'
      });
    }
  }
}

module.exports = CartController;