# Shell Functions Documentation

Complete guide to using New Project Bundle shell functions for interactive bundle and rule management.

## Table of Contents

- [Installation](#installation)
- [Bundle Management](#bundle-management)
- [Rule Management](#rule-management)
- [Interactive Browser](#interactive-browser)
- [Configuration](#configuration)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)

## Installation

### Quick Install

The easiest way to install NPB shell functions:

```bash
# One-command install
curl -sSL https://raw.githubusercontent.com/cbwinslow/new_project_bundle/main/scripts/setup-shell.sh | bash

# Or with wget
wget -qO- https://raw.githubusercontent.com/cbwinslow/new_project_bundle/main/scripts/setup-shell.sh | bash
```

### Manual Installation

1. **Download the function libraries:**

```bash
mkdir -p ~/.local/lib
cd ~/.local/lib

# Download all function libraries
curl -O https://raw.githubusercontent.com/cbwinslow/new_project_bundle/main/lib/bundle-functions.sh
curl -O https://raw.githubusercontent.com/cbwinslow/new_project_bundle/main/lib/tui-browser.sh
curl -O https://raw.githubusercontent.com/cbwinslow/new_project_bundle/main/lib/rule-manager.sh
curl -O https://raw.githubusercontent.com/cbwinslow/new_project_bundle/main/lib/profile-integration.sh
```

2. **Add to your shell profile:**

**For Bash (`~/.bashrc`):**

```bash
# New Project Bundle Functions
source ~/.local/lib/bundle-functions.sh
source ~/.local/lib/tui-browser.sh
source ~/.local/lib/rule-manager.sh

# Useful aliases
alias npb='npb_list_bundles'
alias npb-browse='npb_browse_bundles'
alias npb-get='npb_get'
```

**For Zsh (`~/.zshrc`):**

```zsh
# New Project Bundle Functions
source ~/.local/lib/bundle-functions.sh
source ~/.local/lib/tui-browser.sh
source ~/.local/lib/rule-manager.sh

# Useful aliases
alias npb='npb_list_bundles'
alias npb-browse='npb_browse_bundles'
alias npb-get='npb_get'
```

3. **Reload your shell:**

```bash
source ~/.bashrc  # or source ~/.zshrc
```

### Verify Installation

```bash
npb_version
npb_help
```

## Bundle Management

### List All Bundles

Display all available bundles with descriptions:

```bash
npb_list_bundles
```

Shorthand:
```bash
npb
```

### Search Bundles

Search for bundles by keyword:

```bash
npb_search_bundles docker
npb_search_bundles github
npb_search_bundles workflow
```

Shorthand:
```bash
npb-search docker
```

### Bundle Information

Get detailed information about a specific bundle:

```bash
npb_info_bundle github-workflows-ci
npb_info_bundle all-templates
```

Shorthand:
```bash
npb-info docker
```

### Download Bundles

Download a bundle to a specific directory:

```bash
# Download to current directory
npb_download_bundle github-workflows-ci

# Download to specific directory
npb_download_bundle docker ./my-project

# Download all templates to docs folder
npb_download_bundle all-templates ./docs
```

Shorthand:
```bash
npb-dl github-workflows-ci
npb-dl docker ./my-project
```

### Quick Download

Download to current directory (simplified):

```bash
npb_get github-workflows-ci
npb_get all-templates
npb_get docker
```

Shorthand:
```bash
npb-get docker
```

## Rule Management

### List Rules

List all available development rules:

```bash
# List all rules
npb_list_rules

# List rules by category
npb_list_rules github
npb_list_rules docker
npb_list_rules security
npb_list_rules linting
```

Shorthand:
```bash
npb-rules
npb-rules github
```

### Search Rules

Search rules by keyword:

```bash
npb_search_rules security
npb_search_rules eslint
npb_search_rules ci
```

Shorthand:
```bash
npb-rules-search security
```

### Rule Information

Get detailed information about a specific rule:

```bash
npb_info_rule gh-ci-basic
npb_info_rule docker-multistage
npb_info_rule sec-secrets-scan
```

### Download Rules

Download a specific rule file:

```bash
# Download to current directory
npb_download_rule gh-ci-basic

# Download to specific directory
npb_download_rule docker-multistage ./docker

# Download security rule
npb_download_rule sec-secrets-scan ./.github/workflows
```

### Install Rules

Install a rule to your NPB rules directory:

```bash
npb_install_rule gh-ci-basic
npb_install_rule docker-multistage
```

### List Installed Rules

Show all rules you've installed:

```bash
npb_list_installed_rules
```

## Interactive Browser

### Bundle Browser

Launch interactive TUI for browsing bundles:

```bash
npb_browse_bundles
```

Shorthand:
```bash
npb-browse
```

**Navigation:**
- `n` - Next page
- `p` - Previous page
- `i` - Show bundle info
- `s` - Search bundles
- `#` - Download bundle by number
- `q` - Quit

### Quick Download Menu

Interactive menu for popular bundles:

```bash
npb_quick_download
```

### Rules Browser

Browse development rules interactively:

```bash
npb_browse_rules

# Browse specific category
npb_browse_rules github
npb_browse_rules docker
```

Shorthand:
```bash
npb-rules-browse
npb-rules-browse security
```

## Configuration

### Environment Variables

Configure NPB behavior with environment variables:

```bash
# Custom repository
export NPB_REPO="myuser/my-fork"

# Custom branch
export NPB_BRANCH="develop"

# Custom cache directory
export NPB_CACHE_DIR="$HOME/.cache/my-npb"

# Custom install directory
export NPB_INSTALL_DIR="$HOME/.npb"
```

Add these to your `.bashrc` or `.zshrc` to make them permanent.

### Cache Management

Refresh the cached bundle manifest:

```bash
npb_refresh
```

Refresh rules index:

```bash
npb_refresh_rules
```

Clear all cache:

```bash
rm -rf ~/.cache/npb
```

### Profile Integration Status

Check NPB integration status:

```bash
npb_status
```

### Generate Aliases

Generate a set of useful aliases:

```bash
npb_generate_aliases >> ~/.bashrc
source ~/.bashrc
```

## Examples

### Setting Up a New Node.js Project

```bash
# Create project directory
mkdir my-app && cd my-app

# Download essential files
npb-get package-nodejs
npb-get dotfiles
npb-get github-workflows-ci

# Download templates
npb-get all-templates
```

### Adding Security Scanning

```bash
# Download security workflows
npb-get github-workflows-security

# Install security rules
npb_install_rule sec-secrets-scan
npb_install_rule sec-dependency-audit
```

### Docker Setup

```bash
# Get Docker configuration
npb-get docker

# Get Docker rules
npb_download_rule docker-multistage .
npb_download_rule docker-security .
```

### Complete GitHub Setup

```bash
# Download all GitHub configs
npb-get all-github

# Browse additional workflows
npb-browse
```

### Search and Download

```bash
# Find security-related bundles
npb_search_bundles security

# Find CI/CD rules
npb_search_rules ci

# Download what you found
npb-get github-workflows-security
npb_install_rule gh-ci-basic
```

## Utility Commands

### Version and Status

```bash
# Show NPB version
npb_version

# Show integration status
npb_status
```

### Help

```bash
# Show all commands
npb_help

# Show rule commands (from rule-manager.sh)
# Available when sourced
```

## Available Aliases

When you install NPB, these convenient aliases are available:

### Bundle Aliases

```bash
npb              # List bundles
npb-browse       # Interactive browser
npb-search       # Search bundles
npb-info         # Bundle information
npb-get          # Quick download
npb-dl           # Download bundle
npb-help         # Show help
npb-refresh      # Refresh cache
```

### Rule Aliases

```bash
npb-rules        # List rules
npb-rules-search # Search rules
npb-rules-browse # Browse rules
```

## Advanced Usage

### Custom Repository

Use bundles from a fork or custom repository:

```bash
# Set custom repository
export NPB_REPO="myusername/my-bundle-fork"
export NPB_BRANCH="my-custom-branch"

# Now all commands use your repository
npb_list_bundles
npb-get my-custom-bundle
```

### Batch Downloads

Download multiple bundles at once:

```bash
#!/bin/bash
# download-my-stack.sh

bundles=(
  "github-core"
  "github-workflows-ci"
  "docker"
  "all-templates"
  "dotfiles"
)

for bundle in "${bundles[@]}"; do
  npb-get "$bundle"
done
```

### Integration with Other Tools

```bash
# Use with Git hooks
npb_download_rule lint-pre-commit ./.git/hooks/

# Use in CI/CD
npb-get github-workflows-ci
npb_download_rule gh-security-scan ./.github/workflows/

# Use in Docker
npb_download_rule docker-multistage ./Dockerfile
```

## Troubleshooting

### Functions Not Found

If commands aren't available after installation:

```bash
# Reload your shell profile
source ~/.bashrc  # or ~/.zshrc

# Or restart your terminal
```

### jq Not Found

Many features require `jq`:

```bash
# Ubuntu/Debian
sudo apt install jq

# macOS
brew install jq

# RHEL/CentOS
sudo yum install jq

# Arch Linux
sudo pacman -S jq
```

### Bundle Not Found

```bash
# Refresh the manifest
npb_refresh

# List available bundles
npb_list_bundles

# Check bundle name (case-sensitive, kebab-case)
npb_info_bundle github-workflows-ci
```

### Download Fails

```bash
# Check internet connection
ping github.com

# Try alternative download tool
# NPB automatically tries curl then wget

# Check custom repository settings
echo $NPB_REPO
echo $NPB_BRANCH
```

### Cache Issues

```bash
# Clear cache and refresh
rm -rf ~/.cache/npb
npb_refresh
npb_refresh_rules
```

### Permissions

```bash
# Ensure install directory is writable
chmod +w ~/.local/lib

# Check cache directory permissions
chmod +w ~/.cache/npb
```

## Uninstallation

Remove NPB shell integration:

```bash
# Source profile integration functions first
source ~/.local/lib/profile-integration.sh

# Remove from profile
npb_remove_integration

# Remove files
rm -rf ~/.local/lib/bundle-functions.sh
rm -rf ~/.local/lib/tui-browser.sh
rm -rf ~/.local/lib/rule-manager.sh
rm -rf ~/.local/lib/profile-integration.sh
rm -rf ~/.cache/npb
rm -rf ~/.local/share/npb
```

## Contributing

Want to add more functions or improve existing ones?

1. Fork the repository
2. Edit files in `lib/`
3. Test your changes
4. Submit a pull request

See [CONTRIBUTING.md](../.github/CONTRIBUTING.md) for guidelines.

## Support

- **Issues**: [GitHub Issues](https://github.com/cbwinslow/new_project_bundle/issues)
- **Discussions**: [GitHub Discussions](https://github.com/cbwinslow/new_project_bundle/discussions)
- **Documentation**: [Main README](../README.md)

---

**Made with ❤️ for the developer community**
