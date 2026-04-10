---
title: "Feature Specification: Agent-Improver Deep-Loop Alignment [005]"
description: "Transfer the proven deep-loop runtime truth contracts from 042 Phases 1-4 to the sk-agent-improver skill, adding stop-reason taxonomy, audit journaling, mutation coverage tracking, trade-off detection, optional parallel candidates, and scoring weight optimization."
trigger_phrases:
  - "005"
  - "agent improver"
  - "deep loop alignment"
  - "improvement journal"
  - "mutation coverage"
  - "trade-off detection"
  - "benchmark stability"
importance_tier: "important"
contextType: "planning"
---
# Feature Specification: Agent-Improver Deep-Loop Alignment

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

The sk-agent-improver skill runs bounded improvement loops over agent packets, but it currently lacks the runtime truth infrastructure proven in 042 Phases 1-4 for deep-research and deep-review. This phase ports those contracts into agent-improver: a well-formed stop-reason taxonomy, legal-stop gates, audit journaling, mutation coverage tracking, dimension trajectory analysis, trade-off detection, optional parallel candidate waves, and scoring weight optimization based on session history.

**Key Decisions**: emit journal events in the orchestrator (not in the proposal-only agent); reuse the existing coverage graph infrastructure with an improvement-specific namespace; treat dimension trajectory as a first-class convergence signal; keep parallel candidate waves opt-in behind an exploration-breadth gate.

**Critical Dependencies**: 042 Phase 1 runtime truth foundation (stop-reason taxonomy, event journal schema); 042 Phase 2 semantic coverage graph (reused with `loop_type: "improvement"`); existing sk-agent-improver 5-dimension scoring and packet-local candidate generation discipline.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-04-10 |
| **Branch** | `system-speckit/026-graph-and-context-optimization` |
| **Parent Packet** | `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/` |
| **Predecessor Phases** | `001-runtime-truth-foundation`, `002-semantic-coverage-graph`, `003-wave-executor`, `004-offline-loop-optimizer` |
| **Skill Target** | `.opencode/skill/sk-agent-improver/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The sk-agent-improver skill runs bounded improvement loops that surface no reliable stop-reason, leave no audit trail, do not track which mutation dimensions have been explored, and cannot detect when one dimension improves at the cost of another. Sessions are opaque, non-resumable, and produce no data that could inform future scoring weight calibration. The 042 bundle already solved these problems for deep-research and deep-review, but agent-improver was left behind.

### Purpose

Apply the same runtime truth contracts to agent-improver so that every improvement session is auditable, resumable, convergence-aware, and self-improving over time.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Stop-reason taxonomy and legal-stop gates adapted for improvement loop semantics
- Audit journal (`improvement-journal.jsonl`) capturing all session events
- Hypothesis verification ledger for mutation outcomes
- Mutation coverage graph tracking explored dimensions, tried mutations, and integration surfaces
- Dimension trajectory tracking (per-dimension score trends across iterations)
- Trade-off detector flagging when one dimension improves while another regresses
- Exhausted-mutations log to prevent redundant exploration
- Optional parallel candidate waves (2-3 strategies, opt-in via exploration-breadth gate)
- Candidate lineage graph for parallel waves
- Scoring weight optimizer using historical session data
- Benchmark replay stability measurement
- 5 new CJS scripts and 5 matching Vitest test suites
- Updates to SKILL.md, improvement_config.json, improvement_strategy.md, improvement_charter.md, agent-improver.md, and agent.md command

### Out of Scope

- Changes to the 5-dimension scoring formula itself (weights only, not formula)
- Changes to the packet-local candidate generation model (proposal-only constraint preserved)
- Full council/synthesis layer (deep-research/review feature, not relevant here)
- New UI or dashboard surfaces (runtime data emitted to JSONL; visualization is a separate concern)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/sk-agent-improver/SKILL.md` | Modify | Add stop-reason taxonomy, journal protocol, coverage graph, trajectory, trade-off, parallel wave, and weight-optimizer sections |
| `.opencode/skill/sk-agent-improver/assets/improvement_config.json` | Modify | Add config fields for journal path, coverage graph path, wave activation gate, weight optimizer settings (all optional with defaults) |
| `.opencode/skill/sk-agent-improver/assets/improvement_strategy.md` | Modify | Add mutation exhaustion guidance, trajectory-based convergence criteria, trade-off resolution guidance |
| `.opencode/skill/sk-agent-improver/assets/improvement_charter.md` | Modify | Add audit trail requirements, legal-stop gate obligations |
| `.opencode/agent/agent-improver.md` | Modify | Add journal emission protocol, legal-stop gate checks, coverage graph update calls |
| `.opencode/command/improve/agent.md` | Modify | Add resume semantics, session-id propagation, weight optimizer invocation |
| `.opencode/skill/sk-agent-improver/scripts/improvement-journal.cjs` | Create | Append-only JSONL event emitter for improvement session events |
| `.opencode/skill/sk-agent-improver/scripts/mutation-coverage.cjs` | Create | Coverage graph reader/writer for explored dimensions and tried mutations |
| `.opencode/skill/sk-agent-improver/scripts/trade-off-detector.cjs` | Create | Cross-dimension regression detector using trajectory data |
| `.opencode/skill/sk-agent-improver/scripts/candidate-lineage.cjs` | Create | Lineage graph for parallel candidate waves |
| `.opencode/skill/sk-agent-improver/scripts/benchmark-stability.cjs` | Create | Benchmark replay stability measurement and reporting |
| `.opencode/skill/sk-agent-improver/scripts/tests/improvement-journal.vitest.ts` | Create | Tests for journal emit, append-only enforcement, event schema |
| `.opencode/skill/sk-agent-improver/scripts/tests/mutation-coverage.vitest.ts` | Create | Tests for coverage graph read/write and namespace isolation |
| `.opencode/skill/sk-agent-improver/scripts/tests/trade-off-detector.vitest.ts` | Create | Tests for regression detection and threshold configuration |
| `.opencode/skill/sk-agent-improver/scripts/tests/candidate-lineage.vitest.ts` | Create | Tests for lineage graph construction and parent-child linkage |
| `.opencode/skill/sk-agent-improver/scripts/tests/benchmark-stability.vitest.ts` | Create | Tests for stability scoring and replay consistency |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### Tier 1: Runtime Truth Alignment (from 042 Phase 1)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-AI-001 | Stop-reason taxonomy: `converged`, `promoted`, `rolledBack`, `maxIterationsReached`, `regressionDetected`, `manualStop`, `error` | Every session termination emits exactly one stop-reason matching the taxonomy; no session ends without a logged stop-reason |
| REQ-AI-002 | Legal-stop gates using 5-dimension stability + no regression + promotion criteria | A session may not claim `converged` or `promoted` unless all gate conditions pass; violations emit `regressionDetected` or continue the loop |
| REQ-AI-003 | Resume/continuation semantics for improvement sessions | A session started with a prior session-id replays journal state and resumes from the last checkpoint without repeating completed iterations |
| REQ-AI-004 | Audit journal (`improvement-journal.jsonl`) capturing all events (iteration-started, candidate-proposed, candidate-evaluated, promotion-gate-checked, session-ended) | All five event types appear in the journal for every completed session; file is append-only and survives process restart |
| REQ-AI-005 | Hypothesis verification ledger tracking mutation outcomes (proposed, accepted, rejected with reason) | Every candidate proposal appears in the ledger with its final outcome and the scored dimensions |

### Tier 2: Improvement Intelligence (from 042 Phase 2 + unique)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-AI-006 | Mutation coverage graph tracking explored dimensions, tried mutations, and integration surfaces using `loop_type: "improvement"` namespace | After each iteration the coverage graph is updated; querying it returns accurate explored/remaining sets per dimension |
| REQ-AI-007 | Dimension trajectory tracking (per-dimension score history across iterations) | For each active session the trajectory file contains a time-ordered score vector per dimension; minimum 3 data points before convergence can be claimed |
| REQ-AI-008 | Trade-off detection flagging when dimension A improves by >threshold while dimension B regresses by >threshold | The detector emits a `trade-off-detected` event to the journal whenever thresholds are crossed; thresholds are configurable |
| REQ-AI-009 | Exhausted-mutations log preventing redundant exploration | The coverage graph writer records exhausted mutation types per dimension; the orchestrator skips mutation types already in the exhausted log |

### Tier 3: Parallel Experimentation (from 042 Phase 3, adapted)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-AI-010 | Optional parallel candidate waves (2-3 candidates with different strategies), activated when exploration-breadth config gate is met | Parallel waves only activate when `parallelWaves.enabled: true` and `explorationBreadthScore` exceeds `activationThreshold`; single-wave behavior is unchanged when gate is not met |
| REQ-AI-011 | Candidate lineage graph linking each candidate to its parent session, wave index, and spawning mutation | The lineage graph for any parallel-wave session can be traversed from root to leaf; each node contains session-id, wave-index, and mutation-type |

### Tier 4: Scoring Optimization (from 042 Phase 4)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-AI-012 | Scoring weight optimizer using historical session data to recommend per-dimension weight adjustments | After a configurable number of sessions the optimizer reads the journal history and emits a weight-recommendation report; recommendations do not auto-apply without explicit approval |
| REQ-AI-013 | Benchmark replay stability measurement confirming consistent scores across identical replays | The benchmark-stability script reports a stability coefficient for each dimension; sessions with coefficient below threshold emit a `stabilityWarning` to the journal |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every improvement session termination produces a journal entry with exactly one stop-reason from the approved taxonomy.
- **SC-002**: Legal-stop gates block premature `converged` or `promoted` claims in all test scenarios.
- **SC-003**: A session resumed from a prior session-id replays correctly and does not duplicate iteration events.
- **SC-004**: The mutation coverage graph accurately reflects explored and remaining mutation space after each iteration.
- **SC-005**: Trade-off detection fires within the same iteration that the threshold crossing occurs.
- **SC-006**: Parallel candidate waves do not activate unless the exploration-breadth gate condition is satisfied.
- **SC-007**: The scoring weight optimizer produces a recommendation report after the configured session count threshold is reached.
- **SC-008**: All 5 new scripts have passing Vitest suites with zero flaky tests across 3 consecutive runs.
- **SC-009**: Backward compatibility is maintained: existing improvement sessions with no new config fields behave identically to pre-phase behavior.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 042 Phase 1 journal schema | Journal emit contract must be compatible | Use same event schema from Phase 1; document any improvement-specific extensions |
| Dependency | 042 Phase 2 coverage graph | Coverage graph namespace and API must support `loop_type: "improvement"` | Add namespace field to existing graph writers; verify no breaking change to deep-research/review paths |
| Dependency | sk-agent-improver proposal-only constraint | Orchestrator must own journal emission; agent must not write state | ADR-001 enforces this; enforce via code review gate |
| Risk | Trajectory-based convergence false positives | Session terminates too early on noisy score data | Require minimum 3 trajectory data points before convergence claim (REQ-AI-007) |
| Risk | Parallel wave complexity overloading LLM context | Parallel waves increase context length per session | Keep parallel waves strictly opt-in; default config disables them |
| Risk | Weight optimizer recommendations applied without review | Auto-applied weight changes could degrade scoring over time | REQ-AI-012 explicitly blocks auto-apply; require explicit approval |
| Risk | Backward compatibility breakage | New config fields could change default behavior | All new config fields are optional with documented defaults (ADR-005) |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: Journal append operations must complete in under 50ms per event to avoid blocking iteration cycles.
- **NFR-P02**: Coverage graph read/write must not add more than 100ms total overhead per iteration.

### Reliability

- **NFR-R01**: Journal file must be append-only and survive process restart without data loss; no in-memory-only buffering.
- **NFR-R02**: All new scripts must be idempotent: running them twice with the same input produces the same output.

### Maintainability

- **NFR-M01**: All new CJS scripts must follow the same module pattern used in 042 Phase 1-4 scripts.
- **NFR-M02**: Config fields introduced in this phase must include JSDoc comments documenting type, default, and valid range.

---

## 8. EDGE CASES

### Session Boundaries

- Session with zero completed iterations hitting `maxIterationsReached`: emit stop-reason with 0-iteration count and empty trajectory.
- Resume of a session that previously ended with `error`: replay up to the last successful checkpoint, then continue.

### Coverage Graph

- All mutation types exhausted before convergence: emit `maxIterationsReached` with exhausted-mutations annotation; do not loop indefinitely.
- Coverage graph file missing at session start: create a fresh graph; do not error.

### Trade-Off Detection

- All dimensions improving simultaneously: no trade-off event emitted; this is the ideal case.
- Threshold set to 0.0: every score change triggers trade-off detection; document this footgun in config comments.

### Parallel Waves

- Parallel wave with 2 candidates where both produce regressions: select the least-regressive candidate; emit `regressionDetected` stop-reason if neither exceeds baseline.
- Wave executor unavailable: fall back to single-wave behavior silently; emit a `parallelWaveFallback` journal event.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Files: 16, LOC estimate: ~700, Systems: sk-agent-improver + coverage graph + journal |
| Risk | 15/25 | No auth/API risk; breaking: medium (proposal-only constraint must hold) |
| Research | 12/20 | 042 Phases 1-4 provide proven patterns; adaptation needed, not invention |
| Multi-Agent | 10/15 | Orchestrator + proposal-only agent + journal emit separation |
| Coordination | 10/15 | Dependencies on 042 Phase 1 journal schema and Phase 2 graph API |
| **Total** | **67/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Proposal-only constraint violated if journal emit moves into agent | High | Low | ADR-001; orchestrator-only journal write enforced via code review |
| R-002 | Coverage graph namespace collision with deep-research/review paths | Medium | Low | `loop_type: "improvement"` namespace isolation; tested in mutation-coverage.vitest.ts |
| R-003 | Weight optimizer recommendations auto-applied | High | Low | Explicit approval gate in REQ-AI-012; no auto-apply code path |
| R-004 | Parallel wave activation in low-exploration sessions causing noise | Medium | Medium | Exploration-breadth gate (REQ-AI-010); default `enabled: false` |
| R-005 | Trajectory false convergence on noisy scores | Medium | Medium | Minimum 3 data points requirement (REQ-AI-007) |

---

## 11. USER STORIES

### US-001: Auditable Improvement Session (Priority: P0)

**As a** developer running an agent improvement session, **I want** every session to produce a structured audit journal, **so that** I can reconstruct exactly what mutations were tried, how they scored, and why the session stopped.

**Acceptance Criteria**:
1. Given a completed improvement session, When I read the journal file, Then it contains at least one event per iteration plus a session-ended event with a stop-reason.
2. Given a session that terminated due to a regression, When I read the journal, Then the stop-reason is `regressionDetected` and the offending dimension scores are recorded.

---

### US-002: Resumable Improvement Session (Priority: P0)

**As a** developer whose improvement session was interrupted, **I want** to resume from the last checkpoint by passing the prior session-id, **so that** I do not repeat completed iterations.

**Acceptance Criteria**:
1. Given a session-id from a prior partial run, When I start a new session with that id, Then the orchestrator replays journal state and the iteration counter starts where the prior run left off.
2. Given a resumed session, When it completes, Then the final journal contains events from both the prior run and the resumed run in chronological order.

---

### US-003: Trade-Off Awareness (Priority: P1)

**As a** developer reviewing improvement results, **I want** the system to flag when one dimension improves at the cost of another, **so that** I can make an informed decision about whether to accept the trade-off.

**Acceptance Criteria**:
1. Given a candidate where clarity improves by 0.15 and integration regresses by 0.12 (above default threshold), When the trade-off detector runs, Then a `trade-off-detected` event appears in the journal with both dimensions named.
2. Given thresholds configured at 0.20, When both deltas are below 0.20, Then no trade-off event is emitted.

---

### US-004: Mutation Space Exhaustion (Priority: P1)

**As a** developer running long improvement sessions, **I want** the system to track which mutation types have been fully explored, **so that** the session terminates cleanly rather than looping on exhausted strategies.

**Acceptance Criteria**:
1. Given all mutation types for a dimension marked exhausted, When the orchestrator selects the next mutation, Then it skips exhausted types and annotates the journal with the exhausted-mutations set.
2. Given all dimensions fully exhausted, When the session evaluates stop conditions, Then it emits `maxIterationsReached` with an exhausted-mutations annotation rather than looping.

---

### US-005: Scoring Weight Optimization (Priority: P1)

**As a** developer who has run 10+ improvement sessions, **I want** the system to analyze historical session data and recommend per-dimension weight adjustments, **so that** future sessions score more accurately against the patterns I care about.

**Acceptance Criteria**:
1. Given the configured session count threshold is reached, When the weight optimizer runs, Then it emits a weight-recommendation report showing current vs. recommended weights with supporting evidence.
2. Given the report is produced, When I review it, Then no weights are auto-applied until I explicitly approve them.

---

### US-006: Benchmark Stability Verification (Priority: P2)

**As a** developer calibrating the scoring system, **I want** a benchmark replay stability measurement, **so that** I know whether score variability comes from the agent or from scoring noise.

**Acceptance Criteria**:
1. Given a benchmark replayed 3 times with identical input, When stability is measured, Then the script reports a stability coefficient per dimension.
2. Given a coefficient below the configured threshold, When the session runs, Then a `stabilityWarning` event appears in the journal.

---

## 12. OPEN QUESTIONS
<!-- ANCHOR:questions -->

- Should the improvement journal share the same file path convention as the deep-research/deep-review journals, or use a separate directory under the skill? Recommendation: use a skill-local path (`~/.agent-improver/sessions/{session-id}/`) consistent with the packet-local discipline.
- What is the correct exploration-breadth score formula for the parallel wave activation gate? The 042 Phase 3 wave executor provides a reference; align or adapt?
- Should the weight optimizer write its recommendations into the journal or into a separate report file? Separate file is cleaner for human review; journal entry for machine auditability.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Parent Packet**: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/spec.md`
- **Phase 1 (Runtime Truth Foundation)**: `../001-runtime-truth-foundation/spec.md`
- **Phase 2 (Semantic Coverage Graph)**: `../002-semantic-coverage-graph/spec.md`
- **Phase 3 (Wave Executor)**: `../003-wave-executor/spec.md`
- **Phase 4 (Offline Loop Optimizer)**: `../004-offline-loop-optimizer/spec.md`
