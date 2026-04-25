---
title: "Feature Specification: Release Cleanup Playbooks [system-spec-kit/026-graph-and-context-optimization/000-release-cleanup-playbooks/spec]"
description: "Consolidated Phase 5 of 026: documentation parity revisits, runtime cleanup and audit, playbook repair and 22-finding deep-review remediation — merged into root-only packet docs with no child phases."
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->"
trigger_phrases:
  - "005-release-cleanup-playbooks"
  - "release cleanup playbooks"
  - "release alignment revisits"
  - "cleanup and audit"
  - "playbook and remediation"
  - "phase 018 continuity contract"
  - "shared memory removal"
  - "graph-metadata rollout"
  - "mcp config cleanup"
  - "dead code audit"
  - "deep review remediation"
  - "manual testing playbook rewrite"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup-playbooks"
    last_updated_at: "2026-04-24T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Merged three phase packets into root-only docs"
    next_safe_action: "Reference only; work complete"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:merge-phases-root-only-2026-04-24"
      session_id: "026-phase-005-merge-root-only-2026-04-24"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Release Cleanup Playbooks

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-04-18 |
| **Completed** | 2026-04-24 |
| **Branch** | `026-graph-and-context-optimization` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `../004-runtime-executor-hardening/spec.md` |
| **Successor** | `../008-skill-advisor/spec.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Phase 5 of the 026 optimization stream carried three heterogeneous workstreams that had each been scoped, executed, and verified in separate sub-packets: Phase 018 documentation parity sweeps, a four-part runtime cleanup and audit, and a three-wave playbook and deep-review remediation. The work was complete but the packet shape (`005/001/…`, `005/002/…`, `005/003/…`) turned the parent into a thin coordination shell that could not be read as one closeout. The per-phase duplication across spec, plan, tasks, checklist, and implementation-summary hid the cumulative scope (141 documentation targets reviewed, 515 spec-folder graph-metadata roots backfilled, five Public MCP configs aligned, 22 deep-review findings resolved) behind three parallel trees.

### Purpose

Collapse the three phase folders into one set of root-only packet docs that describes Phase 5 as a single completed release lane. Preserve all verification evidence, continuity statements, and limitation callouts so memory search, graph traversal, and human review each read the same story from the root documents.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Three-stream release work executed and now folded into one closeout:
  - **Documentation parity revisits** against the Phase 018 canonical continuity contract across 141 Phase 016 reference-map targets (SKILL/internal-doc, command, and README surfaces).
  - **Runtime cleanup and audit**: shared-memory feature hard-delete, `graph-metadata.json` tree-wide rollout with 515-root backfill, five-config Public MCP env-block alignment, and dead-code-plus-architecture audit.
  - **Playbook and remediation**: manual testing playbook prompt rewrite scaffold repair, live playbook runner coverage accounting, and three-wave resolution of 22 deep-review findings from the 50-iteration audit of 026 optimization phases.
- Flattening the packet so only root docs (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`) describe the outcome.

### Out of Scope

- Re-running any completed sub-phase. All code changes, backfill runs, validation passes, and deep-review iterations are historical.
- Re-opening decisions already captured (hard-delete vs deprecation for shared memory, deferred `shared_space_id` column drop, warning-first `graph-metadata.json` presence validation).
- The open sub-phase 001 prompt spot-check (`CHK-023` at phase level) and the sub-phase 002 Phase 014 `CONTINUITY_FRESHNESS` strict-validation miss, which are documented limitations rather than re-openable work.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Rewrite | This consolidated packet specification. |
| `plan.md` | Rewrite | Consolidated plan across the three release workstreams. |
| `tasks.md` | Rewrite | Merged task log with completed evidence per workstream. |
| `checklist.md` | Create | New root-level verification checklist consolidating prior phase checklists. |
| `implementation-summary.md` | Rewrite | Merged closeout with all verification results and limitations. |
| context-index file | Delete | No longer needed once phase folders are gone. |
| `001-release-alignment-revisits/` | Delete | Content absorbed into root docs. |
| `002-cleanup-and-audit/` | Delete | Content absorbed into root docs; review archive preserved under root `review/`. |
| `003-playbook-and-remediation/` | Delete | Content absorbed into root docs. |
| `description.json` | Modify | Drop child-folder aliases; keep consolidation migration note. |
| `graph-metadata.json` | Modify | Drop `children_ids`, legacy phase `aliases`, and `spec_phase` entities; status `complete`. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The packet exposes root-only canonical docs | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` exist only at the packet root; no `001-*/`, `002-*/`, or `003-*/` child folders remain. |
| REQ-002 | Documentation parity outcomes are preserved | Root docs record 141 targets reviewed and 71 targets updated across SKILL/internal-doc (63 / 32), command (44 / 28), and README (34 / 11) surfaces, with seven blocked `.agents/commands/` mirrors logged. |
| REQ-003 | Runtime cleanup outcomes are preserved | Root docs record: shared-memory handler and shared-spaces library deleted, governance/HYDRA/archival flags removed from active TS, `graph-metadata.json` backfill at 515/515 spec-folder roots, five Public MCP configs aligned to the minimal canonical env block, and dead-code plus architecture audit closed. |
| REQ-004 | Deep-review remediation outcomes are preserved | Root docs record all 22 findings (18 P1 + 4 P2) resolved across three waves, with `typecheck` both workspaces, `vitest run` (15 files, 363 tests), and grep-for-stale-patterns each returning green. |
| REQ-005 | `graph-metadata.json` reflects a childless, complete packet | `children_ids` is empty, legacy phase packet IDs are not in `aliases`, `derived.status` is `complete`, and no `spec_phase` entities remain. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Schema and validation exceptions are documented | Root `implementation-summary.md` records the `shared_space_id` schema-column exception, the warning-first `graph-metadata.json` presence rule, and the orphan-file scan human-triage note. |
| REQ-007 | Open spot-check is documented not lost | The sub-phase 001 manual prompt spot-check (`CHK-023`) is recorded in root `implementation-summary.md` as a documented deferral, not silently dropped. |
| REQ-008 | Review archive continuity is preserved | The `008-cleanup-and-audit-pt-01` deep-review archive from the deleted phase 002 folder is migrated into the root `review/` directory. |
<!-- /ANCHOR:requirements -->

---

### Acceptance Scenarios

**Given** a reader opens the packet root, **when** they list files, **then** they see only consolidated root docs plus `description.json`, `graph-metadata.json`, the legacy context-index file removed, `path-references-audit.md` preserved, and the support directories `research/` and `review/` unchanged.

**Given** `validate.sh --strict --no-recursive` runs at the packet root, **when** it finishes, **then** it exits with 0 errors.

**Given** a reader searches memory for `release alignment revisits`, `shared memory removal`, or `deep review remediation`, **when** the query resolves, **then** it points to this packet root, not deleted child folders.

**Given** a graph traversal from `026-graph-and-context-optimization`, **when** it reaches this packet, **then** it sees zero children and a `complete` status.

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Root-only doc set is present and internally consistent (cross-refs resolve).
- **SC-002**: All verification evidence from the three merged workstreams is preserved in `implementation-summary.md` without loss of counts or limitations.
- **SC-003**: `description.json` and `graph-metadata.json` describe a childless, complete packet.
- **SC-004**: `validate.sh --strict --no-recursive` passes at the packet root.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Consolidation loses per-phase nuance | Medium | Keep per-workstream sections in `implementation-summary.md` with their own verification tables and limitation callouts. |
| Risk | External references to deleted phase paths break | Low | `path-references-audit.md` records the historical path mesh; `graph-metadata.json` migration block keeps a human-readable breadcrumb. |
| Dependency | Parent 026 phase map | High | The parent root owns the nine-phase map; this packet must stay reachable under slot `005`. |
| Dependency | Root `research/` and `review/` support folders | Medium | Leave them untouched; migrate phase-level review archive into root `review/` before deleting phase folders. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. Phase 5 is closed. Two documented deferrals remain as historical context, not as re-openable scope:

- Manual playbook prompt spot-check (previously tracked as sub-phase 001 `CHK-023`) is deferred in `implementation-summary.md`. Packet documentation structure itself is valid.
- Phase 014 sub-phase previously failed strict validation on `CONTINUITY_FRESHNESS` only; the live playbook runner now discovers 300 active scenario files, parses 290, reports 10 parse failures, and aborts during fixture seeding.
<!-- /ANCHOR:questions -->
