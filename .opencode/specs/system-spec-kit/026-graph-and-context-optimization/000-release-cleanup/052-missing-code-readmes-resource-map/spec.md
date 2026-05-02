---
title: "Feature Specification: Missing Code READMEs Resource Map [template:level_2/spec.md]"
description: "Implement the exact 65-folder missing code README manifest with validated target README files."
trigger_phrases:
  - "missing code readmes resource map"
  - "code readme audit"
  - "mcp_server shared readme"
  - "resource map grouping"
  - "release cleanup phase 052"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/052-missing-code-readmes-resource-map"
    last_updated_at: "2026-05-02T16:15:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Created all 65 target README files from the corrected manifest"
    next_safe_action: "Run final manifest verification and strict phase validation"
    blockers: []
    key_files:
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/052-missing-code-readmes-resource-map/resource-map.md"
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Task #36 manifest contains 68 original targets normalized to 65 unique existing folders"
      - "All 65 folders are missing README.md; 0 target folders already have README.md"
      - "All original targets exist; 0 paths are missing"
      - "Three file targets map to .opencode/skill/system-spec-kit/mcp_server/lib/description"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Missing Code READMEs Resource Map

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Implemented, final validation pending |
| **Created** | 2026-05-02 |
| **Branch** | `scaffold/052-missing-code-readmes-resource-map` |
| **Parent Spec** | ../spec.md |
| **Phase** | 52 of 52 |
| **Predecessor** | 051-readme-code-template |
| **Successor** | None |
| **Handoff Criteria** | Exact 65-folder manifest is documented, all 65 target README files exist, per-file README validation passes, and strict validation exits 0 or 1. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 52** of the Missing code READMEs resource map specification.

**Scope Boundary**: Create only the 65 target `README.md` files listed in `resource-map.md`, plus phase documentation evidence. Do not create target folders or edit non-target runtime files.

**Dependencies**:
- Phase 051 README template guidance provides the baseline for concise code-folder README authoring.
- Task #36 provides the exact README target manifest: 68 original target entries, 65 unique existing folders, 0 existing `README.md` files among those folders, 0 missing paths, and 3 file-path mappings to `mcp_server/lib/description`.

**Deliverables**:
- Level 2 phase docs for the missing code README implementation.
- A phase-local `resource-map.md` grouping README/resource families, audit facts, and implementation evidence.
- 65 target code-folder `README.md` files created from the manifest.
- Verification checklist documenting target-only creation and validation.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The release-cleanup packet needed bounded code-folder README coverage. The prior Phase 052 docs incorrectly recorded only one missing README; Task #36 established the exact manifest as 65 unique existing folders, all missing `README.md` at audit time.

### Purpose
Create a validated Level 2 phase that preserves the exact 65-target manifest and adds concise READMEs only to confirmed target folders.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Record the exact Task #36 manifest: 65 unique existing folders, 0 existing READMEs at audit time, 0 missing paths, and 3 file-path mappings to `.opencode/skill/system-spec-kit/mcp_server/lib/description`.
- Record batches B01-B17 from Task #36 in `resource-map.md`.
- Create the 65 target code-folder `README.md` files.
- State that SMALL folders get concise READMEs without detailed diagrams or topology.
- Validate the created READMEs and phase docs.

### Out of Scope
- Creating README files outside the 65 target folders.
- Creating any missing folder or moving target paths.
- Editing non-target runtime files while creating README coverage.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/052-missing-code-readmes-resource-map/spec.md` | Modify | Correct scope, requirements, and audit facts to the 65-folder manifest. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/052-missing-code-readmes-resource-map/plan.md` | Modify | Align the documentation-only plan to the exact manifest. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/052-missing-code-readmes-resource-map/tasks.md` | Modify | Track manifest correction and validation tasks. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/052-missing-code-readmes-resource-map/checklist.md` | Modify | Verify manifest counts and boundary controls. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/052-missing-code-readmes-resource-map/resource-map.md` | Modify | Store the exact 65-folder manifest and B01-B17 batches. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/052-missing-code-readmes-resource-map/implementation-summary.md` | Modify | Record the corrected manifest outcome and next safe action. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/052-missing-code-readmes-resource-map/description.json` | Modify | Refresh metadata keywords and timestamp. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/052-missing-code-readmes-resource-map/graph-metadata.json` | Modify | Refresh derived topics and key files. |
| `65 target README.md files from resource-map.md` | Create | Add concise code-folder orientation READMEs for the exact manifest targets. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Create the next available child phase under the release-cleanup parent. | Folder `052-missing-code-readmes-resource-map/` exists under the parent. |
| REQ-002 | Preserve the target-only boundary. | Only README files listed in `resource-map.md` are created; target folders are not created or moved. |
| REQ-003 | Document the corrected manifest counts. | `spec.md` and `resource-map.md` state: 65 unique folders, 0 existing READMEs, 0 missing paths, and 3 file-path mappings to `mcp_server/lib/description`. |
| REQ-007 | Create target READMEs. | All 65 target folders have a `README.md` file after implementation. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Document B01-B17 batches. | `resource-map.md` records all Task #36 batches B01-B17. |
| REQ-005 | Preserve the exact 65-folder folder list. | `resource-map.md` lists all 65 unique target folders with missing README status. |
| REQ-006 | Record concise README rule. | Docs state that SMALL folders should get concise READMEs without detailed diagrams/topology. |
| REQ-008 | Validate README documents. | `validate_document.py` exits 0 for every created target README. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:nfr -->
## 4A. NON-FUNCTIONAL REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| NFR-001 | Documentation remains concise and auditable. | README/resource families are grouped in `resource-map.md` without duplicating long narrative. |
| NFR-002 | README creation does not mutate runtime topology. | No target folders are created or moved, and no non-target runtime files are edited. |
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 4B. EDGE CASES

| Case | Expected Handling |
|------|-------------------|
| Original target is a file path. | Normalize it to the containing folder and record the mapping. |
| Multiple file targets map to one folder. | Count the folder once in the 65 unique folder manifest. |
| Target folder is SMALL. | Future README should stay concise and omit detailed diagrams/topology. |
| Target folder unexpectedly gains a README before implementation starts. | Re-audit before writing and avoid overwriting existing content. |
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 4C. COMPLEXITY NOTES

Level 2 is sufficient because this phase coordinates a multi-folder documentation plan with verification, but it does not change code architecture or runtime behavior.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: New phase child exists under the release-cleanup parent.
- **SC-002**: Resource-map records the exact 65-folder manifest and B01-B17 batches.
- **SC-003**: All 65 target folders contain `README.md`.
- **SC-004**: README validation exits 0 for every target README.
- **SC-005**: Strict validation exits 0 or 1, not 2.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Prior one-README finding could persist in downstream work. | Under-scoped README implementation. | Replace it with exact 65-folder manifest language in all Phase 052 docs. |
| Risk | SMALL folders could receive overbuilt README diagrams. | Documentation bloat. | Apply concise README rule for SMALL folders. |
| Dependency | Per-file README validation. | Invalid README structure would block completion. | Run `validate_document.py` across the exact target list. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Target folders were re-read before direct README creation in the final implementation pass.
<!-- /ANCHOR:questions -->
