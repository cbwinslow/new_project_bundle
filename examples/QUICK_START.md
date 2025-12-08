# Quick Start Guide

Get started with the bundle downloader in under 5 minutes!

## 🚀 The Fastest Way

### One-Line Downloads

Download what you need with a single command:

```bash
# Get CI/CD workflows
npx github:cbwinslow/new_project_bundle bundle-downloader download github-workflows-ci

# Get Docker configuration
npx github:cbwinslow/new_project_bundle bundle-downloader download docker

# Get all GitHub configs
npx github:cbwinslow/new_project_bundle bundle-downloader download all-github
```

### Interactive Mode

Let the CLI guide you:

```bash
npx github:cbwinslow/new_project_bundle bundle-downloader
```

Then just select from the menu!

## 📋 Common Scenarios

### Starting a New Node.js Project

```bash
# Get Node.js essentials
npx github:cbwinslow/new_project_bundle bundle-downloader download package-nodejs

# Add CI/CD
npx github:cbwinslow/new_project_bundle bundle-downloader download github-workflows-ci

# Add documentation templates
npx github:cbwinslow/new_project_bundle bundle-downloader download templates-docs --output ./docs
```

### Setting Up a Python Project

```bash
npx github:cbwinslow/new_project_bundle bundle-downloader download package-python
npx github:cbwinslow/new_project_bundle bundle-downloader download github-workflows-ci
npx github:cbwinslow/new_project_bundle bundle-downloader download pre-commit
```

### Adding Security Scanning

```bash
npx github:cbwinslow/new_project_bundle bundle-downloader download github-workflows-security
```

### Complete Repository Setup

```bash
npx github:cbwinslow/new_project_bundle bundle-downloader download complete
```

## 💡 Pro Tips

### Create Aliases

Add to your `~/.bashrc` or `~/.zshrc`:

```bash
alias npb='npx github:cbwinslow/new_project_bundle bundle-downloader'
alias npb-dl='npx github:cbwinslow/new_project_bundle bundle-downloader download'
```

Then use:

```bash
npb-dl github-workflows-ci
npb list
```

### Install Locally

```bash
curl -sSL https://raw.githubusercontent.com/cbwinslow/new_project_bundle/main/scripts/install.sh | bash
```

### No Node.js? Use Shell Script

```bash
# One-liner
curl -sSL https://raw.githubusercontent.com/cbwinslow/new_project_bundle/main/scripts/download-bundle.sh | \
  bash -s -- github-workflows-ci

# Or download the script
curl -O https://raw.githubusercontent.com/cbwinslow/new_project_bundle/main/scripts/download-bundle.sh
chmod +x download-bundle.sh
./download-bundle.sh list
```

## 🎯 What Should I Download?

### For a New Repository
- `github-core` - Essential GitHub files
- `github-issue-templates` - Issue templates
- `root-docs` - README, LICENSE, etc.

### For CI/CD
- `github-workflows-ci` - CI/CD pipelines
- `github-workflows-security` - Security scanning

### For Development
- `dotfiles` - Git config, editor config
- `pre-commit` - Code quality hooks
- `package-*` - Package manager files for your language

### For Documentation
- `templates-docs` - SRS, API docs, runbooks
- `templates-ai` - AI agent configuration

### Everything
- `complete` - Get it all!

## 📚 Learn More

- [Full Documentation](../BUNDLES.md)
- [Main README](../README.md)
- [Bundle Manifest](../bundles.json)

## 🆘 Need Help?

```bash
# Show help
npx github:cbwinslow/new_project_bundle bundle-downloader help

# List all bundles with descriptions
npx github:cbwinslow/new_project_bundle bundle-downloader list
```

---

**Ready?** Run this now:

```bash
npx github:cbwinslow/new_project_bundle bundle-downloader
```
