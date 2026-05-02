---
title: "Tasks: sk-doc Legacy Template Debt Cleanup [template:level_2/tasks.md]"
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "013-skdoc legacy template cleanup tasks"
  - "tier 4 sk-doc remediation tasks"
  - "audit remediation task list"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/013-skdoc-legacy-template-debt-cleanup"
    last_updated_at: "2026-04-29T11:10:00Z"
    last_updated_by: "codex-gpt-5.5"
    recent_action: "Completed scoped remediation batches and verification evidence"
    next_safe_action: "Use implementation-summary.md for Tier 5 deferral context"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "checklist.md"
    completion_pct: 100
---
# Tasks: sk-doc Legacy Template Debt Cleanup

<!-- SPECKIT_LEVEL: 2 -->
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

- [x] T001 Read packet spec, audit report, templates, and sk-doc/system-spec-kit guidance.
- [x] T002 Author packet `plan.md`, `tasks.md`, and `checklist.md`.
- [x] T003 Compute protected exclusion set and eligible HIGH/MED candidate lists.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Batch A: add missing `_memory.continuity` blocks to eligible files.
- [x] T005 Batch C: add missing `SPECKIT_TEMPLATE_SOURCE` body markers.
- [x] T006 Batch B: add missing anchor wrappers or stubs to eligible files.
- [x] T007 Batch D: apply low-risk MED metadata fixes and record Tier 5 deferrals.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Recompute HIGH and MED counts after remediation.
- [x] T009 Validate today's protected packets with strict validator.
- [x] T010 Validate this `013` packet with strict validator.
- [x] T011 Write `implementation-summary.md` with counts, exclusions, deferrals, and verification evidence.
- [x] T012 Update `spec.md` continuity and status to complete.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All eligible HIGH findings are resolved or explicitly documented as protected/deferred.
- [x] MED count is reduced, with rewrite-heavy items deferred to Tier 5.
- [x] All required validators exit 0.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Audit Report**: `/tmp/audit-skdoc-alignment-report.md`
<!-- /ANCHOR:cross-refs -->
