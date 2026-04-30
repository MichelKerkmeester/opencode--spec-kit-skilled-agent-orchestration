---
title: SPECKIT Environment Variable Reference
description: All SPECKIT_* environment variables used by the Spec Kit Memory MCP server, organized by subsystem with defaults, types and source file references.
---

# SPECKIT Environment Variable Reference

> All `SPECKIT_*` environment variables for the Spec Kit Memory MCP server.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

All variables are optional. The server runs with sensible defaults when none are set. Variables use **graduated semantics** unless noted: they default to ON and you disable them by setting `=false`.

**Graph as a first-class feature family.** The `SPECKIT_GRAPH_*` variables form a dedicated feature family (see [Section 6](#6-graph) and [Section 7](#7-graph-calibration)) controlling structural code graph indexing, graph-first routing in the search pipeline, causal graph traversal, and calibration profiles. Since graph-first routing is now the default query dispatch order (Code Graph -> CocoIndex -> Memory), the graph env vars are among the most impactful configuration levers.

**Flag convention:**

| Pattern | Meaning |
|---------|---------|
| `!== 'false'` | **Graduated ON**: enabled by default, set `false` to disable |
| `=== 'true'` | **Opt-in OFF**: disabled by default, set `true` to enable |
| `parseFloat(... \|\| 'N')` | Numeric with fallback default N |
| `?.trim()` | String, empty = use default |

### Feature Flags Reference Table

Generated from `lib/search/search-flags.ts`. "Default state" is the shipped behavior when the governing env var is unset; opt-in rows are OFF even when similarly named graduated features exist elsewhere.

| flag name | default state (ON/OFF) | governing env var | which automation it gates | added in version |
| --- | --- | --- | --- | --- |
| Session attention boost | ON | `SPECKIT_SESSION_BOOST` | Search result re-ranking from session attention signals | graduated |
| Causal graph boost | ON | `SPECKIT_CAUSAL_BOOST` | Causal graph traversal boost for search ranking | graduated |
| Dynamic init | ON | `SPECKIT_DYNAMIC_INIT` | Startup instruction injection for the MCP server | graduated |
| Pressure policy | ON | `SPECKIT_PRESSURE_POLICY` | Token-pressure policy for `memory_context` | graduated |
| Auto resume | ON | `SPECKIT_AUTO_RESUME` | Automatic resume context injection for `memory_context` | graduated |
| MMR reranking | ON | `SPECKIT_MMR` | Graph-guided MMR diversity reranking | current |
| TRM evidence gap detection | ON | `SPECKIT_TRM` | Transparent Reasoning Module evidence-gap detection | current |
| Multi-query expansion | ON | `SPECKIT_MULTI_QUERY` | Deep-mode multi-query expansion | current |
| Cross-encoder reranking | ON | `SPECKIT_CROSS_ENCODER` | Cross-encoder reranking gate | current |
| Search fallback | ON | `SPECKIT_SEARCH_FALLBACK` | Quality-aware 3-tier search fallback chain | PI-A2 |
| Folder discovery | ON | `SPECKIT_FOLDER_DISCOVERY` | Automatic spec folder discovery via description cache | PI-B3 |
| Save planner mode | OFF | `SPECKIT_SAVE_PLANNER_MODE` | Mutation-first canonical save behavior; default is `plan-only` | planner-first save |
| Save reconsolidation | OFF | `SPECKIT_RECONSOLIDATION_ENABLED` | Save-time reconsolidation in planner-first flows | planner-first save |
| Post-insert enrichment | OFF | `SPECKIT_POST_INSERT_ENRICHMENT_ENABLED` | Save-time enrichment bundle in planner-first flows | planner-first save |
| Quality auto-fix retries | OFF | `SPECKIT_QUALITY_AUTO_FIX` | Save-time quality auto-fix retry loop | planner-first save |
| Docscore aggregation | ON | `SPECKIT_DOCSCORE_AGGREGATION` | Document-level chunk-to-memory score aggregation | R1 MPAB |
| Save quality gate | ON | `SPECKIT_SAVE_QUALITY_GATE` | Pre-storage quality gate for memory saves | graduated |
| Dynamic token budget | ON | `SPECKIT_DYNAMIC_TOKEN_BUDGET` | Query-complexity token budget allocation | graduated |
| Confidence truncation | ON | `SPECKIT_CONFIDENCE_TRUNCATION` | Low-confidence tail truncation | graduated |
| Channel minimum representation | ON | `SPECKIT_CHANNEL_MIN_REP` | Minimum channel representation after fusion | graduated |
| Reconsolidation on save | ON | `SPECKIT_RECONSOLIDATION` | Memory deduplication reconsolidation path | TM-06 |
| Negative feedback | ON | `SPECKIT_NEGATIVE_FEEDBACK` | Negative-feedback confidence demotion | T002b/A4 |
| Embedding expansion | ON | `SPECKIT_EMBEDDING_EXPANSION` | Embedding-based query expansion | R12 |
| Consolidation engine | ON | `SPECKIT_CONSOLIDATION` | Contradiction scan, strengthening, staleness, edge bounds | N3-lite |
| Encoding intent | ON | `SPECKIT_ENCODING_INTENT` | Index-time intent metadata capture | R16 |
| Graph walk rollout | ON | `SPECKIT_GRAPH_WALK_ROLLOUT`, `SPECKIT_GRAPH_SIGNALS` | Graph walk mode; defaults to `bounded_runtime` when graph signals are ON | N2a/N2b |
| Graph signals | ON | `SPECKIT_GRAPH_SIGNALS` | Graph momentum and causal depth signals | N2a/N2b |
| Community detection | ON | `SPECKIT_COMMUNITY_DETECTION` | BFS components with Louvain escalation | N2c |
| Community summaries | ON | `SPECKIT_COMMUNITY_SUMMARIES` | Community summary generation and search channel | graph summaries |
| Memory summaries | ON | `SPECKIT_MEMORY_SUMMARIES` | TF-IDF memory summary channel | R8 |
| Temporal contiguity | ON | `SPECKIT_TEMPORAL_CONTIGUITY` | Temporal contiguity boost on Stage 1 vector results | graduated |
| Auto entities | ON | `SPECKIT_AUTO_ENTITIES` | Rule-based entity extraction at save time | R10 |
| Entity linking | ON | `SPECKIT_ENTITY_LINKING` | Cross-document entity edges | S5 |
| Degree boost | ON | `SPECKIT_DEGREE_BOOST` | Causal-edge degree-based reranking | current |
| Context headers | ON | `SPECKIT_CONTEXT_HEADERS` | Stage 4 contextual tree headers | graduated |
| Markdown file watcher | OFF | `SPECKIT_FILE_WATCHER` | Real-time markdown reindexing watcher | opt-in |
| Local reranker | OFF | `RERANKER_LOCAL` | Local GGUF reranker gate | opt-in |
| Quality loop | ON | `SPECKIT_QUALITY_LOOP` | Verify-fix-verify memory quality loop | T008 |
| Query decomposition | ON | `SPECKIT_QUERY_DECOMPOSITION` | Deep-mode facet splitting | D2 REQ-D2-001 |
| Graph concept routing | ON | `SPECKIT_GRAPH_CONCEPT_ROUTING` | Query-time alias matching into graph channel | D2 REQ-D2-002 |
| Query surrogates | ON | `SPECKIT_QUERY_SURROGATES` | Index-time aliases, headings, summaries, questions | D2 REQ-D2-005 |
| Implicit feedback log | ON | `SPECKIT_IMPLICIT_FEEDBACK_LOG` | Shadow-only feedback event ledger | D4 REQ-D4-001 |
| Hybrid decay policy | ON | `SPECKIT_HYBRID_DECAY_POLICY` | Type-aware no-decay for permanent artifacts | D4 REQ-D4-002 |
| Save quality gate exceptions | ON | `SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS` | Short critical decision quality-gate bypass | D4 REQ-D4-003 |
| LLM reformulation | ON | `SPECKIT_LLM_REFORMULATION` | Corpus-grounded LLM query reformulation | D2 REQ-D2-003 |
| HyDE | ON | `SPECKIT_HYDE` | Hypothetical document embeddings for low-confidence deep queries | D2 REQ-D2-004 |
| Graph refresh mode | ON | `SPECKIT_GRAPH_REFRESH_MODE` | Dirty-node recomputation after writes; default `write_local` | D3 REQ-D3-003 |
| LLM graph backfill | ON | `SPECKIT_LLM_GRAPH_BACKFILL` | Async probabilistic graph edge backfill | D3 REQ-D3-004 |
| Graph calibration profile | ON | `SPECKIT_GRAPH_CALIBRATION_PROFILE` | Community thresholds and graph score caps | D3 REQ-D3-005/006 |
| Learned Stage 2 combiner | ON | `SPECKIT_LEARNED_STAGE2_COMBINER` | Shadow-only learned linear ranker | D1 REQ-D1-006 |
| Shadow feedback | ON | `SPECKIT_SHADOW_FEEDBACK` | Holdout comparison of would-have-changed rankings | D4 REQ-D4-006 |
| Progressive disclosure | ON | `SPECKIT_PROGRESSIVE_DISCLOSURE_V1` | Summary layer and cursor pagination for results | D5 REQ-D5-005 |
| Session retrieval state | ON | `SPECKIT_SESSION_RETRIEVAL_STATE_V1` | Cross-turn dedup and goal-aware refinement | D5 REQ-D5-006 |
| Calibrated overlap bonus | ON | `SPECKIT_CALIBRATED_OVERLAP_BONUS` | Multi-channel overlap bonus | D1 REQ-D1-001 |
| RRF K experimental | ON | `SPECKIT_RRF_K_EXPERIMENTAL` | Per-intent RRF K selection | D1 REQ-D1-003 |
| Typed traversal | ON | `SPECKIT_TYPED_TRAVERSAL` | Sparse-first intent-aware graph traversal | D3 Phase A |
| Empty result recovery | ON | `SPECKIT_EMPTY_RESULT_RECOVERY_V1` | Empty and weak result recovery payloads | D5 REQ-D5-001 |
| Result confidence | ON | `SPECKIT_RESULT_CONFIDENCE_V1` | Per-result calibrated confidence scoring | D5 REQ-D5-004 |
| Batch learned feedback | ON | `SPECKIT_BATCH_LEARNED_FEEDBACK` | Weekly batch feedback learning pipeline | D4 REQ-D4-004 |
| Assistive reconsolidation | ON | `SPECKIT_ASSISTIVE_RECONSOLIDATION` | Near-duplicate detection and review routing | D4 REQ-D4-005 |
| Result explainability | ON | `SPECKIT_RESULT_EXPLAIN_V1` | Two-tier result explainability | D5 REQ-D5-002 |
| Response profile formatting | ON | `SPECKIT_RESPONSE_PROFILE_V1` | Mode-aware response profiles | D5 REQ-D5-003 |
| Query concept expansion | ON | `SPECKIT_QUERY_CONCEPT_EXPANSION` | Alias-based query expansion for hybrid search | Phase B T016 |
| Graph fallback | ON | `SPECKIT_GRAPH_FALLBACK` | Graph-expanded fallback on zero or weak results | Phase B T017 |
| Graph context injection | ON | `SPECKIT_GRAPH_CONTEXT_INJECTION` | Graph neighbor lookup even without seed results | Phase B T020 |
| Result provenance | ON | `SPECKIT_RESULT_PROVENANCE` | Graph evidence metadata in search results | Phase C T027 |
| Temporal edges | ON | `SPECKIT_TEMPORAL_EDGES` | Temporal validity tracking for causal edges | Phase D T036 |
| Usage ranking | ON | `SPECKIT_USAGE_RANKING` | Usage-weighted ranking signal | Phase D T036 |
| Ontology hooks | ON | `SPECKIT_ONTOLOGY_HOOKS` | Ontology-guided extraction validation hooks | Phase D T036 |
| Community search fallback | ON | `SPECKIT_COMMUNITY_SEARCH_FALLBACK` | Community-level fallback channel | Phase B T018 |
| Dual retrieval | ON | `SPECKIT_DUAL_RETRIEVAL` | Local/global/auto retrieval level control | Phase B T019 |
| Intent auto profile | ON | `SPECKIT_INTENT_AUTO_PROFILE` | Intent-to-response-profile auto-routing | Phase C |

Total unique variables documented: 129 (legacy HYDRA aliases removed in commit 6f2c2c939).

### Provisional Measurement Contract

Publication-facing metric rows now use the shared measurement contract from `lib/context/shared-payload.ts`.

- Every publishable metric field must declare one certainty label: `exact`, `estimated`, `defaulted`, or `unknown`.
- Headline multipliers stay blocked unless prompt, completion, cache-read, and cache-write token fields all have `provider_counted` authority. Later packets should reuse `canPublishMultiplier()` instead of inventing packet-local gates.
- Publication-grade rows must carry methodology metadata with `schemaVersion`, `methodologyStatus`, and at least one provenance entry before they can be emitted.
- There is no environment variable that disables or downgrades this contract. Telemetry and reporting toggles may increase supporting evidence, but they do not upgrade certainty labels or bypass the multiplier gate.

### Adjacent Toggles

These flags can add evidence around future reporting surfaces, but they must still honor the contract above:

| Variable | Effect on measurement contract |
|----------|--------------------------------|
| `SPECKIT_EXTENDED_TELEMETRY` | Adds more detailed telemetry for later analysis, but does not change certainty or authority requirements. |
| `SPECKIT_EVAL_LOGGING` | Persists evaluation events for later review, but does not authorize publication-grade multiplier claims. |
| `SPECKIT_ABLATION` | Enables ablation studies, but any exported savings story still needs provider-counted authority plus methodology metadata. |

### Auditable Savings Publication Contract

The reporting pipeline adds a row-eligibility gate beside the measurement
contract implemented in `mcp_server/lib/telemetry/retrieval-telemetry.ts` and
the publication guard helpers used by the evaluation dashboard.

- Publishable reporting rows must include a supported `methodologyStatus`, a non-empty `schemaVersion`, and at least one provenance entry.
- Rows that fail the publication contract must surface one exclusion reason: `missing_methodology`, `missing_schema_version`, `missing_provenance`, or `unsupported_certainty`.
- There is no environment variable that bypasses the row gate. Reporting toggles can add supporting evidence, but they cannot upgrade unsupported certainty values or fill in missing provenance.
- The current dashboard reader remains aggregate-only. Future export or publication surfaces should import the shared gate helper instead of re-encoding eligibility logic in handler-local code.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:toc -->
## Table of Contents

2. [Infrastructure](#2-infrastructure)
3. [Search Pipeline: Core](#3-search-pipeline-core)
4. [Search Pipeline: Fusion and Scoring](#4-search-pipeline-fusion-and-scoring)
5. [Search Pipeline: Query Intelligence](#5-search-pipeline-query-intelligence)
6. [Graph](#6-graph)
7. [Graph: Calibration](#7-graph-calibration)
8. [Cognitive](#8-cognitive)
9. [Feedback and Learning](#9-feedback-and-learning)
10. [Governance and Scope](#10-governance-and-scope)
11. [UX and Response Formatting](#11-ux-and-response-formatting)
12. [Evaluation and Telemetry](#12-evaluation-and-telemetry)
13. [Indexing](#13-indexing)
14. [Reranker](#14-reranker)
15. [Embedding](#15-embedding)
16. [Roadmap Phase Control](#16-roadmap-phase-control)
17. [Deprecated](#17-deprecated)
18. [Quick Start Examples](#18-quick-start-examples)
<!-- /ANCHOR:toc -->

---

<!-- ANCHOR:infrastructure -->
## 2. INFRASTRUCTURE

| Variable | Default | Type | Description | Source |
|----------|---------|------|-------------|--------|
| `SPECKIT_DB_DIR` | (auto-detected) | string | Override database directory path. Also accepts `SPEC_KIT_DB_DIR`. | `core/config.ts`, `shared/config.ts` |
| `SPECKIT_EVAL_DB_PATH` | (null) | string | Custom file path for the eval reporting SQLite database. | `handlers/eval-reporting.ts` |
| `SPECKIT_STRICT_SCHEMAS` | `true` | boolean | Enforce strict JSON schema validation on MCP tool inputs. Set `false` to relax. | `schemas/tool-input-schemas.ts` |
| `SPECKIT_SKIP_API_VALIDATION` | `false` | boolean | Skip API-level input validation. Opt-in: set `true` to enable. | `context-server.ts` |
| `SPECKIT_DYNAMIC_INIT` | `true` | boolean | Dynamic startup instruction injection for the MCP server. Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_ROLLOUT_PERCENT` | `100` | number | Global rollout percentage (0-100) for feature flag gating. Controls what fraction of feature checks pass. | `lib/cognitive/rollout-policy.ts` |
| `SPECKIT_PARSER` | `treesitter` | string | Structural parser backend: `treesitter` (AST-accurate via WASM) or `regex` (lightweight fallback). Detector provenance is surfaced separately on code-graph metadata; when a parser-provenance carrier is required, the shared trust mapper translates persisted detector provenance (for example, `structured -> regex`) instead of assuming AST. | `lib/code-graph/structural-indexer.ts`, `lib/context/shared-payload.ts`, `code-graph/lib/readiness-contract.ts` |
| `SPECKIT_VRULE_OPTIONAL` | `false` | boolean | When `true`, V-rule validation bypasses if the module fails to load. Opt-in. | `handlers/v-rule-bridge.ts` |
| `SPECKIT_SAVE_PLANNER_MODE` | `plan-only` | string | Canonical save planner mode: `plan-only` (default), `full-auto`, or `hybrid`. All modes refresh packet metadata on `/memory:save`; `plan-only` no longer leaves `description.json.lastUpdated` or `graph-metadata.json` untouched. `full-auto` keeps the legacy atomic apply path; `hybrid` is reserved for future mixed flows and currently behaves the same as `plan-only`. | `lib/search/search-flags.ts` |
| `MCP_SESSION_RESUME_AUTH_MODE` | `strict` | string | Session-resume auth binding mode. `strict` (default) rejects `args.sessionId` mismatches against the transport caller context from `getCallerContext()`. `permissive` logs the mismatch and continues for canary rollout. | `handlers/session-resume.ts` |
| `SPECKIT_RECONSOLIDATION_ENABLED` | `false` | boolean | Opt-in save-time reconsolidation for planner-first flows. Disabled by default on saves. | `lib/search/search-flags.ts` |
| `SPECKIT_POST_INSERT_ENRICHMENT_ENABLED` | `false` | boolean | Opt-in save-time post-insert enrichment bundle for planner-first flows. Disabled by default on saves. | `lib/search/search-flags.ts` |
| `SPECKIT_QUALITY_AUTO_FIX` | `false` | boolean | Opt-in save-time quality auto-fix retries for planner-first flows. Disabled by default on saves. | `lib/search/search-flags.ts` |
| `SPECKIT_CODEX_HOOK_TIMEOUT_MS` | `3000` | number | Timeout (ms) for the Codex `UserPromptSubmit` hook and the skill-advisor subprocess execution when invoked from Codex. On timeout, the Codex hook returns a stale advisory brief instead of empty output, so operators who raise this value trade responsiveness for fresher advisor data. Set via environment variable before launching Codex. [026/009/012, flagged by 03] | `hooks/codex/user-prompt-submit.ts`, `skill-advisor/lib/subprocess.ts` |
<!-- /ANCHOR:infrastructure -->

---

<!-- ANCHOR:search-pipeline-core -->
## 3. SEARCH PIPELINE: CORE

| Variable | Default | Type | Description | Source |
|----------|---------|------|-------------|--------|
| `SPECKIT_RRF` | `true` | boolean | Master switch for Reciprocal Rank Fusion. Graduated ON. | `shared/algorithms/rrf-fusion.ts` |
| `SPECKIT_RRF_K` | `40` | number | RRF smoothing constant `k`. Lower = more top-heavy ranking, higher = flatter. Must be > 0. | `shared/algorithms/rrf-fusion.ts` |
| `SPECKIT_RRF_K_EXPERIMENTAL` | `true` | boolean | Per-intent RRF K selection from the D1 K-sweep grid. Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_SEARCH_FALLBACK` | `true` | boolean | Quality-aware 3-tier search fallback chain (PI-A2). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_COMPLEXITY_ROUTER` | `true` | boolean | Query complexity classification for routing (simple/moderate/deep). Graduated ON. | `lib/search/query-classifier.ts` |
| `SPECKIT_MMR` | `true` | boolean | Graph-guided Maximal Marginal Relevance diversity reranking. Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_CROSS_ENCODER` | `true` | boolean | Cross-encoder reranking gate. Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_MULTI_QUERY` | `true` | boolean | Multi-query expansion for deep-mode retrieval. Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_EMBEDDING_EXPANSION` | `true` | boolean | Query expansion for embedding-based retrieval (R12). Suppressed when classification = "simple". Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_CONFIDENCE_TRUNCATION` | `true` | boolean | Confidence-gap truncation for low-confidence result tails. Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_CHANNEL_MIN_REP` | `true` | boolean | Channel minimum-representation promotion after fusion. Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_DYNAMIC_TOKEN_BUDGET` | `true` | boolean | Dynamic token budget allocation by query complexity. Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_TRM` | `true` | boolean | Transparent Reasoning Module: evidence-gap detection. Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_ADAPTIVE_FUSION` | `true` | boolean | Intent-aware adaptive fusion with document-type weight shifting. Graduated ON. | `shared/algorithms/adaptive-fusion.ts` |
<!-- /ANCHOR:search-pipeline-core -->

---

<!-- ANCHOR:search-pipeline-fusion -->
## 4. SEARCH PIPELINE: FUSION AND SCORING

| Variable | Default | Type | Description | Source |
|----------|---------|------|-------------|--------|
| `SPECKIT_SCORE_NORMALIZATION` | `true` | boolean | Composite score normalization. Graduated ON. | `lib/scoring/composite-scoring.ts` |
| `SPECKIT_DOCSCORE_AGGREGATION` | `true` | boolean | R1 MPAB: Document-level chunk-to-memory score aggregation. Graduated ON. | `lib/scoring/mpab-aggregation.ts` |
| `SPECKIT_INTERFERENCE_SCORE` | `true` | boolean | Interference penalty in composite scoring. Graduated ON. Set `false` to disable. | `lib/scoring/interference-scoring.ts` |
| `SPECKIT_CLASSIFICATION_DECAY` | `true` | boolean | Classification-aware decay in FSRS scheduling and composite scoring. Graduated ON. | `lib/cognitive/fsrs-scheduler.ts`, `lib/scoring/composite-scoring.ts` |
| `SPECKIT_SESSION_BOOST` | `true` | boolean | Session attention boost for search result re-ranking. Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_CAUSAL_BOOST` | `true` | boolean | Causal graph traversal boost for search result amplification. Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_CALIBRATED_OVERLAP_BONUS` | `true` | boolean | Calibrated overlap bonus for multi-channel convergence (REQ-D1-001). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_NEGATIVE_FEEDBACK` | `true` | boolean | Negative-feedback confidence demotion in ranking (T002b/A4). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_TEMPORAL_CONTIGUITY` | `true` | boolean | Temporal contiguity boost on raw Stage 1 vector results. Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_RECENCY_FUSION_WEIGHT` | `0.07` | number | Weight of recency signal in Stage 2 fusion scoring. | `lib/search/pipeline/stage2-fusion.ts` |
| `SPECKIT_RECENCY_FUSION_CAP` | `0.10` | number | Maximum recency contribution cap in Stage 2 fusion. | `lib/search/pipeline/stage2-fusion.ts` |
| `SPECKIT_DOC_TYPE_WEIGHT_FACTOR` | `1.2` | number | Proportional weight shift factor per document type in adaptive fusion (20% shift at 1.2). | `shared/algorithms/adaptive-fusion.ts` |
| `SPECKIT_FOLDER_SCORING` | `true` | boolean | Folder-level relevance scoring. Graduated ON. | `lib/search/folder-relevance.ts` |
| `SPECKIT_FOLDER_BOOST_FACTOR` | `1.3` | number | Multiplier applied to results matching the discovered spec folder. | `handlers/memory-context.ts` |
| `SPECKIT_FOLDER_TOP_K` | `5` | number | Number of top folder-scored results to inject. | `lib/search/hybrid-search.ts` |
| `SPECKIT_FOLDER_DISCOVERY` | `true` | boolean | Automatic spec folder discovery via description cache (PI-B3). Graduated ON. | `lib/search/search-flags.ts` |
<!-- /ANCHOR:search-pipeline-fusion -->

---

<!-- ANCHOR:search-pipeline-query -->
## 5. SEARCH PIPELINE: QUERY INTELLIGENCE

| Variable | Default | Type | Description | Source |
|----------|---------|------|-------------|--------|
| `SPECKIT_QUERY_DECOMPOSITION` | `true` | boolean | Bounded facet detection for deep-mode queries: splits into up to 3 sub-queries (REQ-D2-001). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_QUERY_SURROGATES` | `true` | boolean | Index-time surrogate metadata for recall improvement (REQ-D2-005). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_QUERY_CONCEPT_EXPANSION` | `true` | boolean | Query concept expansion via alias matching for hybrid search (Phase B T016). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_LLM_REFORMULATION` | `true` | boolean | Corpus-grounded LLM query reformulation, deep-mode only (REQ-D2-003). Requires LLM endpoint. Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_HYDE` | `true` | boolean | Hypothetical Document Embeddings for low-confidence deep queries (REQ-D2-004). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_HYDE_ACTIVE` | (derived) | boolean | Runtime HyDE activation gate. Lowercase `true` enables. | `lib/search/hyde.ts` |
| `SPECKIT_HYDE_LOG` | `false` | boolean | Enable verbose HyDE generation logging. Opt-in. | `lib/search/hyde.ts` |
| `SPECKIT_INTENT_CONFIDENCE_FLOOR` | `0.25` | number | Minimum confidence for auto-detected intent. Below this, overrides to "understand". | `handlers/memory-search.ts` |
| `SPECKIT_INTENT_AUTO_PROFILE` | `true` | boolean | Intent-to-profile auto-routing: auto-selects response profile from classifyIntent() results. Graduated ON. | `lib/search/search-flags.ts` |
<!-- /ANCHOR:search-pipeline-query -->

---

<!-- ANCHOR:graph -->
## 6. GRAPH

| Variable | Default | Type | Description | Source |
|----------|---------|------|-------------|--------|
| `SPECKIT_GRAPH_UNIFIED` | `true` | boolean | Unified graph search integration. Graduated ON. Set `false` to disable all graph features. | `core/db-state.ts` |
| `SPECKIT_GRAPH_SIGNALS` | `true` | boolean | Graph momentum scoring and causal depth signals (N2a+N2b). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_GRAPH_WALK_ROLLOUT` | (derived) | string | Graph walk rollout state: `off`, `trace_only`, or `bounded_runtime`. Defaults to `bounded_runtime` when GRAPH_SIGNALS is ON. | `lib/search/search-flags.ts` |
| `SPECKIT_GRAPH_WEIGHT_CAP` | `0.15` | number | Maximum graph contribution in Stage 2 scoring. | `lib/search/graph-calibration.ts` |
| `SPECKIT_GRAPH_REFRESH_MODE` | `write_local` | string | Graph refresh mode: `off`, `write_local`, or `scheduled` (REQ-D3-003). | `lib/search/search-flags.ts` |
| `SPECKIT_GRAPH_LOCAL_THRESHOLD` | (internal) | number | Local graph density threshold for graph operations. | `lib/search/graph-lifecycle.ts` |
| `SPECKIT_GRAPH_CONCEPT_ROUTING` | `true` | boolean | Query-time alias matching for concept routing (REQ-D2-002). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_GRAPH_CONTEXT_INJECTION` | `true` | boolean | Always-on graph context injection: runs concept routing even without seed results (Phase B T020). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_GRAPH_FALLBACK` | `true` | boolean | Graph-expanded fallback on zero/weak results (Phase B T017). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_GRAPH_CALIBRATION_PROFILE` | `true` | boolean | Graph calibration profile enforcement and community thresholds (REQ-D3-005/006). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_LLM_GRAPH_BACKFILL` | `true` | boolean | Async LLM graph backfill for high-value documents (REQ-D3-004). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_COMMUNITY_DETECTION` | `true` | boolean | Community detection via BFS connected components + Louvain escalation (N2c). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_COMMUNITY_SUMMARIES` | `true` | boolean | Community summary generation and search channel. Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_COMMUNITY_SEARCH_FALLBACK` | `true` | boolean | Community-level search as fallback channel (Phase B T018). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_DUAL_RETRIEVAL` | `true` | boolean | Dual-level retrieval mode: `local` (entity), `global` (community), `auto` (local + fallback) (Phase B T019). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_DEGREE_BOOST` | `true` | boolean | Causal-edge degree-based re-ranking. Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_TEMPORAL_EDGES` | `true` | boolean | Temporal validity tracking for causal edges (Phase D T036). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_TYPED_TRAVERSAL` | `true` | boolean | Sparse-first + intent-aware typed traversal (D3 Phase A). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_ENTITY_LINKING` | `true` | boolean | Cross-document entity linking (S5). Requires AUTO_ENTITIES. Graduated ON. | `lib/search/search-flags.ts`, `lib/search/graph-lifecycle.ts` |
| `SPECKIT_ENTITY_LINKING_MAX_DENSITY` | `1.0` | number | Density guard threshold: skip entity linking when projected graph density exceeds this value. | `lib/search/entity-linker.ts` |
| `SPECKIT_AUTO_ENTITIES` | `true` | boolean | Auto entity extraction: rule-based noun-phrase extraction at save time (R10). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_RESULT_PROVENANCE` | `true` | boolean | Include graph evidence metadata (edges, communities, boost factors) in search results (Phase C T027). Graduated ON. | `lib/search/search-flags.ts` |
<!-- /ANCHOR:graph -->

`code_graph_status` and the startup brief now surface a packet-independent `graphQualitySummary` derived from persisted detector provenance plus the latest edge-enrichment summary. Operators can use that reader to confirm whether the current graph was built with `structured`/`regex` provenance and whether the latest edge-quality signal is coming from `direct_call`, `import`, `type_reference`, `test_coverage`, or `inferred_heuristic` evidence.

---

<!-- ANCHOR:graph-calibration -->
## 7. GRAPH: CALIBRATION

| Variable | Default | Type | Description | Source |
|----------|---------|------|-------------|--------|
| `SPECKIT_CALIBRATION_PROFILE_NAME` | `default` | string | Named calibration profile: `default` or `aggressive`. | `lib/search/graph-calibration.ts` |
| `SPECKIT_N2A_CAP` | (profile) | number | N2a cap for RRF fusion overflow prevention. Overrides the active calibration profile value. | `lib/search/graph-calibration.ts` |
| `SPECKIT_N2B_CAP` | (profile) | number | N2b cap for RRF fusion overflow prevention. Overrides the active calibration profile value. | `lib/search/graph-calibration.ts` |
| `SPECKIT_LOUVAIN_MIN_DENSITY` | (profile) | number | Minimum graph density required to activate Louvain community detection. | `lib/search/graph-calibration.ts` |
| `SPECKIT_LOUVAIN_MIN_SIZE` | (profile) | number | Minimum component node count required to activate Louvain. | `lib/search/graph-calibration.ts` |
<!-- /ANCHOR:graph-calibration -->

---

<!-- ANCHOR:cognitive -->
## 8. COGNITIVE

| Variable | Default | Type | Description | Source |
|----------|---------|------|-------------|--------|
| `SPECKIT_COACTIVATION` | `true` | boolean | Co-activation pattern matching for related memory surfacing. Graduated ON. | `lib/cognitive/co-activation.ts` |
| `SPECKIT_COACTIVATION_STRENGTH` | `0.25` | number | Co-activation boost factor. Clamped to [0, 1.0]. | `lib/cognitive/co-activation.ts` |
| `SPECKIT_COGNITIVE_COACTIVATION_PATTERN` | (built-in) | string | Custom regex pattern for co-activation matching. Validated for safety. | `configs/cognitive.ts` |
| `SPECKIT_COGNITIVE_COACTIVATION_FLAGS` | (built-in) | string | Regex flags for the co-activation pattern (e.g., `gi`). Validated. | `configs/cognitive.ts` |
| `SPECKIT_WORKING_MEMORY` | `true` | boolean | Working memory system (Miller's Law: 7 +/- 2 capacity, 30-min timeout). Graduated ON. | `lib/cognitive/working-memory.ts` |
| `SPECKIT_HYBRID_DECAY_POLICY` | `true` | boolean | Type-aware no-decay for permanent artifacts (decision/constitutional types get Infinity stability). Graduated ON. | `lib/cognitive/fsrs-scheduler.ts` |
| `SPECKIT_RECONSOLIDATION` | `true` | boolean | Reconsolidation-on-save for memory deduplication (TM-06). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_ASSISTIVE_RECONSOLIDATION` | `true` | boolean | Assistive reconsolidation for near-duplicate detection (REQ-D4-005). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_CONSOLIDATION` | `true` | boolean | Consolidation engine: contradiction scan, Hebbian strengthening, staleness detection (N3-lite). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_MEMORY_SUMMARIES` | `true` | boolean | TF-IDF extractive summary generation as search channel (R8). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_PRESSURE_POLICY` | `true` | boolean | Token-pressure policy for memory_context responses. Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_AUTO_RESUME` | `true` | boolean | Automatic session resume context injection for memory_context. Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_MEMORY_ADAPTIVE_MODE` | `shadow` | string | Adaptive ranking mode: `shadow` (evaluation-only, do not apply) or `promoted` (apply to ranking). | `lib/cognitive/adaptive-ranking.ts` |
| `SPECKIT_RECENCY_DECAY_DAYS` | (internal) | number | Number of days for recency decay calculation in access tracking. | `lib/storage/access-tracker.ts` |
| `SPECKIT_EVENT_DECAY` | `true` | boolean | Event decay processing in working memory. Graduated ON. | `lib/cognitive/working-memory.ts` (via tests) |
<!-- /ANCHOR:cognitive -->

---

<!-- ANCHOR:feedback-learning -->
## 9. FEEDBACK AND LEARNING

| Variable | Default | Type | Description | Source |
|----------|---------|------|-------------|--------|
| `SPECKIT_IMPLICIT_FEEDBACK_LOG` | `true` | boolean | Implicit feedback event ledger for `search_shown`, `result_cited`, `query_reformulated`, `same_topic_requery`, and `follow_on_tool_use`. Event logging only, with no ranking side effects (REQ-D4-001). Graduated ON. | `lib/feedback/feedback-ledger.ts` |
| `SPECKIT_SHADOW_FEEDBACK` | `true` | boolean | Shadow scoring with holdout evaluation: compares would-have-changed vs live rankings (REQ-D4-006). Graduated ON. | `lib/feedback/shadow-scoring.ts` |
| `SPECKIT_SHADOW_LEARNING` | `false` | boolean | Shadow learned model loading for Stage 2 weight combiner. Opt-in: set `true` to enable. | `lib/search/pipeline/stage2-fusion.ts` |
| `SPECKIT_LEARNED_STAGE2_COMBINER` | `true` | boolean | Learned Stage 2 weight combiner in shadow mode (REQ-D1-006). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_LEARNED_STAGE2_MODEL` | (auto) | string | Custom file path for the learned Stage 2 model. Absolute or relative to cwd. | `lib/search/pipeline/stage2-fusion.ts` |
| `SPECKIT_BATCH_LEARNED_FEEDBACK` | `true` | boolean | Weekly batch feedback learning pipeline (REQ-D4-004). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_RELATIONS` | `true` | boolean | Relational learning from correction events. Graduated ON. | `lib/learning/corrections.ts` |
| `SPECKIT_CONSUMPTION_LOG` | `true` | boolean | Agent consumption event logging for analysis (G-NEW-2). Graduated ON. | `lib/telemetry/consumption-logger.ts` |
| `SPECKIT_USAGE_RANKING` | `true` | boolean | Usage-weighted ranking signal (Phase D T036). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_SIGNAL_VOCAB` | `true` | boolean | Signal vocabulary detection for trigger matching. Graduated ON. | `lib/parsing/trigger-matcher.ts` |
| `SPECKIT_SAVE_QUALITY_GATE` | `true` | boolean | Pre-storage quality gate for memory saves. Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS` | `true` | boolean | Short-critical quality gate exception for decision context types (REQ-D4-003). Graduated ON. | `lib/search/search-flags.ts`, `lib/validation/save-quality-gate.ts` |
| `SPECKIT_QUALITY_LOOP` | `true` | boolean | Verify-fix-verify memory quality loop (T008). Graduated ON. | `lib/search/search-flags.ts` |
<!-- /ANCHOR:feedback-learning -->

---

<!-- ANCHOR:governance-scope -->
## 10. GOVERNANCE AND SCOPE

| Variable | Default | Type | Description | Source |
|----------|---------|------|-------------|--------|
| `SPECKIT_MEMORY_ROADMAP_PHASE` | `scope-governance` | string | Active memory roadmap phase: `baseline`, `lineage`, `graph`, `adaptive`, `scope-governance`. | `lib/config/capability-flags.ts` |
| `SPECKIT_MEMORY_LINEAGE_STATE` | `true` | boolean | Lineage state tracking capability. Graduated ON. | `lib/config/capability-flags.ts` |
| `SPECKIT_MEMORY_GRAPH_UNIFIED` | `true` | boolean | Graph unified capability for roadmap tracking. Graduated ON. | `lib/config/capability-flags.ts` |
| `SPECKIT_MEMORY_ADAPTIVE_RANKING` | `false` | boolean | Adaptive ranking capability. **Default OFF**: opt-in. | `lib/config/capability-flags.ts` |
| `SPECKIT_RETENTION_SWEEP` | `true` | boolean | Governed memory retention sweep. Graduated ON; set `false` to disable the background interval. Manual `memory_retention_sweep` remains available. | `lib/session/session-manager.ts` |
| `SPECKIT_RETENTION_SWEEP_INTERVAL_MS` | `3600000` | number | Background retention sweep interval in milliseconds. Values must be positive integers; invalid values fall back to one hour. | `lib/session/session-manager.ts` |
<!-- /ANCHOR:governance-scope -->

---

<!-- ANCHOR:ux-formatting -->
## 11. UX AND RESPONSE FORMATTING

| Variable | Default | Type | Description | Source |
|----------|---------|------|-------------|--------|
| `SPECKIT_CONTEXT_HEADERS` | `true` | boolean | Contextual tree headers for Stage 4 result enrichment. Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_PROGRESSIVE_DISCLOSURE_V1` | `true` | boolean | Progressive disclosure: summary layer + snippet + cursor pagination (REQ-D5-005). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_SESSION_RETRIEVAL_STATE_V1` | `true` | boolean | Cross-turn retrieval session state for dedup and goal-aware refinement (REQ-D5-006). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_EMPTY_RESULT_RECOVERY_V1` | `true` | boolean | Empty/weak result recovery UX with diagnostic payload (REQ-D5-001). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_RESULT_CONFIDENCE_V1` | `true` | boolean | Per-result calibrated confidence scoring (REQ-D5-004). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_RESULT_EXPLAIN_V1` | `true` | boolean | Two-tier result explainability (REQ-D5-002). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_RESULT_EXPLAIN_DEBUG` | `false` | boolean | Detailed debug-level result explainability. Opt-in: set `true` to enable. | `formatters/search-results.ts` |
| `SPECKIT_RESPONSE_PROFILE_V1` | `true` | boolean | Mode-aware response profile formatting (REQ-D5-003). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_RESPONSE_TRACE` | `false` | boolean | Include full retrieval trace in search responses. Opt-in: set `true` to enable. | `handlers/memory-search.ts` |
<!-- /ANCHOR:ux-formatting -->

---

<!-- ANCHOR:eval-telemetry -->
## 12. EVALUATION AND TELEMETRY

| Variable | Default | Type | Description | Source |
|----------|---------|------|-------------|--------|
| `SPECKIT_ABLATION` | `false` | boolean | Enable ablation study framework. Opt-in: set `true` to enable. | `lib/eval/ablation-framework.ts` |
| `SPECKIT_EVAL_LOGGING` | `false` | boolean | Enable evaluation event logging. Opt-in: set `true` to enable. | `lib/eval/eval-logger.ts`, `handlers/quality-loop.ts` |
| `SPECKIT_DASHBOARD_LIMIT` | `10000` | number | Maximum row limit for reporting dashboard queries. | `lib/eval/reporting-dashboard.ts` |
| `SPECKIT_EXTENDED_TELEMETRY` | `false` | boolean | Detailed retrieval metrics collection (latency breakdown, quality scores). Opt-in: set `true` to enable. | `lib/telemetry/retrieval-telemetry.ts` |
| `SPECKIT_DEBUG_INDEX_SCAN` | `false` | boolean | Include debug file counts in index scan results. Opt-in: set `true` to enable. | `handlers/memory-index.ts` |

### Conditional warm-start bundle (013)

- Toggle: `SPECKIT_WARM_START_BUNDLE`
- Default: `false`
- Rollout gate: only enable after the frozen corpus benchmark shows combined configuration dominates baseline and component-only variants on lower cost with equal-or-better pass rate.
- Spec: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-warm-start-bundle-conditional-validation/spec.md`
<!-- /ANCHOR:eval-telemetry -->

---

<!-- ANCHOR:indexing -->
## 13. INDEXING

| Variable | Default | Type | Description | Source |
|----------|---------|------|-------------|--------|
| `SPECKIT_INDEX_SPEC_DOCS` | `true` | boolean | Enable spec document indexing. Set `false` to disable. | `handlers/memory-index-discovery.ts` |
| `SPECKIT_INDEX_SCAN_LEASE_EXPIRY_MS` | (internal) | number | Lease expiry timeout in milliseconds for index scan operations. | `core/db-state.ts` |
| `SPECKIT_ENCODING_INTENT` | `true` | boolean | Encoding-intent capture at index time (R16). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_ONTOLOGY_HOOKS` | `true` | boolean | Ontology-guided extraction validation hooks (Phase D T036). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_ONTOLOGY_SCHEMA` | (built-in) | string | Custom JSON ontology schema for extraction validation. | `lib/extraction/ontology-hooks.ts` |
| `SPECKIT_EXTRACTION` | `true` | boolean | Entity/relation extraction pipeline. Graduated ON. | `lib/search/search-flags.ts` (via tests) |
| `SPECKIT_FILE_WATCHER` | `false` | boolean | Real-time file watcher for markdown reindexing. **Default OFF**: opt-in. Honors ROLLOUT_PERCENT. | `lib/search/search-flags.ts` |
<!-- /ANCHOR:indexing -->

---

<!-- ANCHOR:reranker -->
## 14. RERANKER

When `VOYAGE_API_KEY` is present and local reranking is not forced, the default remote reranker resolves to Voyage `rerank-2.5`. Users without API keys still keep the existing local fallback paths.

| Variable | Default | Type | Description | Source |
|----------|---------|------|-------------|--------|
| `SPECKIT_RERANKER_MODEL` | (auto) | string | Custom GGUF model path for local reranker. | `lib/search/local-reranker.ts` |
| `SPECKIT_RERANKER_TIMEOUT_MS` | `30000` | number | Timeout in milliseconds for reranker model inference. | `lib/search/local-reranker.ts` |
<!-- /ANCHOR:reranker -->

---

<!-- ANCHOR:embedding -->
## 15. EMBEDDING

Embedding provider selection stays auto-detected unless you force it. In `EMBEDDINGS_PROVIDER=auto`, the runtime prefers Voyage `voyage-4` (1024 dims) when `VOYAGE_API_KEY` is present, then OpenAI `text-embedding-3-small` (1536 dims) when `OPENAI_API_KEY` is present, and otherwise falls back to the local Hugging Face profile (768 dims). If you override only `SPEC_KIT_DB_DIR` / `SPECKIT_DB_DIR`, the sqlite filename is derived automatically from that active profile.

| Variable | Default | Type | Description | Source |
|----------|---------|------|-------------|--------|
| `SPECKIT_EMBEDDING_CIRCUIT_BREAKER` | `true` | boolean | Circuit breaker for embedding model failures. Graduated ON. | `shared/embeddings.ts` |
| `SPECKIT_EMBEDDING_CB_THRESHOLD` | `3` | number | Consecutive failure count before circuit breaker opens. | `shared/embeddings.ts` |
| `SPECKIT_EMBEDDING_CB_COOLDOWN_MS` | `60000` | number | Cooldown period in ms before circuit breaker resets (min 1000). | `shared/embeddings.ts` |
<!-- /ANCHOR:embedding -->

---

<!-- ANCHOR:roadmap-phase-control -->
## 16. ROADMAP PHASE CONTROL

These variables control the live memory roadmap snapshot.

| Variable | Default | Type | Description |
|----------|---------|------|-------------|
| `SPECKIT_MEMORY_ROADMAP_PHASE` | `scope-governance` | string | Active roadmap phase. |
| `SPECKIT_MEMORY_LINEAGE_STATE` | `true` | boolean | Lineage tracking. |
| `SPECKIT_MEMORY_GRAPH_UNIFIED` | `true` | boolean | Graph unified mode. |
| `SPECKIT_MEMORY_ADAPTIVE_RANKING` | `false` | boolean | Adaptive ranking (opt-in). |
<!-- /ANCHOR:roadmap-phase-control -->

---

<!-- ANCHOR:deprecated -->
## 17. DEPRECATED

These variables are no longer active but may still appear in compatibility code.

| Variable | Status | Replacement | Notes |
|----------|--------|-------------|-------|
| `SPECKIT_EAGER_WARMUP` | **Deprecated** | (removed) | Embedding model now uses lazy loading only. Compatibility flag. |
| `SPECKIT_LAZY_LOADING` | **Deprecated** | (removed) | Lazy loading is always enabled. Compatibility flag. |
| `SPECKIT_SHADOW_SCORING` | **Deprecated** | `SPECKIT_SHADOW_FEEDBACK` | Shadow scoring flag removed. Shadow evaluation uses SHADOW_FEEDBACK. |
| `SPECKIT_RSF_FUSION` | **Deprecated** | `SPECKIT_RRF` | Referenced in tests only. Legacy alias. |
<!-- /ANCHOR:deprecated -->

---

<!-- ANCHOR:quick-start -->
## 18. QUICK START EXAMPLES

### Disable a Graduated Feature

```bash
# Disable graph signals
export SPECKIT_GRAPH_SIGNALS=false

# Disable the quality gate
export SPECKIT_SAVE_QUALITY_GATE=false
```

### Enable an Opt-in Feature

```bash
# Enable ablation studies
export SPECKIT_ABLATION=true

# Enable extended telemetry
export SPECKIT_EXTENDED_TELEMETRY=true

# Enable adaptive roadmap capability metadata
export SPECKIT_MEMORY_ADAPTIVE_RANKING=true
```

### Tune Numeric Parameters

```bash
# Set aggressive graph calibration
export SPECKIT_CALIBRATION_PROFILE_NAME=aggressive

# Custom graph weight cap
export SPECKIT_GRAPH_WEIGHT_CAP=0.20

# Increase RRF smoothing
export SPECKIT_RRF_K=80

# Lower recency fusion impact
export SPECKIT_RECENCY_FUSION_WEIGHT=0.03
export SPECKIT_RECENCY_FUSION_CAP=0.05
```

### Reduce Feature Surface for Debugging

```bash
# Minimal config: disable most graduated features
export SPECKIT_GRAPH_UNIFIED=false
export SPECKIT_COMMUNITY_DETECTION=false
export SPECKIT_ENTITY_LINKING=false
export SPECKIT_HYDE=false
export SPECKIT_LLM_REFORMULATION=false
export SPECKIT_CROSS_ENCODER=false
```
<!-- /ANCHOR:quick-start -->

---

*Generated from source code analysis. Last updated: 2026-04-01.*
