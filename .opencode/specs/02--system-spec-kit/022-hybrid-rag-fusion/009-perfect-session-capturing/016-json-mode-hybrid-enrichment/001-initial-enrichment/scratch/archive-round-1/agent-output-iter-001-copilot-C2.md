# Iteration 001 — C2 Type Analyst: Cast Risk Catalog

## Cast Inventory

| # | File:Line | Cast Expression | Necessary? | Risk if Kept |
|---|-----------|----------------|------------|-------------|
| 1 | `collect-session-data.ts:350` | `(collectedData as Record<string, unknown>)?.session` | No | Hides SessionMetadata drift |
| 2 | `collect-session-data.ts:358` | `(collectedData as Record<string, unknown>).sessionSummary` | No | Completion detection false-negative |
| 3 | `collect-session-data.ts:359` | `(collectedData as Record<string, unknown>).keyDecisions` | No | Masks decisions shape drift |
| 4 | `collect-session-data.ts:360` | `(collectedData as Record<string, unknown>).keyDecisions` | No | Redundant cast chain |
| 5 | `collect-session-data.ts:361` | `(collectedData as Record<string, unknown>).nextSteps` | No | Completion detection miss |
| 6 | `collect-session-data.ts:362` | `(collectedData as Record<string, unknown>)._source` | No | File-source detection drift |
| 7 | `collect-session-data.ts:404` | `(collectedData as Record<string, unknown>)?.session` | No | Hides SessionMetadata drift |
| 8 | `collect-session-data.ts:417` | `(collectedData as Record<string, unknown>).sessionSummary` | No | Same false-negative risk |
| 9 | `collect-session-data.ts:418` | `(collectedData as Record<string, unknown>)._source` | No | Same file-source drift |
| 10 | `collect-session-data.ts:730` | `(data as Record<string, unknown>).session` | No | Masks typed access for all session fields |
| 11 | `collect-session-data.ts:732` | `(data as Record<string, unknown>).git` | No | Invalid repositoryState strings propagate |
| 12 | `workflow.ts:1180` | `(collectedData as Record<string, unknown>).git` | No | Defeats compiler protection |
| 13 | `workflow.ts:1180` | `.git as Record<string, unknown> \| undefined` | No | Malformed values like "false" override safe git context |

## Finding 1: `workflow.ts` git cast chain can mask real runtime bugs
- **Severity**: HIGH
- **Location**: `workflow.ts:1180-1184`
- **Evidence**: Current code uses double cast to access git fields. Safe alternative: `const gitPayload = collectedData.git; enriched.headRef = gitPayload?.headRef ?? gitContext.headRef;`
- **Risk**: Casts suppress type checking, then property casts let wrong runtime values survive `??`. Example: `"false"` string can land in `isDetachedHead`.
- **Recommendation**: Remove both `Record` casts and use typed `GitMetadata` access directly.

## Finding 2: `CollectedDataFull` already inherits typed `session`/`git`
- **Severity**: MEDIUM
- **Location**: `session-types.ts:124-141`, `collect-session-data.ts:118-119`
- **Evidence**: `CollectedDataBase` declares `session?: SessionMetadata` and `git?: GitMetadata`; `CollectedDataFull extends CollectedDataBase`.
- **Risk**: The 11 session/git casts in collect-session-data.ts are pure type bypasses. They won't catch field renames or contract tightening.
- **Recommendation**: Replace all with direct typed access.

## Finding 3: Adjacent JSON-mode completeness checks are also over-cast
- **Severity**: LOW
- **Location**: `collect-session-data.ts:358-362,417-418`
- **Evidence**: `sessionSummary`, `keyDecisions`, `nextSteps` are already typed on `CollectedDataBase`; `_source` is reachable through the index signature.
- **Risk**: Mostly maintenance risk.
- **Recommendation**: Use direct access: `collectedData.sessionSummary`, `collectedData.keyDecisions`, etc.

## Summary
- Total casts found: **13** in scope
- Unnecessary: **13**
- Necessary: **0**
- Key insight: All `as Record<string, unknown>` casts are unnecessary because `session` and `git` are already typed on `CollectedDataBase`/`CollectedDataFull`. The `workflow.ts` git cast chain is most dangerous as it can let malformed runtime values win over safe enrichment.
