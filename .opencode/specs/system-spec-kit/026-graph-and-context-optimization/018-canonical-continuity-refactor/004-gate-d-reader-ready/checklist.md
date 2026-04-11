---
title: "Verification Checklist: Gate D — Reader Ready"
description: "Verification Date: Pending Gate D execution"
trigger_phrases:
  - "gate d"
  - "reader ready"
  - "verification"
  - "checklist"
  - "resume ladder"
importance_tier: "important"
contextType: "verification"
---
# Verification Checklist: Gate D — Reader Ready

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot close Gate D without it |
| **[P1]** | Required | Must complete or document explicit deferral |
| **[P2]** | Optional | Can defer with written reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Gate C is closed and dual-write shadow stability is recorded.
- [ ] CHK-002 [P0] `spec.md`, `plan.md`, and `tasks.md` reflect the F-8 reader scope and Gate D execution order from [`../resource-map.md`](../resource-map.md).
- [ ] CHK-003 [P1] Fixture corpus and telemetry spans from iterations 027 and 029 are ready before code changes start.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `memory-search.ts`, `memory-context.ts`, `session-resume.ts`, `session-bootstrap.ts`, `memory-index-discovery.ts`, and `memory-triggers.ts` are restructured as planned.
- [ ] CHK-011 [P0] Resume happy path reads the handover tier and continuity first, with no SQL on the happy path.
- [ ] CHK-012 [P1] Archived fallback honors `is_archived` filtering and emits source/fallback telemetry.
- [ ] CHK-013 [P1] Wrapper and pipeline responsibilities remain unchanged outside the documented reader retarget.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All 10 `resumeLadder` tests from iteration 029 are green.
- [ ] CHK-021 [P0] All 25 integration scenarios from iteration 029 are green.
- [ ] CHK-022 [P0] All 13 preserved-feature regressions from iteration 025 are green.
- [ ] CHK-023 [P1] Missing handover, malformed continuity, stale spec docs, invalid packet pointer, and no-context cases are validated.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] Existing scope, governance, and `--no-archived` controls still work after source-provenance changes.
- [ ] CHK-031 [P1] Archived fallback does not bypass actor filters or canonical source precedence.
- [ ] CHK-032 [P1] Warning and failure messages stay explicit and do not hide recovery-source ambiguity.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan, tasks, checklist, and decision record cite the same Gate D scope, metrics, and thresholds.
- [ ] CHK-041 [P1] `implementation-summary.md` remains an honest placeholder until runtime work is complete.
- [ ] CHK-042 [P2] Packet-local evidence references the grounding set: implementation design, handler map, and iterations 013/017/018/025/027/029/036/039.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] No new packet files were created outside the approved six docs.
- [ ] CHK-051 [P1] Scratch artifacts stay under `scratch/` only.
- [ ] CHK-052 [P2] Follow-on findings are saved via the approved memory workflow when Gate D execution finishes.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 0/9 |
| P1 Items | 10 | 0/10 |
| P2 Items | 3 | 0/3 |

**Verification Date**: Pending Gate D execution
<!-- /ANCHOR:summary -->

---

<!-- Append to Level 2 checklist.md -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] ADR-001 documents the chosen `resumeLadder` shape and helper location.
- [ ] CHK-101 [P1] ADR-002 documents both the Gate D short-window archive ceiling and the iteration 036 long-run threshold ladder.
- [ ] CHK-102 [P1] Alternatives are documented for helper placement and archive-threshold handling.
- [ ] CHK-103 [P2] Migration notes explain how Gate D hands off to Gate E without reintroducing memory-file primacy.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] `resume_latency_p95 < 500ms` is verified.
- [ ] CHK-111 [P1] `search_latency_p95 < 300ms` and `trigger_match_latency_p95 < 10ms` are verified.
- [ ] CHK-112 [P2] Stage-level budget burn is captured for wrapper, handover, continuity, synthesis, and fallback spans.
- [ ] CHK-113 [P2] Perf evidence is documented in the packet with the dominant-stage owner called out for any miss.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure is documented and rehearsal steps are clear.
- [ ] CHK-121 [P0] D0 archived observation starts as soon as Gate C stability is confirmed.
- [ ] CHK-122 [P1] `archived_hit_rate <15%` is verified during the Gate D short-window observation.
- [ ] CHK-123 [P1] `resume.fast_path_source`, `resume.fast_path_miss`, and archive-dependence telemetry are visible.
- [ ] CHK-124 [P2] Escalation path is documented for any short-window archive breach or critical p95 miss.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] Reader changes preserve existing governance and scope boundaries.
- [ ] CHK-131 [P1] Archive observation uses the slot-share definition from iteration 036.
- [ ] CHK-132 [P2] Human-review gates for long-run archive decisions are documented for later phases.
- [ ] CHK-133 [P2] Recovery messaging stays explicit for malformed or missing canonical state.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All Gate D packet docs are synchronized.
- [ ] CHK-141 [P1] Grounding references are consistent across spec, plan, tasks, and ADRs.
- [ ] CHK-142 [P2] Gate E handoff notes are clear once implementation lands.
- [ ] CHK-143 [P2] Implementation summary is replaced with execution evidence after Gate D work completes.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| TBD | Technical Lead | [ ] Approved | |
| TBD | Product Owner | [ ] Approved | |
| TBD | QA Lead | [ ] Approved | |
<!-- /ANCHOR:sign-off -->

---
