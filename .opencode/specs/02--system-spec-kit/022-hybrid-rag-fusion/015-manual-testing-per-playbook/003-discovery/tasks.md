---
title: "Tasks: manual-testing-per-playbook discovery phase"
description: "Task tracker for Phase 003 discovery scenarios. One task per scenario (EX-011, EX-012, EX-013), all pending."
trigger_phrases:
  - "discovery phase tasks"
  - "phase 003 tasks"
  - "EX-011 EX-012 EX-013 tasks"
importance_tier: "normal"
contextType: "general"
---
# Tasks: manual-testing-per-playbook discovery phase

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

- [x] T001 Read playbook context for 03--discovery (`.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` §03--discovery)
- [x] T002 Read feature catalog context for 03--discovery (`../scratch/context-feature-catalog.md` §03--discovery)
- [x] T003 Verify MCP server is running and accepting tool calls
- [x] T004 Confirm at least one memory is indexed (quick sanity check)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Execute EX-011 — Memory browser (memory_list): invoke with specFolder, limit, offset; capture output
- [x] T006 Record EX-011 verdict: **PASS** — `handleMemoryList` fully implements paginated browse with `specFolder`, `limit`, `offset`, returns `total`, `count`, and `results` array. [memory-crud-list.ts:30-181]
- [x] T007 Execute EX-012 — System statistics (memory_stats): invoke with folderRanking: "composite", includeScores: true; capture output
- [x] T008 Record EX-012 verdict: **PASS** — `handleMemoryStats` accepts `folderRanking:"composite"` and `includeScores:true`, returns dashboard with counts, tier breakdown, scored folder ranking, and graph metrics. [memory-crud-stats.ts:31-329]
- [x] T009 Execute EX-013a — Health diagnostics full mode: invoke memory_health(reportMode: "full"); capture output
- [x] T010 Execute EX-013b — Health diagnostics divergent_aliases mode: invoke memory_health(reportMode: "divergent_aliases"); capture output
- [x] T011 Record EX-013 verdict: **PASS** — `handleMemoryHealth` implements both `full` and `divergent_aliases` report modes; full mode returns status, diagnostics, aliasConflicts, repair, embeddingProvider; divergent_aliases mode returns compact triage payload with groups. [memory-crud-health.ts:223-601]
- [ ] T015 Execute EX-036 — Discovery by folder name filter: invoke `memory_list` with `specFolder` targeting a known subfolder; capture output
- [ ] T016 Record EX-036 verdict: PASS / PARTIAL / FAIL
- [ ] T017 Execute EX-037 — Discovery by trigger phrase matching: invoke `memory_match_triggers` with a known trigger phrase; capture output
- [ ] T018 Record EX-037 verdict: PASS / PARTIAL / FAIL
- [ ] T019 Execute EX-038 — Discovery by date range: invoke `memory_search` with `createdAfter` and `createdBefore`; capture output
- [ ] T020 Record EX-038 verdict: PASS / PARTIAL / FAIL
- [ ] T021 Execute EX-039a — Discovery by importance tier (high): invoke `memory_list` with `importanceTier: "high"`; capture output
- [ ] T022 Execute EX-039b — Discovery by importance tier (critical): invoke `memory_list` with `importanceTier: "critical"`; capture output
- [ ] T023 Record EX-039 verdict: PASS / PARTIAL / FAIL
- [ ] T024 Execute EX-040a — Causal link stats: invoke `memory_causal_stats`; capture output
- [ ] T025 Execute EX-040b — Causal link traversal: invoke `memory_search` with `causalSourceId`; capture output
- [ ] T026 Record EX-040 verdict: PASS / PARTIAL / FAIL
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Fill implementation-summary.md with all three verdicts and captured evidence
- [x] T013 Check all P0 items in checklist.md
- [x] T014 Check P1 items in checklist.md (evidence captured, verdicts recorded)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks T001-T026 marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] All eight scenarios have recorded verdicts (EX-011 through EX-013 and EX-036 through EX-040)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Playbook**: `.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` §03--discovery
<!-- /ANCHOR:cross-refs -->
