---
title: "Spec Kit Memory — Feature Catalog"
description: "Unified reference combining the complete system feature inventory and the refinement program changelog for the Spec Kit Memory MCP server."
---

# Spec Kit Memory — Feature Catalog

This document combines two complementary views of the Spec Kit Memory MCP server into a single reference. The **System Reference** section describes what the system is today — every tool, pipeline stage and capability organized by MCP layer. The **Refinement Program** section describes what was changed and why — every improvement delivered across sprints 0-8 and phases 015-017, with ticket IDs and implementation details.

## Contents

- [Retrieval](#retrieval)
  - [Unified context retrieval (memory_context)](#unified-context-retrieval-memory_context)
  - [Semantic and lexical search (memory_search)](#semantic-and-lexical-search-memory_search)
  - [Trigger phrase matching (memory_match_triggers)](#trigger-phrase-matching-memory_match_triggers)
  - [Hybrid search pipeline](#hybrid-search-pipeline)
  - [4-stage pipeline architecture](#4-stage-pipeline-architecture)
- [Mutation](#mutation)
  - [Memory indexing (memory_save)](#memory-indexing-memory_save)
  - [Memory metadata update (memory_update)](#memory-metadata-update-memory_update)
  - [Single and folder delete (memory_delete)](#single-and-folder-delete-memory_delete)
  - [Tier-based bulk deletion (memory_bulk_delete)](#tier-based-bulk-deletion-memory_bulk_delete)
  - [Validation feedback (memory_validate)](#validation-feedback-memory_validate)
- [Discovery](#discovery)
  - [Memory browser (memory_list)](#memory-browser-memory_list)
  - [System statistics (memory_stats)](#system-statistics-memory_stats)
  - [Health diagnostics (memory_health)](#health-diagnostics-memory_health)
- [Maintenance](#maintenance)
  - [Workspace scanning and indexing (memory_index_scan)](#workspace-scanning-and-indexing-memory_index_scan)
- [Lifecycle](#lifecycle)
  - [Checkpoint creation (checkpoint_create)](#checkpoint-creation-checkpoint_create)
  - [Checkpoint listing (checkpoint_list)](#checkpoint-listing-checkpoint_list)
  - [Checkpoint restore (checkpoint_restore)](#checkpoint-restore-checkpoint_restore)
  - [Checkpoint deletion (checkpoint_delete)](#checkpoint-deletion-checkpoint_delete)
- [Analysis](#analysis)
  - [Causal edge creation (memory_causal_link)](#causal-edge-creation-memory_causal_link)
  - [Causal graph statistics (memory_causal_stats)](#causal-graph-statistics-memory_causal_stats)
  - [Causal edge deletion (memory_causal_unlink)](#causal-edge-deletion-memory_causal_unlink)
  - [Causal chain tracing (memory_drift_why)](#causal-chain-tracing-memory_drift_why)
  - [Epistemic baseline capture (task_preflight)](#epistemic-baseline-capture-task_preflight)
  - [Post-task learning measurement (task_postflight)](#post-task-learning-measurement-task_postflight)
  - [Learning history (memory_get_learning_history)](#learning-history-memory_get_learning_history)
- [Evaluation](#evaluation)
  - [Ablation studies (eval_run_ablation)](#ablation-studies-eval_run_ablation)
  - [Reporting dashboard (eval_reporting_dashboard)](#reporting-dashboard-eval_reporting_dashboard)
- [Bug fixes and data integrity](#bug-fixes-and-data-integrity)
  - [Graph channel ID fix (G1)](#graph-channel-id-fix-g1)
  - [Chunk collapse deduplication (G3)](#chunk-collapse-deduplication-g3)
  - [Co-activation fan-effect divisor (R17)](#co-activation-fan-effect-divisor-r17)
  - [SHA-256 content-hash deduplication (TM-02)](#sha-256-content-hash-deduplication-tm-02)
- [Evaluation and measurement](#evaluation-and-measurement)
  - [Evaluation database and schema (R13-S1)](#evaluation-database-and-schema-r13-s1)
  - [Core metric computation (R13-S1)](#core-metric-computation-r13-s1)
  - [Observer effect mitigation (D4)](#observer-effect-mitigation-d4)
  - [Full-context ceiling evaluation (A2)](#full-context-ceiling-evaluation-a2)
  - [Quality proxy formula (B7)](#quality-proxy-formula-b7)
  - [Synthetic ground truth corpus (G-NEW-1, G-NEW-3 phase A)](#synthetic-ground-truth-corpus-g-new-1-g-new-3-phase-a)
  - [BM25-only baseline (G-NEW-1)](#bm25-only-baseline-g-new-1)
  - [Agent consumption instrumentation (G-NEW-2)](#agent-consumption-instrumentation-g-new-2)
  - [Scoring observability (T010)](#scoring-observability-t010)
  - [Full reporting and ablation study framework (R13-S3)](#full-reporting-and-ablation-study-framework-r13-s3)
  - [Shadow scoring and channel attribution (R13-S2)](#shadow-scoring-and-channel-attribution-r13-s2)
- [Graph signal activation](#graph-signal-activation)
  - [Typed-weighted degree channel (R4)](#typed-weighted-degree-channel-r4)
  - [Co-activation boost strength increase (A7)](#co-activation-boost-strength-increase-a7)
  - [Edge density measurement](#edge-density-measurement)
  - [Weight history audit tracking](#weight-history-audit-tracking)
  - [Graph momentum scoring (N2a)](#graph-momentum-scoring-n2a)
  - [Causal depth signal (N2b)](#causal-depth-signal-n2b)
  - [Community detection (N2c)](#community-detection-n2c)
- [Scoring and calibration](#scoring-and-calibration)
  - [Score normalization](#score-normalization)
  - [Cold-start novelty boost (N4)](#cold-start-novelty-boost-n4)
  - [Interference scoring (TM-01)](#interference-scoring-tm-01)
  - [Classification-based decay (TM-03)](#classification-based-decay-tm-03)
  - [Folder-level relevance scoring (PI-A1)](#folder-level-relevance-scoring-pi-a1)
  - [Embedding cache (R18)](#embedding-cache-r18)
  - [Double intent weighting investigation (G2)](#double-intent-weighting-investigation-g2)
  - [RRF K-value sensitivity analysis (FUT-5)](#rrf-k-value-sensitivity-analysis-fut-5)
  - [Negative feedback confidence signal (A4)](#negative-feedback-confidence-signal-a4)
  - [Auto-promotion on validation (T002a)](#auto-promotion-on-validation-t002a)
- [Query intelligence](#query-intelligence)
  - [Query complexity router (R15)](#query-complexity-router-r15)
  - [Relative score fusion in shadow mode (R14/N1)](#relative-score-fusion-in-shadow-mode-r14n1)
  - [Channel min-representation (R2)](#channel-min-representation-r2)
  - [Confidence-based result truncation (R15-ext)](#confidence-based-result-truncation-r15-ext)
  - [Dynamic token budget allocation (FUT-7)](#dynamic-token-budget-allocation-fut-7)
  - [Query expansion (R12)](#query-expansion-r12)
- [Memory quality and indexing](#memory-quality-and-indexing)
  - [Verify-fix-verify memory quality loop (PI-A5)](#verify-fix-verify-memory-quality-loop-pi-a5)
  - [Signal vocabulary expansion (TM-08)](#signal-vocabulary-expansion-tm-08)
  - [Pre-flight token budget validation (PI-A3)](#pre-flight-token-budget-validation-pi-a3)
  - [Spec folder description discovery (PI-B3)](#spec-folder-description-discovery-pi-b3)
  - [Pre-storage quality gate (TM-04)](#pre-storage-quality-gate-tm-04)
  - [Reconsolidation-on-save (TM-06)](#reconsolidation-on-save-tm-06)
  - [Smarter memory content generation (S1)](#smarter-memory-content-generation-s1)
  - [Anchor-aware chunk thinning (R7)](#anchor-aware-chunk-thinning-r7)
  - [Encoding-intent capture at index time (R16)](#encoding-intent-capture-at-index-time-r16)
  - [Auto entity extraction (R10)](#auto-entity-extraction-r10)
- [Pipeline architecture](#pipeline-architecture)
  - [4-stage pipeline refactor (R6)](#4-stage-pipeline-refactor-r6)
  - [MPAB chunk-to-memory aggregation (R1)](#mpab-chunk-to-memory-aggregation-r1)
  - [Chunk ordering preservation (B2)](#chunk-ordering-preservation-b2)
  - [Template anchor optimization (S2)](#template-anchor-optimization-s2)
  - [Validation signals as retrieval metadata (S3)](#validation-signals-as-retrieval-metadata-s3)
  - [Learned relevance feedback (R11)](#learned-relevance-feedback-r11)
- [Retrieval enhancements](#retrieval-enhancements)
  - [Dual-scope memory auto-surface (TM-05)](#dual-scope-memory-auto-surface-tm-05)
  - [Constitutional memory as expert knowledge injection (PI-A4)](#constitutional-memory-as-expert-knowledge-injection-pi-a4)
  - [Spec folder hierarchy as retrieval structure (S4)](#spec-folder-hierarchy-as-retrieval-structure-s4)
  - [Lightweight consolidation (N3-lite)](#lightweight-consolidation-n3-lite)
  - [Memory summary search channel (R8)](#memory-summary-search-channel-r8)
  - [Cross-document entity linking (S5)](#cross-document-entity-linking-s5)
- [Tooling and scripts](#tooling-and-scripts)
  - [Tree thinning for spec folder consolidation (PI-B1)](#tree-thinning-for-spec-folder-consolidation-pi-b1)
  - [Progressive validation for spec documents (PI-B2)](#progressive-validation-for-spec-documents-pi-b2)
- [Governance](#governance)
  - [Feature flag governance](#feature-flag-governance)
  - [Feature flag sunset audit](#feature-flag-sunset-audit)
- [Comprehensive remediation (Sprint 8)](#comprehensive-remediation-sprint-8)
  - [Database and schema safety](#database-and-schema-safety)
  - [Scoring and ranking corrections](#scoring-and-ranking-corrections)
  - [Search pipeline safety](#search-pipeline-safety)
  - [Guards and edge cases](#guards-and-edge-cases)
  - [Entity normalization consolidation](#entity-normalization-consolidation)
  - [Dead code removal](#dead-code-removal)
  - [Performance improvements](#performance-improvements)
  - [Test quality improvements](#test-quality-improvements)
- [Gemini review P1 fixes (Phase 015)](#gemini-review-p1-fixes-phase-015)
  - [Quality gate timer persistence](#quality-gate-timer-persistence)
  - [Stage 3 effectiveScore fallback chain](#stage-3-effectivescore-fallback-chain)
- [Alignment remediation (Phase 016)](#alignment-remediation-phase-016)
  - [Canonical ID dedup hardening](#canonical-id-dedup-hardening)
  - [Activation window persistence](#activation-window-persistence)
  - [Tier-2 fallback channel forcing](#tier-2-fallback-channel-forcing)
- [Opus review remediation (Phase 017)](#opus-review-remediation-phase-017)
  - [Legacy V1 pipeline removal](#legacy-v1-pipeline-removal)
  - [Scoring and fusion corrections](#scoring-and-fusion-corrections)
  - [Pipeline and mutation hardening](#pipeline-and-mutation-hardening)
  - [Graph and cognitive memory fixes](#graph-and-cognitive-memory-fixes)
  - [Evaluation and housekeeping fixes](#evaluation-and-housekeeping-fixes)
- [Multi-agent deep review remediation (Phase 018)](#multi-agent-deep-review-remediation-phase-018)
  - [Math.max/min stack overflow elimination](#mathmaxmin-stack-overflow-elimination)
  - [Session-manager transaction gap fixes](#session-manager-transaction-gap-fixes)
  - [Transaction wrappers on mutation handlers](#transaction-wrappers-on-mutation-handlers)
  - [BM25 trigger phrase re-index gate](#bm25-trigger-phrase-re-index-gate)
  - [DB_PATH extraction and import standardization](#db_path-extraction-and-import-standardization)
  - [Cross-AI validation fixes (Tier 4)](#cross-ai-validation-fixes-tier-4)
  - [Code standards alignment](#code-standards-alignment)
- [Extra features (Sprint 019)](#extra-features-sprint-019)
  - [Strict Zod schema validation (P0-1)](#strict-zod-schema-validation-p0-1)
  - [Provenance-rich response envelopes (P0-2)](#provenance-rich-response-envelopes-p0-2)
  - [Async ingestion job lifecycle (P0-3)](#async-ingestion-job-lifecycle-p0-3)
  - [Contextual tree injection (P1-4)](#contextual-tree-injection-p1-4)
  - [Local GGUF reranker via node-llama-cpp (P1-5)](#local-gguf-reranker-via-node-llama-cpp-p1-5)
  - [Dynamic server instructions at MCP initialization (P1-6)](#dynamic-server-instructions-at-mcp-initialization-p1-6)
  - [Real-time filesystem watching with chokidar (P1-7)](#real-time-filesystem-watching-with-chokidar-p1-7)
  - [Warm server / daemon mode (P2-8)](#warm-server--daemon-mode-p2-8)
  - [Backend storage adapter abstraction (P2-9)](#backend-storage-adapter-abstraction-p2-9)
  - [Namespace management CRUD tools (P2-10)](#namespace-management-crud-tools-p2-10)
  - [ANCHOR tags as graph nodes (P2-11)](#anchor-tags-as-graph-nodes-p2-11)
  - [AST-level section retrieval tool (P2-12)](#ast-level-section-retrieval-tool-p2-12)
- [Decisions and deferrals](#decisions-and-deferrals)
  - [INT8 quantization evaluation (R5)](#int8-quantization-evaluation-r5)
  - [Implemented: graph centrality and community detection (N2)](#implemented-graph-centrality-and-community-detection-n2)
  - [Implemented: auto entity extraction (R10)](#implemented-auto-entity-extraction-r10)
  - [Implemented: memory summary generation (R8)](#implemented-memory-summary-generation-r8)
  - [Implemented: cross-document entity linking (S5)](#implemented-cross-document-entity-linking-s5)
- [Feature Flag Reference](#feature-flag-reference)
  - [1. Search Pipeline Features (SPECKIT_*)](#1-search-pipeline-features-speckit)
  - [2. Session and Cache](#2-session-and-cache)
  - [3. MCP Configuration](#3-mcp-configuration)
  - [4. Memory and Storage](#4-memory-and-storage)
  - [5. Embedding and API](#5-embedding-and-api)
  - [6. Debug and Telemetry](#6-debug-and-telemetry)
  - [7. CI and Build (informational)](#7-ci-and-build-informational)

---

## Retrieval

### Unified context retrieval (memory_context)

You send a query or prompt. The system figures out what you need. That is the core idea behind `memory_context`: an L1 orchestration layer that auto-detects your task intent and routes to the best retrieval strategy without you having to pick one.

Intent detection classifies your input into one of seven types (add_feature, fix_bug, refactor, security_audit, understand, find_spec, find_decision) and maps it to a retrieval mode. Five modes are available: auto (default, intent-detected routing), quick (trigger matching for fast lookups), deep (comprehensive semantic search across the full corpus), focused (intent-optimized with tighter filtering) and resume (session recovery targeting state, next-steps, summary and blocker anchors with full content included).

Each mode has a token budget. Quick gets 800 tokens. Focused gets 1,500. Deep gets 2,000. Resume gets 1,200. After retrieval, the orchestrator estimates token count (1 token per 4 characters) and enforces the budget by stripping lowest-scored results from the tail until the response fits. A dedicated `enforceTokenBudget()` function handles the truncation with detailed tracking of original and returned result counts. When your overall context is running high, a pressure policy kicks in. When the `tokenUsage` ratio exceeds 0.60, the system downgrades to focused mode. Above 0.80, it switches to quick mode. The pressure policy is gated by `SPECKIT_PRESSURE_POLICY` and subject to rollout percentage via `SPECKIT_ROLLOUT_PERCENT`. You can override the mode and intent manually, but the auto-detection handles most cases correctly.

When no `specFolder` is provided, automatic spec folder discovery attempts to identify the most relevant folder from the query text using a cached one-sentence description per spec folder. If the target folder can be identified from the description alone, the system avoids full-corpus search entirely. Discovery failure is non-fatal and falls through to the standard retrieval path. This feature runs behind the `SPECKIT_FOLDER_DISCOVERY` flag.

Session management is built in. You can pass a `sessionId` for cross-turn deduplication (the system tracks which memories were already sent in this session and skips them) and working memory integration (attention-scored memories from previous turns carry over). In resume mode with `autoResumeEnabled`, the handler pulls working memory context items and injects them as `systemPromptContext` into the response. If you do not pass a session ID, an ephemeral UUID is generated for that single call.

Retrieval telemetry records mode selection and pressure-override fallbacks for observability when extended telemetry is enabled.

### Semantic and lexical search (memory_search)

This is the primary search tool, and it does a lot. You give it a natural language query (or a multi-concept array of 2-5 strings where all concepts must match), and it runs the full hybrid retrieval pipeline.

The default search path is the 4-stage pipeline architecture (behind `SPECKIT_PIPELINE_V2`, default ON). The pipeline starts with Stage 1 candidate generation, which selects search channels based on query type: multi-concept queries run per-concept embeddings, deep mode expands into up to 3 query variants, and when embedding expansion is active a baseline plus expanded-query search run in parallel. Constitutional memories are injected if none appear in the initial candidate set. Stage 2 applies all scoring signals in a single pass: session boost, causal boost, FSRS testing effect, intent weights (for non-hybrid only, preventing G2 double-weighting), artifact routing, feedback signals (learned trigger boosts and negative feedback demotions), anchor metadata annotation and validation metadata enrichment. Stage 3 handles cross-encoder reranking and MPAB chunk-to-memory aggregation with document-order reassembly. Stage 4 filters by memory state, runs TRM evidence gap detection and enforces a score immutability invariant that prevents any score modifications after reranking.

A legacy search path remains available when `SPECKIT_PIPELINE_V2` is disabled. That path runs the original `hybridSearchEnhanced()` with its five search channels, Reciprocal Rank Fusion, and a nine-stage post-search pipeline covering state filtering, FSRS testing effect, intent weight application, artifact-class routing, cross-encoder reranking, session boosting, causal boosting, evidence gap detection and chunk reassembly.

A deep mode expands the query into up to 3 variants using `expandQuery()`, runs hybrid search for each variant in parallel and merges results with deduplication. Results are cached per parameter combination via `toolCache.withCache()`, and session deduplication runs after cache so that cache hits still respect session state.

The parameter surface is wide. You control result count (`limit`, 1-100), spec folder scoping, tier and context type filtering, intent (explicit or auto-detected), reranking toggle, length penalty, temporal decay, minimum memory state (`minState`, default `"WARM"`, range HOT through ARCHIVED), constitutional inclusion, content inclusion, anchor filtering, session dedup, session boosting, causal boosting, minimum quality threshold, cache bypass and access tracking. Most defaults are sensible. You typically send a query and a session ID and let everything else run at defaults.

### Trigger phrase matching (memory_match_triggers)

When you need speed over depth, trigger matching delivers. Rather than generating embeddings and running multi-channel search, it performs direct string matching of your prompt against stored trigger phrases. The performance target is under 100ms. Think of it as the "fast path" that sacrifices recall for latency.

Where this tool gets interesting is the cognitive pipeline. When you provide a session ID with `include_cognitive=true`, the system applies FSRS-based attention decay (scores degrade each turn via `0.98^(turn-1)` exponential decay), memory activation (matched memories get their attention score set to 1.0), co-activation spreading (each activated memory spreads activation to related memories through the co-occurrence graph), tier classification (maps effective retrievability to HOT, WARM, COLD, DORMANT or ARCHIVED) and tiered content injection.

Tiered content injection is the most visible effect. HOT memories return their full file content read from disk. WARM memories return the first 150 characters as a summary. COLD memories and below return no content at all. This tiering means recently active and highly relevant memories arrive with full context while dormant ones arrive as lightweight pointers.

The cognitive path fetches 2x the requested limit from the trigger matcher to give the cognitive pipeline headroom for filtering. If you request 3 results, 6 candidates enter the cognitive pipeline and the top 3 survivors are returned.

### Hybrid search pipeline

The engine under the hood. `hybrid-search.ts` orchestrates multi-channel retrieval with five search channels, adaptive fusion, diversity reranking and a multi-tier fallback chain. This pipeline powers the legacy search path and feeds into Stage 1 of the 4-stage pipeline.

Five channels feed the pipeline. Vector search (cosine similarity via sqlite-vec, base weight 1.0) is the primary semantic signal. FTS5 (SQLite full-text search with weighted BM25, base weight 0.8) captures keyword matches the embedding might miss. In-memory BM25 (base weight 0.6, gated by `ENABLE_BM25`, default ON) provides broader coverage with a different tokenization approach. Graph search (causal edge traversal, base weight 0.5) finds structurally related memories through the causal graph. Degree search (connectivity scoring, base weight 0.4, gated by `SPECKIT_DEGREE_BOOST`, default ON) re-ranks by hub score via `computeDegreeScores()` with logarithmic normalization and a hard cap of 50.

Adaptive fusion replaces hardcoded channel weights with intent-aware profiles. The `hybridAdaptiveFuse()` function selects weights based on the detected query intent, so a "fix_bug" query weights channels differently than a "find_spec" query. Results from all channels merge through `fuseResultsMulti()` using Reciprocal Rank Fusion.

Five operational stages run between fusion and delivery. Stage A (query complexity routing, `SPECKIT_COMPLEXITY_ROUTER`) restricts active channels for simple queries to just vector and FTS, moderate queries add BM25, and complex queries get all five. Stage B (RSF shadow fusion, `SPECKIT_RSF_FUSION`) is historical and no longer active in runtime ranking; RSF artifacts are retained for compatibility/testing references only. Stage C (channel enforcement, `SPECKIT_CHANNEL_MIN_REP`) ensures every contributing channel has at least one result in top-k with a 0.005 quality floor. Stage D (confidence truncation, `SPECKIT_CONFIDENCE_TRUNCATION`) trims the irrelevant tail using a 2x-median gap elbow heuristic. Stage E (dynamic token budget, `SPECKIT_DYNAMIC_TOKEN_BUDGET`) computes tier-aware token limits (simple 1,500, moderate 2,500, complex 4,000).

After these stages, Maximal Marginal Relevance reranking promotes result diversity using intent-specific lambda values (from `INTENT_LAMBDA_MAP`, default 0.7). Co-activation spreading takes the top 5 results, spreads activation through the co-activation graph and applies a 0.25x boost to co-activated results with a `1/sqrt(neighbor_count)` fan-effect divisor to prevent hub memories from dominating.

The fallback chain (`searchWithFallback()`) provides resilience. When `SPECKIT_SEARCH_FALLBACK` is enabled, the default path is a three-tier degradation flow: Tier 1 primary retrieval (default minimum similarity 0.3), Tier 2 widened retrieval at 0.1 with all channels forced on, and Tier 3 structural SQL search as last resort. When `SPECKIT_SEARCH_FALLBACK` is disabled, the legacy two-pass path is used (0.3 then 0.17). The system is designed to avoid empty returns except on hard failures.

### 4-stage pipeline architecture

The pipeline refactor (R6) restructures the retrieval flow into four bounded stages with clear responsibilities and a strict score-immutability invariant in the final stage.

Stage 1 (Candidate Generation) executes search channels based on query type. Multi-concept queries generate one embedding per concept. Deep mode expands into up to 3 query variants via `expandQuery()`. When embedding expansion is active and R15 does not classify the query as "simple", a baseline and expanded-query search run in parallel with deduplication. Constitutional memory injection appends up to 5 constitutional rows when none appear in the initial candidate set. Quality score and tier filters run at the end of Stage 1.

Stage 2 (Fusion and Signal Integration) is the single authoritative scoring point. Nine signals apply in a fixed, documented order: session boost, causal boost, FSRS testing effect, intent weights (non-hybrid only, preventing G2 double-weighting), artifact routing weight boosts, feedback signals (learned trigger boosts and negative feedback demotions), artifact result limiting, anchor metadata annotation (S2) and validation metadata enrichment with a bounded multiplier clamped to 0.8-1.2 (S3). The G2 prevention is structural: an `isHybrid` boolean computed once at the top of Stage 2 gates the intent weight step, so the code path for intent weights is absent when hybrid search already applied them during RRF fusion.

Stage 3 (Rerank and Aggregate) handles cross-encoder reranking (optional, gated by `SPECKIT_CROSS_ENCODER`) and MPAB chunk collapse with parent reassembly. Chunks are grouped by parent ID, the best chunk per group is elected by score, and full parent content is loaded from the database. On DB failure, the best-chunk row is emitted as a fallback. Non-chunks and reassembled parents merge and sort descending by effective score.

Stage 4 (Filter and Annotate) enforces a "no score changes" invariant through dual enforcement. At compile time, `Stage4ReadonlyRow` declares all six score fields as `Readonly`, making assignment a TypeScript error. At runtime, `captureScoreSnapshot()` records all scores before operations and `verifyScoreInvariant()` checks them afterward, throwing a `[Stage4Invariant]` error on any mismatch. Within this invariant, Stage 4 applies memory state filtering (removing rows below `config.minState` with optional per-tier hard limits), evidence gap detection via TRM Z-score analysis and annotation metadata for feature flags and state statistics. Session deduplication is explicitly excluded from Stage 4 and runs post-cache in the handler to avoid double-counting.

The pipeline runs behind the `SPECKIT_PIPELINE_V2` flag (default ON). When disabled, the legacy `postSearchPipeline` path handles the same work in a single function.

---

## Mutation

### Memory indexing (memory_save)

`memory_save` is the entry point for getting content into the memory system. You give it a file path. It reads the file, parses metadata from the frontmatter (title, trigger phrases, spec folder, importance tier, context type, causal links), generates a vector embedding and indexes everything into the SQLite database.

Before embedding generation, content normalization strips structural markdown noise. Seven primitives (frontmatter, anchors, HTML comments, code fences, tables, lists, headings) run in sequence to produce cleaner text for the embedding model. A separate normalization path for BM25 preserves more structure for lexical matching. Both paths are always active with no feature flag.

The interesting part is what happens before the record is created. A Prediction Error (PE) gating system compares the new content against existing memories via cosine similarity and decides one of five actions. CREATE stores a new record when no similar memory exists. REINFORCE boosts the FSRS stability of an existing duplicate without creating a new entry (the system already knows this, so it strengthens the memory). UPDATE overwrites an existing high-similarity memory in-place when the new version supersedes the old. SUPERSEDE marks the old memory as deprecated, creates a new record and links them with a causal edge. CREATE_LINKED stores a new memory with a relationship edge to a similar but distinct existing memory.

A three-layer quality gate runs before storage when `SPECKIT_SAVE_QUALITY_GATE` is enabled (default ON). Layer 1 validates structure (title exists, content at least 50 characters, valid spec folder path). Layer 2 scores content quality across five dimensions (title, triggers, length, anchors, metadata) against a 0.4 signal density threshold. Layer 3 checks semantic deduplication via cosine similarity, rejecting near-duplicates above 0.92. A warn-only mode runs for the first 14 days after activation, logging would-reject decisions without blocking saves.

Reconsolidation-on-save runs after embedding generation when `SPECKIT_RECONSOLIDATION` is enabled (default ON). The system checks the top-3 most similar memories in the same spec folder. Similarity at or above 0.88 triggers a merge where content is combined and `importance_weight` is boosted (capped at 1.0). Similarity between 0.75 and 0.88 triggers conflict resolution: the old memory is deprecated and a `supersedes` causal edge is created. Below 0.75, the memory stores unchanged. A checkpoint must exist for the spec folder before reconsolidation can run.

For large files exceeding the chunking threshold, the system splits into a parent record (metadata only) plus child chunk records, each with its own embedding. Before indexing, anchor-aware chunk thinning scores each chunk using a composite of anchor presence (weight 0.6, binary) and content density (weight 0.4, 0-1). Chunks scoring below 0.3 are dropped to reduce storage and search noise. The thinning never returns an empty array.

When `SPECKIT_ENCODING_INTENT` is enabled (default ON), the content type is classified at index time as `document`, `code` or `structured_data` using heuristic scoring against a 0.4 threshold. The classification is stored as read-only metadata on the `encoding_intent` column for both parent records and individual chunks. This metadata has no retrieval-time scoring impact yet; it builds a labeled dataset for future type-aware retrieval.

After every successful save, a consolidation cycle hook fires when `SPECKIT_CONSOLIDATION` is enabled (default ON). The N3-lite consolidation engine scans for contradictions (memory pairs above 0.85 cosine similarity with negation keyword conflicts), runs Hebbian strengthening on recently accessed edges (+0.05 per cycle with a 30-day decay), detects stale edges (unfetched for 90+ days) and enforces edge bounds (maximum 20 per node). The cycle runs on a weekly cadence.

The `asyncEmbedding` parameter (boolean, default `false`) enables non-blocking saves. When set to `true`, embedding generation is deferred: the memory record is written immediately with a `pending` embedding status, and an async background attempt generates the embedding afterward. The memory is immediately searchable via BM25 and FTS5 while the embedding processes. When `false` (the default), the save blocks until embedding generation completes before returning. Use `asyncEmbedding: true` when save latency matters more than immediate vector search availability.

Safety mechanisms run deep. Path security validation checks the file against an allowlist of base paths. File type validation accepts only `.md` and `.txt` in approved directories. Pre-flight validation checks anchor format, detects duplicates and estimates token budget before investing in embedding generation. A per-spec-folder mutex lock prevents TOCTOU race conditions when multiple saves target the same folder. SHA-256 content hashing skips unchanged files. A mutation ledger records every create, update, reinforce and supersede action for audit. The trigger matcher cache, tool cache and constitutional cache are all invalidated on write. If embedding generation fails, the memory is still stored and searchable via BM25/FTS5 with the embedding marked as pending for later re-indexing.

Document type affects importance weighting automatically: constitutional files get 1.0, spec documents 0.8, plans 0.7, memory files 0.5 and scratch files 0.25.

### Memory metadata update (memory_update)

You can change the title, trigger phrases, importance weight or importance tier on any existing memory by its numeric ID. The system verifies the memory exists, validates your parameters (importance weight between 0 and 1, tier from the valid enum) and applies the changes.

When the title changes, the system regenerates the vector embedding to keep search results aligned. This is a critical detail: if you rename a memory from "Authentication setup guide" to "OAuth2 configuration reference", the old embedding no longer represents the content accurately. Automatic regeneration fixes that.

By default, if embedding regeneration fails (API timeout, provider outage), the entire update rolls back with no changes applied. Nothing happens. With `allowPartialUpdate` enabled, the metadata changes persist and the embedding is marked as pending for later re-indexing by the next `memory_index_scan`. That mode is useful when you need to fix metadata urgently and can tolerate a temporarily stale embedding.

A pre-update hash snapshot is captured for the mutation ledger. Every update records the prior hash, new hash, actor and decision metadata for full auditability.

### Single and folder delete (memory_delete)

Two deletion modes in one tool. Pass a numeric `id` for single delete or a `specFolder` string (with `confirm: true`) for bulk folder delete.

Single deletes run inside a database transaction: remove the memory record via `vectorIndex.deleteMemory(id)`, clean up associated causal graph edges via `causalEdges.deleteEdgesForMemory(id)` and record a mutation ledger entry. If any step fails, the entire transaction rolls back. This atomicity guarantee was added in Phase 018 (CR-P1-1) to prevent partial deletes from leaving orphaned data.

Bulk deletes by spec folder are more involved. The system first creates an auto-checkpoint with a timestamped name (like `pre-cleanup-2026-02-28T12-00-00`) so you can roll back if the deletion was a mistake. Then it deletes all matching memories inside a database transaction with per-memory causal edge cleanup and per-memory mutation ledger entries. The entire operation is atomic: either all memories in the folder are deleted or none are. The response includes the checkpoint name and a restore command hint.

### Tier-based bulk deletion (memory_bulk_delete)

For large-scale cleanup operations. Instead of targeting a folder, you target an importance tier: delete all deprecated memories, or all temporary memories older than 30 days. The tool counts affected memories first (so the response tells you exactly how many were deleted), creates a safety checkpoint, then deletes within a database transaction.

Constitutional and critical tier memories receive extra protection. Unscoped deletion of these tiers is refused outright. You must provide a `specFolder` to delete constitutional or critical memories in bulk. The `skipCheckpoint` speed optimization, which skips the safety checkpoint for faster execution, is also rejected for these tiers. If the checkpoint creation itself fails for constitutional/critical, the entire operation aborts. For lower tiers, a checkpoint failure triggers a warning but the deletion proceeds because the risk of losing deprecated or temporary memories is low.

Each deleted memory gets its causal graph edges removed. A single consolidated mutation ledger entry (capped at 50 linked memory IDs to avoid ledger bloat) records the bulk operation. All caches are invalidated after deletion.

### Validation feedback (memory_validate)

Every search result is either helpful or not. This tool lets you record that judgment and triggers several downstream systems based on the feedback.

Positive feedback adds 0.1 to the memory's confidence score (capped at 1.0). Negative feedback subtracts 0.05 (floored at 0.0). The base confidence for any memory starts at 0.5. The asymmetry between positive (+0.1) and negative (-0.05) increments is intentional. It takes one good validation to raise confidence by 0.1 but two bad validations to cancel that out. This bias toward preservation reflects the assumption that a memory might be unhelpful for one query but still valuable for another.

Auto-promotion fires unconditionally on every positive validation. When a normal-tier memory accumulates 5 positive validations, it is promoted to important. When an important-tier memory reaches 10, it is promoted to critical. A throttle safeguard limits promotions to 3 per 8-hour rolling window. Constitutional, critical, temporary and deprecated tiers are non-promotable. The response includes `autoPromotion` metadata showing whether promotion was attempted, the previous and new tier, and the reason.

Negative feedback persistence fires unconditionally on every negative validation. A `recordNegativeFeedbackEvent()` call stores the event in the `negative_feedback_events` table. The search handler reads these events and applies a confidence multiplier that starts at 1.0, decreases by 0.1 per negative validation and floors at 0.3. Time-based recovery with a 30-day half-life gradually restores the multiplier. Demotion scoring runs behind the `SPECKIT_NEGATIVE_FEEDBACK` flag (default ON).

When a `queryId` is provided alongside positive feedback, two additional systems activate. Learned feedback persistence records the user's selection and extracts query terms into a separate `learned_triggers` column (isolated from the FTS5 index to prevent contamination). These learned triggers boost future searches for the same terms. Ground truth selection logging records the event in the evaluation database for the ground truth corpus, returning a `groundTruthSelectionId` in the response.

The read-compute-write cycle runs within a single SQLite transaction to prevent concurrent validation events from racing and dropping updates.

---

## Discovery

### Memory browser (memory_list)

Paginated browsing of everything the memory system knows. You can sort by creation date, update date or importance weight. Filter by spec folder. Optionally include child chunk rows alongside parent memories (off by default for cleaner browsing).

Each entry shows its numeric ID, spec folder, title, creation and update timestamps, importance weight, trigger phrase count and file path. The response includes a total count and pagination hints (like "More results available: use offset: 40") for navigating forward. Default page size is 20, maximum is 100.

This is the starting point for any manual memory management workflow. Need to delete a specific memory? Browse to find its ID. Want to audit what is indexed under a spec folder? Filter by folder and scan the results. Wondering why a memory is not surfacing in search? Look up its importance weight and tier here.

### System statistics (memory_stats)

A single call returns the system dashboard. Total memory count, embedding status breakdown (how many succeeded, how many are pending, how many failed), date range of the oldest and newest memories, total trigger phrase count, tier distribution across all six tiers, database file size in bytes, last indexed timestamp and whether vector search is available.

The top spec folders are ranked by one of four strategies. Count (default) sorts by how many memories each folder contains. Recency sorts by the most recently updated memory in each folder. Importance sorts by the highest importance tier present. Composite uses a weighted multi-factor score from `folderScoring.computeFolderScores()` that combines recency, importance, activity and validation scores into a single ranking.

The composite mode is the most revealing. A folder can have many memories (high count) but all of them stale (low recency) and unvalidated (low validation score). Composite catches that. Pass `includeScores: true` to see the score breakdown per folder: recencyScore, importanceScore, activityScore, validationScore, topTier and lastActivity.

Graph channel metrics from hybrid search and a `vectorSearchEnabled` flag round out the response. If scoring fails for any reason, the system falls back to count-based ranking gracefully.

### Health diagnostics (memory_health)

Two report modes. Full mode checks database connectivity, embedding model readiness, vector search availability, FTS5 index consistency and alias conflicts. The FTS5 check compares row counts between `memory_index` and `memory_fts` tables. If they diverge, something went wrong during indexing and the system suggests running `memory_index_scan` with `force: true` to rebuild. Alias conflict detection finds files that exist under both `specs/` and `.opencode/specs/` paths, which happens in projects with symlinks or path normalization issues.

The response reports overall status as "healthy" or "degraded" along with server version, uptime in seconds, embedding provider details (provider name, model, dimension) and the database file path. "Degraded" does not mean broken. It means something needs attention: a disconnected embedding provider, an FTS mismatch or unresolved alias conflicts.

The `divergent_aliases` report mode narrows the focus. It finds files that exist under both path variants with different content hashes. Same file, two locations, different content. That is a data integrity problem that requires manual triage. You can scope this check to a specific spec folder and paginate results up to 200 groups.

---

## Maintenance

### Workspace scanning and indexing (memory_index_scan)

This is the tool that keeps the memory database synchronized with the filesystem. Without it, new or modified memory files would be invisible to search.

The scanner discovers files from three sources: spec folder memory files (`specs/**/memory/*.md`), constitutional files (`.opencode/skill/*/constitutional/*.md`) and spec documents (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, `research.md`, `handover.md`). Canonical path deduplication prevents the same file from being indexed twice under different paths (the `specs/` vs `.opencode/specs/` symlink problem).

In incremental mode (the default), the scanner categorizes every discovered file into one of four buckets: to-index (new files), to-update (changed content hash), to-skip (unchanged mtime and hash) and to-delete (files that disappeared from disk). Batch processing with configurable `BATCH_SIZE` handles large workspaces. A rate limiter with `INDEX_SCAN_COOLDOWN` prevents rapid repeated scans from exhausting resources, returning an E429 error with a wait time if you scan too frequently.

Each file that passes through to indexing goes through the full `memory_save` pipeline, which means content normalization, quality gating, reconsolidation, chunk thinning and encoding-intent capture all apply automatically. Large files are split into chunks, and anchor-aware chunk thinning drops low-scoring chunks before they enter the index.

After indexing, the tool does more than store data. It creates causal chain edges between spec documents within the same folder (spec leads to plan, plan leads to tasks, tasks lead to checklist, and so on). It detects alias conflicts. It runs divergence reconciliation hooks. It clears the trigger matcher cache if any changes occurred.

A safety invariant protects against silent failures: post-indexing mtime updates happen only for successfully indexed files. If embedding generation fails for a specific file, that file retains its old mtime so the next scan automatically retries it. You do not have to track which files failed. The system tracks it for you.

The result breakdown is detailed: indexed count, updated count, unchanged count, failed count, skipped-by-mtime count, skipped-by-hash count, constitutional stats, dedup stats and incremental stats. Debug mode (`SPECKIT_DEBUG_INDEX_SCAN=true`) exposes additional file count diagnostics.

---

## Lifecycle

### Checkpoint creation (checkpoint_create)

Named snapshots capture the current memory state by serializing the `memory_index` table, `working_memory` table and vector embeddings from `vec_memories` into a gzip-compressed JSON blob stored in the `checkpoints` table. You can scope a snapshot to a specific spec folder if you only care about preserving one area of the system.

A maximum of 10 checkpoints are retained. When you create the 11th, the oldest is automatically purged. Each checkpoint records arbitrary metadata you provide, plus the current git branch from environment variables. The gzip compression keeps storage manageable even with large memory databases.

Checkpoints are the safety net for destructive operations. `memory_bulk_delete` auto-creates one before every bulk deletion. `checkpoint_restore` brings it all back. The cycle works because checkpoints include vector embeddings alongside metadata, so restored memories are immediately searchable without re-running embedding generation.

### Checkpoint listing (checkpoint_list)

Returns a paginated list of available checkpoints with metadata: name, creation date, spec folder scope, git branch and compressed snapshot size. The actual snapshot data is not included. Results are ordered by creation date, most recent first. Default limit is 50, maximum 100. You can filter by spec folder to see only checkpoints that cover a specific area.

### Checkpoint restore (checkpoint_restore)

Restoring from a named checkpoint decompresses the gzip snapshot, validates every row against the database schema (a T107 fix that catches corrupted snapshots before they damage the database) and either merges with existing data or clears existing data first.

The `clearExisting` mode deserves explanation. When true, the entire restore runs inside a database transaction. If the restore encounters an error halfway through, the transaction rolls back and existing data is untouched. This atomicity guarantee (a T101 fix) is critical because clearing existing data and then failing to restore would leave you with an empty database and no way back.

When merging (the default), the system checks for duplicates using a logical key of `spec_folder + file_path + anchor_id`. Existing memories that match the logical key are skipped rather than duplicated.

After restore, all search indexes are rebuilt from scratch: the vector index is cleared and repopulated, the BM25 index is rebuilt from database content, the trigger matcher cache is refreshed and the constitutional cache is invalidated. This rebuild ensures that restored memories are immediately findable through every search channel.

### Checkpoint deletion (checkpoint_delete)

Permanently removes a named checkpoint from the `checkpoints` table. Returns a boolean indicating whether the checkpoint was found and deleted. No confirmation prompt. No safety net. If you delete the wrong checkpoint, it is gone. Use `checkpoint_list` first to verify the name.

---

## Analysis

### Causal edge creation (memory_causal_link)

Creates a directed relationship edge between two memories in the causal graph. Six relationship types are supported: caused (this memory led to that one), enabled (this memory made that one possible), supersedes (this memory replaces that one), contradicts (these memories disagree), derived_from (this memory was produced from that one) and supports (this memory backs up that one).

Edge strength is a 0-1 float, clamped at both ends. Evidence text is optional but recommended because it explains why the relationship exists. If an edge with the same source, target and relation already exists, the system updates strength and evidence via `INSERT ... ON CONFLICT DO UPDATE` rather than creating a duplicate. That upsert behavior means you can call `memory_causal_link` repeatedly with updated evidence without worrying about edge proliferation.

Edge bounds are enforced at insert time. Auto-generated edges (those with `created_by='auto'`) are rejected when a node already has 20 edges (`MAX_EDGES_PER_NODE`) and clamped to a maximum strength of 0.5 (`MAX_AUTO_STRENGTH`). Every strength modification is logged to a `weight_history` table recording old strength, new strength, who changed it, when and why. The `created_by` and `last_accessed` fields on each edge track provenance and usage patterns.

A batch insert variant (`insertEdgesBatch()`) handles bulk edge creation during spec document indexing. The `createSpecDocumentChain()` function auto-links spec folder documents in a standard chain: spec causes plan, plan causes tasks, tasks cause implementation-summary. Checklist, decision-record and research documents get support relationships to the primary chain.

### Causal graph statistics (memory_causal_stats)

Returns the health metrics of the causal graph in a single call. Total edge count, breakdown by relationship type (how many caused edges, how many supports edges and so on), average edge strength across all edges, unique source and target memory counts and the link coverage percentage.

Link coverage is the most important metric: what percentage of memories participate in at least one causal relationship? The target is 60% (CHK-065). Below that, the graph is too sparse for the graph search channel to contribute meaningfully. The tool reports pass or fail against that target.

Orphaned edges (edges referencing source or target memories that no longer exist in `memory_index`) are detected and counted. When orphans exist, the health status changes from "healthy" to "has_orphans." You can use `memory_drift_why` to find the edge IDs and `memory_causal_unlink` to clean them up.

### Causal edge deletion (memory_causal_unlink)

Removes a single causal relationship edge by its numeric edge ID. You get edge IDs from `memory_drift_why` traversal results (a T202 enhancement that added edge IDs to the response specifically to enable this workflow).

A library-level variant, `deleteEdgesForMemory()`, removes all edges referencing a given memory ID. This variant is called automatically during memory deletion (`memory_delete`) to maintain graph integrity. You do not need to manually clean up edges when deleting a memory. The system handles it.

### Causal chain tracing (memory_drift_why)

"Why was this decision made?" This tool answers that question by tracing the causal relationship chain for a given memory through depth-limited graph traversal.

You choose the traversal direction: outgoing (what did this memory cause or enable?), incoming (what caused or enabled this memory?) or both. Maximum depth is configurable from 1 to 10, defaulting to 3. Cycle detection via a visited set prevents infinite traversal through circular relationships.

Results are grouped by relationship type: causedBy, enabledBy, supersedes, contradicts, derivedFrom and supports. Each edge carries a relation-weighted strength value. Supersedes edges receive a 1.5x weight boost (because replacement is a strong signal). Caused edges receive 1.3x. Enabled edges receive 1.1x. Supports and derived_from edges pass through at 1.0x. Contradicts edges receive 0.8x dampening because contradictions weaken rather than strengthen the chain.

You can filter to specific relationship types after traversal. Pass `relations: ["caused", "supersedes"]` to see only the replacement and causation chains. The response includes a `max_depth_reached` flag that warns when the depth limit may have truncated results. If you see that flag, consider increasing `maxDepth` for a more complete picture.

When contradictions are found, the response includes warning hints. Two memories that contradict each other in the same causal chain is a signal that something needs resolution.

### Epistemic baseline capture (task_preflight)

Before starting implementation work, this tool records how much the agent knows, how uncertain it is and how complete the context is. All three scores are on a 0-100 scale. You can optionally list identified knowledge gaps as an array of strings.

Records are stored in the `session_learning` table with a `UNIQUE` constraint on `(spec_folder, task_id)`. If a preflight record already exists for the same combination and is still in the "preflight" phase, calling preflight again updates the existing record rather than creating a duplicate. Completed records (where postflight has already run) cannot be overwritten. That guard prevents accidental resets of finished learning cycles.

The purpose of preflight is establishing a baseline for learning measurement. Without knowing where you started, you cannot measure how much you learned. The postflight tool completes the measurement.

### Post-task learning measurement (task_postflight)

After completing implementation work, this tool captures the post-task epistemic state and computes a Learning Index by comparing against the preflight baseline. The formula weights three deltas: `LI = (KnowledgeDelta * 0.4) + (UncertaintyReduction * 0.35) + (ContextImprovement * 0.25)`.

The uncertainty delta is inverted (pre minus post) so that reduced uncertainty counts as a positive learning signal. If you started at 70% uncertainty and finished at 20%, that is a +50 uncertainty reduction contributing +17.5 to the Learning Index.

Interpretation bands give the score meaning. 40 or above signals significant learning (you understood something that changed your approach). 15-39 is moderate learning. 5-14 is incremental. 0-4 is an execution-focused session where you applied existing knowledge without gaining new understanding. Below zero indicates knowledge regression, which usually means the task revealed that prior assumptions were wrong.

You can track gaps closed during the task and new gaps discovered. Both are stored as JSON arrays alongside the scores. The phase updates from "preflight" to "complete" after postflight runs. Calling postflight without a matching preflight record throws an error.

### Learning history (memory_get_learning_history)

Retrieves learning records for a spec folder with optional filtering by session ID and completion status. Each record shows the preflight scores, postflight scores, computed deltas and Learning Index.

The summary statistics are where this tool earns its keep. Across all completed tasks in a spec folder, you see the average Learning Index, maximum and minimum LI, average knowledge gain, average uncertainty reduction and average context improvement. Trend interpretation maps the average LI to a human-readable assessment: above 15 is a strong learning trend, 7-15 is positive, 0-7 is slight, zero is neutral and below zero is regression.

Pass `onlyComplete: true` to restrict results to tasks where both preflight and postflight were recorded. This gives you clean data for trend analysis without incomplete records skewing the averages. Records are ordered by `updated_at` descending so the most recent learning cycles appear first.

---

## Evaluation

### Ablation studies (eval_run_ablation)

This tool runs controlled ablation studies across the retrieval pipeline's search channels. You disable one channel at a time (vector, BM25, FTS5, graph or trigger) and measure the Recall@20 delta against a full-pipeline baseline. The answer to "what happens if we turn off the graph channel?" becomes a measured number rather than speculation.

The framework uses dependency injection for the search function, making it testable without the full pipeline. Each channel ablation wraps in a try-catch so a failure in one channel's ablation produces partial results rather than a total failure. Statistical significance is assessed via a sign test (exact binomial distribution) because it is robust with small query sets where a t-test would be unreliable. Verdict classification ranges from CRITICAL (channel removal causes significant regression) through negligible to HARMFUL (channel removal actually improves results).

Results are stored in `eval_metric_snapshots` with negative timestamp IDs to distinguish ablation runs from production evaluation runs. The tool requires `SPECKIT_ABLATION=true` to activate. When the flag is off, all public functions are no-ops.

### Reporting dashboard (eval_reporting_dashboard)

Generates a sprint-level and channel-level metric dashboard from stored evaluation runs. You can filter by sprint, channel and metric, and choose between text (markdown-formatted) or JSON output.

The dashboard aggregates per-sprint metric summaries (mean, min, max, latest, count) and per-channel performance views (hit count, average latency, query count) from the `eval_metric_snapshots`, `eval_channel_results` and `eval_final_results` tables. Trend analysis compares consecutive runs to detect regressions. Sprint labels are inferred from metadata JSON or `eval_run_id` grouping. A `isHigherBetter()` helper correctly interprets trend direction for different metric types (recall and precision are higher-better; latency is lower-better).

This is a read-only module. It queries the eval database and produces reports. No writes, no side effects, no feature flag gate.

---

## Bug fixes and data integrity

### Graph channel ID fix (G1)

The graph search channel had a 0% hit rate in production. Zero. The system was designed as a 4-channel retrieval engine, but the graph channel contributed nothing because `graph-search-fn.ts` compared string-formatted IDs (`mem:${edgeId}`) against numeric memory IDs at two separate locations.

Both comparison points now extract numeric IDs, and the graph channel returns results for queries where causal edge relationships exist. This was the single highest-impact bug in the system because it meant an entire retrieval signal was dead on arrival.

### Chunk collapse deduplication (G3)

Duplicate chunk rows appeared in default search mode because the deduplication logic only ran when `includeContent=true`. Most queries use the default `includeContent=false` path, which means most users saw duplicates. The conditional gate was removed at the call site in `memory-search.ts` (not the function definition) so dedup runs on every search request regardless of content settings. A small fix, but one that affected every standard query.

### Co-activation fan-effect divisor (R17)

Hub memories with many connections dominated co-activation results no matter what you searched for. If a memory had 40 causal edges, it showed up everywhere.

The fix applies a `1 / sqrt(neighbor_count)` divisor that scales down score contributions from highly connected nodes. After the change, no single memory appears in more than 60% of co-activation results. The divisor includes proper bounds checks so there is no division-by-zero risk and output stays capped.

### SHA-256 content-hash deduplication (TM-02)

Before this change, re-saving identical content triggered a full embedding API call every time. That costs money and adds latency for zero value.

An O(1) SHA-256 hash lookup in the `memory_index` table now catches exact duplicates within the same spec folder before the embedding step. When you re-save the same file, the system skips embedding generation entirely. Change one character, and embedding proceeds as normal. No false positives on distinct content because the check is cryptographic, not heuristic.

---

## Evaluation and measurement

### Evaluation database and schema (R13-S1)

A separate SQLite database (`speckit-eval.db`) stores retrieval quality data in five tables: `eval_queries`, `eval_channel_results`, `eval_final_results`, `eval_ground_truth` and `eval_metric_snapshots`. Keeping evaluation data in its own database is a deliberate security decision. The main search database should never carry evaluation artifacts that could leak into production results.

Logging hooks in the search, context and trigger handlers record every retrieval event asynchronously without blocking the response path. Every tuning decision from Sprint 1 onward is backed by data from this schema, which makes it the single most consequential piece of infrastructure in the program.

### Core metric computation (R13-S1)

Nine metrics run against logged retrieval data. The four primary ones are MRR@5 (how high does the right answer rank?), NDCG@10 (are results ordered well?), Recall@20 (do we find everything relevant?) and Hit Rate@1 (is the top result correct?).

Five diagnostic metrics add depth: inversion rate counts pairwise ranking mistakes, constitutional surfacing rate tracks whether high-priority memories appear in top results, importance-weighted recall favors recall of critical content, cold-start detection rate measures whether fresh memories surface when relevant and intent-weighted NDCG adjusts ranking quality by query type.

This battery of metrics means you can diagnose where the pipeline fails, not just whether it fails.

### Observer effect mitigation (D4)

Measurement infrastructure should not degrade the system it measures. A health check compares search p95 latency with eval logging enabled versus disabled and fires an alert when overhead exceeds 10%. In practice, measured overhead stays within the 5ms p95 budget. If the eval database becomes unavailable (disk full, file lock, corruption), search continues normally with logging silently disabled. The system never blocks a user query to record an evaluation metric.

### Full-context ceiling evaluation (A2)

How good could retrieval be if the system had perfect recall? To answer that, an LLM receives all memory titles and summaries and ranks them for each ground truth query. The resulting MRR@5 score is the theoretical upper bound. The gap between this ceiling and actual hybrid performance tells you how much room for improvement exists. A 2x2 matrix alongside the BM25 baseline puts both numbers in context: the BM25 floor shows the minimum, the LLM ceiling shows the maximum, and the hybrid pipeline sits somewhere between.

### Quality proxy formula (B7)

Manual evaluation does not scale. You cannot hand-review every query across every sprint.

The quality proxy formula produces a single 0-1 score from four components: `avgRelevance * 0.40 + topResult * 0.25 + countSaturation * 0.20 + latencyPenalty * 0.15`. It runs automatically on logged data and flags regressions without human review.

The weights were chosen to prioritize relevance over speed while still penalizing latency spikes. Correlation testing against the manual ground truth corpus confirmed the proxy tracks real quality well enough for regression detection.

### Synthetic ground truth corpus (G-NEW-1, G-NEW-3 phase A)

A corpus of 110 query-relevance pairs covers all seven intent types with at least five queries per type and at least three complexity tiers (simple factual, moderate relational, complex multi-hop).

40 queries are hand-written natural language, not derived from trigger phrases. That last detail matters: if your ground truth comes from the same trigger phrases the system already matches against, you are testing the system against itself.

Hard negative queries are included to verify that irrelevant memories rank low. The corpus also incorporates findings from the G-NEW-2 agent consumption analysis, so queries reflect how agents actually use the system rather than how a spec author imagines they do.

### BM25-only baseline (G-NEW-1)

Running FTS5 alone (disabling vector, graph and trigger channels) on the 110-query corpus produced an MRR@5 of 0.2083. That is well below 50% of hybrid performance.

If BM25 had been competitive, the entire multi-channel approach would be questioned. Instead, the gap confirmed that hybrid retrieval adds real value over keyword search. The contingency decision to proceed with the full program was based on this measurement. No opinions, no intuitions, just a number. The in-memory BM25 channel (distinct from FTS5) runs behind the `ENABLE_BM25` flag (default ON, set `ENABLE_BM25=false` to disable).

### Agent consumption instrumentation (G-NEW-2)

Instrumentation wiring remains present in retrieval handlers (`memory_search`, `memory_context`, `memory_match_triggers`), but the runtime logger is currently inert/deprecated (`isConsumptionLogEnabled()` hardcoded `false`). Calls remain fail-safe no-ops for compatibility while telemetry paths stay structurally available.

The earlier pattern-analysis outcome from this workstream still informed ground-truth design, but current production runtime does not actively write new consumption-log rows unless instrumentation is reactivated.

### Scoring observability (T010)

Interference score distributions are logged at query time via 5% sampling to a `scoring_observations` table. Each observation captures memory ID, query ID, interference penalty, score before and after and the delta.

The novelty boost (`calculateNoveltyBoost`) was removed from the hot scoring path during Sprint 8 remediation because it always returned 0 (the feature completed its evaluation). Telemetry now hardcodes `noveltyBoostApplied: false, noveltyBoostValue: 0` for backward-compatible log schemas.

The 5% sample rate keeps storage costs low while still catching calibration drift. A try-catch wrapper guarantees that telemetry failures never affect scoring results. If the observation write fails, the search result is unchanged and the failure is swallowed silently.

### Full reporting and ablation study framework (R13-S3)

The ablation study framework disables one retrieval channel at a time (vector, BM25, FTS5, graph or trigger) and measures Recall@20 delta against a full-pipeline baseline. "What happens if we turn off the graph channel?" is now a question with a measured answer rather than speculation.

The framework uses dependency injection for the search function, making it testable without the full pipeline. Statistical significance is assessed via a sign test using log-space binomial coefficient computation (preventing overflow for n>50, fixed in Sprint 8). Verdict classification ranges from CRITICAL (channel removal causes significant regression) through negligible to HARMFUL (channel removal actually improves results). Results are stored in `eval_metric_snapshots` with negative timestamp IDs to distinguish ablation runs from production evaluation data. Runs behind the `SPECKIT_ABLATION` flag.

The reporting dashboard aggregates per-sprint metric summaries (mean, min, max, latest, count) and per-channel performance views (hit count, average latency, query count) from the evaluation database. Trend analysis compares consecutive runs to detect regressions. Sprint labels are inferred from metadata JSON. A `isHigherBetter()` helper correctly interprets trend direction for different metric types. Both the ablation runner and the dashboard are exposed as new MCP tools: `eval_run_ablation` and `eval_reporting_dashboard`.

### Shadow scoring and channel attribution (R13-S2)

Full A/B comparison infrastructure ran alternative scoring algorithms in parallel, logging results without affecting live ranking. The system computed detailed comparison metrics including Kendall tau rank correlation, per-result score deltas, and production-only versus shadow-only result sets. Channel attribution tagged each result with its source channels and computed Exclusive Contribution Rate per channel: how often each channel was the sole source for a result in the top-k window.

Ground truth expansion via implicit user selection tracking and an LLM-judge stub interface were included for future corpus growth.

Shadow scoring completed its evaluation purpose and has been fully removed. The `isShadowScoringEnabled()` function and shadow-scoring branches in `hybrid-search.ts` were deleted during Sprint 8 remediation. The `runShadowScoring` and `logShadowComparison` function bodies now return immediately (`return null` and `return false` respectively). The `SPECKIT_SHADOW_SCORING` flag remains as a no-op for backward compatibility. This shadow-scoring cleanup is independent from R11 learned-feedback safeguards, where `isInShadowPeriod()` remains active. Channel attribution logic remains active within the 4-stage pipeline.

---

## Graph signal activation

### Typed-weighted degree channel (R4)

A fifth RRF channel scores memories by their graph connectivity. Edge type weights range from caused at 1.0 down to supports at 0.5, with logarithmic normalization and a hub cap (`MAX_TYPED_DEGREE=15`, `MAX_TOTAL_DEGREE=50`, `DEGREE_BOOST_CAP=0.15`) to prevent any single memory from dominating results through connections alone.

Constitutional memories are excluded from degree boosting because they already receive top-tier visibility. The channel runs behind the `SPECKIT_DEGREE_BOOST` feature flag with a degree cache that invalidates only on graph mutations, not per query. When a memory has zero edges, the channel returns 0 rather than failing.

### Co-activation boost strength increase (A7)

The co-activation boost multiplier jumped from 0.1x to 0.25-0.3x. At 0.1x, the graph signal investment was barely visible in retrieval results, roughly 5% effective contribution at hop 2.

The new multiplier targets 15% or higher contribution, which is enough to matter without overwhelming the vector and lexical channels. You can tune the exact value through the `SPECKIT_COACTIVATION_STRENGTH` environment variable. A dark-run measurement sequence isolates A7 contribution by comparing R4-only results against R4+A7 results.

### Edge density measurement

A SQL query computes the edges-per-node ratio from the `causal_edges` table. This number determines how much graph signal the system can extract. If density falls below 0.5, the system flags an escalation decision for auto entity extraction (R10) in a future sprint. The R4 exit gate is density-conditional: when graph coverage is too thin, the gate evaluates R4 implementation correctness (unit tests, zero-return behavior) rather than demanding the +2% MRR@5 lift that would be unreasonable with a sparse graph. That conditional gating is a pragmatic design choice. No point holding a feature to a metric it cannot influence.

### Weight history audit tracking

Every causal edge now carries `created_by` and `last_accessed` metadata fields tracking who created the edge and when it was last used. All strength modifications are logged to a `weight_history` table recording old strength, new strength, the actor (`changed_by`), timestamp and reason.

Edge bounds are enforced at insert time. Auto-generated edges (those with `created_by='auto'`) are rejected when a node already has 20 edges (`MAX_EDGES_PER_NODE`) and clamped to a maximum strength of 0.5 (`MAX_AUTO_STRENGTH`). A `rollbackWeights()` function restores edges from weight history with a fallback to the oldest entry if timestamp matching fails due to same-millisecond updates.

This audit infrastructure supports the N3-lite consolidation engine: Hebbian strengthening, staleness detection and edge bounds enforcement all rely on accurate weight history and provenance tracking.

### Graph momentum scoring (N2a)

Graph connectivity changes over time, and that trajectory carries signal. A memory gaining three new edges this week is more actively relevant than one whose connections have been static for months.

Graph momentum computes a temporal degree delta: `current_degree - degree_7d_ago`. The `degree_snapshots` table records per-node degree counts at daily granularity with a UNIQUE constraint on `(memory_id, snapshot_date)`. The `snapshotDegrees()` function captures the current state, and `computeMomentum()` looks back 7 days to calculate the delta.

The momentum signal applies as an additive bonus in Stage 2 of the pipeline, capped at +0.05 per result. Batch computation via `computeMomentumScores()` is session-cached to avoid repeated database queries within a single search request. Cache invalidation follows the established pattern from `graph-search-fn.ts`: caches clear on edge mutations via `clearGraphSignalsCache()`.

When no snapshot exists for the 7-day lookback (common during initial rollout), the momentum defaults to zero rather than penalizing the memory. Runs behind the `SPECKIT_GRAPH_SIGNALS` flag (default ON, shared with N2b).

### Causal depth signal (N2b)

Not all memories sit at the same level of abstraction. A root decision that caused five downstream implementation memories occupies a different position in the knowledge graph than a leaf node.

Causal depth measures each memory's maximum distance from root nodes (those with in-degree zero) via BFS traversal. The raw depth is normalized by graph diameter to produce a [0,1] score. A memory at depth 3 in a graph with diameter 6 scores 0.5.

Like momentum, the depth signal applies as an additive bonus in Stage 2, capped at +0.05. Batch computation via `computeCausalDepthScores()` shares the same session cache infrastructure as momentum. Both signals are applied together by `applyGraphSignals()`, which iterates over pipeline rows and adds the combined bonus. A single-node variant of `computeCausalDepth` was removed during Sprint 8 remediation as dead code (the batch version `computeCausalDepthScores` is the only caller).

The combined N2a+N2b adjustment is modest by design: up to +0.10 total. This keeps graph signals as a tiebreaker rather than a dominant ranking factor. Runs behind the `SPECKIT_GRAPH_SIGNALS` flag (default ON, shared with N2a).

### Community detection (N2c)

Individual memories are retrieved based on query similarity, but they exist within communities of related knowledge. Community detection identifies these clusters so that when one member surfaces, its neighbors get a retrieval boost.

The primary algorithm is BFS connected components over the causal edge adjacency list. This is fast and sufficient when the graph has natural cluster boundaries. When the largest connected component exceeds 50% of all nodes (meaning the graph is too densely connected for BFS to produce meaningful clusters), the system escalates to a simplified pure-TypeScript Louvain modularity optimization. The Louvain implementation performs iterative node moves between communities to maximize modularity score Q, converging when no single move improves Q.

Community assignments are stored in the `community_assignments` table with a UNIQUE constraint on `memory_id`. Recomputation is debounced: communities recalculate only when the graph has changed since the last run, at most once per session.

The `applyCommunityBoost()` function in the pipeline injects up to 3 community co-members into the result set at 0.3x the source memory's score. Community injection runs in Stage 2 at position 2b (between causal boost and graph signals) so that injected rows also receive N2a+N2b momentum and depth adjustments. Runs behind the `SPECKIT_COMMUNITY_DETECTION` flag (default ON).

---

## Scoring and calibration

### Score normalization

The RRF fusion system and composite scoring system had a 15:1 magnitude mismatch. RRF scores fell in the 0-0.07 range while composite scores covered the full 0-1 range. Composite dominated purely because of scale, not because it was better.

Min-max normalization now maps both outputs to a 0-1 range, letting actual relevance determine ranking instead of which scoring system happens to produce larger numbers. Single-result queries and equal-score edge cases normalize to 1.0.

The normalization is batch-relative (the same memory can score differently across different queries), which is expected behavior for min-max. Runs behind the `SPECKIT_SCORE_NORMALIZATION` flag.

### Cold-start novelty boost (N4)

FSRS temporal decay biases against recent items. A memory indexed 2 hours ago has barely any retrievability score, even when it is exactly what you need.

The novelty boost applies an exponential decay (`0.15 * exp(-elapsed_hours / 12)`) to memories under 48 hours old, counteracting that bias. At indexing time, the boost is 0.15. After 12 hours, it drops to about 0.055. By 48 hours, it is effectively zero.

The boost applies before FSRS decay and caps the composite score at 0.95 to prevent runaway inflation. One side effect: memories with high base scores (above 0.80) see diminished effective boost because the cap clips them. That is intentional. High-scoring memories do not need extra help.

**Sprint 8 update:** The `calculateNoveltyBoost()` call was removed from the hot scoring path in `composite-scoring.ts` because evaluation showed it always returned 0. The function definition remains but is no longer invoked during search. Telemetry fields are hardcoded to `noveltyBoostApplied: false, noveltyBoostValue: 0` for log schema compatibility.

### Interference scoring (TM-01)

Memories in dense similarity clusters tend to crowd out unique results. If you have five near-identical memories about the same topic, all five can occupy the top results and push out a different memory that might be more relevant.

Interference scoring penalizes cluster density: for each memory, the system counts how many neighbors exceed a 0.75 text similarity threshold (Jaccard over word tokens from title and trigger phrases) within the same spec folder, then applies a `-0.08 * interference_score` penalty after the N4 novelty boost.

Both the threshold (0.75) and coefficient (-0.08) are provisional. They will be tuned empirically after two R13 evaluation cycles, tracked as FUT-S2-001. Runs behind the `SPECKIT_INTERFERENCE_SCORE` flag.

### Classification-based decay (TM-03)

Not all memories should decay at the same rate. A decision record from six months ago is still relevant. A scratch note from last Tuesday probably is not.

FSRS decay rates now vary by a two-dimensional multiplier matrix. On the context axis: decisions never decay (stability set to Infinity), research memories get 2x stability, and implementation/discovery/general memories follow the standard rate. On the tier axis: constitutional and critical memories never decay, important memories get 1.5x stability, normal memories follow the standard, temporary memories decay at 0.5x and deprecated at 0.25x.

The combined multiplier uses `Infinity` for never-decay cases, which produces `R(t) = 1.0` for all t without special-case logic. Runs behind the `SPECKIT_CLASSIFICATION_DECAY` flag.

### Folder-level relevance scoring (PI-A1)

A four-factor weighted formula scores each spec folder: `score = (recency * 0.40) + (importance * 0.30) + (activity * 0.20) + (validation * 0.10)`. Recency uses a decay function `1 / (1 + days * 0.10)` so a 7-day-old folder scores about 0.59 and a 10-day-old folder about 0.50. Importance averages the tier weights of all memories in the folder. Activity caps at 1.0 when a folder has 5 or more memories. Archive folders (`z_archive/`, `scratch/`, `test-`, `prototype/`) receive a 0.1-0.2 multiplier to keep them out of top results.

This scoring enables two-phase retrieval: first rank folders by aggregated score, then search within the top-ranked folders. The DocScore formula `(1/sqrt(M+1)) * SUM(score(m))` provides damped aggregation so large folders do not dominate by volume alone. Runs behind the `SPECKIT_FOLDER_SCORING` flag (default ON).

### Embedding cache (R18)

Embedding API calls are the most expensive operation in the indexing pipeline. The embedding cache stores generated embeddings in a SQLite table keyed by SHA-256 content hash and model ID. On re-index, the system checks the cache first.

A hit returns the stored embedding in microseconds instead of making a network round-trip that costs money and takes hundreds of milliseconds. LRU eviction via `last_used_at` prevents unbounded cache growth, and the `INSERT OR REPLACE` strategy handles model upgrades cleanly.

The cache has no feature flag because cache misses fall through to normal embedding generation with zero behavioral change.

### Double intent weighting investigation (G2)

A full pipeline trace through `hybrid-search.ts`, `intent-classifier.ts` and `adaptive-fusion.ts` investigated whether intent weights applied at two separate points was a bug. The answer: intentional design.

System A (`INTENT_WEIGHT_PROFILES` in adaptive fusion) controls how much each channel contributes during RRF fusion. System B (`INTENT_WEIGHT_ADJUSTMENTS` in the intent classifier) controls how result attributes (similarity, importance, recency) are weighted after fusion. These operate on different dimensions at different pipeline stages and serve complementary purposes.

A minor inefficiency exists (recency boost from System A is discarded when System B re-scores), but it is harmless. No code change needed. The 4-stage pipeline (R6) resolved this structurally: Stage 2 applies intent weights only for non-hybrid search types via an `isHybrid` boolean gate, so the code path for double-weighting is absent by design.

### RRF K-value sensitivity analysis (FUT-5)

The K parameter in Reciprocal Rank Fusion controls how much rank position matters. A low K amplifies rank differences while a high K compresses them.

A grid search over K values {20, 40, 60, 80, 100} measured MRR@5 delta per value using Kendall tau correlation for ranking stability. The optimal K was identified and documented. Before this analysis, K was chosen by convention rather than measurement. Now it is empirically grounded.

### Negative feedback confidence signal (A4)

When you mark a memory as not useful via `memory_validate(wasUseful: false)`, the signal now flows into composite scoring as a demotion multiplier. The multiplier starts at 1.0, decreases by 0.1 per negative validation and floors at 0.3 so a memory is never suppressed below 30% of its natural score. Time-based recovery with a 30-day half-life (`RECOVERY_HALF_LIFE_MS`) gradually restores the multiplier: the penalty halves every 30 days since the last negative validation.

Negative feedback events are persisted to a `negative_feedback_events` table. The search handler reads these events and applies the multiplier during the feedback signals step in Stage 2 of the pipeline. Runs behind the `SPECKIT_NEGATIVE_FEEDBACK` flag (default ON).

**Sprint 8 update:** The unused `RECOVERY_HALF_LIFE_DAYS` constant was removed (the millisecond-based `RECOVERY_HALF_LIFE_MS` is the actual constant used in computation).

### Auto-promotion on validation (T002a)

Positive validations now trigger automatic tier promotion. When a normal-tier memory accumulates 5 positive validations, it is promoted to important. When an important-tier memory reaches 10, it is promoted to critical. A throttle safeguard limits promotions to 3 per 8-hour rolling window to prevent runaway promotion during bulk validation sessions.

Constitutional, critical, temporary and deprecated tiers are non-promotable. Each promotion is logged to a `memory_promotion_audit` table for traceability. The `memory_validate` response includes `autoPromotion` metadata showing whether promotion was attempted, the previous and new tier, validation count and the reason.

---

## Query intelligence

### Query complexity router (R15)

Not all queries need the full 5-channel pipeline. A short trigger-phrase lookup like "memory save rules" is wasted on graph traversal and BM25 scoring.

The complexity router classifies incoming queries into simple (3 or fewer terms, or a trigger match), moderate (4-8 terms) and complex (more than 8 terms with no trigger) tiers based on term count, character count, trigger phrase presence and stop-word ratio. Simple queries run on two channels (vector and FTS), moderate on three (adding BM25) and complex on all five.

When the `SPECKIT_COMPLEXITY_ROUTER` flag is disabled, the classifier returns "complex" as a safe fallback so every query still gets the full pipeline. The minimum 2-channel invariant is enforced at the router level.

### Relative score fusion in shadow mode (R14/N1)

RRF has been the fusion method since day one, but is it the best option? Relative Score Fusion runs alongside RRF in shadow mode to find out.

Three RSF variants are implemented: single-pair (fusing two ranked lists), multi-list (fusing N lists with proportional penalties for missing sources) and cross-variant (fusing results across query expansions with a +0.10 convergence bonus). RSF results are logged for evaluation comparison but do not affect actual ranking.

Kendall tau correlation between RSF and RRF rankings is computed at sprint exit to measure how much the two methods diverge. If RSF consistently outperforms, a future sprint can switch the primary fusion method with measured evidence.

**Sprint 8 update:** The `isRsfEnabled()` feature flag function was removed as dead code. The dead RSF branch in `hybrid-search.ts` (which was gated behind this flag returning `false`) was also removed. The RSF fusion module (`rsf-fusion.ts`) retains its core fusion logic for potential future activation, but the flag guard function is gone.

### Channel min-representation (R2)

A strong vector channel can monopolize the top-k results, pushing out graph and lexical results entirely. Channel min-representation fixes that.

After fusion, the system checks that every channel which returned results has at least one representative in the top-k window. Results below a 0.005 quality floor are excluded from promotion because forcing a bad result into the top-k is worse than missing a channel. The floor was lowered from 0.2 to 0.005 during Sprint 8 remediation because RRF scores typically fall in the 0.01-0.03 range, and the original 0.2 threshold was filtering out virtually all RRF-sourced results.

Promoted items are appended to the result list and the entire set is re-sorted by score so ranking integrity is preserved. The net effect: you see results from diverse retrieval strategies rather than one dominant channel. Runs behind the `SPECKIT_CHANNEL_MIN_REP` flag.

### Confidence-based result truncation (R15-ext)

Search results often contain a long tail of irrelevant items. Rather than returning a fixed number, confidence truncation detects where relevant results end. It computes consecutive score gaps across the ranked list, finds the median gap, and looks for the first gap exceeding 2x the median. That point is the "relevance cliff." Everything below it is trimmed.

A minimum of three results is guaranteed regardless of gap analysis so the system never returns nothing. The truncation metadata (original count, truncated count, cutoff index, median gap and cutoff gap) is returned alongside results for evaluation.

Edge cases are handled: NaN and Infinity scores are filtered, and all-equal scores (median gap of zero) pass through unchanged. Runs behind the `SPECKIT_CONFIDENCE_TRUNCATION` flag.

### Dynamic token budget allocation (FUT-7)

Returning 4,000 tokens for a simple trigger-phrase lookup wastes context window. Token budgets now scale with query complexity: simple queries receive 1,500 tokens, moderate queries 2,500 and complex queries 4,000.

The budget is computed early in the pipeline (before channel execution) so downstream stages can enforce it. When the flag is disabled, all queries fall back to the 4,000-token default.

The savings add up. If 60% of your queries are simple, you recover roughly 40% of the token budget that was previously wasted on over-delivering.

### Query expansion (R12)

Embedding-based query expansion broadens retrieval for complex queries by mining similar memories from the vector index and extracting related terms to append to the original query, producing an enriched combined query string. Stop-words are filtered out and tokens shorter than 3 characters are discarded.

When R15 classifies a query as "simple", expansion is suppressed because expanding a trigger-phrase lookup would add noise. If expansion produces no additional terms, the original query proceeds unchanged. In the 4-stage pipeline, Stage 1 runs the baseline and expanded-query searches in parallel with deduplication (baseline-first). Runs behind the `SPECKIT_EMBEDDING_EXPANSION` flag (default ON).

---

## Memory quality and indexing

### Verify-fix-verify memory quality loop (PI-A5)

Every memory save operation now computes a quality score based on trigger phrase coverage, anchor format, token budget and content coherence. When the score falls below 0.6, the system auto-fixes by re-extracting triggers, normalizing anchors and trimming content to budget. Then it scores again.

If the second attempt still fails, a third try runs with stricter trimming. After two failed retries, the memory is rejected outright.

Rejection rates are logged per spec folder so you can spot folders that consistently produce low-quality saves. This loop catches problems at write time rather than letting bad data pollute search results.

### Signal vocabulary expansion (TM-08)

The trigger matcher originally recognized six signal categories. Two new categories from the true-mem 8-category vocabulary were added: CORRECTION signals (words like "actually", "wait", "I was wrong") and PREFERENCE signals ("prefer", "like", "want").

Correction signals matter because they indicate the user is fixing a prior misunderstanding, which means different memories are relevant. Preference signals help the system detect intent behind requests like "I prefer the JSON format" where matching on preference-associated memories improves retrieval accuracy.

### Pre-flight token budget validation (PI-A3)

Before assembling the final response, the system estimates total token count across all candidate results and truncates to the highest-scoring candidates when the total exceeds the configured budget. The truncation strategy is greedy: highest scores first, never round-robin.

For `includeContent=true` queries where a single result overshoots the budget, a summary (first 400 characters) replaces raw content rather than returning nothing.

Overflow events are logged with query ID, candidate count, total tokens, budget limit and the number of results after truncation. This prevents the response from blowing through the caller's context window.

### Spec folder description discovery (PI-B3)

A cached one-sentence description per spec folder (derived from spec.md) is stored in a `descriptions.json` file. The `memory_context` orchestration layer checks these descriptions before issuing vector queries.

If the target folder can be identified from the description alone, the system skips full-corpus search entirely. This is a lightweight routing optimization that reduces unnecessary computation for scoped queries where the user already has a specific folder in mind. Runs behind the `SPECKIT_FOLDER_DISCOVERY` flag (default ON).

### Pre-storage quality gate (TM-04)

A three-layer quality gate on memory save validates content before it enters the index. Layer 1 checks structural validity (title exists, content at least 50 characters, valid spec folder path format). Layer 2 scores content quality across five dimensions (title quality, trigger quality, length quality, anchor quality, metadata quality) with a 0.4 signal density threshold. Layer 3 checks semantic deduplication via cosine similarity against existing memories in the same spec folder, rejecting near-duplicates above 0.92.

The gate starts in warn-only mode for 14 days after activation per the MR12 mitigation: it logs would-reject decisions without blocking saves while the thresholds are being validated. After the warn-only period, hard rejections apply. Runs behind the `SPECKIT_SAVE_QUALITY_GATE` flag (default ON).

### Reconsolidation-on-save (TM-06)

After embedding generation, the save pipeline checks the top-3 most similar memories in the same spec folder. Similarity at or above 0.88 triggers a merge where content is combined and the `importance_weight` is incremented via `Math.min(1.0, currentWeight + 0.1)`. Similarity between 0.75 and 0.88 triggers conflict resolution: the old memory is deprecated and a `supersedes` causal edge is created. Below 0.75, the memory stores as a new complement.

**Sprint 8 update:** The original merge logic referenced a non-existent `frequency_counter` column, which would have caused runtime crashes on reconsolidation. This was replaced with `importance_weight` merge logic that properly uses an existing column.

A checkpoint must exist for the spec folder before reconsolidation can run. When no checkpoint is found, the system logs a warning and skips reconsolidation rather than risking destructive merges without a safety net. Runs behind the `SPECKIT_RECONSOLIDATION` flag (default ON).

### Smarter memory content generation (S1)

Raw markdown including code fences, nested lists and YAML frontmatter was being embedded as-is, diluting embedding quality with formatting noise. A content normalizer now strips this noise before both embedding generation and BM25 indexing.

Seven primitives run in sequence: strip YAML frontmatter, strip anchor markers, strip HTML comments, strip code fence markers (retaining the code body), normalize markdown tables, normalize markdown lists and normalize headings. Two composite functions apply the pipeline: `normalizeContentForEmbedding()` strips more aggressively (removes code blocks entirely) while `normalizeContentForBM25()` preserves more structure for lexical matching. Both are idempotent and never return empty string from non-empty input.

The normalizer has no feature flag because it is a non-destructive improvement. It is always active in the `memory-save.ts` embedding path and the `bm25-index.ts` tokenization path.

### Anchor-aware chunk thinning (R7)

When large files are split into chunks during indexing, not all chunks carry equal value. Anchor-aware chunk thinning scores each chunk using a composite of anchor presence (weight 0.6, binary 0 or 1) and content density (weight 0.4, 0-1 scale). Content density strips HTML comments, collapses whitespace, penalizes short chunks under 100 characters and adds a structure bonus (up to +0.2) for headings, code blocks and list items.

Chunks scoring below the 0.3 threshold are dropped from the index, reducing storage and search noise. The thinning guarantee: the function never returns an empty array regardless of scoring. Always active in the chunking path with no separate feature flag.

### Encoding-intent capture at index time (R16)

An `encoding_intent` field classifies content type at index time as `document`, `code` or `structured_data` using heuristic scoring. The code path scores fenced code blocks, import/export/function keyword density and programming punctuation density. The structured data path scores YAML frontmatter, pipe tables and key-value patterns. The classification threshold is 0.4; anything below defaults to `document`.

The classification is stored as read-only metadata on the `encoding_intent` column for both parent records and individual chunks. It has no retrieval-time scoring impact. The intent is to build a labeled dataset that future work can use for type-aware retrieval. Runs behind the `SPECKIT_ENCODING_INTENT` flag (default ON).

### Auto entity extraction (R10)

Memory content contains implicit entities — technology names, architectural concepts, project identifiers — that are valuable for cross-document linking but were never explicitly captured. Manual entity tagging does not scale, and the system had zero entities in its catalog.

Auto entity extraction runs at save time using five pure-TypeScript regex rules with no external NLP dependencies. Rule 1 captures capitalized multi-word sequences (proper nouns like "Claude Code" or "Spec Kit Memory"). Rule 2 extracts technology names from code fence language annotations. Rule 3 identifies nouns following key phrases ("using", "with", "via", "implements"). Rule 4 pulls content from markdown headings. Rule 5 captures quoted strings.

Extracted entities pass through a denylist filter (`entity-denylist.ts`) containing 64 combined stop words across three categories: common nouns (29 words like "thing", "time", "example"), technology stop words (20 words like "api", "json", "npm") and generic modifiers (15 words like "new", "old", "simple"). Single-character entities and entities shorter than 2 characters are also filtered.

Deduplicated entities are stored in the `memory_entities` table with a UNIQUE constraint on `(memory_id, entity_text)`. The `entity_catalog` table maintains canonical names with Unicode-aware alias normalization (`/[^\p{L}\p{N}\s]/gu` — preserving letters and numbers from all scripts) and a `memory_count` field tracking how many memories reference each entity. An `edge_density` check (`totalEdges / totalMemories`) provides a diagnostic metric.

**Sprint 8 update:** Entity normalization was consolidated. Two divergent `normalizeEntityName` functions (ASCII-only in `entity-extractor.ts` vs Unicode-aware in `entity-linker.ts`) were unified into a single Unicode-aware version in `entity-linker.ts`. The `entity-extractor.ts` module now imports and re-exports this function. Similarly, a duplicate `computeEdgeDensity` function was consolidated into `entity-linker.ts`.

Entities are deliberately stored in a separate table rather than as causal edges. Mixing them into `causal_edges` would hit the `MAX_EDGES_PER_NODE=20` limit, distort N2 graph algorithms and pollute N3-lite consolidation. Runs behind the `SPECKIT_AUTO_ENTITIES` flag (default ON).

---

## Pipeline architecture

### 4-stage pipeline refactor (R6)

The retrieval pipeline was restructured into four bounded stages with clear responsibilities, a single authoritative scoring point and a strict score-immutability invariant in the final stage.

Stage 1 (Candidate Generation) executes search channels based on query type: multi-concept, deep mode with query expansion, embedding expansion with R15 mutual exclusion, or standard hybrid search. The R8 memory summary channel runs in parallel when the scale gate is met (>5K memories), merging and deduplicating results by memory ID. Summary candidates now pass through the same `minQualityScore` filter as other candidates (Sprint 8 fix). Constitutional memory injection and quality/tier filtering run at the end of Stage 1.

**Phase 017 update:** The query embedding is now cached at function scope for reuse in the constitutional injection path, saving one API call per search. The constitutional injection count is tracked and passed through the orchestrator to Stage 4 output metadata (previously hardcoded to 0).

Stage 2 (Fusion and Signal Integration) applies all scoring signals in a fixed order: session boost, causal boost, community co-retrieval (N2c — inject co-members into result set), graph signals (N2a+N2b — additive momentum and depth bonuses), FSRS testing effect, intent weights (non-hybrid only, G2 prevention), artifact routing, feedback signals (learned trigger boosts and negative feedback demotions), artifact result limiting, anchor metadata annotation (S2) and validation metadata enrichment with a bounded multiplier clamped to 0.8-1.2 (S3). Community injection (N2c) runs before graph signals (N2a+N2b) so that injected rows also receive momentum and depth adjustments. The G2 prevention is structural: an `isHybrid` boolean gates the intent weight step so the code path is absent for hybrid search.

**Phase 017 update:** Stage 2 now uses the shared `resolveEffectiveScore()` function from `pipeline/types.ts` (aliased as `resolveBaseScore`) for consistent score resolution. The five-factor composite weights auto-normalize to sum 1.0 after partial overrides. Cross-variant RRF fusion no longer double-counts convergence bonuses (per-variant bonus subtracted before cross-variant bonus). Adaptive fusion core weights (semantic + keyword + recency) normalize after doc-type adjustments.

Stage 3 (Rerank and Aggregate) handles optional cross-encoder reranking (gated by `SPECKIT_CROSS_ENCODER`) and MPAB chunk collapse with parent reassembly preserving document order.

Stage 4 (Filter and Annotate) enforces the "no score changes" invariant via dual enforcement: compile-time `Stage4ReadonlyRow` readonly fields plus runtime `verifyScoreInvariant()` assertion checking all six score fields. Within this invariant, it applies memory state filtering, TRM evidence gap detection and annotation metadata.

**Phase 017 update:** The legacy `postSearchPipeline` path (~550 lines) was removed entirely. `isPipelineV2Enabled()` now always returns `true` regardless of the `SPECKIT_PIPELINE_V2` env var (deprecated). The V2 4-stage pipeline is the only code path. A shared `resolveEffectiveScore()` function in `pipeline/types.ts` replaced both Stage 2's `resolveBaseScore()` and Stage 3's local `effectiveScore()`, ensuring a consistent fallback chain (`intentAdjustedScore -> rrfScore -> score -> similarity/100`, all clamped [0,1]) across all stages.

### MPAB chunk-to-memory aggregation (R1)

When a memory file splits into chunks, each chunk gets its own score. Multi-Parent Aggregated Bonus combines those chunk scores into a single memory-level score using the formula `sMax + 0.3 * sum(remaining) / sqrt(N)`. The top chunk score becomes the base, and the remaining chunks contribute a damped bonus.

Guards handle the edge cases: N=0 returns 0, N=1 returns the raw score and N>1 applies MPAB. The bonus coefficient (0.3) is exported as `MPAB_BONUS_COEFFICIENT` for tuning. The aggregation runs in Stage 3 of the 4-stage pipeline after RRF fusion and before state filtering. Runs behind the `SPECKIT_DOCSCORE_AGGREGATION` flag (default ON).

### Chunk ordering preservation (B2)

When multi-chunk results collapse back into a single memory during MPAB aggregation, chunks are now sorted by their original `chunk_index` so the consuming agent reads content in document order rather than score order. Full parent content is loaded from the database when possible. On DB failure, the best-scoring chunk is emitted as a fallback with `contentSource: 'file_read_fallback'` metadata.

### Template anchor optimization (S2)

Anchor markers in memory files (structured sections like `<!-- ANCHOR:state -->`) are parsed and attached as metadata to search pipeline rows. The module extracts anchor IDs and derives semantic types from structured IDs (for example, `DECISION-pipeline-003` yields type `DECISION`). Simple IDs like `summary` pass through as-is.

This is a pure annotation step wired into Stage 2 as step 8. It never modifies any score fields. The enrichment makes Stage 3 (rerank) and Stage 4 (filter) anchor-aware without score side-effects. No feature flag; always active.

### Validation signals as retrieval metadata (S3)

Spec document validation metadata integrates into the scoring layer as an additional ranking dimension in Stage 2. Four signal sources contribute: importance tier mapped to a numeric quality score (constitutional=1.0 through deprecated=0.1), the direct `quality_score` database column, `<!-- SPECKIT_LEVEL: N -->` content marker extraction and validation completion markers (`<!-- VALIDATED -->`, `<!-- VALIDATION: PASS -->`).

The combined multiplier is bounded to 0.8-1.2 via a clamping function, composed of quality factor (0.9-1.1), spec level bonus (0-0.06), completion bonus (0-0.04) and checklist bonus (0-0.01). Well-maintained documentation ranks slightly above neglected documentation when both are relevant. No feature flag; always active.

### Learned relevance feedback (R11)

The system learns from user result selections. When a user marks a search result as useful via `memory_validate` with a `queryId`, query terms are extracted and stored in a separate `learned_triggers` column. This column is explicitly isolated from the FTS5 index to prevent contamination, which would be irreversible without a full re-index.

Ten safeguards protect against noise: a 100+ stop-word denylist, rate cap of 3 terms per selection and 8 per memory, 30-day TTL decay, FTS5 isolation verified by 5 critical tests, noise floor (top-3 exclusion), 1-week shadow period (log-but-don't-apply), rollback mechanism, provenance audit log, 72-hour minimum memory age and sprint gate review.

**Sprint 8 update:** The R11 shadow-period safeguard remains active in runtime. `isInShadowPeriod()` and its guards in `recordSelection()` / `queryLearnedTriggers()` were retained as Safeguard #6 (1-week shadow mode: log-but-don't-apply). Sprint 8 dead-code cleanup removed other retired flag helpers (`isShadowScoringEnabled`, `isRsfEnabled`), but not the R11 shadow-period guard.

Learned triggers boost future searches via a 0.7x weight applied during the feedback signals step in Stage 2. The boost applies alongside the query, not replacing it. Runs behind the `SPECKIT_LEARN_FROM_SELECTION` flag (default ON; set to `false` to disable).

---

## Retrieval enhancements

### Dual-scope memory auto-surface (TM-05)

Memory auto-surface hooks fire at two lifecycle points beyond explicit search: tool dispatch for non-memory-aware tools (using extracted context hints), and session compaction (when context is compressed, critical memories are re-injected).

Each hook point has a per-point token budget of 4,000 tokens maximum. The tool dispatch hook checks incoming tool arguments for context hints (input, query, prompt, specFolder, filePath or concepts) and surfaces constitutional-tier and trigger-matched memories, but skips memory-aware tools to avoid recursive surfacing loops. Memory-aware tools are handled in-band by the context-server pre-dispatch branch (`autoSurfaceMemories` / `autoSurfaceAtCompaction`). Constitutional memories are cached for 1 minute via an in-memory cache.

### Constitutional memory as expert knowledge injection (PI-A4)

Constitutional-tier memories receive a `retrieval_directive` metadata field formatted as explicit instruction prefixes for LLM consumption. Examples: "Always surface when: user asks about memory save rules" or "Prioritize when: debugging search quality."

Rule patterns are extracted from content using a ranked list of imperative verbs (must, always, never, should, require) and condition-introducing words (when, if, for, during). Scanning is capped at 2,000 characters from the start of content, and each directive component is capped at 120 characters. The `enrichWithRetrievalDirectives()` function maps over results without filtering or reordering. The enrichment is wired into `hooks/memory-surface.ts` before returning results.

### Spec folder hierarchy as retrieval structure (S4)

Spec folder paths from memory metadata are parsed into an in-memory hierarchy tree. The `buildHierarchyTree()` function performs two-pass construction: the first pass creates nodes from all distinct `spec_folder` values including implicit intermediate parents, the second pass links children to parents via path splitting.

The `queryHierarchyMemories()` function returns parent, sibling and ancestor memories with relevance scoring: self receives 1.0, parent 0.8, grandparent 0.6, sibling 0.5, with a floor of 0.3. The graph search function traverses this tree so that related folders surface as contextual results alongside direct matches, making spec folder organization a direct retrieval signal rather than metadata that only serves filtering. Always active with no feature flag.

**Sprint 8 update:** A WeakMap TTL cache (60s, keyed by database instance) was added to `buildHierarchyTree()` to avoid full-scan reconstruction on every search request. An `invalidateHierarchyCache()` export allows explicit cache clearing when hierarchy data changes.

### Lightweight consolidation (N3-lite)

Four sub-components handle ongoing memory graph maintenance as a weekly batch cycle. Contradiction scanning finds memory pairs above 0.85 cosine similarity with keyword negation conflicts using a dual strategy: vector-based (cosine on sqlite-vec embeddings) plus heuristic fallback (word overlap). Both use a `hasNegationConflict()` keyword asymmetry check against approximately 20 negation terms (not, never, deprecated, replaced, and others). The system surfaces full contradiction clusters rather than isolated pairs via 1-hop causal edge neighbor expansion.

Hebbian edge strengthening reinforces recently accessed edges at +0.05 per cycle with a 30-day decay of 0.1, respecting the auto-edge strength cap. Staleness detection flags edges unfetched for 90 or more days without deleting them. Edge bounds enforcement reports current edge counts versus the 20-edge-per-node maximum.

All weight modifications are logged to the `weight_history` table. The cycle fires after every successful `memory_save` when enabled. Runs behind the `SPECKIT_CONSOLIDATION` flag (default ON).

### Memory summary search channel (R8)

Large memory files bury their key information in paragraphs of context. A 2,000-word implementation summary might contain three sentences that actually answer a retrieval query. Searching against the full content dilutes embedding similarity with irrelevant noise.

R8 generates extractive summaries at save time using a pure-TypeScript TF-IDF implementation with zero dependencies. The `computeTfIdf()` function scores each sentence by term frequency times inverse document frequency across all sentences in the document, normalized to [0,1]. The `extractKeySentences()` function selects the top-3 scoring sentences and returns them in original document order rather than score order, preserving narrative coherence.

Generated summaries are stored in the `memory_summaries` table alongside a summary-specific embedding vector computed by the same embedding function used for full content. The `querySummaryEmbeddings()` function performs cosine similarity search against these summary embeddings, returning results as `PipelineRow` objects compatible with the main pipeline.

**Sprint 8 update:** A `LIMIT` clause was added to the unbounded summary query in `memory-summaries.ts` (capped at `Math.max(limit * 10, 1000)`) to prevent full-table scans on large corpora. Summary candidates in Stage 1 now also pass through the same `minQualityScore` filter applied to other candidates.

The summary channel runs as a parallel search channel in Stage 1 of the 4-stage pipeline, alongside hybrid, vector and multi-concept channels. It follows the R12 embedding expansion pattern: execute in parallel, merge results and deduplicate by memory ID with baseline results taking priority. This is deliberately a parallel channel rather than a pre-filter to avoid recall loss.

A runtime scale gate activates the channel only when the system exceeds 5,000 indexed memories with successful embeddings. Below that threshold, the summary channel adds overhead without measurable benefit because the base channels already cover the corpus effectively. The code exists regardless of scale; the gate simply skips execution. Runs behind the `SPECKIT_MEMORY_SUMMARIES` flag (default ON).

### Cross-document entity linking (S5)

Memories in different spec folders often discuss the same concepts without any explicit connection between them. A decision record in one folder mentions "embedding cache" and an implementation summary in another folder implements it, but the retrieval system has no way to connect them unless a causal edge exists.

Cross-document entity linking bridges this gap using the entity catalog populated by R10. The `buildEntityCatalog()` function groups entities from the `memory_entities` table by canonical name. The `findCrossDocumentMatches()` function identifies entities appearing in two or more distinct spec folders, which represent genuine cross-document relationships.

For each cross-document match, `createEntityLinks()` inserts causal edges with `relation='supports'`, `strength=0.7` and `created_by='entity_linker'`. The `supports` relation was chosen over adding a new relation type to avoid ALTER TABLE complexity on the SQLite `causal_edges` CHECK constraint. Entity-derived links are genuinely supportive relationships: if two documents reference the same entity, they support each other's context.

An infrastructure gate checks that the `entity_catalog` has entries before running. Without R10 providing extracted entities, S5 has nothing to operate on. The `runEntityLinking()` orchestrator chains catalog build, match finding and edge creation with statistics reporting.

**Sprint 8 update:** Two performance improvements were applied to `entity-linker.ts`: (1) a parallel `Set` was added for `catalogSets` providing O(1) `.has()` lookups instead of O(n) `.includes()` in inner loops, and (2) a `batchGetEdgeCounts()` function replaced N+1 individual `getEdgeCount` queries with a single batch query.

A density guard prevents runaway edge creation: current global edge density is computed as `total_edges / total_memories` and checked before link generation begins. The linker also checks projected post-insert global density before creating links. If either check exceeds the configured threshold, new entity links are skipped to avoid overwhelming the graph. The threshold is controlled by `SPECKIT_ENTITY_LINKING_MAX_DENSITY` (default `1.0`), and invalid or negative values fall back to `1.0`. Runs behind the `SPECKIT_ENTITY_LINKING` flag (default ON). Depends on a populated `entity_catalog` (typically produced by R10 auto-entities).

---

## Tooling and scripts

### Tree thinning for spec folder consolidation (PI-B1)

A bottom-up merge strategy thins small files during spec folder context loading. Files under 200 tokens have their summary merged into the parent document. Files under 500 tokens use their content directly as the summary, skipping separate summary generation.

Memory file thresholds differ: under 100 tokens for content-as-summary, 100-300 tokens for merged-into-parent, 300+ tokens kept as-is. The `applyTreeThinning()` function runs in `workflow.ts` at Step 7.6 before pipeline stages and is applied to the rendered context payload. Stats track total files, thinned count, merged count and tokens saved.

### Progressive validation for spec documents (PI-B2)

The `progressive-validate.sh` script (748 LOC) wraps `validate.sh` with four progressive levels. Level 1 (Detect) identifies all violations. Level 2 (Auto-fix) applies safe mechanical corrections like missing dates, heading levels and whitespace with before/after diff logging. Level 3 (Suggest) presents non-automatable issues with guided remediation options. Level 4 (Report) produces structured output in JSON or human-readable format.

Flags include `--level N`, `--dry-run`, `--json`, `--strict`, `--quiet` and `--verbose`. Exit codes maintain compatibility with `validate.sh`: 0 for pass, 1 for warnings, 2 for errors. The dry-run mode previews all changes before applying them.

---

## Governance

### Feature flag governance

The program introduces many new scoring signals and pipeline stages. Without governance, flags accumulate until nobody knows what is enabled.

A governance framework caps active flags at six, enforces a 90-day lifespan per flag and requires a monthly sunset audit. Each sprint exit includes a formal review: flags with positive metrics are permanently enabled, flags with negative metrics are removed and inconclusive flags receive a 14-day extension with a hard deadline.

The B8 signal ceiling limits active scoring signals to 12 until automated evaluation (R13) is mature enough to validate new signals reliably.

### Feature flag sunset audit

A comprehensive audit at Sprint 7 exit found 61 unique `SPECKIT_` flags across the codebase. Disposition: 27 flags are ready to graduate to permanent-ON defaults (removing the flag check), 9 flags are identified as dead code for removal and 3 flags remain as active operational knobs (`ADAPTIVE_FUSION`, `COACTIVATION_STRENGTH`, `PRESSURE_POLICY`).

The current active flag inventory stands at 20 flags in `search-flags.ts`. Sprint 0 core flags remain default ON, sprint-graduated flags from Sprints 3-6 remain default ON, and deferred-feature flags (including GRAPH_SIGNALS, COMMUNITY_DETECTION, MEMORY_SUMMARIES, AUTO_ENTITIES and ENTITY_LINKING) are now default ON. One flag (`SPECKIT_SHADOW_SCORING`) is hardcoded OFF and scheduled for removal, while `SPECKIT_ABLATION` remains default OFF as an opt-in evaluation tool.

**Phase 017 update:** `SPECKIT_PIPELINE_V2` is now deprecated. `isPipelineV2Enabled()` always returns `true` regardless of the env var. The legacy V1 pipeline code was removed, making the env var a no-op.

**Sprint 8 update:** Flag graduation and dead code removal have been completed. The Sprint 8 comprehensive remediation removed ~360 lines of dead code including: dead feature flag branches in `hybrid-search.ts` (RSF and shadow-scoring), dead feature flag functions (`isShadowScoringEnabled`, `isRsfEnabled`), dead module-level state (`stmtCache`, `lastComputedAt`, `activeProvider`, `flushCount`, 3 dead config fields in `working-memory.ts`), and dead functions/exports (`computeCausalDepth` single-node variant, `getSubgraphWeights`, `RECOVERY_HALF_LIFE_DAYS`, `logCoActivationEvent`). `isInShadowPeriod` in learned feedback remains active as Safeguard #6. See [Comprehensive remediation (Sprint 8)](#comprehensive-remediation-sprint-8) for the full accounting.

---

## Comprehensive remediation (Sprint 8)

A full-scope review of the MCP server codebase identified 45+ issues across 50+ files spanning critical bugs, correctness gaps, dead code bloat and performance concerns. The remediation was executed via 3-wave parallel agent delegation (up to 14 agents) with full verification: TypeScript compilation clean, 226 test files, 7003/7003 tests passing, zero dead code remnants. (Test count later grew to 7,085 through phases 015-017.)

### Database and schema safety

Four database-layer bugs were fixed:

**B1 — Reconsolidation column reference:** `reconsolidation.ts` referenced a non-existent `frequency_counter` column that would crash at runtime during merge operations. Replaced with `importance_weight` using `Math.min(1.0, currentWeight + 0.1)` merge logic.

**B2 — DDL inside transaction:** `checkpoints.ts` placed DDL statements (`CREATE TABLE IF NOT EXISTS`, `ALTER TABLE ADD COLUMN`) inside a `database.transaction()` block. SQLite silently auto-commits on DDL, which corrupted the transaction boundary during checkpoint restore. DDL now runs before `BEGIN`; only DML is wrapped in the transaction.

**B3 — SQL operator precedence:** `causal-edges.ts` had `WHERE a AND b OR c` without parentheses, matching wrong rows on edge deletion. Fixed to `WHERE a AND (b OR c)`.

**B4 — Missing changes guard:** `memory-save.ts` UPDATE statements reported success even when zero rows were updated. Added `.changes > 0` guards so callers can distinguish actual updates from no-ops.

### Scoring and ranking corrections

Four scoring-layer bugs were fixed:

**C1 — Composite score overflow:** `composite-scoring.ts` used `Math.max(0, composite)` which allowed scores above 1.0. Changed to `Math.max(0, Math.min(1, composite))` clamping to [0,1] at three call sites.

**C2 — Citation fallback chain:** `composite-scoring.ts` fell back through `last_accessed` then `updated_at` when no citation data existed, conflating recency with citation authority. The fallback chain was removed; the function returns 0 when no citation data exists.

**C3 — Causal-boost cycle amplification:** `causal-boost.ts` used `UNION ALL` in a recursive CTE, allowing cycles to amplify scores exponentially as the same node was visited multiple times. Changed to `UNION` which deduplicates visited nodes and prevents cycles.

**C4 — Ablation binomial overflow:** `ablation-framework.ts` computed binomial coefficients using naive multiplication that overflowed for n>50 in the sign test. Replaced with `logBinomial(n, k)` using log-space summation.

### Search pipeline safety

Three search pipeline issues were fixed:

**D1 — Summary quality bypass:** `stage1-candidate-gen.ts` allowed R8 summary hits to bypass the `minQualityScore` filter, letting low-quality summaries enter final results. Summary candidates now pass through the same quality filter.

**D2 — FTS5 double-tokenization:** `sqlite-fts.ts` and `bm25-index.ts` had separate tokenization logic, causing query terms to be tokenized differently than indexed content. Refactored to a shared `sanitizeQueryTokens()` function returning a raw token array that both callers join with their appropriate syntax.

**D3 — Quality floor vs RRF range mismatch:** `channel-representation.ts` used `QUALITY_FLOOR=0.2` which filtered out virtually all RRF-sourced results (RRF scores are typically 0.01-0.03). Lowered to 0.005.

### Guards and edge cases

Two guard/edge-case issues were fixed:

**E1 — Temporal contiguity double-counting:** `temporal-contiguity.ts` had an O(N^2) nested loop that processed both (A,B) and (B,A) pairs, double-counting boosts. Fixed inner loop to `j = i + 1`.

**E2 — Wrong-memory fallback:** `extraction-adapter.ts` fell back to resolving the most-recent memory ID on entity resolution failure, silently linking to the wrong memory. The fallback was removed; the function returns `null` on resolution failure.

### Entity normalization consolidation

Two cross-cutting normalization issues were resolved:

**A1 — Divergent normalizeEntityName:** `entity-extractor.ts` used ASCII-only normalization (`/[^\w\s-]/g`) while `entity-linker.ts` used Unicode-aware normalization (`/[^\p{L}\p{N}\s]/gu`). Consolidated to a single Unicode-aware version in `entity-linker.ts`, imported by `entity-extractor.ts`.

**A2 — Duplicate computeEdgeDensity:** Both `entity-extractor.ts` and `entity-linker.ts` had independent implementations. Consolidated to `entity-linker.ts` with import and re-export from `entity-extractor.ts`.

### Dead code removal

Approximately 360 lines of dead code were removed across four categories:

**Hot-path dead branches (~80 lines):** Dead RSF branch and dead shadow-scoring branch removed from `hybrid-search.ts`. Both were guarded by feature flag functions that always returned `false`.

**Dead feature flag functions:** `isShadowScoringEnabled()` removed from `shadow-scoring.ts` and `search-flags.ts`. `isRsfEnabled()` removed from `rsf-fusion.ts`. `isInShadowPeriod()` in `learned-feedback.ts` remains active as the R11 shadow-period safeguard and was not removed.

**Dead module-level state:** `stmtCache` Map (archival-manager.ts — never populated), `lastComputedAt` (community-detection.ts — set but never read), `activeProvider` cache (cross-encoder.ts — never populated), `flushCount` (access-tracker.ts — never incremented), 3 dead config fields in working-memory.ts (`decayInterval`, `attentionDecayRate`, `minAttentionScore`).

**Dead functions and exports:** `computeCausalDepth` single-node variant (graph-signals.ts — batch version is the only caller), `getSubgraphWeights` (graph-search-fn.ts — always returned 1.0, replaced with inline constant), `RECOVERY_HALF_LIFE_DAYS` (negative-feedback.ts — never imported), `'related'` weight entry (causal-edges.ts — invalid relation type), `logCoActivationEvent` and `CoActivationEvent` (co-activation.ts — never called).

**Preserved (NOT dead):** `computeStructuralFreshness` and `computeGraphCentrality` in `fsrs.ts` were identified as planned architectural components (not concluded experiments) and retained.

### Performance improvements

Thirteen performance improvements were applied:

**Quick wins:** `Math.max(...spread)` replaced with `reduce`-based max in `tfidf-summarizer.ts` (prevents RangeError on large arrays). Unbounded query in `memory-summaries.ts` gained a `LIMIT` clause. O(n) full scan in `mutation-ledger.ts` replaced with SQL `COUNT(*)` query using `json_extract`.

**Entity linker:** `mergedEntities` array lookups converted to `Set` for O(1) `.has()` checks. N+1 `getEdgeCount` queries replaced with a single batch query that combines `source_id IN (...)` and `target_id IN (...)` branches via `UNION ALL` before aggregation.

**SQL-level:** Causal edge upsert reduced from 3 DB round-trips to 2 by eliminating the post-upsert SELECT via `lastInsertRowid`. Spec folder hierarchy tree cached with a 60-second WeakMap TTL keyed by database instance.

### Test quality improvements

Four test quality issues were addressed:

**P2a:** `memory-save-extended.vitest.ts` timeout increased from 5000ms to 15000ms (eliminated flaky timeout failures).

**P2b:** `entity-linker.vitest.ts` gained `db.close()` in `afterEach` (prevented file handle leaks).

**P2c:** Four tautological flag tests in `integration-search-pipeline.vitest.ts` were rewritten to test actual behavioral differences instead of testing what they set up.

**P2d:** A duplicate T007 test block was identified as pre-resolved (not present in current file).

**Additional fixes:** `memory-parser.ts` gained a `/z_archive/` exclusion in `isMemoryFile()` spec doc detection. 18+ test files were updated to match changed source behavior (reconsolidation, five-factor-scoring, working-memory, session-cleanup, channel tests, entity tests, extraction-adapter, intent-routing and others). Test count adjusted from 7,027 to 7,003 (24 tests for removed dead-code features were deleted).

---

## Gemini review P1 fixes (Phase 015)

Two P1 issues from a Gemini code review (scores 88/100 and 85/100, both Conditional Pass) were resolved. Spec folder: `015-gemini-review-p1-fixes`. Test count after: 7,081/7,081.

### Quality gate timer persistence

The `qualityGateActivatedAt` timestamp in `save-quality-gate.ts` was stored purely in-memory. Every server restart reset the 14-day warn-only countdown, preventing the quality gate from graduating to enforcement mode. The fix adds SQLite persistence to the `config` table using the existing key-value store pattern. `isWarnOnlyMode()` lazy-loads from DB when the in-memory value is null. `setActivationTimestamp()` writes to both memory and DB. All DB operations are non-fatal with graceful fallback.

### Stage 3 effectiveScore fallback chain

`effectiveScore()` in `stage3-rerank.ts` only checked `score` then `similarity/100`, skipping `intentAdjustedScore` and `rrfScore` from Stage 2 enrichment. The fix updated the fallback chain to: `intentAdjustedScore -> rrfScore -> score -> similarity/100`, all clamped [0,1] with `isFinite()` guards. Cross-encoder document mapping and MMR candidate scoring now use `effectiveScore()` instead of inline fallbacks. A `stage2Score` field was added to `PipelineRow` in `types.ts` for auditability when Stage 3 overwrites scores.

---

## Alignment remediation (Phase 016)

Nine remediation targets across four tranches. Spec folder: `016-alignment-remediation`. Test count after: 7,081/7,081 (176 targeted tests passing across 3 files).

### Canonical ID dedup hardening

Mixed ID formats (`42`, `"42"`, `mem:42`) caused deduplication failures in hybrid search. Normalization was applied in `combinedLexicalSearch()` for the new pipeline and in legacy `hybridSearch()` for the dedup map. Regression tests `T031-LEX-05` and `T031-BASIC-04` verify the fix.

### Activation window persistence

The `ensureActivationTimestampInitialized` path was added to `save-quality-gate.ts` to preserve the warn-only window activation timestamp across process restarts. Without this, the 14-day warm-up period restarted on every server reload. Regression test `WO7` verifies persistence.

### Tier-2 fallback channel forcing

A `forceAllChannels` option was added to hybrid search. When the tier-2 quality fallback activates, it now sets `forceAllChannels: true` to ensure all retrieval channels execute, bypassing the simple-route channel reduction that could skip BM25 or graph channels. Regression test `C138-P0-FB-T2` verifies the behavior.

---

## Opus review remediation (Phase 017)

A 10-agent comprehensive Opus review identified 38 issues (4 P0 critical, 34 P1 important). 35 fixes were implemented across 5 sprints, 2 were deferred. Spec folder: `017-refinement-phase-6` (Level 3). Test count after: 7,085/7,085.

### Legacy V1 pipeline removal

The legacy V1 pipeline (~550 lines) was the root cause of 3 of 4 P0 bugs: an inverted `STATE_PRIORITY` map, divergent scoring order in `postSearchPipeline()`, and a mismatched `MAX_DEEP_QUERY_VARIANTS=6`. Since V2 was already the default, removing the dead code resolved all three at once. Deleted functions: `STATE_PRIORITY`, `MAX_DEEP_QUERY_VARIANTS`, `buildDeepQueryVariants()`, `strengthenOnAccess()`, `applyTestingEffect()`, `filterByMemoryState()`, `applyCrossEncoderReranking()`, `applyIntentWeightsToResults()`, `shouldApplyPostSearchIntentWeighting()`, `postSearchPipeline()`. The `isPipelineV2Enabled()` function now always returns `true` with a deprecation comment. Unused imports (`fsrsScheduler`, `tierClassifier`, `crossEncoder`) were removed.

Orphaned chunk detection was added to `verify_integrity()` as the fourth P0 fix: chunks whose parent has been deleted but the chunk record persists (e.g., if FK cascade didn't fire) are now detected and optionally auto-cleaned when `autoClean=true`.

### Scoring and fusion corrections

Eight scoring issues were fixed:

- **Intent weight recency (#5):** `applyIntentWeights` now includes timestamp-based recency scoring. Uses loop-based min/max to find timestamp range (no spread operator stack overflow).
- **Five-factor weight normalization (#6):** Composite scoring weights auto-normalize to sum 1.0 after partial overrides. Without this, overriding one weight broke weighted-average semantics.
- **Stack overflow prevention (#7):** `normalizeCompositeScores` replaced `Math.max(...scores)` / `Math.min(...scores)` with a for-loop. The spread operator causes stack overflow on arrays >100K elements.
- **BM25 specFolder filter (#8):** The BM25 index stores document IDs as stringified numbers (e.g., "42"). The old filter compared these against spec folder paths, which never matched. Replaced with a DB lookup to resolve `spec_folder` per result.
- **RRF convergence double-count (#9):** Cross-variant fusion accumulated per-variant convergence bonuses during merge, then added cross-variant bonuses on top. Fix subtracts per-variant bonus before applying cross-variant bonus.
- **Adaptive fusion normalization (#10):** Core weights (semantic + keyword + recency) now normalize to sum 1.0 after doc-type adjustments. Only applied when doc-type shifts alter the balance.
- **Shared resolveEffectiveScore (#11):** A single function in `pipeline/types.ts` replaces both Stage 2's `resolveBaseScore()` and Stage 3's local `effectiveScore()`. Uses the canonical fallback chain: `intentAdjustedScore -> rrfScore -> score -> similarity/100`, all clamped [0,1].
- **Configurable interference threshold (#12):** `computeInterferenceScoresBatch()` now accepts an optional `threshold` parameter (defaults to `INTERFERENCE_SIMILARITY_THRESHOLD`).

### Pipeline and mutation hardening

Ten fixes addressed schema completeness, pipeline metadata, embedding efficiency, stemmer quality, and data cleanup:

- **Schema params exposed (#13):** `memorySearch` tool schema now includes `trackAccess`, `includeArchived`, and `mode` parameters.
- **Dead dedup config removed (#14):** `sessionDeduped` removed from Stage 4 metadata (dedup is post-cache in the main handler).
- **Constitutional count passthrough (#15):** Stage 1's constitutional injection count flows through the orchestrator to Stage 4 output metadata.
- **Embedding caching (#16):** Stage 1 caches the query embedding at function scope for reuse in the constitutional injection path, saving one API call per search.
- **Stemmer double-consonant (#18):** `simpleStem()` now handles doubled consonants after suffix removal: "running"->"runn"->"run", "stopped"->"stopp"->"stop".
- **Full-content embedding on update (#19):** `memory_update` now embeds `title + "\n\n" + content_text` instead of title alone.
- **Ancillary record cleanup on delete (#20):** Memory deletion now cleans `degree_snapshots`, `community_assignments`, `memory_summaries`, `memory_entities`, and `causal_edges`.
- **BM25 index cleanup on delete (#21):** `bm25Index.getIndex().removeDocument(String(id))` called after successful delete when BM25 is enabled.
- **Atomic save error tracking (#22):** `atomicSaveMemory` now tracks rename-failure state with a `dbCommitted` flag for better error reporting.
- **Dynamic preflight error code (#23):** Preflight validation uses the actual error code from `preflightResult.errors[0].code` instead of hardcoding `ANCHOR_FORMAT_INVALID`.

### Graph and cognitive memory fixes

Seven fixes (of 9 planned; 2 deferred) addressed graph integrity and cognitive scoring:

- **Self-loop prevention (#24):** `insertEdge()` rejects `sourceId === targetId`.
- **maxDepth clamping (#25):** `handleMemoryDriftWhy` clamps `maxDepth` to [1, 10] server-side.
- **Community debounce (#27):** Replaced edge-count-only debounce with `count:maxId` hash. Edge count alone can't detect deletions followed by insertions that maintain the same count.
- **Orphaned edge cleanup (#28):** New `cleanupOrphanedEdges()` function exported from `causal-edges.ts`.
- **WM score clamping (#29):** Working memory scores clamped to `[DECAY_FLOOR, 1.0]` to prevent mention boost from exceeding normalized range.
- **Double-decay removal (#30):** Trigger handler no longer applies `* turnDecayFactor` to `wmEntry.attentionScore` (WM already applies its own decay).
- **Co-activation cache (#32):** `clearRelatedCache()` called from `memory-bulk-delete.ts` after bulk operations.

**Deferred:** #26 (FK existence check on causal edges, test fixtures use synthetic IDs not in memory_index) and #31 (session entry limit off-by-one, code already correct).

### Evaluation and housekeeping fixes

Six fixes addressed evaluation framework reliability and protocol-boundary safety:

- **Ablation recallK (#33):** Ablation search limit uses `recallK` parameter instead of hardcoded 20.
- **evalRunId persistence (#34):** `_evalRunCounter` lazy-initializes from `MAX(eval_run_id)` in the eval DB on first call, surviving server restarts.
- **Postflight re-correction (#35):** `task_postflight` SELECT now matches `phase IN ('preflight', 'complete')` so re-posting updates the existing record instead of failing.
- **parseArgs guard (#36):** `parseArgs<T>()` returns `{} as T` for null/undefined/non-object input at the protocol boundary.
- **128-bit dedup hash (#37):** Session dedup hash extended from `.slice(0, 16)` (64-bit) to `.slice(0, 32)` (128-bit) to reduce collision probability.
- **Exit handler cleanup (#38):** `_exitFlushHandler` reference stored; `cleanupExitHandlers()` now calls `process.removeListener()` for `beforeExit`, `SIGTERM`, and `SIGINT`.

---

## Multi-agent deep review remediation (Phase 018)

An 8-agent orchestrated review (5 Gemini + 3 Opus) identified 33 findings across 4 severity tiers. Remediation dispatched 17 agents across 4 waves, completing all Tier 1 (7 tasks) and Tier 2 (11 tasks). Tier 4 cross-AI validation (Gemini 3.1 Pro + Codex gpt-5.3-codex) found 14 additional issues, all resolved via a 3-stage review pipeline. Spec folder: `018-refinement-phase-7` (Level 3). Test count after: 7,085/7,085 (230 files).

### Math.max/min stack overflow elimination

`Math.max(...array)` and `Math.min(...array)` push all elements onto the call stack, causing `RangeError` on arrays exceeding ~100K elements. Seven production files were converted from spread patterns to `reduce()`:

- `rsf-fusion.ts` — 6 instances (4 + 2)
- `causal-boost.ts` — 1 instance
- `evidence-gap-detector.ts` — 1 instance
- `prediction-error-gate.ts` — 2 instances
- `retrieval-telemetry.ts` — 1 instance
- `reporting-dashboard.ts` — 2 instances

Each replacement uses `scores.reduce((a, b) => Math.max(a, b), -Infinity)` with an `AI-WHY` comment explaining the safety rationale.

### Session-manager transaction gap fixes

Two instances of `enforceEntryLimit()` called outside `db.transaction()` blocks in `session-manager.ts` were moved inside. In `runBatch()` (line ~437) and `markMemorySent()` (line ~403), concurrent MCP requests could both pass the limit check then both insert, exceeding the entry limit. Both now run check-and-insert atomically inside the transaction.

### Transaction wrappers on mutation handlers

`memory-crud-update.ts` gained a `database.transaction(() => {...})()` wrapper around its mutation steps (vectorIndex.updateMemory, BM25 re-index, mutation ledger). `memory-crud-delete.ts` gained the same for its single-delete path (memory delete, vector delete, causal edge delete, mutation ledger). Cache invalidation operations remain outside the transaction as in-memory-only operations. Both include null-database fallbacks.

### BM25 trigger phrase re-index gate

The BM25 re-index condition in `memory-crud-update.ts` was expanded from title-only to title OR trigger phrases: `if ((updateParams.title !== undefined || updateParams.triggerPhrases !== undefined) && bm25Index.isBm25Enabled())`. The BM25 corpus includes trigger phrases, so changes to either field must trigger re-indexing.

### DB_PATH extraction and import standardization

`shared/config.ts` gained an exported `getDbDir()` function reading `SPEC_KIT_DB_DIR` and `SPECKIT_DB_DIR` env vars. `shared/paths.ts` exports `DB_PATH` using this config. Scripts that hardcoded database paths (`cleanup-orphaned-vectors.ts`) now import from shared. Fourteen relative cross-boundary imports across scripts were converted to `@spec-kit/` workspace aliases.

### Cross-AI validation fixes (Tier 4)

Independent reviews by Gemini 3.1 Pro and Codex gpt-5.3-codex identified 14 issues missed by the original audit. Key fixes:

- **CR-P0-1:** Test suite false-pass patterns — 21 silent-return guards converted to `it.skipIf()`, fail-fast imports with throw on required handler/vectorIndex missing.
- **CR-P1-1:** Deletion exception propagation — causal edge cleanup errors in single-delete now propagate (previously swallowed).
- **CR-P1-2:** Re-sort after feedback mutations before top-K slice in Stage 2 fusion.
- **CR-P1-3:** Dedup queries gained `AND parent_id IS NULL` to exclude chunk rows.
- **CR-P1-4:** Session dedup `id != null` guards against undefined collapse.
- **CR-P1-5:** Cache lookup moved before embedding readiness gate in search handler.
- **CR-P1-6:** Partial-update DB mutations wrapped inside transaction.
- **CR-P1-8:** Config env var fallback chain (`SPEC_KIT_DB_DIR || SPECKIT_DB_DIR`).
- **CR-P2-3:** Dashboard row limit configurable via `SPECKIT_DASHBOARD_LIMIT` (default 10000) with NaN guard.
- **CR-P2-5:** `Number.isFinite` guards on evidence gap detector scores.

All 14 items verified through 3-stage review: Codex implemented, Gemini reviewed, Claude final-reviewed.

### Code standards alignment

All modified files were reviewed against sk-code--opencode standards. 45 violations found and fixed: 26 AI-intent comment conversions (AI-WHY, AI-TRACE, AI-GUARD prefixes), 10 MODULE/COMPONENT headers added, import ordering corrections, and constant naming (`specFolderLocks` → `SPEC_FOLDER_LOCKS`).

---

## Extra features (Sprint 019)

A 6-agent cross-AI research effort (3 Codex gpt-5.3-codex, 3 Gemini 3.1-pro-preview) analyzed external systems (Cognee, QMD, ArtemXTech) and produced 16 recommendations. After triple-verification against the feature catalog, 4 were fully implemented, 7 partially implemented, and 5 genuinely new. This sprint completes the bounded gaps and builds net-new operational tooling. Spec folder: `019-sprint-9-extra-features` (Level 3+). 12 features total: 3 P0 (foundation), 4 P1 (quality and operations), 5 P2 (deferred innovation). Of these, 9 are now implemented (P0-1, P0-2, P0-3, P1-4, P1-5, P1-6, P1-7 and their associated flags) and 5 are deferred (P2-8 through P2-12).

### Strict Zod schema validation (P0-1)

**IMPLEMENTED (Sprint 019).** All 28 MCP tool inputs across layers L1-L7 are migrated from plain object descriptions to Zod schemas with runtime validation. `mcp_server/tool-schemas.ts` defines tool parameters with full Zod enforcement including `.strict()` mode, rejecting hallucinated parameters at the boundary with clear Zod errors.

Strict validation is controlled by the `SPECKIT_STRICT_SCHEMAS` flag, which defaults to `true`. When disabled, the schemas fall back to `.passthrough()` mode for backward compatibility during a transition period. The feature adds the `zod` dependency to the project. Validation occurs per-tool in the handler layer (not duplicated at server dispatch).

### Provenance-rich response envelopes (P0-2)

**IMPLEMENTED (Sprint 019).** *(Overlap note: extends existing `memory_search` result formatting, where internal PipelineRow scoring exists but was dropped at Stage 4 exit.)* The `FormattedSearchResult` type at `formatters/search-results.ts` now supports a comprehensive `MemoryResultEnvelope` with three new objects, opt-in via `includeTrace: true` (default `false` for backward compatibility).

The `scores` object exposes: `semantic`, `lexical`, `fusion`, `intentAdjusted`, `composite`, `rerank`, `attention`. The `source` object exposes: `file`, `anchorIds`, `anchorTypes`, `lastModified`, `memoryState`. The `trace` object exposes: `channelsUsed`, `pipelineStages`, `fallbackTier`, `queryComplexity`, `expansionTerms`, `budgetTruncated`, `scoreResolution`. When `includeTrace` is `false`, these objects are omitted entirely. Controlled by the `SPECKIT_RESPONSE_TRACE` flag.

### Async ingestion job lifecycle (P0-3)

**IMPLEMENTED (Sprint 019).** *(Overlap note: supersedes the current lightweight `asyncEmbedding` path in memory-save.ts, which uses `setImmediate()` + `retryManager.retryEmbedding()` for single-file async saves.)* Bulk indexing of large spec directories can hit MCP timeout limits. This feature introduces a full job lifecycle with SQLite persistence for crash recovery.

A dedicated background job queue in `lib/ops/job-queue.ts` manages ingestion tasks through a state machine: `queued → parsing → embedding → indexing → complete/failed/cancelled`. Three new MCP tools provide direct control: `memory_ingest_start` (returns nanoid-style job ID in <100ms), `memory_ingest_status` (returns progress, files processed, errors), and `memory_ingest_cancel` (stops in-progress jobs). The queue processes files sequentially through a single worker to avoid SQLite contention. On server restart, incomplete jobs are reset to `queued` and automatically re-enqueued. All runtime DB operations use async `withBusyRetry` with exponential backoff to yield the event loop during SQLITE_BUSY retries.

### Contextual tree injection (P1-4)

**IMPLEMENTED (Sprint 019).** *(Overlap note: builds on PI-B3 spec folder description discovery, which provides cached one-sentence descriptions used for routing in `memory_context`.)* Retrieved memory chunks gain hierarchical context headers so the calling agent immediately understands the structural origin of each result without additional round-trips to `memory_list`.

Headers follow the format `[parent > child — description]`, capped at 100 characters to conserve context windows. The injection uses the existing PI-B3 cached descriptions via `injectContextualTree()` in `hybrid-search.ts`, inserted in Stage 4 output after token-budget truncation, before the final return. When no spec folder association exists, injection is gracefully skipped. This behavior is governed by the `SPECKIT_CONTEXT_HEADERS` flag (default `true`).

### Local GGUF reranker via node-llama-cpp (P1-5)

**IMPLEMENTED (Sprint 019).** *(Overlap note: implements the previously unimplemented `RERANKER_LOCAL` flag while `SPECKIT_CROSS_ENCODER` remains the existing default-on rerank control.)* Stage 3 reranking currently supports Cohere and Voyage remote APIs. This feature adds a Node-native GGUF execution path via `node-llama-cpp` in `lib/search/local-reranker.ts`, integrating into the existing Stage 3 reranking slot. `node-llama-cpp` is declared as an `optionalDependency` to avoid blocking installs on platforms without native build support.

The system uses a quantized `bge-reranker-v2-m3.Q4_K_M.gguf` model (~350MB). Before loading, `canUseLocalReranker()` checks that `RERANKER_LOCAL === 'true'` (strict string equality, not truthy), the model file exists, and sufficient free memory is available. The memory threshold is 4GB by default, reduced to 512MB when a custom model is configured via `SPECKIT_RERANKER_MODEL` (intentional override). If any check fails, the pipeline silently falls back to the existing algorithmic RRF scoring. Candidates are scored sequentially (not via `Promise.all`) to avoid allocating multiple sequence states simultaneously in VRAM. The loaded model is cached at module level with path-keyed singleton tracking to detect stale promises on model path changes, and disposed on server shutdown via async-with-deadline cleanup.

### Dynamic server instructions at MCP initialization (P1-6)

**IMPLEMENTED (Sprint 019).** At startup, `context-server.ts` now injects dynamic information about the memory system's state so calling LLMs start each session with awareness of available knowledge.

The `buildServerInstructions()` function generates a concise overview: total memory count, active spec folder count, available search channels, and stale memory count (with a warning when stale count exceeds 10). The instruction string is injected via `server.setInstructions()` and reuses existing `memory_stats` handler data. The feature is gated by `SPECKIT_DYNAMIC_INIT` (default `true`).

### Real-time filesystem watching with chokidar (P1-7)

**IMPLEMENTED (Sprint 019).** The memory index currently relies on pull-based `memory_index_scan` for synchronization with the filesystem. This feature adds push-based file watching via `chokidar` in `lib/ops/file-watcher.ts` to reduce the delay between a file change and its availability in search results.

The watcher implements a 2-second debounce and uses TM-02 SHA-256 content hashing to deduplicate identical writes. On `add` events, the hash cache is pre-seeded so the first subsequent `change` event can properly deduplicate (without seeding, every first change triggers a redundant reindex). ENOENT errors are handled gracefully when a file is rapidly created then deleted before the debounce timer fires. An exponential backoff retry mechanism (3 attempts with delays of 1s and 2s between retries) handles `SQLITE_BUSY` locks during concurrent write operations. The watcher is registered for cleanup in the server shutdown handler (async-with-deadline) to prevent process leaks. This subsystem is controlled by the `SPECKIT_FILE_WATCHER` flag (default `false`) and watches only configured spec directories (no arbitrary path traversal).

### Warm server / daemon mode (P2-8)

**PLANNED (Sprint 019) — DEFERRED.** An HTTP daemon with warm caches and multi-transport support (stdio, HTTP, SSE) would eliminate cold-start penalties for subsequent agent invocations. The existing `SPECKIT_LAZY_LOADING` and `SPECKIT_EAGER_WARMUP` flags partially mitigate cold-start costs. This feature is deferred until the MCP SDK standardizes HTTP transport protocols to avoid building a custom daemon that risks throwaway work. Estimated effort: L (2-3 weeks).

### Backend storage adapter abstraction (P2-9)

**PLANNED (Sprint 019) — DEFERRED.** Extracting core storage logic into generic `IVectorStore`, `IGraphStore`, and `IDocumentStore` interfaces would allow hot-swapping backend technologies. The embedding provider is already abstracted (auto/openai/hf-local/voyage), demonstrating the pattern. However, the storage layer remains tightly coupled to SQLite with sqlite-vec and FTS5, which handles the current scale well. This is a classic premature abstraction risk. Deferred until the corpus exceeds 100K memories or multi-node deployment demand emerges. Estimated effort: M-L (1-2 weeks).

### Namespace management CRUD tools (P2-10)

**PLANNED (Sprint 019) — DEFERRED.** The `specFolder` filter currently provides logical scoping for memory isolation. For true multi-tenant or multi-project isolation, explicit namespace boundaries via CRUD tools (`list_namespaces`, `create_namespace`, `switch_namespace`, `delete_namespace`) would provide strict contextual segmentation. Deferred pending verifiable demand for multi-tenant deployment architectures. Estimated effort: S-M (3-5 days).

### ANCHOR tags as graph nodes (P2-11)

**PLANNED (Sprint 019) — DEFERRED.** S2 currently parses `<!-- ANCHOR: architecture -->` tags and derives semantic types, but these annotations exist only on pipeline rows and are not promoted to graph nodes. Converting anchors into strongly typed graph nodes with distinct edge rules would create a deterministic knowledge graph from existing markdown conventions without expensive LLM extraction. This was the most creative unique insight from the research corpus (Gemini-2). Deferred pending a 2-day technical spike to validate the approach. Estimated effort: S-M (3-5 days).

### AST-level section retrieval tool (P2-12)

**PLANNED (Sprint 019) — DEFERRED.** Existing R7 anchor-aware chunk thinning provides reasonable granularity for retrieval. For very large spec documents (>1000 lines), a targeted `read_spec_section(filePath, heading)` tool using Markdown AST parsing via `remark` would extract and return only content beneath a requested heading. Deferred until spec documents consistently exceed the 1000-line threshold. Estimated effort: M (5-7 days).

---

## Decisions and deferrals

### INT8 quantization evaluation (R5)

Decision: **NO-GO**. All three activation criteria were unmet.

Active memories with embeddings: 2,412 measured versus the 10,000 threshold (24.1%). P95 search latency: approximately 15ms measured versus the 50ms threshold (approximately 30%). Embedding dimensions: 1,024 measured versus the 1,536 threshold (66.7%).

The estimated 7.1 MB storage savings (3.9% of 180 MB total DB) did not justify 5.32% estimated recall risk, custom quantized BLOB complexity, or KL-divergence calibration overhead. Re-evaluate when the corpus grows approximately 4x (above 10K memories), sustained p95 exceeds 50ms, or the embedding provider changes to dimensions above 1,536.

### Implemented: graph centrality and community detection (N2)

Originally deferred at Sprint 6b pending a feasibility spike. Three graph capabilities were planned: graph momentum (N2a), causal depth signal (N2b) and community detection (N2c).

**Now implemented.** N2a and N2b share a single flag (`SPECKIT_GRAPH_SIGNALS`, default ON) providing additive score adjustments up to +0.05 each in Stage 2. N2c runs behind `SPECKIT_COMMUNITY_DETECTION` (default ON) with BFS connected components escalating to a pure-TypeScript Louvain implementation when the largest component exceeds 50% of nodes. Schema migrations v19 added `degree_snapshots` and `community_assignments` tables. See [Graph momentum scoring (N2a)](#graph-momentum-scoring-n2a), [Causal depth signal (N2b)](#causal-depth-signal-n2b) and [Community detection (N2c)](#community-detection-n2c) for full descriptions.

### Implemented: auto entity extraction (R10)

Originally deferred at Sprint 6b pending a feasibility spike alongside N2. Rule-based heuristics would extract entities from memory content, gated on edge density.

**Now implemented.** Five regex extraction rules with a 64-word denylist, stored in a dedicated `memory_entities` table (not causal_edges) with an `entity_catalog` for canonical name resolution. Runs at save time behind `SPECKIT_AUTO_ENTITIES` (default ON). Schema migration v20 added `memory_entities` and `entity_catalog` tables. Zero external NLP dependencies. See [Auto entity extraction (R10)](#auto-entity-extraction-r10) for the full description. Unblocks S5 (cross-document entity linking).

### Implemented: memory summary generation (R8)

Originally skipped at Sprint 7 because the scale gate measured 2,411 active memories, below the 5,000 threshold.

**Now implemented.** Pure-TypeScript TF-IDF extractive summarizer generates top-3 key sentences at save time, stored with summary-specific embeddings in the `memory_summaries` table. Operates as a parallel search channel in Stage 1 (not a pre-filter, avoiding recall loss). The runtime scale gate remains: the channel skips execution below 5,000 indexed memories. Runs behind `SPECKIT_MEMORY_SUMMARIES` (default ON). Schema migration v20 added the `memory_summaries` table. See [Memory summary search channel (R8)](#memory-summary-search-channel-r8) for the full description.

### Implemented: cross-document entity linking (S5)

Originally skipped at Sprint 7 because zero entities existed in the system. R10 had not been built, so there was no entity catalog to link against.

**Now implemented.** With R10 providing extracted entities, S5 scans the `entity_catalog` for entities appearing in two or more spec folders and creates `supports` causal edges with `strength=0.7` and `created_by='entity_linker'`. A density guard prevents runaway edge creation by running both a current-global-density precheck (`total_edges / total_memories`) and a projected post-insert global density check against `SPECKIT_ENTITY_LINKING_MAX_DENSITY` (default `1.0`, invalid or negative values fall back to `1.0`). Runs behind `SPECKIT_ENTITY_LINKING` (default ON) and depends on a populated `entity_catalog` (typically produced by R10 auto-entities). See [Cross-document entity linking (S5)](#cross-document-entity-linking-s5) for the full description.

---

## Feature Flag Reference

Every runtime behavior in the MCP server is controlled by environment variables. The tables below catalogue all known flags grouped by category. The "Default" column reflects the value in effect when the variable is absent from the environment.

For SPECKIT_* flags that use `isFeatureEnabled()`: the function returns `true` when the variable is absent, empty, or set to `'true'`. It returns `false` only when explicitly set to `'false'`. This means almost all graduated search-pipeline features are **ON by default** and require an explicit opt-out.

The `SPECKIT_ROLLOUT_PERCENT` flag applies a global percentage gate on top of any individual flag check. At 100 (the default), all sessions pass the rollout gate and every enabled flag takes effect normally.

### 1. Search Pipeline Features (SPECKIT_*)

| Name | Default | Type | Source File | Description |
|---|---|---|---|---|
| `SPECKIT_ABLATION` | `false` | boolean | `lib/eval/eval-metrics.ts` | Activates the ablation study framework. When `false`, all ablation functions are no-ops. Must be explicitly set to `'true'` to enable controlled channel ablation runs. |
| `SPECKIT_ARCHIVAL` | `true` | boolean | `lib/cognitive/archival-manager.ts` | Enables the archival manager which promotes DORMANT memories to the ARCHIVED state based on access patterns. Disable to keep all memories in active tiers. |
| `SPECKIT_AUTO_ENTITIES` | `true` | boolean | `lib/search/search-flags.ts` | Enables R10 automatic noun-phrase entity extraction at index time. Extracted entities feed the entity linking channel (S5). Requires `SPECKIT_ENTITY_LINKING` to create graph edges. |
| `SPECKIT_AUTO_RESUME` | `true` | boolean | `handlers/memory-context.ts` | In resume mode, automatically injects working-memory context items as `systemPromptContext` into the response. Also subject to `SPECKIT_ROLLOUT_PERCENT`. |
| `SPECKIT_CAUSAL_BOOST` | `true` | boolean | `lib/search/causal-boost.ts` | Enables causal-neighbor graph boosting. Top seed results (up to 25% of result set, capped at 5) walk the causal edge graph up to 2 hops, applying a per-hop boost capped at 0.05. Combined causal + session boost ceiling is 0.20. |
| `SPECKIT_CHANNEL_MIN_REP` | `true` | boolean | `lib/search/channel-representation.ts` | Sprint 3 Stage C: ensures every contributing search channel has at least one result in the top-k window. Results with a score below 0.005 are excluded from promotion regardless. |
| `SPECKIT_CLASSIFICATION_DECAY` | `true` | boolean | `lib/scoring/composite-scoring.ts` | Applies intent-classification-based decay scoring to composite scores. When disabled, classification signals do not reduce scores for mismatched intent types. |
| `SPECKIT_COACTIVATION` | `true` | boolean | `lib/cognitive/co-activation.ts` | Enables co-activation spreading in the hybrid search path and trigger-matcher cognitive pipeline. Top-5 results spread activation through the co-occurrence graph; related memories receive a boost scaled by `SPECKIT_COACTIVATION_STRENGTH`. |
| `SPECKIT_COACTIVATION_STRENGTH` | `0.25` | number | `lib/cognitive/co-activation.ts` | Configures the raw boost multiplier applied to co-activated memories. The actual boost per neighbor is further divided by `sqrt(neighbor_count)` (fan-effect divisor) to prevent hub-node inflation. |
| `SPECKIT_COGNITIVE_COACTIVATION_FLAGS` | `'i'` | string | `configs/cognitive.ts` | Regex flags for the cognitive co-activation pattern matcher. Must match `/^[dgimsuvy]*$/`. Invalid flags cause a startup validation error. |
| `SPECKIT_COGNITIVE_COACTIVATION_PATTERN` | `'\\b(memory\|context\|decision\|implementation\|bug)\\b'` | string | `configs/cognitive.ts` | Regex pattern used by the cognitive pipeline to detect co-activation-relevant content. Backreferences and nested quantifier groups are rejected for safety. Maximum length 256 characters. |
| `SPECKIT_COMMUNITY_DETECTION` | `true` | boolean | `lib/search/search-flags.ts` | Enables N2c BFS connected-component detection with Louvain escalation for large graphs. Injects community co-members alongside Stage 2 fusion results. |
| `SPECKIT_COMPLEXITY_ROUTER` | `true` | boolean | `lib/search/query-classifier.ts` | Sprint 3 Stage A: routes queries to channel subsets based on complexity tier. Simple queries use vector + FTS only; moderate adds BM25; complex uses all five channels. When disabled, all channels run for every query. |
| `SPECKIT_CONFIDENCE_TRUNCATION` | `true` | boolean | `lib/search/confidence-truncation.ts` | Sprint 3 Stage D: trims the low-confidence tail from fused results. A consecutive score gap exceeding 2× the median gap triggers truncation. Always returns at least 3 results. |
| `SPECKIT_CONSOLIDATION` | `true` | boolean | `lib/search/search-flags.ts` | Enables the N3-lite consolidation engine which runs after every successful save. Scans for contradictions (>0.85 cosine similarity with negation conflicts), applies Hebbian strengthening (+0.05/cycle, 30-day decay), detects stale edges (>90 days unfetched) and enforces 20 edges per node. Runs weekly. |
| `SPECKIT_CONSUMPTION_LOG` | inert | boolean | `lib/telemetry/consumption-logger.ts` | **Deprecated.** Eval complete (Sprint 7 audit). Telemetry is baked into core. The env var is accepted but has no effect; the function always returns `false`. |
| `SPECKIT_CONTEXT_HEADERS` | `true` | boolean | `lib/search/hybrid-search.ts` | **IMPLEMENTED (Sprint 019).** P1-4: Contextual tree injection into returned chunks. When enabled, `injectContextualTree()` string-prepends hierarchical context headers (`[parent > child — description]`, max 100 chars) using PI-B3 cached spec folder descriptions. Injected in Stage 4 after token-budget truncation. |
| `SPECKIT_CROSS_ENCODER` | `true` | boolean | `lib/search/search-flags.ts` | Enables cross-encoder reranking in Stage 3 of the 4-stage pipeline. When enabled, the reranker rescores candidates using a more expensive cross-attention model. Disabling falls back to vector-only ranking from fusion. |
| `SPECKIT_DASHBOARD_LIMIT` | `10000` | number | `lib/eval/reporting-dashboard.ts` | Maximum number of rows fetched for the reporting dashboard. Parsed as integer with NaN guard (`|| 10000`). Replaces a previously hardcoded limit of 1000. Added in Phase 018 (CR-P2-3). |
| `SPECKIT_DEBUG_INDEX_SCAN` | `false` | boolean | `handlers/memory-index.ts` | When `'true'`, emits additional file-count diagnostics during `memory_index_scan` runs. Off by default; intended for debugging index coverage issues. Must be explicitly set to `'true'`. |
| `SPECKIT_DEGREE_BOOST` | `true` | boolean | `lib/search/search-flags.ts` | Enables the degree-search channel in hybrid search. Re-ranks results by hub score via `computeDegreeScores()` with logarithmic normalization and a hard cap of 50. Base channel weight is 0.4. |
| `SPECKIT_DOCSCORE_AGGREGATION` | `true` | boolean | `lib/search/search-flags.ts` | Enables R1 MPAB (Multi-Parent Aggregated Bonus) chunk-to-memory score aggregation. Collapses chunk-level results back to parent memory documents using `sMax + 0.3 * sum(remaining) / sqrt(N)` to prevent multi-chunk dominance. |
| `SPECKIT_DYNAMIC_INIT` | `true` | boolean | `context-server.ts` | **IMPLEMENTED (Sprint 019).** P1-6: Dynamic server instructions at MCP initialization. `buildServerInstructions()` generates a memory-system overview (total memories, spec folder count, channels, stale count) and injects via `server.setInstructions()`. Reuses existing `memory_stats` handler data. |
| `SPECKIT_DYNAMIC_TOKEN_BUDGET` | `true` | boolean | `lib/search/dynamic-token-budget.ts` | Sprint 3 Stage E: computes a tier-aware token limit (simple 1,500 / moderate 2,500 / complex 4,000 tokens). Advisory only; callers are responsible for respecting the budget. When disabled, defaults to 4,000 tokens for all queries. |
| `SPECKIT_EAGER_WARMUP` | `false` | boolean | `context-server.ts` | Restores legacy eager-warmup behavior where the vector index is loaded at startup rather than lazily on first use. Default is lazy loading. Set to `'true'` to pre-warm the index at startup. |
| `SPECKIT_EMBEDDING_EXPANSION` | `true` | boolean | `lib/search/search-flags.ts` | R12 query expansion for embedding-based retrieval. Generates an expanded query variant and runs it in parallel with the baseline. Suppressed when the complexity classifier marks a query as `'simple'` (mutual exclusion with R15). |
| `SPECKIT_ENCODING_INTENT` | `true` | boolean | `lib/search/search-flags.ts` | R16 encoding-intent capture at index time. Classifies content as `document`, `code` or `structured_data` using heuristic scoring above a 0.4 threshold. Stored as read-only metadata on the `encoding_intent` column. No retrieval-time scoring impact yet; builds a labeled dataset. |
| `SPECKIT_ENTITY_LINKING` | `true` | boolean | `lib/search/search-flags.ts` | S5 cross-document entity linking. Creates causal edges between memories sharing entities across spec folders. Depends on a populated `entity_catalog` (typically produced by R10 auto-entities). Controlled by the global density guard (`SPECKIT_ENTITY_LINKING_MAX_DENSITY`). |
| `SPECKIT_ENTITY_LINKING_MAX_DENSITY` | `1.0` | number | `lib/search/entity-linker.ts` | S5 global density guard threshold. Entity linking performs a current-global-density precheck (`total_edges / total_memories`) and a projected post-insert global density check before creating links. If either check exceeds this value, link creation is skipped. Default 1.0 is permissive, but the guard can still trigger when total edges exceed total memories. |
| `SPECKIT_EVAL_LOGGING` | `false` | boolean | `lib/eval/eval-logger.ts` | Enables eval logging that writes retrieval events to the eval database. Must be explicitly set to `'true'`. Used during ablation and ground-truth evaluation runs. |
| `SPECKIT_EVENT_DECAY` | `true` | boolean | `lib/cognitive/working-memory.ts` | Enables FSRS-based attention decay in the working memory system. Scores decay each turn via exponential degradation. When disabled, attention scores do not degrade over the session. |
| `SPECKIT_EXTENDED_TELEMETRY` | inert | boolean | `lib/telemetry/retrieval-telemetry.ts` | **Deprecated.** Sprint 7 audit determined the overhead was not justified. The env var is accepted but has no effect; the function always returns `false`. |
| `SPECKIT_EXTRACTION` | `true` | boolean | `lib/extraction/extraction-adapter.ts` | Gates the extraction adapter which parses entities and structured data from memory files. Uses `isFeatureEnabled()` with session identity for rollout-based gating. |
| `SPECKIT_FILE_WATCHER` | `false` | boolean | `lib/ops/file-watcher.ts` | **IMPLEMENTED (Sprint 019).** P1-7: Real-time filesystem watching with chokidar. Push-based indexing of spec directories with 2s debounce, TM-02 SHA-256 content-hash deduplication (with hash seeding on `add` events), ENOENT grace handling, and exponential backoff for `SQLITE_BUSY`. |
| `SPECKIT_FOLDER_DISCOVERY` | `true` | boolean | `lib/search/search-flags.ts` | PI-B3: automatic spec folder discovery. Matches the query against cached one-sentence folder descriptions to identify the most relevant spec folder without triggering full-corpus search. Discovery failure is non-fatal. |
| `SPECKIT_FOLDER_SCORING` | `true` | boolean | `lib/search/folder-relevance.ts` | Sprint 1 two-phase folder-relevance scoring. When enabled, re-ranks results by spec folder relevance using a two-phase retrieval strategy. Disabled by setting to `'false'`. |
| `SPECKIT_FOLDER_TOP_K` | `5` | number | `lib/search/hybrid-search.ts` | Number of top folders used in two-phase folder retrieval when `SPECKIT_FOLDER_SCORING` is active. Parsed as integer; invalid or missing values fall back to 5. |
| `SPECKIT_GRAPH_SIGNALS` | `true` | boolean | `lib/search/search-flags.ts` | Enables N2a graph momentum scoring and N2b causal depth signals. Applied during Stage 2 fusion as additional scoring inputs from the causal graph structure. |
| `SPECKIT_GRAPH_UNIFIED` | `true` | boolean | `lib/search/graph-flags.ts` | Unified graph channel gate. Legacy compatibility shim that controls whether the graph search channel participates in hybrid retrieval. Disabled with explicit `'false'`. |
| `SPECKIT_INDEX_SPEC_DOCS` | `true` | boolean | `handlers/memory-index-discovery.ts` | Controls whether `memory_index_scan` indexes spec folder documents (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, `research.md`, `handover.md`). Set to `'false'` to skip spec docs. |
| `SPECKIT_INTERFERENCE_SCORE` | `true` | boolean | `lib/scoring/interference-scoring.ts` | Enables interference-based penalty scoring in composite scoring. When disabled (set to `'false'`), the interference computation is bypassed and the raw score passes through unchanged. |
| `SPECKIT_LAZY_LOADING` | `true` | boolean | `context-server.ts` | Controls lazy loading of the vector index. When `SPECKIT_EAGER_WARMUP` is not `'true'`, the index loads on first use rather than at startup. This flag reflects the default behavior; see `SPECKIT_EAGER_WARMUP` to override. |
| `SPECKIT_LEARN_FROM_SELECTION` | `true` | boolean | `lib/search/learned-feedback.ts` | **Default ON (graduated).** Set to `'false'` to disable R11 learned relevance feedback. Records user result selections into `learned_triggers`, and applies boosts after a 1-week shadow period where terms are logged but not applied. |
| `SPECKIT_MEMORY_SUMMARIES` | `true` | boolean | `lib/search/search-flags.ts` | R8 TF-IDF extractive summary generation. At index time, generates a top-3-sentence extractive summary for each memory and joins those sentences into summary text. Summaries serve as a lightweight search channel for fallback matching. |
| `SPECKIT_MMR` | `true` | boolean | `lib/search/search-flags.ts` | Enables Maximal Marginal Relevance reranking after fusion to promote result diversity. Uses intent-specific lambda values from `INTENT_LAMBDA_MAP` (default 0.7). Requires embeddings to be loaded from `vec_memories` for top-N candidates. |
| `SPECKIT_MULTI_QUERY` | `true` | boolean | `lib/search/search-flags.ts` | Enables multi-query expansion for deep-mode retrieval. The query is expanded into up to 3 variants via `expandQuery()`, each variant runs hybrid search in parallel, and results merge with deduplication. |
| `SPECKIT_NEGATIVE_FEEDBACK` | `true` | boolean | `lib/search/search-flags.ts` | T002b/A4 negative-feedback confidence demotion. Applies a confidence multiplier (starts at 1.0, decreases 0.1 per negative validation, floors at 0.3) with 30-day half-life recovery. |
| `SPECKIT_NOVELTY_BOOST` | inert | boolean | `lib/scoring/composite-scoring.ts` | **Inert.** N4 cold-start novelty boost was evaluated and removed. The env var is read in tests only; the production function always returns 0. |
| `SPECKIT_PIPELINE_V2` | `true` | boolean | `lib/search/search-flags.ts` | **Deprecated (always true).** `isPipelineV2Enabled()` is hardcoded to `return true` at `search-flags.ts:101`. The V2 pipeline is the only pipeline. The legacy `postSearchPipeline` was removed in Phase 017. This flag is retained for backward compatibility but has no effect. |
| `SPECKIT_PRESSURE_POLICY` | `true` | boolean | `handlers/memory-context.ts` | Enables context-pressure-based mode downgrading in `memory_context`. Above 0.60 token usage ratio, switches to focused mode. Above 0.80, switches to quick mode. Also subject to `SPECKIT_ROLLOUT_PERCENT`. |
| `SPECKIT_QUALITY_LOOP` | `false` | boolean | `handlers/memory-save.ts` | **Default OFF.** Enables the quality loop which re-evaluates low-quality memories after save. Must be explicitly set to `'true'`. Used for iterative quality improvement workflows. |
| `SPECKIT_RECONSOLIDATION` | `true` | boolean | `lib/search/search-flags.ts` | TM-06 reconsolidation-on-save. After embedding generation, checks top-3 similar memories in the same folder. Above 0.88 similarity triggers merge; 0.75–0.88 triggers supersede + causal edge. Requires a checkpoint to exist for the spec folder. |
| `SPECKIT_RELATIONS` | `true` | boolean | `lib/learning/corrections.ts` | Enables relational learning corrections that track and apply inter-memory relationship signals during the learning pipeline. Disabled with explicit `'false'`. |
| `SPECKIT_RESPONSE_TRACE` | `false` | boolean | `handlers/memory-search.ts` | **IMPLEMENTED (Sprint 019).** P0-2: Include provenance data (scores, source, trace) in `memory_search` response envelopes. Opt-in via `includeTrace: true` parameter. When disabled, response format is unchanged (backward compatible). |
| `SPECKIT_ROLLOUT_PERCENT` | `100` | number | `lib/cognitive/rollout-policy.ts` | Global rollout gate applied on top of individual feature flags. At 100, all sessions pass. At 0, all sessions are excluded. Between 1–99, a deterministic hash of the session identity determines inclusion. |
| `SPECKIT_RRF` | `true` | boolean | `lib/search/rrf-fusion.ts` | Enables Reciprocal Rank Fusion for combining multi-channel search results. When disabled, a simpler score-passthrough merge is used. Rarely disabled in production. |
| `SPECKIT_RSF_FUSION` | inert | boolean | `lib/search/hybrid-search.ts` | **Deprecated runtime gate.** RSF shadow Stage B is no longer active in production ranking paths. Remaining RSF references are compatibility/testing artifacts and do not alter live ranking behavior. |
| `SPECKIT_SAVE_QUALITY_GATE` | `true` | boolean | `lib/search/search-flags.ts` | TM-04 three-layer pre-storage quality gate. Layer 1: structure validation (title, content ≥50 chars, valid spec folder path). Layer 2: content quality scoring across 5 dimensions against a 0.4 signal density threshold. Layer 3: semantic dedup via cosine similarity (rejects near-duplicates above 0.92). A 14-day warn-only mode runs after activation. |
| `SPECKIT_SCORE_NORMALIZATION` | `true` | boolean | `lib/scoring/composite-scoring.ts` | Normalizes composite and RRF scores to the [0, 1] range for consistent downstream comparison. When disabled, raw scores from individual channels are used without normalization. |
| `SPECKIT_SEARCH_FALLBACK` | `true` | boolean | `lib/search/search-flags.ts` | PI-A2 quality-aware 3-tier fallback chain. With flag ON: Tier 1 primary retrieval (0.3), Tier 2 widened retrieval (0.1, all channels), Tier 3 structural SQL fallback. With flag OFF: legacy two-pass fallback (0.3 then 0.17). |
| `SPECKIT_SESSION_BOOST` | `true` | boolean | `lib/search/session-boost.ts` | Enables session-attention boosting. Memories from the current session's working memory receive a 0.15× score boost. Combined with causal boost, the ceiling is 0.20. Uses session identity for rollout-based gating. |
| `SPECKIT_SHADOW_SCORING` | inert | boolean | `lib/eval/shadow-scoring.ts` | **Deprecated.** Shadow scoring runtime is permanently disabled: `runShadowScoring()` returns `null` and `logShadowComparison()` returns `false`. The env var is retained for compatibility/testing context but does not enable production scoring paths. |
| `SPECKIT_SIGNAL_VOCAB` | `true` | boolean | `lib/parsing/trigger-matcher.ts` | Enables signal vocabulary expansion in the trigger matcher. Augments the trigger phrase vocabulary with derived signal terms during matching. Disabled with explicit `'false'`. |
| `SPECKIT_SKIP_API_VALIDATION` | `false` | boolean | `context-server.ts` | When `'true'`, skips API key validation at startup. Useful for testing without a real embedding provider. Default is to validate API credentials. |
| `SPECKIT_STRICT_SCHEMAS` | `true` | boolean | `tool-schemas.ts` | **IMPLEMENTED (Sprint 019).** P0-1: Controls Zod schema enforcement mode for all 28 MCP tool inputs. When `true`, `.strict()` rejects unexpected parameters. When `false`, `.passthrough()` allows undocumented parameters for backward compatibility. Validation runs per-tool in the handler layer. |
| `SPECKIT_TRM` | `true` | boolean | `lib/search/search-flags.ts` | Enables the Transparent Reasoning Module (evidence-gap detection). Stage 4 runs a TRM Z-score analysis to detect evidence gaps and annotate results accordingly. |
| `SPECKIT_WORKING_MEMORY` | `true` | boolean | `lib/cognitive/working-memory.ts` | Enables the working memory system which tracks attention scores for memories seen in the current session. Working memory context is injected during resume mode and influences session-boost scoring. |

### 2. Session and Cache

| Name | Default | Type | Source File | Description |
|---|---|---|---|---|
| `DISABLE_SESSION_DEDUP` | `false` | boolean | `lib/session/session-manager.ts` | When `'true'`, disables cross-turn session deduplication entirely. All memories are returned on every call regardless of whether they were already sent in this session. |
| `ENABLE_BM25` | `true` | boolean | `lib/search/bm25-index.ts` | Controls the in-memory BM25 search channel. When disabled (set to `'false'`), the BM25 channel is excluded from multi-channel retrieval. The FTS5 SQLite channel is unaffected. |
| `ENABLE_TOOL_CACHE` | `true` | boolean | `lib/cache/tool-cache.ts` | Master switch for the tool result cache. When disabled (set to `'false'`), all cache reads return `null` and writes are no-ops. Cache is always bypassed when this is off. |
| `SESSION_DEDUP_DB_UNAVAILABLE_MODE` | `'block'` | string | `lib/session/session-manager.ts` | Behavior when the session database is unavailable. `'allow'` permits all memories through (no dedup). `'block'` (default) rejects dedup attempts, returning an error rather than silently allowing duplicates. |
| `SESSION_MAX_ENTRIES` | `100` | number | `lib/session/session-manager.ts` | Maximum number of memory entries tracked per session for deduplication purposes. Entries beyond this cap are not tracked (but also not re-sent unless they fall outside the cap). |
| `SESSION_TTL_MINUTES` | `30` | number | `lib/session/session-manager.ts` | How long session deduplication records are retained after last use, in minutes. Sessions older than this are cleaned up on the next periodic maintenance pass. |
| `STALE_CLEANUP_INTERVAL_MS` | `3600000` | number | `lib/session/session-manager.ts` | Interval in milliseconds between stale session cleanup sweeps. Default is 1 hour (3,600,000 ms). Stale sessions are those whose last activity exceeds `STALE_SESSION_THRESHOLD_MS`. |
| `STALE_SESSION_THRESHOLD_MS` | `86400000` | number | `lib/session/session-manager.ts` | Age in milliseconds at which a session is considered stale and eligible for cleanup. Default is 24 hours (86,400,000 ms). |
| `TOOL_CACHE_CLEANUP_INTERVAL_MS` | `30000` | number | `lib/cache/tool-cache.ts` | Interval in milliseconds between expired-entry eviction sweeps of the tool cache. Default is 30 seconds (30,000 ms). The interval timer is unrefed so it does not prevent process exit. |
| `TOOL_CACHE_MAX_ENTRIES` | `1000` | number | `lib/cache/tool-cache.ts` | Maximum number of entries the tool cache holds before evicting the oldest entry on insert. Eviction is O(1) using insertion-order iteration over the underlying Map. |
| `TOOL_CACHE_TTL_MS` | `60000` | number | `lib/cache/tool-cache.ts` | Default time-to-live in milliseconds for tool cache entries. After this duration, entries are treated as expired and evicted on next access or cleanup sweep. Default is 60 seconds (60,000 ms). |

### 3. MCP Configuration

| Name | Default | Type | Source File | Description |
|---|---|---|---|---|
| `MCP_ANCHOR_STRICT` | `false` | boolean | `lib/validation/preflight.ts` | When `'true'`, enforces strict anchor format validation during pre-flight checks. Invalid anchor IDs cause the save to be rejected. Default is lenient mode which logs warnings but does not block. |
| `MCP_CHARS_PER_TOKEN` | `3.5` | number | `lib/validation/preflight.ts` | Characters-per-token ratio used for token budget estimation during pre-flight validation. Affects whether a memory file is flagged as too large before embedding generation begins. |
| `MCP_DUPLICATE_THRESHOLD` | `0.95` | number | `lib/validation/preflight.ts` | Cosine similarity threshold above which a new memory is considered a near-duplicate of an existing one during pre-flight validation. Duplicates above this threshold are rejected by the quality gate Layer 3. |
| `MCP_MAX_CONTENT_LENGTH` | `250000` | number | `lib/validation/preflight.ts` | Maximum allowed content length in characters for a memory file. Files exceeding this limit are rejected at pre-flight validation before any embedding generation or database writes. |
| `MCP_MAX_MEMORY_TOKENS` | `8000` | number | `lib/validation/preflight.ts` | Maximum token budget per memory (estimated via `MCP_CHARS_PER_TOKEN`). Pre-flight validation warns when a memory exceeds this limit. |
| `MCP_MIN_CONTENT_LENGTH` | `10` | number | `lib/validation/preflight.ts` | Minimum content length in characters for a valid memory file. Files shorter than this are rejected at pre-flight. The quality gate Layer 1 requires at least 50 characters, so this lower floor catches truly empty files. |
| `MCP_TOKEN_WARNING_THRESHOLD` | `0.8` | number | `lib/validation/preflight.ts` | Fraction of `MCP_MAX_MEMORY_TOKENS` at which a token budget warning is emitted. At 0.8, a warning fires when estimated tokens exceed 80% of the max. |

### 4. Memory and Storage

| Name | Default | Type | Source File | Description |
|---|---|---|---|---|
| `MEMORY_ALLOWED_PATHS` | _(cwd)_ | string | `tests/regression-010-index-large-files.vitest.ts` | Colon-separated list of filesystem paths that are allowlisted for memory file access. Used in path security validation to restrict which directories `memory_save` can read from. Defaults to `cwd` if not set. |
| `MEMORY_BASE_PATH` | _(cwd)_ | string | `core/config.ts` | Base path prepended to relative file paths when resolving memory file locations. Defaults to `process.cwd()` when not set. Determines the root of the allowed path tree. |
| `MEMORY_DB_DIR` | _(legacy fallback)_ | string | `lib/search/vector-index-impl.ts` | Legacy fallback for the database directory. Superseded by `SPEC_KIT_DB_DIR`. Precedence order: `SPEC_KIT_DB_DIR` > `MEMORY_DB_DIR` > default `database/` directory adjacent to the server root. |
| `MEMORY_DB_PATH` | _(derived)_ | string | `lib/search/vector-index-impl.ts` | Full path to the SQLite database file. When set, overrides the derived path from `SPEC_KIT_DB_DIR` or `MEMORY_DB_DIR`. Use for pointing at a provider-specific or non-default database location. |
| `SPECKIT_DB_DIR` | _(fallback)_ | string | `shared/config.ts` | Fallback env var for the database directory, checked after `SPEC_KIT_DB_DIR`. Added in Phase 018 (CR-P1-8) to support the underscore-less naming convention. Precedence: `SPEC_KIT_DB_DIR` > `SPECKIT_DB_DIR` > default path. |
| `SPEC_KIT_BATCH_DELAY_MS` | `100` | number | `core/config.ts` | Delay in milliseconds between processing batches during `memory_index_scan`. Prevents exhausting I/O resources on large workspaces by introducing a small pause between embedding generation batches. |
| `SPEC_KIT_BATCH_SIZE` | `5` | number | `core/config.ts` | Number of files processed per batch during `memory_index_scan`. Lower values reduce peak memory usage and API concurrency at the cost of longer scan times. |
| `SPEC_KIT_DB_DIR` | _(server root)_ | string | `core/config.ts` | Directory where the SQLite database file is stored. Takes precedence over `MEMORY_DB_DIR`. Resolved relative to `process.cwd()` when set. Defaults to a `database/` directory adjacent to the server root. |

### 5. Embedding and API

| Name | Default | Type | Source File | Description |
|---|---|---|---|---|
| `COHERE_API_KEY` | _(none)_ | string | `tests/search-limits-scoring.vitest.ts` | API key for the Cohere reranker provider. When present, the cross-encoder reranker uses Cohere's rerank API. Falls back to local or Voyage reranker when absent. |
| `EMBEDDING_DIM` | _(provider default)_ | number | `lib/search/vector-index-impl.ts` | Override for the embedding vector dimension. When set, bypasses the provider's reported dimension. Use when loading a custom model with a non-standard dimension. |
| `EMBEDDINGS_PROVIDER` | `'auto'` | string | `lib/providers/embeddings.ts` | Selects the embedding provider. Valid values include `'auto'`, `'openai'`, `'hf-local'`, and `'voyage'`. In `'auto'` mode, the system selects based on available API keys (Voyage preferred over OpenAI, local fallback). |
| `OPENAI_API_KEY` | _(none)_ | string | `tests/embeddings.vitest.ts` | API key for the OpenAI embeddings provider. Required when `EMBEDDINGS_PROVIDER` is `'openai'` or when `'auto'` mode selects OpenAI as the available provider. |
| `RERANKER_LOCAL` | `false` | boolean | `lib/search/local-reranker.ts` | **IMPLEMENTED (Sprint 019).** When set to `'true'` (strict string equality, not truthy), enables the local GGUF reranker via `node-llama-cpp`. Requires model file on disk and sufficient free memory (4GB default, 512MB with custom `SPECKIT_RERANKER_MODEL`). Falls back silently to algorithmic RRF scoring on any precondition failure. |
| `VOYAGE_API_KEY` | _(none)_ | string | `tests/embeddings.vitest.ts` | API key for the Voyage AI embeddings and reranker provider. In `'auto'` mode, Voyage is preferred over OpenAI when this key is present. |

### 6. Debug and Telemetry

| Name | Default | Type | Source File | Description |
|---|---|---|---|---|
| `DEBUG_TRIGGER_MATCHER` | _(unset)_ | string | `lib/parsing/trigger-matcher.ts` | When set to any non-empty value, emits debug-level output for trigger phrase matching operations. Useful for diagnosing why a particular memory is or is not matching a given prompt. |
| `LOG_LEVEL` | `'info'` | string | `lib/utils/logger.ts` | Minimum log severity level. Messages below this level are suppressed. Valid values: `'debug'`, `'info'`, `'warn'`, `'error'`. All log output goes to stderr (stdout is reserved for JSON-RPC). |
| `SPECKIT_EVAL_LOGGING` | `false` | boolean | `lib/eval/eval-logger.ts` | (Also listed under Search Pipeline.) Enables writes to the eval database during retrieval operations. Must be explicitly `'true'`. See category 1 for full description. |
| `SPECKIT_DEBUG_INDEX_SCAN` | `false` | boolean | `handlers/memory-index.ts` | (Also listed under Search Pipeline.) Enables verbose file-count diagnostics during index scans. Must be explicitly `'true'`. See category 1 for full description. |
| `SPECKIT_EXTENDED_TELEMETRY` | inert | boolean | `lib/telemetry/retrieval-telemetry.ts` | (Also listed under Search Pipeline.) Deprecated and inert. See category 1 for full description. |
| `SPECKIT_CONSUMPTION_LOG` | inert | boolean | `lib/telemetry/consumption-logger.ts` | (Also listed under Search Pipeline.) Deprecated and inert. See category 1 for full description. |

### 7. CI and Build (informational)

These variables are read at runtime to annotate checkpoint and evaluation records with source-control context. They are not feature flags and have no effect on search or storage behavior.

| Name | Source | Description |
|---|---|---|
| `BRANCH_NAME` | `lib/storage/checkpoints.ts` | Git branch name as set by some CI environments (e.g. Jenkins). Used as a fallback when `GIT_BRANCH` is absent. |
| `CI_COMMIT_REF_NAME` | `lib/storage/checkpoints.ts` | Git branch or tag name as set by GitLab CI. Third fallback in the branch-detection chain. |
| `GIT_BRANCH` | `lib/storage/checkpoints.ts` | Git branch name. Primary source used to annotate checkpoint records with the active branch at creation time. |
| `VERCEL_GIT_COMMIT_REF` | `lib/storage/checkpoints.ts` | Git branch name as set by Vercel deployments. Last fallback in the branch-detection chain. |

