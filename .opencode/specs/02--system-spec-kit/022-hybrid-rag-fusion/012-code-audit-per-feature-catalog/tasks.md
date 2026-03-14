---
title: "Tasks: code-audit-per-feature-catalog [template:level_1/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
# SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2
trigger_phrases:
  - "umbrella tasks"
  - "spec packet repair"
  - "phase reconciliation"
importance_tier: "high"
contextType: "general"
---
# Tasks: code-audit-per-feature-catalog

<!-- SPECKIT_LEVEL: 1 -->
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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm recursive validator failures and scope (`012-code-audit-per-feature-catalog/`)
- [x] T002 Identify missing parent artifacts at umbrella root (`spec.md`, `plan.md`, `tasks.md`)
- [x] T003 [P] Identify broken markdown targets in phases 019, 020, and 021 (`019*/`, `020*/`, `021*/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Create parent `spec.md` with phase map and validation requirements (`spec.md`)
- [x] T005 Create parent `plan.md` and reconciliation strategy (`plan.md`)
- [x] T006 Create parent `tasks.md` and completion tracker (`tasks.md`)
- [x] T007 Create parent synthesis artifact referenced by phase 021 (`synthesis.md`)
- [x] T008 Repair broken markdown references in phase 019 (`019-decisions-and-deferrals/tasks.md`, `019-decisions-and-deferrals/implementation-summary.md`)
- [x] T009 Rewrite phase 020 from stale draft/pending to corrected mapping and validation-guard state (`020-feature-flag-reference/*.md`)
- [x] T010 Remove stale unresolved-fail language in phase 021 where no longer true (`021-remediation-revalidation/spec.md`, `021-remediation-revalidation/implementation-summary.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Run feature-flag mapping guard test (`mcp_server/tests/feature-flag-reference-docs.vitest.ts`)
- [x] T012 Run recursive spec validation for umbrella folder (`validate.sh --recursive`)
- [x] T013 Update final expected validation state report with evidence (`root and phase summaries`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
