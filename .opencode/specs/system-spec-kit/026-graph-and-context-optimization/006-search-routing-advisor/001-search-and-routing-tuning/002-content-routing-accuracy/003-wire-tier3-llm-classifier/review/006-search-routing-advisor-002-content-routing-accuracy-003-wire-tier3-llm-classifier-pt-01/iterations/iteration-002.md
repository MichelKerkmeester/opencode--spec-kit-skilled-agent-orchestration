# Iteration 2: Security review of rollout gating and outbound egress

## Focus
Security review of Tier 3 rollout gating and outbound egress.

## Files Reviewed
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/002-content-routing-accuracy/003-wire-tier3-llm-classifier/implementation-summary.md`

## Findings
### P0 - Blocker
- **F001**: Full-auto canonical saves bypass the advertised Tier 3 rollout gate and can exfiltrate content to the LLM endpoint - `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1343` - `memory-save.ts` forces `tier3Enabled` on when `plannerMode === 'full-auto'`, and `classifyWithTier3Llm()` then POSTs the raw save chunk to the configured endpoint even though the packet describes the live path as rollout-gated. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1040`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1343`] [SOURCE: `implementation-summary.md:53`]

### P2 - Suggestion
- **F002**: Built-in Tier 3 cache keys look narrower than the routing contract - `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:334` - The correctness concern remains open, but the security pass did not yet prove it escalates beyond routing quality. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:334`]

## Ruled Out
- Timeout/null-response fallback is not the security bug. Those branches fall back to Tier 2; the blocker is the unconditional Tier 3 attempt under `plannerMode === 'full-auto'`.

## Dead Ends
- Looking for a separate POST-side guard after `tier3Enabled` did not help. The outbound call happens as soon as `classifyWithTier3Llm()` runs.

## Recommended Next Focus
Move to traceability and reconcile the rollout-gate story across the phase packet, the shipped code, and the feature catalog.

## Assessment
- Dimensions addressed: security
- newFindingsRatio: 0.58
- Cumulative findings: P0=1, P1=0, P2=1
