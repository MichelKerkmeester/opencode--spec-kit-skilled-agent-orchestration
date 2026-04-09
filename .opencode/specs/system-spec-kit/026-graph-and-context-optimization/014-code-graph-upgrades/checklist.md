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

- [x] CHK-001 [P0] Spec, plan, and tasks preserve the same post-R5/R6 side-branch boundary. [SOURCE: spec.md:1] [SOURCE: plan.md:1] [SOURCE: tasks.md:1] [EVIDENCE: 2837e157a stayed on code-graph-local seams only; packet docs continue to name 014 as a post-R5/R6 side branch]
- [x] CHK-002 [P0] Packets `007` and `011` are named as hard predecessors before implementation starts. [SOURCE: spec.md:24] [SOURCE: plan.md:123] [EVIDENCE: preflight re-verification completed before 2837e157a; spec and plan still name 007 and 011 as required predecessors]
- [x] CHK-003 [P1] Packet `008` remains explicitly out of scope for runtime nudges. [SOURCE: spec.md:40] [SOURCE: decision-record.md:90] [EVIDENCE: 2837e157a avoided startup, resume, compact, and response-surface routing work; ADR-002 remains authoritative]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Detector outputs distinguish `ast`, `structured`, `regex`, or `heuristic` provenance without mislabeling fallback paths. [SOURCE: spec.md:74] [EVIDENCE: 2837e157a; vitest \"serializes structured and heuristic detector provenance honestly on regex-backed edges\"]
- [x] CHK-011 [P0] Blast-radius traversal enforces depth before inclusion and supports explicit multi-file union semantics. [SOURCE: spec.md:75] [EVIDENCE: 2837e157a; vitest \"enforces blast-radius depth before inclusion and unions multiple source files\"; vitest \"returns only the seed node when blast-radius maxDepth is zero\"]
- [x] CHK-012 [P1] Hot-file breadcrumbs stay explicitly low-authority in wording and placement. [SOURCE: spec.md:81] [EVIDENCE: 2837e157a emits hotFileBreadcrumb.changeCarefullyReason as bounded \"change carefully\" guidance instead of an authority score]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Frozen detector fixtures prove fallback states survive serialization. [SOURCE: spec.md:77] [SOURCE: plan.md:112] [EVIDENCE: 2837e157a; vitest \"serializes structured and heuristic detector provenance honestly on regex-backed edges\"]
- [x] CHK-021 [P0] A frozen blast-radius corpus proves nodes beyond `maxDepth` never surface. [SOURCE: spec.md:75] [SOURCE: spec.md:96] [EVIDENCE: 2837e157a; vitest \"enforces blast-radius depth before inclusion and unions multiple source files\"; vitest \"returns only the seed node when blast-radius maxDepth is zero\"]
- [x] CHK-022 [P0] Graph payload snapshots prove edge evidence and numeric confidence stay additive on current owners. [SOURCE: spec.md:76] [SOURCE: spec.md:97] [EVIDENCE: 2837e157a; vitest \"adds nested edge evidence metadata without collapsing trust axes\"; vitest \"emits separate trust axes on code-graph payloads\"]
- [x] CHK-023 [P1] If fallback tiering ships, forced-degrade tests cover compile-probe miss, missing table or index, and runtime ranking failure. [SOURCE: spec.md:82] [EVIDENCE: 2837e157a kept fallback bounded to the existing graph-local parser selector only; no new lexical cascade tier shipped, so the forced-degrade matrix remained not applicable by condition]
- [x] CHK-024 [P1] `validate.sh --strict` passes on the packet folder before completion is claimed. [SOURCE: plan.md:42] [EVIDENCE: bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-code-graph-upgrades --strict -> Errors: 0 Warnings: 0]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No new graph-only authority surface or replacement router appears. [SOURCE: spec.md:69] [SOURCE: decision-record.md:34] [EVIDENCE: 2837e157a enriched existing code-graph owners and query outputs only; no new router or validator family was introduced]
- [x] CHK-031 [P1] Additive metadata stays on current owner payloads after packet `011`. [SOURCE: spec.md:76] [SOURCE: decision-record.md:35] [EVIDENCE: 2837e157a; vitest \"emits separate trust axes on code-graph payloads\"; vitest \"adds nested edge evidence metadata without collapsing trust axes\"]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Packet docs remain synchronized with the copied §20 roadmap language. [SOURCE: spec.md:29] [SOURCE: plan.md:28] [SOURCE: tasks.md:31] [EVIDENCE: implementation closeout updates keep the roadmap wording while recording the shipped adopt-now lane and explicit ADR-003 deferrals]
- [x] CHK-041 [P1] ADRs document the dependency on `011`, the non-overlap with `008`, and the prototype-later treatment of routing facade, Leiden clustering, and GraphML/Cypher exports. [SOURCE: decision-record.md:14] [SOURCE: decision-record.md:89] [SOURCE: decision-record.md:166] [EVIDENCE: ADR-001 through ADR-004 remain unchanged as the packet's implementation fence]
- [x] CHK-042 [P2] Parent packet DAG entry remains aligned with the side-branch placement. [SOURCE: ../spec.md:15] [EVIDENCE: parent 026/spec.md still places 014 as a post-R5/R6 side branch]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Packet-local docs remain placeholder-free even before implementation starts. [SOURCE: implementation-summary.md:16] [EVIDENCE: implementation-summary.md rewritten from planning placeholder to shipped implementation closeout]
- [x] CHK-051 [P1] Packet-local memory artifacts stay inside `014-code-graph-upgrades/memory/` only. [SOURCE: implementation-summary.md:42] [EVIDENCE: memory/09-04-26_10-30__implemented-the-014-code-graph-upgrade-runtime.md saved inside 014-code-graph-upgrades/memory/]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
| P1 Items | 14 | 14/14 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-04-09
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] ADRs preserve the packet's dependency and authority boundaries. [SOURCE: decision-record.md:31] [SOURCE: decision-record.md:90] [EVIDENCE: ADR-001 through ADR-004 remain the implementation boundary for 2837e157a]
- [x] CHK-101 [P1] Alternatives are documented with clear reject or prototype-later rationale. [SOURCE: decision-record.md:48] [SOURCE: decision-record.md:125] [EVIDENCE: ADR-002 and ADR-003 continue to reject routing overlap and defer clustering/export lanes]
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-110 [P1] Performance and precision claims stay bounded and honest. [SOURCE: spec.md:117] [SOURCE: spec.md:129] [EVIDENCE: 2837e157a emits additive detectorProvenance, numericConfidence, and changeCarefullyReason fields instead of new authority scores or unbounded precision claims]
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Rollback procedure exists before implementation begins. [SOURCE: plan.md:129] [EVIDENCE: plan.md rollback and enhanced rollback sections remained in force throughout implementation]
- [x] CHK-121 [P1] Activation gates name the required fixture, snapshot, and strict-validation checks. [SOURCE: plan.md:108] [EVIDENCE: plan.md testing strategy and quality gates still name vitest fixtures, payload snapshots, and validate.sh --strict]
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P1] The packet stays inside current runtime and documentation boundaries without touching any `external/` tree. [SOURCE: spec.md:40] [SOURCE: implementation-summary.md:23] [EVIDENCE: 2837e157a touched only mcp_server code-graph files and packet-local docs; no external/ paths were modified]
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] All packet docs are synchronized. [SOURCE: spec.md:29] [SOURCE: plan.md:28] [SOURCE: tasks.md:31] [EVIDENCE: spec, tasks, checklist, decision-record, and implementation-summary now describe the same shipped adopt-now lane]
- [x] CHK-141 [P2] The parent 026 DAG entry records the new side-branch relationship accurately. [SOURCE: ../spec.md:15] [EVIDENCE: parent 026/spec.md continues to show 014 as the post-R5/R6 side branch]
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Codex | Technical Lead | [x] Approved | 2026-04-09 |
| Codex | Packet Owner | [x] Approved | 2026-04-09 |
<!-- /ANCHOR:sign-off -->
