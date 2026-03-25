---
title: "Tasks: Code Audit — Tooling and Scripts"
description: "Task breakdown for auditing 17 Tooling and Scripts features"
trigger_phrases:
  - "tasks"
  - "tooling and scripts"
importance_tier: "normal"
contextType: "general"
---
# Tasks: Code Audit — Tooling and Scripts

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

- [x] T000 Verify feature catalog currency for Tooling and Scripts
- [x] T000a [P] Identify source code root paths

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T001 [P] Audit: Tree thinning for spec folder consolidation — MATCH
- [x] T002 [P] Audit: Architecture boundary enforcement — MATCH
- [x] T003 [P] Audit: Progressive validation for spec documents — MATCH
- [x] T004 [P] Audit: Dead code removal — MATCH
- [x] T005 [P] Audit: Code standards alignment — PARTIAL (`SPEC_FOLDER_LOCKS` refactored from `memory-save.ts` to `spec-folder-mutex.ts`; all other claims match)
- [x] T006 [P] Audit: Real-time filesystem watching with chokidar — MATCH
- [x] T007 [P] Audit: Standalone admin CLI — MATCH
- [x] T008 [P] Audit: Watcher delete/rename cleanup — MATCH
- [x] T009 [P] Audit: Migration checkpoint scripts — MATCH
- [x] T010 [P] Audit: Schema compatibility validation — MATCH
- [x] T011 [P] Audit: Feature catalog code references — MATCH
- [x] T012 [P] Audit: Session Capturing Pipeline Quality — MATCH
- [x] T013 [P] Audit: Constitutional memory manager command — MATCH
- [x] T014 [P] Audit: Source-dist alignment enforcement — MATCH
- [x] T015 [P] Audit: Module boundary map — MATCH
- [x] T016 [P] Audit: JSON mode structured summary hardening — MATCH
- [x] T017 [P] Audit: JSON-only save contract — MATCH

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
