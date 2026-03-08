# Undocumented Features Scan — MCP Server vs Feature Catalog

> **Date:** 2026-03-07
> **Method:** 10 GPT-5.4 agents scanned 203 TypeScript source files against the 156-feature catalog
> **Raw findings:** 91 | **After dedup + false-positive removal:** 55 genuine gaps

---

## Executive Summary

The scan found **55 undocumented or significantly under-documented capabilities** across the MCP server codebase. These fall into three tiers:

- **17 High-significance gaps** — Major capabilities with no catalog coverage
- **25 Medium-significance gaps** — Substantial sub-features or extensions not mentioned
- **13 Low-significance gaps** — Infrastructure details or minor extensions

Most gaps are in the **infrastructure/operational layer** (server lifecycle, crash recovery, circuit breakers) and the **cognitive/scoring subsystems** (FSRS scheduling, working memory, type taxonomy) — areas the catalog describes at a high level but whose implementation depth far exceeds the documentation.

---

## High-Significance Gaps (17)

### Server & Operations

| # | Feature | Source File(s) | Description |
|---|---------|----------------|-------------|
| 1 | **Standalone Admin CLI** | `cli.ts` | Non-MCP `spec-kit-cli` entry point for database maintenance: stats, bulk-delete, reindex, schema-downgrade |
| 2 | **Cross-Process DB Hot Rebinding** | `core/db-state.ts` | Shared marker file detects external mutations → reopens DB → rebinds hybrid search, checkpoints, session manager, etc. |
| 3 | **Startup Pending-File Recovery** | `context-server.ts` | Boot-time scan for `_pending` files from failed write/index ops; attempts automatic recovery before normal startup |
| 4 | **Watcher Delete/Rename Cleanup** | `context-server.ts` | File watcher removes indexed rows when watched files are deleted or renamed, keeping DB in sync with filesystem |

### Save Path & Mutation

| # | Feature | Source File(s) | Description |
|---|---------|----------------|-------------|
| 5 | **Prediction-Error Save Arbitration** | `handlers/pe-gating.ts`, `save/pe-orchestration.ts` | 5-action decision engine: CREATE, UPDATE, SUPERSEDE, REINFORCE, or CREATE_LINKED based on similarity + contradiction detection |
| 6 | **PE Conflict Audit Journal** | `handlers/pe-gating.ts`, `cognitive/prediction-error-gate.ts` | `memory_conflicts` table logs similarity, action, contradiction flag, reason, spec-folder metadata |
| 7 | **Per-Spec-Folder Save Mutex** | `handlers/memory-save.ts` | In-process lock serializes saves per spec folder, preventing TOCTOU races across dedup/chunking/indexing |
| 8 | **Dry-Run Preflight for memory_save** | `handlers/memory-save.ts` | Non-mutating validation returns structured pass/fail, warnings, and remediation hints without writing |
| 9 | **Atomic Write-Then-Index API** | `handlers/memory-save.ts` | `atomicSaveMemory()` writes to disk then indexes async with partial-success reporting + `getAtomicityMetrics()` |

### Discovery & Indexing

| # | Feature | Source File(s) | Description |
|---|---------|----------------|-------------|
| 10 | **Spec Document Discovery + Level Inference** | `handlers/memory-index-discovery.ts` | Auto-detects 8 spec doc types from both `specs/` roots, dedupes canonically, infers spec level from markers/siblings |
| 11 | **Auto Spec-Document Causal Chains** | `handlers/memory-index.ts`, `storage/causal-edges.ts` | Automatically links spec artifacts: spec → plan → tasks → implementation_summary + support edges |
| 12 | **Declarative Causal Link Ingestion** | `handlers/causal-links-processor.ts` | Memory frontmatter `caused_by`/`supersedes`/`derived_from`/`blocks`/`related_to` resolved to graph edges |

### Search & Retrieval

| # | Feature | Source File(s) | Description |
|---|---------|----------------|-------------|
| 13 | **Deferred Lexical-Only Indexing** | `search/vector-index-mutations.ts` | Memories searchable via FTS/BM25 before vector embeddings are ready |
| 14 | **Provider-Based Neural Reranking** | `search/cross-encoder.ts` | Pluggable Voyage/Cohere/local reranker with cache, latency tracking, length penalties |
| 15 | **Quality-Aware 3-Tier Fallback** | `search/hybrid-search.ts` | Degrades: hybrid → widened all-channel → structural SQL; records degradation events |
| 16 | **Causal Neighbor Boost + Injection** | `search/causal-boost.ts` | 2-hop graph traversal seeds from top results, injects previously absent neighbors |
| 17 | **Artifact-Class Retrieval Routing** | `search/artifact-routing.ts` | 9 artifact classes with per-class weighting, recency bias, boost factor, max-result policies |

---

## Medium-Significance Gaps (25)

### Cognitive & Scoring

| # | Feature | Source File(s) | Description |
|---|---------|----------------|-------------|
| 18 | **FSRS v4 Review Scheduling** | `cognitive/fsrs-scheduler.ts` | Full retrievability/difficulty/stability/interval/next-review engine |
| 19 | **Automatic Archival Subsystem** | `cognitive/archival-manager.ts` | Background scans, archive/unarchive, BM25 sync, archival stats |
| 20 | **Session-Scoped Working Memory** | `cognitive/working-memory.ts` | Dedicated store: attention scores, event decay, LRU, provenance/redaction metadata |
| 21 | **Hybrid Spreading Activation** | `cognitive/co-activation.ts` | Traverses both similarity relations AND causal edges, merges neighbors, propagates decay |
| 22 | **Temporal Contiguity Layer** | `cognitive/temporal-contiguity.ts` | Time-proximity boosting, temporal neighbors, timeline views |
| 23 | **9-Type Memory Taxonomy + Inference** | `config/memory-types.ts`, `config/type-inference.ts` | Types with half-lives/auto-expiry; multi-signal inference from frontmatter, tier, path, keywords |
| 24 | **Document-Type-Aware Scoring** | `scoring/composite-scoring.ts` | Per-type multipliers and keyword bonuses for spec, decision_record, plan classes |

### Evaluation & Telemetry

| # | Feature | Source File(s) | Description |
|---|---------|----------------|-------------|
| 25 | **Diagnostic Retrieval Metrics Suite** | `eval/eval-metrics.ts` | Inversion rate, constitutional surfacing rate, importance-weighted recall, cold-start detection, F1, intent-weighted NDCG |
| 26 | **BM25 Contingency Gate** | `eval/bm25-baseline.ts` | PAUSE/RATIONALIZE/PROCEED decision framework with bootstrap 95% CI for MRR@5 |
| 27 | **Feedback-Driven Ground-Truth Expansion** | `eval/ground-truth-feedback.ts` | User selections + LLM-judge labels, agreement scoring, corpus-size tracking by source |
| 28 | **Ground-Truth Diversity Gate** | `eval/ground-truth-generator.ts` | Hard-gate validation: intent/complexity coverage, manual query quota, hard negatives, dupes |
| 29 | **Ablation Significance Testing** | `eval/ablation-framework.ts` | Two-sided sign test with per-channel helped/hurt/unchanged and p-values |
| 30 | **Exclusive Contribution Rate** | `eval/channel-attribution.ts` | Per-channel ECR: unique-supply vs convergence frequency |
| 31 | **Extended Retrieval Telemetry** | `telemetry/retrieval-telemetry.ts` | Stage-level latency, mode/override/fallback state, quality-proxy inputs, sanitized traces |

### Infrastructure

| # | Feature | Source File(s) | Description |
|---|---------|----------------|-------------|
| 32 | **Durable Ingest Job Queue** | `ops/job-queue.ts` | SQLite-persisted jobs, state machine, crash resume, per-file progress, continue-on-error |
| 33 | **Embedding Retry Orchestrator** | `providers/retry-manager.ts` | Pending/retry/failed work, background retry worker, circuit breaker on repeated failures |
| 34 | **Circuit-Broken Reranker Failover** | `search/cross-encoder.ts` | Per-provider circuit breakers with cooldown/half-open recovery |
| 35 | **Tool-Level TTL Cache** | `cache/tool-cache.ts` | Canonicalized argument hashing, TTL expiry, size bounds, write-triggered invalidation |
| 36 | **Correction Tracking with Undo** | `learning/corrections.ts` | Superseded/deprecated/refined/merged + stability penalties/boosts, undo, causal edge mirroring |
| 37 | **7-Layer Tool Architecture Metadata** | `architecture/layer-definitions.ts` | Per-layer token budgets, tool-to-layer mapping, progressive disclosure, task-based recommendations |

### Storage & Parsing

| # | Feature | Source File(s) | Description |
|---|---------|----------------|-------------|
| 38 | **Incremental Reindex Planner** | `storage/incremental-index.ts` | mtime-based bucketing: new/modified/reindex/skip/delete + orphan detection |
| 39 | **Per-Memory History Log** | `storage/history.ts` | `memory_history` table: ADD/UPDATE/DELETE events with previous/new values, actor |
| 40 | **Access-Driven Popularity Scoring** | `storage/access-tracker.ts` | Batched access events → frequency + recency → popularity boost scores |
| 41 | **Atomic Pending-File Recovery** | `storage/transaction-manager.ts` | Pending/temp-file patterns, partial-commit reporting, crash-recovery renames |
| 42 | **Tool-Result Extraction to Working Memory** | `extraction/extraction-adapter.ts` | Post-tool extraction with summarizers, redaction, working-memory upserts |

---

## Low-Significance Gaps (13)

| # | Feature | Source File(s) | Description |
|---|---------|----------------|-------------|
| 43 | Hybrid intent classifier with per-intent ranking weights | `search/intent-classifier.ts` | 7-intent keyword+regex+embedding classification → per-intent weights/lambda |
| 44 | Evidence-gap Z-score detection + graph coverage precheck | `search/evidence-gap-detector.ts` | Low-confidence detection via score distribution analysis |
| 45 | Session attention boost | `search/session-boost.ts` | Working memory attention → bounded multiplicative result boost |
| 46 | Temporal-structural coherence scoring | `search/fsrs.ts` | FSRS stability × graph centrality = structural freshness signal |
| 47 | Anchor region metadata enrichment | `search/anchor-metadata.ts` | Sub-document structural metadata from ANCHOR tags |
| 48 | Validation-signal score adjustment | `pipeline/stage2-fusion.ts` | Quality/spec-level/completion → bounded ranking multipliers |
| 49 | Divergent alias diagnostics mode | `handlers/memory-crud-health.ts` | `reportMode: "divergent_aliases"` for specs/ collision detection |
| 50 | Mutation ledger audit trail | `handlers/memory-crud-types.ts` | Records mutation type, prior/new hashes, actor, decision metadata |
| 51 | Health auto-repair actions | `handlers/memory-crud-health.ts` | `autoRepair: true` rebuilds FTS5, refreshes triggers, cleans orphans |
| 52 | Alias divergence auto-reconcile | `handlers/memory-index-alias.ts` | Reconcile hooks with bounded retry + escalation |
| 53 | Embedding input normalization | `save/embedding-pipeline.ts` | Strip frontmatter/anchors/comments before vectorization |
| 54 | Safety-tiered retention bulk delete | `handlers/memory-bulk-delete.ts` | constitutional/critical require scoped deletes + mandatory checkpoints |
| 55 | Startup runtime compatibility guards | `startup-checks.ts` | Node ABI drift check, SQLite version validation |

---

## Deduplication Notes

The following raw findings were removed as duplicates or false positives:

**Already documented (14 false positives from Agent 2):** Mode-based orchestration, token-pressure override, spec folder auto-discovery, resume-mode injection, multi-concept search, quality threshold filter, session dedup, archived retrieval, trace emission — all described in the memory_context and memory_search catalog entries.

**Cross-agent duplicates (12 merged):** PE arbitration (Agents 3+7), PE conflict journal (Agents 3+7), spec-document causal chaining (Agents 4+9), mutation ledger (Agents 4+9), schema downgrade (Agents 1+9), evidence-gap detection (Agents 5+6), multi-concept search (Agents 1+2+5), session dedup (Agents 1+2+10), circuit breaker patterns (Agents 5+10), pressure monitoring (Agents 2+7).

---

## Recommendations

1. **Highest priority:** Document the 17 high-significance gaps — these represent major system capabilities invisible to users
2. **Create new catalog categories** for: Server Operations, Save Path Intelligence, Infrastructure/Resilience
3. **Expand existing entries** for cognitive, eval, and scoring sections where the catalog describes the concept but omits implementation depth
4. **Consider splitting** the feature catalog's catch-all categories (08-Bug-fixes, 14-Pipeline) into more focused sections
