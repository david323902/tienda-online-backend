const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// --- Configuración de Multer para subida de imágenes ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Los archivos se guardarán en public/uploads/products
    cb(null, 'public/uploads/products/');
  },
  filename: (req, file, cb) => {
    // Generar un nombre de archivo único para evitar colisiones
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `product-${req.params.id}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const imageFilter = (req, file, cb) => {
  // Aceptar solo archivos de imagen
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de imagen (jpeg, png, gif, etc.).'), false);
  }
};

const upload = multer({ storage: storage, fileFilter: imageFilter, limits: { fileSize: 5 * 1024 * 1024 } }); // Límite de 5MB

router.get('/', ProductController.getAll);
router.get('/:id', ProductController.getById);

router.post('/', authenticateToken, authorizeRoles('admin'), ProductController.create);
router.put('/:id', authenticateToken, authorizeRoles('admin'), ProductController.update);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), ProductController.delete);

// POST /api/products/:id/image - Subir imagen para un producto
router.post('/:id/image', authenticateToken, authorizeRoles('admin'), upload.single('productImage'), ProductController.uploadImage);

module.exports = router;