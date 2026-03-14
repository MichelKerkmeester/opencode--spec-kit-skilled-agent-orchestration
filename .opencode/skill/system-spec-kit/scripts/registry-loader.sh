#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# SPECKIT: REGISTRY LOADER
# ───────────────────────────────────────────────────────────────
# Queries scripts-registry.json for script information.

set -euo pipefail

# ───────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ───────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REGISTRY_FILE="$SCRIPT_DIR/scripts-registry.json"

# Colors (disabled for non-TTY)
if [[ -t 1 ]]; then
    RED='\033[0;31m'
    GREEN='\033[0;32m'
    YELLOW='\033[1;33m'
    BLUE='\033[0;34m'
    CYAN='\033[0;36m'
    BOLD='\033[1m'
    DIM='\033[2m'
    NC='\033[0m'
else
    RED='' GREEN='' YELLOW='' BLUE='' CYAN='' BOLD='' DIM='' NC=''
fi

# ───────────────────────────────────────────────────────────────
# 2. HELPER FUNCTIONS
# ───────────────────────────────────────────────────────────────

show_help() {
    cat << 'EOF'
registry-loader.sh - Query the Spec Kit Script Registry

USAGE:
  ./registry-loader.sh [OPTIONS]

OPTIONS:
  <script-name>             Get info about a specific script (partial match)
  --list                    List all scripts
  --essential               List only essential scripts
  --optional                List only optional scripts
  --by-trigger "phrase"     Find scripts by trigger phrase
  --by-gate "gate"          Find scripts by gate association
  --by-type "bash|node|python"  Filter by script type
  --rules                   List all validation rules
  --json                    Output in JSON format
  --help                    Show this help message

EXAMPLES:
  ./registry-loader.sh validate-spec
  ./registry-loader.sh --list
  ./registry-loader.sh --essential
  ./registry-loader.sh --by-trigger "save context"
  ./registry-loader.sh --by-gate "Gate 3"
  ./registry-loader.sh --rules
EOF
}

check_jq() {
    if ! command -v jq &> /dev/null; then
        echo -e "${RED}Error: jq is required but not installed.${NC}" >&2
        echo "Install with: brew install jq (macOS) or apt install jq (Linux)"
        exit 1
    fi
}

check_registry() {
    if [[ ! -f "$REGISTRY_FILE" ]]; then
        echo -e "${RED}Error: Registry file not found: $REGISTRY_FILE${NC}" >&2
        exit 1
    fi
}

# ───────────────────────────────────────────────────────────────
# 3. QUERY FUNCTIONS
# ───────────────────────────────────────────────────────────────

list_all_scripts() {
    local json_mode="$1"
    
    if [[ "$json_mode" == "true" ]]; then
        jq '.scripts' "$REGISTRY_FILE"
    else
        echo -e "${BOLD}Spec Kit Scripts${NC}"
        echo -e "${DIM}────────────────────────────────────────
${NC}"
        echo ""
        
        jq -r '.scripts[] | "\(.name)|\(.type)|\(.essential)|\(.description)"' "$REGISTRY_FILE" | \
        while IFS='|' read -r name type essential desc; do
            local marker=""
            if [[ "$essential" == "true" ]]; then
                marker="${GREEN}*${NC}"
            fi
            printf "  ${CYAN}%-28s${NC} ${DIM}[%s]${NC} %s %s\n" "$name" "$type" "$marker" "$desc"
        done
        
        echo ""
        echo -e "${DIM}${GREEN}*${NC}${DIM} = essential script${NC}"
    fi
}

list_essential_scripts() {
    local json_mode="$1"
    
    if [[ "$json_mode" == "true" ]]; then
        jq '.scripts | map(select(.essential == true))' "$REGISTRY_FILE"
    else
        echo -e "${BOLD}Essential Scripts${NC}"
        echo -e "${DIM}────────────────────────────────────────
${NC}"
        echo ""
        
        jq -r '.scripts[] | select(.essential == true) | "\(.name)|\(.type)|\(.description)"' "$REGISTRY_FILE" | \
        while IFS='|' read -r name type desc; do
            printf "  ${GREEN}%-28s${NC} ${DIM}[%s]${NC} %s\n" "$name" "$type" "$desc"
        done
    fi
}

list_optional_scripts() {
    local json_mode="$1"
    
    if [[ "$json_mode" == "true" ]]; then
        jq '.scripts | map(select(.essential == false or .essential == null))' "$REGISTRY_FILE"
    else
        echo -e "${BOLD}Optional Scripts${NC}"
        echo -e "${DIM}────────────────────────────────────────
${NC}"
        echo ""
        
        jq -r '.scripts[] | select(.essential == false or .essential == null) | "\(.name)|\(.type)|\(.description)"' "$REGISTRY_FILE" | \
        while IFS='|' read -r name type desc; do
            printf "  ${YELLOW}%-28s${NC} ${DIM}[%s]${NC} %s\n" "$name" "$type" "$desc"
        done
    fi
}

get_script_info() {
    local name="$1"
    local json_mode="$2"
    
    local result
    result=$(jq --arg name "$name" '.scripts[] | select(.name | contains($name))' "$REGISTRY_FILE")
    
    if [[ -z "$result" || "$result" == "null" ]]; then
        echo -e "${RED}No script found matching: $name${NC}"
        exit 1
    fi
    
    if [[ "$json_mode" == "true" ]]; then
        echo "$result"
    else
        echo -e "${BOLD}Script: $(echo "$result" | jq -r '.name')${NC}"
        echo -e "${DIM}────────────────────────────────────────
${NC}"
        echo ""
        echo -e "  ${CYAN}Path:${NC}        $(echo "$result" | jq -r '.path')"
        echo -e "  ${CYAN}Type:${NC}        $(echo "$result" | jq -r '.type')"
        echo -e "  ${CYAN}Description:${NC} $(echo "$result" | jq -r '.description')"
        echo -e "  ${CYAN}Essential:${NC}   $(echo "$result" | jq -r '.essential')"
        echo -e "  ${CYAN}Version:${NC}     $(echo "$result" | jq -r '.version // "N/A"')"
        
        local gate
        gate=$(echo "$result" | jq -r '.gate // "N/A"')
        if [[ "$gate" != "null" && "$gate" != "N/A" ]]; then
            echo -e "  ${CYAN}Gate:${NC}        $gate"
        fi
        
        local triggers
        triggers=$(echo "$result" | jq -r '.trigger | if type == "array" then join(", ") else . end // "N/A"')
        if [[ "$triggers" != "null" && "$triggers" != "N/A" && -n "$triggers" ]]; then
            echo -e "  ${CYAN}Triggers:${NC}    $triggers"
        fi
        
        local calledBy
        calledBy=$(echo "$result" | jq -r '.calledBy | if type == "array" then join(", ") else . end // "N/A"')
        if [[ "$calledBy" != "null" && "$calledBy" != "N/A" ]]; then
            echo -e "  ${CYAN}Called By:${NC}   $calledBy"
        fi
    fi
}

find_by_trigger() {
    local phrase="$1"
    local json_mode="$2"
    
    local results
    results=$(jq --arg phrase "$phrase" '.scripts | map(select(.trigger | if type == "array" then any(. | ascii_downcase | contains($phrase | ascii_downcase)) else false end))' "$REGISTRY_FILE")
    
    if [[ "$json_mode" == "true" ]]; then
        echo "$results"
    else
        local count
        count=$(echo "$results" | jq 'length')
        
        if [[ "$count" == "0" ]]; then
            echo -e "${YELLOW}No scripts found for trigger: \"$phrase\"${NC}"
            exit 0
        fi
        
        echo -e "${BOLD}Scripts for trigger: \"$phrase\"${NC}"
        echo -e "${DIM}────────────────────────────────────────
${NC}"
        echo ""
        
        echo "$results" | jq -r '.[] | "\(.name)|\(.type)|\(.description)"' | \
        while IFS='|' read -r name type desc; do
            printf "  ${CYAN}%-28s${NC} ${DIM}[%s]${NC} %s\n" "$name" "$type" "$desc"
        done
    fi
}

find_by_gate() {
    local gate="$1"
    local json_mode="$2"
    
    local results
    results=$(jq --arg gate "$gate" '.scripts | map(select(.gate != null and (.gate | ascii_downcase | contains($gate | ascii_downcase))))' "$REGISTRY_FILE")
    
    if [[ "$json_mode" == "true" ]]; then
        echo "$results"
    else
        local count
        count=$(echo "$results" | jq 'length')
        
        if [[ "$count" == "0" ]]; then
            echo -e "${YELLOW}No scripts found for gate: \"$gate\"${NC}"
            exit 0
        fi
        
        echo -e "${BOLD}Scripts for gate: \"$gate\"${NC}"
        echo -e "${DIM}────────────────────────────────────────
${NC}"
        echo ""
        
        echo "$results" | jq -r '.[] | "\(.name)|\(.gate)|\(.description)"' | \
        while IFS='|' read -r name gateName desc; do
            printf "  ${CYAN}%-20s${NC} ${GREEN}%-25s${NC} %s\n" "$name" "$gateName" "$desc"
        done
    fi
}

find_by_type() {
    local type="$1"
    local json_mode="$2"
    
    local results
    results=$(jq --arg type "$type" '.scripts | map(select(.type == $type))' "$REGISTRY_FILE")
    
    if [[ "$json_mode" == "true" ]]; then
        echo "$results"
    else
        local count
        count=$(echo "$results" | jq 'length')
        
        if [[ "$count" == "0" ]]; then
            echo -e "${YELLOW}No scripts found for type: \"$type\"${NC}"
            exit 0
        fi
        
        echo -e "${BOLD}Scripts of type: \"$type\"${NC}"
        echo -e "${DIM}────────────────────────────────────────
${NC}"
        echo ""
        
        echo "$results" | jq -r '.[] | "\(.name)|\(.essential)|\(.description)"' | \
        while IFS='|' read -r name essential desc; do
            local marker=""
            if [[ "$essential" == "true" ]]; then
                marker="${GREEN}*${NC}"
            fi
            printf "  ${CYAN}%-28s${NC} %s %s\n" "$name" "$marker" "$desc"
        done
    fi
}

list_rules() {
    local json_mode="$1"
    
    if [[ "$json_mode" == "true" ]]; then
        jq '.rules' "$REGISTRY_FILE"
    else
        echo -e "${BOLD}Validation Rules${NC}"
        echo -e "${DIM}────────────────────────────────────────
${NC}"
        echo ""
        
        jq -r '.rules[] | "\(.name)|\(.severity)|\(.description)"' "$REGISTRY_FILE" | \
        while IFS='|' read -r name severity desc; do
            local color=""
            case "$severity" in
                error)   color="${RED}" ;;
                warning) color="${YELLOW}" ;;
                info)    color="${BLUE}" ;;
                *)       color="${NC}" ;;
            esac
            printf "  ${CYAN}%-22s${NC} ${color}%-8s${NC} %s\n" "$name" "[$severity]" "$desc"
        done
    fi
}

# ───────────────────────────────────────────────────────────────
# 4. MAIN
# ───────────────────────────────────────────────────────────────

main() {
    check_jq
    check_registry
    
    local json_mode=false
    local action=""
    local value=""
    
    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case "$1" in
            --help|-h)
                show_help
                exit 0
                ;;
            --json)
                json_mode=true
                shift
                ;;
            --list)
                action="list"
                shift
                ;;
            --essential)
                action="essential"
                shift
                ;;
            --optional)
                action="optional"
                shift
                ;;
            --by-trigger)
                action="by-trigger"
                shift
                value="$1"
                shift
                ;;
            --by-gate)
                action="by-gate"
                shift
                value="$1"
                shift
                ;;
            --by-type)
                action="by-type"
                shift
                value="$1"
                shift
                ;;
            --rules)
                action="rules"
                shift
                ;;
            -*)
                echo -e "${RED}Unknown option: $1${NC}"
                show_help
                exit 1
                ;;
            *)
                action="info"
                value="$1"
                shift
                ;;
        esac
    done
    
    # Default to list if no action
    if [[ -z "$action" ]]; then
        action="list"
    fi
    
    # Execute action
    case "$action" in
        list)
            list_all_scripts "$json_mode"
            ;;
        essential)
            list_essential_scripts "$json_mode"
            ;;
        optional)
            list_optional_scripts "$json_mode"
            ;;
        by-trigger)
            find_by_trigger "$value" "$json_mode"
            ;;
        by-gate)
            find_by_gate "$value" "$json_mode"
            ;;
        by-type)
            find_by_type "$value" "$json_mode"
            ;;
        rules)
            list_rules "$json_mode"
            ;;
        info)
            get_script_info "$value" "$json_mode"
            ;;
    esac
}

main "$@"

# Exit codes:
#   0 - Success
#   1 - ${RED}Error: jq is required but not installed.${NC}
