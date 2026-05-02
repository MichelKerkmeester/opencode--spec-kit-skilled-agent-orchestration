---
# SPECKIT_TEMPLATE_SOURCE: migration-plan | v1
title: "Migration Plan: Stress Test Folder Completion"
description: "Content-based classification ledger for packet 038 stress-test folder migration."
trigger_phrases:
  - "025-stress-test-folder-completion"
  - "stress test full migration"
  - "search-quality harness move"
  - "content-based stress migration"
  - "stress folder reorganization"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    recent_action: "Classified stress files."
    next_safe_action: "Verify stress suite."
---

# Migration Plan: Stress Test Folder Completion

## Discovery Method

The migration used the operator-provided content discovery commands, not a filename-only
filter. The discovery covered the search-quality directory listing, harness imports,
stress-pattern terms, W-cell matrix terms, and recent stress-cycle commit subjects.

`git mv` was attempted first for the move set, but the sandbox could not create
`.git/index.lock`. Files were moved with filesystem moves after that blocker; no commit
was created.

## Classification Legend

| Classification | Meaning |
|----------------|---------|
| `STRESS_HARNESS` | Shared harness machinery for stress/search-quality runs |
| `STRESS_CONSUMER` | Test file importing the harness from outside the harness tree |
| `STRESS_PATTERN` | Whole-file stress, load, throughput, concurrency, or benchmark suite |
| `MATRIX_CELL` | W-cell, baseline, degraded-readiness, telemetry, or matrix invocation |
| `AMBIGUOUS` | Mixed unit/integration suite with one stress-like assertion; left in `tests/` |
| `NOT_STRESS` | False positive from content terms; left in `tests/` |

## Moved Files

| New Path | Classification | Rationale |
|----------|----------------|-----------|
| `mcp_server/stress_test/search-quality/corpus.ts` | `STRESS_HARNESS` | Corpus data feeds the search-quality harness and W-cell measurement cases. |
| `mcp_server/stress_test/search-quality/harness.ts` | `STRESS_HARNESS` | Harness runner captures timing and channel telemetry (`harness.ts:4`, `harness.ts:33`). |
| `mcp_server/stress_test/search-quality/measurement-fixtures.ts` | `STRESS_HARNESS` | Shared measurement runner plus W7 degraded stress fixtures (`measurement-fixtures.ts:42`, `measurement-fixtures.ts:155`). |
| `mcp_server/stress_test/search-quality/metrics.ts` | `STRESS_HARNESS` | Metric helpers used by search-quality stress assertions. |
| `mcp_server/stress_test/search-quality/baseline.vitest.ts` | `MATRIX_CELL` | Baseline harness invocation for search-quality matrix comparisons. |
| `mcp_server/stress_test/search-quality/harness-telemetry-export.vitest.ts` | `MATRIX_CELL` | Exercises telemetry JSONL export path from the harness (`harness.ts:229`). |
| `mcp_server/stress_test/search-quality/measurement-output.vitest.ts` | `MATRIX_CELL` | Verifies measurement artifact output for search-quality stress runs. |
| `mcp_server/stress_test/search-quality/w3-trust-tree.vitest.ts` | `MATRIX_CELL` | W3 matrix cell for trust-tree search quality behavior. |
| `mcp_server/stress_test/search-quality/w4-conditional-rerank.vitest.ts` | `MATRIX_CELL` | W4 matrix cell for conditional rerank behavior. |
| `mcp_server/stress_test/search-quality/w5-shadow-learned-weights.vitest.ts` | `MATRIX_CELL` | W5 matrix cell for shadow learned-weight evaluation. |
| `mcp_server/stress_test/search-quality/w6-cocoindex-calibration.vitest.ts` | `MATRIX_CELL` | W6 matrix cell for CocoIndex calibration behavior. |
| `mcp_server/stress_test/search-quality/w7-degraded-empty.vitest.ts` | `MATRIX_CELL` | W7 degraded-readiness stress cell for empty graph state. |
| `mcp_server/stress_test/search-quality/w7-degraded-full-scan.vitest.ts` | `MATRIX_CELL` | W7 degraded-readiness stress cell for full-scan fallback. |
| `mcp_server/stress_test/search-quality/w7-degraded-stale.vitest.ts` | `MATRIX_CELL` | W7 degraded-readiness stress cell for stale graph state. |
| `mcp_server/stress_test/search-quality/w7-degraded-unavailable.vitest.ts` | `MATRIX_CELL` | W7 degraded-readiness stress cell for unavailable graph state. |
| `mcp_server/stress_test/search-quality/w8-search-decision-envelope.vitest.ts` | `MATRIX_CELL` | W8 matrix cell for search decision envelope output. |
| `mcp_server/stress_test/search-quality/w10-degraded-readiness-integration.vitest.ts` | `MATRIX_CELL` | W10 degraded-readiness integration cell. |
| `mcp_server/stress_test/search-quality/w11-cocoindex-calibration-telemetry.vitest.ts` | `MATRIX_CELL` | W11 calibration telemetry cell. |
| `mcp_server/stress_test/search-quality/w13-decision-audit.vitest.ts` | `MATRIX_CELL` | W13 decision audit cell. |
| `mcp_server/stress_test/memory/gate-d-benchmark-memory-search.vitest.ts` | `STRESS_PATTERN` | Runs repeated memory search latency samples and asserts p95 threshold (`gate-d-benchmark-memory-search.vitest.ts:168`). |
| `mcp_server/stress_test/memory/gate-d-benchmark-trigger-fast-path.vitest.ts` | `STRESS_PATTERN` | Runs repeated trigger fast-path samples (`gate-d-benchmark-trigger-fast-path.vitest.ts:171`). |
| `mcp_server/stress_test/memory/gate-d-trigger-perf-benchmark.vitest.ts` | `STRESS_PATTERN` | Uses warmup plus 400 measured trigger iterations (`gate-d-trigger-perf-benchmark.vitest.ts:34`). |
| `mcp_server/stress_test/session/gate-d-benchmark-session-resume.vitest.ts` | `STRESS_PATTERN` | Runs repeated session resume latency samples (`gate-d-benchmark-session-resume.vitest.ts:133`). |
| `mcp_server/stress_test/session/gate-d-resume-perf.vitest.ts` | `STRESS_PATTERN` | Uses warmup and measured session resume benchmark loops (`gate-d-resume-perf.vitest.ts:14`). |
| `mcp_server/stress_test/session/session-manager-stress.vitest.ts` | `STRESS_PATTERN` | Interleaves concurrent session writes beyond max capacity (`session-manager-stress.vitest.ts:44`). |
| `mcp_server/stress_test/skill-advisor/skill-graph-rebuild-concurrency.vitest.ts` | `STRESS_PATTERN` | Exercises concurrent skill graph rebuild serialization (`skill-graph-rebuild-concurrency.vitest.ts:13`). |
| `mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts` | `STRESS_PATTERN` | Forces degraded graph states and fallback buckets (`code-graph-degraded-sweep.vitest.ts:15`). |
| `mcp_server/stress_test/code-graph/walker-dos-caps.vitest.ts` | `STRESS_PATTERN` | Exercises walker caps for oversized ignore input and max-depth traversal (`walker-dos-caps.vitest.ts:41`). |
| `mcp_server/stress_test/matrix/shadow-comparison.vitest.ts` | `MATRIX_CELL` | Runs 50+ synthetic query comparison and latency proxy checks (`shadow-comparison.vitest.ts:1`, `shadow-comparison.vitest.ts:230`). |

## Stress Consumers

No external `STRESS_CONSUMER` files were found by the requested harness-import grep.
The harness consumers live inside the moved search-quality tree and are classified as
`MATRIX_CELL` above.

## Ambiguous Files Left In `tests/`

| Current Path | Classification | Rationale |
|--------------|----------------|-----------|
| `mcp_server/tests/handler-memory-save.vitest.ts` | `AMBIGUOUS` | Contains concurrency coverage inside a broad memory-save handler suite. Extracting one assertion would exceed the folder migration scope. |
| `mcp_server/tests/atomic-index-memory.vitest.ts` | `AMBIGUOUS` | Atomic-write concurrency behavior is mixed with unit-level index state assertions. |
| `mcp_server/tests/db-state.vitest.ts` | `AMBIGUOUS` | Scan-lease concurrency appears inside core database state coverage. |
| `mcp_server/tests/trigger-matcher.vitest.ts` | `AMBIGUOUS` | Large-cache performance assertion is embedded in parser/matcher unit tests. |
| `mcp_server/tests/memory-governance.vitest.ts` | `AMBIGUOUS` | Scope-governance benchmark coverage is mixed with governance semantics. |
| `mcp_server/tests/memory-lineage-state.vitest.ts` | `AMBIGUOUS` | Lineage benchmark behavior is mixed with state-management assertions. |
| `mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts` | `AMBIGUOUS` | Plugin bridge dedup/concurrency coverage is mixed with plugin contract tests. |
| `mcp_server/tests/codex-user-prompt-submit-hook.vitest.ts` | `AMBIGUOUS` | Runtime hook cache p95 assertions are embedded in Codex hook behavior coverage. |
| `mcp_server/tests/claude-user-prompt-submit-hook.vitest.ts` | `AMBIGUOUS` | Runtime hook cache p95 assertions are embedded in Claude hook behavior coverage. |
| `mcp_server/tests/gemini-user-prompt-submit-hook.vitest.ts` | `AMBIGUOUS` | Runtime hook cache p95 assertions are embedded in Gemini hook behavior coverage. |
| `mcp_server/tests/deep-loop/cli-matrix.vitest.ts` | `AMBIGUOUS` | Uses matrix terminology for CLI dispatch parity, not a standalone stress matrix. |
| `mcp_server/tests/file-watcher.vitest.ts` | `AMBIGUOUS` | Contains concurrent rename coverage but is already isolated in a dedicated default-test script because of hang sensitivity. |
| `mcp_server/tests/executor-config-copilot-target-authority.vitest.ts` | `AMBIGUOUS` | Mentions a historical stress failure, but the file verifies target-authority configuration. |

## False Positives Left In `tests/`

| Current Path | Classification | Rationale |
|--------------|----------------|-----------|
| `mcp_server/tests/handler-memory-index.vitest.ts` | `NOT_STRESS` | Handler integration coverage; content grep hit non-stress indexing/load terms. |
| `mcp_server/tests/provenance-envelope.vitest.ts` | `NOT_STRESS` | Envelope correctness coverage; not a throughput or load suite. |
| `mcp_server/tests/code-graph-degraded-readiness-envelope-parity.vitest.ts` | `NOT_STRESS` | Parity regression coverage for degraded readiness envelope shape. |
| `mcp_server/tests/stage1-expansion.vitest.ts` | `NOT_STRESS` | Stage naming false positive; unit coverage for query expansion. |
| `mcp_server/tests/stage2-fusion.vitest.ts` | `NOT_STRESS` | Stage naming false positive; unit coverage for fusion behavior. |
| `mcp_server/tests/batch-processor.vitest.ts` | `NOT_STRESS` | Batch-processing semantics; no standalone stress intent. |
| `mcp_server/tests/concept-routing.vitest.ts` | `NOT_STRESS` | Routing semantics; content terms are not load-test intent. |
| `mcp_server/tests/query-decomposition.vitest.ts` | `NOT_STRESS` | Query decomposition behavior, not a stress suite. |
| `mcp_server/tests/query-decomposer.vitest.ts` | `NOT_STRESS` | Query decomposer unit behavior. |
| `mcp_server/tests/shadow-evaluation-runtime.vitest.ts` | `NOT_STRESS` | Runtime semantics for shadow evaluation, not matrix stress execution. |
| `mcp_server/tests/spec-folder-prefilter.vitest.ts` | `NOT_STRESS` | Prefilter correctness; grep hit scoring/load vocabulary. |
| `mcp_server/tests/adaptive-ranking.vitest.ts` | `NOT_STRESS` | Ranking semantics; not benchmarked as stress. |
| `mcp_server/tests/gate-d-regression-constitutional-memory.vitest.ts` | `NOT_STRESS` | Regression coverage for constitutional memory behavior. |
| `mcp_server/tests/handler-memory-search-live-envelope.vitest.ts` | `NOT_STRESS` | Live envelope correctness coverage. |
| `mcp_server/tests/memory-search-eval-channels.vitest.ts` | `NOT_STRESS` | Channel evaluation semantics. |
| `mcp_server/tests/pe-orchestration.vitest.ts` | `NOT_STRESS` | Prompt-engineering orchestration behavior. |
| `mcp_server/tests/code-graph-status-readiness-snapshot.vitest.ts` | `NOT_STRESS` | Snapshot/readiness correctness coverage. |
| `mcp_server/tests/graph-scoring-integration.vitest.ts` | `NOT_STRESS` | Integration scoring behavior, not a load suite. |
| `mcp_server/tests/gate-d-regression-embedding-semantic-search.vitest.ts` | `NOT_STRESS` | Regression coverage for semantic search. |
| `mcp_server/tests/orchestrator-error-cascade.vitest.ts` | `NOT_STRESS` | Error cascade behavior, not throughput stress. |
| `mcp_server/tests/graph-metadata-integration.vitest.ts` | `NOT_STRESS` | Metadata integration behavior. |
| `mcp_server/tests/gate-d-regression-4-stage-search-pipeline.vitest.ts` | `NOT_STRESS` | Search pipeline regression coverage; stage naming false positive. |
| `mcp_server/tests/memory-search-integration.vitest.ts` | `NOT_STRESS` | Memory search integration coverage. |
| `mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts` | `NOT_STRESS` | Pipeline enforcement semantics. |
| `mcp_server/tests/memory-search-ux-hooks.vitest.ts` | `NOT_STRESS` | UX hook behavior. |
| `mcp_server/tests/p0-c-graph-metadata-laundering.vitest.ts` | `NOT_STRESS` | Security/regression coverage for metadata laundering. |
| `mcp_server/tests/job-queue-state-edge.vitest.ts` | `NOT_STRESS` | Job queue edge-case coverage. |

## Config And Script Routing

| File | Decision |
|------|----------|
| `mcp_server/vitest.config.ts` | Default config excludes `mcp_server/stress_test/**`; `npm test` remains unit/integration oriented. |
| `mcp_server/vitest.stress.config.ts` | Dedicated stress config includes `mcp_server/stress_test/**/*.{vitest,test}.ts` and excludes normal test roots. |
| `mcp_server/package.json` | `stress`, `stress:harness`, and `stress:matrix` route through `vitest.stress.config.ts`. |

## Blockers And Follow-Up

No candidate was blocked by circular imports or Vitest discovery edge cases during the
migration pass. The only operational blocker was `git mv` failing to create
`.git/index.lock` under the sandbox, so blame-preserving index moves could not be
recorded from this environment.
