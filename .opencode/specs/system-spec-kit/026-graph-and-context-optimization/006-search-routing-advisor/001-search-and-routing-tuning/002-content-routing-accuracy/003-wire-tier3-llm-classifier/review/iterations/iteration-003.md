# Iteration 3: Traceability review of the Tier 3 enable contract

## Focus
Traceability review of packet claims versus shipped Tier 3 flag behavior.

## Files Reviewed
- `implementation-summary.md`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts`
- `.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md`

## Findings
### P1 - Required
- **F003**: The phase packet documents the wrong Tier 3 enable flag and rollout model - `implementation-summary.md:53` - The packet says the live path is gated by `SPECKIT_TIER3_ROUTING`, the shipped code reads `SPECKIT_ROUTER_TIER3_ENABLED`, and the feature catalog says the older flag is removed entirely. [SOURCE: `implementation-summary.md:53`] [SOURCE: `implementation-summary.md:94`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1366`] [SOURCE: `.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md:130`]

### P0 - Blocker
- **F001**: Full-auto canonical saves bypass the advertised Tier 3 rollout gate and can exfiltrate content to the LLM endpoint - `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1343` - The traceability pass reinforces that the release blocker is also a packet-contract mismatch, not just an implementation bug. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1343`] [SOURCE: `implementation-summary.md:53`]

## Ruled Out
- This is not just stale feature-catalog prose. The packet and the code themselves already disagree before the catalog is consulted.

## Dead Ends
- `spec.md` alone is too high level to settle the flag contract; the inconsistency only becomes obvious once `implementation-summary.md` and the feature catalog are compared with the shipped code.

## Recommended Next Focus
Rotate into maintainability and inspect the real cache lifecycle and runtime debt introduced by the shared Tier 3 cache.

## Assessment
- Dimensions addressed: traceability
- newFindingsRatio: 0.31
- Cumulative findings: P0=1, P1=1, P2=1
