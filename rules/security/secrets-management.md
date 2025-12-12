# Secrets Management Rules

**Category:** Security  
**Tags:** #security #secrets #credentials #encryption

## Description

Best practices for handling sensitive information like API keys, passwords, and tokens.

## Rules

### Never Commit Secrets
- No API keys in code
- No passwords in configuration files
- No tokens in comments
- No credentials in documentation

### Use Environment Variables
- Store secrets in environment variables
- Use `.env` files locally (add to `.gitignore`)
- Document required variables in `.env.example`
- Never commit `.env` files

### Secret Storage Solutions
- Use secret management tools (Vault, AWS Secrets Manager, etc.)
- Use encrypted storage (SOPS, git-crypt)
- Rotate secrets regularly
- Use separate secrets for dev/staging/prod

### CI/CD Secrets
- Use platform secret storage (GitHub Secrets, GitLab CI Variables)
- Never echo secrets in logs
- Use masked variables
- Limit secret access to necessary workflows

### Code Review
- Check for hardcoded secrets before merging
- Use automated secret scanning tools
- Review `.gitignore` for sensitive files
- Verify environment variable usage

## Examples

### Good Example
```python
# config.py
import os

API_KEY = os.getenv('API_KEY')
DATABASE_URL = os.getenv('DATABASE_URL')

if not API_KEY:
    raise ValueError("API_KEY environment variable is required")
```

```bash
# .env.example
API_KEY=your_api_key_here
DATABASE_URL=postgresql://user:pass@localhost/db
SECRET_TOKEN=your_secret_token
```

### Bad Example
```python
# config.py - DON'T DO THIS!
API_KEY = "sk_live_1234567890abcdef"
DATABASE_PASSWORD = "SuperSecret123!"
```

## Emergency Response

If secrets are committed:
1. Immediately rotate the exposed secret
2. Use `git filter-branch` or BFG Repo-Cleaner to remove from history
3. Force push the cleaned history
4. Notify security team
5. Review access logs for unauthorized usage

## Tools
- `git-secrets` - Prevent committing secrets
- `gitleaks` - Scan for secrets in repository
- `trufflehog` - Find secrets in git history
- `SOPS` - Encrypt secrets in files
- `Vault` - Secret management service

## Benefits
- Prevents security breaches
- Protects user data
- Maintains compliance
- Enables secret rotation
