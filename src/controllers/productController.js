const { Product } = require('../models');

class ProductController {
  static async getAll(req, res) {
    try {
      const products = await Product.findAll({
        where: { activo: true }
      });
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const product = await Product.findByPk(req.params.id);
      if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async create(req, res) {
    try {
      const product = await Product.create(req.body);
      res.status(201).json({
        message: 'Producto creado exitosamente',
        product
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const product = await Product.findByPk(req.params.id);
      if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      await product.update(req.body);
      res.json({
        message: 'Producto actualizado exitosamente',
        product
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const product = await Product.findByPk(req.params.id);
      if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      await product.update({ activo: false });
      res.json({ message: 'Producto desactivado exitosamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async uploadImage(req, res) {
    try {
      // El middleware de multer ya procesó el archivo. Si hay un error de filtro, no llegará aquí.
      // Si no se sube archivo, req.file será undefined.
      if (!req.file) {
        return res.status(400).json({ 
          success: false,
          error: 'No se ha subido ningún archivo o el tipo de archivo no es válido.' 
        });
      }

      const product = await Product.findByPk(req.params.id);
      if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      // Construir la URL pública de la imagen
      const imageUrl = `/uploads/products/${req.file.filename}`;

      // Actualizar el campo 'imagen' del producto
      product.imagen = imageUrl;
      await product.save();

      res.json({
        message: 'Imagen subida y asociada al producto exitosamente',
        product
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = ProductController;