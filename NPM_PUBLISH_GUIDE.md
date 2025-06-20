# NPM Publishing Guide for Cursor Admin MCP

## Prerequisites

1. Create an NPM account at https://www.npmjs.com/signup
2. Enable 2FA (recommended) at https://www.npmjs.com/settings/~/profile

## Publishing Steps

### 1. Login to NPM
```bash
npm login
# Enter your username, password, and email
# If you have 2FA enabled, enter the code when prompted
```

### 2. Verify Login
```bash
npm whoami
# Should show your NPM username
```

### 3. Build the Project
```bash
cd /Users/jamesbrady/cursor-admin-mcp
npm run build
```

### 4. Test Locally (Optional)
```bash
# Test the package locally
npm link
npx cursor-admin-mcp
# Should start the MCP server

# Unlink when done
npm unlink
```

### 5. Publish to NPM
```bash
# First time publish (public package)
npm publish --access public

# Future updates (after changing version in package.json)
npm publish
```

### 6. Verify Publication
```bash
# Check if it's available
npm view cursor-admin-mcp

# Test installation
npx -y cursor-admin-mcp@latest
```

## Post-Publish Steps

1. **Update GitHub Release**
   - The GitHub Action will automatically create releases for future versions
   - Add the NPM link to your release notes

2. **Test Installation**
   ```bash
   # In a different directory
   npx -y cursor-admin-mcp
   ```

3. **Share the News**
   - Update README with npm badge (it should work now)
   - Post on social media
   - Submit to MCP registries

## Troubleshooting

### "Package name too similar to existing packages"
- This is unlikely with "cursor-admin-mcp" but if it happens, try:
  - cursor-admin-mcp-server
  - @h3ro-dev/cursor-admin-mcp (scoped package)

### "You must sign up for private packages"
- Make sure to use `--access public` on first publish

### "Cannot publish over previously published version"
- Bump version in package.json
- Use semantic versioning (1.0.1, 1.1.0, 2.0.0)

## Automation Setup (For Future)

Add NPM_TOKEN to GitHub Secrets:
1. Generate token at https://www.npmjs.com/settings/~/tokens
2. Add to GitHub: Settings → Secrets → Actions → New repository secret
3. Name: NPM_TOKEN
4. Value: Your NPM token

This enables automatic publishing on release!