---
title: "Plan [system-spec-kit/z_future/hybrid-rag-fusion-upgrade/002-hybrid-rag-adoption/001-architecture-boundary-freeze/plan]"
description: "1. Document the preserved authorities and explicit non-goals."
trigger_phrases:
  - "plan"
  - "001"
  - "architecture"
importance_tier: "important"
contextType: "planning"
---
# Plan: 001-architecture-boundary-freeze

## Affected Files
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts`
- `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js`

## Implementation Order
1. Document the preserved authorities and explicit non-goals.
2. Map each later sub-phase to the authority it must wrap.
3. Record rejection rules for backend swaps, scope shortcuts, and competing lanes.

## Integration Points
- Tool registration and descriptions in `tool-schemas.ts`.
- Retrieval pipeline in `memory-search.ts`.
- Recovery and startup orchestration in `memory-context.ts` and `session-bootstrap.ts`.
- Save authority in `generate-context.js`.

## Rollback Plan
If any downstream phase requires a competing authority or cannot name an existing preserved surface, stop that phase and reclassify it as prototype-only or reject it.
