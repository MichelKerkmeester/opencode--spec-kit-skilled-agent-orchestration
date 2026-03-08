#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# RULE: CHECK-FOLDER-NAMING
# ───────────────────────────────────────────────────────────────

# Sourced by validate.sh and compatible with strict mode.
set -euo pipefail

# Rule: FOLDER_NAMING
# Severity: error
# Description: Validates spec folder follows ###-short-name convention

# ───────────────────────────────────────────────────────────────
# 1. INITIALIZATION
# ───────────────────────────────────────────────────────────────

run_check() {
    local folder="$1"
    local level="$2"
    
    RULE_NAME="FOLDER_NAMING"
    RULE_STATUS="pass"
    RULE_MESSAGE=""
    RULE_DETAILS=()
    RULE_REMEDIATION=""

# ───────────────────────────────────────────────────────────────
# 2. VALIDATION LOGIC
# ───────────────────────────────────────────────────────────────

    local folder_name
    folder_name=$(basename "$folder")
    
    # Pattern: 3 digits, hyphen, lowercase alphanumeric with hyphens
    local pattern='^[0-9]{3}-[a-z0-9-]+$'
    
    if [[ ! "$folder_name" =~ $pattern ]]; then
        RULE_STATUS="fail"
        RULE_MESSAGE="Folder name '$folder_name' does not follow naming convention"
        RULE_DETAILS+=("Expected pattern: ###-short-name (e.g., 001-auth-feature)")
        RULE_DETAILS+=("Got: $folder_name")
        
        [[ ! "$folder_name" =~ ^[0-9]{3}- ]] && RULE_DETAILS+=("Missing 3-digit prefix (e.g., 001-, 042-)")
        [[ "$folder_name" =~ [A-Z] ]] && RULE_DETAILS+=("Contains uppercase letters (use lowercase only)")
        [[ "$folder_name" =~ _ ]] && RULE_DETAILS+=("Contains underscores (use hyphens instead)")
        
        RULE_REMEDIATION="Rename folder to follow pattern: ###-short-name (lowercase, hyphens only)"

# ───────────────────────────────────────────────────────────────
# 3. RESULTS
# ───────────────────────────────────────────────────────────────

    else
        RULE_MESSAGE="Folder name '$folder_name' follows naming convention"
    fi
}

# Exit codes:
#   0 - Success
