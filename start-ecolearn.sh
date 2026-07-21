#!/usr/bin/env sh
set -e
if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is required. Install Node.js 20.9 or newer."
  exit 1
fi
if [ ! -d node_modules ]; then
  echo "Installing EcoLearn dependencies..."
  npm install
fi
echo "Starting EcoLearn at http://localhost:3000"
npm run dev
