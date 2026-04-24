---
title: "Plan [system-spec-kit/z_future/hybrid-rag-fusion-upgrade/002-hybrid-rag-adoption/004-compaction-checkpointing/plan]"
description: "1. Define the compaction action-card contract and dedupe rules."
trigger_phrases:
  - "plan"
  - "004"
  - "compaction"
importance_tier: "important"
contextType: "planning"
---
# Plan: 004-compaction-checkpointing

## Affected Files
- `.opencode/plugins/spec-kit-compact-code-graph.js`
- `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js`
- `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts`

## Implementation Order
1. Define the compaction action-card contract and dedupe rules.
2. Route preservation through JSON-primary save input.
3. Feed the resulting continuity hint back into existing bootstrap/resume surfaces only as additive context.

## Integration Points
- `experimental.session.compacting` in `spec-kit-compact-code-graph.js`.
- Structured save entrypoints in `generate-context.js` and `generate-context.ts`.
- Existing recovery authority in `session-bootstrap.ts`.

## Rollback Plan
If the checkpoint path becomes blocking, duplicate, or authority-bearing, remove the compaction helper and keep only the current transport-owned reminder block.
