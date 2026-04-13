#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: INIT SKILL GRAPH
# ───────────────────────────────────────────────────────────────
# Validate skill graph metadata, refresh the JSON fallback, and
# report the current advisor health from the repository root.

set -euo pipefail

# ───────────────────────────────────────────────────────────────
# 1. PATHS
# ───────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../../../.." && pwd)"
SQLITE_PATH="${REPO_ROOT}/.opencode/skill/system-spec-kit/mcp_server/database/skill-graph.sqlite"
JSON_PATH="${SCRIPT_DIR}/skill-graph.json"

# ───────────────────────────────────────────────────────────────
# 2. HELPERS
# ───────────────────────────────────────────────────────────────

log_step() {
    printf '[init-skill-graph] %s\n' "$1"
}

run_from_repo() {
    (
        cd "${REPO_ROOT}"
        "$@"
    )
}

# ───────────────────────────────────────────────────────────────
# 3. SETUP
# ───────────────────────────────────────────────────────────────

log_step "Repository root: ${REPO_ROOT}"

if [[ -f "${SQLITE_PATH}" ]]; then
    log_step "Detected SQLite skill graph: ${SQLITE_PATH}"
else
    log_step "SQLite skill graph missing: ${SQLITE_PATH}"
    log_step "SQLite will be created automatically when the MCP server starts."
fi

if [[ -f "${JSON_PATH}" ]]; then
    log_step "Detected JSON skill graph: ${JSON_PATH}"
else
    log_step "JSON skill graph missing: ${JSON_PATH}"
fi

log_step "Validating graph metadata"
run_from_repo python3 .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py --validate-only

log_step "Exporting JSON skill graph"
run_from_repo python3 .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py --export-json

log_step "Running advisor health check"
run_from_repo python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py --health

log_step "Skill graph initialization complete"
