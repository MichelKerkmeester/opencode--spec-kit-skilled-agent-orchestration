#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Runbook
# ───────────────────────────────────────────────────────────────
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

show_help() {
    cat << EOF
runbook.sh - Runbook helper for four self-healing failure classes

USAGE:
  ./runbook.sh <command> [args]

COMMANDS:
  list
      List all supported failure classes.

  show <failure-class>
      Print trigger, owner, escalation path, and drill command.

  drill <failure-class|all> [--scenario <success|escalate>] [--max-attempts <n>] [--backoff-seconds <n>]
      Execute deterministic remediation drill(s).

EXAMPLES:
  ./runbook.sh list
  ./runbook.sh show index-drift
  ./runbook.sh drill all --scenario success --max-attempts 3
  ./runbook.sh drill telemetry-drift --scenario escalate --max-attempts 2
EOF
}

class_script() {
    case "$1" in
        index-drift) echo "${SCRIPT_DIR}/heal-index-drift.sh" ;;
        session-ambiguity) echo "${SCRIPT_DIR}/heal-session-ambiguity.sh" ;;
        ledger-mismatch) echo "${SCRIPT_DIR}/heal-ledger-mismatch.sh" ;;
        telemetry-drift) echo "${SCRIPT_DIR}/heal-telemetry-drift.sh" ;;
        *) return 1 ;;
    esac
}

show_class() {
    case "$1" in
        index-drift)
            cat << EOF
CLASS: index-drift
TRIGGER: index parity check fails or retrieval health loop reports divergence
OWNER: Engineering Lead
ESCALATION: Engineering Lead -> Operations Lead
DRILL: ./runbook.sh drill index-drift --scenario success
EOF
            ;;
        session-ambiguity)
            cat << EOF
CLASS: session-ambiguity
TRIGGER: session misroute threshold exceeded on ambiguity fixtures
OWNER: QA Lead
ESCALATION: QA Lead -> Operations Lead
DRILL: ./runbook.sh drill session-ambiguity --scenario success
EOF
            ;;
        ledger-mismatch)
            cat << EOF
CLASS: ledger-mismatch
TRIGGER: mutation ledger parity mismatch or replay consistency failure
OWNER: Engineering Lead
ESCALATION: Engineering Lead -> Operations Lead
DRILL: ./runbook.sh drill ledger-mismatch --scenario success
EOF
            ;;
        telemetry-drift)
            cat << EOF
CLASS: telemetry-drift
TRIGGER: schema/doc parity failure or release-gate drift signal
OWNER: Operations Lead
ESCALATION: Operations Lead -> Product Owner
DRILL: ./runbook.sh drill telemetry-drift --scenario success
EOF
            ;;
        *)
            echo "ERROR: Unknown failure class: $1" >&2
            return 2
            ;;
    esac
}

run_drill_one() {
    local failure_class="$1"
    shift
    local script
    script="$(class_script "$failure_class")" || {
        echo "ERROR: Unknown failure class: ${failure_class}" >&2
        return 2
    }
    "${script}" "$@"
}

run_drill() {
    local target="$1"
    shift
    if [[ "$target" == "all" ]]; then
        local failures=0
        for failure_class in index-drift session-ambiguity ledger-mismatch telemetry-drift; do
            if ! run_drill_one "$failure_class" "$@"; then
                failures=$((failures + 1))
            fi
        done

        if (( failures > 0 )); then
            return 1
        fi
        return 0
    fi
    run_drill_one "$target" "$@"
}

main() {
    if [[ $# -eq 0 ]]; then
        show_help
        exit 2
    fi

    local cmd="$1"
    shift

    case "$cmd" in
        --help|-h|help)
            show_help
            ;;
        list)
            cat << EOF
index-drift
session-ambiguity
ledger-mismatch
telemetry-drift
EOF
            ;;
        show)
            if [[ $# -lt 1 ]]; then
                echo "ERROR: show requires <failure-class>" >&2
                exit 2
            fi
            show_class "$1"
            ;;
        drill)
            if [[ $# -lt 1 ]]; then
                echo "ERROR: drill requires <failure-class|all>" >&2
                exit 2
            fi
            local target="$1"
            shift
            run_drill "$target" "$@"
            ;;
        *)
            echo "ERROR: Unknown command: ${cmd}" >&2
            show_help
            exit 2
            ;;
    esac
}

main "$@"

# Exit codes:
#   0 - Success
#   1 - General error
#   2 - ERROR: Unknown failure class: $1
