# Iteration 1: Correctness baseline for reducer state transitions

## Focus
Correctness review of reducer fixture state transitions and registry bookkeeping.

## Findings
### P1 - Required
- **F003**: Missing null guard in registry merge - `src/registry.ts:88` - Correctness path dereferences prior state before checking the record exists.

### P2 - Suggestion
- **F002**: Stale stop-gate snapshot reuse - `src/gates.ts:64` - Correctness fallback can replay outdated gate state when later iterations update the review snapshot.

## Ruled Out
- Dashboard rendering bug in the progress table was not reproducible from the traced inputs.

## Dead Ends
- Replaying the same correctness trace with synthetic durations did not change the registry outcome.

## Recommended Next Focus
Expand into security review around export and reducer boundary handling to verify whether any active path can escalate beyond correctness-only impact.
