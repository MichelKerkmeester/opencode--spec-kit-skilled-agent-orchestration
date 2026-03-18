#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: CODE MODE MCP UPDATER
# ───────────────────────────────────────────────────────────────
# Update Code Mode MCP to latest version via npm.
# Override install path: export CODE_MODE_DIR="/path/to/your/code-mode"

set -euo pipefail


# ───────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ───────────────────────────────────────────────────────────────

readonly CODE_MODE_DIR="${CODE_MODE_DIR:-$HOME/code-mode-mcp}"


# ───────────────────────────────────────────────────────────────
# 2. FUNCTIONS
# ───────────────────────────────────────────────────────────────

check_npm() {
    if ! command -v npm &> /dev/null; then
        echo "Error: npm is not installed" >&2
        echo "Install Node.js from https://nodejs.org or via: brew install node" >&2
        exit 1
    fi
}

install_fresh() {
    echo "Code Mode directory not found at: ${CODE_MODE_DIR}" >&2
    echo ""
    echo "Options:"
    echo "  1. Set CODE_MODE_DIR to your installation path:"
    echo "     export CODE_MODE_DIR=\"/path/to/code-mode\""
    echo ""
    echo "  2. Install Code Mode fresh:"
    echo "     mkdir -p \"${CODE_MODE_DIR}\""
    echo "     cd \"${CODE_MODE_DIR}\""
    echo "     npm init -y"
    echo "     npm install @utcp/code-mode-mcp"
    echo ""

    read -p "Would you like to install Code Mode now? [y/N] " -n 1 -r
    echo
    if [[ "${REPLY:-}" =~ ^[Yy]$ ]]; then
        echo "Installing Code Mode..."
        mkdir -p "${CODE_MODE_DIR}"
        cd "${CODE_MODE_DIR}"
        npm init -y > /dev/null 2>&1
        npm install @utcp/code-mode-mcp
        echo ""
        echo "Installation complete!"
    else
        echo "Aborted." >&2
        exit 1
    fi
}

update_existing() {
    echo "Code Mode directory: ${CODE_MODE_DIR}"
    echo ""

    cd "${CODE_MODE_DIR}"

    if [[ -f "node_modules/@utcp/code-mode-mcp/package.json" ]]; then
        local current_version
        current_version=$(node -p "require('./node_modules/@utcp/code-mode-mcp/package.json').version" 2>/dev/null || echo "unknown")
        echo "Current version: ${current_version}"
    fi

    echo ""
    echo "Updating @utcp/code-mode-mcp..."
    npm update @utcp/code-mode-mcp

    if [[ -f "node_modules/@utcp/code-mode-mcp/package.json" ]]; then
        local new_version
        new_version=$(node -p "require('./node_modules/@utcp/code-mode-mcp/package.json').version" 2>/dev/null || echo "unknown")
        echo ""
        echo "Updated version: ${new_version}"
    fi
}

verify_installation() {
    echo ""
    echo "Verifying installation..."

    local mcp_entry="${CODE_MODE_DIR}/node_modules/@utcp/code-mode-mcp/dist/index.js"
    if [[ -f "${mcp_entry}" ]]; then
        echo "  MCP entry point: ${mcp_entry}"
    else
        echo "  Warning: MCP entry point not found at expected location" >&2
        echo "  Looking for alternatives..." >&2
        find "${CODE_MODE_DIR}/node_modules/@utcp" -name "index.js" -type f 2>/dev/null | head -5
    fi

    echo ""
    echo "Checking .utcp_config.json..."
    if [[ -f ".utcp_config.json" ]]; then
        echo "  Config found: ${CODE_MODE_DIR}/.utcp_config.json"

        if node -e "JSON.parse(require('fs').readFileSync('.utcp_config.json'))" 2>/dev/null; then
            echo "  Config valid: Yes"
        else
            echo "  Config valid: No (JSON parse error)" >&2
        fi
    else
        echo "  Warning: .utcp_config.json not found" >&2
        echo "  Create one using the template in:" >&2
        echo "  .opencode/skill/mcp-code-mode/assets/config_template.md" >&2
    fi
}

print_config_reminder() {
    echo ""
    echo "=== Update complete! ==="
    echo ""
    echo "Remember to update opencode.json if the path changed:"
    echo ""
    echo '  "code_mode": {'
    echo '    "type": "local",'
    echo "    \"command\": [\"node\", \"${CODE_MODE_DIR}/node_modules/@utcp/code-mode-mcp/dist/index.js\"],"
    echo '    "environment": {'
    echo "      \"UTCP_CONFIG_FILE\": \"${CODE_MODE_DIR}/.utcp_config.json\""
    echo '    },'
    echo '    "enabled": true'
    echo '  }'
}


# ───────────────────────────────────────────────────────────────
# 3. MAIN
# ───────────────────────────────────────────────────────────────

echo "=== Code Mode MCP Update Script ==="
echo ""

check_npm

if [[ ! -d "${CODE_MODE_DIR}" ]]; then
    install_fresh
else
    update_existing
fi

verify_installation
print_config_reminder
