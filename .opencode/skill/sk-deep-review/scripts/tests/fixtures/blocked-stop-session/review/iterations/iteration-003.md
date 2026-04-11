# Iteration 3: Blocked-stop verification before legal stop

## Focus
Security verification of the blocked-stop path before a legal stop decision.

## Findings
### P0 - Blocker
- **F001**: Authorization bypass in review export route - `src/export.ts:41` - Security check trusts caller supplied reviewerId and can expose blocked-stop artifacts to an unauthorized reviewer.

### P1 - Required
- **F003**: Missing null guard in registry merge - `src/registry.ts:88` - Correctness path dereferences prior state before checking the record exists.
- **F002**: Stale stop-gate snapshot reuse - `src/gates.ts:64` - Security review showed the stale snapshot can preserve an outdated legal-stop decision, so severity is upgraded from advisory to required.

## Ruled Out
- The blocked-stop bundle itself is structurally complete, so the failure is not caused by missing event fields.

## Dead Ends
- Re-running the reducer with identical inputs did not clear the blocker because the same P0 and uncovered dimensions remained active.

## Recommended Next Focus
Resolve F001 first, then add traceability and maintainability coverage so the legal-stop gates can be re-evaluated without an active blocker.
