#!/bin/bash

#
# Quick Setup Script for New Project Bundle
#
# This script helps you quickly install the NPB shell functions
# and optionally download starter bundles for your project.
#
# Usage:
#   curl -sSL https://raw.githubusercontent.com/cbwinslow/new_project_bundle/main/scripts/quick-setup.sh | bash
#   
# Or download and run:
#   curl -O https://raw.githubusercontent.com/cbwinslow/new_project_bundle/main/scripts/quick-setup.sh
#   chmod +x quick-setup.sh
#   ./quick-setup.sh
#

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

print_header() {
    echo -e "\n${BOLD}${CYAN}$1${NC}\n"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Banner
print_header "╔════════════════════════════════════════╗"
echo -e "${BOLD}${CYAN}║   New Project Bundle - Quick Setup   ║${NC}"
print_header "╚════════════════════════════════════════╝"

echo "This script will help you:"
echo "  • Install NPB shell functions"
echo "  • Set up your shell configuration"
echo "  • Optionally download starter bundles"
echo ""

# Detect shell
SHELL_TYPE=""
SHELL_CONFIG=""

if [ -n "$BASH_VERSION" ]; then
    SHELL_TYPE="bash"
    SHELL_CONFIG="$HOME/.bashrc"
elif [ -n "$ZSH_VERSION" ]; then
    SHELL_TYPE="zsh"
    SHELL_CONFIG="$HOME/.zshrc"
else
    print_error "Unsupported shell. Only bash and zsh are supported."
    exit 1
fi

print_success "Detected shell: $SHELL_TYPE"
print_info "Config file: $SHELL_CONFIG"
echo ""

# Check for existing installation
if grep -q "NPB_REPO" "$SHELL_CONFIG" 2>/dev/null; then
    print_warning "NPB functions appear to be already installed"
    read -p "Reinstall? (y/N) " -n 1 -r
    echo
    if [[ ! "$REPLY" =~ ^[Yy]$ ]]; then
        print_info "Installation cancelled"
        exit 0
    fi
    echo ""
fi

# Download shell functions
print_header "Step 1: Installing Shell Functions"

FUNCTIONS_URL="https://raw.githubusercontent.com/cbwinslow/new_project_bundle/main/scripts/shell-functions.sh"
TEMP_FILE=$(mktemp)

if command -v curl &> /dev/null; then
    print_info "Downloading with curl..."
    curl -sSfL "$FUNCTIONS_URL" -o "$TEMP_FILE"
elif command -v wget &> /dev/null; then
    print_info "Downloading with wget..."
    wget -qO "$TEMP_FILE" "$FUNCTIONS_URL"
else
    print_error "Neither curl nor wget found"
    print_info "Please install curl or wget and try again"
    exit 1
fi

print_success "Downloaded shell functions"

# Backup existing config
if [ -f "$SHELL_CONFIG" ]; then
    cp "$SHELL_CONFIG" "${SHELL_CONFIG}.backup.$(date +%Y%m%d_%H%M%S)"
    print_success "Created backup: ${SHELL_CONFIG}.backup.*"
fi

# Append to shell config
echo "" >> "$SHELL_CONFIG"
echo "# New Project Bundle Functions" >> "$SHELL_CONFIG"
echo "# Installed on $(date)" >> "$SHELL_CONFIG"
cat "$TEMP_FILE" >> "$SHELL_CONFIG"
rm -f "$TEMP_FILE"

print_success "Installed to $SHELL_CONFIG"
print_info "Run: source $SHELL_CONFIG (or restart your terminal)"
echo ""

# Ask about starter bundles
print_header "Step 2: Download Starter Bundles (Optional)"

echo "Would you like to download starter bundles for a new project?"
echo ""
echo "Available options:"
echo "  1) GitHub Core (CODEOWNERS, CONTRIBUTING, SECURITY, etc.)"
echo "  2) GitHub Workflows CI/CD"
echo "  3) Docker Setup"
echo "  4) Dotfiles (.gitignore, .editorconfig, etc.)"
echo "  5) Development Rules"
echo "  6) All of the above"
echo "  7) Skip (I'll do this later)"
echo ""

read -p "Enter your choice (1-7): " choice

case $choice in
    1)
        BUNDLES=("github-core")
        ;;
    2)
        BUNDLES=("github-workflows-ci")
        ;;
    3)
        BUNDLES=("docker")
        ;;
    4)
        BUNDLES=("dotfiles")
        ;;
    5)
        BUNDLES=("all-rules")
        ;;
    6)
        BUNDLES=("github-core" "github-workflows-ci" "docker" "dotfiles" "all-rules")
        ;;
    7)
        print_info "Skipping bundle download"
        BUNDLES=()
        ;;
    *)
        print_warning "Invalid choice, skipping bundle download"
        BUNDLES=()
        ;;
esac

if [ ${#BUNDLES[@]} -gt 0 ]; then
    echo ""
    read -p "Download to current directory? (Y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Nn]$ ]]; then
        read -p "Enter output directory: " OUTPUT_DIR
    else
        OUTPUT_DIR="."
    fi
    
    print_info "Downloading bundles to: $OUTPUT_DIR"
    echo ""
    
    # Note: Functions need to be sourced in parent shell
    # User will need to run: source $SHELL_CONFIG before using npb commands
    # Or restart their terminal
    
    print_warning "Note: Shell functions will be available after reloading your shell"
    print_info "Run: source $SHELL_CONFIG"
    print_info "Or restart your terminal"
    echo ""
    
    # Download bundles using wget/curl directly
    REPO="${NPB_REPO:-cbwinslow/new_project_bundle}"
    BRANCH="${NPB_BRANCH:-main}"
    BASE_URL="https://raw.githubusercontent.com/${REPO}/${BRANCH}"
    
    for bundle in "${BUNDLES[@]}"; do
        print_info "To download $bundle, run after reloading:"
        echo "  npb-download $bundle $OUTPUT_DIR"
    done

# Installation complete
echo ""
print_header "✨ Installation Complete! ✨"

echo "Next steps:"
echo ""
echo "1. Reload your shell:"
echo "   ${BOLD}source $SHELL_CONFIG${NC}"
echo ""
echo "2. Explore available bundles:"
echo "   ${BOLD}npb-list${NC}"
echo ""
echo "3. Browse development rules:"
echo "   ${BOLD}npb-list-rules${NC}"
echo ""
echo "4. Get help:"
echo "   ${BOLD}npb-help${NC}"
echo ""
echo "Quick commands:"
echo "  ${BOLD}npb-download <bundle>${NC}       - Download a bundle"
echo "  ${BOLD}npb-download-rule <rule>${NC}    - Download a rule"
echo "  ${BOLD}npb-query <keyword>${NC}         - Search rules"
echo "  ${BOLD}npb-browse${NC}                  - Interactive browser (requires fzf)"
echo ""

print_info "For more information: https://github.com/cbwinslow/new_project_bundle"
print_info "Report issues: https://github.com/cbwinslow/new_project_bundle/issues"
echo ""

print_success "Happy coding! 🚀"
