# Feature flag sunset audit

## Current Reality

A comprehensive audit at Sprint 7 exit found 61 unique `SPECKIT_` flags across the codebase. Disposition: 27 flags are ready to graduate to permanent-ON defaults (removing the flag check), 9 flags are identified as dead code for removal and 3 flags remain as active operational knobs (`ADAPTIVE_FUSION`, `COACTIVATION_STRENGTH`, `PRESSURE_POLICY`).

The current active flag inventory stands at 20 flags in `search-flags.ts`. Sprint 0 core flags remain default ON, sprint-graduated flags from Sprints 3-6 remain default ON, and deferred-feature flags (including GRAPH_SIGNALS, COMMUNITY_DETECTION, MEMORY_SUMMARIES, AUTO_ENTITIES and ENTITY_LINKING) are now default ON. One flag (`SPECKIT_SHADOW_SCORING`) is hardcoded OFF and scheduled for removal, while `SPECKIT_ABLATION` remains default OFF as an opt-in evaluation tool.

**Phase 017 update:** `SPECKIT_PIPELINE_V2` is now deprecated. `isPipelineV2Enabled()` always returns `true` regardless of the env var. The legacy V1 pipeline code was removed, making the env var a no-op.

**Sprint 8 update:** Flag graduation and dead code removal have been completed. The Sprint 8 comprehensive remediation removed ~360 lines of dead code including: dead feature flag branches in `hybrid-search.ts` (RSF and shadow-scoring), dead feature flag functions (`isShadowScoringEnabled`, `isRsfEnabled`), dead module-level state (`stmtCache`, `lastComputedAt`, `activeProvider`, `flushCount`, 3 dead config fields in `working-memory.ts`), and dead functions/exports (`computeCausalDepth` single-node variant, `getSubgraphWeights`, `RECOVERY_HALF_LIFE_DAYS`, `logCoActivationEvent`). `isInShadowPeriod` in learned feedback remains active as Safeguard #6. See [Comprehensive remediation (Sprint 8)](#comprehensive-remediation-sprint-8) for the full accounting.

---

## Source Metadata

- Group: Governance
- Source feature title: Feature flag sunset audit
- Summary match found: Yes
- Summary source feature title: Feature flag sunset audit
- Current reality source: feature_catalog.md
