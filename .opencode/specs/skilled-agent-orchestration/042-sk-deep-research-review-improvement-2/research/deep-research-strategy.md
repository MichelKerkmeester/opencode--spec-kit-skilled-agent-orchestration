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
- [ ] D1: Are there convergence signals that should exist but currently don't (e.g., citation density, source diversity, contradiction frequency)?
- [ ] D2: How effective is the legal-stop gate bundle in sk-deep-review v1.2.0.0 under real review sessions, and where do dimension coverage gates still allow drift?
- [ ] D2: Does the new `scripts/reduce-state.cjs` correctly handle partial-failure iterations, severity transitions, and finding deduplication at scale (50+ findings)?
- [ ] D3: How fault-tolerant is the orchestrator-only journal emission in sk-improve-agent v1.1.0.0 when a candidate session is interrupted mid-flight?
- [ ] D3: Does the trade-off detector produce false positives on small benchmark samples, and does benchmark-stability gating compensate?
- [ ] D3: Is the mutation coverage graph namespace (`loop_type: "improvement"`) properly isolated from the deep-research/deep-review namespaces in the shared SQLite store?
- [x] D4: Do the loops emit the full `STOP_REASONS` enum in practice, or are any values (`blockedStop`, `stuckRecovery`, `userPaused`) effectively dead code?
- [x] D4: Do blocked-stop events always persist `gateResults` with the complete set of review-specific or research-specific gates, or are gates silently dropped?
- [x] D4: Are resume flows (`resume`, `restart`, `fork`, `completed-continue`) actually exercised by the YAML workflows, or only documented?
- [ ] D4: Do the reducers ever write outside their declared machine-owned anchors, violating the contract?
- [x] D5: Does any loop phase (init / iteration / convergence / synthesis) actively READ from the coverage graph (`coverage-graph-query.ts`, `coverage-graph-convergence.cjs`) to inform decisions, or only WRITE to it?
- [x] D5: Is the `graphEvents` JSONL field consumed by the reducer or downstream tools, or is it write-only?
- [ ] D5: Do convergence gates consult `coverage-graph-contradictions.cjs` to block STOP on contradictions, or only consult ratio-based signals?
- [ ] D5: Does the coverage graph's contribution to the 3-signal convergence math exceed its weight, or is it merely nominal?
- [ ] D5: Are there missing MCP tool calls (e.g., `code_graph_query` for semantic neighbors) that the loops should be making but aren't?

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
- D4: Do the loops emit the full `STOP_REASONS` enum in practice, or are any values (`blockedStop`, `stuckRecovery`, `userPaused`) effectively dead code?
- D4: Do blocked-stop events always persist `gateResults` with the complete set of review-specific or research-specific gates, or are gates silently dropped?
- D4: Are resume flows (`resume`, `restart`, `fork`, `completed-continue`) actually exercised by the YAML workflows, or only documented?
- D5: Does any loop phase (init / iteration / convergence / synthesis) actively READ from the coverage graph (`coverage-graph-query.ts`, `coverage-graph-convergence.cjs`) to inform decisions, or only WRITE to it?
- D5: Is the `graphEvents` JSONL field consumed by the reducer or downstream tools, or is it write-only?

<!-- /ANCHOR:answered-questions -->
<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Reading the reducer before broader docs worked because the state rollup code immediately exposed which JSONL fields and lifecycle events are actually consumed. (iteration 1)
- Comparing the loop workflow surfaces against the shared convergence handler made the missing runtime bridge visible quickly. (iteration 2)
- Comparing live reducer imports and search hits against the documented bridge contract made the missing runtime handoff explicit very quickly. (iteration 3)
- Comparing the auto YAML branches against the reducer ingestion rules made it easy to separate control-flow promises from persisted runtime evidence. (iteration 4)
- Tracing the contract tables directly against the live auto YAML append points made it easy to distinguish raw event labels from truly promoted shared stop reasons. (iteration 5)

<!-- /ANCHOR:what-worked -->
<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- The first asset-path sweep mixed real and nonexistent filenames, which created noise until I narrowed to the actual auto/confirm YAML files. (iteration 1)
- Broad repository grep added noise from specs and playbooks before I narrowed to active runtime files. (iteration 2)
- Repo-wide symbol search still surfaced older packet/spec artifacts, so I had to keep separating "promised by 042 docs" from "called by active runtime code." (iteration 3)
- Contract terminology is more detailed than the live YAML outputs, so I had to keep checking whether a documented event was actually serialized or merely described. (iteration 4)
- The reducer files barely mention stop reasons explicitly, so proving the consumer gap required reading dashboard/render paths rather than relying on symbol search alone. (iteration 5)

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

### `stuckRecovery` is not entirely absent from runtime serialization, but the only concrete live record I found is review's raw `stuck_recovery` event; that is weaker than the documented shared enum contract and does not prove consumer-visible normalization (.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:375-383). -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `stuckRecovery` is not entirely absent from runtime serialization, but the only concrete live record I found is review's raw `stuck_recovery` event; that is weaker than the documented shared enum contract and does not prove consumer-visible normalization (.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:375-383).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `stuckRecovery` is not entirely absent from runtime serialization, but the only concrete live record I found is review's raw `stuck_recovery` event; that is weaker than the documented shared enum contract and does not prove consumer-visible normalization (.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:375-383).

### I did not inspect confirm-mode YAMLs in this pass because the active auto workflows plus reducer consumers were already sufficient to determine whether the shared stop-reason enum is promoted into persisted state. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: I did not inspect confirm-mode YAMLs in this pass because the active auto workflows plus reducer consumers were already sufficient to determine whether the shared stop-reason enum is promoted into persisted state.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: I did not inspect confirm-mode YAMLs in this pass because the active auto workflows plus reducer consumers were already sufficient to determine whether the shared stop-reason enum is promoted into persisted state.

### I did not inspect confirm-mode YAMLs in this pass because the strategy focus was the normal runtime path, and the auto workflows plus reducers were enough to establish the serialization gap. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: I did not inspect confirm-mode YAMLs in this pass because the strategy focus was the normal runtime path, and the auto workflows plus reducers were enough to establish the serialization gap.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: I did not inspect confirm-mode YAMLs in this pass because the strategy focus was the normal runtime path, and the auto workflows plus reducers were enough to establish the serialization gap.

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

### The graph layer is not purely nominal overall; the shared MCP convergence handler can block STOP on graph-derived coverage gaps, contradictions, unverified claims, source diversity, and evidence depth when it is actually invoked (.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:122-163; .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:225-275; .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:330-355). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: The graph layer is not purely nominal overall; the shared MCP convergence handler can block STOP on graph-derived coverage gaps, contradictions, unverified claims, source diversity, and evidence depth when it is actually invoked (.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:122-163; .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:225-275; .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:330-355).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The graph layer is not purely nominal overall; the shared MCP convergence handler can block STOP on graph-derived coverage gaps, contradictions, unverified claims, source diversity, and evidence depth when it is actually invoked (.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:122-163; .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:225-275; .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:330-355).

### The shared graph capability itself is not missing; the missing piece is runtime wiring. The MCP tool layer already exposes both `deep_loop_graph_upsert` and `deep_loop_graph_convergence` with reducer-oriented contracts (.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:779-823; .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:856-869). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: The shared graph capability itself is not missing; the missing piece is runtime wiring. The MCP tool layer already exposes both `deep_loop_graph_upsert` and `deep_loop_graph_convergence` with reducer-oriented contracts (.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:779-823; .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:856-869).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The shared graph capability itself is not missing; the missing piece is runtime wiring. The MCP tool layer already exposes both `deep_loop_graph_upsert` and `deep_loop_graph_convergence` with reducer-oriented contracts (.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:779-823; .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:856-869).

### This is not a documentation-gap false alarm: both convergence references already define the shared enum, the legacy-label normalization rules, and the required blocked-stop persistence shape in detail (.opencode/skill/sk-deep-research/references/convergence.md:21-31; .opencode/skill/sk-deep-review/references/convergence.md:44-56). -- BLOCKED (iteration 5, 1 attempts)
- What was tried: This is not a documentation-gap false alarm: both convergence references already define the shared enum, the legacy-label normalization rules, and the required blocked-stop persistence shape in detail (.opencode/skill/sk-deep-research/references/convergence.md:21-31; .opencode/skill/sk-deep-review/references/convergence.md:44-56).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: This is not a documentation-gap false alarm: both convergence references already define the shared enum, the legacy-label normalization rules, and the required blocked-stop persistence shape in detail (.opencode/skill/sk-deep-research/references/convergence.md:21-31; .opencode/skill/sk-deep-review/references/convergence.md:44-56).

### This is not isolated to one loop. The research and review auto YAMLs both classify the same lineage branches while only surfacing a smaller event set in the active runtime path (`.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:128-153`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:155-177`). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: This is not isolated to one loop. The research and review auto YAMLs both classify the same lineage branches while only surfacing a smaller event set in the active runtime path (`.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:128-153`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:155-177`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: This is not isolated to one loop. The research and review auto YAMLs both classify the same lineage branches while only surfacing a smaller event set in the active runtime path (`.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:128-153`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:155-177`).

### This is not just a documentation omission. Both convergence references are explicit about first-class blocked-stop persistence and full gate bundles, so the drift is between published contract and live workflow serialization, not between two equally vague docs (`.opencode/skill/sk-deep-research/references/convergence.md:305-309`, `.opencode/skill/sk-deep-review/references/convergence.md:58-85`). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: This is not just a documentation omission. Both convergence references are explicit about first-class blocked-stop persistence and full gate bundles, so the drift is between published contract and live workflow serialization, not between two equally vague docs (`.opencode/skill/sk-deep-research/references/convergence.md:305-309`, `.opencode/skill/sk-deep-review/references/convergence.md:58-85`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: This is not just a documentation omission. Both convergence references are explicit about first-class blocked-stop persistence and full gate bundles, so the drift is between published contract and live workflow serialization, not between two equally vague docs (`.opencode/skill/sk-deep-research/references/convergence.md:305-309`, `.opencode/skill/sk-deep-review/references/convergence.md:58-85`).

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

<!-- /ANCHOR:ruled-out-directions -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Rotate to D5 and trace whether contradiction-aware convergence is live or still mostly contractual. The next productive pass is to follow the active runtime path from deep-research/deep-review YAML convergence steps into any shared convergence helpers and verify whether `coverage-graph-contradictions.cjs` or the MCP convergence handler is actually consulted before STOP, or whether contradiction blocking still depends on graph wiring that the current workflows never invoke.

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
