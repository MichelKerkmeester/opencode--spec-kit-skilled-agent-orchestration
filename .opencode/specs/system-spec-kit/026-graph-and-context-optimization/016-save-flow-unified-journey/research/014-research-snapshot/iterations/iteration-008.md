<!-- SNAPSHOT: copied from 014-save-flow-backend-relevance-review/research/iterations/iteration-008.md on 2026-04-15. Authoritative source at original packet. -->

---
iteration: 8
focus: "Graph-metadata refresh necessity"
dimension: "metadata"
timestamp: "2026-04-15T08:42:00Z"
tool_call_count: 7
---

# Iteration 008

## Findings

- `NEUTRAL` Graph metadata is partial-value: it is derived from canonical docs, derives status/key-files/topics/entities on refresh, and preserves manual relationship fields across refreshes. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:811] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:870] [SOURCE: .opencode/skill/system-spec-kit/scripts/tests/graph-metadata-refresh.vitest.ts:55]
- `NEUTRAL` Because refresh is exposed as a standalone function and the default mode is `write_local`, tying it to every save is a convenience choice rather than a hard correctness requirement. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:979] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:424] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:177]

## Ruled-out directions explored this iteration

- "Graph-metadata refresh must remain inseparable from `/memory:save`" is ruled out by the standalone refresh API and derivation model. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:979]

## newInfoRatio

- `0.13` — This pass resolved Q5 from "maybe mandatory" to "valuable but decouplable."
