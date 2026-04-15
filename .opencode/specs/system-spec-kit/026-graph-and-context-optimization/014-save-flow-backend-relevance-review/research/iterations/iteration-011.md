---
iteration: 11
focus: "Router contract and category surface"
dimension: "routing"
timestamp: "2026-04-15T09:00:00Z"
tool_call_count: 8
---

# Iteration 011

## Findings

- `NEUTRAL` The content router itself remains load-bearing because canonical saves depend on its route category, target doc, anchor, and merge mode to decide where durable content lands. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:22] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:466] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1253]
- `NEUTRAL` Tier 1 already captures several structured and hard-drop paths directly, which reduces the argument that the full downstream tier stack is necessary for every save. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:342] [SOURCE: .opencode/command/memory/save.md:99]

## Ruled-out directions explored this iteration

- "All router machinery can be removed if the command becomes manual-first" is ruled out; some route planning still needs to determine canonical destination and merge mode. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:85] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1336]

## newInfoRatio

- `0.10` — This pass separated the essential routing contract from the oversized classifier implementation around it.
