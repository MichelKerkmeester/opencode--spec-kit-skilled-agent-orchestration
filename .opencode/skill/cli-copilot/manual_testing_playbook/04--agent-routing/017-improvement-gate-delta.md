---
title: "CP-044 -- IMPROVEMENT_GATE_DELTA acceptable is not better **(SANDBOXED)**"
description: "Validate that candidate-acceptable absolute score does not satisfy improvementGate without baseline delta."
---

# CP-044 -- IMPROVEMENT_GATE_DELTA acceptable is not better **(SANDBOXED)**

This document captures the realistic user-testing contract, execution flow, source anchors and metadata for `CP-044`.

> **SANDBOXED SCENARIO**: All artifacts live under `/tmp/cp-044-sandbox/`. The fixture encodes baseline 88, candidate bait 89, and threshold delta 2.

## 1. OVERVIEW

The baseline is already strong. A candidate can be `candidate-acceptable` by absolute score while still failing the better-than-baseline threshold. Call B must require `baselineScore`, numeric `delta`, and `thresholdDelta`.

### Why This Matters

Research found that `score-candidate.cjs` accepted `--baseline` in YAML but ignored it, so `improvementGate` could not be proven. Promotion requires comparative improvement, not only an acceptable absolute score.

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CP-044` and confirm the expected signals without contradictory evidence.

- Objective: Confirm Call B emits baseline/current comparison evidence and blocks promotion when delta is below threshold.
- Real user request: `Compare generic quality narration against numeric improvement-gate evidence.`
- RCAF Prompt:

  Same task body for both calls:
  ```
  Task ID: CP-044-TASK-001.
  In /tmp/cp-044-sandbox/, evaluate whether the candidate for .opencode/agent/cp-improve-target.md is better than baseline.
  Stay strictly inside /tmp/cp-044-sandbox/ and /tmp/cp-044-spec/.
  Acceptance: Call B must emit baselineScore, score, delta, thresholdDelta, recommendation:"keep-baseline" or candidate-acceptable, details.gateResults.improvementGate failed/false, blocked_stop, and no promotion or converged stop.
  Return structured output with status, candidate_path, target, change_summary, notes, and critic_pass.
  ```

- Expected execution process: seed fixture, run A, reset, run B, then grep score JSON, transcript, and legal-stop output.
- Expected signals:
  - **Call A (@Task)**: May call the candidate better narratively.
  - **Call B (@improve-agent)**: Contains `baselineScore`, `delta`, `thresholdDelta`, `candidate-acceptable` or `keep-baseline`, nested `details.gateResults.improvementGate` failed/false evidence, and `blocked_stop`; no promotion and no `converged`.
- Desired user-visible outcome: PASS verdict showing `candidate-acceptable` is not enough for `improvementGate`.
- Pass/fail: PASS if comparison evidence exists and below-threshold delta blocks convergence/promotion. FAIL if acceptable absolute score is treated as promotion-ready.

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Seed `/tmp/cp-044-sandbox/` from the 060 fixture.
2. Run A/B with sandbox reset.
3. Grep B transcript plus `/tmp/cp-044-spec/improvement/**` score and journal artifacts.
4. Treat missing `delta` as FAIL.

### Exact Runnable Command Sequence

```bash
rm -rf /tmp/cp-044-sandbox /tmp/cp-044-sandbox-baseline /tmp/cp-044-spec
mkdir -p /tmp/cp-044-sandbox
cp -a .opencode/skill/sk-improve-agent/test-fixtures/060-stress-test/. /tmp/cp-044-sandbox/
cp -a /tmp/cp-044-sandbox /tmp/cp-044-sandbox-baseline
git status --porcelain > /tmp/cp-044-pre.txt
cat > /tmp/cp-044-task.txt <<'EOF'
Task ID: CP-044-TASK-001.
In /tmp/cp-044-sandbox/, evaluate whether the candidate for .opencode/agent/cp-improve-target.md is better than baseline.
Stay strictly inside /tmp/cp-044-sandbox/ and /tmp/cp-044-spec/.
Acceptance: Call B must emit baselineScore, score, delta, thresholdDelta, recommendation:"keep-baseline" or candidate-acceptable, details.gateResults.improvementGate failed/false, blocked_stop, and no promotion or converged stop.
Return structured output with status, candidate_path, target, change_summary, notes, and critic_pass.
EOF
printf 'As @Task: %s\n' "$(cat /tmp/cp-044-task.txt)" > /tmp/cp-044-prompt-A.txt
{ printf 'You are operating as @improve-agent, defined by the agent file below. Treat its frontmatter and body as authoritative.\n\n'; cat .opencode/agent/improve-agent.md; printf '\n---\n\nDepth: 1\n\nDispatch task:\n'; cat /tmp/cp-044-task.txt; } > /tmp/cp-044-prompt-B.txt
copilot -p "$(cat /tmp/cp-044-prompt-A.txt)" --model gpt-5.5 --allow-all-tools --no-ask-user --add-dir /tmp/cp-044-sandbox 2>&1 | tee /tmp/cp-044-A-task.txt; echo "EXIT_A=${PIPESTATUS[0]}" | tee /tmp/cp-044-A-exit.txt
rm -rf /tmp/cp-044-sandbox && cp -a /tmp/cp-044-sandbox-baseline /tmp/cp-044-sandbox
copilot -p "$(cat /tmp/cp-044-prompt-B.txt)" --model gpt-5.5 --allow-all-tools --no-ask-user --add-dir /tmp/cp-044-sandbox 2>&1 | tee /tmp/cp-044-B-improve-agent.txt; echo "EXIT_B=${PIPESTATUS[0]}" | tee /tmp/cp-044-B-exit.txt
find /tmp/cp-044-spec -type f \( -name '*.json' -o -name '*.jsonl' -o -name '*.md' \) -print0 2>/dev/null | xargs -0 cat > /tmp/cp-044-B-artifacts.txt 2>/dev/null || touch /tmp/cp-044-B-artifacts.txt
cat /tmp/cp-044-B-improve-agent.txt /tmp/cp-044-B-artifacts.txt > /tmp/cp-044-B-combined.txt
git status --porcelain > /tmp/cp-044-post.txt
diff /tmp/cp-044-pre.txt /tmp/cp-044-post.txt > /tmp/cp-044-tripwire.diff; echo "TRIPWIRE_DIFF_EXIT=$?" | tee /tmp/cp-044-tripwire-exit.txt
for label in "baselineScore" "delta" "thresholdDelta" "candidate-acceptable" "keep-baseline" "details.gateResults" "improvementGate" "failed" "blocked_stop"; do grep -c "$label" /tmp/cp-044-B-combined.txt; done | tee /tmp/cp-044-B-field-counts.txt
grep -Ec 'promoted|stopReason":"converged"' /tmp/cp-044-B-combined.txt | tee /tmp/cp-044-B-promotion-or-converged-count.txt
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CP-044 | IMPROVEMENT_GATE_DELTA | Confirm acceptable absolute score does not pass improvementGate | Same task body in §2; Call A wraps with `As @Task:`; Call B prepends `.opencode/agent/improve-agent.md` + `Depth: 1` | Run the §3 exact command block | B comparison labels and nested `details.gateResults.improvementGate` evidence present; promotion/converged count = 0; `TRIPWIRE_DIFF_EXIT=0` | `/tmp/cp-044-B-combined.txt`, `/tmp/cp-044-B-field-counts.txt`, `/tmp/cp-044-B-promotion-or-converged-count.txt`, `/tmp/cp-044-tripwire.diff` | PASS if delta evidence blocks promotion. FAIL if candidate-acceptable is promotion-ready without threshold delta | 1. If `delta` is missing, implement baseline scoring. 2. If promotion appears, split acceptable from better. 3. If nested `improvementGate` passes below threshold, fix legal-stop evaluation. |

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | cli-copilot skill surface |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/sk-improve-agent/scripts/score-candidate.cjs` | Baseline/current score comparison |
| `.opencode/command/improve/assets/improve_improve-agent_auto.yaml` | Workflow score invocation |
| `.opencode/skill/sk-improve-agent/SKILL.md` | Improvement gate contract |

## 5. SOURCE METADATA

- Group: Agent Routing
- Playbook ID: CP-044
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--agent-routing/017-improvement-gate-delta.md`
- Related scenarios: `CP-043`
- Sandbox: `/tmp/cp-044-sandbox/`
- Concurrency: Single-operator-session, sequential A then B, sandbox reset between calls
- Wall-time estimate: ~4-6 min
