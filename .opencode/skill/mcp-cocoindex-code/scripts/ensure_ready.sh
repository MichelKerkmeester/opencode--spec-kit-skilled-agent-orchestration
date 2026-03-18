#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: COCOINDEX ENSURE READY
# ───────────────────────────────────────────────────────────────
# Idempotent bootstrap wrapper for AI agents and maintainers.
#
# Usage: bash .opencode/skill/mcp-cocoindex-code/scripts/ensure_ready.sh [--json] [--root <path>] [--refresh-index] [--strict] [--require-config] [--expect-config <path>]
#
# Exit Codes:
#   0  - Bootstrap succeeded, or advisory mode completed
#   1  - Invalid arguments
#   20 - Repo-local CocoIndex binary missing after bootstrap
#   21 - Skill payload missing
#   22 - Helper-script payload incomplete
#   23 - Index missing or empty after bootstrap
#   24 - Required config wiring missing
#   25 - Required daemon not running

set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"

JSON_MODE=false
REFRESH_INDEX=false
STRICT_MODE=false
REQUIRE_CONFIG=false
PROJECT_ROOT_INPUT=""
ACTION_LOG=()
EXPECTED_CONFIGS=()

show_help() {
    cat <<'EOF'
Usage: ensure_ready.sh [--json] [--root <path>] [--refresh-index] [--strict] [--require-config] [--expect-config <path>]

Options:
  --json                  Emit machine-readable JSON output
  --root <path>           Override the project root to prepare
  --refresh-index         Force an index rebuild even when the index already exists
  --strict                Fail nonzero when required post-bootstrap checks fail
  --require-config        Require cocoindex_code config wiring after bootstrap
  --expect-config <path>  Require cocoindex_code in a specific config file (repeatable)
  -h, --help              Show this help message
EOF
}

while [[ $# -gt 0 ]]; do
    case "$1" in
        --json)
            JSON_MODE=true
            shift
            ;;
        --root)
            if [[ $# -lt 2 ]]; then
                log_error "Missing value for --root"
                exit 1
            fi
            PROJECT_ROOT_INPUT="$2"
            shift 2
            ;;
        --refresh-index)
            REFRESH_INDEX=true
            shift
            ;;
        --strict)
            STRICT_MODE=true
            shift
            ;;
        --require-config)
            REQUIRE_CONFIG=true
            shift
            ;;
        --expect-config)
            if [[ $# -lt 2 ]]; then
                log_error "Missing value for --expect-config"
                exit 1
            fi
            EXPECTED_CONFIGS+=("$2")
            shift 2
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            log_error "Unknown argument: $1"
            show_help
            exit 1
            ;;
    esac
done

PROJECT_ROOT="$(resolve_project_root "$PROJECT_ROOT_INPUT")"

if ! ccc_available; then
    ACTION_LOG+=("install")
    if [[ "$JSON_MODE" == true ]]; then
        bash "$COMMON_SCRIPT_DIR/install.sh" --root "$PROJECT_ROOT" >/dev/null 2>&1
    else
        bash "$COMMON_SCRIPT_DIR/install.sh" --root "$PROJECT_ROOT"
    fi
fi

if [[ ! -d "$PROJECT_ROOT/.cocoindex_code" ]]; then
    ACTION_LOG+=("init")
    run_ccc "$PROJECT_ROOT" init >/dev/null 2>&1
fi

compute_readiness "$PROJECT_ROOT" false false

if [[ "$REFRESH_INDEX" == true || "$READINESS_INDEX_READY" == false ]]; then
    ACTION_LOG+=("index")
    run_ccc "$PROJECT_ROOT" index >/dev/null 2>&1
fi

if [[ "${#EXPECTED_CONFIGS[@]}" -gt 0 ]]; then
    compute_readiness "$PROJECT_ROOT" "$REQUIRE_CONFIG" false "${EXPECTED_CONFIGS[@]}"
else
    compute_readiness "$PROJECT_ROOT" "$REQUIRE_CONFIG" false
fi

if [[ "$JSON_MODE" == true ]]; then
    printf '{\n'
    printf '  "status": "%s",\n' "$(json_escape "$READINESS_STATUS")"
    printf '  "projectRoot": "%s",\n' "$(json_escape "$PROJECT_ROOT")"
    printf '  "binaryReady": %s,\n' "$READINESS_BINARY_READY"
    printf '  "skillPayloadReady": %s,\n' "$READINESS_SKILL_PAYLOAD_READY"
    printf '  "helperPayloadReady": %s,\n' "$READINESS_HELPER_PAYLOAD_READY"
    printf '  "indexReady": %s,\n' "$READINESS_INDEX_READY"
    printf '  "daemonRunning": %s,\n' "$READINESS_DAEMON_RUNNING"
    printf '  "indexFiles": %s,\n' "${READINESS_FILES_COUNT:-0}"
    printf '  "indexChunks": %s,\n' "${READINESS_CHUNKS_COUNT:-0}"
    printf '  "blockingIssues": ['
    for index in "${!READINESS_BLOCKING_ISSUES[@]}"; do
        [[ "$index" -gt 0 ]] && printf ', '
        printf '%s' "${READINESS_BLOCKING_ISSUES[$index]}"
    done
    printf '],\n'
    printf '  "warnings": ['
    for index in "${!READINESS_WARNINGS[@]}"; do
        [[ "$index" -gt 0 ]] && printf ', '
        printf '%s' "${READINESS_WARNINGS[$index]}"
    done
    printf '],\n'
    printf '  "detectedConfigs": ['
    for index in "${!READINESS_DETECTED_CONFIGS[@]}"; do
        [[ "$index" -gt 0 ]] && printf ', '
        printf '"%s"' "$(json_escape "${READINESS_DETECTED_CONFIGS[$index]}")"
    done
    printf '],\n'
    printf '  "expectedConfigs": ['
    for index in "${!READINESS_EXPECTED_CONFIGS[@]}"; do
        [[ "$index" -gt 0 ]] && printf ', '
        printf '"%s"' "$(json_escape "${READINESS_EXPECTED_CONFIGS[$index]}")"
    done
    printf '],\n'
    printf '  "actionsPerformed": ['
    for index in "${!ACTION_LOG[@]}"; do
        [[ "$index" -gt 0 ]] && printf ', '
        printf '"%s"' "$(json_escape "${ACTION_LOG[$index]}")"
    done
    printf '],\n'
    printf '  "recommendedNextStep": "%s"\n' "$(json_escape "$READINESS_RECOMMENDED_NEXT_STEP")"
    printf '}\n'
    if [[ "$STRICT_MODE" == true ]]; then
        exit "$(readiness_exit_code)"
    fi
    exit 0
fi

printf '%s\n' "=== CocoIndex Ensure Ready ==="
printf 'Project root: %s\n' "$PROJECT_ROOT"
printf 'Status: %s\n' "$READINESS_STATUS"
if [[ "${#ACTION_LOG[@]}" -eq 0 ]]; then
    log_pass "No changes required"
else
    printf 'Actions performed: %s\n' "$(IFS=', '; printf '%s' "${ACTION_LOG[*]}")"
fi
if [[ "$READINESS_BINARY_READY" == true ]]; then
    log_pass "Binary ready"
else
    log_warn "Binary not ready"
fi
if [[ "$READINESS_SKILL_PAYLOAD_READY" == true ]]; then
    log_pass "Skill payload present"
else
    log_warn "Skill payload incomplete"
fi
if [[ "$READINESS_HELPER_PAYLOAD_READY" == true ]]; then
    log_pass "Helper payload complete"
else
    log_warn "Helper payload incomplete"
fi
if [[ "$READINESS_INDEX_READY" == true ]]; then
    log_pass "Index ready (${READINESS_FILES_COUNT} files, ${READINESS_CHUNKS_COUNT} chunks)"
else
    log_warn "Index is still not ready"
fi
if [[ "$READINESS_DAEMON_RUNNING" == true ]]; then
    log_pass "Daemon running"
else
    log_warn "Daemon not running"
fi
if [[ "${#READINESS_DETECTED_CONFIGS[@]}" -gt 0 ]]; then
    printf 'Detected configs: %s\n' "$(IFS=', '; printf '%s' "${READINESS_DETECTED_CONFIGS[*]}")"
fi
if [[ "${#READINESS_EXPECTED_CONFIGS[@]}" -gt 0 ]]; then
    printf 'Expected configs: %s\n' "$(IFS=', '; printf '%s' "${READINESS_EXPECTED_CONFIGS[*]}")"
fi
if [[ "${#READINESS_BLOCKING_ISSUES[@]}" -gt 0 ]]; then
    printf 'Blocking issues: %s\n' "$(IFS=', '; printf '%s' "${READINESS_BLOCKING_ISSUES[*]}")"
fi
if [[ "${#READINESS_WARNINGS[@]}" -gt 0 ]]; then
    printf 'Warnings: %s\n' "$(IFS=', '; printf '%s' "${READINESS_WARNINGS[*]}")"
fi
printf 'Recommended next step: %s\n' "$READINESS_RECOMMENDED_NEXT_STEP"

if [[ "$STRICT_MODE" == true ]]; then
    exit "$(readiness_exit_code)"
fi
