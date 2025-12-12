# Branch Naming Rules

**Category:** Git Workflow  
**Tags:** #git #branches #organization

## Description

Consistent branch naming conventions for better organization and automation.

## Rules

### Branch Naming Format
```
<type>/<short-description>
```

### Branch Types
- `feature/` - New features
- `fix/` or `bugfix/` - Bug fixes
- `hotfix/` - Urgent production fixes
- `release/` - Release preparation
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions/updates
- `chore/` - Maintenance tasks

### Naming Guidelines
- Use lowercase
- Use hyphens to separate words
- Keep it short but descriptive
- No personal names
- Include issue number if applicable

### Protected Branches
- `main` - Production-ready code
- `develop` - Development integration
- `staging` - Pre-production testing

## Examples

### Good Examples
```
feature/user-authentication
feature/oauth-integration-123
fix/login-redirect-loop
fix/memory-leak-in-cache
hotfix/security-vulnerability-456
release/v2.1.0
docs/api-documentation
refactor/database-layer
test/add-integration-tests
chore/update-dependencies
```

### Bad Examples
```
johns-work
temp
fix-stuff
new-feature
WIP
my-branch-2
```

## Benefits
- Easy to identify purpose of branch
- Automated workflows can target specific branch types
- Better organization in repositories
- Clear history and easier cleanup
