#!/bin/bash
# Production startup script for cPanel hosting

# Set environment variables
export NODE_ENV=production
export PORT=${PORT:-3000}

# Start the application
npm start
