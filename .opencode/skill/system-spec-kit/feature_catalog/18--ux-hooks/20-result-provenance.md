---
title: "Result provenance (graph evidence)"
description: "graphEvidence field includes contributing edges, community IDs, and boost factors per result, populated in Stage 2 fusion, enabling callers to trace why a result was ranked where it was, gated by the SPECKIT_RESULT_PROVENANCE flag."
---

# Result provenance (graph evidence)

## 1. OVERVIEW

The `graphEvidence` field includes contributing edges, community IDs, and boost factors per result, populated in Stage 2 fusion. This provides full provenance for graph-influenced ranking, enabling callers to trace exactly which causal edges, community memberships, and boost factors contributed to each result's final score.

---

## 2. CURRENT REALITY

Enabled by default (graduated). Set `SPECKIT_RESULT_PROVENANCE=false` to disable.

During Stage 2 fusion, each result that receives a graph-derived boost is annotated with a `graphEvidence` object containing: the contributing causal edge IDs and their relation types, community IDs the result belongs to, and the individual boost factors applied. The search results formatter surfaces this evidence in the response envelope. The `graphEvidence` type is defined in the pipeline types module and is optional per result — only populated when graph signals contributed to ranking.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/pipeline/stage2-fusion.ts` | Lib | Graph evidence population during fusion |
| `mcp_server/formatters/search-results.ts` | Formatter | Graph evidence serialization in response envelope |
| `mcp_server/lib/search/pipeline/types.ts` | Lib | `graphEvidence` type definition |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/provenance-envelope.vitest.ts` | Provenance envelope structure and graph evidence content |

---

## 4. SOURCE METADATA

- Group: UX hooks
- Source feature title: Result provenance (graph evidence)
- Graduated via: 009-graph-retrieval-improvements
- Kill switch: SPECKIT_RESULT_PROVENANCE=false
