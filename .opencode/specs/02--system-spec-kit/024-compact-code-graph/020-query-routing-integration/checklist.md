---
title: "Checklist: Query-Routing Integration [024/020]"
description: "11 items across P1/P2 for phase 020."
---
# Checklist: Phase 020 — Query-Routing Integration

## P1 — Must Pass

- [x] classifyQueryIntent() called at top of memory_context handler — memory-context.ts:1087-1145
- [x] Structural queries ("who calls X") route to code_graph_context — routing branch verified
- [x] Semantic queries ("find similar to X") route to memory_search — default path preserved
- [x] Hybrid/ambiguous queries run both backends — hybrid intent dispatches both
- [x] Structural fallback to semantic when totalNodes === 0 — automatic fallthrough
- [x] session_resume composite tool merges memory + graph + ccc status — handlers/session-resume.ts (130 lines)
- [ ] F057: Passive context enrichment pipeline — DEFERRED (Part 3 unimplemented)

## P2 — Should Pass

- [x] queryIntentMetadata included in memory_context response — memory-context.ts:1391
- [x] session_resume registered in tool-schemas.ts — schema present
- [x] session_resume records metric event — recordMetricEvent added
- [ ] F050: subject parameter receives extracted symbol, not raw prose — DEFERRED
