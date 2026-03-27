---
title: "Implementation Plan: 012 Pre-Release Remediation [template:level_3/plan.md]"
description: "Execution plan for closing the canonical review findings captured under 012-pre-release-remediation/review/."
trigger_phrases:
  - "012 plan"
  - "post-review remediation plan"
  - "canonical review implementation plan"
importance_tier: "high"
contextType: "general"
---
# Implementation Plan: 012 Pre-Release Remediation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown packet docs coordinating TypeScript runtime, tests, validators, wrappers, and feature-catalog remediation |
| **Framework** | system-spec-kit remediation packet driven by the canonical review in `review/` |
| **Storage** | Spec packet docs under `012-pre-release-remediation/`; runtime and test surfaces under `.opencode/skill/system-spec-kit/` |
| **Testing** | `validate.sh`, `validate.sh --recursive`, `npm test`, and targeted Vitest subsets from the canonical review |

### Overview

This plan turns the canonical review into an execution sequence. The current review baseline is still `FAIL` as of **2026-03-27**. The current documentation pass only stages the work; implementation begins after approval.

The work is organized into four review-driven remediation workstreams:

- **WS-1** Runtime/code integrity
- **WS-2** Packet/spec docs truth-sync
- **WS-3** Public docs and wrapper alignment
- **WS-4** Feature verification and tooling contract repair

The active finding load that drives this plan is:

- `14` active `P1`
- `16` active `P2`
- feature-state baseline `191 / 48 / 7 / 9`
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] The canonical review in [`review/review-report.md`](./review/review-report.md) has been read as the authoritative source
- [x] The current packet docs (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`) have been re-anchored to the canonical review
- [x] The normalized feature-state denominator (`255` features, `21` categories, `191/48/7/9`) is known
- [x] The implementation backlog remains staged and unchecked pending explicit go-ahead

### Definition of Done

- [ ] All `P1` findings are fixed or explicitly reclassified by fresh evidence
- [ ] All `P2` findings are fixed, verified, or explicitly accepted with rationale
- [ ] Packet/spec docs, wrapper docs, public docs, and feature-catalog verification surfaces are synchronized to the post-remediation truth
- [ ] Fresh reruns update the canonical review surfaces and support any verdict change
<!-- /ANCHOR:quality-gates -->

---

### AI Execution Protocol

### Pre-Task Checklist

- Confirm the edit stays inside the approved `012-pre-release-remediation` remediation scope.
- Read the canonical `review/review-report.md` and the packet docs before changing wording or status markers.
- Keep runtime, wrapper, and review-surface claims tied to fresh validator or test evidence.
- Re-run the relevant validators before reporting progress.

### Execution Rules

| Rule ID | Rule | Why |
|---------|------|-----|
| AI-SEQ-001 | Execute WS-2 before declaring any packet-level release-story improvement | Packet truth-sync is the prerequisite for trustworthy release-control language |
| AI-SCOPE-001 | Do not treat the historical top-level `review-report.md` as current review authority | The canonical findings live under `review/` |
| AI-EVID-001 | Only mark remediation steps complete when validator or test evidence exists | Prevents synthetic closure |
| AI-COORD-001 | Keep packet, wrapper, and public-doc edits synchronized when they share the same denominator or release claim | Avoids reintroducing drift across surfaces |

### Status Reporting Format

- Start state: which findings or workstream items are being touched.
- Work state: which packet or wrapper files changed and what evidence was refreshed.
- End state: validator and test outcomes, plus any remaining blockers.

### Blocked Task Protocol

1. If a file still points at missing or retired packet names, correct the packet-local truth before expanding scope.
2. If validator output conflicts with packet prose, preserve the validator truth and record the contradiction explicitly.
3. If a needed fix falls outside the approved ownership set, stop at the boundary and report the exact blocker.

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Canonical-review-driven remediation packet

### Key Components

- **`review/review-report.md`**: authoritative finding registry, workstreams, baselines, and severity
- **`spec.md`**: remediation contract and scope boundary
- **`plan.md`**: workstream order, phase sequencing, and verification strategy
- **`tasks.md`**: executable backlog that maps every active finding to implementation work
- **`checklist.md`**: verification gates for implementation time
- **Runtime/test surfaces**: the TypeScript handlers, libs, tests, wrappers, and feature-catalog files named by the review findings

### Data Flow

1. The canonical review defines the active finding registry and baseline truth.
2. This packet translates those findings into workstreams, tasks, and checklist gates.
3. Implementation happens by workstream after approval.
4. Fresh reruns update the canonical review artifacts and any release-control verdict change.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 0: Approval Hold And Baseline Replay

- [ ] Confirm implementation go-ahead before changing runtime, wrapper, or public docs
- [ ] Replay the current baseline gates so implementation starts from known evidence
- [ ] Keep the packet verdict `FAIL` until later reruns justify any replacement

### Phase 1: WS-2 Packet/Spec Docs Truth-Sync

- [ ] Fix packet-local validator drift, packet-story contradictions, and canonical review boundary issues inside `012`
- [ ] Update parent-lineage references that still point at retired packet names
- [ ] Keep packet-local release-control wording aligned to the canonical review and fresh validator outputs

### Phase 2: WS-1 Runtime/Code Integrity

- [ ] Fix scope loss in save dedup and PE arbitration
- [ ] Close constitutional cache, custom-path DB integrity, session trust, bulk-delete contract, tool-cache, and logging defects
- [ ] Land the missing direct regression coverage the review identified while runtime fixes are touched

### Phase 3: WS-3 Public Docs And Wrapper Alignment

- [ ] Refresh public README and install surfaces against live repo truth
- [ ] Rebuild wrapper denominators and status claims for `006`, `015`, and root hygiene surfaces
- [ ] Clear release-surface warnings that still block trustworthy release-control summaries

### Phase 4: WS-4 Feature Verification And Tooling Contract Repair

- [ ] Fix the `/memory:learn` docs-alignment regression
- [ ] Repair mismatched feature entries and duplicate ordinals
- [ ] Reduce the under-tested block with direct tests, static proof, or explicit deferrals

### Phase 5: Verification And Release-Control Sync

- [ ] Replay targeted subsystem subsets after each wave
- [ ] Re-run `012` local validation, root `022 --recursive`, and `npm test`
- [ ] Update the canonical `review/` artifacts and packet-local summaries from fresh evidence only
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Baseline replay | Reproduce the current `FAIL/PASS/PASS` review baseline before implementation | `validate.sh`, `validate.sh --recursive`, `npm test` |
| Runtime regression | Save, scope, cache, lifecycle, query, and logging fixes | Targeted Vitest subsets plus any new focused tests |
| Wrapper and public-doc validation | `006`, `015`, root README/install, root 019/020, root 022 plan | Local file review plus packet validators where applicable |
| Feature verification | mismatched and under-tested feature entries | Targeted Vitest, source-audit proof, and explicit deferral notes |
| Final release-gate verification | Full packet and tree-level release sync | `validate.sh`, `validate.sh --recursive`, `npm test` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `review/review-report.md` | Internal | Green | The backlog loses its authoritative finding map |
| Runtime modules and tests cited by `HRF-DR-010` through `HRF-DR-026` | Internal | Green | Runtime findings cannot be remediated or re-verified |
| Public and wrapper docs cited by `HRF-DR-004` through `HRF-DR-009` | Internal | Green | Release surfaces remain untrustworthy |
| Feature catalog and scripts surfaces cited by `HRF-DR-027` through `HRF-DR-030` | Internal | Green | Feature verification debt and tooling drift remain open |
| Validator tooling under `.opencode/skill/system-spec-kit/scripts/spec/` | Internal | Green | The packet cannot prove closure honestly |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A remediation wave creates contradictions with the canonical review, regresses the validator baseline, or introduces new unplanned release blockers.
- **Procedure**: Revert the affected workstream changes, restore the last known good packet/runtime state, replay the baseline gates, and update the packet docs with the actual rollback disposition.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Approval hold and baseline replay | This documentation pass | All implementation phases |
| WS-2 packet/spec truth-sync | Approval hold | Final release-control sync |
| WS-1 runtime/code integrity | Approval hold | Final release-control sync |
| WS-3 public docs and wrapper alignment | Approval hold; may partially depend on WS-1 outputs | Final release-control sync |
| WS-4 feature verification and tooling repair | Approval hold; depends on WS-1 and WS-3 for some evidence | Final release-control sync |
| Verification and release-control sync | WS-1 through WS-4 completion or explicit deferral set | Verdict replacement |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Approval hold and baseline replay | Low | 0.25-0.5 day |
| WS-2 packet/spec truth-sync | Medium | 0.5-1.5 days |
| WS-1 runtime/code integrity | High | 2-5 days |
| WS-3 public docs and wrapper alignment | Medium | 1-2 days |
| WS-4 feature verification and tooling repair | High | 1-3 days |
| Verification and release-control sync | Medium | 0.5-1 day |
| **Total** | | **5.25-13 days** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [ ] The canonical review still matches the active remediation backlog
- [ ] No workstream has silently changed the verdict without rerun evidence
- [ ] Public, wrapper, and feature-catalog surfaces remain traceable to live filesystem truth

### Rollback Procedure

1. Revert the affected remediation wave.
2. Replay the baseline gates for the impacted subsystem or packet surfaces.
3. Update `review/` and packet-local summaries so the rollback is explicit and evidence-backed.

### Data Reversal

- **Has data migrations?** Possibly, depending on runtime fixes
- **Reversal procedure**: Any runtime migration or storage-surface change must define its own bounded reversal steps before landing
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
canonical review in review/
          |
          v
spec + plan + tasks + checklist
          |
          v
 approval + baseline replay
          |
          v
 WS-2 packet truth-sync ----\
 WS-1 runtime fixes ---------+--> targeted reruns --> final gates --> verdict review
 WS-3 public/wrapper docs ---/
 WS-4 feature/tooling repair /
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Review-driven backlog | Canonical review report | Execution-ready packet docs | Implementation start |
| Runtime/code remediation | WS-1 tasks | Fixed source/test surfaces | Final release sync |
| Docs and wrapper remediation | WS-2 and WS-3 tasks | Trustworthy packet/public surfaces | Final release sync |
| Feature verification remediation | WS-4 tasks | Reduced mismatch/under-tested block | Final release sync |
| Final reruns | Completed or explicitly deferred workstreams | Updated release-control truth | Verdict replacement |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Replay baseline and confirm implementation order after approval** - CRITICAL
2. **Close WS-2 packet truth drift so the packet can report remediation honestly** - CRITICAL
3. **Fix the WS-1 runtime `P1` findings and their direct verification debt** - CRITICAL
4. **Repair WS-3/WS-4 release-surface and feature-verification blockers** - CRITICAL
5. **Replay final gates and update release-control truth from fresh evidence** - CRITICAL

**Parallel Opportunities**:
- WS-3 and WS-4 can run partly in parallel once the shared baselines are replayed.
- Some WS-2 packet truth-sync edits can happen alongside WS-1 runtime fixes if they do not depend on final rerun output.
- Under-tested feature reduction can be parallelized by catalog cluster during WS-4.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Review-driven packet staged | `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` all align to the canonical review | Current doc pass |
| M2 | Packet truth-sync wave complete | `012` packet truth and lineage blockers are closed or explicitly re-verified | WS-2 |
| M3 | Runtime/code blockers closed | Active WS-1 `P1` findings are fixed and directly re-tested | WS-1 |
| M4 | Release surfaces and feature verification repaired | WS-3 and WS-4 findings are fixed, deferred with rationale, or materially reduced | WS-3 / WS-4 |
| M5 | Fresh gate truth captured | Final reruns update the packet and justify any verdict change | Phase 5 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

- **ADR-012-R1**: This packet now follows the canonical `review/` report instead of the historical top-level report.
- **ADR-012-R2**: The remediation program is grouped by workstream rather than by predecessor packet lineage.
- **ADR-012-R3**: The packet remains implementation-ready but execution-pending until explicit go-ahead is given.
