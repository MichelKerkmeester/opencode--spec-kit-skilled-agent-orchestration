#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# RULE: CHECK-LEVEL
# ───────────────────────────────────────────────────────────────

# Sourced by validate.sh and compatible with strict mode.
set -euo pipefail

# Rule: LEVEL_DECLARED
# Severity: info
# Description: Checks if documentation level was explicitly declared vs inferred

# ───────────────────────────────────────────────────────────────
# 1. INITIALIZATION
# ───────────────────────────────────────────────────────────────

run_check() {
    local folder="$1"
    local level="$2"
    
    RULE_NAME="LEVEL_DECLARED"
    RULE_STATUS="pass"
    RULE_MESSAGE=""
    RULE_DETAILS=()
    RULE_REMEDIATION=""

# ───────────────────────────────────────────────────────────────
# 2. VALIDATION LOGIC
# ───────────────────────────────────────────────────────────────

    if [[ "${LEVEL_METHOD:-}" == "explicit" ]]; then
        RULE_STATUS="pass"
        RULE_MESSAGE="Level $level explicitly declared"

# ───────────────────────────────────────────────────────────────
# 3. RESULTS
# ───────────────────────────────────────────────────────────────

    else
        RULE_STATUS="info"
        RULE_MESSAGE="Level $level was inferred (consider adding explicit Level field to spec.md)"
        RULE_REMEDIATION="Add '| **Level** | $level |' to spec.md metadata table"
    fi
}

# Exit codes:
#   0 - Success
