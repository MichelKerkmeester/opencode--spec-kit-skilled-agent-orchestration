# Iteration 2: Security escalation after export-path review

## Focus
Security review after export-path escalation from the blocked-stop fixture.

## Findings
### P0 - Blocker
- **F001**: Authorization bypass in review export route - `src/export.ts:41` - Security check trusts caller supplied reviewerId and can expose blocked-stop artifacts to an unauthorized reviewer.

### P1 - Required
- **F003**: Missing null guard in registry merge - `src/registry.ts:88` - Correctness path dereferences prior state before checking the record exists.

### P2 - Suggestion
- **F002**: Stale stop-gate snapshot reuse - `src/gates.ts:64` - Correctness fallback can replay outdated gate state when later iterations update the review snapshot.

## Ruled Out
- A serializer-only defect was ruled out once the unauthorized export path reproduced with live fixture data.

## Dead Ends
- Token-only request mutation did not suppress the export leak because the reviewerId trust boundary stayed intact.

## Recommended Next Focus
Keep the security path under review, verify whether the stale stop-gate snapshot can influence blocker handling, and preserve the active P0 until the export boundary is proven safe.
