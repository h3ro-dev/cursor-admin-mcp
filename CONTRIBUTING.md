# Contributing to Cursor Admin MCP Server

First off, thanks for taking the time to contribute! 🎉

The following is a set of guidelines for contributing to Cursor Admin MCP Server. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Process](#development-process)
- [Style Guidelines](#style-guidelines)
- [Commit Messages](#commit-messages)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/h3ro-dev/cursor-admin-mcp.git
   cd cursor-admin-mcp
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and expected**
- **Include your environment details** (OS, Node version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description of the proposed feature**
- **Explain why this enhancement would be useful**
- **List any similar features in other MCP servers**

### Pull Requests

1. Ensure your code follows the project's style guidelines
2. Include tests for new functionality
3. Update documentation as needed
4. Ensure all tests pass: `npm test`
5. Make sure your code lints: `npm run lint`

## Development Process

### Setting Up Development Environment

1. Copy `.env.example` to `.env`
2. Add your Cursor API key for testing
3. Build the project: `npm run build`
4. Run tests: `npm test`

### Testing

- Write tests for all new functionality
- Maintain test coverage above 90%
- Run the full test suite before submitting PR
- Test on multiple platforms if possible

### Code Review Process

1. All submissions require review
2. We use GitHub pull requests for this purpose
3. Reviewers will provide feedback
4. Make requested changes and push to your branch
5. Mark conversations as resolved

## Style Guidelines

### TypeScript Style

- Use TypeScript strict mode
- Prefer `const` over `let`
- Use meaningful variable names
- Add JSDoc comments for public APIs
- Follow existing code patterns

### Code Formatting

We use ESLint and Prettier for code formatting:

```bash
# Format code
npm run format

# Check linting
npm run lint
```

### File Organization

- Keep files focused and single-purpose
- Group related functionality
- Use clear, descriptive file names
- Follow the existing directory structure

## Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

### Commit Message Format

```
<type>: <subject>

<body>

<footer>
```

Types:
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation only changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **test**: Adding or updating tests
- **chore**: Changes to build process or auxiliary tools

Example:
```
feat: add rate limiting to API calls

Implement exponential backoff and rate limiting to prevent hitting
Cursor API rate limits. This improves reliability for teams with
high usage.

Closes #123
```

## Questions?

Feel free to open an issue with your question or reach out to the maintainers directly.

Thank you for contributing! 🚀