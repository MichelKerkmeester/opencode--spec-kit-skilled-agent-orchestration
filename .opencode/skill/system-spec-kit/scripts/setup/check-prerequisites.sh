#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# SPECKIT: CHECK PREREQUISITES
# ───────────────────────────────────────────────────────────────
# Validates spec folder exists with required files before implementation.

set -euo pipefail

# ───────────────────────────────────────────────────────────────
# 1. ARGUMENT PARSING
# ───────────────────────────────────────────────────────────────

JSON_MODE=false
REQUIRE_TASKS=false
INCLUDE_TASKS=false
PATHS_ONLY=false
VALIDATE_MODE=false
VALIDATE_STRICT=false
VALIDATE_VERBOSE=false

for arg in "$@"; do
    case "$arg" in
        --json) JSON_MODE=true ;;
        --require-tasks) REQUIRE_TASKS=true ;;
        --include-tasks) INCLUDE_TASKS=true ;;
        --paths-only) PATHS_ONLY=true ;;
        --validate|-V) VALIDATE_MODE=true ;;
        --validate-strict) VALIDATE_MODE=true; VALIDATE_STRICT=true ;;
        --validate-verbose) VALIDATE_MODE=true; VALIDATE_VERBOSE=true ;;
        --help|-h)
            cat << 'EOF'
check-prerequisites.sh - Spec folder prerequisite validation

USAGE: ./check-prerequisites.sh [OPTIONS]

OPTIONS:
  --json              Output in JSON format
  --require-tasks     Require tasks.md (for implementation phase)
  --include-tasks     Include tasks.md in AVAILABLE_DOCS
  --paths-only        Output paths only (no validation)
  --validate, -V      Run validate-spec.sh on folder
  --validate-strict   Strict mode (warnings as errors)
  --validate-verbose  Verbose validation output
  --help, -h          Show help
EOF
            exit 0
            ;;
        *)
            echo "ERROR: Unknown option '$arg'. Use --help for usage." >&2
            exit 1
            ;;
    esac
done

# ───────────────────────────────────────────────────────────────
# 2. INITIALIZATION
# ───────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../common.sh"

# JSON escape helper for safe machine-readable output.
json_escape() {
    local str="$1"
    str="${str//\\/\\\\}"
    str="${str//\"/\\\"}"
    str="${str//$'\n'/\\n}"
    str="${str//$'\r'/\\r}"
    str="${str//$'\t'/\\t}"
    printf '%s' "$str"
}

# SECURITY: get_feature_paths uses printf %q for shell-safe output
eval "$(get_feature_paths)"
check_feature_branch "$CURRENT_BRANCH" "$HAS_GIT" || exit 1

# ───────────────────────────────────────────────────────────────
# 3. PATH-ONLY MODE
# ───────────────────────────────────────────────────────────────

if $PATHS_ONLY; then
    if $JSON_MODE; then
        # Minimal JSON paths payload (no validation performed)
        printf '{"REPO_ROOT":"%s","BRANCH":"%s","FEATURE_DIR":"%s","FEATURE_SPEC":"%s","IMPL_PLAN":"%s","TASKS":"%s","RESEARCH_DIR":"%s","RESEARCH":"%s"}\n' \
            "$(json_escape "$REPO_ROOT")" \
            "$(json_escape "$CURRENT_BRANCH")" \
            "$(json_escape "$FEATURE_DIR")" \
            "$(json_escape "$FEATURE_SPEC")" \
            "$(json_escape "$IMPL_PLAN")" \
            "$(json_escape "$TASKS")" \
            "$(json_escape "$RESEARCH_DIR")" \
            "$(json_escape "$RESEARCH")"
    else
        echo "REPO_ROOT: $REPO_ROOT"
        echo "BRANCH: $CURRENT_BRANCH"
        echo "FEATURE_DIR: $FEATURE_DIR"
        echo "FEATURE_SPEC: $FEATURE_SPEC"
        echo "IMPL_PLAN: $IMPL_PLAN"
        echo "TASKS: $TASKS"
        echo "RESEARCH_DIR: $RESEARCH_DIR"
        echo "RESEARCH: $RESEARCH"
    fi
    exit 0
fi

# ───────────────────────────────────────────────────────────────
# 4. VALIDATION
# ───────────────────────────────────────────────────────────────

if [[ ! -d "$FEATURE_DIR" ]]; then
    echo "ERROR: Feature directory not found: $FEATURE_DIR" >&2
    echo "Run /spec_kit:complete or /spec_kit:plan first to create the feature structure." >&2
    exit 1
fi

if $VALIDATE_MODE; then
    VALIDATE_ARGS=()
    $JSON_MODE && VALIDATE_ARGS+=(--json)
    $VALIDATE_STRICT && VALIDATE_ARGS+=(--strict)
    $VALIDATE_VERBOSE && VALIDATE_ARGS+=(--verbose)
    
    "$SCRIPT_DIR/../spec/validate.sh" "${VALIDATE_ARGS[@]}" "$FEATURE_DIR"
    exit $?
fi

if [[ ! -f "$IMPL_PLAN" ]]; then
    echo "ERROR: plan.md not found in $FEATURE_DIR" >&2
    exit 1
fi

if $REQUIRE_TASKS && [[ ! -f "$TASKS" ]]; then
    echo "ERROR: tasks.md not found in $FEATURE_DIR" >&2
    exit 1
fi

# ───────────────────────────────────────────────────────────────
# 5. BUILD AVAILABLE DOCS LIST
# ───────────────────────────────────────────────────────────────

docs=()
[[ -f "$RESEARCH" ]] && docs+=("research/research.md")
[[ -d "$CHECKLISTS_DIR" && -n "$(ls -A "$CHECKLISTS_DIR" 2>/dev/null)" ]] && docs+=("checklists/")
[[ -d "$DECISIONS_DIR" && -n "$(ls -A "$DECISIONS_DIR" 2>/dev/null)" ]] && docs+=("decisions/")
$INCLUDE_TASKS && [[ -f "$TASKS" ]] && docs+=("tasks.md")

# ───────────────────────────────────────────────────────────────
# 6. OUTPUT
# ───────────────────────────────────────────────────────────────

if $JSON_MODE; then
    # Build JSON array of documents
    if [[ ${#docs[@]} -eq 0 ]]; then
        json_docs="[]"
    else
        json_docs="["
        for doc in "${docs[@]}"; do
            [[ "$json_docs" != "[" ]] && json_docs+=","
            json_docs+="\"$(json_escape "$doc")\""
        done
        json_docs+="]"
    fi
    
    printf '{"FEATURE_DIR":"%s","AVAILABLE_DOCS":%s}\n' "$(json_escape "$FEATURE_DIR")" "$json_docs"
else
    echo "FEATURE_DIR:$FEATURE_DIR"
    echo "AVAILABLE_DOCS:"
    check_file "$RESEARCH" "research/research.md"
    check_dir "$CHECKLISTS_DIR" "checklists/"
    check_dir "$DECISIONS_DIR" "decisions/"
    $INCLUDE_TASKS && check_file "$TASKS" "tasks.md"
fi

# Exit codes:
#   0 - Success
#   1 - ERROR: Unknown option '$arg'. Use --help for usage
