#!/bin/bash

# Production startup script for Pupil Registration Backend
# This script sets up the environment and starts the application

set -e

echo "🚀 Starting Pupil Registration Backend..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Copying from .env.example..."
    cp .env.example .env
    echo "✅ .env file created. Please review and update the configuration."
fi

# Check if MongoDB is running (optional check)
if command -v mongosh &> /dev/null; then
    echo "🔍 Checking MongoDB connection..."
    if mongosh --eval "db.runCommand('ping')" --quiet > /dev/null 2>&1; then
        echo "✅ MongoDB is running"
    else
        echo "⚠️  MongoDB connection failed. Please ensure MongoDB is running."
    fi
else
    echo "ℹ️  MongoDB CLI not found. Skipping connection check."
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Run health check after starting (in background)
echo "🏥 Starting health check monitor..."
(
    sleep 5
    if curl -f http://localhost:${PORT:-6006}/health > /dev/null 2>&1; then
        echo "✅ Application health check passed"
    else
        echo "❌ Application health check failed"
    fi
) &

# Start the application
echo "🎯 Starting application in production mode..."
exec npm start