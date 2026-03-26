---
title: "Semantic and lexical search (memory_search)"
description: "Covers the primary search tool that runs the full hybrid retrieval pipeline across multiple channels."
---

# Semantic and lexical search (memory_search)

## 1. OVERVIEW

Covers the primary search tool that runs the full hybrid retrieval pipeline across multiple channels.

This is the main search tool. You type what you are looking for in plain language and the system searches through all stored knowledge to find the best matches. It understands meaning (not just keywords), so searching for "login problems" can find a document titled "authentication troubleshooting." Without it, you would have no way to find relevant information in the knowledge base.

---

## 2. CURRENT REALITY

This is the primary search tool, and it does a lot. You give it a natural language query (or a multi-concept array of 2-5 strings where all concepts must match), and it runs the full hybrid retrieval pipeline.

The search path is the 4-stage pipeline architecture, which is the sole runtime path. The pipeline starts with Stage 1 candidate generation, which selects search channels based on query type: multi-concept queries run per-concept embeddings, deep mode expands into up to 3 query variants, and when embedding expansion is active a baseline plus expanded-query search run in parallel. Constitutional memories are injected if none appear in the initial candidate set. Stage 2 applies all scoring signals in a single pass: session boost, causal boost, co-activation spreading, community co-retrieval from precomputed `community_assignments`, graph signals (N2a+N2b), bounded graph-walk scoring behind the `SPECKIT_GRAPH_WALK_ROLLOUT` ladder (`off`, `trace_only`, `bounded_runtime`), FSRS testing effect, intent weights (for non-hybrid only, preventing G2 double-weighting), artifact routing, feedback signals (learned trigger boosts and negative feedback demotions), artifact result limiting, anchor metadata annotation and validation metadata enrichment. Stage 3 handles cross-encoder reranking and MPAB chunk-to-memory aggregation with document-order reassembly. Stage 4 filters by memory state, runs TRM evidence gap detection and enforces a score immutability invariant that prevents any score modifications after reranking.

A deep mode expands the query into up to 3 variants using `expandQuery()`, runs hybrid search for each variant in parallel and merges results with deduplication. Results are cached per parameter combination via `toolCache.withCache()`, and session deduplication runs after cache so that cache hits still respect session state.

The parameter surface is wide. You control result count (`limit`, 1-100), spec folder scoping, tier and context type filtering, intent (explicit or auto-detected), reranking toggle, length penalty, temporal decay, minimum memory state (`minState`, default `"WARM"`, range HOT through ARCHIVED), constitutional inclusion, content inclusion, anchor filtering, session dedup, session boosting, causal boosting, minimum quality threshold, cache bypass and access tracking. Most defaults are sensible. You typically send a query and a session ID and let everything else run at defaults.

When trace is enabled, result envelopes now expose richer bounded Markovian diagnostics without altering the non-trace contract: `trace.graphContribution` includes `raw`, `normalized`, `appliedBonus`, `capApplied`, and `rolloutState`, and requests forwarded from `memory_context` can also include `trace.sessionTransition`. Extended telemetry summarizes the same behavior through `transitionDiagnostics` and `graphWalkDiagnostics`.

Recent vector-query hardening closed three correctness gaps in the retrieval path. `multi_concept_search()` now applies the same expiry filter used by single-query search (`m.expires_at IS NULL OR m.expires_at > datetime('now')`), so expired memories no longer leak through the AND-match path. `vector_search()` validates embedding length before buffer conversion and throws `VectorIndexError(EMBEDDING_VALIDATION)` instead of surfacing raw sqlite-vec failures when callers pass malformed embeddings. It also returns early with `constitutional_results.slice(0, limit)` when constitutional injection already satisfies the requested limit, which keeps result counts deterministic and prevents the retrieval layer from returning more rows than the caller asked for.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/memory-search.ts` | Handler | Search handler entry point: parameter resolution, cache, session dedup, deep-mode expansion, result formatting |
| `mcp_server/lib/cache/tool-cache.ts` | Lib | Per-parameter-combination result caching via `toolCache.withCache()` |
| `mcp_server/lib/search/pipeline/index.ts` | Lib | Pipeline barrel export (`executePipeline`) |
| `mcp_server/lib/search/pipeline/orchestrator.ts` | Lib | 4-stage pipeline orchestration (sole runtime path) |
| `mcp_server/lib/search/artifact-routing.ts` | Lib | Artifact-class routing (spec/plan/tasks/checklist/memory) |
| `mcp_server/lib/search/chunk-reassembly.ts` | Lib | Chunk-to-parent reassembly post-pipeline |
| `mcp_server/lib/search/search-utils.ts` | Lib | Quality filtering, cache arg building, artifact routing helpers |
| `mcp_server/lib/search/intent-classifier.ts` | Lib | Intent detection for non-hybrid intent weights |
| `mcp_server/lib/search/session-boost.ts` | Lib | Session attention boost flag check |
| `mcp_server/lib/search/causal-boost.ts` | Lib | Causal neighbor boost flag check |
| `mcp_server/lib/search/search-flags.ts` | Lib | Feature flag registry |
| `mcp_server/lib/session/session-manager.ts` | Lib | Session lifecycle for cross-turn dedup |
| `mcp_server/lib/response/envelope.ts` | Lib | Response envelope formatting |
| `mcp_server/lib/feedback/feedback-ledger.ts` | Lib | Implicit feedback logging |
| `mcp_server/lib/eval/eval-logger.ts` | Lib | Evaluation event logger |
| `mcp_server/lib/telemetry/consumption-logger.ts` | Lib | Agent consumption logging |
| `mcp_server/lib/telemetry/retrieval-telemetry.ts` | Lib | Retrieval telemetry |
| `mcp_server/lib/telemetry/eval-channel-tracking.ts` | Lib | Eval channel payload collection and graph-walk diagnostics |
| `mcp_server/formatters/search-results.ts` | Formatter | Search result formatting |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/handler-memory-search.vitest.ts` | Search handler validation |
| `mcp_server/tests/memory-search-integration.vitest.ts` | Search integration tests |
| `mcp_server/tests/memory-search-eval-channels.vitest.ts` | Search eval channel coverage |
| `mcp_server/tests/memory-search-quality-filter.vitest.ts` | Search quality filtering |
| `mcp_server/tests/hybrid-search.vitest.ts` | Hybrid search orchestration |
| `mcp_server/tests/search-results-format.vitest.ts` | Result formatting |

---

## 4. SOURCE METADATA

- Group: Retrieval
- Source feature title: Semantic and lexical search (memory_search)
- Current reality source: FEATURE_CATALOG.md
- Source list updated 2026-03-26 per audit remediation
