# Iteration 7: Feature Flag Governance (Q9) + Eval Infrastructure Scope (Q10 partial)

## Focus
Investigate Q9: Feature flag governance -- count all SPECKIT_ environment variables, assess whether there is a central registry, check for sunset dates/expiry mechanisms, and identify flag dependency cycles. Also begin Q10 by assessing the eval/ directory scope.

## Findings

### Feature Flag Census

1. **There are 78 unique SPECKIT_ env var names across lib/ (excluding partial prefix `SPECKIT_`)**, far exceeding any reasonable "6-flag limit" governance target. The actual unique flags (excluding bare `SPECKIT_` prefix and `SPECKIT_MEMORY_` partial) are **76 distinct environment variable names**. [SOURCE: grep -ohr 'SPECKIT_[A-Z_0-9]*' across mcp_server/lib/ | sort -u]

2. **There is NO central registry or manifest file.** Flags are distributed across 3 primary registration files plus ad-hoc inline reads throughout the codebase:
   - `search-flags.ts` (23 flags via named functions) -- the largest flag registry
   - `capability-flags.ts` (14 flags: 6 SPECKIT_MEMORY_* + 6 SPECKIT_HYDRA_* + 2 phase env vars) -- roadmap rollout controls
   - `rollout-policy.ts` (central `isFeatureEnabled()` function that all default-ON flags route through)
   - Remaining ~39 flags are read via inline `process.env.SPECKIT_*` throughout lib/ with NO centralized registration
   [SOURCE: mcp_server/lib/search/search-flags.ts, mcp_server/lib/config/capability-flags.ts]

3. **Three distinct flag semantics coexist with no formal documentation of which is which:**
   - **Default-ON (graduated):** Most flags in search-flags.ts -- uses `isFeatureEnabled()` which defaults to true. Set `=false` to disable. Examples: SPECKIT_MMR, SPECKIT_TRM, SPECKIT_CROSS_ENCODER, SPECKIT_GRAPH_SIGNALS.
   - **Default-OFF (opt-in):** Explicit `=== 'true'` check. Examples: SPECKIT_RECONSOLIDATION, SPECKIT_QUALITY_LOOP, SPECKIT_FILE_WATCHER.
   - **Multi-state:** SPECKIT_GRAPH_WALK_ROLLOUT has 3 states: 'off', 'trace_only', 'bounded_runtime'. Falls back to isGraphSignalsEnabled() if unset.
   [SOURCE: mcp_server/lib/search/search-flags.ts:93-95, :156-169, :230-233, :249-251]

4. **Zero sunset dates, zero expiry mechanisms, zero version gates.** No flag has any time-based or version-based automatic expiry. The only lifecycle signal is the `@deprecated` JSDoc on `isPipelineV2Enabled()` which always returns `true` (V1 was removed). There is no code that reads a "sunset date" or "expiry" for any flag. [SOURCE: search-flags.ts:109-115 (@deprecated annotation), grep for 'sunset|expir|deprecat' across lib/ -- only the one hit]

5. **One confirmed flag dependency cycle: SPECKIT_GRAPH_WALK_ROLLOUT depends on SPECKIT_GRAPH_SIGNALS.** In `resolveGraphWalkRolloutState()`, if the GRAPH_WALK_ROLLOUT env var is unset, it falls back to `isFeatureEnabled('SPECKIT_GRAPH_SIGNALS')`. This creates a one-way dependency: disabling GRAPH_SIGNALS also disables GRAPH_WALK unless GRAPH_WALK_ROLLOUT is explicitly set. [SOURCE: search-flags.ts:156-169]

6. **Second flag dependency: SPECKIT_ENTITY_LINKING requires SPECKIT_AUTO_ENTITIES.** The JSDoc on `isEntityLinkingEnabled()` states "Requires R10 (auto entities) to also be enabled." However, the function body does NOT enforce this -- it only checks its own flag. The dependency is documented but not code-enforced. [SOURCE: search-flags.ts:199-206]

7. **The Hydra/Speckit dual naming system doubles the effective flag count.** Every roadmap capability flag exists as both `SPECKIT_MEMORY_*` and `SPECKIT_HYDRA_*` (legacy), checked in order with the SPECKIT_MEMORY variant taking precedence. This means 12 of the 76 flags are legacy aliases. The code correctly handles both but the naming creates confusion about which to use. [SOURCE: capability-flags.ts:38-54]

8. **SPECKIT_PIPELINE_V2 is dead code.** The function `isPipelineV2Enabled()` always returns `true`. The env var `SPECKIT_PIPELINE_V2` is accepted but ignored. V1 pipeline was removed. This flag should be cleaned up -- it occupies developer mental space for no runtime effect. [SOURCE: search-flags.ts:109-115]

9. **Flag classification is fragmented -- no consistent categorization.** Flags fall into at least 7 implicit categories (search quality, graph, eval, cognitive, governance, indexing, save pipeline) but there is no enum, manifest, or documentation that maps flags to categories. A developer encountering SPECKIT_INTERFERENCE_SCORE would have to grep to discover what it does.

### Eval Infrastructure Scope (Q10 partial)

10. **The eval/ directory contains 18 files totaling ~200KB -- a substantial measurement subsystem.** Key components:
    - `ablation-framework.ts` (28KB) -- channel ablation study runner (R13-S3)
    - `bm25-baseline.ts` (23KB) -- BM25 standalone baseline for comparison
    - `reporting-dashboard.ts` (23KB) -- sprint/channel trend aggregation
    - `eval-metrics.ts` (20KB) -- core metric computation
    - `ground-truth-feedback.ts` (18KB) -- feedback-driven ground truth
    - `ground-truth-generator.ts` (13KB) -- synthetic ground truth generation
    - `shadow-scoring.ts` (14KB) -- shadow scoring for A/B comparison
    - `eval-db.ts` (7KB) -- evaluation database layer
    - `eval-logger.ts` (10KB) -- structured eval logging
    - `eval-quality-proxy.ts` (8KB) -- quality approximation without ground truth
    - `channel-attribution.ts` (8KB) -- per-channel contribution analysis
    - `k-value-analysis.ts` (8KB) -- K parameter sensitivity
    - `edge-density.ts` (8KB) -- graph edge density metrics
    - `eval-ceiling.ts` (16KB) -- theoretical ceiling analysis
    - `memory-state-baseline.ts` (8KB) -- memory state snapshots
    - `ground-truth-data.ts` (3KB) -- ground truth data types/loading
    - `data/` directory -- likely contains test fixtures
    [SOURCE: ls -la mcp_server/lib/eval/]

11. **The eval subsystem is gated by SPECKIT_ABLATION flag**, which is one of the 76 flags. The ablation framework and related eval tools require `SPECKIT_ABLATION=true` to run. This means eval is entirely opt-in and never runs in production search paths. [SOURCE: grep output showing SPECKIT_ABLATION references; also documented in memory_search MCP tool schema]

## Sources Consulted
- `mcp_server/lib/search/search-flags.ts` (full read, 252 lines)
- `mcp_server/lib/config/capability-flags.ts` (full read, 154 lines)
- `grep -ohr 'SPECKIT_[A-Z_0-9]*' across mcp_server/lib/ | sort -u` (76+ unique flag names)
- `ls -la mcp_server/lib/eval/` (18 files, ~200KB)
- grep for SPECKIT_ across lib/ (48.8KB of references)

## Assessment
- New information ratio: 0.91 (10 of 11 findings are fully new; finding 8 about PIPELINE_V2 dead code adds nuance to Q5 partial from iter-4 = 0.5 new)
- Questions addressed: Q9, Q10 (partial)
- Questions answered: Q9

## Reflection
- What worked and why: The `grep -ohr | sort -u` approach gave a complete flag census in one command, far more efficient than reading individual files. Reading search-flags.ts in full was the highest-ROI action -- it contains 23 flag definitions with JSDoc explaining default behavior and governance.
- What did not work and why: Dispatch context paths were wrong again (4th occurrence of shared/ vs mcp_server/ prefix). Cost 2 tool calls for Glob discovery.
- What I would do differently: For Q10 deep investigation, read eval-db.ts and ground-truth-data.ts to understand how eval connects to the search pipeline. Also check if any eval metrics are surfaced in production search responses.

## Recommended Next Focus
Iteration 8: Deep dive into Q10 (eval infrastructure). Read eval-db.ts and ground-truth-generator.ts to understand: (a) is eval connected to the pipeline or standalone? (b) what ground truth exists? (c) is the ablation framework actually usable? Also begin Q11 (save pipeline) by reading the handlers/save/ directory.
