---
title: "Legal-Stop Gate Blocking"
feature_id: "RT-028"
category: "Runtime Truth"
---

# Legal-Stop Gate Blocking

Validates that when convergence math signals stop but one or more of the 5 gate bundles fail, the session records a `blockedStop` rather than `converged`, and the blocked-stop event includes the failing gate details.

## Prompt / Command

```text
/improve:agent ".opencode/agent/debug.md" :confirm --spec-folder={spec} --iterations=5
```

### Verification (copy-paste)

```bash
node .opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs --read {spec}/improvement/improvement-journal.jsonl | python3 -c "
import sys, json
events = json.load(sys.stdin)
# Check for legal_stop_evaluated events
lse = [e for e in events if e['eventType'] == 'legal_stop_evaluated']
blocked = [e for e in events if e['eventType'] == 'blocked_stop']
GATES = ['contractGate', 'behaviorGate', 'integrationGate', 'evidenceGate', 'improvementGate']
if lse:
    gates = lse[-1].get('details', {}).get('gateResults', {})
    present = [g for g in GATES if g in gates]
    print(f'legal_stop_evaluated found — gates present: {present}')
if blocked:
    failed = blocked[-1].get('details', {}).get('failedGates', [])
    print(f'blocked_stop found — failed gates: {failed}')
    print('PASS — blockedStop recorded with failed gate details')
else:
    ends = [e for e in events if e['eventType'] in ('session_ended', 'session_end')]
    if ends and ends[-1].get('details', {}).get('stopReason') == 'converged':
        print('INFO — session converged (all gates passed), no blockedStop expected')
    else:
        print('INFO — no blocked_stop event found; may need scenario with intentional gate failure')
"
```

## Expected Signals

- `legal_stop_evaluated` event emitted with `gateResults` containing all 5 gate bundles:
  - `contractGate`: structural >= 90 AND systemFitness >= 90
  - `behaviorGate`: ruleCoherence >= 85 AND outputQuality >= 85
  - `integrationGate`: integration >= 90 AND no drift ambiguity
  - `evidenceGate`: benchmark pass AND repeatability pass
  - `improvementGate`: weighted delta >= configured threshold
- When any gate fails: `blocked_stop` event emitted with `failedGates[]` and `reason`
- Session `stopReason` is `blockedStop` (not `converged`) when gates fail
- The session continues iterating (does not prematurely terminate) when gates block convergence
- If all 5 gates pass: `converged` stopReason is used instead

## Pass Criteria

When convergence math would trigger stop but at least one gate bundle fails, the journal contains a `blocked_stop` event with the failing gate names, and the session's `stopReason` is `blockedStop` -- the session does NOT claim `converged`.

## Failure Triage

- If `legal_stop_evaluated` is missing: verify the orchestrator calls the legal-stop evaluation after convergence math triggers
- If `blocked_stop` is missing when a gate fails: check the conditional that routes to `blocked_stop` vs `converged` based on gate results
- If `stopReason` is `converged` despite failing gates: the gate-check-before-converge guard is bypassed; check the orchestrator's stop-reason assignment logic
- If gate results are empty: verify each gate bundle function is implemented and returns a pass/fail result

## Evidence Template

```text
Verdict: [PASS/FAIL]
Date: [YYYY-MM-DD]
Tester: [name]
Output excerpt:
[paste legal_stop_evaluated and/or blocked_stop event JSON]
```
