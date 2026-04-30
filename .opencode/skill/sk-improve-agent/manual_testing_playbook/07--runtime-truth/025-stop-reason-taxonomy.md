---
title: "RT-025 -- Stop-Reason Taxonomy Validation"
description: "Manual validation scenario for RT-025: Stop-Reason Taxonomy Validation."
feature_id: "RT-025"
category: "Runtime Truth"
---

# RT-025 -- Stop-Reason Taxonomy Validation

This document captures the canonical manual-testing contract for `RT-025`.

---

## 1. OVERVIEW

This scenario validates that every completed improvement session emits a `session_ended` event with a valid `stopReason` and `sessionOutcome` drawn from the frozen taxonomies defined in `improvement-journal.cjs`.

---

## 2. SCENARIO CONTRACT

- Objective: Validate Stop-Reason Taxonomy Validation for the journal, continuation, stop-gate, stability, and replay-consumer scenarios.
- Real user request: `` Validate that every completed improvement session emits a `session_ended` event with a valid `stopReason` and `sessionOutcome` drawn from the frozen taxonomies defined in `improvement-journal.cjs`. ``
- RCAF Prompt: `` As a manual-testing orchestrator, validate that every completed improvement session emits a session_ended event with a valid stopReason and sessionOutcome drawn from the frozen taxonomies defined in improvement-journal.cjs against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify Journal contains at least one `session_ended` or `session_end` event. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence. ``
- Expected execution process: Run the improvement-journal helper against the documented disposable runtime state; capture stdout, stderr, exit code, and any generated files; then execute the verification block against the same run artifacts.
- Expected signals: Journal contains at least one `session_ended` or `session_end` event; `details.stopReason` is one of: `converged`, `maxIterationsReached`, `blockedStop`, `manualStop`, `error`, `stuckRecovery`; `details.sessionOutcome` is one of: `keptBaseline`, `promoted`, `rolledBack`, `advisoryOnly`; Both fields are present (validation rejects events missing either); `emitEvent()` refuses to write a `session_ended` event with an invalid stopReason or sessionOutcome
- Desired user-visible outcome: A concise operator-facing PASS/FAIL verdict with the decisive evidence from the command output and verification checks.
- Pass/fail: After a completed improvement session, the journal contains a `session_ended` event whose `stopReason` and `sessionOutcome` are both valid members of the frozen taxonomy enums, and the `validateEvent()` function rejects any event with invalid values.

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
| RT-025 | Stop-Reason Taxonomy Validation | Validate Stop-Reason Taxonomy Validation | `` As a manual-testing orchestrator, validate that every completed improvement session emits a session_ended event with a valid stopReason and sessionOutcome drawn from the frozen taxonomies defined in improvement-journal.cjs against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify Journal contains at least one `session_ended` or `session_end` event. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence. `` | /improve:improve-agent &quot;.opencode/agent/debug.md&quot; :confirm --spec-folder={spec} --iterations=2<br><br><br>Verification:<br><br><br>node .opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs --read {spec}/improvement/improvement-journal.jsonl &#124; python3 -c &quot;<br>import sys, json<br>events = json.load(sys.stdin)<br>ends = [e for e in events if e[&#x27;eventType&#x27;] in (&#x27;session_ended&#x27;, &#x27;session_end&#x27;)]<br>assert len(ends) &gt;= 1, &#x27;No session_ended event found&#x27;<br>VALID_STOP = {&#x27;converged&#x27;,&#x27;maxIterationsReached&#x27;,&#x27;blockedStop&#x27;,&#x27;manualStop&#x27;,&#x27;error&#x27;,&#x27;stuckRecovery&#x27;}<br>VALID_OUTCOME = {&#x27;keptBaseline&#x27;,&#x27;promoted&#x27;,&#x27;rolledBack&#x27;,&#x27;advisoryOnly&#x27;}<br>for e in ends:<br>    sr = e[&#x27;details&#x27;][&#x27;stopReason&#x27;]<br>    so = e[&#x27;details&#x27;][&#x27;sessionOutcome&#x27;]<br>    assert sr in VALID_STOP, f&#x27;Invalid stopReason: {sr}&#x27;<br>    assert so in VALID_OUTCOME, f&#x27;Invalid sessionOutcome: {so}&#x27;<br>print(&#x27;PASS&#x27;)<br>&quot; | Journal contains at least one `session_ended` or `session_end` event; `details.stopReason` is one of: `converged`, `maxIterationsReached`, `blockedStop`, `manualStop`, `error`, `stuckRecovery`; `details.sessionOutcome` is one of: `keptBaseline`, `promoted`, `rolledBack`, `advisoryOnly`; Both fields are present (validation rejects events missing either); `emitEvent()` refuses to write a `session_ended` event with an invalid stopReason or sessionOutcome | `terminal transcript, command output, generated files, and PASS/FAIL verdict` | After a completed improvement session, the journal contains a `session_ended` event whose `stopReason` and `sessionOutcome` are both valid members of the frozen taxonomy enums, and the `validateEvent()` function rejects any event with invalid values. | If no `session_ended` event exists: verify the orchestrator calls `emitEvent` with `eventType: &#x27;session_ended&#x27;` at session close<br>If `stopReason` is missing: check the orchestrator&#x27;s end-of-session logic for the `details.stopReason` assignment<br>If `stopReason` is invalid: check whether a new reason was added to the orchestrator but not to the `STOP_REASONS` enum in `improvement-journal.cjs`<br>If `sessionOutcome` is missing: check that the orchestrator includes `details.sessionOutcome` when emitting the end event |

### Optional Supplemental Checks

Use the verification block above as the primary supplemental check. Preserve any additional evidence in this template when reporting the verdict:

```text
Verdict: [PASS/FAIL]
Date: [YYYY-MM-DD]
Tester: [name]
Output excerpt:
[paste session_ended event JSON showing stopReason and sessionOutcome]
```

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root playbook, category summary, and review protocol |
| `07--runtime-truth/025-stop-reason-taxonomy.md` | Canonical per-feature execution contract |

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
- Playbook ID: RT-025
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `07--runtime-truth/025-stop-reason-taxonomy.md`
