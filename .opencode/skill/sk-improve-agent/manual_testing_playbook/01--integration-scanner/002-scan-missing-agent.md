---
title: "Scan Missing Agent (Nonexistent)"
feature_id: "IS-002"
category: "Integration Scanner"
---

# Scan Missing Agent (Nonexistent)

Validates that scanning a nonexistent agent produces graceful error handling instead of a crash.

## Prompt / Command

```bash
node .opencode/skill/sk-improve-agent/scripts/scan-integration.cjs --agent=nonexistent-agent-xyz
```

### Verification (copy-paste)

```bash
node .opencode/skill/sk-improve-agent/scripts/scan-integration.cjs --agent=nonexistent-agent-xyz | python3 -c "import sys,json; d=json.load(sys.stdin); assert d['status']=='complete'; assert d['surfaces']['canonical']['exists']==False; assert d['summary']['missingCount']>0; print('PASS')"
```

## Expected Signals

- `status: "complete"` (exit code 0 -- the script completes gracefully, it does not crash)
- `surfaces.canonical.exists: false`
- All entries in `surfaces.mirrors` have `syncStatus: "missing"`
- `summary.missingCount > 0`
- No unhandled exception or stack trace

## Pass Criteria

Script completes with exit code 0, reports `surfaces.canonical.exists: false`, all mirrors show `syncStatus: "missing"`, and `summary.missingCount > 0` -- without crashing or throwing an unhandled exception.

## Failure Triage

- If the script crashes with a stack trace: check error handling around file resolution logic in `scan-integration.cjs`
- If `surfaces.canonical.exists` is `true`: the agent name is resolving to an actual file unexpectedly -- use a more unique nonexistent name
- If `summary.missingCount` is 0: the script is not counting missing surfaces correctly
- If exit code is non-zero: the script should handle missing agents gracefully rather than erroring out

## Evidence Template

```text
Verdict: [PASS/FAIL]
Date: [YYYY-MM-DD]
Tester: [name]
Output excerpt:
[paste relevant output]
```
