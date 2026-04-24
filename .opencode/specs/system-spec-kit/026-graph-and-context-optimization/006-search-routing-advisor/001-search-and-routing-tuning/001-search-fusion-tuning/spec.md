---
title: "...raph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/spec]"
description: 'title: "Research: Search Fusion & Reranking Configuration Tuning"'
trigger_phrases:
  - "raph"
  - "and"
  - "context"
  - "optimization"
  - "006"
  - "spec"
  - "001"
  - "search"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["spec.md"]
branch: main
created: 2026-04-13
level: 3
parent: 010-search-and-routing-tuning
predecessor: 016-deep-review-remediation
status: complete
type: research
---
# Research: Search Fusion & Reranking Configuration Tuning

Investigate whether the hardcoded thresholds, weights, and decay constants in the search pipeline are optimal. No historical save data is needed - all research uses the current codebase, schema, and synthetic query generation.

## Background

The search pipeline combines vector search, BM25, and FTS5 results through a fusion stage, then reranks with a cross-encoder. Every numeric parameter in this pipeline is hardcoded with no empirical basis:

- Cross-encoder length penalty: 0.9 (short docs < 50 chars), 0.95 (long docs > 2000 chars)
- Cross-encoder cache TTL: 300,000ms (5 minutes)
- Circuit breaker: 3 failures, 60s cooldown
- FSRS decay constant: 0.2346 with formula `R(t) = (1 + 0.2346 * t / S)^(-0.5)`
- Exponential half-life for unreviewed memories
- Search weights loaded from `configs/search-weights.json` (undocumented contents)
- Reranker provider fallback: Voyage -> Cohere -> Local, with distinct score ranges (0-1 real, 0-0.5 fallback)

## Research Questions

1. **RQ-1:** What search-weights.json values produce the best precision@5/10 for different query intents (recall, discovery, navigation)?
2. **RQ-2:** Is the FSRS decay constant (0.2346) appropriate for spec-doc continuity, or should the half-life be different?
3. **RQ-3:** What is the latency distribution across the reranking providers (Voyage, Cohere, Local) and what is the quality/latency tradeoff?
4. **RQ-4:** Do the cross-encoder length penalties (0.9/0.95) help or hurt ranking for spec-doc-shaped content?
5. **RQ-5:** What is the cache hit rate at the current 5-minute TTL, and would a different TTL improve throughput without hurting freshness?

## Key Files to Investigate

- `mcp_server/lib/search/cross-encoder.ts` - reranking thresholds, cache, circuit breaker
- `mcp_server/lib/search/stage2-fusion.ts` - fusion algorithm, RRF K value, source weighting
- `mcp_server/lib/search/vector-index-store.ts` - embedding config, decay strategy, search weights
- `mcp_server/configs/search-weights.json` - actual weight values
- `mcp_server/lib/search/stage1-candidate-gen.ts` - candidate generation thresholds

## Research Approach

Generate synthetic queries from current spec docs (titles, summaries, entity names). Profile each pipeline stage. Measure precision/recall at different threshold values. No historical memory data needed - everything is analyzable from the current codebase and schema.

## Design Note

`/spec_kit:resume` intentionally stays on the canonical file-based recovery ladder instead of routing through `handleMemorySearch()`. The live resume path calls `memory_context(mode='resume', profile='resume')`, which reads `handover.md -> _memory.continuity -> spec docs` directly, and the resume regression suite fails if `handleMemorySearch()` is invoked. The continuity-aware Stage 3 MMR behavior fixed in this packet therefore applies to search-style resume-profile retrieval, not to the operator-facing `/spec_kit:resume` ladder itself.

## Closeout Note

This packet is closed on the shipped 001-006 research phases. Cross-runtime Codex mirror synchronization is now tracked as downstream mirror maintenance instead of a blocker for packet completion.

## Exit Criteria

- All 5 research questions answered with evidence
- Concrete threshold recommendations with before/after measurements
- Implementation-ready parameter changes documented
