---
title: "Tasks: Code Audit — Governance"
description: "Task breakdown for auditing 4 Governance features"
trigger_phrases:
  - "tasks"
  - "governance"
importance_tier: "normal"
contextType: "general"
---
# Tasks: Code Audit — Governance

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

**Task Format**: `T### [P?] Description`

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T000 Verify feature catalog currency for Governance
- [x] T000a [P] Identify source code root paths

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T001 [P] Audit: Feature flag governance — MATCH (process doc, no source files, accurate)
- [x] T002 [P] Audit: Feature flag sunset audit — PARTIAL (flag count stale: catalog=24, actual=38+)
- [x] T003 [P] Audit: Hierarchical scope governance and ingest retention — MATCH (all 4 source files confirmed)
- [x] T004 [P] Audit: Shared-memory rollout and kill switch — MATCH (deny-by-default + kill switch, all 6 files confirmed)

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T900 Cross-reference findings across features
- [x] T901 Compile audit summary report
- [x] T902 Update implementation-summary.md

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All feature audit tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Summary report completed

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->
