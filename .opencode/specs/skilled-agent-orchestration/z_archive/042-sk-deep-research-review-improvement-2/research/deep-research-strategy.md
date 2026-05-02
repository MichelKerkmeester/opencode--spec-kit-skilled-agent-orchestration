---
title: Deep Research Strategy — Further Improvements to Deep-Loop Skills
description: Runtime research strategy for the 20-iteration Codex-driven session auditing and extending sk-deep-research v1.5.0.0, sk-deep-review v1.2.0.0, and sk-improve-agent v1.1.0.0.
---

# Deep Research Strategy — Further Deep-Loop Improvements (Session rsr-2026-04-11T08-02-52Z)

Persistent brain for the 20-iteration session. Read by the orchestrator and every iteration agent. Reducer refreshes machine-owned sections after each iteration.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Surface the next layer of improvements for `sk-deep-research`, `sk-deep-review`, and `sk-improve-agent` (and their commands, agents, and YAML workflows), verify that the loops comply with the v1.5.0.0 / v1.2.0.0 / v1.1.0.0 contracts they just published, and audit whether the coverage graph is actually used for decision-making rather than merely emitted.

### Usage

- **Init:** Orchestrator populated Topic, Key Questions, Non-Goals, Stop Conditions, Known Context, and Research Boundaries from the config file and from in-session knowledge of the 042 implementation.
- **Per iteration:** Codex CLI GPT-5.4 high fast mode (substituting for the native `@deep-research` agent) reads Next Focus, writes iteration evidence to `iterations/iteration-NNN.md`, appends a JSONL record, and the reducer refreshes machine-owned anchors afterward.
- **Mutability:** Mutable — sections 1, 2, 4, 5, 12, 13 are stable; sections 3, 6, 7, 8, 9, 10, 11 are rewritten by the reducer each iteration.
- **Protection:** Shared state with explicit ownership boundaries. Orchestrator validates consistency after every reducer pass.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:topic -->
## 2. TOPIC

Further improvements to sk-deep-research v1.5.0.0, sk-deep-review v1.2.0.0, and sk-improve-agent v1.1.0.0 (and their associated commands, agents, YAML workflows): self-compliance audit, coverage graph integration audit, and prioritized recommendations.

---

<!-- /ANCHOR:topic -->
<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
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

<!-- /ANCHOR:key-questions -->
<!-- ANCHOR:non-goals -->
## 4. NON-GOALS

- Implementing fixes during research (this is a discovery pass only — recommendations only).
- Replacing the coverage graph modules or reducer contracts.
- Re-litigating already-closed 042 review findings (closed at commits `460c243a8` through `dc8886955c`).
- Modifying any file outside `{spec_folder}/research/`.
- Introducing new skills or renaming existing ones.
- Investigating non-deep-loop skills (sk-code-opencode, sk-doc, sk-git, etc.) except where they are imported by the deep-loop skills.

---

<!-- /ANCHOR:non-goals -->
<!-- ANCHOR:stop-conditions -->
## 5. STOP CONDITIONS

- `compositeStop ≥ 0.60` for 2 consecutive iterations (primary convergence signal).
- All 5 research dimensions (D1–D5) covered with `compositeStop ≥ 0.50`.
- 20 iterations reached (hard cap from config).
- 3 consecutive stuck iterations with no recovery path (`stuckThreshold` from config).
- At least 12 unique source files cited across the three skill trees before any composite-stop STOP is accepted (evidence density guard).

---

<!-- /ANCHOR:stop-conditions -->
<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- D1: What undocumented edge cases, redundant reducer passes, journal-rollup gaps, or resume-flow drifts exist in the sk-deep-research v1.5.0.0 loop?
- D1: Are there convergence signals that should exist but currently don't (e.g., citation density, source diversity, contradiction frequency)?
- D2: How effective is the legal-stop gate bundle in sk-deep-review v1.2.0.0 under real review sessions, and where do dimension coverage gates still allow drift?
- D2: Does the new `scripts/reduce-state.cjs` correctly handle partial-failure iterations, severity transitions, and finding deduplication at scale (50+ findings)?
- D3: How fault-tolerant is the orchestrator-only journal emission in sk-improve-agent v1.1.0.0 when a candidate session is interrupted mid-flight?
- D3: Does the trade-off detector produce false positives on small benchmark samples, and does benchmark-stability gating compensate?
- D3: Is the mutation coverage graph namespace (`loop_type: "improvement"`) properly isolated from the deep-research/deep-review namespaces in the shared SQLite store?
- D4: Do the loops emit the full `STOP_REASONS` enum in practice, or are any values (`blockedStop`, `stuckRecovery`, `userPaused`) effectively dead code?
- D4: Do blocked-stop events always persist `gateResults` with the complete set of review-specific or research-specific gates, or are gates silently dropped?
- D4: Are resume flows (`resume`, `restart`, `fork`, `completed-continue`) actually exercised by the YAML workflows, or only documented?
- D4: Do the reducers ever write outside their declared machine-owned anchors, violating the contract?
- D5: Does any loop phase (init / iteration / convergence / synthesis) actively READ from the coverage graph (`coverage-graph-query.ts`, `coverage-graph-convergence.cjs`) to inform decisions, or only WRITE to it?
- D5: Is the `graphEvents` JSONL field consumed by the reducer or downstream tools, or is it write-only?
- D5: Do convergence gates consult `coverage-graph-contradictions.cjs` to block STOP on contradictions, or only consult ratio-based signals?
- D5: Does the coverage graph's contribution to the 3-signal convergence math exceed its weight, or is it merely nominal?
- D5: Are there missing MCP tool calls (e.g., `code_graph_query` for semantic neighbors) that the loops should be making but aren't?

<!-- /ANCHOR:answered-questions -->
<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Reading the reducer before broader docs worked because the state rollup code immediately exposed which JSONL fields and lifecycle events are actually consumed. (iteration 1)
- Comparing the loop workflow surfaces against the shared convergence handler made the missing runtime bridge visible quickly. (iteration 2)
- Comparing live reducer imports and search hits against the documented bridge contract made the missing runtime handoff explicit very quickly. (iteration 3)
- Comparing the auto YAML branches against the reducer ingestion rules made it easy to separate control-flow promises from persisted runtime evidence. (iteration 4)
- Tracing the contract tables directly against the live auto YAML append points made it easy to distinguish raw event labels from truly promoted shared stop reasons. (iteration 5)
- Reading the live auto YAML convergence steps beside the reducer imports made the reachable stop path much clearer than repo-wide helper searches alone. (iteration 6)
- Comparing the published research convergence contract directly against the shared graph signal schema made it easy to distinguish "already promised but unwired" from "available elsewhere but never adopted here." (iteration 7)
- A disposable temp review packet made it possible to separate "malformed JSONL is skipped" from the more important registry/dashboard divergence caused by partially written markdown. (iteration 8)
- The disposable 60-bullet harness turned the scale question into an observed reducer run instead of a code-reading inference, which made the stable merge behavior and missing blocked-stop summaries easy to separate. (iteration 9)
- Using the existing blocked-stop fixture kept this pass read-only while still giving me a concrete uneven-dimension packet to compare against the live workflow and reducer surfaces. (iteration 10)
- Tracing the documented emit commands against the actual helper interfaces exposed the mid-flight recovery gap much faster than searching for every possible artifact. (iteration 11)
- Reading the reducer inputs and the standalone D3 helper APIs side by side made it easy to prove that the current consumer layer never hydrates most of the newly persisted state. (iteration 12)
- Comparing the reducer write sites directly against the published mutability tables made it possible to answer the anchor-boundary question without reopening older runtime debates. (iteration 13)
- Comparing the helper math, MCP handler, reducer reads, and workflow steps side by side made it possible to separate "graph capability exists" from "graph capability is actually on the live stop path." (iteration 14)
- Comparing agent prompts against the concrete tool allowlists and auto-YAML wrapper steps made the contract gap visible very quickly. (iteration 15)
- Reading the improvement-side writer next to the shared DB schema and MCP validators made the namespace boundary visible quickly because the accepted `loopType` values are explicit in both places. (iteration 16)
- Reading the two D3 helpers beside their tests and the reducer made it possible to separate helper-level sample-size behavior from downstream operator surfacing. (iteration 17)
- Comparing the contract documents directly against the reducer write targets made it easy to separate promises that survive in the shipped dashboard from promises that stop at documentation. (iteration 18)
- Reading the published command contract, the helper CLI/parser, the visible YAML workflow, and the reducer entrypoint together made it possible to pinpoint exactly where the richer contract stops being real. (iteration 19)
- Comparing the helper contract, runtime template expectations, and the visible YAML/reducer execution path made it easy to separate “graph exists” from “graph influences decisions.” (iteration 20)

<!-- /ANCHOR:what-worked -->
<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- The first asset-path sweep mixed real and nonexistent filenames, which created noise until I narrowed to the actual auto/confirm YAML files. (iteration 1)
- Broad repository grep added noise from specs and playbooks before I narrowed to active runtime files. (iteration 2)
- Repo-wide symbol search still surfaced older packet/spec artifacts, so I had to keep separating "promised by 042 docs" from "called by active runtime code." (iteration 3)
- Contract terminology is more detailed than the live YAML outputs, so I had to keep checking whether a documented event was actually serialized or merely described. (iteration 4)
- The reducer files barely mention stop reasons explicitly, so proving the consumer gap required reading dashboard/render paths rather than relying on symbol search alone. (iteration 5)
- The published graph-aware sections are detailed enough to sound implemented, so I had to keep separating contract language from active callsites. (iteration 6)
- The active YAML still hides quality-gate internals behind `checkQualityGuards(state, strategy)`, so some runtime-vs-contract comparisons had to be inferred from named signals rather than traced through a concrete implementation body. (iteration 7)
- A lightly truncated finding bullet still parsed successfully, so I had to tighten the reproduction to an interruption that occurred before the finding line became syntactically valid. (iteration 8)
- Static inspection alone could not tell whether transition histories would stay ordered under heavy churn, so the evidence needed a real reducer pass rather than another pure source audit. (iteration 9)
- I could not anchor the analysis to a packet-local review state log because no `blocked_stop` example surfaced under `.opencode/specs`, which limited the runtime evidence to the published path plus fixture coverage. (iteration 10)
- There was no persisted `improvement-journal.jsonl` fixture in the repo to validate against, so the evidence had to come from runtime helper surfaces rather than a completed interrupted-session replay. (iteration 11)
- I could not anchor the “promised replay” to a concrete orchestrator implementation file, so part of the evidence had to come from omission patterns across the runtime files that are present. (iteration 12)
- The deep-review contract spreads ownership promises across state-format prose rather than a single machine-owned-anchor table, so proving under-compliance required stitching several sections together. (iteration 13)
- The workflow YAML alone could not prove total absence of every possible MCP invocation, so negative claims had to stay scoped to the reducer and visible workflow surfaces I could cite. (iteration 14)
- Negative evidence still had to be scoped carefully, because the published wrappers can prove what the live loop exposes without proving the total absence of any hidden executor shortcut elsewhere. (iteration 15)
- Proving absolute absence beyond the published workflow and handler surfaces is still not possible from this pass alone, so the conclusion has to stay scoped to the visible shipped path. (iteration 16)
- I could not anchor the helper interaction to a single visible orchestrator runtime file, so some of the “does gating compensate?” answer had to come from omission across shipped consumer surfaces. (iteration 17)
- The visible reducer path does not show whether richer stop/outcome fields exist upstream in the journal or YAML emitters, so the drift boundary is still scoped to the published reducer/dashboard surface. (iteration 18)
- I could not anchor the result to a single live orchestrator implementation file beyond the command/YAML surfaces, so the conclusion has to stay scoped to the visible shipped path. (iteration 19)
- Negative evidence still depends on the published operator path, so I cannot prove that no hidden executor ever calls the helper elsewhere. (iteration 20)

<!-- /ANCHOR:what-failed -->
<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### .opencode/agent/agent-improver.md:175-177 -- BLOCKED (iteration 3, 1 attempts)
- What was tried: .opencode/agent/agent-improver.md:175-177
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: .opencode/agent/agent-improver.md:175-177

### .opencode/agent/deep-research.md:159-166 -- BLOCKED (iteration 1, 1 attempts)
- What was tried: .opencode/agent/deep-research.md:159-166
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: .opencode/agent/deep-research.md:159-166

### .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:326 -- BLOCKED (iteration 2, 1 attempts)
- What was tried: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:326
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:326

### .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:436-437 -- BLOCKED (iteration 2, 1 attempts)
- What was tried: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:436-437
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:436-437

### .opencode/skill/sk-deep-research/references/convergence.md:1181-1205 -- BLOCKED (iteration 3, 1 attempts)
- What was tried: .opencode/skill/sk-deep-research/references/convergence.md:1181-1205
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: .opencode/skill/sk-deep-research/references/convergence.md:1181-1205

### .opencode/skill/sk-deep-research/references/loop_protocol.md:190-198 -- BLOCKED (iteration 1, 1 attempts)
- What was tried: .opencode/skill/sk-deep-research/references/loop_protocol.md:190-198
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: .opencode/skill/sk-deep-research/references/loop_protocol.md:190-198

### .opencode/skill/sk-deep-research/references/loop_protocol.md:247-255 -- BLOCKED (iteration 1, 1 attempts)
- What was tried: .opencode/skill/sk-deep-research/references/loop_protocol.md:247-255
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: .opencode/skill/sk-deep-research/references/loop_protocol.md:247-255

### .opencode/skill/sk-deep-research/references/loop_protocol.md:77-84 -- BLOCKED (iteration 1, 1 attempts)
- What was tried: .opencode/skill/sk-deep-research/references/loop_protocol.md:77-84
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: .opencode/skill/sk-deep-research/references/loop_protocol.md:77-84

### .opencode/skill/sk-deep-research/references/state_format.md:145-177 -- BLOCKED (iteration 1, 1 attempts)
- What was tried: .opencode/skill/sk-deep-research/references/state_format.md:145-177
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: .opencode/skill/sk-deep-research/references/state_format.md:145-177

### .opencode/skill/sk-deep-research/scripts/reduce-state.cjs:103-127 -- BLOCKED (iteration 2, 2 attempts)
- What was tried: .opencode/skill/sk-deep-research/scripts/reduce-state.cjs:103-127
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: .opencode/skill/sk-deep-research/scripts/reduce-state.cjs:103-127

### .opencode/skill/sk-deep-research/scripts/reduce-state.cjs:11-12 -- BLOCKED (iteration 3, 1 attempts)
- What was tried: .opencode/skill/sk-deep-research/scripts/reduce-state.cjs:11-12
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: .opencode/skill/sk-deep-research/scripts/reduce-state.cjs:11-12

### .opencode/skill/sk-deep-research/scripts/reduce-state.cjs:438-444 -- BLOCKED (iteration 1, 1 attempts)
- What was tried: .opencode/skill/sk-deep-research/scripts/reduce-state.cjs:438-444
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: .opencode/skill/sk-deep-research/scripts/reduce-state.cjs:438-444

### .opencode/skill/sk-deep-research/scripts/reduce-state.cjs:489-502 -- BLOCKED (iteration 2, 2 attempts)
- What was tried: .opencode/skill/sk-deep-research/scripts/reduce-state.cjs:489-502
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: .opencode/skill/sk-deep-research/scripts/reduce-state.cjs:489-502

### .opencode/skill/sk-deep-research/SKILL.md:190-199 -- BLOCKED (iteration 1, 1 attempts)
- What was tried: .opencode/skill/sk-deep-research/SKILL.md:190-199
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: .opencode/skill/sk-deep-research/SKILL.md:190-199

### .opencode/skill/sk-deep-review/references/convergence.md:658-683 -- BLOCKED (iteration 3, 1 attempts)
- What was tried: .opencode/skill/sk-deep-review/references/convergence.md:658-683
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: .opencode/skill/sk-deep-review/references/convergence.md:658-683

### .opencode/skill/sk-improve-agent/scripts/mutation-coverage.cjs:16-67 -- BLOCKED (iteration 3, 1 attempts)
- What was tried: .opencode/skill/sk-improve-agent/scripts/mutation-coverage.cjs:16-67
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: .opencode/skill/sk-improve-agent/scripts/mutation-coverage.cjs:16-67

### .opencode/skill/sk-improve-agent/SKILL.md:294-300 -- BLOCKED (iteration 3, 1 attempts)
- What was tried: .opencode/skill/sk-improve-agent/SKILL.md:294-300
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: .opencode/skill/sk-improve-agent/SKILL.md:294-300

### .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:109-163 -- BLOCKED (iteration 2, 1 attempts)
- What was tried: .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:109-163
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:109-163

### .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:20-25 -- BLOCKED (iteration 2, 1 attempts)
- What was tried: .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:20-25
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:20-25

### .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:245-275 -- BLOCKED (iteration 2, 1 attempts)
- What was tried: .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:245-275
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:245-275

### .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:343-355 -- BLOCKED (iteration 2, 1 attempts)
- What was tried: .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:343-355
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:343-355

### .opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-db.vitest.ts:135-185 -- BLOCKED (iteration 3, 1 attempts)
- What was tried: .opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-db.vitest.ts:135-185
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: .opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-db.vitest.ts:135-185

### .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:779-869 -- BLOCKED (iteration 3, 1 attempts)
- What was tried: .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:779-869
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:779-869

### .opencode/skill/system-spec-kit/scripts/lib/coverage-graph-contradictions.cjs:37-67 -- BLOCKED (iteration 2, 1 attempts)
- What was tried: .opencode/skill/system-spec-kit/scripts/lib/coverage-graph-contradictions.cjs:37-67
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: .opencode/skill/system-spec-kit/scripts/lib/coverage-graph-contradictions.cjs:37-67

### .opencode/skill/system-spec-kit/scripts/lib/coverage-graph-contradictions.cjs:85-129 -- BLOCKED (iteration 2, 1 attempts)
- What was tried: .opencode/skill/system-spec-kit/scripts/lib/coverage-graph-contradictions.cjs:85-129
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: .opencode/skill/system-spec-kit/scripts/lib/coverage-graph-contradictions.cjs:85-129

### .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/implementation-summary.md:47-55 -- BLOCKED (iteration 3, 1 attempts)
- What was tried: .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/implementation-summary.md:47-55
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/implementation-summary.md:47-55

### .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/deep-research-strategy.md:36-38 -- BLOCKED (iteration 1, 1 attempts)
- What was tried: .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/deep-research-strategy.md:36-38
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/deep-research-strategy.md:36-38

### .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/deep-research-strategy.md:48-52 -- BLOCKED (iteration 3, 2 attempts)
- What was tried: .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/deep-research-strategy.md:48-52
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/deep-research-strategy.md:48-52

### .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/iterations/iteration-001.md:7-10 -- BLOCKED (iteration 2, 1 attempts)
- What was tried: .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/iterations/iteration-001.md:7-10
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/iterations/iteration-001.md:7-10

### .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/iterations/iteration-002.md:7-10 -- BLOCKED (iteration 3, 1 attempts)
- What was tried: .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/iterations/iteration-002.md:7-10
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/iterations/iteration-002.md:7-10

### "Coverage graph convergence is purely decorative in the codebase." Ruled out because both the CJS helper and the MCP handler contain real thresholds, weighted signals, and STOP-blocking branches; the gap is caller integration, not total absence (`.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs:141-258`, `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:183-379`). -- BLOCKED (iteration 14, 1 attempts)
- What was tried: "Coverage graph convergence is purely decorative in the codebase." Ruled out because both the CJS helper and the MCP handler contain real thresholds, weighted signals, and STOP-blocking branches; the gap is caller integration, not total absence (`.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs:141-258`, `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:183-379`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Coverage graph convergence is purely decorative in the codebase." Ruled out because both the CJS helper and the MCP handler contain real thresholds, weighted signals, and STOP-blocking branches; the gap is caller integration, not total absence (`.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs:141-258`, `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:183-379`).

### `claimVerificationRate` and `evidenceDepth` should not yet be treated as contract drift in `sk-deep-research`; the current research convergence reference still frames the semantic extension around `semanticNovelty`, `contradictionDensity`, and `citationOverlap` instead (.opencode/skill/sk-deep-research/references/convergence.md:341-457). -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `claimVerificationRate` and `evidenceDepth` should not yet be treated as contract drift in `sk-deep-research`; the current research convergence reference still frames the semantic extension around `semanticNovelty`, `contradictionDensity`, and `citationOverlap` instead (.opencode/skill/sk-deep-research/references/convergence.md:341-457).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `claimVerificationRate` and `evidenceDepth` should not yet be treated as contract drift in `sk-deep-research`; the current research convergence reference still frames the semantic extension around `semanticNovelty`, `contradictionDensity`, and `citationOverlap` instead (.opencode/skill/sk-deep-research/references/convergence.md:341-457).

### `stuckRecovery` is not entirely absent from runtime serialization, but the only concrete live record I found is review's raw `stuck_recovery` event; that is weaker than the documented shared enum contract and does not prove consumer-visible normalization (.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:375-383). -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `stuckRecovery` is not entirely absent from runtime serialization, but the only concrete live record I found is review's raw `stuck_recovery` event; that is weaker than the documented shared enum contract and does not prove consumer-visible normalization (.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:375-383).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `stuckRecovery` is not entirely absent from runtime serialization, but the only concrete live record I found is review's raw `stuck_recovery` event; that is weaker than the documented shared enum contract and does not prove consumer-visible normalization (.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:375-383).

### A 50+ finding packet does not by itself break `Map`-by-`findingId` dedup or transition ordering; the remaining reducer risk is visibility loss, not merge corruption. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: A 50+ finding packet does not by itself break `Map`-by-`findingId` dedup or transition ordering; the remaining reducer risk is visibility loss, not merge corruption.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A 50+ finding packet does not by itself break `Map`-by-`findingId` dedup or transition ordering; the remaining reducer risk is visibility loss, not merge corruption.

### A command-doc requirement to invoke structural graph tools before or during iterations; the inspected command surfaces only bootstrap CocoIndex. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: A command-doc requirement to invoke structural graph tools before or during iterations; the inspected command surfaces only bootstrap CocoIndex.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A command-doc requirement to invoke structural graph tools before or during iterations; the inspected command surfaces only bootstrap CocoIndex.

### A normal-pass reducer path that rewrites `review-report.md`; the deep-review reducer writes strategy, registry, and dashboard only. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: A normal-pass reducer path that rewrites `review-report.md`; the deep-review reducer writes strategy, registry, and dashboard only.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A normal-pass reducer path that rewrites `review-report.md`; the deep-review reducer writes strategy, registry, and dashboard only.

### A shipped `sk-improve-agent` reducer path that mutates `agent-improvement-strategy.md`; the reducer never opens or writes that file. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: A shipped `sk-improve-agent` reducer path that mutates `agent-improvement-strategy.md`; the reducer never opens or writes that file.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A shipped `sk-improve-agent` reducer path that mutates `agent-improvement-strategy.md`; the reducer never opens or writes that file.

### A wrapper-level `deep_loop_graph_convergence` step on the visible research/review iteration path; the cited YAML paths go from iteration output to reducer execution without a graph-convergence call. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: A wrapper-level `deep_loop_graph_convergence` step on the visible research/review iteration path; the cited YAML paths go from iteration output to reducer execution without a graph-convergence call.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A wrapper-level `deep_loop_graph_convergence` step on the visible research/review iteration path; the cited YAML paths go from iteration output to reducer execution without a graph-convergence call.

### Benchmark stability is not over-blocking small samples in the inspected helper path; it under-blocks them by allowing 1-2 replay samples to look stable enough unless visible variance already appears. (`.opencode/skill/sk-improve-agent/scripts/benchmark-stability.cjs:69-92`, `.opencode/skill/sk-improve-agent/scripts/benchmark-stability.cjs:103-171`, `.opencode/skill/sk-improve-agent/scripts/tests/benchmark-stability.vitest.ts:124-139`) -- BLOCKED (iteration 17, 1 attempts)
- What was tried: Benchmark stability is not over-blocking small samples in the inspected helper path; it under-blocks them by allowing 1-2 replay samples to look stable enough unless visible variance already appears. (`.opencode/skill/sk-improve-agent/scripts/benchmark-stability.cjs:69-92`, `.opencode/skill/sk-improve-agent/scripts/benchmark-stability.cjs:103-171`, `.opencode/skill/sk-improve-agent/scripts/tests/benchmark-stability.vitest.ts:124-139`)
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Benchmark stability is not over-blocking small samples in the inspected helper path; it under-blocks them by allowing 1-2 replay samples to look stable enough unless visible variance already appears. (`.opencode/skill/sk-improve-agent/scripts/benchmark-stability.cjs:69-92`, `.opencode/skill/sk-improve-agent/scripts/benchmark-stability.cjs:103-171`, `.opencode/skill/sk-improve-agent/scripts/tests/benchmark-stability.vitest.ts:124-139`)

### I did not execute the 50+ finding stress portion of the D2 question in this pass; the budget went to reproducing the partial-write divergence first, so scale behavior remains open. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: I did not execute the 50+ finding stress portion of the D2 question in this pass; the budget went to reproducing the partial-write divergence first, so scale behavior remains open.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: I did not execute the 50+ finding stress portion of the D2 question in this pass; the budget went to reproducing the partial-write divergence first, so scale behavior remains open.

### I did not find a packet-local `blocked_stop` example under `.opencode/specs` review state logs, so the dimension-skewed evidence had to come from the deep-loop optimizer fixture rather than a live spec review packet. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: I did not find a packet-local `blocked_stop` example under `.opencode/specs` review state logs, so the dimension-skewed evidence had to come from the deep-loop optimizer fixture rather than a live spec review packet.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: I did not find a packet-local `blocked_stop` example under `.opencode/specs` review state logs, so the dimension-skewed evidence had to come from the deep-loop optimizer fixture rather than a live spec review packet.

### I did not find a packet-local `improvement-journal.jsonl` or `mutation-coverage.json` artifact to inspect directly, so this pass had to infer interrupted-session behavior from the shipped helper surfaces plus the remaining legacy self-test state. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: I did not find a packet-local `improvement-journal.jsonl` or `mutation-coverage.json` artifact to inspect directly, so this pass had to infer interrupted-session behavior from the shipped helper surfaces plus the remaining legacy self-test state.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: I did not find a packet-local `improvement-journal.jsonl` or `mutation-coverage.json` artifact to inspect directly, so this pass had to infer interrupted-session behavior from the shipped helper surfaces plus the remaining legacy self-test state.

### I did not find a separate visible orchestrator runtime file that programmatically calls `emitEvent()` outside the command/YAML surfaces inspected here, so the conclusion stays scoped to the shipped command contract, journal helper, visible YAML workflow, and reducer path rather than every possible hidden executor implementation. -- BLOCKED (iteration 19, 1 attempts)
- What was tried: I did not find a separate visible orchestrator runtime file that programmatically calls `emitEvent()` outside the command/YAML surfaces inspected here, so the conclusion stays scoped to the shipped command contract, journal helper, visible YAML workflow, and reducer path rather than every possible hidden executor implementation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: I did not find a separate visible orchestrator runtime file that programmatically calls `emitEvent()` outside the command/YAML surfaces inspected here, so the conclusion stays scoped to the shipped command contract, journal helper, visible YAML workflow, and reducer path rather than every possible hidden executor implementation.

### I did not find a shipped orchestrator implementation file that performs the promised “replay journal + coverage graph + registry before dispatch,” so this pass had to prove absence via reducer inputs and helper interfaces rather than a single end-to-end resume driver. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: I did not find a shipped orchestrator implementation file that performs the promised “replay journal + coverage graph + registry before dispatch,” so this pass had to prove absence via reducer inputs and helper interfaces rather than a single end-to-end resume driver.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: I did not find a shipped orchestrator implementation file that performs the promised “replay journal + coverage graph + registry before dispatch,” so this pass had to prove absence via reducer inputs and helper interfaces rather than a single end-to-end resume driver.

### I did not find a visible orchestrator implementation file that wires `trade-off-detector.cjs` and `benchmark-stability.cjs` together end-to-end, so the compensation question had to be answered from the shipped helpers, tests, reducer inputs, and dashboard renderer rather than a single runtime driver. -- BLOCKED (iteration 17, 1 attempts)
- What was tried: I did not find a visible orchestrator implementation file that wires `trade-off-detector.cjs` and `benchmark-stability.cjs` together end-to-end, so the compensation question had to be answered from the shipped helpers, tests, reducer inputs, and dashboard renderer rather than a single runtime driver.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: I did not find a visible orchestrator implementation file that wires `trade-off-detector.cjs` and `benchmark-stability.cjs` together end-to-end, so the compensation question had to be answered from the shipped helpers, tests, reducer inputs, and dashboard renderer rather than a single runtime driver.

### I did not inspect `scripts/improvement-journal.cjs` or the `/improve:agent` YAML emitters in this pass, so I cannot yet tell whether exact stop reasons and session outcomes are produced upstream and then dropped by the reducer, or whether the visible workflow path never emits them at all. -- BLOCKED (iteration 18, 1 attempts)
- What was tried: I did not inspect `scripts/improvement-journal.cjs` or the `/improve:agent` YAML emitters in this pass, so I cannot yet tell whether exact stop reasons and session outcomes are produced upstream and then dropped by the reducer, or whether the visible workflow path never emits them at all.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: I did not inspect `scripts/improvement-journal.cjs` or the `/improve:agent` YAML emitters in this pass, so I cannot yet tell whether exact stop reasons and session outcomes are produced upstream and then dropped by the reducer, or whether the visible workflow path never emits them at all.

### I did not inspect confirm-mode workflows in this pass because the question was whether the active deep-research runtime currently bridges to the shared graph signal set; the auto workflow, convergence reference, reducer, and shared graph handler were sufficient to classify the signal gaps. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: I did not inspect confirm-mode workflows in this pass because the question was whether the active deep-research runtime currently bridges to the shared graph signal set; the auto workflow, convergence reference, reducer, and shared graph handler were sufficient to classify the signal gaps.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: I did not inspect confirm-mode workflows in this pass because the question was whether the active deep-research runtime currently bridges to the shared graph signal set; the auto workflow, convergence reference, reducer, and shared graph handler were sufficient to classify the signal gaps.

### I did not inspect confirm-mode YAMLs in this pass because the active auto workflows plus reducer consumers were already sufficient to determine whether the shared stop-reason enum is promoted into persisted state. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: I did not inspect confirm-mode YAMLs in this pass because the active auto workflows plus reducer consumers were already sufficient to determine whether the shared stop-reason enum is promoted into persisted state.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: I did not inspect confirm-mode YAMLs in this pass because the active auto workflows plus reducer consumers were already sufficient to determine whether the shared stop-reason enum is promoted into persisted state.

### I did not inspect confirm-mode YAMLs in this pass because the strategy explicitly targeted the active runtime path, and the auto workflows plus reducers were already sufficient to determine whether contradiction-aware blocking is reachable before STOP. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: I did not inspect confirm-mode YAMLs in this pass because the strategy explicitly targeted the active runtime path, and the auto workflows plus reducers were already sufficient to determine whether contradiction-aware blocking is reachable before STOP.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: I did not inspect confirm-mode YAMLs in this pass because the strategy explicitly targeted the active runtime path, and the auto workflows plus reducers were already sufficient to determine whether contradiction-aware blocking is reachable before STOP.

### I did not inspect confirm-mode YAMLs in this pass because the strategy focus was the normal runtime path, and the auto workflows plus reducers were enough to establish the serialization gap. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: I did not inspect confirm-mode YAMLs in this pass because the strategy focus was the normal runtime path, and the auto workflows plus reducers were enough to establish the serialization gap.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: I did not inspect confirm-mode YAMLs in this pass because the strategy focus was the normal runtime path, and the auto workflows plus reducers were enough to establish the serialization gap.

### I did not inspect hidden executor internals outside the published skill, command, agent, and auto-YAML surfaces, so the negative claim stays scoped to the visible live iteration materials that actually define the LEAF-agent budget and workflow. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: I did not inspect hidden executor internals outside the published skill, command, agent, and auto-YAML surfaces, so the negative claim stays scoped to the visible live iteration materials that actually define the LEAF-agent budget and workflow.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: I did not inspect hidden executor internals outside the published skill, command, agent, and auto-YAML surfaces, so the negative claim stays scoped to the visible live iteration materials that actually define the LEAF-agent budget and workflow.

### I did not inspect hidden executor internals outside the published skill, workflow, and MCP handler surfaces, so the negative claim stays scoped to the shipped writer/validator/query path that is visible in-repo. -- BLOCKED (iteration 16, 1 attempts)
- What was tried: I did not inspect hidden executor internals outside the published skill, workflow, and MCP handler surfaces, so the negative claim stays scoped to the shipped writer/validator/query path that is visible in-repo.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: I did not inspect hidden executor internals outside the published skill, workflow, and MCP handler surfaces, so the negative claim stays scoped to the shipped writer/validator/query path that is visible in-repo.

### I did not inspect synthesis-only report generators or YAML wrappers in this pass because the open D4 question was specifically about reducer write boundaries, and the reducer entry points were sufficient to answer it. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: I did not inspect synthesis-only report generators or YAML wrappers in this pass because the open D4 question was specifically about reducer write boundaries, and the reducer entry points were sufficient to answer it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: I did not inspect synthesis-only report generators or YAML wrappers in this pass because the open D4 question was specifically about reducer write boundaries, and the reducer entry points were sufficient to answer it.

### I did not locate a separate visible orchestrator runtime file beyond the published command/YAML surfaces that might call `mutation-coverage.cjs` programmatically, so the conclusion stays scoped to the shipped operator-facing path rather than every possible hidden executor. -- BLOCKED (iteration 20, 1 attempts)
- What was tried: I did not locate a separate visible orchestrator runtime file beyond the published command/YAML surfaces that might call `mutation-coverage.cjs` programmatically, so the conclusion stays scoped to the shipped operator-facing path rather than every possible hidden executor.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: I did not locate a separate visible orchestrator runtime file beyond the published command/YAML surfaces that might call `mutation-coverage.cjs` programmatically, so the conclusion stays scoped to the shipped operator-facing path rather than every possible hidden executor.

### I did not pursue confirm-mode workflow differences in this pass because the open question was reducer behavior under a large persisted packet, and the reducer entrypoint plus the shared convergence contract were enough to answer that. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: I did not pursue confirm-mode workflow differences in this pass because the open question was reducer behavior under a large persisted packet, and the reducer entrypoint plus the shared convergence contract were enough to answer that.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: I did not pursue confirm-mode workflow differences in this pass because the open question was reducer behavior under a large persisted packet, and the reducer entrypoint plus the shared convergence contract were enough to answer that.

### No evidence that prior iteration findings would make these observations redundant; `research/iterations/` was empty before this run and `deep-research-state.jsonl` only contained the config row (.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/deep-research-state.jsonl:1). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: No evidence that prior iteration findings would make these observations redundant; `research/iterations/` was empty before this run and `deep-research-state.jsonl` only contained the config row (.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/deep-research-state.jsonl:1).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No evidence that prior iteration findings would make these observations redundant; `research/iterations/` was empty before this run and `deep-research-state.jsonl` only contained the config row (.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/deep-research-state.jsonl:1).

### No evidence that YAML workflow outputs bypass the reducer-owned packet surfaces; both auto and confirm flows still target `findings-registry.json` and `deep-research-dashboard.md` as synchronized outputs (.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:83-84; .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:197; .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:83-84; .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:196-217). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: No evidence that YAML workflow outputs bypass the reducer-owned packet surfaces; both auto and confirm flows still target `findings-registry.json` and `deep-research-dashboard.md` as synchronized outputs (.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:83-84; .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:197; .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:83-84; .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:196-217).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No evidence that YAML workflow outputs bypass the reducer-owned packet surfaces; both auto and confirm flows still target `findings-registry.json` and `deep-research-dashboard.md` as synchronized outputs (.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:83-84; .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:197; .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:83-84; .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:196-217).

### No hidden bridge appeared in the active reducer path: the deep-research reducer still has no MCP/tool client imports and no graph-event parsing branch, so the bridge is not merely buried deeper in the same file (.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:11-12; .opencode/skill/sk-deep-research/scripts/reduce-state.cjs:246-247). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: No hidden bridge appeared in the active reducer path: the deep-research reducer still has no MCP/tool client imports and no graph-event parsing branch, so the bridge is not merely buried deeper in the same file (.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:11-12; .opencode/skill/sk-deep-research/scripts/reduce-state.cjs:246-247).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No hidden bridge appeared in the active reducer path: the deep-research reducer still has no MCP/tool client imports and no graph-event parsing branch, so the bridge is not merely buried deeper in the same file (.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:11-12; .opencode/skill/sk-deep-research/scripts/reduce-state.cjs:246-247).

### Proving every possible runtime call site for `deep_loop_graph_convergence` from the workflow layer alone. The inspected YAML sections were enough to show the visible reducer path, but not enough to prove whether any hidden wrapper invokes the MCP handler elsewhere, so this pass stayed grounded in reducers plus directly cited workflow instructions. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: Proving every possible runtime call site for `deep_loop_graph_convergence` from the workflow layer alone. The inspected YAML sections were enough to show the visible reducer path, but not enough to prove whether any hidden wrapper invokes the MCP handler elsewhere, so this pass stayed grounded in reducers plus directly cited workflow instructions.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Proving every possible runtime call site for `deep_loop_graph_convergence` from the workflow layer alone. The inspected YAML sections were enough to show the visible reducer path, but not enough to prove whether any hidden wrapper invokes the MCP handler elsewhere, so this pass stayed grounded in reducers plus directly cited workflow instructions.

### Repo-wide symbol search for the new D3 modules surfaced mostly docs, specs, changelog entries, and tests, which limited negative-proof evidence to the runtime files that do exist. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Repo-wide symbol search for the new D3 modules surfaced mostly docs, specs, changelog entries, and tests, which limited negative-proof evidence to the runtime files that do exist.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Repo-wide symbol search for the new D3 modules surfaced mostly docs, specs, changelog entries, and tests, which limited negative-proof evidence to the runtime files that do exist.

### The graph layer is not purely nominal overall; the shared MCP convergence handler can block STOP on graph-derived coverage gaps, contradictions, unverified claims, source diversity, and evidence depth when it is actually invoked (.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:122-163; .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:225-275; .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:330-355). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: The graph layer is not purely nominal overall; the shared MCP convergence handler can block STOP on graph-derived coverage gaps, contradictions, unverified claims, source diversity, and evidence depth when it is actually invoked (.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:122-163; .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:225-275; .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:330-355).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The graph layer is not purely nominal overall; the shared MCP convergence handler can block STOP on graph-derived coverage gaps, contradictions, unverified claims, source diversity, and evidence depth when it is actually invoked (.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:122-163; .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:225-275; .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:330-355).

### The main D3 risk is not proposal-agent side effects; the failure surface here is orchestrator wiring and persistence fidelity, not the proposal-only boundary itself. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: The main D3 risk is not proposal-agent side effects; the failure surface here is orchestrator wiring and persistence fidelity, not the proposal-only boundary itself.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The main D3 risk is not proposal-agent side effects; the failure surface here is orchestrator wiring and persistence fidelity, not the proposal-only boundary itself.

### The shared graph capability itself is not missing; the missing piece is runtime wiring. The MCP tool layer already exposes both `deep_loop_graph_upsert` and `deep_loop_graph_convergence` with reducer-oriented contracts (.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:779-823; .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:856-869). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: The shared graph capability itself is not missing; the missing piece is runtime wiring. The MCP tool layer already exposes both `deep_loop_graph_upsert` and `deep_loop_graph_convergence` with reducer-oriented contracts (.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:779-823; .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:856-869).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The shared graph capability itself is not missing; the missing piece is runtime wiring. The MCP tool layer already exposes both `deep_loop_graph_upsert` and `deep_loop_graph_convergence` with reducer-oriented contracts (.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:779-823; .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:856-869).

### The visible MCP coverage-graph path is not currently allowing `loop_type: "improvement"` to pollute shared research/review graphs; the stronger risk is documentation/strategy drift plus missing per-session read isolation inside the research/review namespaces. -- BLOCKED (iteration 16, 1 attempts)
- What was tried: The visible MCP coverage-graph path is not currently allowing `loop_type: "improvement"` to pollute shared research/review graphs; the stronger risk is documentation/strategy drift plus missing per-session read isolation inside the research/review namespaces.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The visible MCP coverage-graph path is not currently allowing `loop_type: "improvement"` to pollute shared research/review graphs; the stronger risk is documentation/strategy drift plus missing per-session read isolation inside the research/review namespaces.

### This is not a bad gate taxonomy problem. The blocked-stop fixture uses the same gate names and recovery semantics the contract publishes, so the issue is persistence/consumption drift rather than mislabeled review gates (`.opencode/skill/sk-deep-review/references/convergence.md:362-419`, `.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-optimizer/sample-040-corpus.jsonl:4`). -- BLOCKED (iteration 10, 1 attempts)
- What was tried: This is not a bad gate taxonomy problem. The blocked-stop fixture uses the same gate names and recovery semantics the contract publishes, so the issue is persistence/consumption drift rather than mislabeled review gates (`.opencode/skill/sk-deep-review/references/convergence.md:362-419`, `.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-optimizer/sample-040-corpus.jsonl:4`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: This is not a bad gate taxonomy problem. The blocked-stop fixture uses the same gate names and recovery semantics the contract publishes, so the issue is persistence/consumption drift rather than mislabeled review gates (`.opencode/skill/sk-deep-review/references/convergence.md:362-419`, `.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-optimizer/sample-040-corpus.jsonl:4`).

### This is not a blanket "any truncation breaks lifecycle" failure. If a truncated iteration file still includes a parseable finding bullet, `parseFindingLine()` and `buildFindingRegistry()` can still record the severity transition and mark the finding as repeated (`.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:116-143`, `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:239-267`). -- BLOCKED (iteration 8, 1 attempts)
- What was tried: This is not a blanket "any truncation breaks lifecycle" failure. If a truncated iteration file still includes a parseable finding bullet, `parseFindingLine()` and `buildFindingRegistry()` can still record the severity transition and mark the finding as repeated (`.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:116-143`, `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:239-267`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: This is not a blanket "any truncation breaks lifecycle" failure. If a truncated iteration file still includes a parseable finding bullet, `parseFindingLine()` and `buildFindingRegistry()` can still record the severity transition and mark the finding as repeated (`.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:116-143`, `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:239-267`).

### This is not a documentation-gap false alarm: both convergence references already define the shared enum, the legacy-label normalization rules, and the required blocked-stop persistence shape in detail (.opencode/skill/sk-deep-research/references/convergence.md:21-31; .opencode/skill/sk-deep-review/references/convergence.md:44-56). -- BLOCKED (iteration 5, 1 attempts)
- What was tried: This is not a documentation-gap false alarm: both convergence references already define the shared enum, the legacy-label normalization rules, and the required blocked-stop persistence shape in detail (.opencode/skill/sk-deep-research/references/convergence.md:21-31; .opencode/skill/sk-deep-review/references/convergence.md:44-56).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: This is not a documentation-gap false alarm: both convergence references already define the shared enum, the legacy-label normalization rules, and the required blocked-stop persistence shape in detail (.opencode/skill/sk-deep-research/references/convergence.md:21-31; .opencode/skill/sk-deep-review/references/convergence.md:44-56).

### This is not a reducer-only discard bug. The visible YAML workflow never emits journal events into the reducer input path in the first place, so the contract break begins upstream of `reduce-state.cjs`. (`.opencode/command/improve/assets/improve_agent-improver_auto.yaml:149-167`, `.opencode/command/improve/assets/improve_agent-improver_confirm.yaml:173-201`, `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:489-503`) -- BLOCKED (iteration 19, 1 attempts)
- What was tried: This is not a reducer-only discard bug. The visible YAML workflow never emits journal events into the reducer input path in the first place, so the contract break begins upstream of `reduce-state.cjs`. (`.opencode/command/improve/assets/improve_agent-improver_auto.yaml:149-167`, `.opencode/command/improve/assets/improve_agent-improver_confirm.yaml:173-201`, `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:489-503`)
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: This is not a reducer-only discard bug. The visible YAML workflow never emits journal events into the reducer input path in the first place, so the contract break begins upstream of `reduce-state.cjs`. (`.opencode/command/improve/assets/improve_agent-improver_auto.yaml:149-167`, `.opencode/command/improve/assets/improve_agent-improver_confirm.yaml:173-201`, `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:489-503`)

### This is not another reducer merge-stability regression. Iteration 9 already established that finding dedup and transition ordering stay stable at 50+ findings, which leaves observability and recovery handoff as the remaining D2 weakness (`.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/iterations/iteration-009.md:7-11`). -- BLOCKED (iteration 10, 1 attempts)
- What was tried: This is not another reducer merge-stability regression. Iteration 9 already established that finding dedup and transition ordering stay stable at 50+ findings, which leaves observability and recovery handoff as the remaining D2 weakness (`.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/iterations/iteration-009.md:7-11`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: This is not another reducer merge-stability regression. Iteration 9 already established that finding dedup and transition ordering stay stable at 50+ findings, which leaves observability and recovery handoff as the remaining D2 weakness (`.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/iterations/iteration-009.md:7-11`).

### This is not because contradiction tooling is missing. The shared contradiction scanner and MCP convergence handler already implement contradiction-aware blocking logic (`.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-contradictions.cjs:37-158`, `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:200-264`). -- BLOCKED (iteration 6, 1 attempts)
- What was tried: This is not because contradiction tooling is missing. The shared contradiction scanner and MCP convergence handler already implement contradiction-aware blocking logic (`.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-contradictions.cjs:37-158`, `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:200-264`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: This is not because contradiction tooling is missing. The shared contradiction scanner and MCP convergence handler already implement contradiction-aware blocking logic (`.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-contradictions.cjs:37-158`, `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:200-264`).

### This is not because the graph was disabled in configuration. The shipped config explicitly enables `coverageGraph` and points it at `improvement/mutation-coverage.json`, so the gap is consumption in the visible loop, not a disabled feature flag. (`.opencode/skill/sk-improve-agent/assets/improvement_config.json:92-95`) -- BLOCKED (iteration 20, 1 attempts)
- What was tried: This is not because the graph was disabled in configuration. The shipped config explicitly enables `coverageGraph` and points it at `improvement/mutation-coverage.json`, so the gap is consumption in the visible loop, not a disabled feature flag. (`.opencode/skill/sk-improve-agent/assets/improvement_config.json:92-95`)
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: This is not because the graph was disabled in configuration. The shipped config explicitly enables `coverageGraph` and points it at `improvement/mutation-coverage.json`, so the gap is consumption in the visible loop, not a disabled feature flag. (`.opencode/skill/sk-improve-agent/assets/improvement_config.json:92-95`)

### This is not isolated to one loop. The research and review auto YAMLs both classify the same lineage branches while only surfacing a smaller event set in the active runtime path (`.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:128-153`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:155-177`). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: This is not isolated to one loop. The research and review auto YAMLs both classify the same lineage branches while only surfacing a smaller event set in the active runtime path (`.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:128-153`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:155-177`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: This is not isolated to one loop. The research and review auto YAMLs both classify the same lineage branches while only surfacing a smaller event set in the active runtime path (`.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:128-153`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:155-177`).

### This is not just a documentation omission. Both convergence references are explicit about first-class blocked-stop persistence and full gate bundles, so the drift is between published contract and live workflow serialization, not between two equally vague docs (`.opencode/skill/sk-deep-research/references/convergence.md:305-309`, `.opencode/skill/sk-deep-review/references/convergence.md:58-85`). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: This is not just a documentation omission. Both convergence references are explicit about first-class blocked-stop persistence and full gate bundles, so the drift is between published contract and live workflow serialization, not between two equally vague docs (`.opencode/skill/sk-deep-research/references/convergence.md:305-309`, `.opencode/skill/sk-deep-review/references/convergence.md:58-85`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: This is not just a documentation omission. Both convergence references are explicit about first-class blocked-stop persistence and full gate bundles, so the drift is between published contract and live workflow serialization, not between two equally vague docs (`.opencode/skill/sk-deep-research/references/convergence.md:305-309`, `.opencode/skill/sk-deep-review/references/convergence.md:58-85`).

### This is not just a missing-event-taxonomy problem. The journal already recognizes `benchmark_completed`, `blocked_stop`, and `trade_off_detected`, so the main gap is consumer reconstruction and surfacing rather than missing event names (`.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:47-67`). -- BLOCKED (iteration 12, 1 attempts)
- What was tried: This is not just a missing-event-taxonomy problem. The journal already recognizes `benchmark_completed`, `blocked_stop`, and `trade_off_detected`, so the main gap is consumer reconstruction and surfacing rather than missing event names (`.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:47-67`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: This is not just a missing-event-taxonomy problem. The journal already recognizes `benchmark_completed`, `blocked_stop`, and `trade_off_detected`, so the main gap is consumer reconstruction and surfacing rather than missing event names (`.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:47-67`).

### This is not limited to one loop. Both research and review convergence references promise graph-aware gate participation, but both active auto workflows keep STOP evaluation inline and local (`.opencode/skill/sk-deep-research/references/convergence.md:1181-1205`, `.opencode/skill/sk-deep-review/references/convergence.md:661-683`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:250-277`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:343-375`). -- BLOCKED (iteration 6, 1 attempts)
- What was tried: This is not limited to one loop. Both research and review convergence references promise graph-aware gate participation, but both active auto workflows keep STOP evaluation inline and local (`.opencode/skill/sk-deep-research/references/convergence.md:1181-1205`, `.opencode/skill/sk-deep-review/references/convergence.md:661-683`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:250-277`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:343-375`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: This is not limited to one loop. Both research and review convergence references promise graph-aware gate participation, but both active auto workflows keep STOP evaluation inline and local (`.opencode/skill/sk-deep-research/references/convergence.md:1181-1205`, `.opencode/skill/sk-deep-review/references/convergence.md:661-683`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:250-277`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:343-375`).

### This is not merely reducer documentation drift. The reducer’s own file inputs and registry builder omit the journal, lineage graph, and mutation-coverage artifacts entirely, so the current recovery gap is structural, not just under-explained (`.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:145-235`, `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:489-503`). -- BLOCKED (iteration 12, 1 attempts)
- What was tried: This is not merely reducer documentation drift. The reducer’s own file inputs and registry builder omit the journal, lineage graph, and mutation-coverage artifacts entirely, so the current recovery gap is structural, not just under-explained (`.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:145-235`, `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:489-503`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: This is not merely reducer documentation drift. The reducer’s own file inputs and registry builder omit the journal, lineage graph, and mutation-coverage artifacts entirely, so the current recovery gap is structural, not just under-explained (`.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:145-235`, `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:489-503`).

### This is not primarily a shared-infrastructure deficit: the graph/MCP layer already computes and evaluates the richer research signals, including blocker semantics for `sourceDiversity`, `evidenceDepth`, contradictions, and unverified claims (.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:163-228; .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:175-275). -- BLOCKED (iteration 7, 1 attempts)
- What was tried: This is not primarily a shared-infrastructure deficit: the graph/MCP layer already computes and evaluates the richer research signals, including blocker semantics for `sourceDiversity`, `evidenceDepth`, contradictions, and unverified claims (.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:163-228; .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:175-275).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: This is not primarily a shared-infrastructure deficit: the graph/MCP layer already computes and evaluates the richer research signals, including blocker semantics for `sourceDiversity`, `evidenceDepth`, contradictions, and unverified claims (.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:163-228; .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:175-275).

### This is not primarily a threshold-value bug: the shipped trade-off thresholds and weak-benchmark stop thresholds are internally consistent with config, so the problem is missing sample-size enforcement and signal loss across consumers, not a simple off-by-one constant mismatch. (`.opencode/skill/sk-improve-agent/assets/improvement_config.json:72-79`, `.opencode/skill/sk-improve-agent/assets/improvement_config.json:100-123`, `.opencode/skill/sk-improve-agent/scripts/trade-off-detector.cjs:40-49`) -- BLOCKED (iteration 17, 1 attempts)
- What was tried: This is not primarily a threshold-value bug: the shipped trade-off thresholds and weak-benchmark stop thresholds are internally consistent with config, so the problem is missing sample-size enforcement and signal loss across consumers, not a simple off-by-one constant mismatch. (`.opencode/skill/sk-improve-agent/assets/improvement_config.json:72-79`, `.opencode/skill/sk-improve-agent/assets/improvement_config.json:100-123`, `.opencode/skill/sk-improve-agent/scripts/trade-off-detector.cjs:40-49`)
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: This is not primarily a threshold-value bug: the shipped trade-off thresholds and weak-benchmark stop thresholds are internally consistent with config, so the problem is missing sample-size enforcement and signal loss across consumers, not a simple off-by-one constant mismatch. (`.opencode/skill/sk-improve-agent/assets/improvement_config.json:72-79`, `.opencode/skill/sk-improve-agent/assets/improvement_config.json:100-123`, `.opencode/skill/sk-improve-agent/scripts/trade-off-detector.cjs:40-49`)

### This is not universal contract drift. README's `mirror drift as packaging work` guidance survives in the dashboard guardrails, and the dimensional-progress/plateau path is also visibly implemented. (`.opencode/skill/sk-improve-agent/README.md:167-169`, `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:458-463`) -- BLOCKED (iteration 18, 1 attempts)
- What was tried: This is not universal contract drift. README's `mirror drift as packaging work` guidance survives in the dashboard guardrails, and the dimensional-progress/plateau path is also visibly implemented. (`.opencode/skill/sk-improve-agent/README.md:167-169`, `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:458-463`)
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: This is not universal contract drift. README's `mirror drift as packaging work` guidance survives in the dashboard guardrails, and the dimensional-progress/plateau path is also visibly implemented. (`.opencode/skill/sk-improve-agent/README.md:167-169`, `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:458-463`)

<!-- /ANCHOR:exhausted-approaches -->
<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
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

<!-- /ANCHOR:ruled-out-directions -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
If this research spins into a follow-on packet, the next productive move is not another broad loop audit but a narrow implementation-gap triage for `sk-improve-agent`: inspect `score-candidate.cjs`, any hidden orchestrator wrapper, and the confirm-mode workflow for off-path graph consumption, then decide whether to wire `mutation-coverage.cjs` into live focus/stop decisions or downgrade the docs/templates so they stop implying graph-driven behavior that the visible loop does not perform.

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->
<!-- ANCHOR:known-context -->
## 12. KNOWN CONTEXT

### Skill Versions Shipped in This Session (commit `460c243a8` and later)

| Skill | Version | Changelog |
|---|---|---|
| `sk-deep-research` | **1.5.0.0** | `.opencode/changelog/12--sk-deep-research/v1.5.0.0.md` |
| `sk-deep-review` | **1.2.0.0** | `.opencode/changelog/13--sk-deep-review/v1.2.0.0.md` |
| `sk-improve-agent` | **1.1.0.0** | `.opencode/changelog/15--sk-improve-agent/v1.1.0.0.md` |

### sk-deep-research v1.5.0.0 Contract Highlights

- Frozen `STOP_REASONS` enum: `converged`, `maxIterationsReached`, `blockedStop`, `stuckRecovery`, `error`, `manualStop`, `userPaused`
- Legal-stop gates: convergence + key-question coverage + evidence density + hotspot saturation must all pass
- Blocked-stop events persist as first-class JSONL records with `blockedBy`, `gateResults`, `recoveryStrategy`
- `graphEvents` optional array on each iteration record (`{type, id, label, relation?, source?, target?}`)
- 3-signal convergence: `rollingAvg` (0.35), `madScore` (0.25), `semanticNovelty` (0.40)
- Reducer owns: audit journal rollup, timing metrics, coverage depth, evidence-quality summary, claim ledger verification
- Resume modes: `resume`, `restart`, `fork`, `completed-continue`
- Stuck-recovery JSONL event + least-covered-dimension pivot
- `thought` and `insight` iterations excluded from stuck count and rolling average

### sk-deep-review v1.2.0.0 Contract Highlights

- Same frozen STOP_REASONS enum + review-specific legal-stop gates (convergence, dimension coverage, P0 resolution, evidence density, hotspot saturation)
- Dimension coverage gate severity raised from `warning` to **blocking**
- New `scripts/reduce-state.cjs` (written this session): review-specific reducer with finding lifecycle (firstSeen/lastSeen/transitions), repeated-finding detection, idempotent output
- New `scripts/runtime-capabilities.cjs` + `assets/runtime_capabilities.json` for runtime resolution parity with sk-deep-research
- `graphEvents` field on review JSONL records
- `step_reduce_review_state` in both auto + confirm YAML workflows now invokes `node .opencode/skill/sk-deep-review/scripts/reduce-state.cjs {spec_folder}`

### sk-improve-agent v1.1.0.0 Contract Highlights

- Renamed from `sk-agent-improver`
- 5 new CJS modules: `improvement-journal.cjs`, `mutation-coverage.cjs`, `trade-off-detector.cjs`, `candidate-lineage.cjs`, `benchmark-stability.cjs`
- Frozen `STOP_REASONS` + `SESSION_OUTCOMES` enums (`convergedImprovement`, `benchmarkPlateau`, `rejectCandidate`, `blockedStop`, `maxIterationsReached`, `rollbackTriggered`, `manualStop`, `error`)
- Orchestrator-only journal emission (proposal-only agent constraint preserved)
- Mutation coverage graph uses `loop_type: "improvement"` namespace (shared SQLite store)
- Pareto-aware trade-off detection, benchmark stability coefficient `1 - (stddev / mean)`
- `scoreDynamic()` accepts `weights` override for per-profile tuning
- 7 new runtime-truth playbook scenarios + 5 new vitest suites

### Coverage Graph Module Inventory (shared across loops)

CJS (scripts/lib):
- `.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-core.cjs` (edge manager, relation weights)
- `.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-signals.cjs` (degree, depth, momentum)
- `.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-contradictions.cjs` (contradiction scanning)
- `.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs` (STOP-blocking guards)

TypeScript (mcp_server/handlers + lib):
- `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts` (SQLite schema, CRUD)
- `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts` (query layer)
- `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts` (signal computation)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/status.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts`

### Early Signal on Graph Integration

- `convergence.md` in both sk-deep-research and sk-deep-review references "graph" only 4 times each → suggests light wiring.
- Only `sk-deep-review/references/state_format.md` additionally mentions graph events in its state schema; `sk-deep-research/references/state_format.md` does not.
- This is evidence to investigate in D5, not a pre-formed conclusion.

### Prior Deep-Review Closure

- 10-iteration `/spec_kit:deep-review` passes were run against each phase (001–006) and all findings closed before this research begins.
- Most recent review result: `/spec_kit:deep-review` CONDITIONAL verdict closed at `460c243a8` — "vitest infrastructure fixed — 373 tests pass".
- Current full vitest suite: **10,335 passing, 0 failing** (confirmed this session after fixing nested-changelog, architecture-boundary-enforcement, and deep-review-reducer-schema tests).

### Related Spec Folders (do not re-research, just reference)

- `042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation`
- `042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph`
- `042-sk-deep-research-review-improvement-2/003-wave-executor` (deferred in 042, partial implementation)
- `042-sk-deep-research-review-improvement-2/004-offline-loop-optimizer` (Phase 4a shipped, Phase 4b deferred)
- `042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment`
- `042-sk-deep-research-review-improvement-2/006-graph-testing-and-playbook-alignment`
- `042-sk-deep-research-review-improvement-2/007-skill-rename-improve-agent-prompt`

---

<!-- /ANCHOR:known-context -->
<!-- ANCHOR:research-boundaries -->
## 13. RESEARCH BOUNDARIES

- Max iterations: 20
- Convergence threshold: 0.05 (composite gate is the real stop signal)
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true (default)
- `research/research.md` ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart`, `fork`, `completed-continue`
- Machine-owned sections: reducer controls sections 3, 6, 7–11
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.opencode/skill/sk-deep-research/assets/runtime_capabilities.json`
- Capability matrix doc: `.opencode/skill/sk-deep-research/references/capability_matrix.md`
- Capability resolver: `.opencode/skill/sk-deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 1
- Started: 2026-04-11T08:02:52Z
- Per-iteration engine: **Codex CLI GPT-5.4 high fast mode** — `codex exec --model gpt-5.4 -c model_reasoning_effort="high" -c service_tier="fast" -c approval_policy=never --sandbox workspace-write`
<!-- /ANCHOR:research-boundaries -->
