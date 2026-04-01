---
title: "Tasks: Query-Routing Integration [024/020]"
description: "Task tracking for auto-routing in memory_context and session_resume tool."
---
# Tasks: Phase 020 — Query-Routing Integration

## Completed

- [x] classifyQueryIntent wired into memory_context — memory-context.ts:1087-1145, structural/semantic/hybrid routing
- [x] Structural queries route to code_graph_context — routing branch dispatches to code graph handler
- [x] Semantic queries route to existing memory_search — default path preserved
- [x] Hybrid queries run both backends and merge — hybrid intent returned when signals mixed
- [x] Structural fallback to semantic when no results — falls through if totalNodes === 0
- [x] queryIntentMetadata appended to response — memory-context.ts:1391
- [x] session_resume composite tool created — handlers/session-resume.ts (130 lines)
- [x] session_resume calls memory_context + code_graph_status + ccc_status — merged response
- [x] Tool schema registration — session_resume in tool-schemas.ts, schemas/tool-input-schemas.ts
- [x] Handler wired in lifecycle-tools.ts and types.ts — dispatch path verified
- [x] Handler exported from handlers/index.ts — session-resume re-exported
- [x] F052: session_resume metric event added — recordMetricEvent in iter 041-050 fixes

## Deferred

- [ ] F050: subject=normalizedInput passes prose as symbol name — structural queries rarely match (P2)
- [ ] F051: Duplicated CocoIndex path check in session-resume.ts (P2)
- [ ] F057: Passive context enrichment pipeline (Part 3) — runPassiveEnrichment() unimplemented (P1)
