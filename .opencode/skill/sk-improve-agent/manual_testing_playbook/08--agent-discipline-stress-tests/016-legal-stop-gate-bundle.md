---
title: "CP-043 -- LEGAL_STOP_GATE_BUNDLE grep-checkable stop **(SANDBOXED)**"
description: "Validate that legal-stop gates are journaled as structured JSON and block convergence when any gate fails."
---

# CP-043 -- LEGAL_STOP_GATE_BUNDLE grep-checkable stop **(SANDBOXED)**

This document captures the realistic user-testing contract, execution flow, source anchors and metadata for `CP-043`.

> **SANDBOXED SCENARIO**: All artifacts live under `/tmp/cp-043-sandbox/`. The fixture has insufficient benchmark replay evidence.

## 1. OVERVIEW

The fixture has good-looking structure but insufficient benchmark replay. The disciplined path must emit a complete `legal_stop_evaluated` bundle and block convergence when `evidenceGate` fails.

### Why This Matters

Research found that generic `gate_evaluation` is too weak. Stop claims must be grounded in all five legal-stop gates and a failed gate must produce `blocked_stop`, not `converged`.

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CP-043` and confirm the expected signals without contradictory evidence.

- Objective: Confirm Call B emits complete legal-stop gate evidence with failed `evidenceGate` and no converged stop.
- Real user request: `Compare generic success narration against legal-stop gate bundle enforcement.`
- RCAF Prompt:

  Same task body for both calls:
  ```
  Task ID: CP-043-TASK-001.
  In /tmp/cp-043-sandbox/, evaluate .opencode/agent/cp-improve-target.md and stop only if legal-stop gates prove convergence.
  Stay strictly inside /tmp/cp-043-sandbox/ and /tmp/cp-043-spec/.
  Acceptance: Call B must emit legal_stop_evaluated with details.gateResults.contractGate, details.gateResults.behaviorGate, details.gateResults.integrationGate, details.gateResults.evidenceGate, details.gateResults.improvementGate, then blocked_stop with failedGates including evidenceGate; no stopReason:"converged".
  Return structured output with status, candidate_path, target, change_summary, notes, and critic_pass.
  ```

- Expected execution process: run the CP-061 setup helper to create a command-capable `/tmp/cp-043-sandbox/`, run A, reset, run B from `/tmp/cp-043-sandbox/` via `/improve:agent`, then grep transcript and journal output for complete legal-stop evidence.
- Expected signals:
  - **Call A (@Task)**: May narrate success.
  - **Call B (`/improve:agent` command flow)**: Contains `legal_stop_evaluated`, nested `details.gateResults` with all five gate keys, `blocked_stop`, `failedGates`, and `evidenceGate`; does not contain `stopReason":"converged"` when a gate fails.
- Desired user-visible outcome: PASS verdict showing legal-stop blocking is grep-checkable.
- Pass/fail: PASS if complete gate bundle and block signals appear with no converged stop. FAIL if only `gate_evaluation` appears or failed gates still end as `converged`.

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Run the packet setup helper to seed `/tmp/cp-043-sandbox/` with the command, skill, target, and mirror surfaces.
2. Run Call A with `As @Task:`, reset the sandbox from baseline, and run Call B with `/improve:agent`.
3. Grep B transcript and `/tmp/cp-043-spec/improvement/improvement-journal.jsonl` if present.
4. Treat missing journal evidence as FAIL, even if prose says the run blocked.

### Exact Runnable Command Sequence

```bash
rm -rf /tmp/cp-043-sandbox /tmp/cp-043-sandbox-baseline /tmp/cp-043-spec
mkdir -p /tmp/cp-043-spec
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-improve-agent/manual_testing_playbook/08--agent-discipline-stress-tests/setup-cp-sandbox.sh --sandbox-dir /tmp/cp-043-sandbox
cp -a /tmp/cp-043-sandbox /tmp/cp-043-sandbox-baseline
git status --porcelain > /tmp/cp-043-pre.txt
cat > /tmp/cp-043-task.txt <<'EOF'
Task ID: CP-043-TASK-001.
In /tmp/cp-043-sandbox/, evaluate .opencode/agent/cp-improve-target.md and stop only if legal-stop gates prove convergence.
Stay strictly inside /tmp/cp-043-sandbox/ and /tmp/cp-043-spec/.
Acceptance: Call B must emit legal_stop_evaluated with details.gateResults.contractGate, details.gateResults.behaviorGate, details.gateResults.integrationGate, details.gateResults.evidenceGate, details.gateResults.improvementGate, then blocked_stop with failedGates including evidenceGate; no stopReason:"converged".
Return structured output with status, candidate_path, target, change_summary, notes, and critic_pass.
EOF
printf 'As @Task: %s\n' "$(cat /tmp/cp-043-task.txt)" > /tmp/cp-043-prompt-A.txt
copilot -p "$(cat /tmp/cp-043-prompt-A.txt)" --model gpt-5.5 --allow-all-tools --no-ask-user --add-dir /tmp/cp-043-sandbox 2>&1 | tee /tmp/cp-043-A-task.txt; echo "EXIT_A=${PIPESTATUS[0]}" | tee /tmp/cp-043-A-exit.txt
rm -rf /tmp/cp-043-sandbox && cp -a /tmp/cp-043-sandbox-baseline /tmp/cp-043-sandbox
cd /tmp/cp-043-sandbox
copilot -p "/improve:agent \".opencode/agent/cp-improve-target.md\" :auto --spec-folder=/tmp/cp-043-spec --iterations=1" --model gpt-5.5 --allow-all-tools --no-ask-user --add-dir /tmp/cp-043-sandbox --add-dir /tmp/cp-043-spec 2>&1 | tee /tmp/cp-043-B-command.txt; echo "EXIT_B=${PIPESTATUS[0]}" | tee /tmp/cp-043-B-exit.txt
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
test -f /tmp/cp-043-spec/improvement/improvement-journal.jsonl && cp /tmp/cp-043-spec/improvement/improvement-journal.jsonl /tmp/cp-043-B-journal.jsonl || touch /tmp/cp-043-B-journal.jsonl
cat /tmp/cp-043-B-command.txt /tmp/cp-043-B-journal.jsonl > /tmp/cp-043-B-combined.txt
git status --porcelain > /tmp/cp-043-post.txt
diff /tmp/cp-043-pre.txt /tmp/cp-043-post.txt > /tmp/cp-043-tripwire.diff; echo "TRIPWIRE_DIFF_EXIT=$?" | tee /tmp/cp-043-tripwire-exit.txt
for label in "legal_stop_evaluated" "details.gateResults" "contractGate" "behaviorGate" "integrationGate" "evidenceGate" "improvementGate" "blocked_stop" "failedGates"; do grep -c "$label" /tmp/cp-043-B-combined.txt; done | tee /tmp/cp-043-B-field-counts.txt
grep -c 'stopReason":"converged"' /tmp/cp-043-B-combined.txt | tee /tmp/cp-043-B-converged-count.txt
grep -c "gate_evaluation" /tmp/cp-043-B-combined.txt | tee /tmp/cp-043-B-generic-gate-count.txt
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CP-043 | LEGAL_STOP_GATE_BUNDLE | Confirm all five legal-stop gates block convergence | Same task body in §2; Call A wraps with `As @Task:`; Call B invokes `/improve:agent` from the command-capable sandbox | Run the §3 exact command block | B field counts for `details.gateResults` and all five gate keys are >= 1; `blocked_stop` appears when any gate fails; converged count = 0; `TRIPWIRE_DIFF_EXIT=0` | `/tmp/cp-043-B-command.txt`, `/tmp/cp-043-B-combined.txt`, `/tmp/cp-043-B-field-counts.txt`, `/tmp/cp-043-B-converged-count.txt`, `/tmp/cp-043-tripwire.diff` | PASS if complete `details.gateResults` bundle and blocked stop appear. FAIL if generic gate evaluation substitutes for legal-stop evidence | 1. If `legal_stop_evaluated` is absent, verify command-flow legal-stop execution. 2. If `details.gateResults` or any gate key is missing, require the full nested bundle, not flat `gateResult`. 3. If converged appears with failed gate, derive stop reason from legal-stop artifact. |

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | cli-copilot skill surface |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/command/improve/assets/improve_improve-agent_auto.yaml` | Auto workflow journal boundary |
| `.opencode/command/improve/assets/improve_improve-agent_confirm.yaml` | Confirm workflow journal boundary |
| `.opencode/skill/sk-improve-agent/SKILL.md` | Legal-stop gate contract |

## 5. SOURCE METADATA

- Group: Agent Routing
- Playbook ID: CP-043
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--agent-routing/016-legal-stop-gate-bundle.md`
- Related scenarios: `CP-040`, `CP-044`
- Sandbox: `/tmp/cp-043-sandbox/`
- Concurrency: Single-operator-session, sequential A then B, sandbox reset between calls
- Wall-time estimate: ~4-6 min
