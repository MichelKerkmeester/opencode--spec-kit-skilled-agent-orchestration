# Iteration 81: Verification of Iteration 069 Testing Strategy Against Current MCP Server Test Suite

## Focus
Verify iteration 069's proposed six new Vitest files and ~40 test cases against the **current** `mcp_server/tests/` suite: what test files exist now, what patterns the suite actually uses, whether the proposed designs fit the current infrastructure, and which scenarios are already partially covered.

## Findings

### 1. The current suite is much larger than iteration 069 assumed
The current `mcp_server/tests/` directory contains **349** `*.vitest.ts` files. Iteration 069 described the suite as "~100+ vitest files," which is now materially outdated. Relevant existing families already include code-graph, runtime/fallback, session, routing, and auto-surface tests, so the net-new test surface is smaller than iteration 069 implied.

Relevant files for this verification include:
- `code-graph-indexer.vitest.ts`
- `budget-allocator.vitest.ts`
- `graph-flags.vitest.ts`
- `runtime-detection.vitest.ts`
- `cross-runtime-fallback.vitest.ts`
- `runtime-routing.vitest.ts`
- `dual-scope-hooks.vitest.ts`
- `session-manager-extended.vitest.ts`
- `handler-memory-triggers.vitest.ts`
- `mcp-tool-dispatch.vitest.ts`

Full filename inventory is included in **Appendix A**.

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/` directory listing captured on 2026-03-31 — 349 `*.vitest.ts` files]

### 2. The existing test infrastructure is plain Vitest + direct source imports
The current MCP server workspace runs Vitest directly in Node. New tests are auto-discovered under `tests/**/*.{vitest,test}.ts`, run with `globals: true`, `environment: 'node'`, and a `30_000ms` default timeout. The package scripts run `vitest run` for core tests, with `file-watcher.vitest.ts` split into a dedicated script.

The actual test style is consistent across the sampled files:
- **Direct imports from source modules**, e.g. `../lib/code-graph/...`, `../handlers/...`
- **Inline string fixtures** for parser tests instead of fixture directories
- **Environment save/restore** around `process.env` mutations
- **In-memory SQLite / temp directories** for stateful tests
- **Vitest built-ins only** (`vi.spyOn`, `vi.mocked`, `expect`, `beforeEach`, `afterEach`)

This means the general shape of iteration 069's proposed tests is compatible with the infrastructure.

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/package.json:16-26`]
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/vitest.config.ts:13-22`]
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-indexer.vitest.ts:76-146`]
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/graph-flags.vitest.ts:8-46`]
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:46-107`]

### 3. Sampled existing tests confirm four strong suite patterns

#### 3.1 Parser/indexer tests use inline content and direct assertions
`code-graph-indexer.vitest.ts` imports `parseFile()` / `extractEdges()` directly and asserts parsed node names/kinds from inline TypeScript, Python, and Bash strings. This is exactly the right pattern for an `endLine` regression file and for future edge-extraction tests.

What it currently covers:
- function/class/interface/import extraction
- Python class + method extraction
- Bash function extraction
- one `CONTAINS` edge assertion

What it does **not** cover:
- `endLine` accuracy
- `DECORATES`, `OVERRIDES`, `TYPE_OF`
- scan/query/context tool execution

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-indexer.vitest.ts:76-146`]

#### 3.2 Budget tests are simple property assertions, not scenario-heavy integration tests
`budget-allocator.vitest.ts` checks floor values, redistribution, budget caps, empty-source behavior, and constitutional allocation. The file is small and direct, which supports extending existing files for allocator changes instead of necessarily creating a separate large suite.

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/budget-allocator.vitest.ts:11-67`]

#### 3.3 Env-sensitive tests use explicit save/restore
`graph-flags.vitest.ts` captures the original env value in `beforeEach()` and restores it in `afterEach()`. This is the same pattern used in `runtime-detection.vitest.ts` and is the right model for runtime-specific or feature-flag-specific tests.

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/graph-flags.vitest.ts:8-46`]
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/runtime-detection.vitest.ts:7-65`]

#### 3.4 Stateful/session tests use real helpers with in-memory DBs rather than pure mocks
`session-manager-extended.vitest.ts` initializes an in-memory SQLite DB, uses real session-manager functions, and asserts concrete trust/rejection semantics. This is the right pattern for session-related code graph tests too.

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:48-107`]
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:270-342`]

### 4. Iteration 069's proposed designs are only partially compatible as written
The **infrastructure assumption** was mostly right; the **specific target/helper assumptions** were not.

| Proposed file | Infra-compatible? | Runnable against current code? | Verification result |
|---|---:|---:|---|
| `code-graph-endline-fix.vitest.ts` | Yes | Yes | Still a good missing test file. Current indexer tests never assert `endLine`. |
| `code-graph-edge-types.vitest.ts` | Yes | Only with feature implementation | Good future file, but current suite has no evidence that `DECORATES` / `OVERRIDES` / `TYPE_OF` are emitted today. |
| `code-graph-staleness.vitest.ts` | Partly | Partly | Current code has `isFileStale(filePath, currentHash)` only; iteration 069's mtime + `ensureFreshFiles()` design does not match current code. |
| `code-graph-auto-enrichment.vitest.ts` | Partly | No | Current suite has dispatch auto-surface tests, but not graph/CocoIndex auto-enrichment or `GRAPH_AWARE_TOOLS`. |
| `code-graph-cross-runtime.vitest.ts` | Partly | Mostly redundant today | Runtime fallback and `resolveTrustedSession` already have existing coverage; `FirstCallTracker` does not exist yet. |
| `code-graph-integration-e2e.vitest.ts` | Yes | Yes | Still a real missing gap: no existing test runs `code_graph_scan -> code_graph_query -> code_graph_context` end-to-end. |

The three biggest compatibility corrections are:
1. **No `FirstCallTracker` exists today** — that part of the proposed cross-runtime suite is still design-only.
2. **No `ensureFreshFiles()` helper exists today** — current staleness logic is hash-based, not the proposed mtime-driven refresh layer.
3. **No `GRAPH_AWARE_TOOLS` symbol exists today** — the auto-enrichment design has not landed yet.

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:171-176`]
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts:47-52`]
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:385-465`]
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/runtime-detection.ts:18-53`]

### 5. Existing tests already cover part of the proposed scenario set

#### 5.1 Cross-runtime fallback is already covered in two files
`runtime-detection.vitest.ts` already covers `detectRuntime()`, `areHooksAvailable()`, and `getRecoveryApproach()` for the basic Claude/unknown cases. `cross-runtime-fallback.vitest.ts` expands that to the four runtimes (`claude-code`, `codex-cli`, `copilot-cli`, `gemini-cli`) and a 7-scenario matrix.

That means iteration 069's proposed `code-graph-cross-runtime.vitest.ts` would duplicate existing fallback coverage unless it is narrowed to **new behavior only** (for example, first-call priming once it actually exists).

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/runtime-detection.vitest.ts:20-65`]
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/cross-runtime-fallback.vitest.ts:8-121`]

#### 5.2 Session trust resolution is already covered
`session-manager-extended.vitest.ts` already tests:
- trusted server-tracked sessions
- uncorroborated sessions rejected
- scope mismatches rejected
- invented session IDs rejected
- omitted `sessionId` causing server-generated session IDs

Handler-level tests also mock `resolveTrustedSession()` directly, so the session boundary is already well represented.

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:270-342`]
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:253-256`]

#### 5.3 Auto-surface-at-dispatch behavior already has a strong test pattern
`dual-scope-hooks.vitest.ts` already exercises `autoSurfaceAtToolDispatch()` and `autoSurfaceAtCompaction()`, including lifecycle firing, result shape, array fields, timestamps, and latency fields.

This is a **better pattern reference** for future auto-enrichment tests than `mcp-tool-dispatch.vitest.ts`, because `mcp-tool-dispatch.vitest.ts` is only a shallow export/callability smoke test.

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:292-377`]
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:72-115`]

#### 5.4 Query routing to `code_graph` already exists, but not code-graph E2E execution
`runtime-routing.vitest.ts` already tests a pure query router that sends structural questions to `code_graph`, semantic questions to CocoIndex, and session questions to memory. That overlaps conceptually with iteration 069's integration aspirations, but it is **not** an end-to-end graph test: it does not invoke `code_graph_scan`, `code_graph_query`, or `code_graph_context`.

So there is still room for a true code-graph pipeline E2E test file.

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/runtime-routing.vitest.ts:7-65`]
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:17-45`]

### 6. Corrected verdict on iteration 069
Iteration 069's testing strategy was **directionally correct** about the Vitest style and the need for more code-graph coverage, but it is **not accurate as a current execution plan**.

#### What remains clearly missing and valuable
1. `code-graph-endline-fix.vitest.ts`
2. `code-graph-edge-types.vitest.ts` (land together with implementation)
3. `code-graph-integration-e2e.vitest.ts`

#### What should be revised or folded into existing files
1. **Staleness testing** should target the current `isFileStale(filePath, currentHash)` + `handleCodeGraphScan()` incremental skip behavior, not the unimplemented mtime/`ensureFreshFiles()` design.
2. **Auto-enrichment testing** should extend the `dual-scope-hooks` pattern once graph/CocoIndex auto-enrichment exists, rather than creating a suite around currently-missing `GRAPH_AWARE_TOOLS` behavior.
3. **Cross-runtime testing** should extend existing `runtime-detection`, `cross-runtime-fallback`, and `session-manager-extended` suites once first-call priming is implemented, not duplicate what those files already test.

**Bottom line:** the current suite supports the proposed testing *style*, but not all of iteration 069's proposed helper names, file boundaries, or "net new" estimates.

## Ruled Out
- Treating `mcp-tool-dispatch.vitest.ts` as the primary pattern reference for graph auto-enrichment tests. It is a shallow dispatch smoke test, not a realistic behavior/mocking template.
- Treating code-graph staleness as already mtime-based. The current implementation compares only `content_hash`.
- Treating first-call priming tests as runnable today. The verification pass found no `FirstCallTracker` implementation in the current code.

## Dead Ends
- Searching for dedicated `code_graph_scan` / `code_graph_query` / `code_graph_context` tests in `mcp_server/tests/` did not surface any direct handler/E2E coverage. The closest overlap is `runtime-routing.vitest.ts`, which only tests query classification.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/package.json`
- `.opencode/skill/system-spec-kit/mcp_server/vitest.config.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-indexer.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/budget-allocator.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/graph-flags.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/runtime-detection.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/cross-runtime-fallback.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/runtime-routing.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/runtime-detection.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/` directory listing (full inventory)

## Assessment
- New information ratio: **0.61**
- Questions addressed: **3/3**
- Questions answered: **3/3**
  - What test files exist now? **Answered** — 349 current `*.vitest.ts` files, full inventory appended.
  - Are the proposed test designs compatible with current Vitest infrastructure? **Answered** — mostly style-compatible, but several target helpers are still design-only.
  - Do existing tests already cover any proposed scenarios? **Answered** — yes, especially cross-runtime fallback, session trust resolution, and auto-surface lifecycle behavior.

## Reflection
- **What worked and why:** Reading a representative parser test, a small unit-style allocator test, an env-driven flag test, and then the overlapping runtime/session/auto-surface tests gave a reliable picture of the current suite without needing to open dozens of files. The combination of direct file reads plus exact `rg` verification made it possible to separate "already covered," "missing," and "proposed but unimplemented" with confidence.
- **What did not work and why:** Iteration 069's assumption that `mcp-tool-dispatch.vitest.ts` would be the key mocking reference did not hold up; that file is much thinner than expected and is not a strong template for new behavior tests.
- **What I would do differently:** If another verification pass is needed, the next high-value step would be reading any future dedicated handler tests for `handlers/code-graph/*.ts` as soon as they appear, because today the main remaining gap is true scan/query/context execution coverage.

## Recommended Next Focus
Use this corrected assessment in the segment-7 synthesis: revise the testing roadmap from "6 all-new files / 40 all-new cases" to "3 clearly new files + targeted extensions to existing runtime/session/auto-surface suites." That revision better matches the current codebase and avoids duplicating tests that already exist.

## Appendix A: Full Current `mcp_server/tests` Inventory

- `ablation-framework.vitest.ts`
- `access-tracker-extended.vitest.ts`
- `access-tracker.vitest.ts`
- `adaptive-fallback.vitest.ts`
- `adaptive-fusion.vitest.ts`
- `adaptive-ranking.vitest.ts`
- `anchor-id-simplification.vitest.ts`
- `anchor-metadata.vitest.ts`
- `anchor-prefix-matching.vitest.ts`
- `api-key-validation.vitest.ts`
- `api-public-surfaces.vitest.ts`
- `api-validation.vitest.ts`
- `archival-manager.vitest.ts`
- `artifact-routing.vitest.ts`
- `assistive-reconsolidation.vitest.ts`
- `attention-decay.vitest.ts`
- `batch-learning.vitest.ts`
- `batch-processor.vitest.ts`
- `bm25-baseline.vitest.ts`
- `bm25-index.vitest.ts`
- `bm25-security.vitest.ts`
- `budget-allocator.vitest.ts`
- `calibrated-overlap-bonus.vitest.ts`
- `causal-boost.vitest.ts`
- `causal-edges-unit.vitest.ts`
- `causal-edges.vitest.ts`
- `causal-fixes.vitest.ts`
- `channel-enforcement.vitest.ts`
- `channel-representation.vitest.ts`
- `checkpoint-completeness.vitest.ts`
- `checkpoint-limit.vitest.ts`
- `checkpoint-working-memory.vitest.ts`
- `checkpoints-extended.vitest.ts`
- `checkpoints-storage.vitest.ts`
- `chunk-thinning.vitest.ts`
- `chunking-orchestrator-swap.vitest.ts`
- `chunking-orchestrator.vitest.ts`
- `cli.vitest.ts`
- `co-activation.vitest.ts`
- `code-graph-indexer.vitest.ts`
- `cognitive-gaps.vitest.ts`
- `cold-start.vitest.ts`
- `community-detection.vitest.ts`
- `compact-merger.vitest.ts`
- `composite-scoring.vitest.ts`
- `concept-routing.vitest.ts`
- `confidence-tracker.vitest.ts`
- `confidence-truncation.vitest.ts`
- `config-cognitive.vitest.ts`
- `consumption-logger.vitest.ts`
- `content-hash-dedup.vitest.ts`
- `content-normalizer.vitest.ts`
- `context-server-error-envelope.vitest.ts`
- `context-server.vitest.ts`
- `continue-session.vitest.ts`
- `corrections.vitest.ts`
- `crash-recovery.vitest.ts`
- `create-record-lineage-regressions.vitest.ts`
- `cross-encoder-circuit-breaker.vitest.ts`
- `cross-encoder-extended.vitest.ts`
- `cross-encoder.vitest.ts`
- `cross-feature-integration-eval.vitest.ts`
- `cross-runtime-fallback.vitest.ts`
- `d5-confidence-scoring.vitest.ts`
- `d5-recovery-payload.vitest.ts`
- `db-dimension-integrity.vitest.ts`
- `db-state-graph-reinit.vitest.ts`
- `db-state.vitest.ts`
- `dead-code-regression.vitest.ts`
- `decay-delete-race.vitest.ts`
- `decay.vitest.ts`
- `deferred-features-integration.vitest.ts`
- `degree-computation.vitest.ts`
- `dual-scope-hooks.vitest.ts`
- `dynamic-token-budget.vitest.ts`
- `edge-cases.vitest.ts`
- `edge-density.vitest.ts`
- `embedding-cache.vitest.ts`
- `embedding-expansion.vitest.ts`
- `embedding-pipeline-weighting.vitest.ts`
- `embedding-retry-stats.vitest.ts`
- `embedding-weighting.vitest.ts`
- `embeddings.vitest.ts`
- `empty-result-recovery.vitest.ts`
- `encoding-intent.vitest.ts`
- `entity-extractor.vitest.ts`
- `entity-linker.vitest.ts`
- `envelope.vitest.ts`
- `error-sanitization.vitest.ts`
- `errors-comprehensive.vitest.ts`
- `eval-db.vitest.ts`
- `eval-logger.vitest.ts`
- `eval-metrics.vitest.ts`
- `eval-the-eval.vitest.ts`
- `evidence-gap-detector.vitest.ts`
- `extraction-adapter.vitest.ts`
- `feature-eval-graph-signals.vitest.ts`
- `feature-eval-query-intelligence.vitest.ts`
- `feature-eval-scoring-calibration.vitest.ts`
- `feature-flag-reference-docs.vitest.ts`
- `feedback-denylist.vitest.ts`
- `feedback-ledger.vitest.ts`
- `file-watcher.vitest.ts`
- `five-factor-scoring.vitest.ts`
- `flag-ceiling.vitest.ts`
- `folder-discovery-integration.vitest.ts`
- `folder-discovery.vitest.ts`
- `folder-relevance.vitest.ts`
- `folder-scoring-overflow.vitest.ts`
- `folder-scoring.vitest.ts`
- `fsrs-hybrid-decay.vitest.ts`
- `fsrs-scheduler.vitest.ts`
- `full-spec-doc-indexing.vitest.ts`
- `governance-e2e.vitest.ts`
- `graph-calibration.vitest.ts`
- `graph-flags.vitest.ts`
- `graph-lifecycle.vitest.ts`
- `graph-regression-flag-off.vitest.ts`
- `graph-roadmap-finalization.vitest.ts`
- `graph-scoring-integration.vitest.ts`
- `graph-search-fn.vitest.ts`
- `graph-signals.vitest.ts`
- `ground-truth-feedback.vitest.ts`
- `ground-truth.vitest.ts`
- `handler-causal-graph.vitest.ts`
- `handler-checkpoints-edge.vitest.ts`
- `handler-checkpoints.vitest.ts`
- `handler-eval-reporting.vitest.ts`
- `handler-helpers.vitest.ts`
- `handler-memory-context.vitest.ts`
- `handler-memory-crud.vitest.ts`
- `handler-memory-health-edge.vitest.ts`
- `handler-memory-index-cooldown.vitest.ts`
- `handler-memory-index.vitest.ts`
- `handler-memory-ingest-edge.vitest.ts`
- `handler-memory-ingest.vitest.ts`
- `handler-memory-list-edge.vitest.ts`
- `handler-memory-save.vitest.ts`
- `handler-memory-search.vitest.ts`
- `handler-memory-stats-edge.vitest.ts`
- `handler-memory-triggers.vitest.ts`
- `handler-session-learning.vitest.ts`
- `history.vitest.ts`
- `hook-precompact.vitest.ts`
- `hook-session-start.vitest.ts`
- `hook-shared.vitest.ts`
- `hook-state.vitest.ts`
- `hook-stop-token-tracking.vitest.ts`
- `hooks-mutation-wiring.vitest.ts`
- `hooks-ux-feedback.vitest.ts`
- `hybrid-decay-policy.vitest.ts`
- `hybrid-search-context-headers.vitest.ts`
- `hybrid-search-flags.vitest.ts`
- `hybrid-search.vitest.ts`
- `hydra-spec-pack-consistency.vitest.ts`
- `importance-tiers.vitest.ts`
- `incremental-index-v2.vitest.ts`
- `incremental-index.vitest.ts`
- `integration-138-pipeline.vitest.ts`
- `integration-causal-graph.vitest.ts`
- `integration-checkpoint-lifecycle.vitest.ts`
- `integration-error-recovery.vitest.ts`
- `integration-learning-history.vitest.ts`
- `integration-save-pipeline.vitest.ts`
- `integration-search-pipeline.vitest.ts`
- `integration-session-dedup.vitest.ts`
- `integration-trigger-pipeline.vitest.ts`
- `intent-aware-traversal.vitest.ts`
- `intent-classifier.vitest.ts`
- `intent-routing.vitest.ts`
- `intent-weighting.vitest.ts`
- `interfaces.vitest.ts`
- `interference.vitest.ts`
- `job-queue-state-edge.vitest.ts`
- `job-queue.vitest.ts`
- `k-value-judged-sweep.vitest.ts`
- `k-value-optimization.vitest.ts`
- `layer-definitions.vitest.ts`
- `lazy-loading.vitest.ts`
- `learned-combiner.vitest.ts`
- `learned-feedback.vitest.ts`
- `learning-stats-filters.vitest.ts`
- `lifecycle-shutdown.vitest.ts`
- `local-reranker.vitest.ts`
- `mcp-error-format.vitest.ts`
- `mcp-input-validation.vitest.ts`
- `mcp-response-envelope.vitest.ts`
- `mcp-tool-dispatch.vitest.ts`
- `memory-context-eval-channels.vitest.ts`
- `memory-context-session-state.vitest.ts`
- `memory-context.vitest.ts`
- `memory-crud-extended.vitest.ts`
- `memory-delete-cascade.vitest.ts`
- `memory-governance.vitest.ts`
- `memory-lineage-backfill.vitest.ts`
- `memory-lineage-state.vitest.ts`
- `memory-parser-extended.vitest.ts`
- `memory-parser.vitest.ts`
- `memory-roadmap-flags.vitest.ts`
- `memory-save-dedup-order.vitest.ts`
- `memory-save-extended.vitest.ts`
- `memory-save-integration.vitest.ts`
- `memory-save-pipeline-enforcement.vitest.ts`
- `memory-save-ux-regressions.vitest.ts`
- `memory-save.vitest.ts`
- `memory-search-eval-channels.vitest.ts`
- `memory-search-integration.vitest.ts`
- `memory-search-quality-filter.vitest.ts`
- `memory-search-ux-hooks.vitest.ts`
- `memory-state-baseline.vitest.ts`
- `memory-summaries.vitest.ts`
- `memory-tools.vitest.ts`
- `memory-types.vitest.ts`
- `migration-checkpoint-scripts.vitest.ts`
- `mmr-reranker.vitest.ts`
- `modularization.vitest.ts`
- `mpab-aggregation.vitest.ts`
- `mpab-quality-gate-integration.vitest.ts`
- `mutation-hooks.vitest.ts`
- `mutation-ledger.vitest.ts`
- `n3lite-consolidation.vitest.ts`
- `orchestrator-error-cascade.vitest.ts`
- `pe-gating.vitest.ts`
- `phase2-integration.vitest.ts`
- `pipeline-architecture-remediation.vitest.ts`
- `pipeline-integration.vitest.ts`
- `pipeline-v2.vitest.ts`
- `prediction-error-gate.vitest.ts`
- `preflight.vitest.ts`
- `pressure-monitor.vitest.ts`
- `progressive-disclosure.vitest.ts`
- `progressive-validation.vitest.ts`
- `promotion-positive-validation-semantics.vitest.ts`
- `protect-learning.vitest.ts`
- `quality-gate-exception.vitest.ts`
- `quality-loop.vitest.ts`
- `query-classifier.vitest.ts`
- `query-decomposer.vitest.ts`
- `query-decomposition.vitest.ts`
- `query-expander.vitest.ts`
- `query-router-channel-interaction.vitest.ts`
- `query-router.vitest.ts`
- `query-surrogates.vitest.ts`
- `reconsolidation-bridge.vitest.ts`
- `reconsolidation-cleanup-ordering.vitest.ts`
- `reconsolidation.vitest.ts`
- `recovery-hints.vitest.ts`
- `redaction-gate.vitest.ts`
- `regression-010-index-large-files.vitest.ts`
- `regression-suite.vitest.ts`
- `reporting-dashboard.vitest.ts`
- `reranker-eval-comparison.vitest.ts`
- `reranker.vitest.ts`
- `response-profile-formatters.vitest.ts`
- `result-confidence-scoring.vitest.ts`
- `retrieval-directives.vitest.ts`
- `retrieval-telemetry.vitest.ts`
- `retrieval-trace.vitest.ts`
- `retry-manager-health.vitest.ts`
- `retry-manager.vitest.ts`
- `review-fixes.vitest.ts`
- `rollout-policy.vitest.ts`
- `rrf-degree-channel.vitest.ts`
- `rrf-fusion.vitest.ts`
- `runtime-detection.vitest.ts`
- `runtime-routing.vitest.ts`
- `safety.vitest.ts`
- `save-index-exports.vitest.ts`
- `save-quality-gate.vitest.ts`
- `schema-migration.vitest.ts`
- `score-normalization.vitest.ts`
- `score-resolution-consistency.vitest.ts`
- `scoring-gaps.vitest.ts`
- `scoring-observability.vitest.ts`
- `scoring.vitest.ts`
- `search-archival.vitest.ts`
- `search-extended.vitest.ts`
- `search-fallback-tiered.vitest.ts`
- `search-flags.vitest.ts`
- `search-limits-scoring.vitest.ts`
- `search-results-format.vitest.ts`
- `session-boost.vitest.ts`
- `session-cleanup.vitest.ts`
- `session-learning-regressions.vitest.ts`
- `session-learning.vitest.ts`
- `session-lifecycle.vitest.ts`
- `session-manager-extended.vitest.ts`
- `session-manager-stress.vitest.ts`
- `session-manager.vitest.ts`
- `session-state.vitest.ts`
- `session-token-resume.vitest.ts`
- `shadow-comparison.vitest.ts`
- `shadow-evaluation-runtime.vitest.ts`
- `shadow-scoring-holdout.vitest.ts`
- `shadow-scoring.vitest.ts`
- `shared-memory-e2e.vitest.ts`
- `shared-memory-handlers.vitest.ts`
- `shared-spaces.vitest.ts`
- `short-critical-quality-gate.vitest.ts`
- `signal-vocab.vitest.ts`
- `slug-utils-boundary.vitest.ts`
- `sparse-first-graph.vitest.ts`
- `spec-folder-canonicalization.vitest.ts`
- `spec-folder-hierarchy.vitest.ts`
- `spec-folder-prefilter.vitest.ts`
- `sqlite-fts.vitest.ts`
- `stage1-expansion.vitest.ts`
- `stage2-fusion.vitest.ts`
- `stage2b-enrichment-extended.vitest.ts`
- `stage2b-enrichment.vitest.ts`
- `stage3-rerank-regression.vitest.ts`
- `startup-checks.vitest.ts`
- `stdio-logging-safety.vitest.ts`
- `structure-aware-chunker.vitest.ts`
- `temporal-contiguity.vitest.ts`
- `tier-classifier.vitest.ts`
- `tiered-injection-turnNumber.vitest.ts`
- `token-budget-enforcement.vitest.ts`
- `token-budget.vitest.ts`
- `token-snapshot-store.vitest.ts`
- `tool-cache.vitest.ts`
- `tool-input-schema.vitest.ts`
- `trace-propagation.vitest.ts`
- `transaction-manager-extended.vitest.ts`
- `transaction-manager-recovery.vitest.ts`
- `transaction-manager.vitest.ts`
- `trigger-config-extended.vitest.ts`
- `trigger-extractor.vitest.ts`
- `trigger-matcher.vitest.ts`
- `trigger-setAttentionScore.vitest.ts`
- `typed-traversal.vitest.ts`
- `unit-composite-scoring-types.vitest.ts`
- `unit-folder-scoring-types.vitest.ts`
- `unit-fsrs-formula.vitest.ts`
- `unit-normalization-roundtrip.vitest.ts`
- `unit-normalization.vitest.ts`
- `unit-path-security.vitest.ts`
- `unit-rrf-fusion.vitest.ts`
- `unit-tier-classifier-types.vitest.ts`
- `unit-transaction-metrics-types.vitest.ts`
- `validation-metadata.vitest.ts`
- `vector-index-impl.vitest.ts`
- `vector-index-schema-compatibility.vitest.ts`
- `vector-index-schema-migration-refinements.vitest.ts`
- `vector-index-store-remediation.vitest.ts`
- `vector-index-store.vitest.ts`
- `workflow-memory-tracking.vitest.ts`
- `working-memory-event-decay.vitest.ts`
- `working-memory.vitest.ts`
