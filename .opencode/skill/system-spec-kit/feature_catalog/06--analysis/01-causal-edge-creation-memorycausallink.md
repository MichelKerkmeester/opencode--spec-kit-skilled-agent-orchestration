---
title: "Causal edge creation (memory_causal_link)"
description: "Covers the causal edge creation tool that builds directed relationship edges between memories in the causal graph."
---

# Causal edge creation (memory_causal_link)

## 1. OVERVIEW

Covers the causal edge creation tool that builds directed relationship edges between memories in the causal graph.

This lets you draw a line between two memories to show they are related, like connecting pins on a corkboard with string. You can say one memory caused another, replaced another or contradicts another. These connections help the search system understand how ideas relate to each other and surface better results when you are tracing the history of a decision.

---

## 2. CURRENT REALITY

Creates a directed relationship edge between two memories in the causal graph. Six relationship types are supported: caused (this memory led to that one), enabled (this memory made that one possible), supersedes (this memory replaces that one), contradicts (these memories disagree), derived_from (this memory was produced from that one) and supports (this memory backs up that one).

Edge strength is a 0-1 float, clamped at both ends. Evidence text is optional but recommended because it explains why the relationship exists. If an edge with the same source, target and relation already exists, the system updates strength and evidence via `INSERT ... ON CONFLICT DO UPDATE` rather than creating a duplicate. That upsert behavior means you can call `memory_causal_link` repeatedly with updated evidence without worrying about edge proliferation.

Edge bounds are enforced at insert time. Auto-generated edges (those with `created_by='auto'`) are rejected when a node already has 20 edges (`MAX_EDGES_PER_NODE`) and clamped to a maximum strength of 0.5 (`MAX_AUTO_STRENGTH`). Every strength modification is logged to a `weight_history` table recording old strength, new strength, who changed it, when and why. The `created_by` and `last_accessed` fields on each edge track provenance and usage patterns.

A batch insert variant (`insertEdgesBatch()`) handles bulk edge creation during spec document indexing. The `createSpecDocumentChain()` function auto-links spec folder documents in a standard chain: spec causes plan, plan causes tasks, tasks cause implementation-summary. Checklist, decision-record and research documents get support relationships to the primary chain.

Reference resolution for auto-extracted causal links now batches all references from the memory file before insertion begins. The resolver tries numeric IDs first, then exact `canonical_file_path`/`file_path` equality using normalized path candidates, then exact title matches, and only falls back to fuzzy `LIKE` lookups for unresolved path or title references. That exact-first order reduces false-positive fuzzy resolutions and avoids rerunning separate lookup queries for each edge candidate.

---

## 3. SOURCE FILES

### Implementation

| File | Role |
|------|------|
| `mcp_server/handlers/causal-graph.ts` | MCP handler for `memory_causal_link` |
| `mcp_server/handlers/causal-links-processor.ts` | Causal link mutation handler: exact-first batched reference resolution, upsert, batch insert, spec document chain creation |
| `mcp_server/handlers/memory-index.ts` | Spec document indexing flow that calls `createSpecDocumentChain()` |
| `mcp_server/lib/storage/causal-edges.ts` | Causal edge storage: insert, upsert, weight_history logging, MAX_EDGES_PER_NODE enforcement |
| `mcp_server/lib/graph/graph-signals.ts` | Graph momentum and depth signals used by causal edge scoring |
| `mcp_server/lib/search/causal-boost.ts` | Causal boost scoring for edge-connected search results |
| `mcp_server/tools/causal-tools.ts` | Dispatches `memory_causal_link` to the causal graph handler |
| `mcp_server/schemas/tool-input-schemas.ts` | Zod input schemas for causal link arguments |
| `mcp_server/tool-schemas.ts` | MCP-visible JSON schema for `memory_causal_link` |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/causal-edges-unit.vitest.ts` | Causal edge unit tests |
| `mcp_server/tests/causal-edges.vitest.ts` | Causal edge storage tests |
| `mcp_server/tests/full-spec-doc-indexing.vitest.ts` | Full spec doc indexing with causal chains |
| `mcp_server/tests/graph-signals.vitest.ts` | Graph signal computation tests |
| `mcp_server/tests/causal-boost.vitest.ts` | Causal boost scoring tests |

---

## 4. MANUAL PLAYBOOK COVERAGE

| Scenario | Role |
|----------|------|
| `EX-019` | Direct manual validation for causal edge creation and immediate trace visibility |

---

## 5. SOURCE METADATA

- Group: Analysis
- Source feature title: Causal edge creation (memory_causal_link)
- Current reality source: FEATURE_CATALOG.md
