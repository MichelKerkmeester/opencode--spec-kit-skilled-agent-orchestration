# Iteration 15: Test Coverage Analysis

## Focus
Identify critical untested paths in the hybrid-rag-fusion pipeline. Determine which scoring signals lack tests, which edge cases are untested, and whether bugs found in prior iterations (FSRS write-back race from iter-6, score resolution divergence from iter-2) have regression tests.

## Findings

1. **284 test files exist** (all `*.vitest.ts`), making this one of the most heavily tested systems in the codebase. Coverage is broad across scoring, fusion, graph, cognitive, save pipeline, eval, and MCP handler layers.
   [SOURCE: `ls *.vitest.ts | wc -l` in mcp_server/tests/]

2. **All 4 pipeline stages have dedicated test files**: `stage1-expansion.vitest.ts` (8 tests: expansion flag, dedup ordering, simple-query suppression, disabled flag, summary channel merge, dedup by id, quality threshold, governance scope), `stage2-fusion.vitest.ts` (4 tests: learned-trigger scaling, graph signals, trace diagnostics, bounded graph bonus), `stage3-rerank-regression.vitest.ts` (2 tests: negative cross-encoder floor, negative local-reranker floor), plus `pipeline-integration.vitest.ts` (end-to-end with mocks) and `pipeline-v2.vitest.ts`. However, **Stage 4 (filter/post-processing) has NO dedicated test file** -- only tangential references in `pipeline-v2.vitest.ts` and `memory-search-eval-channels.vitest.ts`.
   [SOURCE: `ls stage*.vitest.ts pipeline*.vitest.ts` and `grep -rl "stage4" *.vitest.ts`]

3. **The FSRS write-back race condition (iter-6 finding: read-then-write lost-update in FSRS strengthening) has NO test.** The `decay-delete-race.vitest.ts` file tests a DIFFERENT race condition (working_memory attention score decay/delete boundary in T214), not the FSRS stability update race. The `fsrs-scheduler.vitest.ts` (24K+ LOC) tests formula correctness (retrievability calculation, stability updates, PE gate thresholds, testing effect, constants, edge cases) but has zero concurrent-write or transaction-isolation tests. The `access-tracker.vitest.ts` and `access-tracker-extended.vitest.ts` test the trackAccess accumulator but not concurrent FSRS write-back.
   [SOURCE: grep for "fsrs.*race|concurrent.*write|lost.update" returned 0 hits; `decay-delete-race.vitest.ts:10` references T214 working_memory race only]

4. **The score resolution divergence (iter-2 finding: 3 different fallback orders in types.ts, ranking-contract.ts, stage4-filter.ts) has exactly ONE test.** `mcp-response-envelope.vitest.ts:178` tests "T536-4: scoreResolution and composite follow fallback ordering" -- but this tests the MCP response envelope output, not the internal resolution chain consistency. No test verifies that the 3 resolution functions produce identical results for the same input, nor that `withSyncedScoreAliases` prevents divergence on all code paths.
   [SOURCE: grep for "scoreResolution|resolveScore|withSyncedScore" returned only `mcp-response-envelope.vitest.ts`]

5. **Pipeline orchestrator error handling has ZERO tests.** Grep for "orchestrat.*error|pipeline.*cascade|stage.*failure.*cascade" across all 284 test files returned 0 hits. This matches the iter-6 finding that orchestrator.ts (79 lines) has zero error handling -- there is nothing to test. But it also means no test verifies what happens when a stage throws: does the pipeline return partial results? Does it crash? Does it silently return empty?
   [SOURCE: grep returned 0 hits for orchestrator error patterns across all test files]

6. **Scoring signal coverage is strong but incomplete.** Test files exist for: composite-scoring (1 file), scoring-gaps (1 file), five-factor-scoring (1 file), score-normalization (1 file), scoring-observability (1 file), unit-composite-scoring-types (1 file), intent-weighting (1 file), folder-scoring (2 files + overflow), confidence-tracker (1 file). The `scoring-gaps.vitest.ts` specifically tests promotion thresholds (confidence >= 0.9, validation_count >= 5). **Missing test coverage**: (a) no test for the convergence bonus signal in isolation (only tested as part of graph-scoring-integration), (b) no test for adaptive-fusion weight conflicts (the 3 conflicting weight systems from iter-5), (c) no test for the unused `graphWeight` in FusionWeights interface.
   [SOURCE: `ls *scoring*.vitest.ts *score*.vitest.ts` and grep for convergenceBonus in test files]

7. **RSF (Relative Score Fusion) has comprehensive tests (36+ describe/it blocks in rsf-fusion.vitest.ts)** covering basic fusion, overlapping items, score clamping, sort order, empty lists, single-item lists, and shadow mode divergence. There are also `rsf-fusion-edge-cases.vitest.ts`, `rsf-multi.vitest.ts`, and `rsf-vs-rrf-kendall.vitest.ts` for rank comparison. **However, no test verifies the RSF activation path** -- i.e., what happens when RSF is switched from shadow-only to production mode. This is a gap because RSF is currently dormant (iter-2 finding).
   [SOURCE: grep for describe/it in rsf-fusion.vitest.ts; iter-2 finding that RSF is shadow-only]

8. **Cross-encoder/reranker has robust coverage** across 2 files (`cross-encoder.vitest.ts` + `cross-encoder-extended.vitest.ts`) covering provider resolution, length penalty, cache key generation, API routing (Voyage/Cohere/local), error handling for API failures and network errors. **BUT: no test for the circuit breaker pattern.** The only circuit-breaker test hit was in `trigger-extractor.vitest.ts`, not in the cross-encoder. The iter-6 finding noted cross-encoder has a latency tracker and circuit breaker in production code, but these have no dedicated tests.
   [SOURCE: grep for "circuit.breaker|CircuitBreaker" found only trigger-extractor.vitest.ts]

9. **Edge case coverage is generally strong.** Tests exist for: empty results (adaptive-fusion T13, channel-enforcement T12/T14/T15, batch-processor T14), null candidates (reconsolidation CMP2), empty embeddings (embedding-expansion T8), zero stability (unit-fsrs-formula T007), empty graphs (degree-computation), handler empty input (handler-memory-search T002-1). **Critical untested edge cases**: (a) concurrent save dedup race (iter-9 finding: no transaction isolation around dedup check-then-insert), (b) embedding cache model-swap (iter-9 finding: cache key ignores model ID), (c) deep-mode expansion with slow/failing embedding generation (unbounded latency from iter-12/15 findings).
   [SOURCE: grep for empty/null/zero edge case patterns returned 40+ hits across test files]

10. **The BM25 N+1 query pattern (iter-13 finding) has no test.** No test verifies the performance characteristics of the BM25 spec-folder filter, nor does any test mock the individual SELECT queries to ensure they are batched. The `bm25-index.vitest.ts` and `bm25-baseline.vitest.ts` test BM25 indexing and scoring but not the filter path.
    [SOURCE: grep for "n.1|N+1|bm25.*filter" found no relevant hits in BM25 test files]

11. **Test infrastructure is well-organized.** Tests use consistent patterns: `better-sqlite3` in-memory databases, `vi.mock` for module isolation, typed test helpers, and test IDs (T-prefix with component numbering like T002, T023, T214, T507, T536). A `tests/README.md` exists with a complete file listing and test categorization.
    [SOURCE: examination of test file headers across multiple files]

## Sources Consulted
- `mcp_server/tests/*.vitest.ts` -- full directory listing (284 files)
- `mcp_server/tests/stage1-expansion.vitest.ts` -- describe/it blocks
- `mcp_server/tests/stage2-fusion.vitest.ts` -- describe/it blocks
- `mcp_server/tests/stage3-rerank-regression.vitest.ts` -- describe/it blocks
- `mcp_server/tests/pipeline-integration.vitest.ts:1-60` -- mock setup
- `mcp_server/tests/decay-delete-race.vitest.ts:1-40` -- T214 (working_memory race, NOT FSRS)
- `mcp_server/tests/fsrs-scheduler.vitest.ts` -- describe/it census
- `mcp_server/tests/scoring-gaps.vitest.ts:1-80` -- promotion thresholds
- `mcp_server/tests/rsf-fusion.vitest.ts` -- describe/it census
- `mcp_server/tests/cross-encoder.vitest.ts` -- describe/it census
- `mcp_server/tests/cross-encoder-extended.vitest.ts` -- describe/it census
- Grep across all 284 test files for: FSRS race, score resolution, orchestrator errors, convergence bonus, circuit breaker, N+1/BM25 filter, empty/null edge cases

## Assessment
- New information ratio: 0.73
- Questions addressed: Q1 (pipeline improvement -- test gap perspective), new Q18 (test coverage completeness)
- Questions answered: Q18 (test coverage analysis -- comprehensive answer)

## Reflection
- What worked and why: The Bash grep-census approach was again highly efficient -- running multiple grep patterns in a single call gave complete coverage maps across all 284 files without reading individual files. The targeted describe/it census of key files confirmed depth of coverage without reading full test bodies.
- What did not work and why: Nothing failed this iteration. All paths were correct.
- What I would do differently: Could have checked vitest.config.ts for coverage thresholds or exclusion patterns to see if there are formally tracked coverage gaps.

## Recommended Next Focus
Iteration 16: Complete Q1 pipeline synthesis. The test coverage analysis has added 7 specific untested paths that compound the pipeline improvement picture: (a) Stage 4 has no tests, (b) orchestrator error cascading has no tests, (c) FSRS write-back race has no test, (d) score resolution divergence has insufficient tests, (e) cross-encoder circuit breaker untested, (f) BM25 N+1 untested, (g) RSF activation path untested. Synthesize all pipeline findings (iters 1-15) into a final Q1 answer.
