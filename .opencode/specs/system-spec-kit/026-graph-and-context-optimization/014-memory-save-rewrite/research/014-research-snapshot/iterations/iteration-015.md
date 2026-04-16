<!-- SNAPSHOT: copied from 014-save-flow-backend-relevance-review/research/iterations/iteration-015.md on 2026-04-15. Authoritative source at original packet. -->

---
iteration: 15
focus: "Post-insert enrichment pipeline"
dimension: "enrichment"
timestamp: "2026-04-15T09:24:00Z"
tool_call_count: 6
---

# Iteration 015

## Findings

- `NEUTRAL` The post-insert enrichment wrapper is over-engineered for the default save flow because causal links, entity extraction, summaries, entity linking, and graph lifecycle all run as best-effort sequential extras behind individual feature flags. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:50] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:77] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:118] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:166]
- `NEUTRAL` A trimmed design should preserve causal-link processing if the packet still wants causal metadata, but the surrounding enrichment bundle does not need to block or sit on the critical save path. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:77] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2027]

## Ruled-out directions explored this iteration

- "All post-insert steps share the same business value" is ruled out; the code itself treats them as separately gated and separately tolerated on failure. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:55]

## newInfoRatio

- `0.06` — This pass turned a large mixed subsystem into a clear defer/batch candidate.
