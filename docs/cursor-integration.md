# Cursor Integration Guide

This guide explains how to integrate the Cursor Admin MCP server with Cursor editor.

## Prerequisites

1. Cursor editor installed
2. Node.js 16+ installed
3. Cursor Admin API key (get from your team settings)

## Installation Methods

### Method 1: Local Installation (Recommended for Development)

1. Clone and build the project:
```bash
git clone https://github.com/h3ro-dev/cursor-admin-mcp.git
cd cursor-admin-mcp
npm install
npm run build
```

2. Set up your API key:
```bash
cp .env.example .env
# Edit .env and add your CURSOR_API_KEY
```

3. Add to Cursor settings (⌘+, on Mac, Ctrl+, on Windows/Linux):

```json
{
  "mcpServers": {
    "cursor-admin": {
      "command": "node",
      "args": ["/full/path/to/cursor-admin-mcp/dist/index.js"],
      "env": {
        "CURSOR_API_KEY": "key_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
      }
    }
  }
}
```

### Method 2: Global NPM Installation

1. Install globally:
```bash
npm install -g cursor-admin-mcp
```

2. Add to Cursor settings:
```json
{
  "mcpServers": {
    "cursor-admin": {
      "command": "cursor-admin-mcp",
      "env": {
        "CURSOR_API_KEY": "key_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
      }
    }
  }
}
```

### Method 3: Using npx (No Installation)

Add to Cursor settings:
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

## Verifying the Integration

1. Restart Cursor after adding the configuration
2. Open the AI chat (⌘+L or Ctrl+L)
3. Try these commands:

```
"Show me all team members"
"Get usage data for the last 7 days"
"What's our team's total spending?"
```

## Troubleshooting

### Server Not Responding

1. Check the Cursor console for errors (View → Output → MCP)
2. Verify your API key is correct
3. Ensure Node.js is in your PATH

### Authentication Errors

1. Verify you're a team admin
2. Check that your API key starts with `key_`
3. Ensure the key hasn't been revoked

### Permission Errors

On macOS/Linux, you may need to make the script executable:
```bash
chmod +x /path/to/cursor-admin-mcp/dist/index.js
```

## Advanced Configuration

### Custom Environment Variables

You can add additional environment variables:
```json
{
  "mcpServers": {
    "cursor-admin": {
      "command": "node",
      "args": ["/path/to/cursor-admin-mcp/dist/index.js"],
      "env": {
        "CURSOR_API_KEY": "key_xxx",
        "NODE_ENV": "production",
        "LOG_LEVEL": "debug"
      }
    }
  }
}
```

### Multiple Team Support

To support multiple teams, add multiple server instances:
```json
{
  "mcpServers": {
    "cursor-team-a": {
      "command": "node",
      "args": ["/path/to/cursor-admin-mcp/dist/index.js"],
      "env": {
        "CURSOR_API_KEY": "key_team_a"
      }
    },
    "cursor-team-b": {
      "command": "node",
      "args": ["/path/to/cursor-admin-mcp/dist/index.js"],
      "env": {
        "CURSOR_API_KEY": "key_team_b"
      }
    }
  }
}
```

## Security Best Practices

1. **Never commit your API key** to version control
2. **Use environment variables** instead of hardcoding keys
3. **Restrict API key permissions** if possible
4. **Rotate keys regularly**
5. **Monitor usage** through the Cursor admin panel

## Example Workflows

### Daily Standup Report
```
"Generate a daily standup report showing:
- Team usage statistics for yesterday
- Top contributors by lines of code
- AI acceptance rates by team member"
```

### Weekly Analytics
```
"Create a weekly report showing:
- Total lines of code added/removed
- Most active days and times
- Model usage breakdown
- Extension adoption rates"
```

### Cost Analysis
```
"Analyze our team's spending:
- Show top 5 spenders this month
- Calculate average cost per developer
- Compare this month to last month"
```

## Support

- Report issues: https://github.com/h3ro-dev/cursor-admin-mcp/issues
- Documentation: https://github.com/h3ro-dev/cursor-admin-mcp/wiki
- Cursor docs: https://docs.cursor.com