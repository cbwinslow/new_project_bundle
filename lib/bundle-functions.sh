#!/bin/bash

#
# New Project Bundle - Shell Functions Library
#
# Core functions for bundle management, downloading, and querying
# Source this file in your .bashrc or .zshrc to enable NPB commands
#
# Usage:
#   source ~/.local/lib/bundle-functions.sh
#   npb_list_bundles
#   npb_download_bundle github-workflows-ci
#

# Configuration
NPB_REPO="${NPB_REPO:-cbwinslow/new_project_bundle}"
NPB_BRANCH="${NPB_BRANCH:-main}"
NPB_BASE_URL="https://raw.githubusercontent.com/${NPB_REPO}/${NPB_BRANCH}"
NPB_MANIFEST_URL="${NPB_BASE_URL}/bundles.json"
NPB_CACHE_DIR="${NPB_CACHE_DIR:-$HOME/.cache/npb}"
NPB_DATA_DIR="${NPB_DATA_DIR:-$HOME/.local/share/npb}"

# Colors for output
NPB_COLOR_RED='\033[0;31m'
NPB_COLOR_GREEN='\033[0;32m'
NPB_COLOR_YELLOW='\033[1;33m'
NPB_COLOR_BLUE='\033[0;34m'
NPB_COLOR_CYAN='\033[0;36m'
NPB_COLOR_BOLD='\033[1m'
NPB_COLOR_NC='\033[0m'

# Print helpers
npb_info() {
    echo -e "${NPB_COLOR_BLUE}ℹ${NPB_COLOR_NC} $1"
}

npb_success() {
    echo -e "${NPB_COLOR_GREEN}✓${NPB_COLOR_NC} $1"
}

npb_error() {
    echo -e "${NPB_COLOR_RED}✗${NPB_COLOR_NC} $1" >&2
}

npb_warning() {
    echo -e "${NPB_COLOR_YELLOW}⚠${NPB_COLOR_NC} $1"
}

npb_header() {
    echo -e "${NPB_COLOR_BOLD}${NPB_COLOR_CYAN}$1${NPB_COLOR_NC}"
}

# Ensure cache directory exists
_npb_ensure_cache() {
    mkdir -p "$NPB_CACHE_DIR"
}

# Download the bundle manifest
_npb_fetch_manifest() {
    _npb_ensure_cache
    local manifest_file="$NPB_CACHE_DIR/bundles.json"
    local manifest_age=3600  # 1 hour cache
    
    # Check if manifest exists and is recent
    if [ -f "$manifest_file" ]; then
        local file_age=$(($(date +%s) - $(date -r "$manifest_file" +%s 2>/dev/null || stat -f %m "$manifest_file" 2>/dev/null || echo 0)))
        if [ "$file_age" -lt "$manifest_age" ]; then
            echo "$manifest_file"
            return 0
        fi
    fi
    
    # Download fresh manifest
    if command -v curl &>/dev/null; then
        curl -sSL -o "$manifest_file" "$NPB_MANIFEST_URL" 2>/dev/null
    elif command -v wget &>/dev/null; then
        wget -qO "$manifest_file" "$NPB_MANIFEST_URL" 2>/dev/null
    else
        npb_error "Neither curl nor wget found. Please install one."
        return 1
    fi
    
    if [ $? -eq 0 ]; then
        echo "$manifest_file"
        return 0
    else
        npb_error "Failed to fetch bundle manifest"
        return 1
    fi
}

# Check for jq availability
_npb_has_jq() {
    command -v jq &>/dev/null
}

# List all available bundles
npb_list_bundles() {
    local manifest=$(_npb_fetch_manifest) || return 1
    
    npb_header "\n📦 Available Bundles\n"
    
    if _npb_has_jq; then
        jq -r '.bundles | to_entries[] | 
            "\u001b[1;36m\(.key)\u001b[0m\n  \u001b[1m\(.value.name)\u001b[0m\n  \(.value.description)\n"' \
            "$manifest"
    else
        npb_warning "Install jq for better formatting: brew install jq / apt install jq\n"
        grep -o '"[a-z0-9-]*"' "$manifest" | head -20 | tr -d '"'
    fi
}

# Search bundles by keyword
npb_search_bundles() {
    local keyword="$1"
    
    if [ -z "$keyword" ]; then
        npb_error "Usage: npb_search_bundles <keyword>"
        return 1
    fi
    
    local manifest=$(_npb_fetch_manifest) || return 1
    
    npb_header "\n🔍 Searching for: $keyword\n"
    
    if _npb_has_jq; then
        jq -r --arg keyword "$keyword" '.bundles | to_entries[] | 
            select(
                (.key | ascii_downcase | contains($keyword | ascii_downcase)) or 
                ((.value.name // "") | ascii_downcase | contains($keyword | ascii_downcase)) or 
                ((.value.description // "") | ascii_downcase | contains($keyword | ascii_downcase))
            ) | 
            "\u001b[1;36m\(.key)\u001b[0m\n  \u001b[1m\(.value.name // "No name")\u001b[0m\n  \((.value.description // "No description"))\n"' \
            "$manifest"
    else
        grep -i "$keyword" "$manifest" | head -20
    fi
}

# Show detailed info about a bundle
npb_info_bundle() {
    local bundle_name="$1"
    
    if [ -z "$bundle_name" ]; then
        npb_error "Usage: npb_info_bundle <bundle-name>"
        return 1
    fi
    
    local manifest=$(_npb_fetch_manifest) || return 1
    
    if ! _npb_has_jq; then
        npb_warning "jq is required for this function. Install with: brew install jq / apt install jq"
        return 1
    fi
    
    npb_header "\n📋 Bundle Information: $bundle_name\n"
    
    jq -r --arg bundle "$bundle_name" '
        .bundles[$bundle] | 
        if . then
            "Name: \(.name)\n" +
            "Description: \(.description)\n\n" +
            (if .files then
                "Files (\(.files | length)):\n" +
                (.files[] | "  • \(.)\n") +
                "\n"
            else "" end) +
            (if .includes then
                "Includes (\(.includes | length) bundles):\n" +
                (.includes[] | "  • \(.)\n")
            else "" end)
        else
            "\u001b[0;31m✗\u001b[0m Bundle not found: " + $bundle
        end
    ' "$manifest"
}

# Download a file from the repository
_npb_download_file() {
    local file_path="$1"
    local output_path="$2"
    local file_url="${NPB_BASE_URL}/${file_path}"
    
    mkdir -p "$(dirname "$output_path")"
    
    if command -v curl &>/dev/null; then
        curl -sSL -o "$output_path" "$file_url" 2>/dev/null
    elif command -v wget &>/dev/null; then
        wget -qO "$output_path" "$file_url" 2>/dev/null
    else
        return 1
    fi
}

# Download a bundle
npb_download_bundle() {
    local bundle_name="$1"
    local output_dir="${2:-.}"
    
    if [ -z "$bundle_name" ]; then
        npb_error "Usage: npb_download_bundle <bundle-name> [output-dir]"
        return 1
    fi
    
    local manifest=$(_npb_fetch_manifest) || return 1
    
    if ! _npb_has_jq; then
        npb_error "jq is required for downloading. Install with: brew install jq / apt install jq"
        return 1
    fi
    
    # Get bundle info
    local bundle_exists=$(jq -r --arg b "$bundle_name" '.bundles[$b] != null' "$manifest")
    if [ "$bundle_exists" != "true" ]; then
        npb_error "Bundle '$bundle_name' not found"
        npb_info "Use 'npb_list_bundles' to see available bundles"
        return 1
    fi
    
    local bundle_name_display=$(jq -r --arg b "$bundle_name" '.bundles[$b].name' "$manifest")
    local bundle_desc=$(jq -r --arg b "$bundle_name" '.bundles[$b].description' "$manifest")
    
    npb_header "\n📦 Downloading: $bundle_name_display"
    echo "   $bundle_desc"
    echo "   Output: $output_dir"
    echo ""
    
    # Get all files (handling includes recursively)
    local files=$(jq -r --arg b "$bundle_name" '
        def resolve_bundle($name; $seen):
            if ($seen | index($name)) then
                []
            else
                .bundles[$name] |
                if .files then .files else [] end +
                if .includes then
                    ([.includes[] | resolve_bundle(.; $seen + [$name])] | add)
                else [] end
            end;
        resolve_bundle($b; []) | unique | .[]
    ' "$manifest")
    
    if [ -z "$files" ]; then
        npb_error "No files found in bundle"
        return 1
    fi
    
    local total=$(echo "$files" | wc -l | tr -d ' ')
    local current=0
    local success=0
    local failed=0
    
    npb_info "Downloading $total files...\n"
    
    while IFS= read -r file; do
        if [ -n "$file" ]; then
            current=$((current + 1))
            local output_path="${output_dir}/${file}"
            
            printf "  [%3d/%3d] " "$current" "$total"
            
            if _npb_download_file "$file" "$output_path"; then
                npb_success "$(basename "$file")"
                success=$((success + 1))
            else
                npb_error "Failed: $file"
                failed=$((failed + 1))
            fi
        fi
    done <<< "$files"
    
    echo ""
    if [ $failed -eq 0 ]; then
        npb_success "Download complete! $success files downloaded to $output_dir"
    else
        npb_warning "Download complete with errors: $success succeeded, $failed failed"
    fi
}

# Quick download - downloads to current directory
npb_get() {
    npb_download_bundle "$1" "."
}

# Refresh the cached manifest
npb_refresh() {
    npb_info "Refreshing bundle manifest..."
    rm -f "$NPB_CACHE_DIR/bundles.json"
    _npb_fetch_manifest >/dev/null
    npb_success "Manifest refreshed"
}

# Show NPB version and status
npb_version() {
    local manifest=$(_npb_fetch_manifest) || return 1
    
    if _npb_has_jq; then
        local version=$(jq -r '.version' "$manifest")
        echo "New Project Bundle v${version}"
    else
        echo "New Project Bundle"
    fi
    
    echo "Repository: $NPB_REPO"
    echo "Branch: $NPB_BRANCH"
    echo "Cache: $NPB_CACHE_DIR"
    
    if _npb_has_jq; then
        echo "jq: ✓ installed"
    else
        echo "jq: ✗ not installed (install for full features)"
    fi
}

# Help function
npb_help() {
    cat << 'EOF'
New Project Bundle - Shell Functions

BUNDLE MANAGEMENT:
  npb_list_bundles              List all available bundles
  npb_search_bundles <keyword>  Search bundles by keyword
  npb_info_bundle <name>        Show detailed bundle information
  npb_download_bundle <name> [dir]  Download a bundle
  npb_get <name>                Quick download to current directory

UTILITY:
  npb_refresh                   Refresh cached bundle manifest
  npb_version                   Show NPB version and status
  npb_help                      Show this help message

EXAMPLES:
  npb_list_bundles
  npb_search_bundles github
  npb_info_bundle github-workflows-ci
  npb_download_bundle docker ./my-project
  npb_get all-templates

CONFIGURATION:
  NPB_REPO      Repository (default: cbwinslow/new_project_bundle)
  NPB_BRANCH    Branch (default: main)
  NPB_CACHE_DIR Cache directory (default: ~/.cache/npb)

For more information, visit:
  https://github.com/cbwinslow/new_project_bundle

EOF
}

# Aliases for convenience
alias npb-list='npb_list_bundles'
alias npb-search='npb_search_bundles'
alias npb-info='npb_info_bundle'
alias npb-get='npb_get'
alias npb-dl='npb_download_bundle'
alias npb-help='npb_help'

# Export functions
export -f npb_list_bundles 2>/dev/null || true
export -f npb_search_bundles 2>/dev/null || true
export -f npb_info_bundle 2>/dev/null || true
export -f npb_download_bundle 2>/dev/null || true
export -f npb_get 2>/dev/null || true
export -f npb_refresh 2>/dev/null || true
export -f npb_version 2>/dev/null || true
export -f npb_help 2>/dev/null || true
