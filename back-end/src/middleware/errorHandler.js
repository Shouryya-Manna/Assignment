const { ZodError } = require('zod');

/**
 * Global error handling middleware
 */
const globalErrorHandler = (error, req, res, next) => {
  // Log error for debugging
  console.error('Global error handler caught:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    params: req.params
  });

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const details = error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message,
      code: err.code
    }));

    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation failed',
        type: 'VALIDATION_ERROR',
        details
      }
    });
  }

  // Handle MongoDB validation errors
  if (error.name === 'ValidationError') {
    const details = Object.keys(error.errors).map(field => ({
      field,
      message: error.errors[field].message
    }));

    return res.status(400).json({
      success: false,
      error: {
        message: 'Database validation failed',
        type: 'DATABASE_VALIDATION_ERROR',
        details
      }
    });
  }

  // Handle MongoDB cast errors (invalid ObjectId)
  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Invalid ID format',
        type: 'INVALID_OBJECT_ID',
        details: [{
          field: 'id',
          message: 'Invalid MongoDB ObjectId format'
        }]
      }
    });
  }

  // Handle MongoDB duplicate key errors
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern || {})[0] || 'unknown';
    return res.status(400).json({
      success: false,
      error: {
        message: 'Duplicate value error',
        type: 'DUPLICATE_ERROR',
        details: [{
          field,
          message: `${field} already exists`
        }]
      }
    });
  }

  // Handle JSON parsing errors
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Invalid JSON format',
        type: 'JSON_PARSE_ERROR',
        details: [{
          field: 'body',
          message: 'Request body contains invalid JSON'
        }]
      }
    });
  }

  // Default error response for unhandled errors
  return res.status(500).json({
    success: false,
    error: {
      message: 'Internal server error',
      type: 'INTERNAL_ERROR'
    }
  });
};

/**
 * 404 Not Found handler for unmatched routes
 */
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Route not found',
      type: 'NOT_FOUND',
      details: [{
        field: 'url',
        message: `No route found for ${req.method} ${req.url}`
      }]
    }
  });
};

module.exports = {
  globalErrorHandler,
  notFoundHandler
};