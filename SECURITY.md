# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Which versions are eligible for receiving such patches depends on the CVSS v3.0 Rating:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to: security@cursor-admin-mcp.dev

You should receive a response within 48 hours. If for some reason you do not, please follow up via email to ensure we received your original message.

Please include the following information:

- Type of issue (e.g., API key exposure, authentication bypass, etc.)
- Full paths of source file(s) related to the issue
- Location of affected source code (tag/branch/commit or direct URL)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue

## Preferred Languages

We prefer all communications to be in English.

## Disclosure Policy

When we receive a security bug report, we will:

1. Confirm the problem and determine affected versions
2. Audit code to find any similar problems
3. Prepare fixes for all supported versions
4. Release new versions as soon as possible

## Comments on this Policy

If you have suggestions on how this process could be improved, please submit a pull request.

## Security Best Practices for Users

### API Key Management

1. **Never commit API keys** to version control
2. **Use environment variables** for all sensitive configuration
3. **Rotate keys regularly** through Cursor team settings
4. **Limit key permissions** if your organization supports it

### Secure Installation

1. **Verify package integrity** when installing:
   ```bash
   npm view cursor-admin-mcp integrity
   ```

2. **Use specific versions** instead of latest:
   ```bash
   npm install cursor-admin-mcp@1.0.0
   ```

3. **Review dependencies** regularly:
   ```bash
   npm audit
   ```

### Runtime Security

1. **Run with minimal permissions**
2. **Use secure transport** (HTTPS when using HTTP transport)
3. **Monitor API usage** through Cursor dashboard
4. **Enable logging** for audit trails

## Known Security Considerations

### API Key Exposure
- The server requires a Cursor API key with admin privileges
- Keys are passed via environment variables
- Never log or output API keys

### Network Security
- All API calls use HTTPS
- Basic authentication is implemented per Cursor API spec
- No data is stored locally by default

### Input Validation
- All date inputs are validated for range limits
- Pagination parameters are sanitized
- Search terms are properly escaped

## Security Hardening Checklist

- [ ] API keys stored in environment variables only
- [ ] No sensitive data in logs
- [ ] Input validation on all user inputs
- [ ] HTTPS enforcement for API calls
- [ ] Regular dependency updates
- [ ] Security headers in HTTP transport mode
- [ ] Rate limiting implementation
- [ ] Error messages don't expose system details