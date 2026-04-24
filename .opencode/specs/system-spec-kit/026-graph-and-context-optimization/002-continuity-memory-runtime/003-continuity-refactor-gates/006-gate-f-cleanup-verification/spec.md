---
title: "...ontext-optimization/002-continuity-memory-runtime/003-continuity-refactor-gates/006-gate-f-cleanup-verification/spec]"
description: "Verify Gate B cleanup completeness, confirm no orphan references remain, and record whether archived-tier runtime cleanup is already complete or still needs follow-up."
trigger_phrases:
  - "gate f"
  - "cleanup verification"
  - "gate b cleanup"
  - "archived-tier deprecation"
  - "orphan causal edges"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/003-continuity-refactor-gates/006-gate-f-cleanup-verification"
    last_updated_at: "2026-04-12T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Rewrote packet to cleanup-only Gate F scope"
    next_safe_action: "Use implementation-summary.md as the audit record"
    key_files: ["spec.md", "implementation-summary.md"]
closed_by_commit: TBD
status: complete
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
---
# Feature Specification: Gate F — Cleanup Verification
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| Level | 2 |
| Priority | P1 |
| Status | Complete |
| Created | 2026-04-11 |
| Updated | 2026-04-12 |
| Branch |
| Parent Spec | `../spec.md` |
| Parent Plan | `../plan.md` |
| Predecessor | `005-gate-e-runtime-migration` |
| Successor | `007-sk-system-speckit-revisit` | `system-speckit/026-graph-and-context-optimization` |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Gate B cleanup was supposed to delete legacy `**/memory/*.md` artifacts and retire archived-tier runtime branches, but the Gate F packet still described a dead observation-and-decision model. Until this packet is rewritten and the cleanup is re-verified against the live SQLite database plus on-disk spec tree, the phase does not provide an auditable answer to the real question: did Gate B actually finish the cleanup without leaving stale rows, orphan causal edges, or misleading packet guidance behind?

### Purpose

Provide a narrow, auditable verification pass that proves legacy memory-file rows are gone from `memory_index`, proves dependent `causal_edges` do not point at deleted rows, proves on-disk spec packets no longer contain `**/memory/*.md` files, and proves archived-tier runtime cleanup is already complete or clearly called out for later follow-up.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Query the live Spec Kit Memory database at `.opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite`.
- Verify `memory_index` contains no `file_path LIKE '%/memory/%.md'` rows after cleanup.
- Verify `causal_edges` contains no rows whose `source_id` or `target_id` points at a deleted `memory_index` record.
- Verify `.opencode/specs` contains no `**/memory/*.md` files and report any empty `memory/` directories.
- Confirm whether the archived-tier ranking penalty, `archived_hit_rate` metric, and `is_archived` schema comment are already in the expected post-cleanup state.
- Rewrite this packet so its docs describe cleanup verification and deprecated-code verification only.

### Out of Scope

- Any new observation window, `archived_hit_rate` trend analysis, or EWMA decision ladder.
- Retire/keep/investigate decision-making.
- Dropping the `is_archived` column from SQLite.
- Deleting the single pre-existing baseline non-memory archived row.
- Editing files outside this packet to clean up broader wording drift.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Modify | Rewrite Gate F scope to cleanup verification only. |
| `plan.md` | Modify | Replace the dead observation plan with the actual verification phases. |
| `tasks.md` | Modify | Record the completed verification and cleanup work from this turn. |
| `checklist.md` | Modify | Convert exit gates to cleanup-verification checks and mark them honestly. |
| `implementation-summary.md` | Modify | Capture the exact database, filesystem, and code-verification evidence from this turn. |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Prove stale legacy memory rows are removed from the live DB | `SELECT COUNT(*) FROM memory_index WHERE file_path LIKE '%/memory/%.md'` returns `0` after cleanup |
| REQ-002 | Prove no orphan causal edges remain | `SELECT COUNT(*) FROM causal_edges WHERE source_id NOT IN (SELECT id FROM memory_index) OR target_id NOT IN (SELECT id FROM memory_index)` returns `0` |
| REQ-003 | Prove on-disk spec packets contain no `**/memory/*.md` files | `find .opencode/specs -path '*/memory/*.md' -type f | wc -l` returns `0` |
| REQ-004 | Preserve the baseline archived row | `SELECT COUNT(*) FROM memory_index WHERE is_archived = 1` returns `1`, and the remaining row is the known baseline row |
| REQ-005 | Keep `is_archived` deprecated only | No schema drop occurs; the column remains documented as deprecated |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Verify archived-tier runtime cleanup in the active code paths | `stage2-fusion.ts` has no archived-tier penalty and `memory-crud-stats.ts` has no `archived_hit_rate` metric |
| REQ-007 | Verify schema comments reflect the new state | `vector-index-schema.ts` keeps `is_archived` and marks it deprecated in comments |
| REQ-008 | Rewrite packet docs to the cleanup-only model | All five docs use cleanup-verification wording rather than observation/decision wording |
| REQ-009 | Add validator-friendly continuity metadata | All five docs include `_memory.continuity`, `status: complete`, and `closed_by_commit: TBD` |

### P2 - Follow-up Recording

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-010 | Record broader wording drift outside this packet as TODOs only | Out-of-scope locations are listed in `implementation-summary.md` without unrelated edits |
| REQ-011 | Preserve exact evidence in the packet | SQL, counts, and filesystem command results are recorded in `implementation-summary.md` |
<!-- /ANCHOR:requirements -->

### Acceptance Scenarios

- **Given** stale `*/memory/*.md` rows still exist in `memory_index`, **when** Gate F runs the verification pass, **then** it deletes dependent edges first and removes only those stale rows.
- **Given** the filesystem already has no `**/memory/*.md` files, **when** Gate F compares DB and disk state, **then** it still treats stale DB rows as a cleanup failure until the DB is corrected.
- **Given** `stage2-fusion.ts` and `memory-crud-stats.ts` already lack archived-tier behavior, **when** Gate F audits deprecated code, **then** it records PASS rather than widening scope.
- **Given** broader archived-tier wording remains outside the packet, **when** Gate F closes, **then** it records those locations as follow-up TODOs without editing unrelated files.

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The live DB shows `0` legacy `*/memory/*.md` rows and `0` orphan causal edges.
- **SC-002**: The filesystem shows `0` `**/memory/*.md` files and no empty `memory/` directories needing cleanup.
- **SC-003**: The only remaining archived row is the preserved baseline non-memory row `2174`.
- **SC-004**: Archived-tier runtime cleanup is verified as already complete, with broader wording drift captured as explicit follow-up notes instead of silent scope creep.
- **SC-005**: `validate.sh --strict` passes for this packet after the rewrite.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Parent handover and implementation design | Gate F needs parent context to verify the packet rewrite against phase reality | Re-read both before editing |
| Dependency | Live SQLite DB | Cleanup verification depends on the actual runtime DB state, not packet assumptions | Query the configured DB path directly |
| Risk | Stale DB rows remain after Gate B cleanup | Gate F would falsely declare the cleanup done | Query the live DB first, then run the minimal delete transaction only against stale `*/memory/*.md` rows and their dependent edges |
| Risk | The baseline archived row is mistaken for phase-018 residue | Incorrect destructive cleanup | Record the baseline row ID and path explicitly and preserve it |
| Risk | Broader archived-tier wording still exists elsewhere | Hidden drift remains after packet closeout | Record out-of-scope TODOs in `implementation-summary.md` without editing unrelated files |
<!-- /ANCHOR:risks -->

### Non-Functional Requirements

### Maintainability
- **NFR-M01**: Gate F must stay packet-local and must not hide broader cleanup drift behind silent unrelated edits.

### Reliability
- **NFR-R01**: Cleanup verification must rely on direct SQL and filesystem checks instead of inferred state.

### Safety
- **NFR-S01**: Any cleanup in this phase must remain limited to stale `*/memory/*.md` rows and their dependent `causal_edges`.

### Edge Cases

### Data Edge Cases
- A single archived row may remain if it is the known baseline non-memory row and must not be deleted.
- The filesystem can already be clean even when stale DB rows remain, so both checks are required.

### Documentation Edge Cases
- The folder name still includes `archive-permanence`, but the in-file contract now defines cleanup verification only.
- Broader archived-tier wording outside this packet must be logged as TODOs instead of fixed here.

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None inside the owned packet scope. Broader wording follow-up is recorded in `implementation-summary.md` as out-of-scope TODOs.
<!-- /ANCHOR:questions -->
