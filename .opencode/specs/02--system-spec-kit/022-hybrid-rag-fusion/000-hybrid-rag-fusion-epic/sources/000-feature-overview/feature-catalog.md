---
title: "Memory MCP Server Feature Catalog"
description: "Complete catalog of every feature in the Spec Kit Memory MCP Server, organized by functional area."
trigger_phrases:
  - "feature catalog"
  - "all features"
  - "memory server features"
  - "MCP features"
  - "what can it do"
importance_tier: "important"
---

# Memory MCP Server Feature Catalog

This document catalogs every feature of the Spec Kit Memory MCP Server (`@spec-kit/mcp-server` v1.7.2). Each feature gets a 3-6 sentence description covering what it does, why it exists and how it works technically. Features are organized into seven functional areas: MCP Tools, Search Pipeline, Cognitive Memory, Scoring, Graph Intelligence, Parsing and Indexing, and Infrastructure.

---

## MCP Tool Layer

The MCP server exposes 23 tools organized into seven operational layers. Each layer groups tools by access pattern and risk profile, from high-level orchestration down to low-level maintenance. Token budgets enforce output size limits per layer, ranging from 2,000 tokens at L1 down to 500 tokens at L4.

### Layer 1: Orchestration

#### memory_context

The unified entry point for context retrieval. This tool auto-detects task intent from the input query and routes to the optimal retrieval strategy, combining trigger matching, semantic search, scope filtering and session recovery into a single call. Five modes control behavior: `auto` classifies intent and picks a strategy, `quick` uses fast trigger matching, `deep` runs comprehensive multi-source search, `focused` applies intent-specific weight tuning and `resume` recovers prior session state. The `anchors` parameter filters returned content to specific document sections, which pairs well with resume mode for extracting state and next-steps. Session deduplication prevents returning memories already seen in the current conversation, cutting token usage by roughly 50% on follow-up queries.

### Layer 2: Core

#### memory_search

Performs semantic vector search across all indexed memories. The tool accepts either a natural language `query` string or a `concepts` array of 2-5 terms that must all match (AND logic). Constitutional tier memories always appear at the top of results regardless of query content. Cross-encoder reranking improves relevance by re-scoring initial vector matches, with a length penalty that favors concise memories over verbose ones. Intent-aware retrieval adjusts scoring weights based on task type: `fix_bug` intent boosts implementation memories while `find_decision` intent boosts decision records. The `includeContent` flag embeds full file contents in results, eliminating the need for separate file reads.

#### memory_match_triggers

Matches user prompts against pre-defined trigger phrases stored in memory metadata. This is the fastest retrieval path, as it uses string matching rather than embedding computation. When a `session_id` is provided, cognitive features activate: attention-based decay reduces scores for repeatedly accessed memories, tiered content injection returns full content for HOT memories but only summaries for WARM ones, and co-activation pulls in related memories that frequently appear alongside matches. The tool powers Gate 1 context surfacing, where every new user message triggers a quick scan for relevant prior knowledge.

#### memory_save

Indexes a memory file into the SQLite database by reading the file, extracting metadata (title, trigger phrases, importance tier), generating a vector embedding and storing everything in the index. Pre-flight validation checks anchor format correctness, detects duplicate content via SHA-256 hashing and estimates token budget impact before committing. The `dryRun` flag runs all validation without persisting. A `force` option re-indexes even when the content hash has not changed. The `asyncEmbedding` parameter defers embedding generation for non-blocking saves, storing the memory immediately with a pending status while a background process handles the vector computation.

### Layer 3: Discovery

#### memory_list

Browses stored memories with pagination support. Returns memory entries sorted by creation date, update date or importance weight. The `specFolder` filter restricts results to a single spec folder, and the `includeChunks` flag controls whether chunk child rows appear alongside parent memories. Primary use case: discovering what the system remembers and finding memory IDs needed for update or delete operations. Default page size is 20 entries with a maximum of 100.

#### memory_stats

Reports aggregate statistics about the memory system. Output includes total memory count, date ranges, status breakdown by importance tier and a ranked list of top folders. Four folder ranking modes are available: `count` (by memory quantity), `recency` (most recently updated first), `importance` (by tier distribution) and `composite` (weighted multi-factor score combining all signals). The `excludePatterns` parameter accepts regex patterns to filter out archive or scratch folders from the ranking.

#### memory_health

Runs diagnostic checks on the memory system. In `full` report mode, the tool returns system health indicators including database status, embedding model readiness, server version and provider metadata. The `divergent_aliases` report mode surfaces alias conflicts where the same memory file is indexed under multiple spec folder paths. This mode accepts an optional `specFolder` filter and a `limit` parameter (max 200) to control output size.

### Layer 4: Mutation

#### memory_update

Modifies metadata fields on an existing memory record. Updatable fields include title, trigger phrases, importance weight and importance tier. When content-affecting fields change, the tool regenerates the vector embedding to keep search accuracy aligned with the new metadata. The `allowPartialUpdate` flag controls rollback behavior: when false (default), any embedding regeneration failure reverts all changes. When true, metadata changes persist and the embedding is marked for later re-indexing.

#### memory_delete

Removes memories from the database in two modes. Single-delete mode takes an `id` parameter and removes one specific memory. Bulk-delete mode takes a `specFolder` parameter and removes all memories in that folder, but requires `confirm: true` as a safety gate. The handler clears related caches (tool cache, trigger matcher, constitutional cache) and cleans up causal edges referencing deleted memories.

#### memory_validate

Records usefulness feedback for a specific memory. Pass `wasUseful: true` to increase the memory's confidence score or `wasUseful: false` to decrease it. The confidence tracker maintains a running score and validation count. Memories that accumulate high confidence (0.9+) and sufficient validation counts (5+) become eligible for automatic promotion to the critical tier. This feedback loop ensures frequently valuable memories gain prominence in search results over time.

#### memory_bulk_delete

Deletes memories at scale by importance tier. The `tier` parameter selects which importance level to purge (e.g., `deprecated` or `temporary`). Before deletion, the handler auto-creates a checkpoint for rollback safety, with two protective constraints: unscoped deletion of `constitutional` or `critical` tiers is refused outright, and `skipCheckpoint` is rejected for those same tiers. The `olderThanDays` parameter adds a time filter and `specFolder` scopes deletion to a single folder.

### Layer 5: Lifecycle

#### checkpoint_create

Snapshots the current memory state under a unique name. The snapshot captures all memory records and their metadata at that point in time, enabling later restoration if needed. An optional `specFolder` parameter scopes the checkpoint to a single folder rather than the entire database. Arbitrary metadata can be attached via the `metadata` object parameter.

#### checkpoint_list

Returns all available checkpoints with their names, creation timestamps and associated metadata. An optional `specFolder` filter restricts results to checkpoints scoped to a specific folder. The `limit` parameter defaults to 50. Use this to discover which restoration points exist before calling `checkpoint_restore`.

#### checkpoint_restore

Restores memory state from a previously created checkpoint. When `clearExisting` is true, all current memories are wiped before the checkpoint data is loaded. When false (default), checkpoint data merges with existing state. After restoration, the handler rebuilds internal caches (trigger matcher, BM25 index, confidence tracker) to ensure consistency.

#### checkpoint_delete

Permanently removes a checkpoint by name. This frees the storage used by the snapshot data. The operation is irreversible and the checkpoint can no longer be restored after deletion.

### Layer 6: Analysis

#### task_preflight

Captures an epistemic baseline before task execution begins. The caller records knowledge level (0-100), uncertainty level (0-100) and context completeness (0-100). An optional `knowledgeGaps` array lists specific areas of incomplete understanding. The tool stores these scores in the `session_learning` table, keyed by `specFolder` and `taskId`, providing the "before" measurement that `task_postflight` later compares against.

#### task_postflight

Captures epistemic state after task completion and calculates the learning delta. The tool computes a Learning Index using a weighted formula: LI = (KnowledgeDelta x 0.4) + (UncertaintyReduction x 0.35) + (ContextImprovement x 0.25). Optional `gapsClosed` and `newGapsDiscovered` arrays track how knowledge gaps evolved during the task. The `specFolder` and `taskId` must match a prior preflight record for delta calculation to succeed.

#### memory_drift_why

Traces the causal chain for a memory to answer "why was this decision made?" The tool traverses causal edges up to `maxDepth` hops (default 3, max 10), following links through all six relationship types. The `direction` parameter controls traversal: `outgoing` shows what this memory caused, `incoming` shows what caused it and `both` traces in both directions. Results are grouped by relationship type into flat edge arrays.

#### memory_causal_link

Creates a directed causal relationship between two memories. Six relationship types express different lineage patterns: `caused` and `enabled` for decision lineage, `supersedes` for versioning, `contradicts` for conflicts, `derived_from` for provenance and `supports` for corroboration. The `strength` parameter (0.0-1.0) indicates relationship confidence, defaulting to 1.0. An `evidence` string documents why the link exists.

#### memory_causal_stats

Reports aggregate statistics about the causal memory graph. The output includes total edge count, coverage percentage (what fraction of memories have at least one causal link) and a breakdown by relationship type. The system targets 60% coverage (CHK-065) as the health threshold for causal graph completeness.

#### memory_causal_unlink

Removes a single causal relationship by its edge ID. The edge ID comes from `memory_drift_why` results, where each edge in the flattened chain carries an `id` field. This is the only way to delete causal edges without deleting the memories themselves.

### Layer 7: Maintenance

#### memory_index_scan

Scans the workspace for new or changed memory files and indexes them in batch. The tool walks `specs/**/memory/` directories, constitutional skill directories and (optionally) spec document files. Incremental mode (default) uses mtime checks and content hashing to skip unchanged files, reducing re-index time on large workspaces. The `force` flag ignores change detection and re-indexes everything. Alias conflict detection runs automatically, surfacing cases where the same file appears under multiple spec folder paths.

#### memory_get_learning_history

Retrieves preflight/postflight learning records for a specific spec folder. Each record shows knowledge, uncertainty and context scores at both baseline and completion, along with the computed Learning Index delta. The `onlyComplete` flag filters to records that have both preflight and postflight data. When `includeSummary` is true, the response adds aggregate statistics: average scores, trend direction and total tasks measured.

---

## Search Pipeline

The search pipeline runs five independent retrieval channels in parallel, then merges their ranked outputs through a multi-stage fusion and reranking process. Each channel captures a different dimension of relevance: semantic similarity, lexical matching, term-frequency statistics, causal graph structure and connectivity degree. The orchestrator in `hybrid-search.ts` initializes all channels, collects their ranked lists, applies fusion and passes the fused results through optional diversity reranking before returning the final output.

### Vector Similarity Search

The vector channel stores 768-dimensional embeddings in SQLite via the `sqlite-vec` extension and retrieves candidates by cosine similarity against a query embedding. It accepts filtering options for spec folder, minimum similarity threshold, importance tier and constitutional memory inclusion. Results carry a `similarity` score normalized to a 0-1 range for downstream fusion. Constitutional memories can be surfaced unconditionally through a dedicated cache path that bypasses the similarity threshold. The module also supports multi-concept search, where multiple embedding vectors are queried and their results intersected.

### Full-Text Search (FTS5)

The FTS5 channel queries SQLite's built-in FTS5 virtual table (`memory_fts`) using weighted BM25 scoring with per-column weights. Title matches receive 10x weight, trigger phrases 5x, file path 2x and content text 1x. The raw query is sanitized and split into OR-joined terms to maximize recall across partial matches. FTS5's `bm25()` function returns negative scores (lower is better), so the module negates them to produce positive scores where higher means a stronger match. Results join back to the `memory_index` table to carry full metadata.

### BM25 Statistical Search

The BM25 channel maintains an in-memory inverted index with standard BM25 parameters: k1=1.2 for term frequency saturation and b=0.75 for document length normalization. Input text passes through lowercase conversion, punctuation removal, stop-word filtering (66 common English words) and a simple suffix stemmer that strips -ing, -tion, -ed, -ly, -es and -s endings. IDF (inverse document frequency) is calculated as `log((N - df + 0.5) / (df + 0.5) + 1)`, where N is total document count and df is the number of documents containing the term. Field-level weights mirror the FTS5 column hierarchy: title at 10.0, trigger phrases at 5.0, generic content at 2.0 and body at 1.0.

### Graph Traversal Search

The graph channel queries the `causal_edges` table to find memories connected through directed causal relationships. It first identifies seed memories matching the query via FTS5 full-text search, then retrieves all causal edges where those memories appear as source or target. Scores incorporate both edge strength (a 0-1 float stored per edge) and FTS5 BM25 relevance, multiplied together and sorted descending. Six relationship types are recognized: `caused`, `derived_from`, `enabled`, `contradicts`, `supersedes` and `supports`. When the FTS5 table is unavailable, the module falls back to LIKE-based matching against `memory_index` content.

### Degree Scoring

The degree scoring system computes a typed-weighted degree for each memory node as an independent signal fed into the RRF fusion pipeline as a fifth channel. For each node, it sums `weight_t * strength` across all connected causal edges, where `weight_t` comes from a fixed type-weight table. Raw degree values are hard-capped at 50, then normalized to a 0-0.15 boost range using logarithmic scaling: `log(1 + raw) / log(1 + max)`. The system maintains an in-memory degree cache keyed by memory ID that is invalidated on causal edge mutations. The maximum typed degree across all memories serves as the normalization denominator, with a fallback default of 15 when no edges exist.

### Reciprocal Rank Fusion (RRF)

RRF combines ranked lists from all active channels using the formula `score = weight * 1/(K + rank)` where K defaults to 60, following the Cormack et al. (2009) standard. Each channel's list carries an optional weight multiplier, and the graph channel receives a default 1.5x weight boost when no explicit weight is set. When a result appears in two or more ranked lists, a convergence bonus of 0.10 per additional source is added to its fused score. The multi-list variant processes an arbitrary number of channels with per-source weight tracking and optional score normalization to the 0-1 range. Final results are sorted descending by total RRF score.

### Reciprocal Similarity Fusion (RSF)

RSF is a score-aware alternative to RRF that preserves magnitude information lost in rank-based fusion. Two variants are implemented: a single-pair function and a multi-list function. Both variants extract raw scores from each result, compute per-source min-max normalization, then average the normalized scores for items appearing in multiple lists. Items confirmed by only one source receive a penalty: the single-pair variant multiplies by 0.5, while the multi-list variant scales by `1 / totalSources` proportional to how many sources are missing. All output scores are clamped to the 0-1 range. RSF operates in shadow mode behind the `SPECKIT_RSF_FUSION` feature flag.

### Adaptive Fusion

Adaptive fusion adjusts channel weights based on classified query intent and document type. Seven intent profiles define weight distributions across four dimensions: semantic (vector), keyword (lexical), recency and graph. For example, `find_decision` queries favor the graph channel at 0.50 weight with a 0.15 causal bias, while `fix_bug` queries balance semantic and keyword equally at 0.40 each. Document-type adjustments apply a 0.1 shift: decision documents boost keyword weight at the expense of semantic, while implementation documents boost recency. The module includes a degraded-mode contract that reports which component failed, what fallback was used and the confidence impact.

### MMR Diversity Reranking

Maximal Marginal Relevance (MMR) reranks fused results to reduce redundancy in the final output. The algorithm iteratively selects the candidate that maximizes `lambda * relevance - (1 - lambda) * max_similarity_to_selected`, where lambda controls the trade-off between relevance and diversity. Lambda values are mapped per intent type through `INTENT_LAMBDA_MAP`, with a default fallback of 0.7 (favoring relevance). Cosine similarity between dense embedding vectors determines inter-result similarity. The reranker caps input at 20 candidates and requires a minimum of 2 to activate.

### Intent Classification

The intent classifier assigns one of seven task types to each query: `add_feature`, `fix_bug`, `refactor`, `security_audit`, `understand`, `find_spec` and `find_decision`. Classification uses a two-pass approach: the first pass matches query text against curated keyword lists (12-15 keywords per intent type), and the second pass applies regex patterns that capture multi-word phrases. Each intent receives a composite score, and the classifier returns the top match with a confidence value. The classification result propagates downstream to adaptive fusion weight selection, MMR lambda tuning and cross-encoder reranking behavior.

### Evidence Gap Detection

The evidence gap detector implements a Transparent Reasoning Module (TRM) that performs Z-score analysis on RRF score distributions to identify low-confidence retrieval. A gap is flagged when the top result's Z-score falls below 1.5 or the absolute top score drops under 0.015. The module also includes a graph-topology coverage pre-check that counts memory nodes connected to query-matched graph nodes through inbound edges. When fewer than 3 connected memory nodes are found, an early gap signal fires, allowing the caller to skip full retrieval scatter and save 30-50ms of latency.

### Query Expansion

The query expander generates up to 3 search variants per input query using a rule-based synonym substitution system with no LLM dependency. A domain vocabulary map covers five areas: authentication, errors, architecture, code and the memory system domain. Each query word is matched case-insensitively against the map. The original query is always preserved as the first variant, and one synonym substitution is applied per matched word to avoid over-expanding simple queries.

### Cross-Encoder Reranking

The cross-encoder reranker sorts results by their numeric score in descending order and optionally truncates to a caller-specified limit. It preserves all original fields on each result object and returns a new array without mutating the input. The module serves as the lightweight scoring reranker, distinct from the MMR diversity reranker.

### Causal Neighbor Boost

The causal boost module amplifies scores for results related to top-ranked seed results through causal edge traversal. It selects the top 25% of results (capped at 5) as seed nodes, then walks the `causal_edges` graph up to 2 hops using a recursive CTE in SQLite. Boost magnitude decays with hop distance: `MAX_BOOST_PER_HOP / hopDistance`, capped at 0.05 per hop. Relation types carry weight multipliers during traversal: `supersedes` edges receive 1.5x amplification and `contradicts` edges receive 0.8x attenuation. The combined ceiling for causal plus session boost is hard-capped at 0.20 to prevent runaway score inflation.

### Session-Based Boost

The session boost module promotes memories that received attention within the current conversation session. It queries the `working_memory` table for `attention_score` values associated with the active `session_id`, then multiplies each score by a 0.15 boost multiplier. The resulting boost is capped by a shared combined ceiling of 0.20 (shared with causal boost), so if causal boost already consumed part of the budget, session boost receives only the remaining headroom. When the `SPECKIT_SESSION_BOOST` feature flag is disabled, the module returns an empty boost map.

---

## Cognitive Memory System

The server implements a biologically-inspired cognitive architecture that models how human memory forms, strengthens, decays and is eventually forgotten. Each memory progresses through five states (HOT, WARM, COLD, DORMANT, ARCHIVED) based on FSRS v4 retrievability scores, with attention decay, co-activation spreading and prediction error gating governing how memories surface during retrieval. The system operates across two distinct timescales: FSRS power-law decay for long-term persistent memories measured in days, and linear multiplicative decay for session-scoped working memory measured in minutes.

### Attention Decay

The attention-decay module serves as the facade for all long-term memory decay operations. It delegates to the FSRS v4 scheduler for retrievability calculations using the power-law formula `R(t) = (1 + 19/81 * t/S)^(-0.5)`, where `t` is elapsed days and `S` is stability. Decay rates vary by importance tier: constitutional and critical memories receive a rate of 1.0 (no decay), normal memories decay at 0.80 and temporary memories decay fastest at 0.60. A five-factor composite scoring model combines temporal, usage, importance, pattern and citation scores with configurable weights. The module enforces a minimum score threshold of 0.001, below which memories are considered fully decayed.

### Co-Activation Spreading

When the system retrieves a memory, co-activation spreading boosts semantically related memories so they surface alongside the primary result. The module queries stored similarity relations, capped at 5 related memories per source, and requires a minimum similarity of 70 to qualify for boosting. A fan-effect divisor based on square-root scaling prevents hub nodes from dominating results. The default boost factor of 0.25 was tuned upward from the original spec value of 0.20 for better discovery recall. Spreading activation traverses up to 2 hops with a decay of 0.50 per hop, processing a maximum of 20 spread results.

### FSRS Scheduling

The FSRS scheduler implements the Free Spaced Repetition Scheduler v4 algorithm as the canonical long-term decay model. Retrievability follows the power-law formula `R(t) = (1 + 19/81 * t/S)^(-0.5)`, where stability `S` grows with successful reviews and starts at a default of 1.0. The review system uses four grades: Again (stability drops to 20% of current), Hard (0.8x multiplier), Good (1.0x) and Easy (1.3x), each modified by difficulty and a retrievability bonus. Difficulty is bounded between 1.0 and 10.0, with a default of 5.0. The scheduler calculates optimal review intervals targeting 90% retention by solving for the time at which retrievability equals the desired threshold.

### Prediction Error Gating

The prediction error gate evaluates whether incoming content should create a new memory, update an existing one, supersede it or reinforce it. Four similarity thresholds drive the decision: duplicate at 0.95, high match at 0.85, medium match at 0.70 and low match at 0.50. The module detects contradictions between new and existing content using 8 regex-based patterns covering negation, replacement, deprecation, correction, clarification, prohibition, obsolescence and explicit contradiction. Each pattern type carries a specificity-based confidence score ranging from 0.45 for weak "clarification" signals up to 0.85 for explicit contradiction statements.

### Working Memory

Working memory tracks which memories are actively relevant within a conversation session. Capacity follows Miller's Law at 7 items, with a session timeout of 30 minutes. Attention scores decay using an event-distance model: each intervening event multiplies the score by 0.85, with a floor of 0.05 and a delete threshold of 0.01. Mention-based boosting adds 0.05 per reference, reinforcing memories that the session continues to access. The working memory table tracks provenance metadata including source tool, call ID, extraction rule and redaction status.

### Archival Manager

The archival manager runs as a background job that identifies and archives dormant memories meeting specific criteria. Candidates must be older than 90 days, accessed fewer than 2 times and carry a confidence score below 0.4. Constitutional and critical tier memories are protected from archival regardless of age or access patterns. The background scan runs every 2 hours, processing memories in batches of 50. The module integrates with the BM25 index to remove archived documents from keyword search results and re-add them if unarchival occurs.

### Pressure Monitor

The pressure monitor detects how much of the available token budget the current context consumes and adjusts retrieval behavior accordingly. It classifies pressure into four levels: "none" below 60% usage, "focused" between 60% and 80%, "quick" above 80% and "unavailable" as a fallback. All ratio values are clamped between 0.0 and 1.0. When pressure rises, the memory system switches to more concise retrieval modes that return summaries instead of full content.

### Rollout Policy

The rollout policy controls gradual feature activation through percentage-based gating. A `SPECKIT_ROLLOUT_PERCENT` environment variable (defaulting to 100) determines what fraction of identities receive new features. The module assigns each identity a deterministic bucket using a hash function that multiplies by 31 and applies modulo 100, ensuring consistent assignment across requests. The `isFeatureEnabled` function combines per-feature boolean flags with rollout percentage checks: a flag set to "false" disables the feature entirely, while "true" or unset flags defer to the rollout percentage gate.

### Temporal Contiguity

Temporal contiguity boosts search results when memories were created close together in time. The default proximity window is 3,600 seconds (1 hour), configurable up to a maximum of 86,400 seconds (24 hours). For every pair of results within the window, each member receives a similarity boost calculated as `(1 - timeDelta/windowSeconds) * 0.15`. Memories created at nearly the same moment receive the full 0.15 boost factor, while those near the window boundary receive almost none. The module also provides `getTemporalNeighbors()`, which queries the database for all memories whose creation timestamp falls within the window.

### Tier Classifier

The tier classifier assigns each memory one of five states based on its FSRS retrievability score. HOT requires retrievability above 0.80, WARM above 0.25, COLD above 0.05 and DORMANT above 0.02, with everything below classified as ARCHIVED (also triggered at 90 days of inactivity). Per-tier capacity limits control how many memories of each state appear in results: 5 HOT, 10 WARM, 3 COLD, 2 DORMANT and 1 ARCHIVED. All thresholds are configurable through environment variables with validation that enforces HOT > WARM > COLD ordering.

### Session Deduplication

The session manager prevents the same memory from being sent to an AI agent multiple times within a single conversation. Each session carries a 30-minute TTL and a cap of 100 entries, tracking which memories have already been delivered via content-hash-based fingerprinting. Token savings are estimated at approximately 200 tokens per filtered memory, reported in the `dedupStats` response alongside counts of filtered and total results. Stale sessions are cleaned up automatically: a periodic job runs hourly to purge sessions older than 24 hours. The module also persists session state (spec folder, current task, pending work, context summary), enabling interrupted sessions to be recovered.

---

## Scoring Pipeline

The Spec Kit Memory MCP Server assigns a composite score to every memory at retrieval time. Each memory passes through a multi-factor scoring function, followed by post-processing steps that apply document-type multipliers, cold-start novelty boosts, interference penalties and telemetry sampling. The pipeline supports two scoring models: a primary 5-factor model (REQ-017) and a legacy 6-factor model retained for backward compatibility.

### Composite Scoring

The 5-factor model computes a weighted sum across five dimensions: temporal retrievability (0.25), pattern alignment (0.20), importance (0.25), usage frequency (0.15) and citation recency (0.15). Temporal scoring uses the FSRS v4 power-law formula `R = (1 + 0.235 * t/S)^-0.5`, where `t` is elapsed days and `S` is the memory's stability parameter. Usage score follows `min(1.5, 1.0 + accessCount * 0.05)`, normalized to a 0-1 range. After the weighted sum, a post-processing stage applies document-type multipliers (spec documents get 1.4x, constitutional memories get 2.0x, scratch files get 0.6x), an optional N4 cold-start novelty boost and the TM-01 interference penalty. Optional min-max normalization maps final scores to a `[0, 1]` range when the `SPECKIT_SCORE_NORMALIZATION` environment variable is enabled.

### Importance Tier System

Six tiers govern memory priority: constitutional, critical, important, normal, temporary and deprecated. Each tier carries a base value, a search boost multiplier, a decay flag and an optional auto-expiration period. Constitutional memories receive a 3.0x search boost and never decay. Critical memories receive a 2.0x search boost and also never decay. Important memories carry a 1.5x boost, normal memories use a 1.0x multiplier and do decay over time, temporary memories auto-expire after 7 days with a 0.5x boost, and deprecated memories are excluded from search entirely with a 0.0x boost.

### Interference Scoring

Interference scoring measures redundancy within a spec folder by counting how many sibling memories exceed a text similarity threshold. The system computes Jaccard similarity over word tokens from concatenated title and trigger-phrase fields. When similarity between two memories in the same folder exceeds the 0.75 threshold, the comparison counts as one interference point. The penalty formula `score += -0.08 * interferenceCount` reduces the composite score for each interfering neighbor. A batch computation mode groups memories by spec folder to avoid redundant database queries across large result sets.

### Confidence Tracking

Every memory starts with a baseline confidence score of 0.5. Positive validation feedback increments confidence by 0.1 (capped at 1.0), while negative feedback decrements it by 0.05 (floored at 0.0). The system tracks total validation count alongside the confidence value, wrapping both updates in a database transaction. A memory becomes eligible for promotion to the critical tier when its confidence reaches 0.9 and its validation count reaches 5. Promotion requires an explicit call to `promoteToCritical`, keeping tier changes auditable.

### Folder-Level Relevance

Folder scoring ranks spec folders by a composite formula: `score = (recency * 0.40 + importance * 0.30 + activity * 0.20 + validation * 0.10) * archiveMultiplier`. Recency takes the best score from any memory in the folder, computed as `1 / (1 + days * 0.10)`, which produces 0.59 at 7 days and 0.50 at 10 days. Activity score caps at 1.0 when a folder contains 5 or more memories. Archive detection applies regex patterns for `z_archive/`, `scratch/`, `test-` and `prototype/` paths, applying multipliers of 0.1 to 0.2 that deprioritize those folders. Importance score averages the tier weights of all memories in the folder.

### Score Caching

The cache layer in `lib/cache/scoring/composite-scoring.ts` re-exports all types and functions from the primary composite-scoring module. This barrel pattern provides a stable import path for consumers that need cached or memoized access to scoring functions without coupling directly to the internal module structure. The cache module enables performance optimization by placing a caching boundary between scoring consumers and the computation layer.

---

## Graph Intelligence

The causal graph connects memories through typed directional edges, forming a knowledge graph that captures how decisions relate to each other over time. Each edge stores a source memory, a target memory, a relationship type, a numeric strength value and optional evidence text. This graph powers search boosting, decision lineage tracing, density measurement and typed-degree scoring across the retrieval pipeline.

### Causal Relationships

The system supports six relationship types: `caused`, `enabled`, `supersedes`, `contradicts`, `derived_from` and `supports`. Each type carries a distinct semantic weight in graph computations: `supersedes` receives the highest traversal multiplier at 1.5x, `contradicts` is attenuated to 0.8x and the remaining four types pass through at 1.0x. Edges are stored in the `causal_edges` table with `source_id`, `target_id`, `relation`, `strength` and `evidence` columns. The `memory_causal_link` tool validates the relation type against the allowed set before inserting, rejecting any value outside the six defined types.

### Graph Traversal

Multi-hop traversal uses a recursive Common Table Expression (CTE) in SQLite to walk edges from seed nodes up to a configurable maximum depth. The default traversal depth is 2 hops for search boosting and 3 hops for drift-why lineage queries. Direction control accepts four modes: `outgoing` (forward from source to target), `incoming` (backward from target to source), `both` (bidirectional with deduplication) and the default mode. A hard cap of 10 hops prevents runaway queries in deeply connected subgraphs.

### Causal Link Extraction

The memory parser automatically extracts causal links from YAML metadata blocks embedded in memory files during indexing. The `extractCausalLinks` function scans file content for a `causalLinks:` YAML block and parses five sub-keys: `caused_by`, `supersedes`, `derived_from`, `blocks` and `related_to`. The parser handles both YAML list format (dash-prefixed items) and inline array format (bracket-enclosed, quoted values). Duplicate values within each sub-key are filtered out during extraction. The `ParsedMemory` result includes both the extracted `causalLinks` object and a boolean `hasCausalLinks` flag that indicates whether any sub-key contains at least one entry.

### Decision Lineage

The `memory_drift_why` tool traces the causal chain for a given memory to answer "why was this decision made?" It accepts a memory ID, a maximum traversal depth (default 3), a direction filter and an optional list of relation types to include. The handler builds a tree of `CausalChainNode` objects from the storage layer, then flattens the tree into grouped edge lists organized by each of the six relationship types. When contradicting relationships appear in the chain, the system flags them with a review hint in the response metadata.

### Edge Density Measurement

The `measureEdgeDensity` function computes graph density as the ratio of total edges to unique participating nodes. Four classification bands define graph health: `dense` (density >= 1.0), `moderate` (0.5 to 1.0), `sparse` (below 0.5) and `empty` (zero edges). When density falls below the 0.5 threshold, the system triggers an R10 escalation recommendation with a calculated gap showing how many additional edges are needed to reach the moderate band. Edge density measurement drives scheduling decisions for graph enrichment sprints.

### Graph Feature Flags

Two feature flags control graph behavior at runtime. The `SPECKIT_GRAPH_UNIFIED` flag gates the unified graph search channel that feeds causal edge results into the hybrid search pipeline as a dedicated RRF channel. The `SPECKIT_CAUSAL_BOOST` flag controls whether post-search causal boosting is applied to ranked results. Both flags are evaluated through the `isFeatureEnabled` function in the rollout-policy module. This two-flag design allows operators to enable graph search and graph boosting independently during staged rollouts.

---

## Parsing and Indexing

The parsing and indexing pipeline converts markdown memory files into searchable database records with embedded vector representations. Each file passes through metadata extraction, content hashing, type inference and embedding generation before the server stores it in a SQLite-backed index. This pipeline runs both on-demand (single file saves) and in batch (workspace scan), with incremental checks that avoid redundant work.

### Memory File Parser

The `memory-parser.ts` module reads files with automatic encoding detection, supporting UTF-8, UTF-16 LE and UTF-16 BE byte order marks. It extracts YAML frontmatter fields including title, trigger phrases, context type, importance tier and quality score. Titles undergo normalization: backtick removal, bold-marker stripping, truncation at 120 characters with word-boundary-aware ellipsis. The parser rejects generic titles like "session summary" or "context summary" and returns `null` instead. A SHA-256 content hash computed at parse time enables downstream change detection.

### ANCHOR Section Extraction

Memory files can contain HTML-comment-delimited ANCHOR tags (e.g., `<!-- ANCHOR:summary -->`) that mark retrievable subsections. The `extractAnchors` function scans for opening tags, locates their matching `<!-- /ANCHOR:id -->` closers and returns a map of anchor IDs to trimmed content strings. Callers pass an `anchors` array parameter on search to retrieve only the named sections instead of the full document. This targeted retrieval yields approximately 93% token savings on a 2,000-token document when a single 150-token anchor is requested. The `validateAnchors` function reports unclosed tags and malformed IDs.

### Trigger Phrase Matching

The trigger matcher provides sub-50ms exact-phrase lookup against every indexed memory's trigger phrases. It loads all trigger phrase-to-memory mappings into an in-memory cache with a 60-second TTL, rebuilding from SQLite on expiry. Each phrase compiles to a Unicode-aware regex with extended Latin word boundaries (U+00C0 through U+00FF), stored in an LRU cache capped at 100 entries. User prompts undergo NFC normalization and case folding before matching. Execution time logging flags any match operation exceeding 30ms as slow.

### Entity Scope Detection

The `entity-scope.ts` module classifies a memory's context type from two sources: content keywords and tool usage patterns. Content-based detection scans lowercase text for indicator verbs: "explored" maps to `research`, "implemented" maps to `implementation`, "decided" maps to `decision` and "found" maps to `discovery`. Tool-based detection checks whether Read/Grep/Glob tools constitute the majority of invocations (yielding `research`) or whether AskUserQuestion appears (yielding `decision`). The `buildScopeFilter` function converts a scope object into a parameterized SQL WHERE clause.

### Memory Type Inference

The type inference engine assigns one of 9 cognitive memory types (working, episodic, prospective, implicit, declarative, procedural, semantic, autobiographical, meta-cognitive) through a 5-step cascade. Step 1 checks for an explicit `memory_type` field in YAML frontmatter at confidence 1.0. Step 2 maps the importance tier to a type at confidence 0.9. Step 3 matches file path patterns against 30+ regex rules at confidence 0.8. Step 4 scores keyword matches in the title and trigger phrases at confidence 0.7. Step 5 falls back to "declarative" at confidence 0.5 when no signals match.

### Spec Document Classification

The system recognizes 8 well-known spec folder filenames: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, `research.md` and `handover.md`. The `inferDocumentTypeFromPath` function matches these filenames only when the file resides under a `specs/` directory and outside `memory/` or `scratch/` subdirectories. The `detectSpecLevel` function reads the first 2KB of a spec file looking for a `<!-- SPECKIT_LEVEL: N -->` marker and falls back to a sibling-file heuristic (presence of `decision-record.md` implies Level 3, `checklist.md` implies Level 2). Files under `/constitutional/` directories receive the "constitutional" document type regardless of filename.

### Embedding Generation

The embedding subsystem supports 3 providers through a factory pattern: Voyage AI (cloud, selected when `VOYAGE_API_KEY` is present), OpenAI (cloud, selected when `OPENAI_API_KEY` is present) and HuggingFace Local (`hf-local`, the zero-configuration fallback requiring no API keys). Provider resolution follows a strict precedence: explicit `EMBEDDINGS_PROVIDER` environment variable first, then Voyage, then OpenAI, then hf-local. The provider initializes lazily on first embedding request rather than at server startup, reducing MCP boot time from 2-3 seconds to under 500ms. An LRU embedding cache holds up to 1,000 entries keyed by provider-scoped SHA-256 hashes.

### Incremental Indexing

The incremental indexing module uses a 6-path decision tree to determine whether each file needs processing. Path 1 marks files that exist in the database but not on disk as "deleted". Path 2 flags files absent from the database as "new". Path 3 re-indexes legacy entries that lack a stored mtime. Path 4 applies a fast-path skip when the file's mtime falls within 1 second of the stored value. Path 5 marks files with changed mtime as "modified" for re-indexing. The `categorizeFilesForIndexing` function sorts an entire file list into four buckets: toIndex, toUpdate, toSkip and toDelete.

### Token Budget Management

The context budget optimizer selects search results that fit within a caller-specified token limit, defaulting to 2,000 tokens. Token estimation uses a 4-characters-per-token heuristic, rounding up. When results carry `graphRegion` labels, the selector promotes diversity: it prefers an unseen-region result over a repeated-region result whenever the unseen candidate scores above 50% of the next-best score. Each selected result's token cost accumulates against the budget, and selection halts the moment the next candidate would exceed the remaining capacity.

---

## Infrastructure

The Spec Kit Memory MCP Server runs as a stdio-based MCP process built on `@modelcontextprotocol/sdk`. It initializes a SQLite database, vector search engine, BM25 index, causal graph and cognitive subsystems during a sequenced startup. All output routes through stderr to keep stdout reserved for JSON-RPC communication with the host agent.

### SQLite Database

The primary database uses `better-sqlite3` with WAL journal mode for concurrent read performance. Seven pragmas configure the connection at initialization: `busy_timeout = 10000`, `foreign_keys = ON`, `cache_size = -64000` (64 MB), `mmap_size = 268435456` (256 MB), `synchronous = NORMAL` and `temp_store = MEMORY`. The schema includes a `content_hash TEXT` column on the `memory_index` table, computed as a SHA-256 hex digest, enabling deduplication so identical content is never re-indexed. A minimum SQLite version of 3.35.0 is enforced at startup to guarantee support for `RETURNING` clauses, CTEs and window functions.

### Feature Flag System

The server exposes 26 feature flags, all evaluated through a central `isFeatureEnabled()` function in the rollout-policy module. Twelve flags from specs 137-139 default to enabled, covering core capabilities: RRF fusion, MMR diversity reranking, TRM evidence-gap detection, multi-query expansion, cross-encoder reranking, causal memory graph, spec-doc indexing, extended telemetry, causal boost, session boost, adaptive fusion and pressure policy. Fourteen dark-run flags from Sprint 0-3 (spec 140) default to disabled and require explicit `FLAG=true` environment variables to activate. A `SPECKIT_ROLLOUT_PERCENT` environment variable controls percentage-based rollout using deterministic hashing on session identity.

### Embedding Cache

The embedding cache persists in a dedicated `embedding_cache` table within the main SQLite database. Each entry stores a content hash (SHA-256), model ID, raw embedding blob, dimension count and timestamps for creation and last access. The composite primary key on `(content_hash, model_id)` prevents duplicate entries across different embedding providers. On cache hit, the `last_used_at` timestamp updates to the current time, enabling LRU-based eviction. The `evictOldEntries()` function deletes all entries whose `last_used_at` exceeds a configurable `maxAgeDays` threshold.

### Tool Result Cache

The tool result cache operates as an in-memory `Map` with configurable TTL, maximum entry count and cleanup interval. Default configuration sets a 60-second TTL, a 1,000-entry ceiling and a 30-second cleanup sweep. Cache keys are generated by computing a deterministic hash from the tool name and canonicalized arguments. The cache tracks four statistics (hits, misses, evictions, invalidations) and derives a hit rate percentage from them. Setting `ENABLE_TOOL_CACHE=false` disables the cache entirely.

### Checkpoint System

The checkpoint system creates named snapshots of the memory database state for rollback and recovery. Listing checkpoints returns up to 100 entries (default 50), filterable by spec folder. Restoration via `checkpoint_restore` accepts a `clearExisting` flag that wipes the current state before applying the snapshot. After restoration, the handler rebuilds internal caches (trigger matcher, BM25 index, confidence tracker) to ensure consistency. Deletion removes a named checkpoint permanently and is irreversible.

### Evaluation Database

A separate SQLite database (`speckit-eval.db`) stores evaluation data in 5 tables, isolated from the production memory index. The `eval_queries` table holds evaluation queries with intent type, spec folder, expected memory IDs, difficulty level and category. Per-channel results in `eval_channel_results` record which memories each search channel returned, along with latency and hit counts. The `eval_metric_snapshots` table stores computed metric values per evaluation run, enabling regression detection over time.

### Quality Metrics

The evaluation framework computes 9 metrics organized as 4 core measures and 5 diagnostic indicators. Core metrics include MRR (Mean Reciprocal Rank), nDCG (normalized Discounted Cumulative Gain), recall and hit rate. Diagnostic metrics cover inversion rate, constitutional surfacing rate, importance-weighted recall, cold-start detection rate and intent-weighted nDCG. A quality proxy formula combines four normalized components: average relevance (weight 0.40), top-result relevance (0.25), count saturation (0.20) and a latency penalty (0.15) against a 500 ms target.

### Ground Truth Dataset

The ground truth dataset contains 110 curated query-relevance pairs distributed across 7 intent types and 4 query sources. Sources break down as 21 seed queries, 35 pattern-derived, 14 trigger-derived and 40 manually curated natural-language queries. Complexity tiers distribute queries into 32 simple, 46 moderate and 32 complex cases. The 14 hard-negative queries test the system's ability to reject plausible but irrelevant results. Each query record includes an intent type, complexity tier, category and a human-readable expected result description.

### Error Handling

The error system defines a structured catalog of 40+ error codes organized into 10 categories: embedding, file, database, parameter, search, API/auth, checkpoint, session, memory operations and validation. Each error code maps to a `RecoveryHint` containing a human-readable hint, actionable recovery steps, a severity level and an optional tooltip. The `MemoryError` class extends `Error` with a code, details object and optional recovery hint, serializable to JSON via `toJSON()`. A `withTimeout()` wrapper converts long-running promises into timeout errors with proper timer cleanup.

### Startup Validation

The startup sequence runs two non-critical checks before the server begins accepting tool calls. The Node.js version mismatch detector reads a `.node-version-marker` file recording the Node version, MODULE_VERSION, platform and architecture from the previous install. When the current `process.versions.modules` differs from the recorded value, it warns that native modules may crash and recommends running `rebuild-native-modules.sh`. The SQLite version check queries `sqlite_version()` and verifies the result meets the 3.35.0 minimum.

### Five-State Memory Lifecycle

Memories transition through 5 states based on FSRS retrievability scores: HOT (R >= 0.80), WARM (R >= 0.25), COLD (R >= 0.05), DORMANT (R >= 0.02) and ARCHIVED (below 0.02 or older than 90 days). The tier classifier computes retrievability using the FSRS v4 power-law formula. Constitutional and critical importance tiers receive protection from archival regardless of their retrievability score. The archival manager runs a background job every 2 hours, scanning in batches of 50 for memories matching archival criteria (older than 90 days, fewer than 2 accesses, confidence below 0.4). All thresholds are configurable through environment variables.

---

**Catalog covers 80+ features across 7 functional areas. Last verified: 2026-02-28.**

---
title: "Sprint 1-3 Feature Reference"
description: "New and updated features delivered across Sprints 1, 2 and 3 of the Hybrid RAG Fusion Refinement project."
trigger_phrases:
  - "sprint features"
  - "new features"
  - "sprint 1-3"
  - "feature reference"
  - "what changed"
importance_tier: "important"
---

# Sprint 1-3 feature reference

This document catalogs every new or updated feature delivered across Sprints 1, 2 and 3 of the Hybrid RAG Fusion Refinement project (spec 140). Each feature description covers what it does, why it exists, how it connects to the surrounding pipeline and what specific numbers govern its behavior. All features ship behind dark-run feature flags (default disabled) and require explicit activation via environment variables.

---

## Table of contents

- [Sprint 1: Graph signal activation](#sprint-1-graph-signal-activation)
  - [Typed-weighted degree computation](#typed-weighted-degree-computation)
  - [Edge density measurement](#edge-density-measurement)
  - [Signal vocabulary expansion](#signal-vocabulary-expansion)
  - [Pre-flight token budget estimation](#pre-flight-token-budget-estimation)
  - [Verify-fix-verify quality loop](#verify-fix-verify-quality-loop)
  - [Co-activation fan-effect fix](#co-activation-fan-effect-fix)
  - [Agent-as-consumer UX instrumentation](#agent-as-consumer-ux-instrumentation)
- [Sprint 2: Scoring calibration](#sprint-2-scoring-calibration)
  - [Persistent embedding cache](#persistent-embedding-cache)
  - [Cold-start N4 boost](#cold-start-n4-boost)
  - [G2 double intent weighting resolution](#g2-double-intent-weighting-resolution)
  - [Min-max score normalization](#min-max-score-normalization)
  - [Interference scoring](#interference-scoring)
  - [Classification-based decay](#classification-based-decay)
  - [K-value sensitivity analysis](#k-value-sensitivity-analysis)
  - [Observability logging](#observability-logging)
  - [Folder-level relevance scoring](#folder-level-relevance-scoring)
- [Sprint 3: Query intelligence](#sprint-3-query-intelligence)
  - [Query complexity classifier](#query-complexity-classifier)
  - [Query router](#query-router)
  - [Reciprocal similarity fusion](#reciprocal-similarity-fusion)
  - [Channel min-representation](#channel-min-representation)
  - [Confidence truncation](#confidence-truncation)
  - [Dynamic token budget](#dynamic-token-budget)
  - [Folder discovery](#folder-discovery)

---

## Sprint 1: Graph signal activation

Sprint 1 activated the causal graph's structural connectivity as a fifth RRF retrieval channel and established edge density as a health metric for deciding when graph-deepening work is needed. It also expanded signal detection, added a quality verification loop for memory saves and fixed a fan-effect problem in co-activation spreading.

### Typed-weighted degree computation

The degree channel scores each memory by the weighted sum of its causal graph connections, computing `typed_degree(node) = SUM(weight_t * strength)` across all edges where the memory appears as source or target. Six edge types carry distinct weights that reflect their informational strength: `caused` at 1.0, `derived_from` at 0.9, `enabled` at 0.8, `contradicts` at 0.7, `supersedes` at 0.6 and `supports` at 0.5. The raw degree value is hard-capped at `MAX_TOTAL_DEGREE` of 50 before normalization to prevent a single hub node from dominating search results. Normalization uses logarithmic scaling, `log(1 + raw) / log(1 + max)`, which compresses the score into a sublinear curve, then clamps the result to a `DEGREE_BOOST_CAP` of 0.15. Constitutional memories are excluded from degree computation because their graph connections would inflate scores artificially, and the exclusion is enforced by querying `memory_index` for the `importance_tier = 'constitutional'` predicate before computing any degrees. The global maximum typed degree across all nodes is recomputed per batch call (not cached), falling back to `DEFAULT_MAX_TYPED_DEGREE` of 15 when no edges exist. An in-memory `degreeCache` (a `Map<string, number>`) stores computed boost scores between calls and must be explicitly cleared via `clearDegreeCache()` whenever causal edges are inserted, updated or deleted.

### Edge density measurement

Edge density quantifies how well-connected the causal graph is by computing the ratio of total causal edges to unique participating nodes: `density = edgeCount / nodeCount`, where nodes are the union of all `source_id` and `target_id` values in the `causal_edges` table. The module issues three SQL queries to gather its inputs: a `COUNT(*)` on `causal_edges`, a `COUNT(*)` on the `UNION` of source and target IDs, and a `COUNT(*)` on `memory_index` for total memory coverage context. Results are classified into four bands: "dense" at density >= 1.0, "moderate" between 0.5 and 1.0, "sparse" below 0.5 and "empty" at zero edges. When density falls below the 0.5 moderate threshold, the system generates an R10 escalation recommendation. That recommendation computes the exact number of additional edges needed (`ceil(0.5 * nodeCount) - edgeCount`), suggests prioritizing causal links for constitutional and critical tier memories first, and warns that R4 typed-degree scoring will revert to uniform (degree=0) for most nodes at low density. The `formatDensityReport()` function produces a multi-line human-readable report with all metrics, suitable for logs or console output. On any SQL failure, the module returns a safe default result with density 0, classification "sparse" and `r10Escalation: true`.

### Signal vocabulary expansion

The trigger matcher detects two new signal categories in user prompts: CORRECTION signals triggered by keywords like "actually", "wait", "i was wrong", "correction", "not quite", "let me rephrase" and "that's not right", and PREFERENCE signals triggered by "prefer", "like", "want", "always use", "never use", "i want" and "please use". CORRECTION signals carry a boost weight of 0.2 because they indicate stronger search intent: a user correcting themselves usually means they need different context than what was previously retrieved. PREFERENCE signals carry a lower weight of 0.1. The feature is gated behind the `SPECKIT_SIGNAL_VOCAB` environment variable and signal detection runs through `detectSignals()`, which normalizes the prompt via NFC Unicode normalization and lowercase folding before matching each keyword with word-boundary-aware regex. When active, `applySignalBoosts()` applies the total boost additively to each matched memory's `importanceWeight`, capping the result at 1.0. The detection runs inside `matchTriggerPhrasesWithStats()`, so signal boosts compose naturally with the existing trigger matching and importance weighting pipeline.

### Pre-flight token budget estimation

Before assembling the final search response, the system estimates the token footprint of each candidate result by summing serialized key-value character lengths and dividing by 4, the chars-per-token heuristic. The default budget is 2,000 tokens, configurable via the `SPECKIT_TOKEN_BUDGET` environment variable. When the candidate set exceeds the budget, a greedy highest-scoring-first strategy accepts results until the budget fills, discarding the remainder. All overflow events are logged with `query_id`, `candidate_count`, `total_tokens`, `budget_limit` and `truncated_to_count` for the eval infrastructure. This pre-flight check is important because downstream agents have finite context windows, and sending 8,000 tokens of retrieval results when 2,000 would suffice wastes capacity that the agent needs for reasoning. The estimation runs before any response formatting, which means it operates on raw result objects, not the final serialized output. The 4 chars-per-token ratio is a rough heuristic calibrated to typical English text with markdown formatting. Actual token counts can vary by model tokenizer, but the heuristic is close enough for budget enforcement.

### Verify-fix-verify quality loop

After each memory save, the quality loop computes a composite quality score from four weighted dimensions: trigger phrase coverage at 0.25, anchor format correctness at 0.30, token budget compliance at 0.20 and content coherence at 0.25. The threshold for passing is 0.6, and the loop is gated behind the `SPECKIT_QUALITY_LOOP` environment variable. Memories scoring below threshold enter an auto-fix cycle that re-extracts trigger phrases from headings, closes unclosed ANCHOR tags and trims content to the 8,000-character budget (2,000 tokens at 4 chars per token). The loop retries up to 2 times by default (configurable via `maxRetries`), but it short-circuits if a fix attempt produces no changes, since repeating the same fixes will not improve the score. If the score remains below 0.6 after all attempts, the memory is rejected with a logged rejection reason that includes the final numeric score and a semicolon-separated list of outstanding issues. When the loop is disabled, the system still computes the quality score for visibility but always returns `passed: true`, so you can observe score distributions without blocking saves. Quality metrics are logged to the `eval_metric_snapshots` table when `SPECKIT_EVAL_LOGGING` is enabled, recording the score breakdown, attempt count and pass/reject status.

### Co-activation fan-effect fix

Co-activation spreading increases the scores of related memories based on graph proximity, but hub nodes with many connections dominated results without any attenuation. A node with 25 outgoing relations would receive 25x the base boost, which is absurd when most nodes have 2 or 3. The fix applies an R17 fan-effect divisor using `sqrt(max(1, relatedCount))` to scale the raw boost sublinearly: a node with 25 relations now receives 5x the boost instead of 25x. The base boost factor was raised from the original 0.1 to a default of 0.25, configurable via the `SPECKIT_COACTIVATION_STRENGTH` environment variable, to compensate for the divisor dampening. The system caps related lookups at 5 per memory to bound traversal cost, and a 30-second TTL cache bounded at 100 entries prevents repeated graph walks for the same node within a single search session. Without this fix, heavily connected constitutional memories would dominate every search result, crowding out the specific context that agents need.

### Agent-as-consumer UX instrumentation

This feature adds observability hooks to the `memory_search` and `memory_context` response paths to capture how downstream agents consume retrieval results. Each instrumentation event logs the query text, the number of results returned, which result IDs the agent selected and which it ignored. The data feeds an initial pattern report that identifies consumption categories, establishing a baseline for measuring whether retrieval improvements translate into better agent selection behavior. The instrumentation is non-blocking and fail-safe: it never modifies the results themselves and catches all errors silently. Understanding agent consumption patterns matters because a retrieval system can return perfectly relevant results that agents ignore due to formatting or ordering, and without this instrumentation that failure mode is invisible.

---

## Sprint 2: Scoring calibration

Sprint 2 resolved a 15:1 magnitude mismatch between RRF fusion scores and composite scores, added an embedding cache to cut redundant API calls during re-indexing and introduced mechanisms for new memory visibility and redundancy detection.

### Persistent embedding cache

The embedding cache eliminates redundant API calls during re-indexing by storing generated embeddings in a SQLite `embedding_cache` table keyed on SHA-256 content hash and model ID. The table uses a composite primary key of `(content_hash, model_id)` with columns for `embedding` (BLOB), `dimensions` (INTEGER), `created_at` and `last_used_at` timestamps. When content has not changed, `lookupEmbedding()` returns the stored embedding buffer and updates `last_used_at` in a single transaction, taking well under 1ms. Cache writes use `INSERT OR REPLACE`, so duplicate key pairs are overwritten with the latest embedding. LRU eviction is supported via `evictOldEntries(maxAgeDays)`, which deletes all entries whose `last_used_at` predates the threshold. The `getCacheStats()` function provides aggregate statistics including total entries, total size in bytes, oldest entry timestamp and newest entry timestamp. Content hashing uses Node's `createHash('sha256')` on UTF-8 encoded input, matching the hashing pattern used elsewhere in the codebase. A soft warning is issued at 10,000 entries to prompt manual cleanup or eviction policy review.

### Cold-start N4 boost

New memories are penalized by FSRS temporal decay, which was designed for spaced repetition scheduling, not information retrieval. A freshly created memory has no review history, so FSRS assigns it low retrievability from the start. The cold-start boost counteracts this with an exponential decay formula: `boost = 0.15 * exp(-elapsed_hours / 12)`. This produces a +0.15 score addition at hour 0, decaying to approximately 0.055 at 12 hours, 0.020 at 24 hours and 0.003 at 48 hours, at which point the boost is negligible and FSRS takes over naturally. The 48-hour window is enforced with a hard cutoff: `if (elapsedHours > 48) return 0`. The boost is applied before FSRS temporal decay in the composite scoring pipeline and hard-capped at a combined score of `NOVELTY_BOOST_SCORE_CAP` (0.95) to prevent inflation of results that already score highly. The feature is gated behind the `SPECKIT_NOVELTY_BOOST` environment variable and the constants `NOVELTY_BOOST_MAX`, `NOVELTY_BOOST_HALF_LIFE_HOURS` and `NOVELTY_BOOST_SCORE_CAP` are exported for use by the scoring observability module.

### G2 double intent weighting resolution

An investigation traced intent weight application through three files: `hybrid-search.ts`, `intent-classifier.ts` and `adaptive-fusion.ts`. The concern was that intent weights were being applied twice, once in fusion and once in composite scoring. The finding classified the apparent double-weighting as intentional design, not a bug. System A in `adaptive-fusion.ts` controls channel fusion weights, determining how much each retrieval channel (vector, FTS, BM25, graph, degree) contributes to RRF ranking. System B in `intent-classifier.ts` controls result attribute weights, determining how similarity, importance and recency combine into a final composite score. The two systems operate at different pipeline stages with independent responsibilities. Merging them would conflate "which channels matter for this query type" with "how to weigh result attributes once retrieved", which are distinct concerns.

### Min-max score normalization

The dual scoring systems had a 15:1 magnitude mismatch: RRF fusion scores range approximately 0 to 0.07 while composite scores range 0 to 1. Without normalization, composite scores completely dominate final ranking because their absolute values are an order of magnitude larger. Min-max normalization maps both score distributions into the [0,1] range using `(score - min) / (max - min)`. When all scores in a result set are identical (max equals min), they normalize to 1.0 instead of producing a division-by-zero error. Single-result sets also normalize to 1.0. The feature is gated behind the `SPECKIT_SCORE_NORMALIZATION` environment variable and applies at the result-set level so that both scoring systems contribute proportionally to final ranking. The implementation exports both `normalizeCompositeScores()` for batch normalization and `isCompositeNormalizationEnabled()` for feature-flag checking by other modules, such as channel-representation which requires normalized scores for its quality floor to be meaningful.

### Interference scoring

Interference scoring detects and penalizes redundant memories that cluster within the same spec folder. At index time, the system counts sibling memories in the same `spec_folder` whose text similarity exceeds a threshold of 0.75, then stores that count as `interference_score` in the `memory_index` table. Text similarity uses a Jaccard-like computation on word tokens extracted from the concatenated title and trigger phrases: `|A intersection B| / |A union B|`, with words tokenized by splitting on whitespace, commas, semicolons and pipes, then filtering words shorter than 3 characters. During composite scoring, the penalty applies as `score += -0.08 * interference_score`, so a memory with 3 interfering siblings loses 0.24 from its composite score. The feature is gated behind the `SPECKIT_INTERFERENCE_SCORE` flag. A batch computation function `computeInterferenceScoresBatch()` groups memories by folder and builds per-folder text maps to avoid redundant database queries. The 0.75 threshold and -0.08 coefficient are stored as named exported constants (`INTERFERENCE_SIMILARITY_THRESHOLD` and `INTERFERENCE_PENALTY_COEFFICIENT`) to allow future tuning based on eval results.

### Classification-based decay

Standard FSRS decay treats all memories identically regardless of their semantic permanence or organizational importance. A constitutional-tier decision record and a temporary scratch note both decay at the same rate, which makes no sense. TM-03 introduces a two-dimensional stability multiplier matrix operating on the FSRS stability parameter. The `context_type` dimension assigns: decisions get `Infinity` (zero decay, retrievability always 1.0), research gets `2.0` (doubled stability, slower decay), and implementation, discovery and general get `1.0` (standard schedule). The `importance_tier` dimension assigns: constitutional and critical get `Infinity` (never decay), important gets `1.5`, normal gets `1.0`, temporary gets `0.5` (2x relative decay speed) and deprecated gets `0.25` (4x relative decay speed). The combined multiplier is `contextMult * tierMult`, where any `Infinity` factor produces infinite stability that yields `R(t) = 1.0` for all elapsed time. This multiplier system is distinct from the `TIER_MULTIPLIER` in `fsrs-scheduler.ts` that operates on elapsed time, not on stability. The feature is gated behind `SPECKIT_CLASSIFICATION_DECAY`, and the code explicitly warns against applying both multiplier systems to the same memory.

### K-value sensitivity analysis

The RRF fusion constant K controls how steeply rank position penalizes results in the formula `1/(K + rank)`. A small K (like 20) amplifies rank position influence, favoring top-ranked results. A large K (like 100) flattens the curve, giving lower-ranked results more weight. This analysis module runs a grid search over K values in {20, 40, 60, 80, 100} against a baseline of K=60 (the production default). For each candidate K, the module computes Kendall tau rank correlation, which measures pairwise ranking agreement between candidate and baseline orderings, and MRR@5, which evaluates how well each K value preserves the baseline's top-5 result positions. The combination of these two metrics captures both overall ranking stability (tau) and practical top-of-list fidelity (MRR). High tau with low MRR would indicate that the overall ranking is similar but the specific top results differ, which is the failure mode that matters most for retrieval.

### Observability logging

The scoring observability module records N4 cold-start boost values and TM-01 interference penalties at query time. Observations are sampled at 5% of queries via `Math.random() < 0.05` to avoid performance overhead on the hot scoring path. Each observation persists to a `scoring_observations` SQLite table with 12 columns: `id`, `memory_id`, `query_id`, `timestamp`, `novelty_boost_applied`, `novelty_boost_value`, `memory_age_days`, `interference_applied`, `interference_score`, `interference_penalty`, `score_before` and `score_after`. The entire logging path is fail-safe: `initScoringObservability()` catches errors during table creation, `logScoringObservation()` catches insert errors, and `getScoringStats()` catches query errors. None of these functions throw exceptions. The `getScoringStats()` function computes aggregate statistics including average novelty boost, average interference penalty, percentage of observations with each feature active, and average score delta across all logged observations. Scoring behavior remains identical whether observability is active or inactive.

### Folder-level relevance scoring

Folder-level scoring aggregates individual memory scores into a per-folder composite using a four-factor weighted formula: `score = recency * 0.40 + importance * 0.30 + activity * 0.20 + validation * 0.10`. Recency takes the highest score from any memory in the folder, so one recently updated memory keeps the whole folder visible. Importance computes a weighted average across tier weights: constitutional at 1.0, critical at 1.0, important at 0.8, normal at 0.5, temporary at 0.3 and deprecated at 0.1. Activity is based on memory count within the folder, capped at a configurable maximum for the ceiling score to prevent large folders from dominating by sheer volume. The spec defines a future DocScore aggregation formula `FolderScore(F) = (1/sqrt(M+1)) * SUM(MemoryScore(m))` with a square-root damping factor that further constrains the volume advantage.

---

## Sprint 3: Query intelligence

Sprint 3 introduced query-level routing for speed optimization, evaluated RSF as a score-aware alternative to RRF and enforced channel diversity guarantees in the final result set. It also added confidence-based truncation to remove low-relevance tail results and dynamic token budgets that scale with query complexity.

### Query complexity classifier

The classifier assigns every incoming query to one of three tiers: simple, moderate or complex. The classification boundaries are defined by two constants: `SIMPLE_TERM_THRESHOLD` at 3 and `COMPLEX_TERM_THRESHOLD` at 8. Queries with 3 or fewer whitespace-delimited terms or an exact trigger phrase match classify as simple. The trigger match check is case-insensitive and overrides term count: even a 20-word query classifies as simple if it matches a trigger phrase exactly. Queries exceeding 8 terms with no trigger match classify as complex, and everything in between falls into the moderate tier. The classifier also computes a stop-word ratio (using a 37-word English stop-word set) and uses it alongside term count and trigger match status to assign a confidence label of "high", "medium" or "low". When the `SPECKIT_COMPLEXITY_ROUTER` feature flag is disabled or classification fails, the classifier returns "complex" with confidence "fallback", which is the safe default that preserves full pipeline execution. On any exception, the catch block returns the same complex-fallback result instead of propagating errors into the search pipeline.

### Query router

The query router maps classifier tiers to channel subsets so that simple queries skip retrieval channels they do not need. The default routing configuration maps simple queries to 2 channels (vector + fts), moderate queries to 3 channels (vector + fts + bm25) and complex queries to the full 5-channel pipeline (vector + fts + bm25 + graph + degree). A hard minimum of 2 channels is enforced at all times through `enforceMinimumChannels()`, which pads any tier configuration that drops below the floor with vector and fts as fallbacks. The convenience function `routeQuery()` combines classification and routing into a single call, returning the tier, selected channels and full classification details. When the `SPECKIT_COMPLEXITY_ROUTER` feature flag is disabled, `routeQuery()` returns all 5 channels regardless of the classification result, ensuring that disabling the flag always reverts to full-pipeline behavior. The routing configuration is defined as a typed `ChannelRoutingConfig` interface, so custom configurations can be injected for testing or experimentation without modifying the defaults.

### Reciprocal similarity fusion

RSF is a score-aware alternative to Reciprocal Rank Fusion. RRF discards magnitude information by relying on rank positions alone, which means a result that scores 0.95 in one channel and 0.10 in another gets the same RRF contribution as one scoring 0.50 and 0.50. RSF preserves score magnitude through min-max normalization before fusion. The implementation ships with three variants behind the `SPECKIT_RSF_FUSION` feature flag. Single-pair fusion (`fuseResultsRsf`) normalizes scores within each of two lists, then averages normalized scores for items appearing in both lists and applies a 0.5 penalty for items appearing in only one source. Multi-list fusion (`fuseResultsRsfMulti`) extends this to N lists with a proportional penalty of `avgScore * (countPresent / totalSources)` for partially-represented items. Cross-variant fusion (`fuseResultsRsfCrossVariant`) merges results across query interpretations, fusing each variant independently first, then averaging across variants with a +0.10 bonus per additional variant appearance to reward convergence. All scores are clamped to [0, 1] after fusion. The score extraction function checks for `score`, then `similarity`, then falls back to rank-based scoring (`1 - rank / total`) when neither explicit score field exists.

### Channel min-representation

Channel min-representation guarantees that every retrieval channel contributing results appears at least once in the final top-k set. Without this guarantee, a channel that returns relevant but lower-scoring results can be shut out by high-scoring results from other channels, wasting the compute spent running that channel. The enforcement scans top-k results for missing channels (checking both the `source` field and any `sources` array for multi-channel convergence items), then promotes the highest-scoring result from each under-represented channel, provided its score meets the `QUALITY_FLOOR` of 0.2. That floor is important: it prevents promoting irrelevant results and it assumes normalized [0,1] scores, so `SPECKIT_SCORE_NORMALIZATION` should be enabled alongside `SPECKIT_CHANNEL_MIN_REP` for correct behavior with raw RRF scores that range around 0.01-0.03. Channels that returned zero results receive no phantom penalty and are skipped, since there is nothing to promote. Promoted items are appended to the top-k window and the full result list is re-sorted by score descending. The `EnforcementResult` return type includes metadata with the number of promoted items, the under-represented channel names and per-channel counts in the final set.

### Confidence truncation

Confidence truncation removes low-relevance tail results by detecting score cliffs in the ranked output. The algorithm computes consecutive score gaps between adjacent results (`gap[i] = score[i] - score[i+1]`), calculates the median gap across all positions, then truncates at the first position at or beyond index 2 (the `DEFAULT_MIN_RESULTS - 1` boundary) where the gap exceeds `GAP_THRESHOLD_MULTIPLIER * medianGap` (2x the median). The 2x multiplier is an elbow heuristic: a gap twice the typical spread signals a relevance cliff where subsequent results are qualitatively worse, not marginally worse. A hard minimum of 3 results is always preserved regardless of gap analysis. When the median gap is zero (all scores identical), truncation is skipped because no meaningful relevance boundary exists. NaN and Infinity scores are filtered out before gap computation, and results are defensively sorted descending even though callers should pre-sort for efficiency. The feature is gated behind `SPECKIT_CONFIDENCE_TRUNCATION` and the `TruncationResult` includes full audit metadata: original count, truncated count, cutoff index, median gap and cutoff gap values.

### Dynamic token budget

Dynamic token budget allocation adjusts the returned context size based on query complexity tier instead of applying a uniform cap. Simple queries receive 1,500 tokens, moderate queries receive 2,500 tokens and complex queries receive 4,000 tokens. The rationale is that a simple trigger-phrase lookup needs far less context than a multi-concept research query. Sending 4,000 tokens for "what is the FSRS formula" wastes context window capacity that the agent could use for reasoning. When the `SPECKIT_DYNAMIC_TOKEN_BUDGET` flag is disabled, all queries default to the 4,000-token complex budget with `applied: false` in the result, maintaining backward compatibility. The budget applies to total returned content across all results, not per individual result. Custom budget configurations can be injected via the optional `config` parameter, and the `BudgetResult` return type includes the tier, allocated budget and whether dynamic allocation was active.

### Folder discovery

Folder discovery generates cached 1-sentence descriptions for each spec folder to enable lightweight query routing before vector search. The system scans spec base paths for `spec.md` files, reading each synchronously (this is a build-time/cache generation function, not a hot path). Description extraction uses a three-pass strategy: first the top-level `#` heading, then a "Problem Statement" or "Problem & Purpose" section (scanning up to 10 lines ahead for the first non-empty, non-heading line), then the first non-empty content line as a fallback. Extracted descriptions are trimmed to 150 characters and stored alongside keywords in a `descriptions.json` cache file. Keyword extraction lowercases, splits on non-alphanumeric boundaries, removes words shorter than 3 characters, filters a 90-word English stop-word set and deduplicates. Relevance scoring uses keyword-overlap matching, computing `matchCount / totalQueryTerms` with a fallback to substring matching in the description when a query term is not found in the keyword set. Nested spec folders (phase subfolders) are also discovered by scanning one level deeper for child directories containing `spec.md`. The cache I/O functions `loadDescriptionCache()` and `saveDescriptionCache()` handle JSON serialization and create parent directories as needed.

---

**Document covers 23 features across 3 sprints. All features are gated behind `SPECKIT_*` environment variables and default to disabled.**
