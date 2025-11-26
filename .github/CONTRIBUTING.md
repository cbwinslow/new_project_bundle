# Contributing to This Project

First off, thank you for considering contributing to this project! It's people like you that make this project possible.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct. Please report unacceptable behavior to the project maintainers.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When you create a bug report, include as many details as possible using our bug report template.

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce (be specific!)
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- A clear and descriptive title
- A detailed description of the proposed enhancement
- An explanation of why this enhancement would be useful
- Possible implementation details (if you have any ideas)

### Pull Requests

1. **Fork the repo** and create your branch from `main`
2. **If you've added code that should be tested**, add tests
3. **If you've changed APIs**, update the documentation
4. **Ensure the test suite passes**
5. **Make sure your code lints**
6. **Issue that pull request!**

## Development Process

### Setting Up Your Development Environment

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/new_project_bundle.git
   cd new_project_bundle
   ```
3. Add the upstream remote:
   ```bash
   git remote add upstream https://github.com/cbwinslow/new_project_bundle.git
   ```
4. Install dependencies (if applicable):
   ```bash
   npm install  # or pip install -r requirements.txt, etc.
   ```

### Branching Strategy

- `main` - Production-ready code
- `develop` - Integration branch for features (if used)
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Emergency fixes for production
- `release/*` - Release preparation

### Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Types:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `build`: Changes that affect the build system or external dependencies
- `ci`: Changes to our CI configuration files and scripts
- `chore`: Other changes that don't modify src or test files
- `revert`: Reverts a previous commit

Examples:
```
feat(auth): add login functionality
fix(api): handle null response from server
docs: update contributing guidelines
```

### Code Style

- Follow the existing code style in the project
- Use meaningful variable and function names
- Write comments for complex logic
- Keep functions small and focused
- Write self-documenting code when possible

### Testing

- Write tests for new features
- Ensure all tests pass before submitting a PR
- Aim for high test coverage
- Include both unit tests and integration tests where appropriate

### Documentation

- Update README.md if you change functionality
- Add JSDoc/docstrings for new functions and classes
- Update API documentation for API changes
- Include code examples where helpful

## Review Process

1. **Automated Checks**: All PRs must pass automated checks (CI, linting, tests)
2. **Code Review**: At least one maintainer will review your code
3. **AI Review**: PRs may also be reviewed by AI assistants (GitHub Copilot, etc.)
4. **Feedback**: Address any feedback from reviewers
5. **Merge**: Once approved, your PR will be merged

### What We Look For in Code Reviews

- Code correctness and functionality
- Test coverage and quality
- Code style and readability
- Documentation completeness
- Performance considerations
- Security implications
- Backwards compatibility

## Recognition

Contributors will be recognized in our:
- README contributors section
- Release notes
- GitHub contributors page

## Questions?

Don't hesitate to ask questions! You can:
- Open a GitHub Discussion
- Comment on relevant issues
- Reach out to maintainers

Thank you for contributing! 🎉
