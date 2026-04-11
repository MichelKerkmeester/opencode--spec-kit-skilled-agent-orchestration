---
title: "Stop-Reason Taxonomy Validation"
feature_id: "RT-025"
category: "Runtime Truth"
---

# Stop-Reason Taxonomy Validation

Validates that every completed improvement session emits a `session_ended` event with a valid `stopReason` and `sessionOutcome` drawn from the frozen taxonomies defined in `improvement-journal.cjs`.

## Prompt / Command

```text
/improve:agent ".opencode/agent/handover.md" :confirm --spec-folder={spec} --iterations=2
```

### Verification (copy-paste)

```bash
node .opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs --read {spec}/improvement/improvement-journal.jsonl | python3 -c "
import sys, json
events = json.load(sys.stdin)
ends = [e for e in events if e['eventType'] in ('session_ended', 'session_end')]
assert len(ends) >= 1, 'No session_ended event found'
VALID_STOP = {'converged','maxIterationsReached','blockedStop','manualStop','error','stuckRecovery'}
VALID_OUTCOME = {'keptBaseline','promoted','rolledBack','advisoryOnly'}
for e in ends:
    sr = e['details']['stopReason']
    so = e['details']['sessionOutcome']
    assert sr in VALID_STOP, f'Invalid stopReason: {sr}'
    assert so in VALID_OUTCOME, f'Invalid sessionOutcome: {so}'
print('PASS')
"
```

## Expected Signals

- Journal contains at least one `session_ended` or `session_end` event
- `details.stopReason` is one of: `converged`, `maxIterationsReached`, `blockedStop`, `manualStop`, `error`, `stuckRecovery`
- `details.sessionOutcome` is one of: `keptBaseline`, `promoted`, `rolledBack`, `advisoryOnly`
- Both fields are present (validation rejects events missing either)
- `emitEvent()` refuses to write a `session_ended` event with an invalid stopReason or sessionOutcome

## Pass Criteria

After a completed improvement session, the journal contains a `session_ended` event whose `stopReason` and `sessionOutcome` are both valid members of the frozen taxonomy enums, and the `validateEvent()` function rejects any event with invalid values.

## Failure Triage

- If no `session_ended` event exists: verify the orchestrator calls `emitEvent` with `eventType: 'session_ended'` at session close
- If `stopReason` is missing: check the orchestrator's end-of-session logic for the `details.stopReason` assignment
- If `stopReason` is invalid: check whether a new reason was added to the orchestrator but not to the `STOP_REASONS` enum in `improvement-journal.cjs`
- If `sessionOutcome` is missing: check that the orchestrator includes `details.sessionOutcome` when emitting the end event

## Evidence Template

```text
Verdict: [PASS/FAIL]
Date: [YYYY-MM-DD]
Tester: [name]
Output excerpt:
[paste session_ended event JSON showing stopReason and sessionOutcome]
```
