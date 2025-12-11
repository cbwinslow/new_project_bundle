#!/bin/bash

#
# New Project Bundle - Profile Integration
#
# Functions to add NPB functionality to your shell profile
#

# Colors
PI_COLOR_GREEN='\033[0;32m'
PI_COLOR_BLUE='\033[0;34m'
PI_COLOR_YELLOW='\033[1;33m'
PI_COLOR_NC='\033[0m'

pi_info() { echo -e "${PI_COLOR_BLUE}ℹ${PI_COLOR_NC} $1"; }
pi_success() { echo -e "${PI_COLOR_GREEN}✓${PI_COLOR_NC} $1"; }
pi_warning() { echo -e "${PI_COLOR_YELLOW}⚠${PI_COLOR_NC} $1"; }

# Detect the user's shell
_npb_detect_shell() {
    local shell_name=$(basename "$SHELL")
    echo "$shell_name"
}

# Get the appropriate profile file
_npb_get_profile_file() {
    local shell_name=$(_npb_detect_shell)
    
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

# Check if NPB is already integrated
_npb_is_integrated() {
    local profile_file=$(_npb_get_profile_file)
    
    if [ -f "$profile_file" ]; then
        grep -q "bundle-functions.sh" "$profile_file" 2>/dev/null
        return $?
    fi
    
    return 1
}

# Add NPB functions to shell profile
npb_setup_profile() {
    local install_dir="${1:-$HOME/.local/lib}"
    local profile_file=$(_npb_get_profile_file)
    local shell_name=$(_npb_detect_shell)
    
    pi_info "Setting up New Project Bundle for $shell_name"
    pi_info "Profile file: $profile_file"
    echo ""
    
    # Check if already integrated
    if _npb_is_integrated; then
        pi_warning "NPB is already integrated in your profile"
        read -p "Do you want to update it? (y/N) " -n 1 -r
        echo ""
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            pi_info "Setup cancelled"
            return 0
        fi
    fi
    
    # Download bundle-functions.sh to install directory
    mkdir -p "$install_dir"
    local functions_file="$install_dir/bundle-functions.sh"
    
    pi_info "Downloading bundle-functions.sh..."
    
    local repo="${NPB_REPO:-cbwinslow/new_project_bundle}"
    local branch="${NPB_BRANCH:-main}"
    local url="https://raw.githubusercontent.com/$repo/$branch/lib/bundle-functions.sh"
    
    if command -v curl &>/dev/null; then
        curl -sSL -o "$functions_file" "$url"
    elif command -v wget &>/dev/null; then
        wget -qO "$functions_file" "$url"
    else
        pi_error "Neither curl nor wget found"
        return 1
    fi
    
    if [ ! -f "$functions_file" ]; then
        pi_error "Failed to download bundle-functions.sh"
        return 1
    fi
    
    pi_success "Downloaded to $functions_file"
    
    # Add source command to profile
    local source_line="source \"$functions_file\""
    local marker_start="# >>> New Project Bundle >>>"
    local marker_end="# <<< New Project Bundle <<<"
    
    # Remove old integration if exists
    if [ -f "$profile_file" ] && grep -q "$marker_start" "$profile_file"; then
        pi_info "Removing old integration..."
        # Create temp file without NPB section
        awk "/$marker_start/,/$marker_end/ {next} {print}" "$profile_file" > "${profile_file}.tmp"
        mv "${profile_file}.tmp" "$profile_file"
    fi
    
    # Add new integration
    cat >> "$profile_file" << EOF

$marker_start
# New Project Bundle - Shell Functions
# Added on $(date)
$source_line
$marker_end
EOF
    
    pi_success "Added NPB integration to $profile_file"
    echo ""
    pi_info "To activate immediately, run:"
    echo "  source $profile_file"
    echo ""
    pi_info "Or restart your terminal"
    echo ""
    pi_info "Quick start:"
    echo "  npb_list_bundles      - List all bundles"
    echo "  npb_help              - Show all commands"
}

# Setup for bash specifically
npb_setup_bash() {
    local install_dir="${1:-$HOME/.local/lib}"
    SHELL=/bin/bash npb_setup_profile "$install_dir"
}

# Setup for zsh specifically
npb_setup_zsh() {
    local install_dir="${1:-$HOME/.local/lib}"
    SHELL=/bin/zsh npb_setup_profile "$install_dir"
}

# Generate useful aliases
npb_generate_aliases() {
    cat << 'EOF'
# New Project Bundle - Useful Aliases
# Add these to your shell profile (~/.bashrc or ~/.zshrc)

# Quick bundle listing and search
alias npb='npb_list_bundles'
alias npbs='npb_search_bundles'
alias npbi='npb_info_bundle'

# Quick downloads
alias npb-get='npb_get'
alias npb-dl='npb_download_bundle'

# Common bundles
alias npb-github='npb_get all-github'
alias npb-docker='npb_get docker'
alias npb-workflows='npb_get github-workflows-ci'
alias npb-templates='npb_get all-templates'

# Setup new project
alias npb-init='npb_get complete'

# Refresh and help
alias npb-refresh='npb_refresh'
alias npb-help='npb_help'
alias npb-version='npb_version'

EOF
}

# Auto-detect shell and update profile
npb_update_profile() {
    local install_dir="${1:-$HOME/.local/lib}"
    local shell_name=$(_npb_detect_shell)
    
    echo "Detected shell: $shell_name"
    echo ""
    
    case "$shell_name" in
        bash)
            npb_setup_bash "$install_dir"
            ;;
        zsh)
            npb_setup_zsh "$install_dir"
            ;;
        *)
            pi_warning "Unsupported shell: $shell_name"
            pi_info "Manual setup required. Use: npb_setup_profile"
            return 1
            ;;
    esac
}

# Remove NPB integration from profile
npb_remove_integration() {
    local profile_file=$(_npb_get_profile_file)
    local marker_start="# >>> New Project Bundle >>>"
    local marker_end="# <<< New Project Bundle <<<"
    
    if [ ! -f "$profile_file" ]; then
        pi_warning "Profile file not found: $profile_file"
        return 1
    fi
    
    if ! grep -q "$marker_start" "$profile_file"; then
        pi_warning "NPB integration not found in $profile_file"
        return 0
    fi
    
    pi_info "Removing NPB integration from $profile_file..."
    
    # Create temp file without NPB section
    awk "/$marker_start/,/$marker_end/ {next} {print}" "$profile_file" > "${profile_file}.tmp"
    mv "${profile_file}.tmp" "$profile_file"
    
    pi_success "NPB integration removed"
    pi_info "Restart your terminal or run: source $profile_file"
}

# Show integration status
npb_status() {
    local profile_file=$(_npb_get_profile_file)
    local shell_name=$(_npb_detect_shell)
    
    echo "Shell: $shell_name"
    echo "Profile: $profile_file"
    echo ""
    
    if _npb_is_integrated; then
        pi_success "NPB is integrated in your profile"
        
        # Show which functions are available
        if command -v npb_list_bundles &>/dev/null; then
            pi_success "NPB functions are loaded"
        else
            pi_warning "NPB functions not loaded (restart terminal or source profile)"
        fi
    else
        pi_warning "NPB is not integrated"
        echo ""
        pi_info "Run 'npb_update_profile' to integrate NPB into your shell"
    fi
}

# Export functions
export -f npb_setup_profile 2>/dev/null || true
export -f npb_setup_bash 2>/dev/null || true
export -f npb_setup_zsh 2>/dev/null || true
export -f npb_generate_aliases 2>/dev/null || true
export -f npb_update_profile 2>/dev/null || true
export -f npb_remove_integration 2>/dev/null || true
export -f npb_status 2>/dev/null || true
