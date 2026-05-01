---
title: "Plan: 002-memor [system-spec-kit/z_future/hybrid-rag-fusion-upgrade/002-hybrid-rag-adoption/002-memory-review-tool/plan]"
description: "1. Freeze the memory_review contract and grade vocabulary."
trigger_phrases:
  - "plan"
  - "002"
  - "memor"
  - "memory"
importance_tier: "important"
contextType: "planning"
---
# Plan: 002-memory-review-tool

## Affected Files
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`

## Implementation Order
1. Freeze the `memory_review` contract and grade vocabulary.
2. Reuse FSRS stability, difficulty, retrievability, and next-review primitives.
3. Define how review results update durable memory metadata without touching the search authority.

## Integration Points
- New tool registration beside `memory_validate` in `tool-schemas.ts`.
- FSRS calculations in `lib/cognitive/fsrs-scheduler.ts`.
- Existing health and mutation reporting in `memory-crud-health.ts` and `memory-save.ts`.

## Rollback Plan
If the review flow requires a separate retrieval path or implicit read-time mutation, reduce the phase back to contract documentation and keep `memory_review` out of the runtime.
