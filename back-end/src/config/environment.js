require('dotenv').config();

const getEnvironment = () => {
    return {
        // Database Configuration
        mongodb: {
            uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/pupil-registration',
            dbName: process.env.DB_NAME || 'pupil-registration'
        },

        // Server Configuration
        server: {
            port: parseInt(process.env.PORT) || 3000,
            nodeEnv: process.env.NODE_ENV || 'development'
        },

        // Application Configuration
        app: {
            name: 'Pupil Registration Backend',
            version: '1.0.0'
        },

        // Validation
        isProduction: () => (process.env.NODE_ENV || 'development') === 'production',
        isDevelopment: () => (process.env.NODE_ENV || 'development') === 'development',
        isTest: () => (process.env.NODE_ENV || 'development') === 'test'
    };
};

const environment = getEnvironment();

// Validate required environment variables
const validateEnvironment = () => {
    const required = [];

    if (!environment.mongodb.uri) {
        required.push('MONGODB_URI');
    }

    if (required.length > 0) {
        throw new Error(`Missing required environment variables: ${required.join(', ')}`);
    }
};

// Export configuration
module.exports = {
    ...environment,
    validateEnvironment
};