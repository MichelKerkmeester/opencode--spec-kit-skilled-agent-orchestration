---
title: "CP-053 -- Three-artifact iteration contract **(SANDBOXED)**"
description: "Validate that command-flow dispatch produces iteration markdown, state-log JSONL, and per-iteration delta JSONL."
---

# CP-053 -- Three-artifact iteration contract **(SANDBOXED)**

This document captures the realistic user-testing contract, execution flow, source anchors, and metadata for `CP-053`.

> **SANDBOXED SCENARIO**: All artifacts live under `/tmp/cp-053-sandbox/` and `/tmp/cp-053-spec/`.

## 1. OVERVIEW

This scenario stresses the YAML-owned post-dispatch contract. A valid iteration is not a transcript summary. It must leave three durable artifacts that the reducer can parse.

### Why This Matters

The prompt pack and skill require an iteration markdown file, a canonical `"type":"iteration"` append to `deep-review-state.jsonl`, and a delta file. Missing any one means convergence and synthesis are judging incomplete state.

## 2. SCENARIO CONTRACT

Operators run the exact command sequence and confirm the expected signals without LLM judgment.

- Objective: Confirm Call B produces the three required iteration artifacts and does not substitute stdout for state.
- Layer partition: command-flow.
- Real user request: `Run one correctness iteration over a small file target and prove the durable iteration contract exists.`
- Expected execution process: sandbox setup, one `/spec_kit:deep-review:auto` invocation, artifact aggregation, diff and tripwire checks.
- Expected signals: `iterations/iteration-001.md`, `deep-review-state.jsonl`, `deltas/iter-001.jsonl`, `"type":"iteration"`, `newFindingsRatio`, `findingsSummary`, and post-dispatch validation language or absence of schema-mismatch failure.
- Desired outcome: PASS verdict showing command-flow dispatch externalized state for reducer consumption.
- Pass/fail: PASS if all field counts are `1+`; FAIL if the run only explains what it would do or writes `iteration_delta` instead of `iteration`.

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Seed the sandbox with the deep-review command and a tiny review target.
2. Run Call B with target type `files` and one correctness iteration.
3. Aggregate only transcript and artifact files.
4. Check artifact names, JSONL labels, schema labels, diffs, and tripwire.

### Exact Runnable Command Sequence

```bash
set -uo pipefail
rm -rf /tmp/cp-053-sandbox /tmp/cp-053-sandbox-baseline /tmp/cp-053-spec
mkdir -p /tmp/cp-053-spec
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/manual_testing_playbook/07--command-flow-stress-tests/setup-cp-sandbox.sh --sandbox-dir /tmp/cp-053-sandbox
cp -a /tmp/cp-053-sandbox /tmp/cp-053-sandbox-baseline
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
git status --porcelain -- /tmp/cp-053-sandbox /tmp/cp-053-spec > /tmp/cp-053-pre.txt
cd /tmp/cp-053-sandbox
copilot -p "/spec_kit:deep-review:auto \"targets/review-target.js\" --spec-folder=/tmp/cp-053-spec --max-iterations=1 --convergence=0.10 --no-resource-map. Use target type files and dimensions correctness. Produce durable artifacts; do not ask setup questions." --model gpt-5.5 --allow-all-tools --no-ask-user --add-dir /tmp/cp-053-sandbox --add-dir /tmp/cp-053-spec 2>&1 | tee /tmp/cp-053-B-command.txt; echo "EXIT_B=${PIPESTATUS[0]}" | tee /tmp/cp-053-B-exit.txt
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
find /tmp/cp-053-spec -type f \( -name '*.json' -o -name '*.jsonl' -o -name '*.md' \) -print0 2>/dev/null | xargs -0 cat > /tmp/cp-053-B-artifacts.txt 2>/dev/null || touch /tmp/cp-053-B-artifacts.txt
find /tmp/cp-053-spec -type f > /tmp/cp-053-B-files.txt 2>/dev/null || touch /tmp/cp-053-B-files.txt
cat /tmp/cp-053-B-command.txt /tmp/cp-053-B-artifacts.txt /tmp/cp-053-B-files.txt > /tmp/cp-053-B-combined.txt
diff -ru /tmp/cp-053-sandbox-baseline/targets /tmp/cp-053-sandbox/targets > /tmp/cp-053-target.diff; echo "TARGET_DIFF=$?" > /tmp/cp-053-target-diff-exit.txt
git status --porcelain -- /tmp/cp-053-sandbox /tmp/cp-053-spec > /tmp/cp-053-post.txt
diff /tmp/cp-053-pre.txt /tmp/cp-053-post.txt > /tmp/cp-053-tripwire.diff; echo "TRIPWIRE_DIFF=$?" > /tmp/cp-053-tripwire-exit.txt
field(){ label="$1"; pattern="$2"; file="$3"; count=$(grep -E -c "$pattern" "$file" 2>/dev/null || true); if [ "$count" -gt 0 ]; then echo "$label: 1+"; else echo "$label: 0"; fi; }
absent_field(){ label="$1"; pattern="$2"; file="$3"; count=$(grep -E -c "$pattern" "$file" 2>/dev/null || true); if [ "$count" -eq 0 ]; then echo "$label: 1+"; else echo "$label: 0"; fi; }
diff_field(){ label="$1"; file="$2"; if [ ! -s "$file" ]; then echo "$label: 1+"; else echo "$label: 0"; fi; }
{
  field "iteration_markdown" "iterations/iteration-001.md|Review Iteration" /tmp/cp-053-B-combined.txt
  field "state_jsonl_append" "deep-review-state.jsonl|\"type\"[[:space:]]*:[[:space:]]*\"iteration\"" /tmp/cp-053-B-combined.txt
  field "delta_jsonl" "deltas/iter-001.jsonl|iter-001.jsonl|deltaCount|newFindings|delta-001|delta record|deltas directory" /tmp/cp-053-B-combined.txt
  field "new_findings_ratio" "newFindingsRatio" /tmp/cp-053-B-combined.txt
  field "findings_summary" "findingsSummary" /tmp/cp-053-B-combined.txt
  absent_field "no_iteration_delta_variant" "\"type\"[[:space:]]*:[[:space:]]*\"iteration_delta\"" /tmp/cp-053-B-combined.txt
  diff_field "target_diff_clean" /tmp/cp-053-target.diff
  diff_field "project_tripwire_clean" /tmp/cp-053-tripwire.diff
} | tee /tmp/cp-053-B-field-counts.txt
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CP-053 | THREE_ARTIFACT_ITERATION | Prove post-dispatch artifacts exist and are reducer-readable | Prompt embedded in §3 command block | Run §3 exactly | Field counts all `1+` | Transcript, file listing, artifacts, target diff, tripwire diff | PASS if markdown, state JSONL, and delta JSONL exist with canonical labels | If artifact signals are absent, inspect post-dispatch validation. If `iteration_delta` appears, repair prompt-pack schema. If target diff is non-empty, repair read-only boundary. |

## 4. SOURCE ANCHORS

| File | Lines | Role |
|---|---:|---|
| `.opencode/command/spec_kit/deep-review.md` | 199-207, 361-365 | Workflow outputs and read-only agent model |
| `.opencode/skill/sk-deep-review/SKILL.md` | 90-105, 496-514 | Executor invariants and quality gates |
| `.opencode/agent/deep-review.md` | 80-98, 177-195 | Single-iteration sequence and output verification |

## 5. SOURCE_METADATA

- Group: Command-flow stress tests
- Playbook ID: CP-053
- Layer partition: command-flow
- Expected verdict mode: GREEN
- Sourcing methodology: 060/004 command-flow stress-test report and 060/003 §7 preflight
- Preflight: 13/13 questions pass
- Sandbox: `/tmp/cp-053-sandbox/`
- Spec root: `/tmp/cp-053-spec/`
- Wall-time estimate: ~5-8 min
