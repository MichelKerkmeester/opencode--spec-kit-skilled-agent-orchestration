# Iteration 16: D3 Improvement Namespace vs Shared Graph Boundary

## Focus
This pass investigated the remaining D3 namespace-isolation question by tracing `sk-improve-agent`'s `mutation-coverage.cjs` against the shared coverage-graph SQLite DB, MCP query handlers, and convergence handler. The goal was to confirm whether `loop_type: "improvement"` actually lands in the shared store and whether any shipped read surface can co-mingle improvement-session nodes with research/review sessions.

## Findings
- `scripts/mutation-coverage.cjs` is a local JSON helper, not a shared SQLite writer: it creates an in-file graph object with `loopType: 'improvement'` and persists it by reading and rewriting `coveragePath` JSON via `fs.readFileSync` / `fs.writeFileSync`, with no shared coverage-graph imports or MCP calls in the module (`.opencode/skill/sk-improve-agent/scripts/mutation-coverage.cjs:21`, `.opencode/skill/sk-improve-agent/scripts/mutation-coverage.cjs:41-53`, `.opencode/skill/sk-improve-agent/scripts/mutation-coverage.cjs:59-67`, `.opencode/skill/sk-improve-agent/scripts/mutation-coverage.cjs:80-92`, `.opencode/skill/sk-improve-agent/scripts/mutation-coverage.cjs:192-205`).
- The published `sk-improve-agent` contract and visible auto workflow keep that mutation coverage graph local to the improvement runtime rather than bridging it into the shared coverage-graph MCP. The skill describes `scripts/mutation-coverage.cjs` as the reader/writer for the coverage graph and says it uses `loop_type: "improvement"` isolation, while the auto workflow only appends the state ledger and runs `scripts/reduce-state.cjs`; I found no visible `deep_loop_graph_upsert` step on this path (`.opencode/skill/sk-improve-agent/SKILL.md:298-300`, `.opencode/skill/sk-improve-agent/SKILL.md:389-390`, `.opencode/command/improve/assets/improve_agent-improver_auto.yaml:149-155`).
- The shared SQLite coverage graph does not admit `improvement` loop types at all. The DB layer defines `LoopType = 'research' | 'review'`, constrains valid kinds/relations by those two namespaces, and the schema enforces `CHECK(loop_type IN ('research', 'review'))`; the MCP upsert handler repeats the same validation and rejects any other value (`.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:17`, `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:136-146`, `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:152-157`, `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts:51-53`, `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts:72-80`).
- Because the shipped shared-store path accepts only `research` and `review`, improvement-session nodes cannot currently co-mingle with deep-research or deep-review nodes inside the shared SQLite store through the visible MCP boundary. The more accurate finding is contract drift: Section 11 and Known Context both frame the improvement namespace as if it persists into the shared store, but the live writer and validator surfaces show a separate local JSON graph instead (`.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/deep-research-strategy.md:43`, `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/deep-research-strategy.md:556-557`, `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/deep-research-strategy.md:599`, `.opencode/skill/sk-improve-agent/scripts/mutation-coverage.cjs:59-67`, `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts:76-78`).
- A different namespace-isolation weakness does exist on the shared read side for research/review sessions: the convergence handler never accepts `sessionId`, constructs its namespace from only `{ specFolder, loopType }`, and then calls `getStats()` plus `computeSignals()` / `computeMomentum()` without session scoping, so convergence decisions aggregate all sessions sharing the same spec folder and loop type (`.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:47-52`, `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:92-111`, `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:511-545`, `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:163-220`).
- The query surface only partially exposes session isolation. `handleCoverageGraphQuery()` accepts `sessionId` and passes it into `ns`, but the inspected helper queries for coverage gaps, contradictions, and unverified claims read by `spec_folder` and `loop_type` only, ignoring `ns.sessionId`; this means research/review sessions can be co-mingled on read even though improvement-mode entries are blocked from the DB entirely (`.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts:28-35`, `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts:55-58`, `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts:63-126`, `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts:136-147`, `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts:238-277`).

## Ruled Out
- The visible MCP coverage-graph path is not currently allowing `loop_type: "improvement"` to pollute shared research/review graphs; the stronger risk is documentation/strategy drift plus missing per-session read isolation inside the research/review namespaces.

## Dead Ends
- I did not inspect hidden executor internals outside the published skill, workflow, and MCP handler surfaces, so the negative claim stays scoped to the shipped writer/validator/query path that is visible in-repo.

## Sources Consulted
- `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/deep-research-strategy.md:43`
- `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/deep-research-strategy.md:556-557`
- `.opencode/skill/sk-improve-agent/scripts/mutation-coverage.cjs:21-205`
- `.opencode/skill/sk-improve-agent/SKILL.md:298-300`
- `.opencode/command/improve/assets/improve_agent-improver_auto.yaml:149-155`
- `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:17-18`
- `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:152-157`
- `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:511-545`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts:51-53`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts:72-80`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts:28-35`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:47-52`
- `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts:63-147`
- `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts:238-277`
- `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:163-220`

## Reflection
- What worked and why: Reading the improvement-side writer next to the shared DB schema and MCP validators made the namespace boundary visible quickly because the accepted `loopType` values are explicit in both places.
- What did not work and why: Proving absolute absence beyond the published workflow and handler surfaces is still not possible from this pass alone, so the conclusion has to stay scoped to the visible shipped path.
- What I would do differently: I would pair this namespace finding with a tiny runtime fixture next time so the doc drift and the cross-session read aggregation can be demonstrated with one concrete DB example rather than static code evidence only.

## Recommended Next Focus
Rotate to the last open D3 question on trade-off false positives and small-sample benchmark stability. The most productive next pass is to inspect `scripts/trade-off-detector.cjs`, `scripts/benchmark-stability.cjs`, their tests, and any reducer/dashboard consumers together to determine whether low-sample benchmark runs can trigger Pareto regression warnings or instability gating before enough evidence exists, and whether the current reducer/operator surfaces distinguish "real trade-off" from "insufficient sample size."
