# Cursor Admin MCP Installation Guide

## Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/h3ro-dev/cursor-admin-mcp.git
cd cursor-admin-mcp

# Run the setup script
./setup.sh

# Or manually:
npm install
npm run build
```

### 2. Configure API Key

Edit the `.env` file:
```env
CURSOR_API_KEY=key_your_actual_api_key_here
```

Get your API key from: Cursor → Settings → Team → Admin API

### 3. Test Your Setup

```bash
# Test connection
npm run dev examples/test-connection.ts

# If successful, you'll see:
# ✅ Successfully connected to Cursor API!
# Found X team members:
# ...
```

## Adding to Claude Code

1. Open Claude Code settings:
```bash
code ~/.claude/claude_code_config.json
```

2. Add the MCP server configuration:
```json
{
  "mcpServers": {
    "cursor-admin": {
      "command": "node",
      "args": ["/Users/jamesbrady/cursor-admin-mcp/dist/index.js"],
      "env": {
        "CURSOR_API_KEY": "key_your_api_key_here"
      }
    }
  }
}
```

3. Restart Claude Code

## Usage Examples

Once installed, you can use natural language commands:

### Team Management
```
"Show me all team members"
"List admins on the team"
"Who has access to our Cursor workspace?"
```

### Usage Analytics
```
"Show usage data for the last week"
"What's our AI acceptance rate?"
"Which models are we using most?"
"Show me productivity trends"
```

### Spending Analysis
```
"What's our total spending this month?"
"Who are the top 5 users by cost?"
"Show spending breakdown by team member"
```

## Troubleshooting

### Connection Issues

If you see connection errors:

1. Verify your API key:
```bash
cat .env | grep CURSOR_API_KEY
```

2. Test the connection:
```bash
npm run dev examples/test-connection.ts
```

3. Check you have admin access in Cursor

### MCP Server Not Found

If Claude Code can't find the server:

1. Use absolute paths in the config
2. Ensure the project is built: `npm run build`
3. Check file permissions: `ls -la dist/index.js`

### API Key Errors

Common issues:
- Key doesn't start with `key_`
- You're not a team admin
- Key has been revoked
- Wrong team selected

## Advanced Usage

### Running Reports

Generate comprehensive reports:

```bash
# Weekly usage report
npm run dev examples/usage-report.ts

# Spending analysis
npm run dev examples/spending-analysis.ts
```

### Automating with Cron

Add to your crontab for daily reports:
```bash
0 9 * * * cd /path/to/cursor-admin-mcp && npm run dev examples/usage-report.ts >> daily-report.log
```

### Integration with Other Tools

The MCP server can be integrated with:
- n8n workflows
- Zapier automations
- Custom scripts
- CI/CD pipelines

## Security Notes

1. **Never share your API key**
2. **Don't commit .env to git** (it's in .gitignore)
3. **Use read-only keys if available**
4. **Rotate keys periodically**
5. **Monitor usage in Cursor admin panel**

## Support

- **Issues**: https://github.com/h3ro-dev/cursor-admin-mcp/issues
- **Documentation**: See `/docs` folder
- **Examples**: See `/examples` folder

## Next Steps

1. ✅ Run `npm run dev examples/test-connection.ts`
2. ✅ Try the usage report example
3. ✅ Add to your AI assistant of choice
4. ✅ Customize for your team's needs

Happy coding! 🚀