#!/bin/bash

#
# New Project Bundle - Rule Manager
#
# Functions for browsing, downloading, and managing development rules
#

NPB_RULES_REPO="${NPB_REPO:-cbwinslow/new_project_bundle}"
NPB_RULES_BRANCH="${NPB_BRANCH:-main}"
NPB_RULES_BASE_URL="https://raw.githubusercontent.com/${NPB_RULES_REPO}/${NPB_RULES_BRANCH}/rules"
NPB_RULES_CACHE="${NPB_CACHE_DIR:-$HOME/.cache/npb}/rules"
NPB_RULES_INSTALLED="${NPB_DATA_DIR:-$HOME/.local/share/npb}/rules"

# Ensure directories exist
_npb_ensure_rules_dirs() {
    mkdir -p "$NPB_RULES_CACHE" "$NPB_RULES_INSTALLED"
}

# Fetch rules index
_npb_fetch_rules_index() {
    _npb_ensure_rules_dirs
    
    local index_file="$NPB_RULES_CACHE/index.json"
    local index_url="${NPB_RULES_BASE_URL}/index.json"
    local index_age=3600  # 1 hour cache
    
    # Check if index exists and is recent
    if [ -f "$index_file" ]; then
        local file_age=$(($(date +%s) - $(date -r "$index_file" +%s 2>/dev/null || stat -f %m "$index_file" 2>/dev/null || echo 0)))
        if [ "$file_age" -lt "$index_age" ]; then
            echo "$index_file"
            return 0
        fi
    fi
    
    # Download fresh index
    if command -v curl &>/dev/null; then
        curl -sSL -o "$index_file" "$index_url" 2>/dev/null
    elif command -v wget &>/dev/null; then
        wget -qO "$index_file" "$index_url" 2>/dev/null
    else
        npb_error "Neither curl nor wget found"
        return 1
    fi
    
    if [ $? -eq 0 ] && [ -f "$index_file" ]; then
        echo "$index_file"
        return 0
    else
        npb_warning "Rules index not available yet"
        return 1
    fi
}

# List all available rules
npb_list_rules() {
    local category="$1"
    
    npb_header "\n📋 Available Development Rules\n"
    
    local index_file
    if ! index_file=$(_npb_fetch_rules_index); then
        npb_info "Rules system is being set up. Available rule categories:"
        echo ""
        echo "  • github    - GitHub workflow and configuration rules"
        echo "  • docker    - Docker and containerization rules"
        echo "  • ci-cd     - CI/CD pipeline best practices"
        echo "  • security  - Security and compliance rules"
        echo "  • linting   - Code quality and linting rules"
        echo ""
        npb_info "Use: npb_browse_rules <category> to explore rules"
        return 0
    fi
    
    if ! command -v jq &>/dev/null; then
        npb_warning "jq is required for full rule browsing. Install with: brew install jq / apt install jq"
        echo ""
        echo "Available categories: github, docker, ci-cd, security, linting"
        return 1
    fi
    
    if [ -n "$category" ]; then
        jq -r --arg cat "$category" '
            .categories[$cat].rules[] |
            "\u001b[1;36m\(.id)\u001b[0m\n  \u001b[1m\(.name)\u001b[0m\n  \(.description)\n  Tags: \(.tags | join(", "))\n"
        ' "$index_file"
    else
        jq -r '
            .categories | to_entries[] |
            "\u001b[1;33m\(.key)\u001b[0m - \(.value.description)\n  Rules: \(.value.rules | length)\n"
        ' "$index_file"
    fi
}

# Search rules by keyword
npb_search_rules() {
    local keyword="$1"
    
    if [ -z "$keyword" ]; then
        npb_error "Usage: npb_search_rules <keyword>"
        return 1
    fi
    
    local index_file
    if ! index_file=$(_npb_fetch_rules_index); then
        npb_error "Rules index not available"
        return 1
    fi
    
    if ! command -v jq &>/dev/null; then
        npb_error "jq is required. Install with: brew install jq / apt install jq"
        return 1
    fi
    
    npb_header "\n🔍 Searching rules for: $keyword\n"
    
    jq -r --arg keyword "$keyword" '
        .categories | to_entries[] |
        .value.rules[] |
        select(
            (.name | ascii_downcase | contains($keyword | ascii_downcase)) or
            (.description | ascii_downcase | contains($keyword | ascii_downcase)) or
            (.tags[]? | ascii_downcase | contains($keyword | ascii_downcase))
        ) |
        "\u001b[1;36m\(.id)\u001b[0m [\(.category)]\n  \u001b[1m\(.name)\u001b[0m\n  \(.description)\n"
    ' "$index_file"
}

# Show rule details
npb_info_rule() {
    local rule_id="$1"
    
    if [ -z "$rule_id" ]; then
        npb_error "Usage: npb_info_rule <rule-id>"
        return 1
    fi
    
    local index_file
    if ! index_file=$(_npb_fetch_rules_index); then
        npb_error "Rules index not available"
        return 1
    fi
    
    if ! command -v jq &>/dev/null; then
        npb_error "jq is required. Install with: brew install jq / apt install jq"
        return 1
    fi
    
    npb_header "\n📋 Rule Details: $rule_id\n"
    
    jq -r --arg id "$rule_id" '
        .categories | to_entries[] |
        .value.rules[] |
        select(.id == $id) |
        "Name: \(.name)\n" +
        "Category: \(.category)\n" +
        "Description: \(.description)\n" +
        "Tags: \(.tags | join(", "))\n" +
        "File: \(.file)\n" +
        (if .dependencies then "\nDependencies:\n" + (.dependencies[] | "  • \(.)") else "" end)
    ' "$index_file"
}

# Download a rule
npb_download_rule() {
    local rule_id="$1"
    local output_dir="${2:-.}"
    
    if [ -z "$rule_id" ]; then
        npb_error "Usage: npb_download_rule <rule-id> [output-dir]"
        return 1
    fi
    
    local index_file
    if ! index_file=$(_npb_fetch_rules_index); then
        npb_error "Rules index not available"
        return 1
    fi
    
    if ! command -v jq &>/dev/null; then
        npb_error "jq is required. Install with: brew install jq / apt install jq"
        return 1
    fi
    
    # Get rule file path
    local rule_file=$(jq -r --arg id "$rule_id" '
        .categories | to_entries[] |
        .value.rules[] |
        select(.id == $id) |
        .file
    ' "$index_file")
    
    if [ -z "$rule_file" ] || [ "$rule_file" = "null" ]; then
        npb_error "Rule '$rule_id' not found"
        return 1
    fi
    
    local rule_url="${NPB_RULES_BASE_URL}/${rule_file}"
    local output_path="${output_dir}/$(basename "$rule_file")"
    
    npb_info "Downloading rule: $rule_id"
    npb_info "From: $rule_url"
    npb_info "To: $output_path"
    echo ""
    
    mkdir -p "$output_dir"
    
    if command -v curl &>/dev/null; then
        curl -sSL -o "$output_path" "$rule_url"
    elif command -v wget &>/dev/null; then
        wget -qO "$output_path" "$rule_url"
    else
        npb_error "Neither curl nor wget found"
        return 1
    fi
    
    if [ -f "$output_path" ]; then
        npb_success "Rule downloaded to $output_path"
    else
        npb_error "Failed to download rule"
        return 1
    fi
}

# Install a rule (download to NPB rules directory)
npb_install_rule() {
    local rule_id="$1"
    
    if [ -z "$rule_id" ]; then
        npb_error "Usage: npb_install_rule <rule-id>"
        return 1
    fi
    
    _npb_ensure_rules_dirs
    
    npb_download_rule "$rule_id" "$NPB_RULES_INSTALLED"
    
    if [ $? -eq 0 ]; then
        echo ""
        npb_success "Rule installed to $NPB_RULES_INSTALLED"
        npb_info "View installed rules with: npb_list_installed_rules"
    fi
}

# List installed rules
npb_list_installed_rules() {
    _npb_ensure_rules_dirs
    
    npb_header "\n📦 Installed Rules\n"
    
    if [ ! -d "$NPB_RULES_INSTALLED" ] || [ -z "$(ls -A "$NPB_RULES_INSTALLED" 2>/dev/null)" ]; then
        npb_info "No rules installed yet"
        npb_info "Install rules with: npb_install_rule <rule-id>"
        return 0
    fi
    
    echo "Installed in: $NPB_RULES_INSTALLED"
    echo ""
    
    for file in "$NPB_RULES_INSTALLED"/*; do
        if [ -f "$file" ]; then
            local filename=$(basename "$file")
            local rule_name=$(head -n 10 "$file" | grep -i "^# " | head -n 1 | sed 's/^# *//')
            
            echo -e "${TUI_BOLD}${TUI_CYAN}$filename${TUI_RESET}"
            if [ -n "$rule_name" ]; then
                echo "  $rule_name"
            fi
            echo ""
        fi
    done
}

# Browse rules interactively
npb_browse_rules() {
    local category="${1:-all}"
    
    npb_header "\n📋 Browse Development Rules\n"
    
    local index_file
    if ! index_file=$(_npb_fetch_rules_index); then
        npb_info "Rules index not yet available. Categories:"
        echo ""
        echo "  1. github    - GitHub workflows and configurations"
        echo "  2. docker    - Docker and containerization"
        echo "  3. ci-cd     - CI/CD pipeline best practices"
        echo "  4. security  - Security and compliance"
        echo "  5. linting   - Code quality and linting"
        echo ""
        npb_info "The rules system is under development."
        npb_info "Check back soon or contribute rules to the repository!"
        return 0
    fi
    
    if ! command -v jq &>/dev/null; then
        npb_error "jq is required. Install with: brew install jq / apt install jq"
        return 1
    fi
    
    # Show categories
    local categories=($(jq -r '.categories | keys[]' "$index_file"))
    
    echo "Available categories:"
    echo ""
    for ((i=0; i<${#categories[@]}; i++)); do
        local cat="${categories[$i]}"
        local desc=$(jq -r --arg c "$cat" '.categories[$c].description' "$index_file")
        local count=$(jq -r --arg c "$cat" '.categories[$c].rules | length' "$index_file")
        
        echo "$((i+1)). ${TUI_BOLD}$cat${TUI_RESET} - $desc ${TUI_DIM}($count rules)${TUI_RESET}"
    done
    
    echo ""
    echo "0. Search all rules"
    echo "q. Quit"
    echo ""
    
    read -p "Select category (0-${#categories[@]}): " choice
    
    if [[ "$choice" == "q" ]]; then
        return 0
    elif [[ "$choice" == "0" ]]; then
        read -p "Search keyword: " keyword
        npb_search_rules "$keyword"
    elif [[ "$choice" =~ ^[0-9]+$ ]] && [ "$choice" -gt 0 ] && [ "$choice" -le "${#categories[@]}" ]; then
        local idx=$((choice - 1))
        npb_list_rules "${categories[$idx]}"
    else
        npb_error "Invalid selection"
        return 1
    fi
}

# Refresh rules cache
npb_refresh_rules() {
    npb_info "Refreshing rules index..."
    rm -f "$NPB_RULES_CACHE/index.json"
    _npb_fetch_rules_index >/dev/null
    npb_success "Rules index refreshed"
}

# Export functions
export -f npb_list_rules 2>/dev/null || true
export -f npb_search_rules 2>/dev/null || true
export -f npb_info_rule 2>/dev/null || true
export -f npb_download_rule 2>/dev/null || true
export -f npb_install_rule 2>/dev/null || true
export -f npb_list_installed_rules 2>/dev/null || true
export -f npb_browse_rules 2>/dev/null || true
export -f npb_refresh_rules 2>/dev/null || true
