#!/bin/bash

# Cloudflare Pages build script
echo "Starting Cloudflare Pages build..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "package.json not found in current directory"
    echo "Current directory: $(pwd)"
    echo "Directory contents:"
    ls -la
    
    # Try to find package.json
    if [ -f "tunel-app/package.json" ]; then
        echo "Found package.json in tunel-app directory"
        cd tunel-app
    else
        echo "ERROR: Cannot find package.json"
        exit 1
    fi
fi

echo "Building from directory: $(pwd)"
echo "Running npm install..."
npm install

echo "Running npm run build..."
npm run build

echo "Build completed successfully!"
echo "Output directory contents:"
ls -la out/