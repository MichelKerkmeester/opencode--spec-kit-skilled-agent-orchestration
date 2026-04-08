# Iteration 17: Architecture-Native Evaluation Metrics for Public

## Focus
This iteration answers Q20 by replacing graphify's headline-token-reduction framing with metrics that actually fit Public's architecture. The right metric set should measure routing quality, freshness, continuity, and token impact using existing observability fields rather than a synthetic single number.

## Findings

### Finding 57
Public already has an architecture-native session quality score. `context-metrics.ts` weights recency, recovery, graph freshness, and continuity, which is much closer to Public's real value proposition than graphify's "71.5x tokens" benchmark. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:206-245]

### Finding 58
The response-hints hook already captures token count, latency, and surfaced timing. That means token efficiency can still be measured, but in the context of actual runtime surfaces and hint delivery rather than as a standalone marketing ratio. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:40-83; .opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:86-133]

### Finding 59
Public already has a manual routing verification surface that can measure whether semantic versus structural routing happened correctly. That supports a routing-precision metric, which is more actionable for Public than graphify's corpus-level stuffing comparison. [SOURCE: .opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md:16-35]

### Finding 60
The correct metric stack for Public is therefore multi-dimensional: routing precision, seed-resolution success, graph freshness, session quality, and token/latency overhead from auto-surfaced hints. Those are architecture-native, reproducible, and already partially instrumented. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:206-245; .opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:86-133; .opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md:16-35]

## Cross-Phase Overlap Handling
- This iteration measured Public on its own terms instead of comparing graphify and Public through a synthetic benchmark lens.
- It reused existing observability surfaces rather than speculating about future dashboards.

## Exhausted / Ruled-Out Directions
- I looked for a single replacement headline number and ruled it out. Public's architecture is already instrumented across continuity, freshness, routing, and hinting, so a single headline metric would under-describe the system. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:206-245; .opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:86-133]

## Final Verdict on Q20
Public should not chase a graphify-style headline benchmark. It should report a metric bundle: routing precision, seed-resolution quality, graph freshness, session quality, and hint token/latency overhead, all grounded in current runtime observability surfaces.

## Tools Used
- `sed -n`
- `rg -n`
- `nl -ba`

## Sources Queried
- `.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:206-245`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:40-83`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:86-133`
- `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md:16-35`
