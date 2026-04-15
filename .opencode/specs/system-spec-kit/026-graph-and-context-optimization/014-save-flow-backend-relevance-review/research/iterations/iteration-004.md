---
iteration: 4
focus: "Atomic rollback and routed record identity"
dimension: "write-core"
timestamp: "2026-04-15T08:18:00Z"
tool_call_count: 8
---

# Iteration 004

## Findings

- `NEUTRAL` Routed record identity is load-bearing because `create-record.ts` keys same-path history on canonical file path, routed target file, anchor, and scope, which is what prevents canonical updates from collapsing across anchors or sessions. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:89] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:176]
- `NEUTRAL` `atomic-index-memory.ts` is load-bearing because save promotion, rollback, pending-file cleanup, and retry behavior are all built around preserving canonical-doc integrity if indexing fails after file promotion. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:112] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:270] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2496]

## Ruled-out directions explored this iteration

- A manual-first redesign still needs either this atomic helper or an equivalent guarded write path; removing rollback without replacement would be a regression. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:193]

## newInfoRatio

- `0.22` — This pass clarified that the indispensable save behavior lives in identity + rollback, not in the larger save-time enrichment stack.
