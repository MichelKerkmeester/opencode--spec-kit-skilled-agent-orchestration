#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: MASTER INSTALLER
# ───────────────────────────────────────────────────────────────
# Orchestrates installation of all MCP servers in dependency order:
#   1. Sequential Thinking (no dependencies)
#   2. Spec Kit Memory (no dependencies)
#   3. Code Mode (no dependencies)
#   4. Chrome DevTools (no dependencies)

set -euo pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/_utils.sh"

# ───────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ───────────────────────────────────────────────────────────────

# MCP definitions using parallel arrays (bash 3.2 compatible)
# Index: 0=sequential-thinking, 1=spec-kit-memory, 2=code-mode, 3=chrome-devtools
readonly MCP_NAMES=(
    "sequential-thinking"
    "spec-kit-memory"
    "code-mode"
    "chrome-devtools"
)

readonly MCP_SCRIPTS=(
    "install-sequential-thinking.sh"
    "install-spec-kit-memory.sh"
    "install-code-mode.sh"
    "install-chrome-devtools.sh"
)

readonly MCP_DISPLAY_NAMES=(
    "Sequential Thinking"
    "Spec Kit Memory"
    "Code Mode"
    "Chrome DevTools"
)

# Dependencies (empty string = no deps, otherwise MCP name)
readonly MCP_DEPS=(
    ""
    ""
    ""
    ""
)

# Installation order indices
readonly INSTALL_ORDER=(0 1 2 3)

# Counters
INSTALLED=0
FAILED=0
SKIPPED=0

# Arrays for tracking
FAILED_MCPS=""
SKIPPED_MCPS=""
INSTALLED_MCPS=""

# Options
DRY_RUN=false
VERBOSE=false
NO_VERIFY=false
SKIP_LIST=""
ONLY_LIST=""

# ───────────────────────────────────────────────────────────────
# 2. HELPER FUNCTIONS
# ───────────────────────────────────────────────────────────────

# Get index for MCP name
get_mcp_index() {
    local name="$1"
    local i
    for i in "${!MCP_NAMES[@]}"; do
        if [[ "${MCP_NAMES[$i]}" == "$name" ]]; then
            echo "$i"
            return 0
        fi
    done
    return 1
}

# Get display name for MCP
get_display_name() {
    local name="$1"
    local idx
    if idx=$(get_mcp_index "$name"); then
        echo "${MCP_DISPLAY_NAMES[$idx]}"
    else
        echo "$name"
    fi
}

# Get script for MCP
get_script() {
    local name="$1"
    local idx
    if idx=$(get_mcp_index "$name"); then
        echo "${MCP_SCRIPTS[$idx]}"
    fi
}

# Get dependency for MCP
get_deps() {
    local name="$1"
    local idx
    if idx=$(get_mcp_index "$name"); then
        echo "${MCP_DEPS[$idx]}"
    fi
}

# Check if space-separated string list contains value
list_contains() {
    local list="$1"
    local val="$2"

    # Word splitting is intentional here to iterate space-separated values
    for item in $list; do
        if [[ "$item" == "$val" ]]; then
            return 0
        fi
    done
    return 1
}

# Validate MCP name
validate_mcp_name() {
    local name="$1"
    
    if get_mcp_index "$name" >/dev/null 2>&1; then
        return 0
    fi
    
    log_error "Unknown MCP: $name"
    log_info "Valid MCPs: ${MCP_NAMES[*]}"
    return 1
}

# Check if MCP should be installed
should_install() {
    local name="$1"
    
    # If --only is specified, only install those
    if [[ -n "$ONLY_LIST" ]]; then
        if ! list_contains "$ONLY_LIST" "$name"; then
            return 1
        fi
    fi
    
    # If --skip is specified, skip those
    if list_contains "$SKIP_LIST" "$name"; then
        return 1
    fi
    
    return 0
}

# Check dependency warnings
check_dependencies() {
    local name="$1"
    local deps
    deps=$(get_deps "$name")
    
    if [[ -z "$deps" ]]; then
        return 0
    fi
    
    # Check if dependency is being skipped
    if ! should_install "$deps" && ! list_contains "$INSTALLED_MCPS" "$deps"; then
        local name_display
        local deps_display
        name_display=$(get_display_name "$name")
        deps_display=$(get_display_name "$deps")
        log_warn "${name_display} depends on ${deps_display}"
        log_warn "${deps_display} is being skipped - ${name_display} may not work properly"
        echo ""
        return 1
    fi
    
    return 0
}

# ───────────────────────────────────────────────────────────────
# 3. DISPLAY FUNCTIONS
# ───────────────────────────────────────────────────────────────

show_banner() {
    echo ""
    echo -e "${BOLD}┌─────────────────────────────────────────────────────────────────┐${NC}"
    echo -e "${BOLD}│       OpenCode MCP Install Scripts - Master Installer          │${NC}"
    echo -e "${BOLD}└─────────────────────────────────────────────────────────────────┘${NC}"
    echo ""
}

show_help() {
    cat << EOF
Usage: $(basename "$0") [OPTIONS]

Master installer for all OpenCode MCP servers.

Options:
    -h, --help          Show this help message
    --skip NAME         Skip specific MCP (can be used multiple times)
    --only NAME         Install only specific MCP (can be used multiple times)
    --dry-run           Show what would be installed without doing it
    -v, --verbose       Enable verbose output for all scripts
    --no-verify         Skip verification steps

MCP Names (for --skip/--only):
    sequential-thinking    Dynamic problem-solving through reflective thinking
    spec-kit-memory        Semantic vector search for conversation context
    code-mode              UTCP orchestration for external MCP tools
    chrome-devtools        Browser debugging via DevTools Protocol

Installation Order (dependency-based):
    1. Sequential Thinking (no dependencies)
    2. Spec Kit Memory (no dependencies)
    3. Code Mode (no dependencies)
    4. Chrome DevTools (no dependencies)

Examples:
    $(basename "$0")                          # Install all MCPs
    $(basename "$0") --skip chrome-devtools   # Install all except Chrome DevTools
    $(basename "$0") --only code-mode         # Install only Code Mode
    $(basename "$0") --only code-mode --only spec-kit-memory   # Install Code Mode and Spec Kit Memory
    $(basename "$0") --dry-run                # Preview without installing

EOF
}

print_progress_line() {
    local index="$1"
    local total="$2"
    local name="$3"
    local status="$4"
    
    local display_name
    display_name=$(get_display_name "$name")
    local padding_length=$((45 - ${#display_name}))
    local padding=""
    local i
    for ((i=0; i<padding_length; i++)); do
        padding="${padding}."
    done
    
    case "$status" in
        "success")
            echo -e "[${index}/${total}] ${display_name} ${padding} ${GREEN}✓${NC}"
            ;;
        "failed")
            echo -e "[${index}/${total}] ${display_name} ${padding} ${RED}✗${NC}"
            ;;
        "skipped")
            echo -e "[${index}/${total}] ${display_name} ${padding} ${YELLOW}⊘${NC}"
            ;;
        "pending")
            echo -e "[${index}/${total}] ${display_name} ${padding} ${DIM}...${NC}"
            ;;
        "dry-run")
            echo -e "[${index}/${total}] ${display_name} ${padding} ${CYAN}(dry-run)${NC}"
            ;;
    esac
}

show_summary() {
    echo ""
    echo "───────────────────────────────────────────────────────────────"
    echo "SUMMARY"
    echo "───────────────────────────────────────────────────────────────"
    echo -e "${GREEN}✓ Installed: ${INSTALLED}${NC}"
    echo -e "${RED}✗ Failed: ${FAILED}${NC}"
    echo -e "${YELLOW}⊘ Skipped: ${SKIPPED}${NC}"
    
    if [[ -n "$FAILED_MCPS" ]]; then
        echo ""
        echo -e "${RED}Failed MCPs:${NC}"
        # Word splitting is intentional to iterate space-separated names
        for mcp in $FAILED_MCPS; do
            local display
            display=$(get_display_name "$mcp")
            echo "  - ${display}"
        done
    fi

    if [[ -n "$SKIPPED_MCPS" ]]; then
        echo ""
        echo -e "${YELLOW}Skipped MCPs:${NC}"
        # Word splitting is intentional to iterate space-separated names
        for mcp in $SKIPPED_MCPS; do
            local display reason=""
            display=$(get_display_name "$mcp")
            
            # Check if skipped due to --skip flag
            if list_contains "$SKIP_LIST" "$mcp"; then
                reason="(--skip)"
            # Check if skipped due to --only flag
            elif [[ -n "$ONLY_LIST" ]] && ! list_contains "$ONLY_LIST" "$mcp"; then
                reason="(not in --only list)"
            fi
            echo "  - ${display} ${reason}"
        done
    fi
    
    echo ""
}

# ───────────────────────────────────────────────────────────────
# 4. INSTALLER FUNCTIONS
# ───────────────────────────────────────────────────────────────

# Run individual installer
run_installer() {
    local name="$1"
    local script
    script=$(get_script "$name")
    local script_path="${SCRIPT_DIR}/${script}"
    
    if [[ ! -f "$script_path" ]]; then
        log_error "Installer script not found: $script_path"
        return 1
    fi
    
    # Build arguments
    local args=""
    if [[ "$VERBOSE" == "true" ]]; then
        args="$args --verbose"
    fi
    if [[ "$NO_VERIFY" == "true" ]]; then
        args="$args --skip-verify"
    fi
    
    # Run the installer
    # shellcheck disable=SC2086 # Word splitting is intentional for args
    if [[ "$VERBOSE" == "true" ]]; then
        bash "$script_path" $args
    else
        # Capture output, show only on error
        local output
        if output=$(bash "$script_path" $args 2>&1); then
            return 0
        else
            echo "$output"
            return 1
        fi
    fi
}

# ───────────────────────────────────────────────────────────────
# 5. MAIN
# ───────────────────────────────────────────────────────────────

main() {
    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case "$1" in
            -h|--help)
                show_help
                exit 0
                ;;
            --skip)
                if [[ -z "${2:-}" ]]; then
                    log_error "--skip requires a value"
                    exit 1
                fi
                validate_mcp_name "$2" || exit 1
                SKIP_LIST="$SKIP_LIST $2"
                shift 2
                ;;
            --only)
                if [[ -z "${2:-}" ]]; then
                    log_error "--only requires a value"
                    exit 1
                fi
                validate_mcp_name "$2" || exit 1
                ONLY_LIST="$ONLY_LIST $2"
                shift 2
                ;;
            --dry-run)
                DRY_RUN=true
                shift
                ;;
            -v|--verbose)
                VERBOSE=true
                shift
                ;;
            --no-verify)
                NO_VERIFY=true
                shift
                ;;
            *)
                log_error "Unknown option: $1"
                show_help
                exit 1
                ;;
        esac
    done
    
    show_banner
    
    # Count MCPs to install
    local to_install=0
    for idx in "${INSTALL_ORDER[@]}"; do
        local name="${MCP_NAMES[$idx]}"
        if should_install "$name"; then
            ((to_install++)) || true  # Prevent set -e exit on first increment
        fi
    done
    
    if [[ $to_install -eq 0 ]]; then
        log_warn "No MCPs selected for installation"
        exit 0
    fi
    
    if [[ "$DRY_RUN" == "true" ]]; then
        log_info "Dry run mode - showing what would be installed..."
    else
        log_info "Installing ${to_install} MCP servers..."
    fi
    echo ""
    
    # Install each MCP in order
    local current_index=0
    local total=$to_install
    
    for idx in "${INSTALL_ORDER[@]}"; do
        local name="${MCP_NAMES[$idx]}"
        
        if ! should_install "$name"; then
            SKIPPED_MCPS="$SKIPPED_MCPS $name"
            ((SKIPPED++)) || true
            continue
        fi
        
        ((current_index++)) || true
        
        # Check dependencies
        check_dependencies "$name" || log_warn "Proceeding despite dependency warning..."
        
        if [[ "$DRY_RUN" == "true" ]]; then
            print_progress_line "$current_index" "$total" "$name" "dry-run"
            INSTALLED_MCPS="$INSTALLED_MCPS $name"
            ((INSTALLED++)) || true
            continue
        fi
        
        # Run installer
        if [[ "$VERBOSE" == "true" ]]; then
            echo ""
            echo "───────────────────────────────────────────────────────────"
            echo "Installing: $(get_display_name "$name")"
            echo "───────────────────────────────────────────────────────────"
            echo ""
        fi
        
        if run_installer "$name"; then
            print_progress_line "$current_index" "$total" "$name" "success"
            INSTALLED_MCPS="$INSTALLED_MCPS $name"
            ((INSTALLED++)) || true
        else
            print_progress_line "$current_index" "$total" "$name" "failed"
            FAILED_MCPS="$FAILED_MCPS $name"
            ((FAILED++)) || true
        fi
    done
    
    show_summary
    
    # Exit status
    if [[ $FAILED -gt 0 ]]; then
        exit 1
    fi
    
    if [[ "$DRY_RUN" != "true" && $INSTALLED -gt 0 ]]; then
        echo ""
        log_info "Next steps:"
        echo "  1. Restart OpenCode to load the new MCP servers"
        echo "  2. Configure API keys in .env if needed (VOYAGE_API_KEY, etc.)"
        echo ""
    fi
    
    exit 0
}

main "$@"
