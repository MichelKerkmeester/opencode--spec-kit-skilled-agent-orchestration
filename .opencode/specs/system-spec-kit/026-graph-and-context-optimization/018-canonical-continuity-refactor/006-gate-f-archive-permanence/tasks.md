---
title: "Gate F — Cleanup Verification Tasks"
description: "Completed task log for the Gate F cleanup-verification pass."
trigger_phrases: ["gate f tasks", "cleanup verification tasks", "gate b cleanup result", "orphan edges"]
importance_tier: "important"
contextType: "verification"
status: complete
closed_by_commit: TBD
_memory:
  continuity:
    packet_pointer: "018/006-gate-f-archive-permanence"
    last_updated_at: "2026-04-12T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Recorded completed Gate F verification tasks"
    next_safe_action: "Update"
    key_files: ["tasks.md", "implementation-summary.md"]
---
# Tasks: Gate F — Cleanup Verification
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `pending` | Pending marker (not used in this closed packet) |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

Task format: `T### [P?] Description`
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the parent entry-gate expectations: Gates A-E closed and Gate B cleanup already committed.
- [x] T002 Query the live DB at `.opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite` and detect the initial failure state: `183` stale `file_path LIKE '%/memory/%.md'` rows and `184` archived rows total.
- [x] T003 [P] Verify the stale dependent edge count tied to those rows: `1141` `causal_edges` rows referenced the stale memory-file records.
- [x] T004 [P] Verify on-disk state: `find .opencode/specs -path '*/memory/*.md' -type f | wc -l` returned `0` and `find .opencode/specs -type d -name memory -empty` returned none.
- [x] T005 Run the minimal SQLite cleanup transaction: delete dependent edges pointing at stale `*/memory/*.md` rows, then delete those `183` stale memory rows.
- [x] T006 Re-run the post-cleanup DB checks and confirm `memory_index LIKE '%/memory/%.md' = 0`, `is_archived = 1`, and orphan-edge query `= 0`.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T007 Confirm `mcp_server/lib/search/pipeline/stage2-fusion.ts` already contains no archived-tier penalty or `0.3` multiplier.
- [x] T008 Confirm `mcp_server/handlers/memory-crud-stats.ts` already contains no `archived_hit_rate` metric.
- [x] T009 Confirm `mcp_server/lib/search/vector-index-schema.ts` still keeps `is_archived` but marks it deprecated in comments.
- [x] T010 Capture broader wording drift outside this packet as TODO-only follow-up: parent packet docs, `memory-context.ts`, `routing-prototypes.json`, and `gate-d-regression-embedding-semantic-search.vitest.ts`.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Rewrite all five owned packet docs from archive-permanence language to cleanup-verification language.
- [x] T012 Add `_memory.continuity`, `status: complete`, and `closed_by_commit: TBD` frontmatter to all five files.
- [x] T013 Record the preserved baseline archived row exactly: `2174|.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/plan.md`.
- [x] T014 Run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh --strict .opencode/specs/system-spec-kit/026-graph-and-context-optimization/018-canonical-continuity-refactor/006-gate-f-archive-permanence` and capture the final packet state.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Live DB cleanup completeness is proven with exact counts before and after cleanup.
- [x] No `**/memory/*.md` files remain on disk.
- [x] No orphan causal edges remain.
- [x] Archived-tier runtime cleanup status is verified and broader follow-up is documented without out-of-scope edits.
- [x] The packet docs are aligned to reality and ready for closeout metadata completion once a commit exists.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- Specification: `spec.md`
- Plan: `plan.md`
- Verification: `checklist.md`
- Evidence: `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
