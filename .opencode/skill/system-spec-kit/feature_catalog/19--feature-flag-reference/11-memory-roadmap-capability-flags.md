---
title: "Memory roadmap capability flags (SPECKIT_MEMORY_*)"
description: "Feature flag reference for canonical roadmap capability resolvers and legacy Hydra alias precedence."
audited_post_018: true
phase_018_change: added dedicated catalog companion for playbook 125
---

# Memory roadmap capability flags (SPECKIT_MEMORY_*)

This document captures the implemented behavior, source references, and validation scope for the memory roadmap capability resolvers. It keeps the canonical `SPECKIT_MEMORY_*` keys together with their legacy `SPECKIT_HYDRA_*` aliases so the roadmap metadata contract stays separate from live runtime gates.

---

## 1. OVERVIEW

This feature-reference file mirrors the feature-catalog snippet pattern: a concise overview of the roadmap capability family, the live current-reality table, and the source metadata needed to keep docs and runtime behavior aligned.

These entries describe roadmap metadata, not the main search/runtime controls. Canonical `SPECKIT_MEMORY_*` values win when both families are present, while live runtime gates such as `SPECKIT_GRAPH_UNIFIED` remain distinct from the roadmap snapshot contract.

---

## 2. CURRENT REALITY

| Name | Default | Type | Source File | Description |
|---|---|---|---|---|
| `SPECKIT_MEMORY_ROADMAP_PHASE` / `SPECKIT_HYDRA_PHASE` | `shared-rollout` | string | `lib/config/capability-flags.ts` | Canonical phase-label resolver for roadmap snapshots. The canonical key wins first, and unsupported values fall back to `shared-rollout`. |
| `SPECKIT_MEMORY_LINEAGE_STATE` / `SPECKIT_HYDRA_LINEAGE_STATE` | `true` | boolean | `lib/config/capability-flags.ts` | Default-on lineage metadata flag for roadmap snapshots and rename-window compatibility paths. |
| `SPECKIT_MEMORY_GRAPH_UNIFIED` / `SPECKIT_HYDRA_GRAPH_UNIFIED` | `true` | boolean | `lib/config/capability-flags.ts` | Roadmap metadata for the unified-graph milestone. This stays separate from the live `SPECKIT_GRAPH_UNIFIED` retrieval gate. |
| `SPECKIT_MEMORY_ADAPTIVE_RANKING` / `SPECKIT_HYDRA_ADAPTIVE_RANKING` | `false` | boolean | `lib/config/capability-flags.ts`, `mcp_server/lib/cognitive/adaptive-ranking.ts` | Default-off adaptive-ranking roadmap flag. When enabled, the runtime can enter shadow or promoted adaptive ranking modes, but the roadmap metadata remains the source of truth here. |
| `SPECKIT_MEMORY_SCOPE_ENFORCEMENT` / `SPECKIT_HYDRA_SCOPE_ENFORCEMENT` | `true` | boolean | `lib/config/capability-flags.ts` | Default-on scope-enforcement metadata for governed retrieval and compatibility snapshots. |
| `SPECKIT_MEMORY_GOVERNANCE_GUARDRAILS` / `SPECKIT_HYDRA_GOVERNANCE_GUARDRAILS` | `true` | boolean | `lib/config/capability-flags.ts` | Default-on governance-guardrails metadata for governed ingest and compatibility snapshots. |
| `SPECKIT_MEMORY_SHARED_MEMORY` / `SPECKIT_HYDRA_SHARED_MEMORY` | `false` | boolean | `lib/config/capability-flags.ts`, `mcp_server/lib/collab/shared-spaces.ts` | Default-off shared-memory metadata. Explicit enablement still requires the shared-memory runtime path, and canonical values take precedence over legacy aliases. |

Roadmap capability entries are evaluated at call time, not frozen import-time. That means canonical `SPECKIT_MEMORY_*` values override legacy `SPECKIT_HYDRA_*` aliases whenever both are set, and the roadmap snapshot stays distinct from live runtime defaults.

---

## 3. SOURCE FILES

Source file references are included in the flag table above.

---

## 4. SOURCE METADATA

- Group: Feature Flag Reference
- Source feature title: Memory roadmap capability flags (SPECKIT_MEMORY_*)
- Current reality source: `mcp_server/lib/config/capability-flags.ts`
