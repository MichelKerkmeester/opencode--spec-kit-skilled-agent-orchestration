---
title: "Changelog: Feedback Signal Pipeline"
description: "Packet-local changelog for the implicit feedback signal pipeline -- records search usage patterns without affecting ranking."
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

The memory search system now observes how searches are used and records five types of usage signals: result views, content citations, rephrased queries, repeated queries, and follow-on tool use. These signals are collected in the background without affecting ranking. The key fix was enabling follow-on tracking for tools that have no session identifier, solved by remembering the most recent session and using it as a fallback.

### Added

- Query flow tracker that detects rephrased and repeated searches by comparing word overlap between consecutive queries in the same session
- Result citation logging when search results are delivered with full content
- Follow-on tool tracking that links non-search tools back to the preceding search, even when those tools carry no session identifier
- Dedicated test suite covering detection thresholds, timing rules, expiry, and a full single-session cycle

### Changed

- Search handler now records query patterns and citations after assembling results
- Tool dispatcher now remembers the most recent session so tools without their own session identifier can still be tracked

### Fixed

- Tools like memory stats could not be linked to a prior search because they have no session identifier -- the system now falls back to the last known session to close this gap

### Verification

- TypeScript compile check -- PASS (2026-04-03)
- Combined test run (3 files, 451 tests) -- PASS (2026-04-03)
- Benchmark: 0.03ms average, 0.07ms p95, 0.44ms max per search (well under 5ms budget)
- Live verification: all five signal types recorded in a single session (2026-04-03)

### Files Changed

| File | What changed |
|------|-------------|
| `mcp_server/lib/feedback/query-flow-tracker.ts` | New: session cache, similarity detection, helper functions |
| `mcp_server/handlers/memory-search.ts` | Wired query tracking and citation logging |
| `mcp_server/context-server.ts` | Added session fallback for follow-on tool tracking |
| `mcp_server/tests/query-flow-tracker.vitest.ts` | New: dedicated test suite |
| `mcp_server/tests/context-server.vitest.ts` | Session fallback regression tests |

### Follow-Ups

- Use collected signals to improve search ranking once the dataset is large enough and validated
- Revisit the session fallback approach if the system moves to multi-client connections (current design assumes one client at a time)
