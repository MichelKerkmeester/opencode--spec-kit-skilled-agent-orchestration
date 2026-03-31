---
title: "Template anchor optimization"
description: "Template anchor optimization parses anchor markers in memory files and attaches semantic type metadata to pipeline rows without modifying scores."
---

# Template anchor optimization

## 1. OVERVIEW

Template anchor optimization parses anchor markers in memory files and attaches semantic type metadata to pipeline rows without modifying scores.

Memory files contain hidden markers that label sections as things like "decision" or "summary." This feature reads those markers and attaches the labels to search results as extra information. It does not change how results are ranked. It just adds useful tags so that later steps in the pipeline know what kind of content they are looking at.

---

## 2. CURRENT REALITY

Anchor markers in memory files (structured sections like `<!-- ANCHOR:state -->`) are parsed and attached as metadata to search pipeline rows. The module extracts anchor IDs and derives semantic types from structured IDs (for example, `DECISION-pipeline-003` yields type `DECISION`). Simple IDs like `summary` pass through as-is.

This is a pure annotation step wired into Stage 2 as step 8. It never modifies any score fields. The enrichment makes Stage 3 (rerank) and Stage 4 (filter) anchor-aware without score side-effects. No feature flag. Always active.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/anchor-metadata.ts` | Lib | Anchor metadata extraction |
| `mcp_server/lib/search/pipeline/types.ts` | Lib | Type definitions |
| `shared/contracts/retrieval-trace.ts` | Shared | Retrieval trace contract |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/anchor-metadata.vitest.ts` | Anchor metadata tests |
| `mcp_server/tests/memory-types.vitest.ts` | Memory type tests |
| `mcp_server/tests/pipeline-architecture-remediation.vitest.ts` | Direct audit traceability coverage for anchor metadata ownership |
| `mcp_server/tests/retrieval-trace.vitest.ts` | Retrieval trace tests |
| `mcp_server/tests/unit-composite-scoring-types.vitest.ts` | Scoring type tests |
| `mcp_server/tests/unit-folder-scoring-types.vitest.ts` | Folder scoring type tests |
| `mcp_server/tests/unit-tier-classifier-types.vitest.ts` | Tier classifier types |
| `mcp_server/tests/unit-transaction-metrics-types.vitest.ts` | Transaction metric types |

---

## 4. SOURCE METADATA

- Group: Pipeline architecture
- Source feature title: Template anchor optimization
- Current reality source: FEATURE_CATALOG.md
<!-- /ANCHOR:state -->
