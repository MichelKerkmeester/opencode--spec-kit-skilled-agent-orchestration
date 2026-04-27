#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Scaffold debug-delegation.md
# ───────────────────────────────────────────────────────────────
# Generates a pre-filled debug-delegation.md inside a spec folder
# from a failure-trail JSON, using the Debug Context Handoff schema
# from .opencode/agent/debug.md.
#
# Surfaced ONLY after a user opts in to the failure-threshold prompt
# in spec_kit_implement_auto.yaml or spec_kit_complete_auto.yaml.
# Never auto-dispatches @debug — the user runs Task tool → @debug
# themselves with this scaffold as the structured handoff.
#
# Usage:
#   scaffold-debug-delegation.sh --spec-folder <path> --errors-file <path>
#   scaffold-debug-delegation.sh --spec-folder <path> --errors-json '<json>'
#
# Errors JSON schema (array of 3 attempts):
#   [
#     { "approach": "...", "result": "...", "diff": "..." },
#     { "approach": "...", "result": "..." },
#     { "approach": "...", "result": "..." }
#   ]
#
# Optional metadata args:
#   --task-id <id>        (default: TBD)
#   --error-category <c>  (default: runtime_error; one of:
#                         syntax_error|type_error|runtime_error|
#                         test_failure|build_error|lint_error)
#   --error-message <s>   (default: "[failure trail not captured]")
#   --affected-files <f>  Comma-separated list (default: TBD)
#   --hypothesis <h>      Current theory text (optional)
#
# Versioning:
#   - If <spec-folder>/debug-delegation.md does not exist, write there.
#   - Else, write <spec-folder>/debug-delegation-002.md (then -003.md,
#     etc.) — never overwrite a prior scaffold or user-authored file.
#
# Output:
#   - Prints absolute path of the written scaffold to stdout on success.
#   - Exits 0 on success, non-zero on validation failure.

set -euo pipefail

SPEC_FOLDER=""
ERRORS_FILE=""
ERRORS_JSON=""
TASK_ID="TBD"
ERROR_CATEGORY="runtime_error"
ERROR_MESSAGE="[failure trail not captured]"
AFFECTED_FILES=""
HYPOTHESIS=""

while [[ $# -gt 0 ]]; do
    case "$1" in
        --spec-folder)    SPEC_FOLDER="$2"; shift 2 ;;
        --errors-file)    ERRORS_FILE="$2"; shift 2 ;;
        --errors-json)    ERRORS_JSON="$2"; shift 2 ;;
        --task-id)        TASK_ID="$2"; shift 2 ;;
        --error-category) ERROR_CATEGORY="$2"; shift 2 ;;
        --error-message)  ERROR_MESSAGE="$2"; shift 2 ;;
        --affected-files) AFFECTED_FILES="$2"; shift 2 ;;
        --hypothesis)     HYPOTHESIS="$2"; shift 2 ;;
        --help|-h)
            sed -n '1,40p' "$0" | sed 's/^# \{0,1\}//'
            exit 0
            ;;
        *)
            echo "Error: unknown argument: $1" >&2
            exit 1
            ;;
    esac
done

if [[ -z "$SPEC_FOLDER" ]]; then
    echo "Error: --spec-folder is required" >&2
    exit 1
fi
if [[ ! -d "$SPEC_FOLDER" ]]; then
    echo "Error: spec-folder does not exist: $SPEC_FOLDER" >&2
    exit 1
fi

# Resolve canonical absolute path so writes stay inside an approved root.
SPEC_FOLDER_ABS="$(cd "$SPEC_FOLDER" >/dev/null 2>&1 && pwd -P)"
case "$SPEC_FOLDER_ABS" in
    */specs/*|*/.opencode/specs/*) ;;
    *)
        echo "Error: spec-folder must be under specs/ or .opencode/specs/" >&2
        echo "Resolved path: $SPEC_FOLDER_ABS" >&2
        exit 1
        ;;
esac

# Pick versioned output filename so we never overwrite a prior scaffold
# or user-authored debug-delegation.md.
OUTPUT_BASENAME="debug-delegation.md"
OUTPUT_PATH="$SPEC_FOLDER_ABS/$OUTPUT_BASENAME"
if [[ -e "$OUTPUT_PATH" ]]; then
    next=2
    while [[ -e "$SPEC_FOLDER_ABS/debug-delegation-$(printf '%03d' "$next").md" ]]; do
        next=$((next + 1))
        if [[ $next -gt 999 ]]; then
            echo "Error: too many debug-delegation files (>999). Clean up before scaffolding." >&2
            exit 1
        fi
    done
    OUTPUT_BASENAME="debug-delegation-$(printf '%03d' "$next").md"
    OUTPUT_PATH="$SPEC_FOLDER_ABS/$OUTPUT_BASENAME"
fi

# Resolve the failure trail. Three sources, in order of preference:
#   --errors-json (inline)  ->  --errors-file  ->  empty placeholder
TRAIL_JSON=""
if [[ -n "$ERRORS_JSON" ]]; then
    TRAIL_JSON="$ERRORS_JSON"
elif [[ -n "$ERRORS_FILE" ]]; then
    if [[ ! -f "$ERRORS_FILE" ]]; then
        echo "Error: errors-file does not exist: $ERRORS_FILE" >&2
        exit 1
    fi
    TRAIL_JSON="$(cat "$ERRORS_FILE")"
fi

# Extract Attempt 1/2/3 fields with jq if available; fall back to placeholders.
A1_APPROACH="[approach not captured]"; A1_RESULT="[result not captured]"; A1_DIFF=""
A2_APPROACH="[approach not captured]"; A2_RESULT="[result not captured]"
A3_APPROACH="[approach not captured]"; A3_RESULT="[result not captured]"
if [[ -n "$TRAIL_JSON" ]] && command -v jq >/dev/null 2>&1; then
    A1_APPROACH="$(printf '%s' "$TRAIL_JSON" | jq -r '.[0].approach // "[approach not captured]"' 2>/dev/null || echo "[approach not captured]")"
    A1_RESULT="$(printf '%s' "$TRAIL_JSON" | jq -r '.[0].result // "[result not captured]"' 2>/dev/null || echo "[result not captured]")"
    A1_DIFF="$(printf '%s' "$TRAIL_JSON" | jq -r '.[0].diff // ""' 2>/dev/null || echo "")"
    A2_APPROACH="$(printf '%s' "$TRAIL_JSON" | jq -r '.[1].approach // "[approach not captured]"' 2>/dev/null || echo "[approach not captured]")"
    A2_RESULT="$(printf '%s' "$TRAIL_JSON" | jq -r '.[1].result // "[result not captured]"' 2>/dev/null || echo "[result not captured]")"
    A3_APPROACH="$(printf '%s' "$TRAIL_JSON" | jq -r '.[2].approach // "[approach not captured]"' 2>/dev/null || echo "[approach not captured]")"
    A3_RESULT="$(printf '%s' "$TRAIL_JSON" | jq -r '.[2].result // "[result not captured]"' 2>/dev/null || echo "[result not captured]")"
fi

# Format Affected Files block.
AFFECTED_FILES_BLOCK=""
if [[ -n "$AFFECTED_FILES" ]]; then
    IFS=',' read -ra _files <<< "$AFFECTED_FILES"
    for _f in "${_files[@]}"; do
        _f="$(echo "$_f" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')"
        [[ -z "$_f" ]] && continue
        AFFECTED_FILES_BLOCK="${AFFECTED_FILES_BLOCK}- ${_f}"$'\n'
    done
else
    AFFECTED_FILES_BLOCK="- [affected file 1 — to be filled by user before dispatch]"$'\n'"- [affected file 2 — to be filled by user before dispatch]"$'\n'
fi

NOW_ISO="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
HYPOTHESIS_TEXT="${HYPOTHESIS:-[Operator: add the current theory about the root cause before dispatching @debug.]}"
A1_DIFF_BLOCK=""
if [[ -n "$A1_DIFF" ]]; then
    A1_DIFF_BLOCK="- **Diff:** ${A1_DIFF}"
else
    A1_DIFF_BLOCK="- **Diff:** [optional — paste the failed diff or link]"
fi

# Spec-folder-relative packet pointer (drops everything up to and including .opencode/specs/).
PACKET_POINTER="${SPEC_FOLDER_ABS#*/.opencode/specs/}"
if [[ "$PACKET_POINTER" == "$SPEC_FOLDER_ABS" ]]; then
    PACKET_POINTER="${SPEC_FOLDER_ABS#*/specs/}"
fi

cat > "$OUTPUT_PATH" <<EOF
---
title: "Debug Delegation Report — Task ${TASK_ID}"
description: "Pre-filled handoff for @debug after 3+ failed task attempts. Operator must review and dispatch via Task tool — never auto-dispatched."
trigger_phrases:
  - "debug"
  - "delegation"
  - "scaffold"
  - "task ${TASK_ID}"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "${PACKET_POINTER}"
    last_updated_at: "${NOW_ISO}"
    last_updated_by: "scaffold-debug-delegation.sh"
    recent_action: "Generated debug-delegation scaffold from failure trail"
    next_safe_action: "Operator review + dispatch via Task tool → @debug with this file as the handoff"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-${TASK_ID}-${NOW_ISO}"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Debug Delegation Report — Task ${TASK_ID}

Pre-filled handoff for the @debug agent after 3+ failed task attempts. The operator must review and dispatch via Task tool. Never auto-dispatched.

<!-- SPECKIT_TEMPLATE_SOURCE: debug-delegation | v1.0 -->

---

<!-- ANCHOR:delegation-metadata -->
**Date:** ${NOW_ISO}
**Task ID:** ${TASK_ID}
**Delegated By:** spec_kit_implement_auto.yaml / spec_kit_complete_auto.yaml workflow operator
**Attempts Before Delegation:** 3
<!-- /ANCHOR:delegation-metadata -->

<!-- ANCHOR:problem-summary -->
## 1. PROBLEM SUMMARY

### Error Category
${ERROR_CATEGORY}

### Error Message
\`\`\`
${ERROR_MESSAGE}
\`\`\`

### Affected Files
${AFFECTED_FILES_BLOCK}<!-- /ANCHOR:problem-summary -->

<!-- ANCHOR:attempted-fixes -->
## 2. ATTEMPTED FIXES

### Attempt 1
- **Approach:** ${A1_APPROACH}
- **Result:** ${A1_RESULT}
${A1_DIFF_BLOCK}

### Attempt 2
- **Approach:** ${A2_APPROACH}
- **Result:** ${A2_RESULT}

### Attempt 3
- **Approach:** ${A3_APPROACH}
- **Result:** ${A3_RESULT}
<!-- /ANCHOR:attempted-fixes -->

<!-- ANCHOR:context-for-specialist -->
## 3. CONTEXT FOR SPECIALIST

### Relevant Code Section
\`\`\`
[Operator: paste the most relevant code snippet around the failure site here.]
\`\`\`

### Related Documentation
- [Operator: link spec.md / plan.md sections, or external docs, that the @debug agent should read first.]

### Hypothesis
${HYPOTHESIS_TEXT}
<!-- /ANCHOR:context-for-specialist -->

<!-- ANCHOR:recommended-next-steps -->
## 4. RECOMMENDED NEXT STEPS

1. Operator: review this scaffold, fill any \`[Operator: ...]\` placeholders, then dispatch via Task tool → @debug with this file path as the structured handoff.
2. @debug runs the 5-phase methodology (Observe → Analyze → Hypothesize → Adversarially Validate → Fix) and writes its findings back into this file's lower sections.
<!-- /ANCHOR:recommended-next-steps -->

<!-- ANCHOR:handoff-checklist -->
## 5. HANDOFF CHECKLIST

- [ ] All attempted fixes documented (Attempts 1-3 filled)
- [ ] Error message captured verbatim (no paraphrasing)
- [ ] Affected files list complete
- [ ] Reproduction steps clear (added by operator before dispatch)
- [ ] Hypothesis section reflects the operator's current theory
<!-- /ANCHOR:handoff-checklist -->

---

<!--
SCAFFOLD GENERATED BY: .opencode/skill/system-spec-kit/scripts/spec/scaffold-debug-delegation.sh
SCHEMA SOURCE: .opencode/agent/debug.md (Debug Context Handoff format, lines 60-89)
HARD CONSTRAINT: workflow does NOT auto-dispatch @debug — operator dispatches via Task tool.
SEE ALSO: .opencode/specs/skilled-agent-orchestration/050-agent-debug-integration/spec.md (REQ-004, REQ-005)
-->
EOF

echo "$OUTPUT_PATH"
