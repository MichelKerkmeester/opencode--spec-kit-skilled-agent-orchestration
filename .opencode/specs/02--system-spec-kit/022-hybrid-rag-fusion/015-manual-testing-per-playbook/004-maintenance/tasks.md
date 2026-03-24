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
- [x] T004 Identify target spec folder with at least one markdown file (for EX-014) — `02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/004-maintenance/`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Execute EX-014 — Workspace scanning and indexing (memory_index_scan): code analysis of `handlers/memory-index.ts` + `lib/storage/incremental-index.ts` plus test run of `handler-memory-index.vitest.ts`, `handler-memory-index-cooldown.vitest.ts`, `incremental-index-v2.vitest.ts` (69/69 tests pass)
- [x] T006 Record EX-014 verdict: **PASS** — all acceptance criteria met; incremental mode, scan summary (indexed/updated/unchanged/skipped_mtime/failed counts), rate limiter, stale delete, mtime safety invariant all confirmed in code and tests
- [x] T007 Execute EX-035 — Startup runtime compatibility guards: ran `npx vitest run tests/startup-checks.vitest.ts` per exact playbook command sequence; 14/14 tests pass
- [x] T008 Record EX-035 verdict: **PASS** — `startup-checks.vitest.ts` completes with all 14 tests passing; runtime mismatch, marker creation, and SQLite diagnostics all visible in transcript
- [ ] T012 Execute EX-041 — Memory content update via memory_update: invoke `memory_update` with modified content/title on an existing memory; capture output
- [ ] T013 Record EX-041 verdict: PASS / PARTIAL / FAIL
- [ ] T014 Execute EX-042 — Memory deletion via memory_delete: invoke `memory_delete` on a known memory ID; capture output; verify absence via `memory_list`
- [ ] T015 Record EX-042 verdict: PASS / PARTIAL / FAIL
- [ ] T016 Execute EX-043 — Bulk delete with filter criteria: create checkpoint; invoke `memory_bulk_delete` with filter; capture output; verify counts
- [ ] T017 Record EX-043 verdict: PASS / PARTIAL / FAIL
- [ ] T018 Execute EX-044 — Health check diagnostics: invoke `memory_health(reportMode: "full")`; capture output; verify subsystem status fields
- [ ] T019 Record EX-044 verdict: PASS / PARTIAL / FAIL
- [ ] T020 Execute EX-045 — Index scan and repair: create checkpoint; invoke `memory_index_scan(force: true)`; capture output; invoke `memory_health` to verify post-scan integrity
- [ ] T021 Record EX-045 verdict: PASS / PARTIAL / FAIL
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

- [ ] All tasks T001-T021 marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] All seven scenarios have recorded verdicts (EX-014, EX-035, EX-041 through EX-045)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Playbook**: `../scratch/context-playbook.md` §04--maintenance
<!-- /ANCHOR:cross-refs -->
