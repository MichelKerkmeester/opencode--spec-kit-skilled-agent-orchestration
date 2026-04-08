---
title: "Verification Checklist: Graph-First Routing Nudge [template:level_3/checklist.md]"
description: "Verification checklist for 008-graph-first-routing-nudge."
trigger_phrases:
  - "008-graph-first-routing-nudge"
  - "verification"
  - "checklist"
importance_tier: "important"
contextType: "verification"
---
# Verification Checklist: Graph-First Routing Nudge

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **P0** | HARD BLOCKER | Cannot claim done until complete |
| **P1** | Required | Complete or explicitly defer with rationale |
| **P2** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Spec, plan, and tasks describe the same packet boundary
- [ ] CHK-002 [P0] Predecessor packets or runtime audits are identified clearly
- [ ] CHK-003 [P1] Successor-packet handoff is documented
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Runtime or contract changes stay inside the declared owner surfaces
- [ ] CHK-011 [P0] No new competing subsystem or authority surface is introduced
- [ ] CHK-012 [P1] Packet language stays honest about what is and is not shipped
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] The packet's focused test or corpus checks are defined
- [ ] CHK-021 [P0] Required packet-local verification passes
- [ ] CHK-022 [P1] Edge cases and fail-closed behavior are documented
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No new secret-bearing or unsafe output paths are introduced
- [ ] CHK-031 [P1] Data exposure stays within current runtime boundaries
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Packet docs are synchronized
- [ ] CHK-041 [P1] Dependencies and authority boundaries are explicit
- [ ] CHK-042 [P2] Parent-packet trackers updated if needed
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Scratch and memory folders contain only packet-local artifacts
- [ ] CHK-051 [P1] Packet-local docs remain placeholder-free
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 0/7 |
| P1 Items | 6 | 0/6 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-04-08
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] The ADR matches the packet's dependency and authority boundaries
- [ ] CHK-101 [P1] Alternatives are documented with rejection rationale
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Performance implications are documented honestly
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure exists
- [ ] CHK-121 [P1] Activation or rollout gates are named where needed
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] Dependency licenses and runtime boundaries remain compatible
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All packet docs are synchronized
- [ ] CHK-141 [P2] Any required parent tracker updates are recorded
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| [Name] | Technical Lead | [ ] Approved | |
| [Name] | Packet Owner | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
