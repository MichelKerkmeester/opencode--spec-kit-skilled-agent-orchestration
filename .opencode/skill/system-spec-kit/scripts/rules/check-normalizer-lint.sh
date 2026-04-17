#!/usr/bin/env bash
set -euo pipefail

run_check() {
    local _folder="$1"
    local _level="$2"
    local script_dir
    script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    local default_target="$script_dir/../../mcp_server"
    local target_dir="${SPECKIT_NORMALIZER_LINT_TARGET:-$default_target}"
    local -a violations=()

    RULE_NAME="NORMALIZER_LINT"
    RULE_STATUS="pass"
    RULE_MESSAGE=""
    RULE_DETAILS=()
    RULE_REMEDIATION=""

    if ! $STRICT_MODE; then
        RULE_MESSAGE="Normalizer lint skipped (strict mode only)"
        return 0
    fi

    if [[ ! -d "$target_dir" ]]; then
        RULE_MESSAGE="Normalizer lint skipped (missing target: $target_dir)"
        return 0
    fi

    while IFS= read -r line; do
        [[ -z "$line" ]] && continue
        case "$line" in
            *"/lib/governance/scope-governance.ts:"*) continue ;;
            *"/lib/storage/reconsolidation.ts:"*) continue ;;
            *".vitest.ts:"*|*".test.ts:"*) continue ;;
        esac
        violations+=("$line")
    done < <(
        grep -rnE 'function (normalizeScope[[:alnum:]_]*|getOptionalString)\b' "$target_dir" \
            --include='*.ts' \
            --include='*.tsx' \
            --include='*.js' \
            --include='*.mjs' \
            --exclude-dir='dist' \
            --exclude-dir='node_modules' \
            --exclude-dir='.git' \
            2>/dev/null || true
    )

    if [[ ${#violations[@]} -gt 0 ]]; then
        local -a files=()
        local seen=""
        local line
        for line in "${violations[@]}"; do
            local file="${line%%:*}"
            case ",$seen," in
                *,"$file",*) ;;
                *)
                    seen="${seen:+$seen,}$file"
                    files+=("$file")
                    ;;
            esac
        done
        RULE_STATUS="fail"
        RULE_MESSAGE="Local normalizeScope*/getOptionalString declarations found outside the canonical scope-governance helper"
        RULE_DETAILS=("${files[@]}")
        RULE_REMEDIATION="Import normalizeScopeValue from lib/governance/scope-governance.ts instead of declaring local helpers."
        return 0
    fi

    RULE_MESSAGE="No local normalizeScope*/getOptionalString declarations found outside allowed files"
    return 0
}
