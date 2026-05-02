---
title: "CP-049 -- PAUSE_SENTINEL_HALT command lifecycle stop **(SANDBOXED)**"
description: "Validate that a packet-local .deep-research-pause sentinel halts the command between lifecycle turns and records userPaused without writing an iteration."
---

# CP-049 -- PAUSE_SENTINEL_HALT command lifecycle stop **(SANDBOXED)**

This document captures the realistic user-testing contract, execution flow, source anchors and metadata for `CP-049`.

> **SANDBOXED SCENARIO**: All command files live under `/tmp/cp-049-sandbox/`. Research artifacts live under `/tmp/cp-049-spec/`.

## 1. OVERVIEW

This scenario pre-creates the packet-local pause sentinel before Call B. The command should initialize enough state to see the sentinel, append `userPaused`, and halt before any iteration file is written.

### Why This Matters

Pause handling belongs to the command workflow, not the leaf agent. A stress test must prove the lifecycle stop is represented in JSONL and does not get treated as a successful research iteration.

## 2. SCENARIO CONTRACT

Operators run the exact command sequence for `CP-049` and confirm expected stop signals.

- Objective: Confirm pause sentinel detection, `userPaused` event, no iteration file, config/state creation, clean canonical diff and clean project tripwire.
- Layer partition: command-flow.
- Real user request: `Start deep research in a paused packet and prove it halts before dispatching the leaf agent.`
- RCAF Prompt:

  Same task body for both calls:
  ```
  Task ID: CP-049-TASK-001.
  In /tmp/cp-049-sandbox/, run /spec_kit:deep-research:auto while /tmp/cp-049-spec/research/.deep-research-pause exists.
  Stay strictly inside /tmp/cp-049-sandbox/ and /tmp/cp-049-spec/.
  Acceptance: record userPaused, keep the sentinel path visible, create no iteration-NNN.md, and do not edit the canonical target.
  Return status, stop_reason, sentinel_path, iteration_count, and notes.
  ```

- Expected process: create sandbox, seed spec and pause sentinel, run Call A, reset sandbox, recreate sentinel, run command-flow Call B, then count stop signals.
- Expected signals: `.deep-research-pause`, `userPaused`, `stopReason":"userPaused`, no `iteration-001.md`, config/state files, clean diffs.
- Pass/fail: PASS if the command halts before leaf dispatch and records a pause event. FAIL if an iteration file appears or the pause is reported as convergence.

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Build the sandbox.
2. Seed `/tmp/cp-049-spec/spec.md` and `/tmp/cp-049-spec/research/.deep-research-pause`.
3. Run Call A as the generic baseline.
4. Reset the sandbox and recreate the sentinel.
5. Run Call B through `/spec_kit:deep-research:auto`.
6. Validate pause, no-iteration, diff and tripwire signals.

### Exact Runnable Command Sequence

```bash
rm -rf /tmp/cp-049-sandbox /tmp/cp-049-sandbox-baseline /tmp/cp-049-spec
mkdir -p /tmp/cp-049-spec/research
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/manual_testing_playbook/07--command-flow-stress-tests/setup-cp-sandbox.sh --sandbox-dir /tmp/cp-049-sandbox
cp -a /tmp/cp-049-sandbox /tmp/cp-049-sandbox-baseline
cat > /tmp/cp-049-spec/spec.md <<'EOF'
---
title: "CP-049 Pause Sentinel"
description: "Sandbox spec for pause sentinel lifecycle testing."
---
# CP-049 Pause Sentinel
## Requirements
- Halt before iteration dispatch when sentinel exists.
## Scope
- Use /tmp/cp-049-spec only.
## Open Questions
- Does pause detection emit userPaused?
## Research Context
- Command-flow stress test.
EOF
touch /tmp/cp-049-spec/research/.deep-research-pause
git status --porcelain > /tmp/cp-049-pre.txt
cat > /tmp/cp-049-task.txt <<'EOF'
Task ID: CP-049-TASK-001.
In /tmp/cp-049-sandbox/, run /spec_kit:deep-research:auto while /tmp/cp-049-spec/research/.deep-research-pause exists.
Stay strictly inside /tmp/cp-049-sandbox/ and /tmp/cp-049-spec/.
Acceptance: record userPaused, keep the sentinel path visible, create no iteration-NNN.md, and do not edit the canonical target.
Return status, stop_reason, sentinel_path, iteration_count, and notes.
EOF
printf 'As @Task: %s\n' "$(cat /tmp/cp-049-task.txt)" > /tmp/cp-049-prompt-A.txt
copilot -p "$(cat /tmp/cp-049-prompt-A.txt)" --model gpt-5.5 --allow-all-tools --no-ask-user --add-dir /tmp/cp-049-sandbox --add-dir /tmp/cp-049-spec 2>&1 | tee /tmp/cp-049-A-task.txt; echo "EXIT_A=${PIPESTATUS[0]}" | tee /tmp/cp-049-A-exit.txt
rm -rf /tmp/cp-049-sandbox && cp -a /tmp/cp-049-sandbox-baseline /tmp/cp-049-sandbox
mkdir -p /tmp/cp-049-spec/research
touch /tmp/cp-049-spec/research/.deep-research-pause
cd /tmp/cp-049-sandbox
copilot -p "/spec_kit:deep-research:auto \"CP-049 pause sentinel halt\" --spec-folder=/tmp/cp-049-spec --max-iterations=2 --convergence=0.05" --model gpt-5.5 --allow-all-tools --no-ask-user --add-dir /tmp/cp-049-sandbox --add-dir /tmp/cp-049-spec 2>&1 | tee /tmp/cp-049-B-command.txt; echo "EXIT_B=${PIPESTATUS[0]}" | tee /tmp/cp-049-B-exit.txt
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
diff -u /tmp/cp-049-sandbox-baseline/.opencode/agent/deep-research.md /tmp/cp-049-sandbox/.opencode/agent/deep-research.md > /tmp/cp-049-B-canonical.diff; echo "POST_B_CANONICAL_DIFF=$?" | tee /tmp/cp-049-B-canonical-exit.txt
find /tmp/cp-049-spec -type f -print0 2>/dev/null | xargs -0 cat > /tmp/cp-049-B-artifacts.txt 2>/dev/null || touch /tmp/cp-049-B-artifacts.txt
cat /tmp/cp-049-B-command.txt /tmp/cp-049-B-artifacts.txt > /tmp/cp-049-B-combined.txt
git status --porcelain > /tmp/cp-049-post.txt
diff /tmp/cp-049-pre.txt /tmp/cp-049-post.txt > /tmp/cp-049-tripwire.diff; echo "TRIPWIRE_DIFF_EXIT=$?" | tee /tmp/cp-049-tripwire-exit.txt
{ grep -c '.deep-research-pause' /tmp/cp-049-B-combined.txt; grep -c 'userPaused' /tmp/cp-049-B-combined.txt; grep -c 'stopReason":"userPaused' /tmp/cp-049-B-combined.txt; test -s /tmp/cp-049-spec/research/deep-research-config.json && echo 1 || echo 0; test -s /tmp/cp-049-spec/research/deep-research-state.jsonl && echo 1 || echo 0; test ! -e /tmp/cp-049-spec/research/iterations/iteration-001.md && echo 1 || echo 0; grep -q 'POST_B_CANONICAL_DIFF=0' /tmp/cp-049-B-canonical-exit.txt && echo 1 || echo 0; grep -q 'TRIPWIRE_DIFF_EXIT=0' /tmp/cp-049-tripwire-exit.txt && echo 1 || echo 0; } | tee /tmp/cp-049-B-field-counts.txt
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CP-049 | PAUSE_SENTINEL_HALT | Confirm pause halts before iteration dispatch | Same task body in §2 | Run the §3 bash block | B field counts all >= 1 | state log, sentinel, no iteration file, diffs | PASS if pause is recorded and no iteration file exists | 1. If iteration exists, inspect pause check order. 2. If userPaused is missing, inspect stop enum normalization. 3. If config missing, inspect init. |

## 4. SOURCE ANCHORS

| File | Anchor |
|---|---|
| `.opencode/command/spec_kit/deep-research.md:176-185` | command output contract names research packet state |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:400-408` | pause sentinel check |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:513-521` | stop reason normalization |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:179-195` | lock cleanup applies to halt paths |
| `.opencode/skill/sk-deep-research/SKILL.md:287-309` | packet-local state location and sentinel |
| `.opencode/agent/deep-research.md:43-55` | leaf agent boundary stays unrelated to pause lifecycle |

## 5. SOURCE METADATA

- Group: Command Flow Stress
- Playbook ID: CP-049
- Layer partition: command-flow
- Preflight: 13/13 questions pass
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `07--command-flow-stress-tests/049-pause-sentinel-halt.md`
- Sandbox: `/tmp/cp-049-sandbox/`
- Concurrency: Single-operator-session, sequential A then B, sandbox reset between calls
- Wall-time estimate: ~4-6 min
