const express = require('express');
const {
  createPupil,
  getAllPupils,
  getPupilById,
  updatePupil,
  deletePupil
} = require('../controllers/pupilController');
const {
  validatePupilCreate,
  validatePupilUpdate,
  validateObjectId
} = require('../middleware/validation');

// Create Express router
const router = express.Router();

/**
 * Pupil CRUD Routes
 * All routes are prefixed with /api/pupils when mounted in the main app
 */

/**
 * GET /api/pupils
 * Retrieve all pupils
 */
router.get('/', getAllPupils);

/**
 * GET /api/pupils/:id
 * Retrieve a specific pupil by ID
 */
router.get('/:id', validateObjectId('id'), getPupilById);

/**
 * POST /api/pupils
 * Create a new pupil record
 */
router.post('/', validatePupilCreate, createPupil);

/**
 * PUT /api/pupils/:id
 * Update an existing pupil record
 */
router.put('/:id', validateObjectId('id'), validatePupilUpdate, updatePupil);

/**
 * DELETE /api/pupils/:id
 * Delete a pupil record
 */
router.delete('/:id', validateObjectId('id'), deletePupil);

module.exports = router;