---
title: "...pec-kit/026-graph-and-context-optimization/011-resource-map-template/001-reverse-parent-research-review-folders/spec]"
description: "Roll back the parent-root deep-loop placement policy so child phases and sub-phases keep their own local research/ and review/ folders again. This packet also owns the repo-wide migration of already-misplaced child packets and the evidence trail for the rollback."
trigger_phrases:
  - "reverse parent research review folders"
  - "rollback child deep-loop packet placement"
  - "local owner artifact rollback"
  - "013/001 reverse parent folders"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-resource-map-template/001-reverse-parent-research-review-folders"
    last_updated_at: "2026-04-24T16:20:00+02:00"
    last_updated_by: "codex"
    recent_action: "Synced packet docs after residual owner-map cleanup"
    next_safe_action: "Phase 002 can proceed on the restored local-owner artifact contract"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/shared/review-research-paths.cjs"
      - ".opencode/skill/system-spec-kit/scripts/migrate-deep-loop-local-owner.cjs"
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-resource-map-template/001-reverse-parent-research-review-folders/implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:reverse-parent-research-review-folders"
      session_id: "reverse-parent-research-review-folders"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase 001 is the foundational rollback packet for 011-resource-map-template."
      - "Root specs keep root-local research/ and review/ folders."
      - "Child phases and sub-phases keep local-owner research/ and review/ packet folders."
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->"
---
# Feature Specification: Reverse Parent Research/Review Folder Placement

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Completed |
| **Created** | 2026-04-24 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Phase** | 001 of 002 |
| **Predecessor** | 006-integrity-parity-closure (historical origin) |
| **Successor** | 003-resource-map-deep-loop-integration |
<!-- /ANCHOR:metadata -->

### Phase Context

This packet reverses the parent-root artifact placement policy introduced during the `007-deep-review-remediation/006-integrity-parity-closure` follow-up work and reinforced by later canonical-placement commits. It restores the earlier ownership model: root specs keep root-local `research/` and `review/`, while child phases and sub-phases keep packet folders inside their own local `research/` and `review/` directories. It also owns the repo-wide migration of child packets that were already centralized under ancestor roots, including the later manual owner-map cleanup that emptied the remaining root `research/` and `review/` packet directories under `026-graph-and-context-optimization`.

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The centralized parent-root placement policy made child-phase deep-research and deep-review artifacts land under ancestor/root `research/` and `review/` folders. That broke local ownership, scattered child packet history away from the owning phase, and forced reducers, prompts, docs, and tests to reason through a parent coordination root instead of the actual target spec. The repo now also contains many already-misplaced child packets that need to be moved back to the owning phase folder without changing packet IDs.

### Purpose

Restore the local-owner artifact contract everywhere, migrate misplaced child packets repo-wide, document the origin of the reverted behavior, and rebase phase 002 so future deep-loop integrations emit beside the real packet artifacts instead of a parent/root folder.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Roll back `review-research-paths.cjs` to the local-owner path policy.
- Ensure deep-research and deep-review reducers write only to the resolver-provided `{artifact_dir}`.
- Update command YAMLs, docs, mirrors, references, and tests to match the restored contract.
- Document the historical origin of the centralized behavior with evidence centered on `007-deep-review-remediation/006-integrity-parity-closure` and follow-up commits.
- Create a phase-local rollback ledger `resource-map.md` for the historical resource map and implementation surfaces touched by the rollback.
- Discover and migrate every misplaced child packet under repo spec roots back into the owning phase or sub-phase local `research/` or `review/` folder.
- Preserve packet names and `-pt-NN` identities during migration.
- Rebase `003-resource-map-deep-loop-integration` onto the restored local-owner path contract.

### Out of Scope

- Changing deep-loop convergence math, severity weighting, or executor selection.
- Rewriting immutable historical logs beyond lightweight relocation notes where current navigation would otherwise break.
- Renaming packet directories or inventing new packet IDs during migration.
- Moving root-spec packets out of their existing root-local `research/` or `review/` folders.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/shared/review-research-paths.cjs` | Modify | Restore local-owner packet resolution for root, child, and sub-phase runs. |
| `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs` | Modify | Use resolver-provided `{artifact_dir}` only. |
| `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs` | Modify | Use resolver-provided `{artifact_dir}` only. |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_*.yaml` | Modify | Keep prompts, state, and synthesized outputs inside the same resolved local-owner packet. |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_*.yaml` | Modify | Keep prompts, state, and synthesized outputs inside the same resolved local-owner packet. |
| `.opencode/skill/sk-deep-research/**` | Modify | Update docs and references to the restored child-local packet policy. |
| `.opencode/skill/sk-deep-review/**` | Modify | Update docs, references, assets, and mirrors to the restored child-local packet policy. |
| `.opencode/skill/system-spec-kit/scripts/tests/**` | Modify/Create | Add path-resolution coverage and update parity expectations. |
| `.opencode/specs/**/research/**`, `.opencode/specs/**/review/**` | Move/Rewrite | Relocate misplaced child packets and update live canonical references. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-resource-map-template/003-resource-map-deep-loop-integration/*` | Modify | Rebase phase 002 onto the restored local-owner contract. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Root-spec research runs stay root-local. | `resolveArtifactRoot(rootSpec, 'research')` returns `{spec_folder}/research/` with no packet subfolder. |
| REQ-002 | Root-spec review runs stay root-local. | `resolveArtifactRoot(rootSpec, 'review')` returns `{spec_folder}/review/` with no packet subfolder. |
| REQ-003 | Child and sub-phase runs resolve to local-owner folders. | Child and nested specs resolve packet directories inside their own local `research/` or `review/` folder, never an ancestor/root folder. |
| REQ-004 | Reducers and command surfaces use only the resolved `{artifact_dir}`. | Prompts, state files, deltas, dashboards, iteration files, and synthesized outputs all land in the same resolved local-owner packet. |
| REQ-005 | Repo-wide migration moves every misplaced child packet to its owner without renaming it. | All discovered child-owned packets under ancestor/root `research/` or `review/` folders move into the owning phase or sub-phase local folder with the same packet directory name. |
| REQ-006 | Root-spec packets are not moved during migration. | Packets owned by the root spec remain in the root spec's `research/` or `review/` folder after migration. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Historical origin of the reverted behavior is documented. | Packet docs cite `006-integrity-parity-closure`, its closure docs, and the follow-up commits that normalized parent-root placement. |
| REQ-008 | Current docs, examples, and tests match the restored contract. | Deep-research docs, deep-review docs, folder-structure references, mirrors, and targeted tests all describe local-owner packet placement for child runs. |
| REQ-009 | Existing reruns reuse the same packet when possible. | Resolver tests prove an existing packet for the same target spec is reused instead of allocating a sibling. |
| REQ-010 | Phase 002 depends on this rollback. | `003-resource-map-deep-loop-integration` docs describe emission beside the resolved local-owner packet and name phase 001 as the prerequisite rollback. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Root-spec deep loops still write to root-local `research/` and `review/`.
- **SC-002**: Child-phase and sub-phase deep loops write only to local-owner packet folders.
- **SC-003**: Repo-wide misplaced child packets are migrated with no orphaned child packets left under ancestor/root packet roots.
- **SC-004**: Live docs, tests, and phase 002 packet docs all describe the same restored contract.
- **SC-005**: Phase 001 packet docs, rollback ledger, and implementation summary capture both the historical why and the applied migration result.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
### Acceptance Scenarios

**Given** a deep-research run targets the root spec, **when** `resolveArtifactRoot()` resolves the packet path, **then** artifacts land directly in the root spec's `research/` folder.

**Given** a deep-review run targets a child phase or nested sub-phase, **when** the reducer and command YAMLs write packet state, **then** all artifacts land inside that owner spec's local `review/{packet}/` folder rather than an ancestor root.

**Given** an existing child-owned packet already matches the target spec, **when** the workflow reruns, **then** the resolver reuses that packet instead of minting a sibling directory.

**Given** the repo still contains centralized child packets under ancestor `research/` or `review/` folders, **when** the migration script runs, **then** every child-owned packet moves into the owning phase folder without changing its packet name.

**Given** root-owned packets already live in the correct root-local folder, **when** the migration runs, **then** those root-owned packets remain in place and are never relocated.

**Given** phase 002 resumes after this rollback, **when** it emits `resource-map.md`, **then** it writes beside the resolved local-owner packet artifacts rather than a parent/root folder.

## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Moving existing packets breaks canonical navigation references. | High | Update live canonical docs/configs/tests and add lightweight relocation notes only where navigation would otherwise break. |
| Risk | Migration accidentally moves root-owned packets. | High | Derive ownership from `specFolder` stored in config/state before moving anything and verify root-owned packets remain in place. |
| Risk | Re-resolving packet paths allocates sibling packet directories during reruns. | Medium | Reuse existing packet directories for the same target spec and add resolver coverage for rerun reuse. |
| Dependency | Historical evidence in `006-integrity-parity-closure` and follow-up commits | High | Use closure docs and git history as the rollback evidence trail. |
| Dependency | Existing packet metadata inside `deep-research-config.json`, `deep-review-config.json`, and JSONL records | High | Use stored `specFolder` values to determine true packet ownership during migration. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Path resolution stays filesystem-local and does not add extra repo scans to normal loop execution.
- **NFR-P02**: Repo-wide migration completes as a bounded filesystem rewrite without changing packet contents beyond required path references and relocation notes.

### Security
- **NFR-S01**: Migration never shell-executes untrusted packet data and never rewrites outside the repo spec roots.

### Reliability
- **NFR-R01**: Resolver behavior is deterministic for root, child, nested, and rerun cases.
- **NFR-R02**: Migration is idempotent for already-correct packets and skips conflicting moves safely instead of overwriting data.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Root spec with no ancestor spec: return root-local `research/` or `review/` directly.
- Child phase with an existing packet for the same target: reuse that packet instead of allocating a sibling.
- Nested sub-phase under a child phase: resolve to the exact nested owner folder, not an intermediate ancestor.

### Error Scenarios
- Packet missing config but having a JSONL state log: derive ownership from the first parseable JSONL record.
- Conflicting destination during migration: skip the move, record the conflict, and preserve both paths for manual review.
- Historical packet references inside immutable logs: preserve content unless a lightweight relocation note is needed for navigation.

### State Transitions
- Restart/archive flows remain local to the owner spec's `research_archive/` or `review_archive/`.
- Re-running after migration should continue the same packet path if the target spec already owns a matching packet.
- Phase 002 execution remains blocked on phase 001 completion until the restored path contract is in place.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Shared resolver + reducers + YAML + docs/tests + repo-wide packet relocation. |
| Risk | 18/25 | Path-policy rollback plus historical artifact migration across many existing packets. |
| Research | 11/20 | Requires historical tracing through closure docs and commit history. |
| **Total** | **47/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. The rollback contract, ownership rules, and migration boundaries are fully specified by the packet brief and evidence trail.
<!-- /ANCHOR:questions -->
