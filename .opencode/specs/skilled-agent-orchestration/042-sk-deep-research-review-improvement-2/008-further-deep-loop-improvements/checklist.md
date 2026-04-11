---
title: "Checklist: Further Deep-Loop Improvements [008]"
description: "P0/P1/P2 verification for the 25 requirements across the 4 implementation passes. Each item cites its REQ and expected evidence."
trigger_phrases:
  - "008"
  - "phase 8 checklist"
  - "further deep loop checklist"
importance_tier: "critical"
contextType: "verification"
---

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->

# Checklist: Further Deep-Loop Improvements [008]

| Field | Value |
|-------|-------|
| **Spec** | ./spec.md |
| **Plan** | ./plan.md |
| **Tasks** | ./tasks.md |

Each item requires evidence (file path + line number, vitest suite name, or playbook scenario ID). Mark `[x]` only after evidence is recorded.

---

## Verification Protocol

1. Items are grouped by **Part** (A/B/C/D/E) and within each part by **priority** (P0/P1/P2 from `research/research.md`).
2. No item is checkable without evidence; placeholder checks are rejected.
3. Phase closes only after all P0 + P1 items are `[x]`. P2 items may remain `[ ]` with explicit deferral rationale in `implementation-summary.md`.
4. Closing deep review run (T061) must produce zero P0 and zero P1 findings before the phase is marked complete.

---

## Pre-Implementation

- [ ] **CL-PRE-01** `research/research.md` read and understood by all agents before any code changes. Evidence: confirmed reading during Phase A kickoff.
- [ ] **CL-PRE-02** Vitest infrastructure green at phase start (10,335+ tests passing). Evidence: vitest run output.
- [ ] **CL-PRE-03** ADR-001 (canonical graph regime) drafted in `decision-record.md`. Evidence: `decision-record.md` §ADR-001.
- [ ] **CL-PRE-04** ADR-002 (improve-agent replay strategy) drafted in `decision-record.md`. Evidence: `decision-record.md` §ADR-002.
- [ ] **CL-PRE-05** New feature branch created OR `system-speckit/026-graph-and-context-optimization` confirmed clean for phase 008 work. Evidence: `git status`.

---

## Part A — Contract Truth (P0)

### Research + Review stop event emission

- [ ] **CL-A-01** `blocked_stop` JSONL event emission wired in `spec_kit_deep-research_auto.yaml` after legal-stop evaluation. Evidence: YAML diff + T001.
- [ ] **CL-A-02** `blocked_stop` emission mirrored in `spec_kit_deep-research_confirm.yaml`. Evidence: T002.
- [ ] **CL-A-03** `userPaused` and `stuckRecovery` normalization wired in both research YAMLs using the frozen `STOP_REASONS` enum. Evidence: T003, T004.
- [ ] **CL-A-04** Same `blocked_stop` + normalization pattern wired in both `spec_kit_deep-review_{auto,confirm}.yaml` with review-specific gate names. Evidence: T005, T006.
- [ ] **CL-A-05** `sk-deep-research/references/state_format.md` §3 documents the new event schemas. Evidence: T007.
- [ ] **CL-A-06** `sk-deep-review/references/state_format.md` §3 documents the new event schemas. Evidence: T008.
- [ ] **CL-A-07** Research reducer (`reduce-state.cjs`) no longer filters out `blocked_stop`, `userPaused`, `stuckRecovery` events. Evidence: T009 diff, new test case.
- [ ] **CL-A-08** Review reducer equivalently updated. Evidence: T010 diff, new test case.

### Improve-agent journal wiring

- [ ] **CL-A-09** `step_emit_journal_event` wired at session start, every iteration boundary, and session end in `improve_agent-improver_auto.yaml`. Evidence: T011.
- [ ] **CL-A-10** Confirm YAML mirrored. Evidence: T012.
- [ ] **CL-A-11** `.opencode/command/improve/agent.md` CLI example fixed and verified executable (`--emit session_start --payload ...`). Evidence: T013 + copy-paste run output.
- [ ] **CL-A-12** `sk-improve-agent/SKILL.md` documents journal wiring contract and event boundaries. Evidence: T014.

### Sample-size enforcement

- [ ] **CL-A-13** `trade-off-detector.cjs` returns `{state:"insufficientData"}` with 2 data points; `{state:"ok"|"tradeoff"}` with ≥3. Evidence: T015 diff + T017 vitest assertion.
- [ ] **CL-A-14** `benchmark-stability.cjs` returns `{state:"insufficientSample"}` with 1–2 replays; stability verdict with ≥3. Evidence: T016 diff + T018 vitest assertion.
- [ ] **CL-A-15** `sk-improve-agent/scripts/reduce-state.cjs` propagates `insufficientData` and `insufficientSample` states into the findings registry. Evidence: T019 diff.

---

## Part B — Graph Wiring (P0)

### Decision

- [ ] **CL-B-01** ADR-001 finalized with chosen regime (MCP handler or CJS helper) and rationale. Evidence: `decision-record.md` §ADR-001 committed.
- [ ] **CL-B-02** `sourceDiversity` harmonized between CJS helper and MCP handler. Evidence: T021 diff + T022 parity test output.

### Live graph calls

- [ ] **CL-B-03** `deep_loop_graph_upsert` called from iteration step in `spec_kit_deep-research_auto.yaml`. Evidence: T023.
- [ ] **CL-B-04** `deep_loop_graph_convergence` called from stop-check step in research auto YAML; STOP blocked when graph output returns blocker. Evidence: T024.
- [ ] **CL-B-05** Both graph calls wired in `spec_kit_deep-review_auto.yaml`. Evidence: T025.
- [ ] **CL-B-06** Both graph calls wired in both `_confirm.yaml` files. Evidence: T026.

### Reducer reads graph state

- [ ] **CL-B-07** `graphConvergenceScore` appears in `findings-registry.json` for research packets. Evidence: T027 + sample packet output.
- [ ] **CL-B-08** `graphConvergenceScore` appears in findings registry for review packets. Evidence: T028 + sample packet output.

### Session scoping

- [ ] **CL-B-09** `coverage-graph-query.ts` requires `sessionId` on all read paths. Evidence: T029 diff + caller updates.
- [ ] **CL-B-10** `coverage-graph/convergence.ts` handler aggregates by `specFolder + loopType + sessionId`. Evidence: T030 diff.
- [ ] **CL-B-11** All CJS call sites in `scripts/lib/coverage-graph-*.cjs` pass `sessionId`. Evidence: T031 diff.
- [ ] **CL-B-12** `session-isolation.vitest.ts` passes, proving two concurrent research sessions in one spec folder see only their own nodes. Evidence: T032, vitest output.

### Tool routing parity

- [ ] **CL-B-13** `code_graph_query` and `code_graph_context` provisioned in `deep-research.md` LEAF-tool budget (or removed from `deep-research.md` agent prose). Evidence: T033 diff.
- [ ] **CL-B-14** Same for `deep-review.md`. Evidence: T034 diff.
- [ ] **CL-B-15** Runtime agent mirrors (`.claude/agents/`, `.codex/agents/`, `.gemini/agents/`) synced with new tool budget. Evidence: T035 diff.

---

## Part C — Reducer Surfacing (P1, P2)

### Blocked-stop promotion (P1)

- [ ] **CL-C-01** `blockedStopHistory` array written to research `findings-registry.json` with at least one fixture-based entry. Evidence: T036 + fixture test.
- [ ] **CL-C-02** Same for review. Evidence: T037 + fixture test.

### Review fail-closed (P1)

- [ ] **CL-C-03** `corruptionWarnings` array populated when JSONL is malformed; reducer exits non-zero unless `--lenient` passed. Evidence: T038 + `review-reducer-fail-closed.vitest.ts`.
- [ ] **CL-C-04** `replaceAnchorSection()` throws on missing anchor; `--create-missing-anchors` escape hatch documented. Evidence: T039 + test case.

### Improve-agent replay decision (P1)

- [ ] **CL-C-05** ADR-002 resolved with chosen path (implement consumers or downgrade docs). Evidence: `decision-record.md` §ADR-002.
- [ ] **CL-C-06** ADR-002 implementation complete: reducer reads journal/lineage/coverage OR SKILL.md + command docs explicitly downgraded. Evidence: T042 diff.

### Dashboard refinements (P2)

- [ ] **CL-C-07** `persistentSameSeverity` and `severityChanged` arrays replace `repeatedFindings` in review reducer. Dashboard renders both tables. Evidence: T043 + sample output.
- [ ] **CL-C-08** `replayCount`, `stabilityCoefficient`, `insufficientSample`, `insufficientData` exposed as first-class fields in improve-agent dashboard in a new `Sample Quality` section. Evidence: T044 + sample output.

### Documentation (P1)

- [ ] **CL-C-09** `sk-deep-research/references/state_format.md` §5 documents new registry fields. Evidence: T045.
- [ ] **CL-C-10** `sk-deep-review/references/state_format.md` documents new fields + fail-closed semantics + split repeatedFindings. Evidence: T046.
- [ ] **CL-C-11** `sk-improve-agent/SKILL.md` and scripts README document ADR-002 outcome + new dashboard fields. Evidence: T047.

---

## Part D — Fixtures & Regression (P2)

### Fixtures

- [ ] **CL-D-01** `sk-deep-research/scripts/tests/fixtures/interrupted-session/` exists and loads via reducer. Evidence: T048, `ls` + manual reducer run.
- [ ] **CL-D-02** `sk-deep-review/scripts/tests/fixtures/blocked-stop-session/` exists and exercises REQ-014. Evidence: T049.
- [ ] **CL-D-03** `sk-improve-agent/scripts/tests/fixtures/low-sample-benchmark/` exists and exercises REQ-006, REQ-007, REQ-019. Evidence: T050.

### Vitest suites

- [ ] **CL-D-04** `scripts/tests/graph-aware-stop.vitest.ts` passes. Suite MUST fail if graph wiring is not active. Evidence: T051 + vitest output.
- [ ] **CL-D-05** `scripts/tests/session-isolation.vitest.ts` passes. Evidence: T052 + vitest output (duplicate of CL-B-12 for clarity).

### Playbook scenarios

- [ ] **CL-D-06** `sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/032-blocked-stop-reducer-surfacing.md` created and PASS. Evidence: T053, T057 + PASS evidence in scenario.
- [ ] **CL-D-07** `033-graph-aware-stop-gate.md` created and PASS. Evidence: T054, T057.
- [ ] **CL-D-08** `sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/022-blocked-stop-reducer-surfacing.md` + `023-fail-closed-reducer.md` created and PASS. Evidence: T055, T057.
- [ ] **CL-D-09** `sk-improve-agent/manual_testing_playbook/07--runtime-truth/032-journal-wiring.md` + `033-insufficient-sample.md` + `034-replay-consumer.md` (conditional on ADR-002) created and PASS. Evidence: T056, T057.

---

## Part E — Release Close-out

- [ ] **CL-E-01** `sk-deep-research` SKILL.md version bumped 1.5.0.0 → 1.6.0.0. Evidence: T058 diff.
- [ ] **CL-E-02** `sk-deep-review` SKILL.md version bumped 1.2.0.0 → 1.3.0.0. Evidence: T058 diff.
- [ ] **CL-E-03** `sk-improve-agent` SKILL.md version bumped 1.1.0.0 → 1.2.0.0. Evidence: T058 diff.
- [ ] **CL-E-04** `.opencode/changelog/12--sk-deep-research/v1.6.0.0.md` written. Evidence: T059 + file creation.
- [ ] **CL-E-05** `.opencode/changelog/13--sk-deep-review/v1.3.0.0.md` written. Evidence: T059 + file creation.
- [ ] **CL-E-06** `.opencode/changelog/15--sk-improve-agent/v1.2.0.0.md` written. Evidence: T059 + file creation.
- [ ] **CL-E-07** Full vitest suite green (10,340+ passing, 0 failing). Evidence: T060 vitest run output.
- [ ] **CL-E-08** Closing `/spec_kit:deep-review:auto` run on phase 008 with ≥10 iterations produces zero P0 and zero P1 findings. Evidence: T061 synthesis report.
- [ ] **CL-E-09** `implementation-summary.md` filled with build story, verification results, and ADR outcomes. Evidence: T062 file completion.
- [ ] **CL-E-10** Memory save via `generate-context.js` succeeds with POST-SAVE QUALITY REVIEW PASSED. Evidence: T063 script output.

---

## Success Gate

**Phase closes when**:

1. All CL-PRE-* items `[x]`.
2. All CL-A-* items `[x]` (P0 contract truth).
3. All CL-B-* items `[x]` (P0 graph wiring).
4. All CL-C-* items `[x]` OR explicit deferral rationale in `implementation-summary.md` (P1 reducer surfacing + P2 dashboard refinements).
5. All CL-D-* items `[x]` OR explicit deferral rationale (P2 fixtures).
6. All CL-E-* items `[x]` (release close-out).
7. **Graph integration score** (per `research/research.md` §16 methodology) jumps from `6/10, 2/10, 2/10, 1/10, 2/10` (sk-deep-research) to at least `8/10` across all five graph dimensions.
8. **Contract compliance score** (per `research/research.md` §15) jumps from current low-single-digit scores to at least `7/10` across all 5 compliance dimensions per skill.
9. User's explicit success criterion: **graph is actively and smartly utilized** in the live research and review loops. Evidence: working `graph-aware-stop.vitest.ts` + successful `deep_loop_graph_convergence` call observed in a real packet.
