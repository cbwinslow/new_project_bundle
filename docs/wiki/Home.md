# New Project Bundle Wiki

Welcome to the New Project Bundle wiki! This wiki provides comprehensive documentation for using the bundle system, rules, and shell integration.

## Quick Links

- [Home](Home.md) - This page
- [Getting Started](Getting-Started.md) - Quick start guide
- [Bundle System](Bundle-System.md) - Using the bundle downloader
- [Rules System](Rules-System.md) - Development rules and guidelines
- [Shell Integration](Shell-Integration.md) - bashrc/zshrc integration
- [Workflows](Workflows.md) - GitHub Actions workflows
- [MCP Server](MCP-Server.md) - Model Context Protocol server
- [Contributing](Contributing.md) - How to contribute

## What is New Project Bundle?

New Project Bundle is a comprehensive collection of:

- **GitHub Configurations** - Issue templates, workflows, security configs
- **Development Rules** - Modular, downloadable coding standards
- **Shell Tools** - Functions for easy bundle and rule management
- **MCP Server** - AI agent integration via Model Context Protocol
- **Templates** - Documentation and project templates
- **Scripts** - Automation and setup scripts

## Key Features

### 📦 Modular Bundle System
Download only what you need:
- Individual files
- Curated bundles
- Complete sets
- Meta-bundles

### 📋 Development Rules
Organized, searchable rules for:
- Code quality
- Git workflows
- Testing
- Documentation
- Security
- Deployment

### 🔧 Shell Integration
Powerful shell functions:
- `npb-list` - List available bundles
- `npb-download` - Download bundles
- `npb-query` - Search rules
- `npb-browse` - Interactive browser
- `npb-install` - Install to shell profile

### 🤖 AI Agent Support
- MCP server for AI tool integration
- Structured rule format for AI consumption
- Pre-configured GitHub Copilot instructions
- OpenHands/CodeRabbit compatible

## Quick Start

### 1. Download the Shell Functions
```bash
# For bash
curl -sSL https://raw.githubusercontent.com/cbwinslow/new_project_bundle/main/scripts/shell-functions.sh >> ~/.bashrc
source ~/.bashrc

# For zsh
curl -sSL https://raw.githubusercontent.com/cbwinslow/new_project_bundle/main/scripts/shell-functions.sh >> ~/.zshrc
source ~/.zshrc
```

### 2. Explore Available Bundles
```bash
npb-list
```

### 3. Download a Bundle
```bash
npb-download github-workflows-ci
```

### 4. Browse Rules
```bash
npb-list-rules
npb-query commit
npb-browse  # Interactive (requires fzf)
```

## Documentation Structure

This wiki is organized into the following sections:

### For New Users
- [Getting Started](Getting-Started.md) - Installation and first steps
- [Bundle System](Bundle-System.md) - How to use bundles

### For Developers
- [Rules System](Rules-System.md) - Development rules
- [Workflows](Workflows.md) - CI/CD workflows
- [MCP Server](MCP-Server.md) - AI integration

### For Contributors
- [Contributing](Contributing.md) - Contribution guidelines
- [Architecture](Architecture.md) - System architecture

## Support

- **Issues**: [GitHub Issues](https://github.com/cbwinslow/new_project_bundle/issues)
- **Discussions**: [GitHub Discussions](https://github.com/cbwinslow/new_project_bundle/discussions)
- **Security**: See [SECURITY.md](https://github.com/cbwinslow/new_project_bundle/blob/main/.github/SECURITY.md)

## License

This project is licensed under the MIT License. See [LICENSE](https://github.com/cbwinslow/new_project_bundle/blob/main/LICENSE) for details.
