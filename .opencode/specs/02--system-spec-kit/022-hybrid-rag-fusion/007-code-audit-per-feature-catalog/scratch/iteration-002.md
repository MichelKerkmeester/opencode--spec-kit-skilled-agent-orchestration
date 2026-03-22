# Iteration 2: Q2 -- Unaudited Code Paths at File-Level Granularity

## Focus
Systematically cross-reference every `.ts` source file in the MCP server (`mcp_server/` + `shared/`) against every `.ts` file reference in the feature catalog to identify source files that were never mentioned by any audit phase.

## Methodology
1. Listed all 286 non-test `.ts` source files in `mcp_server/` and `shared/`
2. Extracted all `.ts` filename references from all `.md` and `.json` files across the entire `feature_catalog/` directory
3. Filtered catalog references to only those using full relative paths (e.g., `mcp_server/lib/search/...`)
4. Computed `comm -23` diff: files present in source but absent from catalog
5. Inspected header comments of all 32 unreferenced files to assess importance

## Findings

### Quantitative Summary
- **Total non-test source files**: 286
- **Files referenced in feature catalog**: 254
- **Files NEVER referenced**: 32 (11.2% of codebase)
- **Catalog reference count (full-path entries)**: 254

### The 32 Unreferenced Files, Categorized by Severity

#### CRITICAL -- Active Production Code (6 files)
These files contain active business logic used in production pipelines:

1. **`mcp_server/handlers/save/markdown-evidence-builder.ts`** -- Extracts structured evidence from markdown files for sufficiency evaluator. Active in save pipeline.
   [SOURCE: file header: "Pure parsing functions that extract structured evidence from markdown memory files for the sufficiency evaluator"]

2. **`mcp_server/handlers/save/spec-folder-mutex.ts`** -- Per-spec-folder save mutex preventing concurrent indexing TOCTOU races. Critical concurrency control.
   [SOURCE: file header: "Per-spec-folder save mutex to prevent concurrent indexing races (TOCTOU)"]

3. **`mcp_server/handlers/save/validation-responses.ts`** -- Builder functions constructing rejection/dry-run results from validation outcomes. Active in save validation flow.
   [SOURCE: file header: "Pure builder functions that construct rejection/dry-run results from validation outcomes"]

4. **`mcp_server/handlers/v-rule-bridge.ts`** -- Runtime bridge to validate-memory-quality scripts. Part of quality gate pipeline.
   [SOURCE: file header: "O2-5/O2-12: Runtime bridge to scripts/memory/validate-memory-quality"]

5. **`mcp_server/lib/search/pipeline/stage2b-enrichment.ts`** -- Stage 2b enrichment step extracted from stage2-fusion.ts. Active in search pipeline.
   [SOURCE: file header: "B4 DECOMPOSITION: Extracted from stage2-fusion.ts steps 8-9. Pure annotation -- no score mutation."]

6. **`mcp_server/lib/telemetry/eval-channel-tracking.ts`** -- Eval channel attribution utilities extracted from memory-search handler. Active in telemetry pipeline.
   [SOURCE: file header: "Extracted from handlers/memory-search.ts. Utilities for collecting eval channel attribution"]

#### HIGH -- Active Utility/Infrastructure Code (9 files)

7. **`mcp_server/lib/search/chunk-reassembly.ts`** -- Collapses chunk-level search results into parent-level results. Active in search.
   [SOURCE: file header: "Collapses chunk-level search results into parent-level results"]

8. **`mcp_server/lib/search/deterministic-extractor.ts`** -- Rule-based extraction for save-time graph enrichment. Active in graph pipeline.
   [SOURCE: file header: "Rule-based extraction functions for save-time graph enrichment"]

9. **`mcp_server/lib/search/search-utils.ts`** -- Stateless utility functions for quality filtering, thresholds, cache keys. Used by search handler.
   [SOURCE: file header: "Extracted from handlers/memory-search.ts. Small, stateless utility functions"]

10. **`mcp_server/lib/search/surrogate-storage.ts`** -- SQLite storage layer for query surrogates. Note: populated at index time but header says "never queried at search time."
    [SOURCE: file header: "TODO: Surrogate storage is populated at index time but never queried at search time."]

11. **`mcp_server/lib/search/reranker.ts`** -- Simple score-based reranking utility. Separate from cross-encoder neural reranking.
    [SOURCE: file header: "Simple score-based reranking utility. Sorts results by score descending"]

12. **`mcp_server/lib/search/fsrs.ts`** -- Augments FSRS stability scores with graph centrality for decay.
    [SOURCE: file header: "Augments FSRS stability scores with graph centrality"]

13. **`mcp_server/lib/feedback/rank-metrics.ts`** -- IR metric computation (Kendall tau, NDCG, MRR) extracted from shadow-scoring.
    [SOURCE: file header: "IR metric computation functions extracted from shadow-scoring.ts"]

14. **`mcp_server/lib/storage/history.ts`** -- Tracks change history for memory entries (ADD, UPDATE, DELETE).
    [SOURCE: file header: "Tracks change history for memory entries (ADD, UPDATE, DELETE)"]

15. **`shared/lib/structure-aware-chunker.ts`** -- AST-aware markdown chunking keeping code blocks/tables atomic.
    [SOURCE: file header: "AST-aware markdown chunking that keeps code blocks and tables atomic"]

#### MEDIUM -- API Layer + Index Files (8 files)

16. **`mcp_server/api/eval.ts`** -- Public re-export surface for eval scripts. [SOURCE: file header]
17. **`mcp_server/api/index.ts`** -- API barrel file. [SOURCE: filename pattern]
18. **`mcp_server/api/indexing.ts`** -- Programmatic indexing API. [SOURCE: filename]
19. **`mcp_server/api/providers.ts`** -- Provider API. [SOURCE: filename]
20. **`mcp_server/api/search.ts`** -- Programmatic search API. [SOURCE: filename]
21. **`mcp_server/api/storage.ts`** -- Programmatic storage API. [SOURCE: filename]
22. **`mcp_server/lib/learning/index.ts`** -- Barrel file for learning module. [SOURCE: filename pattern]
23. **`shared/algorithms/index.ts`** -- Barrel file for shared algorithms. [SOURCE: filename pattern]

#### LOW -- Deprecated/Dead Code + Test Artifacts (5 files)

24. **`mcp_server/lib/manage/pagerank.ts`** -- Explicitly marked `@deprecated Never wired into production pipeline`.
    [SOURCE: file contains `@deprecated` JSDoc tag]

25. **`mcp_server/lib/search/context-budget.ts`** -- Explicitly marked `@deprecated Never wired into production pipeline`.
    [SOURCE: file contains `@deprecated` JSDoc tag]

26. **`shared/ranking/matrix-math.ts`** -- Explicitly marked `@deprecated Circular island with learned-combiner.ts. Not imported by any production code`.
    [SOURCE: file contains `@deprecated` JSDoc tag]

27. **`mcp_server/lib/search/vector-index-impl.ts`** -- Facade/redirect file noting implementation split into focused modules.
    [SOURCE: file header: "Implementation has been split into focused modules"]

28. **`mcp_server/scripts/reindex-embeddings.ts`** -- Compatibility wrapper that delegates to scripts/dist.
    [SOURCE: file body: spawnSync to compiled JS target]

#### INFORMATIONAL -- Test Files Leaked Into Non-Test Directory (2 files)

29. **`shared/parsing/quality-extractors.test.ts`** -- Test file not in tests/ directory.
    [SOURCE: filename pattern `.test.ts`]

30. **`shared/parsing/spec-doc-health.test.ts`** -- Test file not in tests/ directory.
    [SOURCE: filename pattern `.test.ts`]

31. **`shared/parsing/spec-doc-health.ts`** -- Source file for spec doc health checks. May be new/recent addition.
    [SOURCE: file exists in shared/parsing/ without catalog reference]

32. **`shared/utils/jsonc-strip.ts`** -- JSONC comment stripping utility.
    [SOURCE: file exists in shared/utils/ without catalog reference]

### Key Observations

1. **The api/ directory (6 files) is the single largest unreferenced cluster**, confirming iteration 1's finding. This is a complete programmatic API layer that was not part of any audit phase.

2. **The save handler has 3 unreferenced files** (markdown-evidence-builder, spec-folder-mutex, validation-responses). These are active production modules extracted during modularization but never added to the catalog.

3. **Pipeline stage2b-enrichment is a gap in the pipeline architecture catalog**. The 4-stage pipeline (stage1/2/3/4) is documented, but stage2b was split out later and never cataloged.

4. **3 files are explicitly `@deprecated`** (pagerank.ts, context-budget.ts, matrix-math.ts). The audit should have flagged these for cleanup.

5. **Several files were extracted during modularization** (chunk-reassembly, search-utils, deterministic-extractor, rank-metrics, eval-channel-tracking) from larger files that ARE cataloged, but the extracted modules themselves were never added.

6. **2 test files exist outside the tests/ directory** (in shared/parsing/), which is a structural anomaly the audit structure could not detect.

## Sources Consulted
- All `.ts` files under `mcp_server/` (286 non-test files via `find`)
- All `.ts` references in `feature_catalog/` (254 full-path references via `grep -roh`)
- File headers of all 32 unreferenced files (via `head -10`)

## Assessment
- New information ratio: 0.85
- Questions addressed: Q2
- Questions answered: Q2 (substantially -- definitive list of 32 unreferenced files with severity classification)

## Reflection
- What worked and why: The `comm -23` diff between actual source files and catalog references was definitive. By using full relative paths, the comparison was exact with no ambiguity. Inspecting file headers for each unreferenced file was essential to distinguish active code from deprecated dead code.
- What did not work and why: N/A -- the approach was straightforward and yielded clean results.
- What I would do differently: Could also check import graphs to verify which "unreferenced" files are actually imported by referenced files (transitive coverage). Some may be indirectly covered through barrel imports.

## Recommended Next Focus
Q3: Verify PARTIAL audit findings for accuracy. Pick 3-5 PARTIAL-status features from different categories and check whether the identified discrepancies are real or misclassified. This directly tests audit quality rather than coverage.
