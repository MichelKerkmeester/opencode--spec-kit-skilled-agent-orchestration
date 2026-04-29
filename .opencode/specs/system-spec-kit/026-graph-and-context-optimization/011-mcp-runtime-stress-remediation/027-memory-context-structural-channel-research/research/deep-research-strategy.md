# Deep Research Strategy: memory_context Structural Channel Routing

## Topic
Extending `memory_context`'s intent-aware routing to include `code_graph_query` as a structural retrieval channel. Three sub-questions: intent signal reliability, merged response shape, envelope routing-trace coverage.

## Executor
- cli-codex `gpt-5.5` reasoning=`xhigh` service-tier=default (normal)
- maxIterations=5, convergenceThreshold=0.10, stuckThreshold=2

## Iteration Focus Map (Pre-Plan; iterations may refine)

| Iter | Focus | Primary RQs |
|------|-------|-------------|
| 1 | Inventory intent-detection rules: advisor (`context-server.ts:335`) + memory_context + tool-schemas. Catalog existing structural-vs-semantic signals. | RQ1 |
| 2 | Quantify false-positive / false-negative against v1.0.3 corpus + Phase E gold battery. Identify weak signals + edge cases. | RQ1 |
| 3 | Merged response shape evaluation: flatten vs union vs split-payload against existing consumers. Consumer audit. | RQ2 |
| 4 | SearchDecisionEnvelope coverage: map fusion paths to existing fields (selectedChannels, skippedChannels, routingReasons); identify new fields if any. | RQ3 |
| 5 | Synthesis + Planning Packet for implementation phase. | RQ1-3 + all |

## Known Context

### Tools and entry points
- `memory_context` — `tool-schemas.ts:48` (intent-aware routing entry point)
- `memory_search` — `tool-schemas.ts:55` (semantic vector search)
- `code_graph_query` — `tool-schemas.ts:573` (structural code queries)

### Critical files
- `mcp_server/tool-schemas.ts:48-573` (tool descriptions + intent hints)
- `mcp_server/context-server.ts:226-340` (advisor structural-intent nudge logic)
- `mcp_server/handlers/memory-context.ts` (find it; routing logic)
- `mcp_server/handlers/memory-search.ts:1100-1200` (envelope build site)
- `mcp_server/code_graph/handlers/query.ts` (code_graph_query response shape)
- `mcp_server/lib/search/search-decision-envelope.ts` (envelope contract — selectedChannels, skippedChannels, routingReasons)
- `mcp_server/lib/query/query-plan.ts` (QueryPlan: intent, complexity, artifactClass, authorityNeed, selectedChannels, skippedChannels, routingReasons, fallbackPolicy)

### Evidence corpora
- v1.0.3 stress: `specs/.../011/021-stress-test-v1-0-3-with-w3-w13-wiring/`
- Phase E gold battery: `specs/.../000-release-cleanup/005-review-remediation/007-search-rag-measurement-driven-implementation/measurements/`
- Phase J research output: `specs/.../011/022-stress-test-results-deep-research/research/research-report.md`

## Constraints
- READ ONLY for runtime code, harness, prior packets.
- Per-iter file:line citations MANDATORY.
- Speculation findings get severity ≤ P2.
- Convergence honest; stop when newInfoRatio < 0.10 for 2 consecutive iters OR max=5 reached.

## Synthesis Targets
- `research/research-report.md` with 9-section structure + Planning Packet
- Per-RQ answers with file:line evidence
- Top recommended response shape with rationale
- Open questions for downstream phases
