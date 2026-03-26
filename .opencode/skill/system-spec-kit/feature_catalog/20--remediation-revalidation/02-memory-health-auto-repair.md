---
title: "Memory health auto-repair"
description: "Documents the confirmed repair path behind `memory_health`, including FTS rebuilds, trigger-cache refreshes, and orphan cleanup for causal edges, vectors, and chunks."
---

# Memory health auto-repair

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

## 1. OVERVIEW

Documents the confirmed repair path behind `memory_health`, including FTS rebuilds, trigger-cache refreshes, and orphan cleanup for causal edges, vectors, and chunks.

This remediation flow turns `memory_health` from a read-only diagnostic into a guarded repair entry point. It does not silently mutate the database: callers must opt in with `autoRepair: true` and explicitly confirm the action before any repair step runs.

---

## 2. CURRENT REALITY

`memory_health` exposes auto-repair only in full-report mode. If a caller sets `autoRepair: true` without `confirmed: true`, the handler returns a confirmation-required success envelope with the planned actions (`fts_rebuild`, `trigger_cache_refresh`, `orphan_edges_cleanup`, `orphan_vector_cleanup`) and performs no mutation.

Once confirmed, the handler runs a staged repair sequence. First it compares row counts between `memory_index` and `memory_fts`; if the counts diverge, it issues the SQLite FTS rebuild command and immediately refreshes the trigger cache so lexical and trigger lookups stay aligned with the rebuilt index. Next it initializes the causal-edge store and removes orphaned causal edges that reference deleted memories.

The final repair stage delegates to vector-index integrity checks. `verifyIntegrity({ autoClean: true })` removes orphaned vectors and orphaned chunks, then a second `verifyIntegrity({ autoClean: false })` pass records whether degradation remains. Residual issues are preserved as warnings instead of being hidden; the handler reports remaining orphaned vectors, missing vectors, orphaned files, and orphaned chunks after cleanup.

Repair outcomes are returned in structured metadata rather than implied by the summary string. The response includes `repair.requested`, `repair.attempted`, `repair.repaired`, `repair.partialSuccess`, `repair.actions`, `repair.warnings`, and `repair.errors`. A run is marked as partial success when at least one repair action succeeds and at least one fails. Current tests cover clean FTS recovery, partial success when FTS mismatch persists, partial success when the FTS consistency check throws but orphan-edge cleanup still succeeds, and vector cleanup that deliberately preserves orphaned file rows under temp-root workspaces while still removing orphaned vectors.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `mcp_server/handlers/memory-crud-health.ts` | Handler | Implements `memory_health`, confirmation gating, FTS rebuild, trigger-cache refresh, repair bookkeeping, and health response metadata |
| `mcp_server/lib/parsing/trigger-matcher.ts` | Lib | Provides the trigger-cache refresh invoked after FTS rebuilds |
| `mcp_server/lib/search/vector-index.ts` | Lib | Exposes database access, integrity verification, vector availability, and database-path metadata used by the handler |
| `mcp_server/lib/storage/causal-edges.ts` | Lib | Initializes the causal-edge store and removes orphaned edges during auto-repair |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/memory-crud-extended.vitest.ts` | Integration | Verifies confirmed FTS repair, partial-success semantics, orphan-edge cleanup, and orphaned vector cleanup behavior |
| `mcp_server/tests/tool-input-schema.vitest.ts` | Schema | Confirms `memory_health` accepts the `autoRepair` plus `confirmed` payload shape |

---

## 4. SOURCE METADATA

- Group: Remediation and Revalidation
- Source feature title: Memory health auto-repair
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `20--remediation-revalidation/02-memory-health-auto-repair.md`
- Source spec: Deep research remediation 2026-03-26
- Current reality source: direct implementation audit
