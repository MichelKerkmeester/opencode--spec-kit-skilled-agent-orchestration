# Unified graph retrieval, deterministic ranking, explainability, and rollback

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)
- [5. PLAYBOOK COVERAGE](#5--playbook-coverage)
- [6. IN SIMPLE TERMS](#6--in-simple-terms)

## 1. OVERVIEW

Describes the Phase 3 unified graph retrieval path with deterministic ranking contracts, trace-based explainability and runtime rollback via the `SPECKIT_GRAPH_UNIFIED` gate.

## 2. CURRENT REALITY

Phase 3 finalized a unified graph retrieval path in the live pipeline. Stage 2 fusion and Stage 3 rerank now share a stable ranking contract so repeated identical queries keep deterministic ordering, including tie-break behavior.

Explainability is exposed through retrieval trace payloads: graph-side contributions are emitted as explicit trace metadata when graph participation is enabled. This keeps ranking rationale inspectable without changing the public search result contract.

Rollback is controlled by the runtime graph gate (`SPECKIT_GRAPH_UNIFIED`). Disabling the gate removes graph-side effects while preserving deterministic baseline ordering and trace safety for non-graph runs.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/pipeline/stage2-fusion.ts` | Lib | Unified graph contribution during Stage 2 fusion |
| `mcp_server/lib/search/pipeline/stage3-rerank.ts` | Lib | Deterministic rerank and tie-break stabilization |
| `mcp_server/lib/search/pipeline/ranking-contract.ts` | Lib | Shared ranking contract and score resolution invariants |
| `mcp_server/lib/telemetry/retrieval-telemetry.ts` | Lib | Trace-safe explainability and retrieval telemetry metadata |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/graph-roadmap-finalization.vitest.ts` | Unified graph behavior, deterministic ranking, explainability, and rollback switch behavior |

## 4. SOURCE METADATA

- Group: Graph signal activation
- Source feature title: Unified graph retrieval, deterministic ranking, explainability, and rollback
- Current reality source: Phase 015 implementation

## 5. PLAYBOOK COVERAGE

- Mapped to manual testing playbook scenario NEW-120

## 6. IN SIMPLE TERMS

This brings all the graph-based search features together into one reliable path. The same query will always return results in the same order, and you can see exactly why each result ranked where it did. If anything goes wrong with the graph features, a single switch turns them off and search falls back to working without them. Think of it as a well-labeled control panel with an emergency off switch.
