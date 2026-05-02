---
title: "CP-054 -- Resource-map coverage gate **(SANDBOXED)**"
description: "Validate that deep-review command flow detects resource-map.md and carries coverage-gate evidence into state and synthesis."
---

# CP-054 -- Resource-map coverage gate **(SANDBOXED)**

This document captures the realistic user-testing contract, execution flow, source anchors, and metadata for `CP-054`.

> **SANDBOXED SCENARIO**: All artifacts live under `/tmp/cp-054-sandbox/` and `/tmp/cp-054-spec/`.

## 1. OVERVIEW

This scenario stresses a command/skill cross-layer gate: when a spec has `resource-map.md`, the review loop must treat it as a first-class audit input rather than optional context.

### Why This Matters

The skill says resource-map coverage changes initialization, strategy context, traceability focus, and synthesis. A run that ignores the map can falsely claim coverage.

## 2. SCENARIO CONTRACT

Operators run the exact command sequence and verify only file and text signals.

- Objective: Confirm resource-map presence is persisted in config/state and referenced in strategy or report output.
- Layer partition: command-flow.
- Real user request: `Review a target with a declared resource map and prove the coverage gate is visible.`
- Expected execution process: create sandbox and spec fixture, add `resource-map.md` plus `applied/T-001.md`, run one traceability iteration, then inspect artifacts.
- Expected signals: `resource_map_present`, `Resource Map Coverage`, `resource-map.md`, `applied/T-001.md`, `traceability`, clean target diff, clean tripwire.
- Desired outcome: PASS verdict proving resource map coverage is not silently skipped.
- Pass/fail: PASS if all field counts are `1+`; FAIL if config says resource map absent or coverage language never appears.

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Prepare the sandbox and external spec root.
2. Write a minimal resource map and applied task fixture in `/tmp/cp-054-spec/`.
3. Run the command in auto mode for a traceability pass.
4. Aggregate transcript and artifacts and write grep-only field counts.

### Exact Runnable Command Sequence

```bash
set -uo pipefail
rm -rf /tmp/cp-054-sandbox /tmp/cp-054-sandbox-baseline /tmp/cp-054-spec
mkdir -p /tmp/cp-054-spec/applied
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/manual_testing_playbook/07--command-flow-stress-tests/setup-cp-sandbox.sh --sandbox-dir /tmp/cp-054-sandbox
cat > /tmp/cp-054-spec/resource-map.md <<'MAP'
# Resource Map

| Path | Role |
|---|---|
| `/tmp/cp-054-sandbox/targets/review-target.js` | Target file for traceability coverage |
MAP
cat > /tmp/cp-054-spec/applied/T-001.md <<'TASK'
# T-001

target_files:
- /tmp/cp-054-sandbox/targets/review-target.js
TASK
cp -a /tmp/cp-054-sandbox /tmp/cp-054-sandbox-baseline
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
git status --porcelain -- /tmp/cp-054-sandbox /tmp/cp-054-spec > /tmp/cp-054-pre.txt
cd /tmp/cp-054-sandbox
copilot -p "/spec_kit:deep-review:auto \"targets/review-target.js\" --spec-folder=/tmp/cp-054-spec --max-iterations=1 --convergence=0.10. Use target type files and dimensions traceability. Treat resource-map.md as first-class coverage input." --model gpt-5.5 --allow-all-tools --no-ask-user --add-dir /tmp/cp-054-sandbox --add-dir /tmp/cp-054-spec 2>&1 | tee /tmp/cp-054-B-command.txt; echo "EXIT_B=${PIPESTATUS[0]}" | tee /tmp/cp-054-B-exit.txt
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
find /tmp/cp-054-spec -type f \( -name '*.json' -o -name '*.jsonl' -o -name '*.md' \) -print0 2>/dev/null | xargs -0 cat > /tmp/cp-054-B-artifacts.txt 2>/dev/null || touch /tmp/cp-054-B-artifacts.txt
find /tmp/cp-054-spec -type f > /tmp/cp-054-B-files.txt 2>/dev/null || touch /tmp/cp-054-B-files.txt
cat /tmp/cp-054-B-command.txt /tmp/cp-054-B-artifacts.txt /tmp/cp-054-B-files.txt > /tmp/cp-054-B-combined.txt
diff -ru /tmp/cp-054-sandbox-baseline/targets /tmp/cp-054-sandbox/targets > /tmp/cp-054-target.diff; echo "TARGET_DIFF=$?" > /tmp/cp-054-target-diff-exit.txt
git status --porcelain -- /tmp/cp-054-sandbox /tmp/cp-054-spec > /tmp/cp-054-post.txt
diff /tmp/cp-054-pre.txt /tmp/cp-054-post.txt > /tmp/cp-054-tripwire.diff; echo "TRIPWIRE_DIFF=$?" > /tmp/cp-054-tripwire-exit.txt
field(){ label="$1"; pattern="$2"; file="$3"; count=$(grep -E -c "$pattern" "$file" 2>/dev/null || true); if [ "$count" -gt 0 ]; then echo "$label: 1+"; else echo "$label: 0"; fi; }
diff_field(){ label="$1"; file="$2"; if [ ! -s "$file" ]; then echo "$label: 1+"; else echo "$label: 0"; fi; }
{
  field "resource_map_present" "resource_map_present|resource-map.md exists" /tmp/cp-054-B-combined.txt
  field "coverage_gate_named" "Resource Map Coverage|resource-map coverage" /tmp/cp-054-B-combined.txt
  field "applied_task_visible" "applied/T-001.md|target_files" /tmp/cp-054-B-combined.txt
  field "traceability_dimension" "traceability|Traceability" /tmp/cp-054-B-combined.txt
  field "resource_map_artifact" "resource-map.md" /tmp/cp-054-B-combined.txt
  diff_field "target_diff_clean" /tmp/cp-054-target.diff
  diff_field "project_tripwire_clean" /tmp/cp-054-tripwire.diff
} | tee /tmp/cp-054-B-field-counts.txt
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CP-054 | RESOURCE_MAP_GATE | Prove map presence changes review state and coverage language | Prompt embedded in §3 command block | Run §3 exactly | Field counts all `1+` | Resource map, applied task, combined artifacts, diffs | PASS if map presence is persisted and coverage gate is named | If absent, inspect `step_detect_resource_map`. If report omits coverage language, inspect synthesis gate. |

## 4. SOURCE ANCHORS

| File | Lines | Role |
|---|---:|---|
| `.opencode/command/spec_kit/deep-review.md` | 186-188, 238-245 | Review packet outputs and YAML handoff |
| `.opencode/skill/sk-deep-review/SKILL.md` | 233-251, 496-503 | Resource-map coverage behavior and report expectations |
| `.opencode/agent/deep-review.md` | 245-252, 424-435 | Traceability dimension and pre-delivery verification |

## 5. SOURCE_METADATA

- Group: Command-flow stress tests
- Playbook ID: CP-054
- Layer partition: command-flow
- Expected verdict mode: GREEN
- Sourcing methodology: 060/004 command-flow stress-test report and 060/003 §7 preflight
- Preflight: 13/13 questions pass
- Sandbox: `/tmp/cp-054-sandbox/`
- Spec root: `/tmp/cp-054-spec/`
- Wall-time estimate: ~6-9 min
