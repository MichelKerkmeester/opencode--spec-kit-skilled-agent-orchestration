#!/bin/bash
# Driver script: run deep-research iterations 3..10 for pt-03.
# Waits for iter-002 to complete, then dispatches each subsequent iteration.
# Reads prior iteration's Next Focus to seed the next prompt pack.
# Checks convergence (newInfoRatio < 0.05 for 3 consecutive iterations OR all questions answered).

set -uo pipefail

PKT_ABS="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/007-deep-review-remediation-pt-03"
REPO_ROOT="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public"
cd "$REPO_ROOT"

MAX_ITER=10
CONVERGENCE_THRESHOLD=0.05
STUCK_THRESHOLD=3
STUCK_COUNT=0

log() { printf '[%s] %s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$*" >> "$PKT_ABS/logs/driver.log"; }

wait_for_iteration() {
  local n="$1"
  local padded
  padded=$(printf '%03d' "$n")
  local iter_file="$PKT_ABS/iterations/iteration-${padded}.md"
  local log_file="$PKT_ABS/logs/iter-${padded}.log"
  log "Waiting for iter-${padded} to complete..."
  local waited=0
  while [ ! -s "$iter_file" ]; do
    if [ "$waited" -gt 1800 ]; then
      log "TIMEOUT waiting for iter-${padded} (30min)."
      return 2
    fi
    sleep 20
    waited=$((waited + 20))
  done
  # Also wait up to 120s for JSONL line to land
  local wait_jsonl=0
  while true; do
    local record
    record=$(grep "\"iteration\":${n}[,}]" "$PKT_ABS/deep-research-state.jsonl" 2>/dev/null | head -1)
    if [ -n "$record" ]; then
      log "iter-${padded} complete. JSONL: ${record:0:200}..."
      return 0
    fi
    if [ "$wait_jsonl" -gt 120 ]; then
      log "iter-${padded} has file but no JSONL record yet after 120s; continuing anyway."
      return 0
    fi
    sleep 10
    wait_jsonl=$((wait_jsonl + 10))
  done
}

extract_last_ratio() {
  local n="$1"
  grep "\"iteration\":${n}[,}]" "$PKT_ABS/deep-research-state.jsonl" 2>/dev/null | head -1 | python3 -c 'import json,sys
for line in sys.stdin:
    try:
        obj=json.loads(line)
        print(obj.get("newInfoRatio",0.0))
    except Exception:
        pass' 2>/dev/null | head -1
}

extract_next_focus() {
  local n="$1"
  local padded
  padded=$(printf '%03d' "$n")
  # Get everything after "## Next Focus" until end
  awk '/^## Next Focus$/{flag=1; next} flag{print}' "$PKT_ABS/iterations/iteration-${padded}.md" 2>/dev/null | head -40
}

render_prompt() {
  local n="$1"
  local padded
  padded=$(printf '%03d' "$n")
  local prior=$((n - 1))
  local prior_padded
  prior_padded=$(printf '%03d' "$prior")

  local prior_ratio
  prior_ratio=$(extract_last_ratio "$prior")
  local prior_focus
  prior_focus=$(extract_next_focus "$prior")

  cat > "$PKT_ABS/prompts/iteration-${padded}.md" <<PROMPT
# Deep-Research Iteration ${n} of ${MAX_ITER}

## STATE

STATE SUMMARY:
Segment: 1 | Iteration: ${n} of ${MAX_ITER}
Last iteration newInfoRatio: ${prior_ratio:-N/A} | Stuck count: ${STUCK_COUNT}

Research Topic (unchanged): Copilot CLI 1.0.34 hook-config JSON schema resolution. Resolve the \`"Neither 'bash' nor 'powershell' specified in hook command configuration"\` execution failure blocking 026/009/004 copilot-hook-parity-remediation. Deliver a primary-source-backed schema explanation, a concrete JSON patch to \`.github/hooks/superset-notify.json\`, AND an empirical reproducer where the patch makes Copilot log successful hook execution.

## PRIOR ITERATION STATE

Last completed: iteration-${prior_padded}. Read:
- \`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/007-deep-review-remediation-pt-03/iterations/iteration-${prior_padded}.md\` — full prior findings
- \`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/007-deep-review-remediation-pt-03/deep-research-strategy.md\` — KQ tracker
- \`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/007-deep-review-remediation-pt-03/findings-registry.json\` — consolidated registry
- \`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/007-deep-review-remediation-pt-03/deep-research-state.jsonl\` — JSONL history

## PRIOR NEXT-FOCUS ANCHOR

${prior_focus:-[no explicit prior next focus — synthesize from prior findings]}

## CONVERGENCE RULES

- Research terminates at iteration 10 OR when newInfoRatio < ${CONVERGENCE_THRESHOLD} for 3 consecutive iterations.
- When converged, mark status as "converged" in the JSONL record and write a sub-section "Convergence signal met" in the iteration markdown.
- Every finding MUST cite a source (file:line, URL, or shell-command-timestamp).
- Do NOT mutate .github/hooks/superset-notify.json or any hook script in this run — research only.

## OUTPUT CONTRACT

1. Iteration narrative: \`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/007-deep-review-remediation-pt-03/iterations/iteration-${padded}.md\`
2. JSONL append to \`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/007-deep-review-remediation-pt-03/deep-research-state.jsonl\`:
   \`{"type":"iteration","iteration":${n},"newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","graphEvents":[...]}\`
3. Delta file: \`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/007-deep-review-remediation-pt-03/deltas/iter-$(printf '%03d' $n).jsonl\` — with iteration record + per-event (finding, invariant, observation, edge, ruled_out) records.

## ITERATION ${n} DIRECTIVES

Advance the research. If prior focus is still open, extend it with fresh evidence and new angles. If prior focus is exhausted, shift to the next-highest-value unanswered KQ. Each iteration should reduce KQ open-count or add decisive primary-source evidence; if neither is possible, RULE OUT a direction explicitly.

Be disciplined about convergence — do not pad. If the previous iteration produced a complete schema answer + patch + reproducer already, respond with status "converged" and newInfoRatio <= 0.05 so the loop stops cleanly.

Write the 3 artifacts now.
PROMPT
}

dispatch_iteration() {
  local n="$1"
  local padded
  padded=$(printf '%03d' "$n")
  log "Dispatching codex for iter-${padded}..."
  codex exec \
    --model gpt-5.4 \
    -c model_reasoning_effort=high \
    -c service_tier=fast \
    -c approval_policy=never \
    --sandbox workspace-write \
    - < "$PKT_ABS/prompts/iteration-${padded}.md" \
    > "$PKT_ABS/logs/iter-${padded}.log" 2>&1
  local exit_code=$?
  log "iter-${padded} codex exit=${exit_code}"
  return $exit_code
}

# Driver main loop
log "Driver started."

# Wait for iter-002 which was already dispatched
wait_for_iteration 2 || log "WARN: iter-002 wait returned non-zero"

# Seed stuck count from iter-002
RATIO_2=$(extract_last_ratio 2)
log "iter-002 newInfoRatio=${RATIO_2:-N/A}"
if [ -n "${RATIO_2:-}" ]; then
  # Use bc for float comparison
  if awk "BEGIN{exit !(${RATIO_2:-1.0} < ${CONVERGENCE_THRESHOLD})}"; then
    STUCK_COUNT=1
  fi
fi
log "After iter-002: STUCK_COUNT=${STUCK_COUNT}"

for n in 3 4 5 6 7 8 9 10; do
  if [ "$STUCK_COUNT" -ge "$STUCK_THRESHOLD" ]; then
    log "CONVERGED after stuck_count=${STUCK_COUNT}. Stopping before iter-${n}."
    echo "converged_stop" > "$PKT_ABS/.convergence-marker"
    break
  fi

  render_prompt "$n"
  log "Rendered prompt-${n}."

  dispatch_iteration "$n"
  local_exit=$?
  if [ "$local_exit" -ne 0 ]; then
    log "WARN: iter-${n} codex exit non-zero (${local_exit}). Continuing anyway."
  fi

  wait_for_iteration "$n" || log "WARN: iter-${n} wait returned non-zero"

  RATIO=$(extract_last_ratio "$n")
  log "iter-${n} newInfoRatio=${RATIO:-N/A}"

  if [ -z "${RATIO:-}" ]; then
    STUCK_COUNT=$((STUCK_COUNT + 1))
    log "iter-${n} no ratio — treating as stuck (count now ${STUCK_COUNT})."
  elif awk "BEGIN{exit !(${RATIO} < ${CONVERGENCE_THRESHOLD})}"; then
    STUCK_COUNT=$((STUCK_COUNT + 1))
    log "iter-${n} ratio ${RATIO} < threshold; stuck_count=${STUCK_COUNT}"
  else
    STUCK_COUNT=0
    log "iter-${n} ratio ${RATIO} >= threshold; stuck_count reset to 0"
  fi
done

log "Driver loop complete."
echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) driver_done" > "$PKT_ABS/.driver-done"
