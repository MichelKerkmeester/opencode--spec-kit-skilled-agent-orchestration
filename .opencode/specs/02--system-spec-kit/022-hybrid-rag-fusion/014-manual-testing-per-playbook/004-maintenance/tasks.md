---
title: "Tasks: manual-testing-per-playbook maintenance phase"
description: "Task tracker for Phase 004 maintenance scenarios. One task per scenario (EX-014, EX-035), all pending."
trigger_phrases:
  - "maintenance phase tasks"
  - "phase 004 tasks"
  - "EX-014 EX-035 tasks"
importance_tier: "normal"
contextType: "general"
---
# Tasks: manual-testing-per-playbook maintenance phase

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

- [x] T001 Read playbook context for 04--maintenance (`../scratch/context-playbook.md` §04--maintenance)
- [x] T002 Read feature catalog context for 04--maintenance (`../scratch/context-feature-catalog.md` §04--maintenance)
- [x] T003 Verify MCP server is running and accepting tool calls — `npx vitest run` executes successfully
- [x] T004 Identify target spec folder with at least one markdown file (for EX-014) — `02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/004-maintenance/`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Execute EX-014 — Workspace scanning and indexing (memory_index_scan): code analysis of `handlers/memory-index.ts` + `lib/storage/incremental-index.ts` plus test run of `handler-memory-index.vitest.ts`, `handler-memory-index-cooldown.vitest.ts`, `incremental-index-v2.vitest.ts` (69/69 tests pass)
- [x] T006 Record EX-014 verdict: **PASS** — all acceptance criteria met; incremental mode, scan summary (indexed/updated/unchanged/skipped_mtime/failed counts), rate limiter, stale delete, mtime safety invariant all confirmed in code and tests
- [x] T007 Execute EX-035 — Startup runtime compatibility guards: ran `npx vitest run tests/startup-checks.vitest.ts` per exact playbook command sequence; 14/14 tests pass
- [x] T008 Record EX-035 verdict: **PASS** — `startup-checks.vitest.ts` completes with all 14 tests passing; runtime mismatch, marker creation, and SQLite diagnostics all visible in transcript
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Fill implementation-summary.md with both verdicts and captured evidence
- [x] T010 Check all P0 items in checklist.md
- [x] T011 Check P1 items in checklist.md (evidence captured, verdicts recorded)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks T001-T011 marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Both scenarios have recorded verdicts
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Playbook**: `../scratch/context-playbook.md` §04--maintenance
<!-- /ANCHOR:cross-refs -->
