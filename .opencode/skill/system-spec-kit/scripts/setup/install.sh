#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: SPEC KIT MEMORY MCP INSTALLER
# ───────────────────────────────────────────────────────────────
# Install and configure the Spec Kit Memory MCP Server.
# Provides semantic vector search for conversation context,
# decisions, and session memories. Enables context preservation
# across sessions with constitutional tier priorities.

set -euo pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/_utils.sh"

# ───────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ───────────────────────────────────────────────────────────────
readonly MCP_NAME="spec_kit_memory"
readonly MCP_DISPLAY_NAME="Spec Kit Memory"
readonly SPEC_KIT_ROOT_DIR=".opencode/skill/system-spec-kit"
readonly MCP_SERVER_DIR="${SPEC_KIT_ROOT_DIR}/mcp_server"
readonly MCP_SERVER_SCRIPT="dist/context-server.js"
readonly MCP_CANONICAL_DB_PATH="${MCP_SERVER_DIR}/dist/database/context-index.sqlite"
readonly MIN_NODE_VERSION="18"
SKIP_VERIFY="${SKIP_VERIFY:-false}"

# ───────────────────────────────────────────────────────────────
# 2. FUNCTIONS
# ───────────────────────────────────────────────────────────────

install_mcp() {
    log_step "Checking prerequisites..."

    # Log Node.js environment for diagnostics
    log_info "Node.js version: $(node --version)"
    log_info "Node.js MODULE_VERSION: $(node -e 'console.log(process.versions.modules)')"
    log_info "Node.js path: $(which node)"

    local project_root
    project_root=$(get_project_root) || exit 1
    local spec_root="${project_root}/${SPEC_KIT_ROOT_DIR}"
    local server_dir="${project_root}/${MCP_SERVER_DIR}"
    local server_script_path="${server_dir}/${MCP_SERVER_SCRIPT}"

    # Check if spec-kit root exists
    if [[ ! -d "${spec_root}" ]]; then
        log_error "Spec Kit root directory not found: ${spec_root}"
        log_info "Ensure .opencode/skill/system-spec-kit exists in your project."
        exit 1
    fi

    # Check if server directory exists
    if [[ ! -d "${server_dir}" ]]; then
        log_error "Spec Kit Memory server directory not found: ${server_dir}"
        log_info "This MCP is bundled with the project. Ensure .opencode/skill/system-spec-kit exists."
        exit 1
    fi

    # Check if workspace package.json exists
    if [[ ! -f "${spec_root}/package.json" ]]; then
        log_error "package.json not found in ${spec_root}"
        exit 1
    fi

    # Check if package.json exists
    if [[ ! -f "${server_dir}/package.json" ]]; then
        log_error "package.json not found in ${server_dir}"
        exit 1
    fi

    # Clear stale HuggingFace model cache to prevent version mismatches
    local hf_cache_dir="${server_dir}/node_modules/@huggingface/transformers/.cache"
    if [[ -d "${hf_cache_dir}" ]]; then
        log_info "Clearing stale HuggingFace model cache..."
        rm -rf "${hf_cache_dir}" 2>/dev/null || true
    fi

    # Remove native modules before install to prevent ERR_DLOPEN_FAILED
    log_info "Removing stale native modules..."
    for mod_dir in "${server_dir}/node_modules/better-sqlite3" "${server_dir}/node_modules/sqlite-vec"; do
        if [[ -d "${mod_dir}" ]]; then
            rm -rf "${mod_dir}" 2>/dev/null || true
        fi
    done

    # Install dependencies from workspace root (covers shared + mcp_server + scripts)
    log_step "Installing dependencies from spec-kit root..."
    (
        cd "${spec_root}"
        npm install --silent 2>/dev/null || npm install
    )

    if [[ $? -eq 0 ]]; then
        log_success "Dependencies installed successfully"
    else
        log_error "Failed to install dependencies"
        exit 1
    fi

    # Build TypeScript from workspace root; if strict build fails, use fallback
    log_step "Building TypeScript workspace..."
    if (
        cd "${spec_root}"
        npm run build
    ); then
        log_success "TypeScript build completed via npm run build"
    else
        log_warn "npm run build failed - retrying with fallback: npx tsc --build --noCheck --force"
        (
            cd "${spec_root}"
            npx tsc --build --noCheck --force
        )
        log_success "TypeScript build completed via fallback"
    fi

    # Check native modules and auto-rebuild if probe reports failures
    log_step "Checking native module health..."
    local native_check_output
    native_check_output="$(
        cd "${spec_root}"
        bash scripts/setup/check-native-modules.sh 2>&1 || true
    )"
    printf '%s\n' "${native_check_output}"

    if [[ "${native_check_output}" == *"[FAIL]"* ]]; then
        log_warn "Native module probe reported failures - running rebuild script"
        (
            cd "${spec_root}"
            printf 'n\n' | bash scripts/setup/rebuild-native-modules.sh
        )

        local native_recheck_output
        native_recheck_output="$(
            cd "${spec_root}"
            bash scripts/setup/check-native-modules.sh 2>&1 || true
        )"
        printf '%s\n' "${native_recheck_output}"

        if [[ "${native_recheck_output}" == *"[FAIL]"* ]]; then
            log_error "Native modules still failing after rebuild"
            exit 1
        fi
    fi

    # Verify the server script exists
    if [[ ! -f "${server_script_path}" ]]; then
        log_error "Server script not found: ${server_script_path}"
        log_info "Try building manually: cd ${spec_root} && npx tsc --build --noCheck --force"
        exit 1
    fi

    log_success "Server script verified: ${MCP_SERVER_SCRIPT}"

    # Run startup smoke test using delayed stdin close (stdio MCP pattern)
    log_step "Running context-server startup smoke test..."
    if (
        cd "${spec_root}"
        (sleep 3) | node "${server_script_path}" >/dev/null 2>&1
    ); then
        log_success "Context server startup smoke test passed"
    else
        log_error "Context server startup smoke test failed"
        exit 1
    fi
}

configure_mcp() {
    log_step "Configuring ${MCP_DISPLAY_NAME}..."
    
    local project_root
    project_root=$(get_project_root) || exit 1
    local config_file="${project_root}/opencode.json"
    
    # Check if already configured
    if mcp_entry_exists "${config_file}" "${MCP_NAME}"; then
        log_info "${MCP_DISPLAY_NAME} is already configured in opencode.json"
        return 0
    fi
    
    # Validate config file before modification
    if ! json_validate "${config_file}"; then
        log_error "opencode.json is invalid. Please fix it first."
        exit 1
    fi
    
    # Add MCP entry with relative path (portable)
    local mcp_config='{
        "type": "local",
        "command": ["node", "'"${MCP_SERVER_DIR}/${MCP_SERVER_SCRIPT}"'"],
        "environment": {
            "EMBEDDINGS_PROVIDER": "hf-local",
            "MEMORY_DB_PATH": ".opencode/skill/system-spec-kit/mcp_server/dist/database/context-index.sqlite",
            "_NOTE_1_DATABASE": "Stores vectors in: .opencode/skill/system-spec-kit/mcp_server/dist/database/context-index.sqlite",
            "_NOTE_2_PROVIDERS": "Supports: Voyage (1024 dims), OpenAI (1536/3072 dims), HF Local (768 dims, no API needed)",
            "_NOTE_3_CLOUD_PROVIDERS": "For cloud embeddings: add VOYAGE_API_KEY or OPENAI_API_KEY and set EMBEDDINGS_PROVIDER accordingly",
            "_NOTE_4_PORTABLE": "Uses relative path - works when copying project to new location",
            "_NOTE_5_FEATURE_FLAGS": "Opt-out flags: SPECKIT_EXTENDED_TELEMETRY (default ON), SPECKIT_ADAPTIVE_FUSION (default OFF)"
        }
    }'
    
    if add_mcp_entry "${config_file}" "${MCP_NAME}" "${mcp_config}"; then
        log_success "Added ${MCP_DISPLAY_NAME} to opencode.json"
    else
        log_error "Failed to add ${MCP_DISPLAY_NAME} to opencode.json"
        exit 1
    fi
    
    # Validate config file after modification
    if ! json_validate "${config_file}"; then
        log_error "opencode.json became invalid after modification"
        exit 1
    fi
}

verify_installation() {
    if [[ "${SKIP_VERIFY}" == "true" ]]; then
        log_info "Skipping verification (--skip-verify)"
        return 0
    fi
    
    log_step "Verifying installation..."
    
    local project_root
    project_root=$(get_project_root) || exit 1
    local server_path="${project_root}/${MCP_SERVER_DIR}/${MCP_SERVER_SCRIPT}"
    
    # Verify server script can be loaded (syntax check)
    if node -c "${server_path}" 2>/dev/null; then
        log_success "Server script syntax verified"
    else
        log_warn "Server script syntax check failed (may still work)"
    fi
    
    # Verify node_modules exist in mcp_server
    if [[ -d "${project_root}/${MCP_SERVER_DIR}/node_modules" ]]; then
        log_success "Dependencies verified"
    else
        log_warn "node_modules not found in ${MCP_SERVER_DIR}"
    fi
    
    # Verify config entry exists
    local config_file="${project_root}/opencode.json"
    
    if mcp_entry_exists "${config_file}" "${MCP_NAME}"; then
        log_success "Configuration verified in opencode.json"
    else
        log_error "Configuration not found in opencode.json"
        return 1
    fi
    
    # Note about database creation (canonical runtime path)
    local canonical_db_path="${project_root}/${MCP_CANONICAL_DB_PATH}"
    if [[ -f "${canonical_db_path}" ]]; then
        log_info "Database already exists at canonical path: ${canonical_db_path}"
    else
        log_info "Database will be created on first use at: ${canonical_db_path}"
    fi

    local compatibility_db_path="${project_root}/${MCP_SERVER_DIR}/database/context-index.sqlite"
    if [[ -L "${compatibility_db_path}" ]]; then
        log_info "Compatibility symlink present: ${compatibility_db_path}"
    fi
}

show_help() {
    cat << EOF
Usage: $(basename "$0") [OPTIONS]

Install ${MCP_DISPLAY_NAME} MCP Server

${MCP_DISPLAY_NAME} provides semantic vector search for conversation context,
decisions, and session memories. It enables context preservation across
sessions with constitutional tier priorities.

Features:
    - Semantic search via vector embeddings
    - Multiple embedding providers (Voyage, OpenAI, local HF)
    - Constitutional tier memories (always surface first)
    - Checkpoint save/restore
    - Trigger phrase matching
    - Causal graph retrieval tools (drift tracing, causal links, causal stats, causal unlink)
    - Graph-guided MMR reranking with intent-mapped lambda values
    - Structural authority propagation (cross-encoder reranking)
    - Feature flag system (5 opt-out flags for graph, telemetry, fusion)
    - Phase system support (recursive validation, phase detection scoring)

Options:
    -h, --help      Show this help message
    -v, --verbose   Enable verbose output
    --skip-verify   Skip verification step

Examples:
    $(basename "$0")              # Standard installation
    $(basename "$0") --verbose    # With detailed output
    $(basename "$0") --skip-verify # Skip verification

Requirements:
    - Node.js ${MIN_NODE_VERSION}+
    - npm

Embedding Providers (auto-detected in order):
    1. Voyage AI (VOYAGE_API_KEY) - Recommended, 8% better than OpenAI
    2. OpenAI (OPENAI_API_KEY)
    3. Local Hugging Face (no API key needed, default fallback)

After installation:
    Restart OpenCode to load the new MCP server.
    Set VOYAGE_API_KEY or OPENAI_API_KEY for better embeddings (optional).

EOF
}

# ───────────────────────────────────────────────────────────────
# 3. MAIN
# ───────────────────────────────────────────────────────────────
main() {
    echo ""
    echo "───────────────────────────────────────"
    echo "  ${MCP_DISPLAY_NAME} MCP Installer"
    echo "───────────────────────────────────────"
    echo ""
    
    log_info "Installing ${MCP_DISPLAY_NAME} MCP Server..."
    echo ""
    
    # Prerequisites
    check_node_version "${MIN_NODE_VERSION}" || exit 1
    check_npm || exit 1
    check_npx || exit 1
    echo ""
    
    # Install/build/recover from spec-kit workspace root
    install_mcp
    echo ""
    
    # Configure opencode.json
    configure_mcp
    echo ""
    
    # Verify
    verify_installation
    echo ""
    
    echo "───────────────────────────────────────"
    log_success "${MCP_DISPLAY_NAME} MCP installed successfully!"
    echo "───────────────────────────────────────"
    echo ""
    log_info "Next steps:"
    echo "  1. Restart OpenCode to load the new MCP"
    echo "  2. (Optional) Set VOYAGE_API_KEY for better embeddings"
    echo "  3. Use memory_search, memory_save, memory_context tools for context preservation"
    echo "  4. (Optional) Run check-links.sh to validate markdown links"
    echo ""
}

# Parse arguments
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

main "$@"
