---
title: "Changelog: Feedback Signal Pipeline"
description: "Phase changelog for wiring 4 unwired feedback event types into the memory search pipeline."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "feedback signal changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-03

> Spec folder: `02--system-spec-kit/023-hybrid-rag-fusion-refinement/014-feedback-signal-pipeline` (Level 2)
> Parent packet: `02--system-spec-kit/023-hybrid-rag-fusion-refinement`

### Summary

Wired the 4 previously unwired feedback event types (`result_cited`, `follow_on_tool_use`, `query_reformulated`, `same_topic_requery`) into the memory search pipeline. The system previously only logged `search_shown` (weak signal, 0.1x weight) -- now all 5 event types are active, including the two strongest signals (`result_cited` and `follow_on_tool_use` at 1.0x weight). This enables the learned-trigger, negative-feedback, and batch-learning subsystems to receive real usage data for relevance tuning.

### Added

- **Query Flow Tracker** (`lib/feedback/query-flow-tracker.ts`, ~230 LOC) -- New module providing session-scoped LRU cache (50 queries, 10min TTL) with Jaccard token-overlap similarity for detecting query reformulations (0.3-0.8 similarity) and same-topic re-queries (>0.8 similarity).
- **`result_cited` event wiring** -- Fires automatically when `includeContent: true` search results return with embedded content. Logged as a strong signal (1.0x weight) indicating the user consumed the memory content.
- **`follow_on_tool_use` event wiring** -- Fires in the central tool dispatcher (`context-server.ts`) when any non-search MCP tool is called within 60 seconds of a search. Logged as a strong signal indicating the search influenced subsequent work.
- **`query_reformulated` event wiring** -- Fires when consecutive queries in the same session have Jaccard similarity between 0.3 and 0.8, indicating the user rephrased their query (dissatisfaction signal). Logged as a medium signal (0.5x weight).
- **`same_topic_requery` event wiring** -- Fires when consecutive queries have >0.8 similarity, indicating the user re-queried the same topic. Logged as a weak signal (0.1x weight).

### Changed

- **`handlers/memory-search.ts`** -- Added query flow tracking and `result_cited` emission after the existing `search_shown` feedback block. All new code is fail-safe (try-catch wrapped, async, non-blocking).
- **`context-server.ts`** -- Added `follow_on_tool_use` hook in the tool dispatch path, after `dispatchTool()` returns. Excludes search tools (`memory_search`, `memory_context`, `memory_quick_search`) and `session_health` to avoid self-referential feedback loops.

### Fixed

- N/A (new feature, no bug fixes)

### Verification

- TypeScript compilation passes (`tsc --noEmit` clean)
- All 9,306 existing tests pass (368/369 test files, 1 pre-existing failure unrelated to this work)
- All new code gated behind existing `SPECKIT_IMPLICIT_FEEDBACK_LOG` flag (shadow-only until graduated)
- Short queries (<3 chars) are skipped for reformulation detection
- Rapid queries (<1s apart) are deduplicated to prevent spam
- Follow-on tool use window correctly expires after 60 seconds

### Files Changed

| File | Action | Description |
|------|--------|-------------|
| `mcp_server/lib/feedback/query-flow-tracker.ts` | Created | Query flow tracking with LRU cache, Jaccard similarity, and event emission |
| `mcp_server/handlers/memory-search.ts` | Modified | Added import + wiring for `result_cited` and query flow tracking |
| `mcp_server/context-server.ts` | Modified | Added `follow_on_tool_use` hook in tool dispatch |

### Follow-Ups

- Write unit tests for QueryFlowTracker (T-007, T-008)
- Write integration tests for full event flow (T-009)
- Performance validation to confirm <5ms async overhead (T-010)
- Wire `memory-context.ts` orchestration path for L1 context retrieval events (T-006)
- Monitor feedback event accumulation to validate graduation criteria
