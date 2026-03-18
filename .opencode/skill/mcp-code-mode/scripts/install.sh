#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: CODE MODE MCP INSTALLER
# ───────────────────────────────────────────────────────────────
# Install and configure the Code Mode MCP Server.
# Code Mode is the primary MCP orchestration tool that enables efficient
# multi-tool workflows via TypeScript code execution.
#
# Official repo: https://github.com/universal-tool-calling-protocol/code-mode
# Package: @utcp/code-mode-mcp

set -euo pipefail

# ───────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ───────────────────────────────────────────────────────────────
readonly MCP_NAME="code_mode"
readonly MCP_DISPLAY_NAME="Code Mode"
readonly MCP_PACKAGE="@utcp/code-mode-mcp"
readonly MIN_NODE_VERSION="18"

# ───────────────────────────────────────────────────────────────
# 2. SETUP
# ───────────────────────────────────────────────────────────────
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/_utils.sh"

# ───────────────────────────────────────────────────────────────
# 3. HELP
# ───────────────────────────────────────────────────────────────
show_help() {
    cat << EOF
Usage: $(basename "$0") [OPTIONS]

Install and configure Code Mode MCP Server for OpenCode.

Code Mode enables efficient multi-tool MCP orchestration via TypeScript code
execution. It provides 67-88% faster execution than traditional tool calling.

OPTIONS:
    -h, --help      Show this help message
    -v, --verbose   Enable verbose output
    --dry-run       Show what would be done without making changes
    --skip-verify   Skip verification step (faster install)

WHAT THIS SCRIPT DOES:
    1. Verifies Node.js 18+ and npx are available
    2. Creates .utcp_config.json template (if not exists)
    3. Creates .env.example with placeholder API keys (if not exists)
    4. Adds code_mode to opencode.json MCP configuration
    5. Verifies the embedded MCP server at .opencode/skill/mcp-code-mode/

FILES CREATED/MODIFIED:
    .utcp_config.json    - UTCP configuration file (created if missing)
    .env.example         - Environment variable template (appended if missing)
    opencode.json        - MCP server configuration (entry added if missing)

EXAMPLES:
    $(basename "$0")              # Standard installation
    $(basename "$0") --dry-run    # Preview changes without making them
    $(basename "$0") --verbose    # Show detailed progress

DOCUMENTATION:
    https://github.com/universal-tool-calling-protocol/code-mode

EOF
}

# ───────────────────────────────────────────────────────────────
# 4. ARGUMENT PARSING
# ───────────────────────────────────────────────────────────────
VERBOSE=${VERBOSE:-false}
DRY_RUN=${DRY_RUN:-false}
SKIP_VERIFY=${SKIP_VERIFY:-false}

while [[ $# -gt 0 ]]; do
    case "$1" in
        -h|--help)
            show_help
            exit 0
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --skip-verify)
            SKIP_VERIFY=true
            shift
            ;;
        *)
            log_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# ───────────────────────────────────────────────────────────────
# 5. MAIN FUNCTIONS
# ───────────────────────────────────────────────────────────────

check_prerequisites() {
    log_step "1" "Checking prerequisites..."

    if ! check_node_version "${MIN_NODE_VERSION}"; then
        return 1
    fi

    if ! check_npx; then
        return 1
    fi

    # Log Node.js environment for diagnostics
    log_info "Node.js version: $(node --version)"
    log_info "Node.js MODULE_VERSION: $(node -e 'console.log(process.versions.modules)')"
    log_info "Node.js path: $(which node)"

    # Clear stale npx cache to prevent ERR_DLOPEN_FAILED
    rm -rf ~/.npm/_npx/* 2>/dev/null || true

    log_success "All prerequisites met"
    return 0
}

create_utcp_config() {
    log_step "2" "Checking .utcp_config.json..."
    
    local project_root
    project_root=$(find_project_root) || return 1
    local config_file="${project_root}/.utcp_config.json"
    
    if [[ -f "${config_file}" ]]; then
        log_info ".utcp_config.json already exists, validating..."
        if json_validate "${config_file}"; then
            log_success ".utcp_config.json is valid"
            return 0
        else
            log_error ".utcp_config.json exists but is invalid JSON"
            return 1
        fi
    fi
    
    if [[ "${DRY_RUN}" == "true" ]]; then
        log_info "[DRY-RUN] Would create: ${config_file}"
        return 0
    fi
    
    log_info "Creating .utcp_config.json template..."
    
    cat > "${config_file}" << 'EOF'
{
  "$schema": "https://utcp.dev/schema/config.json",
  "load_variables_from": [
    {
      "variable_loader_type": "dotenv",
      "env_file_path": ".env"
    }
  ],
  "tool_repository": {
    "tool_repository_type": "in_memory"
  },
  "tool_search_strategy": {
    "tool_search_strategy_type": "tag_and_description_word_match"
  },
  "manual_call_templates": []
}
EOF
    
    log_success "Created .utcp_config.json"
    return 0
}

create_env_example() {
    log_step "3" "Checking .env.example..."
    
    local project_root
    project_root=$(find_project_root) || return 1
    local env_file="${project_root}/.env.example"
    
    # Define the Code Mode section
    local code_mode_section="# ───────────────────────────────────────────────────────────────
# CODE MODE MCP - Provider API Keys
# ───────────────────────────────────────────────────────────────
# Code Mode orchestrates multiple MCP tools. Add API keys for providers you use.
# Copy relevant keys to your .env file.

# Figma - Design file access (optional)
# Get your key: https://www.figma.com/developers/api#access-tokens
FIGMA_API_KEY=

# GitHub - Repository operations (optional)
# Get your key: https://github.com/settings/tokens
GITHUB_PAT=

# ClickUp - Task management (optional)
# Get your key: https://app.clickup.com/settings/apps
CLICKUP_API_KEY=
CLICKUP_TEAM_ID=

# Voyage AI - Neural search for Spec Kit Memory (optional)
# Get your key: https://www.voyageai.com/
VOYAGE_API_KEY=
"

    if [[ -f "${env_file}" ]]; then
        # Check if Code Mode section already exists
        if grep -q "CODE MODE MCP" "${env_file}" 2>/dev/null; then
            log_info ".env.example already contains Code Mode configuration"
            return 0
        fi
        
        if [[ "${DRY_RUN}" == "true" ]]; then
            log_info "[DRY-RUN] Would append Code Mode section to: ${env_file}"
            return 0
        fi
        
        log_info "Appending Code Mode section to .env.example..."
        echo "" >> "${env_file}"
        echo "${code_mode_section}" >> "${env_file}"
        log_success "Updated .env.example with Code Mode configuration"
    else
        if [[ "${DRY_RUN}" == "true" ]]; then
            log_info "[DRY-RUN] Would create: ${env_file}"
            return 0
        fi
        
        log_info "Creating .env.example..."
        echo "${code_mode_section}" > "${env_file}"
        log_success "Created .env.example"
    fi
    
    return 0
}

add_to_opencode_json() {
    log_step "4" "Checking opencode.json configuration..."
    
    local project_root
    project_root=$(find_project_root) || return 1
    local config_file="${project_root}/opencode.json"
    
    if [[ ! -f "${config_file}" ]]; then
        log_error "opencode.json not found at: ${config_file}"
        log_info "Run this script from within an OpenCode project"
        return 1
    fi
    
    # Check if entry already exists
    if json_has_key "${config_file}" ".mcp.${MCP_NAME}"; then
        log_info "${MCP_DISPLAY_NAME} already configured in opencode.json"
        return 0
    fi
    
    if [[ "${DRY_RUN}" == "true" ]]; then
        log_info "[DRY-RUN] Would add ${MCP_NAME} to opencode.json"
        return 0
    fi
    
    log_info "Adding ${MCP_DISPLAY_NAME} to opencode.json..."
    
    # Backup before modification
    backup_file "${config_file}"
    
    # MCP configuration for opencode.json
    # Uses embedded source from .opencode/skill/mcp-code-mode/mcp_server/
    # This requires: npm install in mcp_server/ directory (done in verify step)
    local mcp_config='{
        "type": "local",
        "command": ["node", ".opencode/skill/mcp-code-mode/mcp_server/dist/index.js"],
        "environment": {
            "UTCP_CONFIG_FILE": ".utcp_config.json"
        }
    }'
    
    if json_set_value "${config_file}" ".mcp.${MCP_NAME}" "${mcp_config}"; then
        # Validate the result
        if json_validate "${config_file}"; then
            log_success "Added ${MCP_DISPLAY_NAME} to opencode.json"
            return 0
        else
            log_error "JSON validation failed after modification"
            return 1
        fi
    else
        log_error "Failed to add ${MCP_DISPLAY_NAME} to opencode.json"
        return 1
    fi
}

verify_installation() {
    log_step "5" "Verifying installation..."

    local project_root
    project_root=$(find_project_root) || return 1
    local mcp_server_dir="${project_root}/.opencode/skill/mcp-code-mode/mcp_server"
    local entry_point="${mcp_server_dir}/dist/index.js"

    if [[ "${DRY_RUN}" == "true" ]]; then
        log_info "[DRY-RUN] Would verify: ${entry_point} exists"
        return 0
    fi

    # Check if the embedded MCP server exists
    if [[ ! -d "${mcp_server_dir}" ]]; then
        log_error "MCP server directory not found: ${mcp_server_dir}"
        log_info "This script requires the mcp-code-mode skill to be bundled in the project"
        log_info "Alternative: Use 'npx @utcp/code-mode-mcp' directly in opencode.json"
        return 1
    fi

    # Check if node_modules exists, if not run npm install
    if [[ ! -d "${mcp_server_dir}/node_modules" ]]; then
        log_info "Installing dependencies in ${mcp_server_dir}..."
        if ! (cd "${mcp_server_dir}" && npm install --silent); then
            log_error "Failed to install dependencies"
            return 1
        fi
        log_success "Dependencies installed"
    fi

    # Check if dist/index.js exists
    if [[ ! -f "${entry_point}" ]]; then
        log_error "Entry point not found: ${entry_point}"
        log_info "The MCP server may need to be built first"
        return 1
    fi

    log_success "Embedded MCP server verified at: ${entry_point}"
    return 0
}

print_summary() {
    local project_root
    project_root=$(find_project_root 2>/dev/null) || project_root="."

    echo ""
    echo "───────────────────────────────────────────────────────────────────"
    log_success "${MCP_DISPLAY_NAME} installation complete!"
    echo "───────────────────────────────────────────────────────────────────"
    echo ""
    echo "Configuration files:"
    echo "  - opencode.json     : MCP server entry added (embedded source)"
    echo "  - .utcp_config.json : UTCP configuration (add MCP tools here)"
    echo "  - .env.example      : API key templates"
    echo ""
    echo "MCP Server location:"
    echo "  - .opencode/skill/mcp-code-mode/mcp_server/dist/index.js"
    echo ""
    echo "Next steps:"
    echo "  1. Copy API keys from .env.example to .env"
    echo "  2. Add MCP tool providers to .utcp_config.json as needed"
    echo "  3. Restart OpenCode to load the new MCP server"
    echo ""
    echo "Usage in OpenCode:"
    echo "  - call_tool_chain()  : Execute TypeScript with access to registered tools"
    echo "  - search_tools()     : Find tools by task description"
    echo "  - list_tools()       : List all registered tools"
    echo ""
    echo "Documentation: https://github.com/universal-tool-calling-protocol/code-mode"
    echo ""
}

# ───────────────────────────────────────────────────────────────
# 6. MAIN
# ───────────────────────────────────────────────────────────────
main() {
    echo ""
    echo "───────────────────────────────────────────────────────────────────"
    log_info "Installing ${MCP_DISPLAY_NAME} MCP Server"
    echo "───────────────────────────────────────────────────────────────────"
    echo ""
    
    if [[ "${DRY_RUN}" == "true" ]]; then
        log_warn "DRY-RUN MODE - No changes will be made"
        echo ""
    fi
    
    # Step 1: Check prerequisites
    if ! check_prerequisites; then
        log_error "Prerequisites not met. Please install required dependencies."
        exit 1
    fi
    
    # Step 2: Create .utcp_config.json
    if ! create_utcp_config; then
        log_error "Failed to create .utcp_config.json"
        exit 1
    fi
    
    # Step 3: Create/update .env.example
    if ! create_env_example; then
        log_error "Failed to create .env.example"
        exit 1
    fi
    
    # Step 4: Add to opencode.json
    if ! add_to_opencode_json; then
        log_error "Failed to update opencode.json"
        exit 1
    fi
    
    # Step 5: Verify installation
    if [[ "${SKIP_VERIFY}" == "true" ]]; then
        log_info "Skipping verification (--skip-verify)"
    elif ! verify_installation; then
        log_warn "Installation completed but verification failed"
        log_info "The package may still work - try restarting OpenCode"
    fi
    
    # Print summary
    if [[ "${DRY_RUN}" != "true" ]]; then
        print_summary
    else
        echo ""
        log_info "[DRY-RUN] Complete - no changes were made"
        echo ""
    fi
    
    exit 0
}

main "$@"
