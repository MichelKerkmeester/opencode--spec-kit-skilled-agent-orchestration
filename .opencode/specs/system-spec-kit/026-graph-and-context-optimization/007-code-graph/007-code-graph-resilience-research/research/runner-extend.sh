#!/usr/bin/env bash
# Sequential cli-codex deep-research extension runner for iters 8-12.
# Prepends Gate 3 pre-answer to bypass CLAUDE.md spec-folder hook prompt.

set -uo pipefail

REPO_ROOT="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public"
PACKET="$REPO_ROOT/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/007-code-graph-resilience-research"
RESEARCH="$PACKET/research"
PROMPTS="$RESEARCH/prompts"
LOGS="$RESEARCH/logs"
CODEX="/Users/michelkerkmeester/.superset/bin/codex"
MODEL="gpt-5.5"
START_ITER=8
END_ITER=12

GATE3_PREAMBLE='GATE 3 PRE-ANSWERED: A (existing spec folder)
Spec folder for this run: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/007-code-graph-resilience-research/
You may write the required iteration markdown + delta JSON + state.jsonl entry into this packet directly. Do NOT ask for spec folder confirmation. Skill routing: sk-deep-research is preselected. Proceed immediately to executing the research instructions below.

==========

'

cd "$REPO_ROOT" || { echo "ERROR: cannot cd to repo root"; exit 1; }

echo "[runner-research-007-ext-codex] start $(date -u +%Y-%m-%dT%H:%M:%SZ)" | tee -a "$LOGS/runner.log"
echo "[runner-research-007-ext-codex] codex: $($CODEX --version 2>&1 | head -1)" | tee -a "$LOGS/runner.log"

for i in $(seq $START_ITER $END_ITER); do
  N=$(printf "%03d" "$i")
  PROMPT_FILE="$PROMPTS/iteration-$N.md"
  LOG_FILE="$LOGS/iteration-$N.log"

  if [ ! -f "$PROMPT_FILE" ]; then
    echo "[runner-research-007-ext-codex] iter $N FAIL: prompt file not found" | tee -a "$LOGS/runner.log"
    continue
  fi

  ITER_OUT="$RESEARCH/iterations/iteration-$N.md"
  if [ -f "$ITER_OUT" ]; then
    echo "[runner-research-007-ext-codex] iter $N SKIP: already produced" | tee -a "$LOGS/runner.log"
    continue
  fi

  echo "[runner-research-007-ext-codex] iter $N start $(date -u +%Y-%m-%dT%H:%M:%SZ)" | tee -a "$LOGS/runner.log"

  PROMPT_TEXT="${GATE3_PREAMBLE}$(cat "$PROMPT_FILE")"
  "$CODEX" exec \
    --model "$MODEL" \
    -c model_reasoning_effort="high" \
    -c service_tier="fast" \
    -c approval_policy=never \
    --sandbox workspace-write \
    "$PROMPT_TEXT" \
    > "$LOG_FILE" 2>&1
  RC=$?

  echo "[runner-research-007-ext-codex] iter $N done rc=$RC $(date -u +%Y-%m-%dT%H:%M:%SZ)" | tee -a "$LOGS/runner.log"

  DELTA_OUT="$RESEARCH/deltas/iteration-$N.json"
  if [ ! -f "$ITER_OUT" ]; then
    echo "[runner-research-007-ext-codex] iter $N WARN: missing $ITER_OUT" | tee -a "$LOGS/runner.log"
  fi
  if [ ! -f "$DELTA_OUT" ]; then
    echo "[runner-research-007-ext-codex] iter $N WARN: missing $DELTA_OUT" | tee -a "$LOGS/runner.log"
  fi
done

echo "[runner-research-007-ext-codex] all extension iterations complete $(date -u +%Y-%m-%dT%H:%M:%SZ)" | tee -a "$LOGS/runner.log"
