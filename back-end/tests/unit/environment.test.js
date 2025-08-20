const environment = require('../../src/config/environment');

describe('Environment Configuration', () => {
  let originalEnv;

  beforeEach(() => {
    // Save original environment
    originalEnv = { ...process.env };
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  describe('Configuration Structure', () => {
    it('should export the correct configuration structure', () => {
      expect(environment).toHaveProperty('mongodb');
      expect(environment).toHaveProperty('server');
      expect(environment).toHaveProperty('app');
      expect(environment).toHaveProperty('validateEnvironment');
      expect(typeof environment.validateEnvironment).toBe('function');
    });

    it('should have mongodb configuration', () => {
      expect(environment.mongodb).toHaveProperty('uri');
      expect(environment.mongodb).toHaveProperty('dbName');
    });

    it('should have server configuration', () => {
      expect(environment.server).toHaveProperty('port');
      expect(environment.server).toHaveProperty('nodeEnv');
      expect(typeof environment.server.port).toBe('number');
    });

    it('should have app configuration', () => {
      expect(environment.app).toHaveProperty('name');
      expect(environment.app).toHaveProperty('version');
    });
  });

  describe('Environment Detection', () => {
    it('should detect production environment', () => {
      process.env.NODE_ENV = 'production';
      // Re-require to get updated environment
      delete require.cache[require.resolve('../../src/config/environment')];
      const env = require('../../src/config/environment');
      
      expect(env.isProduction()).toBe(true);
      expect(env.isDevelopment()).toBe(false);
      expect(env.isTest()).toBe(false);
    });

    it('should detect development environment', () => {
      process.env.NODE_ENV = 'development';
      delete require.cache[require.resolve('../../src/config/environment')];
      const env = require('../../src/config/environment');
      
      expect(env.isProduction()).toBe(false);
      expect(env.isDevelopment()).toBe(true);
      expect(env.isTest()).toBe(false);
    });

    it('should detect test environment', () => {
      process.env.NODE_ENV = 'test';
      delete require.cache[require.resolve('../../src/config/environment')];
      const env = require('../../src/config/environment');
      
      expect(env.isProduction()).toBe(false);
      expect(env.isDevelopment()).toBe(false);
      expect(env.isTest()).toBe(true);
    });
  });

  describe('Default Values', () => {
    it('should have reasonable default values', () => {
      expect(environment.mongodb.uri).toContain('mongodb://');
      expect(environment.mongodb.dbName).toBeTruthy();
      expect(typeof environment.server.port).toBe('number');
      expect(environment.server.port).toBeGreaterThan(0);
      expect(environment.server.nodeEnv).toBeTruthy();
    });

    it('should handle environment variables correctly', () => {
      // Test that the configuration structure is correct
      expect(environment.mongodb).toBeDefined();
      expect(environment.server).toBeDefined();
      expect(environment.app).toBeDefined();
      
      // Test that values are of correct types
      expect(typeof environment.mongodb.uri).toBe('string');
      expect(typeof environment.mongodb.dbName).toBe('string');
      expect(typeof environment.server.port).toBe('number');
      expect(typeof environment.server.nodeEnv).toBe('string');
    });
  });

  describe('Validation', () => {
    it('should validate successfully with valid configuration', () => {
      process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
      
      delete require.cache[require.resolve('../../src/config/environment')];
      const env = require('../../src/config/environment');
      
      expect(() => env.validateEnvironment()).not.toThrow();
    });
  });
});