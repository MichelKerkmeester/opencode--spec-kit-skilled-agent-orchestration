---
title: "CP-048 -- RESOURCE_MAP_TOGGLE no-resource-map fidelity **(SANDBOXED)**"
description: "Validate that --no-resource-map is parsed by the command and honored by config, state, synthesis and artifact emission."
---

# CP-048 -- RESOURCE_MAP_TOGGLE no-resource-map fidelity **(SANDBOXED)**

This document captures the realistic user-testing contract, execution flow, source anchors and metadata for `CP-048`.

> **SANDBOXED SCENARIO**: All command files live under `/tmp/cp-048-sandbox/`. Research artifacts live under `/tmp/cp-048-spec/`.

## 1. OVERVIEW

This scenario invokes `/spec_kit:deep-research:auto` with `--no-resource-map`. Call B must persist the disabled setting and avoid emitting a convergence-time `resource-map.md` while still producing normal research artifacts.

### Why This Matters

The command exposes resource-map emission as an operator flag. A stress test must prove the flag is not just accepted by the Markdown surface, but also carried into config, state and synthesis behavior.

## 2. SCENARIO CONTRACT

Operators run the exact command sequence for `CP-048` and grade the result through field counts only.

- Objective: Confirm `resource_map.emit` is false in config and JSONL, no packet-local `resource-map.md` is emitted, `research.md` still exists, and containment holds.
- Layer partition: command-flow.
- Real user request: `Run one-iteration deep research but suppress resource-map output.`
- RCAF Prompt:

  Same task body for both calls:
  ```
  Task ID: CP-048-TASK-001.
  In /tmp/cp-048-sandbox/, run /spec_kit:deep-research:auto with --no-resource-map.
  Stay strictly inside /tmp/cp-048-sandbox/ and /tmp/cp-048-spec/.
  Acceptance: config and JSONL both show resource_map.emit false, research.md exists, resource-map.md does not exist, and canonical target diff is empty.
  Return status, emit_flag, research_path, resource_map_path, and notes.
  ```

- Expected process: seed a spec, run generic Call A, reset sandbox, run command-flow Call B with `--no-resource-map`, then check config/state/artifact presence.
- Expected signals: `"emit":false`, `resource_map.emit` disabled, `research.md`, missing `resource-map.md` as a pass signal, clean canonical diff, clean tripwire.
- Pass/fail: PASS if disabled resource-map state is visible and no map artifact is emitted. FAIL if resource-map output appears or the loop loses normal research output.

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Build the sandbox.
2. Seed `/tmp/cp-048-spec/spec.md`.
3. Run Call A as the generic baseline.
4. Reset the sandbox.
5. Run Call B through `/spec_kit:deep-research:auto ... --no-resource-map`.
6. Count config, state, output, absent-map, diff and tripwire signals.

### Exact Runnable Command Sequence

```bash
rm -rf /tmp/cp-048-sandbox /tmp/cp-048-sandbox-baseline /tmp/cp-048-spec
mkdir -p /tmp/cp-048-spec
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/manual_testing_playbook/07--command-flow-stress-tests/setup-cp-sandbox.sh --sandbox-dir /tmp/cp-048-sandbox
cp -a /tmp/cp-048-sandbox /tmp/cp-048-sandbox-baseline
cat > /tmp/cp-048-spec/spec.md <<'EOF'
---
title: "CP-048 Resource Map Toggle"
description: "Sandbox spec for resource-map suppression."
---
# CP-048 Resource Map Toggle
## Requirements
- Suppress convergence-time resource-map output.
## Scope
- Keep normal research artifacts.
## Open Questions
- Does --no-resource-map persist into config and state?
## Research Context
- Command-flow stress test.
EOF
git status --porcelain > /tmp/cp-048-pre.txt
cat > /tmp/cp-048-task.txt <<'EOF'
Task ID: CP-048-TASK-001.
In /tmp/cp-048-sandbox/, run /spec_kit:deep-research:auto with --no-resource-map.
Stay strictly inside /tmp/cp-048-sandbox/ and /tmp/cp-048-spec/.
Acceptance: config and JSONL both show resource_map.emit false, research.md exists, resource-map.md does not exist, and canonical target diff is empty.
Return status, emit_flag, research_path, resource_map_path, and notes.
EOF
printf 'As @Task: %s\n' "$(cat /tmp/cp-048-task.txt)" > /tmp/cp-048-prompt-A.txt
copilot -p "$(cat /tmp/cp-048-prompt-A.txt)" --model gpt-5.5 --allow-all-tools --no-ask-user --add-dir /tmp/cp-048-sandbox --add-dir /tmp/cp-048-spec 2>&1 | tee /tmp/cp-048-A-task.txt; echo "EXIT_A=${PIPESTATUS[0]}" | tee /tmp/cp-048-A-exit.txt
rm -rf /tmp/cp-048-sandbox && cp -a /tmp/cp-048-sandbox-baseline /tmp/cp-048-sandbox
cd /tmp/cp-048-sandbox
copilot -p "/spec_kit:deep-research:auto \"CP-048 resource map suppression\" --spec-folder=/tmp/cp-048-spec --max-iterations=1 --convergence=0.05 --no-resource-map" --model gpt-5.5 --allow-all-tools --no-ask-user --add-dir /tmp/cp-048-sandbox --add-dir /tmp/cp-048-spec 2>&1 | tee /tmp/cp-048-B-command.txt; echo "EXIT_B=${PIPESTATUS[0]}" | tee /tmp/cp-048-B-exit.txt
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
diff -u /tmp/cp-048-sandbox-baseline/.opencode/agent/deep-research.md /tmp/cp-048-sandbox/.opencode/agent/deep-research.md > /tmp/cp-048-B-canonical.diff; echo "POST_B_CANONICAL_DIFF=$?" | tee /tmp/cp-048-B-canonical-exit.txt
find /tmp/cp-048-spec -type f -print0 2>/dev/null | xargs -0 cat > /tmp/cp-048-B-artifacts.txt 2>/dev/null || touch /tmp/cp-048-B-artifacts.txt
cat /tmp/cp-048-B-command.txt /tmp/cp-048-B-artifacts.txt > /tmp/cp-048-B-combined.txt
git status --porcelain > /tmp/cp-048-post.txt
diff /tmp/cp-048-pre.txt /tmp/cp-048-post.txt > /tmp/cp-048-tripwire.diff; echo "TRIPWIRE_DIFF_EXIT=$?" | tee /tmp/cp-048-tripwire-exit.txt
{ grep -c '"emit"[[:space:]]*:[[:space:]]*false' /tmp/cp-048-B-combined.txt; grep -c '"resource_map".*"emit"[[:space:]]*:[[:space:]]*false' /tmp/cp-048-B-combined.txt; grep -c 'research.md' /tmp/cp-048-B-combined.txt; test -s /tmp/cp-048-spec/research/research.md && echo 1 || echo 0; test ! -e /tmp/cp-048-spec/research/resource-map.md && echo 1 || echo 0; grep -q 'POST_B_CANONICAL_DIFF=0' /tmp/cp-048-B-canonical-exit.txt && echo 1 || echo 0; grep -q 'TRIPWIRE_DIFF_EXIT=0' /tmp/cp-048-tripwire-exit.txt && echo 1 || echo 0; } | tee /tmp/cp-048-B-field-counts.txt
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CP-048 | RESOURCE_MAP_TOGGLE | Confirm --no-resource-map suppresses map output | Same task body in §2 | Run the §3 bash block | B field counts all >= 1 | config, state log, research output, diffs | PASS if map output is absent and research output remains | 1. If emit is true, inspect command parsing. 2. If map exists, inspect reducer emit step. 3. If research.md is missing, inspect synthesis. |

## 4. SOURCE ANCHORS

| File | Anchor |
|---|---|
| `.opencode/command/spec_kit/deep-research.md:73-75` | `--no-resource-map` setup flag |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:238-267` | config and state persist resource-map settings |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:930-938` | reducer emits map unless disabled |
| `.opencode/skill/sk-deep-research/SKILL.md:443-448` | resource-map is expected unless disabled |
| `.opencode/agent/deep-research.md:269-274` | progressive research output remains separate |

## 5. SOURCE METADATA

- Group: Command Flow Stress
- Playbook ID: CP-048
- Layer partition: command-flow
- Preflight: 13/13 questions pass
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `07--command-flow-stress-tests/048-resource-map-toggle.md`
- Sandbox: `/tmp/cp-048-sandbox/`
- Concurrency: Single-operator-session, sequential A then B, sandbox reset between calls
- Wall-time estimate: ~5-8 min
