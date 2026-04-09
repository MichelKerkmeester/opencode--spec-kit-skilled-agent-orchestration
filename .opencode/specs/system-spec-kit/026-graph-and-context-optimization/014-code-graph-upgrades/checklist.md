---
title: "Verification Checklist: Code Graph Upgrades [template:level_3/checklist.md]"
description: "Verification checklist for 014-code-graph-upgrades."
trigger_phrases:
  - "014-code-graph-upgrades"
  - "verification"
  - "checklist"
importance_tier: "important"
contextType: "verification"
---
# Verification Checklist: Code Graph Upgrades

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

- [ ] CHK-001 [P0] Spec, plan, and tasks preserve the same post-R5/R6 side-branch boundary. [SOURCE: spec.md:1] [SOURCE: plan.md:1] [SOURCE: tasks.md:1]
- [ ] CHK-002 [P0] Packets `007` and `011` are named as hard predecessors before implementation starts. [SOURCE: spec.md:24] [SOURCE: plan.md:123]
- [ ] CHK-003 [P1] Packet `008` remains explicitly out of scope for runtime nudges. [SOURCE: spec.md:40] [SOURCE: decision-record.md:90]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Detector outputs distinguish `ast`, `structured`, `regex`, or `heuristic` provenance without mislabeling fallback paths. [SOURCE: spec.md:74]
- [ ] CHK-011 [P0] Blast-radius traversal enforces depth before inclusion and supports explicit multi-file union semantics. [SOURCE: spec.md:75]
- [ ] CHK-012 [P1] Hot-file breadcrumbs stay explicitly low-authority in wording and placement. [SOURCE: spec.md:81]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Frozen detector fixtures prove fallback states survive serialization. [SOURCE: spec.md:77] [SOURCE: plan.md:112]
- [ ] CHK-021 [P0] A frozen blast-radius corpus proves nodes beyond `maxDepth` never surface. [SOURCE: spec.md:75] [SOURCE: spec.md:96]
- [ ] CHK-022 [P0] Graph payload snapshots prove edge evidence and numeric confidence stay additive on current owners. [SOURCE: spec.md:76] [SOURCE: spec.md:97]
- [ ] CHK-023 [P1] If fallback tiering ships, forced-degrade tests cover compile-probe miss, missing table or index, and runtime ranking failure. [SOURCE: spec.md:82]
- [ ] CHK-024 [P1] `validate.sh --strict` passes on the packet folder before completion is claimed. [SOURCE: plan.md:42]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No new graph-only authority surface or replacement router appears. [SOURCE: spec.md:69] [SOURCE: decision-record.md:34]
- [ ] CHK-031 [P1] Additive metadata stays on current owner payloads after packet `011`. [SOURCE: spec.md:76] [SOURCE: decision-record.md:35]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Packet docs remain synchronized with the copied §20 roadmap language. [SOURCE: spec.md:29] [SOURCE: plan.md:28] [SOURCE: tasks.md:31]
- [ ] CHK-041 [P1] ADRs document the dependency on `011`, the non-overlap with `008`, and the prototype-later treatment of routing facade, Leiden clustering, and GraphML/Cypher exports. [SOURCE: decision-record.md:14] [SOURCE: decision-record.md:89] [SOURCE: decision-record.md:166]
- [ ] CHK-042 [P2] Parent packet DAG entry remains aligned with the side-branch placement. [SOURCE: ../spec.md:15]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Packet-local docs remain placeholder-free even before implementation starts. [SOURCE: implementation-summary.md:16]
- [ ] CHK-051 [P1] Packet-local memory artifacts stay inside `014-code-graph-upgrades/memory/` only. [SOURCE: implementation-summary.md:42]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 0/8 |
| P1 Items | 9 | 0/9 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-04-09
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] ADRs preserve the packet's dependency and authority boundaries. [SOURCE: decision-record.md:31] [SOURCE: decision-record.md:90]
- [ ] CHK-101 [P1] Alternatives are documented with clear reject or prototype-later rationale. [SOURCE: decision-record.md:48] [SOURCE: decision-record.md:125]
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Performance and precision claims stay bounded and honest. [SOURCE: spec.md:117] [SOURCE: spec.md:129]
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure exists before implementation begins. [SOURCE: plan.md:129]
- [ ] CHK-121 [P1] Activation gates name the required fixture, snapshot, and strict-validation checks. [SOURCE: plan.md:108]
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] The packet stays inside current runtime and documentation boundaries without touching any `external/` tree. [SOURCE: spec.md:40] [SOURCE: implementation-summary.md:23]
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All packet docs are synchronized. [SOURCE: spec.md:29] [SOURCE: plan.md:28] [SOURCE: tasks.md:31]
- [ ] CHK-141 [P2] The parent 026 DAG entry records the new side-branch relationship accurately. [SOURCE: ../spec.md:15]
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Codex | Technical Lead | [ ] Pending | 2026-04-09 |
| Codex | Packet Owner | [ ] Pending | 2026-04-09 |
<!-- /ANCHOR:sign-off -->
