const { 
  validatePupilCreate, 
  validatePupilUpdate, 
  validateObjectId, 
  formatValidationError,
  globalErrorHandler 
} = require('../../src/middleware/validation');
const { ZodError } = require('zod');

// Mock request and response objects
const mockRequest = (body = {}, params = {}) => ({
  body,
  params
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn();

describe('Validation Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('validatePupilCreate', () => {
    it('should pass validation with valid pupil data', () => {
      const validPupilData = {
        forename: 'John',
        surname: 'Smith',
        dob: '1995-03-15',
        gender: 'Male',
        email: 'john.smith@email.com'
      };

      const req = mockRequest(validPupilData);
      const res = mockResponse();

      validatePupilCreate(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(req.body.forename).toBe('John');
    });

    it('should fail validation with missing required fields', () => {
      const invalidPupilData = {
        forename: 'John'
        // Missing surname, dob, gender
      };

      const req = mockRequest(invalidPupilData);
      const res = mockResponse();

      validatePupilCreate(req, res, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            message: 'Validation failed',
            type: 'VALIDATION_ERROR',
            details: expect.arrayContaining([
              expect.objectContaining({
                field: 'surname',
                message: 'Required'
              })
            ])
          })
        })
      );
    });

    it('should fail validation with invalid email format', () => {
      const invalidPupilData = {
        forename: 'John',
        surname: 'Smith',
        dob: '1995-03-15',
        gender: 'Male',
        email: 'invalid-email'
      };

      const req = mockRequest(invalidPupilData);
      const res = mockResponse();

      validatePupilCreate(req, res, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            details: expect.arrayContaining([
              expect.objectContaining({
                field: 'email',
                message: 'Invalid email format'
              })
            ])
          })
        })
      );
    });

    it('should fail validation with invalid gender', () => {
      const invalidPupilData = {
        forename: 'John',
        surname: 'Smith',
        dob: '1995-03-15',
        gender: 'InvalidGender'
      };

      const req = mockRequest(invalidPupilData);
      const res = mockResponse();

      validatePupilCreate(req, res, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            details: expect.arrayContaining([
              expect.objectContaining({
                field: 'gender',
                message: 'Gender must be Male, Female, or Other'
              })
            ])
          })
        })
      );
    });
  });

  describe('validatePupilUpdate', () => {
    it('should pass validation with valid partial update data', () => {
      const validUpdateData = {
        forename: 'Jane',
        email: 'jane.smith@email.com'
      };

      const req = mockRequest(validUpdateData);
      const res = mockResponse();

      validatePupilUpdate(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(req.body.forename).toBe('Jane');
    });

    it('should pass validation with empty body for updates', () => {
      const req = mockRequest({});
      const res = mockResponse();

      validatePupilUpdate(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should fail validation with invalid data in update', () => {
      const invalidUpdateData = {
        email: 'invalid-email-format'
      };

      const req = mockRequest(invalidUpdateData);
      const res = mockResponse();

      validatePupilUpdate(req, res, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('validateObjectId', () => {
    it('should pass validation with valid ObjectId', () => {
      const req = mockRequest({}, { id: '64a7b8c9d1e2f3a4b5c6d7e8' });
      const res = mockResponse();

      validateObjectId()(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should fail validation with invalid ObjectId format', () => {
      const req = mockRequest({}, { id: 'invalid-id' });
      const res = mockResponse();

      validateObjectId()(req, res, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            message: 'Invalid id format',
            type: 'INVALID_OBJECT_ID'
          })
        })
      );
    });

    it('should fail validation with missing ObjectId parameter', () => {
      const req = mockRequest({}, {});
      const res = mockResponse();

      validateObjectId()(req, res, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            message: 'Missing required parameter: id',
            type: 'MISSING_PARAMETER'
          })
        })
      );
    });

    it('should validate custom parameter name', () => {
      const req = mockRequest({}, { pupilId: '64a7b8c9d1e2f3a4b5c6d7e8' });
      const res = mockResponse();

      validateObjectId('pupilId')(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe('formatValidationError', () => {
    it('should format ZodError correctly', () => {
      // Create a mock ZodError-like object
      const mockZodError = {
        errors: [
          {
            path: ['forename'],
            message: 'Forename is required',
            code: 'too_small'
          },
          {
            path: ['email'],
            message: 'Invalid email format',
            code: 'invalid_string'
          }
        ]
      };

      const formatted = formatValidationError(mockZodError);

      expect(formatted).toEqual({
        success: false,
        error: {
          message: 'Validation failed',
          type: 'VALIDATION_ERROR',
          details: [
            {
              field: 'forename',
              message: 'Forename is required',
              code: 'too_small'
            },
            {
              field: 'email',
              message: 'Invalid email format',
              code: 'invalid_string'
            }
          ]
        }
      });
    });
  });

  describe('globalErrorHandler', () => {
    it('should handle ZodError', () => {
      const mockZodError = new ZodError([
        {
          path: ['test'],
          message: 'Test error',
          code: 'custom'
        }
      ]);

      const req = mockRequest();
      const res = mockResponse();

      globalErrorHandler(mockZodError, req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            message: 'Validation failed',
            type: 'VALIDATION_ERROR'
          })
        })
      );
    });

    it('should handle MongoDB ValidationError', () => {
      const mockMongoError = {
        name: 'ValidationError',
        errors: {
          forename: { message: 'Forename is required' },
          email: { message: 'Invalid email' }
        }
      };

      const req = mockRequest();
      const res = mockResponse();

      globalErrorHandler(mockMongoError, req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            message: 'Database validation failed',
            type: 'DATABASE_VALIDATION_ERROR'
          })
        })
      );
    });

    it('should handle MongoDB CastError', () => {
      const mockCastError = {
        name: 'CastError',
        kind: 'ObjectId'
      };

      const req = mockRequest();
      const res = mockResponse();

      globalErrorHandler(mockCastError, req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            message: 'Invalid ID format',
            type: 'INVALID_OBJECT_ID'
          })
        })
      );
    });

    it('should handle MongoDB duplicate key error', () => {
      const mockDuplicateError = {
        code: 11000,
        keyPattern: { email: 1 }
      };

      const req = mockRequest();
      const res = mockResponse();

      globalErrorHandler(mockDuplicateError, req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            message: 'Duplicate value error',
            type: 'DUPLICATE_ERROR'
          })
        })
      );
    });

    it('should handle unknown errors', () => {
      const mockUnknownError = new Error('Unknown error');

      const req = mockRequest();
      const res = mockResponse();

      // Mock console.error to avoid test output
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      globalErrorHandler(mockUnknownError, req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            message: 'Internal server error',
            type: 'INTERNAL_ERROR'
          })
        })
      );

      consoleSpy.mockRestore();
    });
  });
});