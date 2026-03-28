---
title: "Review Report: Memory Database Refinement"
description: "30-iteration deep-research review audit of the Spec Kit Memory MCP server. 121 findings across 30 dimensions: 5 P0 blockers, 75 P1 required fixes, 41 P2 improvements."
trigger_phrases:
  - "review report"
  - "memory database audit"
  - "mcp server findings"
importance_tier: "critical"
contextType: "general"
---
# Review Report: Memory Database Refinement

30-iteration code audit of the Spec Kit Memory MCP server (`mcp_server/`), executed via parallel GPT-5.4 Codex CLI agents. Each iteration reviewed one dimension with P0/P1/P2 severity classification. Iterations 001-020 covered primary modules; iterations 021-030 performed deep dives and cross-cutting second-pass reviews.

---

## Executive Summary

| Severity | Count | Description |
|----------|-------|-------------|
| **P0** | 5 | Blockers — data loss, security, or silent corruption |
| **P1** | 75 | Required fixes — logic errors, integrity risks, incorrect behavior |
| **P2** | 41 | Improvements — edge cases, documentation drift, hardening |
| **Total** | **121** | |

---

## P0 Findings (Blockers)

| # | Finding | Dimension | File |
|---|---------|-----------|------|
| 1 | `get_embedding_dim()` can size the vector index for the wrong provider | 005 Embedding lifecycle | `vector-index-store.ts` |
| 2 | Governed memories from different scopes collide into the same lineage key | 007 Lineage/versioning | `lineage-state.ts` |
| 3 | Merge restore can wipe whole auxiliary tables before partial restore succeeds | 011 Checkpoints | `checkpoints.ts` |
| 4 | Shared-space admin mutations run as global server admin with no caller authentication | 012 Shared memory | `shared-memory.ts` |
| 5 | Merge reconsolidation can make the surviving memory unreachable and returns the wrong ID | 014 Reconsolidation | `reconsolidation.ts` |

---

## P1 Findings (Required Fixes)

| # | Finding | Dim | File |
|---|---------|-----|------|
| 1 | Scoped PE filtering still matches unscoped rows | 001 | `pe-gating.ts` |
| 2 | PE update short-circuit indexes auto-fixed content without rewriting file | 001 | `memory-save.ts` |
| 3 | `atomicSaveMemory()` DB-first failure window | 001 | `memory-save.ts` |
| 4 | Active projection failures downgraded to best-effort | 002 | `transaction-manager.ts` |
| 5 | `SQLiteVectorStore` can switch another store onto wrong DB | 002 | `vector-index-store.ts` |
| 6 | Startup recovery replays pending files in arbitrary order | 002 | `transaction-manager.ts` |
| 7 | Global visited set drops valid edges in diamond traversals | 003 | `causal-edges.ts` |
| 8 | `memory_drift_why` conflates incoming/outgoing semantics | 003 | `causal-graph.ts` |
| 9 | Traversal strength math does not propagate cumulatively | 003 | `causal-edges.ts` |
| 10 | Hybrid fallback thresholds use fractional values but vector search expects percentages | 004 | `hybrid-search.ts` |
| 11 | Disabled lexical channels re-enabled in fallback chain | 004 | `hybrid-search.ts` |
| 12 | `useGraph: false` does not disable degree channel | 004 | `hybrid-search.ts` |
| 13 | Provider-specific DB isolation bypassed before init | 005 | `vector-index-store.ts` |
| 14 | SQLite embedding cache replays stale vectors after dimension change | 005 | `embedding-cache.ts` |
| 15 | Anchor-mode indexing drops all text outside matched anchors | 006 | `chunking-orchestrator.ts` |
| 16 | Structure fallback splits fenced code blocks across chunks | 006 | `chunking-orchestrator.ts` |
| 17 | Partial child-write failures leave orphaned chunk rows | 006 | `chunking-orchestrator.ts` |
| 18 | PE SUPERSEDE splices unrelated files into same version chain | 007 | `lineage-state.ts` |
| 19 | Retention expiry of active version drops active view and erases lineage | 007 | `lineage-state.ts` |
| 20 | Migration warnings still mark DB as fully upgraded | 008 | `vector-index-schema.ts` |
| 21 | Bootstrap backfills history with stale spec_folder values | 008 | `vector-index-schema.ts` |
| 22 | Constitutional-tier migration is a no-op on legacy DBs | 008 | `vector-index-schema.ts` |
| 23 | v12 destroys memory_conflicts audit history | 008 | `vector-index-schema.ts` |
| 24 | SPECKIT_GRAPH_REFRESH_MODE=off doesn't disable enrichment | 009 | `search-flags.ts` |
| 25 | SPECKIT_CONSUMPTION_LOG documented as inert but implemented as live | 009 | config |
| 26 | YAML-looking body text can override parsed metadata | 010 | `memory-parser.ts` |
| 27 | Anchor validation accepts malformed nesting | 010 | `memory-parser.ts` |
| 28 | Normalization erases checklist state | 010 | `content-normalizer.ts` |
| 29 | Checkpoint retention evicts another tenant's rollback point | 011 | `checkpoints.ts` |
| 30 | Lineage disappears after "successful" restore | 011 | `checkpoints.ts` |
| 31 | `shared_memory_status` trusts spoofable principal IDs | 012 | `shared-memory.ts` |
| 32 | `task_postflight` overwrites another session's baseline | 013 | `session-learning.ts` |
| 33 | Completed rows are write-once per task_id, losing later cycles | 013 | `session-learning.ts` |
| 34 | Conflict-band saves lose lineage on same-path overwrite | 014 | `reconsolidation.ts` |
| 35 | Auto-merge skips scope filtering and safety guards | 014 | `reconsolidation.ts` |
| 36 | Failure-oriented queries misclassified away from fix_bug | 015 | `query-router.ts` |
| 37 | Handler exceptions misreported as SEARCH_FAILED | 016 | `lib/errors.ts` |
| 38 | Internal exception text returned to MCP clients | 016 | handlers |
| 39 | Causal-graph handlers use unrelated canonical error codes | 016 | `causal-graph.ts` |
| 40 | Incremental scan misses real file updates when mtimes don't move enough | 017 | `memory-index.ts` |
| 41 | Stale rows deleted before replacement indexing completes | 017 | `memory-index.ts` |
| 42 | Self-loop degrees snapshotted twice but measured once | 018 | `graph-signals.ts` |
| 43 | Degree-cache invalidation covers only one mutation surface | 018 | `graph-signals.ts` |
| 44 | Advertised 0.15 degree cap does not cap fusion influence | 018 | `graph-search-fn.ts` |
| 45 | Dashboard metric summaries collapse distinct channels | 019 | `reporting-dashboard.ts` |
| 46 | Ablation runs never enforce ground-truth alignment guard | 019 | `ablation-framework.ts` |
| 47 | External DB rebind refreshes only subset of singleton consumers | 020 | global state |
| 48 | Retrieval session state is global and not scope-bound | 020 | handlers |
| 49 | Progressive-disclosure cursors replay without scope checks | 020 | handlers |
| 50 | Access-tracker accumulators bleed across DB swaps | 020 | `vector-index-store.ts` |

---

## P2 Findings (Improvements)

| # | Finding | Dim |
|---|---------|-----|
| 1 | Dry-run not actually non-mutating when eval logging enabled | 001 |
| 2 | Anchor auto-fix cannot repair repeated anchor-name mismatches | 001 |
| 3 | Split-brain window where DB commits but file never reaches final path | 002 |
| 4 | Delete paths commit even when secondary vector cleanup fails | 002 |
| 5 | Traversal reads not snapshot-consistent under concurrent link/unlink | 003 |
| 6 | Traversal silently truncates high-degree nodes after 100 edges | 003 |
| 7 | FTS query sanitization preserves punctuation that BM25 splits | 004 |
| 8 | Thinning cannot discard anchor-only noise under current weights | 006 |
| 9 | Delimiter collisions warned but ambiguous keys still persisted | 007 |
| 10 | Concurrent supersedes not serialized or retried | 007 |
| 11 | SPECKIT_GRAPH_WALK_ROLLOUT docs advertise unsupported `full` state | 009 |
| 12 | Shared-memory defaults documented as true but defaulted off | 009 |
| 13 | Some SPECKIT flags frozen at import time | 009 |
| 14 | Encoding detection misdecodes BOM-less UTF-16 as UTF-8 | 010 |
| 15 | Global shared-memory enablement is unauthenticated | 012 |
| 16 | Session learning file does not implement FSRS state | 013 |
| 17 | Interference scoring counts archived/deprecated memories | 014 |
| 18 | Router prunes channels for short spec/decision lookups | 015 |
| 19 | Multi-facet queries collapsed to one dominant intent | 015 |
| 20 | BM25 indexing failure swallowed during reconsolidation | 016 |
| 21 | Scan batch concurrency effectively unbounded | 017 |
| 22 | Ingest accepts duplicate paths as duplicate work | 017 |
| 23 | Missing token-usage data persisted as measured zero | 019 |
| 24 | Sprint ordering based on first-seen not most recent | 019 |
| 25 | groundTruthQueryIds silently drops unknown IDs | 019 |
| 26 | External DB reinitialization leaves stale in-process caches | 020 |
| 27 | Stale degree cache after external reinitialization | 020 |

---

## Findings by Dimension

| Iter | Dimension | P0 | P1 | P2 | Total |
|------|-----------|----|----|----|----|
| 001 | Save pipeline integrity | 0 | 3 | 2 | 5 |
| 002 | Transaction safety | 0 | 3 | 2 | 5 |
| 003 | Causal graph correctness | 0 | 3 | 2 | 5 |
| 004 | Hybrid search pipeline | 0 | 3 | 1 | 4 |
| 005 | Embedding lifecycle | 1 | 2 | 0 | 3 |
| 006 | Chunking and thinning | 0 | 3 | 1 | 4 |
| 007 | Lineage and versioning | 1 | 2 | 2 | 5 |
| 008 | Schema migrations | 0 | 4 | 0 | 4 |
| 009 | Feature flag interactions | 0 | 2 | 3 | 5 |
| 010 | Memory parsing | 0 | 3 | 1 | 4 |
| 011 | Checkpoint lifecycle | 1 | 2 | 0 | 3 |
| 012 | Shared memory | 1 | 1 | 1 | 3 |
| 013 | Session learning | 0 | 2 | 1 | 3 |
| 014 | Reconsolidation | 1 | 2 | 1 | 4 |
| 015 | Query routing | 0 | 1 | 2 | 3 |
| 016 | Error handling | 0 | 3 | 1 | 4 |
| 017 | Index scan/ingest | 0 | 2 | 2 | 4 |
| 018 | Graph signals | 0 | 3 | 0 | 3 |
| 019 | Eval framework | 0 | 2 | 3 | 5 |
| 020 | Concurrency/state | 0 | 4 | 1 | 5 |
| 021 | Deep dive: memory-save.ts | 0 | 3 | 1 | 4 |
| 022 | Deep dive: hybrid-search.ts | 0 | 4 | 0 | 4 |
| 023 | API surface/tool schemas | 0 | 1 | 4 | 5 |
| 024 | Memory context (L1) | 0 | 3 | 1 | 4 |
| 025 | Trigger matching | 0 | 2 | 2 | 4 |
| 026 | Content hash dedup | 0 | 2 | 2 | 4 |
| 027 | BM25 index consistency | 0 | 3 | 0 | 3 |
| 028 | Embedding provider chain | 0 | 3 | 1 | 4 |
| 029 | Response envelope/MCP | 0 | 2 | 2 | 4 |
| 030 | Cross-module state (2nd pass) | 0 | 2 | 2 | 4 |
| **Total** | | **5** | **75** | **41** | **121** |

---

## Recommended Fix Priority

### Immediate (P0 blockers)
1. Scope-aware lineage keys — prevent cross-scope key collisions
2. Embedding dimension guard — fail-fast on dimension mismatch before DB bootstrap
3. Checkpoint merge restore — atomic auxiliary table handling
4. Shared-memory auth — enforce caller authentication on admin mutations
5. Reconsolidation merge — fix surviving memory reachability and return value

### Sprint 1: High-risk P1 clusters (search + data integrity)
- **Hybrid search** (004, 022): fallback threshold units, disabled channel re-enabling, adaptive fusion conflicts, confidence truncation
- **Save pipeline** (001, 021): PE filtering scope, DB-first failure window, write lock scope, chunking bypassing quality gate
- **Transaction safety** (002): projection writes, DB handle switching, pending file recovery
- **BM25 consistency** (027): reconsolidation merge not syncing BM25, archived docs lingering in index

### Sprint 2: Correctness + schema
- **Causal graph** (003): diamond traversal, drift-why semantics, strength propagation
- **Schema migrations** (008): migration warnings advancing version, history backfill ordering
- **Embedding lifecycle** (005, 028): dimension mismatch guard, provider cascade reporting, API key validation timing
- **Chunking** (006): anchor-mode text loss, code block splitting, orphaned chunk rows

### Sprint 3: Security + governance
- **Shared memory** (012): admin auth, spoofable principal IDs
- **Error handling** (016, 029): wrong error codes, exception leakage, response envelope bypasses
- **Concurrency** (020, 030): singleton rebind gaps, access tracker bleed, stale caches

### Sprint 4: Remaining P1s + P2 triage
- **Lineage** (007): PE SUPERSEDE cross-file splicing, retention expiry
- **Memory parsing** (010): YAML override, malformed anchors, checklist state loss
- **Context handler** (024): focused mode ranking, resume keyword dependency
- **Trigger matching** (025): common-word triggers, frontmatter extraction errors
- **Dedup** (026): preflight rejection, chunked bypass, hash staleness
- All P2 items triaged for inclusion or deferral

---

## Iteration Artifacts

All 30 iteration files: `review/iterations/iteration-001.md` through `iteration-030.md`

Each contains detailed findings with file paths, code citations, and fix recommendations.
