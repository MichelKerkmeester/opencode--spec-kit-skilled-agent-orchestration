# Iteration 004: Maintainability

## Focus
- Dimension: maintainability
- Files: `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts`, `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts`, `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts`
- Scope: verify that the new telemetry contract is easy to keep correct during future refactors

## Scorecard
- Dimensions covered: maintainability
- Files reviewed: 3
- New findings: P0=0 P1=1 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.25

## Findings

### P0 - Blocker
- None.

### P1 - Required
- **F004**: Stale-hit and eviction telemetry remain unprotected by targeted regression tests - `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:140-153`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:442-444`, `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts:433-460`, `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts:193-200` - The code increments `staleHits` and `evictions`, but the tests exercise only a fresh cache hit plus reset-to-zero behavior. Two of the four counters can drift silently without breaking the suite.

### P2 - Suggestion
- None.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | pass | hard | `spec.md:14-18`, `cross-encoder.ts:140-153`, `cross-encoder.ts:442-444` | The telemetry is implemented in the promised file, but the regression surface is incomplete. |
| checklist_evidence | partial | hard | `checklist.md:13`, `cross-encoder-extended.vitest.ts:433-460` | The checklist claims status/reset coverage, but stale-hit and eviction semantics remain indirectly covered at best. |

## Assessment
- New findings ratio: 0.25
- Dimensions addressed: maintainability
- Novelty justification: The maintainability pass found one new operational risk tied to long-term contract safety rather than present-day runtime failure.

## Ruled Out
- A missing status-field issue was ruled out; all requested fields are present in `getRerankerStatus()`.

## Dead Ends
- Widening into unrelated search pipeline tests was unnecessary once the telemetry-specific gap was isolated.

## Recommended Next Focus
Restart the rotation with correctness and verify whether F001 survives a stabilization pass.
