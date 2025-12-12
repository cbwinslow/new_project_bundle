# Rules System

The New Project Bundle includes a comprehensive, modular rules system for development best practices.

## Overview

Rules are organized into categories and provided as individual markdown files that can be:
- Downloaded individually
- Downloaded by category
- Searched and queried
- Browsed interactively
- Integrated into AI agent prompts

## Rule Categories

### Code Quality
Guidelines for writing clean, maintainable code.

**Available Rules:**
- `clean-code.md` - Clean code principles and naming conventions
- `error-handling.md` - Error handling and logging best practices

**Download:**
```bash
npb-download rules-code-quality
npb-download-rule code-quality/clean-code.md
```

### Git Workflow
Standards for version control and collaboration.

**Available Rules:**
- `commit-messages.md` - Conventional commit format
- `branch-naming.md` - Branch naming conventions

**Download:**
```bash
npb-download rules-git-workflow
npb-download-rule git-workflow/commit-messages.md
```

### Testing
Testing standards and coverage requirements.

**Available Rules:**
- `test-coverage.md` - Test coverage requirements and best practices

**Download:**
```bash
npb-download rules-testing
npb-download-rule testing/test-coverage.md
```

### Documentation
Documentation standards and API documentation.

**Available Rules:**
- `api-documentation.md` - API documentation standards (OpenAPI/Swagger)

**Download:**
```bash
npb-download rules-documentation
npb-download-rule documentation/api-documentation.md
```

### Security
Security best practices and secrets management.

**Available Rules:**
- `secrets-management.md` - Handling secrets and credentials

**Download:**
```bash
npb-download rules-security
npb-download-rule security/secrets-management.md
```

### Deployment
Deployment checklists and procedures.

**Available Rules:**
- `deployment-checklist.md` - Pre-deployment checklist

**Download:**
```bash
npb-download rules-deployment
npb-download-rule deployment/deployment-checklist.md
```

## Rule Format

Each rule follows a consistent structure:

```markdown
# Rule Name

**Category:** Category Name
**Tags:** #tag1 #tag2 #tag3

## Description
Brief description of the rule

## Rules
Detailed rules and guidelines

## Examples
Good and bad examples demonstrating the rule

## Benefits
Why following this rule matters
```

## Using Rules

### Download Individual Rules

```bash
# Download a specific rule
npb-download-rule code-quality/clean-code.md

# Download to a specific directory
npb-download-rule security/secrets-management.md ./docs/rules/
```

### Download Rule Categories

```bash
# Download all code quality rules
npb-download rules-code-quality

# Download all security rules
npb-download rules-security

# Download all rules
npb-download all-rules
```

### Search for Rules

```bash
# Search by keyword
npb-query commit
npb-query test
npb-query security
npb-query error

# Results show matching rules with descriptions
```

### Browse Rules Interactively

```bash
# Launch interactive browser (requires fzf)
npb-browse

# Use arrow keys to navigate
# Press Enter to download
# Press Esc to cancel
```

### List All Rules

```bash
# Show all available rules by category
npb-list-rules
```

## Integration with AI Agents

Rules are designed for AI agent consumption:

### Reference in Prompts

```
Please follow the clean code rules from:
code-quality/clean-code.md

Ensure all commits follow:
git-workflow/commit-messages.md
```

### Include in Agent Configuration

```yaml
# .github/copilot-instructions.md
agent_rules:
  - rules/code-quality/clean-code.md
  - rules/git-workflow/commit-messages.md
  - rules/security/secrets-management.md
```

### Load in Context

Many AI coding assistants can load markdown files directly into their context:

```bash
# Download rules to project
npb-download all-rules ./docs/rules/

# Reference in your .cursorrules, .github/copilot-instructions.md, etc.
```

## Rule Examples

### Clean Code Rule

The clean code rule covers:
- Function design (single responsibility, size limits)
- Naming conventions (meaningful names, verbs for functions)
- Code organization (nesting limits, grouping)
- Code cleanup (no commented code, remove debug statements)

### Commit Messages Rule

The commit message rule defines:
- Conventional Commits format
- Valid commit types (feat, fix, docs, etc.)
- Subject line guidelines
- Body and footer format
- Real-world examples

### Secrets Management Rule

The secrets management rule includes:
- Never commit secrets
- Environment variable usage
- Secret storage solutions
- Emergency response procedures
- Recommended tools

## Creating Custom Rules

You can create your own rules following the same format:

1. Choose a category or create a new one
2. Create a markdown file following the structure
3. Include description, rules, examples, and benefits
4. Add tags for searchability
5. Reference in your projects

### Example Custom Rule

```markdown
# My Team's API Design Rule

**Category:** Documentation
**Tags:** #api #rest #graphql

## Description
Our team's standards for API design and documentation.

## Rules
- Use RESTful conventions
- Version all APIs
- Document with OpenAPI 3.0
- Include examples for all endpoints

## Examples
[Include your examples]

## Benefits
- Consistent API design
- Better developer experience
- Easier onboarding
```

## Contributing Rules

To contribute a new rule:

1. Fork the repository
2. Create your rule file in the appropriate category
3. Follow the standard format
4. Update bundles.json if needed
5. Update rules/README.md
6. Submit a pull request

See [Contributing](Contributing.md) for more details.

## Rule Bundles

Rules are organized into downloadable bundles:

| Bundle | Description | Files |
|--------|-------------|-------|
| `rules-code-quality` | Clean code and error handling | 2 |
| `rules-git-workflow` | Git and version control | 2 |
| `rules-testing` | Testing standards | 1 |
| `rules-documentation` | Documentation standards | 1 |
| `rules-security` | Security best practices | 1 |
| `rules-deployment` | Deployment procedures | 1 |
| `all-rules` | All development rules | 8 |

## Best Practices

### For Teams

1. **Select Relevant Rules** - Choose rules that apply to your stack
2. **Customize as Needed** - Fork and modify rules for your team
3. **Enforce in CI/CD** - Integrate rule checks into your pipeline
4. **Reference in PRs** - Link to rules when reviewing code
5. **Update Regularly** - Keep rules current with team practices

### For Individual Developers

1. **Start Small** - Don't try to adopt all rules at once
2. **Focus on Pain Points** - Adopt rules that solve your problems
3. **Share with Team** - Suggest useful rules to teammates
4. **Build Habits** - Make rule-following automatic
5. **Contribute Back** - Share improvements via pull requests

## Related Documentation

- [Bundle System](Bundle-System.md) - General bundle system
- [Shell Integration](Shell-Integration.md) - Shell functions for rules
- [Templates](../templates/README.md) - Related templates
- [GitHub Repository](https://github.com/cbwinslow/new_project_bundle)
