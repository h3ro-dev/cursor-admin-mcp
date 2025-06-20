#!/bin/bash

echo "🚀 Cursor Admin MCP Server Setup"
echo "================================"
echo ""

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo ""
echo "🔨 Building the project..."
npm run build

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please edit .env and add your CURSOR_API_KEY"
fi

# Test the build
echo ""
echo "🧪 Testing the build..."
if npm test; then
    echo "✅ All tests passed!"
else
    echo "⚠️  Some tests failed. This might be due to missing API key."
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env and add your CURSOR_API_KEY"
echo "2. Run 'npm run dev examples/test-connection.ts' to test your connection"
echo "3. Add the server to your Claude Desktop or Cursor configuration"
echo ""
echo "For more information, see the README.md file."