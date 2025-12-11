# Rules Index

This directory contains modular development rules organized by category.

## Directory Structure

```
rules/
├── code-quality/       # Code quality and clean code rules
├── git-workflow/       # Git and version control rules
├── testing/            # Testing and quality assurance rules
├── documentation/      # Documentation standards
├── security/           # Security best practices
├── deployment/         # Deployment and release rules
└── ai-agents/          # AI agent specific guidelines
```

## Available Rules

### Code Quality
- **clean-code.md** - Principles for writing clean, maintainable code
- **error-handling.md** - Best practices for error handling and logging

### Git Workflow
- **commit-messages.md** - Conventional commit message format
- **branch-naming.md** - Branch naming conventions

### Testing
- **test-coverage.md** - Test coverage requirements and best practices

### Documentation
- **api-documentation.md** - API documentation standards

### Security
- **secrets-management.md** - Handling secrets and credentials securely

### Deployment
- **deployment-checklist.md** - Pre-deployment checklist and procedures

## Using Rules

### Download Individual Rules
```bash
# Using wget
wget https://raw.githubusercontent.com/cbwinslow/new_project_bundle/main/rules/code-quality/clean-code.md

# Using curl
curl -O https://raw.githubusercontent.com/cbwinslow/new_project_bundle/main/rules/code-quality/clean-code.md

# Using NPB shell functions
npb-download-rule code-quality/clean-code.md
```

### Download All Rules in a Category
```bash
# Using NPB bundle system
npb-download rules-code-quality
npb-download rules-git-workflow
npb-download rules-security
```

### Search for Rules
```bash
# Using NPB query function
npb-query commit
npb-query error
npb-query test
```

### Browse Rules Interactively
```bash
# Requires fzf
npb-browse
```

## Rule Format

Each rule file follows this structure:

```markdown
# Rule Name

**Category:** Category Name
**Tags:** #tag1 #tag2 #tag3

## Description
Brief description of the rule

## Rules
Detailed rules and guidelines

## Examples
Good and bad examples

## Benefits
Why following this rule matters
```

## Contributing

To add a new rule:

1. Choose the appropriate category directory
2. Create a new `.md` file following the format above
3. Update this README.md
4. Update bundles.json if creating a new category
5. Submit a pull request

## Integration with AI Agents

These rules are designed to be easily consumed by AI coding agents:

- Structured markdown format
- Clear examples
- Tagged for easy discovery
- Modular and composable

Reference these rules in your AI agent prompts or configuration files.
