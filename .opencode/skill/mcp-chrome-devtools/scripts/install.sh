#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: CHROME DEVTOOLS MCP INSTALLER
# ───────────────────────────────────────────────────────────────
# Installs the bdg CLI (browser-debugger-cli) for Chrome DevTools
# MCP integration with browser debugging capabilities.
#
# Usage:
#   ./install-chrome-devtools.sh [OPTIONS]
#
# Options:
#   -h, --help       Show this help message
#   -v, --verbose    Enable verbose output
#   --skip-verify    Skip verification step
#   --force          Force reinstallation even if already installed
#   --add-profile    Add CHROME_PATH to shell profile if not at default location

set -euo pipefail
IFS=$'\n\t'

# ───────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ───────────────────────────────────────────────────────────────
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/_utils.sh"

readonly MCP_NAME="Chrome DevTools"
readonly MCP_PACKAGE="browser-debugger-cli@alpha"
readonly CLI_COMMAND="bdg"
readonly MIN_NODE_VERSION="18"

# Script options (mutable, set via CLI flags)
VERBOSE="${VERBOSE:-false}"
SKIP_VERIFY="${SKIP_VERIFY:-false}"
FORCE_INSTALL="${FORCE_INSTALL:-false}"
ADD_PROFILE="${ADD_PROFILE:-false}"

# ───────────────────────────────────────────────────────────────
# 2. HELP
# ───────────────────────────────────────────────────────────────
show_help() {
    cat << EOF
${MCP_NAME} Install Script
───────────────────────────

Installs the browser-debugger-cli (bdg) for Chrome DevTools integration.

USAGE:
    $(basename "$0") [OPTIONS]

OPTIONS:
    -h, --help       Show this help message
    -v, --verbose    Enable verbose output
    --skip-verify    Skip verification step
    --force          Force reinstallation even if already installed
    --add-profile    Add CHROME_PATH to shell profile if needed

WHAT THIS SCRIPT DOES:
    1. Checks prerequisites (Node.js 18+, npm)
    2. Installs browser-debugger-cli globally via npm
    3. Detects Chrome path on your system
    4. Optionally adds CHROME_PATH to shell profile
    5. Verifies installation with 'bdg --version'

PLATFORM SUPPORT:
    - macOS: Native support (recommended)
    - Linux: Native support (may need sandbox config)
    - Windows: WSL only (PowerShell/Git Bash NOT supported)

EXAMPLES:
    # Basic installation
    ./install-chrome-devtools.sh

    # Force reinstall with verbose output
    ./install-chrome-devtools.sh --force --verbose

    # Install and add Chrome path to profile
    ./install-chrome-devtools.sh --add-profile

EOF
}

# ───────────────────────────────────────────────────────────────
# 3. CHROME PATH DETECTION
# ───────────────────────────────────────────────────────────────

# Detect Chrome installation path based on platform
detect_chrome_path() {
    local platform
    platform=$(detect_platform)
    
    case "$platform" in
        darwin)
            # macOS Chrome paths
            local mac_paths=(
                "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
                "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary"
                "/Applications/Chromium.app/Contents/MacOS/Chromium"
            )
            for path in "${mac_paths[@]}"; do
                if [[ -x "$path" ]]; then
                    echo "$path"
                    return 0
                fi
            done
            ;;
        linux)
            # Linux Chrome paths
            local linux_paths=(
                "/usr/bin/google-chrome"
                "/usr/bin/google-chrome-stable"
                "/usr/bin/chromium-browser"
                "/usr/bin/chromium"
                "/snap/bin/chromium"
            )
            for path in "${linux_paths[@]}"; do
                if [[ -x "$path" ]]; then
                    echo "$path"
                    return 0
                fi
            done
            ;;
        windows)
            # Windows (WSL) Chrome paths
            local win_paths=(
                "/mnt/c/Program Files/Google/Chrome/Application/chrome.exe"
                "/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe"
            )
            for path in "${win_paths[@]}"; do
                if [[ -x "$path" ]]; then
                    echo "$path"
                    return 0
                fi
            done
            ;;
    esac
    
    return 1
}

# Check if Chrome is at default location for platform
chrome_at_default_location() {
    local platform
    platform=$(detect_platform)
    
    case "$platform" in
        darwin)
            [[ -x "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" ]]
            ;;
        linux)
            [[ -x "/usr/bin/google-chrome" ]] || [[ -x "/usr/bin/chromium-browser" ]]
            ;;
        windows)
            [[ -x "/mnt/c/Program Files/Google/Chrome/Application/chrome.exe" ]]
            ;;
        *)
            return 1
            ;;
    esac
}

# Get shell profile path
get_shell_profile() {
    if [[ -n "${SHELL:-}" ]]; then
        case "$(basename "$SHELL")" in
            zsh)
                echo "${HOME}/.zshrc"
                ;;
            bash)
                if [[ -f "${HOME}/.bashrc" ]]; then
                    echo "${HOME}/.bashrc"
                else
                    echo "${HOME}/.bash_profile"
                fi
                ;;
            *)
                echo "${HOME}/.profile"
                ;;
        esac
    else
        echo "${HOME}/.profile"
    fi
}

# Add CHROME_PATH to shell profile
add_chrome_path_to_profile() {
    local chrome_path="$1"
    local profile
    profile=$(get_shell_profile)
    
    local export_line="export CHROME_PATH=\"${chrome_path}\""
    
    # Check if already exists
    if grep -q "export CHROME_PATH=" "$profile" 2>/dev/null; then
        log_warn "CHROME_PATH already exists in $profile"
        log_info "Current: $(grep "export CHROME_PATH=" "$profile")"
        return 0
    fi
    
    # Add to profile
    echo "" >> "$profile"
    echo "# Chrome DevTools CLI (bdg) - Chrome path" >> "$profile"
    echo "$export_line" >> "$profile"
    
    log_success "Added CHROME_PATH to $profile"
    log_info "Run 'source $profile' or restart terminal to apply"
    
    return 0
}

# ───────────────────────────────────────────────────────────────
# 4. INSTALLATION FUNCTIONS
# ───────────────────────────────────────────────────────────────

# Check if bdg is already installed
check_existing_installation() {
    if command -v "$CLI_COMMAND" &> /dev/null; then
        local version
        version=$($CLI_COMMAND --version 2>/dev/null || echo "unknown")
        log_info "${CLI_COMMAND} is already installed (version: ${version})"
        return 0
    fi
    return 1
}

# Install the CLI package
install_package() {
    log_step "Installing ${MCP_PACKAGE}..."
    
    if npm install -g "${MCP_PACKAGE}"; then
        log_success "Installed ${MCP_PACKAGE}"
        return 0
    else
        log_error "Failed to install ${MCP_PACKAGE}"
        log_info "Try running: sudo npm install -g ${MCP_PACKAGE}"
        return 1
    fi
}

# Verify the installation
verify_installation() {
    log_step "Verifying installation..."
    
    # Check command exists
    if ! command -v "$CLI_COMMAND" &> /dev/null; then
        log_error "${CLI_COMMAND} command not found after installation"
        log_info "You may need to add npm global bin to PATH"
        log_info "Run: npm config get prefix"
        log_info "Then add <prefix>/bin to your PATH"
        return 1
    fi
    
    # Check version
    local version
    if version=$($CLI_COMMAND --version 2>&1); then
        log_success "${CLI_COMMAND} version: ${version}"
    else
        log_warn "Could not get ${CLI_COMMAND} version"
    fi
    
    # List CDP domains (quick functional test)
    if "$CLI_COMMAND" --list &> /dev/null; then
        local domain_count
        domain_count=$("$CLI_COMMAND" --list 2>/dev/null | wc -l | tr -d ' ')
        log_success "CDP domains available: ${domain_count}"
    else
        log_warn "Could not list CDP domains (may need Chrome running)"
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
            --add-profile)
                ADD_PROFILE="true"
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
    
    if ! check_node_version "$MIN_NODE_VERSION"; then
        exit 1
    fi
    
    if ! check_npm; then
        exit 1
    fi
    
    # Step 2: Check existing installation
    log_step "Checking existing installation..."
    
    if check_existing_installation; then
        if [[ "$FORCE_INSTALL" != "true" ]]; then
            log_info "Skipping installation (use --force to reinstall)"
        else
            log_info "Force reinstalling..."
            install_package || exit 1
        fi
    else
        install_package || exit 1
    fi
    
    # Step 3: Detect Chrome path
    log_step "Detecting Chrome installation..."
    
    local chrome_path
    if chrome_path=$(detect_chrome_path); then
        log_success "Chrome found: ${chrome_path}"
        
        if chrome_at_default_location; then
            log_info "Chrome is at default location, no CHROME_PATH needed"
        else
            log_warn "Chrome is not at default location"
            log_info "CHROME_PATH should be set to: ${chrome_path}"
            
            if [[ "$ADD_PROFILE" == "true" ]]; then
                add_chrome_path_to_profile "$chrome_path"
                # Also set for current session
                export CHROME_PATH="$chrome_path"
            else
                log_info "Run with --add-profile to add to shell config"
                log_info "Or manually: export CHROME_PATH=\"${chrome_path}\""
            fi
        fi
    else
        log_warn "Chrome/Chromium not found at common locations"
        log_info "Install Chrome from: https://www.google.com/chrome/"
        log_info "Or set CHROME_PATH manually to your browser executable"
    fi
    
    # Step 4: Verify installation
    if [[ "$SKIP_VERIFY" != "true" ]]; then
        verify_installation || exit 1
    else
        log_info "Skipping verification (--skip-verify)"
    fi
    
    # Success summary
    echo ""
    echo "───────────────────────────────────────────────"
    echo "  Installation Complete!"
    echo "───────────────────────────────────────────────"
    echo ""
    log_success "${MCP_NAME} (${CLI_COMMAND}) is ready to use"
    echo ""
    echo "Quick start:"
    echo "  bdg https://example.com    # Start session"
    echo "  bdg screenshot test.png    # Take screenshot"
    echo "  bdg console logs           # Get console logs"
    echo "  bdg stop                   # Stop session"
    echo ""
    echo "Discovery:"
    echo "  bdg --list                 # List CDP domains"
    echo "  bdg --describe Page        # Show domain methods"
    echo "  bdg --search screenshot    # Search methods"
    echo ""
    echo "Documentation:"
    echo "  .opencode/install_guides/MCP - Chrome Dev Tools.md"
    echo ""
}

# Run main
main "$@"
