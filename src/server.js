require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const path = require('path');

const { connectDB } = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar a la base de datos
connectDB();

// --- Middlewares de Seguridad ---

// Configuración básica de Helmet para seguridad HTTP
app.use(helmet());

// Limita las peticiones para prevenir ataques de fuerza bruta
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutos
	max: 100, // Limita cada IP a 100 peticiones por ventana
	standardHeaders: true,
	legacyHeaders: false, 
  message: 'Demasiadas peticiones desde esta IP, por favor intenta de nuevo en 15 minutos.'
});
app.use('/api', limiter); // Aplicar a todas las rutas de la API

// Configuración de CORS desde variables de entorno
app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
  credentials: true
}));

// --- Middlewares Generales ---
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// --- Rutas de la API ---
// Importar rutas (ajusta según tus archivos)
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const paypalRoutes = require('./routes/paypalRoutes');
const whatsappRoutes = require('./routes/whatsappRoutes');

// Usar rutas
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/paypal', paypalRoutes);
app.use('/api/whatsapp', whatsappRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    uptime: process.uptime(),
    database: 'connected'
  });
});

// Info del sistema
app.get('/api/info', (req, res) => {
  res.json({
    name: 'API Tienda Online',
    version: '1.0.0',
    status: 'operational',
    endpoints: {
      health: '/api/health',
      whatsapp: '/api/whatsapp/contact-info',
      products: '/api/products',
      auth: '/api/auth/login'
    }
  });
});

// Ruta raíz - redirige a health check
app.get('/', (req, res) => {
  res.redirect('/api/health');
});

// Manejo de errores
app.use(errorHandler);

// 404 - Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// --- Inicio del Servidor y Graceful Shutdown ---
const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
});

const gracefulShutdown = (signal) => {
  console.log(`\n${signal} recibido. Cerrando servidor de forma segura...`);
  server.close(() => {
    console.log('✅ Servidor cerrado. Terminando conexiones a la base de datos.');
    require('./config/database').sequelize.close();
    process.exit(0);
  });
};

// Escuchar señales para un cierre seguro
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  gracefulShutdown('Uncaught Exception');
});