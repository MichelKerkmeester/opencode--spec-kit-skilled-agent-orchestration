# Iteration 10: Cognitive Subsystem Review (Q12) + UX Friction Survey (Q3 start)

## Focus
Assess whether the 11-file cognitive subsystem (4,644 LOC) in `lib/cognitive/` is over-engineered relative to its actual impact on retrieval quality. Determine which modules are genuinely integrated into the production pipeline vs standalone or dormant. Begin surveying developer UX friction for Q3 by analyzing how cognitive features surface through the tool layer.

## Findings

### Q12: Cognitive Subsystem Assessment

1. **The cognitive subsystem is 4,644 LOC across 11 modules -- 10 of 11 are production-integrated.** Only `temporal-contiguity.ts` (181 LOC, 3.9%) has zero production callers; it is imported only by its test file. The remaining 4,463 LOC are imported by handlers, search pipeline stages, or the context server. This is NOT over-engineered dead code -- it is a deeply woven subsystem.
   [SOURCE: Grep `from ['"].*cognitive` across mcp_server/*.ts -- 65+ import lines across production + test files]

2. **Module LOC breakdown reveals 3 size tiers: heavyweight (>500 LOC), medium (300-500), and lightweight (<200).** Heavyweight: working-memory.ts (765), archival-manager.ts (743), prediction-error-gate.ts (561), adaptive-ranking.ts (554), tier-classifier.ts (517). Medium: co-activation.ts (403), fsrs-scheduler.ts (395), attention-decay.ts (361). Lightweight: temporal-contiguity.ts (181), pressure-monitor.ts (101), rollout-policy.ts (64).
   [SOURCE: `wc -l` on all 11 cognitive/*.ts files]

3. **rollout-policy.ts (64 LOC) is the most widely imported module -- 6 production consumers depend on `isFeatureEnabled()`.** It is imported by capability-flags.ts, search-flags.ts, graph-flags.ts, session-boost.ts, causal-boost.ts, and extraction-adapter.ts. Despite its tiny size, it is a critical governance primitive that gates every feature flag in the system. Well-sized for its responsibility.
   [SOURCE: Grep for `from.*cognitive/rollout-policy` across mcp_server/]

4. **working-memory.ts (765 LOC) implements a complete session-scoped attention model with Miller's Law capacity (7 items), LRU eviction, event-distance decay (factor 0.85), decay/delete separation (floor=0.05, delete threshold=0.01), mention boosting, and legacy schema migration.** It is imported by 5 production modules (context-server, memory-triggers, memory-context, session-manager, extraction-adapter). The module is internally well-structured (9 labeled sections) with thorough error handling. The design is sophisticated but NOT over-engineered -- each feature addresses a real session management need.
   [SOURCE: mcp_server/lib/cognitive/working-memory.ts:1-765]

5. **attention-decay.ts (361 LOC) is a facade that delegates to 2 other modules.** FSRS decay goes through fsrs-scheduler.ts; 5-factor composite scoring goes through composite-scoring.ts in lib/scoring/. The module's own novel logic is limited to: tier-aware decay rates (6 tiers), memory activation (access_count + last_accessed update), and FSRS-backed activation (activateMemoryWithFsrs). Legacy exponential decay functions have been cleanly removed with migration comments. Well-factored.
   [SOURCE: mcp_server/lib/cognitive/attention-decay.ts:1-361]

6. **cognitive.ts config (115 LOC) is over-engineered for its scope -- 115 lines of Zod validation, regex safety checks, and typed parse results to configure ONE co-activation pattern.** The config exposes exactly 2 env vars (SPECKIT_COGNITIVE_COACTIVATION_PATTERN, SPECKIT_COGNITIVE_COACTIVATION_FLAGS). The safety apparatus (nested quantifier detection, backreference rejection, 256-char limit) is disproportionate to the risk -- this is a server-controlled regex, not user input. However, the defensive posture is consistent with the system's overall security-first philosophy.
   [SOURCE: mcp_server/configs/cognitive.ts:1-115]

7. **temporal-contiguity.ts (181 LOC) is the ONLY module with zero production integration.** It has test coverage (temporal-contiguity.vitest.ts) but no handler, search stage, or context-server imports it. This appears to be a completed feature module awaiting pipeline integration -- built and tested but never wired in.
   [SOURCE: Grep for `temporal-contiguity` across non-test files returns 0 production imports]

8. **The cognitive subsystem's integration pattern reveals a 4-layer architecture:** (a) Foundation layer: rollout-policy.ts + fsrs-scheduler.ts -- consumed everywhere for flag gating and spaced-repetition math. (b) Session layer: working-memory.ts -- session-scoped attention tracking. (c) Quality layer: prediction-error-gate.ts + tier-classifier.ts + pressure-monitor.ts -- memory quality gates and state management. (d) Enhancement layer: co-activation.ts + adaptive-ranking.ts + archival-manager.ts + attention-decay.ts -- scoring enrichment and lifecycle management. temporal-contiguity.ts sits outside all layers (unintegrated).
   [INFERENCE: Based on import graph analysis across 65+ import lines]

9. **The cognitive subsystem has a "shadow mode" pattern via adaptive-ranking.ts (554 LOC).** It exports `buildAdaptiveShadowProposal` consumed by memory-search.ts -- meaning it proposes ranking adjustments that can be logged/compared without affecting live results. This is a mature software engineering pattern (shadow traffic / canary analysis) applied to retrieval ranking. Combined with the eval framework (iter-8), this creates a complete observe-propose-evaluate loop, though no automated feedback loop exists.
   [SOURCE: Grep shows memory-search.ts imports `buildAdaptiveShadowProposal` from adaptive-ranking.ts; checkpoints.ts imports `recordAdaptiveSignal`]

10. **co-activation.ts is deeply integrated into the search pipeline, imported by 4 production modules including hybrid-search.ts and stage2-fusion.ts.** It participates directly in search-time result enrichment via `spreadActivation()` -- finding and surfacing related memories when a memory is retrieved. The `CO_ACTIVATION_CONFIG` is shared between hybrid-search and stage2-fusion, suggesting this is a core retrieval quality feature, not an optional enhancement.
    [SOURCE: Grep shows co-activation imported by context-server.ts, hybrid-search.ts, stage2-fusion.ts, mutation-hooks.ts]

### Q3 (start): UX Friction -- Cognitive Feature Surface Area

11. **The cognitive subsystem introduces significant parameter complexity into the MCP tool layer.** The `memory_search` tool accepts session-aware parameters (sessionId, enableSessionBoost, enableDedup, enableCausalBoost) that directly trigger cognitive module behavior. The `memory_match_triggers` tool has (include_cognitive, session_id, turnNumber) -- 3 cognitive-specific parameters. Developers must understand session lifecycle, attention decay semantics, and rollout policy to use these effectively. This is a UX friction point for Q3 investigation.
    [INFERENCE: Based on MCP tool schemas visible in dispatch context + cognitive module integration with handlers]

## Sources Consulted
- `mcp_server/configs/cognitive.ts` (115 lines, full read)
- `mcp_server/lib/cognitive/working-memory.ts` (765 lines, full read)
- `mcp_server/lib/cognitive/attention-decay.ts` (361 lines, full read)
- Grep: `from ['"].*cognitive` across mcp_server/*.ts (65+ results)
- `wc -l` on all 11 cognitive/*.ts files
- `research/deep-research-config.json` (progressive synthesis: true)

## Assessment
- New information ratio: 0.91
- Questions addressed: Q12 (fully), Q3 (started)
- Questions answered: Q12

## Reflection
- What worked and why: The Grep-first approach (searching all cognitive imports across the codebase) was the highest-ROI action. A single grep gave the complete integration map for all 11 modules, revealing that 10/11 are production-integrated. This eliminated the need to read each module individually to determine integration status.
- What did not work and why: Dispatch context paths were wrong again (shared/ prefix, 6th occurrence). Required Glob discovery step costing 2 extra tool calls. This is a persistent orchestrator issue.
- What I would do differently: For Q3 UX investigation, reading the actual MCP tool schema definitions (tools/*.ts) would give more precise parameter complexity data than inferring from handler imports.

## Recommended Next Focus
Iteration 11: Continue Q3 (automation/UX friction) by reading MCP tool schemas in tools/ directory. Count total parameters across all 32+ tools. Identify tools with >5 parameters (complexity threshold). Survey error messages for developer clarity. Also begin Q1 completion by cross-referencing weight coherence findings with cognitive subsystem scoring paths.
