---
title: "RT-026 -- Audit Journal Lifecycle Event Emission"
description: "Manual validation scenario for RT-026: Audit Journal Lifecycle Event Emission."
feature_id: "RT-026"
category: "Runtime Truth"
---

# RT-026 -- Audit Journal Lifecycle Event Emission

This document captures the canonical manual-testing contract for `RT-026`.

---

## 1. OVERVIEW

This scenario validates that the improvement journal captures events for each lifecycle boundary: `session_start`, `candidate_generated`, `candidate_scored`, `gate_evaluation`, and `session_end`.

---

## 2. SCENARIO CONTRACT

- Objective: Validate Audit Journal Lifecycle Event Emission for the journal, continuation, stop-gate, stability, and replay-consumer scenarios.
- Real user request: `` Validate that the improvement journal captures events for each lifecycle boundary: `session_start`, `candidate_generated`, `candidate_scored`, `gate_evaluation`, and `session_end`. ``
- RCAF Prompt: `` As a manual-testing orchestrator, validate that the improvement journal captures events for each lifecycle boundary: session_start, candidate_generated, candidate_scored, gate_evaluation, and session_end against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify `improvement-journal.jsonl` file created at the configured journal path. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence. ``
- Expected execution process: Run the improvement-journal helper against the documented disposable runtime state; capture stdout, stderr, exit code, and any generated files; then execute the verification block against the same run artifacts.
- Expected signals: `improvement-journal.jsonl` file created at the configured journal path; Events appear in chronological order (each has a `timestamp` field); At minimum, the following event types are present after a 1-iteration run:; `session_start` (session initialization); `candidate_generated` (candidate proposal); `candidate_scored` (scoring output); `gate_evaluation` (promotion/rejection gate check); `session_ended` or `session_end` (session termination); Each event has `eventType`, `timestamp`, and relevant `details`; No duplicate `session_start` events for a single session
- Desired user-visible outcome: A concise operator-facing PASS/FAIL verdict with the decisive evidence from the command output and verification checks.
- Pass/fail: After a single-iteration improvement run, the journal contains at least the five required lifecycle boundary events in chronological order, each with valid structure as enforced by `validateEvent()`.

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
| RT-026 | Audit Journal Lifecycle Event Emission | Validate Audit Journal Lifecycle Event Emission | `` As a manual-testing orchestrator, validate that the improvement journal captures events for each lifecycle boundary: session_start, candidate_generated, candidate_scored, gate_evaluation, and session_end against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify `improvement-journal.jsonl` file created at the configured journal path. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence. `` | /improve:improve-agent &quot;.opencode/agent/debug.md&quot; :confirm --spec-folder={spec} --iterations=1<br><br><br>Verification:<br><br><br>node .opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs --read {spec}/improvement/improvement-journal.jsonl &#124; python3 -c &quot;<br>import sys, json<br>events = json.load(sys.stdin)<br>types = [e[&#x27;eventType&#x27;] for e in events]<br>REQUIRED = [&#x27;session_start&#x27;, &#x27;candidate_generated&#x27;, &#x27;candidate_scored&#x27;, &#x27;gate_evaluation&#x27;]<br>END_TYPES = [&#x27;session_ended&#x27;, &#x27;session_end&#x27;]<br>for rt in REQUIRED:<br>    assert rt in types, f&#x27;Missing lifecycle event: {rt}&#x27;<br>assert any(t in types for t in END_TYPES), &#x27;Missing session_ended/session_end event&#x27;<br>print(f&#x27;PASS — {len(events)} events, types: {sorted(set(types))}&#x27;)<br>&quot; | `improvement-journal.jsonl` file created at the configured journal path; Events appear in chronological order (each has a `timestamp` field); At minimum, the following event types are present after a 1-iteration run:; `session_start` (session initialization); `candidate_generated` (candidate proposal); `candidate_scored` (scoring output); `gate_evaluation` (promotion/rejection gate check); `session_ended` or `session_end` (session termination); Each event has `eventType`, `timestamp`, and relevant `details`; No duplicate `session_start` events for a single session | `terminal transcript, command output, generated files, and PASS/FAIL verdict` | After a single-iteration improvement run, the journal contains at least the five required lifecycle boundary events in chronological order, each with valid structure as enforced by `validateEvent()`. | If journal file is missing: verify `journal.enabled: true` in improvement config and the `journal.path` is correct<br>If a specific event type is absent: trace the orchestrator flow to find where `emitEvent()` should be called for that stage<br>If events are out of order: check timestamp generation (should use `new Date().toISOString()` at emit time)<br>If events have invalid structure: run `validateEvent()` on each event and check the returned errors |

### Optional Supplemental Checks

Use the verification block above as the primary supplemental check. Preserve any additional evidence in this template when reporting the verdict:

```text
Verdict: [PASS/FAIL]
Date: [YYYY-MM-DD]
Tester: [name]
Output excerpt:
[paste event types list and count from journal]
```

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root playbook, category summary, and review protocol |
| `07--runtime-truth/026-audit-journal-emission.md` | Canonical per-feature execution contract |

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
- Playbook ID: RT-026
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `07--runtime-truth/026-audit-journal-emission.md`
