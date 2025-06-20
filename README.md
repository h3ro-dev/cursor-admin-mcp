# Cursor Admin MCP Server

<div align="center">
  
  [![npm version](https://img.shields.io/npm/v/cursor-admin-mcp.svg)](https://www.npmjs.com/package/cursor-admin-mcp)
  [![npm downloads](https://img.shields.io/npm/dm/cursor-admin-mcp.svg)](https://www.npmjs.com/package/cursor-admin-mcp)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Build Status](https://github.com/h3ro-dev/cursor-admin-mcp/workflows/CI/badge.svg)](https://github.com/h3ro-dev/cursor-admin-mcp/actions)
  [![Test Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)](./coverage)
  
  **🎮 The Team Analytics Power-Up for Your AI Assistant**
  
  *One command, and your AI gains the ability to analyze your entire Cursor team's performance.*
  
</div>

## 🚀 Quick Install

```bash
npx -y cursor-admin-mcp
```

That's it. Your AI assistant just leveled up.

## 🎯 What You Get

Think of this as equipping your AI with X-ray vision for your development team:

- **🏢 Team Roster** - Instantly know who's on the team and their roles
- **📊 Usage Analytics** - See who's actually coding vs. who's in meetings
- **💰 Credit Tracker** - Know exactly where your AI credits are going
- **📈 Productivity Metrics** - Lines added, AI acceptance rates, favorite models
- **🔍 Deep Insights** - Which developer uses which tools, when they're most active

## 💪 Why This Matters

Stop asking your team for status updates. Your AI can now tell you:
- "Who wrote the most code this week?"
- "What's our AI spending trend?"
- "Which team member has the highest AI acceptance rate?"
- "Show me usage patterns for the last month"

## 📸 See It In Action

```
You: "Show me team usage for this week"

AI: Here's your team's activity for the last 7 days:

👥 TEAM MEMBERS
1. James Brady (Owner) - james@jamesbrady.org
2. Cody Vincent - vincent.cody298@gmail.com
3. 2 other members

📊 USAGE STATISTICS
• Most Active: Cody Vincent (641 AI requests)
• Most Productive: Cody Vincent (29,477 lines added)
• Top Models: claude-4-opus, gpt-4, claude-sonnet
• Active Days: 2/4 members coding daily

💰 SPENDING: $1,957.32 total
• James Brady: $1,848.57 (94.4%)
• Cody Vincent: $73.76 (3.8%)
• Others: $34.99 (1.8%)
```

## Installation

### Prerequisites

- Node.js 16+ 
- A Cursor team admin API key (get it from your team settings)

### Install from npm

```bash
npm install -g cursor-admin-mcp
```

### Install from source

```bash
git clone https://github.com/h3ro-dev/cursor-admin-mcp.git
cd cursor-admin-mcp
npm install
npm run build
```

## Configuration

### 1. Set up your API key

Create a `.env` file in the project root (or set the environment variable):

```env
CURSOR_API_KEY=key_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 2. Configure in Claude Desktop

Add to your Claude Desktop configuration (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "cursor-admin": {
      "command": "npx",
      "args": ["cursor-admin-mcp"],
      "env": {
        "CURSOR_API_KEY": "key_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
      }
    }
  }
}
```

### 3. Configure in Cursor

Add to your Cursor settings:

```json
{
  "mcpServers": {
    "cursor-admin": {
      "command": "node",
      "args": ["/path/to/cursor-admin-mcp/dist/index.js"],
      "env": {
        "CURSOR_API_KEY": "key_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
      }
    }
  }
}
```

## Available Tools

### 1. `get_team_members`

Get a list of all team members with their information.

**Example usage in Claude/Cursor:**
```
"Show me all team members"
"List everyone on the team with their roles"
```

**Returns:**
```json
[
  {
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin"
  },
  {
    "name": "Jane Smith",
    "email": "jane@example.com",
    "role": "member"
  }
]
```

### 2. `get_daily_usage_data`

Retrieve detailed usage metrics for a specified date range (max 90 days).

**Parameters:**
- `startDate`: Start date in epoch milliseconds
- `endDate`: End date in epoch milliseconds

**Example usage in Claude/Cursor:**
```
"Show me usage data for the last 7 days"
"What was our team's AI acceptance rate last month?"
"Which models did we use most this week?"
```

**Returns:**
```json
[
  {
    "date": "2024-01-15",
    "linesAdded": 1523,
    "linesDeleted": 342,
    "acceptanceRate": 0.82,
    "requestTypes": {
      "completion": 234,
      "chat": 56,
      "edit": 23
    },
    "mostUsedModels": ["gpt-4", "claude-3"],
    "mostUsedExtensions": ["copilot", "cursor-tab"],
    "clientVersion": "0.42.0"
  }
]
```

### 3. `get_spending_data`

Get team spending information with optional filtering and pagination.

**Optional Parameters:**
- `searchTerm`: Filter by search term
- `sortBy`: Field to sort by
- `sortDirection`: "asc" or "desc"
- `page`: Page number
- `pageSize`: Items per page

**Example usage in Claude/Cursor:**
```
"Show me team spending"
"Who are the top spenders this month?"
"Search for John's spending data"
```

**Returns:**
```json
{
  "members": [
    {
      "email": "john@example.com",
      "name": "John Doe",
      "spending": 125.50
    }
  ],
  "total": 1250.00,
  "page": 1,
  "pageSize": 10
}
```

## Development

### Setup

```bash
# Clone the repository
git clone https://github.com/h3ro-dev/cursor-admin-mcp.git
cd cursor-admin-mcp

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# Edit .env and add your CURSOR_API_KEY

# Run in development mode
npm run dev
```

### Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm run test:watch
```

### Building

```bash
# Build the project
npm run build

# Run the built version
npm start
```

### Project Structure

```
cursor-admin-mcp/
├── src/
│   ├── index.ts          # MCP server implementation
│   └── cursor-client.ts  # Cursor API client
├── tests/
│   └── cursor-client.test.ts  # Test suite
├── examples/
│   └── (example scripts)
├── docs/
│   └── (additional documentation)
├── package.json
├── tsconfig.json
├── jest.config.js
├── .env.example
├── .gitignore
└── README.md
```

## Examples

### Basic Usage

```typescript
// The MCP server handles all the communication
// Just use natural language in Claude/Cursor:

"Show me all team members and their roles"
"Get usage data for January 2024"
"What's our team's total spending this month?"
"Show me the AI acceptance rate trend for the last 30 days"
```

### Advanced Queries

```typescript
// Complex date ranges
"Compare usage between last week and this week"

// Specific metrics
"Which team members have the highest AI suggestion acceptance rate?"

// Spending analysis
"Show me spending sorted by amount for team members whose name contains 'John'"
```

## Error Handling

The server includes comprehensive error handling:

- **Invalid API Key**: Clear error message if authentication fails
- **Rate Limiting**: Respects Cursor API rate limits
- **Date Validation**: Ensures date ranges don't exceed 90 days
- **Network Errors**: Graceful handling of connection issues
- **Invalid Parameters**: Detailed validation messages

## Security

- API keys are never logged or exposed
- All communication uses HTTPS
- Basic authentication as per Cursor API requirements
- Environment variables for sensitive data

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Write tests for new features
- Update documentation
- Follow TypeScript best practices
- Ensure all tests pass
- Add examples for new functionality

## Troubleshooting

### API Key Issues

If you get authentication errors:
1. Verify your API key starts with `key_`
2. Ensure you're a team admin
3. Check the key hasn't been revoked

### Connection Issues

If the server won't connect:
1. Check your internet connection
2. Verify the Cursor API is accessible
3. Check for any firewall restrictions

### Date Range Errors

If you get date range errors:
1. Ensure your date range is within 90 days
2. Use epoch milliseconds for dates
3. Verify endDate > startDate

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Built for the [Cursor](https://cursor.com) editor
- Implements the [Model Context Protocol](https://modelcontextprotocol.io)
- Uses the official [MCP SDK](https://github.com/modelcontextprotocol/sdk)

## Support

- 🐛 [Report bugs](https://github.com/h3ro-dev/cursor-admin-mcp/issues)
- 💡 [Request features](https://github.com/h3ro-dev/cursor-admin-mcp/issues)
- 📖 [Read the docs](https://github.com/h3ro-dev/cursor-admin-mcp/wiki)
- 💬 [Join discussions](https://github.com/h3ro-dev/cursor-admin-mcp/discussions)

---

Made with ❤️ for the Cursor community