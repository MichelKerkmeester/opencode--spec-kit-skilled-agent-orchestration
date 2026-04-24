---
title: "...ch-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/002-add-reranker-telemetry/decision-record]"
description: 'title: "Add Reranker Cache Telemetry - Decision Record"'
trigger_phrases:
  - "routing"
  - "advisor"
  - "001"
  - "search"
  - "and"
  - "decision record"
  - "002"
  - "add"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/002-add-reranker-telemetry"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["decision-record.md"]
status: planned
---
# Decision Record
## ADR-001: Use Process-Wide Cache Counters on `RerankerStatus`
**Context:** `../research/research.md:104-133` recommends a `cache` block on `RerankerStatus`, and `../research/research.md:247-250` calls out the need to choose between process-wide and provider-scoped counter semantics before implementation.
**Decision:** Keep the counters module-scoped and expose them only through `mcp_server/lib/search/cross-encoder.ts:499-525`, with `resetSession()` as the reset boundary.
**Rationale:** The cache itself is process-local today, and process-wide counters add useful observability without introducing extra per-provider bookkeeping into the first telemetry slice.
**Consequences:** The counters describe overall reranker cache activity rather than provider-specific performance, and any provider-level breakout will need to build on top of this baseline later.
