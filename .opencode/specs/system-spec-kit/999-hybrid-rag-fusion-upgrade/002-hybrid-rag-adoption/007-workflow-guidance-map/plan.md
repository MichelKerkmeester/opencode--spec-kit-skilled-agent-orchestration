# Plan: 007-workflow-guidance-map

## Affected Files
- `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md`
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/002-hybrid-rag-adoption/spec.md`

## Implementation Order
1. Define the task categories: bootstrap, recall, save, review, health, structural search, and prototype-only workflows.
2. Map each category to current Public authorities and only then place thin facades.
3. Publish the routing map at startup/help surfaces and in durable workflow docs.

## Integration Points
- Skill workflow docs in `references/workflows/quick_reference.md`.
- Startup instructions and routing nudges in `context-server.ts`.
- Tool descriptions in `tool-schemas.ts`.
- Packet-local synthesis in the parent adoption docs.

## Rollback Plan
If the routing map obscures existing authorities or collapses code search into memory search, revert to the current tool-by-tool guidance and keep the map packet-local.
