---
title: "Spec Kit Memory: Feature Catalog"
description: "Unified reference combining the complete system feature inventory and the refinement program changelog for the Spec Kit Memory MCP server."
---

# Spec Kit Memory: Feature Catalog

This document combines two complementary views of the Spec Kit Memory system into a single reference. The **System Reference** sections describe what the runtime and adjacent Spec Kit workflows are today: live MCP tools, pipeline stages, verification surfaces, and the supporting phase-workflow scripts that ship with the same skill package. The **Refinement Program** section describes what was changed and why: every improvement delivered across the refinement program, with ticket IDs and implementation details.

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1-overview)
- [2. RETRIEVAL](#2-retrieval)
- [3. MUTATION](#3-mutation)
- [4. DISCOVERY](#4-discovery)
- [5. MAINTENANCE](#5-maintenance)
- [6. LIFECYCLE](#6-lifecycle)
- [7. ANALYSIS](#7-analysis)
- [8. EVALUATION](#8-evaluation)
- [9. BUG FIXES AND DATA INTEGRITY](#9-bug-fixes-and-data-integrity)
- [10. EVALUATION AND MEASUREMENT](#10-evaluation-and-measurement)
- [11. GRAPH SIGNAL ACTIVATION](#11-graph-signal-activation)
- [12. SCORING AND CALIBRATION](#12-scoring-and-calibration)
- [13. QUERY INTELLIGENCE](#13-query-intelligence)
- [14. MEMORY QUALITY AND INDEXING](#14-memory-quality-and-indexing)
- [15. PIPELINE ARCHITECTURE](#15-pipeline-architecture)
- [16. RETRIEVAL ENHANCEMENTS](#16-retrieval-enhancements)
- [17. TOOLING AND SCRIPTS](#17-tooling-and-scripts)
- [18. GOVERNANCE](#18-governance)
- [19. FEATURE FLAG REFERENCE](#19-feature-flag-reference)
- [20. REMEDIATION REVALIDATION](#20-remediation-revalidation)
- [21. IMPLEMENT AND REMOVE DEPRECATED FEATURES](#21-implement-and-remove-deprecated-features)
- [22. CONTEXT PRESERVATION AND CODE GRAPH](#22-context-preservation-and-code-graph)

---

## 1. OVERVIEW

Use this catalog as the canonical inventory for both current behavior and delivered refinements. The numbered sections below group the live system by capability area so operators can move from the top-level reference into the per-feature files without losing implementation, validation, or rollout context.

### Audit Phase Coverage Notes (020-022)

| Audit phase | Catalog coverage |
|---|---|
| `020-feature-flag-reference` | Covered by [`19--feature-flag-reference/`](19--feature-flag-reference/01-1-search-pipeline-features-speckit.md) via slug match (`feature-flag-reference`). See [`19--feature-flag-reference/08-audit-phase-020-mapping-note.md`](19--feature-flag-reference/08-audit-phase-020-mapping-note.md). |
| `021-remediation-revalidation` | Covered as cross-category remediation records (for example: [08--bug-fixes-and-data-integrity/06](08--bug-fixes-and-data-integrity/06-guards-and-edge-cases.md), [14--pipeline-architecture/07](14--pipeline-architecture/07-search-pipeline-safety.md), [16--tooling-and-scripts/05](16--tooling-and-scripts/05-code-standards-alignment.md)). See [`20--remediation-revalidation/01-category-stub.md`](20--remediation-revalidation/01-category-stub.md). |
| `022-implement-and-remove-deprecated-features` | Covered by implementation/deprecation closure records ([16--tooling-and-scripts/04](16--tooling-and-scripts/04-dead-code-removal.md), [17--governance/02](17--governance/02-feature-flag-sunset-audit.md)). See [`21--implement-and-remove-deprecated-features/01-category-stub.md`](21--implement-and-remove-deprecated-features/01-category-stub.md). |

### Command-Surface Contract

The Spec Kit Memory MCP server exposes **43 tools** overall across the 7-layer MCP surface. The command layer wraps the memory-focused subset under **4 top-level memory slash commands** plus the `/memory:manage shared` subcommand namespace, with session recovery still owned by `/spec_kit:resume` as a spec-folder workflow using the memory/session recovery stack. Each command declares its allowed tools in frontmatter; tools not listed are inaccessible to that command. The canonical source for primary tool ownership is the coverage matrix in `.opencode/command/memory/README.txt`, while each command file's `allowed-tools` frontmatter shows the full operational surface. Recovery behavior is documented in `.opencode/command/spec_kit/resume.md`.

| Command | Tools | Ownership | Tool Names |
|---------|-------|-----------|------------|
| `/memory:search` | 13 | owns | `memory_context`, `memory_quick_search`, `memory_search`, `memory_match_triggers`, `task_preflight`, `task_postflight`, `memory_drift_why`, `memory_causal_link`, `memory_causal_stats`, `memory_causal_unlink`, `eval_run_ablation`, `eval_reporting_dashboard`, `memory_get_learning_history` |
| `/memory:learn` | 6 | shared | `memory_save`, `memory_search`, `memory_stats`, `memory_list`, `memory_delete`, `memory_index_scan` |
| `/memory:manage` | 19 primary + 1 helper | owns + borrows | Primary home: `memory_stats`, `memory_list`, `memory_index_scan`, `memory_validate`, `memory_update`, `memory_delete`, `memory_bulk_delete`, `memory_health`, `checkpoint_create`, `checkpoint_restore`, `checkpoint_list`, `checkpoint_delete`, `memory_ingest_start`, `memory_ingest_status`, `memory_ingest_cancel`; helper access: `memory_search` |
| `/memory:save` | 4 | shared | `memory_save`, `memory_index_scan`, `memory_stats`, `memory_update` |
| `/memory:manage shared` | 4 | subcommand namespace | `shared_space_upsert`, `shared_space_membership_set`, `shared_memory_status`, `shared_memory_enable` |
| `/spec_kit:resume` | broader helper surface | shared | Primary recovery chain: `memory_context`, `memory_search`, `memory_list`; wrapper also allows `memory_stats`, `memory_match_triggers`, `memory_delete`, `memory_update`, plus health, indexing, validation, checkpoint, and CocoIndex helpers |

**Owns** means the command is the primary home for those tools. **Shared** means the command borrows tools whose primary home is another command (typically `/memory:search` or `/memory:manage`).

---

## 2. RETRIEVAL

### Unified context retrieval (memory_context)

#### Description

When you ask the system a question, it figures out what kind of help you need and automatically picks the best way to find the answer. Think of it like a smart librarian who reads your request, decides whether you need a quick lookup or a deep research session and then fetches the right materials for you. Without this, you would have to manually tell the system how to search every time.

#### Current Reality

You send a query or prompt. The system figures out what you need. That is the core idea behind `memory_context`: an L1 orchestration layer that auto-detects your task intent and routes to the best retrieval strategy without you having to pick one.

Intent detection classifies your input into one of seven types (add_feature, fix_bug, refactor, security_audit, understand, find_spec, find_decision) and maps it to a retrieval mode. Five modes are available: auto (default, intent-detected routing), quick (trigger matching for fast lookups), deep (comprehensive semantic search across the full corpus), focused (intent-optimized with tighter filtering) and resume (session recovery targeting state, next-steps, summary and blocker anchors with full content included).

Each mode has a token budget. Quick gets 800 tokens. Focused gets 1,500. Deep gets 2,000. Resume gets 1,200. After retrieval, the orchestrator estimates token count (1 token per 4 characters) and enforces the budget by stripping lowest-scored results from the tail until the response fits. A dedicated `enforceTokenBudget()` function handles the truncation with detailed tracking of original and returned result counts. Auto-resume `systemPromptContext` injection now happens before that budget pass runs, so resume-mode context items count toward the advertised limit instead of being appended afterward and pushing the final envelope over budget. When your overall context is running high, a pressure policy kicks in. When the `tokenUsage` ratio exceeds 0.60, the system downgrades to focused mode. Above 0.80, it switches to quick mode. The pressure policy is gated by `SPECKIT_PRESSURE_POLICY` and subject to rollout percentage via `SPECKIT_ROLLOUT_PERCENT`. You can override the mode and intent manually, but the auto-detection handles most cases correctly.

When no `specFolder` is provided, automatic spec folder discovery attempts to identify the most relevant folder from the query text using a cached one-sentence description per spec folder. If the target folder can be identified from the description alone, the system avoids full-corpus search entirely. Discovery failure is non-fatal and falls through to the standard retrieval path. This feature runs behind the `SPECKIT_FOLDER_DISCOVERY` flag.

Session management is caller-scoped. Passing `sessionId` enables cross-turn deduplication and lets the handler resume an existing working-memory session. If you do not pass `sessionId`, the handler generates an ephemeral UUID for internal bookkeeping for that single call only. In resume mode, `systemPromptContext` is injected only when auto-resume is enabled, the effective mode resolves to `resume` and the caller supplied a reusable `sessionId`. Anonymous calls do not revive prior session context.

Retrieval telemetry records mode selection and pressure-override fallbacks for observability when extended telemetry is enabled.

#### Source Files

See [`01--retrieval/01-unified-context-retrieval-memorycontext.md`](01--retrieval/01-unified-context-retrieval-memorycontext.md) for full implementation and test file listings.

---

### Semantic and lexical search (memory_search)

#### Description

This is the main search tool. You type what you are looking for in plain language and the system searches through all stored knowledge to find the best matches. It understands meaning (not just keywords), so searching for "login problems" can find a document titled "authentication troubleshooting." Without it, you would have no way to find relevant information in the knowledge base.

#### Current Reality

This is the primary search tool, and it does a lot. You give it a natural language query (or a multi-concept array of 2-5 strings where all concepts must match), and it runs the full hybrid retrieval pipeline.

The search path is the 4-stage pipeline architecture, which is the sole runtime path. The pipeline starts with Stage 1 candidate generation, which selects search channels based on query type: multi-concept queries run per-concept embeddings, deep mode expands into up to 3 query variants, and when embedding expansion is active a baseline plus expanded-query search run in parallel. Constitutional memories are injected if none appear in the initial candidate set. Stage 2 applies all scoring signals in a single pass: session boost, causal boost, co-activation spreading, community co-retrieval from precomputed `community_assignments`, graph signals (N2a+N2b), FSRS testing effect, intent weights (for non-hybrid only, preventing G2 double-weighting), artifact routing, feedback signals (learned trigger boosts and negative feedback demotions), artifact result limiting, anchor metadata annotation and validation metadata enrichment. Stage 3 handles cross-encoder reranking and MPAB chunk-to-memory aggregation with document-order reassembly. Stage 4 filters by memory state, runs TRM evidence gap detection and enforces a score immutability invariant that prevents any score modifications after reranking.

A deep mode expands the query into up to 3 variants using `expandQuery()`, runs hybrid search for each variant in parallel and merges results with deduplication. Results are cached per parameter combination via `toolCache.withCache()`, and session deduplication runs after cache so that cache hits still respect session state.

The parameter surface is wide. You control result count (`limit`, 1-100), spec folder scoping, tier and context type filtering, intent (explicit or auto-detected), reranking toggle, length penalty, temporal decay, minimum memory state (`minState`, default `"WARM"`, range HOT through ARCHIVED), constitutional inclusion, content inclusion, anchor filtering, session dedup, session boosting, causal boosting, minimum quality threshold, cache bypass and access tracking. Most defaults are sensible. You typically send a query and a session ID and let everything else run at defaults.

Recent vector-query hardening closed three correctness gaps in the retrieval path. `multi_concept_search()` now applies the same expiry filter used by single-query search (`m.expires_at IS NULL OR m.expires_at > datetime('now')`), so expired memories no longer leak through the AND-match path. `vector_search()` validates embedding length before buffer conversion and throws `VectorIndexError(EMBEDDING_VALIDATION)` instead of surfacing raw sqlite-vec failures when callers pass malformed embeddings. It also returns early with `constitutional_results.slice(0, limit)` when constitutional injection already satisfies the requested limit, which keeps result counts deterministic and prevents the retrieval layer from returning more rows than the caller asked for.

#### Source Files

See [`01--retrieval/02-semantic-and-lexical-search-memorysearch.md`](01--retrieval/02-semantic-and-lexical-search-memorysearch.md) for full implementation and test file listings.

---

### Fast delegated search (memory_quick_search)

#### Description

This is the lightweight search entry point for callers that want the main semantic search behavior without having to set a large option surface themselves. It works like a preset: you provide a query and optional governed-scope boundaries, and the server forwards the request to the full search tool using sensible retrieval defaults.

#### Current Reality

`memory_quick_search` is a live MCP tool, not just a README alias. The dispatcher in `tools/memory-tools.ts` validates the tool's narrowed input schema and forwards the call to `memory_search` with a fixed profile: `autoDetectIntent=true`, `enableDedup=true`, `includeContent=true`, `includeConstitutional=true`, and `rerank=true`. The public arguments are intentionally narrow: `query`, `limit`, `specFolder`, `tenantId`, `userId`, `agentId`, and `sharedSpaceId`. That makes it useful for fast governed retrieval while keeping the heavyweight search configuration surface on `memory_search`.

#### Source Files

See [`01--retrieval/10-fast-delegated-search-memory-quick-search.md`](01--retrieval/10-fast-delegated-search-memory-quick-search.md) for full implementation and test file listings.

---

### Trigger phrase matching (memory_match_triggers)

#### Description

This is the speed-first search option. Instead of doing a deep analysis of your question, it matches specific phrases you type against a list of known keywords, like a phone's autocomplete. It returns results almost instantly, which makes it great for quick lookups where you already know roughly what you are looking for. Frequently used memories show up with full details while older ones appear as lightweight pointers.

#### Current Reality

When you need speed over depth, trigger matching delivers. Rather than generating embeddings and running multi-channel search, it performs direct string matching of your prompt against stored trigger phrases. The performance target is under 100ms. Think of it as the "fast path" that sacrifices recall for latency.

A governed-scope pass now runs immediately after raw trigger matching. `memory_match_triggers` accepts optional `tenantId`, `userId`, `agentId`, and `sharedSpaceId` boundaries, then looks up each match in `memory_index` and drops out-of-scope rows before cognitive enrichment begins. That closes the trigger-phrase leak where another tenant or actor's memory could surface before normal retrieval filtering kicked in.

Where this tool gets interesting is the cognitive pipeline. When you provide a session ID with `include_cognitive=true`, the system applies FSRS-based attention decay (scores degrade each turn via `0.98^(turn-1)` exponential decay), memory activation (matched memories get their attention score set to 1.0), co-activation spreading (each activated memory spreads activation to related memories through the co-occurrence graph), tier classification (maps effective retrievability to HOT, WARM, COLD, DORMANT or ARCHIVED) and tiered content injection.

Tiered content injection is the most visible effect. HOT memories return their full file content read from disk. WARM memories return the first 150 characters as a summary. COLD memories and below return no content at all. This tiering means recently active and highly relevant memories arrive with full context while dormant ones arrive as lightweight pointers.

The cognitive path fetches 2x the requested limit from the trigger matcher to give the cognitive pipeline headroom for filtering. If you request 3 results, 6 candidates enter the cognitive pipeline and the top 3 survivors are returned.

#### Source Files

See [`01--retrieval/03-trigger-phrase-matching-memorymatchtriggers.md`](01--retrieval/03-trigger-phrase-matching-memorymatchtriggers.md) for full implementation and test file listings.

---

### Hybrid search pipeline

#### Description

When you search for something, the system looks in several places at once, like checking both the index and the shelves in a library. It then combines all the results and ranks them by relevance so the best match shows up first. If the first search comes back empty, the system automatically widens its net and tries again with looser criteria so you almost never get zero results.

#### Current Reality

The engine under the hood. `hybrid-search.ts` orchestrates multi-channel retrieval with five search channels, adaptive fusion, diversity reranking and a multi-tier fallback chain. This pipeline provides the candidate generation and fusion components used by Stage 1 of the 4-stage pipeline (the sole runtime path since the legacy V1 path was removed in Phase 017).

Five channels feed the pipeline. Vector search (cosine similarity via sqlite-vec, base weight 1.0) is the primary semantic signal. FTS5 (SQLite full-text search with weighted BM25, base weight 0.3) captures keyword matches the embedding might miss. In-memory BM25 (base weight 0.6, gated by `ENABLE_BM25`, default ON) provides broader coverage with a different tokenization approach. Graph search (causal edge traversal, base weight 0.5) finds structurally related memories through the causal graph. Degree search (connectivity scoring, base weight 0.4, gated by `SPECKIT_DEGREE_BOOST`, default ON) re-ranks by hub score via `computeDegreeScores()` with logarithmic normalization and a hard cap of 50.

Adaptive fusion replaces hardcoded channel weights with intent-aware profiles. The `hybridAdaptiveFuse()` function selects weights based on the detected query intent, so a "fix_bug" query weights channels differently than a "find_spec" query. Results from all channels merge through `fuseResultsMulti()` using Reciprocal Rank Fusion.

Five operational stages run between fusion and delivery. Stage A (query complexity routing, `SPECKIT_COMPLEXITY_ROUTER`) restricts active channels for simple queries to just vector and FTS, moderate queries add BM25 and complex queries get all five. Stage B (`SPECKIT_RSF_FUSION`) is a retired shadow-only placeholder. The dead runtime RSF branch was removed, so live ranking never executes RSF; remaining references exist only for compatibility, isolated testing and shadow/eval documentation. Stage C (channel enforcement, `SPECKIT_CHANNEL_MIN_REP`) ensures every contributing channel has at least one result in top-k with a 0.005 quality floor. Stage D (confidence truncation, `SPECKIT_CONFIDENCE_TRUNCATION`) trims the irrelevant tail using a 2x-median gap elbow heuristic. Stage E (dynamic token budget, `SPECKIT_DYNAMIC_TOKEN_BUDGET`) computes tier-aware token limits (simple 1,500, moderate 2,500, complex 4,000).

After these stages, Maximal Marginal Relevance reranking promotes result diversity using intent-specific lambda values (from `INTENT_LAMBDA_MAP`, default 0.7). Co-activation spreading takes the top 5 results, traverses the co-activation graph for up to 2 hops and uses the returned activation scores in Stage 2. Stage 2 then applies the configured `SPECKIT_COACTIVATION_STRENGTH` multiplier and the same `1 / sqrt(max(1, relatedCount))` fan-effect divisor used by the helper path before synchronizing all live score aliases (`score`, `rrfScore`, `intentAdjustedScore`) and resorting the result set. Session boost likewise preserves the original working-memory `attentionScore` signal and records the boosted ranking value separately in `sessionBoostScore`.

The fallback chain (`searchWithFallback()`) provides resilience. When `SPECKIT_SEARCH_FALLBACK` is enabled, the default path is a three-tier degradation flow: Tier 1 primary retrieval (default minimum similarity 0.3), Tier 2 widened retrieval at 0.1 inside the caller-allowed channel set, and Tier 3 structural SQL search as last resort for still-allowed lexical channels. Tier 3 now excludes archived rows unless `includeArchived=true`, closing the fallback-only leak that could reintroduce archived memories after earlier stages had filtered them. When `SPECKIT_SEARCH_FALLBACK` is disabled, the legacy two-pass path is used (0.3 then 0.17). The system is designed to avoid empty returns except on hard failures.

#### Source Files

See [`01--retrieval/04-hybrid-search-pipeline.md`](01--retrieval/04-hybrid-search-pipeline.md) for full implementation and test file listings.

---

### 4-stage pipeline architecture

#### Description

Every search goes through four steps, like an assembly line. First, gather candidates. Second, score and rank them. Third, re-check the ranking for accuracy. Fourth, filter out anything that does not belong. Each step has one clear job and is not allowed to change results from earlier steps. This structure keeps searches predictable and prevents bugs from sneaking in between stages.

#### Current Reality

The pipeline refactor (R6) restructures the retrieval flow into four bounded stages with clear responsibilities and a strict score-immutability invariant in the final stage.

Stage 1 (Candidate Generation) executes search channels based on query type. Multi-concept queries generate one embedding per concept. Deep mode expands into up to 3 query variants via `expandQuery()`. When embedding expansion is active and R15 does not classify the query as "simple", a baseline and expanded-query search run in parallel with deduplication. Constitutional memory injection appends up to 5 constitutional rows when none appear in the initial candidate set, and that injection path now keys scope checks off `shouldApplyScopeFiltering` so global scope enforcement is honored even without caller-supplied governance scope. Deep-mode reformulation and HyDE branches re-enter the same post-search guardrails as primary candidates before merge, so scope, tier, `contextType` and `qualityThreshold` filters are applied uniformly across expansion channels.

Stage 2 (Fusion and Signal Integration) is the single authoritative scoring point. The current runtime order is: session boost, causal boost, co-activation spreading, community co-retrieval from precomputed `community_assignments`, graph signals (N2a momentum + N2b depth), FSRS testing effect (when `trackAccess=true`), intent weights (non-hybrid only, preventing G2 double-weighting), artifact routing weight boosts, feedback signals (learned trigger boosts and negative feedback demotions), artifact result limiting, anchor metadata annotation (S2) and validation metadata enrichment with a bounded multiplier clamped to 0.8-1.2 (S3). Session boost now preserves the original working-memory `attentionScore` signal and stores the boosted ranking value separately in `sessionBoostScore`, while co-activation spreading writes its boost back to all score aliases before the reranked set is resorted. The G2 prevention is structural: an `isHybrid` boolean computed once at the top of Stage 2 gates the intent weight step, so the code path for intent weights is absent when hybrid search already applied them during RRF fusion.

Stage 3 (Rerank and Aggregate) handles cross-encoder reranking (optional, gated by `SPECKIT_CROSS_ENCODER`) and MPAB chunk collapse with parent reassembly. Chunks are grouped by parent ID, the best chunk per group is elected by score, and full parent content is loaded from the database. The reassembly helper now accepts both snake_case and camelCase chunk metadata (`parent_id`/`parentId`, `chunk_index`/`chunkIndex`, `chunk_label`/`chunkLabel`), so formatter-style rows still collapse back to their parent correctly. On DB failure, the best-chunk row is emitted as a fallback. Non-chunks and reassembled parents merge and sort descending by effective score.

Stage 4 (Filter and Annotate) enforces a "no score changes" invariant through dual enforcement. At compile time, `Stage4ReadonlyRow` declares all six score fields as `Readonly`, making assignment a TypeScript error. At runtime, `captureScoreSnapshot()` records all scores before operations and `verifyScoreInvariant()` checks them afterward, throwing a `[Stage4Invariant]` error on any mismatch. Within this invariant, Stage 4 applies memory state filtering (removing rows below `config.minState` with optional per-tier hard limits), evidence gap detection via TRM Z-score analysis and annotation metadata for feature flags and state statistics. Session deduplication is explicitly excluded from Stage 4 and runs post-cache in the handler to avoid double-counting.

The pipeline is the sole runtime path. The legacy `postSearchPipeline` was removed in Phase 017, and `SPECKIT_PIPELINE_V2` is no longer consumed by runtime code.

#### Source Files

See [`01--retrieval/05-4-stage-pipeline-architecture.md`](01--retrieval/05-4-stage-pipeline-architecture.md) for full implementation and test file listings.

---

### BM25 trigger phrase re-index gate

#### Description

When you change the keywords associated with a memory, the search index now updates itself to reflect those changes. Previously it only refreshed when you changed the title, so updated keywords were invisible to searches until a full rebuild. This fix makes sure the system stays in sync with your edits.

#### Current Reality

The BM25 re-index condition in `memory-crud-update.ts` was expanded from title-only to title OR trigger phrases: `if ((updateParams.title !== undefined || updateParams.triggerPhrases !== undefined) && bm25Index.isBm25Enabled())`. The BM25 corpus includes trigger phrases, so changes to either field must trigger re-indexing.

#### Source Files

See [`01--retrieval/06-bm25-trigger-phrase-re-index-gate.md`](01--retrieval/06-bm25-trigger-phrase-re-index-gate.md) for full implementation and test file listings.

---

### AST-level section retrieval tool

#### Description

This planned feature would let you pull out a single section from a large document by its heading, like opening a book directly to the chapter you need instead of flipping through the whole thing. It is not built yet because current documents are small enough that fetching the whole file works fine.

#### Current Reality

**ROADMAP ONLY.** `read_spec_section(filePath, heading)` via Markdown AST parsing (`remark`) is still deferred until spec docs routinely exceed ~1000 lines. Existing anchor-aware thinning remains the current approach, so this is not part of the current runtime surface.

**Status: PLANNED / NOT YET IMPLEMENTED** — This tool is documented as a planned capability but is not registered in the live MCP tool registry (`tool-schemas.ts`). It does not appear in the exported tool list.

#### Source Files

No source files yet. This feature is planned but not yet implemented.

See [`01--retrieval/07-ast-level-section-retrieval-tool.md`](01--retrieval/07-ast-level-section-retrieval-tool.md) for full feature details.

---

### Quality-aware 3-tier search fallback

#### Description

If your search does not find good results on the first try, the system automatically tries again with wider criteria instead of giving up. Think of it like asking a store clerk for a specific item. If they cannot find it on the first shelf, they check the back room and then the warehouse. You almost never walk away empty-handed.

#### Current Reality

Adaptive search degradation chain in `searchWithFallbackTiered()`. Tier 1: enhanced hybrid search (minSimilarity=0.3, standard channels). Quality check via `checkDegradation()`: fails if topScore < 0.02 AND relativeGap < 0.2, OR resultCount < 3. On fail, Tier 2: widened search (minSimilarity=0.1) within the caller-allowed channel set instead of forcing disabled channels back on. Same quality check. On fail, Tier 3: structural SQL fallback (ORDER BY importance_tier, importance_weight) for still-allowed lexical channels, with archived rows excluded unless explicitly requested. Tier 3 scores are calibrated to max 50% of existing top score to prevent outranking semantic hits. Degradation events are attached as non-enumerable `_degradation` property on the result set. Gated by `SPECKIT_SEARCH_FALLBACK` (default: true, graduated).

#### Source Files

See [`01--retrieval/08-quality-aware-3-tier-search-fallback.md`](01--retrieval/08-quality-aware-3-tier-search-fallback.md) for full implementation and test file listings.

> **Playbook:** [109](../manual_testing_playbook/manual_testing_playbook.md)

---

### Tool-result extraction to working memory

#### Description

When the system finds something useful during a search, it keeps a mental note of it for the rest of your session. That way, if you ask a follow-up question a few turns later, the system still remembers what it found earlier. These notes gradually fade over time so the most recent findings stay prominent while older ones quietly step aside.

#### Current Reality

The working memory module (`lib/cognitive/working-memory.ts`) captures salient results from tool invocations and stores them as session-scoped attention items. When a retrieval tool returns results, the system extracts key findings and inserts them into the `working_memory` table with an attention score. These extracted items persist across turns within the same session, enabling cross-turn context continuity.

The checkpoint module (`lib/storage/checkpoints.ts`) also participates by preserving working memory state during checkpoint creation so that restored sessions retain their accumulated tool-result context. Attention scores decay with an event-distance model (0.85 per event elapsed) with a floor of 0.05 and explicit eviction at 0.01, ensuring that recent tool results remain prominent while older ones gracefully fade.

#### Source Files

See [`01--retrieval/09-tool-result-extraction-to-working-memory.md`](01--retrieval/09-tool-result-extraction-to-working-memory.md) for full implementation and test file listings.

---

### Session recovery via /spec_kit:resume

#### Description

When a session is interrupted by a crash, context compaction, timeout, or an ordinary cross-session handoff, this command reconstructs the most likely previous session state and routes the user to the best next step. It uses `memory_context` in resume mode as the primary interrupted-session recovery path, with a fallback chain through crash-recovery breadcrumbs, anchored memory search, and recent-candidate discovery.

#### Current Reality

**SHIPPED.** `/spec_kit:resume` owns session recovery and continuation. Its primary recovery chain relies on 3 shared memory tools: `memory_context`, `memory_search`, and `memory_list`. `memory_stats` remains diagnostic/helper access, and the live wrapper also permits `memory_match_triggers`, `memory_delete`, `memory_update`, health, indexing, validation, checkpoint, and CocoIndex helpers that support the broader recovery workflow.

The primary recovery path calls `memory_context` in `resume` mode with anchors targeting `state`, `next-steps`, `summary`, and `blockers`. Resume mode uses a 1200-token budget with `minState=WARM`, `includeContent=true`, dedup and decay both disabled.

Two recovery modes are available: **auto** resolves the strongest session candidate with minimal prompting, and **confirm** presents alternatives when multiple recent folders look plausible or confidence is low.

The recovery chain prioritizes: (1) fresh `handover.md` when present, (2) `memory_context` in resume mode, (3) `CONTINUE_SESSION.md` crash breadcrumb, (4) anchored `memory_search` for thin summaries, (5) `memory_list` for recent-candidate discovery, and (6) user confirmation as final fallback.

After recovery, the command continues directly inside `/spec_kit:resume` for structured spec-folder work or routes to `/memory:search history` for broader historical analysis, depending on user intent.

#### Source Files

| File | Role |
|------|------|
| `.opencode/command/spec_kit/resume.md` | `/spec_kit:resume` command definition with continuation and recovery workflows |

See [`01--retrieval/11-session-recovery-spec-kit-resume.md`](01--retrieval/11-session-recovery-spec-kit-resume.md) for full details.

---

## 3. MUTATION

This section documents 10 mutation features.

### Memory indexing (memory_save)

#### Description

This is how you add new knowledge to the system. You point it at a file and it reads, understands and stores the content so it becomes searchable. Before storing, it checks whether the same information already exists and decides whether to add it fresh, update an older version or skip it entirely. Quality checks catch low-value content before it clutters up the knowledge base.

#### Current Reality

`memory_save` is the entry point for getting content into the memory system. You give it a file path. It reads the file, parses metadata from the frontmatter (title, trigger phrases, spec folder, importance tier, context type, causal links), generates a vector embedding and indexes everything into the SQLite database.

Before embedding generation, content normalization strips structural markdown noise. Seven primitives (frontmatter, anchors, HTML comments, code fences, tables, lists, headings) run in sequence to produce cleaner text for the embedding model. BM25 has a separate normalization entry point (`normalizeContentForBM25`) that currently delegates to the embedding normalizer, and it is used on rebuild-from-database paths. In live save paths, raw content is passed to BM25 tokenization (`addDocument`) before tokenizer normalization.

The interesting part is what happens before the record is created. A Prediction Error (PE) gating system compares the new content against existing memories via cosine similarity and decides one of five actions. CREATE stores a new record when no similar memory exists. REINFORCE boosts the FSRS stability of an existing duplicate without creating a new entry (the system already knows this, so it strengthens the memory). UPDATE overwrites an existing high-similarity memory in-place when the new version supersedes the old. SUPERSEDE marks the old memory as deprecated, creates a new record and links them with a causal edge. CREATE_LINKED stores a new memory with a relationship edge to a similar but distinct existing memory.

A three-layer quality gate runs before storage when `SPECKIT_SAVE_QUALITY_GATE` is enabled (default ON). Layer 1 validates structure (title exists, content at least 50 characters, valid spec folder path). Layer 2 scores content quality across five dimensions (title, triggers, length, anchors, metadata) against a 0.4 signal density threshold. Layer 3 checks semantic deduplication via cosine similarity, rejecting near-duplicates above 0.92. A warn-only mode runs for the first 14 days after activation, logging would-reject decisions without blocking saves.

When `SPECKIT_QUALITY_LOOP=true`, the save path also runs a verify-fix-verify loop before storage. The runtime performs one initial evaluation and then up to 2 immediate auto-fix retries by default. The reported `attempts` count is the actual number of evaluations used, so early-break cases do not claim the full configured retry budget. Accepted saves persist quality-loop metadata fixes, while rewritten body content stays in-memory until later hard-reject gates clear under the per-spec-folder lock. If the loop rejects the save, `indexMemoryFile()` returns `status: 'rejected'`, and `atomicSaveMemory()` rolls back the just-written file instead of retrying indexing again.

Two earlier hard-blocks now sit between the quality loop and the older pre-storage quality gate. First, a shared semantic sufficiency evaluator rejects thin aligned memories with `INSUFFICIENT_CONTEXT_ABORT`. Second, a rendered-memory template contract validator rejects malformed outputs when required frontmatter keys, mandatory section anchors/HTML ids, or cleanup invariants are missing, or when raw Mustache/template artifacts leak into the final markdown. Dry-run responses can surface these rejection reasons without indexing side effects.

Reconsolidation-on-save runs after embedding generation only when `SPECKIT_RECONSOLIDATION=true` (default OFF). The system checks the top-3 most similar memories in the same spec folder. Similarity at or above 0.88 triggers a merge where content is combined and `importance_weight` is boosted (capped at 1.0). Similarity between 0.75 and 0.88 triggers conflict resolution: the old memory is deprecated and a `supersedes` causal edge is created. Below 0.75, the memory stores unchanged. A checkpoint must exist for the spec folder before reconsolidation can run.

For large files exceeding the chunking threshold, the system splits into a parent record (metadata only) plus child chunk records, each with its own embedding. Before indexing, anchor-aware chunk thinning scores each chunk using a composite of anchor presence (weight 0.6, binary) and content density (weight 0.4, 0-1). Chunks scoring below 0.3 are dropped to reduce storage and search noise. The thinning never returns an empty array. Chunk embedding cache keys now hash normalized content, matching the main embedding path, so structurally equivalent chunks reuse the same cache entry.

When `SPECKIT_ENCODING_INTENT` is enabled (default ON), the content type is classified at index time as `document`, `code` or `structured_data` using heuristic scoring against a 0.4 threshold. The classification is stored as read-only metadata on the `encoding_intent` column for both parent records and individual chunks. This metadata has no retrieval-time scoring impact yet. It builds a labeled dataset for future type-aware retrieval.

After every successful save, a consolidation cycle hook fires when `SPECKIT_CONSOLIDATION` is enabled (default ON). The N3-lite consolidation engine scans for contradictions (memory pairs above 0.85 cosine similarity with negation keyword conflicts), runs Hebbian strengthening on recently accessed edges (+0.05 per cycle with a 30-day decay), detects stale edges (unfetched for 90+ days) and enforces edge bounds (maximum 20 per node). The cycle runs on a weekly cadence.

The `asyncEmbedding` parameter (boolean, default `false`) enables non-blocking saves. When set to `true`, embedding generation is deferred: the memory record is written immediately with a `pending` embedding status, and an async background attempt generates the embedding afterward. The memory is immediately searchable via BM25 and FTS5 while the embedding processes. When `false` (the default), the save blocks until embedding generation completes before returning. Watcher- and ingest-driven reindex paths no longer force deferred embeddings on ordinary cache misses. They follow this normal synchronous path unless `asyncEmbedding: true` was explicitly requested or embedding generation actually fails.

Safety mechanisms run deep. Path security validation checks the file against an allowlist of base paths. File type validation accepts only `.md` and `.txt` in approved directories. Pre-flight validation checks anchor format, detects duplicates and estimates token budget before investing in embedding generation. A per-spec-folder mutex lock prevents TOCTOU race conditions when multiple saves target the same folder. SHA-256 content hashing skips same-path saves only when the existing row is in a healthy state (`success`, `pending`, or valid chunked-parent `partial`), so unhealthy rows still re-enter indexing. Cross-path hash dedup also accepts chunked parents in `partial` state and ignores invalid parent rows marked `complete`. A mutation ledger records every create, update, reinforce and supersede action for audit. The trigger matcher cache, tool cache and constitutional cache are all invalidated on write, and `memory_index_scan` now routes scan-triggered invalidation through the broader mutation-hook behavior used by other mutation paths. If embedding generation fails, the memory is still stored and searchable via BM25/FTS5 with the embedding marked as pending for later re-indexing.

Successful insertions now clear the search cache immediately instead of waiting for delete-time invalidation or TTL expiry. `index_memory()` calls `clear_search_cache()` after the transactional insert, active-projection update and optional `vec_memories` write succeed, so a brand-new memory becomes visible to repeated `memory_search` calls right away. The fix closes a stale-results gap where the save path could report success while cached searches still replayed a pre-insert snapshot.

Document type affects importance weighting automatically: constitutional files get 1.0, spec documents 0.8, plans 0.7, memory files 0.5 and scratch files 0.25.

#### Source Files

See [`02--mutation/01-memory-indexing-memorysave.md`](02--mutation/01-memory-indexing-memorysave.md) for full implementation and test file listings.

---

### Memory metadata update (memory_update)

#### Description

You can rename a memory or change its priority without deleting and re-creating it. When you change the title, the system automatically updates its internal search index to match. If the update fails partway through, everything rolls back to the way it was before so you never end up with a half-changed record.

#### Current Reality

You can change the title, trigger phrases, importance weight or importance tier on any existing memory by its numeric ID. The system verifies the memory exists, validates your parameters (importance weight between 0 and 1, tier from the valid enum) and applies the changes.

When the title changes, the system regenerates the vector embedding to keep search results aligned. This is a critical detail: if you rename a memory from "Authentication setup guide" to "OAuth2 configuration reference", the old embedding no longer represents the content accurately. Automatic regeneration fixes that.

By default, if embedding regeneration fails (API timeout, provider outage), the entire update rolls back with no changes applied. Nothing happens. With `allowPartialUpdate` enabled, the metadata changes persist and the embedding is marked as pending for later re-indexing by the next `memory_index_scan`. That mode is useful when you need to fix metadata urgently and can tolerate a temporarily stale embedding.

Embedding replacement now reports reality instead of optimism. When `update_memory()` receives a new embedding, it writes `embedding_status = 'pending'` as part of the main `memory_index` update and only flips that row to `'success'` after the replacement `vec_memories` insert completes. That prevents sqlite-vec outages or vec-table write failures from leaving metadata rows marked successful when no fresh vector was actually stored.

Successful metadata updates now invalidate the search cache as part of the same transactional path. After the handler refreshes BM25, optionally persists the replacement vector and recomputes folder interference scores, it calls `clear_search_cache()` so renamed memories and trigger updates appear in subsequent cached searches immediately instead of after TTL expiry.

A pre-update hash snapshot is captured for the mutation ledger. Every update records the prior hash, new hash, actor and decision metadata for full auditability.

#### Source Files

See [`02--mutation/02-memory-metadata-update-memoryupdate.md`](02--mutation/02-memory-metadata-update-memoryupdate.md) for full implementation and test file listings.

---

### Single and folder delete (memory_delete)

#### Description

You can remove one memory at a time or clear out an entire folder at once. Before a big deletion, the system takes a snapshot so you can undo it if you change your mind. Deletions are all-or-nothing: either everything you asked to remove is gone or nothing changes at all. This prevents situations where only half the data gets deleted and the rest is left in a messy state.

#### Current Reality

Two deletion modes in one tool. Pass a numeric `id` for single delete or a `specFolder` string (with `confirm: true`) for bulk folder delete.

Single deletes run inside a database transaction: remove the memory record via `vectorIndex.deleteMemory(id)`, clean up associated causal graph edges via `causalEdges.deleteEdgesForMemory(id)` and record a mutation ledger entry. If any step fails, the entire transaction rolls back. This atomicity guarantee was added in Phase 018 (CR-P1-1) to prevent partial deletes from leaving orphaned data.

Bulk deletes by spec folder are more involved. The system first creates an auto-checkpoint with a timestamped name (like `pre-cleanup-2026-02-28T12-00-00`) so you can roll back if the deletion was a mistake. Then it deletes all matching memories inside a database transaction with per-memory causal edge cleanup and per-memory mutation ledger entries. The entire operation is atomic: either all memories in the folder are deleted or none are. The response includes the checkpoint name and a restore command hint.

#### Source Files

See [`02--mutation/03-single-and-folder-delete-memorydelete.md`](02--mutation/03-single-and-folder-delete-memorydelete.md) for full implementation and test file listings.

---

### Tier-based bulk deletion (memory_bulk_delete)

#### Description

This is the cleanup tool for large-scale housekeeping. You can delete all outdated or temporary memories in one go based on their importance level, like clearing out the recycling bin. The most important memories get extra protection so they cannot be accidentally wiped. A safety snapshot is taken first so you can restore if needed.

#### Current Reality

For large-scale cleanup operations. Instead of targeting a folder, you target an importance tier: delete all deprecated memories, or all temporary memories older than 30 days. The tool counts affected memories first (so the response tells you exactly how many were deleted), creates a safety checkpoint, then deletes within a database transaction.

Constitutional and critical tier memories receive extra protection. Unscoped deletion of these tiers is refused outright. You must provide a `specFolder` to delete constitutional or critical memories in bulk. The `skipCheckpoint` speed optimization, which skips the safety checkpoint for faster execution, is also rejected for these tiers. If the checkpoint creation itself fails for constitutional/critical, the entire operation aborts. For lower tiers, a checkpoint failure triggers a warning but the deletion proceeds because the risk of losing deprecated or temporary memories is low.

Each deleted memory gets its causal graph edges removed. A single consolidated mutation ledger entry (capped at 50 linked memory IDs to avoid ledger bloat) records the bulk operation. All caches are invalidated after deletion.

The `olderThanDays` parameter is validated as a positive integer (>= 1) before query construction. Values that are zero, negative, non-integer, or NaN return a validation error rather than silently removing the age filter. The `tool-schemas.ts` definition enforces `minimum: 1` at the schema level.

#### Source Files

See [`02--mutation/04-tier-based-bulk-deletion-memorybulkdelete.md`](02--mutation/04-tier-based-bulk-deletion-memorybulkdelete.md) for full implementation and test file listings.

---

### Validation feedback (memory_validate)

#### Description

After a search result is shown to you, you can tell the system whether it was helpful or not. Helpful results get a confidence boost so they show up more often in the future. Unhelpful results get demoted so they appear less. Over time, the system learns which memories are genuinely useful and which ones keep missing the mark, like training a recommendation engine with your thumbs-up and thumbs-down.

#### Current Reality

Every search result is either helpful or not. This tool lets you record that judgment and triggers several downstream systems based on the feedback.

Positive feedback adds 0.1 to the memory's confidence score (capped at 1.0). Negative feedback subtracts 0.05 (floored at 0.0). The base confidence for any memory starts at 0.5. The asymmetry between positive (+0.1) and negative (-0.05) increments is intentional. It takes one good validation to raise confidence by 0.1 but two bad validations to cancel that out. This bias toward preservation reflects the assumption that a memory might be unhelpful for one query but still valuable for another.

Auto-promotion fires unconditionally on every positive validation. When a normal-tier memory accumulates 5 positive validations, it is promoted to important. When an important-tier memory reaches 10, it is promoted to critical. A throttle safeguard limits promotions to 3 per 8-hour rolling window. Constitutional, critical, temporary and deprecated tiers are non-promotable. The response includes `autoPromotion` metadata showing whether promotion was attempted, the previous and new tier and the reason.

Negative feedback persistence fires unconditionally on every negative validation. A `recordNegativeFeedbackEvent()` call stores the event in the `negative_feedback_events` table. The search handler reads these events and applies a confidence multiplier that starts at 1.0, decreases by 0.1 per negative validation and floors at 0.3. Time-based recovery with a 30-day half-life gradually restores the multiplier. Demotion scoring runs behind the `SPECKIT_NEGATIVE_FEEDBACK` flag (default ON).

When a `queryId` is provided alongside positive feedback, two additional systems activate. Learned feedback persistence records the user's selection and extracts query terms into a separate `learned_triggers` column (isolated from the FTS5 index to prevent contamination). These learned triggers boost future searches for the same terms. Ground truth selection logging records the event in the evaluation database for the ground truth corpus, returning a `groundTruthSelectionId` in the response.

The confidence read-compute-write segment (`recordValidation`) runs within a single SQLite transaction to prevent concurrent validation updates from racing and dropping writes. Downstream side effects (auto-promotion, negative-feedback persistence, learned feedback and ground-truth logging) execute after that transactional segment.

#### Source Files

See [`02--mutation/05-validation-feedback-memoryvalidate.md`](02--mutation/05-validation-feedback-memoryvalidate.md) for full implementation and test file listings.

---

### Transaction wrappers on mutation handlers

#### Description

Every time the system saves or changes your data, it wraps the operation in a safety net. If anything goes wrong mid-save, all changes roll back so you never end up with half-written or corrupted information. This is like a bank transfer that either completes fully or does not happen at all.

#### Current Reality

`memory-crud-update.ts` wraps its mutation steps in a transaction (`runInTransaction`) so the DB update, embedding status write, BM25 re-index and mutation ledger append either commit together or roll back together. `memory-crud-delete.ts` wraps both the single-delete and bulk-folder delete paths in database transactions so confirmed deletes, history rows, causal-edge cleanup and mutation-ledger entries stay aligned. Cache invalidation and post-mutation hooks remain outside the transaction as in-memory/post-commit work. Unlike update, delete no longer falls back when the DB handle is missing: it aborts early to avoid orphaned causal edges or missing audit/history writes. The reconsolidation bridge `storeMemory` callback also wraps index, metadata, BM25 and history writes in a transaction for atomicity. Lifecycle `recordHistory()` writes now run inside mutation transactions across ADD/UPDATE/DELETE paths, and update BM25 handling distinguishes infrastructure failures (warn and continue) from data failures (roll back).

#### Source Files

See [`02--mutation/06-transaction-wrappers-on-mutation-handlers.md`](02--mutation/06-transaction-wrappers-on-mutation-handlers.md) for full implementation and test file listings.

---

### Namespace management CRUD tools (shared-memory lifecycle)

#### Description

Shared-memory spaces let multiple users or agents access the same pool of knowledge under a deny-by-default membership model. Four shipped tools provide workspace-level scoping beyond per-spec-folder filtering: create or update spaces, control user/agent access, inspect rollout status, and enable the subsystem. All four tools are live under the `/memory:manage shared` command.

#### Current Reality

**SHIPPED.** The shared-memory lifecycle is live with 4 L5 tools managed by `/memory:manage shared`:

- **`shared_space_upsert`** -- Creates or updates a shared-memory space with `tenantId`, `name`, and actor identity (`actorUserId` or `actorAgentId`). The first successful create auto-grants `owner` access to the acting caller.
- **`shared_space_membership_set`** -- Controls user/agent access with a deny-by-default model. Requires `tenantId`, `subjectType` (`user` or `agent`), `subjectId`, `role` (`owner`, `editor`, or `viewer`), and actor identity. Membership mutations must be performed by an existing owner.
- **`shared_memory_status`** -- Reports enablement state, space inventory, and membership for optional tenant/user/agent scope filters.
- **`shared_memory_enable`** -- Activates the opt-in shared-memory subsystem (creates infrastructure tables, persists enablement, generates a README in `shared-spaces/`).

The original full namespace CRUD (`list/create/switch/delete`) for complete multi-tenant isolation remains deferred. Current scoping relies on logical `specFolder` filtering augmented by the shared-memory tools above.

#### Source Files

See [`02--mutation/07-namespace-management-crud-tools.md`](02--mutation/07-namespace-management-crud-tools.md) for full implementation and test file listings.

---

### Prediction-error save arbitration

#### Description

When you save new information, the system checks whether it already knows something similar. If it does, it decides the smartest action: strengthen the existing memory, update it in place, replace it with the new version or store both as related but different items. This prevents the knowledge base from filling up with near-identical copies while still capturing genuinely new information.

#### Current Reality

5-action decision engine during the save path. Examines semantic similarity of new content against existing memories: REINFORCE (>=0.95, boost FSRS stability), UPDATE (0.85-0.94 no contradiction, in-place update), SUPERSEDE (0.85-0.94 with contradiction, deprecate old + create new), CREATE_LINKED (0.70-0.84, new memory + causal edge), CREATE (<0.70, standalone). Contradiction detection via regex patterns. All decisions are logged to the `memory_conflicts` table with similarity, action, contradiction flag, reason and spec_folder. Document-type-aware weighting (constitutional=1.0 down to scratch=0.25). The arbitration path runs only when `force` is false and an embedding is available, and when `sessionId` is present it filters candidates from other sessions so one session cannot trigger false duplicate, update, or supersede decisions in another.

#### Source Files

See [`02--mutation/08-prediction-error-save-arbitration.md`](02--mutation/08-prediction-error-save-arbitration.md) for full implementation and test file listings.

---

### Correction tracking with undo

#### Description

When a newer memory replaces or refines an older one, the system records what changed and why. The old memory gets a lower confidence score while the new one gets a boost. This creates a paper trail of corrections so you can see how your knowledge evolved over time and understand why older information was updated.

#### Current Reality

The corrections module (`lib/learning/corrections.ts`) tracks inter-memory relationship signals during the learning pipeline. When a memory supersedes, deprecates, refines, or merges with another, the correction is recorded with before/after stability scores and applied penalty/boost values. Four correction types are supported: `superseded`, `deprecated`, `refined`, and `merged`.

Each correction adjusts the stability scores of both the original and correcting memories: the original receives a penalty while the correction receives a boost. Stability changes are tracked in a `StabilityChanges` structure for audit purposes. The feature is gated by `SPECKIT_RELATIONS` (default `true`). When disabled, relational learning corrections are skipped and no stability adjustments are applied.

#### Source Files

See [`02--mutation/09-correction-tracking-with-undo.md`](02--mutation/09-correction-tracking-with-undo.md) for full implementation and test file listings.

---

### Per-memory history log

#### Description

Every time a memory is created, changed or deleted, the system writes a log entry recording what happened, when and who did it. This is like a change history on a shared document. If something looks wrong later, you can trace back to exactly what changed and when it happened.

#### Current Reality

The `memory_history` table records a per-memory audit trail of mutation events. Each row captures the memory ID, event type (`ADD`, `UPDATE`, `DELETE`), timestamp, actor and optional `prev_value`/`new_value` payloads. This provides a lifecycle trace for individual memories and supports audit/debug workflows such as "show me all mutation events for memory #42."

The history log is written by mutation handlers (`memory_save`, `memory_update`, `memory_delete`, `memory_bulk_delete`) and lower-level mutation helpers (`delete_memories`, `delete_memory_by_path`). `lib/storage/history.ts` owns schema-safe initialization/migration and read/write helpers, while `vector-index-schema.ts` ensures initialization runs at DB startup. The orphan cleanup script removes orphaned history rows when parent memories are missing.

#### Source Files

See [`02--mutation/10-per-memory-history-log.md`](02--mutation/10-per-memory-history-log.md) for full implementation and test file listings.

> **Playbook:** [110](../manual_testing_playbook/manual_testing_playbook.md)

---

## 4. DISCOVERY

### Memory browser (memory_list)

#### Description

This lets you browse through all stored memories page by page, like scrolling through a list of saved notes. You can sort by date or importance to find what you need. It is the simplest way to see what the system has stored without running a search query.

#### Current Reality

`memory_list` is the low-friction browse endpoint for indexed memories. It returns paginated parent memories by default, with `includeChunks: true` opting into child chunk rows. The payload includes `total`, `count`, `limit`, `offset`, the resolved `sortBy` and the current page of results.

The handler accepts three sort modes: `created_at`, `updated_at` and `importance_weight`. Invalid `sortBy` values do not fail the request. They fall back to `created_at` and the resolved choice is reflected in the response payload. Negative limits clamp to `1`, values above `100` clamp to `100`, and negative offsets clamp to `0`.

Validation and runtime failures return MCP error envelopes instead of raw throws. Direct handler calls with invalid `specFolder`, invalid `includeChunks`, or non-finite `limit`/`offset` values return `E_INVALID_INPUT` with a `requestId` in `data.details`. Database initialization/query failures also return MCP error envelopes.

#### Source Files

See [`03--discovery/01-memory-browser-memorylist.md`](03--discovery/01-memory-browser-memorylist.md) for full implementation and test file listings.

---

### System statistics (memory_stats)

#### Description

This is the dashboard for your knowledge base. It tells you how many memories you have, how they are organized, which folders are most active and how large the database is. Think of it like the storage settings page on your phone that shows you how much space each app is using.

#### Current Reality

`memory_stats` returns the discovery dashboard for the memory database: total memory count, embedding status breakdown, oldest/newest timestamps, total trigger phrase count, tier breakdown, database size, last indexed timestamp, graph channel metrics and the ranked folder summary.

Folder ranking supports four modes: `count`, `recency`, `importance`, and `composite`. Count mode ranks directly from `memory_index`. The scoring-based modes build folder rankings from `embedding_status = 'success'` rows and use `folderScoring.computeFolderScores()` before applying ranking-specific sorts. If scoring fails, the handler falls back to count-based folder totals.

The response now reports `totalSpecFolders` from the full filtered/scored set before pagination slicing, so the summary stays accurate when `limit` truncates `topFolders`. The payload also includes the resolved `limit`, which makes truncation behavior explicit for callers and tests.

Direct handler validation failures return MCP error envelopes with `E_INVALID_INPUT` and `data.details.requestId` for invalid `folderRanking`, invalid `excludePatterns`, invalid `includeScores`/`includeArchived`, or non-finite `limit` values. Aggregate-query and folder-ranking failures return MCP error envelopes instead of raw throws.

Embedding-status totals now treat `partial` as a first-class state instead of silently dropping it. `get_status_counts()` initializes and returns a `partial` bucket, and `get_stats()` includes that bucket in the headline total. That keeps `memory_stats` aligned with chunked and partially indexed rows that already exist elsewhere in the vector-index state model.

#### Source Files

See [`03--discovery/02-system-statistics-memorystats.md`](03--discovery/02-system-statistics-memorystats.md) for full implementation and test file listings.

---

### Health diagnostics (memory_health)

#### Description

This is the system's self-check tool. It tells you whether the database is connected, whether the search engine is ready and whether anything looks out of place. If it finds problems, it can suggest or even perform automatic repairs. Think of it like running a diagnostic on your car to see if everything is working properly.

#### Current Reality

`memory_health` has two report modes. `full` returns system diagnostics: database connectivity, embedding model readiness, vector-search availability, memory count, uptime, server version, alias-conflict summary, repair metadata and embedding provider details. `divergent_aliases` returns a compact triage payload that focuses only on alias groups whose `` and `.opencode/specs/` variants have different content hashes.

The top-level status is currently derived from two signals only: embedding model readiness and database connectivity. FTS drift and alias conflicts do not flip the status to `degraded` by themselves. They surface through hints and the repair payload. The embedding provider section exposes a redacted database path, not a raw absolute path.

`autoRepair: true` without `confirmed: true` does not execute repair actions. Instead, the handler returns a confirmation-only success response describing the actions it would take. The public tool schema now accepts `confirmed`, so the documented confirmation flow is reachable through real MCP calls as well as direct handler tests.

All health validation failures return MCP error envelopes with `E_INVALID_INPUT` and `data.details.requestId`. User-facing hints sanitize absolute paths and stack traces before returning error context.

#### Source Files

See [`03--discovery/03-health-diagnostics-memoryhealth.md`](03--discovery/03-health-diagnostics-memoryhealth.md) for full implementation and test file listings.

---

## 5. MAINTENANCE

### Workspace scanning and indexing (memory_index_scan)

#### Description

This tool scans your project folders for new or changed files and adds them to the searchable knowledge base. It is like a librarian walking through the stacks every day to catalog new arrivals and update records for books that have been revised. Files that have not changed are skipped to save time. If a file fails to process, the system remembers and retries it next time.

#### Current Reality

This is the tool that keeps the memory database synchronized with the filesystem. Without it, new or modified memory files would be invisible to search.

Spec documents are still indexed by default. During scan they flow through `memory_save` with `qualityGateMode: 'warn-only'`, so template, sufficiency, and quality issues surface as warnings instead of silently bypassing retrieval.

The scanner discovers files from three sources: spec folder memory files (`specs/**/memory/*.md`), constitutional files (`.opencode/skill/*/constitutional/*.md`) and spec documents (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, `research/research.md`, `handover.md`). Canonical path deduplication prevents the same file from being indexed twice under different paths (the `specs/` vs `.opencode/specs/` symlink problem).

In incremental mode (the default), the scanner categorizes every discovered file into one of four buckets: to-index (new files), to-update (changed mtime), to-skip (unchanged mtime) and to-delete (files that disappeared from disk). Batch processing with configurable `BATCH_SIZE` handles large workspaces. A rate limiter with `INDEX_SCAN_COOLDOWN` prevents rapid repeated scans from exhausting resources, returning an E429 error with a wait time if you scan too frequently.

Each file that passes through to indexing goes through the full `memory_save` pipeline, which means content normalization, quality gating, reconsolidation, chunk thinning and encoding-intent capture all apply automatically. Large files are split into chunks, and anchor-aware chunk thinning drops low-scoring chunks before they enter the index.

After indexing, the tool does more than store data. It creates causal chain edges between spec documents within the same folder (spec leads to plan, plan leads to tasks, tasks lead to checklist, and so on). It detects alias conflicts. It runs divergence reconciliation hooks. It clears the trigger matcher cache if any changes occurred.

A safety invariant protects against silent failures: post-indexing mtime updates happen only for successfully indexed files. If embedding generation fails for a specific file, that file retains its old mtime so the next scan automatically retries it. You do not have to track which files failed. The system tracks it for you.

The result breakdown is detailed: indexed count, updated count, unchanged count, failed count, skipped-by-mtime count, constitutional stats, dedup stats and incremental stats. Debug mode (`SPECKIT_DEBUG_INDEX_SCAN=true`) exposes additional file count diagnostics.

#### Source Files

See [`04--maintenance/01-workspace-scanning-and-indexing-memoryindexscan.md`](04--maintenance/01-workspace-scanning-and-indexing-memoryindexscan.md) for full implementation and test file listings.

---

### Startup runtime compatibility guards

#### Description

When the system starts up, it checks that the software environment has not changed since it was last installed. If you updated your system or switched computers, some internal components might not be compatible anymore. This check warns you about mismatches early instead of letting them cause a mysterious crash later.

#### Current Reality

The startup checks module (`startup-checks.ts`) runs non-critical compatibility validation when the MCP server initializes. The primary guard is Node.js runtime mismatch detection: if the `.node-version-marker` file is missing, startup creates it with the current Node version, module ABI version, platform and architecture for future comparison. On later startups, the guard compares the current runtime against that marker and warns on ABI, platform, or architecture mismatches. Those mismatches indicate that native modules (like `better-sqlite3` or `sqlite-vec`) may have been built for a different runtime and can crash at startup.

The module also performs a minimum-version SQLite check (3.35.0+) and treats malformed version strings or query failures as warning-only diagnostics. These guards are extracted from the main `context-server.ts` (T303) to keep the startup path modular. Additional startup checks can be added to this module without cluttering the server initialization logic. All checks are non-blocking: they emit warnings but do not prevent server startup.

Manual validation is covered by playbook scenario `EX-035`, which runs the targeted startup guard suite and verifies runtime mismatch plus SQLite diagnostics behavior.

#### Source Files

See [`04--maintenance/02-startup-runtime-compatibility-guards.md`](04--maintenance/02-startup-runtime-compatibility-guards.md) for full implementation and test file listings.

---

## 6. LIFECYCLE

### Checkpoint creation (checkpoint_create)

#### Description

This takes a snapshot of your entire knowledge base at a point in time, like a save point in a video game. If something goes wrong later (an accidental deletion or a bad import), you can restore back to this snapshot. The system keeps up to 10 snapshots and automatically removes the oldest one when you create a new one.

#### Current Reality

Named snapshots capture the current memory state by serializing the `memory_index` table, `working_memory` table and vector embeddings from `vec_memories` into a gzip-compressed JSON blob stored in the `checkpoints` table. You can scope a snapshot to a specific spec folder if you only care about preserving one area of the system.

A maximum of 10 checkpoints are retained. When you create the 11th, the oldest is automatically purged. Each checkpoint records arbitrary metadata you provide, plus the current git branch from environment variables. The gzip compression keeps storage manageable even with large memory databases.

Checkpoints are the safety net for destructive operations. `memory_bulk_delete` creates one by default before bulk deletion, unless explicitly skipped for lower-risk tiers. `checkpoint_restore` brings it all back. The cycle works because checkpoints include vector embeddings alongside metadata, so restored memories are immediately searchable without re-running embedding generation.

#### Source Files

See [`05--lifecycle/01-checkpoint-creation-checkpointcreate.md`](05--lifecycle/01-checkpoint-creation-checkpointcreate.md) for full implementation and test file listings.

---

### Checkpoint listing (checkpoint_list)

#### Description

This shows you all available snapshots so you can see when each one was taken and what it covers. Think of it like looking at a list of backup dates on your phone before deciding which one to restore from.

#### Current Reality

Returns a paginated list of available checkpoints with metadata: name, creation date, spec folder scope, git branch and compressed snapshot size. The actual snapshot data is not included. Results are ordered by creation date, most recent first. Default limit is 50, maximum 100. You can filter by spec folder to see only checkpoints that cover a specific area.

#### Source Files

See [`05--lifecycle/02-checkpoint-listing-checkpointlist.md`](05--lifecycle/02-checkpoint-listing-checkpointlist.md) for full implementation and test file listings.

---

### Checkpoint restore (checkpoint_restore)

#### Description

This brings your knowledge base back to a previous snapshot, like using the undo button on a massive scale. If the restore fails partway through, nothing changes and your current data stays safe. Restored memories are immediately searchable without any extra steps.

#### Current Reality

Restoring from a named checkpoint decompresses the gzip snapshot, validates every row against the database schema (a T107 fix that catches corrupted snapshots before they damage the database) and either merges with existing data or clears existing data first.

The `clearExisting` mode deserves explanation. When true, the entire restore runs inside a database transaction. If the restore encounters an error halfway through, the transaction rolls back and existing data is untouched. This atomicity guarantee (a T101 fix) is critical because clearing existing data and then failing to restore would leave you with an empty database and no way back.

When merging (the default), the system checks for duplicates using a logical key of `spec_folder + file_path + anchor_id`. Existing memories that match the logical key are skipped rather than duplicated.

After restore, vectors are restored from the checkpoint snapshot when vector payloads are present. The restore handler then clears in-memory search/constitutional caches, rebuilds BM25 from live DB content when BM25 is enabled and refreshes the trigger cache. This keeps restored memories immediately discoverable without forcing a full re-embedding pass.

#### Source Files

See [`05--lifecycle/03-checkpoint-restore-checkpointrestore.md`](05--lifecycle/03-checkpoint-restore-checkpointrestore.md) for full implementation and test file listings.

---

### Checkpoint deletion (checkpoint_delete)

#### Description

This permanently removes a saved snapshot. You have to type the snapshot name to confirm, which prevents accidental deletions. Once deleted, that snapshot cannot be recovered, so make sure you pick the right one.

#### Current Reality

Permanently removes a named checkpoint from the `checkpoints` table. Returns a boolean indicating whether the checkpoint was found and deleted. No confirmation prompt, but the caller must supply a `confirmName` parameter that matches the checkpoint name as a safety gate against accidental deletion. If you delete the wrong checkpoint, it is gone. Use `checkpoint_list` first to verify the name.

#### Source Files

See [`05--lifecycle/04-checkpoint-deletion-checkpointdelete.md`](05--lifecycle/04-checkpoint-deletion-checkpointdelete.md) for full implementation and test file listings.

---

### Async ingestion job lifecycle

#### Description

When you need to import a large batch of files, this feature queues them up and processes them one at a time in the background. You can start the import, check its progress and cancel it if needed. It works like a print queue: you submit the jobs and the system works through them at its own pace while you continue doing other things.

#### Current Reality

**IMPLEMENTED (Sprint 019).** Ingestion moves to a SQLite-persisted job queue (`lib/ops/job-queue.ts`) with lifecycle states `queued → parsing → embedding → indexing → complete/failed/cancelled`, a single sequential worker (one job processing at a time, rest queued), and three new tools: `memory_ingest_start`, `memory_ingest_status`, `memory_ingest_cancel`. Coexists with the existing `asyncEmbedding` path in `memory_save` as an alternative for batch operations.

#### Source Files

See [`05--lifecycle/05-async-ingestion-job-lifecycle.md`](05--lifecycle/05-async-ingestion-job-lifecycle.md) for full implementation and test file listings.

---

### Startup pending-file recovery

#### Description

If the system crashed or lost power while saving a file, it might leave behind a partially written copy. On the next startup, this feature automatically finds those orphaned files and finishes saving them. You do not have to do anything. It is like your word processor recovering unsaved documents after a crash.

#### Current Reality

On server startup, the transaction manager scans for leftover `_pending` files created by interrupted atomic-write operations. If a previous `memory_save` wrote the pending file and committed the DB row but crashed before renaming, the pending file is the only surviving copy of the content. The recovery routine finds these orphans via `findPendingFiles()`, renames each to its final path and increments `totalRecoveries` in the transaction metrics.

Scan roots are derived from allowed memory base paths, then constrained to known memory locations (`specs/`, `.opencode/specs/` and constitutional directories) to balance coverage with startup safety.

Recovery is automatic and requires no user intervention. If the pending file is stale (the DB row was never committed), it is logged and left for manual review rather than silently deleted.

#### Source Files

See [`05--lifecycle/06-startup-pending-file-recovery.md`](05--lifecycle/06-startup-pending-file-recovery.md) for full implementation and test file listings.

---

### Automatic archival subsystem

#### Description

Memories that nobody has used for a long time get automatically moved to a storage-saving archive, like moving old files to a basement filing cabinet. They are still there if you need them but they do not take up space in the active search results. Important memories are protected and never get archived automatically.

#### Current Reality

The archival manager (`lib/cognitive/archival-manager.ts`) is a background job that identifies dormant memories and transitions them to archived status. It queries `memory_index` for memories that have not been accessed within a configurable threshold period, demotes their tier classification and removes BM25 index entries plus vector rows (`vec_memories`) to reclaim storage. Archived memories remain in the database for SQL-based recovery but are excluded from default search result sets.

The archival sweep runs periodically and respects tier-based protection: constitutional and critical-tier memories are never auto-archived. Access tracker data (`access_count`, `last_accessed`) drives the dormancy decision. On unarchive, BM25 is restored from stored text fields, while vector re-embedding is explicitly deferred and logged for the next index scan (no immediate vector row recreation). The archival manager lazy-loads the tier classifier to avoid circular dependencies at import time.

#### Source Files

See [`05--lifecycle/07-automatic-archival-subsystem.md`](05--lifecycle/07-automatic-archival-subsystem.md) for full implementation and test file listings.

---

## 7. ANALYSIS

### Causal edge creation (memory_causal_link)

#### Description

This lets you draw a line between two memories to show they are related, like connecting pins on a corkboard with string. You can say one memory caused another, replaced another or contradicts another. These connections help the search system understand how ideas relate to each other and surface better results when you are tracing the history of a decision.

#### Current Reality

Creates a directed relationship edge between two memories in the causal graph. Six relationship types are supported: caused (this memory led to that one), enabled (this memory made that one possible), supersedes (this memory replaces that one), contradicts (these memories disagree), derived_from (this memory was produced from that one) and supports (this memory backs up that one).

Edge strength is a 0-1 float, clamped at both ends. Evidence text is optional but recommended because it explains why the relationship exists. If an edge with the same source, target and relation already exists, the system updates strength and evidence via `INSERT ... ON CONFLICT DO UPDATE` rather than creating a duplicate. That upsert behavior means you can call `memory_causal_link` repeatedly with updated evidence without worrying about edge proliferation.

Edge bounds are enforced at insert time. Auto-generated edges (those with `created_by='auto'`) are rejected when a node already has 20 edges (`MAX_EDGES_PER_NODE`) and clamped to a maximum strength of 0.5 (`MAX_AUTO_STRENGTH`). Every strength modification is logged to a `weight_history` table recording old strength, new strength, who changed it, when and why. The `created_by` and `last_accessed` fields on each edge track provenance and usage patterns.

A batch insert variant (`insertEdgesBatch()`) handles bulk edge creation during spec document indexing. The `createSpecDocumentChain()` function auto-links spec folder documents in a standard chain: spec causes plan, plan causes tasks, tasks cause implementation-summary. Checklist, decision-record and research documents get support relationships to the primary chain.

#### Source Files

See [`06--analysis/01-causal-edge-creation-memorycausallink.md`](06--analysis/01-causal-edge-creation-memorycausallink.md) for full implementation and test file listings.

---

### Causal graph statistics (memory_causal_stats)

#### Description

This gives you a health report on the web of connections between your memories. It tells you how many connections exist, how strong they are and whether enough memories are linked together. If too many memories are isolated with no connections, the system warns you because it means the relationship network is too thin to be useful for tracing decisions.

#### Current Reality

Returns the health metrics of the causal graph in a single call. Total edge count, breakdown by relationship type (how many caused edges, how many supports edges and so on), average edge strength across all edges, unique source and target memory counts and the link coverage percentage.

Link coverage is the most important metric: what percentage of memories participate in at least one causal relationship? The target is 60% (CHK-065). Below that, the graph is too sparse for the graph search channel to contribute meaningfully. The tool reports pass or fail against that target.

Orphaned edges (edges referencing source or target memories that no longer exist in `memory_index`) are detected and counted. When orphans exist, the health status changes from "healthy" to "has_orphans." You can use `memory_drift_why` to find the edge IDs and `memory_causal_unlink` to clean them up.

#### Source Files

See [`06--analysis/02-causal-graph-statistics-memorycausalstats.md`](06--analysis/02-causal-graph-statistics-memorycausalstats.md) for full implementation and test file listings.

---

### Causal edge deletion (memory_causal_unlink)

#### Description

This removes a connection between two memories. If you delete a memory entirely, all its connections are cleaned up automatically. You only need this tool when you want to remove a specific connection while keeping both memories intact, like cutting one thread on a corkboard without taking down the pins.

#### Current Reality

Removes a single causal relationship edge by its numeric edge ID. You get edge IDs from `memory_drift_why` traversal results (a T202 enhancement that added edge IDs to the response specifically to enable this workflow).

A library-level variant, `deleteEdgesForMemory()`, removes all edges referencing a given memory ID. This variant is called automatically during memory deletion (`memory_delete`) to maintain graph integrity. You do not need to manually clean up edges when deleting a memory. The system handles it.

#### Source Files

See [`06--analysis/03-causal-edge-deletion-memorycausalunlink.md`](06--analysis/03-causal-edge-deletion-memorycausalunlink.md) for full implementation and test file listings.

---

### Causal chain tracing (memory_drift_why)

#### Description

This answers the question "why was this decision made?" by following the chain of connections backward through related memories. It is like tracing a family tree to understand how you got from a problem to a solution. If two memories in the chain contradict each other, the system flags the conflict so you can resolve it.

#### Current Reality

"Why was this decision made?" This tool answers that question by tracing the causal relationship chain for a given memory through depth-limited graph traversal.

You choose the traversal direction: outgoing (what did this memory cause or enable?), incoming (what caused or enabled this memory?) or both. Maximum depth is configurable from 1 to 10, defaulting to 3. Cycle detection via a visited set prevents infinite traversal through circular relationships.

Results are grouped by relationship type: causedBy, enabledBy, supersedes, contradicts, derivedFrom and supports. Each edge carries a relation-weighted strength value. Supersedes edges receive a 1.5x weight boost (because replacement is a strong signal). Caused edges receive 1.3x. Enabled edges receive 1.1x. Supports and derived_from edges pass through at 1.0x. Contradicts edges receive 0.8x dampening because contradictions weaken rather than strengthen the chain.

You can filter to specific relationship types after traversal. Pass `relations: ["caused", "supersedes"]` to see only the replacement and causation chains. The response includes a `maxDepthReached` flag that warns when the depth limit may have truncated results. If you see that flag, consider increasing `maxDepth` for a more complete picture.

When contradictions are found, the response includes warning hints. Two memories that contradict each other in the same causal chain is a signal that something needs resolution.

#### Source Files

See [`06--analysis/04-causal-chain-tracing-memorydriftwhy.md`](06--analysis/04-causal-chain-tracing-memorydriftwhy.md) for full implementation and test file listings.

---

### Epistemic baseline capture (task_preflight)

#### Description

Before starting a task, this tool records how much you know, how uncertain you are and how complete your context is. It is like taking a "before" photo at the start of a home renovation. Later, you can compare against the "after" to measure how much progress you made and what you learned along the way.

#### Current Reality

Before starting implementation work, this tool records how much the agent knows, how uncertain it is and how complete the context is. All three scores are on a 0-100 scale. You can optionally list identified knowledge gaps as an array of strings.

Records are stored in the `session_learning` table with a `UNIQUE` constraint on `(spec_folder, task_id)`. If a preflight record already exists for the same combination and is still in the "preflight" phase, calling preflight again updates the existing record rather than creating a duplicate. Completed records (where postflight has already run) cannot be overwritten. That guard prevents accidental resets of finished learning cycles.

The purpose of preflight is establishing a baseline for learning measurement. Without knowing where you started, you cannot measure how much you learned. The postflight tool completes the measurement.

#### Source Files

See [`06--analysis/05-epistemic-baseline-capture-taskpreflight.md`](06--analysis/05-epistemic-baseline-capture-taskpreflight.md) for full implementation and test file listings.

---

### Post-task learning measurement (task_postflight)

#### Description

After finishing a task, this tool takes the "after" measurement and compares it against the "before" baseline. It calculates a score that tells you how much you learned. A high score means you gained real new understanding. A low score means you mostly applied what you already knew. A negative score means you discovered that what you thought was true turned out to be wrong.

#### Current Reality

After completing implementation work, this tool captures the post-task epistemic state and computes a Learning Index by comparing against the preflight baseline. The formula weights three deltas: `LI = (KnowledgeDelta * 0.4) + (UncertaintyReduction * 0.35) + (ContextImprovement * 0.25)`.

The uncertainty delta is inverted (pre minus post) so that reduced uncertainty counts as a positive learning signal. If you started at 70% uncertainty and finished at 20%, that is a +50 uncertainty reduction contributing +17.5 to the Learning Index.

Interpretation bands give the score meaning. 40 or above signals significant learning (you understood something that changed your approach). 15-39 is moderate learning. 5-14 is incremental. 0-4 is an execution-focused session where you applied existing knowledge without gaining new understanding. Below zero indicates knowledge regression, which usually means the task revealed that prior assumptions were wrong.

You can track gaps closed during the task and new gaps discovered. Both are stored as JSON arrays alongside the scores. The phase updates from "preflight" to "complete" after postflight runs. Calling postflight without a matching preflight record throws an error.

#### Source Files

See [`06--analysis/06-post-task-learning-measurement-taskpostflight.md`](06--analysis/06-post-task-learning-measurement-taskpostflight.md) for full implementation and test file listings.

---

### Learning history (memory_get_learning_history)

#### Description

This shows you a report card of learning across all completed tasks in a project. You can see the average learning score, which tasks produced the biggest breakthroughs and whether your understanding is trending up or down over time. It is like a fitness tracker for knowledge growth.

#### Current Reality

Retrieves learning records for a spec folder with optional filtering by session ID and completion status. Each record shows the preflight scores, postflight scores, computed deltas and Learning Index.

The summary statistics are where this tool earns its keep. Across all completed tasks in a spec folder, you see the average Learning Index, maximum and minimum LI, average knowledge gain, average uncertainty reduction and average context improvement. Trend interpretation maps the average LI to a human-readable assessment: above 15 is a strong learning trend, 7-15 is positive, 0-7 is slight, zero is neutral and below zero is regression.

Pass `onlyComplete: true` to restrict results to tasks where both preflight and postflight were recorded. This gives you clean data for trend analysis without incomplete records skewing the averages. Records are ordered by `updated_at` descending so the most recent learning cycles appear first. The handler now tracks schema initialization per database instance rather than per process, so fresh DB connections still create `session_learning` correctly, and score validation rejects `NaN` so malformed learning inputs cannot silently persist.

#### Source Files

See [`06--analysis/07-learning-history-memorygetlearninghistory.md`](06--analysis/07-learning-history-memorygetlearninghistory.md) for full implementation and test file listings.

---

## 8. EVALUATION

### Ablation studies (eval_run_ablation)

#### Description

This tool tests how important each part of the search system is by turning off one piece at a time and measuring the difference. It is like removing one ingredient from a recipe to see if the dish still tastes good. The results tell you which components are critical and which ones you could remove without hurting search quality.

#### Current Reality

This tool runs controlled ablation studies across the retrieval pipeline's search channels. You disable one channel at a time (vector, BM25, FTS5, graph or trigger) and measure the Recall@20 delta against a full-pipeline baseline. The answer to "what happens if we turn off the graph channel?" becomes a measured number rather than speculation.

The framework uses dependency injection for the search function, making it testable without the full pipeline. Each channel ablation wraps in a try-catch so a failure in one channel's ablation produces partial results rather than a total failure. Statistical significance is assessed via a sign test (exact binomial distribution) because it is reliable with small query sets where a t-test would be unreliable. Verdict classification ranges from CRITICAL (channel removal causes significant regression) through negligible to HARMFUL (channel removal actually improves results). Token-usage summaries now ignore non-positive values, which prevents synthetic zeroes from appearing when a run has no real token-usage samples.

Results are stored in `eval_metric_snapshots` with negative timestamp IDs to distinguish ablation runs from production evaluation runs. The tool supports two modes: `mode: 'ablation'` (default) requires `SPECKIT_ABLATION=true` to activate and runs controlled channel ablations; `mode: 'k_sensitivity'` runs RRF K-value sensitivity analysis and does not require the ablation flag. When the ablation flag is off and mode is `'ablation'`, the MCP handler returns an explicit disabled-flag error and does not execute an ablation run.

#### Source Files

See [`07--evaluation/01-ablation-studies-evalrunablation.md`](07--evaluation/01-ablation-studies-evalrunablation.md) for full implementation and test file listings.

---

### Reporting dashboard (eval_reporting_dashboard)

#### Description

This is a performance report that shows how well the search system has been working over time. It tracks metrics across different work periods and search channels so you can see whether things are getting better or worse. It only reads data and never changes anything, making it safe to run at any time.

#### Current Reality

Generates a sprint-level and channel-level metric dashboard from stored evaluation runs. You can filter by sprint, channel and metric, and choose between text (plain fixed-width) or JSON output.

The dashboard aggregates per-sprint metric summaries (mean, min, max, latest, count) and per-channel performance views (hit count, average latency, query count) from the `eval_metric_snapshots` and `eval_channel_results` tables. Sprint labels are read from metric-snapshot metadata (`sprint` or `sprintLabel`) and fall back to `run-{eval_run_id}` when metadata is absent. Trend analysis compares consecutive sprint groups using each metric's latest value, with `isHigherBetter()` treating latency-style and inversion-style metrics as lower-is-better and most other metrics as higher-is-better.

This is a read-only module. It queries the eval database and produces reports with no writes or mutation side effects. The accessor now tries `getEvalDb()` before falling back to `initEvalDb()`, so it keeps using an already-selected non-default or test eval DB instead of silently switching back to the default one. Two different limits apply: the request `limit` keeps only the most recent sprint groups after grouping, while `SPECKIT_DASHBOARD_LIMIT` caps dashboard SQL reads. Snapshot rows are still fetched directly, but channel data is grouped per included eval-run/channel pair before sprint aggregation so large per-query histories do not starve the kept sprint groups.

#### Source Files

See [`07--evaluation/02-reporting-dashboard-evalreportingdashboard.md`](07--evaluation/02-reporting-dashboard-evalreportingdashboard.md) for full implementation and test file listings.

---

## 9. BUG FIXES AND DATA INTEGRITY

### Graph channel ID fix

#### Description

One of the search channels that was supposed to find related memories through their connections was completely broken because of a simple label mismatch. It was comparing apples to oranges internally, so it never found anything. The fix corrected the labels so that channel now works as intended and actually contributes useful results.

#### Current Reality

The graph search channel had a 0% hit rate in production. Zero. The system was designed as a multi-channel retrieval engine, but the graph channel contributed nothing because `graph-search-fn.ts` compared string-formatted IDs (`mem:${edgeId}`) against numeric memory IDs at two separate locations.

Both comparison points now extract numeric IDs, and the graph channel returns results for queries where causal edge relationships exist. This was the single highest-impact bug in the system because it meant an entire retrieval signal was dead on arrival.

#### Source Files

See [`08--bug-fixes-and-data-integrity/01-graph-channel-id-fix.md`](08--bug-fixes-and-data-integrity/01-graph-channel-id-fix.md) for full implementation and test file listings.

---

### Chunk collapse deduplication

#### Description

Search results were showing duplicate entries because the system only removed duplicates in certain modes. This fix makes deduplication run on every search so you always get clean results without repeated items, no matter how you run the query.

#### Current Reality

Duplicate chunk rows appeared in default search mode because the deduplication logic only ran when `includeContent=true`. Most queries use the default `includeContent=false` path, which means most users saw duplicates. The conditional gate was removed so dedup now runs on every search request regardless of content settings. A small fix, but one that affected every standard query.

#### Source Files

See [`08--bug-fixes-and-data-integrity/02-chunk-collapse-deduplication.md`](08--bug-fixes-and-data-integrity/02-chunk-collapse-deduplication.md) for full implementation and test file listings.

---

### Co-activation fan-effect divisor

#### Description

Some highly connected memories kept showing up in every search result regardless of what you were looking for, like a popular student who gets invited to every party. This fix reduces the influence of overly connected memories so they do not crowd out more relevant results.

#### Current Reality

Hub memories with many connections dominated co-activation results no matter what you searched for. If a memory had 40 causal edges, it showed up everywhere.

A fan-effect divisor helper (`1 / sqrt(neighbor_count)`) exists in `co-activation.ts`, and Stage 2 now applies the same `sqrt(max(1, relatedCount))` dampening when spread-activation boosts are written back into the reranked result set. In practice, co-activation traversal produces candidate activation scores, then Stage 2 multiplies by `SPECKIT_COACTIVATION_STRENGTH`, divides by the fan-effect term and syncs the result across `score`, `rrfScore` and `intentAdjustedScore`. This keeps hub memories from overwhelming the top-N results even when they have many related neighbors.

#### Source Files

See [`08--bug-fixes-and-data-integrity/03-co-activation-fan-effect-divisor.md`](08--bug-fixes-and-data-integrity/03-co-activation-fan-effect-divisor.md) for full implementation and test file listings.

---

### SHA-256 content-hash deduplication

#### Description

When you save the same file again without changing it, the system now recognizes it instantly and skips the expensive processing step. It is like a postal worker who recognizes a letter they already delivered and sends it straight back instead of processing it again. This saves time and resources without any risk of missing actual changes.

#### Current Reality

Before this change, re-saving identical content triggered a full embedding API call every time. That costs money and adds latency for zero value.

An O(1) SHA-256 hash lookup in the `memory_index` table now catches exact duplicates within the same spec folder before the embedding step. When you re-save the same file, the system skips embedding generation entirely. Change one character, and embedding proceeds as normal. No false positives on distinct content because the check is cryptographic, not heuristic.

#### Source Files

See [`08--bug-fixes-and-data-integrity/04-sha-256-content-hash-deduplication.md`](08--bug-fixes-and-data-integrity/04-sha-256-content-hash-deduplication.md) for full implementation and test file listings.

---

### Database and schema safety

#### Description

Five separate bugs in the database layer were fixed to prevent data corruption. These ranged from referencing a column that did not exist to running operations in the wrong order. Each fix makes sure that database writes happen safely and predictably so your stored data stays accurate and complete.

#### Current Reality

Five database-layer bugs were fixed:

**B1: Reconsolidation column reference:** `reconsolidation.ts` referenced a non-existent `frequency_counter` column that would crash at runtime during merge operations. Replaced with `importance_weight` using `Math.min(1.0, currentWeight + 0.1)` merge logic.

**B2: DDL inside transaction:** `checkpoints.ts` placed DDL statements (`CREATE TABLE IF NOT EXISTS`, `ALTER TABLE ADD COLUMN`) inside a `database.transaction()` block. SQLite silently auto-commits on DDL, which corrupted the transaction boundary during checkpoint restore. DDL now runs before `BEGIN`. Only DML is wrapped in the transaction.

**B3: Edge-deletion filter correctness:** `causal-edges.ts` delete path must match edges where either endpoint equals the target memory ID (`source_id = ? OR target_id = ?`). Regression coverage validates deletion remains scoped to intended source/target rows.

**B4: Missing changes guard:** Save-path UPDATE statements in `handlers/pe-gating.ts` now validate SQLite update results (`result.changes`). Zero-row updates are treated as no-ops/errors instead of false success.

**B5: Connection-map isolation and constitutional cache scoping:** `vector-index-store.ts` no longer lets `initialize_db(custom_path)` overwrite the module-global default connection. Connections are tracked in `db_connections = new Map<string, Database.Database>()` keyed by resolved path, globals are updated only for the validated default store and `close_db()` closes every tracked handle. The constitutional-memory cache key now also includes the `includeArchived` flag, preventing archived-inclusive results from leaking into archived-exclusive reads.

#### Source Files

See [`08--bug-fixes-and-data-integrity/05-database-and-schema-safety.md`](08--bug-fixes-and-data-integrity/05-database-and-schema-safety.md) for full implementation and test file listings.

---

### Guards and edge cases

#### Description

Six subtle bugs were fixed. Some inflated scores, some linked data to the wrong place and several only appeared on uncommon retrieval paths. Together these fixes make sure the system produces accurate results, respects caller limits and never quietly reports the wrong state.

#### Current Reality

Six guard/edge-case issues were fixed:

**E1: Temporal contiguity double-counting:** `temporal-contiguity.ts` had an O(N^2) nested loop that processed both (A,B) and (B,A) pairs, double-counting boosts. Fixed inner loop to `j = i + 1`.

**E2: Wrong-memory fallback:** `extraction-adapter.ts` fell back to resolving the most-recent memory ID on entity resolution failure, silently linking to the wrong memory. The fallback was removed. The function returns `null` on resolution failure.

**E3: Expired multi-concept results:** `multi_concept_search()` now applies `AND (m.expires_at IS NULL OR m.expires_at > datetime('now'))`, bringing the AND-match path back in line with single-query retrieval and preventing expired memories from leaking into result sets.

**E4: Vector-search limit overflow:** `vector_search()` now returns `constitutional_results.slice(0, limit)` when constitutional injection already fills the request, so callers never receive more rows than `limit` even when the constitutional tier saturates the result set.

**E5: Embedding dimension validation:** `vector_search()` now validates embedding length before buffer conversion and throws a `VectorIndexError` with `EMBEDDING_VALIDATION` semantics instead of surfacing raw sqlite-vec errors for malformed embeddings.

**E6: Partial-status accounting:** `get_status_counts()` and `get_stats()` now include the `partial` embedding state so partially indexed rows stop disappearing from dashboard totals and status breakdowns.

#### Source Files

See [`08--bug-fixes-and-data-integrity/06-guards-and-edge-cases.md`](08--bug-fixes-and-data-integrity/06-guards-and-edge-cases.md) for full implementation and test file listings.

---

### Canonical ID dedup hardening

#### Description

The same memory was sometimes listed multiple times in search results because different parts of the system referred to it using slightly different labels. This fix standardizes how memories are identified internally so duplicates are correctly detected and merged in the results every time.

#### Current Reality

Mixed ID formats (`42`, `"42"`, `mem:42`) caused deduplication failures in hybrid search. Normalization was applied in `combinedLexicalSearch()` for the new pipeline and in legacy `hybridSearch()` for the dedup map. Regression tests `T031-LEX-05` and `T031-BASIC-04` verify the fix.

#### Source Files

See [`08--bug-fixes-and-data-integrity/07-canonical-id-dedup-hardening.md`](08--bug-fixes-and-data-integrity/07-canonical-id-dedup-hardening.md) for full implementation and test file listings.

---

### Math.max/min stack overflow elimination

#### Description

A common way of finding the largest or smallest number in a list was crashing the system when the list got too big. Several places in the code used this risky approach. All were replaced with a safer method that works no matter how large the list grows, preventing crashes on big knowledge bases.

#### Current Reality

`Math.max(...array)` and `Math.min(...array)` push all elements onto the call stack, causing `RangeError` on arrays exceeding ~100K elements. The remaining live production files converted from spread patterns to `reduce()` are:

- `causal-boost.ts`: 1 instance
- `evidence-gap-detector.ts`: 1 instance
- `prediction-error-gate.ts`: 2 instances
- `retrieval-telemetry.ts`: 1 instance
- `reporting-dashboard.ts`: 2 instances

Each replacement uses `scores.reduce((a, b) => Math.max(a, b), -Infinity)` with an `AI-WHY` comment explaining the safety rationale. Historical RSF-path conversions are no longer listed because the RSF implementation was removed (updated 2026-03-25 per deep review).

#### Source Files

See [`08--bug-fixes-and-data-integrity/08-mathmax-min-stack-overflow-elimination.md`](08--bug-fixes-and-data-integrity/08-mathmax-min-stack-overflow-elimination.md) for full implementation and test file listings.

---

### Session-manager transaction gap fixes

#### Description

When two requests arrived at the same time, they could both slip past a size limit check and add more data than allowed. This fix bundles the check and the write into a single step so they cannot be split apart, preventing the system from exceeding its own limits.

#### Current Reality

Two instances of `enforceEntryLimit()` called outside `db.transaction()` blocks in `session-manager.ts` were moved inside. Concurrent MCP requests could both pass the limit check then both insert, exceeding the entry limit when check and insert were not atomic. Both paths now run check-and-insert atomically inside the transaction.

#### Source Files

See [`08--bug-fixes-and-data-integrity/09-session-manager-transaction-gap-fixes.md`](08--bug-fixes-and-data-integrity/09-session-manager-transaction-gap-fixes.md) for full implementation and test file listings.

---

### Chunking Orchestrator Safe Swap

#### Description

When a large document gets re-split into smaller pieces, the system used to delete the old pieces before creating the new ones. If creating the new pieces failed, you lost both old and new. Now it creates the new pieces first and only swaps them in once everything is ready, like building a new fence before tearing down the old one.

#### Current Reality

During re-chunking of parent memories, the orchestrator previously deleted existing child chunks before indexing new replacements. If new chunk indexing failed (all embeddings fail, disk full), both old and new data were lost. The fix introduces a staged swap pattern: new child chunks are indexed first without a parent_id link, then a single database transaction atomically deletes old children, attaches new children to the parent and updates parent metadata. If new chunk indexing fails completely, old children remain intact and the handler returns an error status.

#### Source Files

See [`08--bug-fixes-and-data-integrity/10-chunking-orchestrator-safe-swap.md`](08--bug-fixes-and-data-integrity/10-chunking-orchestrator-safe-swap.md) for full implementation and test file listings.

---

### Working Memory Session Cleanup Timestamp Fix

#### Description

The system was accidentally deleting active sessions because it compared timestamps written in two different formats. It is like comparing "March 14" to "14/03" and getting confused about which date is newer. The fix makes both sides use the same format so active sessions are kept and only truly expired ones are cleaned up.

#### Current Reality

The `cleanupOldSessions()` method in the working memory manager compared `last_focused` timestamps (stored via SQLite `CURRENT_TIMESTAMP` as `YYYY-MM-DD HH:MM:SS`) against JavaScript `toISOString()` output (`YYYY-MM-DDTHH:MM:SS.sssZ`). The lexicographic comparison failed because space (ASCII 32) sorts before `T` (ASCII 84), causing active sessions to be incorrectly deleted. The fix replaces the JavaScript Date comparison with SQLite-native `datetime()` math: `DELETE FROM working_memory WHERE datetime(last_focused) < datetime(?, '-' || ? || ' seconds')`, keeping the comparison entirely within SQLite's datetime system.

#### Source Files

See [`08--bug-fixes-and-data-integrity/11-working-memory-timestamp-fix.md`](08--bug-fixes-and-data-integrity/11-working-memory-timestamp-fix.md) for full implementation and test file listings.

---

## 10. EVALUATION AND MEASUREMENT

### Evaluation database and schema

#### Description

When you want to know how well your search results are performing, you need a safe place to store that measurement data. This feature keeps all quality-tracking records in a separate storage area so they never mix with or interfere with the actual search results you rely on. If the measurement process ever hits a problem, your searches keep working normally as if nothing happened.

#### Current Reality

A separate SQLite database (`speckit-eval.db`) stores retrieval quality data in five tables: `eval_queries`, `eval_channel_results`, `eval_final_results`, `eval_ground_truth` and `eval_metric_snapshots`. Keeping evaluation data in its own database is a deliberate security decision. The main search database should never carry evaluation artifacts that could leak into production results.

Logging hooks in the search, context and trigger handlers are best-effort and fail-safe: they run only when `SPECKIT_EVAL_LOGGING=true`, and all write paths are wrapped in non-fatal `try/catch` blocks so query responses continue even if eval logging fails. `memory_search` and `memory_context` emit per-channel rows. `memory_match_triggers` emits query/final-result rows.

#### Source Files

See [`09--evaluation-and-measurement/01-evaluation-database-and-schema.md`](09--evaluation-and-measurement/01-evaluation-database-and-schema.md) for full implementation and test file listings.

---

### Core metric computation

#### Description

Think of this like a report card for search quality, but with twelve different grades instead of just one pass/fail. Some grades tell you whether the best answer shows up first, others tell you whether all the right answers are found at all. Together they pinpoint exactly where search is struggling, like a doctor running multiple tests to find the real problem instead of just asking "do you feel sick?"

#### Current Reality

Twelve metrics run against logged retrieval data. The four primary ones are MRR@5 (how high does the right answer rank?), NDCG@10 (are results ordered well?), Recall@20 (do we find everything relevant?) and Hit Rate@1 (is the top result correct?).

Eight diagnostic metrics add depth. Inversion rate counts pairwise ranking mistakes. Constitutional surfacing rate tracks whether high-priority memories appear in top results. Importance-weighted recall favors recall of critical content. Cold-start detection rate measures whether fresh memories surface when relevant. Precision@K and F1@K expose precision/recall balance. MAP captures ranking quality across the full relevant set. Intent-weighted NDCG adjusts ranking quality by query type.

IR rank-based metrics now use contiguous 1-based positions within the evaluated top-K slice via `getRankAtIndex() = index + 1`, not external sparse rank labels carried through filtering or reranking. That keeps MRR, NDCG, and MAP aligned with standard IR definitions instead of understating them when rank numbers have gaps.

This battery of metrics means you can diagnose where the pipeline fails, not just whether it fails.

#### Source Files

See [`09--evaluation-and-measurement/02-core-metric-computation.md`](09--evaluation-and-measurement/02-core-metric-computation.md) for full implementation and test file listings.

---

### Observer effect mitigation

#### Description

Measuring performance can sometimes slow down the thing you are measuring, like how stepping on a scale while running would trip you up. This feature makes sure that all the quality-checking work happens quietly in the background. If the measurement process breaks, your searches keep running at full speed without noticing.

#### Current Reality

Measurement infrastructure is implemented as fail-safe and best-effort rather than SLO-enforced runtime monitoring. The eval database and shadow-scoring helpers are designed so evaluation paths do not block production query flow, and shadow scoring write paths are disabled (`runShadowScoring` returns `null`, `logShadowComparison` returns `false`).

A formal p95 latency comparison (eval logging enabled vs disabled) and an automated ">10% overhead" alert are not implemented in the current code. Observer-effect control currently relies on fail-safe degradation and non-fatal handling in evaluation and observability paths.

#### Source Files

See [`09--evaluation-and-measurement/03-observer-effect-mitigation.md`](09--evaluation-and-measurement/03-observer-effect-mitigation.md) for full implementation and test file listings.

---

### Quality proxy formula

#### Description

You cannot have a person hand-check every search result after every change. This feature creates a single "quality score" from 0 to 1 that runs automatically and flags when results are getting worse. Think of it like an automated smoke detector for search quality: it watches for problems around the clock so you do not have to.

#### Current Reality

Manual evaluation does not scale. You cannot hand-review every query across every sprint.

The quality proxy formula produces a single 0-1 score from four components: `avgRelevance * 0.40 + topResult * 0.25 + countSaturation * 0.20 + latencyPenalty * 0.15`. It runs automatically on logged data and flags regressions without human review.

The weights were chosen to prioritize relevance over speed while still penalizing latency spikes. Correlation testing against the manual ground truth corpus confirmed the proxy tracks real quality well enough for regression detection.

#### Source Files

See [`09--evaluation-and-measurement/05-quality-proxy-formula.md`](09--evaluation-and-measurement/05-quality-proxy-formula.md) for full implementation and test file listings.

---

### Synthetic ground truth corpus

#### Description

To know if search results are right, you need an answer key. This is a collection of 110 test questions with known correct answers, written in everyday language rather than system keywords. It also includes trick questions designed to catch the system returning wrong results. Without this answer key, there would be no reliable way to measure whether changes actually improve or hurt search quality.

#### Current Reality

A corpus of 110 query-relevance pairs covers all seven intent types with at least five queries per type and at least three complexity tiers (simple factual, moderate relational, complex multi-hop).

40 queries are hand-written natural language, not derived from trigger phrases. That last detail matters. If your ground truth comes from the same trigger phrases the system already matches against, you are testing the system against itself.

Hard negative queries are included to verify that irrelevant memories rank low. The corpus also incorporates findings from the G-NEW-2 agent consumption analysis, so queries reflect how agents actually use the system rather than how a spec author imagines they do.

The current JSON dataset carries 297 relevance rows keyed to live parent-memory IDs in the active production database. If `context-index.sqlite` is rebuilt or replaced, operators should rerun `scripts/evals/map-ground-truth-ids.ts` before trusting ablation or dashboard comparisons against stored history.

#### Source Files

See [`09--evaluation-and-measurement/06-synthetic-ground-truth-corpus.md`](09--evaluation-and-measurement/06-synthetic-ground-truth-corpus.md) for full implementation and test file listings.

---

### BM25-only baseline

#### Description

This test answered a simple question: "Would basic keyword search be good enough on its own?" By running just keyword matching against 110 test questions and measuring how poorly it performed, the team proved that the more advanced multi-method search approach is worth the extra effort. Without this baseline measurement, you would be guessing whether the added complexity actually helps.

#### Current Reality

Running FTS5 alone (disabling vector, graph and trigger channels) on the 110-query corpus produced an MRR@5 of 0.2083. That is well below 50% of hybrid performance.

If BM25 had been competitive, the entire multi-channel approach would be questioned. Instead, the gap confirmed that hybrid retrieval adds real value over keyword search. The contingency decision to proceed with the full program was based on this measurement. No opinions, no intuitions, just a number. The in-memory BM25 channel (distinct from FTS5) runs behind the `ENABLE_BM25` flag (default ON, set `ENABLE_BM25=false` to disable).

#### Source Files

See [`09--evaluation-and-measurement/07-bm25-only-baseline.md`](09--evaluation-and-measurement/07-bm25-only-baseline.md) for full implementation and test file listings.

---

### Agent consumption instrumentation

#### Description

This is the wiring that lets the system record how AI agents actually use search results in practice. It now delegates to the graduated rollout policy for `SPECKIT_CONSUMPTION_LOG`, so the default behavior is ON unless rollout or environment settings disable it. The earlier data it collected helped shape better test questions by showing real usage patterns instead of guessed ones (updated 2026-03-25 per deep review).

#### Current Reality

Instrumentation wiring remains present in retrieval handlers (`memory_search`, `memory_context`, `memory_match_triggers`), and the runtime logger is active through `isConsumptionLogEnabled()`, which delegates to rollout policy via `isFeatureEnabled('SPECKIT_CONSUMPTION_LOG')`.

Calls remain fail-safe so instrumentation errors never break the handlers, while production runtime can actively write new `consumption_log` rows whenever rollout policy leaves the flag enabled (default ON; updated 2026-03-25 per deep review).

#### Source Files

See [`09--evaluation-and-measurement/08-agent-consumption-instrumentation.md`](09--evaluation-and-measurement/08-agent-consumption-instrumentation.md) for full implementation and test file listings.

---

### Scoring observability

#### Description

This is like a security camera for how scores change. It randomly samples a small percentage of scoring events and saves a before-and-after snapshot. If scores start behaving strangely, you can look at these recordings to understand what happened. The sampling keeps it lightweight so it does not slow anything down.

#### Current Reality

Scoring observability logs to `scoring_observations` with a 5% sampler (`SAMPLING_RATE = 0.05`). Each observation includes memory/query identifiers, score-before/score-after values, score delta and novelty/interference fields provided by the caller.

The observability module does not remove novelty fields or hardcode novelty values. It persists whatever `ScoringObservation` payload it receives. This keeps schema compatibility while allowing calling code to set novelty data to zero when the runtime feature is inactive.

Failures are fail-safe but not silent. Initialization, insert and stats-query errors are caught and logged with `console.error`, and scoring execution continues unchanged.

#### Source Files

See [`09--evaluation-and-measurement/09-scoring-observability.md`](09--evaluation-and-measurement/09-scoring-observability.md) for full implementation and test file listings.

---

### Full reporting and ablation study framework

#### Description

Imagine a car with five engines and you want to know which ones actually help. This feature turns off one engine at a time and measures whether the car goes slower or faster. If removing an engine makes things worse, it is pulling its weight. If removing it makes things better, it was actually hurting. A dashboard then shows trends over time so you can spot problems early.

#### Current Reality

The ablation study framework disables one retrieval channel at a time (vector, BM25, FTS5, graph or trigger) and measures Recall@20 delta against a full-pipeline baseline. "What happens if we turn off the graph channel?" now has a measured answer rather than speculation.

The framework uses dependency injection for the search function, making it testable without the full pipeline. Statistical significance is assessed via a sign test using log-space binomial coefficient computation (preventing overflow for n>50, fixed in Sprint 8). Verdict classification ranges from CRITICAL (channel removal causes significant regression) through negligible to HARMFUL (channel removal actually improves results). Results are stored in `eval_metric_snapshots` with negative timestamp IDs to distinguish ablation runs from production evaluation data. The framework runs behind the `SPECKIT_ABLATION` flag. Token-usage aggregation now filters to finite values greater than zero, so ablation reports stop emitting synthetic `0` token rows when `runAblation()` has no real token-usage samples to aggregate.

The reporting dashboard aggregates per-sprint metric summaries (mean, min, max, latest and count) and per-channel performance views (hit count, average latency and query count) from the evaluation database. Trend analysis compares consecutive runs to detect regressions. Sprint labels are inferred from metadata JSON. A `isHigherBetter()` helper correctly interprets trend direction for different metric types. The dashboard now calls `getEvalDb()` before falling back to `initEvalDb()`, which preserves an already-selected non-default or test eval DB instead of silently switching back to the default one. Its request `limit` is the number of sprint groups kept after grouping, not the number of raw eval runs fetched. Both the ablation runner and the dashboard are exposed as new MCP tools: `eval_run_ablation` and `eval_reporting_dashboard`.

#### Source Files

See [`09--evaluation-and-measurement/10-full-reporting-and-ablation-study-framework.md`](09--evaluation-and-measurement/10-full-reporting-and-ablation-study-framework.md) for full implementation and test file listings.

---

### Test quality improvements

#### Description

Tests are supposed to catch bugs, but some of these tests had their own problems. A few would pass even when the thing they tested was broken, others would leak resources and some were testing the wrong thing entirely. This round of fixes made the tests themselves more trustworthy, because a test suite you cannot trust is worse than no tests at all.

#### Current Reality

Four test quality issues were addressed:

**P2a:** `memory-save-extended.vitest.ts` timeout increased from 5000ms to 15000ms (eliminated flaky timeout failures).

**P2b:** `entity-linker.vitest.ts` gained `db.close()` in `afterEach` (prevented file handle leaks).

**P2c:** Four tautological flag tests in `integration-search-pipeline.vitest.ts` were rewritten to test actual behavioral differences instead of testing what they set up.

**P2d:** A duplicate T007 test block was identified as pre-resolved (not present in current file).

**Additional fixes:** `memory-parser.ts` gained a `/z_archive/` exclusion in `isMemoryFile()` spec doc detection. 18+ test files were updated to match changed source behavior (reconsolidation, five-factor-scoring, working-memory, session-cleanup, channel tests, entity tests, extraction-adapter, intent-routing and others). Test count adjusted from 7,027 to 7,003 (24 tests for removed dead-code features were deleted).

#### Source Files

See [`09--evaluation-and-measurement/12-test-quality-improvements.md`](09--evaluation-and-measurement/12-test-quality-improvements.md) for full implementation and test file listings.

This remains a cross-cutting meta-improvement applied across multiple modules.

---

### Evaluation and housekeeping fixes

#### Description

These are six small but important fixes for the testing and bookkeeping systems. They address issues like counters that reset when the system restarts, clean-up routines that did not run properly and safety guards for unexpected input. Think of it as tightening loose bolts: none were causing a breakdown yet, but leaving them loose would eventually cause trouble.

#### Current Reality

Six fixes addressed evaluation framework reliability and protocol-boundary safety:

- **Ablation recallK (#33):** Ablation search limit uses `recallK` parameter instead of hardcoded 20.
- **evalRunId persistence (#34):** `_evalRunCounter` lazy-initializes from `MAX(eval_run_id)` in the eval DB on first call, surviving server restarts.
- **Postflight re-correction (#35):** `task_postflight` SELECT now matches `phase IN ('preflight', 'complete')` so re-posting updates the existing record instead of failing.
- **parseArgs guard (#36):** `parseArgs<T>()` returns `{} as T` for null/undefined/non-object input at the protocol boundary.
- **128-bit dedup hash (#37):** Session dedup hash extended from `.slice(0, 16)` (64-bit) to `.slice(0, 32)` (128-bit) to reduce collision probability.
- **Exit handler cleanup (#38):** `_exitFlushHandler` reference stored. `cleanupExitHandlers()` now calls `process.removeListener()` for `beforeExit`, `SIGTERM` and `SIGINT`.

#### Source Files

See [`09--evaluation-and-measurement/13-evaluation-and-housekeeping-fixes.md`](09--evaluation-and-measurement/13-evaluation-and-housekeeping-fixes.md) for full implementation and test file listings.

---

### Cross-AI validation fixes

#### Description

Three different AI reviewers independently checked the codebase and found 14 issues that the original review missed. This is like getting a second and third opinion from different doctors: each one catches things the others overlooked. The fixes addressed problems ranging from tests that secretly passed when they should have failed to errors that were silently swallowed instead of reported.

#### Current Reality

Independent reviews by Gemini 3.1 Pro and Codex gpt-5.3-codex identified 14 issues missed by the original audit. Key fixes:

- **CR-P0-1:** Test suite false-pass patterns. 21 silent-return guards converted to `it.skipIf()`, fail-fast imports with throw on required handler/vectorIndex missing.
- **CR-P1-1:** Deletion exception propagation. Causal edge cleanup errors in single-delete now propagate (previously swallowed).
- **CR-P1-2:** Re-sort after feedback mutations before top-K slice in Stage 2 fusion.
- **CR-P1-3:** Dedup queries gained `AND parent_id IS NULL` to exclude chunk rows.
- **CR-P1-4:** Session dedup `id != null` guards against undefined collapse.
- **CR-P1-5:** Cache lookup moved before embedding readiness gate in search handler.
- **CR-P1-6:** Partial-update DB mutations wrapped inside transaction.
- **CR-P1-8:** Config env var fallback chain (`SPEC_KIT_DB_DIR || SPECKIT_DB_DIR`).
- **CR-P2-3:** Dashboard row limit configurable via `SPECKIT_DASHBOARD_LIMIT` (default 10000) with NaN guard.
- **CR-P2-5:** `Number.isFinite` guards on evidence gap detector scores.

All 14 items verified through 3-stage review: Codex implemented, Gemini reviewed, Claude final-reviewed.

#### Source Files

See [`09--evaluation-and-measurement/14-cross-ai-validation-fixes.md`](09--evaluation-and-measurement/14-cross-ai-validation-fixes.md) for full implementation and test file listings.

This remains a cross-cutting meta-improvement applied across multiple modules.

---

### Memory roadmap baseline snapshot

#### Description

Before rolling out a big upgrade, you want to take a "before" photo so you can compare it with the "after." This feature captures a snapshot of how the memory system is performing right now, including how many searches are happening and whether the storage is set up correctly. That snapshot becomes the baseline you measure progress against during the rollout.

#### Current Reality

`captureMemoryStateBaselineSnapshot()` records a small Phase 1 readiness baseline for the memory-roadmap rollout slice. It reads retrieval-volume metrics from the eval database (`eval_queries`, `eval_channel_results`, `eval_final_results`) and isolation/schema metrics from the target context database (`memory_index`, `schema_version`), then returns a single snapshot with timestamp, eval run ID, metrics map and metadata.

When `persist: true`, every metric is written into `eval_metric_snapshots` with `channel = 'memory-state-baseline'`. The metadata attached to each persisted row includes the resolved memory-roadmap phase, the compatibility-supported roadmap capability flags, `scopeDimensionsTracked` and the resolved `contextDbPath`. Missing or unreadable context databases are non-fatal: retrieval metrics still record and context-backed metrics fall back to zero.

The baseline path now initializes the eval database beside the context database under test instead of silently writing to the default eval location. That keeps ad-hoc migration and rollout checks scoped to the database actually being evaluated. The path switch is also wrapped in `try/finally`, so even if `initEvalDb()` fails after closing the previous singleton, the prior eval DB handle is restored instead of leaving global eval state clobbered for later calls.

#### Source Files

See [`09--evaluation-and-measurement/17-memory-roadmap-baseline-snapshot.md`](09--evaluation-and-measurement/17-memory-roadmap-baseline-snapshot.md) for full implementation and test file listings.

---

### INT8 quantization evaluation

#### Description

This evaluated whether compressing stored data to save space was worth the trade-off in search accuracy. The answer was no: the storage saved was tiny and the risk of slightly worse results was not justified. Think of it like deciding whether to photocopy your photos at lower quality to save a filing cabinet drawer. When the drawer is mostly empty anyway, the savings are not worth the blur.

#### Current Reality

Decision: **NO-GO**. All three activation criteria were unmet.

Active memories with embeddings: 2,412 measured versus the 10,000 threshold (24.1%). P95 search latency: approximately 15ms measured versus the 50ms threshold (approximately 30%). Embedding dimensions: 1,024 measured versus the 1,536 threshold (66.7%).

The estimated 7.1 MB storage savings (3.9% of 180 MB total DB) did not justify 5.32% estimated recall risk, custom quantized BLOB complexity or KL-divergence calibration overhead. Re-evaluate when the corpus grows approximately 4x (above 10K memories), sustained p95 exceeds 50ms or the embedding provider changes to dimensions above 1,536.

#### Source Files

See [`09--evaluation-and-measurement/16-int8-quantization-evaluation.md`](09--evaluation-and-measurement/16-int8-quantization-evaluation.md) for details.

---

## 11. GRAPH SIGNAL ACTIVATION

### Typed-weighted degree channel

#### Description

This gives a search bonus to memories that are well-connected to other memories, like how a person who knows many people in a community is often a good source of information. Different types of connections count for different amounts, and there is a cap to prevent any single well-connected memory from dominating all search results just because it links to everything.

#### Current Reality

A fifth RRF channel scores memories by their graph connectivity. Edge type weights range from caused at 1.0 down to supports at 0.5, with logarithmic normalization and a hub cap (`MAX_TYPED_DEGREE=15`, `MAX_TOTAL_DEGREE=50`, `DEGREE_BOOST_CAP=0.15`) to prevent any single memory from dominating results through connections alone.

Constitutional memories are excluded from degree boosting because they already receive top-tier visibility. The channel runs behind the `SPECKIT_DEGREE_BOOST` feature flag with a degree cache that invalidates only on graph mutations, not per query. That cache is now scoped per database instance via `WeakMap<Database.Database, Map<string, number>>`, with `getDegreeCacheForDb(database)` for lookup and `clearDegreeCacheForDb(database)` for explicit invalidation, so scores from one DB can no longer leak into another. When a memory has zero edges, the channel returns 0 rather than failing.

#### Source Files

See [`10--graph-signal-activation/01-typed-weighted-degree-channel.md`](10--graph-signal-activation/01-typed-weighted-degree-channel.md) for full implementation and test file listings.

---

### Co-activation boost strength increase

#### Description

When two memories are connected in the knowledge graph, finding one should help surface the other. The original boost from these connections was too weak to make a noticeable difference. This change turned up the volume so that graph connections actually influence what shows up in your search results, making the relationship map between memories useful rather than decorative.

#### Current Reality

The co-activation boost multiplier jumped from 0.1x to 0.25-0.3x. At 0.1x, the graph signal investment was barely visible in retrieval results, roughly 5% effective contribution at hop 2.

The new multiplier targets 15% or higher contribution, which is enough to matter without overwhelming the vector and lexical channels. You can tune the exact value through the `SPECKIT_COACTIVATION_STRENGTH` environment variable. A dark-run measurement sequence isolates A7 contribution by comparing R4-only results against R4+A7 results.

#### Source Files

See [`10--graph-signal-activation/02-co-activation-boost-strength-increase.md`](10--graph-signal-activation/02-co-activation-boost-strength-increase.md) for full implementation and test file listings.

---

### Edge density measurement

#### Description

This measures how richly connected the knowledge graph is by counting the average number of links per memory. If there are too few connections, graph-based features would not add much value. If there are too many, the system holds off on creating new links to avoid a tangled mess. It is like a city planner checking road density before building more highways.

#### Current Reality

The current density metric used by runtime guards is global edge density: `total_edges / total_memories` from the graph tables. If density is too low, graph-derived gains are naturally limited. If density is too high, entity-linking creation is gated by the configured density threshold. Earlier "edges-per-node" phrasing is still useful intuition, but runtime checks now use the global-density denominator for consistency.

#### Source Files

See [`10--graph-signal-activation/03-edge-density-measurement.md`](10--graph-signal-activation/03-edge-density-measurement.md) for full implementation and test file listings.

---

### Weight history audit tracking

#### Description

Every connection between memories now keeps a paper trail: who created it, when it was last used and every time its strength changed. This works like a change log for relationships. If a connection goes wrong, you can trace exactly what happened and roll it back. There are also limits on automatically created connections so the system cannot overwhelm itself with too many links.

#### Current Reality

Every causal edge now carries `created_by` and `last_accessed` metadata fields tracking who created the edge and when it was last used. All strength modifications are logged to a `weight_history` table recording old strength, new strength, the actor (`changed_by`), timestamp and reason.

Edge bounds are enforced at insert time. Auto-generated edges (those with `created_by='auto'`) are rejected when a node already has 20 edges (`MAX_EDGES_PER_NODE`) and clamped to a maximum strength of 0.5 (`MAX_AUTO_STRENGTH`). A `rollbackWeights()` function restores edges from weight history with a fallback to the oldest entry if timestamp matching fails due to same-millisecond updates.

This audit infrastructure supports the N3-lite consolidation engine: Hebbian strengthening, staleness detection and edge bounds enforcement all rely on accurate weight history and provenance tracking.

#### Source Files

See [`10--graph-signal-activation/04-weight-history-audit-tracking.md`](10--graph-signal-activation/04-weight-history-audit-tracking.md) for full implementation and test file listings.

---

### Graph momentum scoring

#### Description

This tracks how quickly a piece of knowledge is gaining connections to other knowledge. Think of it like a trending topic: the faster something connects to related ideas, the more likely it is to be relevant right now. A memory that gained three new links this week gets a small search boost compared to one whose connections have not changed in months.

#### Current Reality

Graph connectivity changes over time, and that trajectory carries signal. A memory gaining three new edges this week is more actively relevant than one whose connections have been static for months.

Graph momentum computes a temporal degree delta: `current_degree - degree_7d_ago`. The `degree_snapshots` table records per-node degree counts at daily granularity with a UNIQUE constraint on `(memory_id, snapshot_date)`. The `snapshotDegrees()` function captures the current state, and `computeMomentum()` looks back 7 days to calculate the delta.

The momentum signal applies as an additive bonus in Stage 2 of the pipeline, capped at +0.05 per result. Batch computation via `computeMomentumScores()` is session-cached to avoid repeated database queries within a single search request. Cache invalidation follows the established pattern from `graph-search-fn.ts`: caches clear on edge mutations via `clearGraphSignalsCache()`.

When no snapshot exists for the 7-day lookback (common during initial rollout), the momentum defaults to zero rather than penalizing the memory. Runs behind the `SPECKIT_GRAPH_SIGNALS` flag (default ON, shared with N2b).

#### Source Files

See [`10--graph-signal-activation/05-graph-momentum-scoring.md`](10--graph-signal-activation/05-graph-momentum-scoring.md) for full implementation and test file listings.

---

### Causal depth signal

#### Description

Not all knowledge sits at the same level. A big decision that led to five smaller tasks is a "root" while those tasks are "leaves." This feature measures how deep each memory sits in that tree of cause-and-effect relationships. It gives a small search boost based on that depth, acting as a tiebreaker when two results are otherwise equally relevant.

#### Current Reality

Not all memories sit at the same level of abstraction. A root decision that caused five downstream implementation memories occupies a different position in the knowledge graph than a leaf node.

Causal depth measures each memory's longest structural distance from a root strongly connected component. The causal graph is first condensed into SCCs, then longest-path depth is computed across the resulting DAG so shortcut edges do not suppress deeper chains and cycle members share one bounded depth layer. The raw component depth is normalized by the deepest reachable component chain to produce a [0,1] score. A memory in a component at depth 3 within a graph whose deepest reachable component chain is 6 scores 0.5.

Like momentum, the depth signal applies as an additive bonus in Stage 2, capped at +0.05. Batch computation via `computeCausalDepthScores()` shares the same session cache infrastructure as momentum. Both signals are applied together by `applyGraphSignals()`, which iterates over pipeline rows and adds the combined bonus. A single-node variant of `computeCausalDepth` was removed during Sprint 8 remediation as dead code (the batch version `computeCausalDepthScores` is the only caller).

The combined N2a+N2b adjustment is modest by design: up to +0.10 total. This keeps graph signals as a tiebreaker rather than a dominant ranking factor. Runs behind the `SPECKIT_GRAPH_SIGNALS` flag (default ON, shared with N2a).

#### Source Files

See [`10--graph-signal-activation/06-causal-depth-signal.md`](10--graph-signal-activation/06-causal-depth-signal.md) for full implementation and test file listings.

---

### Community detection

#### Description

Memories naturally form clusters around related topics, like how books on a shelf group by subject. This feature identifies those clusters automatically. When you find one useful memory, the system can pull in its neighbors from the same cluster because they are likely related to what you are looking for. It is like finding one helpful book and having the librarian hand you the two sitting next to it.

#### Current Reality

Individual memories are retrieved based on query similarity, but they exist within communities of related knowledge. Community detection identifies these clusters so that when one member surfaces, its neighbors get a retrieval boost.

The primary algorithm is BFS connected components over the causal edge adjacency list. This is fast and sufficient when the graph has natural cluster boundaries. When the largest connected component exceeds 50% of all nodes (meaning the graph is too densely connected for BFS to produce meaningful clusters), the system escalates to a simplified pure-TypeScript Louvain modularity optimization. The Louvain implementation performs iterative node moves between communities to maximize modularity score Q, converging when no single move improves Q.

Community assignments are stored in the `community_assignments` table with a UNIQUE constraint on `memory_id`. Detection and persistence helpers (`detectCommunities*`, `storeCommunityAssignments`) include debounce logic, but they are not auto-invoked in the Stage 2 hot path.

The `applyCommunityBoost()` function in the pipeline injects up to 3 community co-members into the result set at 0.3x the source memory's score, using whatever assignments already exist in `community_assignments`. Community injection runs in Stage 2 at position 2b (between causal boost and graph signals) so that injected rows also receive N2a+N2b momentum and depth adjustments. Runs behind the `SPECKIT_COMMUNITY_DETECTION` flag (default ON).

#### Source Files

See [`10--graph-signal-activation/07-community-detection.md`](10--graph-signal-activation/07-community-detection.md) for full implementation and test file listings.

---

### Graph and cognitive memory fixes

#### Description

This is a collection of seven bug fixes for the relationship graph and memory scoring systems. Problems included a memory linking to itself (a loop that makes no sense), cluster detection that could not tell when links were deleted and replaced, and scores that could climb higher than they should. Without these fixes, the graph connections and scoring would slowly drift into unreliable territory.

#### Current Reality

Seven fixes (of 9 planned, 2 deferred) addressed graph integrity and cognitive scoring:

- **Self-loop prevention (#24):** `insertEdge()` rejects `sourceId === targetId`.
- **maxDepth clamping (#25):** `handleMemoryDriftWhy` clamps `maxDepth` to [1, 10] server-side.
- **Community debounce (#27):** Replaced edge-count-only debounce with `count:maxId` hash. Edge count alone can't detect deletions followed by insertions that maintain the same count.
- **Orphaned edge cleanup (#28):** New `cleanupOrphanedEdges()` function exported from `causal-edges.ts`.
- **WM score clamping (#29):** Working memory scores clamped to `[DECAY_FLOOR, 1.0]` to prevent mention boost from exceeding normalized range.
- **Double-decay removal (#30):** Trigger handler no longer double-decays working-memory entries in the `fullRecord + wmEntry` path. The fallback branch without `fullRecord` still applies one turn-decay step to preserve baseline behavior.
- **Co-activation cache (#32):** `clearRelatedCache()` called from `memory-bulk-delete.ts` after bulk operations.

**Deferred:** #26 (FK existence check on causal edges, test fixtures use synthetic IDs not in memory_index) and #31 (session entry limit off-by-one, code already correct).

#### Source Files

See [`10--graph-signal-activation/08-graph-and-cognitive-memory-fixes.md`](10--graph-signal-activation/08-graph-and-cognitive-memory-fixes.md) for full implementation and test file listings.

---

### ANCHOR tags as graph nodes

#### Description

Anchor markers are labels placed inside memories to highlight important sections. This planned feature would turn those labels into connection points in the knowledge graph, letting the system link specific parts of different memories together instead of just linking whole memories. It has been put on hold pending further investigation into whether the added complexity is worthwhile.

#### Current Reality

**PLANNED (Sprint 019): DEFERRED.** Promoting parsed ANCHOR markers into typed graph nodes (most creative insight from cross-AI research, Gemini-2) is deferred behind a dedicated 2-day feasibility spike. Estimated effort: S-M (3-5 days).

#### Source Files

See [`10--graph-signal-activation/09-anchor-tags-as-graph-nodes.md`](10--graph-signal-activation/09-anchor-tags-as-graph-nodes.md) for full implementation and test file listings.

---

### Causal neighbor boost and injection

#### Description

When a search result scores highly, this feature follows its cause-and-effect links to find related memories nearby in the graph. Those neighbors get a score bump because if Memory A is relevant and it caused or enabled Memory B, there is a good chance Memory B matters too. There is a ceiling on how much boost any result can receive so that highly connected clusters do not take over all the top spots.

#### Current Reality

After Stage 2 fusion produces a ranked result set, the causal boost module walks the `causal_edges` graph to amplify scores for memories related to top-ranked seed results. Up to 25% of the result set (capped at 5) serves as seed nodes. The graph walk traverses up to 2 hops via a weighted recursive CTE, applying a per-hop base boost capped at 0.05.

Relation-type weight multipliers are applied during traversal as follows: `supersedes` (1.5), `contradicts` (0.8), and `caused`/`enabled`/`derived_from`/`supports` (1.0). These weights are combined with edge `strength` to scale neighbor amplification while preserving the hop-depth cap.

The combined causal + session boost ceiling is 0.20, preventing runaway score inflation from graph-dense clusters. The feature is gated by `SPECKIT_CAUSAL_BOOST` (default `true`). When disabled, results pass through without graph-based score adjustment.

#### Source Files

See [`10--graph-signal-activation/10-causal-neighbor-boost-and-injection.md`](10--graph-signal-activation/10-causal-neighbor-boost-and-injection.md) for full implementation and test file listings.

---

### Temporal contiguity layer

#### Description

Memories created around the same time are often about the same topic, like notes taken during the same meeting. This feature gives a search boost to results that were stored close together in time. If one memory from a Tuesday afternoon session is relevant, the others from that same session probably are too. The boost fades as the time gap between memories grows larger.

#### Current Reality

The temporal contiguity module (`lib/cognitive/temporal-contiguity.ts`) boosts search result scores when memories were created close together in time. Given an in-memory set of search results, it applies pairwise temporal boosts inside a clamped window (`1..86400` seconds, default 3600). Each pair contributes a distance-weighted boost using factor `0.15`, with a cumulative cap of `0.50` per result.

The module also provides `getTemporalNeighbors()` for direct temporal neighborhood lookups and `buildTimeline()` for chronological timeline construction. This captures the temporal contiguity effect from memory psychology: memories formed close together in time are often contextually related.

#### Source Files

See [`10--graph-signal-activation/11-temporal-contiguity-layer.md`](10--graph-signal-activation/11-temporal-contiguity-layer.md) for full implementation and test file listings.

---

### Unified graph retrieval, deterministic ranking, explainability, and rollback

#### Description

This brings all the graph-based search features together into one reliable path. The same query will always return results in the same order, and you can see exactly why each result ranked where it did. If anything goes wrong with the graph features, a single switch turns them off and search falls back to working without them. Think of it as a well-labeled control panel with an emergency off switch.

#### Current Reality

Phase 3 finalized a unified graph retrieval path in the live pipeline. Stage 2 fusion and Stage 3 rerank now share a stable ranking contract so repeated identical queries keep deterministic ordering, including tie-break behavior.

Explainability is exposed through retrieval trace payloads: graph-side contributions are emitted as explicit trace metadata when graph participation is enabled. This keeps ranking rationale inspectable without changing the public search result contract.

Rollback is controlled by the runtime graph gate (`SPECKIT_GRAPH_UNIFIED`). Disabling the gate removes graph-side effects while preserving deterministic baseline ordering and trace safety for non-graph runs.

#### Source Files

See [`10--graph-signal-activation/12-unified-graph-retrieval-deterministic-ranking-explainability-and-rollback.md`](10--graph-signal-activation/12-unified-graph-retrieval-deterministic-ranking-explainability-and-rollback.md) for full implementation and test file listings.

> **Playbook:** [120](../manual_testing_playbook/manual_testing_playbook.md)

---

### Typed traversal

#### Description

Typed traversal enables sparse-first graph policy and intent-aware edge traversal for causal boost scoring, constraining traversal to typed 1-hop expansion in sparse graphs and mapping query intents to edge-type priority orderings.

#### Current Reality

Enabled by default (graduated). Set `SPECKIT_TYPED_TRAVERSAL=false` to disable. When graph density falls below `SPARSE_DENSITY_THRESHOLD = 0.5`, community detection is disabled and traversal is constrained to `SPARSE_MAX_HOPS = 1` typed expansion. Intent-aware edge traversal maps classified query intents to edge-type priority orderings via `INTENT_EDGE_PRIORITY`. The traversal score is computed as `score = seedScore * edgePrior * hopDecay * freshness`. Edge prior scores are tiered: first-listed relation = 1.0, second = 0.75, remaining = 0.5.

#### Source Files

See [`10--graph-signal-activation/16-typed-traversal.md`](10--graph-signal-activation/16-typed-traversal.md) for full implementation and test file listings.

---

### Graph lifecycle refresh

#### Description

Graph lifecycle refresh manages dirty-node tracking and graph recomputation after write operations, with synchronous local or scheduled background modes controlled by the `SPECKIT_GRAPH_REFRESH_MODE` flag.

#### Current Reality

Enabled by default (graduated). `SPECKIT_GRAPH_REFRESH_MODE` defaults to `write_local`; set `SPECKIT_GRAPH_REFRESH_MODE=off` to disable graph refresh entirely. Small connected components (up to 50 nodes) are recomputed synchronously during the save operation, while `scheduled` queues larger components for a background global refresh.

#### Source Files

See [`10--graph-signal-activation/13-graph-lifecycle-refresh.md`](10--graph-signal-activation/13-graph-lifecycle-refresh.md) for full implementation and test file listings.

---

### Async LLM graph backfill

#### Description

Async LLM graph backfill enriches high-value documents with probabilistic graph edges via an LLM call after deterministic extraction, gated by the `SPECKIT_LLM_GRAPH_BACKFILL` flag.

#### Current Reality

Enabled by default (graduated). Set `SPECKIT_LLM_GRAPH_BACKFILL=false` to disable. High-value documents receive an async LLM-based enrichment pass after the synchronous deterministic extraction completes, and the backfill is scheduled when `SPECKIT_GRAPH_REFRESH_MODE` is `write_local` or `scheduled`.

#### Source Files

See [`10--graph-signal-activation/14-llm-graph-backfill.md`](10--graph-signal-activation/14-llm-graph-backfill.md) for full implementation and test file listings.

---

### Graph calibration profiles and community thresholds

#### Description

Graph calibration profiles enforce weight caps, RRF fusion overflow limits, and Louvain community detection activation gates, with named presets controlled by the `SPECKIT_GRAPH_CALIBRATION_PROFILE` flag.

#### Current Reality

Enabled by default (graduated). Set `SPECKIT_GRAPH_CALIBRATION_PROFILE=false` to disable. The calibration module defines two profiles. The default profile sets `GRAPH_WEIGHT_CAP = 0.05`, `n2aCap = 0.10`, `n2bCap = 0.10`, `louvainMinDensity = 0.3`, and `louvainMinSize = 10`. The aggressive profile tightens these to `graphWeightCap = 0.03`, `n2aCap = 0.07`, `n2bCap = 0.07`, `louvainMinDensity = 0.5`, and `louvainMinSize = 20`. Community score boost is capped at `COMMUNITY_SCORE_CAP = 0.03`.

#### Source Files

See [`10--graph-signal-activation/15-graph-calibration-profiles.md`](10--graph-signal-activation/15-graph-calibration-profiles.md) for full implementation and test file listings.

---

## 12. SCORING AND CALIBRATION

### Score normalization

#### Description

Different search methods produce scores on different scales, like comparing grades from different schools. This feature puts all scores on the same 0-to-1 scale so they can be compared fairly before picking the best results. Without it, one method might always win just because its numbers happen to be bigger, not because its results are actually better.

#### Current Reality

Before normalization, RRF and composite scoring used different raw scales. In `shared/algorithms/rrf-fusion.ts`, RRF uses `1 / (k + rank)` with `DEFAULT_K = 40`, so a top-ranked per-source contribution starts near `1/41 ~= 0.024` and decays by rank (with convergence bonuses potentially pushing combined raw scores above `0.1`). Composite scoring already operates in a `0-1` band.

Min-max normalization now maps both outputs to `0-1`, letting relevance signals compete on comparable scale instead of whichever subsystem emits larger raw magnitudes. Single-result queries and equal-score edge cases normalize to `1.0`.

Normalization is batch-relative (the same memory can score differently across different queries), which is expected for min-max. Runtime gating uses `SPECKIT_SCORE_NORMALIZATION`: `isScoreNormalizationEnabled()`/`normalizeRrfScores()` in `shared/algorithms/rrf-fusion.ts` and `isCompositeNormalizationEnabled()`/`normalizeCompositeScores()` in `mcp_server/lib/scoring/composite-scoring.ts`.

#### Source Files

See [`11--scoring-and-calibration/01-score-normalization.md`](11--scoring-and-calibration/01-score-normalization.md) for full implementation and test file listings.

---

### Cold-start novelty boost

#### Description

Brand-new memories start with a disadvantage because the scoring system has not had time to learn how useful they are. This feature gives freshly saved memories a temporary boost that fades over two days, like a "new arrival" spotlight at a bookstore. It has since been turned off because testing showed it was not making a practical difference, but the logic is kept around in case it is needed later.

#### Current Reality

FSRS temporal decay biases against recent items. A memory indexed 2 hours ago has barely any retrievability score, even when it is exactly what you need.

The novelty boost applies an exponential decay (`0.15 * exp(-elapsed_hours / 12)`) to memories under 48 hours old, counteracting that bias. At indexing time, the boost is 0.15. After 12 hours, it drops to about 0.055. By 48 hours, it is effectively zero.

The boost applies before FSRS decay and caps the composite score at 0.95 to prevent runaway inflation. One side effect: memories with high base scores (above 0.80) see diminished effective boost because the cap clips them. That is intentional. High-scoring memories do not need extra help.

**Sprint 8 update:** The `calculateNoveltyBoost()` call was removed from the hot scoring path in `composite-scoring.ts` because evaluation showed it always returned 0. The function definition remains but is no longer invoked during search. Telemetry fields are hardcoded to `noveltyBoostApplied: false, noveltyBoostValue: 0` for log schema compatibility.

#### Source Files

See [`11--scoring-and-calibration/02-cold-start-novelty-boost.md`](11--scoring-and-calibration/02-cold-start-novelty-boost.md) for full implementation and test file listings.

---

### Interference scoring

#### Description

If you have five nearly identical memories about the same thing, they can all crowd into the top results and push out something different that might actually be more helpful. This feature penalizes memories that look too similar to their neighbors, making room for a wider variety of results. It is like a rule that says "no more than one song per artist on a playlist" to keep things diverse.

#### Current Reality

Memories in dense similarity clusters tend to crowd out unique results. If you have five near-identical memories about the same topic, all five can occupy the top results and push out a different memory that might be more relevant.

Interference scoring penalizes cluster density: for each memory, the system counts how many neighbors exceed a 0.75 text similarity threshold (Jaccard over word tokens from title and trigger phrases) within the same spec folder, then applies a `-0.08 * interference_score` penalty in composite scoring. (Novelty boost remains disabled in the hot path.)

Both the threshold (0.75) and coefficient (-0.08) are provisional. They will be tuned empirically after two R13 evaluation cycles, tracked as FUT-S2-001. Runs behind the `SPECKIT_INTERFERENCE_SCORE` flag.

#### Source Files

See [`11--scoring-and-calibration/03-interference-scoring.md`](11--scoring-and-calibration/03-interference-scoring.md) for full implementation and test file listings.

---

### Classification-based decay

#### Description

Not all memories should fade at the same speed. A key decision made months ago is still important, but a quick scratch note from last week probably is not. This feature adjusts how fast memories lose relevance based on what kind of memory they are and how important they were marked. Critical decisions never fade. Temporary notes fade quickly. Everything else falls somewhere in between.

#### Current Reality

Not all memories should decay at the same rate. A decision record from six months ago is still relevant. A scratch note from last Tuesday probably is not.

FSRS decay rates now vary by a two-dimensional multiplier matrix. On the context axis: decisions never decay (stability set to Infinity), research memories get 2x stability and implementation/discovery/general memories follow the standard rate. On the tier axis: constitutional and critical memories never decay, important memories get 1.5x stability, normal memories follow the standard, temporary memories decay at 0.5x and deprecated at 0.25x.

The combined multiplier uses `Infinity` for never-decay cases, which produces `R(t) = 1.0` for all t without special-case logic. The shared memory-type config validator now rejects `halfLifeDays: 0` in addition to negative values, matching the `positive number or null` contract and blocking undefined zero-half-life schedules from entering classification-backed decay configuration. Runs behind the `SPECKIT_CLASSIFICATION_DECAY` flag.

#### Source Files

See [`11--scoring-and-calibration/04-classification-based-decay.md`](11--scoring-and-calibration/04-classification-based-decay.md) for full implementation and test file listings.

---

### Folder-level relevance scoring

#### Description

Instead of searching through every memory equally, this feature first ranks the folders they live in. Recent, important and actively used folders rise to the top while archived folders sink to the bottom. The system then searches within the top folders first. It is like checking the most promising filing cabinets before digging through the dusty ones in the back.

#### Current Reality

A four-factor weighted formula scores each spec folder: `score = (recency * 0.40) + (importance * 0.30) + (activity * 0.20) + (validation * 0.10)`. Recency uses a decay function `1 / (1 + days * 0.10)` so a 7-day-old folder scores about 0.59 and a 10-day-old folder about 0.50. Importance averages the tier weights of all memories in the folder. Activity caps at 1.0 when a folder has 5 or more memories. Archive folders (`z_archive/`, `scratch/`, `test-`, `prototype/`) receive a 0.1-0.2 multiplier to keep them out of top results.

This scoring enables two-phase retrieval: first rank folders by aggregated score, then search within the top-ranked folders. The DocScore formula `(1/sqrt(M+1)) * SUM(score(m))` provides damped aggregation so large folders do not dominate by volume alone. Runs behind the `SPECKIT_FOLDER_SCORING` flag (default ON).

#### Source Files

See [`11--scoring-and-calibration/05-folder-level-relevance-scoring.md`](11--scoring-and-calibration/05-folder-level-relevance-scoring.md) for full implementation and test file listings.

---

### Embedding cache

#### Description

Converting text into the numerical format the search engine understands is the slowest and most expensive step. This feature saves those conversions so the system does not have to redo them when the same content is indexed again. It is like keeping a translated copy of a document instead of hiring the translator every time you need it. If the content has not changed, the saved version is used instantly.

#### Current Reality

Embedding API calls are the most expensive operation in the indexing pipeline. The embedding cache stores generated embeddings in a SQLite table keyed by SHA-256 content hash and model ID. On re-index, the system checks the cache first.

A hit returns the stored embedding in microseconds instead of making a network round-trip that costs money and takes hundreds of milliseconds. LRU eviction via `last_used_at` prevents unbounded cache growth, and the `INSERT OR REPLACE` strategy handles model upgrades cleanly.

The cache has no feature flag because cache misses fall through to normal embedding generation with zero behavioral change.

#### Source Files

See [`11--scoring-and-calibration/06-embedding-cache.md`](11--scoring-and-calibration/06-embedding-cache.md) for full implementation and test file listings.

---

### Double intent weighting investigation

#### Description

This investigation checked whether the system was accidentally applying the same scoring adjustment twice, which would be like getting double-taxed. It turns out the two adjustments work at different levels on purpose: one controls which search methods contribute to results and the other controls how result qualities are weighed afterward. They do not overlap, so no fix was needed.

#### Current Reality

A full pipeline trace through `hybrid-search.ts`, `intent-classifier.ts` and `adaptive-fusion.ts` investigated whether intent weights applied at two separate points was a bug. The answer: intentional design.

System A (`INTENT_WEIGHT_PROFILES` in adaptive fusion) controls how much each channel contributes during RRF fusion. System B (`INTENT_WEIGHT_ADJUSTMENTS` in the intent classifier) controls how result attributes (similarity, importance, recency) are weighted after fusion. These operate on different dimensions at different pipeline stages and serve complementary purposes.

A minor inefficiency exists (recency boost from System A is discarded when System B re-scores), but it is harmless. No code change needed. The 4-stage pipeline (R6) resolved this structurally: Stage 2 applies intent weights only for non-hybrid search types via an `isHybrid` boolean gate, so the code path for double-weighting is absent by design.

#### Source Files

See [`11--scoring-and-calibration/07-double-intent-weighting-investigation.md`](11--scoring-and-calibration/07-double-intent-weighting-investigation.md) for full implementation and test file listings.

---

### RRF K-value sensitivity analysis

#### Description

When combining results from different search methods, a single tuning knob controls how much "being ranked first" matters versus "appearing in multiple lists." This analysis tested five different settings for that knob and measured which one produced the best results. Before this work, the setting was chosen by gut feeling. Now it is chosen by data.

#### Current Reality

The K parameter in Reciprocal Rank Fusion controls how much rank position matters. A low K amplifies rank differences while a high K compresses them.

A grid search over K values {20, 40, 60, 80, 100} measured MRR@5 delta per value using Kendall tau correlation for ranking stability. The optimal K was identified and documented. Before this analysis, K was chosen by convention rather than measurement. Now it is empirically grounded.

#### Source Files

See [`11--scoring-and-calibration/08-rrf-k-value-sensitivity-analysis.md`](11--scoring-and-calibration/08-rrf-k-value-sensitivity-analysis.md) for full implementation and test file listings.

---

### Negative feedback confidence signal

#### Description

When you tell the system a result was not helpful, it remembers that feedback and pushes that memory lower in future searches. The more times you say "not useful," the further it drops, but it can never be completely hidden. Over time the penalty fades, giving the memory a chance to recover. This way the system learns from your feedback without permanently burying anything.

#### Current Reality

When you mark a memory as not useful via `memory_validate(wasUseful: false)`, the signal now flows into composite scoring as a demotion multiplier. The multiplier starts at 1.0, decreases by 0.1 per negative validation and floors at 0.3 so a memory is never suppressed below 30% of its natural score. Time-based recovery with a 30-day half-life (`RECOVERY_HALF_LIFE_MS`) gradually restores the multiplier: the penalty halves every 30 days since the last negative validation.

Negative feedback events are persisted to a `negative_feedback_events` table. The search handler reads these events and applies the multiplier during the feedback signals step in Stage 2 of the pipeline. Runs behind the `SPECKIT_NEGATIVE_FEEDBACK` flag (default ON).

**Sprint 8 update:** The unused `RECOVERY_HALF_LIFE_DAYS` constant was removed (the millisecond-based `RECOVERY_HALF_LIFE_MS` is the actual constant used in computation).

#### Source Files

See [`11--scoring-and-calibration/09-negative-feedback-confidence-signal.md`](11--scoring-and-calibration/09-negative-feedback-confidence-signal.md) for full implementation and test file listings.

---

### Auto-promotion on validation

#### Description

When a memory keeps proving useful over and over, it earns a promotion. After five thumbs-up reviews, a regular memory becomes "important." After ten, it becomes "critical." This happens automatically so you do not have to manually tag your most valuable knowledge. A speed limit prevents too many promotions from happening at once during a busy session.

#### Current Reality

Positive validations now trigger automatic tier promotion. When a normal-tier memory accumulates 5 positive validations, it is promoted to important. When an important-tier memory reaches 10, it is promoted to critical. A throttle safeguard limits promotions to 3 per 8-hour rolling window to prevent runaway promotion during bulk validation sessions.

Constitutional, critical, temporary and deprecated tiers are non-promotable. Each promotion is logged to a `memory_promotion_audit` table for traceability. The `memory_validate` response includes `autoPromotion` metadata showing whether promotion was attempted, the previous and new tier, validation count and the reason.

#### Source Files

See [`11--scoring-and-calibration/10-auto-promotion-on-validation.md`](11--scoring-and-calibration/10-auto-promotion-on-validation.md) for full implementation and test file listings.

---

### Scoring and ranking corrections

#### Description

These are four bug fixes for the scoring math. Scores could climb above their allowed maximum, a fallback was using the wrong data to guess relevance, circular relationships in the graph could multiply scores endlessly, and a statistics calculation could break with large numbers. Each fix is small on its own, but together they keep the ranking numbers honest and reliable.

#### Current Reality

Four scoring-layer bugs were fixed:

**C1: Composite score overflow:** `composite-scoring.ts` used `Math.max(0, composite)` which allowed scores above 1.0. Changed to `Math.max(0, Math.min(1, composite))` clamping to [0,1] across scoring paths.

**C2: Citation fallback chain:** `composite-scoring.ts` fell back through `last_accessed` then `updated_at` when no citation data existed, conflating recency with citation authority. The fallback chain was removed. The function returns 0 when no citation data exists.

**C3: Causal-boost cycle amplification:** `causal-boost.ts` used `UNION ALL` in a recursive CTE, allowing cycles to amplify scores exponentially as the same node was visited multiple times. Changed to `UNION` which deduplicates visited nodes and prevents cycles.

**C4: Ablation binomial overflow:** `ablation-framework.ts` computed binomial coefficients using naive multiplication that overflowed for n>50 in the sign test. Replaced with `logBinomial(n, k)` using log-space summation.

**Follow-up hardening:** the same ablation metrics path now filters token-usage samples to finite values greater than zero before averaging. Because `runAblation()` does not currently populate `tokenUsage`, this prevents synthetic zeroes from appearing in `token_usage` metrics.

#### Source Files

See [`11--scoring-and-calibration/11-scoring-and-ranking-corrections.md`](11--scoring-and-calibration/11-scoring-and-ranking-corrections.md) for full implementation and test file listings.

---

### Stage 3 effectiveScore fallback chain

#### Description

A search result can carry several different scores from different stages of processing. The final ranking step was only looking at two of them and skipping the most refined ones. This fix teaches it to check the best available score first and fall back through less precise options only when needed, like reading the final exam grade before the midterm before the homework score.

#### Current Reality

`effectiveScore()` in `stage3-rerank.ts` only checked `score` then `similarity/100`, skipping `intentAdjustedScore` and `rrfScore` from Stage 2 enrichment. The fix updated the fallback chain to: `intentAdjustedScore -> rrfScore -> score -> similarity/100`, all clamped [0,1] with `isFinite()` guards. Cross-encoder document mapping and MMR candidate scoring now use `effectiveScore()` instead of inline fallbacks. A `stage2Score` field was added to `PipelineRow` in `types.ts` for auditability when Stage 3 overwrites scores.

#### Source Files

See [`11--scoring-and-calibration/12-stage-3-effectivescore-fallback-chain.md`](11--scoring-and-calibration/12-stage-3-effectivescore-fallback-chain.md) for full implementation and test file listings.

---

### Scoring and fusion corrections

#### Description

These nine fixes address problems in how scores are calculated and combined. Issues ranged from weights that did not add up to 100% to a method that crashed when processing large batches and a filter that compared apples to oranges. Each fix makes the scoring math more accurate and stable, ensuring the final ranking truly reflects which results are most relevant to your question.

#### Current Reality

Nine scoring issues were fixed:

- **Intent weight recency (#5):** `applyIntentWeights` now includes timestamp-based recency scoring. Uses loop-based min/max to find timestamp range (no spread operator stack overflow).
- **Five-factor weight normalization (#6):** Composite scoring weights auto-normalize to sum 1.0 after partial overrides. Without this, overriding one weight broke weighted-average semantics.
- **Stack overflow prevention (#7):** `normalizeCompositeScores` replaced `Math.max(...scores)` / `Math.min(...scores)` with a for-loop. The spread operator causes stack overflow on arrays >100K elements.
- **BM25 specFolder filter (#8):** The BM25 index stores document IDs as stringified numbers (e.g., "42"). The old filter compared these against spec folder paths, which never matched. Replaced with a DB lookup to resolve `spec_folder` per result.
- **RRF convergence double-count (#9):** Cross-variant fusion now merges each variant's fused `rrfScore` as-is, then applies one cross-variant convergence bonus based on how many distinct variants contained the result. The implementation no longer subtracts any per-variant bonus during the merge step.
- **Adaptive fusion normalization (#10):** Core weights (semantic + keyword + recency) now normalize to sum 1.0 after doc-type adjustments. Only applied when doc-type shifts alter the balance.
- **Shared resolveEffectiveScore (#11):** A single function in `pipeline/types.ts` replaces both Stage 2's `resolveBaseScore()` and Stage 3's local `effectiveScore()`. Uses the canonical fallback chain: `intentAdjustedScore -> rrfScore -> score -> similarity/100`, all clamped [0,1].
- **Configurable interference threshold (#12):** `computeInterferenceScoresBatch()` now accepts an optional `threshold` parameter (defaults to `INTERFERENCE_SIMILARITY_THRESHOLD`).
- **RSF ID canonicalization (#13):** The remaining RSF compatibility/test helpers `fuseResultsRsfMulti()` and `fuseResultsRsfCrossVariant()` now use `canonicalRrfId()` for map keys and variant appearance tracking, preventing numeric/string ID splits such as `42` vs "42" from surfacing as duplicate RSF items in retired shadow/test artifacts.

In the non-hybrid flow, after Step 4 applies `intentAdjustedScore`, subsequent pipeline steps (artifact routing, feedback signals, session boost, and causal boost) can mutate `score`. Since `resolveEffectiveScore()` prefers `intentAdjustedScore` over `score`, later modifications were invisible in final ranking. A synchronization pass now flat-overwrites the score aliases by clamping the current value and writing the same number into `score`, `rrfScore`, and `intentAdjustedScore` via `withSyncedScoreAliases()` and `syncScoreAliasesInPlace()`. This keeps downstream ranking consistent with the latest pipeline score; it does not preserve the prior value with `Math.max(...)`.

#### Source Files

See [`11--scoring-and-calibration/13-scoring-and-fusion-corrections.md`](11--scoring-and-calibration/13-scoring-and-fusion-corrections.md) for full implementation and test file listings.

---

### Local GGUF reranker via node-llama-cpp

#### Description

After the initial search finds candidate results, this feature uses a small AI model running on your own computer to re-sort them for better accuracy. It works entirely offline with no network calls, so it is both private and free to use. If the model file is missing or the computer does not have enough memory, the system quietly skips this step and keeps the original order.

#### Current Reality

**IMPLEMENTED (Sprint 019).** Implements the `RERANKER_LOCAL` flag with `node-llama-cpp` in Stage 3 using `bge-reranker-v2-m3.Q4_K_M.gguf` (~350MB). Activation is strict: `RERANKER_LOCAL` must equal `'true'`, rollout gating must permit the feature, the configured model path must be readable and the host must meet the total-memory threshold (8GB by default, 2GB when `SPECKIT_RERANKER_MODEL` is set). The guard intentionally checks total system RAM rather than free-memory readings. Sequential per-candidate inference remains intentional. If local execution is unavailable or runtime scoring fails, the local path returns the incoming order unchanged. New file: `lib/search/local-reranker.ts`.

The shared cross-encoder path now keys its reranker cache by provider, document order, and option bits such as `applyLengthPenalty`, and both cache lookup and cache store use that stronger key. That prevents false cache hits across providers or option combinations. The reranker status p95 latency calculation also now uses the bounded ceil-based percentile index, which removes the old off-by-one upward bias on small sample sets.

#### Source Files

See [`11--scoring-and-calibration/14-local-gguf-reranker-via-node-llama-cpp.md`](11--scoring-and-calibration/14-local-gguf-reranker-via-node-llama-cpp.md) for full implementation and test file listings.

---

### Tool-level TTL cache

#### Description

When you ask the same question twice within a short time, the system should not redo all the expensive work. This feature remembers recent results for up to 60 seconds so repeat requests get instant answers from the cache. When you save, update or delete a memory, the cache for affected searches is cleared automatically so you never see stale results.

#### Current Reality

The tool cache (`lib/cache/tool-cache.ts`) provides a per-tool, TTL-based in-memory cache that sits in front of expensive operations like embedding generation and database queries. Each cache entry is keyed by a SHA-256 hash of the tool name plus input parameters and expires after a configurable TTL (default 60 seconds via `TOOL_CACHE_TTL_MS`). Maximum cache size is governed by `TOOL_CACHE_MAX_ENTRIES` (default 1000) with oldest-entry eviction on overflow.

Cache statistics (hits, misses, evictions, invalidations, hit rate) are tracked for observability. A periodic cleanup sweep removes expired entries. Tool-specific invalidation allows targeted cache busting after mutations without flushing the entire cache. The cache is wired into multiple handlers including `memory_search`, `memory_save`, `memory_update`, `memory_delete` and `memory_bulk_delete` via the mutation hooks system.

#### Source Files

See [`11--scoring-and-calibration/15-tool-level-ttl-cache.md`](11--scoring-and-calibration/15-tool-level-ttl-cache.md) for full implementation and test file listings.

---

### Access-driven popularity scoring

#### Description

Memories that get looked up frequently are probably more useful than ones that sit untouched. This feature counts how often each memory is retrieved and gives frequently accessed ones a higher score, like how a popular library book gets a front-of-shelf display. It also helps identify neglected memories that might be candidates for archiving.

#### Current Reality

The access tracker (`lib/storage/access-tracker.ts`) implements batched access counting with a soft-accumulator pattern. Each retrieval hit increments an in-memory accumulator by 0.1. When the accumulator exceeds the 0.5 threshold, a database write flushes the accumulated count to the `access_count` column in `memory_index` and updates `last_accessed`. This batching reduces write amplification from high-frequency search operations.

The `access_count` feeds into composite scoring as a popularity signal, boosting frequently retrieved memories. The accumulator map is capped at 10,000 entries to prevent unbounded memory growth. Access data also drives the archival manager's dormancy detection: memories with no recent access are candidates for automatic archival. The tracker currently exposes accumulator and scoring helpers such as `getAccumulatorState()`, `calculatePopularityScore()` and `calculateUsageBoost()`, rather than a separate `getAccessStats()` API.

#### Source Files

See [`11--scoring-and-calibration/16-access-driven-popularity-scoring.md`](11--scoring-and-calibration/16-access-driven-popularity-scoring.md) for full implementation and test file listings.

---

### Temporal-structural coherence scoring

#### Description

This checks whether a memory's claims make sense in the order things actually happened. If a memory says it was caused by something that did not exist yet at the time, that is a red flag. Think of it like a fact-checker catching a biography that references events before the person was born. Memories that fail this time-logic check get a lower quality score and may be rejected from the index.

#### Current Reality

The quality loop handler (`handlers/quality-loop.ts`) includes a coherence dimension in its quality score breakdown. The coherence score measures how well a memory's content structure aligns with its temporal context, specifically whether the claimed relationships (references to other memories, spec folder associations, causal links) are consistent with the chronological ordering of events. Incoherent memories that reference future events or claim relationships with non-existent predecessors receive a lower coherence score, which reduces their overall quality assessment.

The coherence signal feeds into the composite quality score alongside trigger coverage, anchor density and token budget efficiency. A low coherence score can trigger a quality loop rejection, preventing temporally inconsistent content from entering the index.

#### Source Files

See [`11--scoring-and-calibration/17-temporal-structural-coherence-scoring.md`](11--scoring-and-calibration/17-temporal-structural-coherence-scoring.md) for full implementation and test file listings.

---

### Adaptive shadow ranking, bounded proposals, and rollback

#### Description

This feature lets the system experiment with new ranking ideas without changing what you actually see. It runs alternative rankings in the background and records what would have changed, like a flight simulator for search results. The experiments have strict limits on how big a change they can propose, and a single switch turns the whole thing off if anything looks wrong. Only after a deliberate decision would any of these proposals go live.

#### Current Reality

Phase 4 introduced adaptive ranking in shadow mode. The adaptive module computes proposal deltas from access and validation signals while preserving live ordering as the production source of truth.

Proposal magnitudes are explicitly bounded so adaptive exploration cannot produce unbounded score swings. Shadow payloads expose what would change, while the runtime result order remains unchanged unless an explicit graduation decision is made.

Rollback is immediate via feature gating (`SPECKIT_MEMORY_ADAPTIVE_RANKING`). When disabled, adaptive proposal generation and related trace output are removed without schema rollback or data-loss side effects.

#### Source Files

See [`11--scoring-and-calibration/18-adaptive-shadow-ranking-bounded-proposals-and-rollback.md`](11--scoring-and-calibration/18-adaptive-shadow-ranking-bounded-proposals-and-rollback.md) for full implementation and test file listings.

> **Playbook:** [121](../manual_testing_playbook/manual_testing_playbook.md)

---

### Calibrated overlap bonus

#### Description

Calibrated overlap bonus replaces the flat convergence bonus in RRF fusion with a query-aware scaled bonus that accounts for the number of overlapping channels and the mean normalized top score.

#### Current Reality

Enabled by default (graduated). Set `SPECKIT_CALIBRATED_OVERLAP_BONUS=false` to revert to the flat convergence bonus. When enabled, the `fuseResultsMulti()` function computes a query-aware overlap bonus using `CALIBRATED_OVERLAP_BETA = 0.15` as the scaling factor and the mean normalized top score across channels. The bonus is clamped to `CALIBRATED_OVERLAP_MAX = 0.06`. When disabled, the standard flat `CONVERGENCE_BONUS = 0.10` is applied instead.

#### Source Files

See [`11--scoring-and-calibration/21-calibrated-overlap-bonus.md`](11--scoring-and-calibration/21-calibrated-overlap-bonus.md) for full implementation and test file listings.

---

### RRF K experimental tuning

#### Description

RRF K experimental tuning enables per-intent K-value selection for Reciprocal Rank Fusion, sweeping candidate K values and selecting the one that maximizes NDCG@10 per query intent.

#### Current Reality

Enabled by default (graduated). Set `SPECKIT_RRF_K_EXPERIMENTAL=false` to revert to the default K=60 for all intents. When enabled, `perIntentKSweep()` groups judged queries by intent, evaluates each against `JUDGED_K_SWEEP_VALUES` {10,20,40,60,80,100,120}, and selects the K that maximizes NDCG@10 via `argmaxNdcg10()`. The runtime override `SPECKIT_RRF_K` allows a single global K override.

#### Source Files

See [`11--scoring-and-calibration/22-rrf-k-experimental.md`](11--scoring-and-calibration/22-rrf-k-experimental.md) for full implementation and test file listings.

---

### Learned Stage 2 weight combiner

#### Description

A regularized linear ranker that learns combination weights from accumulated Stage 2 signals, running in shadow-only mode behind the `SPECKIT_LEARNED_STAGE2_COMBINER` flag.

#### Current Reality

Enabled by default (graduated). Set `SPECKIT_LEARNED_STAGE2_COMBINER=false` to disable. The learned combiner uses Ridge Regression with an inline matrix math implementation (no external ML dependencies). The 8-feature canonical vector covers: rrf, overlap, graph, session, causal, feedback, validation, artifact. Training uses the closed-form solution with default regularization `DEFAULT_LAMBDA = 0.1`. Validation uses Leave-One-Out Cross-Validation, and feature importance is computed via SHAP-style analysis. Shadow scoring returns both learned and manual scores when the flag is ON, or null with zero overhead when OFF.

#### Source Files

See [`11--scoring-and-calibration/19-learned-stage2-weight-combiner.md`](11--scoring-and-calibration/19-learned-stage2-weight-combiner.md) for full implementation and test file listings.

---

### Shadow scoring with holdout evaluation

#### Description

Shadow scoring compares would-have-changed rankings against live rankings on a deterministic holdout slice of queries, tracking weekly improvement cycles and gating promotion of learned signals to production.

#### Current Reality

Enabled by default (graduated). Set `SPECKIT_SHADOW_FEEDBACK=false` to disable. The shadow scoring module computes per-result rank deltas between live and shadow rankings, producing Kendall tau correlation, NDCG delta, and MRR delta metrics. Holdout queries are deterministically selected via a seed (default 20% holdout). Promotion requires 2+ consecutive weeks of stable improvement. The evaluation window is 7 days. The promotion gate returns one of three recommendations: promote, wait, or rollback. Shadow-only: no live ranking columns are mutated.

#### Source Files

See [`11--scoring-and-calibration/20-shadow-feedback-holdout-evaluation.md`](11--scoring-and-calibration/20-shadow-feedback-holdout-evaluation.md) for full implementation and test file listings.

---

## 13. QUERY INTELLIGENCE

### Query complexity router

#### Description

Not every question needs the same amount of effort to answer. This feature sizes up your question first, like a triage nurse, and routes simple lookups through a fast path while sending complex research questions through a deeper search. Without it, every question would get the full heavy-duty treatment, wasting time and resources on things that could be answered in seconds.

#### Current Reality

Not all queries need the full 5-channel pipeline. A short trigger-phrase lookup like "memory save rules" is wasted on graph traversal and BM25 scoring.

The complexity router classifies incoming queries into simple (3 or fewer terms, or a trigger match), moderate (4-8 terms) and complex (more than 8 terms with no trigger) tiers. Tier classification is driven exclusively by `termCount` and `triggerMatch`. `charCount` and `stopWordRatio` are informational features that influence confidence scoring only (see `determineConfidence()`). Simple queries run on two channels (vector and FTS), moderate on three (adding BM25) and complex on all five.

The `SPECKIT_COMPLEXITY_ROUTER` flag is **enabled by default** (graduated Sprint 4, `isComplexityRouterEnabled()` returns `true` unless explicitly set to `"false"`). When the flag is disabled, the classifier returns "complex" as a safe fallback so every query still gets the full pipeline. The minimum 2-channel invariant is enforced at the router level.

The router's classification tier (`routeResult.tier`) is propagated into `traceMetadata.queryComplexity` in hybrid search (CHK-038), making it available in response envelopes when `includeTrace: true`. The formatter reads this via a fallback path from `traceMetadata` when stage metadata is unavailable.

#### Source Files

See [`12--query-intelligence/01-query-complexity-router.md`](12--query-intelligence/01-query-complexity-router.md) for full implementation and test file listings.

---

### Relative score fusion in shadow mode

#### Description

When you search for something, multiple search methods each return their own ranked lists of results. This used to be an alternative way to merge those lists into one final ranking. Today RSF is removed from the shipped codebase; only retirement notes and inert documentation/config references remain (updated 2026-03-25 per deep review).

#### Current Reality

RRF remains the sole live fusion method. RSF has been removed from the codebase and no shipped ranking path or live feature-flag branch calls it.

Sprint 8 removed the dead `isRsfEnabled()` helper, the dead hybrid-search branch guarded behind it, the RSF implementation/tests, and the old `rsfShadow` metadata slot. `SPECKIT_RSF_FUSION` may still appear as an inert config/documentation surface, but production ranking behavior stays on RRF (updated 2026-03-25 per deep review).

#### Source Files

See [`12--query-intelligence/02-relative-score-fusion-in-shadow-mode.md`](12--query-intelligence/02-relative-score-fusion-in-shadow-mode.md) for full implementation and test file listings.

---

### Channel min-representation

#### Description

Imagine you ask a librarian for book recommendations and they only check one shelf, ignoring everything else in the library. This feature makes sure that every search method that found something useful gets at least one result in the final answer. That way you see a diverse set of results instead of one dominant source drowning out everything else.

#### Current Reality

A strong vector channel can monopolize the top-k results, pushing out graph and lexical results entirely. Channel min-representation fixes that.

After fusion, the system checks that every channel which returned results has at least one representative in the top-k window. Results below a 0.005 quality floor are excluded from promotion because forcing a bad result into the top-k is worse than missing a channel. The floor was lowered from 0.2 to 0.005 during Sprint 8 remediation because RRF scores typically fall in the 0.01-0.03 range, and the original 0.2 threshold was filtering out virtually all RRF-sourced results.

The architecture is two-layered: `channel-representation.ts` performs the core analysis and appends promoted items to the result list without re-sorting. The pipeline-level wrapper `channel-enforcement.ts` calls the core function and then globally re-sorts the combined list (window + tail + promotions) by score descending so ranking integrity is preserved. This separation keeps the core function pure (append-only, no sort side-effect) while the wrapper guarantees callers always receive a score-ordered list. The net effect: you see results from diverse retrieval strategies rather than one dominant channel. Runs behind the `SPECKIT_CHANNEL_MIN_REP` flag (default: enabled / graduated).

#### Source Files

See [`12--query-intelligence/03-channel-min-representation.md`](12--query-intelligence/03-channel-min-representation.md) for full implementation and test file listings.

---

### Confidence-based result truncation

#### Description

Search results often include a long tail of irrelevant items tacked onto the end. This feature detects the point where results stop being useful and cuts off the rest, like a reader who stops scrolling once the answers clearly run out. Without it, you would get padded results that waste your attention on things that do not actually match your question.

#### Current Reality

Search results often contain a long tail of irrelevant items. Rather than returning a fixed number, confidence truncation detects where relevant results end. It computes consecutive score gaps across the ranked list, finds the median gap, and looks for the first gap exceeding 2x the median. That point is the "relevance cliff." Everything below it is trimmed.

A minimum of three results is guaranteed regardless of gap analysis so the system never returns nothing. The truncation metadata (original count, truncated count, cutoff index, median gap and cutoff gap) is returned alongside results for evaluation.

Edge cases are handled. NaN and Infinity scores are filtered, and all-equal scores (median gap of zero) pass through unchanged. Runs behind the `SPECKIT_CONFIDENCE_TRUNCATION` flag.

#### Source Files

See [`12--query-intelligence/04-confidence-based-result-truncation.md`](12--query-intelligence/04-confidence-based-result-truncation.md) for full implementation and test file listings.

---

### Dynamic token budget allocation

#### Description

Every answer the system gives takes up space in a limited response window. This feature gives simple questions a small response budget and saves the big budget for complex questions that genuinely need more room. Think of it like packing a lunch bag versus a suitcase: you match the container to what you actually need to carry.

#### Current Reality

Returning 4,000 tokens for a simple trigger-phrase lookup wastes context window. Token budgets now scale with query complexity: simple queries receive 1,500 tokens, moderate queries 2,500 and complex queries 4,000.

The budget is computed early in the pipeline (before channel execution) so downstream stages can enforce it. When contextual tree headers are enabled (`SPECKIT_CONTEXT_HEADERS`), the effective budget is reduced by calibrated header overhead (~26 tokens per result, floor 200 tokens) before truncation (CHK-060). When the flag is disabled, all queries fall back to the 4,000-token default.

The savings add up. If 60% of your queries are simple, you recover roughly 40% of the token budget that was previously wasted on over-delivering.

#### Source Files

See [`12--query-intelligence/05-dynamic-token-budget-allocation.md`](12--query-intelligence/05-dynamic-token-budget-allocation.md) for full implementation and test file listings.

---

### Query expansion

#### Description

Sometimes the words you use in a question do not match the words stored in the system, even though they mean the same thing. This feature automatically adds related terms to your search so you find relevant results even when the exact wording differs. It only kicks in for complex questions because simple lookups do not benefit from the extra breadth.

#### Current Reality

Embedding-based query expansion broadens retrieval for complex queries by mining similar memories from the vector index and extracting related terms to append to the original query, producing an enriched combined query string. Stop-words are filtered out and tokens shorter than 3 characters are discarded.

When R15 classifies a query as "simple", expansion is suppressed because expanding a trigger-phrase lookup would add noise. If expansion produces no additional terms, the original query proceeds unchanged. In the 4-stage pipeline, Stage 1 runs the baseline and expanded-query searches in parallel with deduplication (baseline-first). Runs behind the `SPECKIT_EMBEDDING_EXPANSION` flag (default ON).

#### Source Files

See [`12--query-intelligence/06-query-expansion.md`](12--query-intelligence/06-query-expansion.md) for full implementation and test file listings.

---

### Query decomposition

#### Description

Query decomposition splits multi-faceted questions into up to 3 sub-queries using rule-based heuristics, enabling facet-aware retrieval in deep mode without LLM calls.

#### Current Reality

Enabled by default (graduated). Set `SPECKIT_QUERY_DECOMPOSITION=false` to disable. The `query-decomposer.ts` module performs bounded facet detection: splits on coordinating conjunctions, detects multiple wh-question words, caps at `MAX_FACETS = 3` sub-queries, uses no LLM calls, and only activates in deep mode. Graceful fallback returns only the original query on error.

#### Source Files

See [`12--query-intelligence/10-query-decomposition.md`](12--query-intelligence/10-query-decomposition.md) for full implementation and test file listings.

---

### Graph concept routing

#### Description

Graph concept routing extracts noun phrases from a query and matches them against a concept alias table, activating the graph channel for matched concepts to improve retrieval via causal edge traversal.

#### Current Reality

Enabled by default (graduated). Set `SPECKIT_GRAPH_CONCEPT_ROUTING=false` to disable. The entity linker module extracts noun phrases from the query, matches them against the concept alias table in SQLite, and returns canonical concept names. The matched concepts are used by `stage1-candidate-gen.ts` to activate the graph retrieval channel for those concepts.

#### Source Files

See [`12--query-intelligence/11-graph-concept-routing.md`](12--query-intelligence/11-graph-concept-routing.md) for full implementation and test file listings.

---

### LLM query reformulation

#### Description

Corpus-grounded LLM query reformulation applies step-back abstraction combined with real corpus seed grounding to produce enriched query variants in deep mode.

#### Current Reality

Enabled by default (graduated). Set `SPECKIT_LLM_REFORMULATION=false` to disable. The reformulation module performs a two-step process: (1) cheap seed retrieval via FTS5/BM25 keyword search (no embedding call, up to 3 results) to ground the prompt in real corpus content, then (2) a single LLM call to produce a step-back abstraction and up to 2 corpus-grounded query variants. Timeout is 8000ms. LLM results are cached via a shared LLM result cache (1h TTL). Only fires in deep mode, and reformulated hits now pass through the same scope, tier, `contextType` and `qualityThreshold` filters as primary candidates before merge.

#### Source Files

See [`12--query-intelligence/07-llm-query-reformulation.md`](12--query-intelligence/07-llm-query-reformulation.md) for full implementation and test file listings.

---

### HyDE (Hypothetical Document Embeddings)

#### Description

HyDE generates a short hypothetical document answering the query, embeds it, and uses the pseudo-document embedding as an additional retrieval channel for deep low-confidence queries.

#### Current Reality

Enabled by default (graduated). Set `SPECKIT_HYDE=false` to disable HyDE generation and `SPECKIT_HYDE_ACTIVE=false` to force shadow-only mode. HyDE only fires in deep mode with low-confidence baselines, using the maximum resolved score across the full baseline set instead of assuming the first row is best. Pseudo-documents are generated in markdown-memory format (max 200 tokens). Budget: 1 LLM call per cache miss. Combined with reformulation: at most 2 total LLM calls per deep query, and HyDE hits now pass through the same scope, tier, `contextType` and `qualityThreshold` filters before merge.

#### Source Files

See [`12--query-intelligence/08-hyde-hypothetical-document-embeddings.md`](12--query-intelligence/08-hyde-hypothetical-document-embeddings.md) for full implementation and test file listings.

---

### Index-time query surrogates

#### Description

Index-time query surrogates generate surrogate metadata (aliases, headings, summaries, heuristic questions) at index time for improved recall without runtime LLM calls.

#### Current Reality

Enabled by default (graduated). Set `SPECKIT_QUERY_SURROGATES=false` to disable. At index time, the surrogate generator produces aliases (parenthetical abbreviations, synonyms), headings, extractive summaries (max 200 characters), and 2-5 heuristic questions. At query time, stored surrogates are matched against the incoming query using token overlap with a minimum match threshold of 0.15.

#### Source Files

See [`12--query-intelligence/09-index-time-query-surrogates.md`](12--query-intelligence/09-index-time-query-surrogates.md) for full implementation and test file listings.

---

## 14. MEMORY QUALITY AND INDEXING

### Verify-fix-verify memory quality loop

#### Description

Before saving a new memory, the system checks whether it meets quality standards. If it falls short, the system tries to fix the problems automatically and checks again. Think of it like a spell checker that runs before you hit send: it catches obvious issues and corrects them so you do not store sloppy notes that will be hard to find later.

#### Current Reality

The quality loop is opt-in. When `SPECKIT_QUALITY_LOOP` is unset or not equal to `true`, the runtime still computes a quality score but the save passes without retries or rejection. When the flag is enabled, the save pipeline runs an initial quality evaluation and then up to 2 immediate auto-fix retries by default (`maxRetries=2`). Auto-fixes can re-extract trigger phrases from headings/title, normalize unclosed anchors and trim content to the shared token budget.

`attempts` reports the actual number of evaluations used, not the configured ceiling. If a retry applies no fixes, the loop breaks early, so a case with `maxRetries=5` can still reject after only 2 total attempts (1 initial evaluation + 1 no-op retry). The rejection reason also reports the actual auto-fix attempt count.

When fixes improve the score past the threshold, the handler returns `fixedContent` and `fixedTriggerPhrases`. Accepted saves persist metadata fixes immediately, while rewritten body content stays in-memory and is written only after later hard-reject gates clear under the per-spec-folder lock. Rejected saves still surface the rewritten in-memory draft for diagnostics, but `indexMemoryFile()` returns `status: 'rejected'` without continuing to storage. `atomicSaveMemory()` treats that rejected status as a non-retry rollback path: it restores the previous file or deletes the newly written file immediately.

The `CHARS_PER_TOKEN` ratio defaults to `4` and is shared with `preflight.ts` through `MCP_CHARS_PER_TOKEN` so both save-time checks use the same token estimate.

#### Source Files

See [`13--memory-quality-and-indexing/01-verify-fix-verify-memory-quality-loop.md`](13--memory-quality-and-indexing/01-verify-fix-verify-memory-quality-loop.md) for full implementation and test file listings.

---

### Signal vocabulary expansion

#### Description

The system listens for clues in your language to understand what you really mean. This feature taught it to recognize two new types of clues: when you are correcting a past mistake (words like "actually" or "wait") and when you are expressing a preference (words like "prefer" or "want"). Recognizing these patterns helps the system pull up the right memories for the situation.

#### Current Reality

The trigger matcher originally recognized six signal categories. Two new categories from the true-mem 8-category vocabulary were added: CORRECTION signals (words like "actually", "wait", "I was wrong") and PREFERENCE signals ("prefer", "like", "want").

Correction signals matter because they indicate the user is fixing a prior misunderstanding, which means different memories are relevant. Preference signals help the system detect intent behind requests like "I prefer the JSON format" where matching on preference-associated memories improves retrieval accuracy.

#### Source Files

See [`13--memory-quality-and-indexing/02-signal-vocabulary-expansion.md`](13--memory-quality-and-indexing/02-signal-vocabulary-expansion.md) for full implementation and test file listings.

---

### Pre-flight token budget validation

#### Description

Before the system stores a new memory, it checks whether the content is too large to process. Think of it like a mailbox with a size limit: if your package is too big, you get told right away instead of wasting time trying to stuff it in. This prevents expensive processing work on content that would fail anyway.

#### Current Reality

Pre-flight token budget validation is a save-time guard in `preflight.ts`, not a retrieval-time truncation feature. Before embedding generation, the runtime estimates token count from content length using `Math.ceil(text.length / charsPerToken)`, where `charsPerToken` defaults to `4` and can be overridden with `MCP_CHARS_PER_TOKEN`.

`checkTokenBudget()` adds a default 150-token embedding overhead, compares the estimate against `MCP_MAX_MEMORY_TOKENS` (default `8000`), and emits one of two outcomes: `PF020` hard failure when the estimate exceeds the max, or `PF021` warning when usage reaches `MCP_TOKEN_WARNING_THRESHOLD` (default `0.8`). The reduction hint in the error message uses the same `charsPerToken` ratio so the suggested character trim matches runtime math.

This validation runs in `memory_save` pre-flight before any embedding generation or database writes. It protects ingestion cost and save-time limits. It does not control search-result truncation.

#### Source Files

See [`13--memory-quality-and-indexing/03-pre-flight-token-budget-validation.md`](13--memory-quality-and-indexing/03-pre-flight-token-budget-validation.md) for full implementation and test file listings.

---

### Spec folder description discovery

#### Description

Each project folder now has a short identity card describing what it contains. When you ask the system a question, it can check these identity cards first to figure out which folder holds the answer, skipping the need to search through everything. It is like reading the labels on filing cabinet drawers instead of opening every drawer to find what you need.

#### Current Reality

Each spec folder now has its own `description.json` containing identity metadata
(`specId`, `folderSlug`, `parentChain`) and memory tracking fields
(`memorySequence`, `memoryNameHistory`). These per-folder files are the primary
source of truth, auto-generated by `create.sh` on folder creation and updated
by the memory save workflow.

A one-time backfill using `generate-description.js` populated `description.json`
across the existing spec inventory, so per-folder descriptions are now present
repository-wide, not only for newly created folders.

A centralized `descriptions.json` aggregation layer remains for backward
compatibility. The `generateFolderDescriptions()` function prefers fresh
per-folder files and falls back to `spec.md` extraction when `description.json`
is missing or stale (spec.md modified after description.json).

The `memory_context` orchestration layer checks descriptions before issuing
vector queries. If the target folder can be identified from the description
alone, the system skips full-corpus search entirely. Runs behind the
`SPECKIT_FOLDER_DISCOVERY` flag (default ON).

Memory filename collisions are prevented by `ensureUniqueMemoryFilename()`,
which appends `-1`, `-2`, etc. suffixes when a filename already exists in
the target directory.

Post-hardening, `loadPerFolderDescription()` performs full schema validation
instead of trusting parsed JSON shape: `specId` must be a string,
`parentChain` must be an array and `memorySequence` must be a number. Array
element type guards now use `.every()` checks so `parentChain`,
`memoryNameHistory` and `keywords` only admit strings, while description
extraction reuses imported `stripYamlFrontmatter()` from
`content-normalizer.ts` instead of ad hoc inline frontmatter stripping.

Path containment is also hardened in both `generatePerFolderDescription()` and
`generate-description.ts` via `realpathSync()` plus a `path.sep` boundary guard
to block traversal and prefix-bypass attacks. Description and cache writes now
use atomic temp files with `crypto.randomBytes(4)` suffixes, `fsyncSync()`,
`renameSync()` and `try/finally` cleanup for crash safety. During mixed-mode
discovery, fresh per-folder files win, stale or corrupt existing files are
repaired from `spec.md`, and missing files fall back cleanly to `spec.md`
without forcing an implicit backfill write.

Collision handling also hardens the filename path: after exhausting numeric
suffixes, `ensureUniqueMemoryFilename()` now falls back to a
`crypto.randomBytes(6)` hex suffix instead of SHA1. In the workflow layer,
`memorySequence` updates use `Number(existing.memorySequence)` with safe-integer
clamping before incrementing, keeping invalid numeric values from escaping into
the saved `memoryNameHistory` ring buffer state.

Blank `spec.md` files still produce a valid per-folder `description.json`: the
stored `description` field remains an empty string, while aggregate discovery
continues to derive a folder-name fallback label from the path when needed.

#### Source Files

See [`13--memory-quality-and-indexing/04-spec-folder-description-discovery.md`](13--memory-quality-and-indexing/04-spec-folder-description-discovery.md) for full implementation and test file listings.

---

### Pre-storage quality gate

#### Description

This is the bouncer at the door before a memory enters the system. It checks three things: is the memory properly structured, is the content actually useful and is it different enough from what is already stored? If a memory fails any of these checks, it gets turned away. Without this gate, the system would fill up with junk and near-duplicates that pollute future search results.

#### Current Reality

A three-layer quality gate on memory save validates content before it enters the index. Layer 1 checks structural validity (title exists, content at least 50 characters, valid spec folder path format). Layer 2 scores content quality across five dimensions (title quality, trigger quality, length quality, anchor quality, metadata quality) with a 0.4 signal density threshold. Layer 3 checks semantic deduplication via cosine similarity against existing memories in the same spec folder, rejecting near-duplicates above 0.92.

The gate starts in warn-only mode for 14 days after activation per the MR12 mitigation: it logs would-reject decisions without blocking saves while the thresholds are being validated. After the warn-only period, hard rejections apply. Runs behind the `SPECKIT_SAVE_QUALITY_GATE` flag (default ON).

#### Source Files

See [`13--memory-quality-and-indexing/05-pre-storage-quality-gate.md`](13--memory-quality-and-indexing/05-pre-storage-quality-gate.md) for full implementation and test file listings.

---

### Reconsolidation-on-save

#### Description

When you save a new memory that is very similar to one already stored, the system decides what to do with the overlap. If the two are nearly identical, it merges them into one stronger memory. If the new one contradicts the old one, the old one is retired and the new one takes over. If they are different enough, both are kept side by side. This keeps your memory collection clean and up to date instead of cluttered with redundant notes.

#### Current Reality

After embedding generation, the save pipeline checks the top-3 most similar memories in the same spec folder. Similarity at or above 0.88 triggers a merge where content is combined and the `importance_weight` is incremented via `Math.min(1.0, currentWeight + 0.1)`. Similarity between 0.75 and 0.88 triggers conflict resolution: the old memory is deprecated and a `supersedes` causal edge is created. Below 0.75, the memory stores as a new complement.

**Sprint 8 update:** The original merge logic referenced a non-existent `frequency_counter` column, which would have caused runtime crashes on reconsolidation. This was replaced with `importance_weight` merge logic that properly uses an existing column.

A checkpoint must exist for the spec folder before reconsolidation can run. When no checkpoint is found, the system logs a warning and skips reconsolidation rather than risking destructive merges without a safety net. Runs behind the `SPECKIT_RECONSOLIDATION` flag (default OFF, opt-in). Set `SPECKIT_RECONSOLIDATION=true` to enable.

#### Source Files

See [`13--memory-quality-and-indexing/06-reconsolidation-on-save.md`](13--memory-quality-and-indexing/06-reconsolidation-on-save.md) for full implementation and test file listings.

---

### Smarter memory content generation

#### Description

Raw notes are full of formatting clutter like bullet markers, code fences and header symbols that have nothing to do with the actual meaning. This feature strips that clutter away before the system creates a searchable fingerprint of your content. The result is cleaner fingerprints that match your questions more accurately, like removing the wrapping paper so you can see what is actually inside the box.

#### Current Reality

Raw markdown including code fences, nested lists and YAML frontmatter was being embedded as-is, diluting embedding quality with formatting noise. A content normalizer now strips this noise before embedding generation and BM25 rebuild/index paths that call `normalizeContentForBM25()`.

Seven primitives run in sequence: strip YAML frontmatter, strip anchor markers, strip HTML comments, strip code fence markers (retaining the code body), normalize markdown tables, normalize markdown lists and normalize headings. Two composite entry points apply this: `normalizeContentForEmbedding()` and `normalizeContentForBM25()`. In the current runtime, the BM25 entry point delegates to the same normalization pipeline as embeddings.

The normalizer has no feature flag because it is a non-destructive improvement. It is always active in the `memory-save.ts` embedding path and in BM25 rebuild/tokenization paths that call `normalizeContentForBM25()`. The same pipeline now also keeps batch type inference one-to-one for pathless drafts by assigning synthetic fallback keys like `__pathless_0`, `__pathless_1`, and so on, preventing multiple pathless inputs from collapsing onto the same Map entry during a single batch run.

#### Source Files

See [`13--memory-quality-and-indexing/07-smarter-memory-content-generation.md`](13--memory-quality-and-indexing/07-smarter-memory-content-generation.md) for full implementation and test file listings.

---

### Anchor-aware chunk thinning

#### Description

When a large file is split into smaller pieces for indexing, not every piece carries useful information. Some are mostly whitespace or boilerplate. This feature scores each piece and drops the ones that add little value, keeping only the meaningful parts. It is like trimming the fat off a steak so you only store the good cuts.

#### Current Reality

When large files are split into chunks during indexing, not all chunks carry equal value. Anchor-aware chunk thinning scores each chunk using a composite of anchor presence (weight 0.6, binary 0 or 1) and content density (weight 0.4, 0-1 scale). Content density strips HTML comments, collapses whitespace, penalizes short chunks under 100 characters and adds a structure bonus (up to +0.2) for headings, code blocks and list items.

Chunks scoring below the 0.3 threshold are dropped from the index, reducing storage and search noise. The thinning guarantee: the function never returns an empty array regardless of scoring. Always active in the chunking path with no separate feature flag.

#### Source Files

See [`13--memory-quality-and-indexing/08-anchor-aware-chunk-thinning.md`](13--memory-quality-and-indexing/08-anchor-aware-chunk-thinning.md) for full implementation and test file listings.

---

### Encoding-intent capture at index time

#### Description

When a memory is saved, the system labels it as regular text, code or structured data. Right now this label is stored but not used for search ranking. It is groundwork for the future: once the system knows what type of content it is looking at, it can treat a code snippet differently from a meeting note. Think of it as sorting your files into labeled folders before you need to search them.

#### Current Reality

An `encoding_intent` field classifies content type at index time as `document`, `code` or `structured_data` using heuristic scoring. The code path scores fenced code blocks, import/export/function keyword density and programming punctuation density. The structured data path scores YAML frontmatter, pipe tables and key-value patterns. The classification threshold is 0.4. Anything below defaults to `document`.

The classification is stored as read-only metadata on the `encoding_intent` column for both parent records and individual chunks. It has no retrieval-time scoring impact. The intent is to build a labeled dataset that future work can use for type-aware retrieval. Runs behind the `SPECKIT_ENCODING_INTENT` flag (default ON).

#### Source Files

See [`13--memory-quality-and-indexing/09-encoding-intent-capture-at-index-time.md`](13--memory-quality-and-indexing/09-encoding-intent-capture-at-index-time.md) for full implementation and test file listings.

---

### Auto entity extraction

#### Description

Your notes mention tools, projects and concepts by name, but those names were never formally cataloged. This feature automatically spots those names when you save a memory and adds them to a shared catalog. Later, the system can use that catalog to connect memories that mention the same things, even if the surrounding text is completely different. It is like an automatic index at the back of a book that builds itself as you write.

#### Current Reality

Memory content contains implicit entities (technology names, architectural concepts, project identifiers) that are valuable for cross-document linking but were never explicitly captured. Manual entity tagging does not scale, and the system had zero entities in its catalog.

Auto entity extraction runs at save time using five pure-TypeScript regex rules with no external NLP dependencies. Rule 1 captures capitalized multi-word sequences (proper nouns like "Claude Code" or "Spec Kit Memory"). Rule 2 extracts technology names from code fence language annotations. Rule 3 identifies nouns following key phrases ("using", "with", "via", "implements"). Rule 4 pulls content from markdown headings. Rule 5 captures quoted strings.

Extracted entities pass through a denylist filter (`entity-denylist.ts`) containing 64 combined stop words across three categories: common nouns (29 words like "thing", "time", "example"), technology stop words (20 words like "api", "json", "npm") and generic modifiers (15 words like "new", "old", "simple"). Single-character entities and entities shorter than 2 characters are also filtered.

Deduplicated entities are stored in the `memory_entities` table with a UNIQUE constraint on `(memory_id, entity_text)`. The `entity_catalog` table maintains canonical names with Unicode-aware alias normalization (`/[^\p{L}\p{N}\s]/gu`, preserving letters and numbers from all scripts) and a `memory_count` field tracking how many memories reference each entity. An `edge_density` check (`totalEdges / totalMemories`) provides a diagnostic metric.

**Sprint 8 update:** Entity normalization was consolidated. Two divergent `normalizeEntityName` functions (ASCII-only in `entity-extractor.ts` vs Unicode-aware in `entity-linker.ts`) were unified into a single Unicode-aware version in `entity-linker.ts`. The `entity-extractor.ts` module now imports and re-exports this function. Similarly, a duplicate `computeEdgeDensity` function was consolidated into `entity-linker.ts`.

Entities are deliberately stored in a separate table rather than as causal edges. Mixing them into `causal_edges` would hit the `MAX_EDGES_PER_NODE=20` limit, distort N2 graph algorithms and pollute N3-lite consolidation. Runs behind the `SPECKIT_AUTO_ENTITIES` flag (default ON).

#### Source Files

See [`13--memory-quality-and-indexing/10-auto-entity-extraction.md`](13--memory-quality-and-indexing/10-auto-entity-extraction.md) for full implementation and test file listings.

---

### Content-aware memory filename generation

#### Description

Previously, every saved memory in the same folder got nearly the same filename, making it impossible to tell them apart at a glance. This feature names each file based on what the memory is actually about, like labeling your photo albums by vacation instead of just numbering them. You can now scan a folder and instantly see what each file contains.

#### Current Reality

Memory filenames were previously derived solely from the spec folder name, producing identical slugs like `hybrid-rag-fusion-refinement.md` for every save in the same folder. The workflow now builds a `preferredMemoryTask` and uses it for slug/title generation in `generateContentSlug()`, with candidate precedence `task -> specTitle -> sessionCandidates (QUICK_SUMMARY/TITLE/SUMMARY) -> folderBase`. Candidate precedence prefers stronger session-derived names before folder fallback. Generic detection used by selection/enrichment includes `implementation-and-updates`, and slug fallback still uses the generic terms list (`development-session`, `session-summary`, `session-context`, `session`, `context`, `implementation`, `work-session`).

The slug is lowercased, non-alphanumeric characters replaced with hyphens, collapsed and truncated at a word boundary (hyphen) to a maximum of 50 characters. A minimum length of 8 characters ensures slugs are meaningful. This produces filenames like `04-03-26_17-25__sprint-019-impl-3-phases-81-files.md` instead of `04-03-26_17-25__hybrid-rag-fusion-refinement.md`. Batch type inference also now assigns synthetic fallback keys like `__pathless_0`, `__pathless_1`, and so on for inputs without a file path, so multiple pathless memories in the same batch no longer collapse onto the same Map entry before slug/title decisions are made. Always active with no feature flag.

#### Source Files

See [`13--memory-quality-and-indexing/11-content-aware-memory-filename-generation.md`](13--memory-quality-and-indexing/11-content-aware-memory-filename-generation.md) for full implementation and test file listings.

---

### Generation-time duplicate and empty content prevention

#### Description

This feature catches two common mistakes before a memory file is even written to disk: saving a file that is basically empty (just a template with no real content) and saving an exact copy of something already stored. It is like your email client warning you that you are about to send a blank message or a duplicate of something you already sent.

#### Current Reality

Two pre-write quality gates in `scripts/core/file-writer.ts` prevent empty and duplicate memory files at generation time, complementing the existing index-time dedup in `memory-save.ts`. The empty content gate (`validateContentSubstance`) strips YAML frontmatter, HTML comments, anchor markers, empty headings, table rows and empty list items, then rejects files with fewer than 200 characters of remaining substance. The duplicate gate (`checkForDuplicateContent`) computes a SHA-256 hash of the file content and compares it against all existing `.md` files in the target memory directory, rejecting exact matches.

Both gates run inside `writeFilesAtomically()` before the atomic write operation, after the existing `validateNoLeakedPlaceholders` check. Failures throw descriptive errors that halt the save and report which validation failed. This catches the two most common quality problems (SGQS-template-only files and repeated saves of identical content) at the earliest possible point. Always active with no feature flag.

#### Source Files

See [`13--memory-quality-and-indexing/12-generation-time-duplicate-and-empty-content-prevention.md`](13--memory-quality-and-indexing/12-generation-time-duplicate-and-empty-content-prevention.md) for full implementation and test file listings.

---

### Entity normalization consolidation

#### Description

Two parts of the system were cleaning up entity names in different ways, which meant the same name could look different depending on where it was processed. This fix unified them so there is only one way to clean up a name, ensuring "Claude Code" always looks the same everywhere. Without this, the system could fail to recognize that two mentions refer to the same thing.

#### Current Reality

Two cross-cutting normalization issues were resolved:

**A1: Divergent normalizeEntityName:** `entity-extractor.ts` used ASCII-only normalization (`/[^\w\s-]/g`) while `entity-linker.ts` used Unicode-aware normalization (`/[^\p{L}\p{N}\s]/gu`). Consolidated to a single Unicode-aware version in `entity-linker.ts`, imported by `entity-extractor.ts`.

**A2: Duplicate computeEdgeDensity:** Both `entity-extractor.ts` and `entity-linker.ts` had independent implementations. Consolidated to `entity-linker.ts` with import and re-export from `entity-extractor.ts`.

#### Source Files

See [`13--memory-quality-and-indexing/13-entity-normalization-consolidation.md`](13--memory-quality-and-indexing/13-entity-normalization-consolidation.md) for full implementation and test file listings.

---

### Quality gate timer persistence

#### Description

The quality gate has a two-week warm-up period where it warns about problems without blocking saves. Previously, every time the server restarted, the countdown clock reset and the warm-up never finished. This fix saves the clock to the database so restarts do not reset it. Think of it like writing your gym start date on a calendar instead of just remembering it in your head.

#### Current Reality

The `qualityGateActivatedAt` timestamp in `save-quality-gate.ts` was stored purely in-memory. Every server restart reset the 14-day warn-only countdown, preventing the quality gate from graduating to enforcement mode. The fix adds SQLite persistence to the `config` table using the existing key-value store pattern. `isWarnOnlyMode()` lazy-loads from DB when the in-memory value is null. `setActivationTimestamp()` writes to both memory and DB. All DB operations are non-fatal with graceful fallback.

#### Source Files

See [`13--memory-quality-and-indexing/14-quality-gate-timer-persistence.md`](13--memory-quality-and-indexing/14-quality-gate-timer-persistence.md) for full implementation and test file listings.

---

### Deferred lexical-only indexing

#### Description

Sometimes the system cannot create a full searchable fingerprint for a memory because the fingerprinting service is temporarily down. Instead of losing the memory entirely, this feature saves it in a simpler text-searchable form so you can still find it by keywords. When the fingerprinting service comes back, the system automatically retries and upgrades the memory to full searchability.

#### Current Reality

Async embedding fallback via `index_memory_deferred()`. When embedding generation fails (API timeout, rate limit), memories are inserted with `embedding_status='pending'` and are immediately searchable via BM25/FTS5 (title, trigger_phrases, content_text) and structural SQL (importance_tier, importance_weight). Vector search requires `embedding_status='success'`. Deferred memories skip embedding dimension validation and `vec_memories` insertion. Background retry via the retry manager or CLI reindex increments `retry_count` and updates status. Failure reason is recorded for diagnostics.

#### Source Files

See [`13--memory-quality-and-indexing/15-deferred-lexical-only-indexing.md`](13--memory-quality-and-indexing/15-deferred-lexical-only-indexing.md) for full implementation and test file listings.

> **Playbook:** [111](../manual_testing_playbook/manual_testing_playbook.md)

---

### Dry-run preflight for memory_save

#### Description

Before committing a memory to storage, you can do a practice run to see if it would pass all the checks. Nothing gets saved or changed. It is like using the "print preview" button before printing: you catch problems before they become permanent, without wasting paper.

#### Current Reality

The `memory_save` tool accepts a `dryRun` parameter that runs preflight validation only (content size, anchor validation, token budget estimation and exact duplicate checks) without indexing, database mutation, or file writes. In dry-run mode, handler responses are returned from the preflight result (`would_pass`, validation errors/warnings/details) and can also preview later save-path rejection reasons such as semantic insufficiency or rendered-template-contract failure.

This allows agents to preview validation outcomes before committing while still using the same preflight validator used by non-dry-run requests. In non-dry-run mode, the same preflight checks run first (unless `skipPreflight=true`) and then `indexMemoryFile` executes quality-loop, quality-gate, PE-gating and persistence flows.

#### Source Files

See [`13--memory-quality-and-indexing/16-dry-run-preflight-for-memory-save.md`](13--memory-quality-and-indexing/16-dry-run-preflight-for-memory-save.md) for full implementation and test file listings.

> **Playbook:** [122](../manual_testing_playbook/manual_testing_playbook.md)

---

### Outsourced agent memory capture

#### Description

When work is delegated to an external helper (like a different AI tool), the results need to come back in a clean format the memory system can understand. This feature makes sure that incoming data files are properly validated and that follow-up actions are captured, so nothing important gets lost when work passes between different tools.

#### Current Reality

Outsourced-agent memory capture is now implemented and aligned across runtime behavior, regression tests and CLI handback documentation.

Current behavior is enforced in three slices:
1. `EXPLICIT_DATA_FILE_LOAD_FAILED` hard-fail in `data-loader.ts` for missing files, invalid JSON and validation failures when `dataFile` is provided explicitly.
2. `nextSteps` / `next_steps` persistence in normalization and extraction flow, producing `Next: ...`, `Follow-up: ...` and `NEXT_ACTION`.
3. 8 CLI handback docs (`cli-codex`, `cli-copilot`, `cli-claude-code`, `cli-gemini` `SKILL.md` + `prompt_templates.md`) documenting redact/scrub guidance before writing `/tmp/save-context-data.json`.

Status: Implemented. Spec folder `015-outsourced-agent-handback` is complete and supersedes the earlier `013-outsourced-agent-memory` pass.

#### Source Files

See [`13--memory-quality-and-indexing/17-outsourced-agent-memory-capture.md`](13--memory-quality-and-indexing/17-outsourced-agent-memory-capture.md) for full implementation and test file listings.

> **Playbook:** [M-005](../manual_testing_playbook/manual_testing_playbook.md)

---

### Stateless enrichment and alignment guards

#### Description

When a memory is saved with minimal context, the system fills in the gaps by pulling relevant details from the project folder and recent changes. At the same time, it checks that the memory actually belongs to the project it claims to be part of and blocks saves that clearly belong somewhere else. Think of it as an assistant who fills out missing form fields for you but refuses to file the form in the wrong cabinet.

#### Current Reality

Stateless `generate-context.js` saves now enrich thin OpenCode-derived session data with spec-folder and git context before rendering, while keeping contamination defenses in place.

Current behavior is enforced in three slices:
1. `transformOpencodeCapture()` normalizes snake_case OpenCode metadata and filters prompts, exchanges and tool calls by spec relevance using both slug-form and natural-language keyword variants.
2. `enrichCapturedSessionData()` appends `_provenance: 'spec-folder'` and `_provenance: 'git'` signals after the contamination-cleaning pass and before downstream extraction.
3. Pre- and post-enrichment alignment gates allow captured-session saves only when captured file paths overlap with the target spec's declared work surface. The overlap check now uses both spec-folder keywords and files declared in the spec's files-to-change table, which prevents false blocks for legitimate code paths like `scripts/core/workflow.ts`.

Git enrichment no longer scopes only to the spec folder path itself. It uses files declared by the spec to detect recent committed and uncommitted changes, commit observations retain only the scope-filtered touched file list for downstream reasoning, and the extractor now exposes an explicit repository snapshot through `headRef`, `commitRef`, `repositoryState`, and `isDetachedHead`. The workflow still hard-aborts on `ALIGNMENT_BLOCK`, `POST_ENRICHMENT_ALIGNMENT_BLOCK`, or failed captured-session validation rules when the capture clearly belongs to another task.

Git extraction also preserves uncommitted file context in freshly initialized repositories that do not have a `HEAD` commit yet, survives detached-HEAD saves without dropping commit identity, and parses multi-commit history without leaking similarly named foreign spec folders into the target result.

Downstream session snapshots now prefer live observations over synthetic spec/git enrichment when deriving `activeFile`, `lastAction`, `nextAction` and blocker summaries. That keeps provenance-enrichment useful for context without letting epoch-timestamped synthetic entries masquerade as the user's most recent action.

Status: Implemented and covered by targeted Vitest regressions.

#### Source Files

See [`13--memory-quality-and-indexing/18-session-enrichment-and-alignment-guards.md`](13--memory-quality-and-indexing/18-session-enrichment-and-alignment-guards.md) for full implementation and test file listings.

> **Playbook:** [M-006](../manual_testing_playbook/manual_testing_playbook.md)

---

### Post-save quality review

#### Description

After the system saves a memory file, it runs a quick proof-reading step to check that nothing was lost in transcription. It compares the saved file against the original JSON payload to catch cases where the rendering pipeline silently dropped or degraded caller-supplied fields — like a generic title replacing a meaningful one, or trigger phrases that are file paths instead of natural-language keywords. Think of it as a proof-reader who checks the printed form against the original application before it goes into the filing cabinet.

#### Current Reality

The post-save quality review runs as Step 10.5 in the save workflow, between file write and indexing. It is always active.

Current detection checks: generic title, path-fragment trigger phrases, importance_tier mismatch, decision_count = 0 when keyDecisions are present, contextType mismatch, and generic description. Each finding is emitted with a severity level: HIGH (data loss or explicit caller intent overridden), MEDIUM (degraded quality that reduces retrieval accuracy), or LOW (advisory observation). The review output is machine-readable so callers and downstream quality monitors can surface actionable per-field failures without parsing prose. Failure findings are reported back to the caller in the save response but do not abort the save unless a HIGH severity finding triggers the configured abort threshold.

#### Source Files

See [`13--memory-quality-and-indexing/19-post-save-quality-review.md`](13--memory-quality-and-indexing/19-post-save-quality-review.md) for full implementation and test file listings.

---

### Implicit feedback log

#### Description

Implicit feedback log records implicit feedback signals from search and save interactions into a shadow-only SQLite table with tiered confidence scoring, enabling offline analysis of search quality without ranking side effects.

#### Current Reality

Enabled by default (graduated). Set `SPECKIT_IMPLICIT_FEEDBACK_LOG=false` to disable. The feedback ledger module records five event types with a three-tier confidence hierarchy: strong (result_cited, follow_on_tool_use), medium (query_reformulated), and weak (search_shown, same_topic_requery). Each event is stored with type, memory_id, query_id, confidence, timestamp, and optional session_id. Shadow-only: no ranking influence.

#### Source Files

See [`13--memory-quality-and-indexing/22-implicit-feedback-log.md`](13--memory-quality-and-indexing/22-implicit-feedback-log.md) for full implementation and test file listings.

---

### Hybrid decay policy

#### Description

Hybrid decay policy applies type-aware no-decay rules to permanent artifacts (decision, constitutional, critical context types) while all other types follow the standard FSRS schedule.

#### Current Reality

Enabled by default (graduated). Set `SPECKIT_HYBRID_DECAY_POLICY=false` to disable. When enabled, `classifyHybridDecay()` maps decision, constitutional, and critical context types to no_decay class with Infinity stability (no decay). All other context types follow the standard FSRS v4 power-law decay: `R(t) = (1 + 19/81 * t/S)^(-0.5)`. Separate from TM-03 classification-based decay.

#### Source Files

See [`13--memory-quality-and-indexing/23-hybrid-decay-policy.md`](13--memory-quality-and-indexing/23-hybrid-decay-policy.md) for full implementation and test file listings.

---

### Save quality gate exceptions

#### Description

Save quality gate exceptions allow decision-type documents with sufficient structural signals to bypass the minimum content length check, preventing false rejections of short but high-value memories.

#### Current Reality

Enabled by default (graduated). Set `SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS=false` to disable. When enabled, the quality gate evaluates an exception path for documents where the context_type is decision and the document has at least 2 structural signals (title quality, trigger quality, anchor quality, metadata quality). Documents meeting both criteria bypass the `MIN_CONTENT_LENGTH = 50` character check in Layer 1 structural validation.

#### Source Files

See [`13--memory-quality-and-indexing/24-save-quality-gate-exceptions.md`](13--memory-quality-and-indexing/24-save-quality-gate-exceptions.md) for full implementation and test file listings.

---

### Weekly batch feedback learning

#### Description

Weekly batch feedback learning aggregates implicit feedback events from the ledger, computes confidence-weighted signal scores per memory, and records shadow rank deltas with min-support and boost-cap guards.

#### Current Reality

The batch learning pipeline runs on a 7-day window. It reads implicit feedback events and aggregates per-memory signals with confidence-weighted scoring: strong = 1.0, medium = 0.5, weak = 0.1. Guards: minimum 3 distinct sessions required before a signal is eligible, max boost delta of 0.10 per cycle. Results are logged for auditability. Shadow-only: no live ranking columns are mutated. Default OFF, set `SPECKIT_BATCH_LEARNED_FEEDBACK=true` to enable.

#### Source Files

See [`13--memory-quality-and-indexing/20-weekly-batch-feedback-learning.md`](13--memory-quality-and-indexing/20-weekly-batch-feedback-learning.md) for full implementation and test file listings.

---

### Assistive reconsolidation

#### Description

Three-tier assistive reconsolidation classifies memory pairs by cosine similarity into shadow-archive, review, or keep-separate tiers, providing non-destructive recommendations for near-duplicates and borderline pairs (updated 2026-03-25 per deep review).

#### Current Reality

The assistive reconsolidation module operates in three tiers: shadow-archive (similarity >= 0.96, the internal `auto_merge` tier label archives the older record while the new save proceeds normally), review (similarity >= 0.88, recommendation logged but no destructive action), and keep-separate (similarity < 0.88). Review-tier classification uses a heuristic: if the newer memory content is longer by > 20%, it is classified as complement; otherwise as supersede. Default ON (graduated), set `SPECKIT_ASSISTIVE_RECONSOLIDATION=false` to disable (updated 2026-03-25 per deep review).

#### Source Files

See [`13--memory-quality-and-indexing/21-assistive-reconsolidation.md`](13--memory-quality-and-indexing/21-assistive-reconsolidation.md) for full implementation and test file listings.

---

## 15. PIPELINE ARCHITECTURE

### 4-stage pipeline refactor

#### Description

When you ask the system a question, your search goes through four clear steps: gather candidates, combine and score them, rerank the best ones and finally filter the results. This is like an assembly line where each station has one job and passes its work to the next. The old system tried to do everything in one messy step, which made it hard to find and fix problems. The new structure makes each step predictable and testable.

#### Current Reality

The retrieval pipeline was restructured into four bounded stages with clear responsibilities, a single authoritative scoring point and a strict score-immutability invariant in the final stage.

Stage 1 (Candidate Generation) executes search channels based on query type: multi-concept, deep mode with query expansion, embedding expansion with R15 mutual exclusion, or standard hybrid search. The R8 memory summary channel runs in parallel when the scale gate is met (>5K memories), merging and deduplicating results by memory ID. Summary candidates now pass through the same `minQualityScore` filter as other candidates (Sprint 8 fix). Constitutional memory injection and quality/tier filtering run at the end of Stage 1.

**Phase 017 update:** The query embedding is now cached at function scope for reuse in the constitutional injection path, saving one API call per search. The constitutional injection count is tracked and passed through the orchestrator to Stage 4 output metadata (previously hardcoded to 0).

Stage 2 (Fusion and Signal Integration) applies scoring/enrichment in a fixed order: session boost, causal boost, co-activation spreading, community co-retrieval (N2c from precomputed `community_assignments`), graph signals (N2a+N2b: additive momentum/depth bonuses), FSRS testing effect (when `trackAccess=true`), intent weights (non-hybrid only, G2 prevention), artifact routing, feedback signals (learned trigger boosts and negative feedback demotions), artifact result limiting, anchor metadata annotation (S2) and validation metadata enrichment with a bounded multiplier clamped to 0.8-1.2 (S3). Community injection (N2c) runs before graph signals (N2a+N2b) so injected rows also receive momentum/depth adjustments. The G2 prevention is structural: an `isHybrid` boolean gates the intent weight step so the code path is absent for hybrid search.

**Phase 017 update:** Stage 2 now uses the shared `resolveEffectiveScore()` function from `pipeline/types.ts` (aliased as `resolveBaseScore`) for consistent score resolution. The five-factor composite weights auto-normalize to sum 1.0 after partial overrides. Cross-variant RRF fusion no longer double-counts convergence bonuses (per-variant bonus subtracted before cross-variant bonus). Adaptive fusion core weights (semantic + keyword + recency) normalize after doc-type adjustments.

Stage 3 (Rerank and Aggregate) handles optional cross-encoder reranking (gated by `SPECKIT_CROSS_ENCODER`) and MPAB chunk collapse with parent reassembly preserving document order.

Stage 4 (Filter and Annotate) enforces the "no score changes" invariant via dual enforcement: compile-time `Stage4ReadonlyRow` readonly fields plus runtime `verifyScoreInvariant()` assertion checking all six score fields. Within this invariant, it applies memory state filtering, TRM evidence gap detection and annotation metadata.

**Phase 017 update:** The legacy `postSearchPipeline` path was removed entirely, leaving the 4-stage pipeline as the only code path. A shared `resolveEffectiveScore()` function in `pipeline/types.ts` replaced both Stage 2's `resolveBaseScore()` and Stage 3's local `effectiveScore()`, ensuring a consistent fallback chain (`intentAdjustedScore -> rrfScore -> score -> similarity/100`, all clamped [0,1]) across all stages.

#### Source Files

See [`14--pipeline-architecture/01-4-stage-pipeline-refactor.md`](14--pipeline-architecture/01-4-stage-pipeline-refactor.md) for full implementation and test file listings.

---

### MPAB chunk-to-memory aggregation

#### Description

A long document gets split into smaller pieces for searching, but you want to see the whole document in your results, not a list of fragments. This feature combines the scores from all the pieces back into a single score for the whole document. The best piece counts the most, and the other pieces add a small bonus. That way a document with several good matches ranks higher than one with just a single lucky hit.

#### Current Reality

When a memory file splits into chunks, each chunk gets its own score. Multi-Parent Aggregated Bonus combines those chunk scores into a single memory-level score using the formula `sMax + 0.3 * sum(remaining) / sqrt(N)`. The top chunk score becomes the base, and the remaining chunks contribute a damped bonus.

Guards handle the edge cases: N=0 returns 0, N=1 returns the raw score and N>1 applies MPAB. The bonus coefficient (0.3) is exported as `MPAB_BONUS_COEFFICIENT` for tuning. The aggregation runs in Stage 3 of the 4-stage pipeline after RRF fusion and before state filtering. Runs behind the `SPECKIT_DOCSCORE_AGGREGATION` flag (default ON).

#### Source Files

See [`14--pipeline-architecture/02-mpab-chunk-to-memory-aggregation.md`](14--pipeline-architecture/02-mpab-chunk-to-memory-aggregation.md) for full implementation and test file listings.

---

### Chunk ordering preservation

#### Description

When a document is reassembled from its search-result pieces, the pieces need to appear in the order they were written, not in the order they scored. This feature makes sure you read the content from top to bottom, just like the original document. Without it, you would get a scrambled version where paragraph three appears before paragraph one.

#### Current Reality

When multi-chunk results collapse back into a single memory during MPAB aggregation, chunks are now sorted by their original `chunk_index` so the consuming agent reads content in document order rather than score order. The reassembly helper also reads both snake_case and camelCase chunk metadata (`parent_id`/`parentId`, `chunk_index`/`chunkIndex`, `chunk_label`/`chunkLabel`), so callers using formatter-style keys still hit the collapse path instead of silently passing through as separate rows. Full parent content is loaded from the database when possible. On DB failure, the best-scoring chunk is emitted as a fallback with `contentSource: 'file_read_fallback'` metadata.

#### Source Files

See [`14--pipeline-architecture/03-chunk-ordering-preservation.md`](14--pipeline-architecture/03-chunk-ordering-preservation.md) for full implementation and test file listings.

---

### Template anchor optimization

#### Description

Memory files contain hidden markers that label sections as things like "decision" or "summary." This feature reads those markers and attaches the labels to search results as extra information. It does not change how results are ranked. It just adds useful tags so that later steps in the pipeline know what kind of content they are looking at.

#### Current Reality

Anchor markers in memory files (structured sections like `<!-- ANCHOR:state -->`) are parsed and attached as metadata to search pipeline rows. The module extracts anchor IDs and derives semantic types from structured IDs (for example, `DECISION-pipeline-003` yields type `DECISION`). Simple IDs like `summary` pass through as-is.

This is a pure annotation step wired into Stage 2 as step 8. It never modifies any score fields. The enrichment makes Stage 3 (rerank) and Stage 4 (filter) anchor-aware without score side-effects. No feature flag. Always active.

#### Source Files

See [`14--pipeline-architecture/04-template-anchor-optimization.md`](14--pipeline-architecture/04-template-anchor-optimization.md) for full implementation and test file listings.

---

### Validation signals as retrieval metadata

#### Description

Well-maintained documents should rank slightly higher than neglected ones when both are equally relevant to your question. This feature gives a small ranking nudge to documents that have been reviewed, validated and kept up to date. The nudge is small enough that a truly relevant but less polished document still wins over a well-polished but less relevant one.

#### Current Reality

Spec document validation metadata integrates into the scoring layer as an additional ranking dimension in Stage 2. Four signal sources contribute: importance tier mapped to a numeric quality score (constitutional=1.0 through deprecated=0.1), the direct `quality_score` database column, `<!-- SPECKIT_LEVEL: N -->` content marker extraction and validation completion markers (`<!-- VALIDATED -->`, `<!-- VALIDATION: PASS -->`).

The combined multiplier is bounded to 0.8-1.2 via a clamping function, composed of quality factor (0.9-1.1), spec level bonus (0-0.06), completion bonus (0-0.04) and checklist bonus (0-0.01). Well-maintained documentation ranks slightly above neglected documentation when both are relevant. No feature flag. Always active.

#### Source Files

See [`14--pipeline-architecture/05-validation-signals-as-retrieval-metadata.md`](14--pipeline-architecture/05-validation-signals-as-retrieval-metadata.md) for full implementation and test file listings.

---

### Learned relevance feedback

#### Description

When you mark a search result as useful, the system remembers which search terms led you to it. Next time similar terms appear in a question, the system gives that memory a small boost. Over time, the system learns which results are genuinely helpful based on your actual selections, like a music app that gets better at recommending songs the more you use it.

#### Current Reality

The system learns from user result selections. When a user marks a search result as useful via `memory_validate` with a `queryId`, query terms are extracted and stored in a separate `learned_triggers` column. This column is explicitly isolated from the FTS5 index to prevent contamination, which would be irreversible without a full re-index.

Ten safeguards protect against noise: a 100+ stop-word denylist, rate cap of 3 terms per selection and 8 per memory, 30-day TTL decay, FTS5 isolation verified by 5 critical tests, noise floor (top-3 exclusion), 1-week shadow period (log-but-don't-apply), rollback mechanism, provenance audit log, 72-hour minimum memory age and sprint gate review.

**Sprint 8 update:** The R11 shadow-period safeguard remains active in runtime. `isInShadowPeriod()` and its guards in `recordSelection()` / `queryLearnedTriggers()` were retained as Safeguard #6 (1-week shadow mode: log-but-don't-apply). Sprint 8 dead-code cleanup removed other retired flag helpers (`isShadowScoringEnabled`, `isRsfEnabled`), but not the R11 shadow-period guard.

Learned triggers boost future searches via a 0.7x weight applied during the feedback signals step in Stage 2. The boost applies alongside the query, not replacing it. Runs behind the `SPECKIT_LEARN_FROM_SELECTION` flag (default ON, set to `false` to disable).

#### Source Files

See [`14--pipeline-architecture/06-learned-relevance-feedback.md`](14--pipeline-architecture/06-learned-relevance-feedback.md) for full implementation and test file listings.

---

### Search pipeline safety

#### Description

Three bugs were quietly making search results worse. One let low-quality summaries sneak past the quality filter. Another caused search terms to be processed differently at search time versus index time, so exact matches were missed. A third was accidentally throwing away almost all results from one search method because the quality bar was set too high for that method's scoring range. Fixing these three issues made search results noticeably more accurate.

#### Current Reality

Three search pipeline issues were fixed:

**D1: Summary quality bypass:** `stage1-candidate-gen.ts` allowed R8 summary hits to bypass the `minQualityScore` filter, letting low-quality summaries enter final results. Summary candidates now pass through the same quality filter.

**D2: FTS5 double-tokenization:** `sqlite-fts.ts` and `bm25-index.ts` had separate tokenization logic, causing query terms to be tokenized differently than indexed content. Refactored to a shared `sanitizeQueryTokens()` function returning a raw token array that both callers join with their appropriate syntax.

**D3: Quality floor vs RRF range mismatch:** `channel-representation.ts` used `QUALITY_FLOOR=0.2` which filtered out virtually all RRF-sourced results (RRF scores are typically 0.01-0.03). Lowered to 0.005.

#### Source Files

See [`14--pipeline-architecture/07-search-pipeline-safety.md`](14--pipeline-architecture/07-search-pipeline-safety.md) for full implementation and test file listings.

---

### Performance improvements

#### Description

Thirteen small speed improvements were made across the system. Some replaced slow scanning operations with faster lookups. Others fixed places where the same question was asked many times when once would do. The result is a system that responds more quickly, especially as the amount of stored data grows. Think of it as replacing a hand-cranked search with a power tool.

#### Current Reality

Thirteen performance improvements were applied:

**Quick wins:** `Math.max(...spread)` replaced with `reduce`-based max in `tfidf-summarizer.ts` (prevents RangeError on large arrays). Unbounded query in `memory-summaries.ts` gained a `LIMIT` clause. O(n) full scan in `mutation-ledger.ts` replaced with SQL `COUNT(*)` query using `json_extract`.

**Entity linker:** `mergedEntities` array lookups converted to `Set` for O(1) `.has()` checks. N+1 `getEdgeCount` queries replaced with a single batch query that combines `source_id IN (...)` and `target_id IN (...)` branches via `UNION ALL` before aggregation.

**SQL-level:** Causal edge upsert keeps explicit row lookup before and after UPSERT so weight-history logging and canonical row-id resolution stay deterministic. Round-trip reduction via `last_insert_rowid()` has not been applied in the current implementation. Spec folder hierarchy tree is cached with a 60-second WeakMap TTL keyed by database instance.

#### Source Files

See [`14--pipeline-architecture/08-performance-improvements.md`](14--pipeline-architecture/08-performance-improvements.md) for full implementation and test file listings.

---

### Activation window persistence

#### Description

The quality gate needs a two-week trial period before it starts blocking bad saves. Previously, restarting the server reset the trial clock back to zero, so the gate never graduated. This fix remembers the start date in the database so restarts do not affect the countdown. Without it, the quality gate would stay in warning-only mode forever.

#### Current Reality

The `ensureActivationTimestampInitialized` path was added to `save-quality-gate.ts` to preserve the warn-only window activation timestamp across process restarts. Without this, the 14-day warm-up period restarted on every server reload. Regression test `WO7` verifies persistence.

#### Source Files

See [`14--pipeline-architecture/09-activation-window-persistence.md`](14--pipeline-architecture/09-activation-window-persistence.md) for full implementation and test file listings.

---

### Legacy V1 pipeline removal

#### Description

The system used to have two different search paths: an old one and a new one. The old path was causing bugs and was no longer needed because the new one was already the default. This cleanup removed the old path entirely so there is only one way searches run, eliminating a whole class of bugs that came from the two paths disagreeing with each other.

#### Current Reality

The legacy V1 pipeline was the root cause of 3 of 4 P0 bugs: an inverted `STATE_PRIORITY` map, divergent scoring order in post-search weighting and a mismatched deep-query variant cap. Since V2 was already the default, the legacy handler path in `memory-search.ts` was removed and the 4-stage orchestrator became the only runtime path. Stage helpers with familiar names now live in stage modules (`stage1-candidate-gen.ts`, `stage2-fusion.ts`, `stage3-rerank.ts`, `stage4-filter.ts`) rather than the old monolithic V1 branch. The `isPipelineV2Enabled()` function now always returns `true` with a deprecation comment, and stale legacy-handler imports were removed.

Orphaned chunk detection was added to `verify_integrity()` as the fourth P0 fix: chunks whose parent has been deleted but the chunk record persists (e.g., if FK cascade didn't fire) are now detected and optionally auto-cleaned when `autoClean=true`.

#### Source Files

See [`14--pipeline-architecture/10-legacy-v1-pipeline-removal.md`](14--pipeline-architecture/10-legacy-v1-pipeline-removal.md) for full implementation and test file listings.

---

### Pipeline and mutation hardening

#### Description

Ten small but important fixes were applied to make the system more resilient. Some exposed missing options that were supposed to be available. Others fixed cleanup problems where deleting a memory left orphaned records behind. A few improved how the system handles word variations in searches. Together, these fixes close gaps that could have caused subtle data inconsistencies or missed search results over time.

#### Current Reality

Ten fixes addressed schema completeness, pipeline metadata, embedding efficiency, stemmer quality and data cleanup:

- **Schema params exposed (#13):** `memorySearch` tool schema now includes `trackAccess`, `includeArchived` and `mode` parameters.
- **Dead dedup config removed (#14):** `sessionDeduped` removed from Stage 4 metadata (dedup is post-cache in the main handler).
- **Constitutional count passthrough (#15):** Stage 1's constitutional injection count flows through the orchestrator to Stage 4 output metadata.
- **Embedding caching (#16):** Stage 1 caches the query embedding at function scope for reuse in the constitutional injection path, saving one API call per search.
- **Stemmer double-consonant (#18):** `simpleStem()` now handles doubled consonants after suffix removal: "running"->"runn"->"run", "stopped"->"stopp"->"stop".
- **Full-content embedding on update (#19):** `memory_update` now embeds `title + "\n\n" + content_text` instead of title alone.
- **Ancillary record cleanup on delete (#20):** Memory deletion now cleans `degree_snapshots`, `community_assignments`, `memory_summaries`, `memory_entities` and `causal_edges`.
- **BM25 index cleanup on delete (#21):** `bm25Index.getIndex().removeDocument(String(id))` called after successful delete when BM25 is enabled.
- **Atomic save error tracking (#22):** `atomicSaveMemory` now tracks rename-failure state with a `dbCommitted` flag for better error reporting.
- **Dynamic preflight error code (#23):** Preflight validation uses the actual error code from `preflightResult.errors[0].code` instead of hardcoding `ANCHOR_FORMAT_INVALID`.

A later audit added three more pipeline-side corrections to the same runtime path:

- **Deep-mode filter parity (H11):** Reformulation and HyDE candidates now re-enter scope, tier, `contextType` and `qualityThreshold` filtering before merge.
- **Constitutional scope parity (H12):** Constitutional injection now uses `shouldApplyScopeFiltering`, so global scope enforcement applies even when callers omit explicit governance scope fields.
- **CamelCase chunk metadata support (H14):** Chunk reassembly now accepts `parentId`, `chunkIndex` and `chunkLabel` aliases in addition to snake_case fields, preventing silent bypass of parent collapse.

#### Source Files

See [`14--pipeline-architecture/11-pipeline-and-mutation-hardening.md`](14--pipeline-architecture/11-pipeline-and-mutation-hardening.md) for full implementation and test file listings.

---

### DB_PATH extraction and import standardization

#### Description

Multiple parts of the system were figuring out where the database lives in their own way, each with its own hardcoded path. This fix created one shared place that knows the database location, and everyone else just asks it. It is like giving the whole team the same address book instead of each person keeping their own copy that might go out of date.

#### Current Reality

`shared/config.ts` gained an exported `getDbDir()` function reading `SPEC_KIT_DB_DIR` and `SPECKIT_DB_DIR` env vars. `shared/paths.ts` exports `DB_PATH` using this config. Scripts that hardcoded database paths (`cleanup-orphaned-vectors.ts`) now import from shared. Fourteen relative cross-boundary imports across scripts were converted to `@spec-kit/` workspace aliases.

#### Source Files

See [`14--pipeline-architecture/12-dbpath-extraction-and-import-standardization.md`](14--pipeline-architecture/12-dbpath-extraction-and-import-standardization.md) for full implementation and test file listings.

---

### Strict Zod schema validation

#### Description

AI assistants sometimes invent parameters that do not exist when calling tools. This feature checks every incoming request against a strict rulebook and rejects anything that does not match. It is like a bouncer who checks your ID against the guest list: if your name is not on the list, you do not get in. This prevents made-up inputs from causing unexpected behavior.

#### Current Reality

**IMPLEMENTED (Sprint 019, later expanded by session/code-graph additions).** All 43 live MCP tool definitions (L1-L7) have Zod runtime schemas defined in `mcp_server/schemas/tool-input-schemas.ts` (re-exported via `tool-schemas.ts`), controlled by `SPECKIT_STRICT_SCHEMAS` (`.strict()` vs `.passthrough()`). Hallucinated parameters from calling LLMs are rejected with clear Zod errors and logged to stderr for audit trail (CHK-029). Adds `zod` dependency.

#### Source Files

See [`14--pipeline-architecture/13-strict-zod-schema-validation.md`](14--pipeline-architecture/13-strict-zod-schema-validation.md) for full implementation and test file listings.

---

### Dynamic server instructions at MCP initialization

#### Description

When the memory server starts up, it now tells the calling AI how many memories are stored, how many folders exist and which search methods are available. This is like a librarian greeting you at the door with a summary of what the library has today. It helps the AI make smarter decisions about how to search right from the start.

#### Current Reality

**IMPLEMENTED (Sprint 019).** Startup in `context-server.ts` uses `server.setInstructions()` to inject a dynamic memory-system overview (total memories, spec folder count, channels, stale count) into the MCP instruction payload. Reuses existing `memory_stats` logic. Gated by `SPECKIT_DYNAMIC_INIT` (default `true`).

#### Source Files

See [`14--pipeline-architecture/14-dynamic-server-instructions-at-mcp-initialization.md`](14--pipeline-architecture/14-dynamic-server-instructions-at-mcp-initialization.md) for full implementation and test file listings.

---

### Warm server / daemon mode

#### Description

Right now, the memory server starts fresh every time it is called and shuts down when the conversation ends. This planned feature would keep the server running in the background so it is always warm and ready, like leaving your car engine idling instead of restarting it every time you need to drive. It is deferred until the underlying connection standards settle down.

#### Current Reality

**PLANNED (Sprint 019): DEFERRED.** HTTP daemon transport for warm, persistent server execution is deferred while MCP SDK HTTP transport conventions continue evolving. Current transport remains stdio. Estimated effort: L (2-3 weeks).

#### Source Files

See [`14--pipeline-architecture/15-warm-server-daemon-mode.md`](14--pipeline-architecture/15-warm-server-daemon-mode.md) for full implementation and test file listings.

---

### Backend storage adapter abstraction

#### Description

The system is still SQLite-backed, but it is no longer hard-wired directly at every vector-search call site. A small adapter layer now defines the vector-store contract and keeps the storage implementation swappable at the vector boundary. It is like changing from plugging appliances straight into the wall to using a standardized socket adapter first. You still use the same power source today, but the coupling point is cleaner and easier to replace later if scale ever demands it.

#### Current Reality

**IMPLEMENTED (Sprint 019 closeout).** `IVectorStore` defines the vector-storage contract and `SQLiteVectorStore` provides the current production implementation. The broader graph/document storage stack still runs concretely on SQLite, so the shipped seam is intentionally scoped: vector storage is abstracted, while graph/document stores remain direct SQLite integrations until a real multi-backend need appears.

#### Source Files

See [`14--pipeline-architecture/16-backend-storage-adapter-abstraction.md`](14--pipeline-architecture/16-backend-storage-adapter-abstraction.md) for full implementation and test file listings.

---

### Cross-process DB hot rebinding

#### Description

When another process changes the database while the server is running, the server needs to notice and reconnect. This feature watches for a signal file that says "the database changed" and automatically refreshes the connection. Without it, the server would keep using stale data until someone manually restarted it.

#### Current Reality

Process-lifetime DB connection manager via marker file (`DB_UPDATED_FILE`). When an external process mutates the database, it writes a timestamp to the marker file. On next `checkDatabaseUpdated()` call, if timestamp > lastDbCheck, triggers `reinitializeDatabase()`: closes the old DB handle, calls `vectorIndex.initializeDb()`, and rebinds 6 modules (vectorIndex, checkpoints, accessTracker, hybridSearch, sessionManager, incrementalIndex). Concurrency-safe via mutex with race-condition fix (P4-13). Also manages embedding model readiness (polling with timeout) and constitutional cache lifecycle.

#### Source Files

See [`14--pipeline-architecture/17-cross-process-db-hot-rebinding.md`](14--pipeline-architecture/17-cross-process-db-hot-rebinding.md) for full implementation and test file listings.

> **Playbook:** [112](../manual_testing_playbook/manual_testing_playbook.md)

---

### Atomic write-then-index API

#### Description

When saving a memory, the system first writes the file safely to a temporary location and only moves it to the final spot once the write is confirmed complete. If a crash happens mid-save, the half-written file can be recovered on the next startup. This prevents data loss the same way a word processor auto-saves a draft before overwriting your real document.

#### Current Reality

The `memory_save` handler offers an atomic write-then-index mode where file writing is atomic (pending file + rename), while indexing runs asynchronously after the write succeeds. The transaction manager writes memory content to a `_pending` file and renames it to the final path. The `dbOperation` callback in this path is intentionally a no-op. `indexMemoryFile(...)` executes afterward and can retry once on transient failures.

Because indexing is decoupled from the file rename, this flow provides atomic file persistence with guarded best-effort index consistency (retry + rollback), not a single file+DB transaction. The `AtomicSaveResult` interface reports `dbCommitted` to distinguish full success from partial commit states (for example, DB callback committed but rename failed, leaving a pending file for startup recovery).

#### Source Files

See [`14--pipeline-architecture/18-atomic-write-then-index-api.md`](14--pipeline-architecture/18-atomic-write-then-index-api.md) for full implementation and test file listings.

---

### Embedding retry orchestrator

#### Description

Creating a numerical fingerprint for each memory requires calling an external service that can sometimes be unavailable. When that service fails, the memory is saved without a fingerprint and queued for a retry. A background worker periodically picks up these queued items and tries again. This way, a temporary service outage does not permanently prevent your memories from being fully searchable.

#### Current Reality

The retry manager (`lib/providers/retry-manager.ts`) orchestrates background retry of failed embedding operations. When the primary embedding provider is unavailable or returns errors during `memory_save` or `memory_index_scan`, the affected memories are marked with `embedding_status = 'pending'` and stored without vectors (lexical-only fallback). The retry manager runs as a background job with configurable interval and batch size, picking up pending memories and re-attempting embedding generation.

Each retry attempt uses the embedding cache to avoid redundant API calls for content that was previously embedded successfully. The retry stats (`pending`, `retry`, `failed` counts) are exposed for monitoring. Failed memories increment a `retry_count` for progressive backoff. Retried embeddings are inserted into `vec_memories` by the active retry and indexing flow without a separate index-refresh module.

#### Source Files

See [`14--pipeline-architecture/19-embedding-retry-orchestrator.md`](14--pipeline-architecture/19-embedding-retry-orchestrator.md) for full implementation and test file listings.

---

### 7-layer tool architecture metadata

#### Description

The system has many different tools, and each one needs to know how much response space it is allowed to use and what kind of task it is best suited for. This feature organizes all tools into seven layers with budgets and guidance, like assigning departments in a company. It does not control how tools are called at runtime but helps recommend the right tool for the job.

#### Current Reality

The layer definitions module (`lib/architecture/layer-definitions.ts`) defines a 7-layer MCP architecture (L1 through L7) where each layer has token budgets, priorities, use-case guidance and tool membership. Layer IDs still map to task types (`search`, `browse`, `modify`, `checkpoint`, `analyze`, `maintenance`, `default`) for recommendation/hinting.

Runtime dispatch in `context-server.ts` has a single name-based dispatch hop (`dispatchTool(name, args)`), and that hop fans into 5 dispatcher modules in `tools/index.ts` (`context`, `memory`, `causal`, `checkpoint`, `lifecycle`). The 7-layer model is therefore metadata/governance (token budgets and advisory recommendations), not a 7-layer runtime classifier/router.

#### Source Files

See [`14--pipeline-architecture/20-7-layer-tool-architecture-metadata.md`](14--pipeline-architecture/20-7-layer-tool-architecture-metadata.md) for full implementation and test file listings.

---

### Atomic pending-file recovery

#### Description

If the system crashes in the middle of saving a memory, the file might be left in a half-finished state on disk. When the server starts back up, this feature scans for those half-finished files and completes the save if the database already recorded it. It is like a delivery service checking for undelivered packages each morning and finishing the route from where it left off.

#### Current Reality

The transaction manager maintains an atomic write protocol where memory files are first written to a `_pending` path and only renamed to their final location after the database transaction commits. When a crash or error interrupts this sequence after DB commit but before rename, a `_pending` file is left on disk as a recoverable artifact.

The `findPendingFiles()` function scans the memory directories for files matching the `_pending` suffix. Each discovered pending file is checked against the database: if the corresponding DB row exists (committed), the file is renamed to its final path completing the interrupted operation. The `recoverPendingFile()` function handles individual file recovery and updates the `totalRecoveries` metric. This mechanism ensures zero data loss from interrupted save operations.

#### Source Files

See [`14--pipeline-architecture/21-atomic-pending-file-recovery.md`](14--pipeline-architecture/21-atomic-pending-file-recovery.md) for full implementation and test file listings.

---

### Lineage state active projection and asOf resolution

#### Description

Every time a memory is saved, the system adds a timestamped record of that change to a history log. When you need to know what a memory looked like at a specific point in the past, the system can look up the history and give you the exact version from that moment. Think of it as a timeline for each memory that you can rewind to any date, useful for understanding what changed and when.

#### Current Reality

Phase 2 introduced versioned lineage state as a first-class storage primitive. Save-time writes append immutable lineage rows, while a deterministic active projection resolves which row is currently effective for a memory.

The active projection supports deterministic `asOf` resolution: for any timestamp, the runtime selects the latest valid lineage state at or before that point. Transition validation now compares parsed epoch timestamps, not raw strings, so non-ISO formatting or timezone variants cannot be misordered during predecessor checks. This enables time-consistent retrieval, deterministic rollback planning and predictable replay behavior for migration and audit workflows.

Schema support is now part of vector index setup, and save handlers integrate lineage writes so append-first lineage history and active projection stay synchronized.

#### Source Files

See [`14--pipeline-architecture/22-lineage-state-active-projection-and-asof-resolution.md`](14--pipeline-architecture/22-lineage-state-active-projection-and-asof-resolution.md) for full implementation and test file listings.

> **Playbook:** [129](../manual_testing_playbook/manual_testing_playbook.md), [130](../manual_testing_playbook/manual_testing_playbook.md)

---

## 16. RETRIEVAL ENHANCEMENTS

### Dual-scope memory auto-surface

#### Description

When you are working on something, this feature automatically brings up important memories you might need without you having to ask for them. It watches for two key moments: when you use a tool and when a long conversation gets compressed. Think of it like a helpful assistant who notices what you are doing and quietly slides the right reference notes onto your desk.

#### Current Reality

Memory auto-surface hooks fire at two lifecycle points beyond explicit search: tool dispatch for non-memory-aware tools (using extracted context hints), and session compaction (when context is compressed, critical memories are re-injected).

Each hook point has a per-point token budget of 4,000 tokens maximum. The tool dispatch hook checks incoming tool arguments for context hints (input, query, prompt, specFolder, filePath or concepts) and surfaces constitutional-tier and trigger-matched memories, but skips memory-aware tools to avoid recursive surfacing loops. Memory-aware tools are handled in-band by the context-server pre-dispatch branch (`autoSurfaceMemories` / `autoSurfaceAtCompaction`). Constitutional memories are cached for 1 minute via an in-memory cache.

#### Source Files

See [`15--retrieval-enhancements/01-dual-scope-memory-auto-surface.md`](15--retrieval-enhancements/01-dual-scope-memory-auto-surface.md) for full implementation and test file listings.

---

### Constitutional memory as expert knowledge injection

#### Description

Some memories are fundamental rules that should always come up when relevant, like "never delete production data." This feature tags those high-priority memories with instructions about when to surface them. It works like sticky notes on a filing cabinet that say "pull this file whenever someone asks about X."

#### Current Reality

Constitutional-tier memories receive a `retrieval_directive` metadata field formatted as explicit instruction prefixes for LLM consumption. Examples: "Always surface when: user asks about memory save rules" or "Prioritize when: debugging search quality."

Rule patterns are extracted from content using a ranked list of imperative verbs (must, always, never, should, require) and condition-introducing words (when, if, for, during). Scanning is capped at 2,000 characters from the start of content, and each directive component is capped at 120 characters. The `enrichWithRetrievalDirectives()` function maps over results without filtering or reordering. The enrichment is wired into `hooks/memory-surface.ts` before returning results. In the Stage 1 injection path, constitutional rows now use `shouldApplyScopeFiltering` rather than `hasGovernanceScope` alone before merge, so global scope enforcement and caller-provided governance scope are applied consistently.

#### Source Files

See [`15--retrieval-enhancements/02-constitutional-memory-as-expert-knowledge-injection.md`](15--retrieval-enhancements/02-constitutional-memory-as-expert-knowledge-injection.md) for full implementation and test file listings.

---

### Spec folder hierarchy as retrieval structure

#### Description

The way you organize your project folders directly influences what the system finds when you search. If you are looking at a child folder, the system also checks the parent and sibling folders for related information. It is like browsing one section of a bookstore and getting recommendations from nearby shelves because they cover related topics.

#### Current Reality

Spec folder paths from memory metadata are parsed into an in-memory hierarchy tree. The `buildHierarchyTree()` function performs two-pass construction: the first pass creates nodes from all distinct `spec_folder` values including implicit intermediate parents, the second pass links children to parents via path splitting.

The `queryHierarchyMemories()` function returns parent, sibling and ancestor memories with relevance scoring: self receives 1.0, parent 0.8, grandparent 0.6, sibling 0.5, with a floor of 0.3. The graph search function traverses this tree so that related folders surface as contextual results alongside direct matches, making spec folder organization a direct retrieval signal rather than metadata that only serves filtering. Always active with no feature flag.

**Sprint 8 update:** A WeakMap TTL cache (60s, keyed by database instance) was added to `buildHierarchyTree()` to avoid full-scan reconstruction on every search request. An `invalidateHierarchyCache()` export allows explicit cache clearing when hierarchy data changes.

#### Source Files

See [`15--retrieval-enhancements/03-spec-folder-hierarchy-as-retrieval-structure.md`](15--retrieval-enhancements/03-spec-folder-hierarchy-as-retrieval-structure.md) for full implementation and test file listings.

---

### Lightweight consolidation

#### Description

Over time, stored memories can contradict each other or grow stale. This feature runs periodic housekeeping to spot conflicts, strengthen connections that get used often and flag relationships that have not been touched in months. Think of it as a librarian who regularly walks the shelves to catch duplicate entries and retire outdated references.

#### Current Reality

Four sub-components handle ongoing memory graph maintenance as a weekly batch cycle. Contradiction scanning finds memory pairs above 0.85 cosine similarity with keyword negation conflicts using a dual strategy: vector-based (cosine on sqlite-vec embeddings) plus heuristic fallback (word overlap). Both use a `hasNegationConflict()` keyword asymmetry check against approximately 20 negation terms (not, never, deprecated, replaced and others). The system surfaces full contradiction clusters rather than isolated pairs via 1-hop causal edge neighbor expansion.

Hebbian edge strengthening reinforces recently accessed edges at +0.05 per cycle with a 30-day decay of 0.1, respecting the auto-edge strength cap. Staleness detection flags edges unfetched for 90 or more days without deleting them. Edge bounds enforcement reports current edge counts versus the 20-edge-per-node maximum.

All weight modifications are logged to the `weight_history` table. The cycle fires after every successful `memory_save` when enabled. Runs behind the `SPECKIT_CONSOLIDATION` flag (default ON).

#### Source Files

See [`15--retrieval-enhancements/04-lightweight-consolidation.md`](15--retrieval-enhancements/04-lightweight-consolidation.md) for full implementation and test file listings.

---

### Memory summary search channel

#### Description

Long documents can bury their key points in paragraphs of detail. This feature creates a short summary of each memory when it is saved and searches against those summaries instead of the full text. It is like reading the back-cover blurb of a book rather than skimming every page to decide if it is relevant.

#### Current Reality

Large memory files bury their key information in paragraphs of context. A 2,000-word implementation summary might contain three sentences that actually answer a retrieval query. Searching against the full content dilutes embedding similarity with irrelevant noise.

R8 generates extractive summaries at save time using a pure-TypeScript TF-IDF implementation with zero dependencies. The `computeTfIdf()` function scores each sentence by term frequency times inverse document frequency across all sentences in the document, normalized to [0,1]. The `extractKeySentences()` function selects the top-3 scoring sentences and returns them in original document order rather than score order, preserving narrative coherence.

Generated summaries are stored in the `memory_summaries` table alongside a summary-specific embedding vector computed by the same embedding function used for full content. The `querySummaryEmbeddings()` function performs cosine similarity search against these summary embeddings and returns lightweight summary hits (`id`, `memoryId`, `similarity`) rather than `PipelineRow` rows.

**Sprint 8 update:** A `LIMIT` clause was added to the unbounded summary query in `memory-summaries.ts` (capped at `Math.max(limit * 10, 1000)`) to prevent full-table scans on large corpora. Summary candidates in Stage 1 now also pass through the same `minQualityScore` filter applied to other candidates.

The summary channel is integrated as an additional Stage 1 retrieval channel alongside hybrid, vector and multi-concept paths. Stage 1 adapts summary hits into full `PipelineRow` candidates by hydrating `memory_index` rows, assigning `similarity` / `score`, then merging and deduplicating by memory ID with baseline candidates taking priority.

A runtime scale gate activates the channel only when the system exceeds 5,000 indexed memories with successful embeddings. Below that threshold, the summary channel adds overhead without measurable benefit because the base channels already cover the corpus effectively. The code exists regardless of scale. The gate simply skips execution. Runs behind the `SPECKIT_MEMORY_SUMMARIES` flag (default ON).

#### Source Files

See [`15--retrieval-enhancements/05-memory-summary-search-channel.md`](15--retrieval-enhancements/05-memory-summary-search-channel.md) for full implementation and test file listings.

---

### Cross-document entity linking

#### Description

Different documents in different folders sometimes talk about the same thing without knowing about each other. This feature connects them automatically when it notices they reference the same concept. It is like a researcher who reads two separate reports, notices both mention the same topic and staples a note between them saying "these are related."

#### Current Reality

Memories in different spec folders often discuss the same concepts without any explicit connection between them. A decision record in one folder mentions "embedding cache" and an implementation summary in another folder implements it, but the retrieval system has no way to connect them unless a causal edge exists.

Cross-document entity linking bridges this gap using the entity catalog populated by R10. The `buildEntityCatalog()` function groups entities from the `memory_entities` table by canonical name. The `findCrossDocumentMatches()` function identifies entities appearing in two or more distinct spec folders, which represent genuine cross-document relationships.

For each cross-document match, `createEntityLinks()` inserts causal edges with `relation='supports'`, `strength=0.7` and `created_by='entity_linker'`. The `supports` relation was chosen over adding a new relation type to avoid ALTER TABLE complexity on the SQLite `causal_edges` CHECK constraint. Entity-derived links are genuinely supportive relationships: if two documents reference the same entity, they support each other's context.

An infrastructure gate checks that the `entity_catalog` has entries before running. Without R10 providing extracted entities, S5 has nothing to operate on. The `runEntityLinking()` orchestrator chains catalog build, match finding and edge creation with statistics reporting.

**Sprint 8 update:** Two performance improvements were applied to `entity-linker.ts`: (1) a parallel `Set` was added for `catalogSets` providing O(1) `.has()` lookups instead of O(n) `.includes()` in inner loops, and (2) a `batchGetEdgeCounts()` function replaced N+1 individual `getEdgeCount` queries with a single batch query.

A density guard prevents runaway edge creation: current global edge density is computed as `total_edges / total_memories` and checked before link generation begins. The linker also checks projected post-insert global density before creating links. If either check exceeds the configured threshold, new entity links are skipped to avoid overwhelming the graph. The threshold is controlled by `SPECKIT_ENTITY_LINKING_MAX_DENSITY` (default `1.0`), and invalid or negative values fall back to `1.0`. Runs behind the `SPECKIT_ENTITY_LINKING` flag (default ON). Depends on a populated `entity_catalog` (typically produced by R10 auto-entities).

#### Source Files

See [`15--retrieval-enhancements/06-cross-document-entity-linking.md`](15--retrieval-enhancements/06-cross-document-entity-linking.md) for full implementation and test file listings.

---

### Tier-2 fallback channel forcing

#### Description

Normally the search system skips some search methods when a question seems simple. But when results come back poor, this fallback kicks in and forces every search method to run. It is a safety net that says "the shortcut did not work, so try everything before giving up."

#### Current Reality

A `forceAllChannels` option was added to hybrid search. When the tier-2 quality fallback activates, it now sets `forceAllChannels: true` to ensure all retrieval channels execute, bypassing the simple-route channel reduction that could skip BM25 or graph channels. Regression test `C138-P0-FB-T2` verifies the behavior.

#### Source Files

See [`15--retrieval-enhancements/07-tier-2-fallback-channel-forcing.md`](15--retrieval-enhancements/07-tier-2-fallback-channel-forcing.md) for full implementation and test file listings.

---

### Provenance-rich response envelopes

#### Description

When you search for something, the system normally just gives you the answer. With this feature turned on, it also shows you how it found the answer: which search methods it used, how it scored each result and where the information came from. It is like getting a receipt with your purchase that shows every step of the transaction.

#### Current Reality

**IMPLEMENTED (Sprint 019).** Search results gain optional provenance envelopes (default `includeTrace: false`) exposing internal pipeline scoring that is currently dropped at Stage 4 exit. When enabled, responses include `scores` (semantic, lexical, fusion, intentAdjusted, composite, rerank, attention), `source` (file, anchorIds, anchorTypes, lastModified, memoryState) and `trace` (channelsUsed, pipelineStages, fallbackTier, queryComplexity, expansionTerms, budgetTruncated, scoreResolution).

#### Source Files

See [`15--retrieval-enhancements/08-provenance-rich-response-envelopes.md`](15--retrieval-enhancements/08-provenance-rich-response-envelopes.md) for full implementation and test file listings.

---

### Contextual tree injection

#### Description

When search results come back, each piece of information now carries a short label showing where it belongs in the project, like "Project > Feature > Detail." Without this, you would see raw content with no clue about its context. It is like seeing a chapter heading at the top of a photocopied page so you know which part of the book it came from.

#### Current Reality

**IMPLEMENTED (Sprint 019).** Returned chunks are prefixed with hierarchical context headers in the format `[parent > child — description]` (max 100 chars), using existing PI-B3 cached spec folder descriptions. Gated by `SPECKIT_CONTEXT_HEADERS` (default `true`) and injected after Stage 4 token-budget truncation.

#### Source Files

See [`15--retrieval-enhancements/09-contextual-tree-injection.md`](15--retrieval-enhancements/09-contextual-tree-injection.md) for full implementation and test file listings.

---

## 17. TOOLING AND SCRIPTS

### Tree thinning for spec folder consolidation

#### Description

Before the system processes a project folder, it trims down the content to a manageable size. Large files stay as they are, medium ones get condensed and small ones get merged together. Think of it like packing a suitcase: you keep the big items, fold the medium ones and bundle the small items into one bag so everything fits.

#### Current Reality

Tree thinning is a pre-pipeline token-reduction step for spec-folder consolidation. `applyTreeThinning()` classifies files by token count, keeps larger files intact, uses content-as-summary for medium files and merges small files into parent-level summaries.

Integration happens in `scripts/core/workflow.ts` at Step 7.6, where rendered file changes are transformed into thinning inputs, processed through `applyTreeThinning()` and then applied back to the effective file set before downstream retrieval/scoring logic.

#### Source Files

See [`16--tooling-and-scripts/01-tree-thinning-for-spec-folder-consolidation.md`](16--tooling-and-scripts/01-tree-thinning-for-spec-folder-consolidation.md) for full implementation and test file listings.

---

### Architecture boundary enforcement

#### Description

The codebase has clear boundaries between its major sections, and this tool automatically checks that nobody accidentally crosses them. It is like having walls between departments in an office building: you can communicate through proper channels, but you cannot just reach through the wall and grab something from another department's desk.

#### Current Reality

Two architecture rules in `ARCHITECTURE.md` were previously documentation-only with no automated enforcement: (1) `shared/` must not import from `mcp_server/` or `scripts/`, and (2) `mcp_server/scripts/` must contain only thin compatibility wrappers delegating to canonical `scripts/dist/` implementations.

`check-architecture-boundaries.ts` enforces both rules as part of `npm run check`. GAP A walks all `.ts` files in `shared/`, extracts module specifiers (skipping block and line comments), and flags any import matching relative paths to `mcp_server/` or `scripts/` at any depth, or package-form `@spec-kit/mcp-server/` or `@spec-kit/scripts/`. This is an absolute prohibition with no allowlist.

GAP B scans top-level `.ts` files in `mcp_server/scripts/` (non-recursive) and verifies each passes three conditions: at most 50 substantive lines (non-blank, non-comment), contains a `child_process` import and references `scripts/dist/` somewhere in its content. Failure on any condition flags the file as not a valid wrapper.

#### Source Files

See [`16--tooling-and-scripts/02-architecture-boundary-enforcement.md`](16--tooling-and-scripts/02-architecture-boundary-enforcement.md) for full implementation and test file listings.

---

### Progressive validation for spec documents

#### Description

This tool checks your project documents for problems in four steps: find issues, fix the easy ones automatically, suggest fixes for the harder ones and write up a report. It works like a spell-checker that also auto-corrects obvious typos and highlights the rest for you to review.

#### Current Reality

The `progressive-validate.sh` wrapper in `scripts/spec/` runs a 4-level pipeline on top of `validate.sh`:

1. **Detect (Level 1)** delegates validation to `validate.sh` and captures the compatible detect exit status.
2. **Auto-fix (Level 2)** applies safe mechanical fixes (date placeholders, heading normalization, whitespace/line-ending normalization) with logged before/after diffs.
3. **Suggest (Level 3)** derives remediation guidance for non-automatable failures from JSON validation output.
4. **Report (Level 4)** emits a consolidated human or JSON summary including detect outcome, auto-fixes and suggestions.

Flags include `--level N`, `--dry-run`, `--json`, `--strict`, `--quiet` and `--verbose`. Exit code behavior matches `validate.sh`: **0 = pass, 1 = warnings, 2 = errors** (with `--strict`, warnings are promoted to exit 2).

#### Source Files

No dedicated source files. This is a cross-cutting meta-improvement applied across multiple modules.

See [`16--tooling-and-scripts/03-progressive-validation-for-spec-documents.md`](16--tooling-and-scripts/03-progressive-validation-for-spec-documents.md) for full implementation and test file listings.

---

### Dead code removal

#### Description

Over time, some parts of the code stopped being used but were never cleaned up. This effort identified and removed roughly 360 lines of unused code: old switches that were always off, variables that were set but never read and functions that nothing called anymore. It is like clearing out a storage closet of things nobody has touched in years so the space stays organized.

#### Current Reality

Approximately 360 lines of dead code were removed across four categories:

**Hot-path dead branches:** Dead RSF branch and dead shadow-scoring branch removed from `hybrid-search.ts`. Both were guarded by feature flag functions that always returned `false`.

**Dead feature flag functions:** `isShadowScoringEnabled()` was removed from `shadow-scoring.ts` and `search-flags.ts`. The former `isRsfEnabled()` helper was removed as part of RSF retirement. `isInShadowPeriod()` in `learned-feedback.ts` remains active as the R11 shadow-period safeguard and was not removed.

**Dead module-level state:** `stmtCache` Map (archival-manager.ts, never populated), `lastComputedAt` (community-detection.ts, set but never read), `activeProvider` cache (cross-encoder.ts, never populated), `flushCount` (access-tracker.ts, never incremented), 3 dead config fields in working-memory.ts (`decayInterval`, `attentionDecayRate`, `minAttentionScore`).

**Dead functions and exports:** `computeCausalDepth` single-node variant (graph-signals.ts) was removed. `computeCausalDepthScores` is the live batch API. Also removed: `getSubgraphWeights` (graph-search-fn.ts, always returned 1.0, replaced with inline constant), `RECOVERY_HALF_LIFE_DAYS` (negative-feedback.ts, never imported), `'related'` weight entry (causal-edges.ts, invalid relation type), `logCoActivationEvent` and `CoActivationEvent` (co-activation.ts, never called).

**Preserved (NOT dead):** `computeStructuralFreshness` and `computeGraphCentrality` in `fsrs.ts` were identified as planned architectural components (not concluded experiments) and retained.

#### Source Files

No dedicated source files. This is a cross-cutting meta-improvement applied across multiple modules.

See [`16--tooling-and-scripts/04-dead-code-removal.md`](16--tooling-and-scripts/04-dead-code-removal.md) for full source evidence and change accounting.

---

### Code standards alignment

#### Description

This was a cleanup pass that made the code follow a consistent style across the project. It fixed 45 places where comments, file headers, naming patterns or import ordering did not match the agreed-upon rules. Think of it like an editor going through a document to make sure every chapter uses the same formatting and citation style.

#### Current Reality

All modified files were reviewed against sk-code--opencode standards. 45 violations found and fixed: 26 AI-intent comment conversions (AI-WHY, AI-TRACE, AI-GUARD prefixes), 10 MODULE/COMPONENT headers added, import ordering corrections and constant naming (`specFolderLocks` → `SPEC_FOLDER_LOCKS`).

#### Source Files

No dedicated source files. This is a cross-cutting meta-improvement applied across multiple modules.

See [`16--tooling-and-scripts/05-code-standards-alignment.md`](16--tooling-and-scripts/05-code-standards-alignment.md) for full source evidence and violation accounting.

---

### Real-time filesystem watching with chokidar

#### Description

Instead of waiting for you to ask the system to re-scan your files, this feature watches your project folder in real time. When you save, rename or delete a memory file, the system notices and updates its index automatically. It works like how your email app shows new messages as they arrive rather than making you hit refresh.

#### Current Reality

**IMPLEMENTED (Sprint 019).** Adds `chokidar`-based push indexing in `lib/ops/file-watcher.ts` with 2-second debounce, TM-02 SHA-256 content-hash deduplication and exponential backoff retries for `SQLITE_BUSY` (1s/2s/4s, 3 attempts). `getWatcherMetrics()` is exported and returns `{ filesReindexed, avgReindexTimeMs }`, with per-reindex timing logs emitted to stderr (CHK-087). Gated by `SPECKIT_FILE_WATCHER` (default `false`).

`mcp_server/tests/file-watcher.vitest.ts` now covers the watcher runtime behavior and is green in the current verification run, including debounce, rename, burst/concurrent rename, retry and metrics scenarios.

#### Source Files

See [`16--tooling-and-scripts/06-real-time-filesystem-watching-with-chokidar.md`](16--tooling-and-scripts/06-real-time-filesystem-watching-with-chokidar.md) for full implementation and test file listings.

---

### Standalone admin CLI

#### Description

This is a command-line maintenance tool for the memory database that you can run directly without going through the normal system. It lets you check database statistics, delete old records in bulk, rebuild the search index or roll back a database upgrade. Think of it as the "service panel" for the system that only operators use when routine maintenance or emergency recovery is needed.

#### Current Reality

Non-MCP `spec-kit-cli` entry point (`cli.ts`) for database maintenance. Four commands: `stats` (tier distribution, top folders, schema version), `bulk-delete` (with --tier, --folder, --older-than, --dry-run, --skip-checkpoint, where constitutional/critical tiers require folder scope), `reindex` (--force, --eager-warmup), `schema-downgrade` (--to 15, --confirm). Transaction-wrapped deletions, checkpoint creation before bulk-delete, mutation ledger recording. Invoked as `node cli.js <command>` from any directory.

#### Checkpoint-before-delete contract (`bulk-delete`)

- `bulk-delete` attempts to create a pre-delete checkpoint before destructive deletion whenever `--skip-checkpoint` is **not** set.
- `--skip-checkpoint` is allowed for non-critical tiers, but blocked for `constitutional` and `critical`.
- Checkpoint creation is **best-effort** (not mandatory): if `createCheckpoint` fails, the CLI logs a warning and proceeds with deletion.

**Failure behavior:** checkpoint creation failure does **not** halt delete operations.

**Decision rationale:** this CLI is an operator recovery tool and must stay usable during partial storage failures. Making checkpoints mandatory for every delete could block necessary cleanup when checkpoint persistence is degraded. Instead, the command keeps explicit safety gates (tier validation and critical-tier scope requirements) and surfaces checkpoint failure clearly.

#### Source Files

See [`16--tooling-and-scripts/07-standalone-admin-cli.md`](16--tooling-and-scripts/07-standalone-admin-cli.md) for full implementation and test file listings.

> **Playbook:** [113](../manual_testing_playbook/manual_testing_playbook.md)

---

### Constitutional memory manager command

#### Description

This is the operator-facing slash command for creating and managing constitutional memories: the durable rules that always surface at the top of search results. Think of it as the system's rulebook editor rather than a generic note-taking command.

#### Current Reality

`/memory:learn` is now a constitutional-only workflow. The no-argument form shows an overview dashboard; natural-language input enters guided create mode; and `list`, `edit`, `remove`, and `budget` provide the rest of the lifecycle. New and edited files are written to `.opencode/skill/system-spec-kit/constitutional/`, indexed with `memory_save`, and checked against the shared `~2000` token budget for the constitutional tier.

Verification also closed active documentation drift outside the original spec file list. Global command indexes, related-command references, workflow docs, workspace READMEs, and speckit agent summaries now all describe `/memory:learn` as the constitutional memory manager instead of the retired "explicit learning / corrections / patterns" workflow.

#### Source Files

See [`16--tooling-and-scripts/13-constitutional-memory-manager-command.md`](16--tooling-and-scripts/13-constitutional-memory-manager-command.md) for full implementation and verification file listings.

> **Playbook:** [147](../manual_testing_playbook/manual_testing_playbook.md)

---

### Source-dist alignment enforcement

#### Description

Source-dist alignment enforcement validates that every `.js` file in `mcp_server/dist/lib/` has a corresponding `.ts` source file in `mcp_server/lib/`, detecting orphaned build artifacts that persist after source files are deleted or refactored.

#### Current Reality

`check-source-dist-alignment.ts` maps each `.js` file under `dist/lib/` to its expected `.ts` source under `lib/`, reports mismatches, and exits non-zero on violations. Supports a typed allowlist for intentional exceptions. Added in Phase 15 after discovering orphaned dist artifacts (`retry.js`, `hydra-baseline.js`). Policy documented in `ARCHITECTURE.md` under "Source-Dist Alignment Enforcement".

#### Source Files

See [`16--tooling-and-scripts/14-source-dist-alignment-enforcement.md`](16--tooling-and-scripts/14-source-dist-alignment-enforcement.md) for full implementation and verification file listings.

> **Playbook:** [150](../manual_testing_playbook/manual_testing_playbook.md)

---

### Module boundary map

#### Description

MODULE_MAP.md documents internal module ownership, dependency directions, feature catalog mapping, and canonical locations for all 26 `lib/` subdirectories. It makes module boundaries explicit for dead-code analysis, refactoring, and dependency enforcement.

#### Current Reality

`mcp_server/lib/MODULE_MAP.md` contains five sections: module inventory (26 entries), feature catalog crosswalk, dependency directions (enforcement deferred), canonical locations, and a no-symlinks policy in `ARCHITECTURE.md`. Created in Phase 15 after discovering symlink-masked dependencies.

#### Source Files

See [`16--tooling-and-scripts/15-module-boundary-map.md`](16--tooling-and-scripts/15-module-boundary-map.md) for full implementation and verification file listings.

> **Playbook:** [151](../manual_testing_playbook/manual_testing_playbook.md), [152](../manual_testing_playbook/manual_testing_playbook.md)

---

### JSON mode structured summary hardening

#### Description

Phase 016 added structured JSON summary support to `generate-context.js`, including `toolCalls` and `exchanges` fields, file-backed JSON authority preservation, and Wave 2 hardening for decision confidence, truncated titles, `git_changed_file_count` stability, and template count preservation.

#### Current Reality

The session capturing pipeline accepts richer structured JSON summaries via `--json` and `--stdin` inputs. File-backed JSON remains on the structured path and does not fall back into runtime-derived reconstruction. Wave 2 hardening ensures decision confidence, truncated outcomes, `git_changed_file_count`, and template counts are stable across different input sources.

#### Source Files

See [`16--tooling-and-scripts/16-json-mode-hybrid-enrichment.md`](16--tooling-and-scripts/16-json-mode-hybrid-enrichment.md) for full implementation and test file listings.

> **Playbook:** [153](../manual_testing_playbook/manual_testing_playbook.md)

---

### JSON-primary deprecation posture

#### Description

Phase 017 established the JSON-only save contract for `generate-context.js`. Dynamic session capture proved unreliable and has been removed. `--json` and `--stdin` are now the sole save paths.

#### Current Reality

Direct positional saves exit non-zero with migration guidance. `--json` and `--stdin` are the only save paths. The obsolete follow-up phases are archived under the retired branch for this workstream.

#### Source Files

See [`16--tooling-and-scripts/17-json-primary-deprecation-posture.md`](16--tooling-and-scripts/17-json-primary-deprecation-posture.md) for full implementation and test file listings.

> **Playbook:** [154](../manual_testing_playbook/manual_testing_playbook.md)

---

### Migration checkpoint scripts

#### Description

Before the system upgrades its database structure, these scripts take a full backup of the database file so you can roll back if something goes wrong. It is like making a photocopy of an important form before you fill it in: if you make a mistake, you can start over from the clean copy.

#### Current Reality

Two raw SQLite helpers live under `mcp_server/scripts/migrations/` for pre-migration safety outside the MCP checkpoint tables.

`create-checkpoint.ts` copies a target SQLite file into a timestamped checkpoint file, writes a JSON sidecar with schema version, size, note and memory roadmap rollout metadata and supports `--json` output for automation. `restore-checkpoint.ts` restores a checkpoint into a target database path, creates a timestamped pre-restore backup when replacing an existing file and verifies that the restored file opens as SQLite before reporting success.

These scripts are intentionally separate from the `checkpoint_create` / `checkpoint_restore` MCP tools. The MCP tools serialize logical memory state into the `checkpoints` table, while the migration helpers operate directly on database files so schema and migration experiments can be rolled back even when the logical checkpoint tables themselves are in flux.

Both scripts now expose testable helpers (`parseArgs`, `main`, `runCreateCheckpoint`, `runRestoreCheckpoint`) so behavior can be verified without spawning a separate process.

#### Source Files

See [`16--tooling-and-scripts/09-migration-checkpoint-scripts.md`](16--tooling-and-scripts/09-migration-checkpoint-scripts.md) for full implementation and test file listings.

---

### Schema compatibility validation

#### Description

This feature checks whether the database has the right structure before the system tries to use it. If required tables or columns are missing, it reports the problem clearly instead of crashing. It is like checking that a form has all the expected fields before you start filling it out, so you catch formatting problems early rather than halfway through.

#### Current Reality

`validateBackwardCompatibility()` performs a non-throwing readiness check against an already-open database connection. The helper treats `memory_index` and `schema_version` as hard requirements and validates that `memory_index` still exposes the core columns the current runtime expects (`id`, `spec_folder`, `file_path`, `importance_tier`, `context_type`, `session_id`, `created_at`, `updated_at`).

Compatibility fails only when those required tables or columns are missing. Supporting tables such as `memory_history`, `checkpoints` and `memory_conflicts` are reported as warnings instead, which makes the helper useful for rollout logging, migration probes and degraded-mode diagnostics without crashing startup or test flows.

The function is exported in both snake_case and camelCase form from `vector-index-schema.ts`, so call sites can import `validateBackwardCompatibility` while the source file preserves the existing internal naming pattern.

#### Source Files

See [`16--tooling-and-scripts/10-schema-compatibility-validation.md`](16--tooling-and-scripts/10-schema-compatibility-validation.md) for full implementation and test file listings.

---

### Watcher delete/rename cleanup

#### Description

When you delete or rename a file on your computer, the search index needs to clean up the old entry so it does not show stale results. This feature handles that cleanup automatically. Without it, you could search and find references to files that no longer exist, like a phone book that still lists people who have moved away.

#### Current Reality

The chokidar-based file watcher (`lib/ops/file-watcher.ts`) handles more than just add/change events. When a watched memory file is deleted or renamed, the watcher receives an `unlink` event and invokes the configured `removeFn` callback to purge the corresponding memory index entry, BM25 tokens and vector embedding from the database. This prevents orphaned index entries from appearing in search results after a file is moved or removed on disk.

Rename detection is handled as an unlink followed by an add, which means the memory gets a fresh index entry at the new path while the old entry is cleaned up. The 2-second debounce window collapses rapid rename sequences into a single reindex cycle.

Scenario coverage is defined in `mcp_server/tests/file-watcher.vitest.ts`, which exercises unlink cleanup, rename lifecycle handling, debounce behavior, burst rename deduplication and concurrent rename handling.

#### Source Files

See [`16--tooling-and-scripts/08-watcher-delete-rename-cleanup.md`](16--tooling-and-scripts/08-watcher-delete-rename-cleanup.md) for full implementation and test file listings.

---

### Feature catalog code references

#### Description

Feature catalog code references embed inline traceability comments in every source file, linking implementation code back to the feature catalog by name. Each file declares which catalog features it implements via `// Feature catalog: <feature-name>` comments, and every non-test TypeScript file carries a standardized `// MODULE: Name` header block. This is like labeling warehouse boxes by product name instead of aisle number — anyone can grep for a feature and find every file that implements it.

#### Current Reality

Every non-test `.ts` file under `mcp_server/`, `shared/`, and `scripts/` carries a `// MODULE: Name` header in its first 5 lines, enforced by `verify_alignment_drift.py`. Implementation files also carry one or more `// Feature catalog: <feature-name>` annotations whose names must exactly match H3 headings in this catalog. Pure utility, type-definition, and barrel-export files are exempt from feature annotations. Stale Sprint/Phase/spec-number references have been removed from all non-test comments.

#### Source Files

See [`16--tooling-and-scripts/11-feature-catalog-code-references.md`](16--tooling-and-scripts/11-feature-catalog-code-references.md) for full implementation and verification file listings.

---

### Session capturing pipeline quality

#### Description

Session capturing pipeline quality is the current reality-alignment feature for `009-perfect-session-capturing`. It covers the full shipped session-capture path for `generate-context.js`: (1) Part I hardening across session extraction, file writing, contamination filtering, alignment blocking, and config-driven limits; (2) spec-folder and git context enrichment for JSON-mode saves; (3) numeric quality-score calibration so thin saves score lower than rich ones; (4) one shared semantic sufficiency gate so aligned but under-evidenced memories fail explicitly instead of indexing; (5) one shared rendered-memory template contract so malformed ANCHOR/frontmatter output fails before write/index; (6) a fully refreshed canonical verification and manual-testing record; (7) JSON-only routine-save contract; (8) Wave 2 count/confidence hardening for decision confidence, truncated outcomes, and stable `git_changed_file_count` priority.

#### Current Reality

The shipped session-capture pipeline enforces crypto session IDs, atomic batch writes with rollback, contamination filtering, quality abort thresholds, alignment blocking, and configurable pipeline constants. Structured `--stdin` / `--json` input is the only save path; direct positional saves exit non-zero with migration guidance. A semantic sufficiency gate rejects aligned but under-evidenced saves with `INSUFFICIENT_CONTEXT_ABORT`. Rendered memory files preserve ANCHOR comments through post-render cleanup, render session-specific trigger phrases, and accept both camelCase and snake_case save contracts. The shared rendered-memory template contract validates structural output before write/index so routine saves stay structurally clean. Decision confidence, truncated outcome handling, and `git_changed_file_count` follow stable priority chains that respect explicit input values.

#### Source Files

See [`16--tooling-and-scripts/12-session-capturing-pipeline-quality.md`](16--tooling-and-scripts/12-session-capturing-pipeline-quality.md) for full implementation and verification file listings.

---

### Template compliance contract enforcement

#### Description

Template compliance contract enforcement is a 3-layer defense-in-depth system that helps spec folder documents pass structural validation on first write. It gives `@speckit` agents the exact required structure before they write, validates immediately after write, and backs that with section-depth minimums so thin documents do not slip through on headings alone.

#### Current Reality

The canonical structural contract lives in `references/validation/template_compliance_contract.md`. A compact anchor-to-H2 contract is embedded in all five CLI `@speckit` agent definitions so each runtime knows the required section order, anchors, and minimum structure before writing spec folder markdown.

After any spec folder `.md` write, the workflow runs `validate.sh --strict` against the spec folder. Exit code `2` flags concrete violations for repair, while the contract's section-count minimums provide a third safeguard against documents that are structurally valid but not substantive enough for their level.

#### Source Files

See [`16--tooling-and-scripts/18-template-compliance-contract-enforcement.md`](16--tooling-and-scripts/18-template-compliance-contract-enforcement.md) for full implementation and verification file listings.

---

## 18. GOVERNANCE

### Feature flag governance

#### Description

Feature flags let you turn new features on or off without changing the code itself, like light switches for functionality. This governance process tracks which switches exist, who controls them and when old ones should be retired so the collection does not grow out of control.

#### Current Reality

The program introduces many new scoring signals and pipeline stages. Without governance, flags accumulate until nobody knows what is enabled.

A governance framework defines operational targets (small active flag surface, explicit sunset windows and periodic audits). These are process controls, not hard runtime-enforced caps in code.

The B8 signal ceiling ("12 active scoring signals") is a governance target, not a runtime-enforced guardrail.

#### Source Files

No dedicated source files. This describes governance process controls.

See [`17--governance/01-feature-flag-governance.md`](17--governance/01-feature-flag-governance.md) for full governance details.

---

### Feature flag sunset audit

#### Description

This audit went through all 79 feature switches in the system and decided the fate of each one. Most were ready to become permanent (switch removed, feature stays on). Some were dead and got deleted. A few remain as active controls. Without this cleanup, the system would accumulate unused switches that confuse anyone trying to understand what is actually running.

#### Current Reality

A comprehensive audit at Sprint 7 exit found 79 unique `SPECKIT_` flags across the codebase. Disposition: 27 flags are ready to graduate to permanent-ON defaults (removing the flag check), 9 flags are identified as dead code for removal and 3 flags remain as active operational knobs (`ADAPTIVE_FUSION`, `COACTIVATION_STRENGTH`, `PRESSURE_POLICY`).

The current active flag-helper inventory in `search-flags.ts` is 24 exported `is*` functions (including the deprecated `isPipelineV2Enabled()` compatibility shim and the newly added `isQualityLoopEnabled()`). Sprint 0 core flags remain default ON, sprint-graduated flags from Sprints 3-6 remain default ON and deferred-feature flags (including GRAPH_SIGNALS, COMMUNITY_DETECTION, MEMORY_SUMMARIES, AUTO_ENTITIES and ENTITY_LINKING) are now default ON. `SPECKIT_ABLATION` remains default OFF as an opt-in evaluation tool.

**Phase 017 update:** The legacy V1 pipeline code was removed, leaving the 4-stage pipeline as the only supported path. `SPECKIT_PIPELINE_V2` remains part of historical audit context but is no longer consumed by runtime code.

**Sprint 8 update:** Flag graduation and dead code removal have been completed. The Sprint 8 comprehensive remediation removed a large dead-code slice including: dead feature flag branches in `hybrid-search.ts` (RSF and shadow-scoring), dead feature flag functions (`isShadowScoringEnabled`, `isRsfEnabled`), dead module-level state (`stmtCache`, `lastComputedAt`, `activeProvider`, `flushCount`, 3 dead config fields in `working-memory.ts`) and dead functions/exports (`computeCausalDepth` single-node variant, `getSubgraphWeights`, `RECOVERY_HALF_LIFE_DAYS`, `logCoActivationEvent`). `isInShadowPeriod` in learned feedback remains active as Safeguard #6. See Comprehensive remediation (Sprint 8) for the full accounting.

#### Source Files

No dedicated source files. This describes governance process controls.

See [`17--governance/02-feature-flag-sunset-audit.md`](17--governance/02-feature-flag-sunset-audit.md) for full audit details and flag disposition table.

---

### Hierarchical scope governance, governed ingest, retention, and audit

#### Description

This feature controls who can save and read memories and keeps a record of every decision it makes. When someone tries to save information, the system checks their identity and requires proof of where the information came from. It is like a secure document room where you must show your badge, sign in and explain what you are filing before you are allowed to add or retrieve anything.

#### Current Reality

Phase 5 added governed multi-scope controls across ingest and retrieval. Scope is modeled hierarchically (`tenant`, `user` or `agent` and `session`) so reads and writes are evaluated against explicit actor boundaries.

Governed ingest now requires provenance metadata (`provenanceSource`, `provenanceActor`) when scoped identity fields are provided. Ingest attempts that carry scope identifiers without required provenance are rejected instead of being accepted as ambiguous writes.

Retention policy logic is integrated with governance controls, and allow/deny outcomes are recorded for auditability. Ephemeral retention now requires `deleteAfter`, because sweeps key off `delete_after` and an unscheduled ephemeral row would never expire.

The governed save post-step is also fail-safe now: governance metadata application and governance-audit recording run in a transaction, and if that post-insert step fails the just-created memory row is deleted instead of being left behind without tenant, scope, provenance, or retention fields.

The governance audit trail captures scope decisions so policy behavior can be reviewed and verified after runtime operations.

#### Source Files

See [`17--governance/03-hierarchical-scope-governance-governed-ingest-retention-and-audit.md`](17--governance/03-hierarchical-scope-governance-governed-ingest-retention-and-audit.md) for full implementation and test file listings.

> **Playbook:** [122](../manual_testing_playbook/manual_testing_playbook.md)

---

### Shared-memory rollout, deny-by-default membership, and kill switch

#### Description

Shared memory spaces let multiple users or agents access the same pool of knowledge. The subsystem is **disabled by default** and requires explicit first-run setup via `shared_memory_enable` or `/memory:manage shared`. Access is deny-by-default: nobody gets access unless explicitly granted membership. An emergency kill switch immediately blocks everyone if something goes wrong.

#### Current Reality

Phase 6 introduced shared-memory spaces with governance-first rollout controls. The subsystem is disabled by default with two-tier enablement: env var override (`SPECKIT_MEMORY_SHARED_MEMORY=true`) or DB config persistence via `shared_memory_enable`. The `/memory:manage shared` command includes a first-run enablement gate.

Access is deny-by-default: a caller can use a shared space only when explicit membership exists for the current identity. Rollout is controlled per space and supports immediate kill-switch behavior. Even previously authorized members are blocked when the kill switch is enabled, providing a hard operational stop for incident response or controlled rollback.

Shared-memory handlers and lifecycle tools use the same membership and rollout checks so save, search and status flows enforce one consistent governance boundary. When a row belongs to an allowed shared space, retrieval now treats membership as the boundary: tenant alignment is still required, but exact actor and session matching are skipped so collaborator B can retrieve collaborator A's shared memories inside the same space.

`shared_space_upsert` also preserves rollout cohort and metadata on partial updates, so renaming a space or toggling rollout state no longer clears previously stored cohort labels or structured metadata.

#### Source Files

See [`17--governance/04-shared-memory-rollout-deny-by-default-membership-and-kill-switch.md`](17--governance/04-shared-memory-rollout-deny-by-default-membership-and-kill-switch.md) for full implementation and test file listings.

> **Playbook:** [123](../manual_testing_playbook/manual_testing_playbook.md), [148](../manual_testing_playbook/manual_testing_playbook.md)

---

## 19. FEATURE FLAG REFERENCE

Current mapping: this content is tracked under spec `006-ux-hooks-automation`.

Spec 007 standardized post-mutation automation and safety checks across mutation handlers, then closed the follow-up review gaps that remained after the initial rollout. The finalized state now includes required `confirmName` enforcement, duplicate-save no-op feedback that leaves caches untouched, atomic-save parity for `postMutationHooks` and hint payloads, token metadata recomputation before token-budget enforcement, hooks README/export alignment, and end-to-end success-envelope verification. Current verification evidence: `npx tsc -b` PASS, `npm run lint` PASS, the split UX suite passed with 7 files / 510 tests, the stdio plus embeddings suite passed with 2 files / 15 tests, the combined targeted rerun passed with 9 files / 525 tests, and the MCP SDK stdio smoke test passed with 28 tools listed.

### Shared post-mutation hook wiring

#### Description

After the system saves or changes any piece of knowledge, it runs a standard set of follow-up tasks automatically. Think of it like a checklist that runs every time you file a document: update the index, notify anyone watching and log the change. Before this feature, each type of save had its own checklist, so some steps could get missed.

#### Current Reality

Phase 014 introduced a shared post-mutation hook path across mutation handlers. The same hook automation now runs after save, update, delete and bulk-delete flows, including atomic save paths, so cache invalidation and follow-up behavior no longer drift by handler.

#### Source Files

See [`18--ux-hooks/01-shared-post-mutation-hook-wiring.md`](18--ux-hooks/01-shared-post-mutation-hook-wiring.md) for full implementation and test file listings.

---

### Memory health autoRepair metadata

#### Description

When you run a health check on the memory system and ask it to fix problems, it now tells you exactly what it tried to repair, what succeeded and what failed. Before this, you would only get a pass or fail result. Now you get a detailed report, like a car mechanic who hands you an itemized list showing which parts were replaced and which still need attention.

#### Current Reality

`memory_health` accepts optional `autoRepair` execution only in `reportMode: "full"` and returns structured repair metadata. If `autoRepair:true` is sent without `confirmed:true`, the handler returns a confirmation-only response that lists the repair actions it would attempt.

Repair metadata semantics for mixed outcomes:

- The repair action inventory is limited to the actual runtime payload values: `fts_rebuild`, `trigger_cache_refresh`, `fts_consistency_verified` when the rebuilt FTS row count matches `memory_index` and orphan-edge cleanup (`orphan_edges_cleaned:N` when deletions occur).
- `repair.repaired` is `true` only when every attempted repair action succeeds.
- `repair.partialSuccess` is `true` when at least one attempted repair succeeds and at least one fails.
- If FTS rebuild still mismatches but orphan-edge cleanup succeeds, the response reports `repair.repaired: false`, `repair.partialSuccess: true`, keeps the FTS warning and includes the orphan cleanup action in `repair.actions`.

#### Source Files

See [`18--ux-hooks/02-memory-health-autorepair-metadata.md`](18--ux-hooks/02-memory-health-autorepair-metadata.md) for full implementation and test file listings.

---

### Checkpoint delete confirmName safety

#### Description

Deleting a saved checkpoint is permanent, so this feature adds a safety step: you must type the exact name of the checkpoint you want to delete before the system will proceed. It works like those confirmation dialogs that ask you to type "DELETE" before erasing something important, preventing accidental data loss from a careless click.

#### Current Reality

Checkpoint deletion now requires a matching `confirmName` safety parameter before destructive action proceeds. The finalized follow-up pass enforced that requirement across handler, schema, tool-schema and tool-type layers so callers cannot bypass it through a looser boundary. Successful deletion responses also report the confirmation outcome through `safetyConfirmationUsed=true` plus deletion metadata.

#### Source Files

See [`18--ux-hooks/03-checkpoint-delete-confirmname-safety.md`](18--ux-hooks/03-checkpoint-delete-confirmname-safety.md) for full implementation and test file listings.

---

### Schema and type contract synchronization

#### Description

This feature makes sure every layer of the system agrees on the shape of data being passed around. When one layer expects a certain field to be required, every other layer enforces the same rule. Without this alignment, a change in one place could silently break another, like two departments using different versions of the same form.

#### Current Reality

Phase 014 aligned runtime validation and TypeScript contracts for mutation-safety behavior. The finalized state keeps `checkpoint_delete.confirmName` required across handler, schema and tool-boundary typing, and keeps the shared mutation-hook result contract synchronized for all mutation handlers.

#### Source Files

See [`18--ux-hooks/04-schema-and-type-contract-synchronization.md`](18--ux-hooks/04-schema-and-type-contract-synchronization.md) for full implementation and test file listings.

---

### Dedicated UX hook modules

#### Description

The logic for generating user-facing feedback after a save or change used to be scattered across many files. This feature moved all that feedback logic into its own dedicated modules. It is like a restaurant separating the kitchen from the serving area: the food still reaches your table, but the responsibilities are clearly divided so nothing falls through the cracks.

#### Current Reality

Phase 014 introduced dedicated UX hook modules for mutation feedback and response hints. This separated UX hook logic from individual mutation handlers and standardized post-mutation UX behavior through shared module boundaries.

#### Source Files

See [`18--ux-hooks/05-dedicated-ux-hook-modules.md`](18--ux-hooks/05-dedicated-ux-hook-modules.md) for full implementation and test file listings.

---

### Mutation hook result contract expansion

#### Description

After the system finishes its follow-up tasks on a save, it now reports how long those tasks took and whether any caches were cleared. This gives you a clearer picture of what happened behind the scenes, like a shipping notification that tells you not just "delivered" but also the delivery time and which steps were completed.

#### Current Reality

The shared mutation hook result contract was expanded to include `latencyMs` and cache-clear booleans. Callers now receive explicit timing and cache invalidation signals from post-mutation hook execution.

#### Source Files

See [`18--ux-hooks/06-mutation-hook-result-contract-expansion.md`](18--ux-hooks/06-mutation-hook-result-contract-expansion.md) for full implementation and test file listings.

---

### Mutation response UX payload exposure

#### Description

When you save a memory, the system now includes helpful follow-up information right in the response, like whether caches were refreshed or if any hints are available. Previously that information existed internally but was not shown to you. It is like a bank transaction that now prints a full receipt instead of just saying "transaction complete."

#### Current Reality

Mutation responses now expose UX payload data produced by post-mutation hooks, including `postMutationHooks` and hint strings. This makes UX guidance available directly in tool responses on successful mutation paths. The finalized follow-up pass also hardened duplicate-save no-op behavior so no false `postMutationHooks` or cache-clearing hints are emitted when caches remain unchanged.

#### Source Files

See [`18--ux-hooks/07-mutation-response-ux-payload-exposure.md`](18--ux-hooks/07-mutation-response-ux-payload-exposure.md) for full implementation and test file listings.

---

### Context-server success-path hint append

#### Description

When the system successfully retrieves context for you, it now attaches short guidance hints to the response without changing the main content. Think of it like a librarian who hands you the book you asked for along with a sticky note saying "you might also want to check chapter 5." The original content stays the same, but you get a helpful nudge.

#### Current Reality

The context-server success path now appends UX hints through `appendAutoSurfaceHints` while preserving the existing `autoSurfacedContext` payload. This adds guidance without changing the established context auto-surface contract. The finalized implementation runs that append step before token-budget enforcement and recomputes final token metadata from the completed envelope.

#### Source Files

See [`18--ux-hooks/08-context-server-success-hint-append.md`](18--ux-hooks/08-context-server-success-hint-append.md) for full implementation and test file listings.

---

### Duplicate-save no-op feedback hardening

#### Description

When you try to save something that is already stored exactly as-is, the system now tells you honestly that nothing changed instead of pretending it did work. Previously it could report misleading cache-clearing activity even when nothing happened. It is like a vending machine that returns your coin and says "already dispensed" instead of making clunking sounds and giving you nothing.

#### Current Reality

Duplicate-content save no-op responses no longer emit false `postMutationHooks`, cache-clear booleans, or misleading invalidation hints. They now explain that the save was a no-op and that caches were left unchanged, so callers receive accurate mutation feedback without pretending a hook ran.

#### Source Files

See [`18--ux-hooks/09-duplicate-save-no-op-feedback-hardening.md`](18--ux-hooks/09-duplicate-save-no-op-feedback-hardening.md) for full implementation and test file listings.

---

### Atomic-save parity and partial-indexing hints

#### Description

The system has two ways to save memories: a standard path and a faster "atomic" path. This feature made them return the same kind of feedback so you do not get different information depending on which path ran. It is like making sure both the express and regular checkout lanes at a store give you the same receipt format.

#### Current Reality

`atomicSaveMemory()` now returns the same `postMutationHooks` envelope shape and UX hint payloads as the primary save path. The finalized follow-up pass also preserved structured partial-indexing guidance so callers can handle atomic-save outcomes with the same parsing and recovery flow used for standard saves. The primary governed-save path now also deletes newly inserted rows if governance metadata application fails, preventing half-governed success states from leaking out to callers.

#### Source Files

See [`18--ux-hooks/10-atomic-save-parity-and-partial-indexing-hints.md`](18--ux-hooks/10-atomic-save-parity-and-partial-indexing-hints.md) for full implementation and test file listings.

---

### Final token metadata recomputation

#### Description

After the system adds hints and adjusts a response, it recalculates the size count to match what is actually being sent. Without this step, the reported size could be wrong because it was measured before the final changes were made. It is like weighing a package after you have finished packing it, not before you add the last item.

#### Current Reality

Phase 014 recomputes final token metadata after `appendAutoSurfaceHints(...)` mutates the envelope and before token-budget enforcement evaluates the payload. The same finalize-then-budget ordering now also applies in `memory_context`, where auto-resume `systemPromptContext` injection happens before `enforceTokenBudget()`. This keeps `meta.tokenCount` and the delivered payload aligned with the exact serialized envelope returned to callers.

#### Source Files

See [`18--ux-hooks/11-final-token-metadata-recomputation.md`](18--ux-hooks/11-final-token-metadata-recomputation.md) for full implementation and test file listings.

---

### Hooks README and export alignment

#### Description

The documentation and the published list of available hook modules had drifted out of sync with the actual code. This fix updated both so they accurately reflect what hooks exist and how to use them. It is like updating a building directory after new offices move in so visitors can actually find what is listed.

#### Current Reality

The hooks barrel and hooks README were brought back into sync with the implemented UX-hook modules. `mutation-feedback` and `response-hints` are now both exported and documented as the canonical shared hook surface, removing the rollout-era README/export drift.

#### Source Files

See [`18--ux-hooks/12-hooks-readme-and-export-alignment.md`](18--ux-hooks/12-hooks-readme-and-export-alignment.md) for full implementation and test file listings.

---

### End-to-end success-envelope verification

#### Description

This is a set of automated tests that checks the entire response from start to finish: hints are included, previously surfaced context is preserved and the size count is correct. It acts as a final quality check before a response leaves the system, like a shipping inspector who opens the box, verifies everything is inside and confirms the label is accurate before it goes out the door.

#### Current Reality

Phase 014 verification includes end-to-end success-envelope assertions in `tests/context-server.vitest.ts`. This coverage verifies the finalized success-path hint append flow, preserved `autoSurfacedContext` and final token metadata behavior together so response-envelope regressions fail fast.

#### Source Files

See [`18--ux-hooks/13-end-to-end-success-envelope-verification.md`](18--ux-hooks/13-end-to-end-success-envelope-verification.md) for full implementation and test file listings.

---

### Empty result recovery

#### Description

Empty result recovery generates structured recovery payloads when search returns no results, low-confidence results, or only partial matches, providing the calling agent with actionable next steps.

#### Current Reality

Enabled by default (graduated). Set `SPECKIT_EMPTY_RESULT_RECOVERY_V1=false` to disable. The recovery payload module classifies search outcomes into three statuses: no_results (zero results), low_confidence (average confidence below 0.4), and partial (fewer than 3 results). For each status, the module identifies a root cause reason (spec_filter_too_narrow, low_signal_query, knowledge_gap) and recommended actions (retry_broader, switch_mode, save_memory, ask_user).

#### Source Files

See [`18--ux-hooks/18-empty-result-recovery.md`](18--ux-hooks/18-empty-result-recovery.md) for full implementation and test file listings.

---

### Result confidence scoring

#### Description

Result confidence scoring combines margin, multi-channel agreement, reranker support, and anchor density into a single calibrated confidence score per search result, using heuristic scoring with no LLM calls in the hot path.

#### Current Reality

Enabled by default (graduated). Set `SPECKIT_RESULT_CONFIDENCE_V1=false` to disable. The confidence scoring module computes a weighted composite score from four factors: margin (0.35), channel agreement (0.30), reranker support (0.20), and anchor density (0.15). The composite score maps to labels via HIGH_THRESHOLD = 0.7 and LOW_THRESHOLD = 0.4. Confidence drivers are reported per result for explainability.

#### Source Files

See [`18--ux-hooks/19-result-confidence.md`](18--ux-hooks/19-result-confidence.md) for full implementation and test file listings.

---

### Two-tier result explainability

#### Description

Two-tier result explainability attaches natural-language "why" explanations to each search result composed from Stage 2 scoring signals, with a slim tier (summary + topSignals) and an optional debug tier (channelContribution map).

#### Current Reality

The explainability module detects 10+ signal types including semantic/lexical match, graph/session/causal/community boosts, reranker support, feedback, validation quality, and anchor labels. The slim tier (summary + topSignals) is always present when ON. The debug tier adds per-channel score breakdown (vector, fts, graph). Default ON, set `SPECKIT_RESULT_EXPLAIN_V1=false` to disable.

#### Source Files

See [`18--ux-hooks/14-result-explainability.md`](18--ux-hooks/14-result-explainability.md) for full implementation and test file listings.

---

### Mode-aware response profiles

#### Description

Mode-aware response profiles route search and context results through one of four named presentation profiles (quick, research, resume, debug), each optimizing for a different consumer.

#### Current Reality

Four profiles are implemented: quick (topResult + oneLineWhy + omittedCount + tokenReduction), research (results + evidenceDigest + followUps), resume (state + nextSteps + blockers), and debug (full trace + tokenStats). Backward compatible: when the flag is OFF or profile is omitted, the original response is unchanged. Default ON, set `SPECKIT_RESPONSE_PROFILE_V1=false` to disable. Runtime wiring is active on both `memory_search` and `memory_context`, with explicit profile selection and intent-to-profile auto-routing when a profile is not provided.

#### Source Files

See [`18--ux-hooks/15-mode-aware-response-profiles.md`](18--ux-hooks/15-mode-aware-response-profiles.md) for full implementation and test file listings.

---

### Progressive disclosure with cursor pagination

#### Description

Progressive disclosure replaces hard tail-truncation with a multi-layer response consisting of a summary layer, snippet extraction, and continuation cursors for paginated retrieval.

#### Current Reality

Enabled by default (graduated). Set `SPECKIT_PROGRESSIVE_DISCLOSURE_V1=false` to disable. The progressive disclosure module provides four layers: summary layer (confidence distribution digest), snippet extraction (100-char previews), continuation cursors (base64 tokens, 5-min TTL), and progressive response builder. Default page size is 5. Cursor encoding uses JSON-in-base64 with strict field validation. The cursor store is process-local.

#### Source Files

See [`18--ux-hooks/16-progressive-disclosure.md`](18--ux-hooks/16-progressive-disclosure.md) for full implementation and test file listings.

---

### Retrieval session state

#### Description

Retrieval session state tracks per-session context enabling cross-turn deduplication, goal-aware refinement, and stateful question and anchor tracking, all in-memory with TTL-based cleanup.

#### Current Reality

Enabled by default (graduated). Set `SPECKIT_SESSION_RETRIEVAL_STATE_V1=false` to disable. The session state module provides cross-turn deduplication (seen results receive 0.3x score multiplier), goal-aware refinement (up to 1.2x boost for goal-aligned results), and stateful tracking of open questions, preferred anchors, and seen result IDs. Storage is in-memory only (ephemeral). Sessions expire after 30 minutes of inactivity. LRU eviction at 100 concurrent sessions.

#### Source Files

See [`18--ux-hooks/17-retrieval-session-state.md`](18--ux-hooks/17-retrieval-session-state.md) for full implementation and test file listings.

---

## 20. REMEDIATION REVALIDATION

### Phase detection and scoring (recommend-level.sh --recommend-phases)

#### Description

The four scoring dimensions evaluate distinct aspects of specification complexity. Each dimension contributes a weighted score to the composite result. High scores on multiple dimensions produce a strong phase recommendation, while specs that score low across all dimensions receive a recommendation against phasing. The `--json` flag outputs the full scoring breakdown as structured JSON for programmatic consumption.

#### Current Reality

The phase recommendation system uses a 4-dimension scoring algorithm to evaluate whether a specification benefits from decomposition into sequential phases. When invoked with `--recommend-phases`, `recommend-level.sh` analyzes the spec folder context and produces three outputs: `recommended_phases` (boolean indicating whether phase decomposition is advisable), `phase_score` (a composite numeric score reflecting the degree of benefit from phasing), and `suggested_phase_count` (the recommended number of child phases).

#### Source Files

Shell script: `.opencode/skill/system-spec-kit/scripts/spec/recommend-level.sh`

---

### Phase folder creation (create.sh --phase)

#### Description

The `--phases <N>` option controls how many child phase folders are generated (default is determined by the phase scoring algorithm if `recommend-level.sh` was run first). The `--phase-names` option accepts a comma-separated list of descriptive names for each phase, which are used in both folder naming and the Phase Documentation Map entries. When `--phase-names` is omitted, child folders receive sequential numeric names. The parent folder receives the standard spec kit template files at the specified level, while each child phase folder receives its own independent set of template files.

#### Current Reality

The `--phase` flag on `create.sh` switches from single-folder creation to a parent-children phase structure. The parent spec folder is created with a Phase Documentation Map in its `spec.md` that links to all child phase folders. Each child phase folder is created with back-references to the parent and, where applicable, predecessor and successor links to adjacent phases.

#### Source Files

Shell script: `.opencode/skill/system-spec-kit/scripts/spec/create.sh`

---

### Recursive phase validation (validate.sh --recursive)

#### Description

The aggregated output includes a combined exit code (the highest severity exit code across all children), per-phase pass/fail status and a JSON `phases` array containing the validation result for each child folder. Exit code 0 indicates all phases passed, exit code 1 indicates warnings in one or more phases and exit code 2 indicates errors that must be fixed. This enables CI pipelines and automated workflows to validate an entire phase tree with a single command invocation.

#### Current Reality

When `validate.sh` is invoked with `--recursive` on a parent phase folder, it discovers all child phase folders matching the `[0-9][0-9][0-9]-*/` naming pattern beneath the parent directory. Each child folder is validated independently using the same validation rules that apply to standalone spec folders. After individual validation completes, the results are aggregated into a combined report.

#### Source Files

Shell script: `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`

---

### Phase link validation (check-phase-links.sh)

#### Description

All link validation issues are reported at warn severity rather than error severity, reflecting that missing links are a documentation gap rather than a structural failure. The script exits with code 0 when all links are valid and code 1 when any link check produces a warning.

#### Current Reality

`check-phase-links.sh` validates the structural integrity of phase folder relationships by checking four types of inter-phase links. First, it validates the Phase Documentation Map in the parent `spec.md`, confirming that every listed child phase folder actually exists on disk. Second, it validates parent back-references in each child phase folder, confirming the parent folder path is correct and reachable. Third, it validates predecessor links, confirming that each phase (except the first) correctly references the phase that precedes it. Fourth, it validates successor links, confirming that each phase (except the last) correctly references the phase that follows it.

#### Source Files

Shell script: `.opencode/skill/system-spec-kit/scripts/rules/check-phase-links.sh`

---

## 21. IMPLEMENT AND REMOVE DEPRECATED FEATURES

The tables below catalogue the documented environment-variable surface that is still read by code or intentionally retained as a live compatibility shim. The "Default" column reflects the value in effect when the variable is absent from the environment.

For SPECKIT_* flags that use `isFeatureEnabled()`: the function returns `true` when the variable is absent, empty or set to `'true'`. It returns `false` when explicitly set to `'false'` or `'0'`. This means almost all graduated search-pipeline features are **ON by default** and require an explicit opt-out.

The `SPECKIT_ROLLOUT_PERCENT` flag applies a global percentage gate on top of any individual flag check. At 100 (the default), checks pass normally. At 0, checks fail. Between 1-99, inclusion uses deterministic identity hashing and calls without identity fail closed. Malformed rollout values fall back to 100.

### 1. Search Pipeline Features (SPECKIT_*)

#### Description

These flags are the main control panel for how search works. They turn major retrieval behaviors on or off, like fallback logic, reranking, telemetry, and rollout gates, so you can tune quality, speed, and safety without changing code.

#### Current Reality

| Name | Default | Type | Source File | Description |
|---|---|---|---|---|
| `SPECKIT_ABLATION` | `false` | boolean | `lib/eval/ablation-framework.ts` | Activates the ablation study framework. Must be explicitly set to `'true'` to run controlled channel ablations via MCP; when `false`, the handler rejects `eval_run_ablation` calls with a disabled-flag error. |
| `SPECKIT_ARCHIVAL` | `true` | boolean | `lib/cognitive/archival-manager.ts` | Enables the archival manager which promotes DORMANT memories to the ARCHIVED state based on access patterns. Disable to keep all memories in active tiers. |
| `SPECKIT_ASSISTIVE_RECONSOLIDATION` | `true` | boolean | `handlers/save/reconsolidation-bridge.ts` | **Default ON (graduated).** Three-tier assistive reconsolidation. Classifies memory pairs by cosine similarity: shadow-archive (>=0.96; the internal `auto_merge` tier archives the older record), review (>=0.88), or keep-separate (<0.88). Review-tier pairs receive a logged recommendation (supersede or complement) but no destructive action (updated 2026-03-25 per deep review). |
| `SPECKIT_AUTO_ENTITIES` | `true` | boolean | `lib/search/search-flags.ts` | Enables R10 automatic noun-phrase entity extraction at index time. Extracted entities feed the entity linking channel (S5). Requires `SPECKIT_ENTITY_LINKING` to create graph edges. |
| `SPECKIT_AUTO_RESUME` | `true` | boolean | `handlers/memory-context.ts` | In resume mode, automatically injects working-memory context items as `systemPromptContext` into the response. Also subject to `SPECKIT_ROLLOUT_PERCENT`. |
| `SPECKIT_BATCH_LEARNED_FEEDBACK` | `true` | boolean | `lib/feedback/batch-learning.ts` | **Default ON (graduated).** Weekly batch feedback learning pipeline. Aggregates implicit feedback events, computes confidence-weighted signal scores (strong=1.0, medium=0.5, weak=0.1), enforces min-support (3 sessions) and boost-cap (0.10) guards. Shadow-only: records would-have-been shadow rank deltas. |
| `SPECKIT_CALIBRATED_OVERLAP_BONUS` | `true` | boolean | `shared/algorithms/rrf-fusion.ts` | **Default ON (graduated).** Calibrated overlap bonus replaces the flat convergence bonus (+0.10) with query-aware scaling: `beta * overlapRatio * meanTopNormScore`, beta=0.15, capped at 0.06. Falls back to flat CONVERGENCE_BONUS (0.10) when OFF. |
| `SPECKIT_CAUSAL_BOOST` | `true` | boolean | `lib/search/causal-boost.ts` | Enables causal-neighbor graph boosting. Top seed results (up to 25% of result set, capped at 5) walk the causal edge graph up to 2 hops, applying a per-hop boost capped at 0.05. Combined causal + session boost ceiling is 0.20. |
| `SPECKIT_CHANNEL_MIN_REP` | `true` | boolean | `lib/search/channel-representation.ts` | Sprint 3 Stage C: ensures every contributing search channel has at least one result in the top-k window. Results with a score below 0.005 are excluded from promotion regardless. |
| `SPECKIT_CLASSIFICATION_DECAY` | `true` | boolean | `lib/scoring/composite-scoring.ts` | Applies intent-classification-based decay scoring to composite scores. When disabled, classification signals do not reduce scores for mismatched intent types. |
| `SPECKIT_COACTIVATION` | `true` | boolean | `lib/cognitive/co-activation.ts` | Enables co-activation spreading in the hybrid search path and trigger-matcher cognitive pipeline. Top-5 results spread activation through the co-occurrence graph; related memories receive a boost scaled by `SPECKIT_COACTIVATION_STRENGTH`. |
| `SPECKIT_COACTIVATION_STRENGTH` | `0.25` | number | `lib/cognitive/co-activation.ts` | Configures the raw boost multiplier applied to co-activated memories in hot-path Stage 2 spreading. A separate fan-divisor helper exists in the co-activation module, but Stage 2 currently applies spread scores directly. |
| `SPECKIT_COGNITIVE_COACTIVATION_FLAGS` | `'i'` | string | `configs/cognitive.ts` | Regex flags for the cognitive co-activation pattern matcher. Must match `/^[dgimsuvy]*$/`. Invalid flags cause a startup validation error. |
| `SPECKIT_COGNITIVE_COACTIVATION_PATTERN` | `'\\b(memory\|context\|decision\|implementation\|bug)\\b'` | string | `configs/cognitive.ts` | Regex pattern used by the cognitive pipeline to detect co-activation-relevant content. Backreferences and nested quantifier groups are rejected for safety. Maximum length 256 characters. |
| `SPECKIT_COMMUNITY_DETECTION` | `true` | boolean | `lib/search/search-flags.ts` | Enables N2c BFS connected-component detection with Louvain escalation for large graphs. Injects community co-members alongside Stage 2 fusion results. |
| `SPECKIT_COMPLEXITY_ROUTER` | `true` | boolean | `lib/search/query-classifier.ts` | Sprint 3 Stage A: routes queries to channel subsets based on complexity tier. Simple queries use vector + FTS only; moderate adds BM25; complex uses all five channels. When disabled, all channels run for every query. |
| `SPECKIT_CONFIDENCE_TRUNCATION` | `true` | boolean | `lib/search/confidence-truncation.ts` | Sprint 3 Stage D: trims the low-confidence tail from fused results. A consecutive score gap exceeding 2× the median gap triggers truncation. Always returns at least 3 results. |
| `SPECKIT_CONSOLIDATION` | `true` | boolean | `lib/search/search-flags.ts` | Enables the N3-lite consolidation engine which runs after every successful save. Scans for contradictions (>0.85 cosine similarity with negation conflicts), applies Hebbian strengthening (+0.05/cycle, 30-day decay), detects stale edges (>90 days unfetched) and enforces 20 edges per node. Runs weekly. |
| `SPECKIT_CONSUMPTION_LOG` | `true` | boolean | `lib/telemetry/consumption-logger.ts` | **Default ON (graduated via rollout policy).** Agent consumption instrumentation remains live. `isConsumptionLogEnabled()` delegates to `isFeatureEnabled('SPECKIT_CONSUMPTION_LOG')`, so the logger stays active unless explicitly disabled or rollout policy gates it off. Logging stays fail-safe (updated 2026-03-25 per deep review). |
| `SPECKIT_CONTEXT_HEADERS` | `true` | boolean | `lib/search/hybrid-search.ts` | **IMPLEMENTED (Sprint 019).** P1-4: Contextual tree injection into returned chunks. When enabled, `injectContextualTree()` string-prepends hierarchical context headers (`[parent > child — description]`, max 100 chars) using PI-B3 cached spec folder descriptions. Token budget adjusted for calibrated header overhead (~26 tokens/result) before truncation (CHK-060). |
| `SPECKIT_CROSS_ENCODER` | `true` | boolean | `lib/search/search-flags.ts` | Enables cross-encoder reranking in Stage 3 of the 4-stage pipeline. When enabled, the reranker rescores candidates using a more expensive cross-attention model. Disabling falls back to vector-only ranking from fusion. |
| `SPECKIT_DASHBOARD_LIMIT` | `10000` | number | `lib/eval/reporting-dashboard.ts` | Maximum number of rows fetched for the reporting dashboard. Parsed as integer with NaN guard (`|| 10000`). Replaces a previously hardcoded limit of 1000. Added in Phase 018 (CR-P2-3). |
| `SPECKIT_DEBUG_INDEX_SCAN` | `false` | boolean | `handlers/memory-index.ts` | When `'true'`, emits additional file-count diagnostics during `memory_index_scan` runs. Off by default; intended for debugging index coverage issues. Must be explicitly set to `'true'`. |
| `SPECKIT_DEGREE_BOOST` | `true` | boolean | `lib/search/search-flags.ts` | Enables the degree-search channel in hybrid search. Re-ranks results by hub score via `computeDegreeScores()` with logarithmic normalization and a hard cap of 50. Base channel weight is 0.4. |
| `SPECKIT_DOCSCORE_AGGREGATION` | `true` | boolean | `lib/search/search-flags.ts` | Enables R1 MPAB (Multi-Parent Aggregated Bonus) chunk-to-memory score aggregation. Collapses chunk-level results back to parent memory documents using `sMax + 0.3 * sum(remaining) / sqrt(N)` to prevent multi-chunk dominance. |
| `SPECKIT_DYNAMIC_INIT` | `true` | boolean | `context-server.ts` | **IMPLEMENTED (Sprint 019).** P1-6: Dynamic server instructions at MCP initialization. `buildServerInstructions()` generates a memory-system overview (total memories, spec folder count, channels, stale count) and injects via `server.setInstructions()`. Instructions are computed once at startup and not refreshed during session (CHK-076). Reuses existing `memory_stats` handler data. |
| `SPECKIT_DYNAMIC_TOKEN_BUDGET` | `true` | boolean | `lib/search/dynamic-token-budget.ts` | Sprint 3 Stage E: computes a tier-aware token limit (simple 1,500 / moderate 2,500 / complex 4,000 tokens). Advisory only; callers are responsible for respecting the budget. When disabled, defaults to 4,000 tokens for all queries. |
| `SPECKIT_EAGER_WARMUP` | inert | boolean | `shared/embeddings.ts` | Deprecated inert alias for the removed eager-warmup toggle. The embedding provider always initializes lazily now, so setting this flag does not restore startup warmup. |
| `SPECKIT_EMBEDDING_EXPANSION` | `true` | boolean | `lib/search/search-flags.ts` | R12 query expansion for embedding-based retrieval. Generates an expanded query variant and runs it in parallel with the baseline. Suppressed when the complexity classifier marks a query as `'simple'` (mutual exclusion with R15). |
| `SPECKIT_EMPTY_RESULT_RECOVERY_V1` | `true` | boolean | `lib/search/recovery-payload.ts` | **Default ON (graduated).** Structured recovery payloads for empty/weak search results. Classifies outcome (no_results/low_confidence/partial), diagnoses cause, suggests alternative queries, recommends action. |
| `SPECKIT_ENCODING_INTENT` | `true` | boolean | `lib/search/search-flags.ts` | R16 encoding-intent capture at index time. Classifies content as `document`, `code` or `structured_data` using heuristic scoring above a 0.4 threshold. Stored as read-only metadata on the `encoding_intent` column. No retrieval-time scoring impact yet; builds a labeled dataset. |
| `SPECKIT_ENTITY_LINKING` | `true` | boolean | `lib/search/search-flags.ts` | S5 cross-document entity linking. Creates causal edges between memories sharing entities across spec folders. Depends on a populated `entity_catalog` (typically produced by R10 auto-entities). Controlled by the global density guard (`SPECKIT_ENTITY_LINKING_MAX_DENSITY`). |
| `SPECKIT_ENTITY_LINKING_MAX_DENSITY` | `1.0` | number | `lib/search/entity-linker.ts` | S5 global density guard threshold. Entity linking performs a current-global-density precheck (`total_edges / total_memories`) and a projected post-insert global density check before creating links. If either check exceeds this value, link creation is skipped. Default 1.0 is permissive, but the guard can still trigger when total edges exceed total memories. |
| `SPECKIT_EVAL_LOGGING` | `false` | boolean | `lib/eval/eval-logger.ts` | Enables eval logging that writes retrieval events to the eval database. Must be explicitly set to `'true'`. Used during ablation and ground-truth evaluation runs. |
| `SPECKIT_EVENT_DECAY` | `true` | boolean | `lib/cognitive/working-memory.ts` | Enables FSRS-based attention decay in the working memory system. Scores decay each turn via exponential degradation. When disabled, attention scores do not degrade over the session. |
| `SPECKIT_EXTENDED_TELEMETRY` | `false` | boolean | `lib/telemetry/retrieval-telemetry.ts` | Opt-in extended retrieval telemetry. When `'true'`, the runtime records latency, mode, fallback, quality, trace-payload validation, and the default memory roadmap architecture snapshot; when unset or `'false'`, the telemetry shell still exists but detailed metrics remain zero/empty. |
| `SPECKIT_EXTRACTION` | `true` | boolean | `lib/extraction/extraction-adapter.ts` | Gates the extraction adapter which parses entities and structured data from memory files. Uses `isFeatureEnabled()` with session identity for rollout-based gating. |
| `SPECKIT_FILE_WATCHER` | `false` | boolean | `lib/ops/file-watcher.ts` | **IMPLEMENTED (Sprint 019).** P1-7: Real-time filesystem watching with chokidar. Push-based indexing of spec directories with 2s debounce, TM-02 SHA-256 content-hash deduplication, exponential backoff for `SQLITE_BUSY` (1s/2s/4s, 3 attempts). Exports `getWatcherMetrics()` with reindex counters and timing (CHK-087). |
| `SPECKIT_FOLDER_DISCOVERY` | `true` | boolean | `lib/search/search-flags.ts` | PI-B3: automatic spec folder discovery. Matches the query against cached one-sentence folder descriptions to identify the most relevant spec folder without triggering full-corpus search. Discovery failure is non-fatal. |
| `SPECKIT_FOLDER_SCORING` | `true` | boolean | `lib/search/folder-relevance.ts` | Sprint 1 two-phase folder-relevance scoring. When enabled, re-ranks results by spec folder relevance using a two-phase retrieval strategy. Disabled by setting to `'false'`. |
| `SPECKIT_FOLDER_TOP_K` | `5` | number | `lib/search/hybrid-search.ts` | Number of top folders used in two-phase folder retrieval when `SPECKIT_FOLDER_SCORING` is active. Parsed as integer; invalid or missing values fall back to 5. |
| `SPECKIT_GRAPH_CALIBRATION_PROFILE` | `true` | boolean | `lib/search/graph-calibration.ts` | **Default ON (graduated).** Graph calibration profiles and community thresholds. Enables calibration profile enforcement (graphWeightCap=0.05, communityScoreCap=0.03), Louvain activation gates (minDensity=0.3, minSize=10), and ablation harness with MRR/NDCG metrics. Two presets: default (conservative) and aggressive (tighter caps). |
| `SPECKIT_GRAPH_CONCEPT_ROUTING` | `true` | boolean | `lib/search/entity-linker.ts` | **Default ON (graduated).** Query-time concept alias matching. Extracts noun phrases and matches against the concept alias table, activating the graph channel for matched concepts. |
| `SPECKIT_GRAPH_REFRESH_MODE` | `write_local` | enum (`off`, `write_local`, `scheduled`) | `lib/search/graph-lifecycle.ts` | **Default `write_local` (graduated).** Graph lifecycle refresh mode. `off` disables graph refresh. `write_local` runs synchronous local recompute for small dirty components (<=50 nodes). `scheduled` queues background global refresh for larger components. Dirty-node tracking persists across onWrite() calls within the process. |
| `SPECKIT_GRAPH_SIGNALS` | `true` | boolean | `lib/search/search-flags.ts` | Enables N2a graph momentum scoring and N2b causal depth signals. Applied during Stage 2 fusion as additional scoring inputs from the causal graph structure. |
| `SPECKIT_GRAPH_UNIFIED` | `true` | boolean | `lib/search/graph-flags.ts` | Unified graph channel gate. Legacy compatibility shim that controls whether the graph search channel participates in hybrid retrieval. Disabled with explicit `'false'`. |
| `SPECKIT_GRAPH_WALK_ROLLOUT` | inherited from `SPECKIT_GRAPH_SIGNALS` | enum (`off`, `trace_only`, `bounded_runtime`) | `lib/search/search-flags.ts` | Controls the bounded graph-walk ladder. `off` disables the walk bonus, `trace_only` keeps rollout state and diagnostics visible with zero applied bonus, and `bounded_runtime` applies the capped Stage 2 graph-walk bonus while preserving deterministic ordering protections. |
| `SPECKIT_MEMORY_ROADMAP_PHASE` / `SPECKIT_HYDRA_PHASE` | `shared-rollout` | string | `lib/config/capability-flags.ts` | Canonical / legacy alias pair for the memory-roadmap phase label. Code resolves `SPECKIT_MEMORY_ROADMAP_PHASE` first, then falls back to `SPECKIT_HYDRA_PHASE`. Supported values are `baseline`, `lineage`, `graph`, `adaptive`, `scope-governance`, and `shared-rollout`; unknown values fall back to `shared-rollout`. |
| `SPECKIT_HYDRA_LINEAGE_STATE` | `true` | boolean | `lib/config/capability-flags.ts` | Legacy compatibility alias for the lineage roadmap flag. It remains default-on for roadmap metadata snapshots and rename-window lineage compatibility paths; set it to `false` or `0` to opt out explicitly. |
| `SPECKIT_HYDRA_GRAPH_UNIFIED` | `true` | boolean | `lib/config/capability-flags.ts` | Legacy compatibility alias for the unified-graph roadmap flag. It remains intentionally separate from the runtime `SPECKIT_GRAPH_UNIFIED` retrieval gate so roadmap metadata cannot misreport live graph-channel defaults; set it to `false` or `0` to opt out explicitly. |
| `SPECKIT_HYDRA_ADAPTIVE_RANKING` | `false` | boolean | `lib/config/capability-flags.ts` | Legacy compatibility alias for the adaptive-ranking roadmap flag. Phase 4 adaptive ranking remains dormant in production, so roadmap metadata defaults this flag to off unless explicitly enabled with `true` or `1`. Used by roadmap metadata snapshots and adaptive shadow-ranking compatibility paths. |
| `SPECKIT_HYDRA_SCOPE_ENFORCEMENT` | `false` | boolean | `lib/config/capability-flags.ts` | Legacy compatibility alias for the scope-enforcement roadmap flag. It remains default-on for roadmap metadata and governed-scope compatibility paths; set it to `false` or `0` to opt out explicitly. |
| `SPECKIT_HYDRA_GOVERNANCE_GUARDRAILS` | `false` | boolean | `lib/config/capability-flags.ts` | Legacy compatibility alias for the governance-guardrail roadmap flag. It remains default-on for roadmap metadata and governed-ingest compatibility paths; set it to `false` or `0` to opt out explicitly. |
| `SPECKIT_HYDRA_SHARED_MEMORY` | `false` | boolean | `lib/config/capability-flags.ts` | Legacy compatibility alias for the shared-memory roadmap flag. Roadmap metadata now defaults this flag to off unless explicitly enabled with `true` or `1`, matching the live shared-spaces runtime gate. This keeps snapshots and telemetry from claiming shared memory is live before rollout enables it. |
| `SPECKIT_HYBRID_DECAY_POLICY` | `true` | boolean | `lib/cognitive/fsrs-scheduler.ts` | **Default ON (graduated).** Type-aware no-decay FSRS policy. Decision/constitutional/critical context types receive Infinity stability (never decay). Separate from TM-03. |
| `SPECKIT_HYDE` | `true` | boolean | `lib/search/hyde.ts` | **Default ON (graduated).** HyDE (Hypothetical Document Embeddings). Generates a pseudo-document (~200 tokens, markdown-memory format) for deep low-confidence queries (top score < 0.45), embeds it, and uses the embedding as an additional retrieval channel. HyDE is active in the query pipeline by default and merges results into the candidate set unless `SPECKIT_HYDE_ACTIVE=false` forces shadow-only logging. Budget: 1 LLM call per cache miss. |
| `SPECKIT_IMPLICIT_FEEDBACK_LOG` | `true` | boolean | `lib/feedback/feedback-ledger.ts` | **Default ON (graduated).** Shadow-only implicit feedback event ledger. Records 5 event types with confidence tiers (strong/medium/weak). No ranking side effects. |
| `SPECKIT_INDEX_SPEC_DOCS` | `true` | boolean | `handlers/memory-index-discovery.ts` | Controls whether `memory_index_scan` indexes spec folder documents (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, `research/research.md`, `handover.md`). Set to `'false'` to skip spec docs. |
| `SPECKIT_INTERFERENCE_SCORE` | `true` | boolean | `lib/scoring/interference-scoring.ts` | Enables interference-based penalty scoring in composite scoring. When disabled (set to `'false'`), the interference computation is bypassed and the raw score passes through unchanged. |
| `SPECKIT_LAZY_LOADING` | inert | boolean | `shared/embeddings.ts` | Deprecated inert alias for the removed eager-warmup toggle. Lazy provider initialization is now the permanent default, and both `SPECKIT_LAZY_LOADING` and `SPECKIT_EAGER_WARMUP` are documented compatibility no-ops. |
| `SPECKIT_LEARN_FROM_SELECTION` | `true` | boolean | `lib/search/learned-feedback.ts` | **Default ON (graduated).** Set to `'false'` to disable R11 learned relevance feedback. Records user result selections into `learned_triggers`, and applies boosts after a 1-week shadow period where terms are logged but not applied. |
| `SPECKIT_LEARNED_STAGE2_COMBINER` | `true` | boolean | `shared/ranking/learned-combiner.ts` | **Default ON (graduated, shadow-only).** Learned Stage 2 weight combiner. Regularized linear ranker (Ridge Regression, lambda=0.1) that learns combination weights from 8 Stage 2 features (rrf, overlap, graph, session, causal, feedback, validation, artifact). Includes LOOCV, SHAP feature importance, and model persistence. Scores computed but NOT used for ranking. |
| `SPECKIT_LLM_GRAPH_BACKFILL` | `true` | boolean | `lib/search/graph-lifecycle.ts` | **Default ON (graduated).** Async LLM graph backfill for high-value documents. After deterministic extraction completes, schedules an asynchronous LLM-based enrichment pass to add probabilistic edges. No-op when `SPECKIT_GRAPH_REFRESH_MODE` is `off`. |
| `SPECKIT_LLM_REFORMULATION` | `true` | boolean | `lib/search/llm-reformulation.ts` | **Default ON (graduated).** LLM corpus-grounded query reformulation. Deep-mode only. Step-back abstraction combined with corpus seed grounding (3 FTS5/BM25 seeds, no embedding call). Produces up to 2 query variants. Budget: 1 LLM call per reformulation (8s timeout). Cached via shared LLM cache (1h TTL). |
| `SPECKIT_MEMORY_SUMMARIES` | `true` | boolean | `lib/search/search-flags.ts` | R8 TF-IDF extractive summary generation. At index time, generates a top-3-sentence extractive summary for each memory and joins those sentences into summary text. Summaries serve as a lightweight search channel for fallback matching. |
| `SPECKIT_MMR` | `true` | boolean | `lib/search/search-flags.ts` | Enables Maximal Marginal Relevance reranking after fusion to promote result diversity. Uses intent-specific lambda values from `INTENT_LAMBDA_MAP` (default 0.7). Requires embeddings to be loaded from `vec_memories` for top-N candidates. |
| `SPECKIT_MULTI_QUERY` | `true` | boolean | `lib/search/search-flags.ts` | Enables multi-query expansion for deep-mode retrieval. The query is expanded into up to 3 variants via `expandQuery()`, each variant runs hybrid search in parallel, and results merge with deduplication. |
| `SPECKIT_NEGATIVE_FEEDBACK` | `true` | boolean | `lib/search/search-flags.ts` | T002b/A4 negative-feedback confidence demotion. Applies a confidence multiplier (starts at 1.0, decreases 0.1 per negative validation, floors at 0.3) with 30-day half-life recovery. |
| `SPECKIT_NOVELTY_BOOST` | inert | boolean | `lib/scoring/composite-scoring.ts` | **Inert.** N4 cold-start novelty boost was evaluated and removed. The env var is read in tests only; the production function always returns 0. |
| `SPECKIT_PRE_SAVE_DEDUP` | `true` | boolean | `scripts/core/workflow.ts` | Script-side save-pipeline flag. Default ON unless explicitly set to `'false'` or `'0'`. Runs an advisory exact-match SHA1 overlap check against the 20 most recent sibling memories before write; duplicate matches log a warning but do not block the save. |
| `SPECKIT_PRESSURE_POLICY` | `true` | boolean | `handlers/memory-context.ts` | Enables context-pressure-based mode downgrading in `memory_context`. Above 0.60 token usage ratio, switches to focused mode. Above 0.80, switches to quick mode. Also subject to `SPECKIT_ROLLOUT_PERCENT`. |
| `SPECKIT_PROGRESSIVE_DISCLOSURE_V1` | `true` | boolean | `lib/search/progressive-disclosure.ts` | **Default ON (graduated).** Progressive disclosure companion payload for search results. Preserves full `data.results` and adds `data.progressiveDisclosure` with summary layer (confidence distribution digest), snippet extraction (100-char previews), and cursor pagination. Continuation pages resolve through `memory_search({ cursor })`. |
| `SPECKIT_QUALITY_LOOP` | `false` | boolean | `lib/search/search-flags.ts` | **Default OFF.** Enables the verify-fix-verify loop for `memory_save`. When enabled, low-quality saves get an initial evaluation plus up to 2 immediate auto-fix retries by default; rejected saves return `status: 'rejected'`, and atomic save rolls the file back instead of retrying indexing again. |
| `SPECKIT_QUERY_DECOMPOSITION` | `true` | boolean | `lib/search/query-decomposer.ts` | **Default ON (graduated).** Bounded facet detection decomposes multi-faceted queries into max 3 sub-queries using rule-based heuristics (no LLM). Deep-mode only. |
| `SPECKIT_QUERY_SURROGATES` | `true` | boolean | `lib/search/query-surrogates.ts` | **Default ON (graduated).** Index-time query surrogates. Generates surrogate metadata at index time: aliases (parenthetical abbreviations, synonyms), headings, extractive summaries (200-char max), and 2-5 heuristic questions. Matched at query time via token overlap (min threshold 0.15) — no LLM calls on default path. |
| `SPECKIT_RECONSOLIDATION` | `false` | boolean | `lib/search/search-flags.ts` | TM-06 reconsolidation-on-save. Opt-in only: set `SPECKIT_RECONSOLIDATION=true` to enable merge/supersede behavior after embedding generation. Requires a checkpoint to exist for the spec folder. |
| `SPECKIT_RELATIONS` | `true` | boolean | `lib/learning/corrections.ts` | Enables relational learning corrections that track and apply inter-memory relationship signals during the learning pipeline. Disabled with explicit `'false'`. |
| `SPECKIT_RESPONSE_PROFILE_V1` | `true` | boolean | `lib/response/profile-formatters.ts` | **Default ON (graduated).** Mode-aware response profiles. Routes results through one of four profiles: quick (topResult + oneLineWhy + omittedCount + tokenReduction), research (results + evidenceDigest + followUps), resume (state + nextSteps + blockers), debug (full trace + tokenStats). Backward compatible: original response returned when profile is omitted. |
| `SPECKIT_RESPONSE_TRACE` | `false` | boolean | `handlers/memory-search.ts` | **IMPLEMENTED (Sprint 019).** P0-2: Include provenance data (scores, source, trace) in `memory_search` response envelopes. Opt-in via `includeTrace: true` parameter. Also propagates through `memory_context` when `includeTrace` is forwarded to internal search calls (CHK-040). When disabled, response format is unchanged (backward compatible). |
| `SPECKIT_RESULT_CONFIDENCE_V1` | `true` | boolean | `lib/search/confidence-scoring.ts` | **Default ON (graduated).** Per-result calibrated confidence. Combines 4 factors: margin (0.35), channel agreement (0.30), reranker (0.20), anchor density (0.15). Heuristic-only. |
| `SPECKIT_RESULT_EXPLAIN_V1` | `true` | boolean | `lib/search/result-explainability.ts` | **Default ON (graduated).** Two-tier result explainability. Attaches `why` payload to each result: slim tier (summary + topSignals, always present when ON) and debug tier (channelContribution map with vector/fts/graph breakdown, opt-in). Detects 10+ signal types including semantic/lexical match, graph/session/causal/community boosts, reranker support, feedback, validation quality, and anchor labels. |
| `SPECKIT_ROLLOUT_PERCENT` | `100` | number | `lib/cognitive/rollout-policy.ts` | Global rollout gate applied on top of individual feature flags. At 100, checks pass. At 0, checks fail. Between 1-99, inclusion uses deterministic identity hashing and calls without identity fail closed. Malformed rollout values fall back to 100. |
| `SPECKIT_RRF` | `true` | boolean | `shared/algorithms/rrf-fusion.ts` | Enables Reciprocal Rank Fusion for combining multi-channel search results. When disabled, a simpler score-passthrough merge is used. Rarely disabled in production. |
| `SPECKIT_RRF_K_EXPERIMENTAL` | `true` | boolean | `lib/eval/k-value-analysis.ts` | **Default ON (graduated).** Per-intent NDCG@10-maximizing K selection over sweep grid {10,20,40,60,80,100,120}. Falls back to K=40 when OFF. |
| `SPECKIT_RSF_FUSION` | inert | boolean | `lib/search/hybrid-search.ts` | **Deprecated runtime gate.** RSF shadow Stage B is no longer active in production ranking paths. Remaining RSF references are compatibility/testing artifacts and do not alter live ranking behavior. |
| `SPECKIT_SAVE_QUALITY_GATE` | `true` | boolean | `lib/search/search-flags.ts` | TM-04 three-layer pre-storage quality gate. Layer 1: structure validation (title, content ≥50 chars, valid spec folder path). Layer 2: content quality scoring across 5 dimensions against a 0.4 signal density threshold. Layer 3: semantic dedup via cosine similarity (rejects near-duplicates above 0.92). A 14-day warn-only mode runs after activation. |
| `SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS` | `true` | boolean | `lib/validation/save-quality-gate.ts` | **Default ON (graduated).** Decision documents with >=2 structural signals bypass 50-char minimum content length check (warn-only). |
| `SPECKIT_SCORE_NORMALIZATION` | `true` | boolean | `lib/scoring/composite-scoring.ts` | Normalizes composite and RRF scores to the [0, 1] range for consistent downstream comparison. When disabled, raw scores from individual channels are used without normalization. |
| `SPECKIT_SEARCH_FALLBACK` | `true` | boolean | `lib/search/search-flags.ts` | PI-A2 quality-aware 3-tier fallback chain. With flag ON: Tier 1 primary retrieval (0.3), Tier 2 widened retrieval (0.1, all channels), Tier 3 structural SQL fallback. With flag OFF: legacy two-pass fallback (0.3 then 0.17). |
| `SPECKIT_SESSION_BOOST` | `true` | boolean | `lib/search/session-boost.ts` | Enables session-attention boosting. Memories from the current session's working memory receive a 0.15× score boost. Combined with causal boost, the ceiling is 0.20. Uses session identity for rollout-based gating. |
| `SPECKIT_SESSION_RETRIEVAL_STATE_V1` | `true` | boolean | `lib/search/session-state.ts` | **Default ON (graduated).** Retrieval session state for cross-turn context. The live handler emits additive `data.sessionState` and `data.goalRefinement`, tracks seen results (deprioritized at 0.3x score, not removed), active retrieval goal (boost up to 1.2x), open questions, and preferred anchors. In-memory only (ephemeral), 30-min TTL, LRU eviction at 100 sessions. |
| `SPECKIT_SHADOW_FEEDBACK` | `true` | boolean | `lib/feedback/shadow-scoring.ts` | **Default ON (graduated, shadow-only).** Shadow scoring with holdout evaluation. Compares would-have-changed rankings vs live rankings on a deterministic 20% holdout slice. Tracks Kendall tau, NDCG delta, MRR delta per cycle. Promotion requires 2+ consecutive improvement weeks. No live ranking mutations. |
| `SPECKIT_SHADOW_SCORING` | inert | boolean | `lib/eval/shadow-scoring.ts` | **Deprecated.** Shadow scoring runtime is permanently disabled: `runShadowScoring()` returns `null` and `logShadowComparison()` returns `false`. The env var is retained for compatibility/testing context but does not enable production scoring paths. |
| `SPECKIT_SIGNAL_VOCAB` | `true` | boolean | `lib/parsing/trigger-matcher.ts` | Enables signal vocabulary expansion in the trigger matcher. Augments the trigger phrase vocabulary with derived signal terms during matching. Disabled with explicit `'false'`. |
| `SPECKIT_SKIP_API_VALIDATION` | `false` | boolean | `context-server.ts` | When `'true'`, skips API key validation at startup. Useful for testing without a real embedding provider. Default is to validate API credentials. |
| `SPECKIT_STRICT_SCHEMAS` | `true` | boolean | `schemas/tool-input-schemas.ts` | **IMPLEMENTED (Sprint 019, later expanded by session/code-graph additions).** P0-1: Controls Zod schema enforcement mode for the schema-backed L1-L7 MCP tool surface. When `true`, `.strict()` rejects unexpected parameters with stderr logging (CHK-029). When `false`, `.passthrough()` allows undocumented parameters for backward compatibility. The L8 code-graph/CocoIndex dispatch helpers still use lighter required-field guards instead of the same `validateToolArgs` path. |
| `SPECKIT_TRM` | `true` | boolean | `lib/search/search-flags.ts` | Enables the Transparent Reasoning Module (evidence-gap detection). Stage 4 runs a TRM Z-score analysis to detect evidence gaps and annotate results accordingly. |
| `SPECKIT_TYPED_TRAVERSAL` | `true` | boolean | `lib/search/causal-boost.ts` | **Default ON (graduated).** Sparse-first policy + intent-aware edge traversal. Density < 0.5 constrains to 1-hop. Score: seedScore * edgePrior * hopDecay * freshness. |
| `SPECKIT_WORKING_MEMORY` | `true` | boolean | `lib/cognitive/working-memory.ts` | Enables the working memory system which tracks attention scores for memories seen in the current session. Working memory context is injected during resume mode and influences session-boost scoring. |

#### Source Files

Source file references are included in the flag table above.

See [`19--feature-flag-reference/01-1-search-pipeline-features-speckit.md`](19--feature-flag-reference/01-1-search-pipeline-features-speckit.md) for full flag reference details.

---

### 2. Session and Cache

#### Description

These settings control short-term memory and caching behavior. They decide how long the system remembers what it already returned, how cache entries expire, and whether duplicate results are filtered across a session.

#### Current Reality

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

#### Source Files

Source file references are included in the flag table above.

See [`19--feature-flag-reference/02-2-session-and-cache.md`](19--feature-flag-reference/02-2-session-and-cache.md) for full flag reference details.

---

### 3. MCP Configuration

#### Description

These are guardrail settings for save-time validation. They define size limits, token estimates, duplicate thresholds, and anchor strictness so problematic files can be caught before indexing.

#### Current Reality

| Name | Default | Type | Source File | Description |
|---|---|---|---|---|
| `MCP_ANCHOR_STRICT` | `false` | boolean | `lib/validation/preflight.ts` | When `'true'`, enforces strict anchor format validation during pre-flight checks. Invalid anchor IDs cause the save to be rejected. Default is lenient mode which logs warnings but does not block. |
| `MCP_CHARS_PER_TOKEN` | `4` | number | `lib/validation/preflight.ts` | Characters-per-token ratio used for save-time token budget estimation during pre-flight validation. The same ratio is also shared by the quality loop when trimming to its default token budget. |
| `MCP_DUPLICATE_THRESHOLD` | `0.95` | number | `lib/validation/preflight.ts` | Cosine similarity threshold above which a new memory is considered a near-duplicate of an existing one during pre-flight validation. Duplicates above this threshold are rejected by the quality gate Layer 3. |
| `MCP_MAX_CONTENT_LENGTH` | `250000` | number | `lib/validation/preflight.ts` | Maximum allowed content length in characters for a memory file. Files exceeding this limit are rejected at pre-flight validation before any embedding generation or database writes. |
| `MCP_MAX_MEMORY_TOKENS` | `8000` | number | `lib/validation/preflight.ts` | Maximum token budget per memory (estimated via `MCP_CHARS_PER_TOKEN`). Pre-flight hard-fails with PF020 (`TOKEN_BUDGET_EXCEEDED`) when a memory exceeds this limit. |
| `MCP_MIN_CONTENT_LENGTH` | `10` | number | `lib/validation/preflight.ts` | Minimum content length in characters for a valid memory file. Files shorter than this are rejected at pre-flight. The quality gate Layer 1 requires at least 50 characters, so this lower floor catches truly empty files. |
| `MCP_TOKEN_WARNING_THRESHOLD` | `0.8` | number | `lib/validation/preflight.ts` | Fraction of `MCP_MAX_MEMORY_TOKENS` at which a token budget warning is emitted. At 0.8, a warning fires when estimated tokens exceed 80% of the max. |

#### Source Files

Source file references are included in the flag table above.

See [`19--feature-flag-reference/03-3-mcp-configuration.md`](19--feature-flag-reference/03-3-mcp-configuration.md) for full flag reference details.

---

### 4. Memory and Storage

#### Description

These variables define where memory files and databases live and how indexing batches are processed. In practice, they control storage location, path safety boundaries, and scan throughput.

#### Current Reality

| Name | Default | Type | Source File | Description |
|---|---|---|---|---|
| `MEMORY_ALLOWED_PATHS` | _(cwd)_ | string | `tests/regression-010-index-large-files.vitest.ts` | Colon-separated list of filesystem paths that are allowlisted for memory file access. Used in path security validation to restrict which directories `memory_save` can read from. Defaults to `cwd` if not set. |
| `MEMORY_BASE_PATH` | _(cwd)_ | string | `core/config.ts` | Base path prepended to relative file paths when resolving memory file locations. Defaults to `process.cwd()` when not set. Determines the root of the allowed path tree. |
| `MEMORY_DB_DIR` | _(legacy fallback)_ | string | `lib/search/vector-index-store.ts` | Compatibility fallback for the database directory. Superseded by `SPEC_KIT_DB_DIR`. Precedence order: `SPEC_KIT_DB_DIR` > `MEMORY_DB_DIR` > default `database/` directory adjacent to the server root. |
| `MEMORY_DB_PATH` | _(derived)_ | string | `lib/search/vector-index-store.ts` | Full path to the SQLite database file. When set, it overrides the derived path from `SPEC_KIT_DB_DIR` or `MEMORY_DB_DIR`. Use it for provider-specific or non-default database locations. |
| `SPECKIT_DB_DIR` | _(fallback)_ | string | `shared/config.ts` | Fallback env var for the database directory, checked after `SPEC_KIT_DB_DIR`. Added in Phase 018 (CR-P1-8) to support the underscore-less naming convention. Precedence: `SPEC_KIT_DB_DIR` > `SPECKIT_DB_DIR` > default path. |
| `SPEC_KIT_BATCH_DELAY_MS` | `100` | number | `core/config.ts` | Delay in milliseconds between processing batches during `memory_index_scan`. Prevents exhausting I/O resources on large workspaces by introducing a small pause between embedding generation batches. |
| `SPEC_KIT_BATCH_SIZE` | `5` | number | `core/config.ts` | Number of files processed per batch during `memory_index_scan`. Lower values reduce peak memory usage and API concurrency at the cost of longer scan times. |
| `SPEC_KIT_DB_DIR` | _(server root)_ | string | `core/config.ts` | Directory where the SQLite database file is stored. Takes precedence over `MEMORY_DB_DIR`. Resolved relative to `process.cwd()` when set. Defaults to a `database/` directory adjacent to the server root. |

#### Source Files

Source file references are included in the flag table above.

See [`19--feature-flag-reference/04-4-memory-and-storage.md`](19--feature-flag-reference/04-4-memory-and-storage.md) for full flag reference details.

---

### 5. Embedding and API

#### Description

These settings pick which embedding and reranking providers the system uses and which credentials unlock them. They let you switch between cloud and local options without changing application logic.

#### Current Reality

| Name | Default | Type | Source File | Description |
|---|---|---|---|---|
| `COHERE_API_KEY` | _(none)_ | string | `tests/search-limits-scoring.vitest.ts` | API key for the Cohere reranker provider. When present, the cross-encoder reranker uses Cohere's rerank API. Falls back to local or Voyage reranker when absent. |
| `EMBEDDING_DIM` | _(provider default)_ | number | `lib/search/vector-index-store.ts`, `shared/embeddings/factory.ts` | Compatibility check and startup override for the stored vector dimension. Any positive explicit `EMBEDDING_DIM` value is honored first; otherwise runtime dimension selection comes from the active provider profile (Voyage 1024, OpenAI 1536, local 768 fallback). |
| `EMBEDDINGS_PROVIDER` | `'auto'` | string | `shared/embeddings/factory.ts` | Selects the embedding provider. Valid values include `'auto'`, `'openai'`, `'hf-local'`, and `'voyage'`. In `'auto'` mode, resolution precedence is explicit `EMBEDDINGS_PROVIDER` -> `VOYAGE_API_KEY` -> `OPENAI_API_KEY` -> local fallback. |
| `OPENAI_API_KEY` | _(none)_ | string | `tests/embeddings.vitest.ts` | API key for the OpenAI embeddings provider. Required when `EMBEDDINGS_PROVIDER` is `'openai'` or when `'auto'` mode selects OpenAI as the available provider. |
| `RERANKER_LOCAL` | `false` | boolean | `lib/search/local-reranker.ts` | **IMPLEMENTED (Sprint 019).** When set to `'true'` (strict string equality, not truthy), enables the local GGUF reranker via `node-llama-cpp`. Requires model file on disk and sufficient total system memory (8GB default, 2GB with custom `SPECKIT_RERANKER_MODEL`). Sequential per-candidate inference; expect 200-400ms for top-20 on Apple Silicon (CHK-113). Falls back to the original candidate ordering on precondition failure or runtime inference error. |
| `VOYAGE_API_KEY` | _(none)_ | string | `tests/embeddings.vitest.ts` | API key for the Voyage AI embeddings and reranker provider. In `'auto'` mode, Voyage is preferred over OpenAI when this key is present. |

#### Source Files

Source file references are included in the flag table above.

See [`19--feature-flag-reference/05-5-embedding-and-api.md`](19--feature-flag-reference/05-5-embedding-and-api.md) for full flag reference details.

---

### 6. Debug and Telemetry

#### Description

These settings control diagnostic visibility. They adjust log verbosity and optional telemetry so you can inspect runtime behavior during debugging while keeping production output stable by default.

#### Current Reality

| Name | Default | Type | Source File | Description |
|---|---|---|---|---|
| `DEBUG_TRIGGER_MATCHER` | _(unset)_ | string | `lib/parsing/trigger-matcher.ts` | When set to any non-empty value, emits debug-level output for trigger phrase matching operations. Useful for diagnosing why a particular memory is or is not matching a given prompt. |
| `LOG_LEVEL` | `'info'` | string | `lib/utils/logger.ts` | Minimum log severity level. Messages below this level are suppressed. Valid values: `'debug'`, `'info'`, `'warn'`, `'error'`. All log output goes to stderr (stdout is reserved for JSON-RPC). |
| `SPECKIT_EVAL_LOGGING` | `false` | boolean | `lib/eval/eval-logger.ts` | (Also listed under Search Pipeline.) Enables writes to the eval database during retrieval operations. Must be explicitly `'true'`. See category 1 for full description. |
| `SPECKIT_DEBUG_INDEX_SCAN` | `false` | boolean | `handlers/memory-index.ts` | (Also listed under Search Pipeline.) Enables verbose file-count diagnostics during index scans. Must be explicitly `'true'`. See category 1 for full description. |
| `SPECKIT_EXTENDED_TELEMETRY` | `false` | boolean | `lib/telemetry/retrieval-telemetry.ts` | (Also listed under Search Pipeline.) Opt-in retrieval telemetry. Detailed latency/mode/fallback/quality metrics and architecture updates are recorded only when this is explicitly `'true'`. |
| `SPECKIT_HYDRA_PHASE` | `shared-rollout` | string | `lib/config/capability-flags.ts` | Legacy compatibility alias for the memory-roadmap phase label. Used by telemetry, eval baselines, migration checkpoint metadata, and rename-window compatibility paths. Unsupported values fall back to `shared-rollout`. |
| `SPECKIT_HYDRA_LINEAGE_STATE` | `true` | boolean | `lib/config/capability-flags.ts` | Legacy compatibility alias for the lineage roadmap flag. Consumed by default-on roadmap metadata snapshots and rename-window lineage compatibility checks; set it to `false` or `0` to opt out explicitly. |
| `SPECKIT_HYDRA_GRAPH_UNIFIED` | `true` | boolean | `lib/config/capability-flags.ts` | Legacy compatibility alias for the unified-graph roadmap flag. Still distinct from the live `SPECKIT_GRAPH_UNIFIED` runtime gate; set it to `false` or `0` to opt out explicitly. |
| `SPECKIT_HYDRA_ADAPTIVE_RANKING` | `false` | boolean | `lib/config/capability-flags.ts` | Legacy compatibility alias for the adaptive-ranking roadmap flag. Phase 4 adaptive ranking remains dormant in production, so roadmap metadata defaults this flag to off unless explicitly enabled with `true` or `1`. Used by roadmap metadata snapshots and adaptive shadow-ranking compatibility paths. |
| `SPECKIT_HYDRA_SCOPE_ENFORCEMENT` | `false` | boolean | `lib/config/capability-flags.ts` | Legacy compatibility alias for the scope-enforcement roadmap flag. Used by default-on roadmap snapshots and governed-scope compatibility checks; set it to `false` or `0` to opt out explicitly. |
| `SPECKIT_HYDRA_GOVERNANCE_GUARDRAILS` | `false` | boolean | `lib/config/capability-flags.ts` | Legacy compatibility alias for the governance-guardrail roadmap flag. Used by default-on roadmap snapshots and governed-ingest compatibility checks; set it to `false` or `0` to opt out explicitly. |
| `SPECKIT_HYDRA_SHARED_MEMORY` | `false` | boolean | `lib/config/capability-flags.ts` | Legacy compatibility alias for the shared-memory roadmap flag. Used by roadmap snapshots and shared-memory rollout compatibility checks, but now defaults off until explicitly enabled with `true` or `1` so metadata cannot get ahead of the live rollout gate. |
| `SPECKIT_CONSUMPTION_LOG` | `true` | boolean | `lib/telemetry/consumption-logger.ts` | (Also listed under Search Pipeline.) Default ON via rollout policy; active unless explicitly disabled. See category 1 for full description (updated 2026-03-25 per deep review). |

#### Source Files

Source file references are included in the flag table above.

See [`19--feature-flag-reference/06-6-debug-and-telemetry.md`](19--feature-flag-reference/06-6-debug-and-telemetry.md) for full flag reference details.

---

### 7. CI and Build (informational)

#### Description

These are informational CI metadata variables, not feature toggles. They annotate records with branch context for traceability but do not change retrieval, scoring, or storage behavior.

#### Current Reality

These variables are read at runtime to annotate checkpoint and evaluation records with source-control context. They are not feature flags and have no effect on search or storage behavior.

| Name | Source | Description |
|---|---|---|
| `BRANCH_NAME` | `lib/storage/checkpoints.ts` | Git branch name as set by some CI environments (e.g. Jenkins). Used as a fallback when `GIT_BRANCH` is absent. |
| `CI_COMMIT_REF_NAME` | `lib/storage/checkpoints.ts` | Git branch or tag name as set by GitLab CI. Third fallback in the branch-detection chain. |
| `GIT_BRANCH` | `lib/storage/checkpoints.ts` | Git branch name. Primary source used to annotate checkpoint records with the active branch at creation time. |
| `VERCEL_GIT_COMMIT_REF` | `lib/storage/checkpoints.ts` | Git branch name as set by Vercel deployments. Last fallback in the branch-detection chain. |

#### Source Files

Source file references are included in the flag table above.

See [`19--feature-flag-reference/07-7-ci-and-build-informational.md`](19--feature-flag-reference/07-7-ci-and-build-informational.md) for full flag reference details.
<!-- /ANCHOR:state -->

---

## 22. CONTEXT PRESERVATION AND CODE GRAPH

### Description

This category tracks the compact-code-graph rollout: hook lifecycle capture, hookless priming, code-graph retrieval, CocoIndex bridging, and routing enforcement surfaces that preserve context across long-running sessions.

### Current Reality

The active package includes a dedicated category folder with 23 feature records that mirror phases 001-025 from the compact-code-graph packet, including precompact/session-start/stop hooks, non-hook MCP priming, session health/resume tools, metrics, and tool-routing guidance.

### Source Files

- Category overview: [`22--context-preservation-and-code-graph/01-category-overview.md`](22--context-preservation-and-code-graph/01-category-overview.md)
- Latest enforcement feature: [`22--context-preservation-and-code-graph/23-tool-routing-enforcement.md`](22--context-preservation-and-code-graph/23-tool-routing-enforcement.md)
- Playbook counterpart: [`../manual_testing_playbook/22--context-preservation-and-code-graph/`](../manual_testing_playbook/22--context-preservation-and-code-graph/)
