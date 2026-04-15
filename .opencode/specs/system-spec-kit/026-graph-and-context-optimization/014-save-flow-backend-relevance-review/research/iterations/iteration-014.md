---
iteration: 14
focus: "Entity extraction and cross-doc linking"
dimension: "enrichment"
timestamp: "2026-04-15T09:18:00Z"
tool_call_count: 7
---

# Iteration 014

## Findings

- `NEUTRAL` Entity extraction is rule-based save-time enrichment, not canonical correctness logic, and it is enabled by default behind its own feature flag. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:67] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:267] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:193]
- `NEUTRAL` Cross-document entity linking is over-engineered in the hot path because it depends on auto entities, can skip itself via density guard, and lives inside a non-blocking enrichment wrapper. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:140] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:275] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:191]

## Ruled-out directions explored this iteration

- "Entity/linking logic is needed to complete canonical saves" is ruled out; failures only warn and the save result still succeeds. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:98] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:157]

## newInfoRatio

- `0.07` — This pass closed Q6 with enough evidence to defer entity work out of the default save path.
