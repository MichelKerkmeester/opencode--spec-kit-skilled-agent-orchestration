# Iteration 1: Correctness baseline for Tier 3 cache-key scope

## Focus
Correctness review of Tier 3 cache reuse and routing context boundaries.

## Files Reviewed
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/content-router-cache.vitest.ts`

## Findings
### P2 - Suggestion
- **F002**: Built-in Tier 3 cache keys look narrower than the routing contract - `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:334` - The shipped in-memory cache keys on scope, session or spec folder, and chunk hash, but the review needs a second pass to confirm whether omitting packet-level routing context can replay stale destinations. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:313`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:334`]

## Ruled Out
- `packet_kind` and `save_mode` prompt labeling itself is not the immediate correctness bug; the dedicated handler tests do cover those prompt fields.

## Dead Ends
- Reading only the implementation was not enough to prove the blast radius. The cache contract needed to be compared against the dedicated context test before this finding could be promoted beyond advisory.

## Recommended Next Focus
Rotate into security and test whether the live Tier 3 path can cross a trust boundary under configs the packet still describes as gated.

## Assessment
- Dimensions addressed: correctness
- newFindingsRatio: 0.18
- Cumulative findings: P0=0, P1=0, P2=1
