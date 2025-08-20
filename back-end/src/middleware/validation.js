const { ZodError } = require('zod');
const { pupilCreateSchema, pupilUpdateSchema, objectIdSchema } = require('../schemas/pupilSchema');

/**
 * Format Zod validation errors into a user-friendly format
 * @param {ZodError} error - Zod validation error
 * @returns {Object} Formatted error response
 */
const formatValidationError = (error) => {
  const details = error.errors.map(err => ({
    field: err.path.join('.'),
    message: err.message,
    code: err.code
  }));

  return {
    success: false,
    error: {
      message: 'Validation failed',
      type: 'VALIDATION_ERROR',
      details
    }
  };
};

/**
 * Generic validation middleware factory
 * @param {ZodSchema} schema - Zod schema to validate against
 * @returns {Function} Express middleware function
 */
const validateSchema = (schema) => {
  return (req, res, next) => {
    try {
      // Validate request body against the provided schema
      const validatedData = schema.parse(req.body);
      
      // Replace request body with validated and transformed data
      req.body = validatedData;
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json(formatValidationError(error));
      }
      
      // Handle unexpected errors
      return res.status(500).json({
        success: false,
        error: {
          message: 'Internal server error during validation',
          type: 'INTERNAL_ERROR'
        }
      });
    }
  };
};

/**
 * Middleware for validating pupil creation requests
 */
const validatePupilCreate = validateSchema(pupilCreateSchema);

/**
 * Middleware for validating pupil update requests
 */
const validatePupilUpdate = validateSchema(pupilUpdateSchema);

/**
 * Middleware for validating MongoDB ObjectId parameters
 * @param {string} paramName - Name of the parameter to validate (default: 'id')
 * @returns {Function} Express middleware function
 */
const validateObjectId = (paramName = 'id') => {
  return (req, res, next) => {
    try {
      const id = req.params[paramName];
      
      if (!id) {
        return res.status(400).json({
          success: false,
          error: {
            message: `Missing required parameter: ${paramName}`,
            type: 'MISSING_PARAMETER',
            details: [{
              field: paramName,
              message: `${paramName} parameter is required`
            }]
          }
        });
      }

      // Validate ObjectId format
      objectIdSchema.parse(id);
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          error: {
            message: `Invalid ${paramName} format`,
            type: 'INVALID_OBJECT_ID',
            details: [{
              field: paramName,
              message: error.errors[0].message
            }]
          }
        });
      }
      
      // Handle unexpected errors
      return res.status(500).json({
        success: false,
        error: {
          message: 'Internal server error during ID validation',
          type: 'INTERNAL_ERROR'
        }
      });
    }
  };
};

/**
 * Global error handler middleware for unhandled validation errors
 */
const globalErrorHandler = (error, req, res, next) => {
  // Handle Zod validation errors that weren't caught earlier
  if (error instanceof ZodError) {
    return res.status(400).json(formatValidationError(error));
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
    const field = Object.keys(error.keyPattern)[0];
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

  // Default error response for unhandled errors
  console.error('Unhandled error:', error);
  
  return res.status(500).json({
    success: false,
    error: {
      message: 'Internal server error',
      type: 'INTERNAL_ERROR'
    }
  });
};

module.exports = {
  validatePupilCreate,
  validatePupilUpdate,
  validateObjectId,
  validateSchema,
  formatValidationError,
  globalErrorHandler
};