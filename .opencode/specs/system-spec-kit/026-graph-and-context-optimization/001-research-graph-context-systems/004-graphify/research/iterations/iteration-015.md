# Iteration 15: Light-Weight Clustering Path for Public

## Focus
This iteration answers Q18 by asking what the lightest clustering implementation would look like if Public wanted graph-aware community signals without importing graphify wholesale. The answer should fit the current code-graph data store and the existing search pipeline.

## Findings

### Finding 49
Public already has a validation surface for community detection. The manual testing playbook for `022-community-detection-n2c` checks cluster IDs, co-member boosts, and cap enforcement, which means the repo already has the concepts and verification language needed for graph-aware clustering. [SOURCE: .opencode/skill/system-spec-kit/manual_testing_playbook/10--graph-signal-activation/022-community-detection-n2c.md:18-29]

### Finding 50
Public's search fusion pipeline already knows how to consume community signals. `stage2-fusion.ts` applies community co-retrieval, graph signals, anchor metadata, and validation metadata in a defined order and already has toggles for graph-signal use. This means community detection can be integrated as a signal source into the existing ranking stage rather than as a separate user-facing subsystem. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:21-34; .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:76-89]

### Finding 51
The code-graph context handler already accepts seeds from cocoindex, manual input, and graph lookups, then resolves them into graph-aware anchors with confidence and metadata. That makes it a natural consumer of cluster labels once they exist; Public does not need a second query stack to benefit from communities. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:106-152; .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:171-189]

### Finding 52
The lightest implementation path is therefore offline or incremental community labeling over the existing code graph, persisted as metadata and consumed by `stage2-fusion` and `code-graph/context.ts`. That keeps clustering as an additive ranking and context feature, not a replacement for current code-graph storage. [SOURCE: .opencode/skill/system-spec-kit/manual_testing_playbook/10--graph-signal-activation/022-community-detection-n2c.md:18-29; .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:21-34; .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:171-189]

## Cross-Phase Overlap Handling
- This iteration avoided reopening graphify's own Leiden implementation details, which were already closed in wave 1.
- It focused on where Public would attach cluster labels and how it would verify them.

## Exhausted / Ruled-Out Directions
- I looked for a need to introduce a new graph store for clustering and ruled it out. Public's current search fusion and code-graph context surfaces can already consume cluster metadata if it is attached to existing nodes and anchors. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:21-34; .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:171-189]

## Final Verdict on Q18
If Public wants clustering, the lightest path is to compute and persist community labels on the current code graph, then let `stage2-fusion` and `code-graph/context.ts` consume those labels as additive signals. No separate graph database or graphify-style serve layer is needed.

## Tools Used
- `sed -n`
- `rg -n`
- `nl -ba`

## Sources Queried
- `.opencode/skill/system-spec-kit/manual_testing_playbook/10--graph-signal-activation/022-community-detection-n2c.md:18-29`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:21-34`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:76-89`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:106-152`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:171-189`
