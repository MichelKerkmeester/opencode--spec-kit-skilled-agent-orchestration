#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Heal Ledger Mismatch
# ───────────────────────────────────────────────────────────────
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/ops-common.sh"

FAILURE_CLASS="ledger-mismatch"
OWNER="Engineering Lead"
SCENARIO="success"
MAX_ATTEMPTS=3
BACKOFF_SECONDS=0
DETECT_FAILURES=1
REPAIR_FAILURES=0
VERIFY_FAILURES=0

show_help() {
    cat << EOF
heal-ledger-mismatch.sh - Deterministic auto-remediation for mutation ledger mismatch

USAGE:
  ./heal-ledger-mismatch.sh [OPTIONS]

OPTIONS:
  --scenario <success|escalate>  Execution profile (default: success)
  --max-attempts <n>             Retry bound per step (default: 3)
  --backoff-seconds <n>          Delay between retries (default: 0)
  --detect-failures <n>          Fail detect step n times before success
  --repair-failures <n>          Fail repair step n times before success
  --verify-failures <n>          Fail verify step n times before success
  --help                         Show this help
EOF
}

parse_args() {
    while [[ $# -gt 0 ]]; do
        case "$1" in
            --help|-h) show_help; exit 0 ;;
            --scenario)
                [[ $# -lt 2 ]] && { echo "ERROR: --scenario requires a value" >&2; exit 2; }
                SCENARIO="$2"; shift 2 ;;
            --max-attempts)
                [[ $# -lt 2 ]] && { echo "ERROR: --max-attempts requires a value" >&2; exit 2; }
                MAX_ATTEMPTS="$2"; shift 2 ;;
            --backoff-seconds)
                [[ $# -lt 2 ]] && { echo "ERROR: --backoff-seconds requires a value" >&2; exit 2; }
                BACKOFF_SECONDS="$2"; shift 2 ;;
            --detect-failures)
                [[ $# -lt 2 ]] && { echo "ERROR: --detect-failures requires a value" >&2; exit 2; }
                DETECT_FAILURES="$2"; shift 2 ;;
            --repair-failures)
                [[ $# -lt 2 ]] && { echo "ERROR: --repair-failures requires a value" >&2; exit 2; }
                REPAIR_FAILURES="$2"; shift 2 ;;
            --verify-failures)
                [[ $# -lt 2 ]] && { echo "ERROR: --verify-failures requires a value" >&2; exit 2; }
                VERIFY_FAILURES="$2"; shift 2 ;;
            *)
                echo "ERROR: Unknown option: $1" >&2
                exit 2
                ;;
        esac
    done
}

apply_scenario() {
    case "$SCENARIO" in
        success)
            ;;
        escalate)
            DETECT_FAILURES="$MAX_ATTEMPTS"
            REPAIR_FAILURES="$MAX_ATTEMPTS"
            VERIFY_FAILURES="$MAX_ATTEMPTS"
            ;;
        *)
            echo "ERROR: scenario must be success or escalate" >&2
            exit 2
            ;;
    esac
}

validate() {
    ops_validate_common_options "$MAX_ATTEMPTS" "$BACKOFF_SECONDS"
    ops_require_uint "detect_failures" "$DETECT_FAILURES"
    ops_require_uint "repair_failures" "$REPAIR_FAILURES"
    ops_require_uint "verify_failures" "$VERIFY_FAILURES"
}

main() {
    parse_args "$@"
    validate
    apply_scenario

    ops_log "STATE" "class=${FAILURE_CLASS} scenario=${SCENARIO} max_attempts=${MAX_ATTEMPTS}"

    ops_run_step "$FAILURE_CLASS" "detect-ledger-divergence" "$MAX_ATTEMPTS" "$BACKOFF_SECONDS" "$DETECT_FAILURES" "$OWNER" \
        "node dist/memory/cleanup-orphaned-vectors.js --check-ledger --strict" || exit 1

    ops_run_step "$FAILURE_CLASS" "replay-ledger" "$MAX_ATTEMPTS" "$BACKOFF_SECONDS" "$REPAIR_FAILURES" "$OWNER" \
        "node dist/memory/cleanup-orphaned-vectors.js --repair-ledger --replay" || exit 1

    ops_emit_success "$FAILURE_CLASS" "$OWNER" "ledger replay consistency restored"
}

main "$@"

# Exit codes:
#   0 - Success
#   2 - ERROR: Unknown option: $1
