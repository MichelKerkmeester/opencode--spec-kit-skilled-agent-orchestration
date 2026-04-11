---
title: "Resume Continuation from Paused Session"
feature_id: "RT-027"
category: "Runtime Truth"
---

# Resume Continuation from Paused Session

Validates that a previously paused improvement session can be resumed with `resumeMode: "resume"`, setting `continuedFromIteration` to the last completed iteration and continuing from there.

## Prompt / Command

Step 1 -- Run initial session (2 iterations):
```text
/improve:agent ".opencode/agent/handover.md" :confirm --spec-folder={spec} --iterations=2
```

Step 2 -- Resume the session:
```text
/improve:agent ".opencode/agent/handover.md" :confirm --spec-folder={spec} --iterations=2 --resume
```

### Verification (copy-paste)

```bash
node .opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs --read {spec}/improvement/improvement-journal.jsonl | python3 -c "
import sys, json
events = json.load(sys.stdin)
starts = [e for e in events if e['eventType'] == 'session_start']
assert len(starts) >= 2, f'Expected 2+ session_start events (original + resume), got {len(starts)}'
resume_start = starts[-1]
details = resume_start.get('details', {})
cont_iter = details.get('continuedFromIteration')
assert cont_iter is not None and cont_iter > 0, f'continuedFromIteration not set or zero: {cont_iter}'
print(f'PASS — resumed from iteration {cont_iter}')
"
```

## Expected Signals

- `sessionResume.resumeMode` set to `"resume"` (not `"new"`) in the config for the resumed session
- `continuedFromIteration` is set to the last completed iteration from the prior session (via `getLastIteration()`)
- `parentSessionId` references the original session's ID
- Journal replay loads prior events before dispatching new iterations
- Coverage graph and candidate lineage are preserved and extended (not overwritten)
- New iterations start numbering from `continuedFromIteration + 1`

## Pass Criteria

After resuming a paused session, the journal shows two `session_start` events (original and resumed), the resumed `session_start` has `continuedFromIteration` set to the last iteration of the prior session, and subsequent iterations continue from that point without re-running earlier iterations.

## Failure Triage

- If `continuedFromIteration` is null or 0: verify `getLastIteration()` correctly parses the journal and returns the max iteration number
- If the session starts from iteration 1 again: check that the orchestrator uses `continuedFromIteration` to offset the iteration counter
- If prior journal events are missing on resume: verify `readJournal()` reads the existing file before appending
- If coverage graph is reset: check that the resume flow reads the existing coverage graph file rather than creating a new one

## Evidence Template

```text
Verdict: [PASS/FAIL]
Date: [YYYY-MM-DD]
Tester: [name]
Output excerpt:
[paste session_start events showing continuedFromIteration values]
```
