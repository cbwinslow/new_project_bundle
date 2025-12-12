#!/bin/bash

#
# New Project Bundle - Shell Functions
# Source this file in your ~/.bashrc or ~/.zshrc for easy access to bundle functions
#
# Installation:
#   curl -sSL https://raw.githubusercontent.com/cbwinslow/new_project_bundle/main/scripts/shell-functions.sh >> ~/.bashrc
#   source ~/.bashrc
#
# Or for zsh:
#   curl -sSL https://raw.githubusercontent.com/cbwinslow/new_project_bundle/main/scripts/shell-functions.sh >> ~/.zshrc
#   source ~/.zshrc
#

# Configuration
export NPB_REPO="${NPB_REPO:-cbwinslow/new_project_bundle}"
export NPB_BRANCH="${NPB_BRANCH:-main}"
export NPB_BASE_URL="https://raw.githubusercontent.com/${NPB_REPO}/${NPB_BRANCH}"
export NPB_CACHE_DIR="${NPB_CACHE_DIR:-$HOME/.cache/npb}"
export NPB_INSTALL_DIR="${NPB_INSTALL_DIR:-$HOME/.local/share/npb}"

# Colors for output
if [ -t 1 ]; then
    NPB_RED='\033[0;31m'
    NPB_GREEN='\033[0;32m'
    NPB_YELLOW='\033[1;33m'
    NPB_BLUE='\033[0;34m'
    NPB_MAGENTA='\033[0;35m'
    NPB_CYAN='\033[0;36m'
    NPB_BOLD='\033[1m'
    NPB_NC='\033[0m'
else
    NPB_RED=''
    NPB_GREEN=''
    NPB_YELLOW=''
    NPB_BLUE=''
    NPB_MAGENTA=''
    NPB_CYAN=''
    NPB_BOLD=''
    NPB_NC=''
fi

# Helper functions
_npb_print_info() {
    echo -e "${NPB_BLUE}ℹ${NPB_NC} $1"
}

_npb_print_success() {
    echo -e "${NPB_GREEN}✓${NPB_NC} $1"
}

_npb_print_error() {
    echo -e "${NPB_RED}✗${NPB_NC} $1"
}

_npb_print_warning() {
    echo -e "${NPB_YELLOW}⚠${NPB_NC} $1"
}

_npb_print_header() {
    echo -e "\n${NPB_BOLD}${NPB_CYAN}$1${NPB_NC}\n"
}

# Download helper
_npb_download() {
    local url="$1"
    local output="$2"
    
    mkdir -p "$(dirname "$output")"
    
    if command -v curl &> /dev/null; then
        curl -sSfL "$url" -o "$output" 2>/dev/null
    elif command -v wget &> /dev/null; then
        wget -qO "$output" "$url" 2>/dev/null
    else
        _npb_print_error "Neither curl nor wget found. Please install one."
        return 1
    fi
}

# Cache management
_npb_update_cache() {
    _npb_print_info "Updating bundle cache..."
    mkdir -p "$NPB_CACHE_DIR"
    
    # Download bundles.json
    if _npb_download "${NPB_BASE_URL}/bundles.json" "$NPB_CACHE_DIR/bundles.json"; then
        _npb_print_success "Cache updated"
        return 0
    else
        _npb_print_error "Failed to update cache"
        return 1
    fi
}

_npb_ensure_cache() {
    if [ ! -f "$NPB_CACHE_DIR/bundles.json" ]; then
        _npb_update_cache
    fi
}

# List all bundles
npb-list() {
    _npb_ensure_cache || return 1
    
    _npb_print_header "📦 Available Bundles"
    
    if command -v jq &> /dev/null; then
        jq -r '.bundles | to_entries[] | "\(.key)|\(.value.name)|\(.value.description)"' \
            "$NPB_CACHE_DIR/bundles.json" | \
        awk -F'|' '{printf "  '"${NPB_GREEN}"'%-30s'"${NPB_NC}"' %s\n    %s\n\n", $1, $2, $3}'
    else
        _npb_print_warning "Install jq for better formatting"
        grep -o '"[a-z-]*"' "$NPB_CACHE_DIR/bundles.json" | head -20
    fi
}

# Download a bundle
npb-download() {
    local bundle_name="$1"
    local output_dir="${2:-.}"
    
    if [ -z "$bundle_name" ]; then
        _npb_print_error "Usage: npb-download <bundle-name> [output-dir]"
        _npb_print_info "Run 'npb-list' to see available bundles"
        return 1
    fi
    
    _npb_ensure_cache || return 1
    
    _npb_print_info "Downloading bundle: $bundle_name"
    
    if ! command -v jq &> /dev/null; then
        _npb_print_error "jq is required for downloading bundles"
        _npb_print_info "Install: brew install jq (macOS) or apt-get install jq (Linux)"
        return 1
    fi
    
    # Get files for bundle
    local files=$(jq -r ".bundles.\"$bundle_name\".files[]?" "$NPB_CACHE_DIR/bundles.json" 2>/dev/null)
    
    if [ -z "$files" ]; then
        _npb_print_error "Bundle '$bundle_name' not found"
        _npb_print_info "Run 'npb-list' to see available bundles"
        return 1
    fi
    
    local success=0
    local failed=0
    
    while IFS= read -r file; do
        if [ -n "$file" ]; then
            # Validate file path: reject absolute paths, ~, and any '..' segments
            if [[ "$file" == /* || "$file" == ~* || "$file" == *".."* ]]; then
                _npb_print_error "Skipping suspicious file path: '$file'"
                failed=$((failed + 1))
                continue
            fi
            local file_url="${NPB_BASE_URL}/${file}"
            local output_path="${output_dir}/${file}"
            
            if _npb_download "$file_url" "$output_path"; then
                _npb_print_success "$(basename "$file")"
                success=$((success + 1))
            else
                _npb_print_error "Failed: $(basename "$file")"
                failed=$((failed + 1))
            fi
        fi
    done <<< "$files"
    
    echo ""
    _npb_print_success "Downloaded: $success files, $failed failed"
}

# List all rules
npb-list-rules() {
    _npb_print_header "📋 Available Rules"
    
    local categories=("code-quality" "git-workflow" "testing" "documentation" "security" "deployment" "ai-agents")
    
    for category in "${categories[@]}"; do
        echo -e "${NPB_BOLD}${NPB_MAGENTA}${category}/${NPB_NC}"
        
        # Download rule index if available, otherwise list known rules
        local rules_url="${NPB_BASE_URL}/rules/${category}/"
        
        # List known rules for each category
        case "$category" in
            "code-quality")
                echo "  • clean-code.md - Clean code principles and guidelines"
                echo "  • error-handling.md - Error handling best practices"
                ;;
            "git-workflow")
                echo "  • commit-messages.md - Conventional commit format"
                echo "  • branch-naming.md - Branch naming conventions"
                ;;
            "security")
                echo "  • secrets-management.md - Handling sensitive information"
                ;;
            "testing")
                echo "  • test-coverage.md - Test coverage requirements"
                ;;
            "documentation")
                echo "  • api-documentation.md - API documentation standards"
                ;;
            "deployment")
                echo "  • deployment-checklist.md - Pre-deployment checklist"
                ;;
            "ai-agents")
                echo "  • context-rules.md - AI agent context and behavior guidelines"
                ;;
        esac
        echo ""
    done
    
    _npb_print_info "Download a rule: npb-download-rule <category/rule-name>"
    _npb_print_info "Example: npb-download-rule code-quality/clean-code.md"
}

# Download a specific rule
npb-download-rule() {
    local rule_path="$1"
    local output_dir="${2:-.}"
    
    if [ -z "$rule_path" ]; then
        _npb_print_error "Usage: npb-download-rule <category/rule-name> [output-dir]"
        _npb_print_info "Example: npb-download-rule code-quality/clean-code.md"
        _npb_print_info "Run 'npb-list-rules' to see available rules"
        return 1
    fi
    
    local rule_url="${NPB_BASE_URL}/rules/${rule_path}"
    local output_path="${output_dir}/$(basename "$rule_path")"
    
    _npb_print_info "Downloading rule: $rule_path"
    
    if _npb_download "$rule_url" "$output_path"; then
        _npb_print_success "Downloaded to: $output_path"
        
        # Show preview
        if command -v bat &> /dev/null; then
            bat "$output_path"
        elif command -v less &> /dev/null; then
            less "$output_path"
        else
            head -20 "$output_path"
        fi
    else
        _npb_print_error "Failed to download rule"
        return 1
    fi
}

# Query/search rules
npb-query() {
    local search_term="$1"
    
    if [ -z "$search_term" ]; then
        _npb_print_error "Usage: npb-query <search-term>"
        _npb_print_info "Example: npb-query commit"
        return 1
    fi
    
    _npb_print_header "🔍 Searching for: $search_term"
    
    # Search in rule names and descriptions
    local categories=("code-quality" "git-workflow" "testing" "documentation" "security" "deployment" "ai-agents")
    local found=0
    
    for category in "${categories[@]}"; do
        case "$category" in
            "code-quality")
                if echo "clean-code error-handling" | grep -qi "$search_term"; then
                    echo -e "${NPB_GREEN}code-quality/clean-code.md${NPB_NC}"
                    echo "  Clean code principles and guidelines"
                    found=1
                fi
                if echo "error-handling exceptions logging" | grep -qi "$search_term"; then
                    echo -e "${NPB_GREEN}code-quality/error-handling.md${NPB_NC}"
                    echo "  Error handling best practices"
                    found=1
                fi
                ;;
            "git-workflow")
                if echo "commit conventional git message" | grep -qi "$search_term"; then
                    echo -e "${NPB_GREEN}git-workflow/commit-messages.md${NPB_NC}"
                    echo "  Conventional commit message format"
                    found=1
                fi
                if echo "branch naming git workflow" | grep -qi "$search_term"; then
                    echo -e "${NPB_GREEN}git-workflow/branch-naming.md${NPB_NC}"
                    echo "  Branch naming conventions"
                    found=1
                fi
                ;;
            "security")
                if echo "secrets password api-key credentials" | grep -qi "$search_term"; then
                    echo -e "${NPB_GREEN}security/secrets-management.md${NPB_NC}"
                    echo "  Secrets and credentials management"
                    found=1
                fi
                ;;
            "testing")
                if echo "test coverage quality" | grep -qi "$search_term"; then
                    echo -e "${NPB_GREEN}testing/test-coverage.md${NPB_NC}"
                    echo "  Test coverage requirements and best practices"
                    found=1
                fi
                ;;
            "documentation")
                if echo "api documentation swagger openapi" | grep -qi "$search_term"; then
                    echo -e "${NPB_GREEN}documentation/api-documentation.md${NPB_NC}"
                    echo "  API documentation standards"
                    found=1
                fi
                ;;
            "deployment")
                if echo "deploy deployment release production" | grep -qi "$search_term"; then
                    echo -e "${NPB_GREEN}deployment/deployment-checklist.md${NPB_NC}"
                    echo "  Pre-deployment checklist"
                    found=1
                fi
                ;;
            "ai-agents")
                if echo "ai agent context behavior documentation task" | grep -qi "$search_term"; then
                    echo -e "${NPB_GREEN}ai-agents/context-rules.md${NPB_NC}"
                    echo "  AI agent context and behavior guidelines"
                    found=1
                fi
                ;;
        esac
    done
    
    if [ $found -eq 0 ]; then
        _npb_print_warning "No rules found matching '$search_term'"
        _npb_print_info "Run 'npb-list-rules' to see all available rules"
    fi
    
    echo ""
}

# Interactive browser (requires fzf)
npb-browse() {
    if ! command -v fzf &> /dev/null; then
        _npb_print_error "fzf is required for interactive browsing"
        _npb_print_info "Install: brew install fzf (macOS) or apt-get install fzf (Linux)"
        _npb_print_info "Alternatively, use 'npb-list-rules' and 'npb-download-rule'"
        return 1
    fi
    
    _npb_print_header "🔍 Interactive Rule Browser"
    _npb_print_info "Use arrow keys to navigate, Enter to download, Esc to cancel"
    echo ""
    
    local rules=(
        "code-quality/clean-code.md|Clean code principles and guidelines"
        "code-quality/error-handling.md|Error handling best practices"
        "git-workflow/commit-messages.md|Conventional commit message format"
        "git-workflow/branch-naming.md|Branch naming conventions"
        "security/secrets-management.md|Secrets and credentials management"
        "testing/test-coverage.md|Test coverage requirements"
        "documentation/api-documentation.md|API documentation standards"
        "deployment/deployment-checklist.md|Pre-deployment checklist"
        "ai-agents/context-rules.md|AI agent context and behavior guidelines"
    )
    
    local selected=$(printf '%s\n' "${rules[@]}" | \
        awk -F'|' '{printf "%-40s %s\n", $1, $2}' | \
        fzf --height 40% --reverse --border --prompt="Select rule: ")
    
    if [ -n "$selected" ]; then
        local rule_path=$(echo "$selected" | awk '{print $1}')
        npb-download-rule "$rule_path"
    fi
}

# Install NPB functions to shell profile
npb-install() {
    local shell_config=""
    
    # Detect shell
    if [ -n "$BASH_VERSION" ]; then
        shell_config="$HOME/.bashrc"
    elif [ -n "$ZSH_VERSION" ]; then
        shell_config="$HOME/.zshrc"
    else
        _npb_print_error "Unsupported shell. Only bash and zsh are supported."
        return 1
    fi
    
    _npb_print_info "Installing NPB functions to $shell_config"
    
    # Check if already installed
    if grep -q "NPB_REPO" "$shell_config" 2>/dev/null; then
        _npb_print_warning "NPB functions already installed in $shell_config"
        read -p "Reinstall? (y/N) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            return 0
        fi
    fi
    
    # Download and append
    local temp_file=$(mktemp)
    if _npb_download "${NPB_BASE_URL}/scripts/shell-functions.sh" "$temp_file"; then
        echo "" >> "$shell_config"
        echo "# New Project Bundle Functions" >> "$shell_config"
        echo "# Installed on $(date)" >> "$shell_config"
        cat "$temp_file" >> "$shell_config"
        rm -f "$temp_file"
        
        _npb_print_success "Installed successfully!"
        _npb_print_info "Run: source $shell_config"
        _npb_print_info "Or restart your shell"
    else
        _npb_print_error "Failed to download shell functions"
        rm -f "$temp_file"
        return 1
    fi
}

# Update NPB functions
npb-update() {
    _npb_print_info "Updating NPB shell functions..."
    
    # Update cache
    _npb_update_cache
    
    # Re-source this file
    local script_path="${BASH_SOURCE[0]:-${(%):-%x}}"
    if [ -f "$script_path" ]; then
        source "$script_path"
        _npb_print_success "Functions updated! Cache refreshed."
    else
        _npb_print_warning "Could not locate script file for reload"
        _npb_print_info "Consider running 'npb-install' to reinstall"
    fi
}

# Show help
npb-help() {
    cat << 'EOF'
New Project Bundle - Shell Functions
=====================================

BUNDLE COMMANDS:
  npb-list                     List all available bundles
  npb-download <bundle> [dir]  Download a bundle to directory
  npb-update                   Update NPB cache and functions

RULE COMMANDS:
  npb-list-rules               List all available rules
  npb-download-rule <path>     Download a specific rule
  npb-query <term>             Search for rules by keyword
  npb-browse                   Interactive rule browser (requires fzf)

SETUP COMMANDS:
  npb-install                  Install NPB functions to shell profile
  npb-help                     Show this help message

EXAMPLES:
  # List all bundles
  npb-list

  # Download GitHub workflows
  npb-download github-workflows-ci

  # List all rules
  npb-list-rules

  # Download a specific rule
  npb-download-rule code-quality/clean-code.md

  # Search for rules about commits
  npb-query commit

  # Browse rules interactively
  npb-browse

CONFIGURATION:
  Set these environment variables to customize behavior:

  NPB_REPO=owner/repo          Repository to use (default: cbwinslow/new_project_bundle)
  NPB_BRANCH=branch            Branch to use (default: main)
  NPB_CACHE_DIR=path           Cache directory (default: ~/.cache/npb)

For more information, visit:
  https://github.com/cbwinslow/new_project_bundle

EOF
}

# Create aliases for common operations
alias npb='npb-help'
alias npb-ls='npb-list'
alias npb-dl='npb-download'
alias npb-rules='npb-list-rules'
alias npb-search='npb-query'

# Auto-completion for bash
if [ -n "$BASH_VERSION" ]; then
    _npb_complete() {
        local cur="${COMP_WORDS[COMP_CWORD]}"
        local commands="list download update list-rules download-rule query browse install help"
        COMPREPLY=($(compgen -W "$commands" -- "$cur"))
    }
    complete -F _npb_complete npb-list npb-download npb-list-rules npb-download-rule npb-query npb-browse npb-install npb-help
fi

# Initialize
_npb_print_info "New Project Bundle functions loaded. Type 'npb-help' for usage."
