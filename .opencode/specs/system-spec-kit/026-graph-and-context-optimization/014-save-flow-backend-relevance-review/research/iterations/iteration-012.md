---
iteration: 12
focus: "Prototype library and Tier 3 scope"
dimension: "routing"
timestamp: "2026-04-15T09:06:00Z"
tool_call_count: 8
---

# Iteration 012

## Findings

- `NEUTRAL` The classifier surface is over-engineered relative to the stable 8-category contract: each category ships with 5 prototypes, Tier 2 uses similarity against the frozen library, and Tier 3 adds a model call with cache/fallback semantics. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:11] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:489] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:569]
- `NEUTRAL` The Tier 3 branch is explicitly best-effort because it can fail open to Tier 2 with a confidence penalty or return refusal/manual review, which makes it a trim candidate rather than a load-bearing dependency. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:598] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:608] [SOURCE: .opencode/command/memory/save.md:101]

## Ruled-out directions explored this iteration

- "Prototype similarity is dead" is ruled out; Tier 2 still anchors fallback routing, but the current library and Tier 3 add-on are broader than the post-retirement contract appears to require. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:554] [SOURCE: .opencode/command/memory/save.md:102]

## newInfoRatio

- `0.09` — This pass resolved Q8 by splitting useful category planning from an overgrown classifier stack.
