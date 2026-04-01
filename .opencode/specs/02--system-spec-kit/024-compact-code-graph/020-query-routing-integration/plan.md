---
title: "Plan: Query-Routing Integration [024/020]"
description: "Implementation order for auto-routing in memory_context and session_resume composite tool."
---
# Plan: Phase 020 — Query-Routing Integration

## Implementation Order

1. **classifyQueryIntent integration into memory_context** (60-80 LOC)
   - Wire classifyQueryIntent() at the top of memory-context.ts handler
   - Route structural queries → code_graph_context
   - Route semantic queries → existing memory_search path
   - Route hybrid/ambiguous → run both, merge results
   - Add structural fallback to semantic when totalNodes === 0

2. **Query intent metadata in response** (20-30 LOC)
   - Append `queryIntentMetadata` to every memory_context response
   - Include: queryIntent, routedBackend, fallbackApplied
   - LLM can inspect routing decisions

3. **session_resume composite tool** (80-100 LOC)
   - Create `handlers/session-resume.ts`
   - Calls memory_context({ mode: "resume" }) + code_graph_status() + ccc_status()
   - Merges results into single response
   - Saves 2-3 round trips and ~400-900 tokens per resume

4. **Tool schema registration** (20-30 LOC)
   - Register session_resume in tool-schemas.ts and schemas/tool-input-schemas.ts
   - Wire handler in tools/lifecycle-tools.ts
   - Add to tools/types.ts type definitions

5. **Handler index update** (5-10 LOC)
   - Export session-resume handler from handlers/index.ts

## Deferred

- Part 3 (Passive Context Enrichment): runPassiveEnrichment() pipeline — deferred as F057

## Dependencies
- Phase 019 (code graph auto-trigger) recommended first
- Phase 017 (classifier fixes) for accurate intent classification

## Estimated Total LOC: 500-900 (Part 3 deferred reduces to ~300-400)
