---
title: "Tasks: Query-Routing Integration [024/020]"
description: "Task tracking for query-intent enrichment, session_resume, and passive enrichment."
---
# Tasks: Query-Routing Integration [024/020]

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

- [x] T001 Audit `memory_context` implementation facts (`handlers/memory-context.ts`)
- [x] T002 Audit `session_resume` schema and output contract (`handlers/session-resume.ts`, `tool-schemas.ts`, `schemas/tool-input-schemas.ts`)
- [x] T003 [P] Audit passive enrichment wiring and current file inventory (`context-server.ts`, `lib/enrichment/passive-enrichment.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Update the packet to describe additive query-intent enrichment rather than selective backend routing (`spec.md`, `plan.md`, `implementation-summary.md`)
- [x] T005 Replace stale metadata wording with `queryIntentRouting { queryIntent, routedBackend, confidence, matchedKeywords? }` (`spec.md`, `plan.md`, `checklist.md`, `implementation-summary.md`)
- [x] T006 Correct `session_resume` documentation to the shipped slim schema and payload (`spec.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`)
- [x] T007 Mark passive enrichment as implemented and remove `code-graph-enricher.ts` references (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Remove stale claims about dual-backend hybrid merging, `fallbackApplied`, `ccc_status()`, and deferred Part 3 work (entire packet)
- [x] T009 Confirm every file uses the same `session_resume` summary contract and input schema (entire packet)
- [x] T010 Update template markers and anchors, then run strict packet validation (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`)
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
- **Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->

---
