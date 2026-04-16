#!/bin/bash
# Dispatch one deep-review iteration via copilot CLI.
# Usage: dispatch_iter.sh <iteration_num> <dimension> [target_subset_hint]
set -euo pipefail

ITER="${1:?iteration number required}"
DIM="${2:?dimension required}"
SUBSET="${3:-all-four}"

REPO=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
SPEC_FOLDER=".opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-combined-deep-review-four-specs"
ABS_SPEC="$REPO/$SPEC_FOLDER"
NNN=$(printf "%03d" "$ITER")
ITER_FILE="$ABS_SPEC/review/iterations/iteration-$NNN.md"
LOG_FILE="$ABS_SPEC/review/logs/iter-$NNN.log"

cd "$REPO"

# Build prompt via Python to avoid bash quoting pain
PROMPT_FILE=$(mktemp /tmp/dispatch_prompt.XXXXXX.txt)
trap 'rm -f "$PROMPT_FILE"' EXIT

python3 - "$ITER" "$DIM" "$SUBSET" "$SPEC_FOLDER" "$PROMPT_FILE" <<'PY'
import sys
iter_n, dim, subset, spec_folder, out_path = sys.argv[1:6]
next_iter = int(iter_n) + 1
prompt = f"""You are acting as the @deep-review LEAF agent for iteration {iter_n} of 50 in a combined deep review.

SPEC FOLDER: {spec_folder} (pre-approved, skip Gate 3 — do NOT ask about spec folders)
MODE: review (READ-ONLY on all reviewed files; you may only write under {spec_folder}/review/)
SKIP: skill routing, skill_advisor, CLAUDE.md gates — you are a subprocess, just execute the iteration.

READ these state files first (relative to repo root):
  - {spec_folder}/review/deep-review-config.json       (full config, reviewScopeFiles list)
  - {spec_folder}/review/deep-review-strategy.md       (current dimension queue, next focus, running findings)
  - {spec_folder}/review/deep-review-state.jsonl       (prior iterations — one JSON record per line)
  - {spec_folder}/review/deep-review-findings-registry.json (deduplicated findings)

REVIEW TARGETS (all four, combined; iteration subset hint: {subset}):
  1. .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-playbook-and-remediation (coordination parent w/ 3 phase children)
  2. .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research (coordination parent w/ 3 phase children w/ sub-phases)
  3. .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-canonical-intake-and-middleware-cleanup (standard spec folder)
  4. .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-memory-save-planner-first-default (standard spec folder)

EXCLUDED from scope: scratch/, memory/, review/, research/, prompts/, changelog/, z_archive/, z_future/ subtrees within those targets, AND all sibling packets (001-008, 011, 013, 015).

ITERATION {iter_n} FOCUS:
  Dimension: {dim}
  Target subset: {subset}
  Severity threshold: P2 (report P0 blockers, P1 required, P2 suggestions)

SHARED REVIEW DOCTRINE: Load .agents/skills/sk-code-review/references/review_core.md if present before finalizing severity calls. If absent, default to: P0 = causes incorrectness/security breach in production, P1 = breaks contract/acceptance criteria, P2 = style/maintainability/nit.

TRACEABILITY PROTOCOLS (pick at least 1 core per iteration, overlays when applicable):
  Core:    spec_code, checklist_evidence
  Overlay: skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability

QUALITY GATES (inform your severity + evidence calls):
  - Evidence: every P0/P1 MUST include file:line reference
  - Scope: every finding MUST reference a file within the four targets (not this 015 spec folder itself)
  - Coverage: mark dimension coverage true once the dimension has been passed with at least one finding or a confirmed-clean verdict

CLAIM ADJUDICATION (required for every new P0/P1):
  For each new P0 or P1 finding, embed a fenced json code block with these fields:
    claim, evidenceRefs[], counterevidenceSought, alternativeExplanation, finalSeverity, confidence (0..1), downgradeTrigger

YOUR DELIVERABLES for this iteration:

(1) WRITE: {spec_folder}/review/iterations/iteration-{iter_n.zfill(3) if iter_n.isdigit() else iter_n}.md

Use this exact structure (markdown):

    # Iteration {iter_n} — Dimension: {dim} — Subset: {subset}

    ## Dispatcher
    - iteration: {iter_n} of 50
    - dispatcher: cli-copilot (binary copilot, model gpt-5.4, effort high)
    - timestamp: <ISO-8601 now>

    ## Files Reviewed
    - <list of files you actually read during this iteration, relative to repo root>

    ## Findings — New This Iteration
    ### P0 Findings
    [one block per P0, with file:line evidence and the typed claim-adjudication JSON block]
    ### P1 Findings
    [same pattern]
    ### P2 Findings
    [short bullets OK; optional claim-adjudication block]

    ## Findings — Confirming / Re-validating Prior
    [optional: reference finding IDs from prior iterations you confirmed or upgraded/downgraded]

    ## Traceability Checks
    [at least one core protocol checked; report pass / partial / fail / blocked / notApplicable with 1-line rationale]

    ## Confirmed-Clean Surfaces
    [files or dimensions you verified have no findings; include rationale so future iterations do not redo work]

    ## Next Focus (recommendation)
    [one-line hint for iteration {next_iter}]

(2) APPEND ONE LINE to {spec_folder}/review/deep-review-state.jsonl with this JSON shape (single line, no trailing comma):

    {{"type":"iteration","run":{iter_n},"mode":"review","status":"insight|thought|error","focus":"{dim}","subset":"{subset}","dimensions":["{dim}"],"filesReviewed":[...],"findingsCount":N,"findingsSummary":{{"P0":N,"P1":N,"P2":N}},"findingsNew":{{"P0":N,"P1":N,"P2":N}},"traceabilityChecks":{{"summary":{{"required":N,"executed":N,"pass":N,"partial":N,"fail":N,"blocked":N,"notApplicable":N,"gatingFailures":N}},"results":[{{"protocol":"spec_code","level":"core","status":"pass|partial|fail|blocked|notApplicable","evidence":"<short>"}}]}},"newFindingsRatio":0.0,"dispatcher":{{"kind":"cli-copilot","model":"gpt-5.4","effort":"high"}},"timestamp":"<ISO-8601>","sessionId":"2026-04-15T16:59:49Z","generation":1}}

Guidance on newFindingsRatio:
  - Iteration 1 (inventory): typically 0.8-1.0 (everything is new)
  - Later iterations: (new findings this iter) / max(1, files reviewed this iter), cap at 1.0
  - 0.0 when no findings

(3) UPDATE {spec_folder}/review/deep-review-strategy.md in place:
  - Mark [x] on the completed dimension in section 3 when the dimension is complete (this iter or earlier has passed dimension with at least one finding or confirmed-clean)
  - Append to section 6 (COMPLETED DIMENSIONS) when a dimension verdict is reached
  - Update section 7 (RUNNING FINDINGS) counters
  - Update section 12 (NEXT FOCUS) with one-line recommendation for iteration {next_iter}
  - Append to section 14 (CROSS-REFERENCE STATUS) the protocols you exercised this iteration
  - Preserve all MACHINE-OWNED markers verbatim

CONSTRAINTS:
  - LEAF agent: do NOT dispatch sub-agents, do NOT invoke skills, do NOT open /spec_kit commands
  - Target 9 tool calls; soft max 12; hard max 13 — stay focused
  - Review target is READ-ONLY — do NOT edit any file outside {spec_folder}/review/
  - Write ALL findings to files; do not hold state in context
  - If a state file is missing or contradictory, halt with a single clear error line in {spec_folder}/review/logs/iter-{iter_n}.log-ERROR and DO NOT write partial state

BEGIN ITERATION {iter_n} NOW.
"""
with open(out_path, "w") as f:
    f.write(prompt)
PY

{
  echo "=== Dispatching iteration $ITER / dimension=$DIM / subset=$SUBSET ==="
  echo "=== start: $(date -u +%Y-%m-%dT%H:%M:%SZ) ==="
} | tee -a "$LOG_FILE"

set +e
copilot -p "$(cat "$PROMPT_FILE")" \
  --model gpt-5.4 \
  --effort high \
  --allow-all-tools \
  --add-dir "$REPO" \
  --log-level warning \
  2>&1 | tee -a "$LOG_FILE"
RC=${PIPESTATUS[0]}
set -e

echo "=== end: $(date -u +%Y-%m-%dT%H:%M:%SZ) rc=$RC ===" | tee -a "$LOG_FILE"

if [ ! -f "$ITER_FILE" ]; then
  echo "MISSING_ITER_FILE: $ITER_FILE" | tee -a "$LOG_FILE"
  exit 2
fi
exit $RC
