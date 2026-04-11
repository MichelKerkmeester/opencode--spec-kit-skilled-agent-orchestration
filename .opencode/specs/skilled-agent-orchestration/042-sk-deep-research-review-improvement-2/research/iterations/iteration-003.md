# Iteration 3: D5 Shared Graph Bridge Wiring Audit

## Focus
This iteration stayed on D5 and traced the missing runtime bridge between emitted `graphEvents` and the persisted deep-loop graph namespace used by `deep_loop_graph_convergence`. The goal was to determine whether any reducer, orchestrator, or wrapper outside the loop-local YAML contracts actually calls `deep_loop_graph_upsert`, or whether the current bridge only exists in specs, docs, and tests.

## Findings
- `sk-deep-research`'s active reducer does not implement the shared-graph bridge: it only imports `node:fs` and `node:path`, and the only reducer references matching `graph|convergence|upsert|deep_loop` are pass-through reads of precomputed `convergenceSignals`, not graph parsing or MCP calls (.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:11-12; .opencode/skill/sk-deep-research/scripts/reduce-state.cjs:246-247; .opencode/skill/sk-deep-research/scripts/reduce-state.cjs:271; .opencode/skill/sk-deep-research/scripts/reduce-state.cjs:442).
- Both deep-loop convergence contracts still document a reducer-owned in-memory graph bridge that is not present in the live reducer: deep research says "the reducer builds an in-memory coverage graph" when `graphEvents` exist, and deep review says the same for review iterations (.opencode/skill/sk-deep-research/references/convergence.md:1181-1205; .opencode/skill/sk-deep-review/references/convergence.md:658-683).
- The shared MCP surface is ready for the bridge, but it is only exposed as tool definitions in the current runtime evidence I inspected: `deep_loop_graph_upsert` is described as reducer-owned iteration persistence and `deep_loop_graph_convergence` as the graph-backed stop assessor, yet this pass found no active command/skill/agent callsite invoking either tool outside specs and handler definitions (.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:779-823; .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:856-869).
- `graphEvents` are not fully write-only overall, but the concrete downstream consumer I found is test/replay code rather than the normal loop runtime: `coverage-graph-db.vitest.ts` manually simulates replay by iterating over `record.graphEvents` arrays and rebuilding node/edge collections from JSONL-shaped records (.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-db.vitest.ts:135-185).
- The 042 graph-integration packet explicitly recorded the intended bridge as already implemented: its implementation summary says the reducer parses `graphEvents`, calls `deep_loop_graph_upsert`, and falls back through `JSONL -> local JSON graph -> SQLite projection`, which sharpens this audit result into a current reality gap between packet claims and runtime wiring (.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/implementation-summary.md:47-55).
- `sk-improve-agent` follows a different path entirely: its resume contract replays a local "coverage graph + registry", and `mutation-coverage.cjs` persists an `improvement` JSON graph with `fs`/`path` helpers and `loopType: 'improvement'`, while the agent only consumes an orchestrator-provided summary as advisory context. That means it does not supply the missing shared `deep_loop_graph_*` bridge for research/review convergence (.opencode/skill/sk-improve-agent/SKILL.md:294-300; .opencode/skill/sk-improve-agent/scripts/mutation-coverage.cjs:9-10; .opencode/skill/sk-improve-agent/scripts/mutation-coverage.cjs:21; .opencode/skill/sk-improve-agent/scripts/mutation-coverage.cjs:50-67; .opencode/agent/agent-improver.md:175-177).

## Ruled Out
- No hidden bridge appeared in the active reducer path: the deep-research reducer still has no MCP/tool client imports and no graph-event parsing branch, so the bridge is not merely buried deeper in the same file (.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:11-12; .opencode/skill/sk-deep-research/scripts/reduce-state.cjs:246-247).
- The shared graph capability itself is not missing; the missing piece is runtime wiring. The MCP tool layer already exposes both `deep_loop_graph_upsert` and `deep_loop_graph_convergence` with reducer-oriented contracts (.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:779-823; .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:856-869).

## Dead Ends

## Sources Consulted
- .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/deep-research-strategy.md:48-52
- .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/iterations/iteration-002.md:7-10
- .opencode/skill/sk-deep-research/scripts/reduce-state.cjs:11-12
- .opencode/skill/sk-deep-research/references/convergence.md:1181-1205
- .opencode/skill/sk-deep-review/references/convergence.md:658-683
- .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:779-869
- .opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-db.vitest.ts:135-185
- .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/implementation-summary.md:47-55
- .opencode/skill/sk-improve-agent/SKILL.md:294-300
- .opencode/skill/sk-improve-agent/scripts/mutation-coverage.cjs:16-67
- .opencode/agent/agent-improver.md:175-177

## Reflection
- What worked and why: Comparing live reducer imports and search hits against the documented bridge contract made the missing runtime handoff explicit very quickly.
- What did not work and why: Repo-wide symbol search still surfaced older packet/spec artifacts, so I had to keep separating "promised by 042 docs" from "called by active runtime code."
- What I would do differently: I would check test-only replay consumers earlier, because they explain why `graphEvents` are not strictly dead data even though the normal runtime path still lacks the shared persistence bridge.

## Recommended Next Focus
Rotate to D4 and verify whether the documented lineage modes and stop-state persistence are actually exercised by the live workflows: compare the deep-research/deep-review YAMLs, reducer inputs, and JSONL event handling to see whether `resume`, `restart`, `fork`, `completed-continue`, and `blockedStop` with full gate payloads survive the normal runtime path or remain primarily contractual/documented behavior.
