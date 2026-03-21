---
title: "Tasks: 022-hybrid-rag-fusion"
description: "Root packet normalization tasks."
trigger_phrases:
  - "022 root tasks"
importance_tier: "critical"
contextType: "implementation"
---
# Tasks: 022-hybrid-rag-fusion

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the current root packet
- [x] T002 Read the Level 3+ template expectations needed for the parent packet
- [x] T003 Inventory direct child packets `001-018`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Rewrite the root `spec.md` into a concise coordination packet
- [x] T005 Normalize the root `plan.md`
- [x] T006 Keep root `tasks.md`, `checklist.md`, `decision-record.md`, and `implementation-summary.md` aligned with the current pass
- [x] T007 Normalize direct-child phase-navigation references in the direct child packet specs
- [x] T008 Remove stale root wording that pointed at broken or misleading markdown targets
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run focused root validation
- [x] T010 Record residual subtree blockers if they remain after the parent pass
- [x] T011 Continue nested packet-family normalization where needed
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Root packet docs are concise and current-state focused
- [x] Direct-child phase links are normalized at the root-facing layer
- [x] Parent validation is rerun and recorded
- [x] Remaining subtree debt is clearly tracked
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
