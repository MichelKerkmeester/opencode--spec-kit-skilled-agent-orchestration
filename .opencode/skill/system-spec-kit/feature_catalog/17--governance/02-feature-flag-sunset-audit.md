---
title: "Feature flag sunset audit"
description: "Historical record of the Sprint 7 sunset audit whose graduation and dead-code actions were completed in Sprint 8."
---

# Feature flag sunset audit

## 1. OVERVIEW

Completed historical audit. The feature flag sunset audit inventoried 79 `SPECKIT_` flags and drove the graduation and removal work that landed in Sprint 8.

This audit reviewed the feature-switch surface, classified what should graduate, what should be removed and what should remain configurable, then handed those decisions off to remediation. The audit itself is not an active runtime feature. It is retained here as governance history because it explains why several legacy flag gates disappeared and why some compatibility flags are now inert.

---

## 2. CURRENT REALITY

A comprehensive audit at Sprint 7 exit found 79 unique `SPECKIT_` flags across the codebase. Its disposition buckets were historical planning inputs: 27 flags were marked for graduation to permanent-ON defaults, 9 were marked as dead code for removal and 2 were tracked as operational knobs (`COACTIVATION_STRENGTH`, `PRESSURE_POLICY`). Those audit actions have since been completed or superseded. `ADAPTIVE_FUSION` graduated to always-on behavior and is no longer counted as an active knob.

The current active flag-helper inventory in `search-flags.ts` is 53 exported `is*` functions. There is no `isPipelineV2Enabled()` function; the helper was removed along with the legacy V1 pipeline. Sprint 0 core flags remain default ON, sprint-graduated flags from Sprints 3-6 remain default ON and deferred-feature flags (including GRAPH_SIGNALS, COMMUNITY_DETECTION, MEMORY_SUMMARIES, AUTO_ENTITIES and ENTITY_LINKING) are now default ON. `SPECKIT_ABLATION` remains default OFF as an opt-in evaluation tool.

**Pipeline status:** The 4-stage pipeline is the sole runtime path. The `SPECKIT_PIPELINE_V2` environment variable is not consumed by runtime code.

**Sprint 8 update:** The graduation and dead-code removal work identified by this audit has already been completed. Sprint 8 comprehensive remediation removed a large dead-code slice including dead feature flag branches in `hybrid-search.ts` (RSF and shadow-scoring), dead feature flag functions (`isShadowScoringEnabled`, `isRsfEnabled`), dead module-level state (`stmtCache`, `lastComputedAt`, `activeProvider`, `flushCount`, 3 dead config fields in `working-memory.ts`) and dead functions and exports (`computeCausalDepth` single-node variant, `getSubgraphWeights`, `RECOVERY_HALF_LIFE_DAYS`, `logCoActivationEvent`). `isInShadowPeriod` in learned feedback remains active as Safeguard #6.

---

## 3. SOURCE FILES

No dedicated source files. This describes governance process controls.

---

## 4. SOURCE METADATA

- Group: Governance
- Source feature title: Feature flag sunset audit
- Current reality source: FEATURE_CATALOG.md
