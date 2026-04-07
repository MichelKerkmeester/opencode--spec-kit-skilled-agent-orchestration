---
title: "Verification Checklist: Phase 5 — Operations & Tail PRs"
description: "Verification date: 2026-04-07"
trigger_phrases:
  - "phase 5 checklist"
  - "operations tail prs checklist"
  - "telemetry migration save lock verification"
importance_tier: important
contextType: "planning"
---
# Verification Checklist: Phase 5 — Operations & Tail PRs

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + level2-verify + phase-child | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion impact |
|----------|----------|-------------------|
| **P0** | Hard blocker | Phase 5 cannot claim completion without it |
| **P1** | Required or explicit defer | Must be complete or have written operator-approved rationale |
| **P2** | Optional closeout quality | Can defer, but status must be recorded in final closeout |

**Evidence rule**: every checked item should point to a concrete artifact such as a metric catalog, rule file, dry-run report, test result, release-note draft, or parent-closeout record.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-501 [P0] Requirements in `spec.md` document telemetry, migration, save-lock, release-note, and closeout scope clearly.
- [ ] CHK-502 [P0] `plan.md` defines the four workstreams, order of operations, and operator approval gate.
- [ ] CHK-503 [P1] Optionality is explicit: PR-10 apply and PR-11 ship are both documented as optional decisions, not silent defaults. [SOURCE: ../research/research.md:1439-1440]
- [ ] CHK-504 [P1] Phase 1-4 dependency assumptions remain unchanged from the parent PR train. [SOURCE: ../research/research.md:1149-1168]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-510 [P0] Phase 5 metric catalog exists and documents M1-M9 with meanings, labels, and defect/latency mapping. [SOURCE: ../research/iterations/iteration-024.md:23-93]
- [ ] CHK-511 [P0] `post-save-review.ts` emits the M1-M9 telemetry payload required by Phase 5. [SOURCE: ../research/iterations/iteration-024.md:109-118] [SOURCE: ../research/iterations/iteration-024.md:144-148]
- [ ] CHK-512 [P0] Any workflow-side timing/context plumbing needed for M9 or related structured events is implemented. [SOURCE: ../research/iterations/iteration-024.md:109-118]
- [ ] CHK-513 [P0] Alert-rule file is committed and contains `M4 > 0` page, `M6 > 5/hr` warn, and `M9 p95 > 500 ms` warn. [SOURCE: ../research/iterations/iteration-024.md:135-143]
- [ ] CHK-514 [P0] Telemetry stays guardrail-sized and does not introduce a broad tracing platform. [SOURCE: ../research/iterations/iteration-024.md:158-160]
- [ ] CHK-515 [P1] If PR-11 is implemented, unexpected lock failures fail closed or surface an explicit degraded-lock state instead of silently continuing. [SOURCE: ../research/iterations/iteration-021.md:51-55]
- [ ] CHK-516 [P1] If PR-11 is implemented, single-process save throughput remains acceptable in smoke verification. [SOURCE: ../research/research.md:1524-1525]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-520 [P0] PR-10 dry-run script exists with `--dry-run`, `--apply`, and `--per-defect` controls. [SOURCE: ../research/iterations/iteration-023.md:71-83]
- [ ] CHK-521 [P0] Dry-run report is published for the 82 historical JSON-mode files. [SOURCE: ../research/iterations/iteration-023.md:15-18] [SOURCE: ../research/iterations/iteration-023.md:71-80]
- [ ] CHK-522 [P0] Dry-run report includes `fixed`, `skipped-ambiguous`, and `unrecoverable` buckets. [SOURCE: ../research/iterations/iteration-023.md:73-80]
- [ ] CHK-523 [P0] Dry-run classification proves D3/D4/D6/D8 are the only automatic rewrite set. [SOURCE: ../research/iterations/iteration-023.md:64-67]
- [ ] CHK-524 [P0] Dry-run classification proves D1/D2/D5/D7 were not auto-migrated from file content alone. [SOURCE: ../research/research.md:1534-1537]
- [ ] CHK-525 [P1] D9 latent-bug reproduction test exists and runs. [SOURCE: ../research/iterations/iteration-021.md:49-55]
- [ ] CHK-526 [P1] Operator approval gate is recorded between dry-run publication and any apply step. [SOURCE: ../research/iterations/iteration-023.md:71-83]
- [ ] CHK-527 [P2] PR-10 apply has been executed for approved D3/D4/D6/D8 safe-subset rewrites. [SOURCE: ../research/iterations/iteration-023.md:64-83]
- [ ] CHK-528 [P2] Migrated sample files were re-checked with the upgraded reviewer or equivalent contamination checks. [SOURCE: ../research/iterations/iteration-023.md:75-83]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-530 [P1] PR-11 cross-process save lock is implemented, or a written defer rationale exists that ties the deferral to real concurrency pressure. [SOURCE: ../research/research.md:1422-1423] [SOURCE: ../research/research.md:1524-1525]
- [ ] CHK-531 [P1] Historical migration never fabricates lost overview text, decision content, or git provenance. [SOURCE: ../research/iterations/iteration-023.md:68-69] [SOURCE: ../research/research.md:1534-1537]
- [ ] CHK-532 [P1] Low-cardinality telemetry labels are preserved; detailed context lives only in structured logs. [SOURCE: ../research/iterations/iteration-024.md:8-13]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-540 [P0] Release-note draft exists and states that capture mode also benefits from shared D2/D3/D5/D8 fixes. [SOURCE: ../research/iterations/iteration-025.md:45-49]
- [ ] CHK-541 [P0] Release-note draft also states that the spec scope line remains correct and was not amended. [SOURCE: ../research/research.md:1531-1532]
- [ ] CHK-542 [P1] `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` agree on PR-10 optional apply, PR-11 optional ship/defer, and telemetry being folded into PR-9.
- [ ] CHK-543 [P1] Final Phase 5 closeout summary states telemetry status, PR-10 dry-run/apply status, and PR-11 ship/defer status explicitly. [SOURCE: ../research/research.md:1438-1443]
- [ ] CHK-544 [P2] Release notes are published, not only drafted. [SOURCE: ../research/iterations/iteration-025.md:45-49]
- [ ] CHK-545 [P2] Final release notes still distinguish shared-mode fixes from JSON-only fixes accurately. [SOURCE: ../research/iterations/iteration-025.md:34-49]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-550 [P1] Parent `PHASE DOCUMENTATION MAP` row for Phase 5 shows `Complete`. [SOURCE: ../research/research.md:1445-1447]
- [ ] CHK-551 [P1] Parent `/spec_kit:complete` workflow has run and the evidence path is recorded. [SOURCE: ../research/research.md:1445-1447]
- [ ] CHK-552 [P2] Apply step used per-file commits or equivalently reviewable per-file slices. [SOURCE: ../research/iterations/iteration-023.md:71-83]
- [ ] CHK-553 [P2] Sibling research iteration memory folder has been re-scanned clean after migration if historical files were rewritten. [SOURCE: ../research/iterations/iteration-023.md:75-83]
- [ ] CHK-554 [P2] Constitutional memory is updated only if Phase 5 surfaced a genuinely new cross-cutting operational rule. [SOURCE: ../research/research.md:1438-1443]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 0/13 |
| P1 Items | 10 | 0/10 |
| P2 Items | 6 | 0/6 |

**Verification Date**: 2026-04-07

### Phase 5 success definition

- P0 complete means Phase 5 produced telemetry, alerting, release-note draft, and PR-10 dry-run evidence even if optional tails are still deferred.
- P1 complete means PR-11 status is explicit, the D9 reproduction path exists, and the parent packet is actually closed.
- P2 complete means the operator chose to go beyond the minimum and finish the optional historical cleanup/publication steps.
<!-- /ANCHOR:summary -->

---
