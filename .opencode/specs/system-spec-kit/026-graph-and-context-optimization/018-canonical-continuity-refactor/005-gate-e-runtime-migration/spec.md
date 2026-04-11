---
title: "Feature Specification: Gate E — Runtime Migration [system-spec-kit/026-graph-and-context-optimization/018-canonical-continuity-refactor/005-gate-e-runtime-migration/spec]"
description: "Promote canonical continuity from shadow-only rollout buckets to canonical default, then align the command, agent, skill, and documentation surfaces to the shipped runtime semantics."
trigger_phrases:
  - "gate e"
  - "runtime migration"
  - "canonical continuity"
  - "phase 018"
  - "feature flag rollout"
importance_tier: "important"
contextType: "implementation"
---
# Feature Specification: Gate E — Runtime Migration

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Gate E is the runtime cutover for phase 018. The new continuity path has already been proven in shadow and reader mode, so this phase advances the rollout state machine from `shadow_only` through the dual-write buckets into `canonical`, then updates the 160-plus command, agent, skill, and documentation surfaces to describe the new default honestly.

**Key Decisions**: batch the 8 CLI handback files with the settled Gate C `generate-context.js` contract, and keep `legacy_cleanup` out of the default Gate E critical path.

**Critical Dependencies**: Gates A-D closed, dual-write shadow stable for at least 7 days, the resource-map file matrix, and the iteration-034/040 telemetry plus rollback contract.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-04-11 |
| **Branch** | `main` |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 018 proves the writer and reader paths before the runtime default changes, but Gate E is where the contract becomes user-visible. Without a controlled state-machine flip and synchronized doc-surface rewrite, the runtime could say `canonical` while 160-plus command, agent, skill, and README surfaces still teach shadow-era behavior.

### Purpose
Make `canonical` the default continuity mode, keep rollback and telemetry armed during the 7-day proving window, and bring every operator-facing surface into parity with the shipped runtime behavior described in iteration 034, iteration 040, and resource-map sections 2, 8.1, 8.2, and 8.5.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Gate E uses the full 8-state inventory from iteration 034 section 2: `S0 disabled` (fallback/off), `S1 shadow_only` (mirror-only compare mode), `S2 dual_write_10pct` (10 percent proving), `S3 dual_write_50pct` (50 percent proving), `S4 dual_write_100pct` (full dual-write proof), `S5 canonical` (default-serving), `S6 legacy_cleanup` (post-Gate-F permanence cleanup), and `S7 rolled_back` (transient safety latch that resolves to a named fallback target).
- Advance `canonical_continuity_rollout` through `dual_write_10pct`, `dual_write_50pct`, `dual_write_100pct`, and `canonical` using the holds, cool-down windows, and rollback rules from iteration 034.
- Update the full Gate E surface inventory: commands, agents, workflow YAMLs, top-level docs, 19 memory-relevant sub-READMEs, and 92 doc-parity README surfaces tracked in the resource map.
- Synchronize the 8 CLI handback files with the final `generate-context.js` JSON contract before the broad documentation batch lands.
- Resource-map arithmetic remains traceable: 50 command and agent surfaces plus 71 skill-surface rows plus 19 memory-relevant READMEs plus 92 doc-parity README touches yield about 232 raw candidates, which collapse to about 160 actionable Gate E edits after overlap and no-change exclusions are applied.

### Out of Scope
- Re-opening writer or reader architecture from Gates C-D. Gate E consumes those contracts; it does not redesign them.
- Ad hoc archive fallback tuning during the first canonical window. Iteration 040 freezes that work behind evidence reviews.
- Mandatory transition into `legacy_cleanup`. That state belongs to Gate F unless week-3 evidence plus permanence approval already exist.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/command/memory/*.md` | Modify | Update save/search/manage/learn semantics for canonical continuity |
| `.opencode/command/spec_kit/*.md` and `assets/*.yaml` | Modify | Align resume, handover, plan, implement, complete, deep-research, and deep-review flows |
| `.opencode/agent/*.md` | Modify | Retarget agent guidance to canonical-first continuity behavior |
| `.opencode/skill/sk-*/**` and `.opencode/skill/system-spec-kit/**` | Modify | Update skill guidance, especially the 8 CLI handback files and 19 memory-relevant sub-READMEs |
| Top-level docs and operator references | Modify | Keep the root instructions, architecture guide, install guide, and MCP server overview consistent with the runtime state machine |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Promote the rollout state machine safely into `canonical` | The runtime advances through 10, 50, 100, and `canonical` only after each hold window and without tripping iteration-034 rollback rules |
| REQ-002 | Keep rollback and telemetry live through the proving window | No blackout-window violation occurs, rollback remains available, and week-2/week-4 evidence checkpoints exist per iteration 040 |
| REQ-003 | Update every required Gate E surface | All 160-plus command, agent, skill, and doc surfaces mapped in resource-map sections 2, 8.1, 8.2, and 8.5 are touched or explicitly marked no-change by the file matrix |
| REQ-004 | Hold `canonical` for at least 7 days before claiming Gate E complete | `canonical` stays healthy for at least 7 days and no critical alert or auto-rollback event remains open |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Coordinate the 8 CLI handback files with the final `generate-context.js` contract | All `cli-*` skill docs and prompt-template assets match the shipped JSON contract in one batch |
| REQ-006 | Rewrite the 19 memory-relevant sub-READMEs and touch the 92 doc-parity sub-READMEs | The memory-relevant set is rewritten for canonical continuity and the doc-parity set receives terminology parity where required |
| REQ-007 | Keep archive fallback tuning evidence-driven | `archived_hit_rate` and by-intent review checkpoints stay live, and no unlogged tuning change lands during the initial canonical window |
| REQ-008 | Defer `legacy_cleanup` unless Gate F permanence conditions are met | Gate E closes in `canonical` unless the separate permanence approval allows the optional cleanup move |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `canonical` becomes the default continuity state and remains healthy for at least 7 days with rollback still armed.
- **SC-002**: All mapped Gate E surfaces describe canonical-first behavior, including the CLI handback protocol and memory-relevant README set.
- **SC-003**: Metrics stay inside the iteration-033 and iteration-034 alert thresholds, with no unresolved correctness-loss or parity incident.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Gate D proof package | Canonical promotion is invalid if reader metrics or dual-write evidence are incomplete | Require Gates A-D closed and reuse iteration-040 week-1 blocker review before promotion |
| Dependency | Impact-analysis artifact plus resource-map matrix | Broad doc parity can miss surfaces without a locked file matrix | Treat the artifact as a Gate E scope authority and block repo-wide parity work until cited |
| Risk | CLI handback contract drifts from `generate-context.js` | External AI handback flows could regress even if core runtime is healthy | Update all 8 CLI files in one batch after the Gate C contract settles |
| Risk | Metrics look healthy while docs lag behind | Operators could follow stale instructions during the migration window | Group updates by surface and track completion against the resource-map batches, not by ad hoc grep |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: While `S5 canonical` is active, Gate E must stay below the exact iteration-034 section 4 post-flip rollback thresholds: `resume.path.total p95 <= 1000ms` unless it also remains within the allowed `<=2x` 7-run baseline guard, `validator.rollback.fingerprint rate = 0`, and `search.shadow.diff divergence rate <= 3%` with no correctness-loss mismatch. Any breach demotes `S5 -> S4`, except a global post-flip fingerprint failure which may demote `S5 -> S1`.

### Security
- **NFR-S01**: Every promotion, freeze, rollback, or override must remain audit-logged with actor, reason, and incident or ticket reference.

### Reliability
- **NFR-R01**: Cool-down windows, blackout windows, and auto-rollback rules remain enabled for the entire Gate E proving window.

---

## 8. EDGE CASES

### Rollout Boundaries
- A warning-only threshold breach can pause promotion, but it must not silently skip a hold window.
- A post-flip correctness-loss event forces rollback even if doc updates are already in progress.

### Documentation Drift
- The broad parity batch cannot start from grep memory alone; it must follow the resource-map file matrix and the impact-analysis exclusions.
- If the `generate-context.js` schema changes late, the CLI handback files must be re-batched before Gate E can close.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 23/25 | 160-plus shallow edits across commands, agents, skills, docs, and README surfaces |
| Risk | 21/25 | Runtime default flip, rollback policy, and external CLI handback coordination |
| Research | 11/20 | Bound strongly to iteration 014, 018, 020, 030, 034, and 040 |
| Multi-Agent | 7/15 | Parallel surface batches are possible, but the runtime contract is centralized |
| Coordination | 12/15 | Runtime state, telemetry, `generate-context.js`, and doc parity must land in sync |
| **Total** | **74/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Promotion reaches `canonical` before the doc surface says the same thing | High | Medium | Tie closeout to the full resource-map matrix and keep parity batches visible by surface |
| R-002 | CLI handback docs lag behind the shipped `generate-context.js` contract | High | Medium | Treat the 8 CLI files as one lockstep batch with explicit verification |
| R-003 | Archive fallback tuning starts too early and hides a real regression | Medium | Medium | Freeze tuning during the initial canonical window and require week-2/week-4 evidence reviews |

---

## 11. USER STORIES

### US-001: Operator Promotes the Runtime Safely (Priority: P0)

**As a** rollout operator, **I want** the feature flag to advance through the canonical buckets with explicit holds and rollback rules, **so that** Gate E proves the new default instead of gambling on a single flip.

**Acceptance Criteria**:
1. Given healthy metrics and cleared hold windows, When the operator promotes from one bucket to the next, Then the state machine follows iteration-034 transitions and records the move.

---

### US-002: Documentation Consumer Sees the New Truth (Priority: P0)

**As a** command or skill user, **I want** the repo docs to describe canonical continuity as the default behavior, **so that** I do not keep following shadow-era guidance after the runtime has changed.

**Acceptance Criteria**:
1. Given the Gate E parity batch is complete, When a user reads commands, agents, skills, top-level docs, or memory-relevant READMEs, Then the language matches the canonical runtime contract.

---

### US-003: External AI Handback Stays Compatible (Priority: P1)

**As a** user of the `cli-*` delegation skills, **I want** the Memory Handback Protocol to stay aligned with `generate-context.js`, **so that** cross-AI save flows continue to work during and after the runtime cutover.

**Acceptance Criteria**:
1. Given the Gate C save contract is final, When the 8 CLI handback files are updated, Then they all document the same JSON schema, invocation path, and follow-up indexing behavior.

---

### Acceptance Scenarios

- **Given** Gates A-D are closed, **When** Gate E starts, **Then** the first rollout action is the 10 percent bucket, not a direct jump to `canonical`.
- **Given** a promotion hold window is still open, **When** an operator tries to advance the feature flag, **Then** the migration pauses instead of skipping the required observation period.
- **Given** the runtime is in `canonical`, **When** a correctness-loss or fingerprint rollback event fires, **Then** rollback takes priority over the remaining doc batch.
- **Given** the parity sweep is running, **When** a command or skill surface is updated, **Then** the wording matches the canonical continuity contract and the resource-map matrix records the touch.
- **Given** the CLI handback contract changes late, **When** the prompt-template batch has not landed yet, **Then** the 8 CLI files are re-synced before Gate E can close.
- **Given** week-3 evidence is healthy but permanence approval is missing, **When** Gate E closes, **Then** the final state remains `canonical` and the `legacy_cleanup` move is handed to Gate F.

---

### AI Execution Protocol

### Pre-Task Checklist

- Reconfirm Gate D is closed and the shadow window has at least 7 stable days before touching runtime state.
- Re-read `../resource-map.md` plus the impact-analysis artifact before starting any wide parity batch.
- Freeze the final `generate-context.js` contract before editing the CLI handback surfaces.

### Execution Rules

| Rule ID | Rule | Why |
|---------|------|-----|
| AI-SCOPE-018E | Follow the resource-map file matrix for every parity edit | Prevents missing or invented surfaces during the 160-plus file sweep |
| AI-STATE-018E | Do not skip rollout buckets or hold windows | Preserves the iteration-034 safety model |
| AI-CLI-018E | Update the 8 CLI handback files in one batch after the contract freezes | Prevents cross-AI handback drift |
| AI-EVIDENCE-018E | Capture dashboard, playbook, and rollback evidence alongside the doc batch | Keeps Gate E grounded in runtime proof instead of wording alone |

### Status Reporting Format

- Start state: active rollout bucket, current hold window, and parity surface group.
- Work state: which batch is changing and which evidence source proves it.
- End state: promoted, held, rolled back, or blocked.

### Blocked Task Protocol

1. Stop if a required edit depends on a still-moving Gate C contract or a missing impact-analysis artifact.
2. Record the blocked surface group and the missing prerequisite in the packet tracker.
3. Resume only after the contract or evidence source is stable again.

---

## 12. OPEN QUESTIONS

- None for scope population. Gate E explicitly defers `legacy_cleanup` to the optional path unless Gate F permanence evidence is already approved.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Parent Grounding**: `../implementation-design.md`, `../resource-map.md`, and research iterations 014, 018, 020, 030, 034, 040
