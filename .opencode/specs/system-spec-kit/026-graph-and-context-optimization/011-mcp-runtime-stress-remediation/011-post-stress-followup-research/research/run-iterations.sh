#!/usr/bin/env bash
# Loop iterations 2-10 of /spec_kit:deep-research:auto for 011-post-stress-followup-research.
# Autonomous: dispatches each codex exec, waits for completion, appends state events.
# Run from repo root.

set -uo pipefail

PACKET=".opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research"
RES="${PACKET}/research"
ITER_DIR_ABS="${PWD}/${RES}/iterations"
DELTA_DIR_ABS="${PWD}/${RES}/deltas"
STATE_LOG="${RES}/deep-research-state.jsonl"
STRATEGY="${RES}/deep-research-strategy.md"

# Iterations to run (start_iter end_iter)
START_ITER="${1:-2}"
END_ITER="${2:-10}"

log() { echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] $*"; }
ts() { date -u +%Y-%m-%dT%H:%M:%SZ; }

run_iteration() {
  local N="$1"
  local NNN
  NNN=$(printf "%03d" "$N")
  local PROMPT_FILE="${RES}/prompts/iteration-${NNN}.md"
  local ITER_OUT="${ITER_DIR_ABS}/iteration-${NNN}.md"
  local DELTA_OUT="${DELTA_DIR_ABS}/iter-${NNN}.jsonl"
  local CODEX_LOG="${RES}/iterations/iteration-${NNN}.codex.log"

  log "=== Iteration ${N} dispatching ==="
  echo "{\"type\":\"event\",\"event\":\"iteration_started\",\"iteration\":${N},\"timestamp\":\"$(ts)\"}" >> "${STATE_LOG}"

  # Render prompt: iteration N reads prior iter-1..N-1 + strategy.md, focuses per their suggestion
  local PRIOR_ITERS=""
  for prev in $(seq 1 $((N-1))); do
    local PREV_NNN
    PREV_NNN=$(printf "%03d" "$prev")
    PRIOR_ITERS="${PRIOR_ITERS}\n- ${PWD}/${RES}/iterations/iteration-${PREV_NNN}.md"
  done

  cat > "${PROMPT_FILE}" <<EOF
# Deep Research Iteration ${NNN}

You are iteration ${N} of 10 in a deep-research loop. Build on prior iterations and refine fix proposals for the 5 open questions.

## Topic
$(grep -A1 "ANCHOR:topic" "${STRATEGY}" | tail -1)

## Open Questions

| ID | Topic | Priority |
|----|-------|----------|
| Q-P0 | cli-copilot \`/memory:save\` Gate 3 bypass | P0 |
| Q-P1 | Deterministic graph degradation harness for fallbackDecision | P1 |
| Q-P2 | File-watcher debounce vs freshness self-check | P2 |
| Q-OPP | CocoIndex fork telemetry leverage in mcp_server/lib/search | P2 |
| Q-ARCH | 1-2 intelligence-system seams (light touch) | P3 |

## Required Reading

**Prior iterations** (read \`Suggested focus for iteration\` sections to find what to deepen):
$(echo -e "${PRIOR_ITERS}")

**Strategy file** (current state of machine-owned sections — ANSWERED QUESTIONS, RULED OUT, NEXT FOCUS):
- ${PWD}/${STRATEGY}

**Source-of-evidence** (re-read as needed):
- ${PWD}/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/findings.md
- ${PWD}/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/004-memory-save-rewrite/spec.md
- ${PWD}/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/005-code-graph-fast-fail/spec.md
- ${PWD}/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/004-cocoindex-overfetch-dedup/spec.md
- ${PWD}/.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts
- ${PWD}/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts
- ${PWD}/.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts
- ${PWD}/.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/

**Tool budget**: 12 calls max, 10 min wall-clock target. Read, Grep, Glob, Bash (read-only).

## Iteration ${N} focus

Read prior iterations' \`Suggested focus for iteration ${N}\` (if present) AND the strategy file's NEXT FOCUS section. Use those signals to decide which 1-2 questions deserve deepest attention. **Don't re-cover ground already covered** — refine, deepen, falsify, propose specific implementation sketches where feasible.

By iteration ${N}, expectations:
$(if [ "$N" -ge 5 ] && [ "$N" -le 7 ]; then echo "- Each P0/P1 question should have a recommended approach (1 winner among the candidates) with falsifiable success criteria."; fi)
$(if [ "$N" -ge 8 ]; then echo "- Convergence-stage iteration: refine recommended approaches with implementation sketches (file:line targets), scope estimates, alternatives ranked, and any blockers surfaced. Q-OPP should have specific integration shapes proposed."; fi)
$(if [ "$N" -eq 10 ]; then echo "- Final iteration: produce a synthesis-ready iteration that the orchestrator can fold directly into research.md. Include cross-references back to 010 findings.md Recommendations §1-5."; fi)

## Output requirement 1: write \`${PWD}/${RES}/iterations/iteration-${NNN}.md\` (ABSOLUTE PATH)

Use this structure (omit a question section if it's already converged from prior iterations — note "see iteration-NNN" instead):

\`\`\`markdown
# Iteration ${NNN} — [your focus theme]

## Status
- Iteration: ${N} / 10
- Focus: [theme]
- newInfoRatio: <decimal 0-1>
- Convergence trajectory: <one sentence>

## Q-P0: cli-copilot /memory:save Gate 3 bypass
[skip if converged; else: refined evidence + recommended approach progressing toward final]

## Q-P1: code-graph fast-fail not testable
[same]

## Q-P2: file-watcher debounce
[same]

## Q-OPP: CocoIndex fork telemetry leverage
[same]

## Q-ARCH: intelligence-system seams (light touch)
[same; this section can be very brief in iterations 1-7, more developed in 8-10]

## Sources read this iteration (delta from prior)
- ...

## Suggested focus for iteration $((N+1))
[short]
\`\`\`

## Output requirement 2: write \`${PWD}/${RES}/deltas/iter-${NNN}.jsonl\` (ABSOLUTE PATH)

\`\`\`json
{"type":"iteration","iteration":${N},"newInfoRatio":<decimal>,"status":"completed","focus":"<theme>","questionsCovered":[...],"sourcesRead":[...],"keyFindings":[...],"timestamp":"$(ts)"}
\`\`\`

## Discipline

- **Use the absolute paths above** when writing output files. Do NOT write under "010-stress-test-rerun-v1-0-2/" — that's the source of evidence, not the destination.
- **No fabrication** — every cited file:line MUST verify on disk.
- **Honest newInfoRatio** — if iteration mostly re-traverses known ground, ratio is low (0.1-0.3); if substantial new evidence found, higher (0.4-0.7).
- **Refine, don't re-state** — by iteration ${N} you should be deepening, not re-grounding.

# BEGIN NOW

Read prior iterations + strategy + source-of-evidence as needed. Then write the two output files at the absolute paths specified. Begin.
EOF

  log "Prompt rendered: ${PROMPT_FILE}"

  # Dispatch codex exec
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

  # Verify outputs exist
  if [ ! -f "${ITER_OUT}" ]; then
    log "WARN: ${ITER_OUT} missing after iteration ${N}"
    # Check if codex wrote to wrong location and move
    local WRONG_ITER=".opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/research/iterations/iteration-${NNN}.md"
    local WRONG_DELTA=".opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/research/deltas/iter-${NNN}.jsonl"
    if [ -f "${WRONG_ITER}" ]; then
      log "Moving misplaced ${WRONG_ITER} -> ${ITER_OUT}"
      mv "${WRONG_ITER}" "${ITER_OUT}"
    fi
    if [ -f "${WRONG_DELTA}" ]; then
      mv "${WRONG_DELTA}" "${DELTA_OUT}"
    fi
  fi

  # Append iteration_completed event
  if [ -f "${ITER_OUT}" ] && [ -f "${DELTA_OUT}" ]; then
    echo "{\"type\":\"event\",\"event\":\"iteration_completed\",\"iteration\":${N},\"timestamp\":\"$(ts)\"}" >> "${STATE_LOG}"
    log "Iteration ${N} artifacts confirmed"
  else
    echo "{\"type\":\"event\",\"event\":\"iteration_failed\",\"iteration\":${N},\"reason\":\"missing_artifacts\",\"timestamp\":\"$(ts)\"}" >> "${STATE_LOG}"
    log "Iteration ${N} FAILED — missing artifacts"
    return 1
  fi
}

log "Starting iteration loop ${START_ITER}..${END_ITER}"
for N in $(seq "${START_ITER}" "${END_ITER}"); do
  run_iteration "${N}" || log "Iteration ${N} failed; continuing"
done
log "Loop complete"

# Final summary
COMPLETED=$(grep -c '"event":"iteration_completed"' "${STATE_LOG}")
FAILED=$(grep -c '"event":"iteration_failed"' "${STATE_LOG}")
log "SUMMARY: ${COMPLETED} completed, ${FAILED} failed"
echo "{\"type\":\"event\",\"event\":\"loop_complete\",\"completed\":${COMPLETED},\"failed\":${FAILED},\"timestamp\":\"$(ts)\"}" >> "${STATE_LOG}"
