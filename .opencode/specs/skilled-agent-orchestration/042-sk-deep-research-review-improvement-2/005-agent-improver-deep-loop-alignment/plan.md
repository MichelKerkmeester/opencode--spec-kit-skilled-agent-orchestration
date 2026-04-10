---
title: "Implementation Plan: Agent-Improver Deep-Loop Alignment [005]"
description: "4-sub-phase plan porting 042 runtime truth contracts to sk-agent-improver: stop-reason taxonomy, audit journal, mutation coverage graph, trade-off detection, optional parallel candidate waves, and scoring weight optimization."
trigger_phrases:
  - "005"
  - "agent improver plan"
  - "improvement journal implementation"
  - "mutation coverage implementation"
  - "benchmark stability implementation"
importance_tier: "important"
contextType: "planning"
---
# Implementation Plan: Agent-Improver Deep-Loop Alignment

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CJS (scripts), TypeScript (tests), Markdown (skill/agent docs) |
| **Framework** | Vitest (tests), existing sk-agent-improver runtime |
| **Storage** | JSONL files (journal, ledger), JSON files (coverage graph, lineage, trajectory) |
| **Testing** | Vitest with 5 test suites; manual integration verification |

### Overview

This plan ports the runtime truth infrastructure proven in 042 Phases 1-4 into the sk-agent-improver skill across four sub-phases. Sub-phase 5a delivers the core runtime contracts (stop-reason taxonomy, legal-stop gates, audit journal, hypothesis ledger). Sub-phase 5b adds improvement intelligence (mutation coverage graph, dimension trajectory, trade-off detection, exhausted-mutations log). Sub-phase 5c adds optional parallel candidate waves and candidate lineage. Sub-phase 5d adds scoring weight optimization and benchmark replay stability. All new config fields are optional with defaults, preserving backward compatibility.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] 042 Phase 1 journal schema confirmed and compatible with improvement events
- [ ] 042 Phase 2 coverage graph API confirmed to support `loop_type` namespace parameter
- [ ] Existing sk-agent-improver SKILL.md and improvement_config.json read and understood
- [ ] All 13 requirements documented in spec.md with measurable acceptance criteria

### Definition of Done

- [ ] All 13 requirements (REQ-AI-001 through REQ-AI-013) have passing acceptance criteria
- [ ] 5 new CJS scripts created and all 5 Vitest suites pass with zero flaky tests across 3 runs
- [ ] SKILL.md, improvement_config.json, improvement_strategy.md, improvement_charter.md, agent-improver.md, and agent.md updated
- [ ] Backward compatibility verified: existing improvement sessions with no new config fields behave identically
- [ ] All ADRs (001-005) documented in decision-record.md and marked Accepted
- [ ] checklist.md fully verified with evidence
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Event-sourced improvement loop with packet-local append-only state. The orchestrator owns all state writes; the proposal-only agent remains read-only relative to journals and graphs.

### Key Components

- **improvement-journal.cjs**: Append-only JSONL emitter. Receives structured event objects from the orchestrator and appends them to the session journal file. Enforces the event schema and blocks invalid event types.
- **mutation-coverage.cjs**: Coverage graph reader/writer. Tracks explored dimensions, tried mutation types per dimension, integration surfaces touched, and exhausted mutation sets. Uses `loop_type: "improvement"` namespace to isolate from deep-research/review paths.
- **trade-off-detector.cjs**: Reads the current dimension trajectory and compares per-dimension deltas against configured thresholds. Emits a structured trade-off report when thresholds are crossed; used by the orchestrator to decide whether to journal a `trade-off-detected` event.
- **candidate-lineage.cjs**: Builds and queries a directed graph of candidate proposals across parallel wave sessions. Links each node to its parent session-id, wave index, and spawning mutation type.
- **benchmark-stability.cjs**: Accepts a benchmark result set from multiple replays of identical input, computes per-dimension stability coefficients, and emits a stability report. Stability coefficient is defined as 1 - (stddev / mean) per dimension.

### Data Flow

Orchestrator receives improvement session trigger → reads prior journal (if resume) → enters iteration loop → calls agent-improver (proposal-only) → evaluates candidate using 5-dimension scoring → calls trade-off-detector → appends events to journal via improvement-journal.cjs → updates mutation-coverage.cjs → checks legal-stop gates → emits stop-reason and session-ended event → optionally triggers benchmark-stability.cjs post-session → optionally triggers weight optimizer (separate invocation).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Sub-Phase 5a: Runtime Truth Alignment (~10 tasks)

Deliver the core runtime contracts: stop-reason taxonomy, legal-stop gates, resume semantics, audit journal, and hypothesis verification ledger. This sub-phase maps directly to 042 Phase 1 but is adapted for improvement loop semantics (e.g., `promoted` and `rolledBack` replace deep-research `synthesized` states).

- [ ] Define stop-reason taxonomy in SKILL.md (REQ-AI-001)
- [ ] Implement legal-stop gate logic in agent-improver.md orchestrator section (REQ-AI-002)
- [ ] Add resume/continuation protocol to agent.md command (REQ-AI-003)
- [ ] Create `improvement-journal.cjs` with append-only JSONL emit (REQ-AI-004)
- [ ] Create hypothesis verification ledger schema and writer in journal script (REQ-AI-005)
- [ ] Update improvement_charter.md with audit trail obligations
- [ ] Add session-id propagation to improvement_config.json
- [ ] Write `improvement-journal.vitest.ts` test suite
- [ ] Verify backward compatibility: session without session-id runs as before
- [ ] Manual integration test: run a session and confirm journal output

### Sub-Phase 5b: Improvement Intelligence (~8 tasks)

Add mutation coverage tracking, dimension trajectory, trade-off detection, and exhausted-mutations logging. Reuses the Phase 2 coverage graph infrastructure via namespace isolation.

- [ ] Create `mutation-coverage.cjs` with `loop_type: "improvement"` namespace (REQ-AI-006)
- [ ] Implement dimension trajectory writer and reader (REQ-AI-007)
- [ ] Create `trade-off-detector.cjs` with configurable thresholds (REQ-AI-008)
- [ ] Implement exhausted-mutations log in mutation-coverage.cjs (REQ-AI-009)
- [ ] Update improvement_strategy.md with trajectory-based convergence criteria
- [ ] Update improvement_config.json with coverage graph path and trade-off thresholds
- [ ] Write `mutation-coverage.vitest.ts` and `trade-off-detector.vitest.ts` test suites
- [ ] Manual integration test: run 3-iteration session and inspect coverage graph

### Sub-Phase 5c: Parallel Candidates (~5 tasks)

Add optional parallel candidate wave support and candidate lineage graph. Gate activation on the exploration-breadth config threshold.

- [ ] Create `candidate-lineage.cjs` for wave session graph (REQ-AI-011)
- [ ] Implement parallel wave orchestration branch in agent-improver.md (REQ-AI-010)
- [ ] Add `parallelWaves` config block to improvement_config.json with `enabled: false` default
- [ ] Write `candidate-lineage.vitest.ts` test suite
- [ ] Manual test: verify single-wave behavior unchanged when `enabled: false`

### Sub-Phase 5d: Scoring Optimization (~5 tasks)

Add scoring weight optimizer using historical session data and benchmark replay stability measurement.

- [ ] Create `benchmark-stability.cjs` with stability coefficient computation (REQ-AI-013)
- [ ] Implement weight optimizer read-and-recommend logic (REQ-AI-012) — recommendation only, no auto-apply
- [ ] Update SKILL.md with weight optimizer invocation guidance
- [ ] Write `benchmark-stability.vitest.ts` test suite
- [ ] Manual test: run optimizer after 3 artificial sessions and verify report format
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | All 5 new CJS scripts: event schema validation, graph read/write, trade-off thresholds, lineage linkage, stability coefficient math | Vitest |
| Integration | Orchestrator loop with journal emit, coverage graph update, legal-stop gate | Manual session run + journal inspection |
| Backward compat | Existing improvement session with no new config fields | Manual session run without new config fields |
| Regression | Parallel wave disabled by default | Config validation test in improvement_config tests |
| Replay stability | Identical input replayed 3 times; coefficient variance < 0.05 | benchmark-stability.cjs + manual verification |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 042 Phase 1 journal schema | Internal | Green | Cannot finalize journal event types without schema contract |
| 042 Phase 2 coverage graph API | Internal | Green | Must confirm `loop_type` param support before mutation-coverage.cjs |
| sk-agent-improver SKILL.md current state | Internal | Green | Must read before modifying |
| Vitest (test runner) | External | Green | Required for 5 test suites; already used in project |
| Node.js CJS module conventions | Internal | Green | All new scripts follow existing sk-agent-improver script patterns |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any sub-phase introduces regressions in existing improvement session behavior, or legal-stop gates block valid sessions.
- **Procedure**: All new config fields have defaults; removing or nulling new fields restores prior behavior. New scripts are additive and not imported by existing code paths until SKILL.md is updated. Revert SKILL.md, improvement_config.json, and agent-improver.md to their pre-phase state to fully restore prior behavior.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
5a: Runtime Truth ────────────┐
                              ├──► 5b: Improvement Intelligence ──► 5d: Scoring Optimization
                              │
                              └──► 5c: Parallel Candidates
```

| Sub-Phase | Depends On | Blocks |
|-----------|------------|--------|
| 5a Runtime Truth | None (reads 042 schema) | 5b, 5c, 5d |
| 5b Improvement Intelligence | 5a (journal, coverage graph pattern) | 5d |
| 5c Parallel Candidates | 5a (journal emit protocol) | None |
| 5d Scoring Optimization | 5a (journal history), 5b (trajectory data) | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Sub-Phase | Complexity | Estimated Effort |
|-----------|------------|------------------|
| 5a Runtime Truth Alignment | High | 6-8 hours |
| 5b Improvement Intelligence | High | 6-8 hours |
| 5c Parallel Candidates | Medium | 3-4 hours |
| 5d Scoring Optimization | Medium | 3-4 hours |
| **Total** | | **18-24 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [ ] Backup current SKILL.md, improvement_config.json, improvement_strategy.md, improvement_charter.md, agent-improver.md, agent.md
- [ ] Confirm 042 Phase 1 journal schema version pinned
- [ ] Confirm coverage graph `loop_type` namespace does not collide with existing namespaces

### Rollback Procedure

1. Revert SKILL.md, improvement_config.json, improvement_strategy.md, improvement_charter.md, agent-improver.md, and agent.md to pre-phase state using git revert or file restore
2. Remove new scripts from `.opencode/skill/sk-agent-improver/scripts/` (they are not imported by existing code)
3. Remove new test files from `scripts/tests/`
4. Verify an existing improvement session runs without error

### Data Reversal

- **Has data migrations?** No
- **Reversal procedure**: JSONL journal files and coverage graph files are new additions with no schema migration; deleting them fully reverts to pre-phase state
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────┐     ┌───────────────────────┐     ┌──────────────────────────┐
│ 5a Runtime Truth │────►│ 5b Improvement Intel   │────►│ 5d Scoring Optimization  │
│ - journal.cjs    │     │ - mutation-coverage.cjs│     │ - benchmark-stability.cjs│
│ - stop-reasons   │     │ - trade-off-detector   │     │ - weight optimizer       │
│ - legal-stop     │     │ - trajectory tracking  │     └──────────────────────────┘
│ - resume proto   │     └───────────────────────┘
└─────────┬────────┘
          │
          ▼
┌──────────────────┐
│ 5c Parallel Cand │
│ - lineage.cjs    │
│ - wave branch    │
└──────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| 5a Runtime Truth | 042 Phase 1 schema | journal.cjs, stop-reason taxonomy, resume protocol | 5b, 5c, 5d |
| 5b Improvement Intel | 5a (journal emit) | mutation-coverage.cjs, trade-off-detector.cjs, trajectory files | 5d |
| 5c Parallel Cand | 5a (journal emit) | candidate-lineage.cjs, wave orchestration branch | None |
| 5d Scoring Opt | 5a (journal history), 5b (trajectory) | benchmark-stability.cjs, weight optimizer report | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Sub-Phase 5a: Runtime Truth Alignment** - 6-8 hours - CRITICAL (all other sub-phases depend on it)
2. **Sub-Phase 5b: Improvement Intelligence** - 6-8 hours - CRITICAL (required before 5d)
3. **Sub-Phase 5d: Scoring Optimization** - 3-4 hours - CRITICAL

**Total Critical Path**: ~15-20 hours

**Parallel Opportunities**:
- Sub-phase 5c (Parallel Candidates) can begin after 5a completes, in parallel with 5b
- 5b and 5c can be developed in parallel once 5a is done
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | 5a Complete | Journal emits stop-reason events; legal-stop gates pass; resume works | End of sub-phase 5a |
| M2 | 5b Complete | Coverage graph, trajectory, trade-off detector all passing tests | End of sub-phase 5b |
| M3 | 5c Complete | Parallel waves activate only when gate met; lineage graph built | End of sub-phase 5c |
| M4 | 5d Complete | Weight optimizer report produced; benchmark stability coefficients computed | End of sub-phase 5d |
| M5 | Full Phase Done | All 5 Vitest suites pass 3x; backward compat verified; checklist.md complete | After M4 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

*See `decision-record.md` for full ADR documentation (ADR-001 through ADR-005).*

### ADR-001 Summary: Journal Emission in Orchestrator

**Status**: Accepted

**Decision**: All journal write operations are performed by the orchestrator, not the agent, to preserve the proposal-only constraint on agent-improver.

### ADR-002 Summary: Coverage Graph Namespace Reuse

**Status**: Accepted

**Decision**: Reuse the existing 042 Phase 2 coverage graph infrastructure with `loop_type: "improvement"` namespace isolation rather than building a separate graph system.

### ADR-003 Summary: Dimension Trajectory as Convergence Signal

**Status**: Accepted

**Decision**: Treat dimension trajectory (per-dimension score history) as a first-class convergence signal, requiring minimum 3 data points before convergence can be claimed.

### ADR-004 Summary: Parallel Candidates Opt-In Only

**Status**: Accepted

**Decision**: Parallel candidate waves are disabled by default and activate only when `parallelWaves.enabled: true` and the exploration-breadth score exceeds the configured threshold.

### ADR-005 Summary: Backward Compatibility via Optional Config Fields

**Status**: Accepted

**Decision**: All new configuration fields introduced in this phase are optional with documented defaults, ensuring existing improvement sessions are unaffected.
