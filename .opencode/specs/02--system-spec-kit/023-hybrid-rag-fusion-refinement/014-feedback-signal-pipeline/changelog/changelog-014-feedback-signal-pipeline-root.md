---
title: "Changelog: Feedback Signal Pipeline"
description: "Packet-local changelog for the implicit feedback signal pipeline implementation, verification, and documentation."
trigger_phrases:
  - "feedback pipeline changelog"
  - "014 changelog"
  - "feedback signal changes"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

## 2026-04-03

> Spec folder: `02--system-spec-kit/023-hybrid-rag-fusion-refinement/014-feedback-signal-pipeline` (Level 2)

### Summary

Implemented and verified the implicit feedback signal pipeline. Five event types -- `search_shown`, `result_cited`, `query_reformulated`, `same_topic_requery`, and `follow_on_tool_use` -- are now collected shadow-only after every search interaction. The critical gap was follow-on tool correlation for sessionless tools, solved by a sticky `lastKnownSessionId` fallback in the dispatcher. All signals log to the feedback ledger without affecting search ranking.

### Added

- `query-flow-tracker.ts` -- bounded per-session query history with Jaccard similarity detection, 50-entry cap, 10-minute TTL, and 1-second dedup window
- `result_cited` emission in `memory-search.ts` for `includeContent` searches
- `follow_on_tool_use` emission in `context-server.ts` via sticky `lastKnownSessionId` fallback for sessionless tools
- `query-flow-tracker.vitest.ts` -- dedicated test suite covering thresholds, TTL, dedup, and DB-level packet flow

### Changed

- `memory-search.ts` now calls `trackQueryAndDetect()` after assembling search results to emit query-flow events
- `context-server.ts` stores session IDs from tool calls and falls back to the last known ID when non-search tools fire

### Fixed

- Sessionless tools (e.g. `memory_stats`) could not emit `follow_on_tool_use` because they have no `sessionId` parameter -- the sticky fallback resolves this gap

### Verification

- `npx tsc --noEmit` -- PASS (2026-04-03)
- `TMPDIR=.../.tmp/vitest-tmp npx vitest run tests/query-flow-tracker.vitest.ts tests/context-server.vitest.ts tests/feedback-ledger.vitest.ts` -- PASS (3 files, 451 tests)
- Benchmark: 0.03ms average, 0.07ms p95, 0.44ms max (sub-5ms budget)
- Live MCP verification: all five event types emitted in a single session (2026-04-03)

### Files Changed

| File | What changed |
|------|-------------|
| `mcp_server/lib/feedback/query-flow-tracker.ts` | New: session cache, Jaccard detection, helper emitters |
| `mcp_server/handlers/memory-search.ts` | Wired trackQueryAndDetect() and logResultCited() |
| `mcp_server/context-server.ts` | Added lastKnownSessionId sticky fallback |
| `mcp_server/tests/query-flow-tracker.vitest.ts` | New: dedicated tracker test suite |
| `mcp_server/tests/context-server.vitest.ts` | Sticky session regression tests |

### Follow-Ups

- Graduate feedback signals from shadow-only to bounded ranking influence once the event dataset is validated
- Revisit sticky-session correlation for multi-client transports (current design assumes single-client stdio)
