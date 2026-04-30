---
title: "CocoIndex bridge and code_graph_context"
description: "CocoIndex bridge resolves semantic search results to code graph nodes, preserves seed fidelity, and exposes blocked or partial context outcomes."
---

# CocoIndex bridge and code_graph_context

## 1. OVERVIEW

CocoIndex bridge resolves semantic search results to code graph nodes and expands into LLM-oriented neighborhoods.

Seed resolver normalizes CocoIndex file:line results to `ArtifactRef` via resolution chain: exact symbol, near-exact symbol, enclosing symbol, file anchor. `code_graph_context` preserves CocoIndex seed fidelity across both `file` and `filePath` inputs so provider metadata such as `source`, `score`, `snippet`, and `range` survive into resolved anchors. Anchors now also passthrough `rawScore`, `pathClass`, and `rankingSignals` from the vendored cocoindex_code fork (snake_case wire names `raw_score`, `path_class`, `rankingSignals` are normalized to camelCase). The fields are pure additive metadata: anchor scoring, ordering, and confidence are unchanged, and anchors are byte-equal to the pre-patch baseline when the seed does not carry the fields. The fork itself emits seven additional telemetry fields visible to the bridge: seed-side `path_class`, `raw_score`, `rankingSignals`, `source_realpath`, `content_hash`, plus result-set-side `dedupedAliases` and `uniqueResultCount`. When readiness requires a suppressed full scan, the handler returns an explicit blocked payload instead of degraded graph answers. Successful responses still expand resolved anchors in 3 modes: neighborhood (1-hop), outline (file symbols), and impact (reverse callers plus reverse imports), and now expose structured `metadata.partialOutput` fields for deadline or budget omissions.

---

## 2. CURRENT REALITY

mcp_server/code_graph/lib/seed-resolver.ts

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/code_graph/lib/seed-resolver.ts` | Lib | Resolves CocoIndex file-range hits to graph anchors or file-level fallbacks |
| `mcp_server/code_graph/lib/code-graph-context.ts` | Lib | Expands resolved seeds into structural neighborhoods and reports structured partial-output metadata |
| `mcp_server/code_graph/handlers/context.ts` | Handler | Exposes `code_graph_context`, preserves CocoIndex seed fidelity, and returns blocked-read payloads when full scans are required |

### Validation And Tests

| File | Focus |
|------|-------|
| `mcp_server/code_graph/tests/code-graph-seed-resolver.vitest.ts` | Seed resolution across exact-symbol, enclosing-symbol, and file-anchor fallbacks |
| `mcp_server/code_graph/tests/code-graph-context-handler.vitest.ts` | CocoIndex seed fidelity, blocked full-scan responses, and structured `partialOutput` metadata |
| `mcp_server/tests/code-graph-context-cocoindex-telemetry-passthrough.vitest.ts` | Snake-case wire, camelCase internal, missing-field byte-equal baseline, no double rerank |

---

## 4. SOURCE METADATA
- Group: Context Preservation And Code Graph
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `22--context-preservation-and-code-graph/09-cocoindex-bridge-context.md`
