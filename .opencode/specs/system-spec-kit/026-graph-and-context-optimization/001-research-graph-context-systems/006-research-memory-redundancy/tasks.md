---
title: "Tasks: Research Memory Redundancy Follow-On"
description: "Executable packet tasks for moved-packet formalization, parent canonical sync, and downstream packet re-evaluation."
trigger_phrases:
  - "memory redundancy follow-on tasks"
  - "compact wrapper tasks"
importance_tier: "important"
contextType: "tasks"
---
# Tasks: Research Memory Redundancy Follow-On

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### Description`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Re-read `research/research.md` and `research/findings-registry.json` and keep them as the packet authority.
- [x] T002 Re-read parent root `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md`.
- [x] T003 Re-read the downstream packet family from `002` through `013` and assign an impact class before editing.
- [x] T004 Create the packet-local `spec.md`, `plan.md`, `tasks.md`, and `checklist.md`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Parent Canonical Sync

- [x] T011 Update parent `research/research.md` with the bounded memory-redundancy follow-on lane.
- [x] T012 Update parent `research/recommendations.md` with compact-wrapper continuity guidance.
- [x] T013 Update parent `research/deep-research-dashboard.md` with the follow-on sync note.
- [x] T014 Review `cross-phase-matrix.md` and record the explicit no-change decision in packet docs.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Parent Root Packet Sync

- [x] T021 Update parent `spec.md` so the child-family map and charter mention the derivative `006` follow-on without changing the root packet type.
- [x] T022 Update parent `plan.md` so the root packet tracks the child follow-on in its canonical-sync story.
- [x] T023 Update parent `tasks.md`, `checklist.md`, and `implementation-summary.md` so completion truth includes the child follow-on visibility change.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Downstream Packet Review

- [x] T031 Re-evaluate `002-implement-cache-warning-hooks` and apply docs-only alignment.
- [x] T032 Re-evaluate `003-memory-quality-issues` root packet and update its phase map.
- [x] T033 Re-evaluate `003-memory-quality-issues/006-memory-duplication-reduction` and narrow the future implementation contract.
- [x] T034 Re-evaluate `003-memory-quality-issues/007-skill-catalog-sync` and align it to the final compact-wrapper contract.
- [x] T035 Record explicit no-change outcomes for `004-agent-execution-guardrails`, `005-provisional-measurement-contract`, `006-structural-trust-axis-contract`, `007-detector-provenance-and-regression-floor`, `008-graph-first-routing-nudge`, `009-auditable-savings-publication-contract`, `010-fts-capability-cascade-floor`, and `011-graph-payload-validator-and-trust-preservation`.
- [x] T036 Re-evaluate `012-cached-sessionstart-consumer-gated` and align its continuity assumptions to compact wrappers.
- [x] T037 Re-evaluate `013-warm-start-bundle-conditional-validation` and align its validation assumptions and benchmark wording to compact wrappers.
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Verification

- [x] T041 Run `validate.sh --strict` on the moved `006` packet.
- [x] T042 Run `validate.sh --strict` on each touched packet folder.
- [x] T043 Verify parent root docs, parent research docs, and child follow-on docs use consistent compact-wrapper and canonical-doc language.
- [x] T044 Verify every packet from `002` through `013` has an explicit review outcome in packet-local docs.
- [x] T045 Record `003` as the future implementation-owner review and leave runtime implementation deferred.
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All packet tasks in this file are marked complete.
- [x] No blocked tasks remain without explicit rationale.
- [x] Parent canonical sync and downstream review outcomes are both documented.
- [x] Validation has been run on every touched packet folder.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- **Research Authority**: See `research/research.md`
<!-- /ANCHOR:cross-refs -->
