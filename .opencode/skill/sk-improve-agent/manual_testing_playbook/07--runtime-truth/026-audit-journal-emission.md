---
title: "Audit Journal Lifecycle Event Emission"
feature_id: "RT-026"
category: "Runtime Truth"
---

# Audit Journal Lifecycle Event Emission

Validates that the improvement journal captures events for each lifecycle boundary: `session_start`, `candidate_generated`, `candidate_scored`, `gate_evaluation`, and `session_end`.

## Prompt

- Prompt: `As a manual-testing orchestrator, validate that the improvement journal captures events for each lifecycle boundary: session_start, candidate_generated, candidate_scored, gate_evaluation, and session_end against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify `improvement-journal.jsonl` file created at the configured journal path. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.`

## Commands

```text
/improve:improve-agent ".opencode/agent/debug.md" :confirm --spec-folder={spec} --iterations=1
```

### Verification (copy-paste)

```bash
node .opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs --read {spec}/improvement/improvement-journal.jsonl | python3 -c "
import sys, json
events = json.load(sys.stdin)
types = [e['eventType'] for e in events]
REQUIRED = ['session_start', 'candidate_generated', 'candidate_scored', 'gate_evaluation']
END_TYPES = ['session_ended', 'session_end']
for rt in REQUIRED:
    assert rt in types, f'Missing lifecycle event: {rt}'
assert any(t in types for t in END_TYPES), 'Missing session_ended/session_end event'
print(f'PASS — {len(events)} events, types: {sorted(set(types))}')
"
```

## Expected

- `improvement-journal.jsonl` file created at the configured journal path
- Events appear in chronological order (each has a `timestamp` field)
- At minimum, the following event types are present after a 1-iteration run:
  - `session_start` (session initialization)
  - `candidate_generated` (candidate proposal)
  - `candidate_scored` (scoring output)
  - `gate_evaluation` (promotion/rejection gate check)
  - `session_ended` or `session_end` (session termination)
- Each event has `eventType`, `timestamp`, and relevant `details`
- No duplicate `session_start` events for a single session

## Pass Criteria

After a single-iteration improvement run, the journal contains at least the five required lifecycle boundary events in chronological order, each with valid structure as enforced by `validateEvent()`.

## Failure Triage

- If journal file is missing: verify `journal.enabled: true` in improvement config and the `journal.path` is correct
- If a specific event type is absent: trace the orchestrator flow to find where `emitEvent()` should be called for that stage
- If events are out of order: check timestamp generation (should use `new Date().toISOString()` at emit time)
- If events have invalid structure: run `validateEvent()` on each event and check the returned errors

## Evidence Template

```text
Verdict: [PASS/FAIL]
Date: [YYYY-MM-DD]
Tester: [name]
Output excerpt:
[paste event types list and count from journal]
```
