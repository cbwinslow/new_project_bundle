# AI Coding Agents Configuration 🤖

> Guidelines and instructions for AI coding assistants working on this project

## Overview

This document provides configuration and guidelines for AI coding agents (GitHub Copilot, OpenHands, Gemini, Claude, etc.) when working on this project.

## Project Context

<!--
UPDATE THIS SECTION with your specific project details
-->

- **Project Name**: [Your Project Name]
- **Primary Language(s)**: [TypeScript, Python, Go, etc.]
- **Framework(s)**: [Next.js, FastAPI, Gin, etc.]
- **Package Manager**: [npm, yarn, pnpm, pip, go mod, etc.]
- **Testing Framework**: [Jest, pytest, go test, etc.]

## Coding Standards

### Style Guidelines

1. **Follow Existing Patterns**: Match the existing code style in the repository
2. **Use Meaningful Names**: Variable and function names should be descriptive
3. **Keep Functions Small**: Each function should do one thing well
4. **Document Complex Logic**: Add comments only where necessary
5. **Prefer Readability**: Clear code over clever code

### Code Formatting

- Use the project's linter configuration (`.eslintrc`, `.prettierrc`, etc.)
- Follow EditorConfig settings (`.editorconfig`)
- Ensure consistent indentation and spacing

### Testing Requirements

- Write tests for all new functionality
- Maintain or improve existing test coverage
- Include both unit and integration tests where appropriate
- Mock external dependencies appropriately

## Agent Instructions

### When Writing Code

```markdown
1. Understand the context before making changes
2. Make minimal, focused changes
3. Follow the project's architecture patterns
4. Use existing utilities and helpers
5. Handle errors appropriately
6. Add proper logging where relevant
7. Consider security implications
```

### When Reviewing Code

```markdown
1. Check for security vulnerabilities
2. Verify error handling is complete
3. Ensure tests cover edge cases
4. Look for potential performance issues
5. Validate documentation is updated
6. Confirm backward compatibility
```

### Prohibited Actions

```markdown
❌ Don't introduce breaking changes without discussion
❌ Don't add dependencies without justification
❌ Don't hardcode secrets or credentials
❌ Don't remove tests without replacement
❌ Don't bypass linting rules
❌ Don't commit generated files (unless specified)
```

## File Organization

```
src/
├── components/     # Reusable UI components
├── services/       # Business logic and API calls
├── utils/          # Helper functions
├── types/          # Type definitions
├── hooks/          # Custom hooks (React)
├── middleware/     # Request middleware
└── config/         # Configuration files

tests/
├── unit/           # Unit tests
├── integration/    # Integration tests
└── e2e/            # End-to-end tests
```

## Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

## Environment Variables

- Never commit `.env` files with real values
- Use `.env.example` as a template
- Document all required environment variables
- Use appropriate encryption for sensitive values

## Dependencies

### Adding Dependencies

1. Check if functionality exists in current dependencies
2. Verify the package is actively maintained
3. Review the package's security status
4. Consider bundle size impact
5. Add to appropriate dependency category (dev/prod)

### Version Management

- Use exact versions in lock files
- Document any version constraints
- Keep dependencies reasonably up to date

## Security Guidelines

1. **Input Validation**: Always validate and sanitize user input
2. **Authentication**: Use established auth libraries
3. **Authorization**: Implement proper access controls
4. **Data Protection**: Encrypt sensitive data at rest and in transit
5. **Secret Management**: Use environment variables or secret managers
6. **SQL Injection**: Use parameterized queries
7. **XSS Prevention**: Sanitize output in templates

## Performance Considerations

1. Avoid N+1 queries in database operations
2. Implement appropriate caching strategies
3. Use pagination for large data sets
4. Optimize bundle sizes for frontend code
5. Use lazy loading where appropriate
6. Profile code for bottlenecks

## Custom Agent Commands

<!--
Define project-specific commands for AI agents
-->

| Command | Description |
|---------|-------------|
| `/setup` | Initialize development environment |
| `/test` | Run test suite |
| `/lint` | Run linting checks |
| `/build` | Build for production |
| `/deploy` | Deploy to staging |

## Model-Specific Notes

### GitHub Copilot

- Use inline comments to guide suggestions
- Accept suggestions that match project style
- Review suggestions for security issues

### OpenHands

- Provide clear task descriptions
- Use workspace file context
- Review autonomous changes carefully

### Claude / ChatGPT

- Provide full file context when needed
- Specify language and framework versions
- Ask for explanations of complex changes

---

**Last Updated**: [DATE]
**Maintained By**: [TEAM/PERSON]
