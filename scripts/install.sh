#!/bin/bash

#
# Quick Install Script for Bundle Downloader
# 
# Usage:
#   curl -sSL https://raw.githubusercontent.com/cbwinslow/new_project_bundle/main/scripts/install.sh | bash
#   wget -qO- https://raw.githubusercontent.com/cbwinslow/new_project_bundle/main/scripts/install.sh | bash
#

set -e

REPO="${NPB_REPO:-cbwinslow/new_project_bundle}"
BRANCH="${NPB_BRANCH:-main}"
INSTALL_DIR="${NPB_INSTALL_DIR:-$HOME/.local/bin}"
SCRIPT_URL="https://raw.githubusercontent.com/${REPO}/${BRANCH}/scripts/download-bundle.sh"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

echo ""
print_info "Installing Bundle Downloader from $REPO ($BRANCH)"
echo ""

# Create install directory if it doesn't exist
if [ ! -d "$INSTALL_DIR" ]; then
    print_info "Creating install directory: $INSTALL_DIR"
    mkdir -p "$INSTALL_DIR"
fi

# Download the script
print_info "Downloading bundle-downloader script..."
if command -v curl &> /dev/null; then
    curl -sSL -o "$INSTALL_DIR/bundle-downloader" "$SCRIPT_URL"
elif command -v wget &> /dev/null; then
    wget -qO "$INSTALL_DIR/bundle-downloader" "$SCRIPT_URL"
else
    print_error "Neither curl nor wget found. Please install one of them."
    exit 1
fi

# Make it executable
chmod +x "$INSTALL_DIR/bundle-downloader"

print_success "Installed to: $INSTALL_DIR/bundle-downloader"

# Check if it's in PATH
if echo "$PATH" | grep -q "$INSTALL_DIR"; then
    print_success "Installation complete! You can now run: bundle-downloader"
else
    print_warning "Note: $INSTALL_DIR is not in your PATH"
    print_info "Add this line to your ~/.bashrc or ~/.zshrc:"
    echo ""
    echo "  export PATH=\"$INSTALL_DIR:\$PATH\""
    echo ""
    print_info "Or run directly with: $INSTALL_DIR/bundle-downloader"
fi

echo ""
print_info "Quick start:"
echo "  bundle-downloader list        # List all bundles"
echo "  bundle-downloader <bundle>    # Download a bundle"
echo "  bundle-downloader help        # Show help"
echo ""

# Test the installation
if [ -x "$INSTALL_DIR/bundle-downloader" ]; then
    print_success "Installation verified!"
else
    print_error "Installation verification failed"
    exit 1
fi
