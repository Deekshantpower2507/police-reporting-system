#!/usr/bin/env bash
# Exit immediately if a command exits with a non-zero status
set -e

echo "==> 1/3 Installing Server Dependencies & Rebuilding for Linux..."
cd server
npm install --no-audit --no-fund
npm rebuild sqlite3 bcrypt

echo "==> 2/3 Installing Client Dependencies..."
cd ../client
npm install --no-audit --no-fund

echo "==> 3/3 Building Vite Frontend..."
npm run build

echo "==> Returning to root..."
cd ..

echo "==> ✅ Full-Stack Build Completed Successfully for Linux!"
