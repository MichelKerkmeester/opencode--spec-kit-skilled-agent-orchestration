#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: MCP Doctor — Shared Library
# ───────────────────────────────────────────────────────────────
# Shared helper functions for mcp-doctor.sh.
# Source this file; do not execute directly.
#
# Provides: colors, logging, JSON helpers, project root detection,
#           result tracking, and summary rendering.
#
# Exit Codes: N/A (library — sourced, not executed)
# ───────────────────────────────────────────────────────────────

# ── 1. COLOR SUPPORT ─────────────────────────────────────────
# Respects NO_COLOR env var and non-TTY pipes
if [[ -z "${NO_COLOR:-}" ]] && [[ -t 1 ]]; then
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

# ── 2. LOGGING ───────────────────────────────────────────────
log_pass()   { printf '  %b[PASS]%b %s\n' "$GREEN" "$NC" "$1"; }
log_warn()   { printf '  %b[WARN]%b %s\n' "$YELLOW" "$NC" "$1"; }
log_fail()   { printf '  %b[FAIL]%b %s\n' "$RED" "$NC" "$1" >&2; }
log_skip()   { printf '  %b[SKIP]%b %s\n' "$DIM" "$NC" "$1"; }
log_info()   { printf '  %b[INFO]%b %s\n' "$CYAN" "$NC" "$1"; }
log_header() { printf '\n%b=== %s ===%b\n' "$BOLD" "$1" "$NC"; }

# ── 3. RESULT TRACKING ──────────────────────────────────────
declare -a DOCTOR_RESULTS=()
DOCTOR_PASS_COUNT=0
DOCTOR_WARN_COUNT=0
DOCTOR_FAIL_COUNT=0

# Record a passing check result
# Args: $1=server $2=check $3=detail(optional)
record_pass() {
  local server="$1" check="$2" detail="${3:-}"
  DOCTOR_RESULTS+=("PASS|${server}|${check}|${detail}")
  ((DOCTOR_PASS_COUNT++)) || true
}

# Record a warning check result
# Args: $1=server $2=check $3=detail(optional)
record_warn() {
  local server="$1" check="$2" detail="${3:-}"
  DOCTOR_RESULTS+=("WARN|${server}|${check}|${detail}")
  ((DOCTOR_WARN_COUNT++)) || true
}

# Record a failing check result
# Args: $1=server $2=check $3=detail(optional)
record_fail() {
  local server="$1" check="$2" detail="${3:-}"
  DOCTOR_RESULTS+=("FAIL|${server}|${check}|${detail}")
  ((DOCTOR_FAIL_COUNT++)) || true
}

# Record a skipped check result
# Args: $1=server $2=check $3=detail(optional)
record_skip() {
  local server="$1" check="$2" detail="${3:-}"
  DOCTOR_RESULTS+=("SKIP|${server}|${check}|${detail}")
}

# ── 4. JSON HELPERS ──────────────────────────────────────────

# Escape a string for safe JSON embedding
# Args: $1=string to escape
# Returns: escaped string on stdout
json_escape() {
  local s="$1"
  s="${s//\\/\\\\}"
  s="${s//\"/\\\"}"
  s="${s//$'\n'/\\n}"
  s="${s//$'\t'/\\t}"
  printf '%s' "$s"
}

# Emit full JSON diagnostic report from DOCTOR_RESULTS
# Args: $1=exit_code
emit_json_report() {
  local exit_code="$1"
  local status_label
  if [[ "$exit_code" -eq 0 ]]; then
    status_label="healthy"
  elif [[ "$exit_code" -eq 1 ]]; then
    status_label="warnings"
  else
    status_label="unhealthy"
  fi

  printf '{\n'
  printf '  "status": "%s",\n' "$status_label"
  printf '  "exitCode": %d,\n' "$exit_code"
  printf '  "summary": { "pass": %d, "warn": %d, "fail": %d },\n' \
    "$DOCTOR_PASS_COUNT" "$DOCTOR_WARN_COUNT" "$DOCTOR_FAIL_COUNT"
  printf '  "checks": [\n'

  local i=0
  local status server check detail
  for result in "${DOCTOR_RESULTS[@]}"; do
    IFS='|' read -r status server check detail <<< "$result"
    [[ "$i" -gt 0 ]] && printf ',\n'
    printf '    { "status": "%s", "server": "%s", "check": "%s", "detail": "%s" }' \
      "$(json_escape "$status")" "$(json_escape "$server")" \
      "$(json_escape "$check")" "$(json_escape "$detail")"
    ((i++)) || true
  done

  printf '\n  ]\n'
  printf '}\n'
}

# ── 5. SUMMARY ───────────────────────────────────────────────

# Print human-readable summary with exit code context
# Args: $1=exit_code
print_summary() {
  local exit_code="$1"
  printf '\n%b─── Summary ───%b\n' "$BOLD" "$NC"
  printf '  Pass: %b%d%b  Warn: %b%d%b  Fail: %b%d%b\n' \
    "$GREEN" "$DOCTOR_PASS_COUNT" "$NC" \
    "$YELLOW" "$DOCTOR_WARN_COUNT" "$NC" \
    "$RED" "$DOCTOR_FAIL_COUNT" "$NC"
  if [[ "$exit_code" -eq 0 ]]; then
    printf '  %bAll MCP servers healthy.%b\n' "$GREEN" "$NC"
  elif [[ "$exit_code" -eq 1 ]]; then
    printf '  %bSome warnings detected. MCP servers should work but check above.%b\n' "$YELLOW" "$NC"
  else
    printf '  %bFailures detected. Run with --fix to attempt auto-repair.%b\n' "$RED" "$NC" >&2
  fi
}

# ── 6. PROJECT ROOT DETECTION ────────────────────────────────

# Walk up from script location to find project root
# Args: $1=hint path (optional)
# Returns: absolute project root path on stdout
resolve_project_root() {
  local hint="${1:-}"
  if [[ -n "$hint" && -d "$hint" ]]; then
    cd "$hint" && pwd
    return
  fi
  local dir
  dir="$(cd "$(dirname "${BASH_SOURCE[1]:-${BASH_SOURCE[0]}}")" && pwd)"
  while [[ "$dir" != "/" ]]; do
    if [[ -f "$dir/opencode.json" ]] || [[ -d "$dir/.opencode" ]]; then
      printf '%s' "$dir"
      return
    fi
    dir="$(dirname "$dir")"
  done
  pwd
}

# ── 7. PREREQUISITE CHECKING ─────────────────────────────────

# Check if a command exists on PATH
# Args: $1=command name
# Returns: 0 if found, 1 if not
check_command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Get the major version of Node.js
# Returns: major version number on stdout, "0" if node not found
get_node_major_version() {
  if check_command_exists node; then
    node -e 'console.log(process.versions.node.split(".")[0])' 2>/dev/null || echo "0"
  else
    echo "0"
  fi
}

# ── 8. CONFIG FILE CHECKING ──────────────────────────────────

# Check if a config file contains an MCP server entry
# Args: $1=file path  $2=server key  $3=format
# Formats: "json-mcp" (opencode.json), "json-mcpServers" (.claude, .gemini, .vscode), "toml" (.codex)
# Returns: 0 if server found, 1 if not
config_has_server() {
  local file="$1" server_key="$2" format="$3"
  if [[ ! -f "$file" ]]; then
    return 1
  fi
  case "$format" in
    json-mcp)
      node -e "
        const cfg = JSON.parse(require('fs').readFileSync('$file','utf8'));
        process.exit(cfg.mcp && cfg.mcp['$server_key'] ? 0 : 1);
      " 2>/dev/null
      ;;
    json-mcpServers)
      node -e "
        const cfg = JSON.parse(require('fs').readFileSync('$file','utf8'));
        process.exit(cfg.mcpServers && cfg.mcpServers['$server_key'] ? 0 : 1);
      " 2>/dev/null
      ;;
    toml)
      grep -q "\[mcp_servers\.$server_key\]" "$file" 2>/dev/null
      ;;
    *)
      return 1
      ;;
  esac
}
