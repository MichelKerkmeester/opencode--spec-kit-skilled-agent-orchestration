#!/usr/bin/env bash
# Sequential cli-copilot deep-review runner for closure re-review (review-pt-02)
# Runs 5 iterations verifying closure of pt-01's 30 findings.
# Per-iteration: writes iteration-NNN.md + delta-NNN.json, appends state.jsonl.
#
# SECURITY NOTE (per F-SEC-004 from pt-01):
# Same as review/runner.sh — --allow-all-tools is intentional ONLY for read-only
# review iterations. Each iteration prompt explicitly states "Read-only on review
# targets." The permissions exist so copilot can write iteration-NNN.md +
# delta-NNN.json output files under review-pt-02/. Do not copy this pattern to
# mutation workflows.

set -uo pipefail

REPO_ROOT="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public"
PACKET="$REPO_ROOT/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command"
REVIEW="$PACKET/review-pt-02"
PROMPTS="$REVIEW/prompts"
LOGS="$REVIEW/logs"
COPILOT="/Users/michelkerkmeester/.superset/bin/copilot"
MODEL="gpt-5.5"
MAX_ITER=5

cd "$REPO_ROOT" || { echo "ERROR: cannot cd to repo root"; exit 1; }

echo "[runner-pt-02] start $(date -u +%Y-%m-%dT%H:%M:%SZ)" | tee -a "$LOGS/runner.log"
echo "[runner-pt-02] cwd: $(pwd)" | tee -a "$LOGS/runner.log"
echo "[runner-pt-02] copilot: $($COPILOT --version 2>&1 | head -1)" | tee -a "$LOGS/runner.log"

for i in $(seq 1 $MAX_ITER); do
  N=$(printf "%03d" "$i")
  PROMPT_FILE="$PROMPTS/iteration-$N.md"
  LOG_FILE="$LOGS/iteration-$N.log"

  if [ ! -f "$PROMPT_FILE" ]; then
    echo "[runner-pt-02] iter $N FAIL: prompt file not found at $PROMPT_FILE" | tee -a "$LOGS/runner.log"
    continue
  fi

  echo "[runner-pt-02] iter $N start $(date -u +%Y-%m-%dT%H:%M:%SZ)" | tee -a "$LOGS/runner.log"

  PROMPT_SIZE=$(wc -c < "$PROMPT_FILE" | tr -d ' ')
  if [ "$PROMPT_SIZE" -le 16384 ]; then
    PROMPT_TEXT="$(cat "$PROMPT_FILE")"
    "$COPILOT" \
      -p "$PROMPT_TEXT" \
      --model "$MODEL" \
      --allow-all-tools \
      --no-ask-user \
      > "$LOG_FILE" 2>&1
  else
    "$COPILOT" \
      -p "Read the instructions in @$PROMPT_FILE and follow them exactly. Do not deviate." \
      --model "$MODEL" \
      --allow-all-tools \
      --no-ask-user \
      > "$LOG_FILE" 2>&1
  fi
  RC=$?

  echo "[runner-pt-02] iter $N done rc=$RC $(date -u +%Y-%m-%dT%H:%M:%SZ)" | tee -a "$LOGS/runner.log"

  ITER_OUT="$REVIEW/iterations/iteration-$N.md"
  DELTA_OUT="$REVIEW/deltas/iteration-$N.json"
  if [ ! -f "$ITER_OUT" ]; then
    echo "[runner-pt-02] iter $N WARN: missing $ITER_OUT" | tee -a "$LOGS/runner.log"
  fi
  if [ ! -f "$DELTA_OUT" ]; then
    echo "[runner-pt-02] iter $N WARN: missing $DELTA_OUT" | tee -a "$LOGS/runner.log"
  fi
done

echo "[runner-pt-02] all iterations complete $(date -u +%Y-%m-%dT%H:%M:%SZ)" | tee -a "$LOGS/runner.log"
echo "[runner-pt-02] iteration files:" | tee -a "$LOGS/runner.log"
ls -la "$REVIEW/iterations/" 2>&1 | tee -a "$LOGS/runner.log"
echo "[runner-pt-02] delta files:" | tee -a "$LOGS/runner.log"
ls -la "$REVIEW/deltas/" 2>&1 | tee -a "$LOGS/runner.log"
echo "[runner-pt-02] state log lines:" | tee -a "$LOGS/runner.log"
wc -l "$REVIEW/deep-review-state.jsonl" 2>&1 | tee -a "$LOGS/runner.log"
