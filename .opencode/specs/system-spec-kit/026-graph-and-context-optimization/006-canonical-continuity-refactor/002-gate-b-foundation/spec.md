---
title: "Gate B — Foundation"
feature: phase-018-gate-b-foundation
level: 3
status: complete
closed_by_commit: TBD
parent: 006-canonical-continuity-refactor
gate: B
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "026-graph-and-context-optimization/006-canonical-continuity-refactor/002-gate-b-foundation"
    last_updated_at: "2026-04-11T20:55:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Recorded Gate B archived-tier cleanup follow-through"
    next_safe_action: "Have orchestrator commit the validated Gate B cleanup"
    key_files: [".opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/002-gate-b-foundation/spec.md"]
description: "Establish the irreversible foundation for phase 018 by rehearsing the migration on a copy, adding the approved causal-edge anchor fields, executing the rebaselined archive flip, and preserving the post-cleanup compatibility contract before writer and reader retargeting begins."
trigger_phrases: ["gate b", "foundation", "canonical continuity", "phase 018", "archive flip"]
importance_tier: "important"
contextType: "planning"
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Gate B — Foundation

---

## EXECUTIVE SUMMARY

Gate B is the one-way-door foundation step for phase 018. It is where phase 018 proves the migration on a copy, updates `causal_edges` for anchor-aware continuity, and executes the rebaselined archive flip for the `183` legacy memory-path rows while preserving the `1` pre-existing archived non-memory baseline row.

The grounding corrects two early research assumptions. First, `memory_index.is_archived` already exists in `vector-index-schema.ts` and in the downgrade rebuild path, so Gate B does not add a new `memory_index` column. Second, the active post-cleanup contract no longer uses archived-tier ranking (`x0.3`) or `archived_hit_rate`; those rollout-era behaviors were removed under the Phase 018 no-observation directive after the archive flip landed.

**Key Decisions**: keep the canonical migration source of truth in `vector-index-schema.ts`; require a hard rollback rehearsal on a DB copy before the production window opens.

**Critical Dependencies**: Gate A is closed, iteration 037 dry-run evidence exists, and the tests/lead handoff from iteration 028 happens before the production migration.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-04-11 |
| **Branch** | `[UNCERTAIN: branch not assigned for Gate B implementation]` |
| **Parent Spec** | `../spec.md` |
| **Parent Plan** | `../plan.md` |
| **Predecessor** | `001-gate-a-prework` |
| **Successor** | `003-gate-c-writer-ready` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 018 cannot start canonical writer or reader retargeting on top of an unproven migration surface. Gate B is the step where the continuity refactor becomes operationally real: the archive state flips for all 155 legacy memory-file rows, retrieval ranking starts demoting archived rows, and the causal graph picks up the anchor-aware fields needed to preserve mixed legacy and continuity-era lineage.

The research packet also exposes an important drift correction. `../resource-map.md` F-1 and `../scratch/resource-map/01-schema.md` both show that `memory_index.is_archived` already exists, while the early Gate B wording in iterations 016, 020, and 037 still talks about adding it. Gate B must follow the corrected scope, not the superseded assumption: reuse the existing archive column, migrate `causal_edges`, prove rollback on a copy, then execute the archive flip and ranking/metric work.

### Purpose
Deliver the two-week foundation gate that proves the migration path, executes the archive-state cutover safely, and leaves phase 018 ready for Gate C writer work without unresolved schema or observability debt.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Run the iteration 037 dry-run pipeline against a production-copy snapshot, capture JSON evidence, rerun for idempotence, and pass the hard rollback drill before the production window opens.
- Apply the approved Gate B schema delta in `mcp_server/lib/search/vector-index-schema.ts`: add `source_anchor TEXT` and `target_anchor TEXT` to `causal_edges`, plus the anchor indexes required for mixed pre/post migration traversal.
- Thread the new causal-edge fields through `mcp_server/lib/storage/causal-edges.ts`, `mcp_server/lib/storage/checkpoints.ts`, and `mcp_server/lib/storage/reconsolidation.ts`.
- Archive-ranking was removed per DELETE-not-archive directive; Gate B no longer owns archive flip, archived-hit-rate reporting, or archive-specific fusion weighting.
- Verify whether `mcp_server/lib/storage/schema-downgrade.ts` needs a matching update or an explicit exclusion note for the narrowed Gate B schema delta.

### Out of Scope
- Adding `memory_index.is_archived` as a new schema column. `../resource-map.md` F-1 and `../scratch/resource-map/01-schema.md` both mark that work as already done.
- Gate C writer work such as `contentRouter`, `anchorMergeOperation`, `atomicIndexMemory`, `generate-context.ts` routing, or `memory-save.ts` rewiring.
- Gate D reader work such as `memory-context.ts`, `memory-search.ts`, `session-resume.ts`, or the resume ladder.
- Gate F permanence decisions. The archive tier, `archived_hit_rate` telemetry, and observation windows were removed per the DELETE-not-archive directive.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts` | Modify | Add the approved `causal_edges` anchor columns and supporting indexes in the canonical inline migration chain. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts` | Modify | Thread `source_anchor` and `target_anchor` through create, update, and read logic. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts` | Modify | Preserve the new causal-edge fields across snapshot and restore. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts` | Modify | Populate anchor-aware supersede edges during archive and replacement flows. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts` | Verify | Confirm no archived-tier ranking logic remains (archive ranking was removed per DELETE-not-archive directive). |
| `.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts` | Verify or document | Confirm whether the narrowed migration needs downgrade handling or record why it does not. |
| `.opencode/skill/system-spec-kit/scripts/memory/archive-flip-018.sh` | Create | Run the bounded `is_archived=1` flip for the 155 legacy memory rows. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts` | No change | `archived_hit_rate` removed per DELETE-not-archive directive. No archive telemetry needed. |
| `[UNCERTAIN: optional standalone SQL file at mcp_server/database/migrations/018-002-add-causal-edges-anchor-columns.sql]` | Create only if ADR-001 chooses standalone packaging | Provide operator-visible SQL while keeping the canonical migration source of truth explicit. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Gate B must pass a copy-first dry run before production execution. | The iteration 037 rehearsal flow produces a JSON report with schema, row-count, sample-row, search-equivalence, and rollback evidence, and the rerun is a no-op at the operator level. |
| REQ-002 | Gate B must follow the corrected archive-column scope. | No new `ALTER TABLE memory_index ADD COLUMN is_archived` is introduced; packet docs and implementation only reuse the existing `is_archived` field. |
| REQ-003 | The approved schema delta must land on `causal_edges`. | `vector-index-schema.ts` adds `source_anchor TEXT` and `target_anchor TEXT`, plus the anchor-aware indexes needed for mixed-edge traversal. |
| REQ-004 | Anchor fields must round-trip through storage helpers. | `causal-edges.ts`, `checkpoints.ts`, and `reconsolidation.ts` all read and write the new anchor fields without dropping them. |
| REQ-005 | The archive flip must be bounded and provable. | `SELECT COUNT(*) FROM memory_index WHERE is_archived=1` returns 155 after the production flip, and non-target row counts remain consistent with the rehearsal baseline. |
| REQ-006 | Archived rows must be demoted but still recoverable. | Stage-2 fusion applies an archived multiplier of `0.3`, and sample searches show fresh spec-doc results outranking archived rows when relevance is comparable. |
| REQ-007 | ~~Archived retrieval must become observable in Gate B itself.~~ | Removed per DELETE-not-archive directive. Archive telemetry is not needed. |
| REQ-008 | Rollback readiness must stay at hard-rollback quality. | Gate B sign-off uses the hard rollback path from the rehearsal, not the soft index-drop-only fallback. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | Migration packaging must be explicit. | ADR-001 records whether the operator-facing SQL stays inline in `vector-index-schema.ts` or is paired with a standalone `.sql` file. |
| REQ-010 | `schema-downgrade.ts` must be resolved, not ignored. | Gate B either confirms no downgrade change is needed for the narrowed anchor-column migration or documents the exclusion and its rationale. |
| REQ-011 | Gate B docs must reconcile the early-research drift. | Packet docs call out that iteration 016, iteration 020, and iteration 037 still mention an `is_archived` add-column step, while `../resource-map.md` and `../scratch/resource-map/01-schema.md` supersede that assumption. |
| REQ-012 | The production window must leave rollback headroom. | The copy rehearsal duration and maintenance-window notes align with iteration 037 guidance that the rehearsal should fit inside half of the planned production freeze window. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Copy rehearsal passes, rerun is a clean no-op, and hard rollback returns the copy to logical baseline equivalence.
- **SC-002**: `causal_edges` carries the approved anchor fields and indexes, and the storage helpers keep them intact across create, restore, and reconsolidation paths.
- **SC-003**: The production archive flip marks exactly 155 legacy memory rows as archived without introducing unintended row loss or duplicate schema work.
- **SC-004**: ~~Archived results are visibly deprioritized in ranking and `archived_hit_rate` is live.~~ Removed per DELETE-not-archive directive.
- **SC-005**: Mixed pre/post migration causal-graph queries still complete at 2 hops, proving continuity across the cutover boundary.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Gate A close criteria | Gate B starts without backup, rollback discipline, or packet-prep closure | Treat Gate A closure as a hard prerequisite, matching `../implementation-design.md` and iteration 028. |
| Dependency | `../resource-map.md` F-1/F-2 and `../scratch/resource-map/01-schema.md` | The packet could implement the wrong schema scope | Keep the docs explicit that `is_archived` already exists and only the causal-edge anchor delta is new. |
| Dependency | Iteration 037 rehearsal contract | Production migration lacks operator-grade evidence | Require JSON evidence plus rerun and hard rollback proof before the maintenance window. |
| Risk | Early iteration 035 sketches a wider tuple migration | Team may implement a broader schema change than the approved Gate B scope | Freeze Gate B to the critical-file list from the prompt and mark the broader tuple plan as `[UNCERTAIN: deferred or superseded for this gate]`. |
| Risk | Ranking regression hides fresh spec docs or over-surfaces archive | Reader work starts from the wrong ranking baseline | Validate sample searches after the `x0.3` change and keep rollback ready if fresh docs do not outrank archived peers. |
| Risk | `schema-downgrade.ts` is left ambiguous | Later recovery paths may surprise operators | Resolve REQ-010 inside Gate B instead of carrying the uncertainty forward silently. |
| Risk | Maintenance window is undersized | Production rollback headroom vanishes under stress | Use the rehearsal timing from iteration 037 to size the window conservatively and preserve rollback time. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The rehearsal query replay stays within iteration 037's acceptance bound of no worse than `1.20x` baseline p95 for the fixed query set.
- **NFR-P02**: ~~Gate B makes `archived_hit_rate` visible.~~ Removed per DELETE-not-archive directive.

### Security
- **NFR-S01**: All rehearsal, restore, and rollback operations run against copies only until the approved maintenance window begins.
- **NFR-S02**: The archive flip script targets only legacy memory-file rows and is not broadened to spec-doc or non-memory surfaces.

### Reliability
- **NFR-R01**: Rehearsal evidence must show row counts preserved except for the intended archive-state change.
- **NFR-R02**: Hard rollback returns the DB copy to logical baseline equivalence before Gate B can claim readiness.

---

## 8. EDGE CASES

### Data Boundaries
- Pre-existing non-memory archived rows: follow iteration 037's rule that the post-run count must match baseline rather than assuming literal zero forever.
- Doc-level causal edges: `source_anchor` and `target_anchor` may remain null for doc-level links; null is not itself a failure.
- Mixed legacy and post-migration edges: Gate B must preserve BFS behavior until later gates fully retarget readers.

### Error Scenarios
- Rehearsal passes once but rerun mutates the candidate copy: treat the migration wrapper as non-idempotent and block promotion.
- Production archive flip does not land on exactly 155 rows: treat Gate B as failed and use the hard rollback path.
- Ranking change surfaces archived rows ahead of comparable fresh spec docs: pause Gate B closeout and fix weighting or fallback logic before handoff.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 19/25 | Crosses schema, storage helpers, ranking, metrics, and operator scripts, but stays out of writer and reader rewrites. |
| Risk | 24/25 | The archive flip is a one-way operational step and the gate depends on rollback-quality migration proof. |
| Research | 17/20 | Research is converged, but the packet must reconcile early-research drift and one remaining downgrade uncertainty. |
| Multi-Agent | 10/15 | Iteration 028 assumes lead plus tests handoffs, with ranking and research convergence running in parallel. |
| Coordination | 12/15 | Gate B sequencing, maintenance timing, and sign-off all depend on precise handoffs and evidence packaging. |
| **Total** | **82/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Production migration follows the superseded `is_archived` add-column plan instead of the corrected scope. | High | Medium | Freeze the packet to `../resource-map.md` F-1/F-2 and require REQ-002 before implementation starts. |
| R-002 | Hard rollback is not rehearsed or does not return logical baseline equivalence. | High | Medium | Make the hard rollback pass a Gate B sign-off item and keep the candidate fork for forensics on failure. |
| R-003 | Archived weighting is too weak or too strong for early mixed-mode retrieval. | Medium | Medium | Validate staging queries after the `x0.3` change and keep the rollback path ready for quick retreat. |
| R-004 | `schema-downgrade.ts` behavior remains ambiguous after the gate closes. | Medium | Medium | Resolve or document the exclusion in Gate B, not later. |

---

## 11. USER STORIES

### US-001: Safe migration operator (Priority: P0)

**As a** runtime operator, **I want** the Gate B migration rehearsed on a copy with rollback evidence, **so that** I can execute the maintenance window without guessing whether recovery works.

**Acceptance Criteria**:
1. **Given** the Gate B rehearsal package, **When** I review it before production, **Then** I can see row-count, schema, search-equivalence, and rollback results in one JSON evidence artifact.
2. **Given** a failed production-like rehearsal, **When** I compare the candidate copy to baseline, **Then** the packet tells me to block promotion and keep the failed copy for forensics.
3. **Given** a rollback mismatch, **When** the hard rollback path fails logical baseline equivalence, **Then** Gate B stays in `NO_GO` state and the production window does not open.

---

### US-002: Retrieval maintainer (Priority: P1)

**As a** retrieval maintainer, **I want** archived rows demoted but still measurable, **so that** fresh spec docs become the default while long-tail legacy memory remains available when needed.

**Acceptance Criteria**:
1. **Given** a mixed search result set, **When** comparable fresh spec-doc and archived rows compete, **Then** fresh spec-doc rows rank higher because archived rows are multiplied by `0.3`.
2. ~~**Given** post-Gate-B telemetry, **When** I inspect the stats surface, **Then** I can see `archived_hit_rate`.~~ Removed per DELETE-not-archive directive.
3. **Given** a query that fresh spec docs do not cover yet, **When** archive fallback activates, **Then** archived results can still surface and remain measurable instead of disappearing silently.

---

## 12. OPEN QUESTIONS

- Does Gate B keep all migration SQL inline in `vector-index-schema.ts`, or does it also ship a standalone operator-facing `.sql` file under `mcp_server/database/migrations/`? ADR-001 resolves the default path for this gate.
- `[UNCERTAIN: iteration-035 proposes a wider tuple-column migration on causal_edges, but the Gate B prompt and critical-file list narrow the approved schema work to source_anchor and target_anchor plus indexes. Confirm whether the broader tuple fields are explicitly deferred to a later gate.]`
- `[UNCERTAIN: exact maintenance-window duration is not derived in the grounding; iteration-037 only provides the rule that rehearsal time should fit within half of the production freeze window.]`
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`

---

<!--
LEVEL 3 SPEC (~165 lines)
- Core + L2 + L3 addendums
- Executive Summary, Risk Matrix, User Stories
- Full Complexity Assessment
-->
