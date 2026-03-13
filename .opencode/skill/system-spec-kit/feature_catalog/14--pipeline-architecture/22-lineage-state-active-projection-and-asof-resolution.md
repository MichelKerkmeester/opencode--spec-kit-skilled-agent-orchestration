# Lineage state active projection and asOf resolution

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)
- [5. PLAYBOOK COVERAGE](#5--playbook-coverage)

## 1. OVERVIEW

This document captures the implemented behavior, source references, and validation scope for Lineage state active projection and asOf resolution.

## 2. CURRENT REALITY

Phase 2 introduced versioned lineage state as a first-class storage primitive. Save-time writes append immutable lineage rows, while a deterministic active projection resolves which row is currently effective for a memory.

The active projection supports deterministic `asOf` resolution: for any timestamp, the runtime selects the latest valid lineage state at or before that point. This enables time-consistent retrieval, deterministic rollback planning, and predictable replay behavior for migration and audit workflows.

Schema support is now part of vector index setup, and save handlers integrate lineage writes so append-first lineage history and active projection stay synchronized.

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

## 4. SOURCE METADATA

- Group: Pipeline architecture
- Source feature title: Lineage state active projection and asOf resolution
- Current reality source: Phase 015 implementation

## 5. PLAYBOOK COVERAGE

- Mapped to manual testing playbook scenarios NEW-129 and NEW-130
