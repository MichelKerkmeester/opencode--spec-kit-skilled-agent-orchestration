# Iteration 20: Final Rollout Plan for Public

## Focus
The final iteration answers Q22 by converting the prior wave-2 findings into a phased rollout plan that fits Public's existing architecture. This iteration closes the reopened session by prioritizing additive moves first and explicitly rejecting graphify-style subsystem replacement.

## Findings

### Finding 69
The immediate phase should stay additive and schema-first: enrich existing confidence and provenance contracts, extend bootstrap/resume and response-hints with graph-first guidance, and update the routing playbook plus payload tests. Public already has the contracts and verification surfaces for this phase. [SOURCE: .opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/19-result-confidence.md:10-31; .opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/20-result-provenance.md:10-36; .opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:86-133; .opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md:16-35]

### Finding 70
The near-term phase should add coordination, not replacement: modality-aware rebuild policy over current incremental index and code-graph readiness, local-file-only multimodal support for PDFs/screenshots/diagrams, and stage2-fusion use of richer graph metadata. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:152-191; .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:95-104; .opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:165-227; .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:21-34]

### Finding 71
The later phase is optional and signal-driven: add community labeling to the current graph, feed those labels into fusion and context handlers, and measure the impact with existing session-quality and routing metrics. This is the only phase that should consider a clustering dependency, and only after phases 1 and 2 prove useful. [SOURCE: .opencode/skill/system-spec-kit/manual_testing_playbook/10--graph-signal-activation/022-community-detection-n2c.md:18-29; .opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:206-245; .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:21-34]

### Finding 72
The rollout must explicitly reject four tempting but misaligned moves: separate graph-only payload families, graphify-style remote ingestion, a parallel serve layer, and wholesale replacement of Code Graph MCP or CocoIndex. Every strong wave-2 answer points toward enrichment of current surfaces, not subsystem duplication. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:165-227; .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:171-189; .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:203-217; .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:21-34]

## Cross-Phase Overlap Handling
- This iteration synthesized only the rollout implications of wave 2 and did not reopen wave-1 source analysis.
- It preserved the packet's cross-phase boundaries by treating Code Graph MCP and CocoIndex as the fixed platform, not as candidates for replacement.

## Exhausted / Ruled-Out Directions
- I looked for justification to recommend a graphify-style subsystem transplant and ruled it out. The strongest rollout path is phased enrichment of current contracts, handlers, and scoring layers. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:171-189; .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:21-34]

## Final Verdict on Q22
Public's best rollout is three-phase. Phase 1: additive provenance, confidence, and routing guidance on current payloads and tests. Phase 2: modality-aware rebuild policy and local-file-only multimodal expansion. Phase 3: optional clustering and community-aware ranking if the first two phases demonstrate value. The architecture does not justify a graphify-style replacement path.

## Recommended Next Focus
[All tracked questions are resolved. Research is complete. Optional next step: open a follow-on implementation packet only if the team decides to execute the phased rollout recommendations.]

## Tools Used
- `sed -n`
- `rg -n`
- `nl -ba`

## Sources Queried
- `.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/19-result-confidence.md:10-31`
- `.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/20-result-provenance.md:10-36`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:86-133`
- `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md:16-35`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:152-191`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:95-104`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:171-189`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:165-227`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:21-34`
- `.opencode/skill/system-spec-kit/manual_testing_playbook/10--graph-signal-activation/022-community-detection-n2c.md:18-29`
- `.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:206-245`
