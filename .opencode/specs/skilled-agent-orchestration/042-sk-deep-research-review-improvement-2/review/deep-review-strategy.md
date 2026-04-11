---
title: Deep Review Strategy — 042 Bundle Closing Audit
description: 10-iteration Codex-driven deep review of the entire 042 Deep Research & Review Runtime Improvement Bundle. Covers all 8 phase folders, spec docs, and shipped runtime code.
---

# Deep Review Strategy — 042 Closing Audit (session rvw-2026-04-11T13-50-06Z)

Persistent brain for the 10-iteration deep review. Read by orchestrator and every Codex iteration.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Closing quality audit of the entire 042 packet after phase 008 shipped. All 12 P0/P1/P2 research recommendations and the 4 P1 closing-audit findings are reportedly closed; this session verifies that claim across 4 dimensions (correctness, security, traceability, maintainability) and surfaces any residual risks before the bundle is handed off for production use.

### Usage

- **Init:** Orchestrator populated Topic, Review Dimensions, Known Context, and Review Boundaries from config + in-session knowledge of 042.
- **Per iteration:** Codex CLI GPT-5.4 high fast mode substitutes for the native `@deep-review` agent. Each iteration reads Next Focus, selects one dimension + target subset, writes iteration-NNN.md with structured P0/P1/P2 findings, appends a JSONL record, and the reducer refreshes machine-owned anchors.
- **Mutability:** Shared mutable state. Human context sections stable; machine-owned sections rewritten each iteration.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:topic -->
## 2. TOPIC

Deep review of the entire 042 Deep Research & Review Runtime Improvement Bundle: spec + all 8 phase folders (001-runtime-truth-foundation through 008-further-deep-loop-improvements), shipped in 35+ commits to `system-speckit/026-graph-and-context-optimization`. Verify correctness, security, traceability, maintainability across the whole bundle.

---

<!-- /ANCHOR:topic -->
<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
<!-- ANCHOR:non-goals -->
## 4. COMPLETED DIMENSIONS
[None yet]

---

<!-- /ANCHOR:non-goals -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 6
- P2 (Suggestions): 3
- Resolved: 0

<!-- /ANCHOR:running-findings -->
<!-- ANCHOR:stop-conditions -->
## 6. STOP CONDITIONS

- All 4 dimensions covered AND active P0 == 0 AND active P1 count below severityThreshold OR
- `newFindingsRatio` stays below 0.10 for 2 consecutive iterations (convergence), OR
- 10 iterations reached (hard cap), OR
- 2 consecutive stuck iterations with no recovery

---

<!-- /ANCHOR:stop-conditions -->
<!-- ANCHOR:answered-questions -->
## 7. ANSWERED QUESTIONS

[None yet — populated as review dimensions are closed]

---

<!-- /ANCHOR:answered-questions -->
<!-- ANCHOR:what-worked -->
## 8. WHAT WORKED

[None yet]

---

<!-- /ANCHOR:what-worked -->
<!-- ANCHOR:what-failed -->
## 9. EXHAUSTED APPROACHES (do not retry)
[No exhausted approach categories yet]

---

<!-- /ANCHOR:what-failed -->
<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Blocked-stop field promotion: No new issue. The persisted blocked-stop contract still matches between the state-format reference and the confirm workflow — `.opencode/skill/sk-deep-review/references/state_format.md:233-289` and `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:476-479` -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Blocked-stop field promotion: No new issue. The persisted blocked-stop contract still matches between the state-format reference and the confirm workflow — `.opencode/skill/sk-deep-review/references/state_format.md:233-289` and `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:476-479`
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Blocked-stop field promotion: No new issue. The persisted blocked-stop contract still matches between the state-format reference and the confirm workflow — `.opencode/skill/sk-deep-review/references/state_format.md:233-289` and `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:476-479`

### Code Graph tool-budget drift on the review path: Not supported by the code — `.opencode/command/spec_kit/deep-review.md:4` and `.opencode/agent/deep-review.md:15-16` both provision `code_graph_query` and `code_graph_context`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Code Graph tool-budget drift on the review path: Not supported by the code — `.opencode/command/spec_kit/deep-review.md:4` and `.opencode/agent/deep-review.md:15-16` both provision `code_graph_query` and `code_graph_context`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Code Graph tool-budget drift on the review path: Not supported by the code — `.opencode/command/spec_kit/deep-review.md:4` and `.opencode/agent/deep-review.md:15-16` both provision `code_graph_query` and `code_graph_context`.

### Confirm-mirror contract drift on blocked-stop and normalized pause/recovery events: confirm YAML and loop-protocol references agree on `blocked_stop`, `userPaused`, `stuckRecovery`, and graph convergence/upsert wiring — `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:375-379`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:476-517`, `.opencode/skill/sk-deep-review/references/loop_protocol.md:172-209`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:273-381`, `.opencode/skill/sk-deep-research/references/loop_protocol.md:121-145` -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Confirm-mirror contract drift on blocked-stop and normalized pause/recovery events: confirm YAML and loop-protocol references agree on `blocked_stop`, `userPaused`, `stuckRecovery`, and graph convergence/upsert wiring — `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:375-379`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:476-517`, `.opencode/skill/sk-deep-review/references/loop_protocol.md:172-209`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:273-381`, `.opencode/skill/sk-deep-research/references/loop_protocol.md:121-145`
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Confirm-mirror contract drift on blocked-stop and normalized pause/recovery events: confirm YAML and loop-protocol references agree on `blocked_stop`, `userPaused`, `stuckRecovery`, and graph convergence/upsert wiring — `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:375-379`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:476-517`, `.opencode/skill/sk-deep-review/references/loop_protocol.md:172-209`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:273-381`, `.opencode/skill/sk-deep-research/references/loop_protocol.md:121-145`

### Coverage-graph score parity: No correctness defect surfaced in this pass because the handler emits a canonical numeric score and the reducer consumes a named score path before falling back to averaging. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Coverage-graph score parity: No correctness defect surfaced in this pass because the handler emits a canonical numeric score and the reducer consumes a named score path before falling back to averaging.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Coverage-graph score parity: No correctness defect surfaced in this pass because the handler emits a canonical numeric score and the reducer consumes a named score path before falling back to averaging.

### Graph upsert missing from the visible review path: Not supported by the code — `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:604` and `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:649` both wire `mcp__spec_kit_memory__deep_loop_graph_upsert`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Graph upsert missing from the visible review path: Not supported by the code — `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:604` and `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:649` both wire `mcp__spec_kit_memory__deep_loop_graph_upsert`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Graph upsert missing from the visible review path: Not supported by the code — `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:604` and `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:649` both wire `mcp__spec_kit_memory__deep_loop_graph_upsert`.

### GraphEvents namespace guidance: This still points back to F006 rather than a distinct new defect, so I did not duplicate it. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: GraphEvents namespace guidance: This still points back to F006 rather than a distinct new defect, so I did not duplicate it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: GraphEvents namespace guidance: This still points back to F006 rather than a distinct new defect, so I did not duplicate it.

### Handler fallback without `sessionId`: The `all_sessions_default` path is explicitly documented bootstrap/debug behavior rather than a hidden bypass — `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts:70`, `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:174`, `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/status.ts:71` -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Handler fallback without `sessionId`: The `all_sessions_default` path is explicitly documented bootstrap/debug behavior rather than a hidden bypass — `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts:70`, `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:174`, `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/status.ts:71`
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Handler fallback without `sessionId`: The `all_sessions_default` path is explicitly documented bootstrap/debug behavior rather than a hidden bypass — `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts:70`, `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:174`, `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/status.ts:71`

### In-memory `coverage-graph-core.cjs` edge auto-ID generation: not on the visible deep-loop write path for this bundle — live research/review graph persistence goes through `deep_loop_graph_upsert` from the confirm/auto YAMLs, not through `insertEdge()` in the in-memory helper. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: In-memory `coverage-graph-core.cjs` edge auto-ID generation: not on the visible deep-loop write path for this bundle — live research/review graph persistence goes through `deep_loop_graph_upsert` from the confirm/auto YAMLs, not through `insertEdge()` in the in-memory helper.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: In-memory `coverage-graph-core.cjs` edge auto-ID generation: not on the visible deep-loop write path for this bundle — live research/review graph persistence goes through `deep_loop_graph_upsert` from the confirm/auto YAMLs, not through `insertEdge()` in the in-memory helper.

### Looking for a second handler-side auth or validation bypass in `mcp_server/handlers/coverage-graph/upsert.ts`: the handler validates `specFolder`, `loopType`, `sessionId`, relation/kind enums, and self-loops, so this pass did not uncover a new security defect there beyond the pre-existing bare-ID storage semantics already captured in F004. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Looking for a second handler-side auth or validation bypass in `mcp_server/handlers/coverage-graph/upsert.ts`: the handler validates `specFolder`, `loopType`, `sessionId`, relation/kind enums, and self-loops, so this pass did not uncover a new security defect there beyond the pre-existing bare-ID storage semantics already captured in F004.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a second handler-side auth or validation bypass in `mcp_server/handlers/coverage-graph/upsert.ts`: the handler validates `specFolder`, `loopType`, `sessionId`, relation/kind enums, and self-loops, so this pass did not uncover a new security defect there beyond the pre-existing bare-ID storage semantics already captured in F004.

### Reducer corruption handling: Both reducers now surface `corruptionWarnings` and exit non-zero unless `--lenient` is passed — `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:888-896`, `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:693-701` -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Reducer corruption handling: Both reducers now surface `corruptionWarnings` and exit non-zero unless `--lenient` is passed — `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:888-896`, `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:693-701`
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reducer corruption handling: Both reducers now surface `corruptionWarnings` and exit non-zero unless `--lenient` is passed — `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:888-896`, `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:693-701`

### Reducer-owned graph/session dashboard fields: No new drift surfaced here because the reducer still exposes `sessionId`, `generation`, `lineageMode`, `graphConvergenceScore`, `graphDecision`, and `graphBlockers` consistently — `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:522-538` and `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:742-805` -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Reducer-owned graph/session dashboard fields: No new drift surfaced here because the reducer still exposes `sessionId`, `generation`, `lineageMode`, `graphConvergenceScore`, `graphDecision`, and `graphBlockers` consistently — `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:522-538` and `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:742-805`
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reducer-owned graph/session dashboard fields: No new drift surfaced here because the reducer still exposes `sessionId`, `generation`, `lineageMode`, `graphConvergenceScore`, `graphDecision`, and `graphBlockers` consistently — `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:522-538` and `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:742-805`

### Resume/restart lineage examples: I found light incompleteness signals, but not enough evidence of a shipped contract break to elevate this pass. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Resume/restart lineage examples: I found light incompleteness signals, but not enough evidence of a shipped contract break to elevate this pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Resume/restart lineage examples: I found light incompleteness signals, but not enough evidence of a shipped contract break to elevate this pass.

<!-- /ANCHOR:exhausted-approaches -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Rotate into the remaining lifecycle/session metadata and completed-continue/reopen mirrors across review and research docs, especially places where resume/restart/fork examples may still lag the persisted JSONL and config contracts.

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:known-context -->
## 12. KNOWN CONTEXT

### 042 Bundle Topology

Spec folder: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/`

Phase folders (all complete):

| Phase | Scope | Ship commit (indicative) |
|---|---|---|
| 001-runtime-truth-foundation | Stop-reason taxonomy, legal-stop gates, blocked-stop persistence, resume semantics, journal/dashboard reducer | early 042 |
| 002-semantic-coverage-graph | SQLite coverage graph: core + signals + contradictions + convergence + query + MCP handlers | mid 042 |
| 003-wave-executor | (Deferred; partial implementation) | — |
| 004-offline-loop-optimizer | Phase 4a: replay corpus, rubric, advisory promotion gate. Phase 4b: deferred | mid 042 |
| 005-agent-improver-deep-loop-alignment | improvement-journal, mutation-coverage, trade-off-detector, candidate-lineage, benchmark-stability | 080cf549eb |
| 006-graph-testing-and-playbook-alignment | 55 integration + stress tests, 7 playbook scenarios, README updates | 680c6de9e5 |
| 007-skill-rename-improve-agent-prompt | sk-agent-improver → sk-improve-agent, sk-prompt-improver → sk-improve-prompt | d3dbf77691 |
| 008-further-deep-loop-improvements | Closes 12 research recommendations: contract truth + graph wiring + reducer surfacing + fixtures + closing audit P1 fixes | d504f19ca through c07c9fbcf |

### Latest Skill Versions (post 008)

- `sk-deep-research`: **1.6.0.0**
- `sk-deep-review`: **1.3.0.0**
- `sk-improve-agent`: **1.2.0.0**

### Key Files to Review (high-risk surface)

**Reducers** (modified in Parts A/B/C and closing audit):
- `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs` (parseJsonlDetailed, reduceResearchState, --lenient flag, buildGraphConvergenceRollup, blockedStopHistory, corruptionWarnings)
- `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs` (parseJsonlDetailed, reduceReviewState, fail-closed anchor handling, persistentSameSeverity + severityChanged split, normalizeBlockedByList, updateStrategyContent P1-03 fix)
- `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs` (ADR-002 replay consumers: journal + lineage + coverage artifacts, Sample Quality dashboard section)

**YAML workflows** (Part A emission + Part B graph wiring + closing audit blockedBy normalization):
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_{auto,confirm}.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_{auto,confirm}.yaml`
- `.opencode/command/improve/assets/improve_agent-improver_{auto,confirm}.yaml`

**Graph infrastructure** (ADR-001 canonical, session scoping, composite score):
- `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/{convergence,query,status,upsert}.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/{coverage-graph-db,coverage-graph-query,coverage-graph-signals}.ts`
- `.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-{core,signals,contradictions,convergence}.cjs`

**Vitest guards** (phase 008 new + phase 006 pre-existing):
- `graph-convergence-parity.vitest.ts` (CJS ↔ MCP signal parity)
- `session-isolation.vitest.ts` (REQ-012 scoping)
- `review-reducer-fail-closed.vitest.ts` (REQ-015, REQ-016)
- `graph-aware-stop.vitest.ts` (REQ-023, plus new handler-shape case closing P1-01)
- `coverage-graph-{convergence,cross-layer,integration,stress}.vitest.ts` (aligned with ADR-001 canonical)

**References** (state_format, loop_protocol, convergence docs):
- `.opencode/skill/sk-deep-research/references/*.md` (state_format, loop_protocol, convergence, quick_reference)
- `.opencode/skill/sk-deep-review/references/*.md`

### Prior Audits

- **20-iteration deep research** (commit `674b70007`): surfaced 12 P0/P1/P2 recommendations, all closed in phase 008
- **Closing deep review (T061)** for phase 008 only (commit `c07c9fbcf`): surfaced 4 P1 findings, all closed
- **Current session**: reviews ALL 8 phases + shipped runtime code, not just phase 008

### Released Vitest State

- **10,350 passing / 0 failing** across 478 test files at session start
- `tsc --noEmit` clean on mcp_server workspace

### Review Out-of-Scope

- Rewriting shipped code — this is a discovery pass
- Re-running the vitest suite — already green at start
- Re-auditing phase 008 P1 findings closed in commit `c07c9fbcf` (treat those as settled unless NEW evidence contradicts the fix)
- Phase 3 (wave executor) deferred scope — not in scope for this audit
- Phase 4b (prompt/meta optimizer) deferred scope — not in scope

---

<!-- /ANCHOR:known-context -->
<!-- ANCHOR:research-boundaries -->
## 13. REVIEW BOUNDARIES

- Max iterations: 10
- Convergence threshold: 0.10
- Per-iteration budget: 15 tool calls, 10 minutes
- Progressive synthesis: false (single final synthesis after convergence)
- Lifecycle modes: new / resume / restart / fork / completed-continue
- Machine-owned sections: reducer controls 3, 4, 5, 9, 10, 11
- Canonical pause sentinel: `review/.deep-review-pause`
- Per-iteration engine: **Codex CLI GPT-5.4 high fast mode** — `codex exec --model gpt-5.4 -c model_reasoning_effort="high" -c service_tier="fast" -c approval_policy=never --sandbox workspace-write`
- Started: 2026-04-11T13:50:06Z
<!-- /ANCHOR:research-boundaries -->

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
