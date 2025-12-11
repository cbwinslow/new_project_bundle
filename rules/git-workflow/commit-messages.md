# Commit Message Rules

**Category:** Git Workflow  
**Tags:** #git #commits #conventional-commits

## Description

Guidelines for writing clear, consistent commit messages using Conventional Commits format.

## Rules

### Conventional Commits Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Performance improvement
- `test`: Adding or updating tests
- `build`: Changes to build system or dependencies
- `ci`: Changes to CI configuration
- `chore`: Other changes that don't modify src or test files
- `revert`: Reverts a previous commit

### Subject Line
- Use imperative mood ("add" not "added" or "adds")
- Don't capitalize first letter
- No period at the end
- Maximum 50 characters
- Be specific and descriptive

### Body (Optional)
- Wrap at 72 characters
- Explain what and why, not how
- Separate from subject with blank line

### Footer (Optional)
- Reference issues: `Fixes #123`
- Breaking changes: `BREAKING CHANGE: description`

## Examples

### Good Examples
```
feat(auth): add OAuth2 authentication support

Implements OAuth2 flow for Google and GitHub providers.
Users can now sign in using their social accounts.

Fixes #456
```

```
fix(api): prevent race condition in user creation

Added mutex lock to prevent duplicate user creation when
multiple requests arrive simultaneously.
```

```
docs: update installation instructions for Docker setup
```

### Bad Examples
```
Updated stuff
```

```
Fixed bug in the authentication module that was causing issues with some users
```

```
WIP - still working on this
```

## Benefits
- Clear project history
- Easy to generate changelogs
- Better collaboration
- Automated versioning possible
