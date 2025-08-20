const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

// Simple test to verify database configuration works
describe('Database Connection', () => {
  let mongoServer;
  let originalEnv;

  beforeAll(async () => {
    // Save original environment
    originalEnv = process.env.MONGODB_URI;
    
    // Start in-memory MongoDB instance
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    // Set test environment
    process.env.MONGODB_URI = mongoUri;
    process.env.NODE_ENV = 'test';
  });

  afterAll(async () => {
    // Restore original environment
    process.env.MONGODB_URI = originalEnv;
    
    // Clean up
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Ensure clean state
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

  describe('Database Configuration Module', () => {
    it('should export a database connection object', () => {
      const databaseConnection = require('../../src/config/database');
      
      expect(databaseConnection).toBeDefined();
      expect(typeof databaseConnection.connect).toBe('function');
      expect(typeof databaseConnection.disconnect).toBe('function');
      expect(typeof databaseConnection.getConnectionStatus).toBe('function');
    });

    it('should connect to MongoDB successfully', async () => {
      const databaseConnection = require('../../src/config/database');
      
      // Speed up retries for testing
      databaseConnection.retryDelay = 100;
      databaseConnection.currentRetries = 0;
      databaseConnection.isConnected = false;
      
      await databaseConnection.connect();
      
      const status = databaseConnection.getConnectionStatus();
      expect(status.isConnected).toBe(true);
      expect(status.readyState).toBe(1); // 1 = connected
      
      // Clean up
      await databaseConnection.disconnect();
    }, 15000);

    it('should handle connection errors gracefully', async () => {
      const databaseConnection = require('../../src/config/database');
      
      // Set invalid MongoDB URI
      const originalUri = process.env.MONGODB_URI;
      process.env.MONGODB_URI = 'mongodb://invalid-host:27017/test';
      
      // Speed up retries for testing
      databaseConnection.retryDelay = 100;
      databaseConnection.currentRetries = 0;
      databaseConnection.isConnected = false;
      
      await expect(databaseConnection.connect()).rejects.toThrow();
      
      // Restore URI
      process.env.MONGODB_URI = originalUri;
    }, 15000);

    it('should return correct connection status', () => {
      const databaseConnection = require('../../src/config/database');
      
      const status = databaseConnection.getConnectionStatus();
      expect(status).toHaveProperty('isConnected');
      expect(status).toHaveProperty('readyState');
      expect(status).toHaveProperty('host');
      expect(status).toHaveProperty('port');
      expect(status).toHaveProperty('name');
    });
  });
});