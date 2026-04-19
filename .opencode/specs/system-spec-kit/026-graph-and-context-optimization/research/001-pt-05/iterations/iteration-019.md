# Iteration 19: Existing Bridge Surfaces That Can Absorb Graph Signals

## Focus
This iteration answers Q15 by identifying the current Public bridge surfaces that can absorb community labels, confidence metadata, and routing hints. The point is to find where graph-aware metadata can be attached without creating a second retrieval plane.

## Findings

### Finding 65
Public already has a named CocoIndex bridge-context surface. The feature catalog entry for bridge context treats Code Graph plus CocoIndex collaboration as an existing pattern, which means wave-2 recommendations can land on a documented bridge rather than inventing one. [SOURCE: .opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/09-cocoindex-bridge-context.md:10-13; .opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/09-cocoindex-bridge-context.md:28-36]

### Finding 66
`code-graph/context.ts` is already a bridge handler in practice. It accepts seeds from cocoindex, manual input, or graph lookups, resolves them into code-graph anchors, and emits confidence, resolution, source, and metadata. That is enough structure to absorb community IDs and stronger provenance without a new handler family. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:10-33; .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:106-152; .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:171-189]

### Finding 67
Bootstrap and resume already expose `graphOps`, `structuralContext`, and action hints. Those payloads are natural bridge surfaces for graph-first routing guidance because they are already cross-runtime transport layers, not just Claude-specific prompt helpers. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:203-217; .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:200-213]

### Finding 68
`stage2-fusion.ts` is the ranking bridge. It already combines community co-retrieval, graph signals, anchor metadata, and validation metadata, so adding community labels or provenance-derived weights should happen there rather than in a separate post-ranking patchwork layer. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:21-34; .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:76-89; .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:218-256]

## Cross-Phase Overlap Handling
- This iteration stayed on current bridge contracts and avoided restating phase 003's broader MCP-surface conclusions.
- It focused on concrete attachment points rather than general "integrate graph and semantic search" advice.

## Exhausted / Ruled-Out Directions
- I looked for evidence that Public needs a brand-new bridge tool and ruled it out. The current bridge context doc, code-graph context handler, bootstrap/resume envelopes, and stage2 fusion already provide the necessary attachment points. [SOURCE: .opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/09-cocoindex-bridge-context.md:10-13; .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:171-189]

## Final Verdict on Q15
Public's existing bridge surfaces are already sufficient: bridge-context documentation, `code-graph/context.ts`, bootstrap/resume transport envelopes, and `stage2-fusion.ts`. Community labels, provenance metadata, and graph-first routing hints should land there instead of spawning a separate graph bridge subsystem.

## Tools Used
- `sed -n`
- `rg -n`
- `nl -ba`

## Sources Queried
- `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/09-cocoindex-bridge-context.md:10-13`
- `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/09-cocoindex-bridge-context.md:28-36`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:10-33`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:106-152`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:171-189`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:203-217`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:200-213`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:21-34`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:76-89`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:218-256`
