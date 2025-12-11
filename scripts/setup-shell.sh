#!/bin/bash

#
# New Project Bundle - Shell Setup Script
#
# One-command setup for NPB shell functions
#
# Usage:
#   curl -sSL https://raw.githubusercontent.com/cbwinslow/new_project_bundle/main/scripts/setup-shell.sh | bash
#   wget -qO- https://raw.githubusercontent.com/cbwinslow/new_project_bundle/main/scripts/setup-shell.sh | bash
#
#   Or download and run:
#   ./setup-shell.sh
#

set -e

REPO="${NPB_REPO:-cbwinslow/new_project_bundle}"
BRANCH="${NPB_BRANCH:-main}"
INSTALL_DIR="${NPB_INSTALL_DIR:-$HOME/.local/lib}"
BASE_URL="https://raw.githubusercontent.com/${REPO}/${BRANCH}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

print_header() {
    echo -e "${BOLD}${CYAN}$1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1" >&2
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Detect shell
detect_shell() {
    local shell_name=$(basename "$SHELL")
    echo "$shell_name"
}

# Get profile file
get_profile_file() {
    local shell_name=$(detect_shell)
    
    case "$shell_name" in
        bash)
            if [ -f "$HOME/.bashrc" ]; then
                echo "$HOME/.bashrc"
            elif [ -f "$HOME/.bash_profile" ]; then
                echo "$HOME/.bash_profile"
            else
                echo "$HOME/.bashrc"
            fi
            ;;
        zsh)
            echo "$HOME/.zshrc"
            ;;
        fish)
            echo "$HOME/.config/fish/config.fish"
            ;;
        *)
            echo "$HOME/.profile"
            ;;
    esac
}

# Download a file
download_file() {
    local url="$1"
    local output="$2"
    
    mkdir -p "$(dirname "$output")"
    
    if command -v curl &>/dev/null; then
        curl -sSL -o "$output" "$url"
    elif command -v wget &>/dev/null; then
        wget -qO "$output" "$url"
    else
        print_error "Neither curl nor wget found. Please install one."
        return 1
    fi
}

# Main setup
main() {
    clear
    echo ""
    print_header "╔══════════════════════════════════════════════════════════════╗"
    print_header "║     New Project Bundle - Shell Functions Setup              ║"
    print_header "╚══════════════════════════════════════════════════════════════╝"
    echo ""
    
    local shell_name=$(detect_shell)
    local profile_file=$(get_profile_file)
    
    print_info "Detected shell: ${BOLD}$shell_name${NC}"
    print_info "Profile file: ${BOLD}$profile_file${NC}"
    print_info "Install directory: ${BOLD}$INSTALL_DIR${NC}"
    echo ""
    
    # Check for existing installation
    if [ -f "$INSTALL_DIR/bundle-functions.sh" ]; then
        print_warning "NPB functions already installed in $INSTALL_DIR"
        read -p "Do you want to update? (y/N) " -n 1 -r
        echo ""
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_info "Setup cancelled"
            exit 0
        fi
    fi
    
    # Create install directory
    print_info "Creating install directory..."
    mkdir -p "$INSTALL_DIR"
    print_success "Directory created"
    
    # Download shell function libraries
    echo ""
    print_header "📥 Downloading NPB shell libraries..."
    echo ""
    
    local files=(
        "bundle-functions.sh"
        "profile-integration.sh"
        "tui-browser.sh"
        "rule-manager.sh"
    )
    
    for file in "${files[@]}"; do
        print_info "Downloading $file..."
        if download_file "${BASE_URL}/lib/${file}" "$INSTALL_DIR/$file"; then
            chmod +x "$INSTALL_DIR/$file"
            print_success "$file installed"
        else
            print_error "Failed to download $file"
            exit 1
        fi
    done
    
    echo ""
    print_header "⚙️  Configuring shell profile..."
    echo ""
    
    # Check if already integrated
    local marker_start="# >>> New Project Bundle >>>"
    local marker_end="# <<< New Project Bundle <<<"
    
    if [ -f "$profile_file" ] && grep -q "$marker_start" "$profile_file"; then
        print_info "Removing old NPB integration..."
        awk "/$marker_start/,/$marker_end/ {next} {print}" "$profile_file" > "${profile_file}.tmp"
        mv "${profile_file}.tmp" "$profile_file"
        print_success "Old integration removed"
    fi
    
    # Add NPB integration
    print_info "Adding NPB integration to $profile_file..."
    
    cat >> "$profile_file" << EOF

$marker_start
# New Project Bundle - Shell Functions
# Installed on $(date)
# Repository: $REPO ($BRANCH)

# Load NPB functions
if [ -f "$INSTALL_DIR/bundle-functions.sh" ]; then
    source "$INSTALL_DIR/bundle-functions.sh"
fi

if [ -f "$INSTALL_DIR/tui-browser.sh" ]; then
    source "$INSTALL_DIR/tui-browser.sh"
fi

if [ -f "$INSTALL_DIR/rule-manager.sh" ]; then
    source "$INSTALL_DIR/rule-manager.sh"
fi

# Useful aliases
alias npb='npb_list_bundles'
alias npb-browse='npb_browse_bundles'
alias npb-search='npb_search_bundles'
alias npb-get='npb_get'
alias npb-dl='npb_download_bundle'

# Rule management
alias npb-rules='npb_list_rules'
alias npb-rules-search='npb_search_rules'
alias npb-rules-browse='npb_browse_rules'

$marker_end
EOF
    
    print_success "NPB integration added"
    
    # Success message
    echo ""
    print_header "╔══════════════════════════════════════════════════════════════╗"
    print_header "║                  Installation Complete! ✓                   ║"
    print_header "╚══════════════════════════════════════════════════════════════╝"
    echo ""
    
    print_success "NPB shell functions installed successfully!"
    echo ""
    
    print_info "To activate immediately, run:"
    echo ""
    echo "  ${BOLD}source $profile_file${NC}"
    echo ""
    print_info "Or restart your terminal"
    echo ""
    
    print_header "🚀 Quick Start Commands:"
    echo ""
    echo "  ${BOLD}npb${NC}                    - List all available bundles"
    echo "  ${BOLD}npb-browse${NC}             - Interactive bundle browser"
    echo "  ${BOLD}npb-get <bundle>${NC}       - Download a bundle to current directory"
    echo "  ${BOLD}npb-search <keyword>${NC}   - Search for bundles"
    echo "  ${BOLD}npb-rules${NC}              - List development rules"
    echo "  ${BOLD}npb-rules-browse${NC}       - Browse and download rules"
    echo "  ${BOLD}npb_help${NC}               - Show all available commands"
    echo ""
    
    print_header "📚 Examples:"
    echo ""
    echo "  ${BOLD}npb-get github-workflows-ci${NC}"
    echo "  ${BOLD}npb-search docker${NC}"
    echo "  ${BOLD}npb_download_bundle all-templates ./docs${NC}"
    echo ""
    
    # Check for jq
    if ! command -v jq &>/dev/null; then
        print_warning "jq is not installed"
        echo ""
        print_info "Some features require jq. Install with:"
        echo "  • Ubuntu/Debian: ${BOLD}sudo apt install jq${NC}"
        echo "  • macOS: ${BOLD}brew install jq${NC}"
        echo "  • RHEL/CentOS: ${BOLD}sudo yum install jq${NC}"
        echo ""
    fi
    
    print_info "For more information, visit:"
    echo "  https://github.com/${REPO}"
    echo ""
    
    print_success "Happy coding! 🎉"
    echo ""
}

# Run main function
main "$@"
