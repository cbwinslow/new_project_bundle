#!/bin/bash

#
# Download Bundle Script
# Quick wget-like utility for downloading bundles from new_project_bundle
#
# Usage:
#   ./download-bundle.sh <bundle-name> [output-dir]
#   ./download-bundle.sh github-workflows-ci
#   ./download-bundle.sh all-templates ./my-project
#

set -e

REPO="${NPB_REPO:-cbwinslow/new_project_bundle}"
BRANCH="${NPB_BRANCH:-main}"
BASE_URL="https://raw.githubusercontent.com/${REPO}/${BRANCH}"
MANIFEST_URL="${BASE_URL}/bundles.json"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored message
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

# Check if wget or curl is available
if command -v wget &> /dev/null; then
    DOWNLOADER="wget -q -O"
elif command -v curl &> /dev/null; then
    DOWNLOADER="curl -sS -o"
else
    print_error "Neither wget nor curl is available. Please install one of them."
    exit 1
fi

# Function to download a file
download_file() {
    local url="$1"
    local output="$2"
    local filename=$(basename "$output")
    
    # Create directory if it doesn't exist
    mkdir -p "$(dirname "$output")"
    
    if command -v wget &> /dev/null; then
        if wget -q -O "$output" "$url" 2>/dev/null; then
            print_success "$filename"
            return 0
        else
            print_error "Failed to download $filename"
            return 1
        fi
    else
        if curl -sS -o "$output" "$url" 2>/dev/null; then
            print_success "$filename"
            return 0
        else
            print_error "Failed to download $filename"
            return 1
        fi
    fi
}

# Function to parse JSON (simple jq alternative for basic cases)
parse_bundle_json() {
    local bundle_key="$1"
    local manifest_file="$2"
    
    # Extract files array for the bundle (this is a simplified approach)
    # In production, you'd want to use jq or a proper JSON parser
    
    if command -v jq &> /dev/null; then
        jq -r ".bundles.\"$bundle_key\".files[]?" "$manifest_file" 2>/dev/null
    else
        # Fallback: basic grep-based extraction (limited)
        print_warning "jq not found. Using basic parsing (may be incomplete)."
        grep -A 100 "\"$bundle_key\"" "$manifest_file" | \
            grep -o '"[^"]*\.(yml\|yaml\|json\|md\|txt\|ts\|js\|sh\|toml\|lock\|example)"' | \
            tr -d '"' | head -20
    fi
}

# Show usage
show_usage() {
    cat << EOF
Download Bundle Script - Quick wget-like utility for new_project_bundle

USAGE:
    $0 <bundle-name> [output-dir]
    $0 list                  # List available bundles
    $0 help                  # Show this help

EXAMPLES:
    # Download GitHub CI workflows
    $0 github-workflows-ci

    # Download all templates to a specific directory
    $0 all-templates ./my-project

    # List all available bundles
    $0 list

    # Use different repo/branch
    NPB_REPO=myuser/myrepo NPB_BRANCH=dev $0 docker

ENVIRONMENT VARIABLES:
    NPB_REPO    GitHub repository (default: cbwinslow/new_project_bundle)
    NPB_BRANCH  Git branch (default: main)

DEPENDENCIES:
    - wget or curl (for downloading)
    - jq (optional, for better JSON parsing)

EOF
}

# List bundles
list_bundles() {
    print_info "Downloading bundle manifest..."
    
    local temp_manifest=$(mktemp)
    
    if download_file "$MANIFEST_URL" "$temp_manifest"; then
        echo ""
        print_success "Available bundles:"
        echo ""
        
        if command -v jq &> /dev/null; then
            jq -r '.bundles | to_entries[] | "  • \(.key)\n    \(.value.name)\n    \(.value.description)\n"' "$temp_manifest"
        else
            print_warning "Install jq for better output formatting"
            grep -o '"[a-z-]*".*:' "$temp_manifest" | head -20
        fi
        
        rm -f "$temp_manifest"
    else
        print_error "Failed to download manifest"
        exit 1
    fi
}

# Main function
main() {
    local bundle_name="$1"
    local output_dir="${2:-.}"
    
    # Handle special commands
    case "$bundle_name" in
        "")
            print_error "Bundle name required"
            show_usage
            exit 1
            ;;
        "help"|"--help"|"-h")
            show_usage
            exit 0
            ;;
        "list"|"ls")
            list_bundles
            exit 0
            ;;
    esac
    
    print_info "Downloading bundle: $bundle_name"
    print_info "Repository: $REPO ($BRANCH)"
    print_info "Output directory: $output_dir"
    echo ""
    
    # Download manifest
    local temp_manifest=$(mktemp)
    if ! download_file "$MANIFEST_URL" "$temp_manifest"; then
        print_error "Failed to download bundle manifest"
        rm -f "$temp_manifest"
        exit 1
    fi
    
    # Check if jq is available
    if ! command -v jq &> /dev/null; then
        print_warning "jq is not installed. For full functionality, install jq:"
        print_warning "  Ubuntu/Debian: sudo apt-get install jq"
        print_warning "  macOS: brew install jq"
        print_warning "  RHEL/CentOS: sudo yum install jq"
        echo ""
    fi
    
    # Get files for the bundle
    print_info "Resolving bundle files..."
    local files=$(parse_bundle_json "$bundle_name" "$temp_manifest")
    
    if [ -z "$files" ]; then
        print_error "Bundle '$bundle_name' not found or empty"
        print_info "Use '$0 list' to see available bundles"
        rm -f "$temp_manifest"
        exit 1
    fi
    
    # Download each file
    local success=0
    local failed=0
    
    echo ""
    print_info "Downloading files..."
    echo ""
    
    while IFS= read -r file; do
        if [ -n "$file" ]; then
            local file_url="${BASE_URL}/${file}"
            local output_path="${output_dir}/${file}"
            
            if download_file "$file_url" "$output_path"; then
                ((success++))
            else
                ((failed++))
            fi
        fi
    done <<< "$files"
    
    echo ""
    print_success "Download complete: $success succeeded, $failed failed"
    
    rm -f "$temp_manifest"
}

# Run main
main "$@"
