#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: CLICKUP MCP INSTALLER
# ───────────────────────────────────────────────────────────────
# Installs the ClickUp CLI (cu) and configures the ClickUp MCP
# server for Code Mode integration.
#
# Usage:
#   ./install-clickup.sh [OPTIONS]
#
# Options:
#   -h, --help       Show this help message
#   -v, --verbose    Enable verbose output
#   --skip-verify    Skip verification step
#   --force          Force reinstallation even if already installed
#   --cli-only       Install CLI only (skip MCP config)
#   --mcp-only       Configure MCP only (skip CLI install)

set -euo pipefail
IFS=$'\n\t'

# ───────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ───────────────────────────────────────────────────────────────
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/_utils.sh"

readonly MCP_NAME="ClickUp"
readonly CLI_PACKAGE="@krodak/clickup-cli"
readonly CLI_COMMAND="cu"
readonly MCP_PACKAGE="@taazkareem/clickup-mcp-server"
readonly MIN_NODE_VERSION_CLI="22"
readonly MIN_NODE_VERSION_MCP="18"

# Script options (mutable, set via CLI flags)
VERBOSE="${VERBOSE:-false}"
SKIP_VERIFY="${SKIP_VERIFY:-false}"
FORCE_INSTALL="${FORCE_INSTALL:-false}"
CLI_ONLY="${CLI_ONLY:-false}"
MCP_ONLY="${MCP_ONLY:-false}"

# ───────────────────────────────────────────────────────────────
# 2. HELP
# ───────────────────────────────────────────────────────────────
show_help() {
    cat << EOF
${MCP_NAME} Install Script
───────────────────────────

Installs the ClickUp CLI (cu) and configures ClickUp MCP for Code Mode.

USAGE:
    $(basename "$0") [OPTIONS]

OPTIONS:
    -h, --help       Show this help message
    -v, --verbose    Enable verbose output
    --skip-verify    Skip verification step
    --force          Force reinstallation even if already installed
    --cli-only       Install CLI only (skip MCP configuration)
    --mcp-only       Configure MCP only (skip CLI installation)

WHAT THIS SCRIPT DOES:
    1. Checks prerequisites (Node.js, npm)
    2. Installs ClickUp CLI globally via npm (Node >= 22 required)
    3. Prompts for API token and Team ID
    4. Configures CLI via cu init or environment variables
    5. Verifies ClickUp MCP entry in .utcp_config.json
    6. Adds credentials to .env for Code Mode
    7. Verifies installation

REQUIREMENTS:
    - CLI: Node.js >= 22.0.0
    - MCP: Node.js >= 18.0.0 (via Code Mode)
    - ClickUp API token (from Settings > Apps > API Token)
    - ClickUp Team ID (from Settings > Workspaces)

EXAMPLES:
    # Install everything (CLI + MCP config)
    ./install-clickup.sh

    # Install CLI only
    ./install-clickup.sh --cli-only

    # Configure MCP only (CLI already installed or not needed)
    ./install-clickup.sh --mcp-only

    # Force reinstall with verbose output
    ./install-clickup.sh --force --verbose

EOF
}

# ───────────────────────────────────────────────────────────────
# 3. CLI DETECTION
# ───────────────────────────────────────────────────────────────

# Check if the cu command is the ClickUp CLI (not UUCP)
is_clickup_cli() {
    if ! command -v "$CLI_COMMAND" &> /dev/null; then
        return 1
    fi

    local version_output
    version_output=$("$CLI_COMMAND" --version 2>&1 || true)

    # System cu (UUCP) outputs "cu (Taylor UUCP)"
    if echo "$version_output" | grep -qi "UUCP\|Taylor"; then
        return 1
    fi

    return 0
}

# Check if npm global bin is in PATH before /usr/bin
npm_global_bin_first() {
    local npm_bin
    npm_bin=$(npm config get prefix 2>/dev/null)/bin

    # Check if npm bin dir exists and is in PATH before /usr/bin
    if [[ -d "$npm_bin" ]]; then
        local path_before_usr
        path_before_usr=$(echo "$PATH" | tr ':' '\n' | grep -n "$npm_bin" | head -1 | cut -d: -f1)
        local usr_bin_pos
        usr_bin_pos=$(echo "$PATH" | tr ':' '\n' | grep -n "^/usr/bin$" | head -1 | cut -d: -f1)

        if [[ -n "$path_before_usr" && -n "$usr_bin_pos" && "$path_before_usr" -lt "$usr_bin_pos" ]]; then
            return 0
        fi
    fi
    return 1
}

# ───────────────────────────────────────────────────────────────
# 4. INSTALLATION FUNCTIONS
# ───────────────────────────────────────────────────────────────

# Install the CLI package
install_cli() {
    log_step "Installing ${CLI_PACKAGE}..."

    # Check Node version for CLI (requires 22+)
    if ! check_node_version "$MIN_NODE_VERSION_CLI"; then
        log_warn "Node.js >= ${MIN_NODE_VERSION_CLI} required for CLI"
        log_info "CLI installation skipped. MCP still works with Node >= ${MIN_NODE_VERSION_MCP}"
        return 1
    fi

    if npm install -g "${CLI_PACKAGE}"; then
        log_success "Installed ${CLI_PACKAGE}"
        return 0
    else
        log_error "Failed to install ${CLI_PACKAGE}"
        log_info "Try running: sudo npm install -g ${CLI_PACKAGE}"
        return 1
    fi
}

# Configure CLI credentials
configure_cli() {
    log_step "Configuring ClickUp CLI..."

    # Check if already configured
    local config_file="${HOME}/.config/cu/config.json"
    if [[ -f "$config_file" ]]; then
        log_info "CLI config already exists at ${config_file}"
        if [[ "$FORCE_INSTALL" != "true" ]]; then
            log_info "Skipping CLI configuration (use --force to reconfigure)"
            return 0
        fi
    fi

    # Prompt for credentials
    echo ""
    log_info "ClickUp API Token: Get from ClickUp Settings > Apps > API Token"
    local api_token
    api_token=$(prompt_secret "Enter ClickUp API token (pk_...)")

    if [[ -z "$api_token" ]]; then
        log_warn "No API token provided, skipping CLI configuration"
        log_info "Run 'cu init' later to configure"
        return 0
    fi

    log_info "ClickUp Team ID: Get from ClickUp Settings > Workspaces"
    local team_id
    team_id=$(prompt_value "Enter ClickUp Team ID")

    if [[ -z "$team_id" ]]; then
        log_warn "No Team ID provided, skipping CLI configuration"
        return 0
    fi

    # Write config
    ensure_dir "$(dirname "$config_file")"
    cat > "$config_file" << CONFEOF
{
  "apiToken": "${api_token}",
  "teamId": "${team_id}"
}
CONFEOF

    log_success "CLI configured at ${config_file}"

    # Also set env vars for current session
    export CU_API_TOKEN="$api_token"
    export CU_TEAM_ID="$team_id"

    return 0
}

# Configure MCP credentials in .env
configure_mcp_env() {
    log_step "Configuring MCP credentials..."

    local project_root
    project_root="$(find_project_root 2>/dev/null)" || project_root="."
    local env_file="${project_root}/.env"

    # Check if already configured
    if env_has_var "$env_file" "clickup_CLICKUP_API_KEY"; then
        log_info "MCP credentials already in .env"
        if [[ "$FORCE_INSTALL" != "true" ]]; then
            log_info "Skipping MCP credential setup (use --force to reconfigure)"
            return 0
        fi
    fi

    # Try to reuse CLI credentials if available
    local api_token=""
    local team_id=""

    if [[ -n "${CU_API_TOKEN:-}" ]]; then
        api_token="$CU_API_TOKEN"
        team_id="${CU_TEAM_ID:-}"
        log_info "Reusing credentials from CLI configuration"
    else
        echo ""
        log_info "ClickUp API Token: Get from ClickUp Settings > Apps > API Token"
        api_token=$(prompt_secret "Enter ClickUp API token (pk_...)")

        if [[ -z "$api_token" ]]; then
            log_warn "No API token provided, skipping MCP credential setup"
            return 0
        fi

        log_info "ClickUp Team ID: Get from ClickUp Settings > Workspaces"
        team_id=$(prompt_value "Enter ClickUp Team ID")
    fi

    # Add to .env with Code Mode prefix
    if [[ -n "$api_token" ]]; then
        env_add_var "$env_file" "clickup_CLICKUP_API_KEY" "$api_token"
        log_success "Added clickup_CLICKUP_API_KEY to .env"
    fi

    if [[ -n "$team_id" ]]; then
        env_add_var "$env_file" "clickup_CLICKUP_TEAM_ID" "$team_id"
        log_success "Added clickup_CLICKUP_TEAM_ID to .env"
    fi

    return 0
}

# Verify MCP config exists in .utcp_config.json
verify_mcp_config() {
    log_step "Checking MCP configuration..."

    local project_root
    project_root="$(find_project_root 2>/dev/null)" || project_root="."
    local utcp_config="${project_root}/.utcp_config.json"

    if [[ ! -f "$utcp_config" ]]; then
        log_warn ".utcp_config.json not found"
        log_info "ClickUp MCP entry needs to be added to .utcp_config.json"
        log_info "See INSTALL_GUIDE.md for manual configuration"
        return 1
    fi

    # Check if clickup entry exists
    if check_jq; then
        if jq -e '.manual_call_templates[] | select(.name == "clickup")' "$utcp_config" &>/dev/null; then
            log_success "ClickUp MCP entry found in .utcp_config.json"
            return 0
        fi
    else
        if grep -q '"clickup"' "$utcp_config"; then
            log_success "ClickUp MCP entry found in .utcp_config.json"
            return 0
        fi
    fi

    log_warn "ClickUp MCP entry not found in .utcp_config.json"
    if confirm "Add ClickUp MCP entry to .utcp_config.json?"; then
        json_add_utcp_entry \
            "clickup" \
            "stdio" \
            "npx" \
            '["-y", "@taazkareem/clickup-mcp-server@latest"]' \
            '{"CLICKUP_API_KEY": "${CLICKUP_API_KEY}", "CLICKUP_TEAM_ID": "${CLICKUP_TEAM_ID}"}'
        return $?
    fi

    return 1
}

# Verify the CLI installation
verify_cli() {
    log_step "Verifying CLI installation..."

    if ! is_clickup_cli; then
        if command -v "$CLI_COMMAND" &> /dev/null; then
            log_warn "Found system 'cu' (UUCP) instead of ClickUp CLI"
            log_info "The ClickUp CLI may be installed but shadowed by /usr/bin/cu"

            local npm_bin
            npm_bin=$(npm config get prefix 2>/dev/null)/bin
            if [[ -x "${npm_bin}/cu" ]]; then
                log_info "ClickUp CLI found at: ${npm_bin}/cu"
                log_warn "Add ${npm_bin} before /usr/bin in your PATH"
                log_info "Run: echo 'export PATH=\"${npm_bin}:\$PATH\"' >> ~/.zshrc && source ~/.zshrc"
            fi
        else
            log_error "ClickUp CLI not found"
        fi
        return 1
    fi

    local version
    version=$("$CLI_COMMAND" --version 2>&1 || echo "unknown")
    log_success "ClickUp CLI version: ${version}"

    # Test authentication
    if "$CLI_COMMAND" auth &>/dev/null; then
        log_success "CLI authentication verified"
    else
        log_warn "CLI authentication failed (run 'cu init' to configure)"
    fi

    return 0
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
            -v|--verbose)
                VERBOSE="true"
                ;;
            --skip-verify)
                SKIP_VERIFY="true"
                ;;
            --force)
                FORCE_INSTALL="true"
                ;;
            --cli-only)
                CLI_ONLY="true"
                ;;
            --mcp-only)
                MCP_ONLY="true"
                ;;
            *)
                log_error "Unknown option: $1"
                show_help
                exit 1
                ;;
        esac
        shift
    done

    echo ""
    echo "───────────────────────────────────────────────"
    echo "  ${MCP_NAME} Installation"
    echo "───────────────────────────────────────────────"
    echo ""

    # Step 1: Check prerequisites
    log_step "Checking prerequisites..."

    if ! check_npm; then
        exit 1
    fi

    # Step 2: CLI Installation (unless --mcp-only)
    if [[ "$MCP_ONLY" != "true" ]]; then
        log_step "Setting up ClickUp CLI..."

        local cli_installed=false

        # Check existing installation
        if is_clickup_cli; then
            log_info "ClickUp CLI is already installed"
            if [[ "$FORCE_INSTALL" == "true" ]]; then
                log_info "Force reinstalling..."
                install_cli && cli_installed=true
            else
                cli_installed=true
                log_info "Skipping CLI install (use --force to reinstall)"
            fi
        else
            install_cli && cli_installed=true
        fi

        # Configure CLI if installed
        if [[ "$cli_installed" == "true" ]]; then
            configure_cli
        fi
    fi

    # Step 3: MCP Configuration (unless --cli-only)
    if [[ "$CLI_ONLY" != "true" ]]; then
        log_step "Setting up ClickUp MCP..."

        # Check Node version for MCP
        if ! check_node_version "$MIN_NODE_VERSION_MCP"; then
            log_error "Node.js >= ${MIN_NODE_VERSION_MCP} required for MCP"
            exit 1
        fi

        # Verify .utcp_config.json has clickup entry
        verify_mcp_config

        # Configure credentials in .env
        configure_mcp_env
    fi

    # Step 4: Verification
    if [[ "$SKIP_VERIFY" != "true" ]]; then
        echo ""
        log_step "Running verification..."

        if [[ "$MCP_ONLY" != "true" ]]; then
            verify_cli || true
        fi

        # Check PATH if system cu shadows ClickUp CLI
        if ! npm_global_bin_first 2>/dev/null; then
            local npm_bin
            npm_bin=$(npm config get prefix 2>/dev/null)/bin
            if [[ -x "${npm_bin}/cu" ]]; then
                log_warn "npm global bin may be shadowed by /usr/bin/cu"
                log_info "Ensure ${npm_bin} is before /usr/bin in PATH"
            fi
        fi
    else
        log_info "Skipping verification (--skip-verify)"
    fi

    # Success summary
    echo ""
    echo "───────────────────────────────────────────────"
    echo "  Installation Complete!"
    echo "───────────────────────────────────────────────"
    echo ""
    log_success "${MCP_NAME} integration is ready"
    echo ""

    if [[ "$MCP_ONLY" != "true" ]]; then
        echo "CLI Quick Start:"
        echo "  cu tasks                  # List your tasks"
        echo "  cu sprint                 # Current sprint"
        echo "  cu summary                # Sprint standup"
        echo "  cu create -n \"Name\" -l ID # Create task"
        echo ""
    fi

    if [[ "$CLI_ONLY" != "true" ]]; then
        echo "MCP Quick Start (via Code Mode):"
        echo "  search_tools(\"clickup\")   # Discover tools"
        echo "  clickup.clickup_get_workspace({})  # Get workspace"
        echo ""
    fi

    echo "Documentation:"
    echo "  .opencode/install_guides/MCP - ClickUp.md"
    echo "  .opencode/skill/mcp-clickup/SKILL.md"
    echo ""
}

# Run main
main "$@"
