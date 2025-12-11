#!/bin/bash

#
# New Project Bundle - Uninstall Script
#
# Removes NPB shell functions and integration
#
# Usage:
#   ./uninstall.sh
#   curl -sSL https://raw.githubusercontent.com/cbwinslow/new_project_bundle/main/scripts/uninstall.sh | bash
#

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m'

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

print_header() {
    echo -e "${BOLD}$1${NC}"
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

# Remove NPB from profile
remove_from_profile() {
    local profile_file="$1"
    local marker_start="# >>> New Project Bundle >>>"
    local marker_end="# <<< New Project Bundle <<<"
    
    if [ ! -f "$profile_file" ]; then
        print_warning "Profile file not found: $profile_file"
        return 1
    fi
    
    if ! grep -q "$marker_start" "$profile_file"; then
        print_warning "NPB integration not found in $profile_file"
        return 0
    fi
    
    print_info "Removing NPB integration from $profile_file..."
    
    # Create backup
    cp "$profile_file" "${profile_file}.bak.$(date +%Y%m%d_%H%M%S)"
    print_info "Backup created: ${profile_file}.bak.*"
    
    # Remove NPB section
    awk "/$marker_start/,/$marker_end/ {next} {print}" "$profile_file" > "${profile_file}.tmp"
    mv "${profile_file}.tmp" "$profile_file"
    
    print_success "NPB integration removed from $profile_file"
}

# Main uninstall
main() {
    echo ""
    print_header "New Project Bundle - Uninstall"
    echo ""
    
    local profile_file=$(get_profile_file)
    local install_dir="${NPB_INSTALL_DIR:-$HOME/.local/lib}"
    local cache_dir="${NPB_CACHE_DIR:-$HOME/.cache/npb}"
    local data_dir="${NPB_DATA_DIR:-$HOME/.local/share/npb}"
    
    print_warning "This will remove NPB shell functions and integration"
    echo ""
    echo "  Profile: $profile_file"
    echo "  Install: $install_dir"
    echo "  Cache:   $cache_dir"
    echo "  Data:    $data_dir"
    echo ""
    
    read -p "Continue with uninstall? (y/N) " -n 1 -r
    echo ""
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_info "Uninstall cancelled"
        exit 0
    fi
    
    echo ""
    print_header "Removing NPB..."
    echo ""
    
    # Remove from profile
    remove_from_profile "$profile_file"
    
    # Remove installed files
    if [ -d "$install_dir" ]; then
        print_info "Removing shell function libraries from $install_dir..."
        
        local files=(
            "$install_dir/bundle-functions.sh"
            "$install_dir/profile-integration.sh"
            "$install_dir/tui-browser.sh"
            "$install_dir/rule-manager.sh"
        )
        
        for file in "${files[@]}"; do
            if [ -f "$file" ]; then
                rm -f "$file"
                print_success "Removed $(basename "$file")"
            fi
        done
    fi
    
    # Remove cache
    read -p "Remove cache directory? ($cache_dir) (y/N) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if [ -d "$cache_dir" ]; then
            rm -rf "$cache_dir"
            print_success "Cache removed"
        fi
    fi
    
    # Remove data/installed rules
    read -p "Remove installed rules? ($data_dir) (y/N) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if [ -d "$data_dir" ]; then
            rm -rf "$data_dir"
            print_success "Installed rules removed"
        fi
    fi
    
    echo ""
    print_header "Uninstall Complete"
    echo ""
    print_success "NPB has been uninstalled"
    echo ""
    print_info "To complete removal:"
    echo "  1. Restart your terminal or run: source $profile_file"
    echo "  2. Check for any remaining NPB aliases or functions"
    echo ""
    print_info "You can reinstall anytime with:"
    echo "  curl -sSL https://raw.githubusercontent.com/cbwinslow/new_project_bundle/main/scripts/setup-shell.sh | bash"
    echo ""
    
    print_success "Thank you for using New Project Bundle! 👋"
    echo ""
}

# Run main
main "$@"
