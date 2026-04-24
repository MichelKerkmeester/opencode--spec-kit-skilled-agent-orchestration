---
title: "...-graph-and-context-optimization/002-continuity-memory-runtime/003-continuity-refactor-gates/001-gate-a-prework/tasks]"
description: "Ordered execution record for removing Gate A blockers before phase 018 schema or runtime refactor work begins. Completed in commit d35fc6e9a; resume warmup deferred to post-Gate-B verification pass."
trigger_phrases:
  - "gate a tasks"
  - "pre-work tasks"
  - "canonical continuity"
  - "phase 018"
  - "root packet backfill"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/003-continuity-refactor-gates/001-gate-a-prework"
    last_updated_at: "2026-04-12T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Validated Gate A task-ledger continuity during the Phase 018 deep review pass"
    next_safe_action: "Treat the task ledger as closed historical evidence for downstream gates"
    key_files: [".opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/003-continuity-refactor-gates/001-gate-a-prework/tasks.md"]
closed_by_commit: TBD
feature: phase-018-gate-a-prework
gate: A
level: 2
parent: 006-continuity-refactor-gates
status: complete
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Gate A — Pre-work

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `pending` | Pending marker (not used in this closed packet) |
| `[x]` | Completed |
| `[P]` | Parallelizable after its dependency gate is clear |
| `[B]` | Historical blocked marker retained for lineage only |

**Task Format**: `T### [P?] Description (file path or surface)`

Task ordering follows `../resource-map.md` §4 Gate A and iteration 028's Gate A DAG: audit first, then remediation/backfill, then safety verification.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the Gate A target set from `../resource-map.md` F-3, `../resource-map.md` §4, and `../scratch/resource-map/04-templates.md`.
- [x] T002 Audit all Level 1/2/3/3+ templates for anchor integrity in a read-only scan, then limit remediation to Level 3, Level 3+, and `.opencode/skill/system-spec-kit/templates/{handover.md,research.md,debug-delegation.md}`.
- [x] T003 Identify the root packets missing canonical `implementation-summary.md`, using iteration 016's M4 prerequisite as the audit rubric. [Evidence: audit resolved to `../../z_archive/016-release-alignment/implementation-summary.md`]
- [x] T004 Freeze the default validator scope decision: `changelog/*` and `sharded/*` are exempt from merge-target validation unless a later phase expands their contract.
- [x] T005 Decide whether Gate A will create an empty `mcp_server/database/migrations/` convention or record inline migration ownership in `vector-index-schema.ts`. [Decision: Option A inline in `mcp_server/lib/search/vector-index-schema.ts`]
- [x] T006 [P] Pre-stage the copy-only backup/restore rehearsal plan and confirm the backup artifact name (`memory-018-pre.db`). [Evidence: backup created at `.opencode/skill/system-spec-kit/mcp_server/database/memory-018-pre.db`]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T007 Repair the orphan `metadata` anchor close in `.opencode/skill/system-spec-kit/templates/level_3/spec.md`.
- [x] T008 Repair the orphan `metadata` anchor close and add governance anchors in `.opencode/skill/system-spec-kit/templates/level_3+/spec.md`.
- [x] T009 Add baseline anchors to `.opencode/skill/system-spec-kit/templates/handover.md`.
- [x] T010 Add baseline anchors to `.opencode/skill/system-spec-kit/templates/research.md`.
- [x] T011 Add baseline anchors to `.opencode/skill/system-spec-kit/templates/debug-delegation.md`.
- [x] T012 Update validator behavior or validator policy notes so `changelog/*` and `sharded/*` remain outside merge-target validation by default. [Evidence: `scripts/spec/validate.sh` exempts `templates/changelog` and `templates/sharded` under `ANCHORS_VALID`]
- [x] T013 Generate canonical `implementation-summary.md` backfills for each packet found by T003. [Evidence: `../../z_archive/016-release-alignment/implementation-summary.md` backfilled with `_provenance gate-a-retroactive-backfill`]
- [x] T014 Human-review every generated root-packet backfill and tighten wording until the packet narrative is canonical rather than memory-only.
- [x] T015 Verify the root-packet backfill remains present and reviewable before any later archive-state or schema work depends on it. [Evidence: `../../z_archive/016-release-alignment/implementation-summary.md` remains present in tree]
- [x] T016 [P] Record the Gate A answer for migration-file ownership if T005 resolves it.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T017 Run strict validation on the repaired template examples and confirm the anchor-blocker set is closed. [Evidence: `SPECKIT_RULES=ANCHORS_VALID` passed for `templates/level_1`, `templates/level_2`, `templates/level_3`, and `templates/level_3+`]
- [x] T018 Create the SQLite backup file with the Gate A naming convention. [Evidence: `.opencode/skill/system-spec-kit/mcp_server/database/memory-018-pre.db`, size `195276800` bytes, integrity ok]
- [x] T019 Restore the backup onto a copy and verify the copied DB opens cleanly.
- [x] T020 Rehearse rollback on a copy and capture the exact reversal procedure. [Evidence: restore/rollback drill passed with logical SHA3 `e986db400350ac106428a2289f6eafedb49a9c1b544d84eb46e4e73b`]
- [x] T021 Verify the canonical doc-first resume path clears the under-five-second budget required by Gate A. [Evidence: Gate D reader benchmark suite passed on 2026-04-12, including `tests/gate-d-benchmark-session-resume.vitest.ts`, `tests/gate-d-resume-perf.vitest.ts`, and `tests/resume-ladder.vitest.ts`]
- [x] T022 Reconcile `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` so Gate A status and evidence all agree.
- [x] T023 Record any unresolved item as a named blocker instead of silently carrying it into Gate B.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 Gate A blockers from `spec.md` REQ-001 through REQ-006 are marked complete.
- [x] No active blocker remains on template anchors, root-packet backfill, SQLite recovery proof, or resume budget health.
- [x] Gate A exit criteria from iteration 020 and `../implementation-design.md` are all satisfied.
- [x] Follow-on work such as the 19 sub-README rewrites from `../resource-map.md` §8.5 is explicitly deferred instead of silently absorbed.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md` for scope, risks, and acceptance criteria.
- **Plan**: See `plan.md` for sequencing, dependencies, rollback logic, and the one-week pacing model from iteration 028.
- **Verification**: See `checklist.md` for the Gate A close checklist, including strict validation, backfill, backup, restore, rollback, and warmup proof.
- **Closeout narrative**: See `implementation-summary.md` for the factual landed work, verification results, and remaining blockers.
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
