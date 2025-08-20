const request = require('supertest');
const app = require('../../src/app');

describe('Express Routes Integration', () => {
  describe('Health Check', () => {
    it('should respond to health check endpoint', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        message: 'Server is running',
        timestamp: expect.any(String)
      });
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/non-existent-route')
        .expect(404);

      expect(response.body).toEqual({
        success: false,
        error: {
          message: 'Route not found',
          type: 'NOT_FOUND',
          details: [{
            field: 'url',
            message: 'No route found for GET /non-existent-route'
          }]
        }
      });
    });
  });

  describe('Pupil Routes', () => {
    it('should have pupil routes mounted at /api/pupils', async () => {
      // This will test that the route exists and validation middleware is working
      const response = await request(app)
        .post('/api/pupils')
        .send({}) // Empty body to trigger validation
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.type).toBe('VALIDATION_ERROR');
    });

    it('should validate ObjectId for GET /api/pupils/:id', async () => {
      const response = await request(app)
        .get('/api/pupils/invalid-id')
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        error: {
          message: 'Invalid id format',
          type: 'INVALID_OBJECT_ID',
          details: [{
            field: 'id',
            message: expect.stringContaining('Invalid')
          }]
        }
      });
    });
  });
});