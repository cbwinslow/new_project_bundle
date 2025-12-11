# Getting Started

Welcome to New Project Bundle! This guide will help you get started quickly.

## What You'll Need

- A Unix-like environment (Linux, macOS, WSL on Windows)
- `curl` or `wget` (usually pre-installed)
- `bash` or `zsh` shell
- Optional: `jq` for better JSON parsing
- Optional: `fzf` for interactive browsing

## Quick Start (5 Minutes)

### Step 1: Install Shell Functions

Choose your shell and run the appropriate command:

**For Bash:**
```bash
curl -sSL https://raw.githubusercontent.com/cbwinslow/new_project_bundle/main/scripts/shell-functions.sh >> ~/.bashrc
source ~/.bashrc
```

**For Zsh:**
```bash
curl -sSL https://raw.githubusercontent.com/cbwinslow/new_project_bundle/main/scripts/shell-functions.sh >> ~/.zshrc
source ~/.zshrc
```

You should see:
```
ℹ New Project Bundle functions loaded. Type 'npb-help' for usage.
```

### Step 2: Explore Available Bundles

```bash
npb-list
```

This shows all available bundles organized by category.

### Step 3: Download Your First Bundle

Let's download the GitHub CI/CD workflows:

```bash
npb-download github-workflows-ci
```

Files will be downloaded to the current directory, preserving the folder structure.

### Step 4: Browse Rules

```bash
npb-list-rules
```

This shows all development rules organized by category.

### Step 5: Try Interactive Mode (Optional)

If you have `fzf` installed:

```bash
npb-browse
```

Use arrow keys to navigate and Enter to download.

## Common Use Cases

### Setting Up a New Repository

```bash
# Create project directory
mkdir my-new-project
cd my-new-project

# Initialize git
git init

# Download essential files
npb-download github-core
npb-download dotfiles
npb-download pre-commit

# Download workflows
npb-download github-workflows-ci
npb-download github-workflows-security

# Download rules for reference
npb-download all-rules ./docs/rules/
```

### Adding to Existing Project

```bash
# Navigate to your project
cd ~/projects/my-existing-project

# Download just what you need
npb-download github-workflows-security
npb-download-rule security/secrets-management.md ./docs/
```

### Learning Best Practices

```bash
# Search for rules about testing
npb-query test

# Download and read a rule
npb-download-rule testing/test-coverage.md
cat test-coverage.md
```

## Installation Options

### Option 1: Shell Functions (Recommended)

Best for regular use. Provides commands like `npb-list`, `npb-download`, etc.

```bash
# Install
curl -sSL https://raw.githubusercontent.com/cbwinslow/new_project_bundle/main/scripts/shell-functions.sh >> ~/.bashrc
source ~/.bashrc
```

### Option 2: Standalone Script

Good for one-time downloads or CI/CD environments.

```bash
# Download the script
curl -O https://raw.githubusercontent.com/cbwinslow/new_project_bundle/main/scripts/download-bundle.sh
chmod +x download-bundle.sh

# Use it
./download-bundle.sh list
./download-bundle.sh github-workflows-ci
```

### Option 3: Node.js CLI (Most Features)

Best for complex bundle operations and automation.

```bash
# Clone the repository
git clone https://github.com/cbwinslow/new_project_bundle.git
cd new_project_bundle

# Install dependencies
npm install

# Run the CLI
npm run bundle-downloader

# Or use directly
npx github:cbwinslow/new_project_bundle bundle-downloader
```

## Installing Dependencies

### macOS (Homebrew)

```bash
# Essential
brew install curl wget

# Recommended
brew install jq fzf bat

# Optional
brew install git node
```

### Ubuntu/Debian

```bash
# Essential
sudo apt-get update
sudo apt-get install curl wget

# Recommended
sudo apt-get install jq fzf bat

# Optional
sudo apt-get install git nodejs npm
```

### CentOS/RHEL/Fedora

```bash
# Essential
sudo yum install curl wget

# Recommended
sudo yum install jq

# Install fzf manually from GitHub
git clone --depth 1 https://github.com/junegunn/fzf.git ~/.fzf
~/.fzf/install
```

## Verifying Installation

After installing shell functions, verify everything works:

```bash
# Check if functions are loaded
type npb-list

# Should output:
# npb-list is a function

# Test listing bundles
npb-list

# Test downloading
npb-download root-docs /tmp/test-download

# Check files were downloaded
ls -la /tmp/test-download/
```

## Configuration

Customize NPB with environment variables:

```bash
# Add to ~/.bashrc or ~/.zshrc before sourcing shell-functions.sh

# Use a fork
export NPB_REPO="myorg/my-bundle"

# Use a different branch
export NPB_BRANCH="develop"

# Custom cache location
export NPB_CACHE_DIR="$HOME/.config/npb/cache"
```

## Next Steps

Now that you're set up:

1. **Explore Bundles**: Run `npb-list` to see what's available
2. **Read Rules**: Browse rules with `npb-list-rules`
3. **Customize**: Download bundles to your projects
4. **Learn More**: Read the [Bundle System](Bundle-System.md) guide
5. **Integrate with AI**: Check out [MCP Server](MCP-Server.md)

## Troubleshooting

### "Command not found: npb-list"

**Solution**: Source your shell config file:
```bash
source ~/.bashrc  # or ~/.zshrc
```

Or restart your terminal.

### "Failed to download manifest"

**Solutions**:
1. Check internet connection
2. Verify GitHub is accessible:
   ```bash
   curl https://raw.githubusercontent.com/cbwinslow/new_project_bundle/main/bundles.json
   ```
3. Check if you're behind a proxy

### "jq: command not found"

**Solution**: Install jq for better formatting:
```bash
# macOS
brew install jq

# Ubuntu/Debian
sudo apt-get install jq

# Or continue without it (basic functionality still works)
```

### Downloads fail silently

**Solution**: Check you have curl or wget:
```bash
which curl
which wget

# If neither exists, install one:
# macOS: brew install curl
# Ubuntu: sudo apt-get install curl
```

## Getting Help

- **Command Help**: Run `npb-help`
- **Bundle List**: Run `npb-list`
- **Rule Search**: Run `npb-query <keyword>`
- **GitHub Issues**: [Report a bug](https://github.com/cbwinslow/new_project_bundle/issues)
- **Discussions**: [Ask a question](https://github.com/cbwinslow/new_project_bundle/discussions)

## What's Next?

- [Bundle System](Bundle-System.md) - Learn about bundles in depth
- [Rules System](Rules-System.md) - Understand development rules
- [Shell Integration](Shell-Integration.md) - Advanced shell usage
- [Workflows](Workflows.md) - GitHub Actions workflows
- [MCP Server](MCP-Server.md) - AI agent integration
