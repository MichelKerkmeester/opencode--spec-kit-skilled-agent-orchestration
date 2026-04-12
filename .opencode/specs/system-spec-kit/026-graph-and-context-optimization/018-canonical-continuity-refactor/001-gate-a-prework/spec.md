---
#SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2
title: "Gate A — Pre-work"
feature: phase-018-gate-a-prework
level: 2
status: complete
closed_by_commit: d35fc6e9a
parent: 018-canonical-continuity-refactor
gate: A
description: "Remove known template and packet-prep blockers before Gate B schema and runtime work begins."
trigger_phrases:
  - "gate a"
  - "pre-work"
  - "canonical continuity"
  - "phase 018"
  - "template hardening"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "018/001-gate-a-prework"
    last_updated_at: "2026-04-12T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Validated Gate A packet integrity during the Phase 018 deep review pass"
    next_safe_action: "Keep Gate A as closed prerequisite context for the later gates"
    key_files: [".opencode/specs/system-spec-kit/026-graph-and-context-optimization/018-canonical-continuity-refactor/001-gate-a-prework/spec.md"]
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Gate A — Pre-work

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-04-11 |
| **Branch** | TBD — assigned when Gate A implementation kicks off |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Gate A exists because phase 018 cannot safely begin merge-time continuity writes or archive-state migration while known template debt is still live. `../resource-map.md` flags orphan `metadata` anchor closes in `.opencode/skill/system-spec-kit/templates/level_3/spec.md` and `.opencode/skill/system-spec-kit/templates/level_3+/spec.md`, plus anchorless `.opencode/skill/system-spec-kit/templates/handover.md`, `.opencode/skill/system-spec-kit/templates/research.md`, and `.opencode/skill/system-spec-kit/templates/debug-delegation.md`; iteration 022 makes those defects hard blockers because `ANCHORS_VALID` and `MERGE_LEGALITY` fail on orphan or missing targets.

Gate A also carries the single non-negotiable migration prerequisite from iteration 016: identify and backfill the root packets whose only durable narrative still lives in memory files. `../implementation-design.md` and iteration 020 both place SQLite backup, restore rehearsal, and embedding warmup under the same week-0 gate, while the rollback drill is grounded in the master plan and iteration 028 so schema work does not begin without a safe recovery path.

### Purpose
Ship a one-week pre-work lane that removes template and packet-prep blockers, proves recovery safety, and leaves Gate B free to start schema changes without hidden continuity debt.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Repair the known Level 3 and Level 3+ spec-template anchor defects called out in `../resource-map.md` F-3 and `../scratch/resource-map/04-templates.md`.
- Add baseline anchors to `.opencode/skill/system-spec-kit/templates/handover.md`, `.opencode/skill/system-spec-kit/templates/research.md`, and `.opencode/skill/system-spec-kit/templates/debug-delegation.md` so they become legal merge targets before phase 018 save-path work.
- Record and implement the validator scope decision that `changelog/*` and `sharded/*` are exempt from merge-target validation by default, per the phase prompt and the uncertainty log in `../scratch/resource-map/04-templates.md`.
- Audit root packets, identify the approximately five packets missing canonical `implementation-summary.md`, and backfill them with human-reviewed summaries before any archive flip.
- Back up the SQLite database, restore on a copy, rehearse rollback on a copy, and verify `memory_context({ mode: "resume" })` warmup is below five seconds.

### Out of Scope
- `causal_edges` schema work, archive flips, and ranking changes planned for Gate B, per `../implementation-design.md` "Migration Strategy (M4)" and `../resource-map.md` §4 Gate B.
- `contentRouter`, `anchorMergeOperation`, `atomicIndexMemory`, or any `memory-save.ts` rewiring planned for Gate C, per `../resource-map.md` F-4/F-5/F-7.
- Reader retargeting, resume-ladder work, and `@context` protocol updates planned for Gate D, per iteration 020 "Phase 018.3" and iteration 028 "Gate D".
- The 19 memory-relevant sub-README rewrites listed in `../resource-map.md` §8.5. Those are follow-on doc-parity work, not Gate A blockers.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/templates/level_3/spec.md` | Modify | Close the orphan `metadata` anchor defect before strict validation and merge legality checks. |
| `.opencode/skill/system-spec-kit/templates/level_3+/spec.md` | Modify | Close the orphan `metadata` anchor and add explicit governance anchors. |
| `.opencode/skill/system-spec-kit/templates/handover.md` | Modify | Add baseline anchors for merge-safe continuation writes. |
| `.opencode/skill/system-spec-kit/templates/research.md` | Modify | Add baseline anchors for merge-safe research writes. |
| `.opencode/skill/system-spec-kit/templates/debug-delegation.md` | Modify | Add baseline anchors for merge-safe escalation writes. |
| `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` | Modify | Encode the Gate A scope rule that `changelog/*` and `sharded/*` remain exempt from merge-target validation. |
| `.opencode/skill/system-spec-kit/mcp_server/database/memory.db` | Operational backup | Create `memory-018-pre.db` backup and restore-test a copy before Gate B. |
| `[UNCERTAIN: exact ~5 root packet paths identified during Gate A audit]` | Modify | Backfill canonical `implementation-summary.md` where the packet currently depends on memory files only. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Repair the template anchor debt identified in `../resource-map.md` F-3. | `.opencode/skill/system-spec-kit/templates/level_3/spec.md` and `.opencode/skill/system-spec-kit/templates/level_3+/spec.md` no longer contain orphan `metadata` closes, and the affected templates pass strict anchor validation on filled examples. |
| REQ-002 | Add baseline anchors to `.opencode/skill/system-spec-kit/templates/handover.md`, `.opencode/skill/system-spec-kit/templates/research.md`, and `.opencode/skill/system-spec-kit/templates/debug-delegation.md`. | Each special template exposes explicit anchors so iteration 022 `MERGE_LEGALITY` has legal target regions before save-path rewrites begin. |
| REQ-003 | Keep anchorless changelog and sharded templates out of merge-target validation by default. | Validator behavior and packet docs both reflect the default exemption for `changelog/*` and `sharded/*`, matching the Gate A scope decision. |
| REQ-004 | Backfill all root packets missing canonical `implementation-summary.md` before archive-state migration. | The audit identifies the backlog, each missing packet gets a human-reviewed canonical summary, and the backfills are committed before Gate B work starts. |
| REQ-005 | Prove rollback readiness for the SQLite backing store. | A backup file exists, restore on a copy passes, and a rollback drill on a copy is documented as successful. |
| REQ-006 | Verify embedding health for resume warmup. | `memory_context({ mode: "resume" })` warmup completes in under five seconds with no timeout, matching the Gate A close criteria in iteration 020 and `../implementation-design.md`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Resolve how phase 018 will represent migration-file ownership before Gate B starts. | Either an empty `mcp_server/database/migrations/` convention is created, or Gate A explicitly records that migration logic will stay inline in `vector-index-schema.ts`. |
| REQ-008 | Keep Gate A scoped to blockers and safety work only. | The packet explicitly pushes Gate E sub-README rewrites and broader runtime/doc parity work into follow-on phases rather than absorbing them here. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All known template anchor bugs and anchorless special-template blockers are removed, and strict validation passes on the repaired template examples.
- **SC-002**: The root-packet audit produces a bounded, closed set of backfills, and all identified packets have canonical `implementation-summary.md` checked in before Gate B.
- **SC-003**: SQLite backup, restore-on-copy, and rollback-on-copy are all proven with operator-readable evidence.
- **SC-004**: Resume warmup completes in under five seconds, establishing the embedding health baseline required by Gate A close criteria.

### Acceptance Scenarios
- **Given** the Gate A packet is reviewed before implementation begins, **when** the operator checks the scope language, **then** the packet limits remediation to Level 3, Level 3+, and the three special templates while keeping the broader template audit read-only.
- **Given** the template and validator blocker list is used to plan remediation, **when** the operator follows the cited references, **then** every anchor and rollback prerequisite points to a resolvable source inside the parent packet or the canonical template tree.
- **Given** strict validation is run against the packet docs, **when** the template-source markers and section headers are checked, **then** the packet passes without template-structure or missing-reference errors.
- **Given** Gate A closes and Gate B is about to begin, **when** the operator reviews the documented safety prerequisites, **then** backup, restore, rollback, and warmup expectations are all explicit and grounded to the correct sources.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `../resource-map.md` §4 Gate A ordering | Gate A sequencing drifts and allows schema work to start early | Keep Gate A strictly ordered as template fixes + backfill + backup/warmup before any Gate B work. |
| Dependency | Iteration 022 validator contract | Save-path work may assume legal merge targets that do not exist yet | Treat `ANCHORS_VALID` and `MERGE_LEGALITY` as the design authority for Gate A template fixes. |
| Dependency | Iteration 016 M4 prerequisite | Archive flip can hide the only useful packet narrative if backfill is skipped | Complete the root-packet audit and backfills before any `is_archived` migration step. |
| Risk | Gate A scope expands into Gate E doc parity | Schedule slips without reducing implementation risk | Keep the 19 memory-relevant sub-README updates as explicit follow-on work, not a Gate A deliverable. |
| Risk | Backup or restore drill is run against the live DB | Production-like state could be damaged before migrations even begin | Run restore and rollback rehearsals on copies only, and record the copy-only rule in the plan and checklist. |
| Risk | Migration ownership stays ambiguous | Gate B loses time on avoidable packaging churn | Close REQ-007 during Gate A or document the unresolved choice with a named owner and follow-up. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Resume warmup for `memory_context({ mode: "resume" })` must complete in under 5 seconds before Gate A can close.
- **NFR-P02**: Backup and restore rehearsal should stay operationally lightweight enough to complete inside a single pre-work lane without blocking the full week.

### Security
- **NFR-S01**: Restore and rollback drills must run against copies only; the live SQLite file is never the rehearsal target.
- **NFR-S02**: Backup naming and storage must keep the Gate A snapshot unambiguous so rollback uses the intended pre-migration state.

### Reliability
- **NFR-R01**: Repaired templates must pass strict anchor validation consistently, not only under a one-off local edit path.
- **NFR-R02**: Rollback rehearsal must prove the database can return to a readable pre-drill state before any Gate B migration step is approved.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty root-packet audit result: If the audit finds fewer than five missing packets, Gate A still closes only after the full audited set is backfilled and reviewed.
- Multiple candidate memory narratives for one packet: Gate A must pick the most recent valuable narrative and keep human review in the loop, per iteration 016.
- Anchorless but intentionally non-mergeable templates: `changelog/*` and `sharded/*` stay exempt rather than receiving ad hoc anchors in Gate A.

### Error Scenarios
- Strict validation still fails after orphan-anchor repair: stop Gate A closeout and continue auditing template composition until the failing surface is resolved.
- Backup succeeds but restore fails on copy: treat Gate A as blocked; do not begin schema work.
- Warmup exceeds five seconds: record the exact slow path and escalate as a Gate A blocker rather than waiving the criterion.

### State Transitions
- Partial completion: Template fixes can land before backfill closes, but Gate A status remains planned or in progress until safety checks pass.
- Migrations convention unresolved: Gate A may document the open decision, but Gate B cannot start until ownership is explicit.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 21/25 | Crosses templates, validator behavior, root packet docs, and DB safety rehearsal, but stays out of runtime save/search rewrites. |
| Risk | 20/25 | Backup and rollback proof are safety-critical, and missing canonical packet summaries would undermine the archive migration. |
| Research | 14/20 | Research is already converged; the main work is disciplined execution against `../implementation-design.md`, `../resource-map.md`, and iterations 016/020/022/028. |
| **Total** | **55/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Which exact root packets make up the "approximately five" backfill set once the Gate A audit is run? Iteration 016 defines the prerequisite, but the concrete packet list is not enumerated in the current research packet.
- Will Gate A create an empty `mcp_server/database/migrations/` convention, or will it explicitly record inline migration ownership in `vector-index-schema.ts`? `../resource-map.md` §8.6 presents the directory as an optional follow-up, so the implementation choice still needs confirmation.
- [UNCERTAIN: whether any example-template sync work must land in the same change set as the canonical template repairs, or can trail by one follow-up pass.]
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
