# Bundle Downloader Use Cases

Real-world scenarios and solutions using the bundle downloader.

## 🎯 Use Case Index

1. [Starting a New Repository](#1-starting-a-new-repository)
2. [Adding CI/CD to Existing Project](#2-adding-cicd-to-existing-project)
3. [Security Hardening](#3-security-hardening)
4. [Team Onboarding](#4-team-onboarding)
5. [Multi-Language Monorepo](#5-multi-language-monorepo)
6. [Documentation Setup](#6-documentation-setup)
7. [Open Source Project Launch](#7-open-source-project-launch)
8. [Containerization](#8-containerization)
9. [GitHub Actions Migration](#9-github-actions-migration)
10. [AI Agent Configuration](#10-ai-agent-configuration)

---

## 1. Starting a New Repository

**Scenario:** You're creating a brand new GitHub repository and want to set it up with best practices.

**Solution:**
```bash
# Essential files
npx github:cbwinslow/new_project_bundle bundle-downloader download github-core
npx github:cbwinslow/new_project_bundle bundle-downloader download root-docs
npx github:cbwinslow/new_project_bundle bundle-downloader download dotfiles

# Issue templates
npx github:cbwinslow/new_project_bundle bundle-downloader download github-issue-templates

# Basic workflows
npx github:cbwinslow/new_project_bundle bundle-downloader download github-workflows-ci
```

**Result:** Complete repository setup with README, LICENSE, contributing guidelines, issue templates, and CI workflow.

---

## 2. Adding CI/CD to Existing Project

**Scenario:** Your project has been around for a while but lacks proper CI/CD pipelines.

**Solution:**
```bash
# Add CI/CD workflows
npx github:cbwinslow/new_project_bundle bundle-downloader download github-workflows-ci

# Add deployment workflow
npx github:cbwinslow/new_project_bundle bundle-downloader download github-workflows-ci

# Customize workflows in .github/workflows/
# Edit ci.yml and cd.yml to match your tech stack
```

**Result:** Automated testing and deployment pipelines ready to customize.

---

## 3. Security Hardening

**Scenario:** You need to add security scanning and vulnerability detection to your project.

**Solution:**
```bash
# Security workflows (CodeQL, dependency scanning)
npx github:cbwinslow/new_project_bundle bundle-downloader download github-workflows-security

# Pre-commit hooks for local checks
npx github:cbwinslow/new_project_bundle bundle-downloader download pre-commit

# GitHub security configuration
npx github:cbwinslow/new_project_bundle bundle-downloader download github-configs
```

**Result:** Comprehensive security scanning on every PR and push, plus local pre-commit checks.

---

## 4. Team Onboarding

**Scenario:** New developers joining your team need a consistent development environment setup.

**Create a setup script:**
```bash
#!/bin/bash
# team-setup.sh

echo "Setting up development environment..."

# Get all package managers (team uses multiple languages)
npx github:cbwinslow/new_project_bundle bundle-downloader download all-packages

# Get development tools
npx github:cbwinslow/new_project_bundle bundle-downloader download dotfiles
npx github:cbwinslow/new_project_bundle bundle-downloader download pre-commit
npx github:cbwinslow/new_project_bundle bundle-downloader download docker

# Get documentation
npx github:cbwinslow/new_project_bundle bundle-downloader download templates-docs --output ./docs

echo "✓ Setup complete! Read docs/README.md to get started."
```

**Result:** Consistent development environment for all team members in minutes.

---

## 5. Multi-Language Monorepo

**Scenario:** Your monorepo contains Node.js, Python, and Go services.

**Solution:**
```bash
# Get package files for all languages
npx github:cbwinslow/new_project_bundle bundle-downloader download package-nodejs
npx github:cbwinslow/new_project_bundle bundle-downloader download package-python
npx github:cbwinslow/new_project_bundle bundle-downloader download package-go

# Add CI for multiple languages
npx github:cbwinslow/new_project_bundle bundle-downloader download github-workflows-ci

# Add security scanning
npx github:cbwinslow/new_project_bundle bundle-downloader download github-workflows-security

# Edit workflows to handle multiple languages
```

**Result:** Multi-language project structure with CI/CD for all services.

---

## 6. Documentation Setup

**Scenario:** Your project needs comprehensive documentation templates.

**Solution:**
```bash
# Create docs directory
mkdir -p docs

# Get all documentation templates
npx github:cbwinslow/new_project_bundle bundle-downloader download templates-docs --output ./docs

# Get AI agent documentation
npx github:cbwinslow/new_project_bundle bundle-downloader download templates-ai --output ./docs/ai

# Add documentation workflow
npx github:cbwinslow/new_project_bundle bundle-downloader download github-workflows-quality
```

**Files you get:**
- `docs/SRS.md` - Software Requirements Specification
- `docs/API.md` - API documentation template
- `docs/ADR.md` - Architecture Decision Records
- `docs/RUNBOOK.md` - Operations runbook
- `docs/features.md` - Feature documentation

**Result:** Professional documentation structure ready to fill in.

---

## 7. Open Source Project Launch

**Scenario:** You're open-sourcing an internal project and need proper community files.

**Solution:**
```bash
# Essential open source files
npx github:cbwinslow/new_project_bundle bundle-downloader download github-core
npx github:cbwinslow/new_project_bundle bundle-downloader download root-docs

# Community management
npx github:cbwinslow/new_project_bundle bundle-downloader download github-issue-templates
npx github:cbwinslow/new_project_bundle bundle-downloader download github-workflows-automation

# Quality and security
npx github:cbwinslow/new_project_bundle bundle-downloader download github-workflows-quality
npx github:cbwinslow/new_project_bundle bundle-downloader download github-workflows-security

# Customize:
# - Update CODEOWNERS with maintainers
# - Edit CONTRIBUTING.md with contribution guidelines
# - Update SECURITY.md with security policy
# - Add funding info to FUNDING.yml
```

**Result:** Complete open source project setup with community management automation.

---

## 8. Containerization

**Scenario:** You need to containerize your application.

**Solution:**
```bash
# Get Docker files
npx github:cbwinslow/new_project_bundle bundle-downloader download docker

# Files you get:
# - Dockerfile (multi-stage build)
# - docker-compose.yml (with PostgreSQL, Redis)
# - .dockerignore

# Customize for your stack
```

**Result:** Production-ready Docker configuration to customize.

---

## 9. GitHub Actions Migration

**Scenario:** Migrating from Jenkins/GitLab CI to GitHub Actions.

**Solution:**
```bash
# Get all workflow examples
npx github:cbwinslow/new_project_bundle bundle-downloader download all-github

# Study workflows in .github/workflows/
# - ci.yml - Build and test
# - cd.yml - Deployment
# - security.yml - Security scans
# - release.yml - Release automation

# Adapt patterns to your existing pipelines
```

**Result:** Comprehensive GitHub Actions examples to learn from and adapt.

---

## 10. AI Agent Configuration

**Scenario:** You want to configure AI coding assistants for your project.

**Solution:**
```bash
# Get AI agent templates
npx github:cbwinslow/new_project_bundle bundle-downloader download templates-ai

# Files you get:
# - templates/agents.md - AI agent configuration
# - templates/rules.md - Development rules
# - templates/ai-linting-rules.md - Code quality rules
# - templates/ai-context-rules.md - Behavior rules

# Also get Copilot instructions
npx github:cbwinslow/new_project_bundle bundle-downloader download github-configs

# Copy to your project:
cp templates/agents.md .github/
cp templates/rules.md .github/
```

**Result:** Configured AI agents that follow your project's conventions.

---

## 🛠️ Advanced Scenarios

### Scenario: Fork and Customize for Your Organization

**Problem:** Your organization needs custom bundles.

**Solution:**
```bash
# 1. Fork the repository
# 2. Clone your fork
git clone https://github.com/yourorg/new_project_bundle.git
cd new_project_bundle

# 3. Edit bundles.json - add your custom bundles
{
  "my-org-standard": {
    "name": "My Org Standard Setup",
    "description": "Standard setup for all our projects",
    "files": [
      ".github/workflows/ci.yml",
      "Dockerfile",
      "package.json",
      ".github/CODEOWNERS"
    ]
  }
}

# 4. Commit and push
git add bundles.json
git commit -m "Add org-specific bundle"
git push

# 5. Use your fork
npx github:yourorg/new_project_bundle bundle-downloader download my-org-standard
```

---

### Scenario: Batch Setup Multiple Projects

**Problem:** Setting up 10 new microservices with the same configuration.

**Solution:**
```bash
#!/bin/bash
# setup-microservices.sh

SERVICES=(
  "user-service"
  "auth-service"
  "payment-service"
  "notification-service"
)

for service in "${SERVICES[@]}"; do
  echo "Setting up $service..."
  mkdir -p "$service"
  cd "$service"
  
  # Initialize git
  git init
  
  # Download bundles
  npx github:cbwinslow/new_project_bundle bundle-downloader download github-core
  npx github:cbwinslow/new_project_bundle bundle-downloader download github-workflows-ci
  npx github:cbwinslow/new_project_bundle bundle-downloader download docker
  npx github:cbwinslow/new_project_bundle bundle-downloader download package-nodejs
  
  # Customize
  sed -i "s/new-project-bundle/$service/g" package.json
  sed -i "s/new-project-bundle/$service/g" README.md
  
  # Initial commit
  git add .
  git commit -m "Initial setup for $service"
  
  cd ..
done

echo "✓ All services set up!"
```

---

## 📋 Checklist Templates

### New Project Checklist

```markdown
- [ ] Download github-core bundle
- [ ] Download root-docs bundle
- [ ] Download github-issue-templates
- [ ] Download github-workflows-ci
- [ ] Download dotfiles
- [ ] Download package-* for your language
- [ ] Customize CODEOWNERS
- [ ] Update README.md
- [ ] Set up GitHub secrets for CI
- [ ] Enable Dependabot
- [ ] Enable CodeQL
```

### Security Audit Checklist

```markdown
- [ ] Download github-workflows-security
- [ ] Download pre-commit bundle
- [ ] Review SECURITY.md
- [ ] Set up secret scanning
- [ ] Enable 2FA for all contributors
- [ ] Review dependabot.yml
- [ ] Test security workflows
```

---

## 💡 Tips and Tricks

1. **Dry run first** - Use `npb-list` to browse before downloading
2. **Start small** - Download individual bundles, not `complete` initially
3. **Customize immediately** - Edit files right after download
4. **Version control** - Commit after each bundle download
5. **Document choices** - Note why you chose specific bundles

---

## 🔗 Related Resources

- [Quick Start Guide](QUICK_START.md)
- [Examples README](README.md)
- [Full Documentation](../BUNDLES.md)
- [Shell Aliases](shell-aliases.sh)

---

Have a use case not covered here? [Submit a PR](../CONTRIBUTING.md) with your scenario!
