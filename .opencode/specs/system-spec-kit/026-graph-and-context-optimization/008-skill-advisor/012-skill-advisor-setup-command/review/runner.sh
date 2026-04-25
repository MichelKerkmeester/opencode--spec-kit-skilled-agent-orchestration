#!/usr/bin/env bash
# Sequential cli-copilot deep-review runner for 012-skill-advisor-setup-command
# Runs 7 iterations, each calls copilot with the corresponding prompt.
# Per-iteration: writes iteration-NNN.md + delta-NNN.json, appends state.jsonl.
#
# SECURITY NOTE (per F-SEC-004):
# This runner uses --allow-all-tools --no-ask-user. That permission scope is
# intentional ONLY for read-only review iterations under deep-review-strategy.md
# and the per-iteration prompts under prompts/iteration-NNN.md. Both the strategy
# and every iteration prompt explicitly state "Read-only review. Do NOT modify any
# reviewed file." The permissions exist so copilot can write its own iteration-NNN.md
# + delta-NNN.json output files under review/iterations and review/deltas.
#
# DO NOT copy this --allow-all-tools pattern into other contexts (e.g., the
# skill-advisor command's Phase 3 apply step) without an equivalent read-only
# constraint in the prompt. For mutation workflows, use a tool profile that
# excludes Write/Edit/apply_patch and restricts Bash to non-mutating commands.

set -uo pipefail

REPO_ROOT="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public"
PACKET="$REPO_ROOT/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command"
REVIEW="$PACKET/review"
PROMPTS="$REVIEW/prompts"
LOGS="$REVIEW/logs"
COPILOT="/Users/michelkerkmeester/.superset/bin/copilot"
MODEL="gpt-5.5"
MAX_ITER=7

cd "$REPO_ROOT" || { echo "ERROR: cannot cd to repo root"; exit 1; }

echo "[runner] start $(date -u +%Y-%m-%dT%H:%M:%SZ)" | tee -a "$LOGS/runner.log"
echo "[runner] cwd: $(pwd)" | tee -a "$LOGS/runner.log"
echo "[runner] copilot: $($COPILOT --version 2>&1 | head -1)" | tee -a "$LOGS/runner.log"

for i in $(seq 1 $MAX_ITER); do
  N=$(printf "%03d" "$i")
  PROMPT_FILE="$PROMPTS/iteration-$N.md"
  LOG_FILE="$LOGS/iteration-$N.log"

  if [ ! -f "$PROMPT_FILE" ]; then
    echo "[runner] iter $N FAIL: prompt file not found at $PROMPT_FILE" | tee -a "$LOGS/runner.log"
    continue
  fi

  echo "[runner] iter $N start $(date -u +%Y-%m-%dT%H:%M:%SZ)" | tee -a "$LOGS/runner.log"

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

  echo "[runner] iter $N done rc=$RC $(date -u +%Y-%m-%dT%H:%M:%SZ)" | tee -a "$LOGS/runner.log"

  ITER_OUT="$REVIEW/iterations/iteration-$N.md"
  DELTA_OUT="$REVIEW/deltas/iteration-$N.json"
  if [ ! -f "$ITER_OUT" ]; then
    echo "[runner] iter $N WARN: missing $ITER_OUT" | tee -a "$LOGS/runner.log"
  fi
  if [ ! -f "$DELTA_OUT" ]; then
    echo "[runner] iter $N WARN: missing $DELTA_OUT" | tee -a "$LOGS/runner.log"
  fi
done

echo "[runner] all iterations complete $(date -u +%Y-%m-%dT%H:%M:%SZ)" | tee -a "$LOGS/runner.log"
echo "[runner] iteration files in $REVIEW/iterations/:" | tee -a "$LOGS/runner.log"
ls -la "$REVIEW/iterations/" 2>&1 | tee -a "$LOGS/runner.log"
echo "[runner] delta files in $REVIEW/deltas/:" | tee -a "$LOGS/runner.log"
ls -la "$REVIEW/deltas/" 2>&1 | tee -a "$LOGS/runner.log"
echo "[runner] state log lines:" | tee -a "$LOGS/runner.log"
wc -l "$REVIEW/deep-review-state.jsonl" 2>&1 | tee -a "$LOGS/runner.log"
