# Iteration 5: Correctness recheck against the cache contract

## Focus
Correctness recheck of cache-key scope against prompt context.

## Files Reviewed
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/content-router-cache.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts`

## Findings
### P1 - Required
- **F002**: Built-in Tier 3 cache keys ignore routing context and can replay stale destinations - `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:334` - The dedicated cache-contract test keys on `spec_folder`, `packet_level`, `packet_kind`, `likely_phase_anchor`, and `session_id`, but the shipped `InMemoryRouterCache` still keys on scope plus chunk hash only. That means identical ambiguous text can reuse the wrong route after the routing context changes. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:313`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:334`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:756`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1297`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/content-router-cache.vitest.ts:26`]

### P0 - Blocker
- **F001**: Full-auto canonical saves bypass the advertised Tier 3 rollout gate and can exfiltrate content to the LLM endpoint - `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1343` - The correctness pass does not change the blocker, but it shows a second hidden coupling: one save-path knob alters another subsystem’s behavior without the packet documenting it. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1343`]

## Ruled Out
- The custom cache regression does not save the shipped runtime. It proves the intended context contract, but it does not change the key that `InMemoryRouterCache` actually builds.

## Dead Ends
- There is no normalization layer between `resolveTier3Decision()` and `InMemoryRouterCache.buildKey()` that injects the missing context fields before the cache lookup runs.

## Recommended Next Focus
Use the next security pass as an adversarial self-check on F001 and decide whether the blocker survives a stricter threat-boundary reading.

## Assessment
- Dimensions addressed: correctness
- newFindingsRatio: 0.22
- Cumulative findings: P0=1, P1=2, P2=1
