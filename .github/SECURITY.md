# Security Policy

## Supported Versions

Use this section to tell people about which versions of your project are
currently being supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of our project seriously. If you have discovered a security vulnerability, please report it responsibly.

### How to Report

1. **Do NOT report security vulnerabilities through public GitHub issues.**

2. Instead, please report them via one of the following methods:

   - **GitHub Security Advisories**: Navigate to the Security tab of this repository and click "Report a vulnerability"
   - **Email**: Send details to the repository owner

3. Include as much information as possible:
   - Type of vulnerability (e.g., SQL injection, XSS, CSRF)
   - Full paths of source file(s) related to the vulnerability
   - Location of the affected source code (tag/branch/commit or direct URL)
   - Step-by-step instructions to reproduce the issue
   - Proof-of-concept or exploit code (if possible)
   - Impact of the issue and how it might be exploited

### What to Expect

- **Acknowledgment**: We will acknowledge receipt of your vulnerability report within 48 hours.
- **Updates**: We will provide updates on the progress towards a fix and full announcement at least every 5 days.
- **Resolution**: After the initial reply, we will work on a fix and coordinate a public disclosure timeline.

### Disclosure Policy

- Please give us a reasonable amount of time to fix the issue before making any public disclosure.
- Make a good faith effort to avoid privacy violations, destruction of data, and interruption or degradation of our service.
- Do not access or modify data that does not belong to you.

### Safe Harbor

We support safe harbor for security researchers who:

- Make a good faith effort to avoid privacy violations, destruction of data, and interruption or degradation of our services.
- Only interact with accounts you own or with explicit permission of the account holder.
- Do not exploit a security issue for any reason.
- Report the issue to us privately and give us reasonable time to address it before making any public disclosure.

## Security Best Practices

When contributing to this project, please follow these security best practices:

1. **Never commit sensitive data** (API keys, passwords, tokens) to the repository
2. **Use environment variables** for configuration
3. **Keep dependencies updated** and watch for security advisories
4. **Follow the principle of least privilege** in your code
5. **Validate and sanitize** all user inputs
6. **Use secure communication** (HTTPS, TLS)
7. **Implement proper authentication and authorization**
8. **Log security-relevant events** appropriately

## Security Tools

This repository uses the following security tools:

- **Dependabot**: Automated dependency updates
- **CodeQL**: Static analysis for security vulnerabilities
- **Secret Scanning**: Detection of accidentally committed secrets
- **Branch Protection**: Required reviews and status checks

## Recognition

We appreciate the security research community's efforts in helping keep our project and users safe. Researchers who responsibly disclose vulnerabilities will be acknowledged in our security acknowledgments (unless they prefer to remain anonymous).
