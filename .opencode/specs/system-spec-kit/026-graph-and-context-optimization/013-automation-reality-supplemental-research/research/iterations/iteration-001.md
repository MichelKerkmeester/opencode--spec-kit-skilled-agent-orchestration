# Iteration 1: Deep-loop Graph Automation Reality

## Status
insight

## Focus
Deep-loop graph automation reality (deep_loop_graph_query/upsert/convergence/status entry-point catalog)

## Sources read
- `.opencode/command/spec_kit/deep-research.md:18-21` - deep-research command entry loads auto/confirm YAML after setup, so YAML steps are the production command path.
- `.opencode/command/spec_kit/deep-review.md:20-23` - deep-review command entry loads auto/confirm YAML after setup, so YAML steps are the production command path.
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:392-408` - research auto workflow calls `mcp__spec_kit_memory__deep_loop_graph_convergence` before inline stop voting and appends a `graph_convergence` event.
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:399-410` - research confirm workflow has the same convergence MCP call.
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:410-425` - review auto workflow calls `mcp__spec_kit_memory__deep_loop_graph_convergence` before review stop voting.
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:423-438` - review confirm workflow has the same convergence MCP call.
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:817-836` - research auto workflow conditionally calls `mcp__spec_kit_memory__deep_loop_graph_upsert` only when latest iteration `graphEvents` are present.
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:687-705` - research confirm workflow conditionally calls the same upsert tool.
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:841-863` - review auto workflow transforms latest `graphEvents` into nodes/edges, then conditionally calls upsert.
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:832-853` - review confirm workflow has the same review upsert path and skip condition.
- `.opencode/skill/sk-deep-research/assets/prompt_pack_iteration.md.tmpl:28-32` - research iteration agents may emit optional `graphEvents`; they omit the field when none are produced.
- `.opencode/skill/sk-deep-review/assets/prompt_pack_iteration.md.tmpl:54-59` - review iteration agents may emit optional `graphEvents`; they omit the field when none are produced.
- `.opencode/skill/system-spec-kit/mcp_server/tools/index.ts:31-47` - all four deep-loop graph tools are registered in the MCP coverageGraphTools dispatcher.
- `.opencode/skill/system-spec-kit/mcp_server/tools/index.ts:86-112` - generic MCP dispatch routes a requested tool name to the matching dispatcher; this is an operator/tool-call path, not ambient automation.
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:920-1014` - MCP server handles `CallToolRequestSchema`, records metrics, then dispatches the requested tool name; no deep-loop graph tool is called unless requested or by YAML.
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:797-889` - operator-visible schemas exist for `deep_loop_graph_upsert`, `query`, `status`, and `convergence`.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts:42-43` - query handler is a direct MCP handler.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/status.ts:33-34` - status handler is a direct MCP handler.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts:65-86` - upsert handler is a direct MCP handler and rejects empty node/edge batches.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:146-180` - convergence handler is a direct MCP handler; empty graphs return `CONTINUE`.
- `.opencode/skill/system-spec-kit/mcp_server/tests/deep-loop-graph-query.vitest.ts:63-138` - tests exercise query/status/upsert handler behavior directly, not YAML auto-fire.
- `.opencode/skill/system-spec-kit/mcp_server/tests/graph-aware-stop.vitest.ts:60-114` - tests exercise convergence/upsert handler behavior directly, not YAML auto-fire.
- `specs/system-spec-kit/026-graph-and-context-optimization/012-automation-self-management-deep-research/research/research-report.md:5` - prior 012 baseline had 50 reality-map rows; exact search found no `deep_loop_graph` row in that packet.

## Findings (4-class reality map rows)

| Tool | Auto-fire trigger (file:line) | Manual entry | Class | Severity if aspirational |
|------|-------------------------------|--------------|-------|--------------------------|
| deep_loop_graph_query | No YAML auto-fire found; registered as MCP-only coverage graph dispatcher at `.opencode/skill/system-spec-kit/mcp_server/tools/index.ts:31-47` and implemented at `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts:42-43`. | Direct MCP tool call `mcp__spec_kit_memory__deep_loop_graph_query` using the schema at `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:844-859`. | manual | n/a |
| deep_loop_graph_upsert | Research auto/confirm: `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:817-836`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:687-705`; review auto/confirm: `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:841-863`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:832-853`. All paths depend on latest iteration `graphEvents`. | Indirect slash-command entry through `/spec_kit:deep-research:auto|confirm` or `/spec_kit:deep-review:auto|confirm`; direct MCP call `mcp__spec_kit_memory__deep_loop_graph_upsert` using `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:797-841`. | half | n/a |
| deep_loop_graph_convergence | Research auto/confirm: `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:392-408`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:399-410`; review auto/confirm: `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:410-425`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:423-438`. | Indirect slash-command entry through `/spec_kit:deep-research:auto|confirm` or `/spec_kit:deep-review:auto|confirm`; direct MCP call `mcp__spec_kit_memory__deep_loop_graph_convergence` using `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:876-889`. | auto | n/a |
| deep_loop_graph_status | No YAML auto-fire found; registered as MCP-only coverage graph dispatcher at `.opencode/skill/system-spec-kit/mcp_server/tools/index.ts:31-47` and implemented at `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/status.ts:33-34`. | Direct MCP tool call `mcp__spec_kit_memory__deep_loop_graph_status` using the schema at `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:862-873`. | manual | n/a |

## Adversarial check (Hunter→Skeptic→Referee)
Hunter: `deep_loop_graph_convergence` and `deep_loop_graph_upsert` are not test-only. The command markdown says production command execution resolves setup, loads the matching YAML, and executes it step by step (`.opencode/command/spec_kit/deep-research.md:18-21`, `.opencode/command/spec_kit/deep-review.md:20-23`). The YAMLs contain live MCP-tool steps for convergence and upsert.

Skeptic: Handler tests prove the tools work, but not auto-fire. `deep-loop-graph-query.vitest.ts` imports and calls query/status/upsert handlers directly (`.opencode/skill/system-spec-kit/mcp_server/tests/deep-loop-graph-query.vitest.ts:30-41`, `.opencode/skill/system-spec-kit/mcp_server/tests/deep-loop-graph-query.vitest.ts:63-138`), and `graph-aware-stop.vitest.ts` imports convergence/upsert directly (`.opencode/skill/system-spec-kit/mcp_server/tests/graph-aware-stop.vitest.ts:29-38`, `.opencode/skill/system-spec-kit/mcp_server/tests/graph-aware-stop.vitest.ts:60-114`). Tests do not promote query/status to auto-fire.

Referee: `convergence` is `auto` inside the deep-research and deep-review YAML workflows. `upsert` is `half`: the workflow step is real, but it is skipped when the latest iteration lacks `graphEvents`, and iteration prompts explicitly make `graphEvents` optional (`.opencode/skill/sk-deep-research/assets/prompt_pack_iteration.md.tmpl:28-32`, `.opencode/skill/sk-deep-review/assets/prompt_pack_iteration.md.tmpl:54-59`). `query` and `status` remain `manual`; exact searches found no command-YAML, bootstrap, watcher, or after-tool path that invokes them automatically beyond the generic requested-tool dispatch path (`.opencode/skill/system-spec-kit/mcp_server/context-server.ts:920-1014`, `.opencode/skill/system-spec-kit/mcp_server/tools/index.ts:86-112`).

## newInfoRatio estimate
0.82 - this supplemental pass adds a four-tool deep-loop graph reality map that was absent from 012's 50-row baseline; only the broader "manual command vs narrow auto path" framing repeats from 012.

## Next focus
Iteration 2 should drill into CCC, eval reporting, and ablation-runner reality: identify every explicit command, any generated-report auto path, and whether any "evaluation automation" claim is only operator-triggered automation.
