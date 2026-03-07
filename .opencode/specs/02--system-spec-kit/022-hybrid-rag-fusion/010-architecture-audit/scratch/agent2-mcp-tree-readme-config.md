# MCP Server Inventory: Tree, READMEs, Configs

- Scope: `.opencode/skill/system-spec-kit/mcp_server/`
- Exclusions: `node_modules/`, `dist/`
- Snapshot stats (excluded dirs omitted): `42` directories, `482` regular files, `33` README files, `2` symlinks.

## 1) Complete ASCII Tree Diagram

```text
mcp_server
|-- api
|   |-- eval.ts
|   |-- index.ts
|   |-- providers.ts
|   `-- search.ts
|-- configs
|   |-- cognitive.ts
|   |-- README.md
|   `-- search-weights.json
|-- core
|   |-- config.ts
|   |-- db-state.ts
|   |-- index.ts
|   `-- README.md
|-- database
|   |-- .gitkeep
|   |-- context-index__voyage__voyage-4__1024.sqlite
|   |-- context-index__voyage__voyage-4__1024.sqlite-shm
|   |-- context-index__voyage__voyage-4__1024.sqlite-wal
|   |-- context-index.sqlite
|   |-- README.md
|   |-- speckit-eval.db
|   |-- speckit-eval.db-shm
|   `-- speckit-eval.db-wal
|-- formatters
|   |-- index.ts
|   |-- README.md
|   |-- search-results.ts
|   `-- token-metrics.ts
|-- handlers
|   |-- causal-graph.ts
|   |-- causal-links-processor.ts
|   |-- checkpoints.ts
|   |-- chunking-orchestrator.ts
|   |-- eval-reporting.ts
|   |-- index.ts
|   |-- memory-bulk-delete.ts
|   |-- memory-context.ts
|   |-- memory-crud-delete.ts
|   |-- memory-crud-health.ts
|   |-- memory-crud-list.ts
|   |-- memory-crud-stats.ts
|   |-- memory-crud-types.ts
|   |-- memory-crud-update.ts
|   |-- memory-crud-utils.ts
|   |-- memory-crud.ts
|   |-- memory-index-alias.ts
|   |-- memory-index-discovery.ts
|   |-- memory-index.ts
|   |-- memory-ingest.ts
|   |-- memory-save.ts
|   |-- memory-search.ts
|   |-- memory-triggers.ts
|   |-- pe-gating.ts
|   |-- quality-loop.ts
|   |-- README.md
|   |-- session-learning.ts
|   `-- types.ts
|-- hooks
|   |-- index.ts
|   |-- memory-surface.ts
|   `-- README.md
|-- lib
|   |-- architecture
|   |   |-- layer-definitions.ts
|   |   `-- README.md
|   |-- cache
|   |   |-- scoring
|   |   |   `-- composite-scoring.ts
|   |   |-- cognitive
|   |   |-- embedding-cache.ts
|   |   |-- README.md
|   |   `-- tool-cache.ts
|   |-- chunking
|   |   |-- anchor-chunker.ts
|   |   `-- chunk-thinning.ts
|   |-- cognitive
|   |   |-- archival-manager.ts
|   |   |-- attention-decay.ts
|   |   |-- co-activation.ts
|   |   |-- fsrs-scheduler.ts
|   |   |-- prediction-error-gate.ts
|   |   |-- pressure-monitor.ts
|   |   |-- README.md
|   |   |-- rollout-policy.ts
|   |   |-- temporal-contiguity.ts
|   |   |-- tier-classifier.ts
|   |   `-- working-memory.ts
|   |-- config
|   |   |-- memory-types.ts
|   |   |-- README.md
|   |   `-- type-inference.ts
|   |-- contracts
|   |   `-- README.md
|   |-- errors
|   |   |-- core.ts
|   |   |-- index.ts
|   |   |-- README.md
|   |   `-- recovery-hints.ts
|   |-- eval
|   |   |-- data
|   |   |   `-- ground-truth.json
|   |   |-- ablation-framework.ts
|   |   |-- bm25-baseline.ts
|   |   |-- channel-attribution.ts
|   |   |-- edge-density.ts
|   |   |-- eval-ceiling.ts
|   |   |-- eval-db.ts
|   |   |-- eval-logger.ts
|   |   |-- eval-metrics.ts
|   |   |-- eval-quality-proxy.ts
|   |   |-- ground-truth-data.ts
|   |   |-- ground-truth-feedback.ts
|   |   |-- ground-truth-generator.ts
|   |   |-- k-value-analysis.ts
|   |   |-- README.md
|   |   |-- reporting-dashboard.ts
|   |   `-- shadow-scoring.ts
|   |-- extraction
|   |   |-- entity-denylist.ts
|   |   |-- entity-extractor.ts
|   |   |-- extraction-adapter.ts
|   |   |-- README.md
|   |   `-- redaction-gate.ts
|   |-- graph
|   |   |-- community-detection.ts
|   |   `-- graph-signals.ts
|   |-- interfaces
|   |   |-- README.md
|   |   `-- vector-store.ts
|   |-- learning
|   |   |-- corrections.ts
|   |   |-- index.ts
|   |   `-- README.md
|   |-- manage
|   |   |-- pagerank.ts
|   |   `-- README.md
|   |-- ops
|   |   |-- file-watcher.ts
|   |   `-- job-queue.ts
|   |-- parsing
|   |   |-- content-normalizer.ts
|   |   |-- entity-scope.ts
|   |   |-- memory-parser.ts
|   |   |-- README.md
|   |   `-- trigger-matcher.ts
|   |-- providers
|   |   |-- embeddings.ts
|   |   |-- README.md
|   |   `-- retry-manager.ts
|   |-- response
|   |   |-- envelope.ts
|   |   `-- README.md
|   |-- scoring
|   |   |-- composite-scoring.ts
|   |   |-- confidence-tracker.ts
|   |   |-- folder-scoring.ts
|   |   |-- importance-tiers.ts
|   |   |-- interference-scoring.ts
|   |   |-- mpab-aggregation.ts
|   |   |-- negative-feedback.ts
|   |   `-- README.md
|   |-- search
|   |   |-- pipeline
|   |   |   |-- index.ts
|   |   |   |-- orchestrator.ts
|   |   |   |-- stage1-candidate-gen.ts
|   |   |   |-- stage2-fusion.ts
|   |   |   |-- stage3-rerank.ts
|   |   |   |-- stage4-filter.ts
|   |   |   `-- types.ts
|   |   |-- anchor-metadata.ts
|   |   |-- artifact-routing.ts
|   |   |-- auto-promotion.ts
|   |   |-- bm25-index.ts
|   |   |-- causal-boost.ts
|   |   |-- channel-enforcement.ts
|   |   |-- channel-representation.ts
|   |   |-- confidence-truncation.ts
|   |   |-- context-budget.ts
|   |   |-- cross-encoder.ts
|   |   |-- dynamic-token-budget.ts
|   |   |-- embedding-expansion.ts
|   |   |-- encoding-intent.ts
|   |   |-- entity-linker.ts
|   |   |-- evidence-gap-detector.ts
|   |   |-- feedback-denylist.ts
|   |   |-- folder-discovery.ts
|   |   |-- folder-relevance.ts
|   |   |-- fsrs.ts
|   |   |-- graph-flags.ts
|   |   |-- graph-search-fn.ts
|   |   |-- hybrid-search.ts
|   |   |-- intent-classifier.ts
|   |   |-- learned-feedback.ts
|   |   |-- local-reranker.ts
|   |   |-- memory-summaries.ts
|   |   |-- query-classifier.ts
|   |   |-- query-expander.ts
|   |   |-- query-router.ts
|   |   |-- README.md
|   |   |-- reranker.ts
|   |   |-- retrieval-directives.ts
|   |   |-- rsf-fusion.ts
|   |   |-- search-flags.ts
|   |   |-- search-types.ts
|   |   |-- session-boost.ts
|   |   |-- spec-folder-hierarchy.ts
|   |   |-- sqlite-fts.ts
|   |   |-- tfidf-summarizer.ts
|   |   |-- validation-metadata.ts
|   |   |-- vector-index-aliases.ts
|   |   |-- vector-index-impl.ts
|   |   |-- vector-index-mutations.ts
|   |   |-- vector-index-queries.ts
|   |   |-- vector-index-schema.ts
|   |   |-- vector-index-store.ts
|   |   |-- vector-index-types.ts
|   |   `-- vector-index.ts
|   |-- session
|   |   |-- README.md
|   |   `-- session-manager.ts
|   |-- storage
|   |   |-- access-tracker.ts
|   |   |-- causal-edges.ts
|   |   |-- checkpoints.ts
|   |   |-- consolidation.ts
|   |   |-- history.ts
|   |   |-- incremental-index.ts
|   |   |-- index-refresh.ts
|   |   |-- learned-triggers-schema.ts
|   |   |-- mutation-ledger.ts
|   |   |-- README.md
|   |   |-- reconsolidation.ts
|   |   |-- schema-downgrade.ts
|   |   `-- transaction-manager.ts
|   |-- telemetry
|   |   |-- consumption-logger.ts
|   |   |-- README.md
|   |   |-- retrieval-telemetry.ts
|   |   |-- scoring-observability.ts
|   |   `-- trace-schema.ts
|   |-- utils
|   |   |-- canonical-path.ts
|   |   |-- format-helpers.ts
|   |   |-- logger.ts
|   |   |-- path-security.ts
|   |   |-- README.md
|   |   `-- retry.ts
|   |-- validation
|   |   |-- preflight.ts
|   |   |-- README.md
|   |   `-- save-quality-gate.ts
|   |-- errors.ts
|   `-- README.md
|-- scripts
|   |-- README.md
|   `-- reindex-embeddings.ts
|-- specs
|   `-- descriptions.json
|-- tests
|   |-- fixtures
|   |   |-- contradiction-pairs.json
|   |   |-- sample-memories.json
|   |   `-- similarity-test-cases.json
|   |-- ablation-framework.vitest.ts
|   |-- access-tracker-extended.vitest.ts
|   |-- access-tracker.vitest.ts
|   |-- adaptive-fallback.vitest.ts
|   |-- adaptive-fusion.vitest.ts
|   |-- anchor-id-simplification.vitest.ts
|   |-- anchor-metadata.vitest.ts
|   |-- anchor-prefix-matching.vitest.ts
|   |-- api-key-validation.vitest.ts
|   |-- api-validation.vitest.ts
|   |-- archival-manager.vitest.ts
|   |-- artifact-routing.vitest.ts
|   |-- attention-decay.vitest.ts
|   |-- batch-processor.vitest.ts
|   |-- bm25-baseline.vitest.ts
|   |-- bm25-index.vitest.ts
|   |-- bm25-security.vitest.ts
|   |-- causal-boost.vitest.ts
|   |-- causal-edges-unit.vitest.ts
|   |-- causal-edges.vitest.ts
|   |-- causal-fixes.vitest.ts
|   |-- ceiling-quality.vitest.ts
|   |-- channel-enforcement.vitest.ts
|   |-- channel-representation.vitest.ts
|   |-- channel.vitest.ts
|   |-- checkpoint-limit.vitest.ts
|   |-- checkpoint-working-memory.vitest.ts
|   |-- checkpoints-extended.vitest.ts
|   |-- checkpoints-storage.vitest.ts
|   |-- chunk-thinning.vitest.ts
|   |-- co-activation.vitest.ts
|   |-- cognitive-gaps.vitest.ts
|   |-- cold-start.vitest.ts
|   |-- community-detection.vitest.ts
|   |-- composite-scoring.vitest.ts
|   |-- confidence-tracker.vitest.ts
|   |-- confidence-truncation.vitest.ts
|   |-- config-cognitive.vitest.ts
|   |-- consumption-logger.vitest.ts
|   |-- content-hash-dedup.vitest.ts
|   |-- content-normalizer.vitest.ts
|   |-- context-server.vitest.ts
|   |-- continue-session.vitest.ts
|   |-- corrections.vitest.ts
|   |-- crash-recovery.vitest.ts
|   |-- cross-encoder-extended.vitest.ts
|   |-- cross-encoder.vitest.ts
|   |-- cross-feature-integration-eval.vitest.ts
|   |-- db-state-graph-reinit.vitest.ts
|   |-- decay-delete-race.vitest.ts
|   |-- decay.vitest.ts
|   |-- deferred-features-integration.vitest.ts
|   |-- degree-computation.vitest.ts
|   |-- dual-scope-hooks.vitest.ts
|   |-- dynamic-token-budget.vitest.ts
|   |-- edge-density.vitest.ts
|   |-- embedding-cache.vitest.ts
|   |-- embedding-expansion.vitest.ts
|   |-- embeddings.vitest.ts
|   |-- encoding-intent.vitest.ts
|   |-- entity-extractor.vitest.ts
|   |-- entity-linker.vitest.ts
|   |-- entity-scope.vitest.ts
|   |-- envelope.vitest.ts
|   |-- errors-comprehensive.vitest.ts
|   |-- eval-db.vitest.ts
|   |-- eval-logger.vitest.ts
|   |-- eval-metrics.vitest.ts
|   |-- eval-the-eval.vitest.ts
|   |-- evidence-gap-detector.vitest.ts
|   |-- extraction-adapter.vitest.ts
|   |-- feature-eval-graph-signals.vitest.ts
|   |-- feature-eval-query-intelligence.vitest.ts
|   |-- feature-eval-scoring-calibration.vitest.ts
|   |-- feedback-denylist.vitest.ts
|   |-- five-factor-scoring.vitest.ts
|   |-- flag-ceiling.vitest.ts
|   |-- folder-discovery-integration.vitest.ts
|   |-- folder-discovery.vitest.ts
|   |-- folder-relevance.vitest.ts
|   |-- folder-scoring.vitest.ts
|   |-- fsrs-scheduler.vitest.ts
|   |-- full-spec-doc-indexing.vitest.ts
|   |-- graph-flags.vitest.ts
|   |-- graph-regression-flag-off.vitest.ts
|   |-- graph-scoring-integration.vitest.ts
|   |-- graph-search-fn.vitest.ts
|   |-- graph-signals.vitest.ts
|   |-- ground-truth-feedback.vitest.ts
|   |-- ground-truth.vitest.ts
|   |-- handler-causal-graph.vitest.ts
|   |-- handler-checkpoints.vitest.ts
|   |-- handler-helpers.vitest.ts
|   |-- handler-memory-context.vitest.ts
|   |-- handler-memory-crud.vitest.ts
|   |-- handler-memory-index-cooldown.vitest.ts
|   |-- handler-memory-index.vitest.ts
|   |-- handler-memory-save.vitest.ts
|   |-- handler-memory-search.vitest.ts
|   |-- handler-memory-triggers.vitest.ts
|   |-- handler-session-learning.vitest.ts
|   |-- history.vitest.ts
|   |-- hybrid-search-flags.vitest.ts
|   |-- hybrid-search.vitest.ts
|   |-- importance-tiers.vitest.ts
|   |-- incremental-index-v2.vitest.ts
|   |-- incremental-index.vitest.ts
|   |-- index-refresh.vitest.ts
|   |-- integration-138-pipeline.vitest.ts
|   |-- integration-causal-graph.vitest.ts
|   |-- integration-checkpoint-lifecycle.vitest.ts
|   |-- integration-error-recovery.vitest.ts
|   |-- integration-learning-history.vitest.ts
|   |-- integration-save-pipeline.vitest.ts
|   |-- integration-search-pipeline.vitest.ts
|   |-- integration-session-dedup.vitest.ts
|   |-- integration-trigger-pipeline.vitest.ts
|   |-- intent-classifier.vitest.ts
|   |-- intent-routing.vitest.ts
|   |-- intent-weighting.vitest.ts
|   |-- interfaces.vitest.ts
|   |-- interference.vitest.ts
|   |-- layer-definitions.vitest.ts
|   |-- lazy-loading.vitest.ts
|   |-- learned-feedback.vitest.ts
|   |-- learning-stats-filters.vitest.ts
|   |-- mcp-error-format.vitest.ts
|   |-- mcp-input-validation.vitest.ts
|   |-- mcp-response-envelope.vitest.ts
|   |-- mcp-tool-dispatch.vitest.ts
|   |-- memory-context.vitest.ts
|   |-- memory-crud-extended.vitest.ts
|   |-- memory-parser-extended.vitest.ts
|   |-- memory-parser.vitest.ts
|   |-- memory-save-extended.vitest.ts
|   |-- memory-save-integration.vitest.ts
|   |-- memory-search-integration.vitest.ts
|   |-- memory-search-quality-filter.vitest.ts
|   |-- memory-summaries.vitest.ts
|   |-- memory-types.vitest.ts
|   |-- mmr-reranker.vitest.ts
|   |-- modularization.vitest.ts
|   |-- mpab-aggregation.vitest.ts
|   |-- mpab-quality-gate-integration.vitest.ts
|   |-- mutation-ledger.vitest.ts
|   |-- n3lite-consolidation.vitest.ts
|   |-- pagerank.vitest.ts
|   |-- phase2-integration.vitest.ts
|   |-- pipeline-integration.vitest.ts
|   |-- pipeline-v2.vitest.ts
|   |-- prediction-error-gate.vitest.ts
|   |-- preflight.vitest.ts
|   |-- pressure-monitor.vitest.ts
|   |-- progressive-validation.vitest.ts
|   |-- protect-learning.vitest.ts
|   |-- quality-loop.vitest.ts
|   |-- query-classifier.vitest.ts
|   |-- query-expander.vitest.ts
|   |-- query-router-channel-interaction.vitest.ts
|   |-- query-router.vitest.ts
|   |-- README.md
|   |-- reconsolidation.vitest.ts
|   |-- recovery-hints.vitest.ts
|   |-- redaction-gate.vitest.ts
|   |-- regression-010-index-large-files.vitest.ts
|   |-- regression-suite.vitest.ts
|   |-- reporting-dashboard.vitest.ts
|   |-- reranker.vitest.ts
|   |-- retrieval-directives.vitest.ts
|   |-- retrieval-telemetry.vitest.ts
|   |-- retrieval-trace.vitest.ts
|   |-- retry-manager.vitest.ts
|   |-- retry.vitest.ts
|   |-- rollout-policy.vitest.ts
|   |-- rrf-degree-channel.vitest.ts
|   |-- rrf-fusion.vitest.ts
|   |-- rsf-fusion-edge-cases.vitest.ts
|   |-- rsf-fusion.vitest.ts
|   |-- rsf-multi.vitest.ts
|   |-- rsf-vs-rrf-kendall.vitest.ts
|   |-- safety.vitest.ts
|   |-- save-quality-gate.vitest.ts
|   |-- schema-migration.vitest.ts
|   |-- score-normalization.vitest.ts
|   |-- scoring-gaps.vitest.ts
|   |-- scoring-observability.vitest.ts
|   |-- scoring.vitest.ts
|   |-- search-archival.vitest.ts
|   |-- search-extended.vitest.ts
|   |-- search-fallback-tiered.vitest.ts
|   |-- search-flags.vitest.ts
|   |-- search-limits-scoring.vitest.ts
|   |-- search-results-format.vitest.ts
|   |-- session-boost.vitest.ts
|   |-- session-cleanup.vitest.ts
|   |-- session-lifecycle.vitest.ts
|   |-- session-manager-extended.vitest.ts
|   |-- session-manager.vitest.ts
|   |-- shadow-comparison.vitest.ts
|   |-- shadow-scoring.vitest.ts
|   |-- signal-vocab.vitest.ts
|   |-- spec-folder-hierarchy.vitest.ts
|   |-- spec-folder-prefilter.vitest.ts
|   |-- sqlite-fts.vitest.ts
|   |-- structure-aware-chunker.vitest.ts
|   |-- temporal-contiguity.vitest.ts
|   |-- tier-classifier.vitest.ts
|   |-- tiered-injection-turnNumber.vitest.ts
|   |-- token-budget-enforcement.vitest.ts
|   |-- token-budget.vitest.ts
|   |-- tool-cache.vitest.ts
|   |-- tool-input-schema.vitest.ts
|   |-- transaction-manager-extended.vitest.ts
|   |-- transaction-manager.vitest.ts
|   |-- trigger-config-extended.vitest.ts
|   |-- trigger-extractor.vitest.ts
|   |-- trigger-matcher.vitest.ts
|   |-- trigger-setAttentionScore.vitest.ts
|   |-- unit-composite-scoring-types.vitest.ts
|   |-- unit-folder-scoring-types.vitest.ts
|   |-- unit-fsrs-formula.vitest.ts
|   |-- unit-normalization-roundtrip.vitest.ts
|   |-- unit-normalization.vitest.ts
|   |-- unit-path-security.vitest.ts
|   |-- unit-rrf-fusion.vitest.ts
|   |-- unit-tier-classifier-types.vitest.ts
|   |-- unit-transaction-metrics-types.vitest.ts
|   |-- validation-metadata.vitest.ts
|   |-- vector-index-impl.vitest.ts
|   |-- working-memory-event-decay.vitest.ts
|   `-- working-memory.vitest.ts
|-- tools
|   |-- causal-tools.ts
|   |-- checkpoint-tools.ts
|   |-- context-tools.ts
|   |-- index.ts
|   |-- lifecycle-tools.ts
|   |-- memory-tools.ts
|   |-- README.md
|   `-- types.ts
|-- utils
|   |-- batch-processor.ts
|   |-- db-helpers.ts
|   |-- index.ts
|   |-- json-helpers.ts
|   |-- README.md
|   |-- tool-input-schema.ts
|   `-- validators.ts
|-- .node-version-marker
|-- cli.ts
|-- context-server.ts
|-- eslint.config.mjs
|-- INSTALL_GUIDE.md
|-- LICENSE
|-- package.json
|-- README.md
|-- startup-checks.ts
|-- tool-schemas.ts
|-- tsconfig.json
`-- vitest.config.ts
```

## 2) README Inventory (One-Line Scope Each)

| README Path (relative to `mcp_server/`) | One-line scope |
|---|---|
| `README.md` | AI memory that persists without poisoning your context window. |
| `configs/README.md` | This section provides an overview of the MCP Server Configuration Files directory. |
| `core/README.md` | This section provides an overview of the MCP Server Core Modules directory. |
| `database/README.md` | This section provides an overview of the MCP Server Database Storage directory. |
| `formatters/README.md` | This section provides an overview of the MCP Server Formatters directory. |
| `handlers/README.md` | This section provides an overview of the Handlers directory. |
| `hooks/README.md` | This section provides an overview of the Hooks directory. |
| `lib/README.md` | Core library modules for search, scoring, cognitive memory and storage. |
| `lib/architecture/README.md` | 7-layer MCP architecture with token budgets and document-aware routing after Spec 126. |
| `lib/cache/README.md` | Tool output caching with TTL, LRU eviction, and spec-document-aware invalidation paths. |
| `lib/cognitive/README.md` | Research-backed memory decay, retrieval, classification and lifecycle engine with document-aware scoring inputs. |
| `lib/config/README.md` | Memory-type decay configuration plus Spec 126 document-type inference and defaults. |
| `lib/contracts/README.md` | Typed contracts for the retrieval pipeline. Defines envelopes, traces, and degraded-mode handling for structured, observable retrieval. |
| `lib/errors/README.md` | Error handling subsystem with custom error classes and recovery hints for memory and spec-document workflows. |
| `lib/eval/README.md` | Evaluation, baseline measurement and quality metrics for the Spec Kit Memory search pipeline. |
| `lib/extraction/README.md` | Post-tool extraction pipeline for automated memory creation. Resolves memory IDs, orchestrates extraction, and gates PII/secret content before insert. |
| `lib/interfaces/README.md` | Protocol abstractions for embedding/vector backends, with shared-package migration notes. |
| `lib/learning/README.md` | Correction tracking that updates stability signals across memory and spec-document entries. |
| `lib/manage/README.md` | Graph-based authority scoring and batch management utilities consumed during `memory_manage` cycles. |
| `lib/parsing/README.md` | Memory file parsing and trigger matching for the Spec Kit Memory system. |
| `lib/providers/README.md` | Embedding provider abstraction and retry management for the Spec Kit Memory system. |
| `lib/response/README.md` | Standardized response envelope for MCP tools: `{summary, data, hints, meta}`. |
| `lib/scoring/README.md` | Multi-factor scoring system for memory retrieval with composite weighting, importance tiers, folder ranking and confidence tracking. |
| `lib/search/README.md` | 4-channel hybrid search architecture combining vector, lexical (BM25/FTS5), graph-based and structure-aware graph retrieval, fused with Reciprocal Rank Fusion (RRF) and Adaptive Fusion. |
| `lib/session/README.md` | Session management for the Spec Kit Memory MCP server. Handles deduplication and crash recovery with context persistence. |
| `lib/storage/README.md` | Persistence layer for the Spec Kit Memory MCP server. Handles memory indexing, checkpoints, causal graphs and atomic file operations. |
| `lib/telemetry/README.md` | Retrieval telemetry for observability and governance. Records latency, mode selection, fallback triggers, and composite quality scores for retrieval pipeline runs. |
| `lib/utils/README.md` | Utility functions for output formatting and path security. |
| `lib/validation/README.md` | Pre-flight quality gates for memory operations: anchor validation, duplicate detection, token budget verification and content size checks. |
| `scripts/README.md` | Operational entry points for maintenance tasks that run outside the normal MCP request lifecycle, such as forced full-reindex of embeddings. |
| `tests/README.md` | Vitest-based test suite for cognitive memory and MCP handlers. |
| `tools/README.md` | This section provides an overview of the Tools: Dispatch Layer directory. |
| `utils/README.md` | This section provides an overview of the MCP Server Utilities directory. |

## 3) Config Inventory and Relationships

### 3.1 Build/Tooling Config Files

| File | Role | Key relationships |
|---|---|---|
| `package.json` | Package metadata, runtime entrypoints, scripts | `main`/`exports` and `bin` point to `dist/*.js` build artifacts; scripts wire lint/test/start (`start` -> `node dist/context-server.js`, `lint` -> ESLint, `test` -> Vitest). |
| `tsconfig.json` | TypeScript project config for `mcp_server` | Extends `../tsconfig.json`; outputs to `./dist`; references `../shared`; includes TS files and `lib/eval/data/*.json`; excludes `node_modules` and `dist`. |
| `../tsconfig.json` (parent) | Composite workspace build graph | Parent references include `./mcp_server`, `./shared`, `./scripts`, so this project participates in a multi-project TS build. |
| `eslint.config.mjs` | Lint ruleset | Ignores `dist/**` and `node_modules/**`; `package.json` `lint` script executes this config via `eslint . --ext .ts`. |
| `vitest.config.ts` | Test runner config | Includes `tests/**/*.vitest.ts`; node environment; alias `@lib` -> `lib`; used by `package.json` test scripts. |
| Prettier config | Formatting config | No `prettier.config.*` / `.prettierrc*` found under `mcp_server/` (excluding `dist`/`node_modules`). |

### 3.2 Runtime Config Files (`configs/`)

| File | Role | Runtime consumers / relationships |
|---|---|---|
| `configs/search-weights.json` | Search-weight + trigger-cap config | Loaded in `lib/search/vector-index-store.ts` (`search_weights_path` + JSON parse). `maxTriggersPerMemory` consumed by `lib/search/vector-index-aliases.ts`. `smartRanking` weights consumed by `lib/search/vector-index-queries.ts` with code fallbacks. |
| `configs/cognitive.ts` | Environment-driven cognitive regex config + validation | Imported by `core/config.ts` and re-exported as `COGNITIVE_CONFIG`; parses `SPECKIT_COGNITIVE_COACTIVATION_PATTERN` and `...FLAGS` with safety checks. |
| `configs/README.md` | Documentation of active/legacy config semantics | Describes current config intent and points to scoring/search implementation modules as behavioral source of truth. |

### 3.3 Database Files (`database/`)

| File | Type | Relationship / notes |
|---|---|---|
| `database/context-index.sqlite` | Symlink | Compatibility path -> `../dist/database/context-index.sqlite` (canonical runtime DB location documented in `database/README.md`). |
| `database/context-index__voyage__voyage-4__1024.sqlite` + `-wal`/`-shm` | SQLite + WAL sidecars | Provider/dimension-specific DB variant present in source-tree database folder. |
| `database/speckit-eval.db` + `-wal`/`-shm` | SQLite + WAL sidecars | Eval database file; `lib/eval/eval-db.ts` defines `EVAL_DB_FILENAME = "speckit-eval.db"` and creates it under default DB dir. |
| `database/.gitkeep` | Control file | Keeps folder tracked when DB artifacts are absent. |
| `database/README.md` | Operational DB documentation | Declares canonical `dist/database/` runtime path and compatibility symlink behavior. |

### 3.4 Relationship Map (Concise)

1. `package.json` expects compiled output in `dist/` (`main`, `exports`, `bin`, `start`), which is produced according to `tsconfig.json` `outDir: ./dist`.
2. `tsconfig.json` extends parent TS config and references `../shared`; parent TS config references `./mcp_server` as part of the workspace project graph.
3. `eslint.config.mjs` and `vitest.config.ts` are invoked through `package.json` scripts and both intentionally target source/tests while excluding generated output.
4. `configs/search-weights.json` is runtime-read by search modules (`vector-index-store`), then consumed for trigger cap and smart-ranking weights in search execution.
5. `configs/cognitive.ts` centralizes env parsing/validation and feeds `core/config.ts` exported `COGNITIVE_CONFIG` used by runtime logic.
6. Main DB path comes from `core/config.ts` (`DATABASE_PATH`), with DB dir precedence mirrored in search/eval modules (`SPEC_KIT_DB_DIR` > `MEMORY_DB_DIR` > default).
7. Eval DB (`speckit-eval.db`) is a separate SQLite file managed by `lib/eval/eval-db.ts`, distinct from the main `context-index.sqlite` DB.
8. `database/context-index.sqlite` is a compatibility symlink; canonical runtime persistence is under `dist/database/` as documented by database/install docs.

### 3.5 Evidence Pointers

- `package.json`: lines 5-18 (`main`, `exports`, `bin`, `scripts`).
- `tsconfig.json`: lines 2, 6, 14-17 (`extends`, `outDir`, `references`, `include`).
- `eslint.config.mjs`: line 6 (`ignores` for `dist/**`, `node_modules/**`).
- `vitest.config.ts`: lines 13 and 18 (`tests/**/*.vitest.ts`, `@lib` alias).
- `core/config.ts`: lines 7, 35, 91 (`COGNITIVE_CONFIG` wiring, `DATABASE_PATH`).
- `lib/search/vector-index-store.ts`: lines 41, 54, 204, 208 (config load + DB dir/path defaults).
- `lib/search/vector-index-aliases.ts`: line 53 (`maxTriggersPerMemory` use).
- `lib/search/vector-index-queries.ts`: lines 850-852 (`smartRanking` weights use + fallbacks).
- `lib/eval/eval-db.ts`: lines 20, 25, 115-116 (`DEFAULT_DB_DIR`, `speckit-eval.db`, init path).
- `database/README.md`: lines 28-30, 64-65 (canonical `dist/database` + compatibility symlink).
