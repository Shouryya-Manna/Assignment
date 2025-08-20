const Pupil = require('../models/Pupil');

/**
 * Create a new pupil record
 * POST /api/pupils
 */
const createPupil = async (req, res) => {
  try {
    // Data validation is handled by middleware (validatePupilCreate)
    // req.body contains validated data at this point
    
    // Create new pupil instance
    const pupil = new Pupil(req.body);
    
    // Save to MongoDB - this will trigger pre-save middleware for additional validation
    const savedPupil = await pupil.save();
    
    res.status(201).json({
      success: true,
      message: 'Pupil created successfully',
      data: savedPupil.toSafeObject() // Remove sensitive data like password
    });
    
  } catch (error) {
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

    // Handle duplicate email error (from pre-save middleware)
    if (error.message === 'Email already exists') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Email already exists',
          type: 'DUPLICATE_ERROR',
          details: [{
            field: 'email',
            message: 'A pupil with this email already exists'
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

    // Log unexpected errors for debugging
    console.error('Error creating pupil:', error);
    
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to create pupil',
        type: 'DATABASE_ERROR'
      }
    });
  }
};

/**
 * Get all pupils
 * GET /api/pupils
 */
const getAllPupils = async (req, res) => {
  try {
    // Retrieve all pupils from database, sorted by creation date (newest first)
    const pupils = await Pupil.find({})
      .sort({ createdAt: -1 })
      .lean(); // Use lean() for better performance when we don't need mongoose document methods
    
    res.status(200).json({
      success: true,
      message: `Retrieved ${pupils.length} pupils`,
      data: pupils,
      count: pupils.length
    });
    
  } catch (error) {
    // Log unexpected errors for debugging
    console.error('Error retrieving pupils:', error);
    
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to retrieve pupils',
        type: 'DATABASE_ERROR'
      }
    });
  }
};

/**
 * Get a single pupil by ID
 * GET /api/pupils/:id
 */
const getPupilById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // ObjectId validation is handled by middleware (validateObjectId)
    // Find pupil by ID
    const pupil = await Pupil.findById(id);
    
    if (!pupil) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Pupil not found',
          type: 'NOT_FOUND',
          details: [{
            field: 'id',
            message: `No pupil found with ID: ${id}`
          }]
        }
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Pupil retrieved successfully',
      data: pupil.toSafeObject() // Remove sensitive data like password
    });
    
  } catch (error) {
    // Handle MongoDB cast errors (invalid ObjectId format)
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid pupil ID format',
          type: 'INVALID_OBJECT_ID',
          details: [{
            field: 'id',
            message: 'Invalid MongoDB ObjectId format'
          }]
        }
      });
    }
    
    // Log unexpected errors for debugging
    console.error('Error retrieving pupil:', error);
    
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to retrieve pupil',
        type: 'DATABASE_ERROR'
      }
    });
  }
};

/**
 * Update an existing pupil record
 * PUT /api/pupils/:id
 */
const updatePupil = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Data validation is handled by middleware (validatePupilUpdate)
    // ObjectId validation is handled by middleware (validateObjectId)
    // req.body contains validated data at this point
    
    // Find and update pupil with new data
    // Using findByIdAndUpdate with runValidators to ensure Mongoose validation runs
    const updatedPupil = await Pupil.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true, // Return updated document
        runValidators: true, // Run Mongoose validators
        context: 'query' // Needed for some validators to work properly
      }
    );
    
    if (!updatedPupil) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Pupil not found',
          type: 'NOT_FOUND',
          details: [{
            field: 'id',
            message: `No pupil found with ID: ${id}`
          }]
        }
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Pupil updated successfully',
      data: updatedPupil.toSafeObject() // Remove sensitive data like password
    });
    
  } catch (error) {
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

    // Handle duplicate email error (from pre-save middleware)
    if (error.message === 'Email already exists') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Email already exists',
          type: 'DUPLICATE_ERROR',
          details: [{
            field: 'email',
            message: 'A pupil with this email already exists'
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

    // Handle MongoDB cast errors (invalid ObjectId format)
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid pupil ID format',
          type: 'INVALID_OBJECT_ID',
          details: [{
            field: 'id',
            message: 'Invalid MongoDB ObjectId format'
          }]
        }
      });
    }
    
    // Log unexpected errors for debugging
    console.error('Error updating pupil:', error);
    
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to update pupil',
        type: 'DATABASE_ERROR'
      }
    });
  }
};

/**
 * Delete a pupil record
 * DELETE /api/pupils/:id
 */
const deletePupil = async (req, res) => {
  try {
    const { id } = req.params;
    
    // ObjectId validation is handled by middleware (validateObjectId)
    // Find and delete pupil by ID
    const deletedPupil = await Pupil.findByIdAndDelete(id);
    
    if (!deletedPupil) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Pupil not found',
          type: 'NOT_FOUND',
          details: [{
            field: 'id',
            message: `No pupil found with ID: ${id}`
          }]
        }
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Pupil deleted successfully',
      data: {
        id: deletedPupil._id,
        fullName: deletedPupil.fullName,
        deletedAt: new Date().toISOString()
      }
    });
    
  } catch (error) {
    // Handle MongoDB cast errors (invalid ObjectId format)
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid pupil ID format',
          type: 'INVALID_OBJECT_ID',
          details: [{
            field: 'id',
            message: 'Invalid MongoDB ObjectId format'
          }]
        }
      });
    }
    
    // Log unexpected errors for debugging
    console.error('Error deleting pupil:', error);
    
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to delete pupil',
        type: 'DATABASE_ERROR'
      }
    });
  }
};

module.exports = {
  createPupil,
  getAllPupils,
  getPupilById,
  updatePupil,
  deletePupil
};