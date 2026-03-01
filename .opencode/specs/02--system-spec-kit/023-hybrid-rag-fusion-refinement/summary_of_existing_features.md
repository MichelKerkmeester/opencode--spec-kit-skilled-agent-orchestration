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

A legacy search path remains available when `SPECKIT_PIPELINE_V2` is disabled. That path runs the original `hybridSearchEnhanced()` with its five search channels, Reciprocal Rank Fusion, and a nine-stage post-search pipeline covering state filtering, FSRS testing effect, intent weight application, artifact-class routing, cross-encoder reranking, session boosting, causal boosting, evidence gap detection and chunk reassembly.

A deep mode expands the query into up to 3 variants using `expandQuery()`, runs hybrid search for each variant in parallel and merges results with deduplication. Results are cached per parameter combination via `toolCache.withCache()`, and session deduplication runs after cache so that cache hits still respect session state.

The parameter surface is wide. You control result count (`limit`, 1-100), spec folder scoping, tier and context type filtering, intent (explicit or auto-detected), reranking toggle, length penalty, temporal decay, minimum memory state (HOT through ARCHIVED), constitutional inclusion, content inclusion, anchor filtering, session dedup, session boosting, causal boosting, minimum quality threshold, cache bypass and access tracking. Most defaults are sensible. You typically send a query and a session ID and let everything else run at defaults.

### Trigger phrase matching (memory_match_triggers)

When you need speed over depth, trigger matching delivers. Rather than generating embeddings and running multi-channel search, it performs direct string matching of your prompt against stored trigger phrases. The performance target is under 100ms. Think of it as the "fast path" that sacrifices recall for latency.

Where this tool gets interesting is the cognitive pipeline. When you provide a session ID with `include_cognitive=true`, the system applies FSRS-based attention decay (scores degrade each turn via `0.98^(turn-1)` exponential decay), memory activation (matched memories get their attention score set to 1.0), co-activation spreading (each activated memory spreads activation to related memories through the co-occurrence graph), tier classification (maps effective retrievability to HOT, WARM, COLD, DORMANT or ARCHIVED) and tiered content injection.

Tiered content injection is the most visible effect. HOT memories return their full file content read from disk. WARM memories return the first 150 characters as a summary. COLD memories and below return no content at all. This tiering means recently active and highly relevant memories arrive with full context while dormant ones arrive as lightweight pointers.

The cognitive path fetches 2x the requested limit from the trigger matcher to give the cognitive pipeline headroom for filtering. If you request 3 results, 6 candidates enter the cognitive pipeline and the top 3 survivors are returned.

### Hybrid search pipeline

The engine under the hood. `hybrid-search.ts` orchestrates multi-channel retrieval with five search channels, adaptive fusion, diversity reranking and a multi-tier fallback chain. This pipeline powers the legacy search path and feeds into Stage 1 of the 4-stage pipeline.

Five channels feed the pipeline. Vector search (cosine similarity via sqlite-vec, base weight 1.0) is the primary semantic signal. FTS5 (SQLite full-text search with weighted BM25, base weight 0.8) captures keyword matches the embedding might miss. In-memory BM25 (base weight 0.6) provides broader coverage with a different tokenization approach. Graph search (causal edge traversal, base weight 0.5) finds structurally related memories through the causal graph. Degree search (connectivity scoring, base weight 0.4) re-ranks by hub score via `computeDegreeScores()` with logarithmic normalization and a hard cap of 50.

Adaptive fusion replaces hardcoded channel weights with intent-aware profiles. The `hybridAdaptiveFuse()` function selects weights based on the detected query intent, so a "fix_bug" query weights channels differently than a "find_spec" query. Results from all channels merge through `fuseResultsMulti()` using Reciprocal Rank Fusion.

Five flag-gated stages run between fusion and delivery. Stage A (query complexity routing, `SPECKIT_COMPLEXITY_ROUTER`) restricts active channels for simple queries to just vector and FTS, moderate queries add BM25, and complex queries get all five. Stage B (RSF shadow fusion, `SPECKIT_RSF_FUSION`) runs Relative Score Fusion in parallel for A/B comparison. Stage C (channel enforcement, `SPECKIT_CHANNEL_MIN_REP`) ensures every contributing channel has at least one result in top-k with a 0.2 quality floor. Stage D (confidence truncation, `SPECKIT_CONFIDENCE_TRUNCATION`) trims the irrelevant tail using a 2x-median gap elbow heuristic. Stage E (dynamic token budget, `SPECKIT_DYNAMIC_TOKEN_BUDGET`) computes tier-aware token limits (simple 1,500, moderate 2,500, complex 4,000).

After these stages, Maximal Marginal Relevance reranking promotes result diversity using intent-specific lambda values (from `INTENT_LAMBDA_MAP`, default 0.7). Co-activation spreading takes the top 5 results, spreads activation through the co-activation graph and applies a 0.25x boost to co-activated results with a `1/sqrt(neighbor_count)` fan-effect divisor to prevent hub memories from dominating.

The fallback chain (`searchWithFallback()`) provides resilience. Primary search runs at similarity threshold 0.3. If that returns nothing, a second pass runs at 0.17. If that also fails, FTS-only search runs. If FTS returns nothing, BM25-only runs. The system always returns something. An empty result with a warning is the absolute last resort.

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

Reconsolidation-on-save runs after embedding generation when `SPECKIT_RECONSOLIDATION` is enabled (default ON). The system checks the top-3 most similar memories in the same spec folder. Similarity at or above 0.88 triggers a merge where content is combined and a frequency counter increments. Similarity between 0.75 and 0.88 triggers conflict resolution: the old memory is deprecated and a `supersedes` causal edge is created. Below 0.75, the memory stores unchanged. A checkpoint must exist for the spec folder before reconsolidation can run.

For large files exceeding the chunking threshold, the system splits into a parent record (metadata only) plus child chunk records, each with its own embedding. Before indexing, anchor-aware chunk thinning scores each chunk using a composite of anchor presence (weight 0.6, binary) and content density (weight 0.4, 0-1). Chunks scoring below 0.3 are dropped to reduce storage and search noise. The thinning never returns an empty array.

When `SPECKIT_ENCODING_INTENT` is enabled (default ON), the content type is classified at index time as `document`, `code` or `structured_data` using heuristic scoring against a 0.4 threshold. The classification is stored as read-only metadata on the `encoding_intent` column for both parent records and individual chunks. This metadata has no retrieval-time scoring impact yet; it builds a labeled dataset for future type-aware retrieval.

After every successful save, a consolidation cycle hook fires when `SPECKIT_CONSOLIDATION` is enabled (default ON). The N3-lite consolidation engine scans for contradictions (memory pairs above 0.85 cosine similarity with negation keyword conflicts), runs Hebbian strengthening on recently accessed edges (+0.05 per cycle with a 30-day decay), detects stale edges (unfetched for 90+ days) and enforces edge bounds (maximum 20 per node). The cycle runs on a weekly cadence.

Safety mechanisms run deep. Path security validation checks the file against an allowlist of base paths. File type validation accepts only `.md` and `.txt` in approved directories. Pre-flight validation checks anchor format, detects duplicates and estimates token budget before investing in embedding generation. A per-spec-folder mutex lock prevents TOCTOU race conditions when multiple saves target the same folder. SHA-256 content hashing skips unchanged files. A mutation ledger records every create, update, reinforce and supersede action for audit. The trigger matcher cache, tool cache and constitutional cache are all invalidated on write. If embedding generation fails, the memory is still stored and searchable via BM25/FTS5 with the embedding marked as pending for later re-indexing.

Document type affects importance weighting automatically: constitutional files get 1.0, spec documents 0.8, plans 0.7, memory files 0.5 and scratch files 0.25.

### Memory metadata update (memory_update)

You can change the title, trigger phrases, importance weight or importance tier on any existing memory by its numeric ID. The system verifies the memory exists, validates your parameters (importance weight between 0 and 1, tier from the valid enum) and applies the changes.

When the title changes, the system regenerates the vector embedding to keep search results aligned. This is a critical detail: if you rename a memory from "Authentication setup guide" to "OAuth2 configuration reference", the old embedding no longer represents the content accurately. Automatic regeneration fixes that.

By default, if embedding regeneration fails (API timeout, provider outage), the entire update rolls back with no changes applied. Nothing happens. With `allowPartialUpdate` enabled, the metadata changes persist and the embedding is marked as pending for later re-indexing by the next `memory_index_scan`. That mode is useful when you need to fix metadata urgently and can tolerate a temporarily stale embedding.

A pre-update hash snapshot is captured for the mutation ledger. Every update records the prior hash, new hash, actor and decision metadata for full auditability.

### Single and folder delete (memory_delete)

Two deletion modes in one tool. Pass a numeric `id` for single delete or a `specFolder` string (with `confirm: true`) for bulk folder delete.

Single deletes are straightforward: remove the memory record, clean up associated causal graph edges and record a mutation ledger entry. If causal edge cleanup fails, the deletion still succeeds. The edge cleanup is non-fatal because a dangling edge is a minor inconsistency while a failed delete that leaves stale data is a bigger problem.

Bulk deletes by spec folder are more involved. The system first creates an auto-checkpoint with a timestamped name (like `pre-cleanup-2026-02-28T12-00-00`) so you can roll back if the deletion was a mistake. Then it deletes all matching memories inside a database transaction with per-memory causal edge cleanup and per-memory mutation ledger entries. The entire operation is atomic: either all memories in the folder are deleted or none are. The response includes the checkpoint name and a restore command hint.

### Tier-based bulk deletion (memory_bulk_delete)

For large-scale cleanup operations. Instead of targeting a folder, you target an importance tier: delete all deprecated memories, or all temporary memories older than 30 days. The tool counts affected memories first (so the response tells you exactly how many were deleted), creates a safety checkpoint, then deletes within a database transaction.

Constitutional and critical tier memories receive extra protection. Unscoped deletion of these tiers is refused outright. You must provide a `specFolder` to delete constitutional or critical memories in bulk. The `skipCheckpoint` speed optimization, which skips the safety checkpoint for faster execution, is also rejected for these tiers. If the checkpoint creation itself fails for constitutional/critical, the entire operation aborts. For lower tiers, a checkpoint failure triggers a warning but the deletion proceeds because the risk of losing deprecated or temporary memories is low.

Each deleted memory gets its causal graph edges removed. A single consolidated mutation ledger entry (capped at 50 linked memory IDs to avoid ledger bloat) records the bulk operation. All caches are invalidated after deletion.

### Validation feedback (memory_validate)

Every search result is either helpful or not. This tool lets you record that judgment and triggers several downstream systems based on the feedback.

Positive feedback adds 0.1 to the memory's confidence score (capped at 1.0). Negative feedback subtracts 0.05 (floored at 0.0). The base confidence for any memory starts at 0.5. The asymmetry between positive (+0.1) and negative (-0.05) increments is intentional. It takes one good validation to raise confidence by 0.1 but two bad validations to cancel that out. This bias toward preservation reflects the assumption that a memory might be unhelpful for one query but still valuable for another.

Auto-promotion fires unconditionally on every positive validation. When a normal-tier memory accumulates 5 positive validations, it is promoted to important. When an important-tier memory reaches 10, it is promoted to critical. A throttle safeguard limits promotions to 3 per 8-hour rolling window. Constitutional, critical, temporary and deprecated tiers are non-promotable. The response includes `autoPromotion` metadata showing whether promotion was attempted, the previous and new tier, and the reason.

Negative feedback persistence fires unconditionally on every negative validation. A `recordNegativeFeedbackEvent()` call stores the event in the `negative_feedback_events` table. The search handler reads these events and applies a confidence multiplier that starts at 1.0, decreases by 0.1 per negative validation and floors at 0.3. Time-based recovery with a 30-day half-life gradually restores the multiplier.

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
