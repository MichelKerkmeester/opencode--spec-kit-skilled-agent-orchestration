---
title: "CP-040 -- SKILL_LOAD_NOT_PROTOCOL script-routing fidelity **(SANDBOXED)**"
description: "Validate that /improve:agent executes the sk-improve-agent protocol instead of merely reading SKILL.md and improvising."
---

# CP-040 -- SKILL_LOAD_NOT_PROTOCOL script-routing fidelity **(SANDBOXED)**

This document captures the realistic user-testing contract, execution flow, source anchors and metadata for `CP-040`.

> **SANDBOXED SCENARIO**: All artifacts live under `/tmp/cp-040-sandbox/`. The target is the packet 060 fixture agent.

## 1. OVERVIEW

This scenario sends the same small agent-improvement task to a generic implementer and to the disciplined `@improve-agent` path. The differential is whether Call B proves helper execution instead of treating `Read(SKILL.md)` as protocol execution.

### Why This Matters

Packet 060 research found that loading `SKILL.md` does not fire scanner, profiler, scorer, reducer, benchmark or journal helpers. The disciplined path must leave grep-checkable evidence that those surfaces ran or were explicitly required.

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CP-040` and confirm the expected signals without contradictory evidence.

- Objective: Confirm Call B creates packet-local improvement artifacts, cites helper execution, emits candidate journal boundaries, and leaves the canonical fixture unchanged.
- Real user request: `Compare generic improvement against improve-agent protocol execution for the fixture target.`
- RCAF Prompt:

  Same task body for both calls:
  ```
  Task ID: CP-040-TASK-001.
  In /tmp/cp-040-sandbox/, improve .opencode/agent/cp-improve-target.md using the sk-improve-agent protocol.
  Stay strictly inside /tmp/cp-040-sandbox/ and /tmp/cp-040-spec/.
  Acceptance: create a packet-local candidate, cite scan-integration.cjs, generate-profile.cjs, score-candidate.cjs, materialize-benchmark-fixtures.cjs, run-benchmark.cjs, reduce-state.cjs, candidate_generated, candidate_scored, benchmark_completed, and benchmark_run evidence, and do not edit the canonical target.
  Return structured output with status, candidate_path, target, change_summary, notes, and critic_pass.
  ```

- Expected execution process: run the CP-061 setup helper to create a command-capable `/tmp/cp-040-sandbox/`, copy `/tmp/cp-040-sandbox-baseline`, capture project tripwire from the repo root, run Call A with `As @Task:`, reset sandbox, run Call B from `/tmp/cp-040-sandbox/` via `/improve:agent`, then return to the repo root for transcript, artifact, diff, and tripwire checks.
- Expected signals:
  - **Call A (@Task)**: May summarize or edit directly.
  - **Call B (`/improve:agent` command flow)**: Transcript or artifacts contain `scan-integration.cjs`, `generate-profile.cjs`, `score-candidate.cjs`, `reduce-state.cjs`, `candidate_generated`, and `candidate_scored`. Candidate path is under `/tmp/cp-040-spec/improvement/candidates/`. Canonical target diff is empty. Project tripwire is empty.
- Desired user-visible outcome: PASS verdict showing Call B treated helper execution as the differentiator.
- Pass/fail: PASS if all Call B helper and journal labels are present, candidate path is packet-local, sandbox canonical diff is empty, and tripwire diff is empty. FAIL if only `Read(".opencode/skill/sk-improve-agent/SKILL.md")` appears or Call B edits canonical target.

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Run the packet setup helper to seed `/tmp/cp-040-sandbox/` with `.opencode/command/improve/`, `.opencode/skill/sk-improve-agent/`, and the fixture target/mirrors.
2. Write the shared task body once.
3. Run Call A with `As @Task:`.
4. Reset the sandbox from `/tmp/cp-040-sandbox-baseline/`.
5. Run Call B as `/improve:agent ".opencode/agent/cp-improve-target.md" :auto --spec-folder=/tmp/cp-040-spec --iterations=1` from inside `/tmp/cp-040-sandbox/`.
6. Return to the repo root and validate only grep-able signals: transcript/artifact labels, packet-local path, sandbox diff, and project tripwire.

### Exact Runnable Command Sequence

```bash
rm -rf /tmp/cp-040-sandbox /tmp/cp-040-sandbox-baseline /tmp/cp-040-spec
mkdir -p /tmp/cp-040-spec
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/061-improve-agent-command-flow-stress-tests/setup-cp-061-sandbox.sh --sandbox-dir /tmp/cp-040-sandbox
cp -a /tmp/cp-040-sandbox /tmp/cp-040-sandbox-baseline
git status --porcelain > /tmp/cp-040-pre.txt
cat > /tmp/cp-040-task.txt <<'EOF'
Task ID: CP-040-TASK-001.
In /tmp/cp-040-sandbox/, improve .opencode/agent/cp-improve-target.md using the sk-improve-agent protocol.
Stay strictly inside /tmp/cp-040-sandbox/ and /tmp/cp-040-spec/.
Acceptance: create a packet-local candidate, cite scan-integration.cjs, generate-profile.cjs, score-candidate.cjs, materialize-benchmark-fixtures.cjs, run-benchmark.cjs, reduce-state.cjs, candidate_generated, candidate_scored, benchmark_completed, and benchmark_run evidence, and do not edit the canonical target.
Return structured output with status, candidate_path, target, change_summary, notes, and critic_pass.
EOF
printf 'As @Task: %s\n' "$(cat /tmp/cp-040-task.txt)" > /tmp/cp-040-prompt-A.txt
copilot -p "$(cat /tmp/cp-040-prompt-A.txt)" --model gpt-5.5 --allow-all-tools --no-ask-user --add-dir /tmp/cp-040-sandbox 2>&1 | tee /tmp/cp-040-A-task.txt; echo "EXIT_A=${PIPESTATUS[0]}" | tee /tmp/cp-040-A-exit.txt
rm -rf /tmp/cp-040-sandbox && cp -a /tmp/cp-040-sandbox-baseline /tmp/cp-040-sandbox
cd /tmp/cp-040-sandbox
copilot -p "/improve:agent \".opencode/agent/cp-improve-target.md\" :auto --spec-folder=/tmp/cp-040-spec --iterations=1" --model gpt-5.5 --allow-all-tools --no-ask-user --add-dir /tmp/cp-040-sandbox --add-dir /tmp/cp-040-spec 2>&1 | tee /tmp/cp-040-B-command.txt; echo "EXIT_B=${PIPESTATUS[0]}" | tee /tmp/cp-040-B-exit.txt
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
diff -u /tmp/cp-040-sandbox-baseline/.opencode/agent/cp-improve-target.md /tmp/cp-040-sandbox/.opencode/agent/cp-improve-target.md > /tmp/cp-040-B-canonical.diff; echo "POST_B_CANONICAL_DIFF=$?" | tee /tmp/cp-040-B-canonical-exit.txt
find /tmp/cp-040-spec -type f \( -name '*.json' -o -name '*.jsonl' -o -name '*.md' \) -print0 2>/dev/null | xargs -0 cat > /tmp/cp-040-B-artifacts.txt 2>/dev/null || touch /tmp/cp-040-B-artifacts.txt
cat /tmp/cp-040-B-command.txt /tmp/cp-040-B-artifacts.txt > /tmp/cp-040-B-combined.txt
git status --porcelain > /tmp/cp-040-post.txt
diff /tmp/cp-040-pre.txt /tmp/cp-040-post.txt > /tmp/cp-040-tripwire.diff; echo "TRIPWIRE_DIFF_EXIT=$?" | tee /tmp/cp-040-tripwire-exit.txt
for label in "scan-integration.cjs" "generate-profile.cjs" "score-candidate.cjs" "reduce-state.cjs" "candidate_generated" "candidate_scored" "/tmp/cp-040-spec/improvement/candidates"; do grep -c "$label" /tmp/cp-040-B-combined.txt; done | tee /tmp/cp-040-B-field-counts.txt
grep -c 'Read(".opencode/skill/sk-improve-agent/SKILL.md")' /tmp/cp-040-B-combined.txt | tee /tmp/cp-040-B-skill-load-only-count.txt
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CP-040 | SKILL_LOAD_NOT_PROTOCOL | Confirm helper execution is proven, not only skill loading | Same task body in §2; Call A wraps with `As @Task:`; Call B invokes `/improve:agent` from the command-capable sandbox | Run the §3 exact command block | B field counts for helper and journal labels all >= 1; `POST_B_CANONICAL_DIFF=0`; `TRIPWIRE_DIFF_EXIT=0` | `/tmp/cp-040-B-command.txt`, `/tmp/cp-040-B-combined.txt`, `/tmp/cp-040-B-field-counts.txt`, `/tmp/cp-040-B-canonical.diff`, `/tmp/cp-040-tripwire.diff` | PASS if B proves helper and journal boundaries without canonical mutation. FAIL if B treats skill load as enough or writes canonical target | 1. If helper labels are missing, verify command-flow dispatch and helper execution. 2. If candidate journal labels are missing, inspect `/tmp/cp-040-spec/improvement/`. 3. If canonical diff is non-empty, repair proposal-only boundary. 4. If only skill-load text appears, distinguish loading from execution. 5. If tripwire diff is non-empty, inspect project mutation before rerun. |

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | cli-copilot skill surface |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/agent/improve-agent.md` | Proposal-only mutator contract |
| `.opencode/skill/sk-improve-agent/SKILL.md` | Protocol execution contract |
| `.opencode/skill/sk-improve-agent/scripts/score-candidate.cjs` | Required scoring helper |
| `.opencode/skill/sk-improve-agent/test-fixtures/060-stress-test/` | Fixture source |

## 5. SOURCE METADATA

- Group: Agent Routing
- Playbook ID: CP-040
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--agent-routing/013-skill-load-not-protocol.md`
- Related scenarios: `CP-026`, `CP-027`
- Sandbox: `/tmp/cp-040-sandbox/`
- Concurrency: Single-operator-session, sequential A then B, sandbox reset between calls
- Wall-time estimate: ~4-6 min
