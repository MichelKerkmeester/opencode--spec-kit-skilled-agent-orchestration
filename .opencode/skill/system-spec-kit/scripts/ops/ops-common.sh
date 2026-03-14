#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Ops Common
# ───────────────────────────────────────────────────────────────
set -euo pipefail

OPS_VERSION="1.0.0"

ops_now_utc() {
    date -u +"%Y-%m-%dT%H:%M:%SZ"
}

ops_is_uint() {
    [[ "$1" =~ ^[0-9]+$ ]]
}

ops_require_uint() {
    local field="$1"
    local value="$2"
    if ! ops_is_uint "$value"; then
        echo "ERROR: ${field} must be an unsigned integer (got: ${value})" >&2
        exit 2
    fi
}

ops_json_escape() {
    local value="$1"
    value="${value//\\/\\\\}"
    value="${value//\"/\\\"}"
    value="${value//$'\n'/\\n}"
    value="${value//$'\r'/\\r}"
    value="${value//$'\t'/\\t}"
    printf '%s' "$value"
}

ops_log() {
    local level="$1"
    local message="$2"
    printf '%s | %s | %s\n' "$(ops_now_utc)" "$level" "$message"
}

ops_emit_escalation() {
    local failure_class="$1"
    local step="$2"
    local attempts="$3"
    local owner="$4"
    local command="$5"
    local reason="${6:-bounded-retry-exhausted}"
    local next_action="${7:-operator-ack-required}"
    local payload

    payload="$(printf '{"event":"ESCALATION","failure_class":"%s","step":"%s","attempts":%s,"owner":"%s","reason":"%s","next_action":"%s","command":"%s","timestamp":"%s"}' \
        "$(ops_json_escape "$failure_class")" \
        "$(ops_json_escape "$step")" \
        "$attempts" \
        "$(ops_json_escape "$owner")" \
        "$(ops_json_escape "$reason")" \
        "$(ops_json_escape "$next_action")" \
        "$(ops_json_escape "$command")" \
        "$(ops_now_utc)")"

    printf '%s\n' "$payload"

    if [[ -n "${ESCALATION_FILE:-}" ]]; then
        printf '%s\n' "$payload" > "${ESCALATION_FILE}"
    fi
}

ops_emit_success() {
    local failure_class="$1"
    local owner="$2"
    local summary="$3"
    local payload

    payload="$(printf '{"event":"RECOVERY_COMPLETE","failure_class":"%s","owner":"%s","summary":"%s","timestamp":"%s"}' \
        "$(ops_json_escape "$failure_class")" \
        "$(ops_json_escape "$owner")" \
        "$(ops_json_escape "$summary")" \
        "$(ops_now_utc)")"

    printf '%s\n' "$payload"
}

ops_run_step() {
    local failure_class="$1"
    local step="$2"
    local max_attempts="$3"
    local backoff_seconds="$4"
    local fail_attempts="$5"
    local owner="$6"
    local command="$7"
    local attempt=1

    ops_require_uint "max_attempts" "$max_attempts"
    ops_require_uint "backoff_seconds" "$backoff_seconds"
    ops_require_uint "fail_attempts" "$fail_attempts"

    while (( attempt <= max_attempts )); do
        ops_log "ACTION" "class=${failure_class} step=${step} attempt=${attempt}/${max_attempts} command=${command}"

        if (( attempt <= fail_attempts )); then
            ops_log "WARN" "class=${failure_class} step=${step} outcome=retryable-failure"

            if (( attempt == max_attempts )); then
                ops_emit_escalation "$failure_class" "$step" "$max_attempts" "$owner" "$command"
                return 1
            fi

            if (( backoff_seconds > 0 )); then
                sleep "$backoff_seconds"
            fi
            attempt=$((attempt + 1))
            continue
        fi

        ops_log "OK" "class=${failure_class} step=${step} outcome=success"
        return 0
    done

    # Defensive fallback, should not be reached.
    ops_emit_escalation "$failure_class" "$step" "$max_attempts" "$owner" "$command"
    return 1
}

ops_validate_common_options() {
    ops_require_uint "max_attempts" "$1"
    ops_require_uint "backoff_seconds" "$2"
    if (( "$1" == 0 )); then
        echo "ERROR: max_attempts must be >= 1" >&2
        exit 2
    fi
}

# Exit codes:
#   0 - Success
#   1 - General error
#   2 - ERROR: ${field} must be an unsigned integer (got: ${value})
