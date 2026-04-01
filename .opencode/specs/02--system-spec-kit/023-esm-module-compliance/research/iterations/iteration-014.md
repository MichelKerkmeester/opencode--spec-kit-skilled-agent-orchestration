# Iteration 14: Cross-Cutting Concerns -- Performance, Logging, Error Recovery, Database Health, Configuration

## Focus
Investigate cross-cutting concerns that affect search quality and UX across the entire pipeline rather than in any single stage: (1) performance/latency observability, (2) logging and diagnostic capability, (3) error recovery and graceful degradation, (4) SQLite database health configuration, (5) env var documentation completeness.

## Findings

### 1. Pipeline Timing is Comprehensive and Well-Structured
The pipeline orchestrator (`orchestrator.ts`) records per-stage timing for all 4 stages plus a `total` time. Each stage is individually timed (`timing.stage1` through `timing.stage4`) and the total is computed as `Date.now() - pipelineStart`. This timing data is returned in the `PipelineResult.metadata.timing` object. The `types.ts` file defines a dedicated `timing?: Record<string, number>` field (B1 requirement) with a comment explicitly naming "Per-stage and total timing in milliseconds for latency observability."

Beyond the pipeline, individual search channels also track timing:
- **Vector index**: `vector-index-aliases.ts` warns at >600ms, `vector-index-queries.ts` warns at >500ms for both enriched and multi-concept searches
- **Cross-encoder reranker**: Tracks last 100 latency samples (`MAX_LATENCY_SAMPLES`), exposes avg/P95/count via `getRerankerStatus()`, and has a 5-minute result cache (`CACHE_TTL = 300000`)
- **Local reranker**: Logs `durationMs` per batch with candidate counts
- **Stage 1**: Records its own `durationMs` in metadata

**Verdict**: Timing observability is production-grade. Per-stage and per-channel timing covers the full pipeline. The `includeTrace: true` parameter exposes this to callers.

[SOURCE: orchestrator.ts:44-195, types.ts:324-325, vector-index-aliases.ts:427-429, vector-index-queries.ts:764-766,850-852, cross-encoder.ts:104-119,438-442, local-reranker.ts:316-318]

### 2. Error Recovery Uses Three-Tier Degradation Pattern
The pipeline implements a clear three-tier degradation model:

**Tier 1 -- Stage 1 is MANDATORY**: If candidate generation fails, the entire pipeline throws `MemoryError('PIPELINE_STAGE1_FAILED')`. There is no fallback because there are no candidates to work with.

**Tier 2 -- Stages 2-4 degrade gracefully**: Each stage is wrapped in try/catch with `withTimeout(STAGE_TIMEOUT_MS=10000)`. On failure:
- Stage 2 failure: Returns unscored candidates with all signal statuses set to `'failed'`
- Stage 3 failure: Returns unranked but scored results (stage 2 output passed through)
- Stage 4 failure: Returns unfiltered results with empty annotations

Each failure sets `degraded = true` in the pipeline metadata and sets the stage's timing to 0, making it obvious in the response.

**Tier 3 -- Cross-encoder circuit breaker**: The cross-encoder module has a per-provider circuit breaker (3 consecutive failures opens the circuit for 60 seconds). When open, it returns positional fallback scores (0-0.5 range) instead of calling the API. This is the only circuit breaker in the entire system.

**Observation**: The per-stage timeout of 10 seconds is generous. With 4 stages, worst case is 40 seconds before the pipeline returns. However, since Stage 1 is by far the heaviest (embedding generation + multi-channel search), the 10s timeout is appropriate. Stages 2-4 are CPU-only signal integration and typically complete in <100ms.

[SOURCE: orchestrator.ts:62-78 (tier 1), 80-111 (tier 2 stage 2), 113-144 (tier 2 stage 3), 146-178 (tier 2 stage 4), cross-encoder.ts:121-169 (tier 3 circuit breaker)]

### 3. Logging is Extensive but All via console.warn -- No Structured Logger
The pipeline uses `console.warn()` exclusively for error/degradation logging. A count across just the pipeline directory reveals:
- **stage1-candidate-gen.ts**: 14 console.warn calls (facet failures, variant failures, channel failures, LLM reform failures, HyDE failures, summary channel failures, surrogate matching failures)
- **stage2-fusion.ts**: 20+ console.warn calls (one per signal integration step: session boost, causal boost, co-activation, community boost, graph signals, testing effect, intent weights, artifact routing, feedback signals, learned model, validation signals, adaptive access, strengthenOnAccess, negative feedback stats, learned trigger query)
- **stage3-rerank.ts**: 4 console.warn calls (MMR diversity, chunk reassembly, cross-encoder, fallback scoring)
- **orchestrator.ts**: 3 console.warn calls (stage 2/3/4 fallback)
- **stage2b-enrichment.ts**: 2 console.warn calls (anchor/validation metadata)

All warnings follow a consistent `[module-name] description: ${message}` prefix pattern. This is good for grep-ability but lacks:
- **No structured logging**: No JSON output, no log levels, no correlation IDs tying a search request to its pipeline execution
- **No timing in stage2 warnings**: When a signal step fails (e.g., "session boost failed"), only the error message is logged, not how long it took before failing
- **No aggregated per-request log**: No single log line summarizing the full pipeline execution (stage timings, degraded status, result count) -- this data is in the response but not logged

**Improvement opportunity (P3)**: A single structured log line at pipeline completion (`[pipeline] completed: {stages: {s1: 45ms, s2: 12ms, s3: 8ms, s4: 3ms, total: 68ms}, results: 10, degraded: false}`) would significantly improve diagnosability without adding complexity.

[SOURCE: pipeline/ directory console.warn grep, 41 total matches across 6 files]

### 4. SQLite Database Is Properly Configured with WAL and Health Checks
The database configuration follows SQLite best practices:

- **WAL mode enforcement**: `context-server.ts:1393-1398` checks `PRAGMA journal_mode` on startup and forces WAL mode if not already active, with a console.warn if it had to force it. This is T076 compliance.
- **Foreign keys**: Enabled via `PRAGMA foreign_keys = ON` in the checkpoint migration and test fixtures
- **Checkpoint operations**: The `create-checkpoint.ts` migration runs `PRAGMA wal_checkpoint(FULL)` for clean checkpoint creation
- **better-sqlite3**: Uses synchronous better-sqlite3 driver which provides automatic WAL checkpointing (the library handles `wal_checkpoint` automatically when the WAL file grows)

**Missing pragmas (minor)**: The codebase does not explicitly set:
- `PRAGMA cache_size` (defaults to -2000 = ~2MB, adequate for typical memory databases)
- `PRAGMA mmap_size` (disabled by default, not needed for small databases)
- `PRAGMA busy_timeout` (better-sqlite3 handles this internally with its `.timeout()` API)
- `PRAGMA synchronous` (WAL mode defaults to NORMAL which is the recommended setting)

**Verdict**: The database configuration is sound. The missing pragmas use sensible SQLite defaults that are appropriate for the database size (typically <50MB with <500 memories). No action needed.

[SOURCE: context-server.ts:1393-1398, scripts/migrations/create-checkpoint.ts:149, database/README.md:33]

### 5. Env Var Documentation Is Partial -- Only 4 of 50+ Documented in INSTALL_GUIDE
The INSTALL_GUIDE.md documents only 4 env vars in its configuration table:
- `SPECKIT_ADAPTIVE_FUSION` (default: true)
- `SPECKIT_EXTENDED_TELEMETRY` (default: false)
- `SPECKIT_MEMORY_ROADMAP_PHASE` (default: shared-rollout)
- `SPECKIT_MEMORY_GRAPH_UNIFIED` (default: true)

But iteration 1 of this research found 50+ SPECKIT_* env vars across the codebase (258 total occurrences across 30 files). The vast majority of feature flags, search tuning parameters, and capability gates are undocumented in any user-facing guide.

The search README.md (`lib/search/README.md`) documents some feature behaviors but does not provide an exhaustive env var reference. Individual module files document their own flags in code comments but there is no central registry.

**Missing from documentation**:
- All opt-in features: `SPECKIT_RECONSOLIDATION`, `SPECKIT_FILE_WATCHER`, `SPECKIT_RERANKER_LOCAL`, `SPECKIT_QUALITY_LOOP`, `SPECKIT_NOVELTY_BOOST`
- Pipeline tuning: `SPECKIT_GRAPH_WEIGHT_CAP`, `SPECKIT_GRAPH_BONUS_CAP`, `SPECKIT_DOC_TYPE_WEIGHT_SHIFT`
- Search behavior: `SPECKIT_SESSION_BOOST`, `SPECKIT_CAUSAL_BOOST`, `SPECKIT_ABLATION`
- Advanced: `SPECKIT_GRAPH_WALK_ROLLOUT`, `SPECKIT_SCOPE_ENFORCEMENT`, `SPECKIT_GOVERNANCE_GUARDRAILS`

**Improvement opportunity (P2)**: A central env var reference table (either in INSTALL_GUIDE.md or a dedicated ENV_VARS.md) listing all SPECKIT_* vars, their defaults, types, and descriptions would significantly help users and operators. The code already has good inline comments -- this would be a documentation extraction task.

[SOURCE: INSTALL_GUIDE.md:356-378,1027-1029 (4 documented vars), iteration 1 findings (50+ vars found)]

### 6. Cross-Encoder Has the Only Circuit Breaker -- Pipeline Stages Rely on Timeout-Only
The cross-encoder module (`cross-encoder.ts:121-169`) implements a proper circuit breaker pattern:
- Per-provider tracking (Voyage, Cohere, local)
- 3 consecutive failure threshold
- 60-second cooldown with half-open recovery
- Positional fallback scoring when circuit is open

However, no other component has a circuit breaker:
- **Stage 1 embedding generation**: If the embedding API is slow or failing, it relies only on the 10-second stage timeout. No circuit breaker means every request will wait up to 10 seconds before degrading. For embedding APIs (Voyage, OpenAI), which are called on every search, this could create repeated 10-second delays.
- **Auto-surface in memory-surface.ts**: Prior iterations noted the absence of a latency circuit breaker for auto-surface (P2 item from iteration 4). Auto-surface fires on every non-memory tool call. If search is slow (e.g., embedding API down), every tool call pays the penalty.
- **Constitutional cached query**: Has a 1-minute/10-limit cache which acts as a partial rate limiter but not a circuit breaker for failure scenarios.

**Assessment**: The embedding API path is the highest-risk missing circuit breaker. If the embedding provider (Voyage, OpenAI) goes down, every search request waits 10 seconds before timing out at Stage 1. Since Stage 1 is mandatory (no fallback), the entire search pipeline becomes a 10-second black hole. A circuit breaker on the embedding provider (similar to cross-encoder's pattern) would short-circuit to a text-only fallback (FTS5/BM25 only) much faster.

[SOURCE: cross-encoder.ts:121-169 (existing circuit breaker), orchestrator.ts:44,62-78 (stage 1 timeout, no circuit breaker), iteration 4 findings P2 item (auto-surface latency)]

### 7. Pipeline Response Envelope Provides Full Observability When Trace Is Enabled
When `includeTrace: true` is passed, the pipeline response includes:
- **Per-stage metadata**: Each stage's internal metrics (candidates generated, signals applied, quality filtered count, chunk reassembly stats, state filtered count, evidence gaps)
- **Timing breakdown**: `metadata.timing` with per-stage and total milliseconds
- **Degraded flag**: `metadata.degraded` boolean indicating if any stage fell back
- **Annotations**: Feature flags active, state distribution, constitutional injection count
- **Signal statuses**: Each stage 2 signal reports 'applied' | 'skipped' | 'failed' status

This is excellent for diagnosing "why did I get these results?" questions. The combination of signal statuses (which signals contributed), timing (which stages were slow), and degraded flag (which stages failed) gives operators a complete picture.

**Minor gap**: The trace does not include the raw scores from individual channels before RRF fusion. The `sourceScores` field on individual results preserves per-channel scores, but there is no global "channel contribution summary" in the pipeline metadata (e.g., "vector channel contributed 7 candidates, FTS5 contributed 3, BM25 contributed 5").

[SOURCE: orchestrator.ts:182-194 (response envelope), types.ts:200-325 (full type definitions for all metadata)]

## Ruled Out
- Searching for additional database pragmas (page_size, mmap_size): SQLite defaults are appropriate for the database scale
- Looking for a centralized logger module: The codebase uses console.warn consistently; no custom logger exists

## Dead Ends
None. All five cross-cutting concerns yielded meaningful findings.

## Sources Consulted
- `mcp_server/lib/search/pipeline/orchestrator.ts` (full file, 195 lines)
- `mcp_server/lib/search/pipeline/types.ts:202-325` (timing and metadata types)
- `mcp_server/lib/search/cross-encoder.ts:90-210` (circuit breaker, latency tracking)
- `mcp_server/lib/search/pipeline/` directory (console.warn grep, 41 matches across 6 files)
- `mcp_server/context-server.ts:1393-1398` (WAL mode enforcement)
- `mcp_server/INSTALL_GUIDE.md:356-378,1027-1029` (documented env vars)
- `mcp_server/lib/search/README.md:500-560` (feature documentation)
- `mcp_server/lib/search/vector-index-aliases.ts:427-429` (vector timing)
- `mcp_server/lib/search/vector-index-queries.ts:764-766,850-852` (vector timing)
- `mcp_server/lib/search/local-reranker.ts:316-318` (reranker timing)
- `mcp_server/scripts/migrations/create-checkpoint.ts:149` (WAL checkpoint)

## Assessment
- New information ratio: 0.43
- Questions addressed: cross-cutting-performance, cross-cutting-logging, cross-cutting-error-recovery, cross-cutting-db-health, cross-cutting-env-var-docs
- Questions answered: cross-cutting-performance (timing is comprehensive), cross-cutting-error-recovery (3-tier degradation confirmed), cross-cutting-db-health (WAL mode properly configured), cross-cutting-logging (extensive but unstructured), cross-cutting-env-var-docs (severely incomplete)

## Reflection
- What worked and why: Broad multi-pattern Grep across the pipeline directory for both console output and timing patterns gave a complete picture of observability and logging in just 2 searches. Reading the orchestrator.ts file (195 lines) gave the full degradation architecture in one pass.
- What did not work and why: N/A -- all approaches were productive, though the INSTALL_GUIDE.md review confirmed a documentation gap rather than discovering new code behavior.
- What I would do differently: For a future cross-cutting analysis, I would also check for memory leak patterns (Map caches without eviction, growing arrays) since the cross-encoder latencyTracker and cache Map both accumulate state. The latencyTracker has MAX_LATENCY_SAMPLES=100 with shift() (bounded), and the cache has TTL=300000 but no explicit size limit (potential slow leak for high-volume usage).

## Recommended Next Focus
Convergence analysis. The newInfoRatio has been declining (0.71 -> 0.64 -> 0.57 -> 0.43). All 10 original questions are answered. All P1 items are designed. All P2 items are resolved. Test coverage is mapped. Cross-cutting concerns are audited. The remaining value is in synthesis and final report preparation rather than additional investigation.

Two small items could fill a final investigation iteration:
1. Cache eviction audit: cross-encoder cache Map has no size limit; latencyTracker is bounded
2. Memory leak surface area: are there other unbounded Maps or arrays in the search pipeline?
