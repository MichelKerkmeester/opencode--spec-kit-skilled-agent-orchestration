---
title: "Memory roadmap capability flags (SPECKIT_MEMORY_*)"
description: "Feature flag reference for the live memory roadmap capability resolvers."
---

# Memory roadmap capability flags (SPECKIT_MEMORY_*)

This document captures the implemented behavior, source references, and validation scope for the spec-doc record roadmap capability resolvers. The roadmap metadata contract stays separate from live runtime gates such as `SPECKIT_GRAPH_UNIFIED`.

---

## 1. OVERVIEW

This feature-reference file mirrors the feature-catalog snippet pattern: a concise overview of the roadmap capability family, the live current-reality table, and the source metadata needed to keep docs and runtime behavior aligned.

These entries describe roadmap metadata, not the main search/runtime controls. Live runtime gates such as `SPECKIT_GRAPH_UNIFIED` remain distinct from the roadmap snapshot contract.

---

## 2. CURRENT REALITY

| Name | Default | Type | Source File | Description |
|---|---|---|---|---|
| `SPECKIT_MEMORY_ROADMAP_PHASE` | `scope-governance` | string | `lib/config/capability-flags.ts` | Phase-label resolver for roadmap snapshots. Unsupported values fall back to `scope-governance`. |
| `SPECKIT_MEMORY_LINEAGE_STATE` | `true` | boolean | `lib/config/capability-flags.ts` | Default-on lineage metadata flag for roadmap snapshots. |
| `SPECKIT_MEMORY_GRAPH_UNIFIED` | `true` | boolean | `lib/config/capability-flags.ts` | Roadmap metadata for the unified-graph milestone. This stays separate from the live `SPECKIT_GRAPH_UNIFIED` retrieval gate. |
| `SPECKIT_MEMORY_ADAPTIVE_RANKING` | `false` | boolean | `lib/config/capability-flags.ts`, `mcp_server/lib/cognitive/adaptive-ranking.ts` | Default-off adaptive-ranking roadmap flag. When enabled, the runtime can enter shadow or promoted adaptive ranking modes, but the roadmap metadata remains the source of truth here. |

Roadmap capability entries are evaluated at call time, not frozen import-time, and the roadmap snapshot stays distinct from live runtime defaults.

---

## 3. SOURCE FILES

Source file references are included in the flag table above.

---

## 4. SOURCE METADATA
- Group: Feature Flag Reference
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `19--feature-flag-reference/11-memory-roadmap-capability-flags.md`
