---
iteration: 17
focus: "Planner-first command substitution"
dimension: "replacement-design"
timestamp: "2026-04-15T09:36:00Z"
tool_call_count: 8
---

# Iteration 017

## Findings

- `NEUTRAL` A planner-first replacement is feasible because `memory_save` dry-run already returns route-adjacent validation data, quality-loop results, template-contract status, sufficiency, and spec-doc health without mutating files. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2191] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2276]
- `NEUTRAL` The minimal replacement can therefore be: planner output -> AI applies canonical-doc edit -> optional explicit reindex -> optional graph refresh, while retaining the atomic writer as an auto-mode fallback for fully automated saves. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2501] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1382] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:979]

## Ruled-out directions explored this iteration

- "A simpler `/memory:save` would need a net-new planner from scratch" is ruled out; the current dry-run/preflight contract already exposes much of the needed structure. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2346]

## newInfoRatio

- `0.05` — This pass answered Q2 with a concrete replacement shape rather than only subsystem verdicts.
