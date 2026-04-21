#!/usr/bin/env bash
# Drive a deep-research or deep-review sub-packet to convergence.
# Usage: drive-to-convergence.sh <research|review> <artifact_dir> <max_iters> <start_iter>
#
# Runs codex exec iterations sequentially until newInfoRatio < 0.05 for 3 consecutive
# iterations OR max_iters reached. Each iteration uses a generic "continue research"
# prompt that reads state from the artifact_dir.

set -euo pipefail

MODE="${1:?mode research|review}"
ART_DIR="${2:?artifact_dir}"
MAX_ITERS="${3:?max_iters}"
START_ITER="${4:?start_iter}"

if [ "${MODE}" = "research" ]; then
  STATE_LOG="${ART_DIR}/deep-research-state.jsonl"
  FINAL_FILE="${ART_DIR}/research.md"
  ITER_TYPE="research"
  JSONL_FIELDS='{"type":"iteration","iteration":N,"newInfoRatio":...,"status":"in_progress","focus":"...","findingsCount":N,"keyQuestions":N,"answeredQuestions":N,"timestamp":"...","durationMs":N,"graphEvents":[]}'
else
  STATE_LOG="${ART_DIR}/deep-review-state.jsonl"
  FINAL_FILE="${ART_DIR}/review-report.md"
  ITER_TYPE="review"
  JSONL_FIELDS='{"type":"iteration","iteration":N,"dimensions":["..."],"filesReviewed":N,"findingsSummary":{"P0":N,"P1":N,"P2":N},"findingsNew":[...],"traceabilityChecks":{...},"newFindingsRatio":...,"graphEvents":[]}'
fi

render_prompt() {
  local iter_num=$1
  local prompt_file="${ART_DIR}/prompts/iteration-${iter_num}.md"
  cat > "${prompt_file}" <<EOF
# Deep-${ITER_TYPE^} Iteration ${iter_num}

Dispatched via \`codex exec gpt-5.4 --reasoning-effort=high --service-tier=fast\`.

**Gate 3 pre-answered**: Option **E** (phase folder). Proceed WITHOUT asking. All writes to \`${ART_DIR}/\` pre-authorized.

**Autonomous context**: Overnight run, no confirmation gates. User directive 2026-04-18 authorizes hours-long continuous execution. Produce artifacts and exit.

## STATE

This is iteration **${iter_num}** of **${MAX_ITERS}** max.

Read the following to recover full state:
- \`${ART_DIR}/deep-${ITER_TYPE}-config.json\` — topic, budget, executor config
- \`${ART_DIR}/deep-${ITER_TYPE}-state.jsonl\` — session start + prior iteration records
- \`${ART_DIR}/deep-${ITER_TYPE}-strategy.md\` — key questions, known context, what worked, what failed, next focus
- \`${ART_DIR}/findings-registry.json\` — prior findings
- \`${ART_DIR}/iterations/iteration-001.md\` through \`iteration-$((iter_num - 1)).md\` — prior iteration narratives
- \`${ART_DIR}/deltas/iter-001.jsonl\` through \`iter-$((iter_num - 1)).jsonl\` — prior per-iteration deltas

## FOCUS

Continue the ${ITER_TYPE}. Pick the next focus from strategy's \`Next Focus\` section. Make concrete progress toward answering the remaining key questions. Rule out approaches that fail. Track findings (for ${ITER_TYPE == research : research → observations/hypotheses; for review → P0/P1/P2 severity).

If you detect convergence signal (newInfoRatio < 0.05 sustained, all key questions answered, or no new findings in 3 iterations), set \`status: "converged"\` in your state-log record AND write the final \`${FINAL_FILE}\` with complete synthesis. Otherwise keep iterating.

## CONSTRAINTS

- Soft cap 9 tool calls, hard max 13.
- Review target (if review mode): READ-ONLY.
- REQUIRED: canonical JSONL iteration record with \`"type":"iteration"\` EXACTLY (not iteration_delta).
- REQUIRED: per-iteration delta file at \`${ART_DIR}/deltas/iter-$(printf "%03d" ${iter_num}).jsonl\`.

## OUTPUT CONTRACT

1. \`${ART_DIR}/iterations/iteration-$(printf "%03d" ${iter_num}).md\` — narrative with Focus, Actions, Results, Findings, Questions Answered, Next Focus, Ruled Out (if any).

2. Canonical JSONL record APPENDED to state log (\`echo '...' >> ${STATE_LOG}\`):
   \`\`\`
   ${JSONL_FIELDS}
   \`\`\`
   (Replace N values and compute actual newInfoRatio from the information density gain vs prior iters.)

3. \`${ART_DIR}/deltas/iter-$(printf "%03d" ${iter_num}).jsonl\` — structured delta: one \`{"type":"iteration",...}\` record (same as state-log append) plus per-event records (findings, observations, ruled-out, graph events).

4. If converged: write final \`${FINAL_FILE}\` with complete synthesis.

All artifacts required. Missing or type-drift fails the validator.
EOF
  echo "${prompt_file}"
}

check_convergence() {
  # Returns 0 if converged (last 3 iters newInfoRatio < 0.05), 1 otherwise.
  local ratios=$(grep -E '"type":"iteration"' "${STATE_LOG}" | tail -3 | grep -oE '"newInfoRatio":[0-9.]+' | awk -F: '{print $2}')
  local count=$(echo "$ratios" | wc -l | tr -d ' ')
  if [ "$count" -lt 3 ]; then
    return 1  # not enough iters
  fi
  local all_below=1
  for r in $ratios; do
    cmp=$(awk "BEGIN{print ($r < 0.05) ? 1 : 0}")
    if [ "$cmp" != "1" ]; then
      all_below=0
      break
    fi
  done
  [ "$all_below" = "1" ]
}

for iter in $(seq "${START_ITER}" "${MAX_ITERS}"); do
  echo "=== Iteration ${iter} ==="
  prompt_file=$(render_prompt "${iter}")
  codex exec \
    --model gpt-5.4 \
    -c model_reasoning_effort="high" \
    -c service_tier="fast" \
    -c approval_policy=never \
    --sandbox workspace-write \
    - < "${prompt_file}" \
    > "${ART_DIR}/prompts/iteration-${iter}-codex-stdout.log" 2>&1 || {
    echo "Iteration ${iter} failed with exit $?"
    exit 1
  }

  # Check convergence after iter 3+
  if [ "${iter}" -ge 3 ]; then
    if check_convergence; then
      echo "=== Converged at iteration ${iter} ==="
      break
    fi
  fi

  # Check if final file was written (codex may have written research.md / review-report.md indicating convergence)
  if [ -f "${FINAL_FILE}" ] && [ "${iter}" -ge 3 ]; then
    last_status=$(grep -E '"type":"iteration"' "${STATE_LOG}" | tail -1 | grep -oE '"status":"[^"]+"' | cut -d'"' -f4 || echo "unknown")
    if [ "${last_status}" = "converged" ]; then
      echo "=== Explicit convergence at iteration ${iter} ==="
      break
    fi
  fi
done

echo "=== Driver complete ==="
