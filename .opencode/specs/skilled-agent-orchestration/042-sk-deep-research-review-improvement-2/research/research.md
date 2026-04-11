---
title: Deep Research — Further Improvements to the Deep-Loop Skills
description: Synthesis of 20 Codex-driven iterations auditing sk-deep-research v1.5.0.0, sk-deep-review v1.2.0.0, and sk-improve-agent v1.1.0.0 for self-compliance, coverage graph integration, and prioritized improvements.
---

# Deep Research — Further Improvements to the Deep-Loop Skills

## 1. Executive Summary
- The dominant pattern is not missing capability but missing live wiring: the repo already ships richer stop, graph, and recovery helpers than the visible deep-loop workflows actually call. Research and review still run mostly inline reducer-centric loops, and improve-agent keeps most of its new journal and coverage features off the visible operator path. [iteration-002.md; iteration-003.md; iteration-019.md; iteration-020.md]
- Overall self-compliance verdict (D4): partially compliant on write boundaries, non-compliant on most published stop-state, blocked-stop, resume, and journal contracts. `sk-deep-research` is the strongest on machine-owned anchor enforcement, `sk-deep-review` is bounded but fail-open and under-implements parts of its declared strategy refresh, and `sk-improve-agent` publishes richer journal/session semantics than the visible workflow emits or consumes. [iteration-013.md; iteration-018.md; iteration-019.md]
- Overall graph-integration verdict (D5): graph integration is mostly passive or absent in the live loops. The shared coverage-graph stack can compute real blockers and convergence decisions, but research/review mostly emit `graphEvents` without bridging them into stop logic, while improve-agent keeps a separate local JSON graph that does not visibly influence focus selection, stop gating, or contradiction handling. [iteration-002.md; iteration-006.md; iteration-014.md; iteration-020.md]
- Top recommendation for `sk-deep-research`: put one graph-aware legal-stop path on the visible workflow, then promote `blocked_stop`, `userPaused`, and lineage/resume state into reducer-owned outputs instead of dropping them at JSONL or reducer boundaries. [iteration-004.md; iteration-005.md; iteration-007.md; iteration-014.md]
- Top recommendation for `sk-deep-review`: preserve blocked-stop bundles and recovery metadata in reducer-owned surfaces, and make missing-anchor or malformed-state handling fail loud enough that operators can distinguish “no findings” from “state loss.” [iteration-008.md; iteration-009.md; iteration-010.md; .opencode/skill/sk-deep-review/scripts/reduce-state.cjs:431-445]
- Top recommendation for `sk-improve-agent`: make journal emission real on the visible YAML path, enforce minimum sample sizes before trade-off or repeatability conclusions, and either wire `mutation-coverage.cjs` into live focus/stop decisions or explicitly downgrade the docs and templates. [iteration-011.md; iteration-017.md; iteration-019.md; iteration-020.md]

## 2. Scope and Method
This research session audited three deep-loop skills and their visible command, YAML, reducer, and helper surfaces: `sk-deep-research` v1.5.0.0, `sk-deep-review` v1.2.0.0, and `sk-improve-agent` v1.1.0.0. The work was organized across five dimensions: D1 research runtime gaps, D2 review runtime gaps, D3 improve-agent runtime gaps, D4 self-compliance against published contracts, and D5 coverage-graph integration. The session strategy explicitly framed the work as discovery-only and prohibited implementation changes during the research loop. [.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/deep-research-strategy.md:10-18; .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/deep-research-strategy.md:33-53; .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/deep-research-strategy.md:84-92]

Methodologically, the session used 20 Codex-driven iterations, with reducer refresh between passes and a persistent strategy/dashboard/registry state. The reducer ended with 20 completed iterations, 108 key findings, 16 resolved questions, 0 open questions, and a final convergence score of 0.60. The hard-cap stop condition was therefore the relevant closeout trigger, not strong two-pass convergence. [.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/deep-research-strategy.md:67-74; .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/findings-registry.json:2628-2632; .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/deep-research-dashboard.md:16-18; .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/deep-research-dashboard.md:43-46; .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/deep-research-dashboard.md:71-75]

Explicitly out of scope were implementing fixes, replacing the coverage-graph modules, renaming skills, modifying files outside the packet’s `research/` subtree, or re-litigating already closed 042 review findings. This document therefore treats the current repository as the audited artifact and limits itself to runtime evidence, contract evidence, and implementation recommendations. [.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/deep-research-strategy.md:84-92]

## 3. Dimension D1 — sk-deep-research Runtime Gaps
- `(P1)` The research reducer drops every non-`iteration` JSONL row before building strategy, registry, or dashboard state, so documented `resumed`, `guard_violation`, and `blocked_stop` events can exist in `deep-research-state.jsonl` without ever reaching reducer-owned operator surfaces. [iteration-001.md; .opencode/skill/sk-deep-research/scripts/reduce-state.cjs:489-502]
- `(P2)` Stuck-state observability is under-reported in the dashboard. The loop protocol increments stuck count when `newInfoRatio < convergenceThreshold`, but the reducer trend surface only counts explicit `status == 'stuck'` rows or exact-zero ratios, hiding low-but-nonzero no-progress passes from the synchronized packet view. [iteration-001.md; .opencode/skill/sk-deep-research/references/loop_protocol.md:190-198; .opencode/skill/sk-deep-research/scripts/reduce-state.cjs:438-444]
- `(P1)` Published research convergence already treats `sourceDiversity` and `contradictionDensity` as meaningful legal-stop inputs, but the live auto workflow still evaluates STOP with a local 3-signal vote plus `checkQualityGuards(state, strategy)` and never calls the richer graph-backed research signal set. This is runtime integration drift, not missing shared infrastructure. [iteration-007.md; .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:250-277; .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:175-275]
- `(P2)` Resume semantics remain partly invisible even when the packet follows the published protocol. The contract says `research/research-ideas.md` should influence resume, but reducer inputs are limited to config, JSONL, strategy, and iteration files, so resumed trajectory changes can be real without being reflected in synchronized outputs. [iteration-001.md; .opencode/skill/sk-deep-research/references/loop_protocol.md:247-255; .opencode/skill/sk-deep-research/scripts/reduce-state.cjs:481-487]
- `(P2)` Internal ownership guidance still drifts. `SKILL.md` tells the loop to update strategy content directly while the reducer contract and implementation assume reducer-owned strategy refresh from iteration output plus JSONL append only. That mismatch is not a code bug by itself, but it increases the chance of redundant writes and operator confusion. [iteration-001.md; .opencode/skill/sk-deep-research/SKILL.md:190-199; .opencode/agent/deep-research.md:159-166]

The D1 story is therefore not “research convergence is too simple” in the abstract. The more precise finding is that the live research runtime is internally split between a narrow reducer view and a richer published loop contract. That split matters because the reducer is the surface that downstream operators actually read when resuming or synthesizing work. [iteration-001.md; iteration-007.md]

The contract/runtime mismatch is visible in the control flow itself:

```text
Live visible path:
  pause sentinel -> raw {"event":"paused","reason":"sentinel file detected"}
  stop check -> inline 3-signal vote + generic quality guard
  reducer -> records.filter(type === "iteration")

Published contract:
  paused/userPaused normalization
  richer legal-stop bundle
  graph-aware semantic checks when graphEvents exist
```

[iteration-001.md; iteration-005.md; iteration-007.md; .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:240-277; .opencode/skill/sk-deep-research/scripts/reduce-state.cjs:489-502]

Two consequences follow from that shape. First, research-session recovery is weaker than it looks because resume-relevant events and side channels can be real without surfacing in the synchronized packet state. Second, graph-backed research quality signals are already close enough to the published contract that the current absence is best understood as an integration defect, not as a future enhancement request. [iteration-001.md; iteration-007.md]

## 4. Dimension D2 — sk-deep-review Runtime Gaps
- `(P1)` The review reducer silently skips malformed JSONL lines and treats the surviving rows as authoritative input. That makes reducer output deterministic, but in a failure case it produces omission-based stability rather than explicit corruption reporting. [iteration-008.md; .opencode/skill/sk-deep-review/scripts/reduce-state.cjs:64-85; .opencode/skill/sk-deep-review/scripts/reduce-state.cjs:606-658]
- `(P1)` Partial markdown writes can split the packet into two truths. In the observed harness, the dashboard trusted JSONL `findingsSummary` while the registry trusted parseable markdown findings, leaving run-level counts ahead of lifecycle state when an iteration file was truncated before a valid finding bullet. [iteration-008.md; .opencode/skill/sk-deep-review/scripts/reduce-state.cjs:146-156; .opencode/skill/sk-deep-review/scripts/reduce-state.cjs:236-295; .opencode/skill/sk-deep-review/scripts/reduce-state.cjs:503-512]
- `(P2)` Scale is not the main review-reducer problem. A 60-bullet synthetic packet with repeated IDs preserved dedup and transition ordering, which means the remaining weakness is observability and recovery handoff, not merge corruption. [iteration-009.md; .opencode/skill/sk-deep-review/scripts/reduce-state.cjs:236-295; .opencode/skill/sk-deep-review/scripts/reduce-state.cjs:239-267]
- `(P1)` The blocked-stop bundle required by the review convergence contract is flattened away in the live workflow and reducer surfaces. Even when the contract and fixtures carry `blockedBy`, `gateResults`, and `recoveryStrategy`, the visible auto path exposes only `decision` plus free-form `reason`, and the reducer dashboard renders only focus, dimension coverage, findings summary, and status. [iteration-010.md; .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:343-369; .opencode/skill/sk-deep-review/scripts/reduce-state.cjs:484-520]
- `(P2)` `repeatedFindings` remains stable but too coarse at scale: long-lived same-severity findings and upgrade/downgrade churn collapse into one bucket, which weakens triage value once the review packet gets large and transition-heavy. [iteration-009.md; .opencode/skill/sk-deep-review/scripts/reduce-state.cjs:377-390]

Unlike D1, D2 benefits from both static and dynamic evidence. Iteration 8 showed the omission behavior under partial writes, iteration 9 showed that dedup and transition ordering survive scale, and iteration 10 showed that the remaining weakness is not mathematical gate design but failure to preserve that gate context where operators actually read it. [iteration-008.md; iteration-009.md; iteration-010.md]

The review reducer’s effective truth model can be summarized as:

```text
registry truth   <- parseable markdown findings + resolvedFindings IDs
dashboard truth  <- iteration JSONL summaries
stop explanation <- mostly absent from reducer-owned outputs
```

[iteration-008.md; .opencode/skill/sk-deep-review/scripts/reduce-state.cjs:236-295; .opencode/skill/sk-deep-review/scripts/reduce-state.cjs:484-520]

That model is acceptable for a “best effort summary” reducer, but it is weak for a loop that publishes a replayable legal-stop bundle and asks operators to continue from packet-local review state. The observed behavior is stable enough for rollups and unstable enough for recovery explanations, which is exactly why the D2 recommendations focus on observability rather than dedup mechanics. [iteration-009.md; iteration-010.md]

## 5. Dimension D3 — sk-improve-agent Runtime Gaps
- `(P0)` The visible improve-agent workflow does not emit the journal contract it publishes, and the one concrete CLI example is not executable as written. The command docs say the orchestrator MUST emit journal events every iteration boundary, but the visible auto/confirm YAMLs never call `improvement-journal.cjs`, and the published `--event=session_initialized` example is incompatible with a helper that expects `--emit <eventType>`. [iteration-011.md; iteration-019.md; .opencode/command/improve/agent.md:296-309; .opencode/command/improve/assets/improve_agent-improver_auto.yaml:149-167; .opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:242-275]
- `(P1)` Mid-flight recovery is under-persisted and under-consumed. The helper surface can return the last iteration and final outcome, but the reducer never reads the journal, candidate-lineage graph, or mutation-coverage file, so blocked-stop evidence, trade-off state, benchmark stability warnings, and lineage context do not survive into reducer-owned recovery outputs. [iteration-011.md; iteration-012.md; .opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:168-203; .opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:489-503]
- `(P0)` Small-sample trade-off and repeatability decisions are under-constrained. `trade-off-detector.cjs` fires with only two trajectory points, `benchmark-stability.cjs` treats one-sample and two-sample inputs as stable enough unless variance appears, and the tests lock that behavior in. The reducer then collapses all weak benchmark signals into generic failure counters. [iteration-017.md; .opencode/skill/sk-improve-agent/scripts/trade-off-detector.cjs:64-127; .opencode/skill/sk-improve-agent/scripts/benchmark-stability.cjs:69-92; .opencode/skill/sk-improve-agent/scripts/tests/trade-off-detector.vitest.ts:58-79; .opencode/skill/sk-improve-agent/scripts/tests/benchmark-stability.vitest.ts:80-139]
- `(P2)` Improvement-mode namespace isolation is safer than the packet strategy implied, but for the wrong reason. `mutation-coverage.cjs` writes a local JSON graph with `loopType: 'improvement'`, while the shared SQLite graph only accepts `research` and `review`; improvement data therefore does not pollute the shared store, but the docs overstate a shared-store integration that is not live. [iteration-016.md; .opencode/skill/sk-improve-agent/scripts/mutation-coverage.cjs:21; .opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:152-157; .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts:72-80]
- `(P1)` The shared graph read side still has a session-isolation weakness for research/review sessions: convergence and several query helpers aggregate by `specFolder + loopType` instead of `specFolder + loopType + sessionId`, which is not an improve-agent defect directly but is a real boundary issue uncovered while auditing the improvement namespace claim. [iteration-016.md; .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:47-52; .opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts:63-126]

D3 is the most release-sensitive dimension in the packet because it combines contract drift with decision-quality risk. The journal problem is not just “doc mismatch”; it prevents the visible workflow from ever entering the richer stop/outcome/resume world the skill claims to support. The small-sample problem is not just “math could be better”; it can create false confidence from too little data and then hide that insufficiency behind generic benchmark-failure messaging. [iteration-011.md; iteration-017.md; iteration-019.md]

The visible improve-agent path today is closer to this shape:

```text
scan -> candidate -> score -> benchmark -> append ledger -> reduce -> stopStatus
```

than to this one:

```text
scan -> emit journal -> update mutation coverage -> score/benchmark with sample guards
     -> replayable gate evaluation -> reducer and dashboard consume rich state
```

[iteration-019.md; iteration-020.md; .opencode/command/improve/agent.md:272-339; .opencode/command/improve/assets/improve_agent-improver_auto.yaml:137-167]

The improvement namespace finding also sharpens the design decision ahead: either improve-agent remains intentionally local and should say so, or it eventually joins the shared graph stack and must then inherit the same session, query, and convergence contracts as research/review. The current docs imply the second world while the visible runtime implements the first. [iteration-016.md; iteration-020.md]

## 6. Dimension D4 — Contract Self-Compliance Audit
Across the three loops, the strongest self-compliance result is reducer write-scope discipline, not runtime event fidelity. `sk-deep-research` is the closest to its reducer contract because it rewrites only declared anchors and throws on missing ones; `sk-deep-review` stays inside expected files but silently preserves missing anchors and does not refresh every strategy section it promises; `sk-improve-agent` avoids mixed-ownership writes by not touching its strategy template at all, but that means several machine-owned sections in the template never become machine-populated artifacts on the visible path. [iteration-013.md; iteration-018.md; .opencode/skill/sk-deep-research/scripts/reduce-state.cjs:317-331; .opencode/skill/sk-deep-review/scripts/reduce-state.cjs:431-445; .opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:489-503]

The weakest self-compliance area is stop-state and lineage contract liveness. Research and review both publish shared stop enums, blocked-stop payloads, and richer lineage semantics, but the active auto workflows mostly serialize raw `paused`, free-form `reason`, and `synthesis_complete.stopReason` values while reducers discard non-iteration event rows. Improve-agent repeats the same pattern in a different shape: it publishes journal-backed stop/session semantics, but the visible workflow path never emits journal events into the live operator loop, so the reducer cannot surface what never entered its input path. [iteration-004.md; iteration-005.md; iteration-018.md; iteration-019.md]

### Verdict per contract surface
| Contract surface | Documented | Actually emitted | Verdict |
|---|---|---|---|
| STOP_REASONS enum (research) | yes: shared enum plus normalization tables for `userPaused`, `blockedStop`, `stuckRecovery` | partial: visible path emits raw `paused`, free-form `reason`, and `completed-continue` fallback in `synthesis_complete.stopReason` | non-compliant |
| STOP_REASONS enum (review) | yes: shared enum plus normalization tables | partial: visible path emits raw `paused`, raw `stuck_recovery`, and free-form `reason`; reducer does not republish enum state | non-compliant |
| blockedStop JSONL event | yes: research/review convergence docs and improve-agent command contract require first-class blocked-stop payloads | partial to missing: research/review visible auto paths do not append `blocked_stop`; improve-agent journal contract exists but visible YAML does not call the journal helper | non-compliant |
| Resume/lineage modes | yes: `resume`, `restart`, `fork`, `completed-continue` are published across loop docs | partial to missing: research/review classify lineage branches without serializing them; improve-agent visible workflows do not replay journals or propagate `--session-id` semantics | non-compliant |
| Reducer machine-owned anchor boundaries | yes: each loop publishes machine-owned surfaces or generated outputs | partial: research is bounded and fail-closed; review is bounded but fail-open and under-implements some declared updates; improve-agent avoids mixed writes but leaves strategy-machine sections unwritten on the visible path | partially compliant |
| Journal emission (improve-agent) | yes: command contract says journal emission is mandatory at each boundary | missing on visible path: auto/confirm YAML do not call `improvement-journal.cjs`, and the session-start example uses an unsupported `--event` flag | non-compliant |

One useful way to see D4 is to compare the contract-shaped event vocabulary with the visible emitted vocabulary:

```json
// Published shape
{ "stopReason": "blockedStop", "gateResults": { ... }, "sessionOutcome": "promoted" }

// Visible research/review path
{ "event": "paused", "reason": "sentinel file detected" }
{ "event": "synthesis_complete", "stopReason": "<free-form reason or completed-continue>" }

// Visible improve-agent path
agent-improvement-state.jsonl prompt/benchmark ledger rows
```

[iteration-005.md; iteration-019.md; .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:240-246; .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:325-331; .opencode/command/improve/assets/improve_agent-improver_auto.yaml:149-167]

Research stop-state drift is concrete, not theoretical. The auto workflow logs `paused` as a raw event, uses inline convergence decisions, and persists the final stop reason only as a free-form `reason` value copied into `synthesis_complete.stopReason`, defaulting to `completed-continue` if nothing else is present. That does not satisfy the published enum contract. [iteration-005.md; .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:240-246; .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:409-445]

Review stop-state drift is similar but slightly noisier because the live path also emits `stuck_recovery`. That still falls short of the documented normalized `stuckRecovery` / `blockedStop` state and still leaves reducers blind to the richer payloads the contract promised. [iteration-004.md; iteration-005.md; .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:375-383; .opencode/skill/sk-deep-review/scripts/reduce-state.cjs:484-520]

Improve-agent’s self-compliance problem is more upstream than reducer-local. The published workflow requires journal events with exact stop/outcome semantics, but the visible YAML loop writes only the JSONL ledger and then asks the reducer for stop status. The contract therefore breaks before reducer consumption even begins. [iteration-019.md; .opencode/command/improve/agent.md:296-339; .opencode/command/improve/assets/improve_agent-improver_auto.yaml:149-167]

There is still one important positive result in D4: none of the three visible reducers were found to spill across human-owned file boundaries in their ordinary refresh passes. That means the packet’s contract failures are predominantly about missing or narrowed semantics, not about uncontrolled write spread. [iteration-013.md]

That distinction matters for implementation planning. The remediation work does not need a large “safety containment” phase first. It needs an event/contract fidelity phase first, followed by a surfacing and graph-wiring phase. [iteration-013.md; iteration-019.md]

## 7. Dimension D5 — Coverage Graph Integration Audit
The deep-loop ecosystem has two different realities at once. First, the shared graph stack is real: the MCP convergence handler, contradiction scanner, signal calculators, and graph-convergence helper all implement meaningful weights and blocking guards. Second, the visible research/review/improve-agent workflows rarely call those capabilities during live iterations. As a result, graph integration exists more as capability and documentation than as a decisive runtime branch in the audited operator paths. [iteration-002.md; iteration-006.md; iteration-014.md; iteration-020.md]

The practical implication is that graph integration currently behaves like an optional side channel. Research and review iterations can emit `graphEvents`, and improve-agent has a local mutation-coverage helper, but those outputs are not visibly used to choose the next focus, gate convergence, surface contradiction state, or explain stop decisions on the main reducer/dashboard path. [iteration-003.md; iteration-015.md; iteration-020.md]

### Graph integration rating per loop phase
| Loop phase | sk-deep-research | sk-deep-review | sk-improve-agent |
|---|---|---|---|
| Init | absent | absent | absent |
| Iteration | passive | passive | absent |
| Convergence | absent | absent | absent |
| Synthesis | absent | absent | absent |

`sk-deep-research`: init is `absent` because the visible tool budget and init path expose CocoIndex but no structural graph or convergence calls; iteration is `passive` because the LEAF contract allows optional `graphEvents`, but the wrapper goes straight from iteration output to `reduce-state.cjs`; convergence is `absent` because `step_check_convergence` is inline 3-signal logic with no graph helper call; synthesis is `absent` because the reducer reads `compositeStop` or `newInfoRatio` and filters JSONL to iteration rows only. [iteration-002.md; iteration-006.md; iteration-015.md; .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:72; .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:250-277; .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:326-331; .opencode/skill/sk-deep-research/scripts/reduce-state.cjs:244-249; .opencode/skill/sk-deep-research/scripts/reduce-state.cjs:489-502]

`sk-deep-review`: init is `absent` because the visible tool budget and bootstrap docs provision CocoIndex, not structural graph tools; iteration is `passive` because the wrapper asks for optional `graphEvents` and then immediately runs the reducer; convergence is `absent` because the live stop path is still rolling-average + MAD + dimension-coverage + binary guards; synthesis is `absent` because the reducer builds dashboards from iteration rows and does not reconstruct graph-backed `findingStability` or blocked-stop state. [iteration-002.md; iteration-006.md; iteration-015.md; .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:76; .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:335-375; .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:436-473; .opencode/skill/sk-deep-review/scripts/reduce-state.cjs:359-390; .opencode/skill/sk-deep-review/scripts/reduce-state.cjs:484-520]

`sk-improve-agent`: init is `absent` because the visible loop goes from integration scan to candidate generation without reading mutation coverage; iteration is `absent` because the visible auto/confirm YAMLs never call `mutation-coverage.cjs`; convergence is `absent` because stop status comes from reducer heuristics rather than `checkConvergenceEligibility()` or any contradiction-aware graph gate; synthesis is `absent` because the reducer never opens `mutation-coverage.json` and therefore cannot surface mutation coverage or graph-derived convergence eligibility in the operator dashboard. [iteration-019.md; iteration-020.md; .opencode/command/improve/assets/improve_agent-improver_auto.yaml:137-167; .opencode/skill/sk-improve-agent/scripts/mutation-coverage.cjs:229-272; .opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:259-332; .opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:489-503]

One nuance matters: “absent in the visible loop” is not the same as “missing in the repository.” The shared graph-convergence helper caps graph contribution at 40% of the blended score and adds separate graph blocker gates, and the MCP convergence handler can block stop on contradictions, coverage gaps, unverified claims, source diversity, and evidence depth. The problem is that the live loop wrappers and reducers do not visibly route through that capability. [iteration-014.md; .opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs:141-258; .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:183-379]

The visible graph story by phase is therefore:

```text
research/review init        -> no graph read
research/review iteration   -> optional graphEvents emission only
research/review convergence -> inline math, no graph caller
research/review synthesis   -> reducer pass-through, no graph rebuild

improve init/iteration      -> local graph not visibly called
improve convergence         -> reducer heuristics only
improve synthesis           -> dashboard ignores mutation-coverage.json
```

[iteration-002.md; iteration-006.md; iteration-015.md; iteration-020.md]

Another important D5 nuance is that the repo now contains two incompatible graph-convergence regimes. The CJS helper and the MCP handler are both defensible implementations on their own, but they use different `sourceDiversity` semantics and threshold scales. Even if the loops were wired tomorrow, they would still need a product choice about which graph-convergence contract is canonical. [iteration-014.md; .opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs:141-258; .opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:167-227]

That is why the recommended D5 fix is not “call more graph tools” in the abstract. The required fix is “pick the runtime truth, route the visible loop through it, and then let reducers and templates describe that one truth.” [iteration-014.md; iteration-015.md]

## 8. Cross-Cutting Themes
The first cross-cutting theme is reducer narrowing. Research, review, and improve-agent all publish richer runtime contracts than their reducers or reducer-facing inputs preserve. In research/review this shows up as event and stop payload loss due to iteration-only ingestion. In improve-agent it shows up as a journal/coverage ecosystem that never enters the visible reducer path at all. [iteration-001.md; iteration-004.md; iteration-012.md; iteration-019.md]

The second theme is helper-vs-runtime mismatch. Shared graph handlers, contradiction scanners, trade-off detectors, benchmark-stability helpers, and mutation-coverage helpers all exist and often do something real. But the visible workflows tend to stop at “emit data” or “keep helper available,” without making the helper decisive in live focus selection, stop gating, or dashboard outputs. [iteration-002.md; iteration-006.md; iteration-014.md; iteration-017.md; iteration-020.md]

The third theme is documentation drift that is more damaging than simple stale prose. The drift is not cosmetic: in several places the docs claim a stronger safety or recovery contract than the visible runtime can satisfy. That matters because operators reasonably rely on published blocked-stop bundles, replay semantics, and graph-aware convergence when deciding whether a session can be resumed or trusted. [iteration-003.md; iteration-004.md; iteration-018.md; iteration-019.md]

The fourth theme is fail-open behavior where the contract really wants fail-closed semantics. Review silently skips malformed JSONL, preserves missing anchors, and flattens blocked-stop diagnostics. Improve-agent treats tiny samples as stable enough. These are not catastrophic corruption bugs, but they all bias the system toward silent loss of precision rather than loud refusal. [iteration-008.md; iteration-013.md; iteration-017.md]

The fifth theme is that there are now two graph universes: the shared research/review graph stack and improve-agent’s local JSON mutation-coverage graph. The local graph keeps improvement runs isolated from the shared DB, which is safer today, but it also means the repo has two different notions of “coverage graph integration,” each with its own drift and tooling expectations. [iteration-003.md; iteration-016.md; iteration-020.md]

Taken together, these themes point to a narrow implementation strategy: first make the visible loop paths truthful about what they emit and consume, then decide which helper capabilities deserve promotion into the live path, and only then expand the docs/templates. Doing those steps in the opposite order would repeat the same pattern that produced this packet’s main findings. [iteration-003.md; iteration-014.md; iteration-019.md]

## 9. Prioritized Recommendations

### P0 — Blockers (must fix before next release)
1. **Make the published stop/journal contracts executable on the visible workflow paths.** Target skill(s): `sk-deep-research`, `sk-deep-review`, `sk-improve-agent`. Affected files: `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`, `.opencode/command/improve/assets/improve_agent-improver_auto.yaml`, `.opencode/command/improve/assets/improve_agent-improver_confirm.yaml`, `.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs`, relevant command docs. Rationale: the research/review loops publish normalized stop-state contracts they do not emit, and improve-agent publishes mandatory journal semantics that the visible YAML path never invokes. [iteration-004.md; iteration-005.md; iteration-019.md] Suggested approach: emit first-class `blocked_stop`, `paused/userPaused`, normalized stop reasons, and exact session outcomes on the main path, then make reducers or synthesis surfaces consume them instead of relying on free-form `reason`.
2. **Enforce minimum sample-size gates before improve-agent trade-off or stability decisions.** Target skill(s): `sk-improve-agent`. Affected files: `.opencode/skill/sk-improve-agent/scripts/trade-off-detector.cjs`, `.opencode/skill/sk-improve-agent/scripts/benchmark-stability.cjs`, their tests, config/reference docs, and reducer/dashboard surfaces. Rationale: the current helpers can declare trade-offs or stability on one- and two-sample evidence, and the tests bless that behavior. [iteration-017.md] Suggested approach: require `minDataPoints` / `replayCount` in the helpers, propagate “insufficient data” as a distinct state, and surface it separately from true regressions in the reducer.
3. **Choose one graph-convergence truth for research/review and wire it into live stop evaluation.** Target skill(s): `sk-deep-research`, `sk-deep-review`. Affected files: visible loop wrappers, any stop-evaluation bridge, reducer/synthesis surfaces, and convergence docs. Rationale: the repo ships meaningful graph blockers and weighted graph math, but the visible research/review paths still run inline stop logic and pass through `compositeStop` without reconstructing or querying graph state. [iteration-002.md; iteration-006.md; iteration-014.md; iteration-015.md] Suggested approach: either call `deep_loop_graph_upsert` + `deep_loop_graph_convergence` from the visible iteration path or explicitly downgrade the docs/templates so they stop claiming reducer-side graph-aware legal-stop behavior that is not live.

These are P0 because each one changes the trustworthiness of a session boundary. If the loop stops with the wrong contract surface, or if it accepts tiny samples as real evidence, or if it claims graph-aware stop logic without actually using it, the operator cannot safely interpret “done,” “blocked,” or “stable.” [iteration-005.md; iteration-017.md; iteration-019.md]

### P1 — Required (next release)
1. **Promote blocked-stop payloads into reducer-owned outputs for research/review.** Target skill(s): `sk-deep-research`, `sk-deep-review`. Affected files: both reducers, dashboards, and related state-format docs. Rationale: blocked-stop evidence exists in contracts and fixtures but disappears from the outputs operators actually resume from. [iteration-008.md; iteration-009.md; iteration-010.md] Suggested approach: carry `blockedBy`, `gateResults`, and `recoveryStrategy` into registry/dashboard/strategy summaries, even if the full raw JSON remains append-only.
2. **Make review-state failure handling explicit instead of omission-based.** Target skill(s): `sk-deep-review`. Affected files: `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs`, state-format docs, and any packet-health guidance. Rationale: malformed JSONL is silently skipped, missing anchors silently persist, and partial markdown writes can split dashboard truth from registry truth. [iteration-008.md; iteration-013.md] Suggested approach: add a reducer-visible corruption/warning channel and switch missing machine-owned anchor sections from silent preserve to explicit failure or operator-visible degraded mode.
3. **Either implement improve-agent replay consumers or cut the replay promises back to current reality.** Target skill(s): `sk-improve-agent`. Affected files: `scripts/reduce-state.cjs`, `scripts/improvement-journal.cjs`, `scripts/candidate-lineage.cjs`, visible YAMLs, and README/SKILL/command docs. Rationale: resume is described as replaying journal + coverage graph + registry, but the shipped consumer path reads only the state ledger, config, and drift report. [iteration-011.md; iteration-012.md; iteration-019.md] Suggested approach: make resume read the journal/lineage/coverage artifacts for real, or rewrite the docs to say resume is ledger-only until fuller recovery is implemented.
4. **Repair tool-routing parity for structural graph tools.** Target skill(s): `sk-deep-research`, `sk-deep-review`. Affected files: agent docs, command docs, skill metadata, and visible wrapper tool budgets. Rationale: `code_graph_query` / `code_graph_context` appear in agent prose but not in the command docs or visible LEAF-tool budget. [iteration-015.md] Suggested approach: either provision the tools on the live path or remove the promise from the prompts that operators treat as runtime guidance.
5. **Session-scope shared coverage-graph reads for research/review.** Target skill(s): shared graph infrastructure plus loops that consume it. Affected files: `coverage-graph-query.ts`, `coverage-graph/convergence.ts`, related DB/query helpers, and docs. Rationale: the shared read side aggregates by `specFolder + loopType` instead of session, which can mix separate runs in one packet even if improvement-mode data stays isolated. [iteration-016.md] Suggested approach: propagate `sessionId` through read helpers and convergence decisions wherever the namespace model already allows it.

These are P1 because the main control-flow defects are already identified above. P1 work turns the system from “contractually overstated” into “operationally resumable”: better blocked-stop carry-through, better failure signaling, better session scoping, and better parity between prompts, docs, and wrappers. [iteration-010.md; iteration-013.md; iteration-015.md; iteration-016.md]

### P2 — Suggestions (advisory)
1. **Refine `repeatedFindings` semantics for large review packets.** Target skill(s): `sk-deep-review`. Affected files: reducer, registry schema/docs, dashboards. Rationale: same-severity persistence and severity churn collapse into one “repeated” bucket today. [iteration-009.md] Suggested approach: split “persistent same-severity” from “severity changed” so triage summaries stay useful at scale.
2. **Add explicit “insufficient sample” labels to the improve-agent dashboard.** Target skill(s): `sk-improve-agent`. Affected files: reducer/dashboard, improvement strategy template, runtime-truth playbook. Rationale: operators currently see generic benchmark weakness where the real issue may be replay scarcity or unstable variance. [iteration-017.md; iteration-018.md] Suggested approach: surface replay count, coefficient, and insufficiency state directly in the visible dashboard.
3. **Harmonize graph-convergence math across the CJS helper and the MCP handler.** Target skill(s): shared graph stack. Affected files: `coverage-graph-convergence.cjs`, MCP signal/handler docs, loop references. Rationale: the repo currently ships two different `sourceDiversity` definitions and threshold regimes. [iteration-014.md] Suggested approach: pick one canonical metric contract, then make the other surface a thin adapter rather than an independent regime.
4. **Add durable fixtures for interrupted improve-agent sessions and blocked-stop review/research runs.** Target skill(s): all three loop families. Affected files: tests/fixtures and manual testing playbooks. Rationale: several D3 and D4 conclusions had to be proven by omission because no packet-local artifacts exercised the new contracts. [iteration-010.md; iteration-011.md; iteration-019.md] Suggested approach: create canonical fixture runs that include interrupted journals, blocked-stop bundles, and graph-aware state so future audits test the visible recovery path directly.

These are P2 because they improve signal quality and future auditability once the visible path is honest. They should not be used to defer the P0/P1 work that makes the visible path truthful in the first place. [iteration-009.md; iteration-017.md]

## 10. Per-Skill Top 3 Recommendations

### sk-deep-research
1. Replace the inline stop-only path with a graph-aware legal-stop bridge or explicitly retract the graph-aware reducer claims from the published convergence contract. [iteration-006.md; iteration-007.md; iteration-014.md]
2. Promote non-iteration event rows into reducer-owned outputs so `blocked_stop`, `paused`, resume lineage, and recovery metadata are not dropped at ingest time. [iteration-001.md; iteration-004.md; iteration-005.md]
3. Align ownership guidance so the loop never suggests direct strategy mutation where the reducer is supposed to be the sole writer. [iteration-001.md]

These three recommendations are intentionally ordered from operator safety to authoring hygiene. The first two change whether a resumed or completed research session can be trusted; the third reduces future drift while the runtime contract is being fixed. [iteration-001.md; iteration-007.md]

### sk-deep-review
1. Preserve blocked-stop bundles and gate-specific recovery actions in reducer-owned dashboard/strategy surfaces. [iteration-008.md; iteration-009.md; iteration-010.md]
2. Make malformed JSONL and missing strategy anchors operator-visible failures or degraded states instead of silent omission. [iteration-008.md; iteration-013.md]
3. Bring tool-routing and graph-contract language back into sync with the actual visible runtime path. [iteration-006.md; iteration-015.md]

For review, the ordering is “keep the evidence, then fail louder, then clean up routing.” That matches the main D2/D4/D5 finding that the live reducer is stable enough for counts and too lossy for recovery explanations. [iteration-009.md; iteration-010.md; iteration-013.md]

### sk-improve-agent
1. Wire `improvement-journal.cjs` into the visible auto/confirm workflows and fix the CLI/documentation mismatch so the published journal contract is executable. [iteration-011.md; iteration-019.md]
2. Enforce minimum data requirements before trade-off and benchmark-stability conclusions, and surface “insufficient data” distinctly in the dashboard. [iteration-017.md; iteration-018.md]
3. Either consume `mutation-coverage.cjs` during live focus/stop decisions or downgrade the current graph-driven strategy/template claims to match the visible operator path. [iteration-016.md; iteration-020.md]

For improve-agent, journaling comes first because the current workflow cannot even produce the richer state it promises. Sample safety comes second because it affects decision quality immediately. Graph integration comes third because it is currently more of a truth-in-advertising problem than a live contamination or corruption problem. [iteration-016.md; iteration-017.md; iteration-019.md]

## 11. Ruled Out Directions
- Replacing the shared coverage-graph stack was ruled out. The stack already computes real blockers and weighted graph convergence; the gap is caller integration into the visible research/review loop, not missing base capability. [iteration-002.md; iteration-014.md]
- Treating `claimVerificationRate` and `evidenceDepth` as current `sk-deep-research` contract regressions was ruled out. Those signals exist in the shared graph layer, but the published research semantic extension still centers on `semanticNovelty`, `contradictionDensity`, and `citationOverlap`. [iteration-007.md]
- Reopening “review reducer merge stability” as the core D2 problem was ruled out. The 50+ finding harness showed stable dedup and stable transition ordering, so the live problem is observability and blocked-stop persistence. [iteration-009.md; iteration-010.md]
- Treating improve-agent `loopType: "improvement"` as a current shared-DB contamination risk was ruled out. The shared DB rejects non-`research`/`review` loop types, so the real issue is documentation drift and the existence of a separate local JSON graph. [iteration-016.md]
- Declaring the graph layer “purely decorative” was ruled out. Both the CJS helper and MCP convergence handler contain real thresholds and STOP-blocking branches, even if the visible loop path does not consume them. [iteration-014.md]
- Treating improve-agent’s current weakness as “proposal-agent side effects” was ruled out. The visible failure surface is orchestrator wiring, persistence fidelity, and consumer reconstruction, not the proposal-only mutation boundary. [iteration-011.md]
- Assuming review blocked-stop taxonomy itself is wrong was ruled out. The fixture and docs align on gate names and recovery semantics; the loss happens during persistence and reducer surfacing. [iteration-010.md]
- Treating benchmark stability as over-blocking was ruled out. The helper currently under-blocks small samples by allowing 1-2 replay runs to appear stable enough unless variance is already visible. [iteration-017.md]
- Assuming a reducer-only fix would restore improve-agent stop/outcome fidelity was ruled out. The visible YAML path never emits the journal events that would be needed for reducer restoration. [iteration-019.md]
- Treating graph disablement as the reason improve-agent has no visible graph effect was ruled out. The config enables coverage-graph output; the missing link is consumption on the live path. [iteration-020.md]

## 12. Eliminated Alternatives
- **Docs-only cleanup without runtime changes**: rejected because the repo already has multiple places where docs promise stronger safety and recovery behavior than the visible runtime provides. [iteration-003.md; iteration-019.md]
- **Reducer-only fixes for improve-agent**: rejected because the contract break begins upstream; the visible YAML path never emits journal events into reducer inputs. [iteration-019.md]
- **Confirm-mode-only fixes**: rejected because the visible autonomous path already diverges and is the main operator path for deep-loop automation. [iteration-004.md; iteration-015.md]
- **Immediate migration of improve-agent into the shared SQLite coverage graph**: rejected for now because the current visible path does not even consume the local JSON graph, and the shared DB schema still only accepts `research` and `review`. [iteration-016.md; iteration-020.md]
- **Treat raw `paused` / `stuck_recovery` labels as “good enough” stop-state truth**: rejected because the published shared enums already require normalized `userPaused` / `stuckRecovery` semantics. [iteration-005.md]
- **Assume hidden executors solve the visible path gaps**: rejected because this research deliberately stayed grounded in the shipped operator-facing files, and hidden integrations cannot be used to justify published runtime contracts without visible evidence. [iteration-014.md; iteration-015.md; iteration-020.md]
- **Treat graph-event emission alone as sufficient D5 integration**: rejected because emitted `graphEvents` are not the same as graph-shaped decisions influencing convergence, recovery, or operator-visible outputs. [iteration-002.md; iteration-003.md; iteration-020.md]
- **Solve D2 by only improving dedup heuristics**: rejected because the scale harness showed dedup stability; the missing value is blocked-stop and partial-failure observability. [iteration-009.md; iteration-010.md]
- **Patch only the playbooks and templates for improve-agent**: rejected because the visible runtime path would still omit journal emission, replay consumption, and sample-size enforcement. [iteration-017.md; iteration-019.md]
- **Treat session mixing in shared graph reads as acceptable until later**: rejected because once research/review loops do start using graph-backed convergence more directly, session bleed would turn into a correctness issue rather than a cosmetic one. [iteration-016.md]

## 13. Evidence Appendix — Finding → Iteration Map
F001: Research reducer drops non-iteration JSONL events → iteration-001.md
F002: Research dashboard undercounts low-ratio stalls → iteration-001.md
F003: Research reducer omits multiple JSONL/schema fields from packet surfaces → iteration-001.md
F004: Resume ideas side channel is invisible to synchronized outputs → iteration-001.md
F005: Research ownership guidance still conflicts with reducer ownership → iteration-001.md
F006: Visible research/review workflows emit `graphEvents` but do not read back graph state → iteration-002.md
F007: Shared graph convergence handler is real and stop-capable when invoked → iteration-002.md
F008: Live reducer does not implement the documented research/review graph bridge → iteration-003.md
F009: 042 implementation summary overstates the shipped graph bridge → iteration-003.md
F010: Research/review lineage branches are classified but not serialized as first-class lifecycle events → iteration-004.md
F011: Published blocked-stop bundle is flattened to decision + reason on the visible path → iteration-004.md
F012: Shared stop-reason enum is not live on the visible research/review path → iteration-005.md
F013: `completed-continue` fallback escapes the published stop enum → iteration-005.md
F014: Contradiction-aware blockers exist in shared infrastructure but are not on the visible stop path → iteration-006.md
F015: Research runtime omits contractual `sourceDiversity` and `contradictionDensity` stop logic → iteration-007.md
F016: `claimVerificationRate` and `evidenceDepth` are shared-stack capabilities, not yet research contract drift → iteration-007.md
F017: Review reducer silently skips malformed JSONL lines → iteration-008.md
F018: Partial review markdown can split dashboard truth from registry truth → iteration-008.md
F019: Review reducer dedup stays stable at 50+ findings → iteration-009.md
F020: Review `repeatedFindings` bucket is deterministic but coarse at scale → iteration-009.md
F021: Dimension-coverage blocked-stop bundles do not survive reducer-owned recovery surfaces → iteration-010.md
F022: Improve-agent journal CLI docs do not match the shipped helper interface → iteration-011.md
F023: Mid-flight improve-agent recovery lacks durable benchmark/trade-off handoff → iteration-011.md
F024: Improve-agent reducer ignores journal, lineage, and mutation-coverage artifacts → iteration-012.md
F025: Research reducer anchor handling is bounded and fail-closed → iteration-013.md
F026: Review reducer is bounded but fail-open and under-implements declared strategy updates → iteration-013.md
F027: Graph helper weight is capped, but live reducers only consume pass-through convergence scalars → iteration-014.md
F028: Structural graph tools appear in agent prose, not in visible command or wrapper budgets → iteration-015.md
F029: Improve-agent mutation coverage is local JSON, not shared SQLite graph state → iteration-016.md
F030: Shared graph reads for research/review aggregate across sessions in the same packet namespace → iteration-016.md
F031: Improve-agent trade-off detection can trigger on only two trajectory points → iteration-017.md
F032: Improve-agent benchmark-stability helper treats 1-2 sample runs as stable enough → iteration-017.md
F033: Improve-agent strategy template promises machine-owned sections the reducer never writes → iteration-018.md
F034: Visible improve-agent YAML workflows never emit the published journal events → iteration-019.md
F035: Visible improve-agent loop does not consume mutation coverage for focus or stop decisions → iteration-020.md
F036: No contradiction-oriented graph gate appears on the visible improve-agent operator path → iteration-020.md
F037: Shared graph convergence handler can block STOP when actually invoked → iteration-002.md
F038: Test/replay code consumes `graphEvents`, but the normal loop runtime does not → iteration-003.md
F039: Research stop-state drift starts before reducer reporting, at YAML emission time → iteration-005.md
F040: Review stop-state drift likewise starts at YAML emission time → iteration-005.md
F041: Review reducer idempotency under failure is deterministic but lossy → iteration-008.md
F042: Review dashboard/registry split worsens operator recovery under partial writes → iteration-008.md
F043: Review gate taxonomy is sound; the persistence path is what flattens it → iteration-010.md
F044: Improve-agent recovery helper returns last iteration and terminal outcome only → iteration-011.md
F045: Improve-agent journal recognizes blocked-stop and trade-off events but consumers do not rebuild them → iteration-012.md
F046: Review reducer writes only declared files but under-implements some declared strategy sections → iteration-013.md
F047: Structural graph routing promise survives only in agent prose, not in wrapper budgets → iteration-015.md
F048: Improve-agent coverage-graph config and strategy placeholders survive without live consumption → iteration-020.md

## 14. Research Methodology Notes
This session followed the packet strategy’s “Codex CLI GPT-5.4 high fast mode per iteration” operating model and refreshed reducer-owned state between iterations rather than doing a single monolithic audit at the end. That mattered because several conclusions, especially D2 and D3, depended on comparing individual iteration findings against the machine-updated registry and dashboard instead of treating the prose notes as the only state. [.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/deep-research-strategy.md:14-18]

The final reducer pass reported 20 completed iterations, 108 key findings, 16 resolved questions, 0 open questions, and a convergence score of 0.60. In other words, the loop produced enough evidence to saturate the planned research dimensions, but it did not converge cleanly enough to end on a “stable by signals” story; the hard cap remained the decisive closeout reason. [.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/findings-registry.json:2628-2632; .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/deep-research-dashboard.md:43-46; .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/deep-research-dashboard.md:71-75]

The strongest methodological pattern was “fresh question, narrow surface, direct file evidence.” Iteration 1 started with reducer-first reading; iterations 8 and 9 used disposable harnesses for review-state behavior; iterations 11-12 and 17-20 paired helper internals with visible workflow/reducer consumers to separate helper capability from live-loop capability. That sequencing reduced false positives from older packet docs and made it easier to keep negative claims scoped to the visible operator path. [iteration-001.md; iteration-008.md; iteration-009.md; iteration-012.md; iteration-017.md; iteration-020.md]

Reducer metrics snapshot at closeout:

```text
iterationsCompleted = 20
resolvedQuestions   = 16
openQuestions       = 0
keyFindings         = 108
convergenceScore    = 0.60
coverageBySources   = {"code":229,"other":70}
```

[.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/findings-registry.json:2628-2632; .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/deep-research-dashboard.md:71-75]

Method strengths:
- The loop deliberately alternated static source audits with dynamic or fixture-backed checks where the question demanded runtime evidence, especially for D2 scale/partial-write behavior and D3 sample-size behavior. [iteration-008.md; iteration-009.md; iteration-017.md]
- The reducer refresh after each pass made it possible to compare iteration-local findings against the machine-owned packet surfaces, which is essential for D4 claims about what the operator actually sees. [iteration-001.md; iteration-013.md; .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/deep-research-dashboard.md:7-8]
- The research stayed scoped to visible operator paths and shipped runtime files, which reduced speculation about hidden executors and kept negative claims narrowly falsifiable. [iteration-014.md; iteration-015.md; iteration-020.md]

Method limitations:
- Several improve-agent conclusions had to be proven by omission because no packet-local interrupted-session journal or mutation-coverage artifact existed in the repo. [iteration-011.md; iteration-012.md]
- The research/review graph-wiring conclusions are scoped to the visible YAML/reducer path and cannot disprove every hidden executor integration outside those surfaces. [iteration-014.md; iteration-015.md]
- The final closeout reflects reducer metrics plus the packet’s hard cap; it is not a proof that all possible deep-loop defects in surrounding infrastructure have been exhausted. [iteration-020.md; .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/deep-research-strategy.md:67-74]

## 15. Contract Compliance Scorecard
| Skill | Stop-reason enum liveness | Blocked-stop persistence | Resume flow exercised | Machine-owned anchor enforcement | Journal emission fidelity |
|---|---:|---:|---:|---:|---:|
| sk-deep-research | 3/10 | 2/10 | 3/10 | 9/10 | 5/10 |
| sk-deep-review | 3/10 | 2/10 | 3/10 | 6/10 | 5/10 |
| sk-improve-agent | 2/10 | 2/10 | 2/10 | 8/10 | 1/10 |

- `sk-deep-research`: low stop/resume scores because the live path emits raw `paused` and free-form stop reasons while reducers drop non-iteration events; high anchor score because missing strategy anchors throw instead of silently persisting corruption. [iteration-004.md; iteration-005.md; iteration-013.md]
- `sk-deep-review`: stop and blocked-stop scores match research because the same visible-path drift exists, but anchor enforcement is lower because the reducer preserves missing anchors silently and under-implements several declared strategy refreshes. [iteration-004.md; iteration-005.md; iteration-013.md]
- `sk-improve-agent`: journal fidelity is the weakest score in the packet because the visible workflow never emits the published journal events and the one concrete CLI example does not match the helper interface; anchor enforcement stays relatively high only because the reducer writes generated outputs and does not mutate mixed-ownership strategy files. [iteration-018.md; iteration-019.md]

Scoring notes:
- `0-2` means “published contract mostly absent on the visible path.”
- `3-5` means “some surface exists, but the operator-visible path is inconsistent or incomplete.”
- `6-8` means “mostly compliant with meaningful caveats.”
- `9-10` means “strongly compliant on the audited visible path.”

[iteration-005.md; iteration-013.md; iteration-019.md]

## 16. Graph Integration Scorecard
| Skill | Graph-event emission rate | Graph-event consumption by reducer | Contradiction-aware convergence | Structural code graph query usage | Operator-visible graph surfaces |
|---|---:|---:|---:|---:|---:|
| sk-deep-research | 6/10 | 2/10 | 2/10 | 1/10 | 2/10 |
| sk-deep-review | 6/10 | 2/10 | 2/10 | 1/10 | 2/10 |
| sk-improve-agent | 2/10 | 1/10 | 0/10 | 0/10 | 1/10 |

- `sk-deep-research`: graph-event emission exists on the visible iteration contract, but reducer consumption, contradiction-aware stopping, structural code-graph routing, and operator-visible graph summaries are all weak or absent on the live path. [iteration-002.md; iteration-006.md; iteration-014.md; iteration-015.md]
- `sk-deep-review`: the profile is effectively the same as research: optional `graphEvents` are present, but live convergence is inline, structural graph tools are not provisioned in the wrapper budget, and reducers do not reconstruct graph-backed `findingStability`. [iteration-002.md; iteration-006.md; iteration-014.md; iteration-015.md]
- `sk-improve-agent`: graph integration is mostly helper-only. The local mutation-coverage graph exists, but the visible loop does not call it for focus selection, stop gating, contradiction checks, or dashboard rendering. [iteration-016.md; iteration-020.md]

Interpretation notes:
- High emission with low consumption means “the loop can write graph-shaped data but does not yet use it to decide.”
- Low structural-query scores mean the loop is still relying on CocoIndex or plain file reads where the docs or prompts imply richer structural routing.
- Low operator-visible scores mean even real helper outputs stay outside dashboards, registries, and stop explanations that humans actually see.

[iteration-002.md; iteration-015.md; iteration-020.md]

## 17. Next Steps
This research is ready to convert into an implementation plan. The cleanest landing zone is a new phase under the same packet family: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/008-further-deep-loop-improvements/`. That keeps the work adjacent to the exact runtime and contract surfaces this audit inspected, preserves traceability back to iterations 001-020, and lets the follow-on plan split P0 and P1 workstreams by loop family plus shared graph infrastructure. [iteration-020.md; .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/deep-research-dashboard.md:117-118]

If the scope expands beyond the current packet into shared graph math unification, cross-session namespace redesign, and broader command/agent parity cleanup, a separate spec `043` would be reasonable. Based on the evidence in this session, though, most of the must-fix work is still “finish what 042 already claimed”: stop-state fidelity, blocked-stop persistence, graph wiring, improve-agent journal/runtime truth, and sample-size safety. A focused phase `008` is therefore the recommended default. [iteration-003.md; iteration-014.md; iteration-019.md]

Suggested planning split for phase `008`:
1. **Contract truth pass**: normalize visible event emission, stop reasons, blocked-stop payloads, and journal wiring across all three loops. [iteration-005.md; iteration-019.md]
2. **Reducer surfacing pass**: carry blocked-stop, sample-safety, and graph-derived explanations into dashboard/registry/strategy surfaces. [iteration-008.md; iteration-010.md; iteration-018.md]
3. **Graph wiring pass**: choose the canonical graph-convergence regime and route the visible research/review loop through it; decide whether improve-agent stays local or joins that regime later. [iteration-014.md; iteration-016.md; iteration-020.md]
4. **Fixture and regression pass**: add interrupted-session, blocked-stop, and low-sample fixtures so future audits can test the visible path directly instead of proving absence by omission. [iteration-010.md; iteration-011.md; iteration-017.md]

Release-readiness success criteria for that follow-on phase:
- Research/review visible workflows emit normalized stop-state and blocked-stop payloads that reducers can surface. [iteration-004.md; iteration-005.md]
- Improve-agent visible workflows emit journal events through an executable, validated CLI or programmatic path. [iteration-011.md; iteration-019.md]
- Trade-off and benchmark-stability helpers refuse undersized samples explicitly instead of treating them as stable. [iteration-017.md]
- The chosen graph-convergence path is visibly called from the research/review loop, and the docs describe that one path only. [iteration-014.md; iteration-015.md]
- Reducer-owned dashboards and registries preserve the operator-facing evidence needed to resume or stop safely. [iteration-008.md; iteration-010.md; iteration-018.md]

If those criteria are met, a later packet can safely ask a broader question than this one did: not “are the loops truthful about their current contracts?” but “which deep-loop abstractions should now be shared across research, review, and improvement without reintroducing helper-vs-runtime drift?” [iteration-003.md; iteration-020.md]
That broader question should wait until the visible loop paths are contract-true first. [iteration-019.md; iteration-020.md]
