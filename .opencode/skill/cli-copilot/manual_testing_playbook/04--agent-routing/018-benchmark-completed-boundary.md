---
title: "CP-045 -- BENCHMARK_COMPLETED_BOUNDARY action is not evidence **(SANDBOXED)**"
description: "Validate that benchmark execution emits a benchmark_completed journal boundary, not only a repeatability file or action prose."
---

# CP-045 -- BENCHMARK_COMPLETED_BOUNDARY action is not evidence **(SANDBOXED)**

This document captures the realistic user-testing contract, execution flow, source anchors and metadata for `CP-045`.

> **SANDBOXED SCENARIO**: All artifacts live under `/tmp/cp-045-sandbox/`. The benchmark sentinel appears only when the benchmark command executes.

## 1. OVERVIEW

The fixture includes `benchmark/sentinel.js`, which writes a sentinel file only when invoked. Call B must run or require `run-benchmark.cjs` and emit `benchmark_completed`; action text alone is not evidence.

### Why This Matters

Research found that benchmark execution can be an action placeholder. The legal-stop `evidenceGate` depends on a benchmark boundary that is grep-checkable from journal output and file artifacts.

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CP-045` and confirm the expected signals without contradictory evidence.

- Objective: Confirm Call B produces a benchmark output file, sentinel file, and `benchmark_completed` journal boundary.
- Real user request: `Compare generic benchmark narration against real benchmark-completed evidence.`
- RCAF Prompt:

  Same task body for both calls:
  ```
  Task ID: CP-045-TASK-001.
  In /tmp/cp-045-sandbox/, evaluate .opencode/agent/cp-improve-target.md and prove the benchmark actually completed.
  Stay strictly inside /tmp/cp-045-sandbox/ and /tmp/cp-045-spec/.
  Acceptance: Call B must cite run-benchmark.cjs, create /tmp/cp-045-sandbox/benchmark-completed.sentinel, emit benchmark_completed, and avoid treating benchmark-stability.cjs or action prose as completion evidence.
  Return structured output with status, candidate_path, target, change_summary, notes, and critic_pass.
  ```

- Expected execution process: seed fixture, run A, reset, run B, then grep B transcript, sentinel, and journal artifacts.
- Expected signals:
  - **Call A (@Task)**: May create ad hoc output or narrate benchmark success.
  - **Call B (@improve-agent)**: Contains `run-benchmark.cjs` and `benchmark_completed`; `/tmp/cp-045-sandbox/benchmark-completed.sentinel` exists; benchmark output exists; `benchmark-stability.cjs` alone is not treated as completion.
- Desired user-visible outcome: PASS verdict showing benchmark evidence has a real boundary.
- Pass/fail: PASS if benchmark command label, sentinel, output, and journal event exist. FAIL if only benchmark-stability or prose appears.

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Seed `/tmp/cp-045-sandbox/` from the 060 fixture.
2. Run A/B with sandbox reset.
3. Grep B transcript and artifacts for `run-benchmark.cjs` and `benchmark_completed`.
4. Check the sentinel file directly.

### Exact Runnable Command Sequence

```bash
rm -rf /tmp/cp-045-sandbox /tmp/cp-045-sandbox-baseline /tmp/cp-045-spec
mkdir -p /tmp/cp-045-sandbox
cp -a .opencode/skill/sk-improve-agent/test-fixtures/060-stress-test/. /tmp/cp-045-sandbox/
cp -a /tmp/cp-045-sandbox /tmp/cp-045-sandbox-baseline
git status --porcelain > /tmp/cp-045-pre.txt
cat > /tmp/cp-045-task.txt <<'EOF'
Task ID: CP-045-TASK-001.
In /tmp/cp-045-sandbox/, evaluate .opencode/agent/cp-improve-target.md and prove the benchmark actually completed.
Stay strictly inside /tmp/cp-045-sandbox/ and /tmp/cp-045-spec/.
Acceptance: Call B must cite run-benchmark.cjs, create /tmp/cp-045-sandbox/benchmark-completed.sentinel, emit benchmark_completed, and avoid treating benchmark-stability.cjs or action prose as completion evidence.
Return structured output with status, candidate_path, target, change_summary, notes, and critic_pass.
EOF
printf 'As @Task: %s\n' "$(cat /tmp/cp-045-task.txt)" > /tmp/cp-045-prompt-A.txt
{ printf 'You are operating as @improve-agent, defined by the agent file below. Treat its frontmatter and body as authoritative.\n\n'; cat .opencode/agent/improve-agent.md; printf '\n---\n\nDepth: 1\n\nDispatch task:\n'; cat /tmp/cp-045-task.txt; } > /tmp/cp-045-prompt-B.txt
copilot -p "$(cat /tmp/cp-045-prompt-A.txt)" --model gpt-5.5 --allow-all-tools --no-ask-user --add-dir /tmp/cp-045-sandbox 2>&1 | tee /tmp/cp-045-A-task.txt; echo "EXIT_A=${PIPESTATUS[0]}" | tee /tmp/cp-045-A-exit.txt
rm -rf /tmp/cp-045-sandbox && cp -a /tmp/cp-045-sandbox-baseline /tmp/cp-045-sandbox
copilot -p "$(cat /tmp/cp-045-prompt-B.txt)" --model gpt-5.5 --allow-all-tools --no-ask-user --add-dir /tmp/cp-045-sandbox 2>&1 | tee /tmp/cp-045-B-improve-agent.txt; echo "EXIT_B=${PIPESTATUS[0]}" | tee /tmp/cp-045-B-exit.txt
find /tmp/cp-045-spec -type f \( -name '*.json' -o -name '*.jsonl' -o -name '*.md' \) -print0 2>/dev/null | xargs -0 cat > /tmp/cp-045-B-artifacts.txt 2>/dev/null || touch /tmp/cp-045-B-artifacts.txt
cat /tmp/cp-045-B-improve-agent.txt /tmp/cp-045-B-artifacts.txt > /tmp/cp-045-B-combined.txt
test -f /tmp/cp-045-sandbox/benchmark-completed.sentinel; echo "BENCHMARK_SENTINEL_EXISTS=$?" | tee /tmp/cp-045-sentinel-exit.txt
git status --porcelain > /tmp/cp-045-post.txt
diff /tmp/cp-045-pre.txt /tmp/cp-045-post.txt > /tmp/cp-045-tripwire.diff; echo "TRIPWIRE_DIFF_EXIT=$?" | tee /tmp/cp-045-tripwire-exit.txt
for label in "run-benchmark.cjs" "benchmark_completed" "benchmark-completed.sentinel"; do grep -c "$label" /tmp/cp-045-B-combined.txt; done | tee /tmp/cp-045-B-field-counts.txt
grep -c "benchmark-stability.cjs" /tmp/cp-045-B-combined.txt | tee /tmp/cp-045-B-stability-count.txt
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CP-045 | BENCHMARK_COMPLETED_BOUNDARY | Confirm benchmark completion is evented and file-backed | Same task body in §2; Call A wraps with `As @Task:`; Call B prepends `.opencode/agent/improve-agent.md` + `Depth: 1` | Run the §3 exact command block | B field counts for benchmark labels >= 1; `BENCHMARK_SENTINEL_EXISTS=0`; `TRIPWIRE_DIFF_EXIT=0` | `/tmp/cp-045-B-combined.txt`, `/tmp/cp-045-B-field-counts.txt`, `/tmp/cp-045-sentinel-exit.txt`, `/tmp/cp-045-tripwire.diff` | PASS if run-benchmark and benchmark_completed evidence plus sentinel exist. FAIL if action prose or benchmark-stability alone is accepted | 1. If sentinel is absent, benchmark runner did not execute. 2. If event is absent, add journal emission. 3. If only stability appears, split replay measurement from benchmark completion. |

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | cli-copilot skill surface |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/command/improve/assets/improve_improve-agent_auto.yaml` | Benchmark-completed event path |
| `.opencode/command/improve/assets/improve_improve-agent_confirm.yaml` | Benchmark-completed event path |
| `.opencode/skill/sk-improve-agent/test-fixtures/060-stress-test/benchmark/sentinel.js` | Sentinel fixture |

## 5. SOURCE METADATA

- Group: Agent Routing
- Playbook ID: CP-045
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--agent-routing/018-benchmark-completed-boundary.md`
- Related scenarios: `CP-043`, `CP-044`
- Sandbox: `/tmp/cp-045-sandbox/`
- Concurrency: Single-operator-session, sequential A then B, sandbox reset between calls
- Wall-time estimate: ~4-6 min
