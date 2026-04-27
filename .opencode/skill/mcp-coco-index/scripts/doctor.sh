#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: COCOINDEX DOCTOR
# ───────────────────────────────────────────────────────────────
# Read-only health check for the CocoIndex skill installation.
#
# Usage: bash .opencode/skill/mcp-coco-index/scripts/doctor.sh [--json] [--root <path>] [--strict] [--require-config] [--require-daemon] [--expect-config <path>]
#
# Exit Codes:
#   0  - Readiness checks passed, or advisory mode completed
#   1  - Invalid arguments
#   20 - Repo-local CocoIndex binary missing
#   21 - Skill payload missing
#   22 - Helper-script payload incomplete
#   23 - Index missing or empty
#   24 - Required config wiring missing
#   25 - Required daemon not running

set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"

JSON_MODE=false
STRICT_MODE=false
REQUIRE_CONFIG=false
REQUIRE_DAEMON=false
PROJECT_ROOT_INPUT=""
EXPECTED_CONFIGS=()

show_help() {
    cat <<'EOF'
Usage: doctor.sh [--json] [--root <path>] [--strict] [--require-config] [--require-daemon] [--expect-config <path>]

Options:
  --json                  Emit machine-readable JSON output
  --root <path>           Override the project root to inspect
  --strict                Fail nonzero when required readiness checks fail
  --require-config        Require cocoindex_code config wiring to be present
  --require-daemon        Require a running daemon
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
        --strict)
            STRICT_MODE=true
            shift
            ;;
        --require-config)
            REQUIRE_CONFIG=true
            shift
            ;;
        --require-daemon)
            REQUIRE_DAEMON=true
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
COMMAND_ON_PATH="$(command -v ccc || true)"

if [[ "${#EXPECTED_CONFIGS[@]}" -gt 0 ]]; then
    compute_readiness "$PROJECT_ROOT" "$REQUIRE_CONFIG" "$REQUIRE_DAEMON" "${EXPECTED_CONFIGS[@]}"
else
    compute_readiness "$PROJECT_ROOT" "$REQUIRE_CONFIG" "$REQUIRE_DAEMON"
fi

if [[ "$JSON_MODE" == true ]]; then
    printf '{\n'
    printf '  "status": "%s",\n' "$(json_escape "$READINESS_STATUS")"
    printf '  "binaryReady": %s,\n' "$READINESS_BINARY_READY"
    printf '  "binaryPath": "%s",\n' "$(json_escape "$CCC_BIN")"
    printf '  "binaryVersion": "%s",\n' "$(json_escape "$READINESS_VERSION_TEXT")"
    printf '  "commandOnPath": "%s",\n' "$(json_escape "$COMMAND_ON_PATH")"
    printf '  "projectRoot": "%s",\n' "$(json_escape "$PROJECT_ROOT")"
    printf '  "projectRootExists": true,\n'
    printf '  "skillPayloadReady": %s,\n' "$READINESS_SKILL_PAYLOAD_READY"
    printf '  "helperPayloadReady": %s,\n' "$READINESS_HELPER_PAYLOAD_READY"
    printf '  "daemonRunning": %s,\n' "$READINESS_DAEMON_RUNNING"
    printf '  "indexReady": %s,\n' "$READINESS_INDEX_READY"
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
    printf '  "recommendedNextStep": "%s"\n' "$(json_escape "$READINESS_RECOMMENDED_NEXT_STEP")"
    printf '}\n'
    if [[ "$STRICT_MODE" == true ]]; then
        exit "$(readiness_exit_code)"
    fi
    exit 0
fi

printf '%s\n' "=== CocoIndex Doctor ==="
printf 'Project root: %s\n' "$PROJECT_ROOT"
printf 'Binary path:  %s\n' "$CCC_BIN"
printf 'PATH ccc:     %s\n' "${COMMAND_ON_PATH:-not found}"
printf 'Status:       %s\n' "$READINESS_STATUS"

if [[ "$READINESS_BINARY_READY" == true ]]; then
    log_pass "Binary ready${READINESS_VERSION_TEXT:+ (version $READINESS_VERSION_TEXT)}"
else
    log_warn "Binary not ready"
fi

VERSION_OUTPUT="$("$CCC_BIN" --version 2>&1 || true)"
if echo "$VERSION_OUTPUT" | grep -q "spec-kit-fork"; then
  echo "✓ Fork version detected: $VERSION_OUTPUT"
else
  echo "⚠ WARNING: ccc version does not contain 'spec-kit-fork' marker. Re-run install.sh to restore the fork."
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
    log_warn "Index not ready"
    [[ -n "$READINESS_STATUS_OUTPUT" ]] && printf '%s\n' "$READINESS_STATUS_OUTPUT"
fi

if [[ "$READINESS_DAEMON_RUNNING" == true ]]; then
    log_pass "Daemon running"
else
    log_warn "Daemon not running"
    [[ -n "$READINESS_DAEMON_STATUS_TEXT" ]] && printf '%s\n' "$READINESS_DAEMON_STATUS_TEXT"
fi

printf 'Detected configs: %s/%s\n' "${#READINESS_DETECTED_CONFIGS[@]}" "${#CONFIG_PATHS[@]}"
if [[ "${#READINESS_DETECTED_CONFIGS[@]}" -gt 0 ]]; then
    printf '  %s\n' "${READINESS_DETECTED_CONFIGS[@]}"
fi

if [[ "${#READINESS_EXPECTED_CONFIGS[@]}" -gt 0 ]]; then
    printf 'Expected configs: %s\n' "${#READINESS_EXPECTED_CONFIGS[@]}"
    printf '  %s\n' "${READINESS_EXPECTED_CONFIGS[@]}"
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
