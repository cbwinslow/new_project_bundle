#!/bin/bash

#
# New Project Bundle - Interactive TUI Browser
#
# Terminal-based UI for browsing and downloading bundles and rules
# Uses basic terminal controls for navigation
#

# Initialize
NPB_TUI_VERSION="1.0.0"
NPB_TUI_CACHE="${NPB_CACHE_DIR:-$HOME/.cache/npb}"

# Terminal control codes
TUI_CLEAR='\033[2J'
TUI_HOME='\033[H'
TUI_CLEAR_LINE='\033[K'
TUI_BOLD='\033[1m'
TUI_DIM='\033[2m'
TUI_REVERSE='\033[7m'
TUI_RESET='\033[0m'

# Colors
TUI_CYAN='\033[0;36m'
TUI_GREEN='\033[0;32m'
TUI_YELLOW='\033[1;33m'
TUI_BLUE='\033[0;34m'
TUI_RED='\033[0;31m'

# Get terminal size
_tui_get_terminal_size() {
    if command -v tput &>/dev/null; then
        TUI_ROWS=$(tput lines)
        TUI_COLS=$(tput cols)
    else
        TUI_ROWS=24
        TUI_COLS=80
    fi
}

# Draw header
_tui_draw_header() {
    local title="$1"
    echo -e "${TUI_BOLD}${TUI_CYAN}╔══════════════════════════════════════════════════════════════════╗${TUI_RESET}"
    printf "${TUI_BOLD}${TUI_CYAN}║${TUI_RESET} %-64s ${TUI_BOLD}${TUI_CYAN}║${TUI_RESET}\n" "$title"
    echo -e "${TUI_BOLD}${TUI_CYAN}╚══════════════════════════════════════════════════════════════════╝${TUI_RESET}"
}

# Draw footer
_tui_draw_footer() {
    local help_text="$1"
    echo -e "${TUI_DIM}────────────────────────────────────────────────────────────────────${TUI_RESET}"
    echo -e "${TUI_DIM}$help_text${TUI_RESET}"
}

# Clear screen
_tui_clear() {
    echo -e "${TUI_CLEAR}${TUI_HOME}"
}

# Browse bundles interactively
npb_browse_bundles() {
    local manifest_file
    manifest_file=$(_npb_fetch_manifest) || {
        npb_error "Failed to fetch bundle manifest"
        return 1
    }
    
    if ! command -v jq &>/dev/null; then
        npb_error "jq is required for the TUI browser. Install with: brew install jq / apt install jq"
        return 1
    fi
    
    # Get bundle list
    local bundles=($(jq -r '.bundles | keys[]' "$manifest_file"))
    local total_bundles=${#bundles[@]}
    local current_page=0
    local page_size=15
    local total_pages=$(( (total_bundles + page_size - 1) / page_size ))
    
    while true; do
        _tui_clear
        _tui_get_terminal_size
        
        _tui_draw_header "📦 New Project Bundle Browser - Page $((current_page + 1))/$total_pages"
        echo ""
        
        # Calculate range for current page
        local start=$((current_page * page_size))
        local end=$((start + page_size))
        [ $end -gt $total_bundles ] && end=$total_bundles
        
        # Display bundles for current page
        for ((i=start; i<end; i++)); do
            local bundle_key="${bundles[$i]}"
            local bundle_name=$(jq -r --arg k "$bundle_key" '.bundles[$k].name' "$manifest_file")
            local bundle_desc=$(jq -r --arg k "$bundle_key" '.bundles[$k].description' "$manifest_file")
            local file_count=$(jq -r --arg k "$bundle_key" '
                def count_files($name; $seen):
                    if ($seen | index($name)) then 0
                    else
                        (.bundles[$name].files // [] | length) +
                        ((.bundles[$name].includes // []) | 
                         map(count_files(.; $seen + [$name])) | add // 0)
                    end;
                count_files($k; [])
            ' "$manifest_file")
            
            local display_num=$((i + 1))
            echo -e "${TUI_BOLD}${TUI_CYAN}[$display_num]${TUI_RESET} ${TUI_BOLD}$bundle_key${TUI_RESET}"
            echo -e "     ${TUI_GREEN}$bundle_name${TUI_RESET}"
            echo -e "     $bundle_desc ${TUI_DIM}($file_count files)${TUI_RESET}"
            echo ""
        done
        
        _tui_draw_footer "Commands: [n]ext page [p]rev page [#]download bundle [i]nfo [s]earch [q]uit"
        
        # Read user input
        read -p "Enter command: " -n 1 -r cmd
        echo ""
        
        case "$cmd" in
            n|N)
                [ $current_page -lt $((total_pages - 1)) ] && current_page=$((current_page + 1))
                ;;
            p|P)
                [ $current_page -gt 0 ] && current_page=$((current_page - 1))
                ;;
            i|I)
                read -p "Enter bundle number or name: " bundle_input
                if [[ "$bundle_input" =~ ^[0-9]+$ ]] && [ "$bundle_input" -gt 0 ] && [ "$bundle_input" -le "$total_bundles" ]; then
                    local idx=$((bundle_input - 1))
                    npb_info_bundle "${bundles[$idx]}"
                else
                    npb_info_bundle "$bundle_input"
                fi
                read -p "Press Enter to continue..."
                ;;
            s|S)
                read -p "Search keyword: " keyword
                npb_search_bundles "$keyword"
                read -p "Press Enter to continue..."
                ;;
            [0-9])
                read -p "Enter bundle number to download: " bundle_num
                if [[ "$bundle_num" =~ ^[0-9]+$ ]] && [ "$bundle_num" -gt 0 ] && [ "$bundle_num" -le "$total_bundles" ]; then
                    local idx=$((bundle_num - 1))
                    read -p "Download to directory [.]: " dl_dir
                    dl_dir=${dl_dir:-.}
                    npb_download_bundle "${bundles[$idx]}" "$dl_dir"
                    read -p "Press Enter to continue..."
                else
                    npb_error "Invalid bundle number"
                    read -p "Press Enter to continue..."
                fi
                ;;
            q|Q)
                echo "Goodbye! 👋"
                return 0
                ;;
            *)
                ;;
        esac
    done
}

# Simple menu selector (for simpler selections)
_tui_menu_select() {
    local title="$1"
    shift
    local options=("$@")
    local selected=0
    local total=${#options[@]}
    
    # Check if we have arrow key support
    if ! command -v tput &>/dev/null; then
        # Fallback to simple numbered selection
        echo "$title"
        for ((i=0; i<total; i++)); do
            echo "$((i+1)). ${options[$i]}"
        done
        read -p "Select (1-$total): " choice
        if [[ "$choice" =~ ^[0-9]+$ ]] && [ "$choice" -gt 0 ] && [ "$choice" -le "$total" ]; then
            echo "$((choice - 1))"
            return 0
        fi
        return 1
    fi
    
    # Interactive menu with arrow keys (simplified version)
    while true; do
        _tui_clear
        _tui_draw_header "$title"
        echo ""
        
        for ((i=0; i<total; i++)); do
            if [ $i -eq $selected ]; then
                echo -e "${TUI_REVERSE}${TUI_BOLD} → ${options[$i]} ${TUI_RESET}"
            else
                echo -e "   ${options[$i]}"
            fi
        done
        
        echo ""
        _tui_draw_footer "Use ↑/↓ or j/k to navigate, Enter to select, q to quit"
        
        # Read single character
        read -rsn1 key
        
        case "$key" in
            A|k)  # Up arrow or k
                [ $selected -gt 0 ] && selected=$((selected - 1))
                ;;
            B|j)  # Down arrow or j
                [ $selected -lt $((total - 1)) ] && selected=$((selected + 1))
                ;;
            "")   # Enter
                echo "$selected"
                return 0
                ;;
            q|Q)
                return 1
                ;;
        esac
    done
}

# Quick download menu
npb_quick_download() {
    if ! command -v jq &>/dev/null; then
        npb_error "jq is required. Install with: brew install jq / apt install jq"
        return 1
    fi
    
    local manifest=$(_npb_fetch_manifest) || return 1
    
    # Get popular bundles
    local bundles=("all-github" "github-workflows-ci" "docker" "all-templates" "dotfiles" "mcp-server")
    local labels=(
        "All GitHub Configs (workflows, templates, etc.)"
        "GitHub CI/CD Workflows"
        "Docker Configuration"
        "All Documentation Templates"
        "Essential Dotfiles"
        "MCP Server"
    )
    
    echo ""
    npb_header "📦 Quick Download Menu"
    echo ""
    
    for ((i=0; i<${#bundles[@]}; i++)); do
        echo "$((i+1)). ${labels[$i]}"
        echo "   ${TUI_DIM}Bundle: ${bundles[$i]}${TUI_RESET}"
        echo ""
    done
    
    echo "0. Custom bundle"
    echo ""
    
    read -p "Select option (0-${#bundles[@]}): " choice
    
    if [[ "$choice" == "0" ]]; then
        npb_browse_bundles
    elif [[ "$choice" =~ ^[0-9]+$ ]] && [ "$choice" -gt 0 ] && [ "$choice" -le "${#bundles[@]}" ]; then
        local idx=$((choice - 1))
        read -p "Download to directory [.]: " dl_dir
        dl_dir=${dl_dir:-.}
        npb_download_bundle "${bundles[$idx]}" "$dl_dir"
    else
        npb_error "Invalid selection"
        return 1
    fi
}

# Export functions
export -f npb_browse_bundles 2>/dev/null || true
export -f npb_quick_download 2>/dev/null || true
