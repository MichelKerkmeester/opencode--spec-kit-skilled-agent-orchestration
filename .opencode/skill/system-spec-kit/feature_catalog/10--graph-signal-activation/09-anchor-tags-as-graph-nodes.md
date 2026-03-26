---
title: "ANCHOR tags as graph nodes"
description: "**STATUS: PLANNED/DEFERRED -- NOT IMPLEMENTED.** This feature has not been implemented yet."
---

# ANCHOR tags as graph nodes

## 1. OVERVIEW

**STATUS: PLANNED/DEFERRED -- NOT IMPLEMENTED.** This feature has not been implemented yet and is a future roadmap item. It is explicitly excluded from current test coverage.

Records the deferred plan to promote parsed ANCHOR markers into typed graph nodes, pending a dedicated 2-day feasibility spike.

Anchor markers are labels placed inside memories to highlight important sections. This planned feature would turn those labels into connection points in the knowledge graph, letting the system link specific parts of different memories together instead of just linking whole memories. It has been put on hold pending further investigation into whether the added complexity is worthwhile.

**Test coverage note:** Playbook scenario 091 tests graph centrality and community detection (N2). The ANCHOR-as-node aspect of that scenario is excluded from current pass criteria because this feature does not exist. The test in `anchor-metadata.vitest.ts` actively guards against edge creation to confirm the feature is NOT present. Scenario 091 passes based solely on the implemented N2 features (momentum, depth, community).

---

## 2. CURRENT REALITY

**PLANNED/DEFERRED -- NOT ACTIVE.** This feature has not been implemented. Promoting parsed ANCHOR markers into typed graph nodes (most creative insight from cross-AI research, Gemini-2) is deferred behind a dedicated 2-day feasibility spike. Estimated effort: S-M (3-5 days). No code exists for graph-node promotion; the source files listed below handle anchor parsing and metadata extraction only, not graph-node creation.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/chunking/anchor-chunker.ts` | Lib | Anchor-aware chunking |
| `mcp_server/lib/search/anchor-metadata.ts` | Lib | Anchor metadata extraction |
| `mcp_server/lib/search/pipeline/types.ts` | Lib | Type definitions |
| `shared/contracts/retrieval-trace.ts` | Shared | Retrieval trace contract |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/anchor-metadata.vitest.ts` | Anchor metadata tests |
| `mcp_server/tests/memory-types.vitest.ts` | Memory type tests |
| `mcp_server/tests/retrieval-trace.vitest.ts` | Retrieval trace tests |
| `mcp_server/tests/unit-composite-scoring-types.vitest.ts` | Scoring type tests |
| `mcp_server/tests/unit-folder-scoring-types.vitest.ts` | Folder scoring type tests |
| `mcp_server/tests/unit-tier-classifier-types.vitest.ts` | Tier classifier types |
| `mcp_server/tests/unit-transaction-metrics-types.vitest.ts` | Transaction metric types |

---

## 4. SOURCE METADATA

- Group: Extra features (Sprint 019)
- Source feature title: ANCHOR tags as graph nodes
- Current reality source: FEATURE_CATALOG.md
