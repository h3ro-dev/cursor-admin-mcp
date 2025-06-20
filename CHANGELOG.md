# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-06-19

### Added
- Initial release of Cursor Admin MCP Server
- Three core tools:
  - `get_team_members` - List all team members with roles
  - `get_daily_usage_data` - Detailed usage metrics and analytics
  - `get_spending_data` - Team spending and credit usage tracking
- TypeScript implementation with full type safety
- Comprehensive test suite with 100% passing tests
- Support for both stdio and streamable HTTP transports
- Detailed error handling and validation
- Example scripts for common use cases:
  - Connection testing
  - Usage report generation
  - Spending analysis
  - Team summary dashboard
- Full documentation and setup guides

### Security
- Secure API key management via environment variables
- Basic authentication implementation per Cursor API requirements
- Input validation and sanitization

[1.0.0]: https://github.com/h3ro-dev/cursor-admin-mcp/releases/tag/v1.0.0