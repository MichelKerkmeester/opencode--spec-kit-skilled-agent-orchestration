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

- [x] CHK-001 [P0] Spec, plan, and tasks preserve the same post-R5/R6 side-branch boundary. [SOURCE: spec.md:24] [SOURCE: plan.md:123] [SOURCE: tasks.md:31] [EVIDENCE: all shipped runtime edits stayed on code-graph-local detector, payload, and query seams only]
- [x] CHK-002 [P0] Packets `007` and `011` are named as hard predecessors before implementation starts. [SOURCE: spec.md:24] [SOURCE: plan.md:123] [EVIDENCE: spec and plan keep packet `011` as the validator owner, and packet `014` stays bounded to graph-local surfaces.]
- [x] CHK-003 [P1] Packet `008` remains explicitly out of scope for runtime nudges. [SOURCE: spec.md:40] [SOURCE: decision-record.md:89] [EVIDENCE: modified runtime files exclude `hooks/claude/session-prime.ts`, compact surfaces, and response-hint routing surfaces owned by packet `008`]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Detector outputs distinguish `ast`, `structured`, `regex`, or `heuristic` provenance without mislabeling fallback paths. [SOURCE: spec.md:74] [SOURCE: ../../../../../skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:31] [SOURCE: ../../../../../skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:23] [EVIDENCE: detector vocabulary and guards now reject invalid labels and preserve structured fallback honestly]
- [x] CHK-011 [P0] Blast-radius traversal enforces depth before inclusion and supports explicit multi-file union semantics. [SOURCE: spec.md:75] [SOURCE: ../../../../../skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:239] [SOURCE: ../../../../../skill/system-spec-kit/mcp_server/tests/code-graph-query-handler.vitest.ts:148] [EVIDENCE: BFS now stops expanding beyond `maxDepth` and union mode is explicit]
- [x] CHK-012 [P1] Hot-file breadcrumbs stay explicitly low-authority in wording and placement. [SOURCE: spec.md:81] [SOURCE: ../../../../../skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:207] [SOURCE: ../../../../../skill/system-spec-kit/mcp_server/tests/code-graph-query-handler.vitest.ts:186] [EVIDENCE: `hotFileBreadcrumb.changeCarefullyReason` is advisory and never introduces trust or authority fields]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Frozen detector fixtures prove fallback states survive serialization. [SOURCE: spec.md:77] [SOURCE: plan.md:112] [SOURCE: ../../../../../skill/system-spec-kit/scripts/tests/graph-upgrades-regression-floor.vitest.ts.test.ts:49] [EVIDENCE: the regression-floor fixture locks `structured` and `heuristic` fallback expectations]
- [x] CHK-021 [P0] A frozen blast-radius corpus proves nodes beyond `maxDepth` never surface. [SOURCE: spec.md:75] [SOURCE: spec.md:96] [SOURCE: ../../../../../skill/system-spec-kit/scripts/tests/graph-upgrades-regression-floor.vitest.ts.test.ts:59] [EVIDENCE: the frozen blast-radius fixture fails if depth-3 or depth-4 nodes leak past a `maxDepth: 2` query]
- [x] CHK-022 [P0] Graph payload snapshots prove edge evidence and numeric confidence stay additive on current graph owners. [SOURCE: spec.md:76] [SOURCE: spec.md:97] [SOURCE: ../../../../../skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:564] [SOURCE: ../../../../../skill/system-spec-kit/mcp_server/tests/code-graph-query-handler.vitest.ts:133] [EVIDENCE: query-handler snapshots expose `edgeEvidenceClass` and `numericConfidence`, and shared-payload validation keeps them additive on graph-local sections.]
- [x] CHK-023 [P1] If fallback tiering ships, forced-degrade tests cover compile-probe miss, missing table or index, and runtime ranking failure. [SOURCE: spec.md:82] [EVIDENCE: no lexical fallback cascade shipped in `handlers/code-graph/query.ts`, so this conditional gate remained not applicable in the implemented scope]
- [x] CHK-024 [P1] `validate.sh --strict` passes on the packet folder before completion is claimed. [SOURCE: plan.md:42] [EVIDENCE: final closeout includes a passing strict validator run for packet 014]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No new graph-only authority surface or replacement router appears. [SOURCE: spec.md:69] [SOURCE: decision-record.md:34] [SOURCE: ../../../../../skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:127] [EVIDENCE: graph enrichment landed as additive fields on existing shared payload owners instead of a new payload family]
- [x] CHK-031 [P1] Additive metadata stays on current graph-owned payloads after packet `011`. [SOURCE: spec.md:76] [SOURCE: decision-record.md:35] [SOURCE: ../../../../../skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:564] [EVIDENCE: graph enrichment stays on graph-local payload sections, so packet `011` remains the authority owner for resume/bootstrap trust surfaces.]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Packet docs remain synchronized with the copied §20 roadmap language. [SOURCE: spec.md:29] [SOURCE: plan.md:28] [SOURCE: tasks.md:31] [EVIDENCE: spec, plan, tasks, checklist, and implementation summary now all describe the same adopt-now runtime lane plus ADR-003 deferrals]
- [x] CHK-041 [P1] ADRs document the dependency on `011`, the non-overlap with `008`, and the prototype-later treatment of routing facade, Leiden clustering, and GraphML/Cypher exports. [SOURCE: decision-record.md:14] [SOURCE: decision-record.md:89] [SOURCE: decision-record.md:166] [EVIDENCE: ADR-001 through ADR-004 remain unchanged as the packet's implementation fence]
- [x] CHK-042 [P2] Parent packet DAG entry remains aligned with the side-branch placement. [SOURCE: ../spec.md:15] [EVIDENCE: parent 026/spec.md still places 014 as a post-R5/R6 side branch]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Packet-local docs remain placeholder-free even before implementation starts. [SOURCE: implementation-summary.md:1] [EVIDENCE: implementation-summary.md now records the shipped runtime, exact verification commands, and real limitations instead of planning placeholder text]
- [x] CHK-051 [P1] Packet-local memory artifacts stay inside `014-code-graph-upgrades/memory/` only. [SOURCE: spec.md:40] [EVIDENCE: this run did not create any new memory artifacts outside the packet folder]
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

- [x] CHK-100 [P0] ADRs preserve the packet's dependency and authority boundaries. [SOURCE: decision-record.md:31] [SOURCE: decision-record.md:90] [EVIDENCE: ADR-001 through ADR-004 remain unchanged and still match the shipped runtime boundary]
- [x] CHK-101 [P1] Alternatives are documented with clear reject or prototype-later rationale. [SOURCE: decision-record.md:48] [SOURCE: decision-record.md:125] [EVIDENCE: packet closeout keeps lexical fallback, clustering, export, and routing-facade work explicitly deferred instead of silently broadening scope]
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-110 [P1] Performance and precision claims stay bounded and honest. [SOURCE: spec.md:117] [SOURCE: spec.md:129] [SOURCE: ../../../../../skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:200] [EVIDENCE: numeric confidence is clamped to [0,1] and breadcrumbs remain advisory rather than authority claims]
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Rollback procedure exists before implementation begins. [SOURCE: plan.md:129] [EVIDENCE: rollback and enhanced rollback sections remained in the packet plan throughout implementation]
- [x] CHK-121 [P1] Activation gates name the required fixture, snapshot, and strict-validation checks. [SOURCE: plan.md:108] [EVIDENCE: plan.md and implementation-summary.md both record the required fixture, snapshot, typecheck, and strict-validation checks]
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P1] The packet stays inside current runtime and documentation boundaries without touching any `external/` tree. [SOURCE: spec.md:40] [SOURCE: ../../../../../skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:317] [EVIDENCE: the modified file set stays inside `mcp_server/`, `scripts/tests/`, and the 014 packet folder only]
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] All packet docs are synchronized. [SOURCE: spec.md:29] [SOURCE: plan.md:28] [SOURCE: tasks.md:31] [EVIDENCE: spec, tasks, checklist, decision-record, and implementation-summary now describe the same shipped adopt-now lane and the same prototype-later deferrals]
- [x] CHK-141 [P2] The parent 026 DAG entry records the new side-branch relationship accurately. [SOURCE: ../spec.md:15] [EVIDENCE: parent 026/spec.md continues to show 014 as the post-R5/R6 side branch]
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| [Packet Orchestrator] | Technical Lead | [x] Approved | 2026-04-09 |
| [Packet Orchestrator] | Packet Owner | [x] Approved | 2026-04-09 |
<!-- /ANCHOR:sign-off -->
