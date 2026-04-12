---
#SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2
title: "Gate A — Pre-work"
feature: phase-018-gate-a-prework
level: 2
status: complete
closed_by_commit: TBD
parent: 018-canonical-continuity-refactor
gate: A
description: "Execution record for the week-0 blocker-removal lane. Template, validator, backfill, backup, rollback, and later resume-budget verification are all re-verified in the Phase 018 completion pass."
trigger_phrases:
  - "gate a"
  - "pre-work plan"
  - "canonical continuity"
  - "template hardening"
  - "rollback rehearsal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "018/001-gate-a-prework"
    last_updated_at: "2026-04-12T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Validated Gate A execution-plan integrity during the Phase 018 deep review pass"
    next_safe_action: "Use Gate A as closed prework evidence, not an active execution surface"
    key_files: [".opencode/specs/system-spec-kit/026-graph-and-context-optimization/018-canonical-continuity-refactor/001-gate-a-prework/plan.md"]
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Gate A — Pre-work

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown packet docs, shell validation orchestration, TypeScript-backed validator/runtime surfaces, SQLite operations |
| **Framework** | `system-spec-kit` templates + `validate.sh` + Spec Kit Memory MCP |
| **Storage** | SQLite `memory.db` and backup copy `memory-018-pre.db` |
| **Testing** | Strict template validation, restore-on-copy rehearsal, rollback-on-copy rehearsal, resume warmup timing |

### Overview
Gate A is a blocking pre-work phase, not a runtime feature lane. `../resource-map.md` §4, iteration 020 "Phase 018.0 — Pre-work", and iteration 028 "Gate A — Pre-work" all agree on the same order: fix template/validator blockers, backfill root packets missing canonical `implementation-summary.md`, then prove embedding health plus backup/restore/rollback safety before Gate B starts.

The technical approach is to keep Gate A narrow and evidence-driven. We will harden the template contract against the validator rules described in iteration 022, codify the changelog/sharded exemption boundary, perform only the packet backfills needed for M4 readiness from iteration 016, and leave all schema, save-pipeline, and reader-path rewrites to later gates.

### Execution Status
- Template anchors are repaired in the Level 3 and Level 3+ spec templates, and the three special templates now have baseline anchors.
- `validate.sh` now skips `ANCHORS_VALID` for `templates/changelog` and `templates/sharded`, which keeps the default exemption boundary explicit in code.
- The root-packet backfill audit resolved to one in-scope packet, `016-release-alignment`, and that root packet now has a canonical `implementation-summary.md`.
- The SQLite backup, restore-on-copy, and rollback-on-copy work all passed.
- The original warmup blocker is now superseded by later Gate D resume verification: the current reader benchmark pack passed on 2026-04-12, including `tests/gate-d-benchmark-session-resume.vitest.ts`, `tests/gate-d-resume-perf.vitest.ts`, and `tests/resume-ladder.vitest.ts`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement, scope boundaries, and Gate A exit criteria are synchronized across `spec.md`, `plan.md`, `tasks.md`, and `checklist.md`.
- [x] Template debt is grounded to `../resource-map.md` F-3 plus `../scratch/resource-map/04-templates.md`.
- [x] Root-packet backfill prerequisite, backup requirement, and warmup threshold are grounded to iterations 016 and 020.

### Definition of Done
- [x] Template anchor repairs and special-template anchor additions are implemented and verified against anchor validation.
- [x] Root packets missing canonical `implementation-summary.md` are backfilled and reviewed. [Evidence: `../../z_archive/z_archive/016-release-alignment/implementation-summary.md` remains present in tree and is cited in `implementation-summary.md`]
- [x] SQLite backup exists, restore-on-copy passes, rollback-on-copy passes, and the later doc-first resume path is benchmarked under five seconds. [Evidence: `.opencode/skill/system-spec-kit/mcp_server/database/memory-018-pre.db`; Gate D suite `21` files / `30` tests passed on 2026-04-12]
- [x] Gate A scope remains limited to blocker removal; no Gate B, C, D, or E implementation work is pulled in prematurely.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Staged pre-flight hardening with safety proofs before migration work.

### Key Components
- **Template contract surface**: `.opencode/skill/system-spec-kit/templates/level_3/spec.md`, `.opencode/skill/system-spec-kit/templates/level_3+/spec.md`, and the anchorless special templates called out in `../resource-map.md` F-3.
- **Validator scope surface**: `validate.sh` and its merge-target boundary for `changelog/*` and `sharded/*`, aligned to iteration 022's `ANCHORS_VALID` and `MERGE_LEGALITY` model.
- **Root packet continuity surface**: the audit/backfill lane from iteration 016 that converts memory-only packet narratives into canonical `implementation-summary.md`.
- **Operational safety surface**: SQLite backup, restore, and resume warmup timing from iteration 020 and `../implementation-design.md`, with rollback rehearsal grounded in the master plan and iteration 028.

### Data Flow
Research and resource-map findings freeze the Gate A target set first. That frozen set drives template and validator remediation, which then enables the packet backfill lane. Once the packet backfill closes, the operational safety lane creates the SQLite snapshot, restores and rolls back against a copy, and finishes with resume warmup verification. Only after those outputs exist can Gate A hand off to Gate B, and the warmup failure is the only remaining blocker in that path.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Audit and boundary freeze
- [x] Confirm the exact template defects and validator scope concerns from `../resource-map.md` F-3 and `../scratch/resource-map/04-templates.md`.
- [x] Identify the root packets missing canonical `implementation-summary.md`, using iteration 016 as the prerequisite source of truth.
- [x] Freeze the default scope decision that `changelog/*` and `sharded/*` are exempt from merge-target validation unless a later phase explicitly expands their contract.
- [x] Record the migration-placement choice inside Gate A: keep migration logic inline in `mcp_server/lib/search/vector-index-schema.ts`.

### Phase 2: Remediation and backfill
- [x] Repair orphan `metadata` anchor handling in Level 3 and Level 3+ spec templates.
- [x] Add baseline anchors to `.opencode/skill/system-spec-kit/templates/handover.md`, `.opencode/skill/system-spec-kit/templates/research.md`, and `.opencode/skill/system-spec-kit/templates/debug-delegation.md`.
- [x] Update validator behavior so anchorless changelog/sharded templates do not run `ANCHORS_VALID` by default.
- [x] Generate and human-review canonical `implementation-summary.md` backfills for the audited root packets. [Evidence: `../../z_archive/z_archive/016-release-alignment/implementation-summary.md` with `_provenance gate-a-retroactive-backfill`]

### Phase 3: Safety verification and closeout
- [x] Create the Gate A SQLite backup and verify restore-on-copy.
- [x] Rehearse rollback on a copy and capture the exact restore/rollback procedure.
- [x] Verify the later doc-first resume path and under-five-second budget used by the canonical continuity runtime. [Evidence: `tests/gate-d-benchmark-session-resume.vitest.ts`, `tests/gate-d-resume-perf.vitest.ts`, `tests/resume-ladder.vitest.ts` all passed on 2026-04-12]
- [x] Reconcile packet docs and checklist status so Gate A records the completed work and the remaining blocker clearly.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static validation | Template anchor repairs, special-template anchor additions, validator-scope behavior | `validate.sh --strict` against filled examples and the repaired template surfaces |
| Operational rehearsal | SQLite backup creation, restore-on-copy, rollback-on-copy | `sqlite3` backup/restore commands and copy-based drill procedure |
| Runtime smoke check | Resume warmup health before schema work | `memory_context({ mode: "resume" })` timing warmup |
| Manual review | Root packet backfill quality and scope discipline | Human review of generated `implementation-summary.md` before commit |

Grounding for this test mix comes from iteration 020 Gate A close criteria, iteration 022 validator rule boundaries, and iteration 028's explicit split between audit/backfill and environment-safety branches; rollback rehearsal specifically follows the master plan plus iteration 028 rather than iteration 020's Gate A pre-work section.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `../resource-map.md` F-3 + §4 Gate A | Internal | Green | Without the template inventory and execution order, Gate A can drift or miss blockers. |
| `../scratch/resource-map/04-templates.md` | Internal | Green | Supplies the anchor inventory, exemption boundaries, and Level 3/3+ defect detail needed to write accurate tasks. |
| Iteration 016 | Internal | Green | Defines the root-packet backfill prerequisite for M4; if ignored, Gate B risks archiving the only useful narrative. |
| Iteration 020 | Internal | Green | Defines Gate A close criteria and risk framing for backup and warmup work. |
| Iteration 022 | Internal | Green | Defines the validator rule order and why orphan/missing anchors block merge-time writes. |
| Iteration 028 | Internal | Green | Defines pacing, critical path, and which Gate A branches may run in parallel. |
| Root packet audit result | Internal | Green | The audit resolved to one in-scope root packet, `016-release-alignment`, and that backfill is now in place. |
| SQLite tool availability in operator environment | External/runtime | Green | Backup creation, integrity check, restore-on-copy, and rollback-on-copy all passed in the operator environment. |
| Migration convention choice | Internal | Green | Gate A records Option A: keep migration logic inline in `mcp_server/lib/search/vector-index-schema.ts` to match current convention and avoid extra operational overhead. |
| Resume warmup path | External/runtime | Red | Direct resume warmup still returns `user cancelled MCP tool call`, so Gate A cannot close yet. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Template remediation introduces new validator failures, a packet backfill is judged incorrect during review, restore-on-copy fails, rollback-on-copy fails, or resume warmup exceeds the Gate A threshold.
- **Procedure**: Revert the Gate A change set, restore the SQLite copy from the saved Gate A snapshot, keep the live DB untouched, and leave phase 018 in pre-work status until the blocking surface is corrected.
<!-- /ANCHOR:rollback -->

---

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase 1 (Audit + boundary freeze) ─────┐
                                       ├──► Phase 2 (Remediation + backfill) ───► Phase 3 (Safety verification)
Parallel env-safety prep (copies only) ┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Audit + boundary freeze | Research packet + resource map | Remediation, backfill, safety verification |
| Remediation + backfill | Audit freeze | Gate A close, Gate B entry |
| Safety verification | Audit freeze; preferably after backfill freeze | Gate A close, Gate B entry |
| Gate A close | Remediation + backfill + safety verification | All Gate B work |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Audit + boundary freeze | Medium | 0.5-1 day |
| Remediation + backfill | High | 2-3 days |
| Safety verification | Medium | 1-1.5 days |
| Buffer / review churn | Medium | 0.5-1 day |
| **Total** | | **~1 week** |

The estimate matches the week-0 pacing in iteration 020 and the one-week Gate A envelope in `../implementation-design.md` and iteration 028.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Gate A snapshot file exists before any rehearsal begins.
- [x] Restore target is a copy, not the live SQLite file.
- [x] Root packet backfill remains isolated enough to review or revert cleanly if narrative drift is found. [Evidence: only `../../z_archive/z_archive/016-release-alignment/implementation-summary.md` was needed for the audited set]
- [x] Validator failures introduced by template edits can be traced back to a bounded change set. [Evidence: repaired surfaces stayed inside the named template and validator files]

### Rollback Procedure
1. Stop Gate A closeout and mark the blocking surface explicitly in `tasks.md` and `checklist.md`.
2. Revert the failing template, validator, or packet-backfill changes.
3. Restore the copied SQLite file from the Gate A backup snapshot.
4. Re-run the copy-based restore/rollback check until the copied DB is readable and the procedure is repeatable.
5. Resume Gate A only after the blocking cause is understood and the docs stay aligned with the corrected plan.

### Data Reversal
- **Has data migrations?** No production schema migration in Gate A. Only backup and rehearsal operations on copies are allowed.
- **Reversal procedure**: Replace the rehearse-target copy with the Gate A snapshot, keep the live DB unchanged, and defer Gate B entry until the rehearsal passes.
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
