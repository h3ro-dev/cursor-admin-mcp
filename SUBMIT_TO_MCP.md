# Quick MCP Registry Submission

## Step 1: Fork the Official Repository

1. Go to https://github.com/modelcontextprotocol/servers
2. Click "Fork" button
3. Clone your fork:
   ```bash
   git clone https://github.com/h3ro-dev/servers.git
   cd servers
   ```

## Step 2: Add Your Entry

Edit `README.md` and add this entry under the "Community Servers" section, in the appropriate category (likely "Development Tools"):

```markdown
### Development tools
- [Cursor Admin](https://github.com/h3ro-dev/cursor-admin-mcp) - Team analytics, usage tracking, and spending insights for Cursor IDE teams
```

Make sure to maintain alphabetical order!

## Step 3: Create Pull Request

```bash
git add README.md
git commit -m "Add Cursor Admin MCP Server to community servers"
git push origin main
```

Then create a PR from your fork to the main repository.

## PR Description Template

```
Title: Add Cursor Admin MCP Server to community servers

Description:
This PR adds the Cursor Admin MCP Server to the community implementations. 

**What it does:**
- Provides team analytics for Cursor IDE users
- Tracks usage metrics and AI acceptance rates  
- Monitors spending and credit usage
- Enables natural language queries about team productivity

**Implementation details:**
- Written in TypeScript
- Full test coverage
- Supports stdio and HTTP transports
- Published on NPM as `cursor-admin-mcp`

**Links:**
- GitHub: https://github.com/h3ro-dev/cursor-admin-mcp
- NPM: https://www.npmjs.com/package/cursor-admin-mcp
```

## Other Registries to Submit To

1. **Awesome MCP Servers**: https://github.com/punkpeye/awesome-mcp-servers
2. **MCP List**: https://mcplist.ai/submit
3. **MCP Hub**: Contact via Discord
4. **Reddit**: Post in r/mcp and r/modelcontextprotocol