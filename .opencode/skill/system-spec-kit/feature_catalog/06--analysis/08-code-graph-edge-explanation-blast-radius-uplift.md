---
title: "Code Graph edge explanation and blast radius uplift"
description: "Covers Code Graph edge explanation metadata and enriched blast_radius analysis output."
---

# Code Graph edge explanation and blast radius uplift

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Covers Code Graph edge explanation metadata and enriched `blast_radius` analysis output.

This feature gives Code Graph consumers more audit detail for structural relationships. Edges carry graph-local `reason` and `step` values beside the existing confidence, detector provenance and evidence class fields. Blast-radius responses keep their existing file-oriented output while also returning depth groups, a risk level, optional minimum-confidence traversal and structured fallback details.

<!-- /ANCHOR:overview -->

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

The structural indexer writes `reason` and `step` into the existing `code_edges.metadata` JSON blob. The SQLite `code_edges` table is unchanged.

Relationship queries now surface `reason` and `step` for each returned edge. `code_graph_context` also preserves those fields in structured context edges and includes them in compact relationship text when present.

`blast_radius` keeps the prior `nodes`, `affectedFiles`, `sourceFiles`, `hotFileBreadcrumbs`, `multiFileUnion`, `unionMode` and `maxDepth` fields. It adds `depthGroups`, `riskLevel`, `minConfidence`, `ambiguityCandidates` and `failureFallback`. The risk rule is graph-local: high when ambiguity exists or depth-one fanout exceeds ten, medium when depth-one fanout is four through ten, and low when depth-one fanout is three or less.

When a symbol subject resolves to multiple graph nodes, the response returns ambiguity candidates and a structured fallback instead of choosing a default node. Failed blast-radius resolution also returns `failureFallback` with any partial result available.

<!-- /ANCHOR:current-reality -->

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Role |
|------|------|
| `mcp_server/code_graph/lib/structural-indexer.ts` | Writes `reason` and `step` into edge metadata JSON |
| `mcp_server/code_graph/handlers/query.ts` | Surfaces edge explanations and enriched blast-radius output |
| `mcp_server/code_graph/lib/code-graph-context.ts` | Carries edge explanation fields into context payloads |
| `mcp_server/code_graph/lib/code-graph-db.ts` | Schema reference showing unchanged `code_edges.metadata` JSON column |

### Validation And Tests

| File | Focus |
|------|-------|
| `mcp_server/code_graph/tests/code-graph-indexer.vitest.ts` | Edge metadata reason and step emission |
| `mcp_server/code_graph/tests/code-graph-query-handler.vitest.ts` | Blast-radius risk, filtering, ambiguity and fallback behavior |
| `mcp_server/code_graph/tests/code-graph-context-handler.vitest.ts` | Context payload propagation for edge explanations |

<!-- /ANCHOR:source-files -->

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Analysis
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `06--analysis/08-code-graph-edge-explanation-blast-radius-uplift.md`

- Group: Analysis
- Source feature title: Code Graph edge explanation and blast radius uplift
- Current reality source: FEATURE_CATALOG.md
- Feature file path: `06--analysis/08-code-graph-edge-explanation-blast-radius-uplift.md`

### MANUAL PLAYBOOK COVERAGE

| Scenario | Role |
|----------|------|
| `EX-026` | Manual validation for edge explanation display and blast-radius impact fields |

<!-- /ANCHOR:source-metadata -->
