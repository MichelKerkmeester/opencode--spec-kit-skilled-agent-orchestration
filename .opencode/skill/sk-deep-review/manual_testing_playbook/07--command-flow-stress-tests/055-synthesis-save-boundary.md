---
title: "CP-055 -- Synthesis and save boundary **(SANDBOXED)**"
description: "Validate that deep-review synthesis writes reducer-owned review artifacts and routes continuity through generate-context.js, not retired memory files."
---

# CP-055 -- Synthesis and save boundary **(SANDBOXED)**

This document captures the realistic user-testing contract, execution flow, source anchors, and metadata for `CP-055`.

> **SANDBOXED SCENARIO**: All artifacts live under `/tmp/cp-055-sandbox/` and `/tmp/cp-055-spec/`.

## 1. OVERVIEW

This scenario checks the end of the command loop. A deep review run must synthesize review artifacts and route continuity through the canonical save script instead of hand-authoring retired memory paths.

### Why This Matters

The command surface promises `review-report.md`, optional `resource-map.md`, reducer outputs, and continuity routed by `generate-context.js`. Synthesis that only returns a transcript is not durable review output.

## 2. SCENARIO CONTRACT

Operators run the exact command sequence and inspect only grep-able transcript and artifact signals.

- Objective: Confirm command synthesis emits review artifacts and does not create retired `memory/` notes.
- Layer partition: command-flow.
- Real user request: `Run a bounded deep review and prove synthesis/save artifacts are durable.`
- Expected execution process: sandbox setup, one max-iteration run, artifact aggregation, retired-memory absence check, diff and tripwire checks.
- Expected signals: `review-report.md`, `deep-review-dashboard.md`, `deep-review-findings-registry.json`, `generate-context.js`, `STATUS=OK` or `STATUS=FAIL`, no `/memory/` directory under the temp spec, clean target diff, clean tripwire.
- Desired outcome: PASS verdict proving command-flow synthesis is durable and save routing is explicit.
- Pass/fail: PASS if every field count is `1+`; FAIL if report/dashboard are absent or retired memory files appear.

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Use a small target so max-iteration synthesis is reachable.
2. Keep `--no-resource-map` on to isolate report/save behavior from resource-map emission.
3. Aggregate all temp spec artifacts and side-file checks.
4. Treat retired memory directory absence as a positive grep-only field.

### Exact Runnable Command Sequence

```bash
set -uo pipefail
rm -rf /tmp/cp-055-sandbox /tmp/cp-055-sandbox-baseline /tmp/cp-055-spec
mkdir -p /tmp/cp-055-spec
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/manual_testing_playbook/07--command-flow-stress-tests/setup-cp-sandbox.sh --sandbox-dir /tmp/cp-055-sandbox
cp -a /tmp/cp-055-sandbox /tmp/cp-055-sandbox-baseline
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
git status --porcelain -- /tmp/cp-055-sandbox /tmp/cp-055-spec > /tmp/cp-055-pre.txt
cd /tmp/cp-055-sandbox
copilot -p "/spec_kit:deep-review:auto \"targets/review-target.js\" --spec-folder=/tmp/cp-055-spec --max-iterations=1 --convergence=0.10 --no-resource-map. Use target type files and dimensions maintainability. Complete synthesis after max iterations and route continuity via generate-context.js." --model gpt-5.5 --allow-all-tools --no-ask-user --add-dir /tmp/cp-055-sandbox --add-dir /tmp/cp-055-spec 2>&1 | tee /tmp/cp-055-B-command.txt; echo "EXIT_B=${PIPESTATUS[0]}" | tee /tmp/cp-055-B-exit.txt
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
find /tmp/cp-055-spec -type f \( -name '*.json' -o -name '*.jsonl' -o -name '*.md' \) -print0 2>/dev/null | xargs -0 cat > /tmp/cp-055-B-artifacts.txt 2>/dev/null || touch /tmp/cp-055-B-artifacts.txt
find /tmp/cp-055-spec -type f > /tmp/cp-055-B-files.txt 2>/dev/null || touch /tmp/cp-055-B-files.txt
cat /tmp/cp-055-B-command.txt /tmp/cp-055-B-artifacts.txt /tmp/cp-055-B-files.txt > /tmp/cp-055-B-combined.txt
if [ -d /tmp/cp-055-spec/memory ]; then find /tmp/cp-055-spec/memory -type f > /tmp/cp-055-memory-files.txt; else : > /tmp/cp-055-memory-files.txt; fi
diff -ru /tmp/cp-055-sandbox-baseline/targets /tmp/cp-055-sandbox/targets > /tmp/cp-055-target.diff; echo "TARGET_DIFF=$?" > /tmp/cp-055-target-diff-exit.txt
git status --porcelain -- /tmp/cp-055-sandbox /tmp/cp-055-spec > /tmp/cp-055-post.txt
diff /tmp/cp-055-pre.txt /tmp/cp-055-post.txt > /tmp/cp-055-tripwire.diff; echo "TRIPWIRE_DIFF=$?" > /tmp/cp-055-tripwire-exit.txt
field(){ label="$1"; pattern="$2"; file="$3"; count=$(grep -E -c "$pattern" "$file" 2>/dev/null || true); if [ "$count" -gt 0 ]; then echo "$label: 1+"; else echo "$label: 0"; fi; }
absent_file_field(){ label="$1"; file="$2"; if [ ! -s "$file" ]; then echo "$label: 1+"; else echo "$label: 0"; fi; }
diff_field(){ label="$1"; file="$2"; if [ ! -s "$file" ]; then echo "$label: 1+"; else echo "$label: 0"; fi; }
{
  field "review_report" "review-report.md|Review Report" /tmp/cp-055-B-combined.txt
  field "dashboard" "deep-review-dashboard.md|dashboard" /tmp/cp-055-B-combined.txt
  field "findings_registry" "deep-review-findings-registry.json|openFindings" /tmp/cp-055-B-combined.txt
  field "save_script_named" "generate-context.js" /tmp/cp-055-B-combined.txt
  field "status_reported" "STATUS=OK|STATUS=FAIL|Deep review complete" /tmp/cp-055-B-combined.txt
  absent_file_field "no_retired_memory_files" /tmp/cp-055-memory-files.txt
  diff_field "target_diff_clean" /tmp/cp-055-target.diff
  diff_field "project_tripwire_clean" /tmp/cp-055-tripwire.diff
} | tee /tmp/cp-055-B-field-counts.txt
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CP-055 | SYNTHESIS_SAVE_BOUNDARY | Prove synthesis artifacts and canonical save routing exist | Prompt embedded in §3 command block | Run §3 exactly | Field counts all `1+` | Combined artifacts, memory absence file, diffs | PASS if review report/dashboard/registry exist and retired memory files are absent | If report is absent, inspect synthesis phase. If memory files appear, inspect save routing. If target diff is non-empty, repair read-only guard. |

## 4. SOURCE ANCHORS

| File | Lines | Role |
|---|---:|---|
| `.opencode/command/spec_kit/deep-review.md` | 249-265, 269-283 | Success/failure output and memory integration |
| `.opencode/skill/sk-deep-review/SKILL.md` | 496-514, 563-575 | Loop completion, quality gates, continuity integration |
| `.opencode/agent/deep-review.md` | 292-297, 503-520 | Reducer boundary and related resources |

## 5. SOURCE_METADATA

- Group: Command-flow stress tests
- Playbook ID: CP-055
- Layer partition: command-flow
- Expected verdict mode: GREEN
- Sourcing methodology: 060/004 command-flow stress-test report and 060/003 §7 preflight
- Preflight: 13/13 questions pass
- Sandbox: `/tmp/cp-055-sandbox/`
- Spec root: `/tmp/cp-055-spec/`
- Wall-time estimate: ~6-9 min
