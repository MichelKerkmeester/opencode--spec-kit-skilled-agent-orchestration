---
title: "Tasks: 004-frontmatter-indexing [004-frontmatter-indexing/tasks]"
description: "Task Format: T### [P?] Description (file path)"
SPECKIT_TEMPLATE_SOURCE: "tasks-core | v2.2"
trigger_phrases:
  - "tasks"
  - "004"
  - "frontmatter"
  - "indexing"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: 004-frontmatter-indexing

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Define canonical frontmatter schema and mapping table (`spec.md`, parser references) | Evidence: Canonical schema/normalization approach documented and exercised by migration + parser tests.
- [x] T002 Capture legacy frontmatter variants from templates/spec docs/memories (`scratch/` notes) | Evidence: Migration/report corpus covers templates (81), memory (365), spec docs (1343).
- [x] T003 [P] Prepare migration fixtures for valid and malformed cases (`mcp_server/tests/...`) | Evidence: Template/frontmatter test suites executed successfully.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Implement normalize and compose helpers in parser layer (`mcp_server/lib/parsing/...`) | Evidence: `node scripts/tests/test-template-system.js` and `node scripts/tests/test-template-comprehensive.js` passed.
- [x] T005 Implement migration CLI flow with dry-run and apply modes (`scripts/dist/memory/...`) | Evidence: `scratch/frontmatter-apply-report.json` and `scratch/frontmatter-final-dry-run-report-v3.json` show successful apply + idempotent dry-run.
- [x] T006 Wire index rebuild after successful migration (`mcp_server/lib/storage/index-refresh.ts`) | Evidence: Reindex completed with `STATUS=OK` (executed twice).
- [x] T007 Add error handling for malformed frontmatter and unsupported legacy keys (`mcp_server/lib/errors/...`) | Evidence: `node scripts/tests/test-frontmatter-backfill.js` and memory parser vitest target passed.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run unit tests for parser/coercion/compose paths (`npm test -- parser/frontmatter suites`) | Evidence: Passed: `test-template-system.js`, `test-template-comprehensive.js`, `test-frontmatter-backfill.js`, `mcp_server/tests/memory-parser.vitest.ts`, `mcp_server/tests/memory-parser-extended.vitest.ts`.
- [x] T009 Run integration reindex and retrieval regression suites (`mcp_server/tests/...`) | Evidence: `npm run test --workspace mcp_server -- tests/spec126-full-spec-doc-indexing.vitest.ts tests/index-refresh.vitest.ts` passed; reindex quality checks remain captured in `implementation-summary.md`.
- [x] T010 Update checklist and implementation summary with evidence (`checklist.md`, `implementation-summary.md`) | Evidence: Evidence paths, numbering normalization, and `scratch/full-tree-fusion-audit.md` were updated in this remediation pass.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed

Deferred/Non-Applicable Notes:
- None for task execution. Deferred items are tracked in `checklist.md` where evidence was not strictly available.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
