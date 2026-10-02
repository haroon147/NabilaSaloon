const { validationResult } = require('express-validator');

// Run express-validator checks and short-circuit on errors
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array().map(e => ({ field: e.path, message: e.msg })),
    });
  }
  next();
}

// Global error handler (must be last middleware)
function errorHandler(err, req, res, _next) {
  console.error(err);

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({ success: false, message: `${field} already exists` });
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'Invalid ID format' });
  }

  const status = err.statusCode || 500;
  res.status(status).json({ success: false, message: err.message || 'Server error' });
}

module.exports = { validate, errorHandler };
