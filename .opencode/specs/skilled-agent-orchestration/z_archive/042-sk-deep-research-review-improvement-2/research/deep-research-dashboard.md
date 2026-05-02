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
- Iteration: 20 of 20
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
| 6 | D5 contradiction-aware stop wiring audit | - | 0.60 | 5 | complete |
| 7 | D1 research convergence signal gap audit | - | 0.58 | 6 | complete |
| 8 | D2 partial-failure reducer audit | - | 0.60 | 5 | complete |
| 9 | D2 scale reducer stress audit | - | 0.60 | 5 | complete |
| 10 | D2 dimension-coverage gate effectiveness audit | - | 0.40 | 5 | complete |
| 11 | D3 mid-flight journal and recovery durability | - | 0.80 | 5 | complete |
| 12 | D3 recovery consumer reconstruction audit | - | 0.60 | 5 | complete |
| 13 | D4 reducer anchor boundary audit | - | 0.80 | 6 | complete |
| 14 | D5 convergence weight vs live callers | - | 0.80 | 6 | complete |
| 15 | D5 structural tool routing gap | - | 0.80 | 6 | complete |
| 16 | D3 improvement namespace vs shared graph boundary | - | 0.83 | 6 | complete |
| 17 | D3 small-sample trade-off and stability gating | - | 0.80 | 5 | complete |
| 18 | D4 contract artifact survival audit | - | 0.60 | 5 | complete |
| 19 | D4 upstream improve-agent journal emission path | - | 0.83 | 6 | complete |
| 20 | D5 improve-agent coverage-graph operator-loop audit | - | 0.60 | 5 | complete |

- iterationsCompleted: 20
- keyFindings: 108
- openQuestions: 0
- resolvedQuestions: 16

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 16/16
- [x] D1: What undocumented edge cases, redundant reducer passes, journal-rollup gaps, or resume-flow drifts exist in the sk-deep-research v1.5.0.0 loop?
- [x] D1: Are there convergence signals that should exist but currently don't (e.g., citation density, source diversity, contradiction frequency)?
- [x] D2: How effective is the legal-stop gate bundle in sk-deep-review v1.2.0.0 under real review sessions, and where do dimension coverage gates still allow drift?
- [x] D2: Does the new `scripts/reduce-state.cjs` correctly handle partial-failure iterations, severity transitions, and finding deduplication at scale (50+ findings)?
- [x] D3: How fault-tolerant is the orchestrator-only journal emission in sk-improve-agent v1.1.0.0 when a candidate session is interrupted mid-flight?
- [x] D3: Does the trade-off detector produce false positives on small benchmark samples, and does benchmark-stability gating compensate?
- [x] D3: Is the mutation coverage graph namespace (`loop_type: "improvement"`) properly isolated from the deep-research/deep-review namespaces in the shared SQLite store?
- [x] D4: Do the loops emit the full `STOP_REASONS` enum in practice, or are any values (`blockedStop`, `stuckRecovery`, `userPaused`) effectively dead code?
- [x] D4: Do blocked-stop events always persist `gateResults` with the complete set of review-specific or research-specific gates, or are gates silently dropped?
- [x] D4: Are resume flows (`resume`, `restart`, `fork`, `completed-continue`) actually exercised by the YAML workflows, or only documented?
- [x] D4: Do the reducers ever write outside their declared machine-owned anchors, violating the contract?
- [x] D5: Does any loop phase (init / iteration / convergence / synthesis) actively READ from the coverage graph (`coverage-graph-query.ts`, `coverage-graph-convergence.cjs`) to inform decisions, or only WRITE to it?
- [x] D5: Is the `graphEvents` JSONL field consumed by the reducer or downstream tools, or is it write-only?
- [x] D5: Do convergence gates consult `coverage-graph-contradictions.cjs` to block STOP on contradictions, or only consult ratio-based signals?
- [x] D5: Does the coverage graph's contribution to the 3-signal convergence math exceed its weight, or is it merely nominal?
- [x] D5: Are there missing MCP tool calls (e.g., `code_graph_query` for semantic neighbors) that the loops should be making but aren't?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- Last 3 ratios: 0.60 -> 0.83 -> 0.60
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.60
- coverageBySources: {"code":229,"other":70}

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
- I did not inspect confirm-mode YAMLs in this pass because the strategy explicitly targeted the active runtime path, and the auto workflows plus reducers were already sufficient to determine whether contradiction-aware blocking is reachable before STOP. (iteration 6)
- This is not because contradiction tooling is missing. The shared contradiction scanner and MCP convergence handler already implement contradiction-aware blocking logic (`.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-contradictions.cjs:37-158`, `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:200-264`). (iteration 6)
- This is not limited to one loop. Both research and review convergence references promise graph-aware gate participation, but both active auto workflows keep STOP evaluation inline and local (`.opencode/skill/sk-deep-research/references/convergence.md:1181-1205`, `.opencode/skill/sk-deep-review/references/convergence.md:661-683`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:250-277`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:343-375`). (iteration 6)
- `claimVerificationRate` and `evidenceDepth` should not yet be treated as contract drift in `sk-deep-research`; the current research convergence reference still frames the semantic extension around `semanticNovelty`, `contradictionDensity`, and `citationOverlap` instead (.opencode/skill/sk-deep-research/references/convergence.md:341-457). (iteration 7)
- I did not inspect confirm-mode workflows in this pass because the question was whether the active deep-research runtime currently bridges to the shared graph signal set; the auto workflow, convergence reference, reducer, and shared graph handler were sufficient to classify the signal gaps. (iteration 7)
- This is not primarily a shared-infrastructure deficit: the graph/MCP layer already computes and evaluates the richer research signals, including blocker semantics for `sourceDiversity`, `evidenceDepth`, contradictions, and unverified claims (.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:163-228; .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:175-275). (iteration 7)
- I did not execute the 50+ finding stress portion of the D2 question in this pass; the budget went to reproducing the partial-write divergence first, so scale behavior remains open. (iteration 8)
- This is not a blanket "any truncation breaks lifecycle" failure. If a truncated iteration file still includes a parseable finding bullet, `parseFindingLine()` and `buildFindingRegistry()` can still record the severity transition and mark the finding as repeated (`.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:116-143`, `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:239-267`). (iteration 8)
- A 50+ finding packet does not by itself break `Map`-by-`findingId` dedup or transition ordering; the remaining reducer risk is visibility loss, not merge corruption. (iteration 9)
- I did not pursue confirm-mode workflow differences in this pass because the open question was reducer behavior under a large persisted packet, and the reducer entrypoint plus the shared convergence contract were enough to answer that. (iteration 9)
- I did not find a packet-local `blocked_stop` example under `.opencode/specs` review state logs, so the dimension-skewed evidence had to come from the deep-loop optimizer fixture rather than a live spec review packet. (iteration 10)
- This is not a bad gate taxonomy problem. The blocked-stop fixture uses the same gate names and recovery semantics the contract publishes, so the issue is persistence/consumption drift rather than mislabeled review gates (`.opencode/skill/sk-deep-review/references/convergence.md:362-419`, `.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-optimizer/sample-040-corpus.jsonl:4`). (iteration 10)
- This is not another reducer merge-stability regression. Iteration 9 already established that finding dedup and transition ordering stay stable at 50+ findings, which leaves observability and recovery handoff as the remaining D2 weakness (`.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/iterations/iteration-009.md:7-11`). (iteration 10)
- I did not find a packet-local `improvement-journal.jsonl` or `mutation-coverage.json` artifact to inspect directly, so this pass had to infer interrupted-session behavior from the shipped helper surfaces plus the remaining legacy self-test state. (iteration 11)
- The main D3 risk is not proposal-agent side effects; the failure surface here is orchestrator wiring and persistence fidelity, not the proposal-only boundary itself. (iteration 11)
- I did not find a shipped orchestrator implementation file that performs the promised “replay journal + coverage graph + registry before dispatch,” so this pass had to prove absence via reducer inputs and helper interfaces rather than a single end-to-end resume driver. (iteration 12)
- Repo-wide symbol search for the new D3 modules surfaced mostly docs, specs, changelog entries, and tests, which limited negative-proof evidence to the runtime files that do exist. (iteration 12)
- This is not just a missing-event-taxonomy problem. The journal already recognizes `benchmark_completed`, `blocked_stop`, and `trade_off_detected`, so the main gap is consumer reconstruction and surfacing rather than missing event names (`.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:47-67`). (iteration 12)
- This is not merely reducer documentation drift. The reducer’s own file inputs and registry builder omit the journal, lineage graph, and mutation-coverage artifacts entirely, so the current recovery gap is structural, not just under-explained (`.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:145-235`, `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:489-503`). (iteration 12)
- A normal-pass reducer path that rewrites `review-report.md`; the deep-review reducer writes strategy, registry, and dashboard only. (iteration 13)
- A shipped `sk-improve-agent` reducer path that mutates `agent-improvement-strategy.md`; the reducer never opens or writes that file. (iteration 13)
- I did not inspect synthesis-only report generators or YAML wrappers in this pass because the open D4 question was specifically about reducer write boundaries, and the reducer entry points were sufficient to answer it. (iteration 13)
- "Coverage graph convergence is purely decorative in the codebase." Ruled out because both the CJS helper and the MCP handler contain real thresholds, weighted signals, and STOP-blocking branches; the gap is caller integration, not total absence (`.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs:141-258`, `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:183-379`). (iteration 14)
- Proving every possible runtime call site for `deep_loop_graph_convergence` from the workflow layer alone. The inspected YAML sections were enough to show the visible reducer path, but not enough to prove whether any hidden wrapper invokes the MCP handler elsewhere, so this pass stayed grounded in reducers plus directly cited workflow instructions. (iteration 14)
- A command-doc requirement to invoke structural graph tools before or during iterations; the inspected command surfaces only bootstrap CocoIndex. (iteration 15)
- A wrapper-level `deep_loop_graph_convergence` step on the visible research/review iteration path; the cited YAML paths go from iteration output to reducer execution without a graph-convergence call. (iteration 15)
- I did not inspect hidden executor internals outside the published skill, command, agent, and auto-YAML surfaces, so the negative claim stays scoped to the visible live iteration materials that actually define the LEAF-agent budget and workflow. (iteration 15)
- I did not inspect hidden executor internals outside the published skill, workflow, and MCP handler surfaces, so the negative claim stays scoped to the shipped writer/validator/query path that is visible in-repo. (iteration 16)
- The visible MCP coverage-graph path is not currently allowing `loop_type: "improvement"` to pollute shared research/review graphs; the stronger risk is documentation/strategy drift plus missing per-session read isolation inside the research/review namespaces. (iteration 16)
- Benchmark stability is not over-blocking small samples in the inspected helper path; it under-blocks them by allowing 1-2 replay samples to look stable enough unless visible variance already appears. (`.opencode/skill/sk-improve-agent/scripts/benchmark-stability.cjs:69-92`, `.opencode/skill/sk-improve-agent/scripts/benchmark-stability.cjs:103-171`, `.opencode/skill/sk-improve-agent/scripts/tests/benchmark-stability.vitest.ts:124-139`) (iteration 17)
- I did not find a visible orchestrator implementation file that wires `trade-off-detector.cjs` and `benchmark-stability.cjs` together end-to-end, so the compensation question had to be answered from the shipped helpers, tests, reducer inputs, and dashboard renderer rather than a single runtime driver. (iteration 17)
- This is not primarily a threshold-value bug: the shipped trade-off thresholds and weak-benchmark stop thresholds are internally consistent with config, so the problem is missing sample-size enforcement and signal loss across consumers, not a simple off-by-one constant mismatch. (`.opencode/skill/sk-improve-agent/assets/improvement_config.json:72-79`, `.opencode/skill/sk-improve-agent/assets/improvement_config.json:100-123`, `.opencode/skill/sk-improve-agent/scripts/trade-off-detector.cjs:40-49`) (iteration 17)
- I did not inspect `scripts/improvement-journal.cjs` or the `/improve:agent` YAML emitters in this pass, so I cannot yet tell whether exact stop reasons and session outcomes are produced upstream and then dropped by the reducer, or whether the visible workflow path never emits them at all. (iteration 18)
- This is not universal contract drift. README's `mirror drift as packaging work` guidance survives in the dashboard guardrails, and the dimensional-progress/plateau path is also visibly implemented. (`.opencode/skill/sk-improve-agent/README.md:167-169`, `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:458-463`) (iteration 18)
- I did not find a separate visible orchestrator runtime file that programmatically calls `emitEvent()` outside the command/YAML surfaces inspected here, so the conclusion stays scoped to the shipped command contract, journal helper, visible YAML workflow, and reducer path rather than every possible hidden executor implementation. (iteration 19)
- This is not a reducer-only discard bug. The visible YAML workflow never emits journal events into the reducer input path in the first place, so the contract break begins upstream of `reduce-state.cjs`. (`.opencode/command/improve/assets/improve_agent-improver_auto.yaml:149-167`, `.opencode/command/improve/assets/improve_agent-improver_confirm.yaml:173-201`, `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:489-503`) (iteration 19)
- I did not locate a separate visible orchestrator runtime file beyond the published command/YAML surfaces that might call `mutation-coverage.cjs` programmatically, so the conclusion stays scoped to the shipped operator-facing path rather than every possible hidden executor. (iteration 20)
- This is not because the graph was disabled in configuration. The shipped config explicitly enables `coverageGraph` and points it at `improvement/mutation-coverage.json`, so the gap is consumption in the visible loop, not a disabled feature flag. (`.opencode/skill/sk-improve-agent/assets/improvement_config.json:92-95`) (iteration 20)

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
If this research spins into a follow-on packet, the next productive move is not another broad loop audit but a narrow implementation-gap triage for `sk-improve-agent`: inspect `score-candidate.cjs`, any hidden orchestrator wrapper, and the confirm-mode workflow for off-path graph consumption, then decide whether to wire `mutation-coverage.cjs` into live focus/stop decisions or downgrade the docs/templates so they stop implying graph-driven behavior that the visible loop does not perform.

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->
