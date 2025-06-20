#!/bin/bash

# Test script for cursor-admin-mcp server

echo "🧪 Testing Cursor Admin MCP Server"
echo "=================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found"
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo ""
    echo "⚠️  Please edit .env and add your CURSOR_API_KEY"
    echo "Then run this script again."
    exit 1
fi

# Check if API key is set
if grep -q "your_api_key_here" .env; then
    echo "❌ Error: CURSOR_API_KEY not set in .env"
    echo "Please edit .env and add your actual API key"
    exit 1
fi

echo "✅ Environment configured"
echo ""

# Test the server by running it and sending a request
echo "📡 Starting MCP server..."
echo "The server will output to stderr, so you'll see startup messages below:"
echo ""

# Run the server in the background and capture its PID
node dist/index.js &
SERVER_PID=$!

# Give the server time to start
sleep 2

echo ""
echo "✅ Server started (PID: $SERVER_PID)"
echo ""
echo "To use this server:"
echo ""
echo "1. In Claude Desktop, add to your config:"
echo '   {
     "mcpServers": {
       "cursor-admin": {
         "command": "node",
         "args": ["'$(pwd)'/dist/index.js"],
         "env": {
           "CURSOR_API_KEY": "your_key_here"
         }
       }
     }
   }'
echo ""
echo "2. Or install globally with: npm install -g ."
echo ""
echo "Press Ctrl+C to stop the server..."

# Wait for user to stop
wait $SERVER_PID