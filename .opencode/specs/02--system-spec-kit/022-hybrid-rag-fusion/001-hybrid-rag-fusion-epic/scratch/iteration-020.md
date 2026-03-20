# Iteration 20: Gap Analysis + Research Debt Inventory (FINAL)

## Focus
Final iteration of the 20-iteration deep research campaign. Identify what was NOT investigated, what claims lack strong evidence, what areas remain uncertain, and create a prioritized research debt backlog for future analysis campaigns.

## Method
Cross-referenced all 19 prior iterations' coverage against the full codebase structure (28 lib/ subdirectories, handlers/, tools/, database/, tests/). Mapped each subdirectory to the iteration(s) that investigated it, then identified unvisited or undervisited areas.

---

## 1. Codebase Coverage Map

### Total System Size
- 511 TypeScript files, ~190,637 LOC (excluding dist/ and node_modules/)
- 28 lib/ subdirectories + handlers/ (40 files, 14,280 LOC) + tools/ (7 files, 584 LOC)
- 284 test files

### Investigated Subsystems (with iteration coverage depth)

| Subsystem | Files | LOC | Investigated In | Depth |
|-----------|-------|-----|-----------------|-------|
| search/ (pipeline) | ~20 | ~3,100 | iter 1-6, 12-14 | DEEP |
| search/ (fusion) | ~5 | ~1,500 | iter 2, 5, 14 | DEEP |
| search/ (queries) | ~8 | ~2,000 | iter 3, 12, 13 | DEEP |
| cognitive/ | 11 | 4,644 | iter 10, 17 | MODERATE |
| eval/ | ~13 | ~2,500 | iter 8 | MODERATE |
| graph/ | 2 | 1,216 | iter 3 | MODERATE |
| collab/ (shared spaces) | 1 | 607 | iter 13 | MODERATE |
| session/ | 1 | 1,186 | iter 13 | MODERATE |
| scoring/ | 7 | 2,089 | iter 2 (partial) | SHALLOW |
| errors/ | 3 | 1,221 | iter 6 (partial) | SHALLOW |
| tools/ | 7 | 584 | iter 11 (naming only) | SHALLOW |
| handlers/save/ | ~8 | ~3,000 | iter 9 | DEEP |

### NOT Investigated Subsystems

| Subsystem | Files | LOC | Why It Matters |
|-----------|-------|-----|----------------|
| **storage/** | 13 | 7,148 | Largest uninvestigated subsystem. Contains DB schema, migration logic, SQLite operations, Vec0 integration, WAL management. All performance and correctness findings depend on storage assumptions. |
| **handlers/** (non-save) | ~32 | ~11,280 | 40 total handler files minus ~8 save handlers. Covers search, lifecycle, causal, eval, shared-space, ingest, checkpoint tool implementations. The MCP-to-lib bridge layer. |
| **parsing/** | 4 | 1,915 | Memory file parsing -- markdown extraction, metadata extraction, trigger phrase detection. Quality of parsed content affects all downstream search quality. |
| **telemetry/** | 4 | 1,668 | Observability infrastructure. Unknown whether it connects to pipeline timing gaps identified in B1. |
| **validation/** | 2 | 1,457 | Input validation layer. Unknown whether MCP tool inputs are validated before reaching lib/. |
| **ops/** | 2 | 1,144 | Operational utilities. Unknown purpose -- could be maintenance scripts, health checks, or admin tools. |
| **learning/** | 2 | 994 | Preflight/postflight learning measurement. Unknown quality of Learning Index calculation. |
| **config/** | 3 | 920 | Configuration management beyond feature flags. Unknown if centralized or fragmented. |
| **extraction/** | 4 | 960 | Content extraction from files. Unknown quality or coverage. |
| **governance/** | 2 | 710 | Governance guardrails. Unknown if they enforce the tenant/user isolation documented in spec. |
| **cache/** | 2 | 662 | Caching layer (including cache/scoring/). Unknown if this is the embedding cache or a separate system. |
| **chunking/** | 2 | 448 | Content chunking for long documents. Unknown strategy, chunk size, overlap handling. |
| **providers/** | 2 | 621 | Embedding/reranker provider abstraction. Unknown provider fallback, error handling, model switching. |
| **architecture/** | 1 | 237 | System architecture definitions. Unknown purpose. |
| **response/** | 1 | 286 | Response formatting. Unknown if this is the MCP response envelope. |
| **manage/** | 1 | 141 | Management utilities. Unknown purpose. |
| **interfaces/** | 1 | 48 | Type interfaces. Likely small utility types. |
| **utils/** | 4 | 208 | Shared utilities. Unknown purpose and quality. |
| **contracts/** | 0 | 0 | Empty directory. |

### Coverage Statistics
- **Investigated:** ~50 files, ~22,000 LOC across search/, cognitive/, eval/, graph/, collab/, session/, handlers/save/
- **NOT investigated:** ~100 files, ~30,000 LOC across storage/ (7,148), handlers/non-save (~11,280), parsing/ (1,915), telemetry/ (1,668), and 14 other directories
- **Approximate coverage:** ~42% of lib/ LOC investigated, ~58% uninvestigated
- **Test files:** Investigated quantitatively (iter-15, 284 files) but not qualitatively (test quality, assertion density, mock correctness)

[SOURCE: Bash directory listing of mcp_server/lib/ subdirectories with file counts and LOC]

---

## 2. Claims Made Without Strong Evidence

These findings from iterations 1-19 were asserted based on code reading but lack empirical validation or have caveats.

### 2a. Performance Claims Without Measurement

| Claim | Source | Evidence Gap |
|-------|--------|-------------|
| BM25 N+1 query causes measurable latency (B7) | iter-13 code pattern | No profiling data. For 50 results the overhead may be negligible with SQLite prepared statements. |
| Deep-mode expansion creates 3x latency (F1) | iter-12 code path analysis | No timing measurements. The actual wall-clock cost depends on embedding generation latency which was not measured. |
| R12 expansion doubles pipeline cost (F2) | iter-12 code path analysis | No timing measurements. "Doubles" is inferred from "two hybrid searches" but parallel execution may reduce impact. |
| MMR re-fetches embeddings (F3) | iter-13 code path analysis | No measurement of Vec0 read latency. May be cached at the SQLite page level. |
| Stage 2 monolith is a performance bottleneck (B4) | iter-1 structural analysis | No evidence that 12 steps in one function causes latency. Decomposition is for maintainability, not performance. |

### 2b. Correctness Claims Without Test Validation

| Claim | Source | Evidence Gap |
|-------|--------|-------------|
| Score resolution divergence causes bugs on error paths (A1) | iter-1,2,14 code analysis | No test or reproduction demonstrating actual wrong results. The `withSyncedScoreAliases` pattern may fully mask the divergence in practice. |
| FSRS write-back race loses updates (A2) | iter-6 code analysis | No concurrency test demonstrating the race. SQLite single-writer serialization may prevent it entirely at the DB level. |
| Concurrent save dedup race creates duplicates (A4) | iter-9 code analysis | No concurrency test demonstrating the race. File-based invocation patterns may make concurrent saves extremely rare. |
| Constitutional injection bypasses archive filter (A3) | iter-1 code path analysis | No test demonstrating archived constitutional memories entering results. The scenario requires archived constitutionals which may never exist. |
| Quality loop mutation creates hash mismatch (A5) | iter-9 code analysis | No evidence any caller actually fails to consume fixedContent. The contract may be implicitly maintained. |

### 2c. Architectural Claims Without Comparison Data

| Claim | Source | Evidence Gap |
|-------|--------|-------------|
| 81 feature flags is "massive sprawl" (B5) | iter-7,18 census | No baseline comparison. For a 190K LOC system, 81 env vars may be within normal range. |
| 28 warn-and-continue catch blocks is "excessive" (B1) | iter-6 census | No comparison to similar systems. Per-signal try/catch may be an accepted pattern for optional enrichment steps. |
| 31 parameters for memory_search is "too many" (E3) | iter-11 census | No comparison to similar MCP tools. Many parameters have sensible defaults; actual typical invocations may use 2-3. |
| Weight constants being "hardcoded" is a problem (B3) | iter-2 analysis | No comparison data showing hardcoded weights perform worse than calibrated ones. The current hardcoded values may be near-optimal for the workload. |

[INFERENCE: Compiled from iterations 1-19 findings cross-referenced with evidence strength assessment]

---

## 3. External Dependencies NOT Examined

| Dependency | Used By | Risk Level | Why It Matters |
|------------|---------|------------|----------------|
| **Voyage AI** (embedding provider) | providers/, search/ | HIGH | Primary embedding model. API availability, cost, rate limits, model versioning not examined. |
| **better-sqlite3** | storage/ | MEDIUM | SQLite driver. Version compatibility, WAL mode behavior under concurrent access, Vec0 extension compatibility. |
| **Vec0 extension** | storage/ | HIGH | Vector similarity search. Custom SQLite extension quality, version pinning, fallback behavior if extension fails to load. |
| **chokidar** | file-watcher | LOW | File system watcher. macOS FSEvents behavior, inotify limits on Linux. |
| **onnxruntime-node** | local reranker | MEDIUM | Local inference runtime. Model loading, memory footprint, platform compatibility. |
| **@huggingface/transformers** | local reranker | MEDIUM | Model management. Model download, caching, version pinning. |
| **@modelcontextprotocol/sdk** | tools/, handlers/ | LOW | MCP protocol framework. Version compatibility, breaking changes. |
| **Node.js crypto** | dedup (SHA-256) | LOW | Hash collision probability, performance for large files. |

[SOURCE: package.json dependencies inferred from import patterns observed across iterations 1-19]

---

## 4. Security Considerations NOT Reviewed

| Area | Risk | Description |
|------|------|-------------|
| **SQL injection in 81 env var paths** | MEDIUM | Feature flags read from env vars are used in SQL queries (especially flag-driven WHERE clauses). Not verified whether all are parameterized. |
| **Tenant isolation enforcement** | HIGH | 5-dimensional tenant isolation (tenant, user, agent, session, shared-space) claimed in Q11 answer. The governance/ directory (710 LOC) was not read. Actual enforcement depth unknown. |
| **Embedding API key handling** | MEDIUM | Voyage AI API key management -- how stored, rotated, leaked in logs. providers/ (621 LOC) was not examined. |
| **MCP tool input validation** | MEDIUM | validation/ (1,457 LOC) exists but was not examined. Unknown whether all 32 MCP tools validate inputs before processing. |
| **File path traversal in memory save** | MEDIUM | Save pipeline accepts file paths. Unknown whether path traversal (../../etc/passwd) is prevented. |
| **Shared-space access control bypass** | LOW | Shared spaces have deny-by-default with role-based access. But double-query redundancy (F4) hints at possible TOCTOU race in authorization check. |
| **Database file permissions** | LOW | SQLite files in database/ directory. Unknown whether file permissions prevent unauthorized direct access. |

[INFERENCE: Security assessment based on common vulnerability patterns applied to system architecture observed in iterations 1-19]

---

## 5. Testing Debt NOT Quantified

The iteration-15 test coverage analysis identified 7 critical untested paths (G1-G7 in recommendations). Additional testing debt not quantified:

| Area | Gap |
|------|-----|
| **Integration test coverage** | 284 test files counted but not classified as unit vs integration vs E2E. Unknown whether the pipeline has any E2E tests (full query -> results). |
| **Test assertion density** | File count does not measure assertion quality. A 100-line test file with 1 assertion is different from one with 20 assertions. |
| **Mock correctness** | Unknown whether test mocks accurately reflect production behavior, especially for DB operations and external API calls. |
| **storage/ test coverage** | 13 files, 7,148 LOC -- the largest subsystem with zero investigation of its test coverage. Migration tests exist (migration-checkpoint-scripts.vitest.ts) but general storage tests unknown. |
| **handlers/ test coverage** | 40 files, 14,280 LOC -- MCP tool handler tests not examined beyond save handlers. |
| **Mutation testing** | No mutation testing infrastructure exists or was investigated. Unknown whether tests actually catch regressions. |
| **Performance regression tests** | No performance benchmarks in test suite. P95 latency claims from recommendations have no baseline. |

[INFERENCE: Based on iteration-15 quantitative analysis limitations and standard testing practice gaps]

---

## 6. Subsystems Needing Deeper Investigation (Within Analyzed Areas)

| Subsystem | Analyzed Aspect | Missing Aspect |
|-----------|----------------|----------------|
| **search/pipeline** | Architecture, scoring, error handling | Concurrency behavior under load, memory pressure handling |
| **cognitive/** | Integration map, LOC census, production usage | Actual impact measurement -- does co-activation improve NDCG? Does FSRS scheduling improve re-retrieval? |
| **eval/** | Ablation framework, metrics, ground truth | Ground truth staleness (hardcoded memoryIds), metric statistical power, eval DB growth management |
| **graph/** | Architecture, signals, community detection | Graph scaling characteristics (performance at 10K, 100K, 1M edges), memory overhead |
| **handlers/save/** | 7-module architecture, dedup, quality gates | Error recovery (what happens when enrichment fails mid-save), large file handling, concurrent save volume |
| **scoring/** | Composite scoring, RRF weights, 5-factor model | calibration methodology for the 30+ constants, score distribution analysis (are scores well-distributed or clustered?) |

---

## 7. Research Debt Backlog (Prioritized by Expected Value)

### Tier 1: HIGH expected value (should investigate next campaign)

| ID | Topic | Expected Value | Rationale |
|----|-------|---------------|-----------|
| RD-01 | **storage/ layer deep dive** (13 files, 7,148 LOC) | 5/5 | Largest uninvestigated subsystem. All correctness/performance findings rest on storage assumptions. DB schema design, migration safety, Vec0 integration, WAL mode concurrency, index strategies. |
| RD-02 | **handlers/ layer audit** (40 files, 14,280 LOC) | 4/5 | MCP-to-lib bridge layer. Tool validation, error propagation, authorization checks, request transformation. Second largest uninvestigated area. |
| RD-03 | **Performance benchmarking** | 4/5 | All 5 performance recommendations (F1-F5) are based on code path analysis, not measurement. A profiling session with real workload would validate or refute them. |
| RD-04 | **Tenant isolation security audit** (governance/ + collab/ + handlers/) | 4/5 | Multi-tenant isolation is a critical security property. governance/ (710 LOC) was not examined. Could combine with RD-02. |
| RD-05 | **Cognitive impact measurement** | 3/5 | The cognitive subsystem (4,644 LOC, 10 production modules) has no metrics proving it improves retrieval quality. A controlled experiment (disable cognitive -> measure NDCG delta) would prove or disprove its value. |

### Tier 2: MEDIUM expected value (should investigate if time permits)

| ID | Topic | Expected Value | Rationale |
|----|-------|---------------|-----------|
| RD-06 | **parsing/ + extraction/ quality analysis** (8 files, 2,875 LOC) | 3/5 | Search quality depends on parse quality. Unknown whether markdown parsing handles edge cases (nested code blocks, frontmatter, anchors). |
| RD-07 | **validation/ layer completeness** (2 files, 1,457 LOC) | 3/5 | MCP tool input validation. Are all 32 tools validated? What about malformed inputs, oversized payloads, injection attacks? |
| RD-08 | **telemetry/ integration** (4 files, 1,668 LOC) | 2/5 | Observability infrastructure. Does it connect to the pipeline timing gaps? Does it provide the metrics needed for B1 implementation? |
| RD-09 | **providers/ resilience** (2 files, 621 LOC) | 2/5 | Embedding/reranker provider abstraction. Fallback behavior, retry policies, model switching, API key rotation. |
| RD-10 | **chunking/ strategy** (2 files, 448 LOC) | 2/5 | Content chunking affects search relevance. Unknown chunk size, overlap, strategy (semantic vs fixed-length). |

### Tier 3: LOW expected value (nice-to-have for completeness)

| ID | Topic | Expected Value | Rationale |
|----|-------|---------------|-----------|
| RD-11 | **cache/ architecture** (2 files, 662 LOC) | 2/5 | Caching layer. Is it the embedding cache? How does it handle invalidation? |
| RD-12 | **ops/ utilities** (2 files, 1,144 LOC) | 1/5 | Operational utilities. Unknown purpose, may be admin-only. |
| RD-13 | **learning/ quality** (2 files, 994 LOC) | 1/5 | Learning Index calculation. Useful but not critical to search quality. |
| RD-14 | **Test mutation analysis** | 1/5 | Mutation testing to verify test effectiveness. High effort, diminishing returns. |
| RD-15 | **Score distribution analysis** | 2/5 | Are scores well-distributed or clustered? Do the 30+ constants produce useful score separation? Needed for B3 calibration work. |

---

## 8. Research Campaign Summary

### Campaign Statistics
- **Duration:** 20 iterations across ~9 hours (2026-03-20T09:49Z - 2026-03-20T19:30Z)
- **Questions:** 18 asked, 18 answered (100% closure)
- **Key findings:** 25 prioritized recommendations across 7 categories (A-G)
- **Cross-validated:** 10 top findings (6 confirmed, 3 modified, 1 refuted)
- **Codebase coverage:** ~42% of lib/ LOC investigated (22K of 52K), ~12% of total (22K of 190K)
- **Average newInfoRatio:** 0.72 (iterations 1-15), 0.17 (synthesis iterations 16-20)

### What This Campaign Definitively Established
1. The 4-stage pipeline architecture is structurally sound but has zero orchestrator-level error handling (B1)
2. Three distinct score resolution chains create a latent correctness risk (A1, confirmed)
3. 81 feature flags lack governance infrastructure (B5, cross-validated to 81)
4. The eval system measures but cannot calibrate (B3, confirmed)
5. The cognitive subsystem is production-integrated but unmeasured (10/11 modules live, 0 impact metrics)
6. 9 dead code items can be safely removed (C1-C9, 3 confirmed by cross-validation)
7. The save pipeline is architecturally robust with 3 concurrency caveats (A2, A4, A5)
8. 7 critical test paths are missing (G1-G7)

### What This Campaign Could NOT Establish
1. Whether any correctness bug (A1-A5) has EVER manifested in production
2. Whether performance concerns (F1-F5) cause measurable latency degradation
3. Whether the 30+ hardcoded scoring constants are near-optimal or arbitrarily chosen
4. Whether the cognitive subsystem measurably improves retrieval quality
5. Whether tenant isolation is properly enforced (governance/ not examined)
6. Whether the storage layer has correctness or scalability issues
7. Whether MCP tool inputs are properly validated

### Overall Assessment
The research campaign achieved comprehensive coverage of the **search and retrieval subsystem** (the core hybrid-rag-fusion pipeline), the **cognitive subsystem**, the **eval subsystem**, the **save subsystem**, and the **feature flag landscape**. The 25 recommendations are well-grounded in code evidence with 10 cross-validated.

The campaign's primary limitation is **depth vs breadth**: it focused on the search pipeline (~22K LOC) at the expense of the surrounding infrastructure (storage: 7K, handlers: 14K, parsing: 2K, telemetry: 2K, validation: 1.5K, governance: 700 = ~27K uninvestigated). A follow-up campaign should start with storage/ (RD-01) and handlers/ (RD-02) as these form the foundation that all search findings depend on.

---

## Sources Consulted
- `scratch/deep-research-strategy.md` -- All 18 answered questions and approach history
- `scratch/iteration-019.md` -- 25 recommendations with priority/effort/impact
- `mcp_server/lib/` directory listing -- 28 subdirectories with file counts and LOC
- `mcp_server/handlers/` -- 40 files, 14,280 LOC (uninvestigated count)
- `mcp_server/tools/` -- 7 files, 584 LOC
- `mcp_server/database/` -- Database files (no source code, runtime data only)
- `mcp_server/scripts/migrations/` -- 2 migration files

## Assessment
- New information ratio: 0.30
- Questions addressed: Meta-analysis of all Q1-Q18
- Questions answered: N/A (gap analysis iteration)

### newInfoRatio calculation:
15 research debt items identified, 8 uninvestigated subsystems cataloged with LOC, 5 performance claims flagged as unmeasured, 5 correctness claims flagged as untested, 7 security areas flagged, 6 testing gaps identified. The gap analysis itself is new information (the identification of what was NOT investigated). Base ratio: 0.20 (new structural findings from directory analysis) + 0.10 (simplification bonus for final campaign synthesis and closure) = 0.30.

## Reflection
- What worked and why: Directory listing with LOC counts was the most efficient way to identify coverage gaps -- one bash command gave a complete map of all 28 subdirectories. Cross-referencing this against strategy.md's iteration-by-iteration log made the gap analysis systematic rather than ad hoc.
- What did not work and why: Could not read uninvestigated files to assess their actual importance (tool budget constraint). The research debt priorities are based on file size and inferred criticality, not actual content review.
- What I would do differently: In a future campaign, start with a complete directory census in iteration 1, then use it to plan coverage across all iterations. This campaign discovered the 58% coverage gap only at the end.

## Recommended Next Focus
RESEARCH COMPLETE. Next campaign should begin with RD-01 (storage/ deep dive, 13 files, 7,148 LOC) followed by RD-02 (handlers/ audit, 40 files, 14,280 LOC). These two subsystems represent 57% of all uninvestigated code.
