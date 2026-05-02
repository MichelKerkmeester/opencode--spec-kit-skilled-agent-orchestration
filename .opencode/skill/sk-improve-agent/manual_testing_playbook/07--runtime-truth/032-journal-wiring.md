---
title: "RT-032 -- Journal Wiring Boundary Coverage"
description: "Manual validation scenario for RT-032: Journal Wiring Boundary Coverage."
feature_id: "RT-032"
category: "Runtime Truth"
---

# RT-032 -- Journal Wiring Boundary Coverage

This document captures the canonical manual-testing contract for `RT-032`.

---

## 1. OVERVIEW

This scenario validates that the `/improve:agent` autonomous workflow wires `improvement-journal.cjs` at every required boundary: `session_start`, per-iteration lifecycle checkpoints, nested `legal_stop_evaluated.details.gateResults`, and `session_end`. Given: a fresh `/improve:agent` `:auto` session. When: the operator runs the session end-to-end or inspects `.opencode/command/improve/assets/improve_improve-agent_auto.yaml`. Then: journal events appear in `improvement-journal.jsonl` for every boundary, the CLI example in `.opencode/command/improve/agent.md` executes as written against a temp target, and the frozen `STOP_REASONS` / `SESSION_OUTCOMES` enums match the helper validator.

---

## 2. SCENARIO CONTRACT

- Objective: Validate Journal Wiring Boundary Coverage for the journal, continuation, stop-gate, stability, and replay-consumer scenarios.
- Real user request: `` Validate that the `/improve:agent` autonomous workflow wires `improvement-journal.cjs` at every required boundary: `session_start`, per-iteration lifecycle checkpoints, nested `legal_stop_evaluated.details.gateResults`, and `session_end`. Given: a fresh `/improve:agent` `:auto` session. When: the operator runs the session end-to-end or inspects `.opencode/command/improve/assets/improve_improve-agent_auto.yaml`. Then: journal events appear in `improvement-journal.jsonl` for every boundary, the CLI example in `.opencode/command/improve/agent.md` executes as written against a temp target, and the frozen `STOP_REASONS` / `SESSION_OUTCOMES` enums match the helper validator. ``
- RCAF Prompt: `` As a manual-testing orchestrator, validate that the /improve:improve-agent autonomous workflow wires improvement-journal.cjs at every required boundary: session_start, per-iteration lifecycle checkpoints, and session_end against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify `.opencode/command/improve/assets/improve_improve-agent_auto.yaml` contains `improvement-journal.cjs` emission steps for:. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence. ``
- Expected execution process: Run the improvement-journal helper against the documented disposable runtime state; capture stdout, stderr, exit code, and any generated files; then execute the verification block against the same run artifacts.
- Expected signals: `.opencode/command/improve/assets/improve_improve-agent_auto.yaml` contains `improvement-journal.cjs` emission steps for:; `session_start` before the first loop iteration; `candidate_generated`, `candidate_scored`, `benchmark_completed`, nested `legal_stop_evaluated.details.gateResults`, and `gate_evaluation`/stop checks inside each iteration; `session_end` after synthesis completes; The CLI example from `.opencode/command/improve/agent.md` executes successfully against a temp journal target with exit code `0`; `improvement-journal.cjs` exports frozen `STOP_REASONS` and `SESSION_OUTCOMES` enums; `validateEvent()` accepts only those enum members for `session_end` / `session_ended`; The command doc taxonomy in `agent.md` matches the helper's internal validator and does not drift
- Desired user-visible outcome: A concise operator-facing PASS/FAIL verdict with the decisive evidence from the command output and verification checks.
- Pass/fail: The autonomous YAML contains journal emission coverage for all three boundary groups (session start, per-iteration lifecycle checkpoints, session end), the CLI example from `.opencode/command/improve/agent.md` runs successfully as written against a temp journal path, and the stop-reason / session-outcome enums in the command doc match the frozen values enforced by `improvement-journal.cjs`.

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
| RT-032 | Journal Wiring Boundary Coverage | Validate Journal Wiring Boundary Coverage | `` As a manual-testing orchestrator, validate that the /improve:agent autonomous workflow wires improvement-journal.cjs at every required boundary: session_start, per-iteration lifecycle checkpoints, nested legal_stop_evaluated.details.gateResults, and session_end against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify `.opencode/command/improve/assets/improve_improve-agent_auto.yaml` contains `improvement-journal.cjs` emission steps for:. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence. `` | /improve:agent &quot;.opencode/agent/debug.md&quot; :auto --spec-folder={spec} --iterations=2<br><br><br>Verification:<br><br><br>AUTO_YAML=.opencode/command/improve/assets/improve_improve-agent_auto.yaml<br>TMP_SPEC=&quot;$(mktemp -d /tmp/improve-agent-journal-XXXXXX)&quot;<br>TMP_JOURNAL=&quot;$TMP_SPEC/improvement/improvement-journal.jsonl&quot;<br><br><br>grep -n &quot;improvement-journal.cjs\&#124;--emit&quot; &quot;$AUTO_YAML&quot;<br><br><br>python3 - &lt;&lt;&#x27;PY&#x27;<br>from pathlib import Path<br>yaml_text = Path(&quot;.opencode/command/improve/assets/improve_improve-agent_auto.yaml&quot;).read_text()<br>required = [<br>    &quot;session_start&quot;,<br>    &quot;candidate_generated&quot;,<br>    &quot;candidate_scored&quot;,<br>    &quot;benchmark_completed&quot;,<br>    &quot;legal_stop_evaluated&quot;,<br>    &quot;gateResults&quot;,<br>    &quot;session_end&quot;,<br>]<br>missing = [token for token in required if token not in yaml_text]<br>assert not missing, f&quot;Missing journal boundaries in auto YAML: {missing}&quot;<br>print(&quot;PASS — auto YAML covers start, iteration, nested legal-stop, benchmark, and end boundaries&quot;)<br>PY<br><br><br>node .opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs --emit session_start --journal &quot;$TMP_JOURNAL&quot; --details &#x27;{&quot;sessionId&quot;:&quot;imp-2026-04-11T12-00-00Z&quot;,&quot;target&quot;:&quot;deep-research&quot;,&quot;charter&quot;:&quot;...&quot;,&quot;startedAt&quot;:&quot;2026-04-11T12:00:00Z&quot;}&#x27;<br><br><br>node .opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs --read &quot;$TMP_JOURNAL&quot; &#124; python3 -c &quot;<br>import sys, json<br>events = json.load(sys.stdin)<br>assert len(events) == 1 and events[0][&#x27;eventType&#x27;] == &#x27;session_start&#x27;, &#x27;CLI example did not emit session_start&#x27;<br>print(&#x27;PASS — command doc CLI example executed successfully&#x27;)<br>&quot;<br><br><br>grep -A 7 &quot;STOP_REASONS\&#124;SESSION_OUTCOMES\&#124;LEGAL_STOP_GATES&quot; .opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs<br><br><br>python3 - &lt;&lt;&#x27;PY&#x27;<br>from pathlib import Path<br>doc = Path(&quot;.opencode/command/improve/agent.md&quot;).read_text()<br>script = Path(&quot;.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs&quot;).read_text()<br>required_stop = [<br>    &quot;converged&quot;,<br>    &quot;maxIterationsReached&quot;,<br>    &quot;blockedStop&quot;,<br>    &quot;manualStop&quot;,<br>    &quot;error&quot;,<br>    &quot;stuckRecovery&quot;,<br>]<br>required_outcomes = [<br>    &quot;keptBaseline&quot;,<br>    &quot;promoted&quot;,<br>    &quot;rolledBack&quot;,<br>    &quot;advisoryOnly&quot;,<br>]<br>required_gates = [&quot;contractGate&quot;, &quot;behaviorGate&quot;, &quot;integrationGate&quot;, &quot;evidenceGate&quot;, &quot;improvementGate&quot;]<br>for token in required_stop + required_outcomes:<br>    assert token in doc, f&quot;Missing enum token in command doc: {token}&quot;<br>    assert token in script, f&quot;Missing enum token in helper: {token}&quot;<br>for token in required_gates:<br>    assert token in script, f&quot;Missing legal-stop gate token in helper: {token}&quot;<br>print(&quot;PASS — command doc taxonomy and legal-stop gates match improvement-journal.cjs enums&quot;)<br>PY<br><br><br>rm -rf &quot;$TMP_SPEC&quot; | `.opencode/command/improve/assets/improve_improve-agent_auto.yaml` contains `improvement-journal.cjs` emission steps for:; `session_start` before the first loop iteration; `candidate_generated`, `candidate_scored`, `benchmark_completed`, nested `legal_stop_evaluated.details.gateResults`, and `gate_evaluation`/stop checks inside each iteration; `session_end` after synthesis completes; The CLI example from `.opencode/command/improve/agent.md` executes successfully against a temp journal target with exit code `0`; `improvement-journal.cjs` exports frozen `STOP_REASONS`, `SESSION_OUTCOMES`, and legal-stop gate names; `validateEvent()` accepts only those enum members for `session_end` / `session_ended`; The command doc taxonomy in `agent.md` matches the helper's internal validator and does not drift | `terminal transcript, command output, generated files, and PASS/FAIL verdict` | The autonomous YAML contains journal emission coverage for session start, per-iteration lifecycle checkpoints, nested legal-stop, benchmark completion, and session end; the CLI example from `.opencode/command/improve/agent.md` runs successfully as written against a temp journal path; and the stop-reason / session-outcome enums in the command doc match the frozen values enforced by `improvement-journal.cjs`. | If any boundary is missing from the YAML: add or restore the missing `step_emit_journal_event*` command in `improve_improve-agent_auto.yaml`<br>If the CLI example exits non-zero: copy the exact example from `.opencode/command/improve/agent.md` and reconcile the helper CLI contract (`--emit`, `--journal`, `--details`)<br>If `legal_stop_evaluated` validation fails: confirm `details.gateResults` includes all five gate keys<br>If `session_end` is emitted but validation fails: compare the emitted `details.stopReason` / `details.sessionOutcome` values against the frozen enums in `improvement-journal.cjs`<br>If the doc taxonomy drifts from the helper: update the command doc and helper together so the runtime contract stays frozen |

### Optional Supplemental Checks

Use the verification block above as the primary supplemental check. Preserve any additional evidence in this template when reporting the verdict:

```text
Verdict: [PASS/FAIL]
Date: [YYYY-MM-DD]
Tester: [name]
Output excerpt:
[paste YAML boundary matches, CLI example output, and enum grep results]
```

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root playbook, category summary, and review protocol |
| `07--runtime-truth/032-journal-wiring.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Skill entry point and operator contract for sk-improve-agent |
| `../../scripts/improvement-journal.cjs` | Implementation or verification anchor referenced by this scenario |
| `.opencode/agent/debug.md` | Implementation or verification anchor referenced by this scenario |
| `.opencode/command/improve/agent.md` | Implementation or verification anchor referenced by this scenario |
| `.opencode/command/improve/assets/improve_improve-agent_auto.yaml` | Implementation or verification anchor referenced by this scenario |
| `../../scripts/tests/improvement-journal.vitest.ts` | Automated regression test anchor for the runtime script |

---

## 5. SOURCE METADATA

- Group: Runtime Truth
- Playbook ID: RT-032
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `07--runtime-truth/032-journal-wiring.md`
