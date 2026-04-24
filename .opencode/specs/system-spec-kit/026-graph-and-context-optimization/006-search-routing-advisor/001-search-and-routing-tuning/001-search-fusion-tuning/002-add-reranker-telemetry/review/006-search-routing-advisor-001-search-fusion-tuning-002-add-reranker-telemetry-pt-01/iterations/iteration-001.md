# Iteration 001: Correctness

## Focus
- Dimension: correctness
- Files: `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts`
- Scope: verify that the new cache telemetry reflects real cache identity and result reuse semantics

## Scorecard
- Dimensions covered: correctness
- Files reviewed: 1
- New findings: P0=0 P1=1 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P0 - Blocker
- None.

### P1 - Required
- **F001**: Cache key ignores document content - `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:248-265`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:433-439` - `generateCacheKey()` hashes only provider, query, and sorted document ids, and the hit path immediately returns cached results. If callers reuse ids for changed content, the telemetry will count a hit and return stale reranks for a different payload.

### P2 - Suggestion
- None.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | pass | hard | `spec.md:14-18`, `cross-encoder.ts:248-265` | The phase did add telemetry in the intended file. |
| checklist_evidence | pending | hard | `checklist.md:6-16` | Full evidence replay deferred to a later traceability pass. |

## Assessment
- New findings ratio: 1.00
- Dimensions addressed: correctness
- Novelty justification: First pass identified a behavior defect directly inside the telemetry target surface.

## Ruled Out
- A pure status-shape issue was ruled out; the problem is in cache identity, not in the returned status object.

## Dead Ends
- None.

## Recommended Next Focus
Move to security and verify whether the new telemetry surface exposes anything more sensitive than aggregate counters.
