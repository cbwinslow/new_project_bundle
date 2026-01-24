# Rules Management Examples

Examples of using the rules management tools in the MCP server.

## Overview

The rules management system helps organize and access development rules, conventions, and best practices. Rules are stored in markdown files organized by category.

## Directory Structure

```
rules/
├── code-quality/
│   ├── clean-code.md
│   └── error-handling.md
├── git-workflow/
│   ├── commit-messages.md
│   └── branch-naming.md
├── testing/
│   └── test-coverage.md
├── security/
│   └── secrets-management.md
└── documentation/
    └── api-documentation.md
```

## Available Tools

### List All Rules

Get a complete list of all available rules:

```javascript
// Tool: rules_list
{}
```

**Example Output:**
```markdown
# Development Rules

Total: 9 rules

## code-quality

  - **Clean Code Principles** (`code-quality/clean-code`)
    Guidelines for writing clean, maintainable code
    Tags: code-quality, best-practices, clean-code

  - **Error Handling** (`code-quality/error-handling`)
    Best practices for error handling and logging
    Tags: errors, exceptions, logging

## git-workflow

  - **Commit Message Convention** (`git-workflow/commit-messages`)
    Follow Conventional Commits specification
    Tags: git, commits, conventional-commits
```

### List Rules by Category

Filter rules by a specific category:

```javascript
// Tool: rules_list
{
  "category": "code-quality"
}
```

### Get a Specific Rule

Retrieve the full content of a rule:

```javascript
// Tool: rules_get
{
  "ruleId": "git-workflow/commit-messages"
}
```

**Example Output:**
```markdown
# Commit Message Convention

Category: git-workflow
ID: git-workflow/commit-messages

---

# Commit Message Guidelines

Follow the Conventional Commits specification...
```

### Search Rules

Search for rules by keyword:

```javascript
// Tool: rules_search
{
  "query": "testing"
}
```

Searches in:
- Rule titles
- Descriptions
- Tags
- Category names

### Get Rules by Category

Retrieve all rules in a category:

```javascript
// Tool: rules_by_category
{
  "category": "security"
}
```

### List Categories

See all available rule categories:

```javascript
// Tool: rules_categories
{}
```

**Example Output:**
```markdown
# Rule Categories

Total: 5 categories

- **code-quality**: 2 rules
- **git-workflow**: 2 rules
- **testing**: 1 rules
- **security**: 1 rules
- **documentation**: 1 rules
```

## Use Cases

### 1. Onboarding New Team Members

Help new developers understand project conventions:

```javascript
// Show all available rules
rules_list({})

// Get specific guidelines
rules_get({ ruleId: "git-workflow/commit-messages" })
rules_get({ ruleId: "code-quality/clean-code" })
```

### 2. Pre-commit Checks

Reference rules during development:

```javascript
// Check commit message format
rules_get({ ruleId: "git-workflow/commit-messages" })

// Review code quality guidelines
rules_by_category({ category: "code-quality" })
```

### 3. Code Review

Reference rules during reviews:

```javascript
// Find relevant rules
rules_search({ query: "error handling" })

// Get detailed guidelines
rules_get({ ruleId: "code-quality/error-handling" })
```

### 4. Documentation

Link to rules in project documentation:

```javascript
// List all rules for README
rules_list({})

// Get specific rule content to include
rules_get({ ruleId: "security/secrets-management" })
```

### 5. AI Agent Configuration

Configure AI coding agents with project rules:

```javascript
// List all categories
rules_categories({})

// Get all rules in relevant categories
rules_by_category({ category: "code-quality" })
rules_by_category({ category: "testing" })
rules_by_category({ category: "security" })
```

## Creating Custom Rules

### Rule Format

Rules should be markdown files with metadata:

```markdown
# Rule Title

Brief description of the rule.

**Tags:** tag1, tag2, tag3

## Details

Detailed explanation...

## Examples

\`\`\`javascript
// Example code
\`\`\`

## References

- Link 1
- Link 2
```

### Adding Rules

1. Create a category directory: `rules/your-category/`
2. Create a markdown file: `rules/your-category/your-rule.md`
3. Add metadata and content
4. Rules are automatically discovered

### Custom Rules Directory

Use a custom rules location:

```javascript
// Point to a different directory
rules_list({ rulesDir: "/path/to/custom/rules" })
rules_get({ 
  ruleId: "category/rule",
  rulesDir: "/path/to/custom/rules"
})
```

## Integration with Other Tools

### Memory Tools

Cache frequently accessed rules:

```javascript
// Get and cache a rule
const rule = rules_get({ ruleId: "code-quality/clean-code" })
memory_set({
  key: "cached_rule_clean_code",
  value: rule,
  tags: ["rules", "cache"]
})

// Retrieve from cache
memory_get({ key: "cached_rule_clean_code" })
```

### Git Tools

Combine with Git operations:

```javascript
// Before committing
git_status({})
rules_get({ ruleId: "git-workflow/commit-messages" })

// Check branch naming
git_branch({})
rules_get({ ruleId: "git-workflow/branch-naming" })
```

### GitHub Tools

Reference rules from GitHub repos:

```javascript
// Get rule from this repository
github_get_file({
  owner: "cbwinslow",
  repo: "new_project_bundle",
  path: "rules/code-quality/clean-code.md"
})
```

## Common Rule Categories

### code-quality
- Clean code principles
- Error handling
- Code organization
- Naming conventions
- Comments and documentation

### git-workflow
- Commit messages
- Branch naming
- Pull request process
- Code review guidelines
- Merge strategies

### testing
- Test coverage requirements
- Testing best practices
- Unit test guidelines
- Integration test patterns
- Test naming conventions

### security
- Secrets management
- Authentication patterns
- Input validation
- Security scanning
- Vulnerability handling

### documentation
- API documentation
- README standards
- Code comments
- Architecture docs
- Runbook creation

### deployment
- Deployment checklist
- Environment configuration
- Release process
- Rollback procedures
- Monitoring setup

### ai-agents
- AI agent guidelines
- Context rules
- Tool usage patterns
- Prompt engineering
- Agent limitations

## Best Practices

1. **Keep Rules Focused** - One rule per file, single topic
2. **Use Clear Titles** - Make rules easy to find
3. **Add Examples** - Show don't just tell
4. **Include Tags** - Improve searchability
5. **Link Related Rules** - Reference other relevant rules
6. **Update Regularly** - Keep rules current with practices
7. **Version Control** - Track changes to rules over time

## Rule Template

Use this template for new rules:

```markdown
# [Rule Title]

[Brief 1-2 sentence description of the rule]

**Tags:** [tag1], [tag2], [tag3]

## Purpose

Why this rule exists and what problem it solves.

## Guidelines

### Do ✅

- Positive example 1
- Positive example 2

### Don't ❌

- Anti-pattern 1
- Anti-pattern 2

## Examples

\`\`\`[language]
// Good example
code here
\`\`\`

\`\`\`[language]
// Bad example (what to avoid)
code here
\`\`\`

## Rationale

Explanation of why this approach is better.

## Exceptions

When this rule might not apply.

## Related Rules

- [Other Rule 1](../category/other-rule.md)
- [Other Rule 2](../category/other-rule-2.md)

## References

- [External Link 1](https://example.com)
- [External Link 2](https://example.com)
```

## Tips

1. **Search Before Creating** - Check if a similar rule exists
2. **Be Specific** - Vague rules are hard to follow
3. **Include Context** - Explain why, not just what
4. **Use Real Examples** - From actual project code
5. **Make Them Actionable** - Rules should be implementable
6. **Review Regularly** - Update as team learns
7. **Get Feedback** - Iterate based on team input

## Related Documentation

- [MCP Setup Guide](./setup-guide.md) - Setting up the MCP server
- [GitHub API Examples](./github-api-examples.md) - Using GitHub tools
- [Project README](../../README.md) - Overall project documentation
