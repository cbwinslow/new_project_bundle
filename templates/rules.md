# Project Development Rules 📋

> Guidelines and rules for development on this project

## Table of Contents

- [Overview](#overview)
- [Code Quality Rules](#code-quality-rules)
- [Git Workflow Rules](#git-workflow-rules)
- [Review Process Rules](#review-process-rules)
- [Testing Rules](#testing-rules)
- [Documentation Rules](#documentation-rules)
- [Security Rules](#security-rules)
- [Deployment Rules](#deployment-rules)

## Overview

This document establishes the development rules and standards for this project. All contributors (human and AI) must follow these guidelines.

## Code Quality Rules

### Rule 1: Follow Style Guides

✅ **Required**

- Use the project's linter configuration
- Follow EditorConfig settings
- Run `make lint` before committing

### Rule 2: Write Clean Code

✅ **Required**

```
- Functions should do one thing
- Keep functions under 50 lines
- Use meaningful variable names
- Avoid deep nesting (max 3 levels)
- No commented-out code in production
- Remove console.log/print statements
```

### Rule 3: Handle Errors Properly

✅ **Required**

- Never silently swallow errors
- Use appropriate error types
- Log errors with context
- Return user-friendly error messages

### Rule 4: Maintain Backward Compatibility

⚠️ **Important**

- Deprecate before removing
- Version APIs properly
- Document breaking changes
- Provide migration guides

## Git Workflow Rules

### Rule 5: Branch Naming Convention

✅ **Required**

```
feature/description-of-feature
bugfix/description-of-bug
hotfix/critical-issue-description
release/v1.2.3
docs/documentation-update
chore/maintenance-task
```

### Rule 6: Commit Message Format

✅ **Required**

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

**Examples**:

```
feat(auth): add OAuth2 login support
fix(api): handle null response from server
docs(readme): update installation instructions
test(user): add tests for user service
```

### Rule 7: Branch Protection

✅ **Required**

- `main` branch requires PR approval
- All checks must pass before merge
- No force pushes to protected branches
- Squash or rebase merges preferred

### Rule 8: Keep Branches Small

⚠️ **Important**

- One feature/fix per branch
- PRs should be under 500 lines when possible
- Break large features into smaller PRs
- Delete branches after merge

## Review Process Rules

### Rule 9: PR Requirements

✅ **Required**

- [ ] Descriptive title and description
- [ ] Linked to relevant issue(s)
- [ ] Tests pass locally
- [ ] Self-reviewed before requesting review
- [ ] Screenshots for UI changes
- [ ] Documentation updated if needed

### Rule 10: Review Turnaround

⚠️ **Important**

- Review PRs within 24 hours
- Respond to review comments promptly
- Use "Request Changes" sparingly
- Approve when concerns are addressed

### Rule 11: Code Review Checklist

✅ **Required**

```
- [ ] Code works as intended
- [ ] Tests are adequate
- [ ] No security vulnerabilities
- [ ] Error handling is proper
- [ ] Documentation is complete
- [ ] Performance is acceptable
- [ ] Style guidelines followed
```

## Testing Rules

### Rule 12: Test Coverage

✅ **Required**

- Minimum 80% code coverage
- All new features require tests
- Bug fixes require regression tests
- Critical paths need integration tests

### Rule 13: Test Organization

✅ **Required**

```
tests/
├── unit/           # Fast, isolated tests
├── integration/    # Service interaction tests
├── e2e/            # End-to-end tests
└── fixtures/       # Test data and mocks
```

### Rule 14: Test Quality

✅ **Required**

- Test one thing per test
- Use descriptive test names
- Avoid testing implementation details
- Keep tests deterministic

## Documentation Rules

### Rule 15: Code Documentation

✅ **Required**

- Document public APIs
- Explain complex algorithms
- Add inline comments sparingly
- Keep docs up to date with code

### Rule 16: README Updates

⚠️ **Important**

- Update README for new features
- Document setup instructions
- Include troubleshooting section
- Keep examples current

### Rule 17: API Documentation

✅ **Required for APIs**

- Document all endpoints
- Include request/response examples
- Specify authentication requirements
- Note rate limits and quotas

## Security Rules

### Rule 18: Secrets Management

✅ **Required**

```
❌ Never commit secrets to git
❌ Never hardcode credentials
✅ Use environment variables
✅ Use secret management tools
✅ Rotate secrets regularly
```

### Rule 19: Input Validation

✅ **Required**

- Validate all user input
- Sanitize data before storage
- Use parameterized queries
- Escape output appropriately

### Rule 20: Dependency Security

✅ **Required**

- Review dependencies before adding
- Keep dependencies updated
- Run security audits regularly
- Address vulnerability alerts promptly

### Rule 21: Authentication & Authorization

✅ **Required**

- Use established auth libraries
- Implement proper access controls
- Use secure session management
- Enable MFA where appropriate

## Deployment Rules

### Rule 22: Environment Parity

⚠️ **Important**

- Keep dev/staging/prod similar
- Use environment variables
- Document environment differences
- Test in staging before production

### Rule 23: Deployment Checklist

✅ **Required**

```
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Release notes prepared
- [ ] Database migrations tested
- [ ] Rollback plan ready
- [ ] Monitoring configured
```

### Rule 24: Feature Flags

⚠️ **Recommended**

- Use feature flags for gradual rollouts
- Clean up old flags regularly
- Document flag usage
- Monitor flag performance

## Exceptions Process

Rules can be exempted with:

1. **Documentation**: Explain why exception is needed
2. **Approval**: Get maintainer approval
3. **Tracking**: Create issue to address later
4. **Timeline**: Set deadline for resolution

## Rule Violations

| Severity | Action |
| ---------- | -------- |
| Minor | Comment on PR, request fix |
| Major | Block PR, require fix |
| Critical | Revert changes, security review |

## Updates to Rules

- Propose changes via PR to this document
- Discuss in team meeting or issue
- Require maintainer approval
- Communicate changes to team

---

**Version**: 1.0.0
**Last Updated**: [DATE]
**Approved By**: [APPROVER]
