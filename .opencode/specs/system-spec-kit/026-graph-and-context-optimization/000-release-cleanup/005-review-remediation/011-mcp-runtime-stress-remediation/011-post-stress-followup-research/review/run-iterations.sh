#!/usr/bin/env bash
# Loop iterations 2-10 of /spec_kit:deep-review:auto for 012-015 integrated review.
# Same shape as 011/research/run-iterations.sh; review/ paths instead of research/.

set -uo pipefail

PACKET=".opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research"
REV="${PACKET}/review"
ITER_DIR_ABS="${PWD}/${REV}/iterations"
DELTA_DIR_ABS="${PWD}/${REV}/deltas"
STATE_LOG="${REV}/deep-review-state.jsonl"
STRATEGY="${REV}/deep-review-strategy.md"

START_ITER="${1:-2}"
END_ITER="${2:-10}"

log() { echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] $*"; }
ts() { date -u +%Y-%m-%dT%H:%M:%SZ; }

run_iteration() {
  local N="$1"
  local NNN
  NNN=$(printf "%03d" "$N")
  local PROMPT_FILE="${REV}/prompts/iteration-${NNN}.md"
  local ITER_OUT="${ITER_DIR_ABS}/iteration-${NNN}.md"
  local DELTA_OUT="${DELTA_DIR_ABS}/iter-${NNN}.jsonl"
  local CODEX_LOG="${REV}/iterations/iteration-${NNN}.codex.log"

  log "=== Iteration ${N} dispatching ==="
  echo "{\"type\":\"event\",\"event\":\"iteration_started\",\"iteration\":${N},\"timestamp\":\"$(ts)\"}" >> "${STATE_LOG}"

  local PRIOR_ITERS=""
  for prev in $(seq 1 $((N-1))); do
    local PREV_NNN
    PREV_NNN=$(printf "%03d" "$prev")
    PRIOR_ITERS="${PRIOR_ITERS}\n- ${PWD}/${REV}/iterations/iteration-${PREV_NNN}.md"
  done

  cat > "${PROMPT_FILE}" <<EOF
# Deep Review Iteration ${NNN}

You are iteration ${N} of 10 in a deep-review loop auditing 012-015 + 28 catalog/playbook updates as a cohesive integration unit. Build on prior iterations; don't restate already-resolved findings.

## Topic
$(grep -A1 "ANCHOR:topic" "${STRATEGY}" | tail -1)

## Open Questions

| ID | Topic |
|----|-------|
| Q-CROSS | Cross-packet interactions (014 readiness w/ 013 degraded; 015 seed w/ 012 authority) |
| Q-REGRESS | Regression risk on UNCHANGED callers (003-009 packets) |
| Q-FLOW | cli-copilot dispatch flow end-to-end |
| Q-TEST | Test brittleness across 4 vitest files |
| Q-COV | Coverage gaps spanning packets |
| Q-DOC | Catalog/playbook drift vs shipped behavior |
| Q-MAINT | Maintainability / code smell across ~480 LOC |

## Required reading

**Prior iterations** (read \`Suggested focus for iteration\` to find what to deepen):
$(echo -e "${PRIOR_ITERS}")

**Strategy file** (current state of machine-owned sections):
- ${PWD}/${STRATEGY}

**Source-of-evidence** (re-read selectively):
- 4 implementation-summary.md files at \`${PWD}/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/{012,013,014,015}-*/implementation-summary.md\`
- 4 review-report.md files at the same packets
- ${PWD}/.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts
- ${PWD}/.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts
- ${PWD}/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/{status,context}.ts
- ${PWD}/.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/seed-resolver.ts
- ${PWD}/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts
- ${PWD}/.opencode/skill/system-spec-kit/mcp_server/tests/{executor-config-copilot-target-authority,code-graph-degraded-sweep,code-graph-status-readiness-snapshot,code-graph-context-cocoindex-telemetry-passthrough}.vitest.ts
- ${PWD}/.opencode/command/spec_kit/assets/spec_kit_deep-{research,review}_auto.yaml
- 28 catalog/playbook files at \`${PWD}/.opencode/skill/system-spec-kit/{feature_catalog,manual_testing_playbook}/\` (recently committed in b227544ca)

## Iteration ${N} focus

Read prior iterations' \`Suggested focus for iteration ${N}\` AND strategy §11 NEXT FOCUS. Use those signals to decide which 1-2 questions deserve deepest attention. **Don't re-cover ground**.

By iteration ${N}, expectations:
$(if [ "$N" -ge 4 ] && [ "$N" -le 6 ]; then echo "- Each open question should have at least one concrete finding (P0/P1/P2) or an explicit PASS judgment with evidence."; fi)
$(if [ "$N" -ge 7 ] && [ "$N" -le 9 ]; then echo "- Convergence-stage iteration: deepen the 1-2 questions with most open findings; surface remediation sketches with file:line targets and scope estimates; close out the rest."; fi)
$(if [ "$N" -eq 10 ]; then echo "- Final iteration: produce a synthesis-ready iteration that the orchestrator can fold directly into review-report.md. Include verdict signal (PASS / CONDITIONAL / FAIL) with rationale; explicit P0 list if any (with adversarial self-check evidence); P1 list with severity + remediation pointer; P2 list briefly."; fi)

## Output requirement 1: write \`${PWD}/${REV}/iterations/iteration-${NNN}.md\` (ABSOLUTE PATH)

Same structure as iteration-001.md. Skip questions already converged from prior iterations (note "see iter-NNN" instead).

## Output requirement 2: write \`${PWD}/${REV}/deltas/iter-${NNN}.jsonl\` (ABSOLUTE PATH)

\`\`\`json
{"type":"iteration","iteration":${N},"newFindingsRatio":<decimal>,"status":"completed","focus":"<theme>","dimensionsCovered":[...],"newFindings":[...],"sourcesRead":[...],"timestamp":"$(ts)"}
\`\`\`

## Discipline

- **Use the absolute paths above** when writing output files. Do NOT write under "012-*/", "013-*/", "014-*/", "015-*/", or "research/" — those are SOURCE folders, not destinations.
- **No fabrication** — every cited file:line MUST verify on disk
- **Honest newFindingsRatio** — by iter ${N} it should be decaying; high ratio in late iterations indicates churn
- **Don't restate** per-packet review findings already closed; cross-cutting only

# BEGIN NOW

Read prior iterations + strategy + source-of-evidence selectively. Then write the two output files at the absolute paths specified. Begin.
EOF

  log "Prompt rendered: ${PROMPT_FILE}"

  if codex exec \
    --model gpt-5.5 \
    -c model_reasoning_effort=high \
    -c service_tier=fast \
    -c approval_policy=never \
    --sandbox workspace-write \
    - < "${PROMPT_FILE}" \
    > "${CODEX_LOG}" 2>&1; then
    log "Iteration ${N} codex exec exit=0"
  else
    log "Iteration ${N} codex exec FAILED exit=$?"
    echo "{\"type\":\"event\",\"event\":\"iteration_failed\",\"iteration\":${N},\"reason\":\"codex_nonzero_exit\",\"timestamp\":\"$(ts)\"}" >> "${STATE_LOG}"
    return 1
  fi

  if [ ! -f "${ITER_OUT}" ]; then
    log "WARN: ${ITER_OUT} missing — checking misplaced output"
    # Check 012/013/014/015 + research/ for misplaced files (codex sometimes infers wrong destination)
    for SOURCE_DIR in \
        ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/012-copilot-target-authority-helper/review/iterations" \
        ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/013-graph-degraded-stress-cell/review/iterations" \
        ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/014-graph-status-readiness-snapshot/review/iterations" \
        ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/015-cocoindex-seed-telemetry-passthrough/review/iterations" \
        ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/research/iterations"; do
      if [ -f "${SOURCE_DIR}/iteration-${NNN}.md" ]; then
        log "Moving misplaced ${SOURCE_DIR}/iteration-${NNN}.md -> ${ITER_OUT}"
        mv "${SOURCE_DIR}/iteration-${NNN}.md" "${ITER_OUT}"
      fi
      DELTA_DIR="${SOURCE_DIR%/iterations}/deltas"
      if [ -f "${DELTA_DIR}/iter-${NNN}.jsonl" ]; then
        mv "${DELTA_DIR}/iter-${NNN}.jsonl" "${DELTA_OUT}"
      fi
    done
  fi

  if [ -f "${ITER_OUT}" ] && [ -f "${DELTA_OUT}" ]; then
    echo "{\"type\":\"event\",\"event\":\"iteration_completed\",\"iteration\":${N},\"timestamp\":\"$(ts)\"}" >> "${STATE_LOG}"
    log "Iteration ${N} artifacts confirmed"
  else
    echo "{\"type\":\"event\",\"event\":\"iteration_failed\",\"iteration\":${N},\"reason\":\"missing_artifacts\",\"timestamp\":\"$(ts)\"}" >> "${STATE_LOG}"
    log "Iteration ${N} FAILED — missing artifacts"
    return 1
  fi
}

log "Starting deep-review iteration loop ${START_ITER}..${END_ITER}"
for N in $(seq "${START_ITER}" "${END_ITER}"); do
  run_iteration "${N}" || log "Iteration ${N} failed; continuing"
done
log "Loop complete"

COMPLETED=$(grep -c '"event":"iteration_completed"' "${STATE_LOG}")
FAILED=$(grep -c '"event":"iteration_failed"' "${STATE_LOG}")
log "SUMMARY: ${COMPLETED} completed, ${FAILED} failed"
echo "{\"type\":\"event\",\"event\":\"loop_complete\",\"completed\":${COMPLETED},\"failed\":${FAILED},\"timestamp\":\"$(ts)\"}" >> "${STATE_LOG}"
