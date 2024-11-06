#!/bin/bash

# Install dependencies
npm install

# Build the application
npm run build

# If using nginx, copy the build files to the nginx directory
sudo cp -r dist/* /var/www/html/

# Restart nginx if needed
sudo systemctl restart nginx 