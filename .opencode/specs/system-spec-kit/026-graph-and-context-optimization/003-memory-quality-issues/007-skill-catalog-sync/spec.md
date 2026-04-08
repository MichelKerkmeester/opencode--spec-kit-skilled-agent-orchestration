---
title: "Feature Specification: Phase 7 — Skill Catalog Sync"
description: "Phase 7 defines the downstream audit and update pass that checks whether Phase 1-6 changes require parity updates across docs, commands, templates, MCP surfaces, and agent definitions."
trigger_phrases:
  - "phase 7 skill catalog sync"
  - "downstream artifact audit"
  - "phase 7 deep review"
  - "catalog sync phase"
importance_tier: important
contextType: "planning"
---
# Feature Specification: Phase 7 — Skill Catalog Sync

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + phase-child + level2-verify | v2.2 -->

---

Phase 7 is the downstream audit phase for `003-memory-quality-issues`. It starts only after Phase 6 freezes the final compact-wrapper memory contract. Its job is to determine whether Phases 1-6 changed any behavior, contract, or workflow enough that supporting docs, templates, commands, MCP surfaces, or agent definitions now need to be updated for parity.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P6 |
| **Status** | Draft |
| **Created** | 2026-04-08 |
| **Branch** | `026-graph-and-context-optimization/003-memory-quality-issues/007-skill-catalog-sync` |
| **Parent Spec** | `../spec.md` |
| **Parent Plan** | `../plan.md` |
| **Parent Tasks** | `../tasks.md` |
| **Parent Checklist** | `../checklist.md` |
| **Phase** | 7 of 8 |
| **Predecessor** | `006-memory-duplication-reduction` |
| **Successor** | `008-input-normalizer-fastpath-fix` |
| **Validation Target** | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/007-skill-catalog-sync --strict` |
| **Handoff Criteria** | Phase 6 implementation is merged and the final memory surface is stable enough for downstream parity review. |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Phases 1-6 may leave downstream surfaces out of sync even when the memory pipeline itself is correct. Feature catalogs, manual playbooks, skill docs, templates, commands, MCP surfaces, agents, and README/install guides can all drift when the runtime behavior changes first and the supporting docs or wrappers follow later. If that drift is not audited systematically, the repo ends with correct runtime behavior but misleading operator guidance.

This packet must review multiple downstream surfaces, not just one README. Some surfaces are end-user facing, others are operator facing, and others are internal execution surfaces that affect how future agents or maintainers work. That breadth is why Phase 7 uses ten targeted deep-review iterations in controlled waves before it applies any updates.

### Purpose

Run ten focused deep-review iterations across the named downstream surfaces, synthesize the true drift set, and then update only the artifacts that genuinely need parity changes after Phase 1-6.
<!-- /ANCHOR:problem -->

> **Memory save contract (cross-ref):** Memory saves in this packet follow the compact retrieval wrapper contract owned by `026-graph-and-context-optimization/003-memory-quality-issues/006-memory-duplication-reduction/`, the implementation host for the `001-research-graph-context-systems/006-research-memory-redundancy/` research findings. Canonical narrative ownership stays in the packet decision record and `implementation-summary.md`; memory files carry only canonical-doc pointers, distinguishing evidence, continuation state, and recovery metadata. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/006-research-memory-redundancy/research/research.md:103-120]

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Review the ten approved downstream surfaces after Phase 6 completes.
- Run ten deep-review iterations in three waves: 4, 4, and 2.
- Produce a parity synthesis that distinguishes required updates from confirmed-no-change surfaces.
- Implement the approved downstream updates across docs, templates, commands, MCP surfaces, and agent definitions that truly drifted after the compact-wrapper contract landed.
- Verify that the updated downstream surfaces describe the final Phase 1-6 behavior accurately.

### Out of Scope

- Reopening Phase 1-6 implementation decisions unless the review proves a real unresolved defect.
- Running the ten review iterations in this scaffold task. This phase packet only prepares the execution surface for later review work.
- Adding new product surfaces not named in the ten approved review dimensions unless the synthesis proves they are direct parity dependencies.
- Unrelated cleanup or modernization work that is not required for Phase 1-6 parity.

### Files to Change During Phase Execution

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/sk-doc/` and feature-catalog files | Modify | Update feature-catalog surfaces if Phase 1-6 changed the documented memory workflow. |
| Manual testing playbook resources | Modify | Update manual validation steps only if the runtime or operator workflow drifted. |
| `.opencode/skill/system-spec-kit/` skill entrypoint | Modify | Sync the skill guidance to the final Phase 1-6 behavior if needed. |
| `.opencode/skill/system-spec-kit/references/` | Modify | Sync reference docs that drifted after the final memory-state changes. |
| `.opencode/skill/system-spec-kit/assets/` | Modify | Update supporting assets only if Phase 1-6 made them inaccurate. |
| `.opencode/skill/system-spec-kit/templates/level_*` | Modify | Sync template guidance only if the final Phase 6 compact-wrapper contract changed the saved-memory shape. |
| `.opencode/command/memory/*.md` | Modify | Update memory commands if their docs drifted from the final behavior. |
| `.opencode/skill/system-spec-kit/mcp_server/` | Modify | Update MCP-facing guidance or implementation only if the review proves parity drift. |
| `.claude/agents/*.md`, `.opencode/agent/*.md` | Modify | Sync agent definitions for `@speckit`, `@deep-research`, `@deep-review`, or related roles if needed. |
| `README.md` and install/setup docs tied to `system-spec-kit` | Modify | Update end-user setup guidance where Phase 1-6 changed current reality. |

### Review Dimensions

1. `sk-doc` feature catalog surfaces.
2. Manual testing playbook resources.
3. The `system-spec-kit` skill entrypoint.
4. `system-spec-kit` `references/`.
5. `system-spec-kit` `assets/`.
6. `system-spec-kit` `templates/level_*`.
7. Memory commands under `.opencode/command/memory/*.md`.
8. Memory MCP server under `.opencode/skill/system-spec-kit/mcp_server/`.
9. Agent definitions under `.claude/agents/*.md` and `.opencode/agent/*.md`.
10. `system-spec-kit` README and install/setup docs.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-701 | Phase 7 must start only after Phase 6 finalizes the compact-wrapper memory surface. | The phase references a completed Phase 6 implementation summary before the review wave begins. |
| REQ-702 | The phase must execute ten deep-review iterations, one per approved downstream surface. | `research/iterations/` contains ten labeled outputs matching the approved review dimensions. |
| REQ-703 | The update set must be driven by the review synthesis rather than by assumption. | A synthesis artifact exists before any downstream edits are applied. |
| REQ-704 | The phase must distinguish "requires update" from "confirmed current" for every reviewed surface. | The synthesis records update/no-update status for all ten dimensions. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-705 | The ten iterations must run in controlled waves of 4, 4, and 2. | Iteration outputs and execution notes show the three-wave structure. |
| REQ-706 | Downstream edits must stay limited to surfaces that truly drifted after Phase 1-6. | The final change set maps cleanly to the synthesis-approved drift list. |
| REQ-707 | The final phase summary must leave a durable parity record for future operators. | The implementation summary states what changed, what was verified current, and what remains intentionally deferred. |

### Acceptance Scenarios

**Scenario A: Runtime save entrypoint naming is consistent**

- **Given** downstream inventory and reference docs mention the memory-save workflow,
- **When** Phase 7 closes,
- **Then** those docs name `scripts/dist/memory/generate-context.js` as the canonical runtime entrypoint,
- **And** TypeScript-source references are clearly marked as implementation detail rather than operator command guidance.

**Scenario B: Operator-facing save examples stay runnable and JSON-primary**

- **Given** commands or agent handover docs show how to save context,
- **When** operators follow those examples,
- **Then** the examples include the full JSON-mode workflow or explicitly point to `/memory:save`,
- **And** they do not imply that `generate-context.js` can be run with only a spec-folder path.

**Scenario C: Save fixtures mirror the live anchor contract**

- **Given** the live memory template now uses a compact-wrapper contract with canonical-doc pointers, comment-only anchors, and an `overview` anchor name,
- **When** MCP save regression fixtures are reviewed,
- **Then** those fixtures use the same comment-only contract,
- **And** obsolete `<a id>` scaffolding or `ANCHOR:summary` wrappers do not remain in the audited fixture surface.

**Scenario D: Phase 7 records both fixes and no-change surfaces**

- **Given** four audited surfaces were confirmed current and thirteen findings required severity-based classification,
- **When** the synthesis matrix is published,
- **Then** every downstream surface is marked as must-fix, should-fix, deferred, or confirmed current,
- **And** Phase 7 edits stay limited to the matrix-approved owner files.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-701**: Ten review outputs exist and cover all approved downstream surfaces.
- **SC-702**: The parity synthesis clearly separates required updates from confirmed-current surfaces.
- **SC-703**: Only genuinely drifted downstream artifacts are edited.
- **SC-704**: Phase 7 validates cleanly and leaves an auditable downstream parity record.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 6 completion | Downstream audit results are unreliable if the final memory surface is still moving | Gate Phase 7 on the completed Phase 6 implementation summary |
| Dependency | Ten-surface audit breadth | Important drift can be missed if a surface is skipped or collapsed into another | Keep the one-surface-per-iteration contract and track all ten explicitly |
| Risk | Reviewers update artifacts that are already correct | Unneeded churn makes future audits noisier | Require synthesis approval before editing downstream surfaces |
| Risk | Drift exists across multiple surfaces but is described inconsistently | Operators receive mixed guidance even after updates | Use one parity synthesis as the shared source of truth for the update set |
| Risk | README/install guidance overstates or understates the Phase 1-6 impact | Users may misconfigure or mistrust the system | Keep README/install edits tied to final runtime evidence and current reality wording |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Maintainability

- **NFR-M01**: Every downstream update must trace back to a specific review dimension and synthesis decision.
- **NFR-M02**: Confirmed-current surfaces must be recorded clearly so later operators do not reopen the same audit without cause.

### Reliability

- **NFR-R01**: Phase 7 must preserve existing surface ownership boundaries while syncing drift.
- **NFR-R02**: No-change findings are as important as changed findings and must be recorded with equal clarity.

### Performance

- **NFR-P01**: The audit should review only the named downstream surfaces first, then expand only if a direct dependency is discovered.
- **NFR-P02**: Wave sequencing should keep the audit organized without requiring all ten surfaces to be processed serially.

### Testability

- **NFR-T01**: Every changed downstream surface must have a verification note showing how parity was checked.
- **NFR-T02**: The implementation summary must state which surfaces were updated and which were verified current.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- A surface may appear stale but already describe the final behavior accurately through more general language; Phase 7 should record it as no-change rather than rewriting it needlessly.
- Multiple downstream surfaces may describe the same behavior with different audiences in mind; parity means aligned truth, not identical wording.
- The MCP server surface may require no code change but still need doc or readiness-output wording updates; implementation and docs must be reviewed separately.
- Agent definitions may share concepts but differ by runtime constraints; sync work should preserve runtime-specific guidance instead of flattening it.
- README/install docs may need wording changes even when deeper references stay correct; Phase 7 must treat top-level guidance as its own review dimension.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 19/25 | Ten downstream surfaces plus any required parity updates |
| Risk | 15/25 | Risk is mainly inaccurate or unnecessary sync edits |
| Research | 18/20 | Ten focused deep-review iterations define the change set |
| **Total** | **52/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Which downstream surfaces, if any, can be confidently marked no-change after the first review wave?
- Does any discovered drift require a follow-on packet instead of a Phase 7 parity update?
<!-- /ANCHOR:questions -->
