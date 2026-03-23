---
title: "Lineage state active projection and asOf resolution"
description: "Lineage state active projection appends immutable lineage rows at save time and resolves the currently effective state via deterministic `asOf` timestamp lookup."
---

# Lineage state active projection and asOf resolution

## 1. OVERVIEW

Lineage state active projection appends immutable lineage rows at save time and resolves the currently effective state via deterministic `asOf` timestamp lookup.

Every time a memory is saved, the system adds a timestamped record of that change to a history log. When you need to know what a memory looked like at a specific point in the past, the system can look up the history and give you the exact version from that moment. Think of it as a timeline for each memory that you can rewind to any date, useful for understanding what changed and when.

---

## 2. CURRENT REALITY

Phase 2 introduced versioned lineage state as a first-class storage primitive. Save-time writes append immutable lineage rows, while a deterministic active projection resolves which row is currently effective for a memory.

The active projection supports deterministic `asOf` resolution: for any timestamp, the runtime selects the latest valid lineage state at or before that point. Transition validation now compares parsed epoch timestamps, not raw strings, so non-ISO formatting or timezone variants cannot be misordered during predecessor checks. This enables time-consistent retrieval, deterministic rollback planning and predictable replay behavior for migration and audit workflows.

Schema support is now part of vector index setup, and save handlers integrate lineage writes so append-first lineage history and active projection stay synchronized.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/storage/lineage-state.ts` | Lib | Lineage append, active projection resolution, and `asOf` lookup |
| `mcp_server/lib/search/vector-index-schema.ts` | Lib | Lineage schema creation and compatibility checks |
| `mcp_server/handlers/memory-save.ts` | Handler | Save-path integration for lineage writes and projection updates |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/memory-lineage-state.vitest.ts` | Active projection and deterministic `asOf` selection |
| `mcp_server/tests/memory-lineage-backfill.vitest.ts` | Backfill planning, idempotent apply, and rollback restore behavior |

---

## 4. SOURCE METADATA

- Group: Pipeline architecture
- Source feature title: Lineage state active projection and asOf resolution
- Current reality source: Phase 015 implementation

---

## 5. PLAYBOOK COVERAGE

- Mapped to manual testing playbook scenarios 129 and 130
