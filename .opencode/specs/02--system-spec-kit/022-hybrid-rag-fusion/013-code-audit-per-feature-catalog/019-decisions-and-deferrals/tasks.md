# Tasks — 019 Decisions and Deferrals

## Summary

| Priority | Count |
|----------|-------|
| P0       | 0     |
| P1       | 3     |
| P2       | 1     |
| **Total** | **4** |

---

## P1 — WARN with Behavior Mismatch or Significant Code Issues

### T-01: Update graph centrality feature source inventory to include graph-signals and migration
- **Priority:** P1
- **Feature:** F-02 Implemented: graph centrality and community detection
- **Status:** TODO
- **Source:** `feature_catalog/19--decisions-and-deferrals/02-implemented-graph-centrality-and-community-detection.md:7,15-17`; `mcp_server/lib/graph/graph-signals.ts:48-55,102-149`; `mcp_server/lib/search/vector-index-schema.ts:587-623`
- **Issue:** Current Reality references N2a (graph momentum), N2b (causal depth), and migration v19 table additions, but the Source Files table only lists `community-detection.ts` and `pagerank.ts`. Logic for N2a/N2b lives in `graph-signals.ts` and migration v19 table creation lives in `vector-index-schema.ts`, creating a completeness gap.
- **Fix:** Update the feature Source Files table to include `mcp_server/lib/graph/graph-signals.ts` and the migration touchpoints in `vector-index-schema.ts`.

### T-02: Add test references for graph momentum and causal depth
- **Priority:** P1
- **Feature:** F-02 Implemented: graph centrality and community detection
- **Status:** TODO
- **Source:** `feature_catalog/19--decisions-and-deferrals/02-implemented-graph-centrality-and-community-detection.md:22-23`; `mcp_server/lib/graph/graph-signals.ts:48-55,102-149`
- **Issue:** Listed tests cover community detection and pagerank but do not cover the N2a/N2b graph-signals module or migration-v19 behavior referenced in Current Reality. No test validates `computeGraphMomentum` or `computeCausalDepth`.
- **Fix:** Add or attach test references for momentum/depth behavior and migration v19 expectations in this feature entry.

### T-03: Tighten Rule-3 regex to prevent cross-sentence entity capture
- **Priority:** P1
- **Feature:** F-03 Implemented: auto entity extraction
- **Status:** TODO
- **Source:** `mcp_server/lib/extraction/entity-extractor.ts:69`; `mcp_server/tests/entity-extractor.vitest.ts:106-118`
- **Issue:** Rule-3 key-phrase extraction regex allows `.` in continuation tokens via `[\w.-]+`, causing cross-sentence boundary captures (e.g., "using GraphQL. Implements Singleton" captured as one phrase). Existing tests codify this incorrect behavior instead of preventing it.
- **Fix:** Tighten Rule-3 regex to use `[\w-]+` instead of `[\w.-]+` in the continuation token pattern. Add negative tests asserting that sentence-boundary periods terminate key-phrase capture.

---

## P2 — WARN with Documentation/Test Gaps Only

### T-04: Add test coverage for computeGraphMomentum and computeCausalDepth
- **Priority:** P2
- **Feature:** F-02 Implemented: graph centrality and community detection
- **Status:** TODO
- **Source:** `mcp_server/lib/graph/graph-signals.ts:48-55,102-149`
- **Issue:** No test validates `computeGraphMomentum` or `computeCausalDepth` from `graph-signals.ts`, despite these being referenced in the feature's Current Reality text.
- **Fix:** Add dedicated tests for momentum/depth computation behavior and migration v19 table expectations.
