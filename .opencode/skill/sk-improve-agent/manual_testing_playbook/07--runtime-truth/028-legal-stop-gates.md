---
title: "RT-028 -- Legal-Stop Gate Blocking"
description: "Manual validation scenario for RT-028: Legal-Stop Gate Blocking."
feature_id: "RT-028"
category: "Runtime Truth"
---

# RT-028 -- Legal-Stop Gate Blocking

This document captures the canonical manual-testing contract for `RT-028`.

---

## 1. OVERVIEW

This scenario validates that when convergence math signals stop but one or more of the 5 gate bundles fail, the session records a `blockedStop` rather than `converged`, and the blocked-stop event includes the failing gate details.

---

## 2. SCENARIO CONTRACT

- Objective: Validate Legal-Stop Gate Blocking for the journal, continuation, stop-gate, stability, and replay-consumer scenarios.
- Real user request: `` Validate that when convergence math signals stop but one or more of the 5 gate bundles fail, the session records a `blockedStop` rather than `converged`, and the blocked-stop event includes the failing gate details. ``
- RCAF Prompt: `` As a manual-testing orchestrator, validate that when convergence math signals stop but one or more of the 5 gate bundles fail, the session records a blockedStop rather than converged, and the blocked-stop event includes the failing gate details against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify `legal_stop_evaluated` event emitted with `details.gateResults` containing all 5 gate bundles. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence. ``
- Expected execution process: Run the improvement-journal helper against the documented disposable runtime state; capture stdout, stderr, exit code, and any generated files; then execute the verification block against the same run artifacts.
- Expected signals: `legal_stop_evaluated` event emitted with nested `details.gateResults` containing all 5 gate bundles; `contractGate`: structural >= 90 AND systemFitness >= 90; `behaviorGate`: ruleCoherence >= 85 AND outputQuality >= 85; `integrationGate`: integration >= 90 AND no drift ambiguity; `evidenceGate`: benchmark pass AND repeatability pass; `improvementGate`: weighted delta >= configured threshold; When any gate fails: `blocked_stop` event emitted with `failedGates[]` and `reason`; Session `stopReason` is `blockedStop` (not `converged`) when gates fail; The session continues iterating (does not prematurely terminate) when gates block convergence; If all 5 gates pass: `converged` stopReason is used instead
- Desired user-visible outcome: A concise operator-facing PASS/FAIL verdict with the decisive evidence from the command output and verification checks.
- Pass/fail: When convergence math would trigger stop but at least one gate bundle fails, the journal contains a `blocked_stop` event with the failing gate names, and the session's `stopReason` is `blockedStop` -- the session does NOT claim `converged`.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Confirm the working directory is the repository root.
2. Resolve any placeholders in the command sequence, especially `{spec}`, to disposable test paths.
3. Run the exact command sequence and capture stdout, stderr, exit code, and generated artifacts.
4. Run the verification block against the same artifacts from the same execution.
5. Compare observed output against the expected signals and pass/fail criteria.
6. Record the scenario verdict with the decisive evidence.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| RT-028 | Legal-Stop Gate Blocking | Validate Legal-Stop Gate Blocking | `` As a manual-testing orchestrator, validate that when convergence math signals stop but one or more of the 5 gate bundles fail, the session records a blockedStop rather than converged, and the blocked-stop event includes the failing gate details against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify `legal_stop_evaluated` event emitted with `details.gateResults` containing all 5 gate bundles. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence. `` | /improve:agent &quot;.opencode/agent/debug.md&quot; :confirm --spec-folder={spec} --iterations=5<br><br><br>Verification:<br><br><br>node .opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs --read {spec}/improvement/improvement-journal.jsonl &#124; python3 -c &quot;<br>import sys, json<br>events = json.load(sys.stdin)<br># Check for legal_stop_evaluated events<br>lse = [e for e in events if e[&#x27;eventType&#x27;] == &#x27;legal_stop_evaluated&#x27;]<br>blocked = [e for e in events if e[&#x27;eventType&#x27;] == &#x27;blocked_stop&#x27;]<br>GATES = [&#x27;contractGate&#x27;, &#x27;behaviorGate&#x27;, &#x27;integrationGate&#x27;, &#x27;evidenceGate&#x27;, &#x27;improvementGate&#x27;]<br>if lse:<br>    gates = lse[-1].get(&#x27;details&#x27;, {}).get(&#x27;gateResults&#x27;, {})<br>    present = [g for g in GATES if g in gates]<br>    print(f&#x27;legal_stop_evaluated found — gates present: {present}&#x27;)<br>if blocked:<br>    failed = blocked[-1].get(&#x27;details&#x27;, {}).get(&#x27;failedGates&#x27;, [])<br>    print(f&#x27;blocked_stop found — failed gates: {failed}&#x27;)<br>    print(&#x27;PASS — blockedStop recorded with failed gate details&#x27;)<br>else:<br>    ends = [e for e in events if e[&#x27;eventType&#x27;] in (&#x27;session_ended&#x27;, &#x27;session_end&#x27;)]<br>    if ends and ends[-1].get(&#x27;details&#x27;, {}).get(&#x27;stopReason&#x27;) == &#x27;converged&#x27;:<br>        print(&#x27;INFO — session converged (all gates passed), no blockedStop expected&#x27;)<br>    else:<br>        print(&#x27;INFO — no blocked_stop event found; may need scenario with intentional gate failure&#x27;)<br>&quot; | `legal_stop_evaluated` event emitted with nested `details.gateResults` containing all 5 gate bundles; `contractGate`: structural >= 90 AND systemFitness >= 90; `behaviorGate`: ruleCoherence >= 85 AND outputQuality >= 85; `integrationGate`: integration >= 90 AND no drift ambiguity; `evidenceGate`: benchmark pass AND repeatability pass; `improvementGate`: weighted delta >= configured threshold; When any gate fails: `blocked_stop` event emitted with `failedGates[]` and `reason`; Session `stopReason` is `blockedStop` (not `converged`) when gates fail; The session continues iterating (does not prematurely terminate) when gates block convergence; If all 5 gates pass: `converged` stopReason is used instead | `terminal transcript, command output, generated files, and PASS/FAIL verdict` | When convergence math would trigger stop but at least one gate bundle fails, the journal contains a `blocked_stop` event with the failing gate names, and the session's `stopReason` is `blockedStop` -- the session does NOT claim `converged`. | If `legal_stop_evaluated` is missing: verify the orchestrator calls the legal-stop evaluation after convergence math triggers<br>If `blocked_stop` is missing when a gate fails: check the conditional that routes to `blocked_stop` vs `converged` based on gate results<br>If `stopReason` is `converged` despite failing gates: the gate-check-before-converge guard is bypassed; check the orchestrator&#x27;s stop-reason assignment logic<br>If gate results are empty: verify each gate bundle function is implemented and returns a pass/fail result |

### Optional Supplemental Checks

Use the verification block above as the primary supplemental check. Preserve any additional evidence in this template when reporting the verdict:

```text
Verdict: [PASS/FAIL]
Date: [YYYY-MM-DD]
Tester: [name]
Output excerpt:
[paste legal_stop_evaluated and/or blocked_stop event JSON]
```

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root playbook, category summary, and review protocol |
| `07--runtime-truth/028-legal-stop-gates.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Skill entry point and operator contract for sk-improve-agent |
| `../../scripts/improvement-journal.cjs` | Implementation or verification anchor referenced by this scenario |
| `.opencode/agent/debug.md` | Implementation or verification anchor referenced by this scenario |
| `../../scripts/tests/improvement-journal.vitest.ts` | Automated regression test anchor for the runtime script |

---

## 5. SOURCE METADATA

- Group: Runtime Truth
- Playbook ID: RT-028
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `07--runtime-truth/028-legal-stop-gates.md`
