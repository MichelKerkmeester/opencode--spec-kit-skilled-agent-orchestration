---
title: "Plan: 005-boots [system-spec-kit/z_future/hybrid-rag-fusion-upgrade/002-hybrid-rag-adoption/005-bootstrap-guidance/plan]"
description: "1. Identify the current hint and recovery surfaces."
trigger_phrases:
  - "plan"
  - "005"
  - "boots"
  - "bootstrap"
importance_tier: "important"
contextType: "planning"
---
# Plan: 005-bootstrap-guidance

## Affected Files
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts`
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`

## Implementation Order
1. Identify the current hint and recovery surfaces.
2. Add bounded guidance blocks that teach existing tools and next actions.
3. Keep any formatter/profile work additive to `session_bootstrap`.

## Integration Points
- Hint aggregation and next actions in `session-bootstrap.ts`.
- Resume-mode routing in `memory-context.ts`.
- Server-start instructions and recovery digest in `context-server.ts`.
- Schema descriptions in `tool-schemas.ts`.

## Rollback Plan
If the guidance layer starts behaving like a new recovery authority, remove the additive hints and keep the current bootstrap surfaces unchanged.
