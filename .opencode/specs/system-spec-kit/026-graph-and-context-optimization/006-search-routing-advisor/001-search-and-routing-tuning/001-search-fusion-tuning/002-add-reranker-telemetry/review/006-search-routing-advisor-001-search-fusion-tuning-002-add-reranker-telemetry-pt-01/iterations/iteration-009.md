# Iteration 009: Correctness

## Focus
- Dimension: correctness
- Files: `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts`, `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts`
- Scope: final cache-behavior replay before the terminal security sweep

## Scorecard
- Dimensions covered: correctness
- Files reviewed: 2
- New findings: P0=0 P1=0 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.00

## Findings

### P0 - Blocker
- None.

### P1 - Required
- No new finding; **F001** remains active.

### P2 - Suggestion
- None.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | pass | hard | `cross-encoder.ts:248-265`, `cross-encoder.ts:433-439` | The active correctness defect is stable and still directly supported by code evidence. |
| checklist_evidence | partial | hard | `checklist.md:7-9`, `cross-encoder.ts:248-265` | Packet evidence still does not address the stable-id/changed-content edge case. |

## Assessment
- New findings ratio: 0.00
- Dimensions addressed: correctness
- Novelty justification: Second zero-churn replay confirmed that the correctness issue set had stabilized.

## Ruled Out
- Reclassifying F001 downward was ruled out because the stale-hit path still returns cached results without validating content identity.

## Dead Ends
- Attempting to derive a separate miss/stale-hit correctness defect from the same code path; it collapsed back into F001.

## Recommended Next Focus
Run the terminal security sweep; if it remains clean, the last three zero-churn iterations will satisfy convergence.
