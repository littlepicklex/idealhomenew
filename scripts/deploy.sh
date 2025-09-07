#!/bin/bash

# Deploy script for Vercel
echo "🚀 Starting deployment process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🗄️ Generating Prisma client..."
npx prisma generate

# Build the application
echo "🏗️ Building application..."
npm run build

echo "✅ Build completed successfully!"
echo "🌐 Ready for deployment to Vercel"
