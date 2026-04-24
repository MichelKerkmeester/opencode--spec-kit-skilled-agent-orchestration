## Iteration 07
### Focus
Budget enforcement and latency controls in `code_graph_context`.

### Findings
- `ContextArgs` and `buildContext()` both support `deadlineMs`, but `handleCodeGraphContext()` never forwards a deadline into `contextArgs`, leaving the guard dormant for live MCP calls [.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-context.ts:13-21,71-95; .opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/context.ts:166-176].
- Even when a deadline is present, only `impact` mode checks the elapsed budget; `neighborhood` and `outline` can still walk all outgoing/incoming edges or all outline nodes without an equivalent latency break [.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-context.ts:178-247].
- The current context tests cover readiness metadata and graph metadata shape, but not deadline propagation or truncation behavior, so the shipped "bounded inline refresh" story has no regression harness on the context side [.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-context-handler.vitest.ts:56-104].

### New Questions
- Should the handler derive a default `deadlineMs` from the token budget or a dedicated env knob?
- Should `neighborhood` and `outline` share the same `budgetMs` breaker that `impact` already uses?
- Would deduplicating nodes/edges before formatting reduce both latency and token pressure enough to matter?
- Is the right contract "return partial sections with trace metadata" or "fail fast with a bounded warning" when the deadline trips?

### Status
converging
