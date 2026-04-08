# Iteration 18: Security, Governance, and Trust-Boundary Constraints

## Focus
This iteration answers Q21 by identifying which current Public guardrails make direct graphify-style ingestion unsafe or incomplete without adaptation. The goal is to anchor rollout design in current trust boundaries instead of assuming a free-form ingestion model.

## Findings

### Finding 61
Public's current ingest path is explicitly local and bounded. `memory-ingest.ts` rejects traversal, validates against allowed base paths, and canonicalizes real paths before processing. That means graphify's remote URL fetching model is outside Public's current trust boundary and should not be copied directly. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:165-227]

### Finding 62
Bootstrap and resume already expose provenance and trust-bearing payload state. This means graph metadata and multimodal-derived signals must integrate with the existing payload contract and trust framing instead of appearing as opaque extras with unclear provenance. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:154-191; .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:155-194]

### Finding 63
Code-graph context resolution already records source and confidence on anchors. That is the correct trust boundary for graph-enriched retrieval: every enrichment should remain traceable back to a seed source and resolution path, not just to a fused score. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:171-189]

### Finding 64
The safe adaptation rule is therefore: keep ingestion local, keep provenance explicit, and keep graph-derived signals inside the current typed payload and anchor-resolution contracts. Direct graphify-style remote fetching and opaque semantic writes would weaken the existing safety model. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:165-227; .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:171-189]

## Cross-Phase Overlap Handling
- This iteration focused on current Public boundaries rather than graphify's own security limitations, which were already covered in wave 1.
- It did not reopen governed-retrieval internals beyond the payload and ingest surfaces directly relevant to the requested translation work.

## Exhausted / Ruled-Out Directions
- I looked for a safe path to adopt graphify's remote ingestion style directly and ruled it out. Public's current ingest and provenance model is local-file- and payload-contract-oriented. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:165-227; .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:154-191]

## Final Verdict on Q21
Public's current trust boundary requires any graphify-inspired rollout to stay local-file-only, provenance-explicit, and payload-contract-compatible. Remote URL ingestion and opaque semantic graph updates are unsafe within today's architecture unless Public deliberately expands those boundaries first.

## Tools Used
- `sed -n`
- `rg -n`
- `nl -ba`

## Sources Queried
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:165-227`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:154-191`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:155-194`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:171-189`
