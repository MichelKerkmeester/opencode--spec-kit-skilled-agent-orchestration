---
title: Deep Research Dashboard
description: Auto-generated reducer view over the research packet.
---

# Deep Research Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active research packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Topic: Further improvements to sk-deep-research v1.5.0.0, sk-deep-review v1.2.0.0, and sk-improve-agent v1.1.0.0 (and their associated commands, agents, YAML workflows): self-compliance audit, coverage graph integration audit, and prioritized recommendations.
- Started: 2026-04-11T08:02:52Z
- Status: INITIALIZED
- Iteration: 5 of 20
- Session ID: rsr-2026-04-11T08-02-52Z
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | D1 reducer rollup and resume drift | - | 1.00 | 5 | complete |
| 2 | D5 Coverage Graph Read-Path Audit | - | 0.75 | 4 | complete |
| 3 | D5 Shared Graph Bridge Wiring Audit | - | 0.80 | 6 | complete |
| 4 | D4 lineage modes and blocked-stop persistence | - | 0.83 | 5 | complete |
| 5 | D4 stop-reason liveness audit | - | 0.67 | 6 | complete |

- iterationsCompleted: 5
- keyFindings: 26
- openQuestions: 10
- resolvedQuestions: 6

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 6/16
- [x] D1: What undocumented edge cases, redundant reducer passes, journal-rollup gaps, or resume-flow drifts exist in the sk-deep-research v1.5.0.0 loop?
- [x] D4: Do the loops emit the full `STOP_REASONS` enum in practice, or are any values (`blockedStop`, `stuckRecovery`, `userPaused`) effectively dead code?
- [x] D4: Do blocked-stop events always persist `gateResults` with the complete set of review-specific or research-specific gates, or are gates silently dropped?
- [x] D4: Are resume flows (`resume`, `restart`, `fork`, `completed-continue`) actually exercised by the YAML workflows, or only documented?
- [x] D5: Does any loop phase (init / iteration / convergence / synthesis) actively READ from the coverage graph (`coverage-graph-query.ts`, `coverage-graph-convergence.cjs`) to inform decisions, or only WRITE to it?
- [x] D5: Is the `graphEvents` JSONL field consumed by the reducer or downstream tools, or is it write-only?
- [ ] D1: Are there convergence signals that should exist but currently don't (e.g., citation density, source diversity, contradiction frequency)?
- [ ] D2: How effective is the legal-stop gate bundle in sk-deep-review v1.2.0.0 under real review sessions, and where do dimension coverage gates still allow drift?
- [ ] D2: Does the new `scripts/reduce-state.cjs` correctly handle partial-failure iterations, severity transitions, and finding deduplication at scale (50+ findings)?
- [ ] D3: How fault-tolerant is the orchestrator-only journal emission in sk-improve-agent v1.1.0.0 when a candidate session is interrupted mid-flight?
- [ ] D3: Does the trade-off detector produce false positives on small benchmark samples, and does benchmark-stability gating compensate?
- [ ] D3: Is the mutation coverage graph namespace (`loop_type: "improvement"`) properly isolated from the deep-research/deep-review namespaces in the shared SQLite store?
- [ ] D4: Do the reducers ever write outside their declared machine-owned anchors, violating the contract?
- [ ] D5: Do convergence gates consult `coverage-graph-contradictions.cjs` to block STOP on contradictions, or only consult ratio-based signals?
- [ ] D5: Does the coverage graph's contribution to the 3-signal convergence math exceed its weight, or is it merely nominal?
- [ ] D5: Are there missing MCP tool calls (e.g., `code_graph_query` for semantic neighbors) that the loops should be making but aren't?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- Last 3 ratios: 0.80 -> 0.83 -> 0.67
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.67
- coverageBySources: {"code":64,"other":25}

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- .opencode/agent/deep-research.md:159-166 (iteration 1)
- .opencode/skill/sk-deep-research/references/loop_protocol.md:190-198 (iteration 1)
- .opencode/skill/sk-deep-research/references/loop_protocol.md:247-255 (iteration 1)
- .opencode/skill/sk-deep-research/references/loop_protocol.md:77-84 (iteration 1)
- .opencode/skill/sk-deep-research/references/state_format.md:145-177 (iteration 1)
- .opencode/skill/sk-deep-research/scripts/reduce-state.cjs:103-127 (iteration 1)
- .opencode/skill/sk-deep-research/scripts/reduce-state.cjs:438-444 (iteration 1)
- .opencode/skill/sk-deep-research/scripts/reduce-state.cjs:489-502 (iteration 1)
- .opencode/skill/sk-deep-research/SKILL.md:190-199 (iteration 1)
- .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/deep-research-strategy.md:36-38 (iteration 1)
- No evidence that prior iteration findings would make these observations redundant; `research/iterations/` was empty before this run and `deep-research-state.jsonl` only contained the config row (.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/deep-research-state.jsonl:1). (iteration 1)
- No evidence that YAML workflow outputs bypass the reducer-owned packet surfaces; both auto and confirm flows still target `findings-registry.json` and `deep-research-dashboard.md` as synchronized outputs (.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:83-84; .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:197; .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:83-84; .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:196-217). (iteration 1)
- .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:326 (iteration 2)
- .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:436-437 (iteration 2)
- .opencode/skill/sk-deep-research/scripts/reduce-state.cjs:103-127 (iteration 2)
- .opencode/skill/sk-deep-research/scripts/reduce-state.cjs:489-502 (iteration 2)
- .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:109-163 (iteration 2)
- .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:20-25 (iteration 2)
- .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:245-275 (iteration 2)
- .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:343-355 (iteration 2)
- .opencode/skill/system-spec-kit/scripts/lib/coverage-graph-contradictions.cjs:37-67 (iteration 2)
- .opencode/skill/system-spec-kit/scripts/lib/coverage-graph-contradictions.cjs:85-129 (iteration 2)
- .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/deep-research-strategy.md:48-52 (iteration 2)
- .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/iterations/iteration-001.md:7-10 (iteration 2)
- The graph layer is not purely nominal overall; the shared MCP convergence handler can block STOP on graph-derived coverage gaps, contradictions, unverified claims, source diversity, and evidence depth when it is actually invoked (.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:122-163; .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:225-275; .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:330-355). (iteration 2)
- .opencode/agent/agent-improver.md:175-177 (iteration 3)
- .opencode/skill/sk-deep-research/references/convergence.md:1181-1205 (iteration 3)
- .opencode/skill/sk-deep-research/scripts/reduce-state.cjs:11-12 (iteration 3)
- .opencode/skill/sk-deep-review/references/convergence.md:658-683 (iteration 3)
- .opencode/skill/sk-improve-agent/scripts/mutation-coverage.cjs:16-67 (iteration 3)
- .opencode/skill/sk-improve-agent/SKILL.md:294-300 (iteration 3)
- .opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-db.vitest.ts:135-185 (iteration 3)
- .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:779-869 (iteration 3)
- .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/implementation-summary.md:47-55 (iteration 3)
- .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/deep-research-strategy.md:48-52 (iteration 3)
- .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/iterations/iteration-002.md:7-10 (iteration 3)
- No hidden bridge appeared in the active reducer path: the deep-research reducer still has no MCP/tool client imports and no graph-event parsing branch, so the bridge is not merely buried deeper in the same file (.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:11-12; .opencode/skill/sk-deep-research/scripts/reduce-state.cjs:246-247). (iteration 3)
- The shared graph capability itself is not missing; the missing piece is runtime wiring. The MCP tool layer already exposes both `deep_loop_graph_upsert` and `deep_loop_graph_convergence` with reducer-oriented contracts (.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:779-823; .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:856-869). (iteration 3)
- I did not inspect confirm-mode YAMLs in this pass because the strategy focus was the normal runtime path, and the auto workflows plus reducers were enough to establish the serialization gap. (iteration 4)
- This is not isolated to one loop. The research and review auto YAMLs both classify the same lineage branches while only surfacing a smaller event set in the active runtime path (`.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:128-153`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:155-177`). (iteration 4)
- This is not just a documentation omission. Both convergence references are explicit about first-class blocked-stop persistence and full gate bundles, so the drift is between published contract and live workflow serialization, not between two equally vague docs (`.opencode/skill/sk-deep-research/references/convergence.md:305-309`, `.opencode/skill/sk-deep-review/references/convergence.md:58-85`). (iteration 4)
- `stuckRecovery` is not entirely absent from runtime serialization, but the only concrete live record I found is review's raw `stuck_recovery` event; that is weaker than the documented shared enum contract and does not prove consumer-visible normalization (.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:375-383). (iteration 5)
- I did not inspect confirm-mode YAMLs in this pass because the active auto workflows plus reducer consumers were already sufficient to determine whether the shared stop-reason enum is promoted into persisted state. (iteration 5)
- This is not a documentation-gap false alarm: both convergence references already define the shared enum, the legacy-label normalization rules, and the required blocked-stop persistence shape in detail (.opencode/skill/sk-deep-research/references/convergence.md:21-31; .opencode/skill/sk-deep-review/references/convergence.md:44-56). (iteration 5)

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
Rotate to D5 and trace whether contradiction-aware convergence is live or still mostly contractual. The next productive pass is to follow the active runtime path from deep-research/deep-review YAML convergence steps into any shared convergence helpers and verify whether `coverage-graph-contradictions.cjs` or the MCP convergence handler is actually consulted before STOP, or whether contradiction blocking still depends on graph wiring that the current workflows never invoke.

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->
