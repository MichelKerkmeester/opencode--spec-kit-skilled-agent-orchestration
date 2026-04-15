---
iteration: 6
focus: "Save-quality gate value"
dimension: "validation"
timestamp: "2026-04-15T08:30:00Z"
tool_call_count: 7
---

# Iteration 006

## Findings

- `NEUTRAL` The save-quality gate is partial-value rather than dead: structural checks for non-empty content, valid spec-folder shape, and a short-critical exception still prevent malformed saves. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:398] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:346]
- `NEUTRAL` The same gate is heavier than necessary because it layers weighted signal-density scoring and semantic dedup on top of structural validation, while the feature defaults keep the whole stack on by default. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:602] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:697] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:252]

## Ruled-out directions explored this iteration

- "All save-quality-gate layers are equally load-bearing" is ruled out; structural validation is correctness-oriented, while content scoring and semantic dedup are quality heuristics. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:382] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:593]

## newInfoRatio

- `0.16` — This pass gave a clean keep-vs-trim split inside the quality-gate subsystem.
