---
title: "Implementation Plan: Gate F — Archive Permanence [template:level_2/plan.md]"
description: "Gate F is a decision-first phase that consumes the already-running 180-day archive observation window. The plan applies iter 036's statistical ladder, assembles the evidence package, and only branches into runtime edits if RETIRE is justified."
trigger_phrases:
  - "gate f plan"
  - "archive permanence plan"
  - "retire keep investigate"
  - "archived_hit_rate evaluation"
importance_tier: "important"
contextType: "general"
---
# Implementation Plan: Gate F — Archive Permanence

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript + Node.js scripting around Spec Kit Memory data |
| **Framework** | Spec packet workflow, iter 036 decision rulebook |
| **Storage** | `memory_index` / `memory_stats` daily archive telemetry |
| **Testing** | Evidence review, conditional live-query verification if RETIRE |

### Overview
Gate F does not start a new experiment. It consumes the 180-day window that began at the Gate B archive flip, normalizes the daily `archived_hit_rate` series, and classifies archive permanence using iter 036's conservative ladder. Most work happens in documentation and evidence assembly; runtime edits stay dormant unless the result is RETIRE and the snapshot safeguards are ready.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Gate E is closed and the archive flag has been live for at least 30 days
- [ ] A full 180-day `archived_hit_rate` daily series is available from Gate B onward
- [ ] Iter 036, iter 020, iter 016, and the resource-map overlap note are cited in the phase docs

### Definition of Done
- [ ] The decision ladder result is recorded with trend, slice, and query evidence
- [ ] Conditional follow-up matches the result: RETIRE, KEEP, INVESTIGATE, or ESCALATE
- [ ] All five phase documents remain synchronized and scoped to Gate F only
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Statistical decision gate with conditional retirement branch

### Key Components
- **Daily metric extraction**: pulls the 180-day `archived_hit_rate` series and eligibility metadata.
- **Trend normalizer**: applies weekly seasonality correction, EWMA `alpha=0.1`, variance bounds, and slope checks.
- **Decision ladder**: classifies RETIRE, KEEP, INVESTIGATE, or ESCALATE using iter 036 section 6.
- **Evidence package**: captures the 90-day trend view, slice breakdowns, top 20 archive-only queries, fresh-doc comparisons, and cost notes.

### Data Flow
Gate B telemetry feeds the daily series, iter 036 transforms it into an auditable classification, and the resulting evidence drives either a no-code closure or a tightly scoped retirement branch.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Evidence Collection
- [ ] Confirm the observation window start date and pull the 180-day daily series
- [ ] Mark eligible, ineligible, and anomaly days per iter 036 floors
- [ ] Collect query-intent, spec-family, and archive-only query breakdowns

### Phase 2: Decision Classification
- [ ] Apply weekly seasonality correction and EWMA `alpha=0.1`
- [ ] Check 30-day streak, rolling standard deviation, max raw-rate spike, and 14-day slope
- [ ] Write the outcome and supporting evidence into `implementation-summary.md`

### Phase 3: Conditional Follow-up
- [ ] If RETIRE, implement the minimal runtime cleanup and snapshot path
- [ ] If KEEP, document the permanent thin-layer rationale with no runtime edits
- [ ] If INVESTIGATE or ESCALATE, open the required follow-up and stop retirement work
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Analytical | EWMA, variance, seasonality, and streak calculations | Iter 036 rulebook + metric export |
| Integration | Fresh-doc comparison for archive-only queries | Search result inspection against current docs |
| Manual | Live query verification, only if RETIRE | Operator query replay against the runtime search path |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `research/iterations/iteration-036.md` | Internal | Green | Without it, "stable" is too vague to automate safely. |
| `resource-map.md` Gate F overlap note | Internal | Green | Missing it would wrongly restart the observation clock. |
| `archived_hit_rate` daily metric source | Internal | Yellow | Missing data forces ESCALATE and blocks retirement. |
| Phase 021 Option F sibling packet | Internal | Yellow | Needed only if RETIRE is supported and approved. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: RETIRE was chosen, but post-decision replay or human review finds archive dependence or snapshot gaps.
- **Procedure**: Re-enable archived candidate generation, restore the `0.3x` archive weighting model, and recover archived rows from the cold snapshot before restarting a shorter observation cycle.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Evidence) ───────────────► Phase 2 (Decision) ──────────────► Phase 3 (Conditional action)
          │                                      │
          └──────── query/slice package ─────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Evidence Collection | Gate E closure + 180-day window | Decision Classification |
| Decision Classification | Evidence Collection | Conditional Follow-up |
| Conditional Follow-up | Decision Classification | Gate F closeout |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Evidence Collection | Medium | 4-6 days active work |
| Decision Classification | Medium | 3-5 days active work |
| Conditional Follow-up | Low to Medium | 3-5 days active work, only heavier on RETIRE |
| **Total** | | **~3 weeks active work inside the longer 180-day window** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Cold snapshot path identified for archived rows
- [ ] Human review package prepared with trend and query evidence
- [ ] Live query replay plan ready if RETIRE is selected

### Rollback Procedure
1. Freeze the RETIRE rollout and re-open archived participation in candidate generation.
2. Restore archived rows from the snapshot manifest if any live index material was removed.
3. Re-run archive-only query checks to confirm the long-tail fallback is back.
4. Reclassify Gate F as ESCALATE or INVESTIGATE and hand the evidence to humans.

### Data Reversal
- **Has data migrations?** Conditional only for RETIRE
- **Reversal procedure**: Recover the archived snapshot, rebuild any removed archive index entries, and restore the legacy retrieval path before a new observation period starts.
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
