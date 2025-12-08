# Bundle Downloader Examples

This directory contains practical examples and utilities for using the bundle downloader system.

## 📂 Files

### QUICK_START.md
A condensed quick start guide with the most common use cases and commands. Perfect for getting started in under 5 minutes.

**Use when:** You want to quickly understand how to use the bundle downloader.

### download-examples.sh
Executable script demonstrating various download scenarios with real commands.

**Usage:**
```bash
# Review the examples
cat examples/download-examples.sh

# Run all examples (requires active connection to GitHub)
./examples/download-examples.sh
```

**Use when:** You want to see working examples of different download scenarios.

### shell-aliases.sh
Pre-configured shell aliases for quick access to bundle downloads.

**Usage:**
```bash
# One-time use
source examples/shell-aliases.sh

# Permanent setup - add to your ~/.bashrc or ~/.zshrc
cat examples/shell-aliases.sh >> ~/.bashrc
source ~/.bashrc
```

**Available aliases:**
- `npb` - Interactive mode
- `npb-dl <bundle>` - Download bundle
- `npb-list` - List bundles
- `npb-ci` - Quick download CI workflows
- `npb-docker` - Quick download Docker files
- And many more!

**Use when:** You frequently download bundles and want quick shortcuts.

## 🎯 Common Workflows

### Workflow 1: Start a New Node.js Project

```bash
# Method 1: Using aliases
source examples/shell-aliases.sh
npb-node
npb-ci
npb-to templates-docs ./docs

# Method 2: Using commands directly
npx github:cbwinslow/new_project_bundle bundle-downloader download package-nodejs
npx github:cbwinslow/new_project_bundle bundle-downloader download github-workflows-ci
npx github:cbwinslow/new_project_bundle bundle-downloader download templates-docs --output ./docs
```

### Workflow 2: Add Security Scanning to Existing Project

```bash
source examples/shell-aliases.sh
npb-security
npb-dl pre-commit
```

### Workflow 3: Setup Complete GitHub Configuration

```bash
source examples/shell-aliases.sh
npb-github
```

### Workflow 4: Get Everything

```bash
source examples/shell-aliases.sh
npb-complete
```

## 🔧 Customization

### Creating Your Own Bundle Script

Copy and modify `download-examples.sh` for your team's specific needs:

```bash
#!/bin/bash
# my-team-setup.sh

echo "Setting up project with team standards..."

# Your team's standard bundles
npx github:cbwinslow/new_project_bundle bundle-downloader download github-workflows-ci
npx github:cbwinslow/new_project_bundle bundle-downloader download github-workflows-security
npx github:cbwinslow/new_project_bundle bundle-downloader download docker
npx github:cbwinslow/new_project_bundle bundle-downloader download package-nodejs
npx github:cbwinslow/new_project_bundle bundle-downloader download pre-commit

echo "✓ Team setup complete!"
```

### Creating Custom Aliases

Add your own aliases to `shell-aliases.sh`:

```bash
# Add to shell-aliases.sh or your shell rc file
alias my-setup='npb-dl github-workflows-ci && npb-dl docker && npb-dl package-nodejs'
alias my-docs='npb-to templates-docs ./docs && npb-to templates-ai ./docs/ai'
```

## 📚 More Resources

- [Quick Start Guide](QUICK_START.md) - Fast introduction
- [Full Documentation](../BUNDLES.md) - Complete bundle system docs
- [Main README](../README.md) - Repository overview
- [Bundle Manifest](../bundles.json) - All bundle definitions

## 💡 Tips

1. **Source aliases early** - Add `source /path/to/shell-aliases.sh` to your shell rc file
2. **Use interactive mode** - When unsure, run `npb` for guided selection
3. **Check the list** - Run `npb-list` to see all available bundles
4. **Customize paths** - Use `--output` flag to download to specific directories
5. **Fork for teams** - Fork the repo and customize bundles for your team's needs

## 🆘 Troubleshooting

### "Command not found: npb"
- Make sure you've sourced the aliases file: `source examples/shell-aliases.sh`
- Or add it to your shell rc file permanently

### "Failed to fetch manifest"
- Check your internet connection
- Verify the repository name is correct
- Check if GitHub is accessible from your location

### "Permission denied"
- Make scripts executable: `chmod +x examples/*.sh`
- Check write permissions in the output directory

## 🤝 Contributing Examples

Have a useful example or workflow? Contribute it!

1. Create a new file in this directory
2. Document it in this README
3. Submit a pull request

**Example contributions:**
- Team-specific setup scripts
- Language-specific workflows
- Integration examples (VS Code, IntelliJ, etc.)
- Docker-based download workflows

---

Happy downloading! 🚀
