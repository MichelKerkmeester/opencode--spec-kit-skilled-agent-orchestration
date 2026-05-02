---
title: "Feature Specification: README code template governance [template:level_2/spec.md]"
description: "Track README code template updates, diagram styling correction evidence, code-folder README batch evidence, and verification evidence for the release cleanup phase."
trigger_phrases:
  - "readme code template"
  - "readme template governance"
  - "sk-doc readme template"
  - "documentation template verification"
  - "diagram styling correction"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/051-readme-code-template"
    last_updated_at: "2026-05-02T12:40:00Z"
    last_updated_by: "general"
    recent_action: "Recorded explicit README sweep manifest and final remediation evidence"
    next_safe_action: "Use packet verification record"
    blockers: []
    key_files:
      - ".opencode/skill/sk-doc/assets/documentation/readme_template.md"
      - ".opencode/skill/sk-doc/assets/documentation/readme_code_template.md"
    session_dedup:
      fingerprint: "sha256:0510000000000000000000000000000000000000000000000000000000000001"
      session_id: "task-10-readme-code-template-diagram-evidence"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Task #9 diagram styling correction passed primary validation and has one documented non-blocking flowchart validator limitation."
      - "Code-folder README P1 batches and P2 batches 01-22 are recorded complete with an explicit target manifest."
      - "Final remediation evidence records shared README fixed, HVR blockers fixed, lowercase-v diagram blockers fixed, low-DQI files improved, and the remaining template scratch exception."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: README code template governance

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-02 |
| **Branch** | `scaffold/051-readme-code-template` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 051 of `000-release-cleanup` |
| **Predecessor** | `050-architecture-diagrams-and-topology` |
| **Successor** | None |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This phase records the README code template work under `system-spec-kit/026-graph-and-context-optimization/000-release-cleanup`.

**Scope Boundary**: Task #28 updates this phase packet only. It does not edit README files, code files, or parent phase docs except packet metadata if needed.

**Dependencies**:
- Parent phase packet: `../spec.md`
- Task #5 final template revision and verification evidence
- Task #9 diagram styling correction evidence
- Prior related child: `040-sk-doc-conformance-sweep-and-template-cleanup/`

**Deliverables**:
- Phase docs reflecting the completed README template work and diagram styling correction
- Phase docs reflecting completed code-folder README P1 batches and P2 batches 01-22
- Explicit README sweep target manifest for final review recovery
- Final remediation evidence for the shared README, HVR blockers, lowercase-v diagram blockers, low-DQI files, and the remaining template scratch exception
- Task and checklist evidence for the final template revisions
- Batch validation summaries, one aligned skip, and known exception notes
- Strict validation evidence for this phase child
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The README template work changed two `sk-doc` documentation templates and needed packet-local status, checklist, and verification evidence before release cleanup could treat the work as complete. The packet also needed the prior semicolon punctuation findings removed from evidence text. Task #9 corrected `readme_code_template.md` diagrams to use sk-doc Unicode box drawing style. Task #25 added code-folder README batch evidence. Task #28 adds the explicit README sweep target manifest and final remediation evidence so release cleanup can recover the exact reviewed paths, shared README fix status, HVR blocker fix status, lowercase-v diagram blocker fix status, low-DQI improvement status, and remaining template scratch exception.

### Purpose
Capture the completed README code template implementation state, diagram styling correction, code-folder README batch completion evidence, and verification evidence in the active Level 2 phase packet.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Record that `.opencode/skill/sk-doc/assets/documentation/readme_template.md` was expanded for skill/project README alignment based on sampled skill READMEs.
- Record that `.opencode/skill/sk-doc/assets/documentation/readme_code_template.md` was improved with architecture, topology, dependency, tree, key-file, and control-flow guidance.
- Capture Task #5 validation evidence and Task #6 punctuation cleanup.
- Capture Task #9 diagram styling correction evidence for `readme_code_template.md`.
- Record code-folder README P1 batches complete and P2 batches 01-22 complete.
- Record that `.opencode/skill/system-spec-kit/shared/README.md` was fixed in final remediation.
- Record the explicit README sweep target manifest for final review recovery.
- Record final remediation status for HVR blockers, lowercase-v diagram blockers, low-DQI files, and the remaining template scratch exception.
- Record batch validation summaries and known exception notes for final review.

### Out of Scope
- Editing `sk-doc` template files during Task #6.
- Editing README files or code files during Task #25.
- Modifying parent phase docs unless canonical metadata refresh requires it.
- Dispatching sub-agents or running nested Task tool workflows.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/051-readme-code-template/spec.md` | Modify | Replace scaffold scope with completed phase scope. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/051-readme-code-template/plan.md` | Modify | Record implemented approach and verification plan. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/051-readme-code-template/tasks.md` | Modify | Mark phase tasks complete with evidence. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/051-readme-code-template/checklist.md` | Modify | Mark verification checklist complete with evidence. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/051-readme-code-template/implementation-summary.md` | Modify | Summarize completed work and verification evidence. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/051-readme-code-template/description.json` | Modify if needed | Refresh packet metadata. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/051-readme-code-template/graph-metadata.json` | Modify if needed | Refresh packet graph status and key files. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Do not edit `sk-doc` templates in Task #10. | Only phase packet docs and metadata are modified. |
| REQ-002 | Capture Task #5 and Task #9 final verification evidence. | Validation, structure extraction, DQI, HVR punctuation, HVR banned-word, diagram styling, and flowchart-validator limitation results appear in packet docs. |
| REQ-005 | Capture code-folder README batch evidence. | P1 batches, P2 batches 01-22, explicit target manifest, batch validation summaries, and known exceptions appear in packet docs. |
| REQ-006 | Capture final blocker remediation evidence. | Shared README fixed, HVR blockers fixed, lowercase-v diagram blockers fixed, low-DQI files improved, and template scratch exception status appear in packet docs. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Synchronize phase docs with completed implementation state. | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` consistently show completed work. |
| REQ-004 | Run strict phase validation after updates. | `validate.sh --strict` exits 0 or 1, not 2. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The packet names both changed README template files and their final Task #5 revision scope.
- **SC-002**: The packet records `validate_document.py` exit 0 for both files with non-blocking `non_sequential_numbering` warnings from scaffold headings in code fences.
- **SC-003**: The packet records `extract_structure.py` exit 0 for both files with DQI 99 excellent.
- **SC-004**: The packet records that HVR punctuation and banned-word scans found no matches.
- **SC-005**: Strict phase validation runs and does not exit 2.
- **SC-006**: The packet records that `readme_code_template.md` diagrams now use sk-doc Unicode box drawing style and no longer use ASCII `+---`, `--->`, lowercase `v`, or bracket-list `->` diagram patterns.
- **SC-007**: The packet records that directory trees intentionally remain tree blocks and flowchart validator exit 1 is a non-blocking validator limitation.
- **SC-008**: The packet records P1 batches complete and P2 batches 01-22 complete.
- **SC-009**: The packet records `.opencode/skill/system-spec-kit/shared/README.md` as fixed in final remediation.
- **SC-010**: The packet records batch validation summaries plus known notes for `templates/scratch/README.md` and reported validator alternatives.
- **SC-011**: The packet includes an explicit README sweep target manifest with exact paths.
- **SC-012**: The packet records HVR blockers fixed, lowercase-v diagram blockers fixed, low-DQI files improved, and the remaining template scratch exception.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Task #5 evidence | Incorrect evidence would make release cleanup audit unreliable. | Record only the supplied Task #5 results. |
| Dependency | Task #9 evidence | Missing diagram correction evidence would make the final code template record incomplete. | Record only the supplied Task #9 results. |
| Dependency | Task #25 batch evidence | Missing batch evidence would make final code-folder README review incomplete. | Record supplied P1/P2 batch status, summaries, and exceptions. |
| Dependency | Task #28 final remediation evidence | Missing final remediation evidence would make final review unable to distinguish fixed blockers from remaining exceptions. | Record shared README, HVR, diagram, low-DQI, and scratch exception status explicitly. |
| Risk | Accidental template edits | Could change implementation scope during documentation-only task. | Limit edits to this phase packet. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

None.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Not applicable. This is documentation governance.

### Security
- **NFR-S01**: Verification records must confirm no HVR terms remain in the README template files.

### Reliability
- **NFR-R01**: Packet docs must be internally consistent so resume and audit workflows recover the same status.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty evidence: not allowed for Task #10 because Task #5 and Task #9 supplied concrete results.
- Scaffold warnings: accepted only as non-blocking `non_sequential_numbering` warnings from scaffold headings inside code fences.
- Flowchart validator exit 1: accepted only as a non-blocking centered-connector indentation limitation when box widths, arrows, and labels pass.

### Error Scenarios
- Strict validation exit 2: block completion and report validation errors.
- Parent doc drift: do not edit parent docs unless canonical save metadata requires it.

### State Transitions
- Partial completion: not used. This packet now represents completed Task #5 implementation, Task #6 documentation updates, Task #9 diagram styling correction, Task #10 documentation evidence update, and Task #25 code-folder README batch evidence update.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Five packet docs plus optional metadata updates. |
| Risk | 8/25 | Documentation-only, but release cleanup requires accurate evidence. |
| Research | 6/20 | Evidence provided by Task #5 and verified through packet validation. |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
