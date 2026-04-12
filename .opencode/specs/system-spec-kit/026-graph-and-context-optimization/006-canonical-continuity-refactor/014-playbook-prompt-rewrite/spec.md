---
title: "Feature Specification: Phase 014 — Manual Testing Playbook Prompt Rewrite [template:level_2/spec.md]"
description: "Document the completed prompt-field rewrite for the manual testing playbook and restore this phase packet to the active Level 2 scaffold."
trigger_phrases: ["playbook prompt rewrite", "manual testing prompt cleanup", "phase 014 spec repair"]
importance_tier: "important"
contextType: "implementation"
level: 2
status: "review"
parent: "006-canonical-continuity-refactor"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/014-playbook-prompt-rewrite"
    last_updated_at: "2026-04-12T00:00:00Z"
    last_updated_by: "speckit"
    recent_action: "Spec scaffold repaired"
    next_safe_action: "Validate packet"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Feature Specification: Phase 014 — Manual Testing Playbook Prompt Rewrite

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Review |
| **Created** | 2026-04-12 |
| **Branch** | `system-speckit/026-graph-and-context-optimization` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 014 already rewrote prompt fields across the manual testing playbook, but this spec packet drifted away from the active Level 2 template. The packet was missing required anchors, the `_memory` continuity block, `tasks.md`, `checklist.md`, and a valid reference to the playbook index.

### Purpose
Restore the Phase 014 packet so it truthfully documents the prompt rewrite work, references the real playbook index at `.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md`, and validates cleanly as a Level 2 packet.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Update this phase packet's markdown files to match the active Level 2 scaffold.
- Document the prompt rewrite scope already completed in the manual testing playbook scenario files.
- Replace broken packet references with the real playbook index path.

### Out of Scope
- Further edits to `.opencode/skill/system-spec-kit/manual_testing_playbook/**/*.md` during this repair.
- Feature catalog changes.
- Spec work outside `014-playbook-prompt-rewrite/`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/014-playbook-prompt-rewrite/spec.md` | Modify | Restore Level 2 structure and accurate task scope. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/014-playbook-prompt-rewrite/plan.md` | Modify | Restore Level 2 structure, dependencies, and rollback notes. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/014-playbook-prompt-rewrite/tasks.md` | Create | Add the required Level 2 task tracker. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/014-playbook-prompt-rewrite/checklist.md` | Create | Add the required Level 2 verification checklist. |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` | Reference | Use the real playbook index path wherever the phase packet needs to point to the corpus entry point. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `spec.md` must follow the active Level 2 scaffold. | Required anchors, Level 2 headers, `_memory` frontmatter, and section counts are present. |
| REQ-002 | `plan.md` must follow the active Level 2 scaffold. | Required anchors, Level 2 headers, `_memory` frontmatter, and section counts are present. |
| REQ-003 | The packet must include all required Level 2 markdown files. | `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` exist in the target phase folder. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Phase references must use the real playbook index path. | Packet references `.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` for playbook index context. |
| REQ-005 | The packet must describe the prompt rewrite truthfully without inventing extra implementation outcomes. | Scope, risks, tasks, and checklist language stay limited to the documented prompt rewrite and packet repair work. |

### Acceptance Scenarios
- **Given** a validator run against this phase folder, **when** the Level 2 packet is checked, **then** the required anchors and template headers are present in `spec.md` and `plan.md`.
- **Given** a reviewer opens the packet, **when** they look for task tracking and verification, **then** `tasks.md` and `checklist.md` exist in the same phase folder.
- **Given** a packet section references the manual testing playbook index, **when** the link target is checked, **then** it resolves to `.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md`.
- **Given** implementation work already rewrote prompt fields in the playbook corpus, **when** this packet describes the phase, **then** it documents that completed scope without claiming unrelated feature-catalog or code changes.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <phase-folder> --strict` returns no Level 2 structural errors for this packet.
- **SC-002**: Both major packet documents point to `.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` for playbook index context.
- **SC-003**: The packet contains enough requirements, acceptance scenarios, and verification detail to support review without reopening the playbook files.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` | Broken references would keep the packet failing integrity checks. | Use the exact repo-relative path everywhere the index is cited. |
| Dependency | `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` | Packet cannot be confirmed clean without the validator. | Re-run the strict validator after the markdown repair. |
| Risk | Overstating implementation verification | Could misrepresent what was actually checked during this repair. | Keep checklist language explicit about documentation-only validation versus broader prompt-quality review. |
| Risk | Accidental scope creep into playbook content | Would violate the user's constraint for this task. | Limit edits to markdown files inside the target spec folder only. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The repaired packet should remain concise enough for reviewers to scan quickly.
- **NFR-P02**: The validator should complete without structural failures caused by packet formatting drift.

### Security
- **NFR-S01**: The packet must not introduce secrets or external links.
- **NFR-S02**: File references must stay repo-local and read-only in intent for this repair.

### Reliability
- **NFR-R01**: The packet should remain usable even if deeper playbook quality review is deferred.
- **NFR-R02**: Required Level 2 files must be present so future updates do not start from an incomplete packet.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Scenario files without a `Prompt:` line are out of scope for this repair and should not be described as rewritten prompt targets.
- Packet references must distinguish between the playbook corpus and the local phase folder.
- The packet must stay accurate even though the playbook contains hundreds of markdown files and only prompt-bearing scenarios were rewritten.

### Error Scenarios
- If the validator flags additional template drift, fix the packet markdown before touching any implementation files.
- If a referenced path changes later, update both `spec.md` and `plan.md` together to avoid another integrity mismatch.
- If reviewers request proof of prompt quality beyond packet structure, capture that as follow-up verification rather than retroactive fact.

### State Transitions
- If the phase moves from review to complete, the packet can be updated without changing the documented implementation scope.
- If future work expands into feature-catalog maintenance, track that in a separate spec packet rather than Phase 014.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Four packet docs changed, but the underlying implementation spans a large documentation corpus. |
| Risk | 10/25 | Low runtime risk, moderate documentation integrity risk. |
| Research | 8/20 | Limited research needed because the implementation already landed and the repair is template-focused. |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None for this packet repair. Any future request to audit the quality of every rewritten prompt should be tracked as separate verification work.
<!-- /ANCHOR:questions -->

---
