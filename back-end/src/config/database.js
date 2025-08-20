const mongoose = require('mongoose');
require('dotenv').config();

class DatabaseConnection {
  constructor() {
    this.isConnected = false;
    this.maxRetries = 5;
    this.retryDelay = 5000; // 5 seconds
    this.currentRetries = 0;
  }

  async connect() {
    if (this.isConnected) {
      console.log('Database already connected');
      return;
    }

    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pupil-registration';
    
    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false
    };

    try {
      await this.connectWithRetry(mongoUri, options);
    } catch (error) {
      console.error('Failed to connect to database after maximum retries:', error.message);
      throw error;
    }
  }

  async connectWithRetry(mongoUri, options) {
    while (this.currentRetries < this.maxRetries) {
      try {
        console.log(`Attempting to connect to MongoDB... (Attempt ${this.currentRetries + 1}/${this.maxRetries})`);
        
        await mongoose.connect(mongoUri, options);
        
        this.isConnected = true;
        this.currentRetries = 0;
        console.log('Successfully connected to MongoDB');
        
        // Set up connection event listeners
        this.setupEventListeners();
        
        return;
      } catch (error) {
        this.currentRetries++;
        console.error(`Database connection attempt ${this.currentRetries} failed:`, error.message);
        
        if (this.currentRetries >= this.maxRetries) {
          throw new Error(`Failed to connect to database after ${this.maxRetries} attempts: ${error.message}`);
        }
        
        console.log(`Retrying in ${this.retryDelay / 1000} seconds...`);
        await this.delay(this.retryDelay);
      }
    }
  }

  setupEventListeners() {
    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to MongoDB');
      this.isConnected = true;
    });

    mongoose.connection.on('error', (error) => {
      console.error('Mongoose connection error:', error);
      this.isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected from MongoDB');
      this.isConnected = false;
      
      // Attempt to reconnect if not in test environment
      if (process.env.NODE_ENV !== 'test') {
        console.log('Attempting to reconnect...');
        this.currentRetries = 0;
        this.connect().catch(error => {
          console.error('Reconnection failed:', error.message);
        });
      }
    });

    // Handle application termination
    process.on('SIGINT', this.gracefulShutdown.bind(this));
    process.on('SIGTERM', this.gracefulShutdown.bind(this));
  }

  async gracefulShutdown() {
    console.log('Received shutdown signal, closing database connection...');
    try {
      await mongoose.connection.close();
      console.log('Database connection closed successfully');
      process.exit(0);
    } catch (error) {
      console.error('Error during database shutdown:', error);
      process.exit(1);
    }
  }

  async disconnect() {
    if (!this.isConnected) {
      return;
    }
    
    try {
      await mongoose.connection.close();
      this.isConnected = false;
      console.log('Database disconnected successfully');
    } catch (error) {
      console.error('Error disconnecting from database:', error);
      throw error;
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name
    };
  }

  getConnectionState() {
    return mongoose.connection.readyState;
  }
}

// Create singleton instance
const databaseConnection = new DatabaseConnection();

module.exports = databaseConnection;