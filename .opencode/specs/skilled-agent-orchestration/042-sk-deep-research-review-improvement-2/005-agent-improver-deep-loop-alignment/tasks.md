---
title: "Tasks: Agent-Improver Deep-Loop Alignment [005]"
description: "24 tasks across 4 sub-phases mapping 13 requirements to concrete implementation steps for the sk-agent-improver runtime truth alignment."
trigger_phrases:
  - "005"
  - "agent improver tasks"
  - "improvement journal tasks"
  - "mutation coverage tasks"
importance_tier: "important"
contextType: "planning"
---
# Tasks: Agent-Improver Deep-Loop Alignment

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)` — REQ reference in parentheses indicates the requirement satisfied.

**Sub-phase prefix**: Tasks are grouped by sub-phase (5a/5b/5c/5d). Within a sub-phase, tasks are ordered by dependency.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Sub-Phase 5a: Runtime Truth Alignment

*Delivers: stop-reason taxonomy, legal-stop gates, resume semantics, audit journal, hypothesis verification ledger.*

- [ ] T001 Read existing sk-agent-improver SKILL.md, improvement_config.json, improvement_charter.md, improvement_strategy.md and agent-improver.md to understand current state before modifying (all skill files)
- [ ] T002 Read 042 Phase 1 journal schema from `../001-runtime-truth-foundation/` to confirm event type contract before writing journal script
- [ ] T003 Add stop-reason taxonomy section to SKILL.md: define `converged`, `promoted`, `rolledBack`, `maxIterationsReached`, `regressionDetected`, `manualStop`, `error` with trigger conditions (`.opencode/skill/sk-agent-improver/SKILL.md`) (REQ-AI-001)
- [ ] T004 Add legal-stop gate protocol to agent-improver.md orchestrator section: gate conditions for `converged` and `promoted` using 5-dimension stability + no regression + promotion criteria (`.opencode/agent/agent-improver.md`) (REQ-AI-002)
- [ ] T005 Add resume/continuation semantics to agent.md command: session-id parameter, journal replay on resume, iteration counter carry-over (`.opencode/command/improve/agent.md`) (REQ-AI-003)
- [ ] T006 Create `improvement-journal.cjs`: append-only JSONL emitter with event schema validation for `iteration-started`, `candidate-proposed`, `candidate-evaluated`, `promotion-gate-checked`, `trade-off-detected`, `session-ended` event types (`.opencode/skill/sk-agent-improver/scripts/improvement-journal.cjs`) (REQ-AI-004)
- [ ] T007 Add hypothesis verification ledger schema to `improvement-journal.cjs`: `mutation-proposed` and `mutation-outcome` event types capturing proposed mutation, accepted/rejected status, rejection reason, and scored dimensions (`.opencode/skill/sk-agent-improver/scripts/improvement-journal.cjs`) (REQ-AI-005)
- [ ] T008 Update improvement_charter.md: add audit trail obligations section specifying that the orchestrator must emit journal events at each iteration boundary (`.opencode/skill/sk-agent-improver/assets/improvement_charter.md`)
- [ ] T009 Update improvement_config.json: add optional `journal.path`, `journal.sessionId`, `sessionResume.enabled` fields with documented defaults (`.opencode/skill/sk-agent-improver/assets/improvement_config.json`)
- [ ] T010 Write `improvement-journal.vitest.ts`: test event emit, append-only enforcement (second write appends not overwrites), invalid event type rejection, resume journal read, session-ended event schema (`.opencode/skill/sk-agent-improver/scripts/tests/improvement-journal.vitest.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Sub-Phase 5b: Improvement Intelligence

*Delivers: mutation coverage graph, dimension trajectory tracking, trade-off detection, exhausted-mutations log.*
*Depends on: T006 (journal emit for trade-off events).*

- [ ] T011 [P] Read 042 Phase 2 coverage graph API from `../002-semantic-coverage-graph/` to confirm `loop_type` namespace parameter support before implementing mutation-coverage.cjs
- [ ] T012 Create `mutation-coverage.cjs`: coverage graph reader/writer with `loop_type: "improvement"` namespace; tracks explored dimensions, tried mutation types per dimension, integration surfaces, exhausted mutation sets (`.opencode/skill/sk-agent-improver/scripts/mutation-coverage.cjs`) (REQ-AI-006, REQ-AI-009)
- [ ] T013 Add dimension trajectory writer to `mutation-coverage.cjs` or as a co-located module: time-ordered score vector per dimension, enforces minimum 3 data points before convergence claim (REQ-AI-007)
- [ ] T014 Create `trade-off-detector.cjs`: reads current trajectory, computes per-dimension deltas, compares against configurable thresholds, returns structured trade-off report (`.opencode/skill/sk-agent-improver/scripts/trade-off-detector.cjs`) (REQ-AI-008)
- [ ] T015 Update improvement_strategy.md: add trajectory-based convergence criteria (minimum 3 data points, stabilization threshold), mutation exhaustion guidance (skip exhausted types, annotate journal), trade-off resolution guidance (`.opencode/skill/sk-agent-improver/assets/improvement_strategy.md`)
- [ ] T016 Update improvement_config.json: add optional `coverageGraph.path`, `trajectory.minDataPoints`, `tradeOff.thresholds` config block with documented defaults (`.opencode/skill/sk-agent-improver/assets/improvement_config.json`)
- [ ] T017 Write `mutation-coverage.vitest.ts`: test namespace isolation, graph read/write round-trip, exhausted-mutations marking, trajectory append and minimum data-point enforcement (`.opencode/skill/sk-agent-improver/scripts/tests/mutation-coverage.vitest.ts`)
- [ ] T018 Write `trade-off-detector.vitest.ts`: test threshold crossing detection, no-event-when-below-threshold, configurable threshold values, empty trajectory handling (`.opencode/skill/sk-agent-improver/scripts/tests/trade-off-detector.vitest.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Sub-Phase 5c: Parallel Candidates

*Delivers: optional parallel candidate waves with exploration-breadth gate, candidate lineage graph.*
*Depends on: T006 (journal emit); T003 (SKILL.md updated).*
*Can run in parallel with Sub-Phase 5b after 5a completes.*

- [ ] T019 [P] Create `candidate-lineage.cjs`: directed graph of candidate proposals across parallel wave sessions; each node stores session-id, wave-index, spawning mutation type, and parent node reference (`.opencode/skill/sk-agent-improver/scripts/candidate-lineage.cjs`) (REQ-AI-011)
- [ ] T020 [P] Add parallel wave orchestration branch to agent-improver.md: activation check against `parallelWaves.enabled` and `explorationBreadthScore >= activationThreshold`; spawn 2-3 candidates with different strategies; merge results by selecting highest non-regressive score (`.opencode/agent/agent-improver.md`) (REQ-AI-010)
- [ ] T021 Update improvement_config.json: add `parallelWaves` config block with `enabled: false`, `activationThreshold`, `maxCandidates` fields and JSDoc comments (`.opencode/skill/sk-agent-improver/assets/improvement_config.json`)
- [ ] T022 Write `candidate-lineage.vitest.ts`: test node creation, parent-child linkage, root-to-leaf traversal, wave-index assignment, session-id isolation (`.opencode/skill/sk-agent-improver/scripts/tests/candidate-lineage.vitest.ts`)
- [ ] T023 [P] Manual verification: run an improvement session with `parallelWaves.enabled: false` (default) and confirm single-wave behavior is unchanged; confirm no lineage graph is written when parallel mode is off
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Sub-Phase 5d: Scoring Optimization

*Delivers: scoring weight optimizer (recommendation only), benchmark replay stability measurement.*
*Depends on: T006 (journal history), T013 (trajectory data).*

- [ ] T024 Create `benchmark-stability.cjs`: accepts array of benchmark result sets from identical replays, computes per-dimension stability coefficient (1 - stddev/mean), emits stability report JSON, appends `stabilityWarning` to journal if any coefficient is below configured threshold (`.opencode/skill/sk-agent-improver/scripts/benchmark-stability.cjs`) (REQ-AI-013)
- [ ] T025 Implement weight optimizer logic in `benchmark-stability.cjs` or co-located module: reads historical journal files after session count threshold, computes per-dimension performance patterns, emits weight-recommendation report file (not auto-applied) (REQ-AI-012)
- [ ] T026 Update SKILL.md: add weight optimizer invocation guidance (when to run, what the report contains, how to apply recommendations manually), benchmark stability interpretation guide (`.opencode/skill/sk-agent-improver/SKILL.md`)
- [ ] T027 Update improvement_config.json: add `weightOptimizer.sessionCountThreshold`, `weightOptimizer.reportPath`, `benchmarkStability.replayCount`, `benchmarkStability.warningThreshold` optional config fields (`.opencode/skill/sk-agent-improver/assets/improvement_config.json`)
- [ ] T028 Write `benchmark-stability.vitest.ts`: test stability coefficient math (perfect stability = 1.0, high variance = low coefficient), stability warning threshold triggering, weight recommendation report format, multi-session history aggregation (`.opencode/skill/sk-agent-improver/scripts/tests/benchmark-stability.vitest.ts`)
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks T001-T028 marked `[x]` (or explicitly deferred with user approval for P2 items)
- [ ] No `[B]` blocked tasks remaining
- [ ] All 5 Vitest suites (`improvement-journal`, `mutation-coverage`, `trade-off-detector`, `candidate-lineage`, `benchmark-stability`) pass with zero failures across 3 consecutive runs
- [ ] Backward compatibility verified: improvement session run without any new config fields produces identical output to pre-phase behavior
- [ ] SKILL.md, all 4 asset files, agent-improver.md, and agent.md updated and synchronized with spec.md requirements
- [ ] checklist.md verification complete with evidence for all P0 and P1 items
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

| Document | Purpose |
|----------|---------|
| `spec.md` | Full requirements (REQ-AI-001 through REQ-AI-013) and acceptance criteria |
| `plan.md` | Sub-phase architecture, effort estimates, dependency graph, and milestones |
| `checklist.md` | Verification gate items (CHK-* series) to mark as evidence accrues |
| `decision-record.md` | ADR-001 through ADR-005 with full rationale and alternatives |
| `../001-runtime-truth-foundation/` | 042 Phase 1 journal schema — primary dependency for Sub-Phase 5a |
| `../002-semantic-coverage-graph/` | 042 Phase 2 coverage graph API — primary dependency for Sub-Phase 5b |
| `../003-wave-executor/` | 042 Phase 3 wave executor — reference for Sub-Phase 5c parallel candidate gate |
| `../004-offline-loop-optimizer/` | 042 Phase 4 optimizer patterns — reference for Sub-Phase 5d |
<!-- /ANCHOR:cross-refs -->
