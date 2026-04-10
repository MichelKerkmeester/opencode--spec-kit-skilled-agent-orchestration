#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: MCP Doctor — Unified MCP Diagnostic Command
# ───────────────────────────────────────────────────────────────
# Diagnoses all 4 OpenCode MCP servers and checks config wiring
# across all detected runtimes.
#
# Usage:
#   bash .opencode/command/mcp_doctor/scripts/mcp-doctor.sh [OPTIONS]
#
# Options:
#   --help              Show this help message
#   --json              Output machine-readable JSON
#   --fix               Attempt auto-repair for failures
#   --server <name>     Diagnose a single server only
#                       Names: spec_kit_memory, cocoindex_code, code_mode, sequential_thinking
#   --root <path>       Override project root
#
# Exit Codes:
#   0  All checks passed
#   1  Warnings only (MCP likely works)
#   2  Failures detected (MCP broken)
# ───────────────────────────────────────────────────────────────
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=mcp-doctor-lib.sh
source "$SCRIPT_DIR/mcp-doctor-lib.sh"

# Helper: conditional output (avoids set -e + && short-circuit issue)
_log() { if [[ "$JSON_MODE" != true ]]; then "$@"; fi; }

# ── Argument parsing ──────────────────────────────────────────
JSON_MODE=false
FIX_MODE=false
FILTER_SERVER=""
ROOT_OVERRIDE=""

show_help() {
  cat <<'HELP'
MCP Doctor — Unified MCP Diagnostic Command

Usage: bash .opencode/scripts/mcp-doctor.sh [OPTIONS]

Options:
  --help              Show this help message
  --json              Output machine-readable JSON
  --fix               Attempt auto-repair for failures
  --server <name>     Diagnose a single server only
                      Names: spec_kit_memory, cocoindex_code, code_mode, sequential_thinking
  --root <path>       Override project root

Exit Codes:
  0  All checks passed
  1  Warnings only
  2  Failures detected

Servers Checked:
  spec_kit_memory       Spec Kit Memory (Node.js MCP, SQLite + embeddings)
  cocoindex_code        CocoIndex Code (Python MCP, semantic search)
  code_mode             Code Mode (Node.js MCP, TypeScript tool orchestration)
  sequential_thinking   Sequential Thinking (npx MCP, structured reasoning)

Config Files Scanned:
  opencode.json         OpenCode CLI
  .claude/mcp.json      Claude Code CLI
  .codex/config.toml    Codex CLI
  .gemini/settings.json Gemini CLI
  .vscode/mcp.json      VS Code / Copilot
HELP
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --help|-h)   show_help; exit 0 ;;
    --json)      JSON_MODE=true; shift ;;
    --fix)       FIX_MODE=true; shift ;;
    --server)
      if [[ $# -lt 2 ]]; then echo "Error: --server requires a name" >&2; exit 1; fi
      FILTER_SERVER="$2"; shift 2 ;;
    --root)
      if [[ $# -lt 2 ]]; then echo "Error: --root requires a path" >&2; exit 1; fi
      ROOT_OVERRIDE="$2"; shift 2 ;;
    *)
      echo "Unknown option: $1" >&2; show_help; exit 1 ;;
  esac
done

# ── Resolve project root ─────────────────────────────────────
PROJECT_ROOT="$(resolve_project_root "$ROOT_OVERRIDE")"
HAS_NODE=false
HAS_PYTHON=false
NODE_MAJOR=0

# ── Header ────────────────────────────────────────────────────
should_run() {
  [[ -z "$FILTER_SERVER" ]] || [[ "$FILTER_SERVER" == "$1" ]]
}

_log printf '%s\n' "╔══════════════════════════════════════════════════╗"
_log printf '%s\n' "║            MCP Doctor — Diagnostic               ║"
_log printf '%s\n' "╚══════════════════════════════════════════════════╝"
_log printf '  Project root: %s\n' "$PROJECT_ROOT"

# ── Global prerequisites ──────────────────────────────────────
_log log_header "Prerequisites"

if check_command_exists node; then
  HAS_NODE=true
  NODE_MAJOR="$(get_node_major_version)"
  _log log_pass "Node.js $(node --version)"
  record_pass "prerequisites" "node" "$(node --version)"
else
  _log log_fail "Node.js not found — 3 of 4 MCP servers require it"
  record_fail "prerequisites" "node" "not found"
fi

if check_command_exists python3; then
  HAS_PYTHON=true
  local_py_version="$(python3 --version 2>&1)"
  _log log_pass "$local_py_version"
  record_pass "prerequisites" "python3" "$local_py_version"
else
  _log log_warn "Python3 not found — CocoIndex Code checks will be skipped"
  record_warn "prerequisites" "python3" "not found"
fi

if check_command_exists npm; then
  record_pass "prerequisites" "npm" "$(npm --version 2>/dev/null)"
else
  record_warn "prerequisites" "npm" "not found"
fi

# ══════════════════════════════════════════════════════════════
# SERVER DIAGNOSTICS
# ══════════════════════════════════════════════════════════════

# ── Spec Kit Memory ───────────────────────────────────────────
diagnose_spec_kit_memory() {
  local srv="spec_kit_memory"
  local skill_dir="$PROJECT_ROOT/.opencode/skill/system-spec-kit"
  local dist_entry="$skill_dir/mcp_server/dist/context-server.js"
  local db_dir="$skill_dir/mcp_server/database"
  local marker="$skill_dir/.node-version-marker"
  local needs_fix=false

  _log log_header "Spec Kit Memory"

  if [[ "$HAS_NODE" != true ]]; then
    record_skip "$srv" "all" "Node.js not available"
    _log log_skip "Node.js not available — skipping all checks"
    return
  fi

  # Check 1: dist/context-server.js exists
  if [[ -f "$dist_entry" ]]; then
    record_pass "$srv" "dist_exists" "$dist_entry"
    _log log_pass "dist/context-server.js exists"
  else
    record_fail "$srv" "dist_exists" "File missing: $dist_entry"
    _log log_fail "dist/context-server.js missing — needs build"
    needs_fix=true
  fi

  # Check 2: better-sqlite3 loads
  if node -e "require('$skill_dir/mcp_server/node_modules/better-sqlite3')" 2>/dev/null; then
    record_pass "$srv" "better_sqlite3" "Loads successfully"
    _log log_pass "better-sqlite3 loads"
  else
    record_fail "$srv" "better_sqlite3" "Failed to load — native module mismatch or not installed"
    _log log_fail "better-sqlite3 does not load — native module rebuild needed"
    needs_fix=true
  fi

  # Check 3: Node version marker matches
  if [[ -f "$marker" ]]; then
    local marker_mod current_mod
    marker_mod="$(node -e "const m=JSON.parse(require('fs').readFileSync('$marker','utf8'));console.log(m.moduleVersion||'unknown')" 2>/dev/null || echo "unknown")"
    current_mod="$(node -e 'console.log(process.versions.modules)' 2>/dev/null || echo "unknown")"
    if [[ "$marker_mod" == "$current_mod" ]]; then
      record_pass "$srv" "node_version_marker" "MODULE_VERSION $current_mod matches"
      _log log_pass "Node MODULE_VERSION matches marker ($current_mod)"
    else
      record_warn "$srv" "node_version_marker" "Marker=$marker_mod Current=$current_mod"
      _log log_warn "Node MODULE_VERSION mismatch: marker=$marker_mod current=$current_mod"
      needs_fix=true
    fi
  else
    record_warn "$srv" "node_version_marker" "Marker file not found"
    _log log_warn "Node version marker not found (run rebuild to create)"
  fi

  # Check 4: database directory
  if [[ -d "$db_dir" ]]; then
    local db_file="$db_dir/context-index.sqlite"
    if [[ -f "$db_file" ]]; then
      local db_size
      db_size="$(du -h "$db_file" 2>/dev/null | cut -f1)"
      record_pass "$srv" "database" "context-index.sqlite exists ($db_size)"
      _log log_pass "Database exists ($db_size)"
    else
      record_warn "$srv" "database" "Database directory exists but context-index.sqlite missing"
      _log log_warn "Database directory exists but no context-index.sqlite"
    fi
  else
    record_warn "$srv" "database" "Database directory not found"
    _log log_warn "Database directory not found (created on first MCP use)"
  fi

  # Check 5: Server starts (quick smoke test)
  if [[ -f "$dist_entry" ]]; then
    if timeout 5 node -e "
      const path = require('path');
      try { require('$dist_entry'); } catch(e) {
        if (e.code === 'ERR_DLOPEN_FAILED') process.exit(2);
        process.exit(0); // MCP server expects stdio — exiting is normal
      }
    " 2>/dev/null; then
      record_pass "$srv" "server_starts" "No ERR_DLOPEN_FAILED"
      _log log_pass "Server entry point loads without native errors"
    else
      local ec=$?
      if [[ "$ec" -eq 2 ]]; then
        record_fail "$srv" "server_starts" "ERR_DLOPEN_FAILED — native module mismatch"
        _log log_fail "ERR_DLOPEN_FAILED — native module rebuild required"
        needs_fix=true
      else
        record_pass "$srv" "server_starts" "Entry point accessible"
        _log log_pass "Server entry point accessible"
      fi
    fi
  fi

  # Fix mode
  if [[ "$FIX_MODE" == true ]] && [[ "$needs_fix" == true ]]; then
    _log printf '\n  %sAttempting auto-repair...%s\n' "$CYAN" "$NC"
    local rebuild_script="$skill_dir/scripts/setup/rebuild-native-modules.sh"
    if [[ -f "$rebuild_script" ]]; then
      if bash "$rebuild_script" 2>&1 | tail -5; then
        record_pass "$srv" "fix_rebuild" "Rebuild completed"
        _log log_pass "Native modules rebuilt"
      else
        record_fail "$srv" "fix_rebuild" "Rebuild failed"
        _log log_fail "Rebuild failed — check output above"
      fi
    else
      # Fallback: npm install + build
      (cd "$skill_dir" && npm install 2>&1 | tail -3 && npm run build 2>&1 | tail -3) || true
      record_pass "$srv" "fix_npm" "npm install + build attempted"
      _log log_info "Ran npm install + build"
    fi
  fi
}

# ── CocoIndex Code ────────────────────────────────────────────
diagnose_cocoindex_code() {
  local srv="cocoindex_code"
  local skill_dir="$PROJECT_ROOT/.opencode/skill/mcp-coco-index"
  local ccc_bin="$skill_dir/mcp_server/.venv/bin/ccc"
  local index_dir="$PROJECT_ROOT/.cocoindex_code"
  local needs_fix=false

  _log log_header "CocoIndex Code"

  # Check 1: Binary exists
  if [[ -x "$ccc_bin" ]]; then
    record_pass "$srv" "binary_exists" "$ccc_bin"
    _log log_pass "ccc binary exists and is executable"
  elif [[ -f "$ccc_bin" ]]; then
    record_warn "$srv" "binary_exists" "Exists but not executable"
    _log log_warn "ccc binary exists but is not executable (chmod +x needed)"
    needs_fix=true
  else
    record_fail "$srv" "binary_exists" "Binary missing: $ccc_bin"
    _log log_fail "ccc binary not found — needs install"
    needs_fix=true
  fi

  # Check 2: ccc --help works
  if [[ -x "$ccc_bin" ]]; then
    if "$ccc_bin" --help >/dev/null 2>&1; then
      record_pass "$srv" "binary_works" "ccc --help succeeds"
      _log log_pass "ccc --help succeeds"
    else
      record_fail "$srv" "binary_works" "ccc --help failed"
      _log log_fail "ccc --help failed — venv may be corrupted"
      needs_fix=true
    fi
  fi

  # Check 3: Index directory
  if [[ -d "$index_dir" ]]; then
    local file_count
    file_count="$(find "$index_dir" -type f 2>/dev/null | wc -l | tr -d ' ')"
    if [[ "$file_count" -gt 0 ]]; then
      record_pass "$srv" "index_exists" "$file_count files in .cocoindex_code/"
      _log log_pass "Index exists ($file_count files)"
    else
      record_warn "$srv" "index_exists" "Directory exists but empty"
      _log log_warn "Index directory exists but is empty — run ccc index"
    fi
  else
    record_warn "$srv" "index_exists" "No .cocoindex_code/ directory"
    _log log_warn "No .cocoindex_code/ directory — run ccc init && ccc index"
  fi

  # Check 4: ccc status (if binary works)
  if [[ -x "$ccc_bin" ]] && "$ccc_bin" --help >/dev/null 2>&1; then
    local status_output
    status_output="$("$ccc_bin" status 2>&1)" || true
    if [[ -n "$status_output" ]] && ! echo "$status_output" | grep -qi "error"; then
      record_pass "$srv" "status" "ccc status reports healthy"
      _log log_pass "ccc status reports healthy"
    else
      record_warn "$srv" "status" "ccc status returned errors or empty"
      _log log_warn "ccc status returned errors — index may need rebuild"
    fi
  fi

  # Fix mode
  if [[ "$FIX_MODE" == true ]] && [[ "$needs_fix" == true ]]; then
    _log printf '\n  %sAttempting auto-repair...%s\n' "$CYAN" "$NC"
    local install_script="$skill_dir/scripts/install.sh"
    if [[ -f "$install_script" ]]; then
      if bash "$install_script" 2>&1 | tail -5; then
        record_pass "$srv" "fix_install" "Install script completed"
        _log log_pass "CocoIndex reinstalled"
      else
        record_fail "$srv" "fix_install" "Install script failed"
        _log log_fail "Install script failed — check output above"
      fi
    fi
    # Fix permissions if binary exists but not executable
    if [[ -f "$ccc_bin" ]] && [[ ! -x "$ccc_bin" ]]; then
      chmod +x "$ccc_bin"
      record_pass "$srv" "fix_chmod" "Made binary executable"
      _log log_pass "Made ccc binary executable"
    fi
  fi
}

# ── Code Mode ─────────────────────────────────────────────────
diagnose_code_mode() {
  local srv="code_mode"
  local skill_dir="$PROJECT_ROOT/.opencode/skill/mcp-code-mode"
  local dist_entry="$skill_dir/mcp_server/dist/index.js"
  local utcp_config="$PROJECT_ROOT/.utcp_config.json"
  local needs_fix=false

  _log log_header "Code Mode"

  if [[ "$HAS_NODE" != true ]]; then
    record_skip "$srv" "all" "Node.js not available"
    _log log_skip "Node.js not available — skipping all checks"
    return
  fi

  # Check 1: dist/index.js exists
  if [[ -f "$dist_entry" ]]; then
    record_pass "$srv" "dist_exists" "$dist_entry"
    _log log_pass "dist/index.js exists"
  else
    record_fail "$srv" "dist_exists" "File missing: $dist_entry"
    _log log_fail "dist/index.js missing — needs npm install + build"
    needs_fix=true
  fi

  # Check 2: .utcp_config.json exists and is valid JSON
  if [[ -f "$utcp_config" ]]; then
    if node -e "JSON.parse(require('fs').readFileSync('$utcp_config','utf8'))" 2>/dev/null; then
      record_pass "$srv" "utcp_config" "Valid JSON"
      _log log_pass ".utcp_config.json exists and is valid JSON"
    else
      record_fail "$srv" "utcp_config" "Invalid JSON syntax"
      _log log_fail ".utcp_config.json has invalid JSON syntax"
    fi
  else
    record_warn "$srv" "utcp_config" "File not found"
    _log log_warn ".utcp_config.json not found — Code Mode needs this config"
  fi

  # Check 3: .env file (needed for API keys if external servers configured)
  local env_file="$PROJECT_ROOT/.env"
  if [[ -f "$env_file" ]]; then
    record_pass "$srv" "env_file" "Exists"
    _log log_pass ".env file exists"
  else
    record_pass "$srv" "env_file" "Not found (optional — only needed for external API keys)"
    _log log_info ".env not found — only needed if external MCP servers require API keys"
  fi

  # Check 4: node_modules exist
  if [[ -d "$skill_dir/mcp_server/node_modules" ]]; then
    record_pass "$srv" "node_modules" "Installed"
    _log log_pass "node_modules installed"
  else
    record_fail "$srv" "node_modules" "Missing"
    _log log_fail "node_modules missing — needs npm install"
    needs_fix=true
  fi

  # Fix mode
  if [[ "$FIX_MODE" == true ]] && [[ "$needs_fix" == true ]]; then
    _log printf '\n  %sAttempting auto-repair...%s\n' "$CYAN" "$NC"
    local install_script="$skill_dir/scripts/install.sh"
    if [[ -f "$install_script" ]]; then
      if bash "$install_script" 2>&1 | tail -5; then
        record_pass "$srv" "fix_install" "Install completed"
        _log log_pass "Code Mode reinstalled"
      else
        record_fail "$srv" "fix_install" "Install failed"
        _log log_fail "Install failed — check output above"
      fi
    else
      (cd "$skill_dir/mcp_server" && npm install 2>&1 | tail -3 && npm run build 2>&1 | tail -3) || true
      record_pass "$srv" "fix_npm" "npm install + build attempted"
      _log log_info "Ran npm install + build in mcp_server/"
    fi
  fi
}

# ── Sequential Thinking ───────────────────────────────────────
diagnose_sequential_thinking() {
  local srv="sequential_thinking"

  _log log_header "Sequential Thinking"

  if [[ "$HAS_NODE" != true ]]; then
    record_skip "$srv" "all" "Node.js not available"
    _log log_skip "Node.js not available — skipping all checks"
    return
  fi

  # Check 1: Node >= 18
  if [[ "$NODE_MAJOR" -ge 18 ]]; then
    record_pass "$srv" "node_version" "Node.js v$NODE_MAJOR (>= 18)"
    _log log_pass "Node.js version $NODE_MAJOR >= 18"
  else
    record_fail "$srv" "node_version" "Node.js v$NODE_MAJOR < 18"
    _log log_fail "Node.js version $NODE_MAJOR is below required 18"
  fi

  # Check 2: npx available
  if check_command_exists npx; then
    record_pass "$srv" "npx_available" "npx found"
    _log log_pass "npx available"
  else
    record_fail "$srv" "npx_available" "npx not found"
    _log log_fail "npx not found — install Node.js 18+"
    return
  fi

  # Check 3: Package is cached/reachable (quick check — don't actually start the server)
  # Just verify npx can resolve the package without running it
  if npx -y --package @modelcontextprotocol/server-sequential-thinking node -e "console.log('ok')" >/dev/null 2>&1; then
    record_pass "$srv" "package_reachable" "Package resolves via npx"
    _log log_pass "Package resolves via npx"
  else
    record_warn "$srv" "package_reachable" "Package not cached — first use may be slow"
    _log log_warn "Package not cached — first use may download (slow startup)"
  fi

  # Fix mode: pre-cache the package
  if [[ "$FIX_MODE" == true ]]; then
    if ! npx -y --package @modelcontextprotocol/server-sequential-thinking node -e "console.log('ok')" >/dev/null 2>&1; then
      _log printf '\n  %sPre-caching package...%s\n' "$CYAN" "$NC"
      npm cache clean --force 2>/dev/null || true
      npx -y @modelcontextprotocol/server-sequential-thinking --help >/dev/null 2>&1 || true
      record_pass "$srv" "fix_cache" "Cache refresh attempted"
      _log log_info "Cache refresh attempted"
    fi
  fi
}

# ══════════════════════════════════════════════════════════════
# CONFIG WIRING CHECK
# ══════════════════════════════════════════════════════════════
detect_and_check_configs() {
  _log log_header "Config Wiring"

  local -a config_files=(
    "opencode.json|json-mcp|OpenCode"
    ".claude/mcp.json|json-mcpServers|Claude Code"
    ".codex/config.toml|toml|Codex CLI"
    ".gemini/settings.json|json-mcpServers|Gemini CLI"
    ".vscode/mcp.json|json-mcpServers|VS Code / Copilot"
  )

  local -a servers=("spec_kit_memory" "cocoindex_code" "code_mode" "sequential_thinking")

  for cfg_entry in "${config_files[@]}"; do
    IFS='|' read -r cfg_path cfg_format cfg_label <<< "$cfg_entry"
    local full_path="$PROJECT_ROOT/$cfg_path"

    if [[ ! -f "$full_path" ]]; then
      _log log_info "$cfg_label ($cfg_path): not found"
      record_skip "config" "$cfg_path" "File not present"
      continue
    fi

    _log printf '\n  %s%s%s (%s):\n' "$BOLD" "$cfg_label" "$NC" "$cfg_path"

    for srv in "${servers[@]}"; do
      if [[ -n "$FILTER_SERVER" ]] && [[ "$FILTER_SERVER" != "$srv" ]]; then
        continue
      fi
      if config_has_server "$full_path" "$srv" "$cfg_format"; then
        record_pass "config" "${cfg_path}:${srv}" "Wired"
        _log printf '    %s[OK]%s %s\n' "$GREEN" "$NC" "$srv"
      else
        record_warn "config" "${cfg_path}:${srv}" "Not wired"
        _log printf '    %s[--]%s %s (not configured)\n' "$DIM" "$NC" "$srv"
      fi
    done
  done
}

# ══════════════════════════════════════════════════════════════
# MAIN DISPATCH
# ══════════════════════════════════════════════════════════════
should_run "spec_kit_memory"      && diagnose_spec_kit_memory
should_run "cocoindex_code"       && diagnose_cocoindex_code
should_run "code_mode"            && diagnose_code_mode
should_run "sequential_thinking"  && diagnose_sequential_thinking

# Config wiring always runs (filtered by --server internally)
detect_and_check_configs

# ── Compute exit code ─────────────────────────────────────────
EXIT_CODE=0
if [[ "$DOCTOR_FAIL_COUNT" -gt 0 ]]; then
  EXIT_CODE=2
elif [[ "$DOCTOR_WARN_COUNT" -gt 0 ]]; then
  EXIT_CODE=1
fi

# ── Output ────────────────────────────────────────────────────
if [[ "$JSON_MODE" == true ]]; then
  emit_json_report "$EXIT_CODE"
else
  print_summary "$EXIT_CODE"
fi

exit "$EXIT_CODE"
