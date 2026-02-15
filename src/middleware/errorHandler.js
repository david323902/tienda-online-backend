const logger = require('../config/logger');

const errorHandler = (err, req, res, next) => {
  // 1. Valores por defecto
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Error interno del servidor';
  let details = err.details || null;

  // 2. Manejo de errores específicos
  if (err.name === 'SequelizeValidationError') {
    statusCode = 400;
    message = 'Error de validación de datos';
    details = err.errors.map(e => ({ field: e.path, message: e.message }));
  } else if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 409;
    message = 'Conflicto de datos: el registro ya existe';
    details = err.errors.map(e => ({ field: e.path, message: e.message }));
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token de autenticación inválido';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'El token de autenticación ha expirado';
  }

  // 3. Sanitizar datos sensibles para el log
  const sanitizeLogData = (data) => {
    if (!data) return {};
    const sanitized = { ...data };
    const sensitiveKeys = ['password', 'password_hash', 'token', 'creditCard', 'cvv'];
    
    sensitiveKeys.forEach(key => {
      if (sanitized[key]) sanitized[key] = '*****';
    });
    
    return sanitized;
  };

  // 4. Logging estructurado
  const logPayload = {
    message: message,
    errorName: err.name,
    statusCode,
    path: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userId: req.user ? req.user.id_usuario : 'guest',
    body: sanitizeLogData(req.body),
    stack: statusCode >= 500 ? err.stack : undefined // Solo loguear stack en errores de servidor
  };

  if (statusCode >= 500) {
    logger.error(JSON.stringify(logPayload));
  } else {
    logger.warn(JSON.stringify(logPayload));
  }

  // 5. Respuesta al cliente
  res.status(statusCode).json({
    success: false,
    error: message,
    details: details,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = errorHandler;