# Bundle System Documentation

This repository includes a comprehensive **Bundle System** that allows you to download organized sets of files for your projects. This makes it easy to get exactly what you need without cloning the entire repository.

## 📦 What are Bundles?

Bundles are curated collections of related files from this repository. Each bundle is designed for a specific purpose:

- **Individual bundles** - Focused sets of files (e.g., CI workflows, Docker configs)
- **Meta bundles** - Combinations of multiple bundles (e.g., all GitHub configs)
- **Complete bundle** - Everything in the repository

## 🚀 Quick Start

There are four ways to download bundles:

### 1. Shell Functions (Fastest & Easiest)

Install once, use forever:

```bash
# Quick installation
curl -sSL https://raw.githubusercontent.com/cbwinslow/new_project_bundle/main/scripts/quick-setup.sh | bash

# Then reload your shell
source ~/.bashrc  # or ~/.zshrc

# Now use simple commands
npb-list                              # List all bundles
npb-download github-workflows-ci      # Download a bundle
npb-list-rules                        # List development rules
npb-query commit                      # Search for rules
npb-browse                            # Interactive browser
```

### 2. Interactive CLI Tool

The easiest way to explore and download bundles:

```bash
# Run with npm (no installation needed)
npx github:cbwinslow/new_project_bundle bundle-downloader

# Or run from source
npm run bundle-downloader
```

This launches an interactive menu where you can:
- Browse all available bundles
- See descriptions and file counts
- Download by entering a number or name
- Specify custom output directories

### 3. Command Line Downloads

Download specific bundles directly:

```bash
# List all available bundles
npx github:cbwinslow/new_project_bundle bundle-downloader list

# Download a specific bundle
npx github:cbwinslow/new_project_bundle bundle-downloader download github-workflows-ci

# Download to a specific directory
npx github:cbwinslow/new_project_bundle bundle-downloader download docker --output ./my-project

# Show wget-style examples
npx github:cbwinslow/new_project_bundle bundle-downloader wget
```

### 4. Shell Script (wget/curl)

For quick downloads without Node.js:

```bash
# Download and run the shell script
curl -sSL https://raw.githubusercontent.com/cbwinslow/new_project_bundle/main/scripts/download-bundle.sh | bash -s -- github-workflows-ci

# Or save it first
curl -O https://raw.githubusercontent.com/cbwinslow/new_project_bundle/main/scripts/download-bundle.sh
chmod +x download-bundle.sh

# List available bundles
./download-bundle.sh list

# Download a bundle
./download-bundle.sh github-workflows-ci

# Download to specific directory
./download-bundle.sh all-templates ./my-project
```

## 📋 Available Bundles

### GitHub Configuration Bundles

| Bundle | Description | Files |
|--------|-------------|-------|
| `github-core` | Essential GitHub files (CODEOWNERS, CONTRIBUTING, SECURITY) | 6 |
| `github-issue-templates` | Complete issue template system | 4 |
| `github-workflows-ci` | CI/CD workflows | 3 |
| `github-workflows-security` | Security scanning workflows | 3 |
| `github-workflows-automation` | Issue triage, PR automation | 6 |
| `github-workflows-quality` | Docs, AI review, performance | 5 |
| `github-configs` | Dependabot, labels, configs | 7 |
| `all-github` | **Meta:** All GitHub configs | 34 |

### Infrastructure Bundles

| Bundle | Description | Files |
|--------|-------------|-------|
| `docker` | Dockerfile and docker-compose | 3 |
| `dotfiles` | Editor config, git files, env | 7 |
| `pre-commit` | Pre-commit hooks config | 1 |
| `makefile` | Make targets for dev tasks | 1 |

### Package Manager Bundles

| Bundle | Description | Files |
|--------|-------------|-------|
| `package-nodejs` | package.json, package-lock, tsconfig | 3 |
| `package-python` | requirements.txt | 1 |
| `package-ruby` | Gemfile and Gemfile.lock | 2 |
| `package-go` | go.mod and go.sum | 2 |
| `package-rust` | Cargo.toml and Cargo.lock | 2 |
| `package-php` | composer.json and composer.lock | 2 |
| `renovate` | Renovate configuration | 1 |
| `all-packages` | **Meta:** All package files | 13 |

### Documentation & Template Bundles

| Bundle | Description | Files |
|--------|-------------|-------|
| `root-docs` | README, LICENSE, CHANGELOG, CODE_OF_CONDUCT | 4 |
| `templates-docs` | SRS, features, ADR, API, RUNBOOK | 5 |
| `templates-ai` | AI agent configuration and rules | 4 |
| `templates-git` | Git submodules and Go shell templates | 2 |
| `all-templates` | **Meta:** All templates | 11 |

### Development Rules Bundles

| Bundle | Description | Files |
|--------|-------------|-------|
| `rules-code-quality` | Clean code and error handling | 2 |
| `rules-git-workflow` | Commit messages and branch naming | 2 |
| `rules-testing` | Test coverage requirements | 1 |
| `rules-documentation` | API documentation standards | 1 |
| `rules-security` | Secrets management | 1 |
| `rules-deployment` | Deployment checklist | 1 |
| `rules-ai-agents` | AI agent guidelines | 1 |
| `all-rules` | **Meta:** All development rules | 9 |

**Using Rules:**
```bash
# List all rules
npb-list-rules

# Download a specific rule
npb-download-rule code-quality/clean-code.md

# Download all rules in a category
npb-download rules-code-quality

# Search for rules
npb-query commit
npb-query security

# Browse interactively (requires fzf)
npb-browse
```

See [Rules System Documentation](docs/wiki/Rules-System.md) for more details.

### MCP Server Bundle

| Bundle | Description | Files |
|--------|-------------|-------|
| `mcp-server` | Complete Model Context Protocol server | 8 |

### Scripts Bundle

| Bundle | Description | Files |
|--------|-------------|-------|
| `scripts` | Shell scripts and functions | 4 |

### Meta Bundles

| Bundle | Description | Includes |
|--------|-------------|----------|
| `all-github` | All GitHub configurations | 7 bundles |
| `all-packages` | All package manager files | 7 bundles |
| `all-templates` | All project templates | 3 bundles |
| `complete` | **Everything** in the repository | All bundles |

## 🔧 Advanced Usage

### Custom Repository/Branch

Download bundles from a fork or different branch:

```bash
# Using CLI
npx github:cbwinslow/new_project_bundle bundle-downloader download docker \
  --repo myuser/my-fork \
  --branch feature-branch

# Using shell script
NPB_REPO=myuser/my-fork NPB_BRANCH=feature-branch ./download-bundle.sh docker
```

### Direct File Downloads

Download individual files using GitHub raw URLs:

```bash
# Download a single file
wget https://raw.githubusercontent.com/cbwinslow/new_project_bundle/main/.github/workflows/ci.yml

# Download to a specific path
wget -O .github/workflows/ci.yml \
  https://raw.githubusercontent.com/cbwinslow/new_project_bundle/main/.github/workflows/ci.yml
```

### Programmatic Usage

Use the TypeScript module in your own scripts:

```typescript
import { BundleDownloader } from 'new-project-bundle/dist/cli/bundle-downloader.js';

const downloader = new BundleDownloader(
  'cbwinslow/new_project_bundle',
  'main',
  './output'
);

await downloader.loadManifest();
await downloader.downloadBundle('github-workflows-ci');
```

### Batch Downloads

Create a custom download script:

```bash
#!/bin/bash
# download-my-stack.sh

BUNDLES=(
  "github-core"
  "github-workflows-ci"
  "docker"
  "package-nodejs"
  "templates-docs"
)

for bundle in "${BUNDLES[@]}"; do
  npx github:cbwinslow/new_project_bundle bundle-downloader download "$bundle"
done
```

## 📝 Bundle Manifest

The bundle system is driven by `bundles.json`, which defines all available bundles and their contents. This manifest is version-controlled and updated with each release.

You can view the manifest at:
```
https://raw.githubusercontent.com/cbwinslow/new_project_bundle/main/bundles.json
```

### Manifest Structure

```json
{
  "version": "1.0.0",
  "bundles": {
    "bundle-name": {
      "name": "Display Name",
      "description": "What this bundle includes",
      "files": ["path/to/file1", "path/to/file2"],
      "includes": ["other-bundle-1", "other-bundle-2"]
    }
  }
}
```

## 🛠️ Creating Custom Bundles

You can create your own bundle manifest for your forked repository:

1. **Copy and modify** `bundles.json`
2. **Add/remove files** from bundles as needed
3. **Create new bundles** for your use cases
4. **Use the same tools** to download from your fork

Example custom bundle:

```json
{
  "my-custom-bundle": {
    "name": "My Custom Setup",
    "description": "Files I always need for new projects",
    "files": [
      ".github/workflows/ci.yml",
      "Dockerfile",
      "package.json",
      ".gitignore"
    ]
  }
}
```

## 🌐 Shell Functions & Quick Access

The fastest way to use NPB is with shell functions:

### Installation

```bash
# One-line installation
curl -sSL https://raw.githubusercontent.com/cbwinslow/new_project_bundle/main/scripts/quick-setup.sh | bash

# Reload your shell
source ~/.bashrc  # or ~/.zshrc
```

### Available Commands

Once installed, you have these commands:

```bash
# Bundle commands
npb-list                    # List all bundles
npb-download <bundle>       # Download a bundle
npb-update                  # Update cache

# Rule commands
npb-list-rules             # List all rules
npb-download-rule <rule>   # Download a specific rule
npb-query <keyword>        # Search for rules
npb-browse                 # Interactive browser (requires fzf)

# Utility commands
npb-install                # Install to shell profile
npb-help                   # Show help

# Aliases (shortcuts)
npb                        # Same as npb-help
npb-ls                     # Same as npb-list
npb-dl                     # Same as npb-download
npb-rules                  # Same as npb-list-rules
npb-search                 # Same as npb-query
```

### Examples

```bash
# List and download bundles
npb-list
npb-download github-workflows-ci

# Work with rules
npb-list-rules
npb-query commit
npb-download-rule code-quality/clean-code.md
npb-browse  # Interactive (requires fzf)

# Configuration
export NPB_REPO="myuser/my-fork"
export NPB_BRANCH="develop"
npb-download docker
```

### Manual Aliases (Alternative)

If you prefer not to install shell functions, add these aliases:

```bash
# ~/.bashrc or ~/.zshrc

# Download bundles
alias npb-dl='npx github:cbwinslow/new_project_bundle bundle-downloader download'
alias npb-list='npx github:cbwinslow/new_project_bundle bundle-downloader list'
alias npb='npx github:cbwinslow/new_project_bundle bundle-downloader'

# Examples:
# npb-dl github-workflows-ci
# npb-list
# npb  # Interactive mode
```

Or use the standalone script:

```bash
# Download script once
curl -o ~/bin/bundle-dl https://raw.githubusercontent.com/cbwinslow/new_project_bundle/main/scripts/download-bundle.sh
chmod +x ~/bin/bundle-dl

# Add to PATH if needed
export PATH="$HOME/bin:$PATH"

# Now use anywhere:
# bundle-dl github-workflows-ci
```

## 🔍 Finding Files

Not sure which bundle contains a specific file?

```bash
# Method 1: Download and search the manifest
curl -s https://raw.githubusercontent.com/cbwinslow/new_project_bundle/main/bundles.json | \
  jq -r '.bundles | to_entries[] | select(.value.files[]? | contains("ci.yml")) | .key'

# Method 2: List all bundles and browse descriptions
npx github:cbwinslow/new_project_bundle bundle-downloader list
```

## 🎯 Common Use Cases

### Starting a New Node.js Project

```bash
bundle-dl package-nodejs
bundle-dl github-workflows-ci
bundle-dl dotfiles
bundle-dl root-docs
```

### Adding Security Scanning

```bash
bundle-dl github-workflows-security
bundle-dl pre-commit
```

### Setting Up Docker

```bash
bundle-dl docker
bundle-dl dotfiles  # Includes .dockerignore
```

### Complete GitHub Setup

```bash
bundle-dl all-github
```

### Documentation Templates

```bash
bundle-dl all-templates --output ./docs
```

## 🔐 Security

- All downloads use HTTPS
- Files are fetched from GitHub's raw content service
- No code execution during download (except shell script itself)
- Verify file contents after download if needed

## 🐛 Troubleshooting

### "Bundle not found"

- Check bundle name with `bundle-downloader list`
- Bundle names are case-sensitive and use kebab-case

### "Failed to download manifest"

- Check internet connection
- Verify repository and branch names
- Check if GitHub is accessible

### "jq not found" (shell script)

- Install jq for better formatting: `brew install jq` or `apt-get install jq`
- Script works without jq but with limited functionality

### Permission denied

- Make sure script is executable: `chmod +x download-bundle.sh`
- Check write permissions in output directory

## 📚 Related Documentation

- [Main README](README.md) - Repository overview
- [MCP Server Documentation](README.md#-mcp-server) - About the MCP server
- [Contributing Guide](.github/CONTRIBUTING.md) - How to contribute
- [Bundle Manifest](bundles.json) - Full bundle definitions

## 🤝 Contributing

Want to improve the bundle system?

1. Add new bundles to `bundles.json`
2. Improve the CLI tool in `src/cli/bundle-downloader.ts`
3. Enhance the shell script in `scripts/download-bundle.sh`
4. Update this documentation

See [CONTRIBUTING.md](.github/CONTRIBUTING.md) for guidelines.

---

Made with ❤️ to make project setup faster and easier
