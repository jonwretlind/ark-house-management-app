#!/bin/bash

# Install dependencies
npm install

# Build the application (if needed)
# npm run build

# Start the application using PM2
pm2 start ecosystem.config.js --env production

# Save PM2 process list and environment
pm2 save

# Setup PM2 to start on system boot 