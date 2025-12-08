#!/bin/bash

#
# Bundle Downloader Shell Aliases
#
# Add these to your ~/.bashrc or ~/.zshrc for quick access
# Or source this file: source shell-aliases.sh
#

# Main bundle downloader alias
alias npb='npx github:cbwinslow/new_project_bundle bundle-downloader'

# Download a specific bundle
alias npb-dl='npx github:cbwinslow/new_project_bundle bundle-downloader download'

# List available bundles
alias npb-list='npx github:cbwinslow/new_project_bundle bundle-downloader list'

# Show wget examples
alias npb-wget='npx github:cbwinslow/new_project_bundle bundle-downloader wget'

# Help
alias npb-help='npx github:cbwinslow/new_project_bundle bundle-downloader help'

# Common bundle shortcuts
alias npb-ci='npx github:cbwinslow/new_project_bundle bundle-downloader download github-workflows-ci'
alias npb-security='npx github:cbwinslow/new_project_bundle bundle-downloader download github-workflows-security'
alias npb-docker='npx github:cbwinslow/new_project_bundle bundle-downloader download docker'
alias npb-github='npx github:cbwinslow/new_project_bundle bundle-downloader download all-github'
alias npb-templates='npx github:cbwinslow/new_project_bundle bundle-downloader download all-templates'
alias npb-complete='npx github:cbwinslow/new_project_bundle bundle-downloader download complete'

# Language-specific bundles
alias npb-node='npx github:cbwinslow/new_project_bundle bundle-downloader download package-nodejs'
alias npb-python='npx github:cbwinslow/new_project_bundle bundle-downloader download package-python'
alias npb-go='npx github:cbwinslow/new_project_bundle bundle-downloader download package-go'
alias npb-rust='npx github:cbwinslow/new_project_bundle bundle-downloader download package-rust'
alias npb-ruby='npx github:cbwinslow/new_project_bundle bundle-downloader download package-ruby'
alias npb-php='npx github:cbwinslow/new_project_bundle bundle-downloader download package-php'

# Function for custom output directory
npb-to() {
    if [ -z "$1" ] || [ -z "$2" ]; then
        echo "Usage: npb-to <bundle-name> <output-directory>"
        echo "Example: npb-to all-templates ./my-project"
        return 1
    fi
    npx github:cbwinslow/new_project_bundle bundle-downloader download "$1" --output "$2"
}

# Function for custom repo
npb-from() {
    if [ -z "$1" ] || [ -z "$2" ]; then
        echo "Usage: npb-from <repo> <bundle-name>"
        echo "Example: npb-from myuser/my-fork docker"
        return 1
    fi
    npx github:cbwinslow/new_project_bundle bundle-downloader download "$2" --repo "$1"
}

# Print help for these aliases
npb-aliases-help() {
    cat << 'EOF'
Bundle Downloader Shell Aliases
================================

Basic Commands:
  npb              - Interactive mode
  npb-list         - List all bundles
  npb-dl <bundle>  - Download a bundle
  npb-help         - Show help
  npb-wget         - Show wget examples

Quick Downloads:
  npb-ci           - CI/CD workflows
  npb-security     - Security scanning
  npb-docker       - Docker configuration
  npb-github       - All GitHub configs
  npb-templates    - All templates
  npb-complete     - Everything

Language Bundles:
  npb-node         - Node.js files
  npb-python       - Python files
  npb-go           - Go files
  npb-rust         - Rust files
  npb-ruby         - Ruby files
  npb-php          - PHP files

Advanced:
  npb-to <bundle> <dir>    - Download to specific directory
  npb-from <repo> <bundle> - Download from different repo

Examples:
  npb-ci                           # Download CI workflows
  npb-to templates ./docs          # Download templates to ./docs
  npb-from myuser/fork docker      # Download from fork
EOF
}

# Success message
echo "✓ Bundle downloader aliases loaded!"
echo "  Run 'npb-aliases-help' to see all available aliases"
