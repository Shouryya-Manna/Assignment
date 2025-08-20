const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
require('dotenv').config();

// Import routes and middleware
const pupilRoutes = require('./routes/pupils');
const { globalErrorHandler, notFoundHandler } = require('./middleware/errorHandler');
const databaseConnection = require('./config/database');

// Load Swagger documentation
const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));

// Application configuration
const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  appName: process.env.APP_NAME || 'Pupil Registration Backend',
  appVersion: process.env.APP_VERSION || '1.0.0',
  logLevel: process.env.LOG_LEVEL || 'info',
  enableRequestLogging: process.env.ENABLE_REQUEST_LOGGING === 'true',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  requestSizeLimit: process.env.REQUEST_SIZE_LIMIT || '10mb',
  healthCheckEnabled: process.env.HEALTH_CHECK_ENABLED !== 'false'
};

// Logging utility
const logger = {
  info: (message, ...args) => {
    if (config.logLevel === 'info' || config.logLevel === 'debug') {
      console.log(`[${new Date().toISOString()}] INFO: ${message}`, ...args);
    }
  },
  error: (message, ...args) => {
    console.error(`[${new Date().toISOString()}] ERROR: ${message}`, ...args);
  },
  warn: (message, ...args) => {
    console.warn(`[${new Date().toISOString()}] WARN: ${message}`, ...args);
  },
  debug: (message, ...args) => {
    if (config.logLevel === 'debug') {
      console.log(`[${new Date().toISOString()}] DEBUG: ${message}`, ...args);
    }
  }
};

// Create Express application
const app = express();

// Application startup logging
logger.info(`Starting ${config.appName} v${config.appVersion}`);
logger.info(`Environment: ${config.nodeEnv}`);
logger.info(`Port: ${config.port}`);

// Connect to MongoDB with error handling
const connectDatabase = async () => {
  try {
    await databaseConnection.connect();
    logger.info('Database connection established successfully');
  } catch (error) {
    logger.error('Failed to connect to database:', error.message);
    if (config.nodeEnv === 'production') {
      process.exit(1);
    }
  }
};

connectDatabase();

// Middleware setup
const corsOptions = {
  origin: config.corsOrigin === '*' ? true : config.corsOrigin.split(','),
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json({ limit: config.requestSizeLimit }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (configurable)
if (config.enableRequestLogging) {
  app.use((req, res, next) => {
    logger.debug(`${req.method} ${req.url} - ${req.ip}`);
    next();
  });
}

// Enhanced health check endpoint
if (config.healthCheckEnabled) {
  app.get('/health', async (req, res) => {
    const healthCheck = {
      success: true,
      message: 'Server is running',
      timestamp: new Date().toISOString(),
      application: {
        name: config.appName,
        version: config.appVersion,
        environment: config.nodeEnv,
        uptime: process.uptime()
      },
      database: {
        status: 'unknown'
      }
    };

    // Check database connection
    try {
      const dbState = databaseConnection.getConnectionState();
      healthCheck.database.status = dbState === 1 ? 'connected' : 'disconnected';
    } catch (error) {
      healthCheck.database.status = 'error';
      healthCheck.database.error = error.message;
    }

    // Set appropriate status code based on database connection
    const statusCode = healthCheck.database.status === 'connected' ? 200 : 503;

    res.status(statusCode).json(healthCheck);
  });

  // Simple ping endpoint for basic health checks
  app.get('/ping', (req, res) => {
    res.status(200).json({ message: 'pong', timestamp: new Date().toISOString() });
  });
}

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Driving School API Documentation',
  swaggerOptions: {
    docExpansion: 'none',
    filter: true,
    showRequestHeaders: true
  }
}));

// API Routes
// Mount pupil routes under /api/pupils prefix
app.use('/api/pupils', pupilRoutes);

// 404 handler for unmatched routes
app.use(notFoundHandler);

// Global error handling middleware
app.use(globalErrorHandler);

// Graceful shutdown handling
const gracefulShutdown = (signal) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);

  // Close database connection
  databaseConnection.disconnect()
    .then(() => {
      logger.info('Database connection closed');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Error during database disconnect:', error.message);
      process.exit(1);
    });
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Only start server if this file is run directly (not during testing)
if (require.main === module) {
  const server = app.listen(config.port, () => {
    logger.info(`🚀 ${config.appName} started successfully`);
    logger.info(`📡 Server listening on port ${config.port}`);
    logger.info(`🌍 Environment: ${config.nodeEnv}`);

    if (config.healthCheckEnabled) {
      logger.info(`💚 Health check: http://localhost:${config.port}/health`);
      logger.info(`🏓 Ping endpoint: http://localhost:${config.port}/ping`);
    }

    logger.info(`🔗 API endpoints: http://localhost:${config.port}/api/pupils`);
    logger.info(`� API Documentation: http://localhost:${config.port}/api-docs/#/Pupils`);
    logger.info(`📝 Request logging: ${config.enableRequestLogging ? 'enabled' : 'disabled'}`);
    logger.info('✅ Application startup complete');
  });

  // Handle server errors
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      logger.error(`Port ${config.port} is already in use`);
    } else {
      logger.error('Server error:', error);
    }
    process.exit(1);
  });
}

module.exports = app;