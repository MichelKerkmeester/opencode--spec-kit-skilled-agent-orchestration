# Dead code removal

## Current Reality

Approximately 360 lines of dead code were removed across four categories:

**Hot-path dead branches (~80 lines):** Dead RSF branch and dead shadow-scoring branch removed from `hybrid-search.ts`. Both were guarded by feature flag functions that always returned `false`.

**Dead feature flag functions:** `isShadowScoringEnabled()` removed from `shadow-scoring.ts` and `search-flags.ts`. `isRsfEnabled()` removed from `rsf-fusion.ts`. `isInShadowPeriod()` in `learned-feedback.ts` remains active as the R11 shadow-period safeguard and was not removed.

**Dead module-level state:** `stmtCache` Map (archival-manager.ts — never populated), `lastComputedAt` (community-detection.ts — set but never read), `activeProvider` cache (cross-encoder.ts — never populated), `flushCount` (access-tracker.ts — never incremented), 3 dead config fields in working-memory.ts (`decayInterval`, `attentionDecayRate`, `minAttentionScore`).

**Dead functions and exports:** `computeCausalDepth` single-node variant (graph-signals.ts — batch version is the only caller), `getSubgraphWeights` (graph-search-fn.ts — always returned 1.0, replaced with inline constant), `RECOVERY_HALF_LIFE_DAYS` (negative-feedback.ts — never imported), `'related'` weight entry (causal-edges.ts — invalid relation type), `logCoActivationEvent` and `CoActivationEvent` (co-activation.ts — never called).

**Preserved (NOT dead):** `computeStructuralFreshness` and `computeGraphCentrality` in `fsrs.ts` were identified as planned architectural components (not concluded experiments) and retained.

## Source Metadata

- Group: Comprehensive remediation (Sprint 8)
- Source feature title: Dead code removal
- Current reality source: feature_catalog.md
