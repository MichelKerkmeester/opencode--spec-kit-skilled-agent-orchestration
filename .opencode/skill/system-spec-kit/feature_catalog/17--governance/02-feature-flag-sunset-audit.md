# Feature flag sunset audit

## 1. OVERVIEW

The feature flag sunset audit inventoried 79 `SPECKIT_` flags and classified them for graduation, removal or retention.

This audit went through all 79 feature switches in the system and decided the fate of each one. Most were ready to become permanent (switch removed, feature stays on). Some were dead and got deleted. A few remain as active controls. Without this cleanup, the system would accumulate unused switches that confuse anyone trying to understand what is actually running.

---

## 2. CURRENT REALITY

A comprehensive audit at Sprint 7 exit found 79 unique `SPECKIT_` flags across the codebase. Disposition: 27 flags are ready to graduate to permanent-ON defaults (removing the flag check), 9 flags are identified as dead code for removal and 3 flags remain as active operational knobs (`ADAPTIVE_FUSION`, `COACTIVATION_STRENGTH`, `PRESSURE_POLICY`).

The current active flag-helper inventory in `search-flags.ts` is 24 exported `is*` functions (including the deprecated `isPipelineV2Enabled()` compatibility shim and the newly added `isQualityLoopEnabled()`). Sprint 0 core flags remain default ON, sprint-graduated flags from Sprints 3-6 remain default ON and deferred-feature flags (including GRAPH_SIGNALS, COMMUNITY_DETECTION, MEMORY_SUMMARIES, AUTO_ENTITIES and ENTITY_LINKING) are now default ON. `SPECKIT_ABLATION` remains default OFF as an opt-in evaluation tool.

**Phase 017 update:** `SPECKIT_PIPELINE_V2` is now deprecated. `isPipelineV2Enabled()` always returns `true` regardless of the env var. The legacy V1 pipeline code was removed, making the env var a no-op.

**Sprint 8 update:** Flag graduation and dead code removal have been completed. The Sprint 8 comprehensive remediation removed a large dead-code slice including: dead feature flag branches in `hybrid-search.ts` (RSF and shadow-scoring), dead feature flag functions (`isShadowScoringEnabled`, `isRsfEnabled`), dead module-level state (`stmtCache`, `lastComputedAt`, `activeProvider`, `flushCount`, 3 dead config fields in `working-memory.ts`) and dead functions/exports (`computeCausalDepth` single-node variant, `getSubgraphWeights`, `RECOVERY_HALF_LIFE_DAYS`, `logCoActivationEvent`). `isInShadowPeriod` in learned feedback remains active as Safeguard #6. See [Comprehensive remediation (Sprint 8)](#comprehensive-remediation-sprint-8) for the full accounting.

---

## 3. SOURCE FILES

No dedicated source files. This describes governance process controls.

---

## 4. SOURCE METADATA

- Group: Governance
- Source feature title: Feature flag sunset audit
- Current reality source: feature_catalog.md
