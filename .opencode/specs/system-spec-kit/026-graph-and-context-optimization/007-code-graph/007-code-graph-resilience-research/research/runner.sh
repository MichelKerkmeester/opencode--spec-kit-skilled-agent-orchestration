#!/usr/bin/env bash
# Sequential cli-copilot deep-research runner for 007-code-graph-resilience-research
# Runs 7 iterations investigating code-graph resilience.
# Per-iteration: writes iteration-NNN.md + delta-NNN.json, appends state.jsonl.
# Iteration 7 also materializes the 4 asset files + research.md + decision-record.md.
#
# SECURITY NOTE: Same as other runners — --allow-all-tools is intentional for
# read-only research iterations. Each prompt explicitly states "Read-only research."

set -uo pipefail

REPO_ROOT="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public"
PACKET="$REPO_ROOT/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/007-code-graph-resilience-research"
RESEARCH="$PACKET/research"
PROMPTS="$RESEARCH/prompts"
LOGS="$RESEARCH/logs"
COPILOT="/Users/michelkerkmeester/.superset/bin/copilot"
MODEL="gpt-5.5"
MAX_ITER=7

cd "$REPO_ROOT" || { echo "ERROR: cannot cd to repo root"; exit 1; }

echo "[runner-research-007] start $(date -u +%Y-%m-%dT%H:%M:%SZ)" | tee -a "$LOGS/runner.log"
echo "[runner-research-007] cwd: $(pwd)" | tee -a "$LOGS/runner.log"
echo "[runner-research-007] copilot: $($COPILOT --version 2>&1 | head -1)" | tee -a "$LOGS/runner.log"

for i in $(seq 1 $MAX_ITER); do
  N=$(printf "%03d" "$i")
  PROMPT_FILE="$PROMPTS/iteration-$N.md"
  LOG_FILE="$LOGS/iteration-$N.log"

  if [ ! -f "$PROMPT_FILE" ]; then
    echo "[runner-research-007] iter $N FAIL: prompt file not found at $PROMPT_FILE" | tee -a "$LOGS/runner.log"
    continue
  fi

  echo "[runner-research-007] iter $N start $(date -u +%Y-%m-%dT%H:%M:%SZ)" | tee -a "$LOGS/runner.log"

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

  echo "[runner-research-007] iter $N done rc=$RC $(date -u +%Y-%m-%dT%H:%M:%SZ)" | tee -a "$LOGS/runner.log"

  ITER_OUT="$RESEARCH/iterations/iteration-$N.md"
  DELTA_OUT="$RESEARCH/deltas/iteration-$N.json"
  if [ ! -f "$ITER_OUT" ]; then
    echo "[runner-research-007] iter $N WARN: missing $ITER_OUT" | tee -a "$LOGS/runner.log"
  fi
  if [ ! -f "$DELTA_OUT" ]; then
    echo "[runner-research-007] iter $N WARN: missing $DELTA_OUT" | tee -a "$LOGS/runner.log"
  fi
done

echo "[runner-research-007] all iterations complete $(date -u +%Y-%m-%dT%H:%M:%SZ)" | tee -a "$LOGS/runner.log"
echo "[runner-research-007] iteration files:" | tee -a "$LOGS/runner.log"
ls -la "$RESEARCH/iterations/" 2>&1 | tee -a "$LOGS/runner.log"
echo "[runner-research-007] asset files (iter 7 should have created these):" | tee -a "$LOGS/runner.log"
ls -la "$PACKET/assets/" 2>&1 | tee -a "$LOGS/runner.log"
echo "[runner-research-007] state log lines:" | tee -a "$LOGS/runner.log"
wc -l "$RESEARCH/deep-research-state.jsonl" 2>&1 | tee -a "$LOGS/runner.log"
