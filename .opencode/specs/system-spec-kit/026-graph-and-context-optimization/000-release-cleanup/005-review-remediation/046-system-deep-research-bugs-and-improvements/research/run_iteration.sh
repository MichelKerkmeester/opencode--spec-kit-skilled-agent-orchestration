#!/usr/bin/env bash
# run_iteration.sh — dispatch one deep-research iteration via cli-codex gpt-5.5 high (normal speed)
# Usage: run_iteration.sh <NNN> <ANGLE_ID> <ANGLE_TITLE> <FOCUS_AREAS_PROMPT_FILE>
set -uo pipefail

NNN="$1"      # 001..020
ANGLE_ID="$2" # A1..D5
ANGLE_TITLE="$3"
PROMPT_FILE="$4"

REPO_ROOT="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public"
PACKET="${REPO_ROOT}/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/046-system-deep-research-bugs-and-improvements"
ART="${PACKET}/research"
STATE_LOG="${ART}/deep-research-state.jsonl"
ITER_FILE="${ART}/iterations/iteration-${NNN}.md"
DELTA_FILE="${ART}/deltas/iter-${NNN}.jsonl"
LOG_DIR="${ART}/logs"
mkdir -p "${LOG_DIR}"
LOG_FILE="${LOG_DIR}/iter-${NNN}.log"

START_TS="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
echo "=== Iteration ${NNN} (${ANGLE_ID}) START ${START_TS} ===" | tee "${LOG_FILE}"

# Pre-dispatch sentinel: workflow-owned executor record (per workflow contract)
EXEC_REC="{\"type\":\"event\",\"event\":\"executor_dispatch\",\"iteration\":${NNN#0},\"executor\":{\"kind\":\"cli-codex\",\"model\":\"gpt-5.5\",\"reasoningEffort\":\"high\",\"serviceTier\":null},\"timestamp\":\"${START_TS}\"}"
# strip leading 0s for iteration int — robust handling
ITER_INT=$(echo "${NNN}" | sed 's/^0*//')
[[ -z "${ITER_INT}" ]] && ITER_INT=0

# Build the iteration prompt and pass to codex via stdin
PROMPT_TEXT=$(cat "${PROMPT_FILE}")

# Dispatch via codex exec. service_tier omitted (default = normal speed).
# Use --skip-git-repo-check to avoid GIT prompts; sandbox workspace-write to allow file writes.
cd "${REPO_ROOT}"
echo "${PROMPT_TEXT}" | timeout 1800 codex exec \
  --model gpt-5.5 \
  -c model_reasoning_effort=high \
  -c approval_policy=never \
  --sandbox workspace-write \
  --skip-git-repo-check \
  - >> "${LOG_FILE}" 2>&1
DISPATCH_EXIT=$?

END_TS="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
echo "=== Iteration ${NNN} END ${END_TS} (exit=${DISPATCH_EXIT}) ===" >> "${LOG_FILE}"

# Verify outputs exist
if [[ ! -f "${ITER_FILE}" ]]; then
  echo "MISSING: ${ITER_FILE}" >> "${LOG_FILE}"
  echo "ITER_FILE_MISSING"
  exit 10
fi
if [[ ! -f "${DELTA_FILE}" ]]; then
  echo "MISSING: ${DELTA_FILE}" >> "${LOG_FILE}"
  echo "DELTA_FILE_MISSING"
  exit 11
fi

# Append the iteration record to the state log if missing
# (codex was instructed to also append to state log, but if the sandbox blocks it we add it here from the delta)
ITER_LINE=$(grep -m1 "\"type\":\"iteration\"" "${DELTA_FILE}" || true)
if [[ -n "${ITER_LINE}" ]]; then
  if ! grep -q "\"iteration\":${ITER_INT}[,}]" "${STATE_LOG}" 2>/dev/null; then
    echo "${EXEC_REC}" >> "${STATE_LOG}"
    echo "${ITER_LINE}" >> "${STATE_LOG}"
  fi
fi

echo "OK iteration=${NNN} dispatch_exit=${DISPATCH_EXIT}"
exit ${DISPATCH_EXIT}
