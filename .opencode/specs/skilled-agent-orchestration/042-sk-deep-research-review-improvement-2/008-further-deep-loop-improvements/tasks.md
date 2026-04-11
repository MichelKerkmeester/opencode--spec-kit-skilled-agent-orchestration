---
title: "Tasks: Further Deep-Loop Improvements [008]"
description: "34 tasks across 4 parts (contract truth, graph wiring, reducer surfacing, fixtures) covering all 12 P0/P1/P2 recommendations surfaced by the deep-research audit."
trigger_phrases:
  - "008"
  - "phase 8 tasks"
  - "contract truth tasks"
  - "graph wiring tasks"
importance_tier: "critical"
contextType: "planning"
---

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks: Further Deep-Loop Improvements

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable with other `[P]` tasks in the same part |
| `[B]` | Blocked by an earlier task |
| `[ADR]` | Architectural decision required before execution |

**Task format**: `T### [flags] Description (file path) — REQ-###`
<!-- /ANCHOR:notation -->

---

## Part A — Contract Truth (REQ-001 through REQ-007)

> **Goal**: make the published stop / journal contracts executable on the visible workflow path.

### Stop event normalization (research + review)

- [ ] **T001** [P] Add `step_emit_blocked_stop` after legal-stop evaluation in `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`; append a JSONL line with `{type:"event", event:"blocked_stop", blockedBy, gateResults, recoveryStrategy}`. — REQ-001
- [ ] **T002** [P] Mirror T001 in `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`. — REQ-001
- [ ] **T003** [P] Add `step_normalize_pause_events` in research auto YAML: rewrite raw `{event:"paused"}` → `{event:"userPaused", stopReason:"userPaused"}` at emit time using the frozen `STOP_REASONS` enum; rewrite `{event:"stuck_recovery"}` → `{event:"stuckRecovery", stopReason:"stuckRecovery"}`. — REQ-002
- [ ] **T004** [P] Mirror T003 in research confirm YAML. — REQ-002
- [ ] **T005** [P] Apply the same blocked-stop + normalization steps to `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` with review-specific gate names (`convergenceGate`, `dimensionCoverageGate`, `p0ResolutionGate`, `evidenceDensityGate`, `hotspotSaturationGate`). — REQ-003
- [ ] **T006** [P] Mirror T005 in `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml`. — REQ-003
- [ ] **T007** Update `.opencode/skill/sk-deep-research/references/state_format.md` §3 and `loop_protocol.md` with the new `blocked_stop`, `userPaused`, `stuckRecovery` event schemas. — REQ-001, REQ-002
- [ ] **T008** Update `.opencode/skill/sk-deep-review/references/state_format.md` §3 and `loop_protocol.md` with the equivalent schemas + review-specific gate names. — REQ-003
- [ ] **T009** Update `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs` to NOT filter out `blocked_stop`, `userPaused`, `stuckRecovery` event rows from reducer input (extend `parseJsonl().filter(...)` scope). — REQ-001, REQ-002
- [ ] **T010** Update `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs` equivalently. — REQ-003

### Improve-agent journal wiring

- [ ] **T011** [P] Add `step_emit_journal_event` in `.opencode/command/improve/assets/improve_agent-improver_auto.yaml` at three points: session start, every iteration boundary, session end. Invoke `node .opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs --emit <eventType> --payload <json>`. — REQ-004
- [ ] **T012** [P] Mirror T011 in `.opencode/command/improve/assets/improve_agent-improver_confirm.yaml`. — REQ-004
- [ ] **T013** [P] Fix the malformed CLI example in `.opencode/command/improve/agent.md`: replace `--event=session_initialized` with `--emit session_start --payload '{"sessionId":"...","target":"..."}'`. Verify by running the corrected example end-to-end. — REQ-005
- [ ] **T014** Update `.opencode/skill/sk-improve-agent/SKILL.md` to document the journal wiring contract and the visible event boundaries. — REQ-004, REQ-005

### Sample-size enforcement

- [ ] **T015** [P] Add `minDataPoints` config (default: 3) to `.opencode/skill/sk-improve-agent/scripts/trade-off-detector.cjs`. Below threshold, return `{state:"insufficientData", dataPoints:n}` instead of a trade-off verdict. — REQ-006
- [ ] **T016** [P] Add `minReplayCount` config (default: 3) to `.opencode/skill/sk-improve-agent/scripts/benchmark-stability.cjs`. Below threshold, return `{state:"insufficientSample", replayCount:n}`. — REQ-007
- [ ] **T017** [P] Update `.opencode/skill/sk-improve-agent/scripts/tests/trade-off-detector.vitest.ts` to assert the new `insufficientData` state; remove any tests that asserted 2-point trade-off triggering. — REQ-006
- [ ] **T018** [P] Update `.opencode/skill/sk-improve-agent/scripts/tests/benchmark-stability.vitest.ts` to assert the new `insufficientSample` state; remove 1-sample / 2-sample stability-accepted cases. — REQ-007
- [ ] **T019** Update `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs` to propagate `insufficientData` and `insufficientSample` states from the trade-off detector and stability scorer through to the findings registry. — REQ-006, REQ-007

---

## Part B — Graph Wiring (REQ-008 through REQ-013)

> **Goal**: make the coverage graph actively and smartly utilized by the live loops. **User success criterion.**

### Architectural decision (blocking)

- [ ] **T020** [ADR] Draft ADR-001 in `decision-record.md`: choose canonical graph-convergence regime (CJS helper vs. MCP handler). Default recommendation: **MCP handler**. Include fallback contingency. — REQ-008
- [ ] **T021** [B-T020] Harmonize `sourceDiversity` semantics: implement once in the authoritative file per ADR-001, make the other surface a thin adapter. Files: `scripts/lib/coverage-graph-convergence.cjs` and `mcp_server/lib/coverage-graph/coverage-graph-signals.ts`. — REQ-010
- [ ] **T022** [B-T021] Write `scripts/tests/graph-convergence-parity.vitest.ts` asserting both paths return identical `sourceDiversity`, `contradictionDensity`, and `compositeStop` on a shared fixture input. — REQ-010

### Live graph calls in YAML workflows

- [ ] **T023** [P, B-T020] Add `step_graph_upsert` to `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` after iteration file write, calling `deep_loop_graph_upsert` MCP tool with the iteration's `graphEvents` array. — REQ-009
- [ ] **T024** [P, B-T020] Add `step_graph_convergence` to the research auto YAML stop-check step, calling `deep_loop_graph_convergence` with `sessionId`, `specFolder`, and current iteration number. STOP is blocked if the graph output returns a blocker. — REQ-009
- [ ] **T025** [P, B-T020] Mirror T023 + T024 in `spec_kit_deep-review_auto.yaml`. — REQ-009
- [ ] **T026** [P, B-T020] Mirror T023 + T024 in both `_confirm.yaml` files for research and review. — REQ-009

### Reducer reads graph state

- [ ] **T027** [B-T024] Update `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs` to read graph convergence output (via the MCP handler per ADR-001) and expose `graphConvergenceScore` as a new field in `findings-registry.json` alongside `convergenceScore`. — REQ-013
- [ ] **T028** [B-T025] Mirror T027 in `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs`. — REQ-013

### Session scoping in shared reads

- [ ] **T029** [P] Refactor `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts`: add `sessionId` as a required query parameter on all read paths. — REQ-012
- [ ] **T030** [P] Refactor `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts` equivalently; session-scope the aggregation. — REQ-012
- [ ] **T031** [B-T029, T030] Update all call sites in `scripts/lib/coverage-graph-*.cjs` to pass `sessionId` through. — REQ-012
- [ ] **T032** [B-T029] Write `scripts/tests/session-isolation.vitest.ts`: seed two concurrent research sessions in the same spec folder, assert each sees only its own nodes. — REQ-024

### Tool routing parity

- [ ] **T033** [P] Provision `code_graph_query` and `code_graph_context` in the LEAF-tool budget of `.opencode/command/spec_kit/deep-research.md`; OR remove them from `.opencode/agent/deep-research.md` prose. Decision documented in ADR-003 sub-entry of `decision-record.md`. — REQ-011
- [ ] **T034** [P] Mirror T033 for `deep-review.md` command and agent docs. — REQ-011
- [ ] **T035** [B-T033, T034] Sync runtime agent mirrors (`.claude/agents/`, `.codex/agents/`, `.gemini/agents/`) with the new tool budget. — REQ-011

---

## Part C — Reducer Surfacing (REQ-014 through REQ-019)

> **Goal**: make evidence from Parts A and B visible in reducer-owned surfaces operators actually read.

### Blocked-stop promotion

- [ ] **T036** [P, B-T009] In `sk-deep-research/scripts/reduce-state.cjs`: parse `blocked_stop` JSONL events, write a `blockedStopHistory` array into `findings-registry.json`, render the latest entry in the dashboard `Next Focus` / new `Blocked Stop` section, and surface `recoveryStrategy` in the strategy `next-focus` anchor when blocked-stop is current state. — REQ-014
- [ ] **T037** [P, B-T010] Mirror T036 in `sk-deep-review/scripts/reduce-state.cjs`. — REQ-014

### Review fail-closed

- [ ] **T038** [B-T010] Change `parseJsonl()` in `sk-deep-review/scripts/reduce-state.cjs` to collect malformed lines into `corruptionWarnings` array instead of silent skip. Emit warnings on stderr. Exit non-zero unless `--lenient` flag passed. — REQ-015
- [ ] **T039** [B-T010] Change `replaceAnchorSection()` in `sk-deep-review/scripts/reduce-state.cjs` to throw when anchor is missing. Add `--create-missing-anchors` escape hatch for bootstrap. — REQ-016
- [ ] **T040** [P] Write `scripts/tests/review-reducer-fail-closed.vitest.ts`: assert malformed JSONL causes non-zero exit, missing anchor throws descriptive error. — REQ-015, REQ-016

### Improve-agent replay decision

- [ ] **T041** [ADR] Draft ADR-002 in `decision-record.md`: implement replay consumers OR downgrade docs. Default recommendation: **implement consumers**. — REQ-017
- [ ] **T042** [B-T041] If ADR-002 chose "implement": extend `sk-improve-agent/scripts/reduce-state.cjs` to read `improvement-journal.jsonl`, `candidate-lineage.json`, and `mutation-coverage.json` each refresh. Expose key state in registry + dashboard. If "downgrade": update SKILL.md and command doc to say replay is ledger-only. — REQ-017

### Dashboard refinements

- [ ] **T043** [P, B-T010] In `sk-deep-review/scripts/reduce-state.cjs`: replace `repeatedFindings` with two arrays: `persistentSameSeverity` and `severityChanged`. Render both tables in dashboard. — REQ-018
- [ ] **T044** [P, B-T019] In `sk-improve-agent/scripts/reduce-state.cjs`: add `replayCount`, `stabilityCoefficient`, `insufficientSample`, `insufficientData` as first-class dashboard fields in a new `Sample Quality` section separate from benchmark failure counters. — REQ-019

### Documentation

- [ ] **T045** Update `sk-deep-research/references/state_format.md` §5 (registry schema) with `blockedStopHistory`, `graphConvergenceScore` fields. — REQ-013, REQ-014
- [ ] **T046** Update `sk-deep-review/references/state_format.md` equivalently + document `corruptionWarnings`, fail-closed exit codes, `persistentSameSeverity` / `severityChanged` split. — REQ-014, REQ-015, REQ-018
- [ ] **T047** Update `sk-improve-agent/SKILL.md` + `scripts/` README with the ADR-002 outcome, `insufficientSample` / `insufficientData` semantics, and new dashboard fields. — REQ-017, REQ-019

---

## Part D — Fixtures & Regression (REQ-020 through REQ-025)

> **Goal**: make future audits testable against the visible path.

### Fixtures

- [ ] **T048** [P] Hand-author `sk-deep-research/scripts/tests/fixtures/interrupted-session/`: deep-research packet with truncated JSONL (missing final iteration record) and one partial iteration file. — REQ-020
- [ ] **T049** [P] Hand-author `sk-deep-review/scripts/tests/fixtures/blocked-stop-session/`: review packet with a full `blockedBy` / `gateResults` / `recoveryStrategy` payload across 3 iterations, including one severity upgrade. — REQ-021
- [ ] **T050** [P] Hand-author `sk-improve-agent/scripts/tests/fixtures/low-sample-benchmark/`: candidate session with 1 replay + 2-point trade-off trajectory + journal events. — REQ-022

### Vitest suites

- [ ] **T051** [B-T024, T027] Write `scripts/tests/graph-aware-stop.vitest.ts`: seed coverage graph with a contradiction, run a mock research iteration, assert stop check returns `blocked` via graph signal. MUST fail if graph wiring is not active. — REQ-023
- [ ] **T052** [B-T032] Verify `session-isolation.vitest.ts` from T032 passes on the final code. — REQ-024

### Playbook scenarios

- [ ] **T053** [P] Add `sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/032-blocked-stop-reducer-surfacing.md`: playbook scenario verifying blocked-stop events surface in findings-registry + dashboard + strategy. — REQ-025
- [ ] **T054** [P] Add `sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/033-graph-aware-stop-gate.md`: playbook scenario verifying graph contradiction blocks STOP on the live path. — REQ-025
- [ ] **T055** [P] Add `sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/022-blocked-stop-reducer-surfacing.md` + `023-fail-closed-reducer.md`. — REQ-025
- [ ] **T056** [P] Add `sk-improve-agent/manual_testing_playbook/07--runtime-truth/032-journal-wiring.md` + `033-insufficient-sample.md` + `034-replay-consumer.md` (consumer scenario conditional on ADR-002 outcome). — REQ-025
- [ ] **T057** Run every new playbook scenario end-to-end against the updated runtime; record PASS evidence in the scenario file. — REQ-025

---

## Part E — Version Bumps, Changelogs, and Closing Review

> **Goal**: close the phase cleanly with operator-visible releases and a deep-review self-audit.

- [ ] **T058** Bump versions in SKILL.md: `sk-deep-research` 1.5.0.0 → 1.6.0.0, `sk-deep-review` 1.2.0.0 → 1.3.0.0, `sk-improve-agent` 1.1.0.0 → 1.2.0.0.
- [ ] **T059** Write changelog entries: `.opencode/changelog/12--sk-deep-research/v1.6.0.0.md`, `13--sk-deep-review/v1.3.0.0.md`, `15--sk-improve-agent/v1.2.0.0.md`.
- [ ] **T060** Run the full vitest suite and confirm no regressions (target: 10,340+ passing, 0 failing).
- [ ] **T061** Run `/spec_kit:deep-review:auto` against phase 008 with 10 iterations; confirm zero P0 and zero P1 findings in the synthesis.
- [ ] **T062** Fill `implementation-summary.md` with build story, verification results, ADR outcomes, and follow-up items.
- [ ] **T063** Run `/memory:save` for phase 008 via `generate-context.js`.

---

## Task Summary by REQ

| REQ | Task IDs |
|-----|----------|
| REQ-001 (blocked_stop research) | T001, T002, T007, T009 |
| REQ-002 (normalize research pause events) | T003, T004, T007, T009 |
| REQ-003 (blocked_stop + normalize review) | T005, T006, T008, T010 |
| REQ-004 (improve-agent journal wiring) | T011, T012, T014 |
| REQ-005 (CLI example fix) | T013 |
| REQ-006 (trade-off minDataPoints) | T015, T017, T019 |
| REQ-007 (stability minReplayCount) | T016, T018, T019 |
| REQ-008 (canonical graph regime) | T020 |
| REQ-009 (live graph calls) | T023, T024, T025, T026 |
| REQ-010 (sourceDiversity harmonization) | T021, T022 |
| REQ-011 (tool routing parity) | T033, T034, T035 |
| REQ-012 (session scoping) | T029, T030, T031 |
| REQ-013 (graphConvergenceScore) | T027, T028, T045 |
| REQ-014 (blocked-stop promotion) | T036, T037, T045, T046 |
| REQ-015 (fail-closed JSONL) | T038, T040, T046 |
| REQ-016 (explicit anchor failure) | T039, T040, T046 |
| REQ-017 (replay consumer or docs downgrade) | T041, T042, T047 |
| REQ-018 (repeatedFindings split) | T043, T046 |
| REQ-019 (improve-agent dashboard) | T044, T047 |
| REQ-020 (interrupted-session fixture) | T048 |
| REQ-021 (blocked-stop fixture) | T049 |
| REQ-022 (low-sample fixture) | T050 |
| REQ-023 (graph-aware-stop suite) | T051 |
| REQ-024 (session-isolation suite) | T032, T052 |
| REQ-025 (playbook scenarios) | T053, T054, T055, T056, T057 |

**Total**: 63 tasks across 5 parts. Parallelizable count: ~35 tasks marked `[P]`, meaning the phase can run with 3–4 concurrent agents per part.
