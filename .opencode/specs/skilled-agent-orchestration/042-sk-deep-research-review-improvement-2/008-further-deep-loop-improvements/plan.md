---
title: "Plan: Further Deep-Loop Improvements [008]"
description: "Four-pass execution plan covering contract truth, graph wiring, reducer surfacing, and fixtures & regression — landing 12 P0/P1/P2 recommendations surfaced by the 20-iteration deep-research audit."
trigger_phrases:
  - "008"
  - "phase 8 plan"
  - "contract truth pass"
  - "graph wiring pass"
  - "reducer surfacing pass"
importance_tier: "critical"
contextType: "planning"
---

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_ADDENDUM: Phase - Child Header -->

# Implementation Plan: Further Deep-Loop Improvements [008]

| Field | Value |
|-------|-------|
| **Parent Spec** | ../spec.md |
| **Spec** | ./spec.md |
| **Tasks** | ./tasks.md |
| **Decision Record** | ./decision-record.md |

---

## 1. SUMMARY

### Technical Context

Phase 008 closes the 12 P0/P1/P2 recommendations from `research/research.md` (synthesized from 20 Codex-driven iterations, 108 findings, 48 evidence-mapped entries). The work is split into **four sequential passes** that mirror the recommendation families: contract truth → graph wiring → reducer surfacing → fixtures.

The phase is **Level 3** because it touches 3 skills, 2 shared infrastructure layers (CJS helper + MCP handler), 6 YAML workflows, 3 command docs, 3 agent-mirror sets, and introduces new fixture + vitest coverage. Two architectural decisions (ADR-001 canonical graph regime, ADR-002 improve-agent replay strategy) are documented in `decision-record.md` before code changes begin.

### Overview

| Pass | Goal | Primary Outputs | REQs Covered |
|------|------|-----------------|--------------|
| **A** | Contract truth | Normalized stop events + journal wiring + sample-size gates | REQ-001..007 |
| **B** | Graph wiring | Canonical graph regime + live graph calls + session scoping + tool parity | REQ-008..013 |
| **C** | Reducer surfacing | Blocked-stop promotion + fail-closed handling + replay decision + dashboard refinements | REQ-014..019 |
| **D** | Fixtures & regression | Three durable fixtures + two new vitest suites + playbook scenarios | REQ-020..025 |

Passes are sequential by dependency — A produces the events that C consumes, B requires the ADR-001 decision to lock graph semantics before C promotes graph state into reducers, and D validates all prior passes via fixtures. Within each pass, tasks are parallelizable where file ownership is disjoint.

---

## 2. QUALITY GATES

### Definition of Ready

- `research/research.md` read and understood; 48-entry finding-to-iteration map available for traceability.
- `research/findings-registry.json` confirmed at 108 findings, 16/17 questions resolved.
- ADR-001 (canonical graph-convergence regime) drafted in `decision-record.md` with chosen option and rationale.
- ADR-002 (improve-agent replay strategy) drafted in `decision-record.md` with chosen option.
- Vitest infrastructure green at phase start (10,335+ tests passing).
- Git worktree clean of unrelated in-flight work on `system-speckit/026-graph-and-context-optimization` branch, or new feature branch created.

### Definition of Done

- All 25 requirements (REQ-001 through REQ-025) satisfied.
- All 3 P0 + 5 P1 + 4 P2 recommendations from `research/research.md` shipped.
- `checklist.md` items all `[x]` with evidence citations.
- Vitest suite green, including new `graph-aware-stop.vitest.ts` and `session-isolation.vitest.ts` suites.
- Manual playbook scenarios for graph integration / blocked-stop / insufficient-sample all PASS against the updated runtime.
- SKILL.md version bumps committed (sk-deep-research 1.5.0.0 → 1.6.0.0, sk-deep-review 1.2.0.0 → 1.3.0.0, sk-improve-agent 1.1.0.0 → 1.2.0.0).
- Changelogs written in `.opencode/changelog/12--sk-deep-research/`, `13--sk-deep-review/`, `15--sk-improve-agent/`.
- Closing `/spec_kit:deep-review` run on the phase produces zero P0 and zero P1 findings.
- `implementation-summary.md` filled with build story, verification results, and ADR outcomes.

---

## 3. IMPLEMENTATION PLAN

### Part A — Contract Truth (REQ-001 through REQ-007)

**Goal**: Make the published stop/journal contracts executable on the visible workflow path. This is the precondition for everything downstream: if the events don't reach JSONL in the right shape, the reducers can't surface them.

**Key files**:
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_{auto,confirm}.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_{auto,confirm}.yaml`
- `.opencode/command/improve/assets/improve_agent-improver_{auto,confirm}.yaml`
- `.opencode/command/improve/agent.md` (CLI example fix)
- `.opencode/skill/sk-improve-agent/scripts/trade-off-detector.cjs`
- `.opencode/skill/sk-improve-agent/scripts/benchmark-stability.cjs`
- Associated vitest suites in `scripts/tests/`

**Approach**:
1. Add `step_emit_blocked_stop` in both deep-research auto/confirm YAMLs after the legal-stop decision tree. The step appends a JSONL line with `{type: "event", event: "blocked_stop", blockedBy: [...], gateResults: {...}, recoveryStrategy: "..."}`. Same for deep-review with review-specific gate names.
2. Add `step_normalize_pause_events` that rewrites raw `paused` / `stuck_recovery` events into frozen enum values (`userPaused` / `stuckRecovery`) during the emit phase, not reducer-side.
3. Add `step_emit_journal_event` to both improve-agent YAMLs wrapping `node .opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs --emit <eventType> --payload <json>`. Invoked at session_start, every iteration boundary, and session_end.
4. Edit `.opencode/command/improve/agent.md` to replace the malformed `--event=session_initialized` example with the working `--emit session_start` form. Verify by running the example as-written.
5. Add `minDataPoints` config field (default: 3) to `trade-off-detector.cjs`. When below threshold, return `{state: "insufficientData", dataPoints: n}` instead of a trade-off verdict. Update `tests/trade-off-detector.vitest.ts` to lock the new behavior and drop any tests that asserted 2-point trade-off triggering.
6. Add `minReplayCount` config field (default: 3) to `benchmark-stability.cjs`. When below threshold, return `{state: "insufficientSample", replayCount: n}`. Update `tests/benchmark-stability.vitest.ts` equivalently.
7. Pipeline the `insufficientData` / `insufficientSample` states through `sk-improve-agent/scripts/reduce-state.cjs` into the findings registry so downstream surfacing (Part C) has the data.

**Parallelizable groups**:
- A.1 (deep-research YAML + reducer wiring for stop events)
- A.2 (deep-review YAML + reducer wiring for stop events) — no shared files with A.1
- A.3 (improve-agent YAML + command doc + journal wiring) — no shared files
- A.4 (sample-size gates on two improve-agent scripts + tests) — can run parallel to A.3 after journal helper stable

**Exit criteria**:
- Hand-constructed JSONL record with `blocked_stop` event survives a reducer pass for both research and review.
- `node .opencode/command/improve/assets/improve_agent-improver_auto.yaml` CLI example, copy-pasted from command doc, executes without error.
- `trade-off-detector.cjs` with 2 data points returns `{state: "insufficientData"}`.
- `benchmark-stability.cjs` with 1 replay returns `{state: "insufficientSample"}`.

---

### Part B — Graph Wiring (REQ-008 through REQ-013)

**Goal**: Make the coverage graph actively and smartly utilized by the live loops. This is the phase's decisive architectural workstream and the user's explicit success criterion.

**Blocking decision**: ADR-001 MUST be finalized in `decision-record.md` before any code in Part B is written. The decision determines which file becomes the canonical stop contract and which becomes the adapter.

**Key files**:
- `.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`
- `.opencode/command/spec_kit/deep-research.md`, `deep-review.md` (tool budgets)
- `.opencode/agent/deep-research.md`, `deep-review.md` (tool budgets)
- Mirror agent files in `.claude/agents/`, `.codex/agents/`, `.gemini/agents/`

**Approach**:
1. **Decision (ADR-001)**: Default recommendation is the **MCP handler** as canonical because it already exposes session-scoping hooks and computes the broader signal set (contradictionDensity, claimVerificationRate, sourceDiversity, evidenceDepth). The CJS helper becomes a thin adapter that delegates to the MCP handler's output schema.
2. Harmonize `sourceDiversity`: implement the canonical definition once in the chosen authoritative file; the other file imports / wraps it. Add a cross-file contract test (`scripts/tests/graph-convergence-parity.vitest.ts`) that asserts both paths return identical `sourceDiversity` for a fixture input.
3. Wire `deep_loop_graph_upsert` into the iteration step of both deep-research and deep-review auto YAMLs. Called after iteration file write, before reducer refresh, persisting the iteration's `graphEvents` array into the SQLite store.
4. Wire `deep_loop_graph_convergence` into the stop-check step. The stop decision consults both the inline 3-signal vote AND the graph convergence output; STOP is blocked if EITHER side says block. Document the combined rule in `convergence.md`.
5. Update `sk-deep-research/scripts/reduce-state.cjs` to read the graph convergence output via the MCP handler (or via the canonical helper per ADR-001) and expose `graphConvergenceScore` as a new field in the findings registry. Same for `sk-deep-review/scripts/reduce-state.cjs`.
6. Provision `code_graph_query` and `code_graph_context` in the LEAF-tool budgets of `deep-research.md` and `deep-review.md` command docs. Update runtime agent mirrors accordingly. Matching `system-spec-kit/mcp_server` exposure of these tools must be confirmed; if they're not registered at the MCP layer, add the handlers or remove the tool-routing claims from agent prose.
7. Refactor `coverage-graph/convergence.ts` and `coverage-graph-query.ts` to scope reads by `specFolder + loopType + sessionId`. Add `sessionId` as a required query argument. Update all callers.
8. Add `step_graph_preflight` to both auto YAMLs (optional, gated behind a config flag) that issues a `deep_loop_graph_status` call before iteration and warns if the graph is stale beyond a threshold.

**Parallelizable groups**:
- B.1 (decision-record + graph harmonization) — MUST come first
- B.2 (YAML wiring for research) + B.3 (YAML wiring for review) — parallel after B.1
- B.4 (session scoping in shared reads) — parallel with B.2/B.3
- B.5 (tool budget provisioning + mirror sync) — parallel with B.2/B.3

**Exit criteria**:
- ADR-001 committed with chosen regime and rationale.
- `graph-convergence-parity.vitest.ts` passes, proving both paths agree on `sourceDiversity`.
- A test research iteration emits `graphEvents`, the upsert call persists them, and a subsequent convergence check returns a non-empty graph score.
- A test review iteration blocks STOP because the graph convergence output reports a contradiction, proving the live path actually consults graph state.
- `code_graph_query` appears in both the agent doc AND the command doc budget (or is removed from both).
- `session-isolation.vitest.ts` passes.

---

### Part C — Reducer Surfacing (REQ-014 through REQ-019)

**Goal**: Make the evidence from Parts A and B visible in the reducer-owned surfaces operators actually read (registry, dashboard, strategy anchors).

**Key files**:
- `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs`
- `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs`
- `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs`
- Associated schema docs in `references/state_format.md` for each skill
- Existing vitest suites for each reducer

**Approach**:
1. **Blocked-stop promotion**: In both research and review reducers, parse `blocked_stop` events from JSONL and write a `blockedStopHistory` array into `findings-registry.json`. Render the latest blocked-stop in the dashboard `Next Focus` or a new `Blocked Stop` section. Surface `recoveryStrategy` in the strategy `Next Focus` anchor when blocked-stop is the current state.
2. **Review fail-closed**: In `sk-deep-review/scripts/reduce-state.cjs`, change `parseJsonl()` to collect malformed lines into a `corruptionWarnings` array instead of silently skipping. Emit warnings on stderr. Exit non-zero if corruption count > 0 unless `--lenient` flag is passed.
3. **Review anchor explicit failure**: Change `replaceAnchorSection()` to throw when the anchor is missing instead of returning the content unchanged. Add a `--create-missing-anchors` escape hatch for bootstrap scenarios.
4. **ADR-002 implementation**: If ADR-002 chooses "implement replay consumers", extend `sk-improve-agent/scripts/reduce-state.cjs` to read `improvement-journal.jsonl`, `candidate-lineage.json`, and `mutation-coverage.json` during each refresh pass. Expose their key state in registry + dashboard. If ADR-002 chooses "downgrade docs", update SKILL.md and command docs instead.
5. **Repeated findings split**: Replace `repeatedFindings` with two arrays: `persistentSameSeverity` (findings seen in ≥2 iterations with no severity transition) and `severityChanged` (findings with ≥1 severity transition). Dashboard renders both tables.
6. **Improve-agent dashboard fields**: Add `replayCount`, `stabilityCoefficient`, `insufficientSample`, `insufficientData` as first-class dashboard fields. Render them in a new `Sample Quality` section separate from benchmark failure counters.
7. Update `state_format.md` for each skill to document the new fields, new JSONL event types, and the fail-closed semantics.

**Parallelizable groups**:
- C.1 (research reducer) + C.2 (review reducer) + C.3 (improve-agent reducer) — no shared files
- C.4 (state_format.md docs) — after C.1/C.2/C.3 merge

**Exit criteria**:
- A blocked-stop JSONL event from Part A produces a populated `blockedStopHistory` in findings-registry.json and a visible Blocked Stop section in the dashboard.
- Malformed JSONL in a review packet produces a non-zero reducer exit code and a populated `corruptionWarnings` array.
- Missing machine-owned anchor in a review strategy causes the reducer to throw with a descriptive error.
- Improve-agent reducer either reads the journal or the docs are downgraded (per ADR-002 choice), and the dashboard shows distinct insufficient-sample states.

---

### Part D — Fixtures and Regression (REQ-020 through REQ-025)

**Goal**: Make future audits testable against the visible path instead of proving absence by omission. Every P0/P1 gap uncovered in `research/research.md` must have a regression test in this phase.

**Key files**:
- `.opencode/skill/sk-deep-research/scripts/tests/fixtures/interrupted-session/`
- `.opencode/skill/sk-deep-review/scripts/tests/fixtures/blocked-stop-session/`
- `.opencode/skill/sk-improve-agent/scripts/tests/fixtures/low-sample-benchmark/`
- `.opencode/skill/system-spec-kit/scripts/tests/graph-aware-stop.vitest.ts` (new)
- `.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts` (new)
- Manual testing playbook entries across all 3 skills

**Approach**:
1. Hand-author fixture packets representing the three scenarios. Each fixture contains the minimum files needed to exercise the target reducer / gate / graph path.
2. Write `graph-aware-stop.vitest.ts` that seeds the coverage graph with a contradiction, runs a mock iteration, and asserts the stop check returns `blocked`. This test MUST fail if Part B graph wiring is not active.
3. Write `session-isolation.vitest.ts` that creates two research sessions in the same spec folder and asserts that each sees only its own nodes via the refactored read helpers.
4. Update the existing `deep-research-reducer.vitest.ts` and `deep-review-reducer-schema.vitest.ts` with cases exercising the new `blockedStopHistory` field and fail-closed behavior.
5. Add manual playbook scenarios under `03--iteration-execution-and-state-discipline/` (graph upsert emission) and `04--convergence-and-recovery/` (blocked-stop surfacing, graph-aware stop gate). For improve-agent, add scenarios under `07--runtime-truth/` for journal wiring, insufficient-sample handling, and replay consumer verification.
6. Run every new playbook scenario end-to-end against the updated runtime and record PASS evidence.

**Parallelizable groups**:
- D.1 (three fixtures) — disjoint, fully parallel
- D.2 (two new vitest suites) — parallel after fixtures exist
- D.3 (playbook scenarios) — parallel with D.2

**Exit criteria**:
- All three fixtures load cleanly via their respective reducer.
- `graph-aware-stop.vitest.ts` and `session-isolation.vitest.ts` both pass.
- Every new playbook scenario runs to PASS against the updated runtime.
- Full vitest suite stays green (10,335+ → 10,340+).

---

## 4. RISKS

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| ADR-001 wrong choice locks us into the weaker regime | Medium | Prototype both paths against a fixture before finalizing ADR. Escape hatch: the adapter pattern means the non-canonical file can still accept its historical callers. |
| Graph wiring (Part B) causes iteration latency > 500ms | Medium | Benchmark each graph call with `hrtime`. If over budget, move the call to an async fire-and-forget that the reducer picks up later. |
| ADR-002 "implement replay consumers" path is larger than expected | Medium | Timebox the implementation to 1 day of work. If it overruns, flip to the "downgrade docs" path per the decision-record contingency clause. |
| Fail-closed review reducer (REQ-015, REQ-016) breaks existing in-flight review packets | High | Add a `--lenient` escape hatch that preserves v1.2.0.0 fail-open behavior. Ship a migration note in the changelog. |
| New fixtures drift from real workflow output over time | Low | Generate fixtures from real packet snapshots rather than hand-authoring where possible. Document regeneration steps. |
| Playbook scenarios produce false positives under Codex CLI variability | Low | Keep scenarios deterministic (no LLM-dependent assertions); every check is a grep or structural test. |
| Cross-session graph reads surface latent bugs in the SQLite schema | Medium | Session-scoped reads ship with a migration script that backfills missing `sessionId` values with `"legacy"` before REQ-012 enforcement kicks in. |
| Vitest infra regresses during the phase | Low | Rebaseline at phase start; commit reducer changes incrementally with tests alongside. |

---

## 5. TIMELINE

Rough estimate, bounded by task parallelism:

| Pass | Agents / Engineer-days | Gating dependencies |
|------|------------------------|---------------------|
| A | 2 days | None |
| B | 3 days | ADR-001 decision (0.5 day) |
| C | 2 days | Part A JSONL events landed |
| D | 1 day | Parts A/B/C merged |

**Total**: ~8 engineer-days with ≤3 parallel agents per pass. Can compress to ~5 calendar days if Codex CLI GPT-5.4 high fast is used for ~60% of task execution as in the prior 042 passes.

---

## 6. ROLLBACK STRATEGY

- Each pass is a separate commit boundary. Reverting a whole pass is `git revert <commit-range>`.
- The `--lenient` flag on the review reducer acts as a per-session escape hatch without code revert.
- ADR-001 and ADR-002 both have documented contingency options so the decision can flip without re-architecting.
- New JSONL event types are additive — dropping them from the YAML produces the v1.5.0.0 / v1.2.0.0 / v1.1.0.0 behavior without reducer changes.
