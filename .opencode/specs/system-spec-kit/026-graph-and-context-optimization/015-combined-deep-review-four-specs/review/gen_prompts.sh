#!/bin/bash
# Pre-generate iteration prompts to review/prompts/iter-NNN.txt for iters [start..end].
# Usage: gen_prompts.sh <start> <end>

set -euo pipefail

START="${1:?start required}"
END="${2:?end required}"

REPO=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
SPEC=".opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-combined-deep-review-four-specs"
ABS_SPEC="$REPO/$SPEC"
PROMPTS_DIR="$ABS_SPEC/review/prompts"
mkdir -p "$PROMPTS_DIR"

schedule_dim() {
  local n=$1
  if [ "$n" -eq 1 ]; then echo "inventory"; return; fi
  if [ "$n" -eq 50 ]; then echo "final-sweep"; return; fi
  if [ "$n" -le 13 ]; then echo "correctness"; return; fi
  if [ "$n" -le 25 ]; then echo "security"; return; fi
  if [ "$n" -le 37 ]; then echo "traceability"; return; fi
  echo "maintainability"
}

schedule_subset() {
  local n=$1
  local block_idx=$(( (n - 2) % 12 ))
  case "$block_idx" in
    0)  echo "009" ;;
    1)  echo "010" ;;
    2)  echo "012" ;;
    3)  echo "014" ;;
    4)  echo "009+010" ;;
    5)  echo "012+014" ;;
    6)  echo "009+012" ;;
    7)  echo "010+014" ;;
    8)  echo "009+014" ;;
    9)  echo "010+012" ;;
    10) echo "009+010+012" ;;
    11) echo "010+012+014" ;;
    *)  echo "all-four" ;;
  esac
}

for (( N=START; N<=END; N++ )); do
  NNN=$(printf "%03d" "$N")
  DIM=$(schedule_dim "$N")
  if [ "$N" -eq 1 ] || [ "$N" -eq 50 ]; then
    SUBSET="all-four"
  else
    SUBSET=$(schedule_subset "$N")
  fi
  OUT="$PROMPTS_DIR/iter-$NNN.txt"
  python3 - "$N" "$DIM" "$SUBSET" "$SPEC" "$NNN" "$OUT" <<'PY'
import sys
iter_n, dim, subset, spec_folder, nnn, out_path = sys.argv[1:7]
next_iter = int(iter_n) + 1
prompt = f"""You are acting as the @deep-review LEAF agent for iteration {iter_n} of 50 in a combined deep review.

SPEC FOLDER: {spec_folder} (pre-approved, skip Gate 3 - do NOT ask about spec folders)
MODE: review (READ-ONLY on reviewed files; you may only write the 2 files listed below)
SKIP: skill routing, skill_advisor, CLAUDE.md gates - you are a parallel subprocess, just execute the iteration.

PARALLELISM CONTRACT - IMPORTANT:
  - Other copilot iterations may be running in parallel at this very moment.
  - You MUST write ONLY these two files this iteration:
      (a) {spec_folder}/review/iterations/iteration-{nnn}.md  (markdown findings)
      (b) {spec_folder}/review/deltas/iter-{nnn}.jsonl        (ONE JSON line, nothing else)
  - You MUST NOT write or edit:
      - {spec_folder}/review/deep-review-state.jsonl       (driver consolidates deltas after the batch)
      - {spec_folder}/review/deep-review-strategy.md        (driver rebuilds)
      - {spec_folder}/review/deep-review-findings-registry.json (reducer owns this)
      - any file under any of the four REVIEW TARGETS
  - If you accidentally touch shared state, stop immediately and note the error.

READ these state files (do NOT modify them):
  - {spec_folder}/review/deep-review-config.json
  - {spec_folder}/review/deep-review-strategy.md (snapshot; may be slightly stale in parallel)
  - {spec_folder}/review/deep-review-state.jsonl (snapshot)

REVIEW TARGETS (all four; iteration subset hint: {subset}):
  1. .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-playbook-and-remediation (coordination parent w/ 3 phase children)
  2. .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research (coordination parent w/ 3 phase children w/ sub-phases)
  3. .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-canonical-intake-and-middleware-cleanup (standard spec folder)
  4. .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-memory-save-planner-first-default (standard spec folder)

EXCLUDED: scratch/, memory/, review/, research/, prompts/, changelog/, z_archive/, z_future/ AND all sibling packets (001-008, 011, 013, 015).

ITERATION {iter_n} FOCUS:
  Dimension: {dim}
  Target subset: {subset}
  Severity threshold: P2 (report P0 blockers, P1 required, P2 suggestions)

DOCTRINE: Load .agents/skills/sk-code-review/references/review_core.md if present. Otherwise: P0 = causes incorrectness/security breach; P1 = breaks contract/acceptance criteria; P2 = style/maintainability/nit.

TRACEABILITY PROTOCOLS (at least 1 core per iteration; overlays when applicable):
  Core:    spec_code, checklist_evidence
  Overlay: skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability

QUALITY GATES: Evidence (file:line on P0/P1); Scope (findings cite files within the four targets, not 015).

CLAIM ADJUDICATION (for every new P0/P1): embed a fenced json code block with: claim, evidenceRefs[], counterevidenceSought, alternativeExplanation, finalSeverity, confidence (0..1), downgradeTrigger.

YOUR DELIVERABLES - exactly two files:

(1) WRITE {spec_folder}/review/iterations/iteration-{nnn}.md with this structure:

# Iteration {iter_n} - Dimension: {dim} - Subset: {subset}

## Dispatcher
- iteration: {iter_n} of 50
- dispatcher: cli-copilot (model gpt-5.4, effort high, parallel v2)
- timestamp: <ISO-8601 now>

## Files Reviewed
- <relative repo paths>

## Findings - New This Iteration
### P0 Findings
[per P0 with file:line + claim-adjudication JSON block]
### P1 Findings
[per P1]
### P2 Findings
[bullets OK]

## Findings - Confirming / Re-validating Prior
[optional]

## Traceability Checks
[at least one core protocol with status + rationale]

## Confirmed-Clean Surfaces
[files/dimensions verified clean]

## Next Focus (recommendation)
[one-line hint for iteration {next_iter}]

(2) WRITE {spec_folder}/review/deltas/iter-{nnn}.jsonl - single JSON line, no trailing content:

{{"type":"iteration","run":{iter_n},"mode":"review","status":"insight|thought|error","focus":"{dim}","subset":"{subset}","dimensions":["{dim}"],"filesReviewed":[...],"findingsCount":N,"findingsSummary":{{"P0":N,"P1":N,"P2":N}},"findingsNew":{{"P0":N,"P1":N,"P2":N}},"traceabilityChecks":{{"summary":{{"required":N,"executed":N,"pass":N,"partial":N,"fail":N,"blocked":N,"notApplicable":N,"gatingFailures":N}},"results":[{{"protocol":"<name>","level":"core|overlay","status":"pass|partial|fail|blocked|notApplicable","evidence":"<short>"}}]}},"newFindingsRatio":0.0,"dispatcher":{{"kind":"cli-copilot","model":"gpt-5.4","effort":"high","parallel":true}},"timestamp":"<ISO-8601>","sessionId":"2026-04-15T16:59:49Z","generation":1}}

findingsCount = total this iteration; findingsNew = new; newFindingsRatio = new / max(1, files reviewed).

CONSTRAINTS:
- LEAF agent; no sub-agents, no skills, no /spec_kit commands
- Target 9 tool calls; soft max 12; hard max 13
- READ-ONLY on everything outside your two deliverables
- Do NOT touch state.jsonl, strategy.md, or findings-registry.json

BEGIN ITERATION {iter_n} NOW.
"""
with open(out_path, "w") as f:
    f.write(prompt)
PY
done

echo "generated prompts for iters $START..$END in $PROMPTS_DIR"
ls "$PROMPTS_DIR" | head -5
echo "..."
ls "$PROMPTS_DIR" | tail -3
