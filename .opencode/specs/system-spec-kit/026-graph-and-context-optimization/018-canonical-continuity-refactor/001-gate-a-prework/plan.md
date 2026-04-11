---
title: "Gate A — Pre-work"
feature: phase-018-gate-a-prework
level: 2
status: planned
parent: 018-canonical-continuity-refactor
gate: A
description: "Execution plan for the week-0 blocker-removal lane that must complete before any phase 018 schema or runtime refactor work starts."
trigger_phrases:
  - "gate a"
  - "pre-work plan"
  - "canonical continuity"
  - "template hardening"
  - "rollback rehearsal"
importance_tier: "important"
contextType: "planning"
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
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement, scope boundaries, and Gate A exit criteria are synchronized across `spec.md`, `plan.md`, `tasks.md`, and `checklist.md`.
- [ ] Template debt is grounded to `../resource-map.md` F-3 plus `../scratch/resource-map/04-templates.md`.
- [ ] Root-packet backfill prerequisite, backup requirement, and warmup threshold are grounded to iterations 016 and 020.

### Definition of Done
- [ ] Template anchor repairs and special-template anchor additions are implemented and verified against strict validation.
- [ ] Root packets missing canonical `implementation-summary.md` are backfilled, reviewed, and committed.
- [ ] SQLite backup exists, restore-on-copy passes, rollback-on-copy passes, and resume warmup is under five seconds.
- [ ] Gate A scope remains limited to blocker removal; no Gate B, C, D, or E implementation work is pulled in prematurely.
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
Research and resource-map findings freeze the Gate A target set first. That frozen set drives template and validator remediation, which then enables the packet backfill lane. Once the packet backfill closes, the operational safety lane creates the SQLite snapshot, restores and rolls back against a copy, and finishes with resume warmup verification. Only after those outputs exist can Gate A hand off to Gate B.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Audit and boundary freeze
- [ ] Confirm the exact template defects and validator scope concerns from `../resource-map.md` F-3 and `../scratch/resource-map/04-templates.md`.
- [ ] Identify the root packets missing canonical `implementation-summary.md`, using iteration 016 as the prerequisite source of truth.
- [ ] Freeze the default scope decision that `changelog/*` and `sharded/*` are exempt from merge-target validation unless a later phase explicitly expands their contract.
- [ ] Record the unresolved migration-placement choice if it cannot be closed inside Gate A.

### Phase 2: Remediation and backfill
- [ ] Repair orphan `metadata` anchor handling in Level 3 and Level 3+ spec templates.
- [ ] Add baseline anchors to `.opencode/skill/system-spec-kit/templates/handover.md`, `.opencode/skill/system-spec-kit/templates/research.md`, and `.opencode/skill/system-spec-kit/templates/debug-delegation.md`.
- [ ] Update validator behavior or documented validator policy so anchorless changelog/sharded templates do not fail merge-target legality by default.
- [ ] Generate, human-review, and commit canonical `implementation-summary.md` backfills for the audited root packets.

### Phase 3: Safety verification and closeout
- [ ] Create the Gate A SQLite backup and verify restore-on-copy.
- [ ] Rehearse rollback on a copy and capture the exact restore/rollback procedure.
- [ ] Run resume warmup and verify the under-five-second threshold from iteration 020.
- [ ] Reconcile packet docs and checklist status so Gate A hands off cleanly into Gate B.
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
| Root packet audit result | Internal | Yellow | The exact packet list is not enumerated in the current docs; the audit must produce it before backfill can close. |
| SQLite tool availability in operator environment | External/runtime | Yellow | If unavailable, the restore drill needs an equivalent SQLite client and explicit command substitution before Gate A can close. |
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
- [ ] Gate A snapshot file exists before any rehearsal begins.
- [ ] Restore target is a copy, not the live SQLite file.
- [ ] Root packet backfill commits are isolated enough to revert cleanly if review finds narrative drift.
- [ ] Validator failures introduced by template edits can be traced back to a bounded change set.

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
