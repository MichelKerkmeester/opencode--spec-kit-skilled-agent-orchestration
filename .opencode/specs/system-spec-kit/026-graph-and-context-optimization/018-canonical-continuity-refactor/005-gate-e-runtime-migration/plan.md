---
title: "Implementation Plan: Gate E — Runtime Migration [system-spec-kit/026-graph-and-context-optimization/018-canonical-continuity-refactor/005-gate-e-runtime-migration/plan]"
description: "Execute the canonical rollout state machine, batch the doc-surface updates by resource-map group, and keep rollback plus telemetry active throughout the Gate E proving window."
trigger_phrases:
  - "implementation plan"
  - "gate e"
  - "runtime migration"
  - "canonical rollout"
  - "phase 018"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Plan: Gate E — Runtime Migration

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Markdown, YAML, shell validation |
| **Framework** | system-spec-kit plus Spec Kit Memory MCP |
| **Storage** | SQLite feature-flag and telemetry state, spec-doc markdown surfaces |
| **Testing** | Vitest, `validate.sh --strict`, dashboards, regression suites, manual playbooks |

### Overview
Gate E follows the rollout control-plane defined in `../research/iterations/iteration-034.md` and the SLA handover in `../research/iterations/iteration-040.md`. Week 1 proves `dual_write_10pct` and `dual_write_50pct`, week 2 proves `dual_write_100pct` and enters `canonical`, and week 3 finishes the broad surface rewrite plus the 7-day canonical observation while keeping rollback, blackout, and archive-review rules active.

Post-flip rollback remains literal to iteration 034 section 4: while `S5 canonical` is active, `resume.path.total p95 > 1000ms` once or `>2x` the 7-run baseline on 2 runs demotes `S5 -> S4`; any non-zero `validator.rollback.fingerprint rate` demotes `S5 -> S4`, with the documented exception to `S1` when the failure is global; and `search.shadow.diff divergence rate > 3%` or any correctness-loss mismatch demotes `S5 -> S4`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement, scope, and exit gate are documented in this phase folder.
- [x] Entry gate is explicit: Gates A-D closed and dual-write shadow stable for at least 7 days.
- [x] Dependencies are grounded in `../implementation-design.md`, `../resource-map.md`, and the parent research iterations.

### Definition of Done
- [ ] `canonical` is the default and remains healthy for at least 7 days.
- [ ] All required resource-map surfaces are updated or explicitly accounted for in the file matrix.
- [ ] CLI handback files, manual playbooks, and dashboard evidence agree on the final runtime contract.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Feature-flagged staged migration with audit-backed parity batches.

### Key Components
- **Rollout controller**: advances `canonical_continuity_rollout` through the bucketed states and enforces cool-down, blackout, and rollback rules.
- **Surface batches**: group commands and agents, skills and system-spec-kit references, then top-level docs and README parity work from the resource map.
- **CLI handback contract**: keeps the 8 `cli-*` files in lockstep with the Gate C `generate-context.js` JSON schema.
- **Telemetry and reviews**: dashboard spans, week-2 and week-4 archive reviews, and manual playbooks prove the state change is safe.

### Data Flow
Runtime evidence enters through the rollout state machine and telemetry spans, promotion decisions gate the doc-parity batches, and the resulting canonical contract is then reflected across commands, agents, skills, and README surfaces. If any correctness-loss or severe latency event fires, rollback takes precedence over finishing the doc batch.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Week 1 rollout proof
- [ ] Promote `shadow_only -> dual_write_10pct`, observe 24h, and verify no divergence alarms.
- [ ] Promote `dual_write_10pct -> dual_write_50pct`, observe 24h, and capture dashboard evidence.
- [ ] Confirm the impact-analysis matrix remains the scope authority before wide parity edits begin.

### Phase 2: Week 2 canonical cutover
- [ ] Promote `dual_write_50pct -> dual_write_100pct`, observe 48h, and keep rollback quiet.
- [ ] Promote `dual_write_100pct -> canonical` and keep the legacy path read-only for verification.
- [ ] Start the doc-parity batches in resource-map order: commands and agents first, then skills plus system-spec-kit, then top-level docs and README surfaces.

### Phase 3: Week 3 parity closeout
- [ ] Finish all 160-plus mapped updates, including the 19 memory-relevant README rewrites and 92 doc-parity touches.
- [ ] Update the 8 CLI handback files in one lockstep pass against the shipped `generate-context.js` contract.
- [ ] Hold `canonical` for at least 7 days, prepare the optional `legacy_cleanup` handoff, and close only if the Gate E checklist is satisfied.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Integration | Rollout transitions, rollback, and state-machine evidence | runtime dashboards plus transition audit logs |
| Regression | 13 preserved features and CLI handback contract | Vitest suites and focused contract checks |
| Documentation | Phase docs plus all updated command/skill/README surfaces | `.opencode/skill/system-spec-kit/scripts/spec/validate.sh --strict` plus `../resource-map.md` sweeps |
| Manual | Save, resume, search, and operator playbooks | manual playbooks from Gate D and iteration-034 canonical-flip checks |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Gates A-D completion and 7-day dual-write proof | Internal | Green | Gate E cannot start or promote safely |
| `../resource-map.md` plus impact-analysis artifact | Internal | Green | Broad parity work risks missing required surfaces |
| Final Gate C `generate-context.js` contract | Internal | Yellow | CLI handback files cannot be closed with confidence until the schema is frozen |
| Iteration-033/034 dashboards and rollback wiring | Internal | Green | Canonical proving window would lack trustworthy evidence |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any correctness-loss breach, severe latency regression, fingerprint rollback event, or blackout-window violation defined in iteration 034.
- **Procedure**: For the `S5 canonical` window, follow the exact iteration-034 section 4 demotions: `resume.path.total p95 > 1000ms` once or `>2x` the 7-run baseline on 2 runs rolls back `S5 -> S4`; any non-zero `validator.rollback.fingerprint rate` rolls back `S5 -> S4`, or `S5 -> S1` if the failure is global; and `search.shadow.diff divergence rate > 3%` or any correctness-loss mismatch rolls back `S5 -> S4`. Pause promotions for the required freeze window, keep the legacy verification path available, and defer any unfinished parity batch until the incident evidence is reviewed.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Week 1 rollout proof ──► Week 2 canonical cutover ──► Week 3 parity closeout
         │                         │                           │
         └──────── dashboard + impact-analysis evidence ──────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Week 1 rollout proof | Gates A-D, dual-write stability, dashboards | Canonical cutover |
| Week 2 canonical cutover | Week 1 evidence and quiet rollback windows | Broad parity batch and 7-day observation |
| Week 3 parity closeout | Canonical active, file matrix, CLI contract settled | Gate E completion and Gate F handoff |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Week 1 rollout proof | Medium | 4-5 working days with observation windows |
| Week 2 canonical cutover | High | 5-6 working days including the 48h hold |
| Week 3 parity closeout | High | 5-7 working days including 7-day canonical proving window overlap |
| **Total** | | **~3 weeks** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Rollout dashboard, rollback events, and archive-review panels are healthy.
- [ ] Feature flag storage reflects the expected prior state and hold window.
- [ ] Surface-batch tracker is ready so partial parity work can be paused cleanly.

### Rollback Procedure
1. Demote to the last safe rollout bucket recorded by the transition log.
2. Preserve the legacy verification path and stop further parity edits.
3. Capture trigger metric, window, and affected surfaces in the incident notes.
4. Resume work only after the freeze window and evidence review required by iteration 034.

### Data Reversal
- **Has data migrations?** No new schema work in Gate E; it consumes the Gate B substrate.
- **Reversal procedure**: Revert only runtime flag state and doc-surface edits that falsely claim canonical behavior if the system is no longer in `canonical`.
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────────┐
│ Rollout controller   │
└──────────┬───────────┘
           ▼
┌──────────────────────┐
│ Canonical promotion  │────►┌──────────────────────┐
└──────────┬───────────┘     │ Telemetry + reviews  │
           │                 └──────────┬───────────┘
           ▼                            ▼
┌──────────────────────┐     ┌──────────────────────┐
│ Surface parity batch │────►│ Gate E closeout      │
└──────────────────────┘     └──────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Rollout controller | Gate D proof, iteration-034 rules | Safe state transitions | Canonical cutover |
| Canonical promotion | Week 1 and Week 2 holds | Default runtime truth | Surface parity completion |
| Surface parity batch | Resource-map matrix and CLI contract | Updated commands, agents, skills, docs | Gate E closeout |
| Telemetry and reviews | Dashboard wiring and manual playbooks | Evidence for stability | Gate E closeout and Gate F handoff |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Week 1 bucket promotions and 24h holds** - 2-3 days active work plus observation - CRITICAL
2. **Week 2 `100pct -> canonical` cutover and 48h hold** - 2-3 days active work plus observation - CRITICAL
3. **Week 3 CLI contract sync plus full parity closeout** - 4-5 days overlapping with the 7-day canonical window - CRITICAL

**Total Critical Path**: roughly 3 weeks including required observation windows.

**Parallel Opportunities**:
- Commands and agent docs can update in parallel with system-spec-kit README parity once `canonical` is entered.
- Top-level docs and low-risk README terminology sweeps can run beside the CLI handback batch, but only after the final `generate-context.js` contract is frozen.
<!-- /ANCHOR:critical-path -->

---

### AI Execution Protocol

### Pre-Task Checklist

- Reconfirm `../research/iterations/iteration-034.md` before changing rollout state.
- Re-read `../resource-map.md` and the impact-analysis artifact before starting any wide parity sweep.
- Freeze the final `generate-context.js` contract before touching the CLI handback batch.

### Execution Rules

| Rule ID | Rule | Why |
|---------|------|-----|
| AI-SCOPE-018E | Follow the resource-map file matrix for every parity edit | Prevents missing or invented surfaces during the 160-plus file sweep |
| AI-STATE-018E | Do not skip rollout buckets or hold windows | Preserves the state-machine safety contract |
| AI-CLI-018E | Update the 8 CLI handback files in one batch after the contract freezes | Prevents cross-AI handback drift |
| AI-EVIDENCE-018E | Capture dashboard and playbook evidence beside each rollout milestone | Keeps Gate E grounded in runtime proof instead of wording alone |

### Status Reporting Format

- Start state: active rollout bucket, current hold window, and parity surface group.
- Work state: which batch is changing and which evidence source proves it.
- End state: promoted, held, rolled back, or blocked.

### Blocked Task Protocol

1. Stop if a required edit depends on a still-moving Gate C contract or a missing impact-analysis artifact.
2. Record the blocked surface group and the missing prerequisite in the packet tracker.
3. Resume only after the contract or evidence source is stable again.
