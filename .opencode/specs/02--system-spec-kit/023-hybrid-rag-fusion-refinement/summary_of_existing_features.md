---
title: Summary of existing features
description: Complete feature inventory of the Spec Kit Memory MCP server with expanded descriptions of every tool across retrieval, mutation, discovery, lifecycle, maintenance, analysis and evaluation.
---

# Summary of existing features

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

**Note:** The legacy `postSearchPipeline` was removed in Phase 017. The V2 4-stage pipeline is now the only search path. A removal comment remains at `memory-search.ts:599` for historical reference.

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

Five-factor composite scoring (`composite-scoring.ts:544-548`) auto-normalizes channel weights when they do not sum to 1.0 (tolerance 0.001). If the configured weights for the five scoring factors diverge from unity, the system divides each weight by the total, ensuring proportional contribution without requiring manual normalization.

The fallback chain (`searchWithFallback()`) provides resilience. When `SPECKIT_SEARCH_FALLBACK` is enabled, the default path is a three-tier degradation flow: Tier 1 primary retrieval (default minimum similarity 0.3), Tier 2 widened retrieval at 0.1 with all channels forced on, and Tier 3 structural SQL search as last resort. When `SPECKIT_SEARCH_FALLBACK` is disabled, the legacy two-pass path is used (0.3 then 0.17). The system is designed to avoid empty returns except on hard failures.

### 4-stage pipeline architecture

The pipeline refactor (R6) restructures the retrieval flow into four bounded stages with clear responsibilities and a strict score-immutability invariant in the final stage.

Stage 1 (Candidate Generation) executes search channels based on query type, including an R8 summary embedding channel (`stage1-candidate-gen.ts:507-565`) that searches over TF-IDF extractive summaries. The summary channel is gated by `SPECKIT_MEMORY_SUMMARIES` and only activates when the result set exceeds a scale threshold, providing lightweight fallback matching. Multi-concept queries generate one embedding per concept. Deep mode expands into up to 3 query variants via `expandQuery()`. When embedding expansion is active and R15 does not classify the query as "simple", a baseline and expanded-query search run in parallel with deduplication. Constitutional memory injection appends up to 5 constitutional rows when none appear in the initial candidate set. Quality score and tier filters run at the end of Stage 1.

Stage 2 (Fusion and Signal Integration) is the single authoritative scoring point. Twelve processing steps (9 score-affecting) apply in a fixed, documented order: (1) score resolution via `resolveEffectiveScore()`, (2) co-activation spreading, (3) query-term overlap, (4) trigger phrase match, (5) contiguity bonus, (6) causal neighbor boost, (7) BM25 integration, (8) summary channel fusion, (9) temporal decay — these first 9 steps are score-affecting — followed by (10) quality weighting, (11) intent-aware adjustment and (12) final normalization. The G2 prevention is structural: an `isHybrid` boolean computed once at the top of Stage 2 gates the intent weight step, so the code path for intent weights is absent when hybrid search already applied them during RRF fusion.

Score resolution uses `resolveEffectiveScore(result: SearchResult): number` (`pipeline/types.ts:56`) which applies a cascading fallback: `compositeScore` → `fusionScore` → `rrf_score` → `similarity`. This function is the first step in Stage 2 and ensures every result has a single effective score before downstream processing.

Stage 3 (Rerank and Aggregate) handles cross-encoder reranking (optional, gated by `SPECKIT_CROSS_ENCODER`) and MPAB chunk collapse with parent reassembly. Chunks are grouped by parent ID, the best chunk per group is elected by score, and full parent content is loaded from the database. On DB failure, the best-chunk row is emitted as a fallback. Non-chunks and reassembled parents merge and sort descending by effective score.

Stage 4 (Filter and Annotate) enforces a "no score changes" invariant through dual enforcement. At compile time, `Stage4ReadonlyRow` declares all six score fields as `Readonly`, making assignment a TypeScript error. At runtime, `captureScoreSnapshot()` records all scores before operations and `verifyScoreInvariant()` checks them afterward, throwing a `[Stage4Invariant]` error on any mismatch. Within this invariant, Stage 4 applies memory state filtering (removing rows below `config.minState` with optional per-tier hard limits), evidence gap detection via TRM Z-score analysis and annotation metadata for feature flags and state statistics. Session deduplication is explicitly excluded from Stage 4 and runs post-cache in the handler to avoid double-counting.

The pipeline runs behind the `SPECKIT_PIPELINE_V2` flag (default ON, always true). The legacy `postSearchPipeline` was removed in Phase 017; the V2 pipeline is the only active path.

---

## Mutation

### Memory indexing (memory_save)

`memory_save` is the entry point for getting content into the memory system. You give it a file path. It reads the file, parses metadata from the frontmatter (title, trigger phrases, spec folder, importance tier, context type, causal links), generates a vector embedding and indexes everything into the SQLite database.

Before embedding generation, content normalization strips structural markdown noise. Seven primitives (frontmatter, anchors, HTML comments, code fences, tables, lists, headings) run in sequence to produce cleaner text for the embedding model. A separate normalization path for BM25 preserves more structure for lexical matching. Both paths are always active with no feature flag.

The interesting part is what happens before the record is created. A Prediction Error (PE) gating system compares the new content against existing memories via cosine similarity and decides one of five actions. CREATE stores a new record when no similar memory exists. REINFORCE boosts the FSRS stability of an existing duplicate without creating a new entry (the system already knows this, so it strengthens the memory). UPDATE overwrites an existing high-similarity memory in-place when the new version supersedes the old. SUPERSEDE marks the old memory as deprecated, creates a new record and links them with a causal edge. CREATE_LINKED stores a new memory with a relationship edge to a similar but distinct existing memory.

A three-layer quality gate runs before storage when `SPECKIT_SAVE_QUALITY_GATE` is enabled (default ON). Layer 1 validates structure (title exists, content at least 50 characters, valid spec folder path). Layer 2 scores content quality across five dimensions (title, triggers, length, anchors, metadata) against a 0.4 signal density threshold. Layer 3 checks semantic deduplication via cosine similarity, rejecting near-duplicates above 0.92. A warn-only mode runs for the first 14 days after activation, logging would-reject decisions without blocking saves. Quality gate decisions (accept, warn, reject) are persisted alongside the memory record for post-hoc analysis and gate calibration.

Reconsolidation-on-save runs after embedding generation when `SPECKIT_RECONSOLIDATION` is enabled (default ON). The system checks the top-3 most similar memories in the same spec folder. Similarity at or above 0.88 triggers a merge where content is combined and `importance_weight` is boosted (capped at 1.0). Similarity between 0.75 and 0.88 triggers conflict resolution: the old memory is deprecated and a `supersedes` causal edge is created. Below 0.75, the memory stores unchanged. A checkpoint must exist for the spec folder before reconsolidation can run.

For large files exceeding the chunking threshold, the system splits into a parent record (metadata only) plus child chunk records, each with its own embedding. Before indexing, anchor-aware chunk thinning scores each chunk using a composite of anchor presence (weight 0.6, binary) and content density (weight 0.4, 0-1). Chunks scoring below 0.3 are dropped to reduce storage and search noise. The thinning never returns an empty array.

When `SPECKIT_MEMORY_SUMMARIES` is enabled (default ON), a TF-IDF extractive summary (top 3 sentences) is generated at save time and stored alongside the memory record. This summary feeds the R8 summary embedding channel during retrieval and provides a lightweight representation for tiered content injection in trigger matching.

When `SPECKIT_ENCODING_INTENT` is enabled (default ON), the content type is classified at index time as `document`, `code` or `structured_data` using heuristic scoring against a 0.4 threshold. The classification is stored as read-only metadata on the `encoding_intent` column for both parent records and individual chunks. This metadata has no retrieval-time scoring impact yet; it builds a labeled dataset for future type-aware retrieval.

After every successful save, a consolidation cycle hook fires when `SPECKIT_CONSOLIDATION` is enabled (default ON). The N3-lite consolidation engine scans for contradictions (memory pairs above 0.85 cosine similarity with negation keyword conflicts), runs Hebbian strengthening on recently accessed edges (+0.05 per cycle with a 30-day decay), detects stale edges (unfetched for 90+ days) and enforces edge bounds (maximum 20 per node). The cycle runs on a weekly cadence.

The `asyncEmbedding` parameter (boolean, default `false`) enables non-blocking saves. When set to `true`, embedding generation is deferred: the memory record is written immediately with a `pending` embedding status, and an async background attempt generates the embedding afterward. The memory is immediately searchable via BM25 and FTS5 while the embedding processes. When `false` (the default), the save blocks until embedding generation completes before returning. Use `asyncEmbedding: true` when save latency matters more than immediate vector search availability.

Safety mechanisms run deep. Path security validation checks the file against an allowlist of base paths. File type validation accepts only `.md` and `.txt` in approved directories. Pre-flight validation checks anchor format, detects duplicates and estimates token budget before investing in embedding generation. A per-spec-folder mutex lock prevents TOCTOU race conditions when multiple saves target the same folder. SHA-256 content hashing skips unchanged files. A mutation ledger records every create, update, reinforce and supersede action for audit. The trigger matcher cache, tool cache and constitutional cache are all invalidated on write. If embedding generation fails, the memory is still stored and searchable via BM25/FTS5 with the embedding marked as pending for later re-indexing.

Document type affects importance weighting automatically: constitutional files get 1.0, spec documents 0.8, plans 0.7, memory files 0.5 and scratch files 0.25.

### Memory metadata update (memory_update)

You can change the title, trigger phrases, importance weight or importance tier on any existing memory by its numeric ID. The system verifies the memory exists, validates your parameters (importance weight between 0 and 1, tier from the valid enum) and applies the changes.

When the title changes, the system regenerates the vector embedding from title+content to keep search results aligned. The embedding input is constructed as `${title}\n\n${contentText}` when content is available, falling back to title-only when content is empty (`memory-crud-update.ts:89-91`). This is a critical detail: if you rename a memory from "Authentication setup guide" to "OAuth2 configuration reference", the old embedding no longer represents the content accurately. Automatic regeneration fixes that.

By default, if embedding regeneration fails (API timeout, provider outage), the entire update rolls back with no changes applied. Nothing happens. With `allowPartialUpdate` enabled, the metadata changes persist and the embedding is marked as pending for later re-indexing by the next `memory_index_scan`. That mode is useful when you need to fix metadata urgently and can tolerate a temporarily stale embedding.

A pre-update hash snapshot is captured for the mutation ledger. Every update records the prior hash, new hash, actor and decision metadata for full auditability.

### Single and folder delete (memory_delete)

Two deletion modes in one tool. Pass a numeric `id` for single delete or a `specFolder` string (with `confirm: true`) for bulk folder delete.

Single deletes perform multi-table cleanup: the memory record is removed from `memory_index`, the vector embedding is deleted via `vectorIndex.deleteMemory(id)`, all associated causal graph edges are removed via `causalEdges.deleteEdgesForMemory(id)` (`memory-crud-delete.ts:74,80`), and a mutation ledger entry is recorded. If causal edge cleanup fails, the deletion still succeeds. The edge cleanup is non-fatal because a dangling edge is a minor inconsistency while a failed delete that leaves stale data is a bigger problem.

Bulk deletes by spec folder are more involved. The system first creates an auto-checkpoint with a timestamped name (like `pre-cleanup-2026-02-28T12-00-00`) so you can roll back if the deletion was a mistake. Then it deletes all matching memories inside a database transaction with per-memory causal edge cleanup and per-memory mutation ledger entries. The entire operation is atomic: either all memories in the folder are deleted or none are. The response includes the checkpoint name and a restore command hint.

### Tier-based bulk deletion (memory_bulk_delete)

For large-scale cleanup operations. Instead of targeting a folder, you target an importance tier: delete all deprecated memories, or all temporary memories older than 30 days. The tool counts affected memories first (so the response tells you exactly how many were deleted), creates a safety checkpoint, then deletes within a database transaction.

Constitutional and critical tier memories receive extra protection. Unscoped deletion of these tiers is refused outright. You must provide a `specFolder` to delete constitutional or critical memories in bulk. The `skipCheckpoint` speed optimization, which skips the safety checkpoint for faster execution, is also rejected for these tiers. If the checkpoint creation itself fails for constitutional/critical, the entire operation aborts. For lower tiers, a checkpoint failure triggers a warning but the deletion proceeds because the risk of losing deprecated or temporary memories is low.

Each deleted memory gets multi-table cleanup: the memory record, its vector embedding and all associated causal graph edges are removed. A single consolidated mutation ledger entry (capped at 50 linked memory IDs to avoid ledger bloat) records the bulk operation. All caches (tool cache, trigger matcher cache, constitutional cache) are invalidated after deletion.

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

The scanner discovers files from three sources: spec folder memory files (`specs/**/memory/*.md`), constitutional files (`.opencode/skill/*/constitutional/*.md`) and spec documents (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, `research.md`, `handover.md`). Canonical path deduplication prevents the same file from being indexed twice under different paths (the `specs/` vs `.opencode/specs/` symlink problem). Each file is assigned a canonical ID derived from its normalized path; during indexing, duplicate canonical IDs are detected and only the primary path variant is indexed, with the alias recorded for divergence reporting.

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

## Feature Flag Reference

Every runtime behavior in the MCP server is controlled by environment variables. The tables below catalogue all known flags grouped by category. The "Default" column reflects the value in effect when the variable is absent from the environment.

For SPECKIT_* flags that use `isFeatureEnabled()`: the function returns `true` when the variable is absent, empty, or set to `'true'`. It returns `false` only when explicitly set to `'false'`. This means almost all graduated search-pipeline features are **ON by default** and require an explicit opt-out.

The `SPECKIT_ROLLOUT_PERCENT` flag applies a global percentage gate on top of any individual flag check. At 100 (the default), all sessions pass the rollout gate and every enabled flag takes effect normally.

### 1. Search Pipeline Features (SPECKIT_*)

| Name | Default | Type | Source File | Description |
|---|---|---|---|---|
| `SPECKIT_ABLATION` | `false` | boolean | `lib/eval/eval-metrics.ts` | Activates the ablation study framework. When `false`, all ablation functions are no-ops. Must be explicitly set to `'true'` to enable controlled channel ablation runs. |
| `SPECKIT_ADAPTIVE_FUSION` | `false` | boolean | `adaptive-fusion.ts` | **Default OFF (rollout-policy controlled).** Enables adaptive fusion which dynamically adjusts channel weights based on query characteristics. Gated by rollout policy (`adaptive-fusion.ts:65,74`). When disabled, static channel weights from the intent profile are used. |
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
| `SPECKIT_CROSS_ENCODER` | `true` | boolean | `lib/search/search-flags.ts` | Enables cross-encoder reranking in Stage 3 of the 4-stage pipeline. When enabled, the reranker rescores candidates using a more expensive cross-attention model. Disabling falls back to vector-only ranking from fusion. |
| `SPECKIT_DEBUG_INDEX_SCAN` | `false` | boolean | `handlers/memory-index.ts` | When `'true'`, emits additional file-count diagnostics during `memory_index_scan` runs. Off by default; intended for debugging index coverage issues. Must be explicitly set to `'true'`. |
| `SPECKIT_DEGREE_BOOST` | `true` | boolean | `lib/search/search-flags.ts` | Enables the degree-search channel in hybrid search. Re-ranks results by hub score via `computeDegreeScores()` with logarithmic normalization and a hard cap of 50. Base channel weight is 0.4. |
| `SPECKIT_DOCSCORE_AGGREGATION` | `true` | boolean | `lib/search/search-flags.ts` | Enables R1 MPAB (Multi-Parent Aggregated Bonus) chunk-to-memory score aggregation. Collapses chunk-level results back to parent memory documents using `sMax + 0.3 * sum(remaining) / sqrt(N)` to prevent multi-chunk dominance. |
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
| `RERANKER_LOCAL` | `false` | boolean | `tests/search-limits-scoring.vitest.ts` | When set to a truthy value, forces the cross-encoder to use a locally hosted reranker model instead of a remote API. Useful for offline or air-gapped deployments. |
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
