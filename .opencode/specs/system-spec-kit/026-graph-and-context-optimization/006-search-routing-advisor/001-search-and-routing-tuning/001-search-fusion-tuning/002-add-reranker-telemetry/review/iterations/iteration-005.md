# Iteration 005: Correctness

## Focus
- Dimension: correctness
- Files: `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts`, `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts`
- Scope: replay F001 and test whether it downgrades under a second read

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
- No new finding; **F001** remains active after replay.

### P2 - Suggestion
- None.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | pass | hard | `spec.md:14-18`, `cross-encoder.ts:248-265` | The implementation still matches the feature scope; the active issue is in cache identity, not missing functionality. |
| checklist_evidence | partial | hard | `checklist.md:7-9`, `cross-encoder.ts:248-265` | The checklist covers the new fields and reset flow, but not the content-identity edge case. |

## Assessment
- New findings ratio: 0.00
- Dimensions addressed: correctness
- Novelty justification: Stabilization pass confirmed the earlier correctness issue without creating a second defect class.

## Ruled Out
- A test-only explanation for F001 was ruled out; the defect is visible in production cache-key construction.

## Dead Ends
- Reframing F001 as a pure maintainability issue did not hold once the cache-hit return path was re-read.

## Recommended Next Focus
Return to security and verify that the active finding set still contains no P0 or boundary break.
