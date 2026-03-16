const env = require('../config/env');

/**
 * Global Express error handler.
 * Must be registered LAST with app.use().
 */
const errorHandler = (err, req, res, next) => {
  const status  = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error.';

  // Log full stack in development
  if (env.NODE_ENV !== 'production') {
    console.error(`[Error] ${req.method} ${req.path} →`, err.stack || err);
  } else {
    console.error(`[Error] ${req.method} ${req.path} → ${status}: ${message}`);
  }

  res.status(status).json({
    success: false,
    error:   message,
    // Only include stack trace in development
    ...(env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
};

module.exports = errorHandler;