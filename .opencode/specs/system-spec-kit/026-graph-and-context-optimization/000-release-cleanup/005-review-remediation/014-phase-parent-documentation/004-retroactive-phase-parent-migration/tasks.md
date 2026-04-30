---
title: "Tasks: Retroactive Phase-Parent Migration"
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
description: "Task list for migration packet: 3 worker briefs + dispatch + verification + synthesis."
trigger_phrases:
  - "retroactive phase parent tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/014-phase-parent-documentation/004-retroactive-phase-parent-migration"
    last_updated_at: "2026-04-27T14:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored tasks.md task list"
    next_safe_action: "Author checklist.md"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    completion_pct: 50
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Retroactive Phase-Parent Migration

<!-- SPECKIT_LEVEL: 2 -->

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

> **Sub-phase A — Worker Brief Authoring + Parallel Dispatch.** 3 cli-copilot/gpt-5.4-medium workers in parallel, max 3 concurrent per memory rule.

- [ ] T001 Author `/tmp/copilot-worker-1.md` (Worker 1: 022-hybrid-rag-fusion subtree (8 phase parents) + 023-hybrid-rag-fusion-refinement subtree (1 phase parent) = 9 total)
- [ ] T002 [P] Author `/tmp/copilot-worker-2.md` (Worker 2: 00--ai-systems subtree (6) + 024-compact-code-graph subtree (1) + 026/015-mcp-runtime-stress-remediation/001-search-intelligence-stress-test (1) = 8 total)
- [ ] T003 [P] Author `/tmp/copilot-worker-3.md` (Worker 3: 026-graph-and-context-optimization C-category active (3-4 parents) + ALL z_archive/z_future entries (~7) = ~11 total)
- [ ] T004 Dispatch Worker 1 in background: `nohup copilot -p "$(cat /tmp/copilot-worker-1.md)" --model gpt-5.4 --effort medium --autopilot --no-ask-user --allow-all-tools --no-color --no-custom-instructions > /tmp/copilot-worker-1.log 2>&1 &`
- [ ] T005 [P] Dispatch Worker 2 in background (same flags) → `/tmp/copilot-worker-2.log`
- [ ] T006 [P] Dispatch Worker 3 in background (same flags) → `/tmp/copilot-worker-3.log`
- [ ] T007 Capture all 3 PIDs to `004/scratch/worker-pids.txt`
- [ ] T008 Arm 2-min status pulse Monitor (per-worker tasks_done count + log size)
- [ ] T009 Arm completion-signal Monitor that fires when ALL 3 PIDs exit
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

> **Sub-phase B — Verification.** Workers complete → aggregate + run 026 regression diff.

- [ ] T010 Read all 3 `004/scratch/worker-N-report.json` files; verify schema + summary blocks
- [ ] T011 Aggregate into `004/scratch/migration-manifest.json` with totals across workers (total_processed, total_skipped, manual_block_violations, narrative_violations, new_error_rules_anywhere)
- [ ] T012 Re-run discovery scan; assert all 28 in-scope parents are now Category A or B (zero in C)
- [ ] T013 Run `validate.sh --strict --json` on `026-graph-and-context-optimization/`; diff parent error rules against `scratch/regression-baseline-pre-004.txt` — MUST match
- [ ] T014 Spot-check diff on 5 random touched parents — manual block byte-equal pre/post; narrative recognizable
- [ ] T015 [P] Cross-impl detection check on every touched parent: shell `is_phase_parent` and ESM JS `isPhaseParent` return identical booleans
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

> **Sub-phase C — Synthesis + Save.** This Claude session writes the summary and runs canonical save.

- [ ] T016 Author `004/implementation-summary.md` aggregating worker outputs + verification results
- [ ] T017 Run canonical `/memory:save` against 004 (dogfoods pointer; 010's `last_active_child_id` should auto-bubble to 004)
- [ ] T018 Final task status update; close packet
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 tasks (T001-T009 + T010-T015 + T016-T017) marked `[x]` with evidence
- [ ] All worker JSON reports filed at `004/scratch/worker-{1,2,3}-report.json`
- [ ] `004/scratch/migration-manifest.json` aggregates all 3 worker results
- [ ] 026 regression: zero new error rules vs baseline
- [ ] Spot-check diff on 5 parents: manual block + narrative preserved
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Parent Spec**: See `../spec.md`
- **Predecessors**: See `../001-validator-and-docs/`, `../002-generator-and-polish/`, `../003-references-and-readme-sync/`
- **Pre-migration baseline**: `scratch/regression-baseline-pre-004.txt`
- **Worker briefs (in-flight)**: `/tmp/copilot-worker-{1,2,3}.md`
- **Worker reports (filled by workers)**: `scratch/worker-{1,2,3}-report.json`
- **Aggregated migration manifest**: `scratch/migration-manifest.json`
<!-- /ANCHOR:cross-refs -->
