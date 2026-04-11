---
title: "Verification Checklist: Gate E — Runtime Migration [system-spec-kit/026-graph-and-context-optimization/018-canonical-continuity-refactor/005-gate-e-runtime-migration/checklist]"
description: "Exit gate for canonical rollout health, surface parity completion, and CLI handback alignment."
trigger_phrases:
  - "verification checklist"
  - "gate e"
  - "runtime migration"
  - "canonical rollout"
importance_tier: "important"
contextType: "implementation"
---
# Verification Checklist: Gate E — Runtime Migration

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Gate E cannot close until complete |
| **[P1]** | Required | Must complete or be explicitly deferred by packet owner |
| **[P2]** | Optional | Track for Gate F if deferred |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Entry gate confirmed: Gates A-D closed and dual-write shadow stable for at least 7 days
- [ ] CHK-002 [P0] Scope authority confirmed: resource-map matrix plus impact-analysis artifact cited for the parity batch
- [ ] CHK-003 [P1] Gate E docs synchronized: `spec.md`, `plan.md`, `tasks.md`, and `decision-record.md` agree on rollout order and exit criteria
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Feature flag reached `canonical` through the approved 10/50/100 progression
- [ ] CHK-011 [P0] All iteration-034 section 4 post-flip auto-rollback rules stayed quiet during the proving window: `resume.path.total p95` never exceeded `1000ms` once or `2x` the 7-run baseline on 2 runs, `validator.rollback.fingerprint rate` stayed at zero, and `search.shadow.diff divergence rate` never exceeded `3%` or produced a correctness-loss mismatch; otherwise the incident is recorded as `S5 -> S4`, or `S5 -> S1` for the documented global fingerprint-failure exception
- [ ] CHK-012 [P1] Blackout and cool-down windows were respected for every promotion
- [ ] CHK-013 [P1] Legacy path remained available as verification substrate until Gate E closeout
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Canonical state remained healthy for at least 7 days
- [ ] CHK-021 [P0] Manual playbooks passed for save, resume, search, and rollout controls
- [ ] CHK-022 [P1] Regression suite remained green for preserved continuity features
- [ ] CHK-023 [P1] Dashboard evidence captured week-2 and week-4 archive or fallback review checkpoints
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] Every promotion, freeze, or rollback has an audit record with actor and reason
- [ ] CHK-031 [P0] No correctness-loss or fingerprint rollback incident remains unresolved; any non-zero post-flip `validator.rollback.fingerprint rate` or correctness-loss mismatch is traced to the exact iteration-034 section 4 demotion target (`S5 -> S4`, or `S5 -> S1` for the documented global-failure exception)
- [ ] CHK-032 [P1] CLI handback contract matches the shipped `generate-context.js` schema
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] All 160-plus mapped command, agent, skill, and doc surfaces are updated
- [ ] CHK-041 [P1] The 19 memory-relevant sub-READMEs are rewritten for canonical behavior
- [ ] CHK-042 [P1] The 92 doc-parity sub-READMEs are touched where terminology changed
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Gate E tracking artifacts stay in approved packet locations only
- [ ] CHK-051 [P1] No stray scratch or draft files remain in the phase folder at closeout
- [ ] CHK-052 [P2] Gate F handoff notes are prepared if `legacy_cleanup` remains deferred
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 0/8 |
| P1 Items | 9 | 0/9 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-04-11
<!-- /ANCHOR:summary -->

---

<!-- Append to Level 2 checklist.md -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] ADR-001 and ADR-002 remain aligned with the live rollout plan
- [ ] CHK-101 [P1] No late runtime rule was invented outside iterations 034 and 040
- [ ] CHK-102 [P1] Optional `legacy_cleanup` move is clearly separated from Gate E closeout
- [ ] CHK-103 [P2] Gate F handoff captures any follow-up on archive permanence or cleanup timing
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] The Gate E post-flip thresholds from iteration-034 section 4 are verified literally: `resume.path.total p95 <= 1000ms` unless the allowed `<=2x` 7-run baseline guard applies, `validator.rollback.fingerprint rate = 0`, and `search.shadow.diff divergence rate <= 3%` with no correctness-loss mismatch; any breach is documented with the required demotion target (`S5 -> S4` or `S5 -> S1` for the global fingerprint-failure exception)
- [ ] CHK-111 [P1] `archived_hit_rate` remains within the acceptable Gate E range
- [ ] CHK-112 [P2] Additional load or soak evidence is captured if week-3 anomalies appear
- [ ] CHK-113 [P2] Benchmark deltas are attached to the Gate E closeout notes
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure was exercised or otherwise proven ready
- [ ] CHK-121 [P0] `canonical_continuity_rollout` reflects the intended final Gate E state
- [ ] CHK-122 [P1] Monitoring and incident hooks are active for the proving window
- [ ] CHK-123 [P1] Operator runbook notes reflect canonical-default behavior
- [ ] CHK-124 [P2] Gate F receives an explicit cleanup recommendation
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] Top-level docs, commands, agents, and skills all describe the same runtime truth
- [ ] CHK-131 [P1] The CLI handback protocol is synchronized across all four CLI skill families
- [ ] CHK-132 [P2] Any operator-facing copy changes were reviewed for terminology drift
- [ ] CHK-133 [P2] Deferred parity items, if any, are logged with owners and follow-up phase
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] Phase docs remain synchronized after the parity batch lands
- [ ] CHK-141 [P1] Memory-relevant README rewrites cover save, search, resume, scoring, storage, and response layers
- [ ] CHK-142 [P2] Low-risk README terminology sweeps were completed or explicitly waived
- [ ] CHK-143 [P2] Gate E handoff material names the next safe action for Gate F
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| [Name] | Runtime Owner | [ ] Approved | |
| [Name] | Documentation Owner | [ ] Approved | |
| [Name] | QA / Operator | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
