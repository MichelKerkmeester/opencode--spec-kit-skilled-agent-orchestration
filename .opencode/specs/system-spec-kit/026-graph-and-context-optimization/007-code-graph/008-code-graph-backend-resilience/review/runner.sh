#!/usr/bin/env bash
# Sequential cli-codex deep-review runner for 008 backend implementation.
# 10 iterations across correctness/security/traceability/maintainability/synthesis.

set -uo pipefail

REPO_ROOT="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public"
PKT="$REPO_ROOT/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience"
REVIEW="$PKT/review"
PROMPTS="$REVIEW/prompts"
LOGS="$REVIEW/logs"
CODEX="/Users/michelkerkmeester/.superset/bin/codex"
MODEL="gpt-5.4"
START_ITER=1
END_ITER=10

cd "$REPO_ROOT" || { echo "ERROR: cannot cd to repo root"; exit 1; }

echo "[runner-review-008] start $(date -u +%Y-%m-%dT%H:%M:%SZ)" | tee -a "$LOGS/runner.log"
echo "[runner-review-008] codex: $($CODEX --version 2>&1 | head -1)" | tee -a "$LOGS/runner.log"

for i in $(seq $START_ITER $END_ITER); do
  N=$(printf "%03d" "$i")
  PROMPT_FILE="$PROMPTS/iteration-$N.md"
  LOG_FILE="$LOGS/iteration-$N.log"

  if [ ! -f "$PROMPT_FILE" ]; then
    echo "[runner-review-008] iter $N FAIL: prompt missing" | tee -a "$LOGS/runner.log"
    continue
  fi

  ITER_OUT="$REVIEW/iterations/iteration-$N.md"
  if [ -f "$ITER_OUT" ]; then
    echo "[runner-review-008] iter $N SKIP: already produced" | tee -a "$LOGS/runner.log"
    continue
  fi

  echo "[runner-review-008] iter $N start $(date -u +%Y-%m-%dT%H:%M:%SZ)" | tee -a "$LOGS/runner.log"

  PROMPT_TEXT="$(cat "$PROMPT_FILE")"
  "$CODEX" exec \
    --model "$MODEL" \
    -c model_reasoning_effort="high" \
    -c service_tier="fast" \
    -c approval_policy=never \
    --sandbox workspace-write \
    "$PROMPT_TEXT" \
    > "$LOG_FILE" 2>&1
  RC=$?

  echo "[runner-review-008] iter $N done rc=$RC $(date -u +%Y-%m-%dT%H:%M:%SZ)" | tee -a "$LOGS/runner.log"

  if [ ! -f "$ITER_OUT" ]; then
    echo "[runner-review-008] iter $N WARN: missing $ITER_OUT" | tee -a "$LOGS/runner.log"
  fi
done

echo "[runner-review-008] all iterations complete $(date -u +%Y-%m-%dT%H:%M:%SZ)" | tee -a "$LOGS/runner.log"
ls -la "$REVIEW/iterations/" 2>&1 | tee -a "$LOGS/runner.log"
ls -la "$REVIEW/" | grep -E "review-report|resource-map" 2>&1 | tee -a "$LOGS/runner.log"
