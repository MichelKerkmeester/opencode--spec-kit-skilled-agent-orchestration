---
iteration: 9
focus: "Prediction-error gating"
dimension: "dedup-lineage"
timestamp: "2026-04-15T08:48:00Z"
tool_call_count: 7
---

# Iteration 009

## Findings

- `NEUTRAL` PE gating is partial-value because it scopes similarity checks by tenant/user/agent/session and can reinforce, supersede, or append versions without changing canonical merge legality. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:63] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:141] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:204]
- `NEUTRAL` The routed save core does not depend on PE gating to decide where or how to write canonical docs; PE acts after validation as a database-index arbitration layer. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1815] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1939]

## Ruled-out directions explored this iteration

- "PE gating is dead because canonical docs are stable now" is ruled out; it still adds lineage and duplicate-control value for indexed memory rows. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:168] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:122]

## newInfoRatio

- `0.12` — This pass converted PE gating from an ambiguous dedup feature into a clear partial-value index/lineage layer.
