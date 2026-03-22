# Iteration 7: Q7 -- Test Files Covering Undocumented Functionality

## Focus
Investigated whether the 321 test files in the MCP server test suite test behaviors NOT described in the feature catalog. The audit verified features against source code but the question is whether the test suite exercises capabilities, edge cases, or subsystems that the catalog never documented -- revealing hidden functionality gaps.

## Findings

1. **Only 9 of 321 test files (2.8%) are referenced anywhere in the catalog.** The committed catalog content (all 21 phases, all spec.md/plan.md/checklist.md/implementation-summary.md files) mentions only 9 test files by name: `graph-signals`, `handler-memory-context`, `handler-memory-health-edge`, `handler-memory-ingest`, `handler-memory-ingest-edge`, `hooks-mutation-wiring`, `hybrid-search-context-headers`, `tool-input-schema`, `transaction-manager-extended`. The remaining 312 test files are entirely absent from catalog documentation.
   [SOURCE: comm -23 of /tmp/test-names.txt vs git-extracted catalog content]

2. **14 handler-level test files are unreferenced, meaning the audit verified features at the feature-description level but not at the MCP handler-implementation level.** Handler tests (handler-causal-graph, handler-checkpoints, handler-memory-crud, handler-memory-index, handler-memory-save, handler-memory-search, handler-memory-triggers, handler-session-learning, etc.) exercise the actual tool dispatch code, which is one abstraction layer below what the catalog documents. The catalog documents "what the feature does" but the handler tests verify "how the MCP server routes and processes the request."
   [SOURCE: grep '^handler-' /tmp/unreferenced-tests.txt]

3. **21 regression/safety/security test files test production-critical behaviors with no catalog counterpart.** These include: `crash-recovery` (T009-T016, T071-T075 with session state recovery), `safety` (T105-T106 batchSize validation), `bm25-security` (FTS5 query sanitization), `unit-path-security` (path traversal prevention T001-T007), `dead-code-regression` (dead code detection), `decay-delete-race` (T214 race condition), `session-manager-stress` (stress testing), `interference` (cross-module interference), `stdio-logging-safety` (stdout vs stderr separation for MCP protocol safety). These are not "features" in the catalog sense but are production behaviors the audit should have verified.
   [SOURCE: crash-recovery.vitest.ts:3-6, safety.vitest.ts:3-5, unit-path-security.vitest.ts:3-4, decay-delete-race.vitest.ts:3]

4. **31 scoring/fusion test files exercise the core ranking pipeline that the catalog documents as features but the audit never verified at the test level.** The scoring and fusion layer (RSF, RRF, MMR, shadow scoring, five-factor scoring, adaptive fusion, etc.) has 31 dedicated test files. The catalog's Phase 011 (Scoring and Calibration) audited documented features against source code, but never cross-referenced whether the test suite exercises the same features or additional undocumented scoring behaviors.
   [SOURCE: grep -E '(scoring|fusion|rrf|rsf|rerank|mmr)' /tmp/unreferenced-tests.txt -- 31 matches]

5. **9 integration test files verify end-to-end pipelines that cross catalog category boundaries.** Integration tests (integration-save-pipeline, integration-search-pipeline, integration-causal-graph, integration-session-dedup, integration-checkpoint-lifecycle, integration-error-recovery, integration-trigger-pipeline, integration-learning-history, integration-138-pipeline) exercise the full pipeline paths that the per-category audit structure cannot verify. This confirms the cross-cutting blind spot identified in iteration 4 (Q4).
   [SOURCE: grep '^integration-' /tmp/unreferenced-tests.txt -- 9 matches]

6. **22 memory-specific test files exist entirely outside catalog scope.** Tests like `memory-governance`, `memory-delete-cascade`, `memory-lineage-backfill`, `memory-lineage-state`, `memory-roadmap-flags`, `memory-save-ux-regressions`, `memory-state-baseline`, and `memory-summaries` test specific behaviors of the memory subsystem that are not individual catalog features but are emergent behaviors of the system. The catalog enumerates features; these tests exercise systemic properties.
   [SOURCE: grep '^memory-' /tmp/unreferenced-tests.txt -- 22 matches]

7. **The test-to-catalog gap (97.2% unreferenced) is a structural design consequence, not an oversight.** The catalog was designed as a feature registry (documenting "what exists"), while the test suite was designed for behavioral verification (testing "what works correctly"). These are complementary but different scopes. The audit's charter was to verify catalog features against source code -- it was never scoped to verify catalog features against test coverage. However, this means the audit provides no assurance about: (a) whether test-verified behaviors match catalog descriptions, (b) whether test-only behaviors represent undocumented production capabilities, (c) whether the test suite is itself complete relative to the catalog.

## Sources Consulted
- Test directory listing: `.opencode/skill/system-spec-kit/mcp_server/tests/` (321 .vitest.ts files)
- Committed catalog content: `git ls-tree -r --name-only HEAD` + `git show HEAD:$f` for all catalog files
- Test file describe blocks: head -30 of 15 high-interest test files
- Prior iterations: iteration-002 (32 unreferenced source files), iteration-004 (cross-cutting blind spots)

## Assessment
- New information ratio: 0.90
- Questions addressed: Q7 (test files covering undocumented functionality)
- Questions answered: Q7 -- substantially answered

## Reflection
- What worked and why: The definitive approach was a full cross-reference of 321 test file basenames against all text content in the committed catalog (via `git show`). This gave an exact, zero-ambiguity count of referenced vs unreferenced test files. Categorizing unreferenced tests by prefix pattern (handler-, integration-, unit-, memory-, etc.) revealed structural gaps rather than individual omissions.
- What did not work and why: macOS grep lacks `-P` (Perl regex); had to use `-E` extended regex instead. Initial attempt to extract from spec.md files failed because they were deleted in working tree; using `git show HEAD:$f` on committed content was the correct approach.
- What I would do differently: Start with `git show` for committed content from the beginning, rather than trying to read working-tree files that may be deleted.

## Recommended Next Focus
Q8 (quantitative per-phase risk model) -- With Q1-Q7 now answered, synthesize all 7 gap dimensions into a weighted per-phase risk score. The test coverage data from this iteration adds a 6th dimension (test-catalog alignment) to the risk model alongside: unreferenced source files, PARTIAL error rate, temporal churn, cross-cutting blind spots, and flag graduation impact.
