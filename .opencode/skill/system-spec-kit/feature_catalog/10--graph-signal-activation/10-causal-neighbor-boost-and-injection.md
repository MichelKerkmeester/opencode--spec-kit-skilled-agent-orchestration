# Causal neighbor boost and injection

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)
- [5. IN SIMPLE TERMS](#5--in-simple-terms)

## 1. OVERVIEW

Describes the post-fusion causal boost that walks `causal_edges` up to 2 hops from top-ranked seed results, applying relation-type weighted amplification with a combined causal + session boost ceiling of 0.20.

## 2. CURRENT REALITY

After Stage 2 fusion produces a ranked result set, the causal boost module walks the `causal_edges` graph to amplify scores for memories related to top-ranked seed results. Up to 25% of the result set (capped at 5) serves as seed nodes. The graph walk traverses up to 2 hops via a weighted recursive CTE, applying a per-hop base boost capped at 0.05.

Relation-type weight multipliers are applied during traversal as follows: `supersedes` (1.5), `contradicts` (0.8), and `caused`/`enabled`/`derived_from`/`supports` (1.0). These weights are combined with edge `strength` to scale neighbor amplification while preserving the hop-depth cap.

The combined causal + session boost ceiling is 0.20, preventing runaway score inflation from graph-dense clusters. The feature is gated by `SPECKIT_CAUSAL_BOOST` (default `true`). When disabled, results pass through without graph-based score adjustment.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/causal-boost.ts` | Lib | Causal neighbor graph walk and boost application |
| `mcp_server/lib/search/pipeline/stage2-fusion.ts` | Lib | Stage 2 fusion invoking causal boost |
| `mcp_server/lib/search/pipeline/types.ts` | Lib | Pipeline type definitions |
| `mcp_server/lib/search/session-boost.ts` | Lib | Session boost (shared ceiling with causal) |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/causal-boost.vitest.ts` | Causal boost tests |
| `mcp_server/tests/phase2-integration.vitest.ts` | Phase 2 integration tests |

## 4. SOURCE METADATA

- Group: Graph signal activation
- Source feature title: Causal neighbor boost and injection
- Current reality source: audit-D04 gap backfill

## 5. IN SIMPLE TERMS

When a search result scores highly, this feature follows its cause-and-effect links to find related memories nearby in the graph. Those neighbors get a score bump because if Memory A is relevant and it caused or enabled Memory B, there is a good chance Memory B matters too. There is a ceiling on how much boost any result can receive so that highly connected clusters do not take over all the top spots.
