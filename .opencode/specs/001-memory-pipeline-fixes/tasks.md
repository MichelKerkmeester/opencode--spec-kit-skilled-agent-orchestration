---
title: "Tasks: Memory Pipeline Fixes [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "memory pipeline"
  - "bug fixes"
  - "verification"
  - "typescript"
importance_tier: "high"
contextType: "general"
---
# Tasks: Memory Pipeline Fixes

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

- [x] T001 Confirm current behavior and expected acceptance output for all seven requested fixes (multiple target files)
- [x] T002 Identify the exact rebuild and verification commands in `.opencode/skill/system-spec-kit`, `scripts`, and `shared` (workspace commands)
- [x] T003 [P] Decide whether generated `dist/` artifacts require commit review after rebuild (build outputs)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Fix title truncation (`.opencode/skill/system-spec-kit/scripts/core/title-builder.ts`)
- [x] T005 [P] Fix session status inference (`.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts`)
- [x] T006 [P] Fix phase classifier override behavior (`.opencode/skill/system-spec-kit/scripts/lib/phase-classifier.ts`)
- [x] T007 [P] Fix decision confidence baseline (`.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts`)
- [x] T008 [P] Fix key outcomes truncation (`.opencode/skill/system-spec-kit/scripts/lib/semantic-summarizer.ts`)
- [x] T009 [P] Fix generic single-word trigger phrases (`.opencode/skill/system-spec-kit/shared/trigger-extractor.ts`)
- [x] T010 [P] Fix embedding model name propagation (`.opencode/skill/system-spec-kit/shared/{types.ts,embeddings.ts}`)
- [x] T011 Rebuild affected packages and inspect generated output (`.opencode/skill/system-spec-kit/{scripts,shared,package.json}`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Run existing tests, type checks, and smoke checks required for the affected packages (workspace verification)
- [x] T013 Verify edge cases for truncation, status/phase inference, confidence baseline, trigger quality, and model propagation (manual or automated evidence)
- [x] T014 Update `checklist.md` and `implementation-summary.md` with final evidence and any approved deferrals (spec folder docs)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All seven requested fixes are marked complete and no requested bug remains open.
- [x] Rebuild and verification evidence is recorded for the affected workspace paths.
- [x] No `[B]` blocked tasks remain without explicit user approval.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->

---
