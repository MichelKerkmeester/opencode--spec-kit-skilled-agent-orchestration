# Prior Work Findings — specs/02--system-spec-kit/022-hybrid-rag-fusion

## 1. Modular retrieval pipeline wiring with default-on guards
- `002-hybrid-rag-fusion/implementation-summary.md` documents five new production modules (`mmr-reranker.ts`, `evidence-gap-detector.ts`, `query-expander.ts`, `pagerank.ts`, `structure-aware-chunker.ts`) and surgical edits in `hybrid-search.ts` plus `handlers/memory-search.ts` that turn hybrid search into a scatter-gather orchestrator. Each new feature is opt-out via the existing environment flag pattern (`rerank`, knowledge of `useGraph`, etc.) so guard-lifted functionality surfaces immediately for all deployments while keeping rapid rollback paths.
- The pattern to reuse: introduce a certified module/guard pair, wire it into the handler/pipeline layer, and then default-enable it with explicit `true`/`undefined` semantics plus opt-out via `'false'` strings, as described in the summary (carried over in `integration-search-pipeline.vitest.ts` C138 assertions). This keeps D-Wave compliance satisfied and prevents silent regressions.
- Evidence paths: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-hybrid-rag-fusion/implementation-summary.md` (sections describing MMR, evidence-gap wiring, query expansion, hybrid search changes, handler updates, integration test alignment).

## 2. Centralizing scoring constants for tests and runtime
- Same summary notes exports for `RELATION_WEIGHTS`, `BM25_FIELD_WEIGHTS`, `TIER_MULTIPLIER`, and `INTENT_LAMBDA_MAP`, plus updated test files (`tests/causal-edges.vitest.ts`, `tests/fsrs-scheduler.vitest.ts`, `tests/intent-classifier.vitest.ts`) that import the production exports instead of maintaining brittle copies. This ensures a single source of truth across runtime and regression coverage.
- Reusable pattern: whenever a module provides field-weight or intent-weight data, publish an explicit constant export and update dependent tests or adapters to import it rather than copy the literal. That guarantees immediate feedback when scores change and simplifies sk-code--opencode guidance on naming/const conventions.
- Evidence paths: `.../002-hybrid-rag-fusion/implementation-summary.md` (sections “Exported Constants” and “Test File Alignment”) plus the referenced production/test files names.

## 3. Deterministic index dedup + tier normalization
- `003-index-tier-anomalies/implementation-summary.md` reports that deduplication moved into `mcp_server/lib/parsing/memory-parser.ts`, index handler (`handlers/memory-index.ts`), and that tier precedence is normalized in `lib/scoring/importance-tiers.ts`, with accompanying vitest files updated for parser, handler, and tier logic.
- Reusable pattern: keep canonical-path dedup logic at parse time and enforce alias-flat dataset merging before the final indexing batch, while tier translation lives in a single utility with explicit precedence rules. Tests should target both parser edge cases and handler dedup sequences to guard alias-root regressions.
- Evidence path: `.../003-index-tier-anomalies/implementation-summary.md` (sections “What Was Built” referencing the three files and tests, plus verification list). Add reference to actual file names.

## 4. Frontmatter normalization + migration/runbook pipeline
- `004-frontmatter-indexing/implementation-summary.md` describes canonical frontmatter normalization, migration execution/backfill (`scripts/dist/memory/backfill-frontmatter.js`), template composition (`scripts/templates/compose.sh`), and targeted regression tests (`scripts/tests/test-frontmatter-backfill.js` plus memory-parser/index tests). Idempotency dry-run reports and reindex success confirm the pipeline.
- Reusable pattern: when normalizing metadata, pair the normalization script with compose/test tooling plus idempotency verification artifacts; capture both apply and dry-run reports so future features can re-run and prove zero-diff. This also provides a template for `sk-code--opencode` to document migration/runbook evidence requirements.
- Evidence path: `.../004-frontmatter-indexing/implementation-summary.md` (sections “What Was Built” and “How It Was Delivered”) citing script names and archived evidence files (`scratch/frontmatter-apply-report.json`, etc.).

## 5. Regression coverage for deterministic session detection
- `005-auto-detected-session-bug/implementation-summary.md` notes that the detector logic existed already, so this pass focused on adding the functional regression suite (`scripts/tests/test-folder-detector-functional.js`) and validating command docs to capture the intended behavior, while acknowledging the production/dist code already provided the root logic (`scripts/spec-folder/folder-detector.ts`, `.dist/...folder-detector.js`). The test ensures spec folder selection respects active vs archive roots, consistent paths, and mtime resilience.
- Reusable pattern: when behavioral fixes are already encoded, add a focused regression harness + documentation proof instead of touching runtime logic; verify tests pass (32/0/0) and record alignment in spec docs so future `sk-code--opencode` efforts know to treat test additions as completion evidence.
- Evidence path: `.../005-auto-detected-session-bug/implementation-summary.md` (sections “What Was Built” and “Verification”) referencing the test file and the detector implementation paths.

